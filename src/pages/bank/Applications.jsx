import AdminLayout from "../../layouts/AdminLayout";
import { useNavigate, useLocation } from "react-router-dom";
import { applications } from "../../mock/mockData";
import { useState } from "react";

export default function Applications() {
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState("");

  // 🔥 Detect page type
  const isUnderReviewPage = location.pathname.includes("under-review");

  // 🔥 Filter logic (search + route filter)
  const filteredApps = applications.filter((app) => {
    const matchesSearch = app.fullName
      .toLowerCase()
      .includes(search.toLowerCase());

    if (isUnderReviewPage) {
      return matchesSearch && app.status === "UNDER_REVIEW";
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

  const formatStatus = (status) => status.replaceAll("_", " ");

  return (
    <AdminLayout>
      <div className="p-4">

        {/* 🔹 Header */}
        <h2 className="text-2xl font-semibold mb-4">
          {isUnderReviewPage ? "Under Review Applications" : "Loan Applications"}
        </h2>

        {/* 🔥 Search */}
        <div className="mb-5">
          <input
            type="text"
            placeholder="Search applicant..."
            className="border px-3 py-2 rounded-lg w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* 🔥 List */}
        <div className="grid gap-4">

          {filteredApps.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              No applications found
            </div>
          ) : (
            filteredApps.map((app) => {
              const isCompleted =
                app.status === "APPROVED" || app.status === "REJECTED";

              return (
                <div
                  key={app.id}
                  className="bg-white shadow rounded-xl p-4 flex justify-between items-center hover:shadow-md transition"
                >
                  {/* 🔹 Left Info */}
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full font-semibold">
                      {app.fullName.charAt(0)}
                    </div>

                    <div>
                      <h3 className="font-semibold">{app.fullName}</h3>
                      <p className="text-sm text-gray-500">
                        {app.loanType} • ₹{app.loanAmount}
                      </p>

                      <span
                        className={`inline-block mt-2 px-3 py-1 text-xs rounded-full ${getStatusStyle(
                          app.status
                        )}`}
                      >
                        {formatStatus(app.status)}
                      </span>
                    </div>
                  </div>

                  {/* 🔹 Action */}
                  {isCompleted ? (
                    <button className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed">
                      Completed
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        navigate(`/bank/review/${app.id}`)
                      }
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                      Review →
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </AdminLayout>
  );
}