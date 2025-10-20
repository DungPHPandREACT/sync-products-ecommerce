import { useGetPlatforms } from "@/apis/platforms/platform.api";
import { useCreateProduct, useSyncProduct } from "@/apis/products/product.api";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProductCreatePage() {
  const navigate = useNavigate();
  const { data: platforms = [] } = useGetPlatforms();
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: syncProduct, isPending: isSyncing } = useSyncProduct();

  const [form, setForm] = useState({
    name: "",
    description: "",
    sku: "",
    price: 0,
    inventory: 0,
    status: "active",
  });

  const [selectedPlatforms, setSelectedPlatforms] = useState<number[]>([]);
  const [syncAfterCreate, setSyncAfterCreate] = useState<boolean>(false);

  const togglePlatform = (id: number) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleCreate = () => {
    if (!form.name) return;
    createProduct(
      { ...form },
      {
        onSuccess: (created: any) => {
          if (syncAfterCreate && selectedPlatforms.length > 0) {
            selectedPlatforms.forEach((pid) => {
              syncProduct({ id: created.id, payload: { platformId: pid } });
            });
          }
          navigate("/products");
        },
      }
    );
  };

  return (
    <ContainerApp
      title="Tạo sản phẩm"
      description="Tạo sản phẩm mới và chọn nền tảng để đồng bộ ngay nếu cần"
      mainAction={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Hủy
          </Button>
          <Button onClick={handleCreate} disabled={isCreating || isSyncing}>
            {isCreating ? "Đang tạo..." : "Tạo sản phẩm"}
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin sản phẩm</CardTitle>
            <CardDescription>
              Nhập thông tin cơ bản để tạo sản phẩm
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên sản phẩm</Label>
              <Input
                id="name"
                placeholder="Nhập tên sản phẩm"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                placeholder="Mô tả sản phẩm"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  placeholder="Mã SKU"
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Trạng thái</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm({ ...form, status: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Giá</Label>
                <Input
                  id="price"
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: Number(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inventory">Tồn kho</Label>
                <Input
                  id="inventory"
                  type="number"
                  min={0}
                  value={form.inventory}
                  onChange={(e) =>
                    setForm({ ...form, inventory: Number(e.target.value) })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Đồng bộ với nền tảng</CardTitle>
            <CardDescription>
              Chọn nền tảng muốn đồng bộ sau khi tạo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  id="syncAfterCreate"
                  type="checkbox"
                  checked={syncAfterCreate}
                  onChange={(e) => setSyncAfterCreate(e.target.checked)}
                />
                <Label htmlFor="syncAfterCreate">
                  Đồng bộ ngay sau khi tạo
                </Label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {platforms.map((p: any) => (
                  <label
                    key={p.id}
                    className="flex items-center gap-2 p-2 border rounded-md cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedPlatforms.includes(p.id)}
                      onChange={() => togglePlatform(p.id)}
                    />
                    <span>{p.display_name}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* Gợi ý: có thể mở rộng thêm thuộc tính mapping riêng cho từng nền tảng nếu cần */}
          </CardContent>
        </Card>
      </div>
    </ContainerApp>
  );
}
