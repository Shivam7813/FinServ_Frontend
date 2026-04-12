import AdminLayout from "../../layouts/AdminLayout";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config/apiBase";

export default function RejectedApplications() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ FETCH FROM DASHBOARD
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/dashboard`);
        const data = res.data;

        let apps = [];

        if (Array.isArray(data)) {
          apps = data;
        } else {
          apps =
            data.recentLoans ||
            data.loans ||
            data.data ||
            [];
        }

        setApplications(apps);

      } catch (error) {
        console.error("Error fetching rejected applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ FILTER REJECTED + SEARCH
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {

      const haystack =
        `${app.fullName} ${app.customerName} ${app.caseNumber} ${app.loanType} ${app.loanAmount}`.toLowerCase();

      const matchesSearch =
        !search.trim() || haystack.includes(search.toLowerCase());

      const status = app?.status?.toUpperCase();

      return (
        matchesSearch &&
        (status === "REJECTED" || status === "REJECTED_BY_ADMIN")
      );
    });
  }, [applications, search]);

  // ✅ STATUS STYLE
  const getStatusStyle = () =>
    "bg-red-100 text-red-700";

  return (
    <AdminLayout>
      <div className="p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center flex-wrap gap-3">
          <h1 className="text-2xl font-semibold text-gray-800">
            Rejected Applications
          </h1>

          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
            {filteredApps.length} Total
          </span>
        </div>

        {/* SEARCH */}
        <div className="mt-6">
          <input
            type="search"
            placeholder="Search by case number, customer, loan…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-lg text-sm w-full max-w-xs focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow mt-6 p-4">

          <h2 className="text-lg font-semibold mb-4">
            Rejected Cases
          </h2>

          {loading ? (
            <p className="text-gray-500 text-center py-6">
              Loading applications...
            </p>
          ) : filteredApps.length === 0 ? (
            <p className="text-gray-500 text-center py-6">
              No rejected applications found
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">

                {/* HEADER */}
                <thead>
                  <tr className="text-gray-500 border-b text-left">
                    <th className="py-3">Case</th>
                    <th>Customer</th>
                    <th>Loan Type</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                {/* BODY */}
                <tbody className="text-gray-700">
                  {filteredApps.map((app) => {

                    const name =
                      app?.fullName ||
                      app?.customerName ||
                      "N/A";

                    const loanType = app?.loanType || "—";
                    const amount = app?.loanAmount || 0;
                    const caseNumber = app?.caseNumber || "—";

                    return (
                      <tr
                        key={caseNumber}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="py-3 text-red-600 font-medium cursor-pointer">
                          {caseNumber}
                        </td>

                        <td>{name}</td>

                        <td>{loanType}</td>

                        <td>₹{Number(amount).toLocaleString()}</td>

                        <td>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle()}`}
                          >
                            REJECTED
                          </span>
                        </td>

                        <td>
                          <button
                            onClick={() =>
                              navigate(`/bank/review/${caseNumber}`)
                            }
                            className="px-3 py-1 rounded border border-red-200 text-red-700 hover:bg-red-50"
                          >
                            View
                          </button>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>

              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}