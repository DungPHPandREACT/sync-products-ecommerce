import ContainerApp from "@/components/comons/container-app";
import { Save } from "lucide-react";
import { useState } from "react";
import {
  useGetSettings,
  useUpdateSettings,
} from "../../apis/settings/setting.api";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Switch } from "../../components/ui/switch";

export function Settings() {
  const { data: settings } = useGetSettings();
  const { mutate: updateSettings, isPending } = useUpdateSettings();

  const [formData, setFormData] = useState({
    sync_interval_minutes: settings?.sync_interval_minutes ?? 30,
    batch_size: settings?.batch_size ?? 100,
    max_retries: settings?.max_retries ?? 3,
    default_conflict_resolution:
      settings?.default_conflict_resolution ?? "manual",
    auto_resolve_conflicts: settings?.auto_resolve_conflicts ?? false,
    notify_on_conflicts: settings?.notify_on_conflicts ?? false,
    webhook_base_url: settings?.webhook_base_url ?? "",
    webhook_secret: settings?.webhook_secret ?? "",
    enable_webhooks: settings?.enable_webhooks ?? false,
  });

  const handleSave = () => {
    updateSettings({
      sync_interval_minutes: formData.sync_interval_minutes,
      batch_size: formData.batch_size,
      max_retries: formData.max_retries,
      default_conflict_resolution: formData.default_conflict_resolution as any,
      auto_resolve_conflicts: formData.auto_resolve_conflicts,
      notify_on_conflicts: formData.notify_on_conflicts,
      webhook_base_url: formData.webhook_base_url,
      webhook_secret: formData.webhook_secret,
      enable_webhooks: formData.enable_webhooks,
    });
  };

  return (
    <ContainerApp title="Cài đặt">
      <Card>
        <CardHeader>
          <CardTitle>Cấu hình đồng bộ</CardTitle>
          <CardDescription>
            Thiết lập chu kỳ và tham số cho quá trình đồng bộ
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="syncInterval">Chu kỳ đồng bộ (phút)</Label>
            <Input
              id="syncInterval"
              type="number"
              placeholder="30"
              min={5}
              max={1440}
              value={formData.sync_interval_minutes}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  sync_interval_minutes: Number(e.target.value),
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="batchSize">Số bản ghi mỗi đợt xử lý</Label>
            <Input
              id="batchSize"
              type="number"
              placeholder="100"
              min={10}
              max={1000}
              value={formData.batch_size}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  batch_size: Number(e.target.value),
                }))
              }
            />
            <p className="text-sm text-gray-500">
              Số lượng bản ghi được đồng bộ trong mỗi đợt; giảm nếu gặp rate
              limit.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxRetries">Số lần thử lại tối đa</Label>
            <Input
              id="maxRetries"
              type="number"
              placeholder="3"
              min={1}
              max={10}
              value={formData.max_retries}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  max_retries: Number(e.target.value),
                }))
              }
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="autoSync"
              checked={formData.enable_webhooks}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, enable_webhooks: checked }))
              }
            />
            <Label htmlFor="autoSync">Bật tự động đồng bộ</Label>
          </div>
          <p className="text-sm text-gray-500">
            Tự động đồng bộ theo lịch đã cấu hình
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Xử lý xung đột</CardTitle>
          <CardDescription>
            Thiết lập cách xử lý khi dữ liệu giữa hệ thống và nền tảng khác nhau
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resolutionStrategy">
              Chiến lược xử lý mặc định
            </Label>
            <Select
              value={formData.default_conflict_resolution}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  default_conflict_resolution: value as any,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose strategy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="local">Ưu tiên dữ liệu hệ thống</SelectItem>
                <SelectItem value="platform">
                  Ưu tiên dữ liệu nền tảng
                </SelectItem>
                <SelectItem value="manual">Duyệt thủ công</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="autoResolve"
              checked={formData.auto_resolve_conflicts}
              onCheckedChange={(checked: boolean) =>
                setFormData((prev) => ({
                  ...prev,
                  auto_resolve_conflicts: checked,
                }))
              }
            />
            <Label htmlFor="autoResolve">Tự động xử lý xung đột</Label>
          </div>
          <p className="text-sm text-gray-500">
            Tự động xử lý theo chiến lược mặc định
          </p>
          <div className="flex items-center space-x-2">
            <Switch
              id="notifyConflicts"
              checked={formData.notify_on_conflicts}
              onCheckedChange={(checked: boolean) =>
                setFormData((prev) => ({
                  ...prev,
                  notify_on_conflicts: checked,
                }))
              }
            />
            <Label htmlFor="notifyConflicts">Thông báo khi có xung đột</Label>
          </div>
          <p className="text-sm text-gray-500">
            Gửi thông báo khi phát hiện xung đột dữ liệu
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cấu hình Webhook</CardTitle>
          <CardDescription>Thiết lập địa chỉ và bí mật webhook</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhookUrl">Webhook Base URL</Label>
            <Input
              id="webhookUrl"
              placeholder="https://your-domain.com"
              value={formData.webhook_base_url}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  webhook_base_url: e.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="webhookSecret">Webhook Secret</Label>
            <Input
              id="webhookSecret"
              type="password"
              placeholder="your-webhook-secret"
              value={formData.webhook_secret}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  webhook_secret: e.target.value,
                }))
              }
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="enableWebhooks"
              checked={formData.enable_webhooks}
              onCheckedChange={(checked: boolean) =>
                setFormData((prev) => ({ ...prev, enable_webhooks: checked }))
              }
            />
            <Label htmlFor="enableWebhooks">Bật Webhook</Label>
          </div>
          <p className="text-sm text-gray-500">
            Nhận cập nhật thời gian thực từ nền tảng
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isPending}>
          <Save className="mr-2 h-4 w-4" />
          {isPending ? "Đang lưu..." : "Lưu cài đặt"}
        </Button>
      </div>
    </ContainerApp>
  );
}
