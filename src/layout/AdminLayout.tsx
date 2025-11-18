import { Outlet } from "react-router-dom";
import AdminSideBar from "./AdminSidebar";

const AdminLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-[#FBF8EF]">
      <AdminSideBar />

      {/* Main content area */}
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto bg-white p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
