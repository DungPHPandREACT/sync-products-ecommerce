import { useGetSyncConflicts } from "@/apis/sync/sync.api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { ConflictResolution } from "../components/conflict-resolution";

export default function SyncConflicts() {
  const { data: conflicts = [] } = useGetSyncConflicts();

  return (
    <div className="space-y-6 mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Xử lý xung đột</CardTitle>
          <CardDescription>
            Giải quyết xung đột dữ liệu giữa nền tảng và hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          {conflicts.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">
                Không có xung đột
              </h3>
              <p className="text-gray-500">
                Tất cả dữ liệu đã đồng bộ thành công.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {conflicts.map((conflict: any) => (
                <ConflictResolution key={conflict.id} conflict={conflict} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
