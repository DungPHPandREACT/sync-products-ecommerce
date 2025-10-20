import { NavMain } from "@/components/comons/nav-main";
import { NavUser } from "@/components/comons/nav-user";
import { TeamSwitcher } from "@/components/comons/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Home,
  Package,
  RefreshCw,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react";
import * as React from "react";

// Sync Products System data
const data = {
  user: {
    name: "Admin",
    email: "admin@syncproducts.com",
    avatar: "/avatars/admin.jpg",
  },
  teams: [
    {
      name: "Sync Products",
      logo: Package,
      plan: "Enterprise",
    },
  ],
  navDashboard: [
    {
      title: "Tổng quan",
      url: "/",
      icon: Home,
    },
  ],
  navMain: [
    {
      title: "Sản phẩm",
      url: "/products",
      icon: Package,
      items: [
        {
          title: "Danh sách sản phẩm",
          url: "/products",
        },
        {
          title: "Tạo sản phẩm",
          url: "/products/create",
        },
        {
          title: "Đồng bộ sản phẩm",
          url: "/products/sync",
        },
      ],
    },
    {
      title: "Đơn hàng",
      url: "/orders",
      icon: ShoppingCart,
      items: [
        {
          title: "Danh sách đơn hàng",
          url: "/orders",
        },
        {
          title: "Đồng bộ đơn hàng",
          url: "/orders/sync",
        },
      ],
    },
    {
      title: "Nền tảng",
      url: "/platforms",
      icon: Users,
      items: [
        {
          title: "Danh sách nền tảng",
          url: "/platforms",
        },
        {
          title: "Thêm nền tảng",
          url: "/platforms/create",
        },
      ],
    },
    {
      title: "Quản lý đồng bộ",
      url: "/sync",
      icon: RefreshCw,
      items: [
        {
          title: "Công việc đồng bộ",
          url: "/sync/task",
        },
        {
          title: "Xung đột",
          url: "/sync/conflict",
        },
        {
          title: "Thống kê",
          url: "/sync/stats",
        },
      ],
    },
    {
      title: "Cài đặt",
      url: "/settings",
      icon: Settings,
      items: [
        {
          title: "Tổng quan",
          url: "/settings",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} dashboard={data.navDashboard} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
