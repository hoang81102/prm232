import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

interface InvoiceDetail {
  invoiceId: string;
  customerName: string;
  customerEmail?: string;
  amount: number;
  currency: string;
  createdAt: string;
  dueDate: string;
  status: "PENDING" | "OVERDUE" | "PAID";
  items: InvoiceItem[];
  note?: string;
}

const mockInvoice: InvoiceDetail = {
  invoiceId: "INV-2024-001",
  customerName: "Nguyễn Văn A",
  customerEmail: "nguyenvana@example.com",
  amount: 1500000,
  currency: "VND",
  createdAt: "2025-11-20T10:00:00Z",
  dueDate: "2025-11-30T00:00:00Z",
  status: "PENDING",
  items: [
    { description: "Phí thuê xe tháng 11", quantity: 1, unitPrice: 1200000 },
    { description: "Phí vệ sinh xe", quantity: 1, unitPrice: 300000 },
  ],
  note: "Vui lòng thanh toán trước ngày 30/11.",
};

const formatDate = (value: string) =>
  new Date(value).toLocaleString("vi-VN", { hour12: false });

const formatMoney = (amount: number, currency: string) =>
  amount.toLocaleString("vi-VN") + " " + currency;

const statusBadge = (status: InvoiceDetail["status"]) => {
  const base =
    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium";

  if (status === "PAID") {
    return (
      <span className={`${base} bg-emerald-50 text-emerald-700`}>
        <span className="mr-1 text-xs">✅</span> Đã thanh toán
      </span>
    );
  }

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

const InvoiceDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { invoiceId } = useParams<{ invoiceId: string }>();

  // TODO: sau này thay bằng fetch API dùng invoiceId
  const invoice: InvoiceDetail | null = useMemo(() => {
    if (!invoiceId || invoiceId !== mockInvoice.invoiceId) return mockInvoice;
    return mockInvoice;
  }, [invoiceId]);

  const subtotal = invoice?.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Thanh back + header */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 
                     px-4 py-2 rounded-xl bg-white border border-gray-200 shadow-sm 
                     hover:bg-gray-100 transition"
        >
          <span className="text-lg">⬅️</span>
          Quay lại danh sách
        </button>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Chi tiết hóa đơn
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Xem thông tin chi tiết hóa đơn và các dòng phí.
          </p>
          {invoice && (
            <p className="mt-1 text-xs text-gray-500 font-mono">
              Mã hóa đơn:{" "}
              <span className="font-semibold">{invoice.invoiceId}</span>
            </p>
          )}
        </div>
        {invoice && (
          <div className="flex items-center gap-2">
            {statusBadge(invoice.status)}
          </div>
        )}
      </div>

      {!invoice ? (
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-6">
          <p className="text-sm text-gray-500">
            Không tìm thấy thông tin hóa đơn.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Thông tin chính */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl shadow border border-gray-100 p-5 space-y-3">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Thông tin khách hàng
                  </h2>
                  <p className="mt-1 text-sm text-gray-900 font-medium">
                    {invoice.customerName}
                  </p>
                  {invoice.customerEmail && (
                    <p className="text-xs text-gray-500">
                      Email: {invoice.customerEmail}
                    </p>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  <p>
                    Ngày tạo:{" "}
                    <span className="font-medium text-gray-800">
                      {formatDate(invoice.createdAt)}
                    </span>
                  </p>
                  <p>
                    Hạn thanh toán:{" "}
                    <span className="font-medium text-gray-800">
                      {formatDate(invoice.dueDate)}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Dòng phí */}
            <div className="bg-white rounded-2xl shadow border border-gray-100 p-5">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Chi tiết các khoản phí
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-xs text-gray-500">
                      <th className="px-3 py-2 text-left font-medium">Mô tả</th>
                      <th className="px-3 py-2 text-right font-medium">
                        Số lượng
                      </th>
                      <th className="px-3 py-2 text-right font-medium">
                        Đơn giá
                      </th>
                      <th className="px-3 py-2 text-right font-medium">
                        Thành tiền
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, idx) => {
                      const lineTotal = item.quantity * item.unitPrice;
                      return (
                        <tr
                          key={idx}
                          className="border-b border-gray-50 hover:bg-gray-50"
                        >
                          <td className="px-3 py-2 text-gray-900">
                            {item.description}
                          </td>
                          <td className="px-3 py-2 text-right text-gray-700">
                            {item.quantity}
                          </td>
                          <td className="px-3 py-2 text-right text-gray-700">
                            {formatMoney(item.unitPrice, invoice.currency)}
                          </td>
                          <td className="px-3 py-2 text-right text-gray-900 font-semibold">
                            {formatMoney(lineTotal, invoice.currency)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {invoice.note && (
                <p className="mt-3 text-xs text-gray-500">
                  Ghi chú: {invoice.note}
                </p>
              )}
            </div>
          </div>

          {/* Sidebar tổng tiền + nút hành động */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow border border-gray-100 p-5">
              <h2 className="text-base font-semibold text-gray-800 mb-3">
                Tổng thanh toán
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Tạm tính</span>
                  <span className="font-medium text-gray-900">
                    {formatMoney(subtotal ?? 0, invoice.currency)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Giảm giá</span>
                  <span className="font-medium text-gray-900">0</span>
                </div>
                <div className="border-t border-gray-100 pt-2 mt-2 flex items-center justify-between">
                  <span className="font-semibold text-gray-800">
                    Cần thanh toán
                  </span>
                  <span className="text-lg font-bold text-sky-600">
                    {formatMoney(invoice.amount, invoice.currency)}
                  </span>
                </div>
              </div>

              {invoice.status !== "PAID" && (
                <button
                  type="button"
                  className="mt-4 w-full inline-flex items-center justify-center rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600"
                >
                  Thanh toán ngay
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceDetailPage;
