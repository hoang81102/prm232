// src/components/CoOwner/CoOwnerDispute.tsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createDispute,
  getDisputeById,
  type Dispute,
} from "../../api/disputeApi";
import { getUserInfo } from "../../api/authApi";

interface CoOwnerDisputeProps {
  groupId?: number;
}

const formatDateTime = (value?: string | null) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value ?? "";
  return d.toLocaleString("vi-VN");
};

const statusBadge = (status?: string) => {
  const base =
    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium";
  const s = (status ?? "").toLowerCase();

  if (s === "open") {
    return (
      <span className={`${base} bg-amber-50 text-amber-700`}>
        <span className="mr-1 text-xs">⏰</span>
        Đang mở
      </span>
    );
  }

  if (s === "resolved") {
    return (
      <span className={`${base} bg-emerald-50 text-emerald-700`}>
        <span className="mr-1 text-xs">✅</span>
        Đã giải quyết
      </span>
    );
  }

  if (s === "closed") {
    return (
      <span className={`${base} bg-gray-100 text-gray-700`}>
        <span className="mr-1 text-xs">🔒</span>
        Đã đóng
      </span>
    );
  }

  return (
    <span className={`${base} bg-gray-50 text-gray-600`}>
      <span className="mr-1 text-xs">❔</span>
      {status || "Không rõ"}
    </span>
  );
};

const CoOwnerDispute: React.FC<CoOwnerDisputeProps> = ({ groupId }) => {
  const navigate = useNavigate();
  const params = useParams<{ groupId?: string }>();
  const userInfo = getUserInfo() as any | null;

  // Resolve groupId giống các trang CoOwner khác
  const routeGroupId =
    params.groupId && !Number.isNaN(Number(params.groupId))
      ? Number(params.groupId)
      : undefined;

  const _groupId: number =
    groupId ??
    (routeGroupId as number | undefined) ??
    (userInfo?.coOwnerGroupId as number | undefined) ??
    1;

  // ====== FORM TẠO DISPUTE ======
  const [createForm, setCreateForm] = useState<{
    title: string;
    description: string;
    relatedBookingId: string;
  }>({
    title: "",
    description: "",
    relatedBookingId: "",
  });
  const [creating, setCreating] = useState(false);

  // ====== DANH SÁCH DISPUTE ĐÃ GỬI TRONG PHIÊN NÀY ======
  const [disputes, setDisputes] = useState<Dispute[]>([]);

  // ====== DISPUTE DETAIL ======
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [dispute, setDispute] = useState<Dispute | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // =========================
  // HANDLE: Tạo khiếu nại (CoOwner)
  // POST /api/Disputes
  // =========================
  const handleCreateDispute = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!createForm.title.trim() || !createForm.description.trim()) {
      alert("Vui lòng nhập Tiêu đề và Mô tả khiếu nại.");
      return;
    }

    const relatedBookingIdNum = createForm.relatedBookingId
      ? Number(createForm.relatedBookingId)
      : undefined;

    if (
      createForm.relatedBookingId &&
      Number.isNaN(Number(createForm.relatedBookingId))
    ) {
      alert("Mã booking liên quan phải là số.");
      return;
    }

    try {
      setCreating(true);
      const created = await createDispute({
        coOwnerGroupId: _groupId,
        title: createForm.title.trim(),
        description: createForm.description.trim(),
        relatedBookingId:
          relatedBookingIdNum !== undefined ? relatedBookingIdNum : undefined,
      });

      // Lưu vào list local (những tranh chấp đã gửi trong phiên)
      setDisputes((prev) => {
        const exists = prev.some((d) => d.disputeId === created.disputeId);
        return exists ? prev : [created, ...prev];
      });

      // Chọn và hiển thị luôn tranh chấp vừa tạo
      if (created.disputeId) {
        setSelectedId(created.disputeId);
        setDispute(created);
      }

      // Reset form
      setCreateForm({
        title: "",
        description: "",
        relatedBookingId: "",
      });
    } catch {
      // lỗi đã toast ở api
    } finally {
      setCreating(false);
    }
  };

  // =========================
  // HANDLE: Chọn dispute từ danh sách để xem chi tiết
  // GET /api/Disputes/{id}
  // =========================
  const handleSelectDispute = async (id: number) => {
    setSelectedId(id);
    try {
      setLoadingDetail(true);
      const data = await getDisputeById(id);
      setDispute(data);

      // Cập nhật lại bản trong list (nếu cần)
      setDisputes((prev) => {
        const idx = prev.findIndex((d) => d.disputeId === id);
        if (idx === -1) return prev;
        const clone = [...prev];
        clone[idx] = data;
        return clone;
      });
    } catch {
      // lỗi đã toast ở api
    } finally {
      setLoadingDetail(false);
    }
  };

  const currentMessages = dispute?.messages ?? [];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Nút quay lại nhóm */}
      <button
        type="button"
        onClick={() => navigate(`/CoOwner/grouppage/${_groupId}`)}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 
                   px-4 py-2 rounded-xl bg-white border border-gray-200 shadow-sm 
                   hover:bg-gray-100 transition"
      >
        <span className="text-lg">⬅️</span>
        Quay lại nhóm
      </button>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
            Khiếu nại &amp; Tranh chấp
          </h1>
          <p className="text-sm text-gray-500">
            Co-owner có thể tạo khiếu nại và theo dõi phản hồi từ nhân viên hỗ
            trợ.
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Đang thao tác cho <b>nhóm ID: {_groupId}</b>.
          </p>
        </div>
      </div>

      {/* Layout 2 cột */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tạo khiếu nại mới */}
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">⚠️</span>
            <h2 className="text-lg font-semibold text-gray-800">
              Tạo khiếu nại / tranh chấp mới
            </h2>
          </div>

          <p className="text-xs text-gray-500 mb-3">
            Khi có vấn đề về sử dụng xe, chi phí hoặc quyền lợi trong nhóm, bạn
            có thể tạo tranh chấp tại đây để hệ thống ghi nhận và nhân viên xử
            lý.
          </p>

          <form className="space-y-3" onSubmit={handleCreateDispute}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiêu đề khiếu nại <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Ví dụ: Tranh chấp về lịch sử dụng xe ngày 10/10"
                value={createForm.title}
                onChange={(e) =>
                  setCreateForm((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả chi tiết <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                rows={4}
                placeholder="Mô tả rõ vấn đề, thời gian, các bên liên quan..."
                value={createForm.description}
                onChange={(e) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mã booking liên quan (nếu có)
              </label>
              <input
                type="text"
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="VD: 1024"
                value={createForm.relatedBookingId}
                onChange={(e) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    relatedBookingId: e.target.value,
                  }))
                }
              />
              <p className="mt-1 text-xs text-gray-400">
                Giúp liên kết tranh chấp với một lịch đặt xe cụ thể (không bắt
                buộc).
              </p>
            </div>

            <button
              type="submit"
              disabled={creating}
              className="w-full inline-flex items-center justify-center rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
            >
              {creating ? "Đang tạo khiếu nại..." : "Tạo khiếu nại"}
            </button>
          </form>
        </div>

        {/* Danh sách dispute đã gửi + chi tiết / message (read-only) */}
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-5 flex flex-col h-full">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">📃</span>
              <h2 className="text-lg font-semibold text-gray-800">
                Tranh chấp đã gửi trong phiên
              </h2>
            </div>
          </div>

          {/* Danh sách local */}
          <div className="mb-4">
            {disputes.length === 0 ? (
              <div className="text-xs text-gray-500">
                Bạn chưa gửi tranh chấp nào trong phiên này.
              </div>
            ) : (
              <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                {disputes.map((d) => {
                  const isSelected = d.disputeId === selectedId;
                  return (
                    <button
                      key={d.disputeId}
                      type="button"
                      onClick={() =>
                        d.disputeId && handleSelectDispute(d.disputeId)
                      }
                      className={`w-full text-left rounded-xl border px-3 py-2 text-xs flex items-start justify-between gap-2 transition ${
                        isSelected
                          ? "border-sky-500 bg-sky-50"
                          : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-gray-800 line-clamp-1">
                          {d.title}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          ID: #{d.disputeId} •{" "}
                          {formatDateTime(d.createdAt) || "Không rõ thời gian"}
                        </p>
                      </div>
                      <div className="ml-2 shrink-0">
                        {statusBadge(d.status)}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Chi tiết + messages */}
          <div className="border-t border-gray-200 pt-4 flex-1 flex flex-col">
            {loadingDetail ? (
              <div className="text-xs text-gray-500">
                Đang tải chi tiết tranh chấp...
              </div>
            ) : !dispute ? (
              <div className="text-xs text-gray-500">
                Hãy chọn một tranh chấp ở danh sách bên trên để xem chi tiết.
              </div>
            ) : (
              <>
                {/* Info dispute */}
                <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 mb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-gray-500">
                        Dispute ID:{" "}
                        <span className="font-mono font-semibold text-gray-800">
                          #{dispute.disputeId}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Thuộc nhóm:{" "}
                        <span className="font-semibold text-gray-800">
                          {dispute.coOwnerGroupId}
                        </span>
                      </p>
                      {dispute.relatedBookingId && (
                        <p className="text-xs text-gray-500">
                          Booking liên quan:{" "}
                          <span className="font-semibold text-gray-800">
                            #{dispute.relatedBookingId}
                          </span>
                        </p>
                      )}
                      <p className="mt-1 text-sm font-semibold text-gray-800">
                        {dispute.title}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Tạo lúc: {formatDateTime(dispute.createdAt)} • Người tạo
                        ID:{" "}
                        <span className="font-semibold text-gray-800">
                          {dispute.createdByUserId ?? "Không rõ"}
                        </span>
                      </p>
                    </div>
                    <div>{statusBadge(dispute.status)}</div>
                  </div>

                  <p className="mt-2 text-sm text-gray-700">
                    {dispute.description}
                  </p>
                </div>

                {/* Messages (read-only cho CoOwner) */}
                <div className="flex-1 flex flex-col min-h-40">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Trao đổi / Giải trình từ nhân viên
                  </h3>
                  <div className="flex-1 max-h-64 overflow-y-auto space-y-2 pr-1">
                    {currentMessages.length === 0 ? (
                      <div className="text-xs text-gray-500">
                        Hiện chưa có phản hồi nào từ nhân viên cho tranh chấp
                        này. Vui lòng quay lại sau.
                      </div>
                    ) : (
                      currentMessages.map((m) => (
                        <div
                          key={
                            m.disputeMessageId ?? m.createdAt ?? Math.random()
                          }
                          className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs"
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-semibold text-gray-800">
                              Nhân viên #{m.senderUserId ?? "?"}
                            </span>
                            <span className="text-[11px] text-gray-400">
                              {formatDateTime(m.createdAt)}
                            </span>
                          </div>
                          <p className="text-gray-700 whitespace-pre-line">
                            {m.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  <p className="mt-3 text-[11px] text-gray-400">
                    Co-owner chỉ xem được nội dung giải trình từ nhân viên. Nếu
                    cần bổ sung thông tin, vui lòng liên hệ qua kênh hỗ trợ được
                    chỉ định.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoOwnerDispute;
