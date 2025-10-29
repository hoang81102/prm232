import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const navigate = useNavigate();

  // State quản lý form
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Hàm xử lý đăng ký
  const handleRegister = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // ✅ Kiểm tra dữ liệu
    if (!name || !email || !password || !confirmPassword) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    // ✅ Giả lập đăng ký thành công
    alert("Đăng ký thành công! Vui lòng đăng nhập.");
    navigate("/login"); // 👉 Điều hướng về trang đăng nhập
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#b3cfdb] via-[#71b2c8] to-[#2C5364] flex items-center justify-center p-5 font-sans">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md text-center">
        {/* Header */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-[#2C5364] rounded-full mx-auto mb-5 flex items-center justify-center text-4xl text-white font-bold shadow-lg">
            🧾
          </div>
          <h1 className="text-[#2C5364] text-3xl font-bold mb-2">
            Tạo tài khoản
          </h1>
          <p className="text-gray-500 text-sm">
            Đăng ký để bắt đầu hành trình thuê xe của bạn.
          </p>
        </div>

        {/* Form đăng ký */}
        <form onSubmit={handleRegister} className="text-left">
          <div className="mb-5">
            <label className="block text-[#2C5364] text-sm font-semibold mb-2">
              Họ và tên
            </label>
            <input
              type="text"
              placeholder="Nhập họ và tên"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl text-base outline-none transition-colors duration-300 focus:border-[#2C5364]"
              required
            />
          </div>

          <div className="mb-5">
            <label className="block text-[#2C5364] text-sm font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          <div className="mb-5">
            <label className="block text-[#2C5364] text-sm font-semibold mb-2">
              Xác nhận mật khẩu
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl text-base outline-none transition-colors duration-300 focus:border-[#2C5364]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#F96E2A] text-white p-4 rounded-xl text-base font-semibold cursor-pointer shadow-lg shadow-[#F96E2A]/40 transition-all duration-300 hover:bg-[#e55a1f] hover:-translate-y-1 mb-5"
          >
            Đăng ký
          </button>
        </form>

        {/* Đã có tài khoản */}
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            Đã có tài khoản?{" "}
            <Link
              to="/login"
              className="text-[#F96E2A] font-medium underline hover:text-[#e55a1f] transition-colors"
            >
              Đăng nhập ngay
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

export default Register;
