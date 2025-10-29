import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email) {
      alert("Vui lòng nhập email của bạn!");
      return;
    }

    // ✅ Giả lập gửi mail khôi phục
    alert("Yêu cầu đặt lại mật khẩu đã được gửi đến email của bạn!");
    navigate("/login"); // Quay lại trang đăng nhập
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#b3cfdb] via-[#71b2c8] to-[#2C5364] flex items-center justify-center p-5 font-sans">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md text-center">
        {/* Header */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-[#2C5364] rounded-full mx-auto mb-5 flex items-center justify-center text-4xl text-white font-bold shadow-lg">
            🔑
          </div>
          <h1 className="text-[#2C5364] text-3xl font-bold mb-2">
            Quên mật khẩu
          </h1>
          <p className="text-gray-500 text-sm">
            Nhập email để nhận liên kết đặt lại mật khẩu.
          </p>
        </div>

        {/* Form quên mật khẩu */}
        <form onSubmit={handleSubmit} className="text-left">
          <div className="mb-5">
            <label className="block text-[#2C5364] text-sm font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl text-base outline-none transition-colors duration-300 focus:border-[#2C5364]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#F96E2A] text-white p-4 rounded-xl text-base font-semibold cursor-pointer shadow-lg shadow-[#F96E2A]/40 transition-all duration-300 hover:bg-[#e55a1f] hover:-translate-y-1 mb-5"
          >
            Gửi yêu cầu đặt lại
          </button>
        </form>

        {/* Điều hướng trở lại đăng nhập */}
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            Quay lại{" "}
            <Link
              to="/login"
              className="text-[#F96E2A] font-medium underline hover:text-[#e55a1f] transition-colors"
            >
              Đăng nhập
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-5 border-t border-gray-200 text-gray-400 text-xs">
          © 2025 CarRental Pro. Mọi quyền được bảo lưu.
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
