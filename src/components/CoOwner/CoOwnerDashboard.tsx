import React from "react";

type Stat = {
  icon: string;
  label: string;
  value: string;
  change: string;
  color: string;
};

type UpcomingBooking = {
  id: number;
  vehicle: string;
  date: string;
  time: string;
  purpose: string;
};

type RecentCost = {
  id: number;
  type: string;
  amount: string;
  date: string;
  status: "Đã chia" | "Chờ xử lý";
};

type Vehicle = {
  id: number;
  name: string;
  plate: string;
  battery: number;
  location: string;
  status: "available" | "in-use";
};

const stats: Stat[] = [
  {
    icon: "🚗",
    label: "Tổng số xe",
    value: "3",
    change: "+1 tháng này",
    color: "text-blue-600",
  },
  {
    icon: "📅",
    label: "Lịch đặt tháng này",
    value: "12",
    change: "+3 so với tháng trước",
    color: "text-sky-500",
  },
  {
    icon: "💰",
    label: "Chi phí tháng này",
    value: "4.2M",
    change: "-0.5M so với tháng trước",
    color: "text-emerald-600",
  },
  {
    icon: "👥",
    label: "Thành viên nhóm",
    value: "5",
    change: "Tất cả đang hoạt động",
    color: "text-amber-500",
  },
];

const upcomingBookings: UpcomingBooking[] = [
  {
    id: 1,
    vehicle: "Tesla Model 3 - HN-123",
    date: "2025-11-10",
    time: "09:00 - 12:00",
    purpose: "Đi làm",
  },
  {
    id: 2,
    vehicle: "VinFast VF8 - HN-456",
    date: "2025-11-12",
    time: "14:00 - 18:00",
    purpose: "Đón khách",
  },
];

const recentCosts: RecentCost[] = [
  {
    id: 1,
    type: "Sạc điện",
    amount: "150,000",
    date: "2025-11-05",
    status: "Đã chia",
  },
  {
    id: 2,
    type: "Bảo dưỡng",
    amount: "800,000",
    date: "2025-11-03",
    status: "Đã chia",
  },
  {
    id: 3,
    type: "Phí đỗ xe",
    amount: "50,000",
    date: "2025-11-01",
    status: "Chờ xử lý",
  },
];

const vehicles: Vehicle[] = [
  {
    id: 1,
    name: "Tesla Model 3",
    plate: "HN-123",
    battery: 85,
    location: "Hà Nội",
    status: "available",
  },
  {
    id: 2,
    name: "VinFast VF8",
    plate: "HN-456",
    battery: 60,
    location: "Hà Nội",
    status: "in-use",
  },
  {
    id: 3,
    name: "BYD Atto 3",
    plate: "HN-789",
    battery: 92,
    location: "Hà Nội",
    status: "available",
  },
];

const UserDashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Bảng điều khiển</h1>
        <p className="text-sm text-gray-600">
          Chào mừng trở lại! Đây là tổng quan hệ thống đồng sở hữu xe của bạn.
        </p>
      </div>

      {/* Stats */}
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

      {/* Middle grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vehicles status */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🚘</span>
            <h2 className="text-lg font-semibold text-gray-800">
              Trạng thái xe
            </h2>
          </div>

          <div className="space-y-3">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-800">
                      {v.name} – {v.plate}
                    </h4>
                    <span
                      className={
                        "text-xs px-2 py-0.5 rounded-full " +
                        (v.status === "available"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700")
                      }
                    >
                      {v.status === "available" ? "Sẵn sàng" : "Đang dùng"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      🔋 <span>{v.battery}% pin</span>
                    </span>
                    <span className="flex items-center gap-1">
                      📍 <span>{v.location}</span>
                    </span>
                  </div>

                  {/* Progress bar pin */}
                  <div className="mt-2 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-1.5 rounded-full bg-emerald-500"
                      style={{ width: `${v.battery}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming bookings */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">⏰</span>
            <h2 className="text-lg font-semibold text-gray-800">
              Lịch sắp tới
            </h2>
          </div>

          <div className="space-y-3">
            {upcomingBookings.map((booking) => (
              <div
                key={booking.id}
                className="p-3 rounded-xl border border-gray-200 hover:border-orange-400 hover:bg-orange-50/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {booking.vehicle}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      📅 {booking.date} • {booking.time}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      🎯 {booking.purpose}
                    </p>
                  </div>
                  <button className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
                    Chi tiết
                  </button>
                </div>
              </div>
            ))}

            <button className="mt-2 w-full inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
              📆 Xem tất cả lịch
            </button>
          </div>
        </div>
      </div>

      {/* Recent costs */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">📊</span>
          <h2 className="text-lg font-semibold text-gray-800">
            Chi phí gần đây
          </h2>
        </div>

        <div className="space-y-3">
          {recentCosts.map((cost) => (
            <div
              key={cost.id}
              className="flex items-center justify-between p-3 rounded-xl bg-gray-50"
            >
              <div>
                <h4 className="font-semibold text-gray-800">{cost.type}</h4>
                <p className="text-sm text-gray-500">{cost.date}</p>
              </div>

              <div className="text-right">
                <p className="font-semibold text-gray-900">{cost.amount} VNĐ</p>
                <span
                  className={
                    "inline-flex mt-1 items-center text-xs px-2 py-0.5 rounded-full " +
                    (cost.status === "Đã chia"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700")
                  }
                >
                  {cost.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
