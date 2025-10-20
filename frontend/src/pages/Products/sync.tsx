import {
  useGetSyncLogs,
  useStartSync,
  useStopSync,
} from "@/apis/sync/sync.api";
import ContainerApp from "@/components/comons/container-app";
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
import { Pause, Play, RefreshCw } from "lucide-react";

export default function SyncProductsPage() {
  const { data: logs = [] } = useGetSyncLogs();
  const { mutate: startSync, isPending: isStarting } = useStartSync();
  const { mutate: stopSync, isPending: isStopping } = useStopSync();

  const handleStart = () =>
    startSync({ sync_type: "products", sync_direction: "bidirectional" });
  const handleStop = () => stopSync();

  const getStatusColor = (s?: string) => {
    switch (s) {
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

  return (
    <ContainerApp
      title="Đồng bộ sản phẩm"
      description="Quản lý đồng bộ sản phẩm: kéo từ nền tảng, đẩy lên nền tảng và đồng bộ theo lịch"
      mainAction={
        <div className="flex gap-2">
          <Button onClick={handleStart} disabled={isStarting}>
            <Play className="mr-2 h-4 w-4" />{" "}
            {isStarting ? "Đang bắt đầu..." : "Bắt đầu đồng bộ sản phẩm"}
          </Button>
          <Button variant="outline" onClick={handleStop} disabled={isStopping}>
            <Pause className="mr-2 h-4 w-4" />{" "}
            {isStopping ? "Đang dừng..." : "Dừng đồng bộ"}
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Công việc</CardTitle>
              <CardDescription>
                Theo dõi trạng thái đồng bộ sản phẩm
              </CardDescription>
            </CardHeader>
            <CardContent>
              {logs.filter((l: any) => l.sync_type === "products").length ===
              0 ? (
                <div className="text-center py-10 text-gray-500">
                  Chưa có công việc đồng bộ sản phẩm
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nền tảng</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Tiến độ</TableHead>
                      <TableHead>Chạy lần cuối</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs
                      .filter((l: any) => l.sync_type === "products")
                      .map((log: any) => (
                        <TableRow key={log.id}>
                          <TableCell>
                            <Badge variant="secondary">
                              {log.platform?.display_name || "Unknown"}
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
                            {log.started_at
                              ? new Date(log.started_at).toLocaleString()
                              : "-"}
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
              <CardDescription>
                Bắt đầu đồng bộ sản phẩm theo yêu cầu
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() =>
                  startSync({
                    sync_type: "products",
                    sync_direction: "inbound",
                  })
                }
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Kéo sản phẩm từ nền tảng
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() =>
                  startSync({
                    sync_type: "products",
                    sync_direction: "outbound",
                  })
                }
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Đẩy sản phẩm lên nền tảng
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ContainerApp>
  );
}
