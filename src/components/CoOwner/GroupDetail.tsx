// src/components/CoOwner/GroupDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGroupById, type CoOwnerGroupDetail } from "../../api/groupApi";

const GroupDetail: React.FC = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState<CoOwnerGroupDetail | null>(null);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    if (!groupId) return;
    try {
      setLoading(true);
      const data = await getGroupById(Number(groupId));
      setGroup(data);
    } catch (err) {
      console.error("LOAD GROUP DETAIL ERROR", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [groupId]);

  if (loading) {
    return <div className="p-6 text-gray-500 text-sm">Đang tải...</div>;
  }

  if (!group) {
    return (
      <div className="p-6 text-gray-500 text-sm">Không tìm thấy nhóm.</div>
    );
  }

  const groupName = (group as any).groupName ?? "";
  const groupIdDisplay =
    (group as any).groupId ?? (group as any).coOwnerGroupId ?? "";
  const createdAtLabel = group.createdAt
    ? new Date(group.createdAt).toLocaleString("vi-VN")
    : "Không rõ";

  const routeGroupId = groupId ?? String(groupIdDisplay);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* 🔙 Nút quay lại */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 
                   px-4 py-2 rounded-xl bg-white border border-gray-200 shadow-sm 
                   hover:bg-gray-100 transition"
      >
        <span className="text-lg">⬅️</span> Quay lại
      </button>

      {/* Thông tin nhóm */}
      <div className="bg-white rounded-2xl shadow border border-gray-100 px-6 py-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {groupName}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Ngày tạo:{" "}
              <span className="font-medium text-gray-800">
                {createdAtLabel}
              </span>
            </p>
          </div>

          <div className="mt-2 md:mt-0 text-sm text-gray-500">
            Mã nhóm:{" "}
            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 font-mono text-xs font-semibold text-gray-800">
              {groupIdDisplay}
            </span>
          </div>
        </div>
      </div>

      {/* Danh sách thành viên */}
      <div className="bg-white rounded-2xl shadow border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Thành viên trong nhóm
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Tổng số: {group.members.length} thành viên.
            </p>
          </div>
        </div>

        {group.members.length === 0 ? (
          <div className="px-6 py-4 text-sm text-gray-500">
            Nhóm hiện chưa có thành viên nào.
          </div>
        ) : (
          <div className="px-6 py-4 space-y-3">
            {group.members.map((m, idx) => {
              const percent = (m.sharePercent ?? 0) * 100;

              return (
                <div
                  key={idx}
                  className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between 
                             rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="text-sm text-gray-600">
                      User ID:{" "}
                      <span className="font-semibold text-gray-900">
                        {m.userId}
                      </span>
                    </p>

                    <span
                      className={`mt-1 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                        m.isAdmin
                          ? "bg-orange-100 text-orange-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {m.isAdmin ? "🏆 Trưởng nhóm" : "👥 Thành viên"}
                    </span>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {percent.toFixed(0)}%
                    </p>
                    <p className="text-xs text-gray-500">Tỷ lệ sở hữu</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4 chức năng lớn */}
      <div className="bg-white rounded-2xl shadow border border-gray-100 px-6 py-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Tính năng cho nhóm này
        </h2>
        <p className="text-xs text-gray-500 mb-4">
          Chọn một mục bên dưới để thao tác cho nhóm{" "}
          <span className="font-semibold">{groupName}</span>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Vote */}
          <button
            onClick={() => navigate(`/CoOwner/grouppage/${routeGroupId}/votes`)}
            className="rounded-2xl border border-indigo-100 bg-indigo-50/60 
                       hover:border-indigo-400 hover:bg-indigo-50 transition shadow-sm p-4 text-left"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🗳</span>
              <div>
                <p className="text-sm font-semibold text-indigo-800">
                  Bỏ phiếu (Vote)
                </p>
                <p className="text-xs text-indigo-700/80">
                  Xem các đề xuất và kết quả bỏ phiếu.
                </p>
              </div>
            </div>
            <span className="text-xs font-medium text-indigo-700">
              Nhấn để vào trang bỏ phiếu →
            </span>
          </button>

          {/* Dispute */}
          <button
            onClick={() =>
              navigate(`/CoOwner/grouppage/${routeGroupId}/disputes`)
            }
            className="rounded-2xl border border-rose-100 bg-rose-50/60 
                       hover:border-rose-400 hover:bg-rose-50 transition shadow-sm p-4 text-left"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="text-sm font-semibold text-rose-800">
                  Khiếu nại / Tranh chấp
                </p>
                <p className="text-xs text-rose-700/80">
                  Tạo và theo dõi các tranh chấp.
                </p>
              </div>
            </div>
            <span className="text-xs font-medium text-rose-700">
              Nhấn để quản lý khiếu nại →
            </span>
          </button>

          {/* Contracts */}
          <button
            onClick={() =>
              navigate(`/CoOwner/grouppage/${routeGroupId}/contracts`)
            }
            className="rounded-2xl border border-emerald-100 bg-emerald-50/60 
                       hover:border-emerald-400 hover:bg-emerald-50 transition shadow-sm p-4 text-left"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">📄</span>
              <div>
                <p className="text-sm font-semibold text-emerald-800">
                  Hợp đồng
                </p>
                <p className="text-xs text-emerald-700/80">
                  Thông tin & tài liệu hợp đồng.
                </p>
              </div>
            </div>
            <span className="text-xs font-medium text-emerald-700">
              Nhấn để xem hợp đồng →
            </span>
          </button>

          {/* Payments */}
          <button
            onClick={() =>
              navigate(`/CoOwner/grouppage/${routeGroupId}/payments`)
            }
            className="rounded-2xl border border-orange-100 bg-orange-50/60 
                       hover:border-orange-400 hover:bg-orange-50 transition shadow-sm p-4 text-left"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">💰</span>
              <div>
                <p className="text-sm font-semibold text-orange-800">
                  Thanh toán / Chi phí
                </p>
                <p className="text-xs text-orange-700/80">
                  Theo dõi phí & công nợ.
                </p>
              </div>
            </div>
            <span className="text-xs font-medium text-orange-700">
              Nhấn để xem thanh toán →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupDetail;
