import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function PlatformEmpty() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center max-w-md">
        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <Plus className="h-6 w-6 text-gray-700" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Chưa có nền tảng nào</h2>
        <p className="text-gray-500 mb-6">
          Bạn chưa cấu hình nền tảng nào. Hãy bắt đầu bằng cách thêm nền tảng
          mới để kết nối và đồng bộ dữ liệu.
        </p>
        <div className="flex items-center justify-center gap-2">
          <Button onClick={() => navigate("/platforms/create")}>
            <Plus className="mr-2 h-4 w-4" /> Tạo nền tảng
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              window.open("https://docs.example.com/platforms", "_blank")
            }
          >
            Tìm hiểu thêm
          </Button>
        </div>
      </div>
    </div>
  );
}
