import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route } from "react-router-dom";

import Login from "./page/Login";
import HomePage from "./page/HomePage";
import HowItWorks from "./page/HomePage";
import Register from "./page/Register";
import ForgotPassword from "./page/forgotPassword";
import UserManagement from "./components/Admin/UserManagement";
import ApplicationFormManagement from "./components/ApplicationFormManagement";
import ApplicantUploadForm from "./components/ApplicantUploadForm";
import WeeklySchedule from "./components/User/WeeklySchedule";

import AdminLayout from "./layout/AdminLayout";
import UserLayout from "./layout/UserLayout";
import UserProfile from "./components/User/UserProfile";
import ChangePassword from "./page/ChangePassword";
import UserDashboard from "./components/User/UserDashboard";
import AdminDashboard from "./components/Admin/AdminDashboard";
import UserDetails from "./components/Admin/UserDetails";
import GroupManagement from "./components/Admin/GroupManagement";
import GroupDetails from "./components/Admin/GroupDetails";

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
        <Route path="/how-it-works" element={<HowItWorks />} />

        {/* Admin Routes in AdminLayout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="usermanagement" element={<UserManagement />} />
          <Route path="/admin/usermanagement/:id" element={<UserDetails />} />
          <Route path="/admin/groups" element={<GroupManagement />} />
          <Route path="/admin/groups/:id" element={<GroupDetails />} />
          <Route path="applications" element={<ApplicationFormManagement />} />
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>

        {/* User Routes in UserLayout */}
        <Route path="/user" element={<UserLayout />}>
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="schedules" element={<WeeklySchedule />} />
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
