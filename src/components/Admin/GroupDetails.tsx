import React from "react";
import { useNavigate, useParams } from "react-router-dom";

/* =============== TYPES =============== */
type GroupStatus = "active" | "inactive" | "pending";

type Group = {
  id: string;
  name: string;
  code: string;
  members: number;
  vehicles: number;
  location: string;
  createdAt: string;
  status: GroupStatus;
};

type GroupMember = {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Co-owner" | "Viewer";
  joinedAt: string;
};

type GroupVehicle = {
  id: string;
  name: string;
  plate: string;
  type: string;
  share: string; // tỉ lệ sở hữu
  status: "available" | "in-use" | "maintenance";
};

/* =============== MOCK DATA (phải khớp id với GroupManagement) =============== */

const MOCK_GROUPS: Group[] = [
  {
    id: "g1",
    name: "Nhóm EV Hà Nội 1",
    code: "HN-EV-01",
    members: 5,
    vehicles: 2,
    location: "Hà Nội",
    createdAt: "2025-01-10T09:00:00.000Z",
    status: "active",
  },
  {
    id: "g2",
    name: "Nhóm VinFast Sài Gòn",
    code: "SG-VF-01",
    members: 8,
    vehicles: 3,
    location: "TP. Hồ Chí Minh",
    createdAt: "2025-02-05T10:30:00.000Z",
    status: "active",
  },
  {
    id: "g3",
    name: "Nhóm EV Đà Nẵng",
    code: "DN-EV-01",
    members: 4,
    vehicles: 1,
    location: "Đà Nẵng",
    createdAt: "2025-03-20T14:15:00.000Z",
    status: "pending",
  },
  {
    id: "g4",
    name: "Nhóm Test Inactive",
    code: "TEST-99",
    members: 3,
    vehicles: 1,
    location: "Hà Nội",
    createdAt: "2024-12-01T08:00:00.000Z",
    status: "inactive",
  },
];

const GROUP_MEMBERS: Record<string, GroupMember[]> = {
  g1: [
    {
      id: "u1",
      name: "Nguyễn Văn A",
      email: "a@example.com",
      role: "Owner",
      joinedAt: "2025-01-10",
    },
    {
      id: "u2",
      name: "Trần Thị B",
      email: "b@example.com",
      role: "Co-owner",
      joinedAt: "2025-01-12",
    },
    {
      id: "u3",
      name: "Lê Văn C",
      email: "c@example.com",
      role: "Co-owner",
      joinedAt: "2025-01-15",
    },
  ],
  g2: [
    {
      id: "u4",
      name: "Phạm Văn D",
      email: "d@example.com",
      role: "Owner",
      joinedAt: "2025-02-05",
    },
  ],
  g3: [],
  g4: [],
};

const GROUP_VEHICLES: Record<string, GroupVehicle[]> = {
  g1: [
    {
      id: "v1",
      name: "Tesla Model 3",
      plate: "HN-123",
      type: "EV Sedan",
      share: "40% - 30% - 30%",
      status: "available",
    },
    {
      id: "v2",
      name: "VinFast VF8",
      plate: "HN-456",
      type: "EV SUV",
      share: "50% - 50%",
      status: "in-use",
    },
  ],
  g2: [
    {
      id: "v3",
      name: "VinFast VF e34",
      plate: "SG-888",
      type: "EV Crossover",
      share: "100%",
      status: "maintenance",
    },
  ],
  g3: [],
  g4: [],
};

/* =============== HELPERS =============== */

const statusBadgeClass = (status: GroupStatus) => {
  if (status === "active") return "bg-emerald-100 text-emerald-700";
  if (status === "pending") return "bg-amber-100 text-amber-700";
  return "bg-gray-200 text-gray-700";
};

const statusLabel = (status: GroupStatus) => {
  if (status === "active") return "Đang hoạt động";
  if (status === "pending") return "Chờ duyệt";
  return "Ngưng hoạt động";
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

/* =============== COMPONENT =============== */

const GroupDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const group = MOCK_GROUPS.find((g) => g.id === id);
  const members = group ? GROUP_MEMBERS[group.id] ?? [] : [];
  const vehicles = group ? GROUP_VEHICLES[group.id] ?? [] : [];

  if (!group) {
    return (
      <div className="p-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          ⬅ Back
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">🧭</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Không tìm thấy nhóm
          </h2>
          <p className="text-gray-500 mb-4">
            ID nhóm: <span className="font-semibold">{id}</span>
          </p>
          <button
            onClick={() => navigate("/admin/groups")}
            className="inline-flex items-center rounded-lg bg-[#78B3CE] px-4 py-2 text-sm font-medium text-white shadow hover:bg-[#5d96b0]"
          >
            Quay lại danh sách nhóm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Back */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          ⬅ Back
        </button>
      </div>

      {/* Header card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#78B3CE] text-white flex items-center justify-center text-2xl font-bold">
            🚗
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#78B3CE] mb-1">
              {group.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <span className="inline-flex px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
                Mã nhóm: {group.code}
              </span>
              <span
                className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${statusBadgeClass(
                  group.status
                )}`}
              >
                {statusLabel(group.status)}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              📍 <span className="font-medium">{group.location}</span> • Tạo
              ngày{" "}
              <span className="font-medium">{formatDate(group.createdAt)}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-[#FBF8EF] border border-[#C9E6F0] rounded-xl p-3 text-center">
            <div className="text-xs text-gray-500 mb-1">Thành viên</div>
            <div className="text-xl font-bold text-gray-800">
              {group.members}
            </div>
          </div>
          <div className="bg-[#FBF8EF] border border-[#C9E6F0] rounded-xl p-3 text-center">
            <div className="text-xs text-gray-500 mb-1">Số xe</div>
            <div className="text-xl font-bold text-gray-800">
              {group.vehicles}
            </div>
          </div>
        </div>
      </div>

      {/* Members + Vehicles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Members */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#78B3CE]">
              Thành viên nhóm
            </h2>
            <span className="text-xs text-gray-500">
              Tổng: <span className="font-semibold">{members.length}</span>
            </span>
          </div>

          {members.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              Chưa có dữ liệu thành viên (mock)
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm rounded-xl overflow-hidden border">
                <thead className="bg-[#C9E6F0]">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-[#78B3CE]">
                      Tên
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-[#78B3CE]">
                      Email
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-[#78B3CE]">
                      Vai trò
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-[#78B3CE]">
                      Tham gia
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {members.map((m, idx) => (
                    <tr
                      key={m.id}
                      className={`${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-[#FBF8EF]`}
                    >
                      <td className="px-4 py-2">{m.name}</td>
                      <td className="px-4 py-2">{m.email}</td>
                      <td className="px-4 py-2">
                        <span className="inline-flex px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
                          {m.role}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-gray-600">{m.joinedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <button className="px-4 py-2 text-xs md:text-sm rounded-lg bg-[#78B3CE] text-white shadow hover:bg-[#5d96b0]">
              ➕ Thêm thành viên (mock)
            </button>
            <button className="px-4 py-2 text-xs md:text-sm rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
              Quản lý lời mời (mock)
            </button>
          </div>
        </div>

        {/* Vehicles */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#78B3CE]">
              Xe trong nhóm
            </h2>
            <span className="text-xs text-gray-500">
              Tổng: <span className="font-semibold">{vehicles.length}</span>
            </span>
          </div>

          {vehicles.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              Chưa có dữ liệu xe (mock)
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm rounded-xl overflow-hidden border">
                <thead className="bg-[#C9E6F0]">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-[#78B3CE]">
                      Tên xe
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-[#78B3CE]">
                      Biển số
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-[#78B3CE]">
                      Loại
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-[#78B3CE]">
                      Tỉ lệ sở hữu
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-[#78B3CE]">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {vehicles.map((v, idx) => (
                    <tr
                      key={v.id}
                      className={`${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-[#FBF8EF]`}
                    >
                      <td className="px-4 py-2">{v.name}</td>
                      <td className="px-4 py-2">{v.plate}</td>
                      <td className="px-4 py-2">{v.type}</td>
                      <td className="px-4 py-2 text-gray-700">{v.share}</td>
                      <td className="px-4 py-2">
                        <span
                          className={
                            "inline-flex px-2 py-1 rounded-full text-xs font-semibold " +
                            (v.status === "available"
                              ? "bg-emerald-100 text-emerald-700"
                              : v.status === "in-use"
                              ? "bg-sky-100 text-sky-700"
                              : "bg-amber-100 text-amber-700")
                          }
                        >
                          {v.status === "available"
                            ? "Sẵn sàng"
                            : v.status === "in-use"
                            ? "Đang sử dụng"
                            : "Bảo trì"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <button className="px-4 py-2 text-xs md:text-sm rounded-lg bg-[#78B3CE] text-white shadow hover:bg-[#5d96b0]">
              ➕ Thêm xe (mock)
            </button>
            <button className="px-4 py-2 text-xs md:text-sm rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
              Cập nhật trạng thái (mock)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetails;
