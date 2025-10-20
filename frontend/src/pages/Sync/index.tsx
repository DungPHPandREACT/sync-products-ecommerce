import ContainerApp from "@/components/comons/container-app";
import { AlertCircle, Check, Pause, Play, RefreshCw, X } from "lucide-react";
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useStartSync, useStopSync } from "../../apis/sync/sync.api";
import { Button } from "../../components/ui/button";
import { Loading } from "../../components/ui/loading";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
// child tabs handle their own data fetching

export function Sync() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentTab = location.pathname.endsWith("/conflict")
    ? "conflicts"
    : location.pathname.endsWith("/stats")
    ? "stats"
    : "jobs";
  const { mutate: startSync, isPending: isStarting } = useStartSync();
  const { mutate: stopSync, isPending: isStopping } = useStopSync();
  const [selectedConflict, setSelectedConflict] = useState<any>(null);

  const isLoading = false;

  const getStatusColor = (statusStr: string) => {
    switch (statusStr) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "running":
        return "bg-blue-100 text-blue-800";
      case "error":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (statusStr: string) => {
    switch (statusStr) {
      case "completed":
        return <Check className="h-4 w-4" />;
      case "running":
        return <RefreshCw className="h-4 w-4 animate-spin" />;
      case "error":
        return <X className="h-4 w-4" />;
      case "pending":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const handleStartSync = (
    syncType: "products" | "orders" | "inventory" | "all"
  ) => {
    startSync({ sync_type: syncType, sync_direction: "bidirectional" });
  };

  if (isLoading) {
    return <Loading message="Đang tải dữ liệu sync..." />;
  }

  return (
    <ContainerApp
      title="Quản lý đồng bộ"
      mainAction={
        <div className="flex gap-2">
          <Button onClick={() => handleStartSync("all")} disabled={isStarting}>
            <Play className="mr-2 h-4 w-4" />
            {isStarting ? "Đang bắt đầu..." : "Bắt đầu tất cả"}
          </Button>
          <Button
            variant="outline"
            onClick={() => stopSync()}
            disabled={isStopping}
          >
            <Pause className="mr-2 h-4 w-4" />
            {isStopping ? "Đang dừng..." : "Dừng tất cả"}
          </Button>
        </div>
      }
    >
      <Tabs
        value={currentTab}
        className="w-full"
        onValueChange={(v) => {
          if (v === "jobs") navigate("/sync/task");
          if (v === "conflicts") navigate("/sync/conflict");
          if (v === "stats") navigate("/sync/stats");
        }}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="jobs">Công việc</TabsTrigger>
          <TabsTrigger value="conflicts">Xung đột</TabsTrigger>
          <TabsTrigger value="stats">Thống kê</TabsTrigger>
        </TabsList>
      </Tabs>

      <Outlet />
    </ContainerApp>
  );
}
