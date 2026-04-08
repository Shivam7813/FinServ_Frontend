import AdminLayout from "../../layouts/AdminLayout";
import { useState } from "react";

export default function Review() {
  const [status, setStatus] = useState("Under Review");

  const applicant = {
    name: "Rahul Sharma",
    
    income: 60000,
    
    loanAmount: 500000,
    loanType: "Home Loan",
  };

  const documents = [
    { name: "Aadhar Card", status: "Verified" },
    { name: "PAN Card", status: "Verified" },
    { name: "Bank Statement", status: "Pending" },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      case "Documents Required":
        return "bg-orange-100 text-orange-700";
      case "Under Review":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <AdminLayout>
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-4">Application Review</h2>

        {/* Applicant Info */}
        <div className="bg-white shadow rounded-xl p-4 mb-4">
          <h3 className="text-lg font-semibold mb-2">Applicant Profile</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <p><strong>Name:</strong> {applicant.name}</p>
           
            <p><strong>Income:</strong> ₹{applicant.income}</p>
            
            <p><strong>Loan:</strong> ₹{applicant.loanAmount}</p>
            <p><strong>Type:</strong> {applicant.loanType}</p>
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white shadow rounded-xl p-4 mb-4">
          <h3 className="text-lg font-semibold mb-3">Documents</h3>

          <div className="space-y-2">
            {documents.map((doc, index) => (
              <div
                key={index}
                className="flex justify-between items-center border p-2 rounded"
              >
                <span>{doc.name}</span>
                <span
                  className={`px-2 py-1 text-xs rounded ${getStatusStyle(
                    doc.status
                  )}`}
                >
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="bg-white shadow rounded-xl p-4 mb-4">
          <h3 className="text-lg font-semibold mb-2">Current Status</h3>
          <span
            className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(
              status
            )}`}
          >
            {status}
          </span>
        </div>

        {/* Decision Buttons */}
        <div className="bg-white shadow rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-3">Take Action</h3>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatus("Approved")}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Approve
            </button>

            <button
              onClick={() => setStatus("Rejected")}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Reject
            </button>

            <button
              onClick={() => setStatus("Documents Required")}
              className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
            >
              Request Docs
            </button>

            <button
              onClick={() => setStatus("Under Review")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}