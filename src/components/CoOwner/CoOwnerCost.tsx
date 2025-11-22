// src/components/CoOwner/CoOwnerCost.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserInfo } from "../../api/authApi";
import {
  getGroupFund,
  getGroupFundHistory,
  depositToFund,
  type GroupFund,
  type FundHistoryEntry,
} from "../../api/financeApi";

interface DepositFormState {
  amount: string;
  reason: string;
}

interface CoOwnerCostProps {
  groupId?: number;
}

const CoOwnerCost: React.FC<CoOwnerCostProps> = ({ groupId }) => {
  const params = useParams<{ groupId?: string }>();
  const userInfo = getUserInfo() as any | null;

  // Xác định groupId đang dùng
  const routeGroupId =
    params.groupId && !Number.isNaN(Number(params.groupId))
      ? Number(params.groupId)
      : undefined;

  const _groupId: number =
    groupId ??
    (routeGroupId as number | undefined) ??
    (userInfo?.coOwnerGroupId as number | undefined) ??
    1;

  // ====== STATE QUỸ ======
  const [fund, setFund] = useState<GroupFund | null>(null);
  const [fundHistory, setFundHistory] = useState<FundHistoryEntry[]>([]);
  const [loadingFund, setLoadingFund] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // ====== STATE NẠP QUỸ ======
  const [depositForm, setDepositForm] = useState<DepositFormState>({
    amount: "",
    reason: "",
  });
  const [depositing, setDepositing] = useState(false);

  // =========================
  // Helpers
  // =========================
  const formatCurrency = (amount: number): string =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const formatDateTime = (value: string) => {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleString("vi-VN");
  };

  // Tính toán tổng theo history
  const totalDeposited = fundHistory.reduce(
    (sum, h) => (h.changeAmount > 0 ? sum + h.changeAmount : sum),
    0
  );
  const totalSpent = fundHistory.reduce(
    (sum, h) => (h.changeAmount < 0 ? sum + Math.abs(h.changeAmount) : sum),
    0
  );
  const currentBalance = fund?.amount ?? 0;

  // =========================
  // CALL API: FUND + HISTORY
  // =========================
  const fetchFund = async () => {
    try {
      setLoadingFund(true);
      const data = await getGroupFund(_groupId);
      setFund(data);
    } catch {
      // lỗi đã toast trong api
    } finally {
      setLoadingFund(false);
    }
  };

  const fetchFundHistory = async () => {
    try {
      setLoadingHistory(true);
      const data = await getGroupFundHistory(_groupId);
      setFundHistory(data);
    } catch {
      // lỗi đã toast trong api
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchFund();
    fetchFundHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_groupId]);

  // =========================
  // HANDLE: NẠP QUỸ
  // POST /finance/api/Funds/deposit
  // =========================
  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amountNum = Number(depositForm.amount);
    if (!amountNum || amountNum <= 0) {
      alert("Số tiền nạp phải lớn hơn 0");
      return;
    }

    try {
      setDepositing(true);
      await depositToFund({
        coOwnerGroupId: _groupId,
        amount: amountNum,
        reason: depositForm.reason.trim() || "Nạp quỹ",
      });

      // reload quỹ + history
      await Promise.all([fetchFund(), fetchFundHistory()]);

      setDepositForm({ amount: "", reason: "" });
    } catch {
      // đã toast trong api
    } finally {
      setDepositing(false);
    }
  };

  // =========================
  // RENDER
  // =========================
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Quỹ &amp; Chi phí chung</h1>
          <p className="text-sm text-gray-500">
            Xem số dư quỹ, lịch sử giao dịch và ghi nhận chi phí chung cho nhóm.
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Đang thao tác cho <b>nhóm ID: {_groupId}</b>.
          </p>
        </div>
      </div>

      {/* Tổng quan quỹ */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Số dư hiện tại */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
            <span className="text-lg">🏦</span>
            <span>Số dư quỹ hiện tại</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600">
            {loadingFund ? "Đang tải..." : formatCurrency(currentBalance)}
          </p>
          <p className="mt-1 text-xs text-gray-500">Cập nhật theo hệ thống</p>
        </div>

        {/* Tổng nạp */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
            <span className="text-lg">💰</span>
            <span>Tổng nạp vào quỹ</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">
            {formatCurrency(totalDeposited)}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Tính trên toàn bộ lịch sử
          </p>
        </div>

        {/* Tổng chi */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
            <span className="text-lg">📉</span>
            <span>Tổng chi từ quỹ</span>
          </div>
          <p className="text-2xl font-bold text-rose-600">
            {formatCurrency(totalSpent)}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Bao gồm các khoản chi chung được ghi nhận
          </p>
        </div>
      </div>

      {/* Form nạp quỹ */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Nạp tiền vào quỹ nhóm</h2>
        <form
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
          onSubmit={handleDeposit}
        >
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Số tiền nạp (VNĐ) *
            </label>
            <input
              type="number"
              min={0}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={depositForm.amount}
              onChange={(e) =>
                setDepositForm((prev) => ({ ...prev, amount: e.target.value }))
              }
              placeholder="100000"
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Lý do nạp
            </label>
            <input
              type="text"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={depositForm.reason}
              onChange={(e) =>
                setDepositForm((prev) => ({ ...prev, reason: e.target.value }))
              }
              placeholder="Nạp quỹ lần đầu, nạp bổ sung..."
            />
          </div>
          <div className="md:col-span-3 flex justify-end">
            <button
              type="submit"
              disabled={depositing}
              className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-60"
            >
              {depositing ? "Đang nạp..." : "Nạp quỹ"}
            </button>
          </div>
        </form>
      </div>
      {/* Lịch sử giao dịch quỹ */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <span className="text-xl">📜</span>
            <span>Lịch sử giao dịch quỹ</span>
          </h2>
        </div>
        <div className="overflow-x-auto px-6 py-4">
          {loadingHistory ? (
            <p className="text-sm text-gray-500">Đang tải lịch sử...</p>
          ) : fundHistory.length === 0 ? (
            <p className="text-sm text-gray-500">
              Chưa có giao dịch nào cho quỹ của nhóm này.
            </p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Thời gian
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Số tiền thay đổi
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Loại
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Lý do
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Người thực hiện
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {fundHistory.map((h, idx) => {
                  const isDeposit = h.changeAmount >= 0;
                  return (
                    <tr key={`${h.createdAt}-${idx}`}>
                      <td className="whitespace-nowrap px-3 py-2 text-gray-700">
                        {formatDateTime(h.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 font-semibold">
                        <span
                          className={
                            isDeposit ? "text-emerald-600" : "text-rose-600"
                          }
                        >
                          {isDeposit ? "+" : "-"}
                          {formatCurrency(Math.abs(h.changeAmount))}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-xs">
                        {isDeposit ? (
                          <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">
                            Nạp quỹ
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-rose-50 px-2 py-0.5 text-rose-700">
                            Chi từ quỹ
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-gray-700">
                        {h.reason}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-gray-700">
                        User #{h.changedByUserId}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoOwnerCost;
