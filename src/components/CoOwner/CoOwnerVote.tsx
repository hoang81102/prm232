import React, { useEffect, useState, useCallback } from "react";
import { type Vote } from "../../api/voteApi";
import { getUserInfo } from "../../api/authApi";
import { useNavigate, useParams } from "react-router-dom";
import { getVotesByGroup } from "../../api/groupApi";

type UiVoteChoice = "yes" | "no" | null;

interface CoOwnerVoteProps {
  groupId?: number;
  currentUserId?: number;
  currentUserName?: string;
}

const formatDate = (value: string | null | undefined) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const getYourVoteFor = (vote: Vote, currentUserId: number): UiVoteChoice => {
  if (!currentUserId) return null;
  const found = vote.choices?.find((c) => c.userId === currentUserId);
  if (!found) return null;

  const choice = found.choice.toLowerCase();
  if (choice === "yes" || choice === "agree" || choice === "true") return "yes";
  if (choice === "no" || choice === "false") return "no";
  return null;
};

const CoOwnerVote: React.FC<CoOwnerVoteProps> = ({
  groupId,
  currentUserId,
  currentUserName,
}) => {
  const navigate = useNavigate();
  const params = useParams<{ groupId?: string }>();
  const userInfo = getUserInfo() as any | null;

  // ==== Resolve current user ====
  const _currentUserId: number =
    currentUserId ?? (userInfo?.userId as number | undefined) ?? 0;

  const _currentUserName: string =
    currentUserName ??
    userInfo?.fullName ??
    userInfo?.name ??
    userInfo?.email ??
    "Bạn";

  // ==== Resolve groupId (prop -> URL -> userInfo) ====
  const routeGroupId =
    params.groupId && !Number.isNaN(Number(params.groupId))
      ? Number(params.groupId)
      : undefined;

  const _groupId: number =
    groupId ??
    (routeGroupId as number | undefined) ??
    (userInfo?.coOwnerGroupId as number | undefined) ??
    1;

  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(false);

  const loadVotes = useCallback(async () => {
    try {
      setLoading(true);
      const list = await getVotesByGroup(_groupId);
      setVotes(list);
    } catch (err) {
      console.error("GET VOTES ERROR", err);
      alert("Không tải được danh sách bỏ phiếu.");
    } finally {
      setLoading(false);
    }
  }, [_groupId]);

  useEffect(() => {
    void loadVotes();
  }, [loadVotes]);

  // Badge hiển thị trạng thái
  const getStatusBadge = (
    vote: Vote,
    yourVote: UiVoteChoice
  ): React.ReactNode => {
    const base =
      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium";

    const status = vote.status?.toLowerCase() ?? "";
    const total = (vote.totalYes ?? 0) + (vote.totalNo ?? 0);

    if (status === "open") {
      if (yourVote) {
        return (
          <span className={`${base} bg-emerald-50 text-emerald-700`}>
            <span className="mr-1 text-xs">✅</span>
            Bạn đã bỏ phiếu
          </span>
        );
      }

      return (
        <span className={`${base} bg-blue-50 text-blue-700`}>
          <span className="mr-1 text-xs">⏰</span>
          Đang bỏ phiếu
        </span>
      );
    }

    if (status === "closed") {
      if (total === 0) {
        return (
          <span className={`${base} bg-gray-50 text-gray-600`}>
            <span className="mr-1 text-xs">🔒</span>
            Đã đóng
          </span>
        );
      }
      if ((vote.totalYes ?? 0) >= (vote.totalNo ?? 0)) {
        return (
          <span className={`${base} bg-emerald-50 text-emerald-700`}>
            <span className="mr-1 text-xs">✅</span>
            Đã thông qua
          </span>
        );
      }
      return (
        <span className={`${base} bg-red-50 text-red-700`}>
          <span className="mr-1 text-xs">✖</span>
          Không được thông qua
        </span>
      );
    }

    return (
      <span className={`${base} bg-gray-50 text-gray-600`}>
        <span className="mr-1 text-xs">❔</span>
        {vote.status}
      </span>
    );
  };

  return (
    <div className="space-y-6 p-6">
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

      {/* Header — Không còn nút tạo đề xuất */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="mb-2 text-3xl font-bold">
            Bỏ phiếu &amp; Quyết định nhóm
          </h1>
          <p className="text-sm text-gray-500">
            Xem các đề xuất và kết quả bỏ phiếu trong nhóm đồng sở hữu.
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Đang xem các cuộc bỏ phiếu của{" "}
            <span className="font-semibold text-gray-800">
              nhóm ID: {_groupId}
            </span>
            .
          </p>
        </div>
      </div>

      {loading && (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-4 text-center text-sm text-gray-500">
          Đang tải danh sách bỏ phiếu của nhóm {_groupId}...
        </div>
      )}

      {!loading && votes.length === 0 && (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-4 text-center text-sm text-gray-500">
          Chưa có cuộc bỏ phiếu nào trong nhóm {_groupId}.
        </div>
      )}

      {!loading && votes.length > 0 && (
        <div className="space-y-4">
          {votes.map((vote) => {
            const yes = vote.totalYes ?? 0;
            const no = vote.totalNo ?? 0;
            const total = yes + no;
            const yesPercent = total > 0 ? (yes / total) * 100 : 0;
            const noPercent = total > 0 ? (no / total) * 100 : 0;

            const yourVote = getYourVoteFor(vote, _currentUserId);

            return (
              <div
                key={vote.voteId}
                className="rounded-lg border border-gray-200 bg-white shadow-sm"
              >
                <div className="border-b border-gray-200 px-6 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-semibold">{vote.topic}</h2>
                        {getStatusBadge(vote, yourVote)}
                      </div>

                      <p className="text-xs text-gray-500 md:text-sm">
                        Tạo lúc {formatDate(vote.createdAt)} • Bạn đang đăng
                        nhập:{" "}
                        <span className="font-medium">{_currentUserName}</span>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(`/CoOwner/vote/${vote.voteId}`)}
                      className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                    >
                      <span className="mr-1">🔍</span>
                      Xem chi tiết
                    </button>
                  </div>
                </div>

                <div className="space-y-4 px-6 py-4">
                  <p className="text-sm leading-relaxed text-gray-700">
                    {vote.description}
                  </p>

                  {/* Hiển thị kết quả */}
                  {total > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-emerald-700">
                          <span>👍</span>
                          <span>Đồng ý: {yes}</span>
                        </span>
                        <span className="flex items-center gap-2 text-red-600">
                          <span>👎</span>
                          <span>Không đồng ý: {no}</span>
                        </span>
                      </div>

                      <div className="relative h-4 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="absolute left-0 top-0 h-full bg-emerald-500"
                          style={{ width: `${yesPercent}%` }}
                        />
                        <div
                          className="absolute right-0 top-0 h-full bg-red-500"
                          style={{ width: `${noPercent}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{yesPercent.toFixed(0)}% đồng ý</span>
                        <span>Tổng phiếu: {total}</span>
                      </div>
                    </div>
                  )}

                  {/* Không hiển thị nút vote nữa */}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CoOwnerVote;
