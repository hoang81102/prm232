import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";

const Register: React.FC = () => {
  const navigate = useNavigate();

  // State quản lý form (đúng theo payload backend)
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>(""); // tên
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [gender, setGender] = useState<string>("Male");
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleRegister = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    // ✅ Kiểm tra dữ liệu cơ bản (theo schema backend)
    if (
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !email ||
      !password ||
      !passwordConfirm ||
      !dateOfBirth // ⬅️ thêm ngày sinh để khớp schema
    ) {
      alert("Vui lòng nhập đầy đủ các thông tin bắt buộc!");
      return;
    }

    if (password !== passwordConfirm) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    const payload = {
      phoneNumber,
      password,
      passwordConfirm,
      email,
      firstName,
      lastName,
      gender,
      dateOfBirth, // input type="date" sẽ gửi format yyyy-MM-dd
      address,
    };

    try {
      setLoading(true);
      const result = await registerUser(payload);

      if (result.success) {
        alert("Đăng ký thành công! Vui lòng đăng nhập.");
        navigate("/login");
      } else {
        alert(result.message || "Đăng ký thất bại!");
      }
    } catch (error) {
      console.error("REGISTER ERROR:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
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
          {/* Họ + Tên */}
          <div className="mb-5 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#2C5364] text-sm font-semibold mb-2">
                Họ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="VD: Nguyễn"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-xl text-base outline-none transition-colors duration-300 focus:border-[#2C5364]"
                required
              />
            </div>
            <div>
              <label className="block text-[#2C5364] text-sm font-semibold mb-2">
                Tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="VD: Văn A"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-xl text-base outline-none transition-colors duration-300 focus:border-[#2C5364]"
                required
              />
            </div>
          </div>

          {/* Số điện thoại */}
          <div className="mb-5">
            <label className="block text-[#2C5364] text-sm font-semibold mb-2">
              Số điện thoại <span className="text-red-500">*</span>
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

          {/* Email */}
          <div className="mb-5">
            <label className="block text-[#2C5364] text-sm font-semibold mb-2">
              Email <span className="text-red-500">*</span>
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

          {/* Giới tính + Ngày sinh */}
          <div className="mb-5 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#2C5364] text-sm font-semibold mb-2">
                Giới tính
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-xl text-base outline-none transition-colors duration-300 focus:border-[#2C5364]"
              >
                <option value="Male">Nam</option>
                <option value="Female">Nữ</option>
                <option value="Other">Khác</option>
              </select>
            </div>
            <div>
              <label className="block text-[#2C5364] text-sm font-semibold mb-2">
                Ngày sinh <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-xl text-base outline-none transition-colors duration-300 focus:border-[#2C5364]"
                required
              />
            </div>
          </div>

          {/* Địa chỉ */}
          <div className="mb-5">
            <label className="block text-[#2C5364] text-sm font-semibold mb-2">
              Địa chỉ
            </label>
            <input
              type="text"
              placeholder="Nhập địa chỉ"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl text-base outline-none transition-colors duration-300 focus:border-[#2C5364]"
            />
          </div>

          {/* Mật khẩu */}
          <div className="mb-5">
            <label className="block text-[#2C5364] text-sm font-semibold mb-2">
              Mật khẩu <span className="text-red-500">*</span>
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

          {/* Xác nhận mật khẩu */}
          <div className="mb-5">
            <label className="block text-[#2C5364] text-sm font-semibold mb-2">
              Xác nhận mật khẩu <span className="text-red-500">*</span>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nhập lại mật khẩu"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl text-base outline-none transition-colors duration-300 focus:border-[#2C5364]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#F96E2A] text-white p-4 rounded-xl text-base font-semibold cursor-pointer shadow-lg shadow-[#F96E2A]/40 transition-all duration-300 hover:bg-[#e55a1f] hover:-translate-y-1 mb-5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
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
