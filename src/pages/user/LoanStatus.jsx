// src/pages/user/LoanStatus.jsx

import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";

// ✅ UPDATED SERVICE NAME
import { getUserApplications } from "../../services/userApplicationService";

export default function LoanStatus() {
  const [applications, setApplications] = useState([]);

  // ✅ FETCH USER-SPECIFIC DATA
  useEffect(() => {
    const fetchData = async () => {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user?.name) return;

      const data = await getUserApplications(user.name);

      // 🔥 FORMAT DATA (KEEP UI SAME)
      const formatted = data.map((app, index) => ({
        id: app.id || `LN00${index + 1}`,
        carModel: app.loanType || "Car Loan",
        loanAmount: app.loanAmount,
        tenure: app.tenure || 60,
        status: formatStatus(app.status),
      }));

      setApplications(formatted);
    };

    fetchData();
  }, []);

  // ✅ FORMAT STATUS (IMPORTANT)
  const formatStatus = (status) => {
    if (!status) return "Pending";

    return status
      .toLowerCase()
      .replaceAll("_", " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Loan Status</h2>

        {applications.length === 0 ? (
          <p className="text-gray-500">No applications found.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {applications.map((app, index) => (
              <div
                key={index}
                className="bg-white p-5 rounded-2xl shadow border hover:shadow-lg transition"
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-lg">
                    {app.carModel}
                  </h3>
                  <span className="text-xs text-gray-400">
                    {app.id}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-1 text-sm text-gray-600">
                  <p>💰 Amount: ₹{app.loanAmount}</p>
                  <p>📅 Tenure: {app.tenure} months</p>
                </div>

                {/* Status Badge */}
                <div className="mt-4">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      app.status === "Approved"
                        ? "bg-green-100 text-green-600"
                        : app.status === "Rejected"
                        ? "bg-red-100 text-red-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {app.status}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="w-full bg-gray-200 h-2 rounded">
                    <div
                      className={`h-2 rounded transition-all duration-500 ${
                        app.status === "Approved"
                          ? "bg-green-500 w-full"
                          : app.status === "Rejected"
                          ? "bg-red-500 w-full"
                          : "bg-yellow-500 w-1/2"
                      }`}
                    ></div>
                  </div>
                </div>

              </div>
            ))}

          </div>
        )}
      </div>
    </AdminLayout>
  );
}