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

  // ✅ NEW: Preview modal state
  const [previewUrl, setPreviewUrl] = useState(null);

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

  // ✅ UPDATED PREVIEW (uses API URL)
  const handlePreview = (docId) => {
    const url = `http://localhost:8080/api/documents/preview/${docId}`;
    setPreviewUrl(url);
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
          <p className="text-sm mt-1">Submitted: {application.submittedAt}</p>

          <span className={`mt-2 inline-block px-3 py-1 rounded ${getStatusStyle(status)}`}>
            {formatStatus(status)}
          </span>
        </div>

        {/* DOCUMENTS */}
        <div className="bg-white p-5 rounded-xl shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg text-gray-800">
              Documents
            </h3>
            <span className="text-sm text-gray-500">
              Total: {documents.length}
            </span>
          </div>

          {documents.length === 0 ? (
            <p className="text-gray-400 text-sm">No documents uploaded</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="border rounded-xl p-4 hover:shadow-md transition"
                >
                  <p className="font-medium text-gray-800">
                    {doc.documentType || "Document"}
                  </p>

                  <p className="text-xs text-gray-400 mt-1 truncate">
                    {doc.fileName || "No file name"}
                  </p>

                  <p className="text-xs text-gray-400">
                    {doc.uploadDate || "—"}
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <span className={`${getStatusStyle(doc.status)} px-3 py-1 rounded-full text-xs`}>
                      {formatStatus(doc.status)}
                    </span>

                    {doc.id ? (
                      <button
                        onClick={() => handlePreview(doc.id)}
                        className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs hover:bg-blue-100"
                      >
                        👁 View
                      </button>
                    ) : (
                      <span className="text-gray-400 text-xs">
                        Not Available
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
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

        {/* PREVIEW MODAL */}
        {previewUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">

            <div
              className="absolute inset-0 bg-black opacity-50"
              onClick={() => setPreviewUrl(null)}
            ></div>

            <div className="relative bg-white w-[90%] h-[80%] rounded-xl shadow z-50">

              <button
                onClick={() => setPreviewUrl(null)}
                className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
              >
                ✕
              </button>

              <iframe
                src={previewUrl}
                title="Document Preview"
                className="w-full h-full rounded-xl"
              />
            </div>
          </div>
        )}

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