import { IPlatform } from "@/apis/platforms/platform.type";
import ContainerApp from "@/components/comons/container-app";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetPlatforms } from "../../apis/platforms/platform.api";
import { Button } from "../../components/ui/button";
import { PlatformConfig } from "./components/platform-config";
import { PlatformEmpty } from "./components/platform-empty";

export function Platforms() {
  const navigate = useNavigate();
  const { data, isLoading } = useGetPlatforms();
  const platforms = useMemo(() => {
    if (data && Array.isArray(data)) {
      return data;
    }

    return [];
  }, [data]) as IPlatform[];

  if (isLoading) {
    return (
      <ContainerApp title="Nền tảng">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-500">Đang tải danh sách nền tảng...</p>
          </div>
        </div>
      </ContainerApp>
    );
  }

  return (
    <ContainerApp
      title="Nền tảng"
      description="Cấu hình và quản lý tích hợp các nền tảng"
      mainAction={
        <>
          <Button onClick={() => navigate("/platforms/create")}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm nền tảng
          </Button>
        </>
      }
    >
      {platforms && platforms.length === 0 ? (
        <div className="space-y-6">
          <PlatformEmpty />
          
          {/* Quick Connect Section */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Kết nối nhanh</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* TikTok Shop */}
              <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <p className="text-gray-500 mb-2">TikTok Shop</p>
                <Button variant="outline" disabled>
                  Sắp có
                </Button>
              </div>
              
              {/* Có thể thêm các platform khác ở đây */}
              <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <p className="text-gray-500 mb-2">Lazada</p>
                <Button variant="outline" disabled>
                  Sắp có
                </Button>
              </div>
              
              <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <p className="text-gray-500 mb-2">WooCommerce</p>
                <Button variant="outline" disabled>
                  Sắp có
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {platforms.map((platform) => (
            <PlatformConfig key={platform.id} platform={platform} />
          ))}
          
          {/* Add new platforms */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Thêm nền tảng mới</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <p className="text-gray-500 mb-2">TikTok Shop</p>
                <Button variant="outline" disabled>
                  Sắp có
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ContainerApp>
  );
}
