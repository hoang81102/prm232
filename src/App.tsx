import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./page/Login";
import HomePage from "./page/HomePage";
import Register from "./page/Register";
import ForgotPassword from "./page/forgotPassword";
import ApplicantUploadForm from "./components/ApplicantUploadForm";
import UserDetails from "./components/Admin/UserDetails";
import GroupManagement from "./components/Admin/GroupManagement";
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
// import CoOwnerOnboarding from "./components/CoOwner/CoOwnerOnboarding";
import CoOwnerCost from "./components/CoOwner/CoOwnerCost";
import CoOwnerVote from "./components/CoOwner/CoOwnerVote";
import VoteDetail from "./components/CoOwner/VoteDetail";
import GroupList from "./components/CoOwner/GroupList";
import GroupDetail from "./components/CoOwner/GroupDetail";
import CoOwnerDispute from "./components/CoOwner/CoOwnerDispute";
import CoOwnerContract from "./components/CoOwner/CoOwnerContract";
import PendingInvoicesPage from "./components/CoOwner/PendingInvoicesPage";
import InvoiceDetailPage from "./components/CoOwner/InvoiceDetailPage";
import TransactionHistoryPage from "./components/CoOwner/TransactionHistoryPage";
import Vehicles from "./page/Vehicles";
import UsersManagement from "./page/Account";
import VoteManagement from "./components/Admin/VoteManagement";
import DisputeManagement from "./components/Admin/DisputeManagement";

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
          <Route path="usersmanagement" element={<UsersManagement />} />
          <Route path="usermanagement/:id" element={<UserDetails />} />
          <Route path="groups" element={<GroupManagement />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="votes" element={<VoteManagement />} />
          <Route path="disputes" element={<DisputeManagement />} />
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
          <Route path="grouppage" element={<GroupList />} />
          <Route path="grouppage/:groupId" element={<GroupDetail />} />
          <Route path="grouppage/:groupId/votes" element={<CoOwnerVote />} />
          <Route
            path="grouppage/:groupId/disputes"
            element={<CoOwnerDispute />}
          />
          <Route path="grouppage/:groupId/payments" element={<CoOwnerCost />} />
          <Route
            path="grouppage/:groupId/contracts"
            element={<CoOwnerContract />}
          />
          <Route path="schedules" element={<WeeklySchedule />} />
          <Route path="cost" element={<CoOwnerCost />} />
          <Route path="vote" element={<CoOwnerVote />} />
          <Route path="vote/:voteId" element={<VoteDetail />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="billing/pending" element={<PendingInvoicesPage />} />
          <Route
            path="billing/invoices/:invoiceId"
            element={<InvoiceDetailPage />}
          />
          <Route path="billing/history" element={<TransactionHistoryPage />} />
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
