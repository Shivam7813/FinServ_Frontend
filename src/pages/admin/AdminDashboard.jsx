import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import StatCard from "../../components/StatCard";
import LoanTable from "../../components/LoanTable";

// ✅ SERVICE IMPORT (REPLACES MOCK)
import {
  getDashboardStats,
  getChartData,
} from "../../services/dashboardService";

// ✅ ICONS
import {
  PlusCircle,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);

  // ✅ STATE FROM SERVICE
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    rejected: 0,
    pending: 0,
  });

  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ✅ LOAD USER
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  // ✅ FETCH DASHBOARD DATA
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const statsData = await getDashboardStats();
        const chartData = await getChartData();

        setStats(statsData);

        // 👉 Using chart data as table fallback (frontend only)
        const formattedApplications = chartData.map((item, index) => ({
          id: index + 1,
          fullName: "Customer " + (index + 1),
          loanType: "Loan",
          loanAmount: item.approved * 10000,
          status: "APPROVED",
          submittedAt: item.month,
        }));

        setApplications(formattedApplications);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // ✅ GREETING
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <AdminLayout>
      {/* Greeting */}
      <h2 className="text-xl font-semibold mb-1">
        {getGreeting()}, {user?.name || "User"}
      </h2>

      <p className="text-gray-500 mb-6">
        Here's what's happening with your loan cases today.
      </p>

      {/* Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate("/admin/create-loan")}
          className="flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-lg shadow hover:bg-teal-600 transition"
        >
          <PlusCircle size={18} />
          Create New Loan Case
        </button>
      </div>

      {/* ✅ STATS */}
      {loading ? (
        <p className="text-gray-500">Loading dashboard...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Applications"
            value={stats.total}
            icon={<FileText size={20} />}
            color="blue"
          />

          <StatCard
            title="Pending"
            value={stats.pending}
            icon={<Clock size={20} />}
            color="yellow"
          />

          <StatCard
            title="Approved"
            value={stats.approved}
            icon={<CheckCircle size={20} />}
            color="green"
          />

          <StatCard
            title="Rejected"
            value={stats.rejected}
            icon={<XCircle size={20} />}
            color="red"
          />
        </div>
      )}

      {/* TABLE */}
      <div className="mt-6">
        <LoanTable data={applications} />
      </div>
    </AdminLayout>
  );
}