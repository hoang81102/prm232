import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // đóng menu khi click ra ngoài
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Danh sách template mẫu (có thể thêm/bớt)
  const TEMPLATES = [
    {
      name: "Đơn đăng ký thuê xe (DOCX)",
      href: "/templates/Application_Form_Sample.docx",
    },
    {
      name: "Hợp đồng đồng sở hữu (DOCX)",
      href: "/templates/CoOwnership_Agreement_Sample.docx",
    },
    {
      name: "Quy chế nhóm đồng sở hữu (DOC)",
      href: "/templates/Group_Policy_Sample.doc",
    },
  ] as const;

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
            <ScrollLink
              to="features"
              smooth={true}
              duration={600}
              offset={-80}
              className="cursor-pointer text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              Dịch vụ
            </ScrollLink>
            <ScrollLink
              to="how-it-works"
              smooth={true}
              duration={600}
              offset={-80}
              className="cursor-pointer text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              Cách hoạt động
            </ScrollLink>
            <ScrollLink
              to="benefits"
              smooth={true}
              duration={600}
              offset={-80}
              className="cursor-pointer text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              Lợi ích
            </ScrollLink>
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {/* Dropdown Tải mẫu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setOpen((v) => !v)}
                className="border border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white transition"
                aria-haspopup="menu"
                aria-expanded={open}
              >
                Tải mẫu
              </button>
              {open && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-72 rounded-lg border bg-white shadow-lg overflow-hidden"
                >
                  <div className="px-3 py-2 text-sm text-gray-500 border-b">
                    Chọn mẫu đơn/hồ sơ để tải xuống
                  </div>
                  <ul className="max-h-[60vh] overflow-auto">
                    {TEMPLATES.map((t) => (
                      <li key={t.href}>
                        {/* Dùng thẻ <a> để tải trực tiếp từ /public */}
                        <a
                          href={t.href}
                          download
                          className="flex items-start gap-2 px-4 py-3 text-sm hover:bg-gray-50"
                        >
                          <span className="mt-0.5">📄</span>
                          <span className="text-gray-700">{t.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <button
              onClick={() => navigate("/login")}
              className="border border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white transition"
            >
              Đăng nhập
            </button>

            <button
              onClick={() => navigate("/apply")}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Bắt đầu ngay
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
