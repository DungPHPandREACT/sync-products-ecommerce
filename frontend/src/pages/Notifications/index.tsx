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
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, CheckCircle2, TriangleAlert } from "lucide-react";
import { useMemo, useState } from "react";

type NotificationType = "conflict" | "job" | "webhook" | "system";

type NotificationItem = {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
};

export default function NotificationsPage() {
  // TODO: thay bằng fetch từ API (React Query) khi backend sẵn sàng
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 1,
      type: "conflict",
      title: "Phát hiện xung đột giá",
      message: "Sản phẩm SKU ABC có chênh lệch giá giữa hệ thống và Shopee",
      createdAt: new Date().toISOString(),
      read: false,
    },
    {
      id: 2,
      type: "job",
      title: "Job đồng bộ đơn hàng hoàn tất",
      message: "Đã xử lý 124/124 đơn hàng thành công",
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      read: true,
    },
    {
      id: 3,
      type: "webhook",
      title: "Webhook đơn hàng mới",
      message: "Nhận đơn hàng #TT12345 từ TikTok Shop",
      createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      read: false,
    },
  ]);

  const [prefs, setPrefs] = useState({
    conflicts: true,
    jobs: true,
    webhooks: true,
  });
  const [tab, setTab] = useState<"all" | "unread">("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      if (tab === "unread" && n.read) return false;
      if (!prefs.conflicts && n.type === "conflict") return false;
      if (!prefs.jobs && n.type === "job") return false;
      if (!prefs.webhooks && n.type === "webhook") return false;
      const q = search.toLowerCase();
      return (
        n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q)
      );
    });
  }, [notifications, tab, prefs, search]);

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast("Đã đánh dấu tất cả là đã đọc");
  };

  const clearAll = () => {
    setNotifications([]);
    toast("Đã xóa tất cả thông báo");
  };

  const typeBadge = (type: NotificationType) => {
    switch (type) {
      case "conflict":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Xung đột</Badge>
        );
      case "job":
        return <Badge className="bg-blue-100 text-blue-800">Công việc</Badge>;
      case "webhook":
        return <Badge className="bg-purple-100 text-purple-800">Webhook</Badge>;
      default:
        return <Badge>Hệ thống</Badge>;
    }
  };

  return (
    <ContainerApp
      title="Thông báo"
      description="Xem và quản lý thông báo hệ thống"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách thông báo</CardTitle>
              <CardDescription>Bộ lọc và tìm kiếm</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 items-center">
                <Input
                  placeholder="Tìm theo tiêu đề/nội dung..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" onClick={markAllAsRead}>
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Đánh dấu đã đọc
                </Button>
                <Button variant="outline" onClick={clearAll}>
                  Xóa tất cả
                </Button>
              </div>

              <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
                <TabsList>
                  <TabsTrigger value="all">Tất cả</TabsTrigger>
                  <TabsTrigger value="unread">Chưa đọc</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="space-y-2">
                  {filtered.length === 0 ? (
                    <div className="flex items-center justify-center py-8 text-gray-500">
                      <Bell className="h-5 w-5 mr-2" /> Không có thông báo
                    </div>
                  ) : (
                    <ul className="divide-y rounded-md border">
                      {filtered.map((n) => (
                        <li
                          key={n.id}
                          className={`p-3 sm:p-4 ${
                            n.read ? "bg-white" : "bg-indigo-50"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                {typeBadge(n.type)}
                                <span className="font-medium">{n.title}</span>
                                {!n.read && (
                                  <span className="text-xs text-indigo-700 flex items-center gap-1">
                                    <TriangleAlert className="h-3 w-3" /> Mới
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">
                                {n.message}
                              </p>
                              <div className="text-xs text-gray-400">
                                {new Date(n.createdAt).toLocaleString()}
                              </div>
                            </div>
                            {!n.read && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => markAsRead(n.id)}
                              >
                                Đã đọc
                              </Button>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </TabsContent>
                <TabsContent value="unread" className="space-y-2">
                  {/* dùng chung filtered với tab=unread */}
                  {filtered.length === 0 ? (
                    <div className="flex items-center justify-center py-8 text-gray-500">
                      <Bell className="h-5 w-5 mr-2" /> Không có thông báo chưa
                      đọc
                    </div>
                  ) : null}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tùy chọn thông báo</CardTitle>
              <CardDescription>Bật/tắt các nhóm thông báo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Xung đột đồng bộ</span>
                <Switch
                  checked={prefs.conflicts}
                  onCheckedChange={(v) =>
                    setPrefs((p) => ({ ...p, conflicts: v }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span>Trạng thái công việc</span>
                <Switch
                  checked={prefs.jobs}
                  onCheckedChange={(v) => setPrefs((p) => ({ ...p, jobs: v }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <span>Sự kiện webhook</span>
                <Switch
                  checked={prefs.webhooks}
                  onCheckedChange={(v) =>
                    setPrefs((p) => ({ ...p, webhooks: v }))
                  }
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() =>
                    toast.success("Lưu cài đặt thông báo thành công")
                  }
                >
                  Lưu
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    setPrefs({ conflicts: true, jobs: true, webhooks: true })
                  }
                >
                  Đặt lại
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ContainerApp>
  );
}
