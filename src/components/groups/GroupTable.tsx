import { useState } from "react";
import { Eye, Trash2, Search, MoreHorizontal, Pen, FileUp } from "lucide-react";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import type { GroupSchema } from "../../types/group";
import dayjs from "dayjs";
interface GroupTableProps {
  groups: GroupSchema[];
  onView: (group: GroupSchema) => void;
  onEdit: (group: GroupSchema) => void;
  onDelete: (group: GroupSchema) => void;
  onUploadContract: (group: GroupSchema) => void;
}

export const GroupTable = ({
  groups,
  onView,
  onEdit,
  onDelete,
  onUploadContract
}: GroupTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredGroups = groups.filter(
    (group) =>
      (group.groupName ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by name"
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
              <TableHead>Tên nhóm</TableHead>
              <TableHead>Mã hợp đồng</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGroups.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  Không tìm thấy nhóm nào.
                </TableCell>
              </TableRow>
            ) : (
              filteredGroups.map((group) => (
                <TableRow key={group.coOwnerGroupId} className="hover:bg-gray-200">
                  <TableCell className="font-medium">
                    {group.coOwnerGroupId ? `${group.coOwnerGroupId}` : "N/A"}
                  </TableCell>
                  <TableCell>
                    {group.groupName
                      ? group.groupName 
                      : "N/A"}
                  </TableCell>
                  <TableCell>{group.contractId || "N/A"}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {dayjs(group.createdAt).format("DD-MM-YYYY") || "N/A"}
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
                            onView(group);
                          }}
                          className="hover:bg-emerald-300"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onEdit(group)}
                          className="hover:bg-emerald-300"
                        >
                          <Pen className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onUploadContract(group)}
                          className="hover:bg-emerald-50 cursor-pointer text-blue-600 focus:text-blue-700"
                        >
                          <FileUp className="mr-2 h-4 w-4" />
                          Upload Hợp đồng
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem
                          onClick={() => onDelete(group)}
                          className="text-red-500 hover:bg-red-50 cursor-pointer focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(group)}
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
