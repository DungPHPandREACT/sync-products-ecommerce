import { useGetCurrentUser } from "@/apis/auth/auth.api";
import ContainerApp from "@/components/comons/container-app";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { toast } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMemo, useState } from "react";

export default function AccountPage() {
  const { data: currentUser } = useGetCurrentUser({ enabled: true });
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    avatarUrl: "",
  });
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const previewUrl = useMemo(() => {
    if (avatarFile) return URL.createObjectURL(avatarFile);
    return profile.avatarUrl || "";
  }, [avatarFile, profile.avatarUrl]);

  // Prefill from current user
  useMemo(() => {
    if (currentUser) {
      setProfile((prev) => ({
        ...prev,
        name: (currentUser as any)?.name || "",
        email: (currentUser as any)?.email || "",
        avatarUrl: (currentUser as any)?.avatar || "",
      }));
    }
  }, [currentUser]);

  const handleSaveProfile = () => {
    // TODO: call update profile API
    toast.success("Cập nhật hồ sơ thành công");
  };

  const handleChangePassword = () => {
    if (!passwords.next || passwords.next !== passwords.confirm) return;
    // TODO: call change password API
    toast.success("Đổi mật khẩu thành công");
  };

  const passwordStrength = useMemo(() => {
    const p = passwords.next || "";
    let score = 0;
    if (p.length >= 8) score += 1;
    if (/[A-Z]/.test(p)) score += 1;
    if (/[a-z]/.test(p)) score += 1;
    if (/[0-9]/.test(p)) score += 1;
    if (/[^A-Za-z0-9]/.test(p)) score += 1;
    return score; // 0..5
  }, [passwords.next]);

  return (
    <ContainerApp
      title="Tài khoản"
      description="Quản lý thông tin người dùng và bảo mật"
    >
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardContent className="flex flex-col md:flex-row md:items-center gap-4 py-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 rounded-lg">
                <AvatarImage src={previewUrl} alt={profile.name || "avatar"} />
                <AvatarFallback className="rounded-lg">AV</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-lg font-semibold">
                  {profile.name || "Người dùng"}
                </div>
                <div className="text-sm text-gray-500">
                  {profile.email || "Chưa có email"}
                </div>
              </div>
            </div>
            <div className="md:ml-auto">
              <label className="inline-flex items-center justify-center px-3 py-2 rounded-md border cursor-pointer text-sm">
                Tải ảnh đại diện
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
                />
              </label>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Hồ sơ</TabsTrigger>
            <TabsTrigger value="security">Bảo mật</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Hồ sơ</CardTitle>
                <CardDescription>Cập nhật thông tin cá nhân</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Họ tên</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setProfile({ name: "", email: "", avatarUrl: "" })
                    }
                  >
                    Hủy
                  </Button>
                  <Button onClick={handleSaveProfile}>Lưu</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Bảo mật</CardTitle>
                <CardDescription>Đổi mật khẩu</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current">Mật khẩu hiện tại</Label>
                  <Input
                    id="current"
                    type="password"
                    value={passwords.current}
                    onChange={(e) =>
                      setPasswords({ ...passwords, current: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="next">Mật khẩu mới</Label>
                  <Input
                    id="next"
                    type="password"
                    value={passwords.next}
                    onChange={(e) =>
                      setPasswords({ ...passwords, next: e.target.value })
                    }
                  />
                  <div className="h-1 rounded bg-gray-200 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        passwordStrength <= 2
                          ? "bg-red-400 w-2/12"
                          : passwordStrength === 3
                          ? "bg-yellow-400 w-1/2"
                          : "bg-green-500 w-10/12"
                      }`}
                    />
                  </div>
                  <div className="text-xs text-gray-500">
                    {passwordStrength <= 2
                      ? "Yếu"
                      : passwordStrength === 3
                      ? "Trung bình"
                      : "Mạnh"}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Xác nhận mật khẩu mới</Label>
                  <Input
                    id="confirm"
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) =>
                      setPasswords({ ...passwords, confirm: e.target.value })
                    }
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setPasswords({ current: "", next: "", confirm: "" })
                    }
                  >
                    Hủy
                  </Button>
                  <Button onClick={handleChangePassword}>Đổi mật khẩu</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ContainerApp>
  );
}
