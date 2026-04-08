import AdminLayout from "../../layouts/AdminLayout";
import { applications } from "../../mock/mockData";

export default function Reports() {

  // 🔹 Stats Calculation
  const total = applications.length;

  const approved = applications.filter(
    (app) => app.status === "APPROVED"
  ).length;

  const rejected = applications.filter(
    (app) => app.status === "REJECTED"
  ).length;

  const pending = applications.filter(
    (app) =>
      app.status === "PENDING" ||
      app.status === "UNDER_REVIEW"
  ).length;

  const stats = { total, approved, rejected, pending };

  const getPercentage = (value) => {
    return total === 0 ? 0 : ((value / total) * 100).toFixed(1);
  };

  return (
    <AdminLayout>
      <div className="p-4">

        {/* 🔹 Header */}
        <h2 className="text-2xl font-semibold mb-6">
          Reports & Analytics
        </h2>

        {/* 🔥 Stats Cards */}
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

        {/* 🔥 Status Visualization */}
        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-6">
            Application Status Overview
          </h3>

          {/* Approved */}
          <ProgressBar
            label="Approved"
            value={stats.approved}
            percentage={getPercentage(stats.approved)}
            color="bg-green-500"
          />

          {/* Rejected */}
          <ProgressBar
            label="Rejected"
            value={stats.rejected}
            percentage={getPercentage(stats.rejected)}
            color="bg-red-500"
          />

          {/* Pending */}
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

/* 🔥 Reusable Progress Bar */
function ProgressBar({ label, value, percentage, color }) {
  return (
    <div className="mb-5">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium">{label}</span>
        <span>{value} ({percentage}%)</span>
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