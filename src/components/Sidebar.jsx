import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Users,
  Folder,
  Landmark,
  BarChart,
  Settings,
  CreditCard,
  ClipboardCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const [role, setRole] = useState("admin");
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // ✅ Get role safely + normalize
  useEffect(() => {
    try {
      if (user?.role) {
        setRole(user.role.toLowerCase());
      } else {
        const storedUser = localStorage.getItem("user");
        if (storedUser && storedUser !== "undefined") {
          const parsed = JSON.parse(storedUser);
          setRole(parsed?.role?.toLowerCase() || "admin");
        }
      }
    } catch (err) {
      console.error("Sidebar user parse error:", err);
      setRole("admin");
    }
  }, [user]);

  // 🔥 Role-Based Menu
  const menuConfig = {
    admin: [
      { icon: <LayoutDashboard size={20} />, text: "Dashboard", to: "/admin/dashboard" },
      { icon: <FileText size={20} />, text: "Loan Cases", to: "/admin/loan-cases" },
      { icon: <Users size={20} />, text: "Customers", to: "/admin/customers" },
      { icon: <Folder size={20} />, text: "Documents", to: "/admin/documents" },
      { icon: <Landmark size={20} />, text: "Banks", to: "/admin/banks" },
      { icon: <BarChart size={20} />, text: "Reports", to: "/admin/reports" },
      { icon: <Settings size={20} />, text: "Settings", to: "/admin/settings" },
    ],

    bank: [
      { icon: <LayoutDashboard size={20} />, text: "Dashboard", to: "/bank/dashboard" },
      { icon: <FileText size={20} />, text: "Loan Applications", to: "/bank/applications" },
      { icon: <ClipboardCheck size={20} />, text: "Under Review", to: "/bank/review" },
      { icon: <Folder size={20} />, text: "Documents", to: "/bank/documents" },
      { icon: <CreditCard size={20} />, text: "Loan Offers", to: "/bank/offers" },
      { icon: <BarChart size={20} />, text: "Reports", to: "/bank/reports" },
    ],

    // ✅ USER MENU (ADDED + FIXED)
    user: [
      { icon: <LayoutDashboard size={20} />, text: "Dashboard", to: "/user/dashboard" },
      { icon: <FileText size={20} />, text: "Apply Loan", to: "/user/apply-loan" },
      { icon: <ClipboardCheck size={20} />, text: "My Applications", to: "/user/applications" },
      { icon: <Folder size={20} />, text: "My Documents", to: "/user/documents" },
      { icon: <CreditCard size={20} />, text: "Loan Offers", to: "/user/offers" },
      { icon: <BarChart size={20} />, text: "Loan Status", to: "/user/loan-status" }, // ✅ FIXED
      { icon: <Settings size={20} />, text: "Settings", to: "/user/settings" },
    ],
  };

  const menus = menuConfig[role] || menuConfig.admin;

  // ✅ Logout
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="w-64 h-full bg-[#0B1E36] text-white flex flex-col">

      {/* Logo */}
      <div className="p-5 text-xl font-bold border-b border-gray-700">
        Caryanam
        <div className="text-sm text-gray-400 capitalize">
          {role} Panel
        </div>
      </div>

      {/* Menu */}
      <div className="flex-1 p-3 space-y-2">
        {menus.map((item, index) => (
          <MenuItem key={index} {...item} />
        ))}
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full bg-gray-800 p-2 rounded hover:bg-gray-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

// 🔥 Menu Item Component
function MenuItem({ icon, text, to }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `flex items-center gap-3 p-3 rounded transition ${
          isActive
            ? "bg-[#112E52] text-white"
            : "text-gray-300 hover:bg-[#112E52] hover:text-white"
        }`
      }
    >
      {icon}
      <span>{text}</span>
    </NavLink>
  );
}