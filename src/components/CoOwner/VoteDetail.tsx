// src/components/CoOwner/VoteDetail.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getVoteDetail,
  castVote,
  type Vote,
  type VoteChoice,
} from "../../api/voteApi";
import { getUserInfo } from "../../api/authApi";

type VoteDetailStatus = "loading" | "error" | "ready";

interface VoteDetailProps {
  /** Có thể truyền từ ngoài, nếu không truyền thì sẽ lấy từ getUserInfo() */
  currentUserId?: number;
}

/** ==== FORMAT DATE ==== */
const formatDateTime = (value: string | null | undefined) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const VoteDetail: React.FC<VoteDetailProps> = ({ currentUserId }) => {
  const { voteId } = useParams(); // string | undefined
  const navigate = useNavigate();

  // ⭐ LẤY USER ĐANG ĐĂNG NHẬP TỪ LOCALSTORAGE
  const userInfo = getUserInfo() as any | null;
  const _currentUserId: number =
    currentUserId ?? (userInfo?.userId as number | undefined) ?? 0;
  const hasUser = _currentUserId > 0;

  const [vote, setVote] = useState<Vote | null>(null);
  const [status, setStatus] = useState<VoteDetailStatus>("loading");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCasting, setIsCasting] = useState(false);

  const numericVoteId = useMemo(
    () => (voteId ? Number(voteId) : NaN),
    [voteId]
  );

  /** ==== LOAD DETAIL ==== */
  useEffect(() => {
    if (!voteId || Number.isNaN(numericVoteId)) {
      setStatus("error");
      setErrorMsg("VoteId không hợp lệ.");
      return;
    }

    const load = async () => {
      try {
        setStatus("loading");
        const detail = await getVoteDetail(numericVoteId);
        setVote(detail);
        setStatus("ready");
      } catch (err) {
        console.error("LOAD VOTE DETAIL ERROR", err);
        setErrorMsg("Không tải được chi tiết bỏ phiếu.");
        setStatus("error");
      }
    };

    void load();
  }, [numericVoteId, voteId]);

  /** ==== TÍNH TOÁN TỈ LỆ ==== */
  const safeYes = vote?.totalYes ?? 0;
  const safeNo = vote?.totalNo ?? 0;
  const totalVotes = safeYes + safeNo;
  const yesPercent =
    totalVotes > 0 ? Math.round((safeYes / totalVotes) * 100) : 0;
  const noPercent =
    totalVotes > 0 ? Math.round((safeNo / totalVotes) * 100) : 0;

  /** ==== YOUR VOTE ==== */
  const yourChoice: VoteChoice | undefined = useMemo(() => {
    if (!vote || !hasUser) return undefined;
    const choices = vote.choices ?? [];
    return choices.find((c) => c.userId === _currentUserId);
  }, [vote, _currentUserId, hasUser]);

  const yourChoiceLabel = useMemo(() => {
    if (!yourChoice) return "Chưa bỏ phiếu";
    const c = yourChoice.choice.toLowerCase();
    if (c === "yes" || c === "agree" || c === "true") return "Đồng ý";
    if (c === "no" || c === "disagree" || c === "false") return "Không đồng ý";
    return yourChoice.choice;
  }, [yourChoice]);

  const isOpen = vote?.status === "Open";

  /** ==== UI STATUS BADGE ==== */
  const renderStatusBadge = (status: string) => {
    const base =
      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case "Open":
        return (
          <span className={`${base} bg-blue-50 text-blue-700`}>
            <span className="mr-1 text-xs">⏰</span>
            Đang mở
          </span>
        );
      case "Closed":
        return (
          <span className={`${base} bg-gray-100 text-gray-700`}>
            <span className="mr-1 text-xs">🔒</span>
            Đã đóng
          </span>
        );
      default:
        return (
          <span className={`${base} bg-slate-100 text-slate-700`}>
            {status}
          </span>
        );
    }
  };

  /** ==== CAST VOTE ==== */
  const handleCast = async (agree: boolean) => {
    if (!vote || Number.isNaN(numericVoteId)) return;
    if (!hasUser) {
      alert("Không xác định được user hiện tại. Vui lòng đăng nhập lại.");
      return;
    }
    if (isCasting) return;

    try {
      setIsCasting(true);
      await castVote(numericVoteId, agree);
      // gọi lại detail để cập nhật kết quả
      const detail = await getVoteDetail(numericVoteId);
      setVote(detail);
      alert("Đã ghi nhận phiếu bầu của bạn!");
    } catch (err) {
      console.error("CAST VOTE ERROR", err);
      alert("Bỏ phiếu thất bại, vui lòng thử lại.");
    } finally {
      setIsCasting(false);
    }
  };

  /** ==== LOADING / ERROR ==== */
  if (status === "loading") {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-600 shadow-sm">
          Đang tải chi tiết bỏ phiếu...
        </div>
      </div>
    );
  }

  if (status === "error" || !vote) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm">
          {errorMsg ?? "Đã xảy ra lỗi."}
        </div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-4 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          ← Quay lại
        </button>
      </div>
    );
  }

  const choices = vote.choices ?? [];

  return (
    <div className="space-y-6 p-6">
      {/* Header + Back */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-2 inline-flex items-center text-xs text-gray-500 hover:text-gray-700"
          >
            <span className="mr-1">←</span> Quay lại danh sách
          </button>
          <h1 className="mb-1 text-2xl font-bold">{vote.topic}</h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <span>Được tạo lúc: {formatDateTime(vote.createdAt)}</span>
            <span className="mx-1">•</span>
            {renderStatusBadge(vote.status)}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm">
          <div className="text-xs text-gray-500">Kết quả tổng</div>
          <div className="mt-1 flex items-baseline gap-3">
            <span className="text-lg font-semibold text-emerald-600">
              👍 {safeYes}
            </span>
            <span className="text-lg font-semibold text-red-500">
              👎 {safeNo}
            </span>
          </div>
          <div className="mt-1 text-xs text-gray-500">
            Tổng phiếu: {totalVotes}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-2 text-base font-semibold text-gray-800">
          Mô tả đề xuất
        </h2>
        <p className="text-sm leading-relaxed text-gray-700">
          {vote.description}
        </p>
      </div>

      {/* Result Bar + Your vote */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Biểu đồ kết quả */}
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-gray-800">
            Tỉ lệ phiếu
          </h3>
          <div className="mb-2 flex items-center justify-between text-xs text-gray-600">
            <span className="flex items-center gap-1 text-emerald-700">
              👍 Đồng ý: {safeYes} ({yesPercent}%)
            </span>
            <span className="flex items-center gap-1 text-red-600">
              👎 Không đồng ý: {safeNo} ({noPercent}%)
            </span>
          </div>
          <div className="relative h-4 overflow-hidden rounded-full bg-gray-100">
            <div
              className="absolute left-0 top-0 h-full bg-emerald-500 transition-all"
              style={{ width: `${yesPercent}%` }}
            />
            <div
              className="absolute right-0 top-0 h-full bg-red-500 transition-all"
              style={{ width: `${noPercent}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Tỉ lệ được tính trên tổng số phiếu hiện tại.
          </p>
        </div>

        {/* Your vote + buttons */}
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-gray-800">
            Phiếu của bạn
          </h3>

          {!hasUser ? (
            <p className="text-sm text-gray-500">
              Không xác định được tài khoản hiện tại (chưa đăng nhập hoặc userId
              = 0).
            </p>
          ) : (
            <>
              <div className="mb-3 rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-700">
                Trạng thái:{" "}
                <strong>
                  {yourChoice ? yourChoiceLabel : "Chưa bỏ phiếu"}
                </strong>
              </div>

              {isOpen ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={isCasting}
                    onClick={() => void handleCast(true)}
                    className="flex-1 rounded-md border border-emerald-500 bg-white px-4 py-2 text-sm font-medium text-emerald-600 shadow-sm hover:bg-emerald-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span className="mr-1">👍</span> Đồng ý
                  </button>
                  <button
                    type="button"
                    disabled={isCasting}
                    onClick={() => void handleCast(false)}
                    className="flex-1 rounded-md border border-red-500 bg-white px-4 py-2 text-sm font-medium text-red-600 shadow-sm hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span className="mr-1">👎</span> Không đồng ý
                  </button>
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Cuộc bỏ phiếu đã đóng, không thể thay đổi phiếu.
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Danh sách từng phiếu */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-gray-800">
          Chi tiết từng phiếu
        </h3>
        {choices.length === 0 ? (
          <p className="text-sm text-gray-500">Chưa có ai bỏ phiếu.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b text-xs text-gray-500">
                  <th className="px-2 py-2">UserId</th>
                  <th className="px-2 py-2">Lựa chọn</th>
                  <th className="px-2 py-2">Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {choices.map((c) => {
                  const isYou = hasUser && c.userId === _currentUserId;
                  const normalized = c.choice.toLowerCase();
                  const isYes =
                    normalized === "yes" ||
                    normalized === "agree" ||
                    normalized === "true";

                  return (
                    <tr
                      key={`${c.userId}-${c.votedAt}`}
                      className="border-b last:border-b-0"
                    >
                      <td className="px-2 py-1">
                        {c.userId}
                        {isYou && (
                          <span className="ml-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] text-indigo-700">
                            Bạn
                          </span>
                        )}
                      </td>
                      <td className="px-2 py-1">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            isYes
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {isYes ? "Đồng ý" : "Không đồng ý"}
                        </span>
                      </td>
                      <td className="px-2 py-1 text-xs text-gray-500">
                        {formatDateTime(c.votedAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoteDetail;
