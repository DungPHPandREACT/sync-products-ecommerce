import ContainerApp from "@/components/comons/container-app";
import { ChartAreaInteractive } from "./components/chart-area-interactive";
import { DataTable } from "./components/data-table";
import { SectionCards } from "./components/section-cards";

export default function Dashboard() {
  return (
    <ContainerApp
      title="Tổng quan"
      description="Tổng quan hệ thống đồng bộ sản phẩm và đơn hàng"
    >
      <SectionCards />
      <ChartAreaInteractive />
      <DataTable />
    </ContainerApp>
  );
}
