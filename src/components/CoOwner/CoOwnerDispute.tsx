// src/components/CoOwner/CoOwnerDispute.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createDispute,
  getDisputeById,
  getDisputesByGroup,
  type Dispute,
} from "../../api/disputeApi";
import { getUserInfo } from "../../api/authApi";

interface CoOwnerDisputeProps {
  groupId?: number;
}

// Format datetime cho UI
const formatDateTime = (value?: string | null) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value ?? "";
  return d.toLocaleString("vi-VN");
};

// Badge trạng thái
const statusBadge = (status?: string) => {
  const base =
    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium";
  const s = (status ?? "").toLowerCase();

  if (s === "open") {
    return (
      <span className={`${base} bg-amber-50 text-amber-700`}>
        <span className="mr-1 text-xs">⏰</span>Đang mở
      </span>
    );
  }

  if (s === "resolved") {
    return (
      <span className={`${base} bg-emerald-50 text-emerald-700`}>
        <span className="mr-1 text-xs">✅</span>Đã giải quyết
      </span>
    );
  }

  if (s === "closed") {
    return (
      <span className={`${base} bg-gray-100 text-gray-700`}>
        <span className="mr-1 text-xs">🔒</span>Đã đóng
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

  // 1. Xác định groupId đang thao tác
  const routeGroupId =
    params.groupId && !Number.isNaN(Number(params.groupId))
      ? Number(params.groupId)
      : undefined;

  const _groupId: number =
    groupId ??
    (routeGroupId as number | undefined) ??
    (userInfo?.coOwnerGroupId as number | undefined) ??
    1;

  // =========================
  // STATE FORM TẠO KHIẾU NẠI
  // =========================
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

  // =========================
  // STATE DANH SÁCH KHIẾU NẠI
  // dùng Dispute[] | null để phân biệt "chưa load" và "đã load nhưng rỗng"
  // =========================
  const [disputes, setDisputes] = useState<Dispute[] | null>(null);
  const [loadingList, setLoadingList] = useState(false);

  // =========================
  // STATE CHI TIẾT KHIẾU NẠI
  // =========================
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // =====================================================
  // 2. LẤY DANH SÁCH KHIẾU NẠI CỦA GROUP
  //    GET /groups/api/Disputes/group/{groupId}
  // =====================================================
  const fetchDisputes = async () => {
    try {
      setLoadingList(true);
      const data = await getDisputesByGroup(_groupId);
      // phòng trường hợp API trả null/undefined
      const safeData = Array.isArray(data) ? data : [];
      setDisputes(safeData);

      if (!selectedId && safeData.length > 0) {
        setSelectedId(safeData[0].disputeId);
        setSelectedDispute(safeData[0]);
      }
    } catch {
      // lỗi đã toast ở api
      setDisputes([]);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_groupId]);

  // =====================================================
  // 1. TẠO KHIẾU NẠI
  //    POST /groups/api/Disputes
  // =====================================================
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

      // Thêm dispute mới vào danh sách (lên đầu)
      setDisputes((prev) => {
        const current = prev ?? [];
        return [created, ...current];
      });

      // Chọn dispute mới tạo để xem chi tiết
      setSelectedId(created.disputeId);
      setSelectedDispute(created);

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

  // =====================================================
  // 3. XEM CHI TIẾT KHIẾU NẠI
  //    GET /groups/api/Disputes/{id}
  // =====================================================
  const handleSelectDispute = async (id: number) => {
    setSelectedId(id);
    try {
      setLoadingDetail(true);
      const data = await getDisputeById(id);
      setSelectedDispute(data);

      // Đồng bộ lại item trong list
      setDisputes((prev) => {
        const current = prev ?? [];
        return current.map((d) => (d.disputeId === id ? data : d));
      });
    } catch {
      // lỗi đã toast ở api
    } finally {
      setLoadingDetail(false);
    }
  };

  const messages = selectedDispute?.messages ?? [];

  // để tránh .length trên null/undefined
  const safeDisputes: Dispute[] = disputes ?? [];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Quay lại trang nhóm */}
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

      {/* Tiêu đề trang */}
      <header>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Khiếu nại &amp; Tranh chấp
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Tại đây bạn có thể <b>tạo khiếu nại</b>,{" "}
          <b>xem danh sách khiếu nại của nhóm</b> và{" "}
          <b>xem chi tiết từng khiếu nại</b>.
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Đang thao tác cho <b>nhóm ID: {_groupId}</b>.
        </p>
      </header>

      {/* Layout 2 cột: trái = tạo + list, phải = chi tiết */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cột trái: Tạo khiếu nại + Danh sách */}
        <div className="space-y-4">
          {/* 1. Tạo khiếu nại */}
          <section className="bg-white rounded-2xl shadow border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">📝</span>
              <h2 className="text-lg font-semibold text-gray-800">
                1. Tạo khiếu nại mới
              </h2>
            </div>

            <form className="space-y-3" onSubmit={handleCreateDispute}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiêu đề khiếu nại <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Ví dụ: Tranh chấp về lịch sử sử dụng xe ngày 10/10"
                  value={createForm.title}
                  onChange={(e) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
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
                  Nếu tranh chấp liên quan đến một lịch đặt xe cụ thể, hãy nhập
                  mã booking để nhân viên dễ tra cứu.
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
          </section>

          {/* 2. Danh sách khiếu nại */}
          <section className="bg-white rounded-2xl shadow border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">📃</span>
                <h2 className="text-lg font-semibold text-gray-800">
                  2. Danh sách khiếu nại của nhóm
                </h2>
              </div>
              <button
                type="button"
                onClick={fetchDisputes}
                className="text-xs px-3 py-1 rounded-full border border-gray-200 bg-gray-50 hover:bg-gray-100"
              >
                Làm mới
              </button>
            </div>

            {loadingList && disputes === null ? (
              <p className="text-xs text-gray-500">
                Đang tải danh sách khiếu nại...
              </p>
            ) : safeDisputes.length === 0 ? (
              <p className="text-xs text-gray-500">
                Chưa có khiếu nại nào cho nhóm này.
              </p>
            ) : (
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {safeDisputes.map((d) => {
                  const isSelected = d.disputeId === selectedId;
                  return (
                    <button
                      key={d.disputeId}
                      type="button"
                      onClick={() => handleSelectDispute(d.disputeId)}
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
          </section>
        </div>

        {/* Cột phải: Chi tiết khiếu nại */}
        <section className="bg-white rounded-2xl shadow border border-gray-100 p-5 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🔍</span>
            <h2 className="text-lg font-semibold text-gray-800">
              3. Chi tiết khiếu nại
            </h2>
          </div>

          {loadingDetail && !selectedDispute ? (
            <p className="text-xs text-gray-500">
              Đang tải chi tiết khiếu nại...
            </p>
          ) : !selectedDispute ? (
            <p className="text-xs text-gray-500">
              Hãy chọn một khiếu nại ở danh sách bên trái để xem chi tiết.
            </p>
          ) : (
            <>
              {/* Thông tin chung */}
              <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 mb-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-gray-500">
                      Dispute ID:{" "}
                      <span className="font-mono font-semibold text-gray-800">
                        #{selectedDispute.disputeId}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Thuộc nhóm:{" "}
                      <span className="font-semibold text-gray-800">
                        {selectedDispute.coOwnerGroupId ?? _groupId}
                      </span>
                    </p>
                    {selectedDispute.relatedBookingId && (
                      <p className="text-xs text-gray-500">
                        Booking liên quan:{" "}
                        <span className="font-semibold text-gray-800">
                          #{selectedDispute.relatedBookingId}
                        </span>
                      </p>
                    )}
                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {selectedDispute.title}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Tạo lúc:{" "}
                      {formatDateTime(selectedDispute.createdAt) ||
                        "Không rõ thời gian"}{" "}
                      • Người tạo ID:{" "}
                      <span className="font-semibold text-gray-800">
                        {selectedDispute.createdByUserId ??
                          selectedDispute.raisedByUserId ??
                          "Không rõ"}
                      </span>
                    </p>
                  </div>
                  <div>{statusBadge(selectedDispute.status)}</div>
                </div>

                <p className="mt-2 text-sm text-gray-700">
                  {selectedDispute.description}
                </p>
              </div>

              {/* Các message (nếu BE trả về) */}
              <div className="flex-1 flex flex-col min-h-40">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Trao đổi / phản hồi
                </h3>
                <div className="flex-1 max-h-64 overflow-y-auto space-y-2 pr-1">
                  {messages.length === 0 ? (
                    <p className="text-xs text-gray-500">
                      Chưa có phản hồi nào cho khiếu nại này.
                    </p>
                  ) : (
                    messages.map((m) => (
                      <div
                        key={m.disputeMessageId ?? m.createdAt ?? Math.random()}
                        className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-semibold text-gray-800">
                            Người gửi #{m.senderUserId ?? "?"}
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
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default CoOwnerDispute;
