import AdminLayout from "../../layouts/AdminLayout";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  getLoans,
  updateLoanStatus,
} from "../../services/loanService";

const TERMINAL = new Set(["APPROVED", "REJECTED", "DISBURSED"]);

function canApproveOrReject(app) {
  const cn = String(app.caseNumber ?? "").trim();
  if (!cn) return false;
  return !TERMINAL.has(app.status);
}

export default function LoanCases() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);

  const [search, setSearch] = useState(() => searchParams.get("q") ?? "");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [actionKey, setActionKey] = useState(null);

  // ✅ STATUS COLORS
  const statusStyles = {
    UNDER_REVIEW: "bg-yellow-100 text-yellow-600",
    SUBMITTED_TO_BANK: "bg-yellow-100 text-yellow-600",
    DOCUMENTS_PENDING: "bg-orange-100 text-orange-600",
    APPROVED: "bg-green-100 text-green-600",
    DISBURSED: "bg-emerald-100 text-emerald-700",
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
      setApplications([]);
      setFilteredApps([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  useEffect(() => {
    setSearch(searchParams.get("q") ?? "");
  }, [searchParams]);

  const setSearchQuery = (value) => {
    setSearch(value);
    setSearchParams(value.trim() ? { q: value } : {}, { replace: true });
  };

  // ✅ SEARCH + FILTER LOGIC
  useEffect(() => {
    let data = applications;

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter((app) =>
        `${app.fullName} ${app.loanType} ${app.caseNumber || app.id} ${app.bank || ""} ${app.mobile || ""} ${app.loanAmount ?? ""}`
          .toLowerCase()
          .includes(q)
      );
    }

    if (statusFilter !== "ALL") {
      data = data.filter((app) => app.status === statusFilter);
    }

    setFilteredApps(data);
  }, [search, statusFilter, applications]);

  const handleStatusChange = async (app, status) => {
    const caseNumber = String(app.caseNumber ?? "").trim();
    if (!caseNumber) {
      toast.error("This row has no case number — cannot update.");
      return;
    }
    if (!canApproveOrReject(app)) {
      toast.error("This loan is already closed (approved, rejected, or disbursed).");
      return;
    }

    const ok = window.confirm(
      `${status === "APPROVED" ? "Approve" : "Reject"} loan ${caseNumber} for ${app.fullName}?`
    );
    if (!ok) return;

    const key = `${caseNumber}-${status}`;
    try {
      setActionKey(key);
      const message = await updateLoanStatus(caseNumber, status);
      toast.success(
        typeof message === "string"
          ? message
          : status === "APPROVED"
            ? "Loan approved"
            : "Loan rejected"
      );
      await fetchLoans();
    } catch (e) {
      console.error(e);
      const msg =
        e?.response?.data?.message ||
        (typeof e?.response?.data === "string" ? e.response.data : null) ||
        e.message ||
        "Could not update status";
      toast.error(msg);
    } finally {
      setActionKey(null);
    }
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
            type="search"
            placeholder="Search by case number, customer, bank, mobile…"
            value={search}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border rounded-lg text-sm w-full max-w-xs focus:ring-2 focus:ring-blue-500"
            aria-label="Filter loan cases"
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
            <option value="SUBMITTED_TO_BANK">Submitted to Bank</option>
            <option value="DOCUMENTS_PENDING">Documents Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="DISBURSED">Disbursed</option>
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
                        key={app.caseNumber || app.id}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="py-3 text-blue-600 font-medium">
                          {app.caseNumber || `CASE-${app.id}`}
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
                            {String(app.status || "").replaceAll("_", " ")}
                          </span>
                        </td>

                        <td>{app.submittedAt}</td>

                        <td className="py-3">
                          {canApproveOrReject(app) ? (
                            <div className="flex flex-wrap gap-2 text-xs">
                              <button
                                type="button"
                                disabled={
                                  actionKey === `${app.caseNumber}-APPROVED`
                                }
                                onClick={() => handleStatusChange(app, "APPROVED")}
                                className="px-2 py-1 rounded border border-green-200 text-green-700 hover:bg-green-50 disabled:opacity-50"
                              >
                                {actionKey === `${app.caseNumber}-APPROVED`
                                  ? "…"
                                  : "Approve"}
                              </button>
                              <button
                                type="button"
                                disabled={
                                  actionKey === `${app.caseNumber}-REJECTED`
                                }
                                onClick={() => handleStatusChange(app, "REJECTED")}
                                className="px-2 py-1 rounded border border-red-200 text-red-700 hover:bg-red-50 disabled:opacity-50"
                              >
                                {actionKey === `${app.caseNumber}-REJECTED`
                                  ? "…"
                                  : "Reject"}
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-xs">—</span>
                          )}
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