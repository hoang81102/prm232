import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { ReactNode } from "react";
import { Car, FileText, Group, HomeIcon, Menu, Settings, User, UsersRound, X, type Home } from "lucide-react";
import { FaMoneyBill } from "react-icons/fa";
import { Button } from "../components/ui/button";

type MenuSubItem = {
  title: string;
  path: string;
};

type MenuItem = {
  id: string; // có thể thu hẹp thành union nếu muốn: "users" | "products" | "orders"
  title: string;
  icon: ReactNode; // cho phép emoji hoặc JSX
  path: string;
  hasDropdown: boolean;
  subItems?: MenuSubItem[]; // có thể undefined
};

const AdminSideBar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      title: "Admin Dashboard",
      icon: <HomeIcon />,
      path: "/admin/dashboard",
      hasDropdown: false,
    },
    {
      id: "users",
      title: "Quản lí tài khoản",
      icon: <User />,
      path: "/admin/usermanagement",
      hasDropdown: false,
    },
    {
      id: "groups",
      title: "Quản lí nhóm",
      icon: <UsersRound />,
      path: "/admin/groups",
      hasDropdown: false,
    },
    {
      id: "vehicles",
      title: "Quản lí xe",
      icon: <Car />,
      path: "/admin/vehicles",
      hasDropdown: false,
    },
    {
      id: "contracts",
      title: "Quản lí hợp đồng",
      icon: <FileText />,
      path: "/admin/contracts",
      hasDropdown: false,
    },
 {
      id: "finances",
      title: "Quản lí tài chính",
      icon: <FaMoneyBill />,
      path: "/admin/contracts",
      hasDropdown: false,
    },
   
  ];

  const handleDropdownToggle = (itemId: string) => {
    setActiveDropdown((prev) => (prev === itemId ? null : itemId));
  };

  const isActiveRoute = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      toast.success("Successfully logged out");
      navigate("/");
    }
  };

  return (
    <div
      className={`bg-[rgb(255,255,255)] h-screen shadow-2xl transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-72"
      } flex flex-col`}
    >
      {/* Header */}
      <div className="p-6 border-b border-[#C9E6F0]">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-400 rounded-full flex items-center justify-center text-white font-bold">
                <Car />
              </div>
              <div>
                <h2 className="text-emerald-400 font-bold text-lg">
                  Admin Portal
                </h2>
                <p className="text-gray-500 text-xs">Management System</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed((v) => !v)}
            className="shrink-0"
          >
            {!isCollapsed ? (
              <X className="w-5 h-5 hover:bg-emerald-300 rounded-sm " />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-4">
          {menuItems.map((item) => (
            <li key={item.id}>
              <div>
                {item.hasDropdown ? (
                  <button
                    onClick={() => handleDropdownToggle(item.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                      isActiveRoute(item.path)
                        ? "bg-[#F96E2A] text-white shadow-lg"
                        : "text-[#78B3CE] hover:bg-[#C9E6F0]"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{item.icon}</span>
                      {!isCollapsed && (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </div>
                    {!isCollapsed && (
                      <span
                        className={`transition-transform duration-200 ${
                          activeDropdown === item.id ? "rotate-180" : ""
                        }`}
                      >
                        ▼
                      </span>
                    )}
                  </button>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                      isActiveRoute(item.path)
                        ? "bg-emerald-300 text-white shadow-lg"
                        : "text-black hover:bg-emerald-200"
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    {!isCollapsed && (
                      <span className="font-medium">{item.title}</span>
                    )}
                  </Link>
                )}
              </div>

              {/* Dropdown Menu */}
              {item.hasDropdown &&
                activeDropdown === item.id &&
                !isCollapsed &&
                (item.subItems?.length ?? 0) > 0 && (
                  <ul className="mt-2 ml-6 space-y-1">
                    {(item.subItems ?? []).map((subItem, index) => (
                      <li key={index}>
                        <Link
                          to={subItem.path}
                          className={`block p-2 pl-4 rounded-lg text-sm transition-colors duration-200 ${
                            isActiveRoute(subItem.path)
                              ? "bg-[#F96E2A] text-white"
                              : "text-gray-600 hover:bg-[#C9E6F0] hover:text-[#78B3CE]"
                          }`}
                        >
                          • {subItem.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer - Logout */}
    
      <div className="p-4 border-t border-borde">
          <Button
            variant="outline"
            className="w-full gap-2 hover:bg-emerald-300"
            onClick={handleLogout}
          >
            <Settings className="w-4 h-4" />
            {!isCollapsed && (
              <span className="text-sm font-medium">Logout</span>
            )}
          </Button>
        </div>
    </div>
  );
};

export default AdminSideBar;
