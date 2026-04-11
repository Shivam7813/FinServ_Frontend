import AdminLayout from "../../layouts/AdminLayout";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config/apiBase";

export default function Review() {
  const { caseNumber } = useParams(); 
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // ✅ FETCH DATA
  const fetchData = async () => {
    setLoading(true);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/loans/search`,
        { caseNumber, name: "" },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.data || res.data.length === 0) {
        setApplication(null);
        setLoading(false);
        return;
      }

      const raw = res.data[0];

      const mapped = {
        id: raw.id,
        customerName: raw.customerName || raw.customer_name || raw.name || "N/A",
        loanAmount: raw.loanAmount || raw.loan_amount || raw.amount || 0,
        loanType: raw.loanType || raw.loan_type || "N/A",
        status: raw.status || "PENDING",
        submittedAt: raw.submittedAt || raw.createdAt || "N/A",
      };

      let docs = [];
      if (mapped.id) {
        try {
          const docRes = await axios.post(
            `${API_BASE_URL}/api/documents/loan`,
            { id: mapped.id },
            {
              headers: { "Content-Type": "application/json" },
            }
          );
          docs = docRes.data || [];
        } catch {
          console.warn("No documents found");
        }
      }

      setApplication(mapped);
      setDocuments(docs);
      setStatus(mapped.status);

    } catch (err) {
      console.error("Fetch error:", err.response || err);
      setApplication(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [caseNumber]);

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
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatStatus = (status) => {
      if (status === "SUBMITTED_TO_BANK") {
        return "UNDER REVIEW";
      }
      return status?.replaceAll("_", " ");
    };

  // ✅ UPDATED: backend-controlled logic
    const handleUpdate = async (newStatus) => {
    setUpdating(true);

    try {


      let url = "";

      // ✅ 🔥 THIS WAS MISSING
      if (newStatus === "APPROVED") url = "/api/loans/approve";
      else if (newStatus === "REJECTED") url = "/api/loans/reject";
      else if (newStatus === "UNDER_REVIEW") url = "/api/loans/submit-to-bank";

      console.log("Updating:", caseNumber, newStatus, "Current:", status);

      const res = await axios.put(
        `${API_BASE_URL}${url}`,
        { caseNumber },
        {
          headers: { "Content-Type": "application/json" }
        }
      );

      await fetchData();

    } catch (err) {
      alert("Action failed");
    }

    setUpdating(false);
    };

  // ✅ LOADING UI
  if (loading) {
    return (
      <AdminLayout>
        <div className="p-10 text-center text-gray-500 text-lg">
          ⏳ Loading application...
        </div>
      </AdminLayout>
    );
  }

  // ✅ EMPTY STATE
  if (!application) {
    return (
      <AdminLayout>
        <div className="p-10 text-center text-red-500 text-lg">
          ❌ No data found for this case
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 space-y-6">

        {/* BACK */}
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:underline text-sm"
        >
          ← Back
        </button>

        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-semibold">
            {application.customerName}
          </h2>

          <p className="opacity-90 mt-1">
            {application.loanType} • ₹{application.loanAmount}
          </p>

          <span
            className={`inline-block mt-3 px-3 py-1 text-sm rounded-full ${getStatusStyle(
              status
            )}`}
          >
            {formatStatus(status)}
          </span>
        </div>

        {/* DETAILS */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-semibold mb-2">Loan Details</h3>
            <p><b>Amount:</b> ₹{application.loanAmount}</p>
            <p><b>Type:</b> {application.loanType}</p>
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

        {/* DOCUMENTS */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-3">Documents</h3>

          {documents.length === 0 ? (
            <p className="text-gray-500">No documents available</p>
          ) : (
            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex justify-between items-center border p-3 rounded hover:bg-gray-50"
                >
                  <span>{doc.name || "Document"}</span>

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

        {/* ACTIONS */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-3">Decision</h3>

          <div className="flex flex-wrap gap-3">
            <button
              disabled={updating || status === "APPROVED"}
              onClick={() => handleUpdate("APPROVED")}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {updating ? "Processing..." : "Approve"}
            </button>

            <button
              disabled={updating || status === "REJECTED"}
              onClick={() => handleUpdate("REJECTED")}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
            >
              Reject
            </button>

            <button
              disabled={updating || status === "UNDER_REVIEW"}
              onClick={() => handleUpdate("UNDER_REVIEW")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Under Review
            </button>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}