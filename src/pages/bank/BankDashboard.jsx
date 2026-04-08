import AdminLayout from "../../layouts/AdminLayout";
import StatCard from "../../components/StatCard";
import { useNavigate } from "react-router-dom";
import { dashboardStats, applications } from "../../mock/mockData";

export default function BankDashboard() {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      case "UNDER_REVIEW":
        return "bg-yellow-100 text-yellow-700";
      case "PENDING":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatStatus = (status) => status.replaceAll("_", " ");

  return (
    <AdminLayout>
      {/* 🔹 Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">
          Bank Executive Dashboard 👋
        </h2>
        <p className="text-gray-500 mt-1">
          Manage loan applications and approvals
        </p>
      </div>

      {/* 🔥 Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

        <StatCard
          title="New Applications"
          value={dashboardStats.newApplications}
          color="blue"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor">
              <path strokeWidth="2" d="M12 6v6l4 2" />
            </svg>
          }
        />

        <StatCard
          title="Under Review"
          value={dashboardStats.underReview}
          color="yellow"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor">
              <path strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          }
        />

        <StatCard
          title="Approved"
          value={dashboardStats.approved}
          color="green"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor">
              <path strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          }
        />

        <StatCard
          title="Rejected"
          value={dashboardStats.rejected}
          color="red"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor">
              <path strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          }
        />

      </div>

      {/* 🔹 Quick Access */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
          ⚡ Quick Access
        </h3>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => navigate("/bank/applications")}
            className="flex items-center gap-2 bg-blue-500 text-white px-5 py-2.5 rounded-lg hover:bg-blue-600 transition shadow-sm hover:shadow-md"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor">
              <path strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Applications
          </button>

          <button
            onClick={() => navigate("/bank/reports")}
            className="flex items-center gap-2 bg-purple-500 text-white px-5 py-2.5 rounded-lg hover:bg-purple-600 transition shadow-sm hover:shadow-md"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor">
              <path strokeWidth="2" d="M3 3v18h18M9 17V9m4 8V5m4 12v-6" />
            </svg>
            Reports
          </button>
        </div>
      </div>

      {/* 🔹 Recent Applications */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
          📄 Recent Applications
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-600 text-sm rounded">
              <tr>
                <th className="p-3">Applicant</th>
                <th className="p-3">Loan Type</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {applications.slice(0, 5).map((app) => (
                <tr
                  key={app.id}
                  className="border-t hover:bg-gray-50 transition duration-200"
                >
                  <td className="p-3 font-medium flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full text-sm font-semibold">
                      {app.fullName.charAt(0)}
                    </div>
                    {app.fullName}
                  </td>

                  <td className="p-3">{app.loanType}</td>

                  <td className="p-3 font-semibold text-gray-700">
                    ₹{app.loanAmount}
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        app.status
                      )}`}
                    >
                      {formatStatus(app.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}