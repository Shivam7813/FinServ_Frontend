/// src/routes/AppRoutes.jsx

import { Routes, Route } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// ✅ FIXED PATH (IMPORTANT)
import CreateLoanCase from "../pages/admin/CreateLoanCase";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// 🔹 Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import LoanCases from "../pages/admin/LoanCases";
import Customers from "../pages/admin/Customers";
import Documents from "../pages/admin/Documents";
import Banks from "../pages/admin/Banks";
import Reports from "../pages/admin/Reports";
import Settings from "../pages/admin/Settings";

// 🔹 Bank Pages
import BankDashboard from "../pages/bank/BankDashboard";
import Applications from "../pages/bank/Applications";
import Review from "../pages/bank/Review";
import BankDocuments from "../pages/bank/Documents";
import Offers from "../pages/bank/Offers";
import BankReports from "../pages/bank/Reports";

// 🔹 User Pages
import UserDashboard from "../pages/user/UserDashboard";
import ApplyLoan from "../pages/user/ApplyLoan";
import MyApplications from "../pages/user/MyApplications";
import MyDocuments from "../pages/user/MyDocuments";
import LoanOffers from "../pages/user/LoanOffers";
import UserSettings from "../pages/user/UserSettings";
import LoanStatus from "../pages/user/LoanStatus";

const AppRoutes = () => {
  return (
    <Routes>

      {/* 🔐 Auth */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ================= ADMIN ================= */}
      <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/loan-cases" element={<ProtectedRoute role="admin"><LoanCases /></ProtectedRoute>} />
      <Route path="/admin/customers" element={<ProtectedRoute role="admin"><Customers /></ProtectedRoute>} />
      <Route path="/admin/documents" element={<ProtectedRoute role="admin"><Documents /></ProtectedRoute>} />
      <Route path="/admin/banks" element={<ProtectedRoute role="admin"><Banks /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute role="admin"><Reports /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute role="admin"><Settings /></ProtectedRoute>} />

      {/* ✅ FIXED (Protected + Correct import) */}
      <Route
        path="/admin/create-loan"
        element={
          <ProtectedRoute role="admin">
            <CreateLoanCase />
          </ProtectedRoute>
        }
      />

      {/* ================= BANK ================= */}
      <Route path="/bank/dashboard" element={<ProtectedRoute role="bank"><BankDashboard /></ProtectedRoute>} />

      {/* 🔥 Applications (All) */}
      <Route path="/bank/applications" element={<ProtectedRoute role="bank"><Applications /></ProtectedRoute>} />

      {/* 🔥 NEW: Under Review Filter Page */}
      <Route path="/bank/under-review" element={<ProtectedRoute role="bank"><Applications /></ProtectedRoute>} />

      {/* 🔥 Dynamic Review */}
      <Route path="/bank/review/:id" element={<ProtectedRoute role="bank"><Review /></ProtectedRoute>} />

      {/* 🔁 Redirect review root */}
      <Route path="/bank/review" element={<Navigate to="/bank/applications" replace />} />

      <Route path="/bank/documents" element={<ProtectedRoute role="bank"><BankDocuments /></ProtectedRoute>} />
      <Route path="/bank/offers" element={<ProtectedRoute role="bank"><Offers /></ProtectedRoute>} />
      <Route path="/bank/reports" element={<ProtectedRoute role="bank"><BankReports /></ProtectedRoute>} />

      {/* ================= USER ================= */}
      <Route path="/user/dashboard" element={<ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>} />
      <Route path="/user/apply-loan" element={<ProtectedRoute role="user"><ApplyLoan /></ProtectedRoute>} />
      <Route path="/user/applications" element={<ProtectedRoute role="user"><MyApplications /></ProtectedRoute>} />
      <Route path="/user/documents" element={<ProtectedRoute role="user"><MyDocuments /></ProtectedRoute>} />
      <Route path="/user/offers" element={<ProtectedRoute role="user"><LoanOffers /></ProtectedRoute>} />
      <Route path="/user/settings" element={<ProtectedRoute role="user"><UserSettings /></ProtectedRoute>} />
      <Route path="/user/loan-status" element={<ProtectedRoute role="user"><LoanStatus /></ProtectedRoute>} />

      {/* ❌ Fallback */}
      <Route path="*" element={<Login />} />

    </Routes>
  );
};

export default AppRoutes;