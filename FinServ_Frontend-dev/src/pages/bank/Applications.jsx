import AdminLayout from "../../layouts/AdminLayout";
import {
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config/apiBase";

export default function Applications() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(() => searchParams.get("q") ?? "");
  const [applications, setApplications] = useState([]);

  // 🔥 Detect page type
  const isUnderReviewPage = location.pathname.includes("under-review");

  // ✅ FETCH DATA FROM BACKEND
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/loans/dashboard`
        );

        console.log("Applications API:", response.data);

        setApplications(response.data || []);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setSearch(searchParams.get("q") ?? "");
  }, [searchParams]);

  const setSearchQuery = (value) => {
    setSearch(value);
    setSearchParams(value.trim() ? { q: value } : {}, { replace: true });
  };

  // 🔥 FILTER
  const filteredApps = applications.filter((app) => {
    const name = app.customerName || "";
    const caseNumber = app.caseNumber || "";
    const mobile = app.mobile || "";
    const vehicle = app.vehicle || "";
    const bank = app.bank || "";
    const amount = String(app.loanAmount ?? "");

    const haystack =
      `${name} ${caseNumber} ${mobile} ${vehicle} ${bank} ${amount}`.toLowerCase();
    const matchesSearch =
      !search.trim() || haystack.includes(search.toLowerCase());

    if (isUnderReviewPage) {
      return (
        matchesSearch &&
        (app.status === "UNDER_REVIEW" ||
        app.status === "SUBMITTED_TO_BANK")
      );
    }

    return matchesSearch;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "UNDER_REVIEW":
        return "bg-blue-100 text-blue-700";
      case "APPROVED":
        return "bg-green-100 text-green-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatStatus = (status) => {
    if (status === "SUBMITTED_TO_BANK") {
      return "UNDER REVIEW";
    }
    return status?.replaceAll("_", " ");
    };

  return (
    <AdminLayout>
      <div className="p-4">

        {/* HEADER */}
        <h2 className="text-2xl font-semibold mb-4">
          {isUnderReviewPage
            ? "Under Review Applications"
            : "Loan Applications"}
        </h2>

        {/* SEARCH */}
        <div className="mb-5">
          <input
            type="search"
            placeholder="Search by name, case number, mobile, vehicle, bank…"
            className="border px-3 py-2 rounded-lg w-full md:w-1/3"
            value={search}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Filter applications"
          />
        </div>

        {/* LIST */}
        <div className="grid gap-4">

          {filteredApps.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              No applications found
            </div>
          ) : (
            filteredApps.map((app) => {

              // ✅ SAFE DATA HANDLING
              const name = app?.customerName || "N/A";
              const loanType = app?.loanType || "N/A";
              const amount = app?.loanAmount || 0;
              const status = app?.status || "PENDING";
              const caseNumber = app?.caseNumber;

              

              return (
                <div
                  key={caseNumber}
                  className="bg-white shadow rounded-xl p-4 flex justify-between items-center hover:shadow-md transition"
                >
                  {/* LEFT */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full font-semibold">
                      {name.charAt(0)}
                    </div>

                    <div>
                      <h3 className="font-semibold">
                        {name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {loanType} • ₹{amount}
                      </p>

                      <span
                        className={`inline-block mt-2 px-3 py-1 text-xs rounded-full ${getStatusStyle(
                          status
                        )}`}
                      >
                        {formatStatus(status)}
                      </span>
                    </div>
                  </div>

                  {/* REVIEW BUTTON */}
                  <button
                    onClick={() =>
                      navigate(`/bank/review/${caseNumber}`)
                    }
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
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