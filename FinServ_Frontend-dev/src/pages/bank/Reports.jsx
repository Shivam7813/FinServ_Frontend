import AdminLayout from "../../layouts/AdminLayout";
import { useEffect, useState } from "react";
import axios from "axios"; // ✅ ADDED
import { API_BASE_URL } from "../../config/apiBase";

export default function Reports() {
  const [applications, setApplications] = useState([]);

  // ✅ FETCH DATA FROM BACKEND (NO SERVICE)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/loans/dashboard`
        );

        setApplications(res.data || []);
      } catch (err) {
        console.error("Error fetching applications:", err);
      }
    };

    fetchData();
  }, []);

  // 🔹 Stats Calculation
  const total = applications.length;

  const approved = applications.filter(
    (app) => app.status?.toUpperCase() === "APPROVED"
  ).length;

  const rejected = applications.filter(
    (app) => app.status?.toUpperCase() === "REJECTED"
  ).length;

  // ✅ FIXED STATUS HANDLING (IMPORTANT)
  const pending = applications.filter((app) => {
    const status = app.status?.toUpperCase();

    return (
      status === "PENDING" ||
      status === "UNDER_REVIEW" ||
      status === "SUBMITTED_TO_BANK"
    );
  }).length;

  const stats = { total, approved, rejected, pending };

  const getPercentage = (value) => {
    return total === 0 ? 0 : ((value / total) * 100).toFixed(1);
  };

  return (
    <AdminLayout>
      <div className="p-4">

        {/* HEADER */}
        <h2 className="text-2xl font-semibold mb-6">
          Reports & Analytics
        </h2>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

          {/* Total */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl shadow">
            <p className="text-sm opacity-80">Total Applications</p>
            <h3 className="text-2xl font-semibold">{stats.total}</h3>
          </div>

          {/* Approved */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl shadow">
            <p className="text-sm opacity-80">Approved</p>
            <h3 className="text-2xl font-semibold">
              {stats.approved}
            </h3>
            <p className="text-xs opacity-80">
              {getPercentage(stats.approved)}%
            </p>
          </div>

          {/* Rejected */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-xl shadow">
            <p className="text-sm opacity-80">Rejected</p>
            <h3 className="text-2xl font-semibold">
              {stats.rejected}
            </h3>
            <p className="text-xs opacity-80">
              {getPercentage(stats.rejected)}%
            </p>
          </div>

          {/* Pending */}
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 rounded-xl shadow">
            <p className="text-sm opacity-80">Pending</p>
            <h3 className="text-2xl font-semibold">
              {stats.pending}
            </h3>
            <p className="text-xs opacity-80">
              {getPercentage(stats.pending)}%
            </p>
          </div>

        </div>

        {/* STATUS VISUALIZATION */}
        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-6">
            Application Status Overview
          </h3>

          <ProgressBar
            label="Approved"
            value={stats.approved}
            percentage={getPercentage(stats.approved)}
            color="bg-green-500"
          />

          <ProgressBar
            label="Rejected"
            value={stats.rejected}
            percentage={getPercentage(stats.rejected)}
            color="bg-red-500"
          />

          <ProgressBar
            label="Pending"
            value={stats.pending}
            percentage={getPercentage(stats.pending)}
            color="bg-yellow-500"
          />
        </div>
      </div>
    </AdminLayout>
  );
}

/* 🔥 Progress Bar */
function ProgressBar({ label, value, percentage, color }) {
  return (
    <div className="mb-5">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium">{label}</span>
        <span>
          {value} ({percentage}%)
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded h-3">
        <div
          className={`${color} h-3 rounded transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}