import AdminLayout from "../../layouts/AdminLayout";

export default function Reports() {
  const stats = {
    total: 120,
    approved: 70,
    rejected: 20,
    pending: 30,
  };

  const getPercentage = (value) => {
    return (value / stats.total) * 100;
  };

  return (
    <AdminLayout>
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-6">Reports & Analytics</h2>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white shadow rounded-xl p-4">
            <h3 className="text-gray-500 text-sm">Total Applications</h3>
            <p className="text-2xl font-semibold">{stats.total}</p>
          </div>

          <div className="bg-white shadow rounded-xl p-4">
            <h3 className="text-gray-500 text-sm">Approved</h3>
            <p className="text-2xl font-semibold text-green-600">
              {stats.approved}
            </p>
          </div>

          <div className="bg-white shadow rounded-xl p-4">
            <h3 className="text-gray-500 text-sm">Rejected</h3>
            <p className="text-2xl font-semibold text-red-600">
              {stats.rejected}
            </p>
          </div>

          <div className="bg-white shadow rounded-xl p-4">
            <h3 className="text-gray-500 text-sm">Pending</h3>
            <p className="text-2xl font-semibold text-yellow-600">
              {stats.pending}
            </p>
          </div>
        </div>

        {/* Simple Bar Visualization */}
        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">
            Application Status Overview
          </h3>

          {/* Approved */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Approved</span>
              <span>{stats.approved}</span>
            </div>
            <div className="w-full bg-gray-200 rounded h-3">
              <div
                className="bg-green-500 h-3 rounded"
                style={{ width: `${getPercentage(stats.approved)}%` }}
              />
            </div>
          </div>

          {/* Rejected */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Rejected</span>
              <span>{stats.rejected}</span>
            </div>
            <div className="w-full bg-gray-200 rounded h-3">
              <div
                className="bg-red-500 h-3 rounded"
                style={{ width: `${getPercentage(stats.rejected)}%` }}
              />
            </div>
          </div>

          {/* Pending */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Pending</span>
              <span>{stats.pending}</span>
            </div>
            <div className="w-full bg-gray-200 rounded h-3">
              <div
                className="bg-yellow-500 h-3 rounded"
                style={{ width: `${getPercentage(stats.pending)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}