import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

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

const AppRoutes = () => {
  return (
    <Routes>

      {/* Auth */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ADMIN */}
      <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/loan-cases" element={<ProtectedRoute role="admin"><LoanCases /></ProtectedRoute>} />
      <Route path="/admin/customers" element={<ProtectedRoute role="admin"><Customers /></ProtectedRoute>} />
      <Route path="/admin/documents" element={<ProtectedRoute role="admin"><Documents /></ProtectedRoute>} />
      <Route path="/admin/banks" element={<ProtectedRoute role="admin"><Banks /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute role="admin"><Reports /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute role="admin"><Settings /></ProtectedRoute>} />

      {/* BANK */}
      <Route path="/bank/dashboard" element={<ProtectedRoute role="bank"><BankDashboard /></ProtectedRoute>} />
      <Route path="/bank/applications" element={<ProtectedRoute role="bank"><Applications /></ProtectedRoute>} />
      <Route path="/bank/review" element={<ProtectedRoute role="bank"><Review /></ProtectedRoute>} />
      <Route path="/bank/documents" element={<ProtectedRoute role="bank"><BankDocuments /></ProtectedRoute>} />
      <Route path="/bank/offers" element={<ProtectedRoute role="bank"><Offers /></ProtectedRoute>} />
      <Route path="/bank/reports" element={<ProtectedRoute role="bank"><BankReports /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Login />} />

    </Routes>
  );
};

export default AppRoutes;