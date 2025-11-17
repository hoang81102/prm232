import React from "react";

/* ================== TYPES ================== */
type Stat = {
  icon: string;
  label: string;
  value: string;
  change: string;
  color: string;
};

type PendingTask = {
  id: number;
  type: string;
  user: string;
  priority: "high" | "medium";
  time: string;
};

type MaintenanceItem = {
  id: number;
  vehicle: string;
  type: string;
  date: string;
  status: "scheduled" | "pending";
};

type Activity = {
  id: number;
  action: string;
  time: string;
  type: "success" | "info" | "warning";
};

/* ================== MOCK DATA ================== */
const stats: Stat[] = [
  {
    icon: "🚗",
    label: "Tổng xe quản lý",
    value: "8",
    change: "+2 tháng này",
    color: "text-blue-600",
  },
  {
    icon: "👥",
    label: "Tổng thành viên",
    value: "24",
    change: "+5 thành viên mới",
    color: "text-sky-500",
  },
  {
    icon: "📄",
    label: "Hợp đồng đang hoạt động",
    value: "8",
    change: "2 sắp hết hạn",
    color: "text-amber-500",
  },
  {
    icon: "💰",
    label: "Doanh thu tháng này",
    value: "48.5M",
    change: "+15% so với tháng trước",
    color: "text-emerald-600",
  },
];

const pendingTasks: PendingTask[] = [
  {
    id: 1,
    type: "Xác thực giấy tờ",
    user: "Nguyễn Thị D",
    priority: "high",
    time: "2 giờ trước",
  },
  {
    id: 2,
    type: "Duyệt booking",
    user: "Trần Văn E",
    priority: "medium",
    time: "5 giờ trước",
  },
  {
    id: 3,
    type: "Xử lý tranh chấp",
    user: "Lê Thị F vs Phạm Văn G",
    priority: "high",
    time: "1 ngày trước",
  },
];

const maintenanceSchedule: MaintenanceItem[] = [
  {
    id: 1,
    vehicle: "Tesla Model 3 - HN-123",
    type: "Bảo dưỡng định kỳ",
    date: "2025-11-15",
    status: "scheduled",
  },
  {
    id: 2,
    vehicle: "VinFast VF8 - HN-456",
    type: "Thay lốp",
    date: "2025-11-18",
    status: "scheduled",
  },
  {
    id: 3,
    vehicle: "BYD Atto 3 - HN-789",
    type: "Kiểm tra pin",
    date: "2025-11-20",
    status: "pending",
  },
];

const recentActivities: Activity[] = [
  {
    id: 1,
    action: "Nguyễn Văn A đã hoàn thành booking",
    time: "10 phút trước",
    type: "success",
  },
  {
    id: 2,
    action: "Trần Thị B đã thanh toán chi phí 500,000 VNĐ",
    time: "1 giờ trước",
    type: "success",
  },
  {
    id: 3,
    action: "Đề xuất mua xe mới đã được thông qua",
    time: "3 giờ trước",
    type: "info",
  },
  {
    id: 4,
    action: "Cảnh báo: Xe HN-123 cần bảo dưỡng trong 3 ngày",
    time: "1 ngày trước",
    type: "warning",
  },
];

/* ================== COMPONENT ================== */
const AdminDashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-sm text-gray-600">
          Tổng quan và quản lý toàn bộ hệ thống đồng sở hữu xe
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 flex flex-col justify-between hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <span className={`text-xl ${stat.color}`}>{stat.icon}</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Công việc chờ xử lý */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">⚠️</span>
            <h2 className="text-lg font-semibold text-gray-800">
              Công việc chờ xử lý
            </h2>
          </div>

          <div className="space-y-3">
            {pendingTasks.map((task) => (
              <div
                key={task.id}
                className="p-3 rounded-xl border border-gray-200 hover:border-orange-400 hover:bg-orange-50/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-800">
                        {task.type}
                      </h4>
                      <span
                        className={
                          "inline-flex items-center text-xs px-2 py-0.5 rounded-full " +
                          (task.priority === "high"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700")
                        }
                      >
                        {task.priority === "high"
                          ? "Ưu tiên cao"
                          : "Ưu tiên TB"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{task.user}</p>
                    <p className="text-xs text-gray-400 mt-1">{task.time}</p>
                  </div>
                  <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#78B3CE] text-white shadow hover:bg-[#5d96b0]">
                    Xử lý
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lịch bảo trì */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🕒</span>
            <h2 className="text-lg font-semibold text-gray-800">
              Lịch bảo trì xe
            </h2>
          </div>

          <div className="space-y-3">
            {maintenanceSchedule.map((item) => (
              <div key={item.id} className="p-3 rounded-xl bg-gray-50">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">
                      {item.vehicle}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">{item.type}</p>
                    <p className="text-sm mt-1">📅 {item.date}</p>
                  </div>
                  <span
                    className={
                      "inline-flex items-center text-xs px-2 py-0.5 rounded-full " +
                      (item.status === "scheduled"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-yellow-100 text-yellow-700")
                    }
                  >
                    {item.status === "scheduled"
                      ? "Đã lên lịch"
                      : "Chờ lên lịch"}
                  </span>
                </div>
              </div>
            ))}

            <button className="mt-2 w-full inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
              📆 Xem tất cả lịch bảo trì
            </button>
          </div>
        </div>
      </div>

      {/* Hoạt động gần đây */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">📈</span>
          <h2 className="text-lg font-semibold text-gray-800">
            Hoạt động gần đây
          </h2>
        </div>

        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-xl bg-gray-50"
            >
              <span className="mt-0.5 text-lg">
                {activity.type === "success" && "✅"}
                {activity.type === "info" && "ℹ️"}
                {activity.type === "warning" && "⚠️"}
              </span>
              <div className="flex-1">
                <p className="text-sm text-gray-800">{activity.action}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Thao tác nhanh
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button className="h-auto py-4 px-3 flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            <span className="text-xl">🚗</span>
            <span>Thêm xe mới</span>
          </button>
          <button className="h-auto py-4 px-3 flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            <span className="text-xl">👥</span>
            <span>Thêm thành viên</span>
          </button>
          <button className="h-auto py-4 px-3 flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            <span className="text-xl">📄</span>
            <span>Tạo hợp đồng</span>
          </button>
          <button className="h-auto py-4 px-3 flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            <span className="text-xl">📊</span>
            <span>Xuất báo cáo</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
