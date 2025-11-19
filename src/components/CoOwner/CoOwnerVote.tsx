import React, { useState } from "react";

type ProposalStatus = "active" | "approved" | "rejected";
type VoteChoice = "yes" | "no" | null;

interface VoteStats {
  yes: number;
  no: number;
  total: number;
}

interface Proposal {
  id: number;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
  deadline: string;
  status: ProposalStatus;
  votes: VoteStats;
  yourVote: VoteChoice;
}

interface NewProposalState {
  title: string;
  description: string;
  deadline: string;
}

// Mock data - Proposals/Voting
const proposals: Proposal[] = [
  {
    id: 1,
    title: "Nâng cấp bảo hiểm toàn diện",
    description:
      "Đề xuất nâng cấp gói bảo hiểm từ cơ bản lên toàn diện để bảo vệ tốt hơn cho xe và các thành viên.",
    createdBy: "Nguyễn Văn A",
    createdAt: "2025-11-08",
    deadline: "2025-11-15",
    status: "active",
    votes: {
      yes: 3,
      no: 1,
      total: 5,
    },
    yourVote: null,
  },
  {
    id: 2,
    title: "Mua thêm xe thứ 4",
    description:
      "Đề xuất mua thêm một xe điện để đáp ứng nhu cầu sử dụng ngày càng tăng của nhóm.",
    createdBy: "Trần Thị B",
    createdAt: "2025-11-05",
    deadline: "2025-11-12",
    status: "active",
    votes: {
      yes: 4,
      no: 0,
      total: 5,
    },
    yourVote: "yes",
  },
  {
    id: 3,
    title: "Thay đổi quy định thời gian booking",
    description:
      "Đề xuất yêu cầu đặt lịch trước ít nhất 24 giờ thay vì 12 giờ như hiện tại.",
    createdBy: "Bạn",
    createdAt: "2025-11-01",
    deadline: "2025-11-10",
    status: "approved",
    votes: {
      yes: 5,
      no: 0,
      total: 5,
    },
    yourVote: "yes",
  },
  {
    id: 4,
    title: "Giảm tỷ lệ hủy phạt",
    description:
      "Đề xuất giảm mức phạt khi hủy booking từ 100k xuống 50k để linh hoạt hơn.",
    createdBy: "Lê Văn C",
    createdAt: "2025-10-28",
    deadline: "2025-11-05",
    status: "rejected",
    votes: {
      yes: 1,
      no: 4,
      total: 5,
    },
    yourVote: "no",
  },
];

const CoOwnerVote: React.FC = () => {
  const [showNewProposal, setShowNewProposal] = useState<boolean>(false);
  const [newProposal, setNewProposal] = useState<NewProposalState>({
    title: "",
    description: "",
    deadline: "",
  });

  const handleCreateProposal = (): void => {
    console.log("Tạo đề xuất mới:", newProposal);
    alert("Đã tạo đề xuất! (Mock data - không lưu thực tế)");
    setShowNewProposal(false);
    setNewProposal({
      title: "",
      description: "",
      deadline: "",
    });
  };

  const handleVote = (
    proposalId: number,
    vote: Exclude<VoteChoice, null>
  ): void => {
    console.log(`Bỏ phiếu ${vote} cho proposal ${proposalId}`);
    alert(`Đã bỏ phiếu ${vote === "yes" ? "Đồng ý" : "Không đồng ý"}!`);
  };

  // ⬇️ ĐÃ SỬA: bỏ JSX.Element, dùng React.ReactNode (hoặc có thể bỏ type luôn)
  const getStatusBadge = (status: ProposalStatus): React.ReactNode => {
    const base =
      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case "active":
        return (
          <span className={`${base} bg-blue-50 text-blue-700`}>
            <span className="mr-1 text-xs">⏰</span>
            Đang bỏ phiếu
          </span>
        );
      case "approved":
        return (
          <span className={`${base} bg-emerald-50 text-emerald-700`}>
            <span className="mr-1 text-xs">✅</span>
            Đã thông qua
          </span>
        );
      case "rejected":
        return (
          <span className={`${base} bg-red-50 text-red-700`}>
            <span className="mr-1 text-xs">✖</span>
            Bị từ chối
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="mb-2 text-3xl font-bold">
            Bỏ phiếu &amp; Quyết định nhóm
          </h1>
          <p className="text-sm text-gray-500">
            Tạo đề xuất và bỏ phiếu cho các quyết định quan trọng
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowNewProposal((prev) => !prev)}
          className="inline-flex items-center rounded-md bg-linear-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <span className="mr-2 text-lg">＋</span>
          Tạo đề xuất mới
        </button>
      </div>

      {/* Form tạo đề xuất */}
      {showNewProposal && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Tạo đề xuất mới</h2>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Tiêu đề đề xuất *
              </label>
              <input
                id="title"
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={newProposal.title}
                onChange={(e) =>
                  setNewProposal((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="VD: Nâng cấp bảo hiểm toàn diện"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Mô tả chi tiết *
              </label>
              <textarea
                id="description"
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={newProposal.description}
                onChange={(e) =>
                  setNewProposal((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Mô tả lý do, lợi ích và chi phí dự kiến..."
                rows={4}
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="deadline"
                className="block text-sm font-medium text-gray-700"
              >
                Hạn bỏ phiếu
              </label>
              <input
                id="deadline"
                type="date"
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={newProposal.deadline}
                onChange={(e) =>
                  setNewProposal((prev) => ({
                    ...prev,
                    deadline: e.target.value,
                  }))
                }
              />
            </div>

            <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
              <strong>Lưu ý:</strong> Đề xuất cần được ít nhất 60% thành viên
              đồng ý để thông qua. Các thành viên có tỷ lệ sở hữu cao hơn sẽ có
              trọng số bỏ phiếu cao hơn.
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCreateProposal}
                className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Tạo đề xuất
              </button>
              <button
                type="button"
                onClick={() => setShowNewProposal(false)}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Danh sách proposals */}
      <div className="space-y-4">
        {proposals.map((proposal) => {
          const yesPercent =
            proposal.votes.total > 0
              ? (proposal.votes.yes / proposal.votes.total) * 100
              : 0;
          const noPercent =
            proposal.votes.total > 0
              ? (proposal.votes.no / proposal.votes.total) * 100
              : 0;

          return (
            <div
              key={proposal.id}
              className="rounded-lg border border-gray-200 bg-white shadow-sm"
            >
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold">
                        {proposal.title}
                      </h2>
                      {getStatusBadge(proposal.status)}
                    </div>
                    <p className="text-xs text-gray-500 md:text-sm">
                      Bởi {proposal.createdBy} • {proposal.createdAt}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 px-6 py-4">
                <p className="text-sm leading-relaxed text-gray-700">
                  {proposal.description}
                </p>

                {/* Kết quả bỏ phiếu */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-emerald-700">
                      <span>👍</span>
                      <span>Đồng ý: {proposal.votes.yes}</span>
                    </span>
                    <span className="flex items-center gap-2 text-red-600">
                      <span>👎</span>
                      <span>Không đồng ý: {proposal.votes.no}</span>
                    </span>
                  </div>

                  <div className="relative h-4 overflow-hidden rounded-full bg-gray-100">
                    {/* Yes bar */}
                    <div
                      className="absolute left-0 top-0 h-full bg-emerald-500 transition-all"
                      style={{ width: `${yesPercent}%` }}
                    />
                    {/* No bar */}
                    <div
                      className="absolute right-0 top-0 h-full bg-red-500 transition-all"
                      style={{ width: `${noPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{yesPercent.toFixed(0)}% đồng ý</span>
                    <span>Hạn chót: {proposal.deadline}</span>
                  </div>
                </div>

                {/* Nút bỏ phiếu */}
                {proposal.status === "active" && (
                  <div className="flex gap-2 pt-2">
                    {proposal.yourVote ? (
                      <div className="w-full rounded-lg bg-gray-50 p-3 text-center text-sm text-gray-700">
                        Bạn đã bỏ phiếu:{" "}
                        <strong>
                          {proposal.yourVote === "yes"
                            ? "Đồng ý"
                            : "Không đồng ý"}
                        </strong>
                      </div>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="flex-1 rounded-md border border-emerald-500 bg-white px-4 py-2 text-sm font-medium text-emerald-600 shadow-sm hover:bg-emerald-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                          onClick={() => handleVote(proposal.id, "yes")}
                        >
                          <span className="mr-2">👍</span>
                          Đồng ý
                        </button>
                        <button
                          type="button"
                          className="flex-1 rounded-md border border-red-500 bg-white px-4 py-2 text-sm font-medium text-red-600 shadow-sm hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          onClick={() => handleVote(proposal.id, "no")}
                        >
                          <span className="mr-2">👎</span>
                          Không đồng ý
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CoOwnerVote;
