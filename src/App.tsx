import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./page/Login";
import HomePage from "./page/HomePage";
import HomePage from "./page/HomePage";
import Register from "./page/Register";
import ForgotPassword from "./page/forgotPassword";

import ApplicantUploadForm from "./components/ApplicantUploadForm";
import ApplicationFormManagement from "./components/ApplicationFormManagement";

import UserManagement from "./components/Admin/UserManagement";
import UserDetails from "./components/Admin/UserDetails";
import GroupManagement from "./components/Admin/GroupManagement";
import GroupDetails from "./components/Admin/GroupDetails";
import AdminDashboard from "./components/Admin/AdminDashboard";

import UserLayout from "./layout/CoOwnerLayout";
import AdminLayout from "./layout/AdminLayout";

import WeeklySchedule from "./components/CoOwner/WeeklySchedule";
import UserProfile from "./components/CoOwner/CoOwnerProfile";
import UserDashboard from "./components/CoOwner/CoOwnerDashboard";

import ChangePassword from "./page/ChangePassword";

// 👇 import ProtectedRoute
import ProtectedRoute from "./Routes/ProtectedRoute";
import Permission from "./page/Permission";
import CoOwnerOnboarding from "./components/CoOwner/CoOwnerOnboarding";
import CoOwnerCost from "./components/CoOwner/CoOwnerCost";
import CoOwnerVote from "./components/CoOwner/CoOwnerVote";
import CoOwnerGroupPage from "./components/CoOwner/CoOwnerGroupPage";
import Vehicles from "./page/Vehicles";

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/apply" element={<ApplicantUploadForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/permission" element={<Permission />} />

        {/* Admin Routes in AdminLayout */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* các path con KHÔNG cần /admin ở trước */}
          <Route path="usermanagement" element={<UserManagement />} />
          <Route path="usermanagement/:id" element={<UserDetails />} />
          <Route path="groups" element={<GroupManagement />} />
          <Route path="groups/:id" element={<GroupDetails />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>

        {/* CoOwner Routes in UserLayout */}
        <Route
          path="/CoOwner"
          element={
            <ProtectedRoute allowedRoles={["Staff", "CoOwner"]}>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="grouppage" element={<CoOwnerGroupPage />} />
          <Route path="grouppage/onboarding" element={<CoOwnerOnboarding />} />
          <Route path="schedules" element={<WeeklySchedule />} />
          <Route path="cost" element={<CoOwnerCost />} />
          <Route path="vote" element={<CoOwnerVote />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>
      </Routes>

      {/* Toast container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
    </>
  );
}

export default App;
