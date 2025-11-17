import React from "react";
import { useNavigate, useParams } from "react-router-dom";

/** ==== TYPES ==== */
type User = {
  id: string;
  username: string;
  email: string;
  phone: string;
  address: string;
  role: "Admin" | "Manager" | "User";
};

/** ==== MOCK DATA (khớp với UserManagement) ==== */
const MOCK_USERS: User[] = [
  {
    id: "1",
    username: "alice",
    email: "alice@example.com",
    phone: "0901234567",
    address: "123 Nguyen Trai, HN",
    role: "Admin",
  },
  {
    id: "2",
    username: "bob",
    email: "bob@example.com",
    phone: "0902222333",
    address: "456 Le Loi, HCM",
    role: "User",
  },
  {
    id: "3",
    username: "charlie",
    email: "charlie@example.com",
    phone: "0908888999",
    address: "789 Tran Hung Dao, DN",
    role: "Manager",
  },
  {
    id: "4",
    username: "daisy",
    email: "daisy@example.com",
    phone: "0905555777",
    address: "12 Hai Ba Trung, HN",
    role: "User",
  },
  {
    id: "5",
    username: "edward",
    email: "edward@example.com",
    phone: "0904444666",
    address: "88 Vo Thi Sau, HCM",
    role: "User",
  },
];

const ROLE_COLORS: Record<User["role"], string> = {
  Admin: "bg-red-100 text-red-700",
  Manager: "bg-amber-100 text-amber-700",
  User: "bg-emerald-100 text-emerald-700",
};

const UserDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const user = MOCK_USERS.find((u) => u.id === id);

  const initials =
    user?.username
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase() || "?";

  if (!user) {
    return (
      <div className="p-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          ⬅ Back
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            User not found
          </h2>
          <p className="text-gray-500 mb-4">
            Không tìm thấy người dùng với ID:{" "}
            <span className="font-semibold">{id}</span>
          </p>
          <button
            onClick={() => navigate("/admin/usermanagement")}
            className="inline-flex items-center rounded-lg bg-[#78B3CE] px-4 py-2 text-sm font-medium text-white shadow hover:bg-[#5d96b0]"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Nút back */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          ⬅ Back
        </button>
      </div>

      {/* Thông tin chính */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
        {/* Header user */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#78B3CE] flex items-center justify-center text-white font-bold text-2xl">
              {initials}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#78B3CE]">
                {user.username}
              </h1>
              <p className="text-gray-600">{user.email}</p>
              <span
                className={`inline-flex mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                  ROLE_COLORS[user.role]
                }`}
              >
                {user.role}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-1 text-sm text-gray-600">
            <span>
              📞 <span className="font-medium">{user.phone}</span>
            </span>
            <span>
              📍 <span className="font-medium">{user.address}</span>
            </span>
            <span className="text-xs text-gray-400">
              ID: <span className="font-mono">{user.id}</span>
            </span>
          </div>
        </div>

        {/* Thông tin chi tiết */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#FBF8EF] rounded-xl p-4 border border-[#C9E6F0]">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Thông tin tài khoản
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Username:</span>
                <span className="font-medium text-gray-800">
                  {user.username}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email:</span>
                <span className="font-medium text-gray-800">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Role:</span>
                <span className="font-medium text-gray-800">{user.role}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#FBF8EF] rounded-xl p-4 border border-[#C9E6F0]">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Thông tin liên hệ
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Số điện thoại:</span>
                <span className="font-medium text-gray-800">{user.phone}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">Địa chỉ:</span>
                <p className="font-medium text-gray-800 wrap-break-word">
                  {user.address}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons (mock) */}
        <div className="flex flex-wrap gap-3 border-t border-gray-200 pt-4">
          <button className="inline-flex items-center rounded-lg bg-[#78B3CE] px-4 py-2 text-sm font-medium text-white shadow hover:bg-[#5d96b0]">
            ✏️ Chỉnh sửa thông tin (mock)
          </button>
          <button className="inline-flex items-center rounded-lg bg-[#F96E2A] px-4 py-2 text-sm font-medium text-white shadow hover:bg-[#e56021]">
            🔐 Reset mật khẩu (mock)
          </button>
          <button
            onClick={() => navigate("/admin/usermanagement")}
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Danh sách người dùng
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
