import { useEffect, useState } from "react";
import { Plus, Search, MessageSquareText, Trash2, Filter } from "lucide-react";
import { toast } from "react-toastify";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { CreateVoteDialog } from "../votes/CreateVoteDialogForm";
import type { VoteSchema } from "../../types/votes";
import { getVoteByGroupId } from "../../api/voteApi";

import dayjs from "dayjs";
const VoteManagement = () => {
  const [votes, setVotes] = useState<VoteSchema[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [voteDialogOpen, setVoteDialogOpen] = useState(false);
  const [searchGroupId, setSearchGroupId] = useState("");

  const fetchVotes = async () => {
    if (!searchGroupId.trim()) {
      setVotes([]); 
      return;
    }
    try {
      setLoading(true);
      const groupId = Number(searchGroupId);
      
      if (isNaN(groupId)) {
        // Nếu nhập chữ thay vì số
        return; 
      }
      const res = await getVoteByGroupId(groupId);
      if (res) {
        setVotes(res);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách bình chọn");
    } finally {
      setLoading(false);
    }
  };

   useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchGroupId) {
        fetchVotes();
      } else {
        setVotes([]); // Clear khi xóa hết input
      }
    }, 600);

    return () => clearTimeout(delayDebounce);
  }, [searchGroupId]);

    const filteredVotes = Array.isArray(votes) 
    ? votes.filter((vote) => vote.topic && vote.topic.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Quản lý Bình chọn</h1>
            <p className="text-muted-foreground">
              Danh sách các cuộc bình chọn trong hệ thống
            </p>
          </div>
          <Button
            onClick={() => setVoteDialogOpen(true)}
            size="lg"
            className="gap-2 bg-[#F96E2A] hover:bg-[#e56021] text-white"
          >
            <Plus className="h-5 w-5" />
            Tạo Vote Mới
          </Button>
        </div>

         <div className="flex flex-col sm:flex-row gap-4 mb-6">
          
          {/* Input tìm theo Group ID */}
          <div className="relative max-w-xs">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="number"
              placeholder="Nhập Group ID (VD: 1)..."
              value={searchGroupId}
              onChange={(e) => setSearchGroupId(e.target.value)}
              className="pl-9 border-orange-200 focus-visible:ring-orange-400"
            />
          </div>

          {/* Input tìm theo Topic */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Tìm theo chủ đề..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border shadow-sm bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-emerald-50 hover:bg-emerald-50">
                <TableHead className="w-[50px]">ID</TableHead>
                <TableHead>Chủ đề</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Kết quả</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Đang tải dữ liệu...
                  </TableCell>
                </TableRow>
              ) : filteredVotes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Không tìm thấy cuộc bình chọn nào.
                  </TableCell>
                </TableRow>
              ) : (
                filteredVotes.map((vote) => (
                  <TableRow key={vote.voteId} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{vote.voteId}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 font-medium text-gray-900">
                        <MessageSquareText className="h-4 w-4 text-blue-500" />
                        {vote.topic}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate text-gray-500">
                      {vote.description || "Không có mô tả"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          vote.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {vote.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {dayjs(vote.createAt).format("DD-MM-YYYY") || "N/A"}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs gap-1">
                        <span className="text-green-600">Yes: {vote.totalYes}</span>
                        <span className="text-red-600">No: {vote.totalNo}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Create Dialog */}
        <CreateVoteDialog
          open={voteDialogOpen}
          onOpenChange={setVoteDialogOpen}
          onSuccess={() => {
            fetchVotes(); 
          }}
        />
      </div>
    </div>
  );
};

export default VoteManagement;