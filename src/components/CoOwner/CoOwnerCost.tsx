import React, { useState } from "react";

type SplitMethod = "ownership" | "usage" | "equal";
type CostStatus = "paid" | "pending";

interface Cost {
  id: number;
  type: string;
  amount: number;
  date: string;
  createdBy: string;
  splitMethod: SplitMethod;
  yourShare: number;
  status: CostStatus;
}

interface NewCostState {
  type: string;
  amount: string;
  date: string;
  description: string;
  splitMethod: SplitMethod;
}

// Mock data - Chi phí
const costs: Cost[] = [
  {
    id: 1,
    type: "Sạc điện",
    amount: 150_000,
    date: "2025-11-05",
    createdBy: "Nguyễn Văn A",
    splitMethod: "usage",
    yourShare: 30_000,
    status: "paid",
  },
  {
    id: 2,
    type: "Bảo dưỡng định kỳ",
    amount: 800_000,
    date: "2025-11-03",
    createdBy: "Bạn",
    splitMethod: "ownership",
    yourShare: 160_000,
    status: "paid",
  },
  {
    id: 3,
    type: "Phí đỗ xe",
    amount: 50_000,
    date: "2025-11-01",
    createdBy: "Trần Thị B",
    splitMethod: "equal",
    yourShare: 10_000,
    status: "pending",
  },
  {
    id: 4,
    type: "Bảo hiểm",
    amount: 5_000_000,
    date: "2025-10-28",
    createdBy: "Admin",
    splitMethod: "ownership",
    yourShare: 1_000_000,
    status: "paid",
  },
];

const costTypes: string[] = [
  "Sạc điện",
  "Bảo dưỡng",
  "Sửa chữa",
  "Bảo hiểm",
  "Phí đỗ xe",
  "Phí đường bộ",
  "Rửa xe",
  "Khác",
];

const CoOwnerCost: React.FC = () => {
  const [showNewCost, setShowNewCost] = useState<boolean>(false);
  const [newCost, setNewCost] = useState<NewCostState>({
    type: "",
    amount: "",
    date: "",
    description: "",
    splitMethod: "ownership",
  });

  const handleCreateCost = (): void => {
    console.log("Tạo chi phí mới:", newCost);
    alert("Đã ghi nhận chi phí! (Mock data - không lưu thực tế)");
    setShowNewCost(false);
    setNewCost({
      type: "",
      amount: "",
      date: "",
      description: "",
      splitMethod: "ownership",
    });
  };

  const totalPaid = costs
    .filter((c) => c.status === "paid")
    .reduce((sum, c) => sum + c.yourShare, 0);

  const totalPending = costs
    .filter((c) => c.status === "pending")
    .reduce((sum, c) => sum + c.yourShare, 0);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getSplitMethodLabel = (method: SplitMethod): string => {
    switch (method) {
      case "ownership":
        return "Theo tỷ lệ sở hữu";
      case "usage":
        return "Theo mức sử dụng";
      case "equal":
        return "Chia đều";
      default:
        return method;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Quản lý Chi phí</h1>
          <p className="text-sm text-gray-500">
            Ghi nhận và chia sẻ chi phí vận hành xe
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowNewCost((prev) => !prev)}
          className="inline-flex items-center rounded-md bg-linear-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <span className="mr-2 text-lg">＋</span>
          Thêm chi phí
        </button>
      </div>

      {/* Tổng quan chi phí */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Đã thanh toán */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
            <span className="text-lg">👛</span>
            <span>Đã thanh toán</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600">
            {formatCurrency(totalPaid)}
          </p>
          <p className="mt-1 text-xs text-gray-500">Tháng này</p>
        </div>

        {/* Chờ thanh toán */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
            <span className="text-lg">🧾</span>
            <span>Chờ thanh toán</span>
          </div>
          <p className="text-2xl font-bold text-amber-500">
            {formatCurrency(totalPending)}
          </p>
          <p className="mt-1 text-xs text-gray-500">Cần xử lý</p>
        </div>

        {/* Tổng chi phí */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
            <span className="text-lg">📈</span>
            <span>Tổng chi phí</span>
          </div>
          <p className="text-2xl font-bold">
            {formatCurrency(totalPaid + totalPending)}
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
            <span className="text-emerald-500">📉</span>
            <span>-12% so với tháng trước</span>
          </p>
        </div>
      </div>

      {/* Form thêm chi phí */}
      {showNewCost && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Ghi nhận chi phí mới</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Loại chi phí */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Loại chi phí *
              </label>
              <select
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={newCost.type}
                onChange={(e) =>
                  setNewCost((prev) => ({ ...prev, type: e.target.value }))
                }
              >
                <option value="">Chọn loại chi phí</option>
                {costTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Số tiền */}
            <div className="space-y-1.5">
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700"
              >
                Số tiền (VNĐ) *
              </label>
              <input
                id="amount"
                type="number"
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={newCost.amount}
                onChange={(e) =>
                  setNewCost((prev) => ({ ...prev, amount: e.target.value }))
                }
                placeholder="150000"
              />
            </div>

            {/* Ngày phát sinh */}
            <div className="space-y-1.5">
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700"
              >
                Ngày phát sinh *
              </label>
              <input
                id="date"
                type="date"
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={newCost.date}
                onChange={(e) =>
                  setNewCost((prev) => ({ ...prev, date: e.target.value }))
                }
              />
            </div>

            {/* Phương thức chia */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Phương thức chia *
              </label>
              <select
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={newCost.splitMethod}
                onChange={(e) =>
                  setNewCost((prev) => ({
                    ...prev,
                    splitMethod: e.target.value as SplitMethod,
                  }))
                }
              >
                <option value="ownership">Theo tỷ lệ sở hữu</option>
                <option value="usage">Theo mức sử dụng</option>
                <option value="equal">Chia đều</option>
              </select>
            </div>
          </div>

          {/* Mô tả */}
          <div className="mt-4 space-y-1.5">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Mô tả
            </label>
            <textarea
              id="description"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={newCost.description}
              onChange={(e) =>
                setNewCost((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Ghi chú về chi phí này..."
              rows={3}
            />
          </div>

          {/* Upload hoá đơn */}
          <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="mb-2 text-sm text-gray-600">
              📎 Đính kèm hóa đơn/chứng từ
            </p>
            <button
              type="button"
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span className="mr-2 text-base">⬆️</span>
              Tải file lên
            </button>
          </div>

          {/* Actions */}
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={handleCreateCost}
              className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Ghi nhận
            </button>
            <button
              type="button"
              onClick={() => setShowNewCost(false)}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* Bảng chi phí */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <span className="text-xl">💵</span>
            <span>Lịch sử chi phí</span>
          </h2>
        </div>
        <div className="overflow-x-auto px-6 py-4">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Loại
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Số tiền
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Ngày
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Người tạo
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Phương thức chia
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Phần của bạn
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {costs.map((cost) => (
                <tr key={cost.id}>
                  <td className="whitespace-nowrap px-3 py-2 font-medium text-gray-900">
                    {cost.type}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-gray-700">
                    {formatCurrency(cost.amount)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-gray-700">
                    {cost.date}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-gray-700">
                    {cost.createdBy}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-xs text-gray-600">
                    {getSplitMethodLabel(cost.splitMethod)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 font-semibold text-gray-900">
                    {formatCurrency(cost.yourShare)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    {cost.status === "paid" ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        ● Đã thanh toán
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                        ● Chờ thanh toán
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPending > 0 && (
            <div className="mt-4 flex items-center justify-between rounded-lg bg-amber-50 p-4">
              <div>
                <p className="font-semibold text-amber-800">
                  Bạn cần thanh toán: {formatCurrency(totalPending)}
                </p>
                <p className="text-sm text-amber-700">
                  Vui lòng thanh toán để duy trì hoạt động nhóm
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center rounded-md bg-linear-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span className="mr-2 text-base">💳</span>
                Thanh toán ngay
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoOwnerCost;
