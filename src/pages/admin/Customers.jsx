// src/pages/admin/Customers.jsx

import AdminLayout from "../../layouts/AdminLayout";

export default function Customers() {
  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <h1 className="text-2xl font-semibold text-gray-800">Customers</h1>
        <p className="text-gray-500 mt-1">
          View and manage customer details.
        </p>

        {/* Top Bar */}
        <div className="flex justify-between items-center mt-6">
          <input
            type="text"
            placeholder="Search customers..."
            className="w-full max-w-md px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button className="ml-4 bg-teal-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-700">
            + Add Customer
          </button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          
          {/* Card 1 */}
          <div className="bg-white p-5 rounded-xl shadow hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="bg-blue-900 text-white w-10 h-10 flex items-center justify-center rounded-full font-semibold">
                  RK
                </div>
                <div>
                  <h3 className="font-semibold">Rajesh Kumar</h3>
                  <p className="text-xs text-gray-400">ABCDE1234F</p>
                </div>
              </div>
              <span>•••</span>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <p>📧 rajesh.kumar@email.com</p>
              <p>📞 +91 98765 43210</p>
            </div>

            <div className="border-t mt-4 pt-3 flex justify-between text-sm">
              <div className="text-center">
                <p className="font-semibold">2</p>
                <p className="text-xs text-gray-400">Total Loans</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-green-600">1</p>
                <p className="text-xs text-gray-400">Active</p>
              </div>
              <div className="text-center">
                <p className="font-semibold">₹18,50,000</p>
                <p className="text-xs text-gray-400">Total Value</p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-5 rounded-xl shadow hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="bg-blue-900 text-white w-10 h-10 flex items-center justify-center rounded-full font-semibold">
                  PS
                </div>
                <div>
                  <h3 className="font-semibold">Priya Sharma</h3>
                  <p className="text-xs text-gray-400">FGHIJ5678K</p>
                </div>
              </div>
              <span>•••</span>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <p>📧 priya.sharma@email.com</p>
              <p>📞 +91 87654 32109</p>
            </div>

            <div className="border-t mt-4 pt-3 flex justify-between text-sm">
              <div className="text-center">
                <p className="font-semibold">1</p>
                <p className="text-xs text-gray-400">Total Loans</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-green-600">1</p>
                <p className="text-xs text-gray-400">Active</p>
              </div>
              <div className="text-center">
                <p className="font-semibold">₹12,00,000</p>
                <p className="text-xs text-gray-400">Total Value</p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-5 rounded-xl shadow hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="bg-blue-900 text-white w-10 h-10 flex items-center justify-center rounded-full font-semibold">
                  AP
                </div>
                <div>
                  <h3 className="font-semibold">Amit Patel</h3>
                  <p className="text-xs text-gray-400">KLMNO9012P</p>
                </div>
              </div>
              <span>•••</span>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <p>📧 amit.patel@email.com</p>
              <p>📞 +91 76543 21098</p>
            </div>

            <div className="border-t mt-4 pt-3 flex justify-between text-sm">
              <div className="text-center">
                <p className="font-semibold">1</p>
                <p className="text-xs text-gray-400">Total Loans</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-green-600">1</p>
                <p className="text-xs text-gray-400">Active</p>
              </div>
              <div className="text-center">
                <p className="font-semibold">₹6,75,000</p>
                <p className="text-xs text-gray-400">Total Value</p>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-5 rounded-xl shadow hover:shadow-md transition">
            <div className="flex items-center gap-3">
              <div className="bg-blue-900 text-white w-10 h-10 flex items-center justify-center rounded-full font-semibold">
                NG
              </div>
              <div>
                <h3 className="font-semibold">Neha Gupta</h3>
                <p className="text-xs text-gray-400">QRSTU3456V</p>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <p>📧 neha.gupta@email.com</p>
              <p>📞 +91 65432 10987</p>
            </div>

            <div className="border-t mt-4 pt-3 flex justify-between text-sm">
              <div className="text-center">
                <p className="font-semibold">3</p>
                <p className="text-xs text-gray-400">Total Loans</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-green-600">0</p>
                <p className="text-xs text-gray-400">Active</p>
              </div>
              <div className="text-center">
                <p className="font-semibold">₹35,00,000</p>
                <p className="text-xs text-gray-400">Total Value</p>
              </div>
            </div>
          </div>

          {/* Card 5 */}
          <div className="bg-white p-5 rounded-xl shadow hover:shadow-md transition">
            <div className="flex items-center gap-3">
              <div className="bg-blue-900 text-white w-10 h-10 flex items-center justify-center rounded-full font-semibold">
                VS
              </div>
              <div>
                <h3 className="font-semibold">Vikram Singh</h3>
                <p className="text-xs text-gray-400">WXYZ7890B</p>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <p>📧 vikram.singh@email.com</p>
              <p>📞 +91 54321 09876</p>
            </div>

            <div className="border-t mt-4 pt-3 flex justify-between text-sm">
              <div className="text-center">
                <p className="font-semibold">1</p>
                <p className="text-xs text-gray-400">Total Loans</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-green-600">1</p>
                <p className="text-xs text-gray-400">Active</p>
              </div>
              <div className="text-center">
                <p className="font-semibold">₹9,25,000</p>
                <p className="text-xs text-gray-400">Total Value</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}