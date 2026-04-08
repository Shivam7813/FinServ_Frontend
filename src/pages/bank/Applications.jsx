import AdminLayout from "../../layouts/AdminLayout";
import { useState } from "react";

export default function Applications() {
  const [applications, setApplications] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      amount: 500000,
      status: "Pending",
      type: "Home Loan",
    },
    {
      id: 2,
      name: "Priya Verma",
      amount: 300000,
      status: "Under Review",
      type: "Personal Loan",
    },
    {
      id: 3,
      name: "Amit Patel",
      amount: 700000,
      status: "Approved",
      type: "Car Loan",
    },
    {
      id: 4,
      name: "Sneha Joshi",
      amount: 250000,
      status: "Rejected",
      type: "Education Loan",
    },
  ]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Under Review":
        return "bg-blue-100 text-blue-700";
      case "Documents Required":
        return "bg-orange-100 text-orange-700";
      case "Approved":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <AdminLayout>
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-4">Loan Applications</h2>

        {/* Table */}
        <div className="bg-white shadow rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-600 text-sm">
              <tr>
                <th className="p-3">Applicant</th>
                <th className="p-3">Loan Type</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {applications.map((app) => (
                <tr key={app.id} className="border-t">
                  <td className="p-3 font-medium">{app.name}</td>
                  <td className="p-3">{app.type}</td>
                  <td className="p-3">₹{app.amount}</td>

                  {/* Status */}
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                        app.status
                      )}`}
                    >
                      {app.status}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="p-3">
                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                      Review
                    </button>
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