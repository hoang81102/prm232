import { Outlet } from "react-router-dom";
import UserSidebar from "./CoOwnerSidebar";

const UserLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-[#FBF8EF]">
      <UserSidebar />

      {/* Main content area */}
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
