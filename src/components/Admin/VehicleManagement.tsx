import * as React from "react";
import {
  Car,
  Plus,
  MoreHorizontal,
  FilePen,
  Trash2,
  CalendarCheck2,
  ShieldCheck,
  Search,
} from "lucide-react";


import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";

// Mock data cho danh sách xe
const vehicles = [
  {
    id: 1,
    name: "Tesla Model 3",
    plate: "HN-123",
    status: "available",
    ownership: "100%",
    nextMaintenance: "2025-12-01",
    insurance: "2025-11-30",
  },
  {
    id: 2,
    name: "VinFast VF8",
    plate: "HN-456",
    status: "in-use",
    ownership: "100%",
    nextMaintenance: "2026-01-15",
    insurance: "2025-12-20",
  },
  {
    id: 3,
    name: "BYD Atto 3",
    plate: "HN-789",
    status: "maintenance",
    ownership: "100%",
    nextMaintenance: "2025-11-20",
    insurance: "2026-02-01",
  },
];

// Component Form thêm/sửa xe
const VehicleForm = ({ vehicle }: { vehicle?: (typeof vehicles)[0] }) => {
  const isEdit = !!vehicle;
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Tên xe
        </Label>
        <Input
          id="name"
          defaultValue={vehicle?.name || ""}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="plate" className="text-right">
          Biển số
        </Label>
        <Input
          id="plate"
          defaultValue={vehicle?.plate || ""}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="status" className="text-right">
          Trạng thái
        </Label>
        <Select
          defaultValue={vehicle?.status || "available"}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Chọn trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="available">Sẵn sàng</SelectItem>
            <SelectItem value="in-use">Đang sử dụng</SelectItem>
            <SelectItem value="maintenance">Bảo trì</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="maintenance" className="text-right">
          Bảo trì tiếp
        </Label>
        <Input
          id="maintenance"
          type="date"
          defaultValue={vehicle?.nextMaintenance || ""}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="insurance" className="text-right">
          Hạn bảo hiểm
        </Label>
        <Input
          id="insurance"
          type="date"
          defaultValue={vehicle?.insurance || ""}
          className="col-span-3"
        />
      </div>
    </div>
  );
};

export default function AdminVehicles() {
  const [open, setOpen] = React.useState(false);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-success/10 text-success">Sẵn sàng</Badge>;
      case "in-use":
        return <Badge className="bg-info/10 text-info">Đang sử dụng</Badge>;
      case "maintenance":
        return <Badge className="bg-warning/10 text-warning">Bảo trì</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Quản lý Xe</h1>
          <p className="text-muted-foreground">
            Thêm, sửa, xóa và theo dõi trạng thái các xe trong hệ thống
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className=" from-primary to-accent">
              <Plus className="w-4 h-4 mr-2" />
              Thêm xe mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Thêm xe mới</DialogTitle>
              <DialogDescription>
                Điền thông tin chi tiết của xe mới vào bên dưới.
              </DialogDescription>
            </DialogHeader>
            <VehicleForm />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Hủy</Button>
              </DialogClose>
              <Button onClick={() => setOpen(false)}>Lưu lại</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Thanh tìm kiếm và bộ lọc */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Tìm kiếm xe (biển số, tên xe...)" className="pl-9" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Lọc trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="available">Sẵn sàng</SelectItem>
            <SelectItem value="in-use">Đang sử dụng</SelectItem>
            <SelectItem value="maintenance">Bảo trì</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bảng danh sách xe */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách xe</CardTitle>
          <CardDescription>
            Tổng số {vehicles.length} xe đang được quản lý.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên xe</TableHead>
                <TableHead>Biển số</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Lịch bảo trì</TableHead>
                <TableHead>Hạn bảo hiểm</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">{vehicle.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{vehicle.plate}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                  <TableCell className="flex items-center gap-2">
                     <CalendarCheck2 className="w-4 h-4 text-muted-foreground" />
                     {vehicle.nextMaintenance}
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                    {vehicle.insurance}
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                          <DialogTrigger asChild>
                            <DropdownMenuItem className="gap-2">
                              <FilePen className="w-4 h-4" />
                              Sửa thông tin
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DropdownMenuItem className="gap-2 text-destructive">
                            <Trash2 className="w-4 h-4" />
                            Xóa xe
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                       <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Cập nhật xe</DialogTitle>
                          <DialogDescription>
                            Chỉnh sửa thông tin chi tiết của xe.
                          </DialogDescription>
                        </DialogHeader>
                        <VehicleForm vehicle={vehicle} />
                        <DialogFooter>
                           <DialogClose asChild>
                            <Button variant="outline">Hủy</Button>
                          </DialogClose>
                          <Button>Lưu thay đổi</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};