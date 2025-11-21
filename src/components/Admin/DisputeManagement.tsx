import { useEffect, useState } from "react";
import { Plus, AlertCircle, CheckCircle2, Clock, MessageCircle } from "lucide-react";

import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import type { Dispute } from "../../types/disputes";
import { getDisputeById, getDisputes, resolveDispute } from "../../api/disputeApi";
import { DisputeChatBox } from "../disputes/DisputeChatbox";
import dayjs from "dayjs";

const DisputeManagement = () => {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    const data = await getDisputes();
    setDisputes(data);
    setLoading(false);
  };

  // Khi chọn một dispute, gọi API lấy chi tiết để có messages mới nhất
  const handleSelectDispute = async (id: number) => {
    const detail = await getDisputeById(id);
    if (detail) setSelectedDispute(detail);
  };

  // Reload lại tin nhắn của dispute đang chọn
  const reloadCurrentMessages = async () => {
    if (selectedDispute) {
      const detail = await getDisputeById(selectedDispute.disputeId);
      if (detail) setSelectedDispute(detail);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Open": return <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-200">Open</Badge>;
      case "Resolved": return <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Resolved</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleCloseDispute = async () => {
    if(selectedDispute && window.confirm("Bạn có chắc muốn đánh dấu tranh chấp này đã giải quyết?")) {
        await resolveDispute(selectedDispute.disputeId);
        reloadCurrentMessages();
        fetchList(); 
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Trung tâm Giải quyết Tranh chấp</h1>
            <p className="text-muted-foreground">Quản lý và xử lý các vấn đề phát sinh</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
          
          {/* Left: Dispute List */}
          <div className="md:col-span-1 bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b bg-gray-50 font-semibold text-gray-700">Danh sách yêu cầu</div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {loading ? (
                <p className="text-center py-4 text-gray-500">Đang tải...</p>
              ) : disputes.length === 0 ? (
                <p className="text-center py-10 text-gray-400">Không có tranh chấp nào.</p>
              ) : (
                disputes.map((d) => (
                  <div
                    key={d.disputeId}
                    onClick={() => handleSelectDispute(d.disputeId)}
                    className={`p-3 rounded-lg cursor-pointer border transition-all ${
                      selectedDispute?.disputeId === d.disputeId
                        ? "bg-blue-50 border-blue-200 shadow-sm"
                        : "bg-white border-transparent hover:bg-gray-50 hover:border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-semibold text-gray-800 line-clamp-1">{d.title}</h4>
                      {getStatusBadge(d.status)}
                    </div>
                    <div className="flex items-center text-xs text-gray-500 gap-2 mt-2">
                      <Clock className="w-3 h-3" />
                      <span>{dayjs(d.createdAt).format("DD-MM-YYYY") || "N/A"}</span>
                      <span className="ml-auto flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" /> {d.messages?.length || 0}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right: Chat & Detail */}
          <div className="md:col-span-2 bg-white rounded-xl border shadow-sm flex flex-col">
            {selectedDispute ? (
              <>
                {/* Header Detail */}
                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      {selectedDispute.title}
                      {getStatusBadge(selectedDispute.status)}
                    </h2>
                    <p className="text-sm text-gray-500">ID: #{selectedDispute.disputeId} • Tạo bởi User #{selectedDispute.raisedByUserId}</p>
                  </div>
                  
                  {selectedDispute.status !== "Resolved" && (
                      <Button variant="outline" size="sm" className="text-green-600 border-green-200 hover:bg-green-50" onClick={handleCloseDispute}>
                        <CheckCircle2 className="w-4 h-4 mr-1" /> Đánh dấu đã xong
                      </Button>
                  )}
                </div>

                {/* Chat Box */}
                <div className="flex-1 p-4 bg-white overflow-hidden">
                    <DisputeChatBox 
                        disputeId={selectedDispute.disputeId} 
                        messages={selectedDispute.messages || []}
                        onMessageSent={reloadCurrentMessages}
                    />
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <AlertCircle className="w-12 h-12 mb-2 opacity-20" />
                <p>Chọn một tranh chấp để xem chi tiết</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DisputeManagement;