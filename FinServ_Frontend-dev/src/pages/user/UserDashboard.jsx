// src/pages/user/UserDashboard.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ ADD
import AdminLayout from "../../layouts/AdminLayout";
import { useAuth } from "../../context/AuthContext";
import { getLoggedInDisplayName } from "../../utils/displayName";
import StatCard from "../../components/StatCard";

// ✅ API-backed list (POST /api/loans/search by your registered full name)
import {
  fetchMyLoansFromApi,
  ensureUserProfile,
} from "../../services/userLoanApi";

export default function UserDashboard() {
  const { user: authUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate(); // ✅ NAVIGATION

  const displayName = getLoggedInDisplayName(authUser);

  // ✅ LOAD USER + DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        await ensureUserProfile();
        const data = await fetchMyLoansFromApi();
        setApplications(data || []);
      } catch (err) {
        console.error("Error fetching applications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ GREETING
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // ✅ STATS
  const total = applications.length;
  const underReview = applications.filter(
    (a) =>
      a.status === "UNDER_REVIEW" ||
      a.status === "SUBMITTED_TO_BANK" ||
      a.status === "DOCUMENTS_PENDING" ||
      a.status === "PENDING"
  ).length;
  const approved = applications.filter(a => a.status === "APPROVED").length;
  const rejected = applications.filter(a => a.status === "REJECTED").length;

  // ✅ STATUS COLOR
  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "text-green-500";
      case "REJECTED":
        return "text-red-500";
      case "UNDER_REVIEW":
        return "text-yellow-500";
      case "PENDING":
        return "text-blue-500";
      default:
        return "text-gray-400";
    }
  };

  // ============================
  // ✅ ACTION HANDLERS
  // ============================

  const handleApplyLoan = () => {
    navigate("/user/apply-loan");
  };

  const handleUploadDocs = () => {
    navigate("/user/documents");
  };

  const handleRowClick = () => {
    navigate("/user/applications");
  };

  return (
    <AdminLayout>

      {/* Greeting */}
      <h2 className="text-xl font-semibold mb-1">
        {getGreeting()}, {displayName} 👋
      </h2>

      <p className="text-gray-500 mb-6">
        Manage your loan journey in one place.
      </p>

      {/* ACTION BUTTONS */}
      <div className="flex flex-wrap gap-3 mb-6">

        <button
          onClick={handleApplyLoan}
          className="bg-teal-500 text-white px-4 py-2 rounded-lg shadow hover:bg-teal-600"
        >
          + Apply Loan
        </button>

        <button
          onClick={handleUploadDocs}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
        >
          Upload Documents
        </button>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <StatCard title="Applications" value={total} change="Active" color="blue" />
        <StatCard title="Under Review" value={underReview} change="Processing" color="yellow" />
        <StatCard title="Approved" value={approved} change="Success" color="green" />
        <StatCard title="Rejected" value={rejected} change="Check reason" color="red" />

      </div>

      {/* TABLE */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow">

        <h3 className="text-lg font-semibold mb-4">
          My Loan Applications
        </h3>

        {loading ? (
          <div className="text-center py-6 text-gray-500">
            Loading applications...
          </div>
        ) : applications.length === 0 ? (
          <div className="text-gray-500 text-center py-6">
            No applications found. Submit one from Apply Loan — it must match the
            full name on your registered profile.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="py-2">Loan ID</th>
                <th>Loan Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {applications.map((app) => (
                <tr
                  key={app.id}
                  onClick={handleRowClick}
                  className="border-b cursor-pointer hover:bg-gray-50"
                >
                  <td className="py-2">{app.caseNumber || app.id}</td>
                  <td>{app.loanType}</td>
                  <td>₹{app.loanAmount}</td>
                  <td className={getStatusColor(app.status)}>
                    {app.status.replaceAll("_", " ")}
                  </td>
                  <td>{app.submittedAt || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* PROGRESS */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow">

        <h3 className="text-lg font-semibold mb-4">
          Application Progress
        </h3>

        <div className="flex items-center justify-between text-sm flex-wrap gap-2">

          <div className="text-green-500">✔ Applied</div>
          <div className="text-green-500">✔ Documents Uploaded</div>
          <div className="text-yellow-500">⏳ Under Review</div>
          <div className="text-gray-400">Pending Approval</div>
          <div className="text-gray-400">Disbursed</div>

        </div>

      </div>

    </AdminLayout>
  );
}