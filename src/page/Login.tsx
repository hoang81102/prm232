import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// chỉnh lại path cho đúng với project của bạn
import { loginUser } from "../api/authApi";

const Login: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>(""); // ✅ dùng phoneNumber
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      // ✅ Gọi đúng API: body { phoneNumber, password }
      const result = await loginUser(phoneNumber, password);

      if (result?.success) {
        const role = result.user.role; // "Admin" | "Staff" | "CoOwner"

        // 🔀 Điều hướng theo role
        if (role === "Admin") {
          navigate("/admin");
        } else if (role === "Staff") {
          navigate("/staff");
        } else if (role === "CoOwner") {
          navigate("/CoOwner/dashboard");
        } else {
          // fallback nếu role lạ
          navigate("/");
        }
      } else {
        // nếu loginUser trả về success = false
        alert(result?.message || "Đăng nhập thất bại!");
      }
    } catch (err) {
      // phòng trường hợp lỗi bất ngờ
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#b3cfdb] via-[#71b2c8] to-[#2C5364] flex items-center justify-center p-5 font-sans">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md text-center">
        {/* Logo / Header */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-[#2C5364] rounded-full mx-auto mb-5 flex items-center justify-center text-4xl text-white font-bold shadow-lg">
            🚗
          </div>
          <h1 className="text-[#2C5364] text-3xl font-bold mb-2">
            CarRental Pro
          </h1>
          <p className="text-gray-500 text-sm">
            Đăng nhập để bắt đầu hành trình thuê xe của bạn.
          </p>
        </div>

        {/* Form đăng nhập */}
        <form onSubmit={handleLogin} className="text-left">
          {/* ✅ ĐỔI TỪ EMAIL → SỐ ĐIỆN THOẠI */}
          <div className="mb-5">
            <label className="block text-[#2C5364] text-sm font-semibold mb-2">
              Số điện thoại
            </label>
            <input
              type="tel"
              placeholder="Nhập số điện thoại"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl text-base outline-none transition-colors duration-300 focus:border-[#2C5364]"
              required
            />
          </div>

          <div className="mb-5">
            <label className="block text-[#2C5364] text-sm font-semibold mb-2">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 pr-12 border-2 border-gray-200 rounded-xl text-base outline-none transition-colors duration-300 focus:border-[#2C5364]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#2C5364] text-sm hover:text-[#1b3a46] transition-colors"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#F96E2A] text-white p-4 rounded-xl text-base font-semibold cursor-pointer shadow-lg shadow-[#F96E2A]/40 transition-all duration-300 hover:bg-[#e55a1f] hover:-translate-y-1 mb-5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        {/* Quên mật khẩu */}
        <div className="text-center mb-4">
          <Link
            to="/forgot-password"
            className="text-[#F96E2A] text-sm underline hover:text-[#e55a1f] transition-colors"
          >
            Quên mật khẩu?
          </Link>
        </div>

        {/* 👉 Nút điều hướng sang Register */}
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="text-[#F96E2A] font-medium underline hover:text-[#e55a1f] transition-colors"
            >
              Đăng ký ngay
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

export default Login;
