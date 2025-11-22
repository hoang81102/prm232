import React, { useEffect, useState } from "react";
import { getMyGroups, type CoOwnerGroupSummary } from "../../api/groupApi";
import { useNavigate } from "react-router-dom";

const GroupList: React.FC = () => {
  const [groups, setGroups] = useState<CoOwnerGroupSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getMyGroups();
      setGroups(data);
    } catch (err) {
      console.error("LOAD GROUPS ERROR", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const formatDate = (value?: string | null) => {
    if (!value) return "Không rõ";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "Không rõ";
    return d.toLocaleDateString("vi-VN");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Nhóm đồng sở hữu của tôi
            </h1>
            <p className="mt-1 text-sm text-gray-600 max-w-xl">
              Danh sách các nhóm đồng sở hữu mà bạn đang tham gia. Bấm vào từng
              nhóm để xem chi tiết thành viên, tỷ lệ sở hữu và cấu hình nhóm.
            </p>
          </div>

          <button
            type="button"
            onClick={loadData}
            className="inline-flex items-center rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs md:text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <span className="mr-1">🔄</span>
            Tải lại danh sách
          </button>
        </div>

        {/* Summary / trạng thái */}
        <div className="flex flex-wrap items-center gap-3">
          {loading ? (
            <span className="text-sm text-gray-500">
              Đang tải danh sách nhóm...
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm border border-gray-200">
              👥 Bạn đang tham gia{" "}
              <span className="mx-1 font-semibold">{groups.length}</span> nhóm
              đồng sở hữu
            </span>
          )}
        </div>

        {/* Không có nhóm */}
        {!loading && groups.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-4 py-6 text-center text-sm text-gray-500">
            Bạn chưa tham gia nhóm đồng sở hữu nào.
            <br />
            Vui lòng liên hệ quản trị viên hoặc sử dụng tính năng tạo nhóm nếu
            được cấp quyền.
          </div>
        )}

        {/* Danh sách nhóm */}
        {!loading && groups.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {groups.map((g) => (
              <button
                key={g.coOwnerGroupId}
                type="button"
                onClick={() =>
                  navigate(`/CoOwner/grouppage/${g.coOwnerGroupId}`)
                }
                className="group text-left rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-400 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-base md:text-lg font-semibold text-gray-900 group-hover:text-orange-600">
                      {g.groupName}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Mã nhóm:{" "}
                      <span className="font-mono text-[11px] bg-gray-100 px-2 py-0.5 rounded-full">
                        {g.coOwnerGroupId}
                      </span>
                    </p>
                  </div>
                  <span className="mt-1 text-gray-400 group-hover:text-orange-500">
                    ➜
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span>
                    Ngày tạo:{" "}
                    <span className="font-medium">
                      {formatDate(g.createdAt)}
                    </span>
                  </span>
                  {/* chừa chỗ sau này nếu muốn show thêm số thành viên */}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupList;
