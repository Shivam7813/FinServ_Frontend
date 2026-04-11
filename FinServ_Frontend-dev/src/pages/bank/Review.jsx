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

  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [remark, setRemark] = useState("");

  // ✅ FETCH DATA
  const fetchData = async () => {
    setLoading(true);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/loans/search`,
        { caseNumber, name: "" },
        { headers: { "Content-Type": "application/json" } }
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
            { headers: { "Content-Type": "application/json" } }
          );
          docs = docRes.data || [];
        } catch {}
      }

      setApplication(mapped);
      setDocuments(docs);
      setStatus(mapped.status);

    } catch (err) {
      console.error("Fetch error:", err);
      setApplication(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [caseNumber]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "APPROVED": return "bg-green-100 text-green-700";
      case "REJECTED": return "bg-red-100 text-red-700";
      case "UNDER_REVIEW": return "bg-blue-100 text-blue-700";
      case "DOCUMENTS_REQUIRED": return "bg-orange-100 text-orange-700";
      case "PENDING": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const formatStatus = (status) => {
    if (status === "SUBMITTED_TO_BANK") return "UNDER REVIEW";
    return status?.replaceAll("_", " ");
  };

  const handleUpdate = async (newStatus) => {
    setUpdating(true);

    try {
      let url = "";

      if (newStatus === "APPROVED") url = "/api/loans/approve";
      else if (newStatus === "REJECTED") url = "/api/loans/reject";
      else if (newStatus === "UNDER_REVIEW") url = "/api/loans/submit-to-bank";

      await axios.put(
        `http://localhost:8080${url}`,
        { caseNumber },
        { headers: { "Content-Type": "application/json" } }
      );

      await fetchData();

    } catch {
      alert("Action failed");
    }

    setUpdating(false);
  };

  // ✅ PREVIEW FUNCTION
  const handlePreview = (docId) => {
    window.open(`${API_BASE_URL}/api/documents/preview/${docId}`, "_blank");
  };

  const handleSaveRemark = () => {
    console.log("Remark:", remark);
    setShowRemarkModal(false);
    setRemark("");
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-10 text-center text-gray-500">
          Loading application...
        </div>
      </AdminLayout>
    );
  }

  if (!application) {
    return (
      <AdminLayout>
        <div className="p-10 text-center text-red-500">
          No data found
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 space-y-6">

        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:underline text-sm"
        >
          ← Back
        </button>

        {/* HEADER */}
        <div className="bg-blue-600 text-white p-6 rounded-xl">
          <h2 className="text-xl font-semibold">
            {application.customerName}
          </h2>
          <p>{application.loanType} • ₹{application.loanAmount}</p>
          <span className={`mt-2 inline-block px-3 py-1 rounded ${getStatusStyle(status)}`}>
            {formatStatus(status)}
          </span>
        </div>

        {/* DOCUMENTS */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-2">Documents</h3>

          {documents.length === 0 ? (
            <p>No documents</p>
          ) : (
            documents.map((doc) => (
              <div key={doc.id} className="flex justify-between items-center p-2 border rounded mb-2">

                {/* NAME */}
                <span>{doc.documentType || "Document"}</span>

                {/* ACTIONS */}
                <div className="flex items-center gap-3">

                  {/* PREVIEW BUTTON */}
                  {doc.id ? (
                    <button
                      onClick={() => handlePreview(doc.id)}
                      className="text-blue-600 underline text-sm"
                    >
                      View
                    </button>
                  ) : (
                    <span className="text-gray-400 text-sm">
                      Not Available
                    </span>
                  )}

                  {/* STATUS */}
                  <span className={`${getStatusStyle(doc.status)} px-2 py-1 rounded text-sm`}>
                    {formatStatus(doc.status)}
                  </span>

                </div>
              </div>
            ))
          )}
        </div>

        {/* ACTIONS */}
        <div className="bg-white p-4 rounded-xl shadow">
          <div className="flex gap-3 flex-wrap">

            <button onClick={() => handleUpdate("APPROVED")} className="bg-green-600 text-white px-4 py-2 rounded">
              Approve
            </button>

            <button onClick={() => handleUpdate("REJECTED")} className="bg-red-600 text-white px-4 py-2 rounded">
              Reject
            </button>

            <button onClick={() => handleUpdate("UNDER_REVIEW")} className="bg-blue-600 text-white px-4 py-2 rounded">
              Under Review
            </button>

            <button
              onClick={() => setShowRemarkModal(true)}
              className="bg-gray-800 text-white px-4 py-2 rounded"
            >
              Remark
            </button>
          </div>
        </div>

        {/* REMARK MODAL */}
        {showRemarkModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">

            <div
              className="absolute inset-0 bg-black opacity-40"
              onClick={() => setShowRemarkModal(false)}
            ></div>

            <div className="relative bg-white p-6 rounded-xl shadow w-full max-w-md z-50">
              <h3 className="text-lg font-semibold mb-3">Add Remark</h3>

              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                className="w-full border rounded p-2 h-28"
              />

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowRemarkModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSaveRemark}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}