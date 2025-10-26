"use client";

import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Grid */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-900 font-bold">🚗</span>
              </div>
              <span className="font-bold text-lg">CarShare</span>
            </div>
            <p className="text-sm text-gray-400">
              Nền tảng quản lý đồng sở hữu xe hơi toàn diện
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Sản phẩm</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition">
                  Tính năng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Giá cả
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Bảo mật
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Công ty</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition">
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Liên hệ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Điều khoản
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Chính sách
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Liên hệ</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <span className="text-blue-400">📧</span>
                <a
                  href="mailto:hello@carshare.vn"
                  className="hover:text-white transition"
                >
                  hello@carshare.vn
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">📞</span>
                <a
                  href="tel:+84123456789"
                  className="hover:text-white transition"
                >
                  +84 (123) 456-789
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5">📍</span>
                <span>Hà Nội, Việt Nam</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; 2025 CarShare. Tất cả quyền được bảo lưu.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition">
              Facebook
            </a>
            <a href="#" className="hover:text-white transition">
              Twitter
            </a>
            <a href="#" className="hover:text-white transition">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
