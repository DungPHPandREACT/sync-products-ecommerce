import { useGetSyncLogs, useStartSync } from "@/apis/sync/sync.api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RefreshCw } from "lucide-react";

export default function SyncTasks() {
  const { data: logs = [] } = useGetSyncLogs();
  const { mutate: startSync, isPending: isStarting } = useStartSync();

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

  const handleStartSync = (
    syncType: "products" | "orders" | "inventory" | "all"
  ) => {
    startSync({ sync_type: syncType, sync_direction: "bidirectional" });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Công việc đồng bộ</CardTitle>
            <CardDescription>
              Theo dõi và quản lý các job đồng bộ
            </CardDescription>
          </CardHeader>
          <CardContent>
            {logs.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                Chưa có công việc đồng bộ
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên công việc</TableHead>
                    <TableHead>Nền tảng</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Tiến độ</TableHead>
                    <TableHead>Chạy lần cuối</TableHead>
                    <TableHead>Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log: any) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">
                        {log.sync_type}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {log.platform?.display_name || "Không rõ"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(log.status)}>
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Progress
                            value={
                              log.records_processed > 0
                                ? (log.records_success /
                                    log.records_processed) *
                                  100
                                : 0
                            }
                            className="h-2"
                          />
                          <span className="text-xs text-gray-500">
                            {log.records_success || 0} /{" "}
                            {log.records_processed || 0}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(log.started_at).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStartSync(log.sync_type as any)}
                          disabled={isStarting}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Thao tác nhanh</CardTitle>
            <CardDescription>Bắt đầu các tác vụ đồng bộ cụ thể</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleStartSync("products")}
              disabled={isStarting}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Đồng bộ tất cả sản phẩm
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleStartSync("orders")}
              disabled={isStarting}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Đồng bộ tất cả đơn hàng
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleStartSync("inventory")}
              disabled={isStarting}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Cập nhật tồn kho
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
