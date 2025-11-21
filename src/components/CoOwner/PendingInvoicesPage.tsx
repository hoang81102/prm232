import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface PendingInvoice {
  invoiceId: string;
  customerName: string;
  amount: number;
  currency: string;
  dueDate: string;
  createdAt: string;
  status: "PENDING" | "OVERDUE";
}

const mockPendingInvoices: PendingInvoice[] = [
  {
    invoiceId: "INV-2024-001",
    customerName: "Nguyễn Văn A",
    amount: 1500000,
    currency: "VND",
    dueDate: "2025-11-30T00:00:00Z",
    createdAt: "2025-11-20T10:00:00Z",
    status: "PENDING",
  },
  {
    invoiceId: "INV-2024-002",
    customerName: "Công ty TNHH ABC",
    amount: 3200000,
    currency: "VND",
    dueDate: "2025-11-10T00:00:00Z",
    createdAt: "2025-11-05T09:30:00Z",
    status: "OVERDUE",
  },
];

const formatDate = (value: string) =>
  new Date(value).toLocaleString("vi-VN", { hour12: false });

const formatMoney = (amount: number, currency: string) =>
  amount.toLocaleString("vi-VN") + " " + currency;

const statusBadge = (status: PendingInvoice["status"]) => {
  const base =
    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium";
  if (status === "OVERDUE") {
    return (
      <span className={`${base} bg-red-50 text-red-600`}>
        <span className="mr-1 text-xs">⚠️</span> Quá hạn
      </span>
    );
  }
  return (
    <span className={`${base} bg-amber-50 text-amber-700`}>
      <span className="mr-1 text-xs">⏰</span> Chờ thanh toán
    </span>
  );
};

const PendingInvoicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "PENDING" | "OVERDUE">(
    ""
  );

  const filtered = useMemo(() => {
    return mockPendingInvoices.filter((inv) => {
      const matchesSearch =
        inv.invoiceId.toLowerCase().includes(search.toLowerCase()) ||
        inv.customerName.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = !statusFilter || inv.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Hóa đơn chờ thanh toán
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Xem và quản lý các hóa đơn chưa được thanh toán. Bấm vào từng hóa
            đơn để xem chi tiết và tiến hành thanh toán.
          </p>
        </div>
      </div>

      {/* Bộ lọc */}
      <div className="bg-white rounded-2xl shadow border border-gray-100 p-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="flex-1 flex items-center gap-2">
          <input
            type="text"
            placeholder="Tìm theo mã hóa đơn hoặc tên khách hàng..."
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "" | "PENDING" | "OVERDUE")
            }
          >
            <option value="">Tất cả trạng thái</option>
            <option value="PENDING">Chờ thanh toán</option>
            <option value="OVERDUE">Quá hạn</option>
          </select>
        </div>
      </div>

      {/* Danh sách hóa đơn */}
      <div className="bg-white rounded-2xl shadow border border-gray-100 p-4">
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-500">
            Không tìm thấy hóa đơn nào phù hợp.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-500">
                  <th className="px-3 py-2 text-left font-medium">
                    Mã hóa đơn
                  </th>
                  <th className="px-3 py-2 text-left font-medium">
                    Khách hàng
                  </th>
                  <th className="px-3 py-2 text-right font-medium">Số tiền</th>
                  <th className="px-3 py-2 text-left font-medium">
                    Hạn thanh toán
                  </th>
                  <th className="px-3 py-2 text-left font-medium">Ngày tạo</th>
                  <th className="px-3 py-2 text-left font-medium">
                    Trạng thái
                  </th>
                  <th className="px-3 py-2 text-right font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inv) => (
                  <tr
                    key={inv.invoiceId}
                    className="border-b border-gray-50 hover:bg-gray-50"
                  >
                    <td className="px-3 py-2 font-mono text-xs text-sky-700">
                      {inv.invoiceId}
                    </td>
                    <td className="px-3 py-2">
                      <div className="text-gray-900 font-medium">
                        {inv.customerName}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-right text-gray-900 font-semibold">
                      {formatMoney(inv.amount, inv.currency)}
                    </td>
                    <td className="px-3 py-2 text-gray-700">
                      {formatDate(inv.dueDate)}
                    </td>
                    <td className="px-3 py-2 text-gray-500">
                      {formatDate(inv.createdAt)}
                    </td>
                    <td className="px-3 py-2">{statusBadge(inv.status)}</td>
                    <td className="px-3 py-2 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/CoOwner/billing/invoices/${inv.invoiceId}`)
                        }
                        className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-medium bg-sky-500 text-white hover:bg-sky-600"
                      >
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={() => navigate("/CoOwner/billing/history")}
        className="w-full inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
      >
        Xem lịch sử giao dịch
      </button>
    </div>
  );
};

export default PendingInvoicesPage;
