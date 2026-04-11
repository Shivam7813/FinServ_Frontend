// src/pages/admin/Banks.jsx

import AdminLayout from "../../layouts/AdminLayout";

export default function Banks() {
  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Partner Banks
            </h1>
            <p className="text-gray-500 mt-1">
              Manage banking partnerships and rates
            </p>
          </div>

          <button className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-800">
            + Add Bank Partner
          </button>
        </div>

        {/* Banks Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">

          {/* Bank Card */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="font-semibold text-lg">HDFC Bank</h3>
            <p className="text-sm text-green-600">● Active Partner</p>

            <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-400 text-xs">ROI Range</p>
                <p className="font-medium">8.5% - 10.5%</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-400 text-xs">Processing</p>
                <p className="font-medium">2-3 days</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-400 text-xs">Max LTV</p>
                <p className="font-medium">90%</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-400 text-xs">Max Tenure</p>
                <p className="font-medium">84 months</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs text-gray-400 mb-2">Key Features</p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-teal-100 text-teal-600 px-2 py-1 rounded-full text-xs">
                  Quick approval
                </span>
                <span className="bg-teal-100 text-teal-600 px-2 py-1 rounded-full text-xs">
                  Minimal documentation
                </span>
                <span className="bg-teal-100 text-teal-600 px-2 py-1 rounded-full text-xs">
                  Doorstep service
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4 border-t pt-3">
              <p className="text-sm text-gray-500">
                Cases this month <span className="font-semibold">45</span>
              </p>
              <button className="text-sm border px-3 py-1 rounded-lg hover:bg-gray-100">
                View Details
              </button>
            </div>
          </div>

          {/* Repeat Card (ICICI) */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="font-semibold text-lg">ICICI Bank</h3>
            <p className="text-sm text-green-600">● Active Partner</p>

            <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-400 text-xs">ROI Range</p>
                <p className="font-medium">8.75% - 11%</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-400 text-xs">Processing</p>
                <p className="font-medium">2-4 days</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-400 text-xs">Max LTV</p>
                <p className="font-medium">85%</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-400 text-xs">Max Tenure</p>
                <p className="font-medium">72 months</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs text-gray-400 mb-2">Key Features</p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-teal-100 text-teal-600 px-2 py-1 rounded-full text-xs">
                  Online tracking
                </span>
                <span className="bg-teal-100 text-teal-600 px-2 py-1 rounded-full text-xs">
                  Flexible EMI
                </span>
                <span className="bg-teal-100 text-teal-600 px-2 py-1 rounded-full text-xs">
                  Part payment allowed
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4 border-t pt-3">
              <p className="text-sm text-gray-500">
                Cases this month <span className="font-semibold">38</span>
              </p>
              <button className="text-sm border px-3 py-1 rounded-lg hover:bg-gray-100">
                View Details
              </button>
            </div>
          </div>

          {/* Add more cards same pattern (SBI, Axis, Kotak, IDFC) */}

        </div>
      </div>
    </AdminLayout>
  );
}