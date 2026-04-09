import AdminLayout from "../../layouts/AdminLayout";
import StatCard from "../../components/StatCard";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// ✅ SERVICE
import { getBankApplications } from "../../services/bankDashboardService";

export default function BankDashboard() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    newApplications: 0,
    underReview: 0,
    approved: 0,
    rejected: 0,
  });

  const [loading, setLoading] = useState(true);

  // ✅ FETCH DATA
  const fetchData = async () => {
    setLoading(true);

    try {
      const data = await getBankApplications();

      setApplications(data || []);

      setStats({
        newApplications: data?.length || 0,
        underReview:
          data?.filter((a) => a.status === "UNDER_REVIEW").length || 0,
        approved:
          data?.filter((a) => a.status === "APPROVED").length || 0,
        rejected:
          data?.filter((a) => a.status === "REJECTED").length || 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      {/* HEADER */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">
            Bank Executive Dashboard 👋
          </h2>
          <p className="text-gray-500">
            Manage loan applications and approvals
          </p>
        </div>

        {/* 🔥 Refresh Button */}
        <button
          onClick={fetchData}
          className="bg-gray-200 px-3 py-2 rounded hover:bg-gray-300 text-sm"
        >
          🔄 Refresh
        </button>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">
          Loading dashboard...
        </div>
      ) : (
        <>
          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

            <StatCard title="New Applications" value={stats.newApplications} color="blue" />
            <StatCard title="Under Review" value={stats.underReview} color="yellow" />
            <StatCard title="Approved" value={stats.approved} color="green" />
            <StatCard title="Rejected" value={stats.rejected} color="red" />

          </div>

          {/* QUICK ACCESS */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
            <h3 className="text-lg font-semibold mb-5">⚡ Quick Access</h3>

            <div className="flex gap-4">
              <button
                onClick={() => navigate("/bank/applications")}
                className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600"
              >
                Applications
              </button>

              <button
                onClick={() => navigate("/bank/reports")}
                className="bg-purple-500 text-white px-5 py-2 rounded-lg hover:bg-purple-600"
              >
                Reports
              </button>
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-5">
              📄 Recent Applications
            </h3>

            {applications.length === 0 ? (
              <div className="text-center text-gray-500 py-6">
                No applications available
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3">Applicant</th>
                    <th className="p-3">Loan Type</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {applications.slice(0, 5).map((app) => (
                    <tr key={app.id} className="border-t hover:bg-gray-50">
                      <td className="p-3">{app.fullName}</td>
                      <td className="p-3">{app.loanType}</td>
                      <td className="p-3">₹{app.loanAmount}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded ${getStatusColor(
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
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
}