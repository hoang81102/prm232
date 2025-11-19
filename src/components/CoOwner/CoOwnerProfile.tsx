// src/components/User/UserProfile.tsx
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { fetchMe, updateProfile, getUserInfo } from "../../api/authApi";

type UserProfileInfo = {
  userId: number;
  phoneNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  role: string;
};

const DEFAULT_PROFILE: UserProfileInfo = {
  userId: 0,
  phoneNumber: "",
  email: "",
  firstName: "",
  lastName: "",
  gender: "",
  dateOfBirth: "",
  address: "",
  role: "CoOwner",
};

const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfileInfo>(DEFAULT_PROFILE);
  const [editingProfile, setEditingProfile] =
    useState<UserProfileInfo>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);


  // =========================
  //   LOAD PROFILE TỪ API /auth/me
  // =========================
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const me = await fetchMe();

        const tokenUser = getUserInfo();
        const role = tokenUser?.role ?? "CoOwner";

        const merged: UserProfileInfo = {
          ...DEFAULT_PROFILE,
          ...me,
          role: String(role),
        };

        setProfile(merged);
        setEditingProfile(merged);
      } catch (error) {
        console.error("LOAD PROFILE ERROR", error);
      } finally {
        setLoading(false);
      }
    };

    void loadProfile();
  }, []);

  const handleProfileChange = (field: keyof UserProfileInfo, value: string) => {
    setEditingProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // =========================
  //   SAVE PROFILE -> PATCH /auth/me
  // =========================
  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingProfile.firstName.trim()) {
      toast.error("Họ không được để trống");
      return;
    }
    if (!editingProfile.lastName.trim()) {
      toast.error("Tên không được để trống");
      return;
    }
    if (!editingProfile.email.trim()) {
      toast.error("Email không được để trống");
      return;
    }

    try {
      const payload = {
        email: editingProfile.email,
        firstName: editingProfile.firstName,
        lastName: editingProfile.lastName,
        gender: editingProfile.gender,
        dateOfBirth: editingProfile.dateOfBirth,
        address: editingProfile.address,
      };

      await updateProfile(payload); // chỉ cần chờ thành công

      // 🚀 Dùng editingProfile làm source-of-truth để cập nhật UI
      const merged: UserProfileInfo = {
        ...profile,
        ...editingProfile,
      };

      setProfile(merged);
      setEditingProfile(merged);
      setIsEditing(false); // thoát chế độ edit
    } catch (error) {
      console.error("SAVE PROFILE ERROR", error);
    }
  };


  const handleProfileReset = () => {
    setEditingProfile(profile);
    setIsEditing(false);
  };



  const fullName = `${profile.firstName} ${profile.lastName}`.trim() || "User";

  const initials =
    fullName
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .toUpperCase() || "U";

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Đang tải hồ sơ...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1">Hồ sơ cá nhân</h1>
          <p className="text-sm text-gray-600">
            Xem thông tin tài khoản của bạn và chỉnh sửa khi cần.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center justify-center rounded-lg border border-[#78B3CE] bg-white px-4 py-2 text-sm font-medium text-[#78B3CE] shadow-sm hover:bg-[#E5F2F7]"
          >
            ✏️ Chỉnh sửa hồ sơ
          </button>

         
        </div>
      </div>

      {/* Card hồ sơ */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-6">
        {/* Avatar + info cơ bản */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#78B3CE] flex items-center justify-center text-white font-bold text-2xl">
              {initials}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {fullName}
              </h2>
              <p className="text-sm text-gray-500">{profile.email}</p>
              <span className="inline-flex mt-1 rounded-full bg-[#C9E6F0] px-3 py-1 text-xs font-medium text-[#78B3CE]">
                Role: {profile.role}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-1 text-sm text-gray-600">
            <span>
              📞{" "}
              <span className="font-medium">
                {profile.phoneNumber || "Chưa cập nhật"}
              </span>
            </span>
            <span>
              📍{" "}
              <span className="font-medium">
                {profile.address || "Chưa cập nhật"}
              </span>
            </span>
          </div>
        </div>

        {/* ======================== */}
        {/* VIEW MODE (GET /auth/me) */}
        {/* ======================== */}
        {!isEditing && (
          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Thông tin chi tiết
            </h3>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <div>
                <dt className="text-gray-500">Họ</dt>
                <dd className="font-medium text-gray-800">
                  {profile.firstName || "Chưa cập nhật"}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Tên</dt>
                <dd className="font-medium text-gray-800">
                  {profile.lastName || "Chưa cập nhật"}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Email</dt>
                <dd className="font-medium text-gray-800">
                  {profile.email || "Chưa cập nhật"}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Giới tính</dt>
                <dd className="font-medium text-gray-800">
                  {profile.gender || "Chưa cập nhật"}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Ngày sinh</dt>
                <dd className="font-medium text-gray-800">
                  {profile.dateOfBirth || "Chưa cập nhật"}
                </dd>
              </div>
              <div className="md:col-span-2">
                <dt className="text-gray-500">Địa chỉ</dt>
                <dd className="font-medium text-gray-800">
                  {profile.address || "Chưa cập nhật"}
                </dd>
              </div>
            </dl>
          </div>
        )}

        {/* ======================== */}
        {/* EDIT MODE (PATCH /auth/me) */}
        {/* ======================== */}
        {isEditing && (
          <form
            onSubmit={handleProfileSave}
            className="border-t border-gray-100 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* First name */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Họ
              </label>
              <input
                type="text"
                value={editingProfile.firstName}
                onChange={(e) =>
                  handleProfileChange("firstName", e.target.value)
                }
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#78B3CE] focus:outline-none focus:ring-2 focus:ring-[#C9E6F0]"
                placeholder="Nguyễn"
              />
            </div>

            {/* Last name */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Tên
              </label>
              <input
                type="text"
                value={editingProfile.lastName}
                onChange={(e) =>
                  handleProfileChange("lastName", e.target.value)
                }
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#78B3CE] focus:outline-none focus:ring-2 focus:ring-[#C9E6F0]"
                placeholder="Văn A"
              />
            </div>

            {/* Email */}
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

            {/* Phone number (readonly) */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Số điện thoại
              </label>
              <input
                type="tel"
                value={editingProfile.phoneNumber}
                disabled
                className="block w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600 shadow-sm"
                placeholder="VD: 0901234567"
              />
            </div>

            {/* Gender */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Giới tính
              </label>
              <select
                value={editingProfile.gender}
                onChange={(e) => handleProfileChange("gender", e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[#78B3CE] focus:outline-none focus:ring-2 focus:ring-[#C9E6F0]"
              >
                <option value="">Chưa chọn</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>

            {/* Date of birth */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Ngày sinh
              </label>
              <input
                type="date"
                value={editingProfile.dateOfBirth}
                onChange={(e) =>
                  handleProfileChange("dateOfBirth", e.target.value)
                }
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#78B3CE] focus:outline-none focus:ring-2 focus:ring-[#C9E6F0]"
              />
            </div>

            {/* Address */}
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
                Hủy chỉnh sửa
              </button>
              <button
                type="submit"
                className="inline-flex items-center rounded-lg bg-[#78B3CE] px-4 py-2 text-sm font-medium text-white shadow hover:bg-[#5d96b0]"
              >
                Lưu thay đổi
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
