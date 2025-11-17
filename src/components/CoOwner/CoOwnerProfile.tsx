// src/components/User/UserProfile.tsx
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

type UserProfileInfo = {
  username: string;
  email: string;
  phone: string;
  address: string;
  role: string;
};

const DEFAULT_PROFILE: UserProfileInfo = {
  username: "Demo User",
  email: "demo@example.com",
  phone: "0900000000",
  address: "Chưa cập nhật",
  role: "User",
};

const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfileInfo>(DEFAULT_PROFILE);
  const [editingProfile, setEditingProfile] =
    useState<UserProfileInfo>(DEFAULT_PROFILE);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<UserProfileInfo>;
        const merged: UserProfileInfo = {
          ...DEFAULT_PROFILE,
          ...parsed,
        };
        setProfile(merged);
        setEditingProfile(merged);
      }
    } catch {
      // nếu lỗi thì dùng default
    }
  }, []);

  const handleProfileChange = (field: keyof UserProfileInfo, value: string) => {
    setEditingProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingProfile.username.trim()) {
      toast.error("Tên hiển thị không được để trống");
      return;
    }
    if (!editingProfile.email.trim()) {
      toast.error("Email không được để trống");
      return;
    }

    setProfile(editingProfile);
    localStorage.setItem("user", JSON.stringify(editingProfile));
    toast.success("Cập nhật thông tin cá nhân thành công");
  };

  const handleProfileReset = () => {
    setEditingProfile(profile);
  };

  const goToChangePassword = () => {
    navigate("/user/change-password");
  };

  const initials =
    profile.username
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1">Hồ sơ cá nhân</h1>
          <p className="text-sm text-gray-600">
            Xem và cập nhật thông tin tài khoản của bạn.
          </p>
        </div>

        <button
          onClick={goToChangePassword}
          className="inline-flex items-center justify-center rounded-lg bg-[#F96E2A] px-4 py-2 text-sm font-medium text-white shadow hover:bg-[#e56021]"
        >
          🔒 Đổi mật khẩu
        </button>
      </div>

      {/* Thông tin cơ bản + Avatar */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#78B3CE] flex items-center justify-center text-white font-bold text-2xl">
              {initials}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {profile.username}
              </h2>
              <p className="text-sm text-gray-500">{profile.email}</p>
              <span className="inline-flex mt-1 rounded-full bg-[#C9E6F0] px-3 py-1 text-xs font-medium text-[#78B3CE]">
                Role: {profile.role}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-1 text-sm text-gray-600">
            <span>
              📞 <span className="font-medium">{profile.phone}</span>
            </span>
            <span>
              📍 <span className="font-medium">{profile.address}</span>
            </span>
          </div>
        </div>

        {/* Form chỉnh sửa thông tin */}
        <form
          onSubmit={handleProfileSave}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Tên hiển thị
            </label>
            <input
              type="text"
              value={editingProfile.username}
              onChange={(e) => handleProfileChange("username", e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#78B3CE] focus:outline-none focus:ring-2 focus:ring-[#C9E6F0]"
              placeholder="Tên của bạn"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={editingProfile.email}
              onChange={(e) => handleProfileChange("email", e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#78B3CE] focus:outline-none focus:ring-2 focus:ring-[#C9E6F0]"
              placeholder="email@example.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Số điện thoại
            </label>
            <input
              type="tel"
              value={editingProfile.phone}
              onChange={(e) => handleProfileChange("phone", e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#78B3CE] focus:outline-none focus:ring-2 focus:ring-[#C9E6F0]"
              placeholder="VD: 0901234567"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Địa chỉ
            </label>
            <input
              type="text"
              value={editingProfile.address}
              onChange={(e) => handleProfileChange("address", e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#78B3CE] focus:outline-none focus:ring-2 focus:ring-[#C9E6F0]"
              placeholder="Địa chỉ liên hệ / nơi ở"
            />
          </div>

          <div className="md:col-span-2 flex flex-wrap gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={handleProfileReset}
              className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Đặt lại
            </button>
            <button
              type="submit"
              className="inline-flex items-center rounded-lg bg-[#78B3CE] px-4 py-2 text-sm font-medium text-white shadow hover:bg-[#5d96b0]"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
