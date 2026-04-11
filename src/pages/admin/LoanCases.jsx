// src/pages/admin/LoanCases.jsx

import AdminLayout from "../../layouts/AdminLayout";

export default function LoanCases() {
  return (
    <AdminLayout>
      <div className="p-6">
        {/* Page Title */}
        <h1 className="text-2xl font-semibold text-gray-800">Loan Cases</h1>
        <p className="text-gray-500 mt-1">
          Manage and track all loan applications here.
        </p>

        {/* Top Actions */}
        <div className="flex justify-between items-center mt-6">
          <div className="flex gap-3 w-full max-w-md">
            <input
              type="text"
              placeholder="Search by case number, customer..."
              className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-3 py-2 border rounded-lg hover:bg-gray-100">
              ⚙️
            </button>
          </div>

          <button className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-700">
            + Create New Case
          </button>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-xl shadow mt-6 p-4">
          <h2 className="text-lg font-semibold mb-4">All Loan Cases</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 border-b text-left">
                  <th className="py-3">Case Number</th>
                  <th>Customer</th>
                  <th>Vehicle</th>
                  <th>Amount</th>
                  <th>Bank</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody className="text-gray-700">
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 text-blue-600">AUTO-2024-0124</td>
                  <td>
                    Rajesh Kumar
                    <div className="text-xs text-gray-400">
                      +91 98765 43210
                    </div>
                  </td>
                  <td>Hyundai Creta SX</td>
                  <td>₹8,50,000</td>
                  <td>HDFC Bank</td>
                  <td>
                    <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs">
                      Under Review
                    </span>
                  </td>
                  <td>15 Jan 2024</td>
                  <td>•••</td>
                </tr>

                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 text-blue-600">AUTO-2024-0123</td>
                  <td>
                    Priya Sharma
                    <div className="text-xs text-gray-400">
                      +91 87654 32109
                    </div>
                  </td>
                  <td>Tata Harrier XZ+</td>
                  <td>₹12,00,000</td>
                  <td>ICICI Bank</td>
                  <td>
                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs">
                      Approved
                    </span>
                  </td>
                  <td>14 Jan 2024</td>
                  <td>•••</td>
                </tr>

                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 text-blue-600">AUTO-2024-0122</td>
                  <td>
                    Amit Patel
                    <div className="text-xs text-gray-400">
                      +91 76543 21098
                    </div>
                  </td>
                  <td>Maruti Swift ZXI</td>
                  <td>₹6,75,000</td>
                  <td>-</td>
                  <td>
                    <span className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-xs">
                      Documents Pending
                    </span>
                  </td>
                  <td>13 Jan 2024</td>
                  <td>•••</td>
                </tr>

                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 text-blue-600">AUTO-2024-0121</td>
                  <td>
                    Neha Gupta
                    <div className="text-xs text-gray-400">
                      +91 65432 10987
                    </div>
                  </td>
                  <td>Mahindra XUV700 AX7</td>
                  <td>₹15,00,000</td>
                  <td>SBI</td>
                  <td>
                    <span className="bg-teal-100 text-teal-600 px-3 py-1 rounded-full text-xs">
                      Disbursed
                    </span>
                  </td>
                  <td>12 Jan 2024</td>
                  <td>•••</td>
                </tr>

                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 text-blue-600">AUTO-2024-0120</td>
                  <td>
                    Vikram Singh
                    <div className="text-xs text-gray-400">
                      +91 54321 09876
                    </div>
                  </td>
                  <td>Kia Seltos HTX</td>
                  <td>₹9,25,000</td>
                  <td>Axis Bank</td>
                  <td>
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs">
                      Submitted to Bank
                    </span>
                  </td>
                  <td>11 Jan 2024</td>
                  <td>•••</td>
                </tr>

                <tr className="hover:bg-gray-50">
                  <td className="py-3 text-blue-600">AUTO-2024-0119</td>
                  <td>
                    Sunita Rao
                    <div className="text-xs text-gray-400">
                      +91 43210 98765
                    </div>
                  </td>
                  <td>Honda City V CVT</td>
                  <td>₹7,50,000</td>
                  <td>HDFC Bank</td>
                  <td>
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs">
                      Rejected
                    </span>
                  </td>
                  <td>10 Jan 2024</td>
                  <td>•••</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}