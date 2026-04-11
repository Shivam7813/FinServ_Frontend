import AdminLayout from "../../layouts/AdminLayout";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// ✅ SERVICE IMPORT (REPLACES MOCK)
import {
  getLoans,
  updateLoanStatus,
} from "../../services/loanService";

export default function LoanCases() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);

  // ✅ STATUS COLORS
  const statusStyles = {
    UNDER_REVIEW: "bg-yellow-100 text-yellow-600",
    APPROVED: "bg-green-100 text-green-600",
    REJECTED: "bg-red-100 text-red-600",
    PENDING: "bg-blue-100 text-blue-600",
  };

  // ✅ FETCH DATA FROM SERVICE
  const fetchLoans = async () => {
    try {
      setLoading(true);
      const data = await getLoans();
      setApplications(data);
      setFilteredApps(data);
    } catch (err) {
      console.error("Error fetching loans:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  // ✅ SEARCH + FILTER LOGIC
  useEffect(() => {
    let data = applications;

    if (search) {
      data = data.filter((app) =>
        `${app.fullName} ${app.loanType} ${app.id}`
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "ALL") {
      data = data.filter((app) => app.status === statusFilter);
    }

    setFilteredApps(data);
  }, [search, statusFilter, applications]);

  // ✅ UPDATE STATUS (UI only for now)
  const handleStatusChange = async (id, status) => {
    await updateLoanStatus(id, status);
    fetchLoans(); // refresh data
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-800">
          Loan Cases
        </h1>
        <p className="text-gray-500 mt-1">
          Manage and track all loan applications here.
        </p>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 justify-between items-center mt-6">

          {/* Search */}
          <input
            type="text"
            placeholder="Search by case number, customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-lg text-sm w-full max-w-xs focus:ring-2 focus:ring-blue-500"
          />

          {/* Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>

          {/* Button */}
          <button
            onClick={() => navigate("/admin/create-loan")}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-700"
          >
            + Create New Case
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow mt-6 p-4">
          <h2 className="text-lg font-semibold mb-4">
            All Loan Cases
          </h2>

          {/* Loading */}
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 border-b text-left">
                    <th className="py-3">Case ID</th>
                    <th>Customer</th>
                    <th>Loan Type</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody className="text-gray-700">
                  {filteredApps.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        No data found
                      </td>
                    </tr>
                  ) : (
                    filteredApps.map((app) => (
                      <tr
                        key={app.id}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="py-3 text-blue-600 font-medium">
                          CASE-{app.id}
                        </td>

                        <td>{app.fullName}</td>
                        <td>{app.loanType}</td>
                        <td>₹{app.loanAmount}</td>

                        <td>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              statusStyles[app.status] ||
                              "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {app.status.replace("_", " ")}
                          </span>
                        </td>

                        <td>{app.submittedAt}</td>

                        {/* Actions */}
                        <td className="flex gap-2 text-xs">
                          <button
                            onClick={() =>
                              handleStatusChange(app.id, "APPROVED")
                            }
                            className="text-green-600"
                          >
                            Approve
                          </button>

                          <button
                            onClick={() =>
                              handleStatusChange(app.id, "REJECTED")
                            }
                            className="text-red-600"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}