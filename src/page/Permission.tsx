import React from "react";
import { useNavigate } from "react-router-dom";
import { getUserInfo } from "../api/authApi"; 

const Permission: React.FC = () => {
  const navigate = useNavigate();
  const user = getUserInfo();

  const handleGoHome = () => {
    // Điều hướng theo role nếu có
    if (user?.role === "Admin") {
      navigate("/admin");
    } else if (user?.role === "Staff") {
      navigate("/staff");
    } else if (user?.role === "CoOwner") {
      navigate("/CoOwner/dashboard");
    } else {
      navigate("/"); // fallback
    }
  };

  const handleGoLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#b3cfdb] via-[#71b2c8] to-[#2C5364] flex items-center justify-center p-5 font-sans">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-lg text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl text-red-500 shadow-md">
          🔒
        </div>

        {/* Tiêu đề */}
        <h1 className="text-2xl md:text-3xl font-bold text-[#2C5364] mb-3">
          Không có quyền truy cập
        </h1>

        {/* Mô tả */}
        <p className="text-gray-600 mb-6 text-sm md:text-base">
          Có vẻ như bạn đang cố truy cập vào một trang không phù hợp với quyền
          hiện tại của mình.
        </p>

        {user && (
          <p className="text-gray-500 mb-6 text-xs md:text-sm">
            Tài khoản hiện tại của bạn có quyền:{" "}
            <span className="font-semibold text-[#2C5364]">{user.role}</span>
          </p>
        )}

        {/* Các nút hành động */}
        <div className="flex flex-col md:flex-row gap-3 justify-center">
          <button
            onClick={handleGoHome}
            className="w-full md:w-auto bg-[#2C5364] text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-md hover:bg-[#1b3a46] hover:-translate-y-0.5 transition-all"
          >
            Về trang phù hợp với quyền
          </button>

          <button
            onClick={handleGoLogin}
            className="w-full md:w-auto bg-white border-2 border-[#F96E2A] text-[#F96E2A] px-6 py-3 rounded-xl text-sm font-semibold shadow-md hover:bg-[#F96E2A] hover:text-white hover:-translate-y-0.5 transition-all"
          >
            Đăng nhập tài khoản khác
          </button>
        </div>

        {/* Footer nhỏ */}
        <div className="mt-8 pt-5 border-t border-gray-200 text-gray-400 text-xs">
          Nếu bạn nghĩ đây là lỗi, hãy liên hệ quản trị viên hệ thống.
        </div>
      </div>
    </div>
  );
};

export default Permission;
