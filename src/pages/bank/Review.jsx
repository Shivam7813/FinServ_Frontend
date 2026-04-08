import AdminLayout from "../../layouts/AdminLayout";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { applications, documents } from "../../mock/mockData";

export default function Review() {
  const { id } = useParams();
  const navigate = useNavigate();

  const application = applications.find(
    (app) => app.id === Number(id)
  );

  const applicationDocs = documents.filter(
    (doc) => doc.applicationId === Number(id)
  );

  const [status, setStatus] = useState(
    application?.status || "UNDER_REVIEW"
  );

  const isFinal =
    application?.status === "APPROVED" ||
    application?.status === "REJECTED";

  const getStatusStyle = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      case "UNDER_REVIEW":
        return "bg-blue-100 text-blue-700";
      case "DOCUMENTS_REQUIRED":
        return "bg-orange-100 text-orange-700";
      case "VERIFIED":
        return "bg-green-100 text-green-700";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatStatus = (status) => status.replaceAll("_", " ");

  if (!application) {
    return (
      <AdminLayout>
        <div className="p-6 text-center">Application not found</div>
      </AdminLayout>
    );
  }

  if (isFinal) {
    return (
      <AdminLayout>
        <div className="p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">
            This application is already {formatStatus(application.status)}
          </h2>
          <p className="text-gray-500 mb-4">
            You cannot review completed applications
          </p>

          <button
            onClick={() => navigate("/bank/applications")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Back to Applications
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 space-y-6">

        {/* 🔙 Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:underline text-sm"
        >
          ← Back
        </button>

        {/* 🔥 Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold">
            {application.fullName}
          </h2>

          <p className="opacity-90">
            {application.loanType} • ₹{application.loanAmount}
          </p>

          <span
            className={`inline-block mt-3 px-3 py-1 text-xs rounded-full ${getStatusStyle(
              status
            )}`}
          >
            {formatStatus(status)}
          </span>
        </div>

        {/* 🔥 Details */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-semibold mb-2">Loan Details</h3>
            <p>Amount: ₹{application.loanAmount}</p>
            <p>Type: {application.loanType}</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-semibold mb-2">Current Status</h3>
            <p className="font-semibold text-blue-600">
              {formatStatus(status)}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-semibold mb-2">Submitted</h3>
            <p>{application.submittedAt}</p>
          </div>
        </div>

        {/* 🔥 Documents */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-3">Documents</h3>

          {applicationDocs.length === 0 ? (
            <p className="text-gray-500">No documents available</p>
          ) : (
            <div className="space-y-2">
              {applicationDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="flex justify-between items-center border p-3 rounded"
                >
                  <span>{doc.name}</span>

                  <span
                    className={`px-2 py-1 text-xs rounded ${getStatusStyle(
                      doc.status
                    )}`}
                  >
                    {formatStatus(doc.status)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 🔥 Actions */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-3">Decision</h3>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setStatus("APPROVED")}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Approve
            </button>

            <button
              onClick={() => setStatus("REJECTED")}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Reject
            </button>

            <button
              onClick={() => setStatus("DOCUMENTS_REQUIRED")}
              className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
            >
              Request Docs
            </button>

            <button
              onClick={() => setStatus("UNDER_REVIEW")}
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