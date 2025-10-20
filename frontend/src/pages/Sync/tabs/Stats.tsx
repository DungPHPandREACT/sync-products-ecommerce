import { useGetSyncStats } from "@/apis/sync/sync.api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SyncStats() {
  const { data: stats } = useGetSyncStats();

  return (
    <div className="space-y-6 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tổng số công việc</CardTitle>
            <CardDescription>Tổng cộng</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_jobs ?? 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Đang chạy</CardTitle>
            <CardDescription>Hiện hoạt</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats?.pending_jobs ?? 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thành công</CardTitle>
            <CardDescription>Hoàn thành</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats?.successful_jobs ?? 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thất bại</CardTitle>
            <CardDescription>Không hoàn thành</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats?.failed_jobs ?? 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thống kê xung đột</CardTitle>
          <CardDescription>Tổng quan xung đột dữ liệu</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Tổng xung đột</span>
            <span className="font-semibold">{stats?.total_conflicts ?? 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Đã xử lý</span>
            <span className="font-semibold text-green-600">
              {stats?.resolved_conflicts ?? 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Đang chờ</span>
            <span className="font-semibold text-yellow-600">
              {stats?.pending_conflicts ?? 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Lần đồng bộ gần nhất</span>
            <span className="font-semibold">
              {stats?.lastRunAt
                ? new Date(stats.lastRunAt).toLocaleString()
                : "-"}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
