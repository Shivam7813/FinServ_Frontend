// src/pages/user/MyApplications.jsx

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";

// ✅ SERVICE
import { getUserApplications } from "../../services/userService";

export default function MyApplications() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get("q") ?? "");
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    setSearch(searchParams.get("q") ?? "");
  }, [searchParams]);

  const setSearchQuery = (value) => {
    setSearch(value);
    setSearchParams(value.trim() ? { q: value } : {}, { replace: true });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) return;

        const lookupName = user.name || user.email;
        const data = await getUserApplications(lookupName);

        // 🔥 FORMAT DATA TO MATCH UI (API-backed)
        const formatted = data.map((app) => ({
          id: app.caseNumber || app.id,
          carModel: app.loanType || "-",
          amount: "₹" + app.loanAmount,
          status: formatStatus(app.status),
          bank: app.bank || "—",
        }));

        setApplications(formatted);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // 🔥 FORMAT STATUS
  const formatStatus = (status) => {
    return status.replaceAll("_", " ");
  };

  // 🔥 STATUS COLOR
  const getStatusColor = (status) => {
    if (status === "APPROVED" || status === "Approved")
      return "text-green-500";
    if (status === "REJECTED" || status === "Rejected")
      return "text-red-500";
    if (
      status === "UNDER REVIEW" ||
      status === "Under Review" ||
      status === "PENDING"
    )
      return "text-yellow-500";

    return "text-gray-500";
  };

  const filtered = applications.filter((app) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return `${app.id} ${app.carModel} ${app.amount} ${app.status} ${app.bank}`
      .toLowerCase()
      .includes(q);
  });

  return (
    <AdminLayout>

      <h2 className="text-xl font-semibold mb-4">
        My Loan Applications
      </h2>

      <input
        type="search"
        placeholder="Search my applications…"
        className="border px-3 py-2 rounded-lg w-full max-w-md mb-4"
        value={search}
        onChange={(e) => setSearchQuery(e.target.value)}
        aria-label="Filter my applications"
      />

      <div className="bg-white p-4 rounded-lg shadow">

        {applications.length === 0 ? (
          <div className="text-center text-gray-500 py-6">
            No applications found
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-500 py-6">
            No applications match your search
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="py-2">Loan ID</th>
                <th>Car Model</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Bank</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((app, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{app.id}</td>
                  <td>{app.carModel}</td>
                  <td>{app.amount}</td>
                  <td className={getStatusColor(app.status)}>
                    {app.status}
                  </td>
                  <td>{app.bank}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>

    </AdminLayout>
  );
}