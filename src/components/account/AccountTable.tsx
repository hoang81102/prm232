import { useState } from "react";
import { Eye, Pencil, Trash2, Search, MoreHorizontal, Pen } from "lucide-react";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import type { Account } from "../../types/account";
import { AccountStatusBadge } from "./AccountStatusBadge";

interface AccountTableProps {
  accounts: Account[];
  onView: (account: Account) => void;
  onEdit: (account: Account) => void;
  onDelete: (account: Account) => void;
}

export const AccountTable = ({
  accounts,
  onView,
  onEdit,
  onDelete,
}: AccountTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredaccounts = accounts.filter(
    (account) =>
      (account.email ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (account.phoneNumber ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (account.roleName ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (account.firstName ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (account.lastName ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by email, phone, role name, address.."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 text-gray-500"
          />
        </div>
      </div>

      <div className="rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-emerald-300">
              <TableHead>Id</TableHead>
              <TableHead>Tên tài khoản</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredaccounts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  Không tìm thấy tài khoản nào.
                </TableCell>
              </TableRow>
            ) : (
              filteredaccounts.map((account) => (
                <TableRow key={account.userId} className="hover:bg-gray-200">
                  <TableCell className="font-medium">
                    {account.userId ? `${account.userId}` : "N/A"}
                  </TableCell>
                  <TableCell>
                    {account.firstName && account.lastName
                      ? account.firstName + account.lastName
                      : "N/A"}
                  </TableCell>
                  <TableCell>{account.phoneNumber || "N/A"}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {account.email || "N/A"}
                  </TableCell>
                  <TableCell>{account.status || "N/A"}</TableCell>
                  <TableCell>
                    <AccountStatusBadge status={account.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white">
                        <DropdownMenuItem
                          onClick={() => {
                            onView(account);
                          }}
                          className="hover:bg-emerald-300"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onEdit(account)}
                          className="hover:bg-emerald-300"
                        >
                          <Pen className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(account)}
                          className="text-red-500 hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
