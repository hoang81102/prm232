import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ChangePassword: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error("Vui lòng nhập đầy đủ các trường");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("Mật khẩu mới và xác nhận không khớp");
      return;
    }

    // Call API thật nếu bạn có
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      toast.success("Đổi mật khẩu thành công (mock)");
      navigate("/user/profile");
    }, 800);
  };

  return (
    <div className="h-full flex items-center justify-center px-4 py-6">
      {/* Khối chính ở giữa màn hình */}
      <div className="w-full max-w-xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">
              Đổi mật khẩu
            </h1>
            <p className="text-sm text-gray-600">
              Cập nhật mật khẩu mới để bảo vệ tài khoản của bạn.
            </p>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs md:text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            ⬅ Quay lại
          </button>
        </div>

        {/* Card form */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Mật khẩu hiện tại
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#78B3CE] focus:outline-none focus:ring-2 focus:ring-[#C9E6F0]"
                placeholder="Nhập mật khẩu hiện tại"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Mật khẩu mới
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#78B3CE] focus:outline-none focus:ring-2 focus:ring-[#C9E6F0]"
                placeholder="Nhập mật khẩu mới"
              />
              <p className="text-xs text-gray-500">
                Nên có ít nhất 6 ký tự, bao gồm cả chữ, số hoặc ký tự đặc biệt.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Xác nhận mật khẩu mới
              </label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#78B3CE] focus:outline-none focus:ring-2 focus:ring-[#C9E6F0]"
                placeholder="Nhập lại mật khẩu mới"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => navigate("/user/profile")}
                className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center rounded-lg bg-[#F96E2A] px-4 py-2 text-sm font-medium text-white shadow hover:bg-[#e56021] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
              </button>
            </div>
          </form>
        </div>

        <p className="text-xs text-gray-500 text-center">
          Nếu bạn quên mật khẩu hiện tại, hãy sử dụng chức năng{" "}
          <span className="font-semibold">"Quên mật khẩu"</span> ở trang đăng
          nhập để đặt lại qua email.
        </p>
      </div>
    </div>
  );
};

export default ChangePassword;
