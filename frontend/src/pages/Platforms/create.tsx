import { useCreatePlatform } from "@/apis/platforms/platform.api";
import ContainerApp from "@/components/comons/container-app";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PlatformCreatePage() {
  const navigate = useNavigate();
  const { mutate: createPlatform, isPending } = useCreatePlatform();

  const [form, setForm] = useState({
    name: "",
    display_name: "",
    status: "inactive",
    api_config: {
      apiKey: "",
      apiSecret: "",
      baseUrl: "",
      webhookUrl: "",
      webhookSecret: "",
      partnerId: "",
      shopId: "",
      username: "",
      password: "",
    },
  });

  const handleCreate = () => {
    if (!form.name || !form.display_name) return;

    const apiConfig: any = {
      apiKey: form.api_config.apiKey,
      apiSecret: form.api_config.apiSecret,
      baseUrl: form.api_config.baseUrl,
      webhookUrl: form.api_config.webhookUrl,
      webhookSecret: form.api_config.webhookSecret,
    };

    if (form.name === "shopee") {
      apiConfig.partnerId = form.api_config.partnerId;
      apiConfig.shopId = form.api_config.shopId;
    }
    if (form.name === "wordpress") {
      apiConfig.username = form.api_config.username;
      apiConfig.password = form.api_config.password;
    }

    createPlatform(
      {
        name: form.name,
        display_name: form.display_name,
        status: form.status,
        api_config: apiConfig,
        webhook_url: form.api_config.webhookUrl,
      },
      {
        onSuccess: () => navigate("/platforms"),
      }
    );
  };

  return (
    <ContainerApp
      title="Thêm nền tảng"
      description="Tạo tích hợp nền tảng mới"
      mainAction={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Hủy
          </Button>
          <Button onClick={handleCreate} disabled={isPending}>
            {isPending ? "Đang tạo..." : "Tạo"}
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
            <CardDescription>Xác định nền tảng và trạng thái</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên (system id)</Label>
                <Input
                  id="name"
                  placeholder="tiktok | shopee | lazada | wordpress"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="display_name">Tên hiển thị</Label>
                <Input
                  id="display_name"
                  placeholder="TikTok | Shopee | Lazada | WordPress"
                  value={form.display_name}
                  onChange={(e) =>
                    setForm({ ...form, display_name: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="inactive"
                  name="status"
                  value="inactive"
                  checked={form.status === "inactive"}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                />
                <Label htmlFor="inactive">Tạm tắt</Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="active"
                  name="status"
                  value="active"
                  checked={form.status === "active"}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                />
                <Label htmlFor="active">Đang bật</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cấu hình API</CardTitle>
            <CardDescription>Nhập thông tin xác thực API</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Enter API key"
                  value={form.api_config.apiKey}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      api_config: {
                        ...form.api_config,
                        apiKey: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apiSecret">API Secret</Label>
                <Input
                  id="apiSecret"
                  type="password"
                  placeholder="Enter API secret"
                  value={form.api_config.apiSecret}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      api_config: {
                        ...form.api_config,
                        apiSecret: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="baseUrl">Base URL</Label>
              <Input
                id="baseUrl"
                placeholder="https://api.nen-tang.com"
                value={form.api_config.baseUrl}
                onChange={(e) =>
                  setForm({
                    ...form,
                    api_config: { ...form.api_config, baseUrl: e.target.value },
                  })
                }
              />
            </div>
          </CardContent>
        </Card>

        {form.name === "shopee" && (
          <Card>
            <CardHeader>
              <CardTitle>Cấu hình Shopee</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="partnerId">Partner ID</Label>
                <Input
                  id="partnerId"
                  placeholder="Nhập Partner ID"
                  value={form.api_config.partnerId}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      api_config: {
                        ...form.api_config,
                        partnerId: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shopId">Shop ID</Label>
                <Input
                  id="shopId"
                  placeholder="Nhập Shop ID"
                  value={form.api_config.shopId}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      api_config: {
                        ...form.api_config,
                        shopId: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        )}

        {form.name === "wordpress" && (
          <Card>
            <CardHeader>
              <CardTitle>Cấu hình WordPress</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Tên đăng nhập</Label>
                <Input
                  id="username"
                  placeholder="Nhập tên đăng nhập"
                  value={form.api_config.username}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      api_config: {
                        ...form.api_config,
                        username: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={form.api_config.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      api_config: {
                        ...form.api_config,
                        password: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Cấu hình Webhook</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="webhookUrl">Webhook URL</Label>
              <Input
                id="webhookUrl"
                placeholder="https://ten-mien-cua-ban.com/webhook"
                value={form.api_config.webhookUrl}
                onChange={(e) =>
                  setForm({
                    ...form,
                    api_config: {
                      ...form.api_config,
                      webhookUrl: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="webhookSecret">Webhook Secret</Label>
              <Input
                id="webhookSecret"
                type="password"
                placeholder="Nhập webhook secret"
                value={form.api_config.webhookSecret}
                onChange={(e) =>
                  setForm({
                    ...form,
                    api_config: {
                      ...form.api_config,
                      webhookSecret: e.target.value,
                    },
                  })
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </ContainerApp>
  );
}
