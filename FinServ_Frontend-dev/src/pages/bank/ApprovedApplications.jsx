import AdminLayout from "../../layouts/AdminLayout";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ApprovedApplications() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/loans/dashboard"
        );

        setApplications(response.data || []);
      } catch (error) {
        console.error("Error fetching approved applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔥 FILTER APPROVED
  const filteredApps = applications.filter((app) => {
    const name = app?.customerName || "";

    const matchesSearch = name
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesSearch && app?.status === "APPROVED";
  });

  return (
    <AdminLayout>
      <div className="p-4">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-green-600">
            Approved Applications
          </h2>

          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
            {filteredApps.length} Total
          </span>
        </div>

        {/* SEARCH */}
        <div className="mb-5">
          <input
            type="text"
            placeholder="Search applicant..."
            className="border px-3 py-2 rounded-lg w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* LIST */}
        <div className="grid gap-4">

          {/* 🔄 LOADING */}
          {loading ? (
            <div className="text-center text-gray-500 py-10">
              Loading applications...
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="text-center text-gray-500 py-10 bg-white rounded-xl shadow">
              No approved applications found
            </div>
          ) : (
            filteredApps.map((app) => {
              const name = app?.customerName || "N/A";
              const loanType = app?.loanType || "N/A";
              const amount = app?.loanAmount || 0;
              const caseNumber = app?.caseNumber;

              return (
                <div
                  key={caseNumber}
                  className="bg-white shadow rounded-xl p-4 flex justify-between items-center hover:shadow-md transition border-l-4 border-green-500"
                >
                  {/* LEFT */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 text-green-600 flex items-center justify-center rounded-full font-semibold">
                      {name.charAt(0)}
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {loanType} • ₹{amount}
                      </p>

                      <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                        APPROVED
                      </span>
                    </div>
                  </div>

                  {/* ✅ REVIEW BUTTON (FIXED ROUTE) */}
                  <button
                    onClick={() =>
                      navigate(`/bank/review/${caseNumber}`)
                    }
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                  >
                    Review →
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </AdminLayout>
  );
}