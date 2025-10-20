import { Activity, Package, ShoppingCart, Users } from "lucide-react";
import { useGetOrders } from "../../../apis/orders/order.api";
import { useGetPlatforms } from "../../../apis/platforms/platform.api";
import { useGetProducts } from "../../../apis/products/product.api";
import { useGetSyncStats } from "../../../apis/sync/sync.api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

export function SectionCards() {
  const { data: products = [] } = useGetProducts();
  const { data: orders = [] } = useGetOrders();
  const { data: platforms = [] } = useGetPlatforms();
  const { data: syncStats } = useGetSyncStats();

  const activeProducts = products.filter(
    (p: any) => p.status === "active"
  ).length;
  const totalRevenue = orders.reduce(
    (sum: number, order: any) => sum + (order.total_amount || 0),
    0
  );
  const activePlatforms = platforms.filter(
    (p: any) => p.status === "active"
  ).length;
  const runningSyncs = syncStats?.pending_jobs || 0;

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tổng số sản phẩm</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{products.length}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-600 font-medium">{activeProducts}</span> đang bán
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ₫{totalRevenue.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">Từ {orders.length} đơn hàng</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Nền tảng đang kết nối</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activePlatforms}</div>
          <p className="text-xs text-muted-foreground">Đang kết nối</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Trạng thái đồng bộ</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{runningSyncs}</div>
          <p className="text-xs text-muted-foreground">
            {runningSyncs > 0 ? "Đang chạy job đồng bộ" : "Không có đồng bộ đang chạy"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
