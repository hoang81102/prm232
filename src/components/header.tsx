import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-scroll";

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Container */}
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🚗</span>
            </div>
            <span className="font-bold text-xl text-gray-800">CarShare</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="features"
              smooth={true}
              duration={600}
              offset={-80}
              className="cursor-pointer text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              Dịch vụ
            </Link>
            <Link
              to="how-it-works"
              smooth={true}
              duration={600}
              offset={-80}
              className="cursor-pointer text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              Cách hoạt động
            </Link>
            <Link
              to="benefits"
              smooth={true}
              duration={600}
              offset={-80}
              className="cursor-pointer text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              Lợi ích
            </Link>
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="border border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white transition"
            >
              Đăng nhập
            </button>

            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
              Bắt đầu ngay
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
