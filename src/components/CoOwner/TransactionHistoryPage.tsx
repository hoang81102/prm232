import React, { useMemo, useState } from "react";

interface Transaction {
  transactionId: string;
  invoiceId?: string;
  type: "PAYMENT" | "REFUND";
  method: "BANK" | "CARD" | "CASH" | "EWALLET";
  amount: number;
  currency: string;
  createdAt: string;
  status: "SUCCESS" | "FAILED" | "PENDING";
}

const mockTransactions: Transaction[] = [
  {
    transactionId: "TX-001",
    invoiceId: "INV-2024-001",
    type: "PAYMENT",
    method: "BANK",
    amount: 1500000,
    currency: "VND",
    createdAt: "2025-11-21T09:30:00Z",
    status: "SUCCESS",
  },
  {
    transactionId: "TX-002",
    invoiceId: "INV-2024-002",
    type: "PAYMENT",
    method: "CARD",
    amount: 3200000,
    currency: "VND",
    createdAt: "2025-11-19T14:10:00Z",
    status: "FAILED",
  },
  {
    transactionId: "TX-003",
    invoiceId: "INV-2024-001",
    type: "REFUND",
    method: "BANK",
    amount: 200000,
    currency: "VND",
    createdAt: "2025-11-22T08:05:00Z",
    status: "PENDING",
  },
];

const formatDate = (value: string) =>
  new Date(value).toLocaleString("vi-VN", { hour12: false });

const formatMoney = (amount: number, currency: string) =>
  amount.toLocaleString("vi-VN") + " " + currency;

const statusBadge = (status: Transaction["status"]) => {
  const base =
    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium";
  if (status === "SUCCESS") {
    return (
      <span className={`${base} bg-emerald-50 text-emerald-700`}>
        <span className="mr-1 text-xs">✅</span> Thành công
      </span>
    );
  }
  if (status === "FAILED") {
    return (
      <span className={`${base} bg-red-50 text-red-600`}>
        <span className="mr-1 text-xs">❌</span> Thất bại
      </span>
    );
  }
  return (
    <span className={`${base} bg-amber-50 text-amber-700`}>
      <span className="mr-1 text-xs">⏳</span> Đang xử lý
    </span>
  );
};

const methodLabel = (method: Transaction["method"]) => {
  switch (method) {
    case "BANK":
      return "Chuyển khoản ngân hàng";
    case "CARD":
      return "Thẻ ngân hàng";
    case "CASH":
      return "Tiền mặt";
    case "EWALLET":
      return "Ví điện tử";
    default:
      return method;
  }
};

const typeLabel = (type: Transaction["type"]) =>
  type === "PAYMENT" ? "Thanh toán" : "Hoàn tiền";

const TransactionHistoryPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "" | "SUCCESS" | "FAILED" | "PENDING"
  >("");
  const [typeFilter, setTypeFilter] = useState<"" | "PAYMENT" | "REFUND">("");

  const filtered = useMemo(() => {
    return mockTransactions.filter((tx) => {
      const matchSearch =
        tx.transactionId.toLowerCase().includes(search.toLowerCase()) ||
        (tx.invoiceId &&
          tx.invoiceId.toLowerCase().includes(search.toLowerCase()));

      const matchStatus = !statusFilter || tx.status === statusFilter;
      const matchType = !typeFilter || tx.type === typeFilter;

      return matchSearch && matchStatus && matchType;
    });
  }, [search, statusFilter, typeFilter]);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Lịch sử giao dịch
        </h1>
        <p className="text-sm text-gray-500">
          Theo dõi tất cả các lần thanh toán và hoàn tiền.
        </p>
      </header>

      {/* Bộ lọc */}
      <div className="bg-white rounded-2xl shadow border border-gray-100 p-4 flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Tìm theo mã giao dịch hoặc mã hóa đơn..."
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            className="rounded-xl border border-gray-200 px-3 py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value as "" | "SUCCESS" | "FAILED" | "PENDING"
              )
            }
          >
            <option value="">Tất cả trạng thái</option>
            <option value="SUCCESS">Thành công</option>
            <option value="FAILED">Thất bại</option>
            <option value="PENDING">Đang xử lý</option>
          </select>

          <select
            className="rounded-xl border border-gray-200 px-3 py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value as "" | "PAYMENT" | "REFUND")
            }
          >
            <option value="">Tất cả loại</option>
            <option value="PAYMENT">Thanh toán</option>
            <option value="REFUND">Hoàn tiền</option>
          </select>
        </div>
      </div>

      {/* Bảng lịch sử */}
      <div className="bg-white rounded-2xl shadow border border-gray-100 p-4">
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-500">
            Chưa có giao dịch nào phù hợp với bộ lọc.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-500">
                  <th className="px-3 py-2 text-left font-medium">
                    Mã giao dịch
                  </th>
                  <th className="px-3 py-2 text-left font-medium">
                    Mã hóa đơn
                  </th>
                  <th className="px-3 py-2 text-left font-medium">Loại</th>
                  <th className="px-3 py-2 text-left font-medium">
                    Phương thức
                  </th>
                  <th className="px-3 py-2 text-right font-medium">Số tiền</th>
                  <th className="px-3 py-2 text-left font-medium">Thời gian</th>
                  <th className="px-3 py-2 text-left font-medium">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((tx) => (
                  <tr
                    key={tx.transactionId}
                    className="border-b border-gray-50 hover:bg-gray-50"
                  >
                    <td className="px-3 py-2 font-mono text-xs text-sky-700">
                      {tx.transactionId}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-gray-700">
                      {tx.invoiceId ?? "-"}
                    </td>
                    <td className="px-3 py-2 text-gray-800">
                      {typeLabel(tx.type)}
                    </td>
                    <td className="px-3 py-2 text-gray-700">
                      {methodLabel(tx.method)}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-900 font-semibold">
                      {formatMoney(tx.amount, tx.currency)}
                    </td>
                    <td className="px-3 py-2 text-gray-500">
                      {formatDate(tx.createdAt)}
                    </td>
                    <td className="px-3 py-2">{statusBadge(tx.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistoryPage;
