// src/pages/admin/Documents.jsx 

import AdminLayout from "../../layouts/AdminLayout";

export default function Documents() {
  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <h1 className="text-2xl font-semibold text-gray-800">Documents</h1>
        <p className="text-gray-500 mt-1">
          Upload and verify loan documents.
        </p>

        {/* Top Bar */}
        <div className="flex justify-between items-center mt-6">
          <div className="flex gap-3 w-full max-w-md">
            <input
              type="text"
              placeholder="Search documents..."
              className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-3 py-2 border rounded-lg hover:bg-gray-100">
              ⚙️
            </button>
          </div>

          <button className="flex items-center gap-2 border px-4 py-2 rounded-lg text-sm hover:bg-gray-100">
            ⬇️ Bulk Download
          </button>
        </div>

        {/* Cases */}
        <div className="mt-6 space-y-6">

          {/* Case 1 */}
          <div className="bg-white p-5 rounded-xl shadow">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-blue-600 font-semibold">
                  AUTO-2024-0124
                </h3>
                <p className="text-sm text-gray-500">Rajesh Kumar</p>
              </div>
              <p className="text-sm text-gray-400">4 documents</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Doc Card */}
              <div className="border rounded-lg p-3">
                <p className="font-medium">Aadhaar Card</p>
                <p className="text-xs text-gray-400">15 Jan 2024</p>
                <span className="mt-2 inline-block bg-green-100 text-green-600 px-2 py-1 text-xs rounded-full">
                  Verified
                </span>
              </div>

              <div className="border rounded-lg p-3">
                <p className="font-medium">PAN Card</p>
                <p className="text-xs text-gray-400">15 Jan 2024</p>
                <span className="mt-2 inline-block bg-green-100 text-green-600 px-2 py-1 text-xs rounded-full">
                  Verified
                </span>
              </div>

              <div className="border rounded-lg p-3">
                <p className="font-medium">Bank Statement</p>
                <p className="text-xs text-gray-400">15 Jan 2024</p>
                <span className="mt-2 inline-block bg-yellow-100 text-yellow-600 px-2 py-1 text-xs rounded-full">
                  Pending
                </span>
              </div>

              <div className="border rounded-lg p-3">
                <p className="font-medium">Salary Slip</p>
                <p className="text-xs text-gray-400">14 Jan 2024</p>
                <span className="mt-2 inline-block bg-red-100 text-red-600 px-2 py-1 text-xs rounded-full">
                  Rejected
                </span>
              </div>

            </div>
          </div>

          {/* Case 2 */}
          <div className="bg-white p-5 rounded-xl shadow">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-blue-600 font-semibold">
                  AUTO-2024-0123
                </h3>
                <p className="text-sm text-gray-500">Priya Sharma</p>
              </div>
              <p className="text-sm text-gray-400">4 documents</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="border rounded-lg p-3">
                <p className="font-medium">Aadhaar Card</p>
                <p className="text-xs text-gray-400">14 Jan 2024</p>
                <span className="mt-2 inline-block bg-green-100 text-green-600 px-2 py-1 text-xs rounded-full">
                  Verified
                </span>
              </div>

              <div className="border rounded-lg p-3">
                <p className="font-medium">PAN Card</p>
                <p className="text-xs text-gray-400">14 Jan 2024</p>
                <span className="mt-2 inline-block bg-green-100 text-green-600 px-2 py-1 text-xs rounded-full">
                  Verified
                </span>
              </div>

              <div className="border rounded-lg p-3">
                <p className="font-medium">Bank Statement</p>
                <p className="text-xs text-gray-400">14 Jan 2024</p>
                <span className="mt-2 inline-block bg-green-100 text-green-600 px-2 py-1 text-xs rounded-full">
                  Verified
                </span>
              </div>

              <div className="border rounded-lg p-3">
                <p className="font-medium">ITR</p>
                <p className="text-xs text-gray-400">14 Jan 2024</p>
                <span className="mt-2 inline-block bg-green-100 text-green-600 px-2 py-1 text-xs rounded-full">
                  Verified
                </span>
              </div>
            </div>
          </div>

          {/* Case 3 */}
          <div className="bg-white p-5 rounded-xl shadow">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-blue-600 font-semibold">
                  AUTO-2024-0122
                </h3>
                <p className="text-sm text-gray-500">Amit Patel</p>
              </div>
              <p className="text-sm text-gray-400">2 documents</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="border rounded-lg p-3">
                <p className="font-medium">Aadhaar Card</p>
                <p className="text-xs text-gray-400">13 Jan 2024</p>
                <span className="mt-2 inline-block bg-green-100 text-green-600 px-2 py-1 text-xs rounded-full">
                  Verified
                </span>
              </div>

              <div className="border rounded-lg p-3">
                <p className="font-medium">PAN Card</p>
                <p className="text-xs text-gray-400">13 Jan 2024</p>
                <span className="mt-2 inline-block bg-yellow-100 text-yellow-600 px-2 py-1 text-xs rounded-full">
                  Pending
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}