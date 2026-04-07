import AdminLayout from "../../layouts/AdminLayout";
import StatCard from "../../components/StatCard";

export default function BankDashboard() {
  return (
    <AdminLayout>

      <h2 className="text-xl font-semibold mb-2">
        Bank Executive Dashboard 👋
      </h2>

      <p className="text-gray-500 mb-6">
        Manage loan applications and approvals.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="New Applications" value="15" color="blue" />
        <StatCard title="Under Review" value="7" color="yellow" />
        <StatCard title="Approved" value="10" color="green" />
        <StatCard title="Rejected" value="3" color="red" />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>

        <div className="flex flex-wrap gap-3">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            View Applications
          </button>

          <button className="bg-yellow-500 text-white px-4 py-2 rounded">
            Review Documents
          </button>

          <button className="bg-green-500 text-white px-4 py-2 rounded">
            Approve Loans
          </button>
        </div>
      </div>

    </AdminLayout>
  );
}