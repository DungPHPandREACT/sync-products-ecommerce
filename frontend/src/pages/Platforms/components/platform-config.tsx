import {
  AlertCircle,
  CheckCircle,
  Loader2,
  RefreshCw,
  Settings,
} from "lucide-react";
import { useState } from "react";
import {
  useTestConnection,
  useUpdatePlatform,
} from "../../../apis/platforms/platform.api";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Switch } from "../../../components/ui/switch";

interface PlatformConfigProps {
  platform: {
    id: number;
    name: string;
    display_name: string;
    status: string;
    api_config?: any;
  };
}

export function PlatformConfig({ platform }: PlatformConfigProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const { mutate: testConnection } = useTestConnection();
  const { mutate: updatePlatform } = useUpdatePlatform();

  const [config, setConfig] = useState({
    apiKey: platform.api_config?.apiKey || "",
    apiSecret: platform.api_config?.apiSecret || "",
    baseUrl: platform.api_config?.baseUrl || "",
    webhookUrl: platform.api_config?.webhookUrl || "",
    webhookSecret: platform.api_config?.webhookSecret || "",
    // Platform-specific configs
    partnerId: platform.api_config?.partnerId || "",
    shopId: platform.api_config?.shopId || "",
    username: platform.api_config?.username || "",
    password: platform.api_config?.password || "",
    enabled: platform.status === "active",
  });

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      testConnection(
        { id: platform.id },
        {
          onSuccess: (result) => {
            setTestResult(result);
            setIsTesting(false);
          },
          onError: (error) => {
            setTestResult({ success: false, message: error.message });
            setIsTesting(false);
          },
        }
      );
    } catch (error) {
      setTestResult({ success: false, message: "Test failed" });
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    updatePlatform({
      id: platform.id,
      data: {
        api_config: {
          apiKey: config.apiKey,
          apiSecret: config.apiSecret,
          baseUrl: config.baseUrl,
          webhookUrl: config.webhookUrl,
          webhookSecret: config.webhookSecret,
          ...(platform.name === "shopee" && {
            partnerId: config.partnerId,
            shopId: config.shopId,
          }),
          ...(platform.name === "wordpress" && {
            username: config.username,
            password: config.password,
          }),
        },
        status: config.enabled ? "active" : "inactive",
      },
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />;
      case "error":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Settings className="h-5 w-5" />
            <div>
              <CardTitle className="text-lg">{platform.display_name}</CardTitle>
              <CardDescription>
                Cấu hình API cho {platform.display_name}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(platform.status)}>
              <div className="flex items-center gap-1">
                {getStatusIcon(platform.status)}
                {platform.status}
              </div>
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Ẩn" : "Cấu hình"}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Cấu hình cơ bản */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Cấu hình cơ bản</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`apiKey-${platform.id}`}>API Key</Label>
                <Input
                  id={`apiKey-${platform.id}`}
                  type="password"
                  placeholder="Enter API key"
                  value={config.apiKey}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, apiKey: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`apiSecret-${platform.id}`}>API Secret</Label>
                <Input
                  id={`apiSecret-${platform.id}`}
                  type="password"
                  placeholder="Enter API secret"
                  value={config.apiSecret}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      apiSecret: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`baseUrl-${platform.id}`}>Base URL</Label>
              <Input
                id={`baseUrl-${platform.id}`}
                placeholder="https://api.nen-tang.com"
                value={config.baseUrl}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, baseUrl: e.target.value }))
                }
              />
            </div>
          </div>

          {/* Platform-specific Configuration */}
          {platform.name === "shopee" && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Cấu hình Shopee</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`partnerId-${platform.id}`}>Partner ID</Label>
                  <Input
                    id={`partnerId-${platform.id}`}
                    placeholder="Nhập Partner ID"
                    value={config.partnerId}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        partnerId: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`shopId-${platform.id}`}>Shop ID</Label>
                  <Input
                    id={`shopId-${platform.id}`}
                    placeholder="Nhập Shop ID"
                    value={config.shopId}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, shopId: e.target.value }))
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {platform.name === "wordpress" && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Cấu hình WordPress</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`username-${platform.id}`}>Username</Label>
                  <Input
                    id={`username-${platform.id}`}
                    placeholder="Nhập tên đăng nhập"
                    value={config.username}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`password-${platform.id}`}>Password</Label>
                  <Input
                    id={`password-${platform.id}`}
                    type="password"
                    placeholder="Nhập mật khẩu"
                    value={config.password}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* Cấu hình Webhook */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Cấu hình Webhook</h4>
            <div className="space-y-2">
              <Label htmlFor={`webhookUrl-${platform.id}`}>Webhook URL</Label>
              <Input
                id={`webhookUrl-${platform.id}`}
                placeholder="https://ten-mien-cua-ban.com/webhook"
                value={config.webhookUrl}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, webhookUrl: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`webhookSecret-${platform.id}`}>
                Webhook Secret
              </Label>
              <Input
                id={`webhookSecret-${platform.id}`}
                type="password"
                placeholder="Enter webhook secret"
                value={config.webhookSecret}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    webhookSecret: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          {/* Status and Actions */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id={`enabled-${platform.id}`}
                checked={config.enabled}
                onCheckedChange={(checked) =>
                  setConfig((prev) => ({ ...prev, enabled: checked }))
                }
              />
              <Label htmlFor={`enabled-${platform.id}`}>Bật nền tảng</Label>
            </div>

            {/* Test Result */}
            {testResult && (
              <div
                className={`p-3 rounded-md ${
                  testResult.success
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <div className="flex items-center space-x-2">
                  {testResult.success ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span
                    className={`text-sm ${
                      testResult.success ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    {testResult.message}
                  </span>
                </div>
              </div>
            )}

            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={handleTestConnection}
                disabled={isTesting}
              >
                {isTesting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Kiểm tra kết nối
              </Button>

              <Button onClick={handleSave}>Lưu cấu hình</Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
