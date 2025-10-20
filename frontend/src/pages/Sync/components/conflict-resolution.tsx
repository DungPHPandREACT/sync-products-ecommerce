import { AlertCircle, CheckCircle, Clock, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useResolveConflict } from "../../../apis/sync/sync.api";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

interface ConflictResolutionProps {
  conflict: {
    id: number;
    product_mapping_id: number;
    conflict_type: string;
    local_value: any;
    platform_value: any;
    resolution: string;
    created_at: string;
    product_mapping?: {
      product: {
        name: string;
        sku: string;
      };
      platform: {
        display_name: string;
      };
    };
  };
}

export function ConflictResolution({ conflict }: ConflictResolutionProps) {
  const [selectedResolution, setSelectedResolution] = useState<string>("");
  const [isResolving, setIsResolving] = useState(false);

  const { mutate: resolveConflict } = useResolveConflict();

  const handleResolve = async (resolution: string) => {
    setIsResolving(true);
    try {
      resolveConflict({
        id: conflict.id,
        payload: {
          resolution,
          resolvedBy: 1, // TODO: Get from auth context
        },
      });
    } catch (error) {
      console.error("Failed to resolve conflict:", error);
    } finally {
      setIsResolving(false);
    }
  };

  const getConflictTypeColor = (type: string) => {
    switch (type) {
      case "price":
        return "bg-yellow-100 text-yellow-800";
      case "inventory":
        return "bg-blue-100 text-blue-800";
      case "status":
        return "bg-purple-100 text-purple-800";
      case "description":
        return "bg-green-100 text-green-800";
      case "name":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getResolutionColor = (resolution: string) => {
    switch (resolution) {
      case "resolved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getResolutionIcon = (resolution: string) => {
    switch (resolution) {
      case "resolved":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatValue = (value: any, type: string) => {
    if (typeof value === "object") {
      return JSON.stringify(value, null, 2);
    }
    return value?.toString() || "N/A";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">
              {conflict.product_mapping?.product?.name || "Unknown Product"}
            </CardTitle>
            <CardDescription>
              SKU: {conflict.product_mapping?.product?.sku || "N/A"} • Platform:{" "}
              {conflict.product_mapping?.platform?.display_name || "Unknown"}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getConflictTypeColor(conflict.conflict_type)}>
              {conflict.conflict_type}
            </Badge>
            <Badge className={getResolutionColor(conflict.resolution)}>
              <div className="flex items-center gap-1">
                {getResolutionIcon(conflict.resolution)}
                {conflict.resolution}
              </div>
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Conflict Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Local Value</h4>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <pre className="text-sm text-blue-800 whitespace-pre-wrap">
                {formatValue(conflict.local_value, conflict.conflict_type)}
              </pre>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">
              Platform Value
            </h4>
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <pre className="text-sm text-green-800 whitespace-pre-wrap">
                {formatValue(conflict.platform_value, conflict.conflict_type)}
              </pre>
            </div>
          </div>
        </div>

        {/* Resolution Options */}
        {conflict.resolution === "pending" && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Resolution Options</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button
                variant={selectedResolution === "local" ? "default" : "outline"}
                onClick={() => setSelectedResolution("local")}
                className="justify-start"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Use Local Value
              </Button>

              <Button
                variant={
                  selectedResolution === "platform" ? "default" : "outline"
                }
                onClick={() => setSelectedResolution("platform")}
                className="justify-start"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Use Platform Value
              </Button>

              <Button
                variant={
                  selectedResolution === "manual" ? "default" : "outline"
                }
                onClick={() => setSelectedResolution("manual")}
                className="justify-start"
              >
                <AlertCircle className="mr-2 h-4 w-4" />
                Manual Review
              </Button>
            </div>

            {selectedResolution && (
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleResolve(selectedResolution)}
                  disabled={isResolving}
                >
                  {isResolving ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="mr-2 h-4 w-4" />
                  )}
                  Resolve Conflict
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setSelectedResolution("")}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Conflict Info */}
        <div className="text-xs text-gray-500">
          Created: {new Date(conflict.created_at).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}
