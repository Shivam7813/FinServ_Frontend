import AdminLayout from "../../layouts/AdminLayout";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config/apiBase";
import { fetchAdminDocumentDashboard } from "../../services/documentService";
import { adminRejectCase } from "../../services/loanService";

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

  // ✅ FIX NAME (VERY IMPORTANT)
  customerName:
    raw.customerName ||
    raw.customer_name ||
    raw.applicantName ||
    raw.applicant_name ||
    raw.userName ||
    raw.name ||
    raw.customer ||   // 🔥 THIS FIXES "Bank" ISSUE
    "N/A",

  // ✅ FIX AMOUNT
  loanAmount:
    raw.loanAmount ||
    raw.loan_amount ||
    raw.amount ||
    raw.loanAmt ||
    0,

  // ✅ FIX LOAN TYPE (MAIN ISSUE)
  loanType:
    raw.loanType ||
    raw.loan_type ||
    raw.vehicle ||        // 🔥 MOST IMPORTANT
    raw.vehicleType ||
    raw.loanCategory ||
    raw.type ||
    raw.loanName ||        // 🔥 ADD THIS
    raw.productType ||     // 🔥 ADD THIS
    raw.scheme ||  
    "N/A",

  status: raw.status || "PENDING",

  // ✅ DATE
  submittedAt:
    raw.submittedAt ||
    raw.createdAt ||
    raw.createdDate ||
    raw.date ||
    "N/A",

    adminRemark:
    raw.adminRemark ||
    raw.remark ||
    raw.admin_remark ||
    "",
};
     let docs = [];

try {
  const allDocs = await fetchAdminDocumentDashboard();

  const normalize = (str) =>
  (str || "").toLowerCase().replace(/\s+/g, "").trim();

  const caseData = allDocs.find((c) => {
  return normalize(c.caseNumber).includes(normalize(caseNumber)) ||
          normalize(caseNumber).includes(normalize(c.caseNumber));
  });


  docs = caseData?.documents || [];

} catch (err) {
  console.error("Doc fetch error:", err);

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
    if (status === "SUBMITTED_TO_BANK" || status === "ASSIGNED_TO_BANK") {
      return "UNDER REVIEW";
    }
    return status?.replaceAll("_", " ");
  };

  const handleUpdate = async (newStatus) => {
    setUpdating(true);

    try {
      let url = "";

      if (newStatus === "APPROVED") url = "/api/loans/approve";
      // else if (newStatus === "REJECTED") url = "/api/loans/reject";
      else if (newStatus === "UNDER_REVIEW") url = "/api/loans/submit-to-bank";

      await axios.put(
        `${API_BASE_URL}${url}`,
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
      const url = `${API_BASE_URL}/api/documents/preview/${docId}`;
      setPreviewUrl(url);
    };

  const handleSaveRemark = async () => {
  if (!remark.trim()) {
    alert("Remark is required");
    return;
  }

  try {
    await adminRejectCase(caseNumber, remark); // ✅ USE SERVICE

    alert("Application rejected with remark");

    setShowRemarkModal(false);
    setRemark("");

    fetchData();

  } catch (err) {
  console.error("FULL ERROR:", err);
  console.error("RESPONSE:", err.response);
  console.error("DATA:", err.response?.data);

  alert(
    err.response?.data?.message ||
    err.response?.data ||
    "Server error"
  );
}
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

  // if (!application) {
  //   return (
  //     <AdminLayout>
  //       <div className="p-10 text-center text-red-500">
  //         No data found
  //       </div>
  //     </AdminLayout>
  //   );
  // }
          //  const handlePreview = (docId) => {
          //   const url = `${API_BASE_URL}/api/documents/preview/${docId}`;
          //   window.open(url, "_blank");
          //   };
  return (
  <AdminLayout>
    <div className="p-6 space-y-6">

      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:underline text-sm"
      >
        ← Back to cases
      </button>

      {/* 🔥 TOP SUMMARY BAR */}
      <div className="bg-white rounded-2xl shadow p-6 flex justify-between items-center flex-wrap gap-4 border">

        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            {application.customerName}
          </h2>

          <p className="text-gray-500 text-sm mt-1">
            {application.loanType} • ₹{Number(application.loanAmount).toLocaleString()}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            Submitted: {application.submittedAt}
          </p>
        </div>

        {application.adminRemark && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-gray-700">
            <strong>Remark:</strong> {application.adminRemark}
          </div>
        )}

        <span
          className={`px-4 py-1 rounded-full text-sm font-semibold ${getStatusStyle(status)}`}
        >
          {formatStatus(status)}
        </span>
      </div>

      {/* 🔥 DOCUMENTS (ADMIN TABLE STYLE) */}
<div className="bg-white rounded-2xl shadow p-6 border">

  <div className="flex justify-between items-center mb-4">
    <h3 className="text-lg font-semibold text-gray-800">
      Documents
    </h3>

    <span className="text-sm text-gray-400">
      {documents.length} files
    </span>
  </div>

  {documents.length === 0 ? (
    <p className="text-gray-400 text-sm text-center py-6">
      No documents uploaded
    </p>
  ) : (
    <div className="overflow-x-auto">

      <table className="w-full text-sm">

        {/* HEADER */}
        <thead>
          <tr className="text-gray-500 border-b text-left">
            <th className="py-3">Document</th>
            <th>File Name</th>
            <th>Date</th>
            {/* <th>Status</th> */}
            <th>Action</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody className="text-gray-700">
          {documents.map((doc) => (
            <tr
              key={doc.id}
              className="border-b hover:bg-gray-50 transition"
            >
              <td className="py-3 font-medium">
                {doc.documentType || "Document"}
              </td>

              <td className="truncate max-w-[200px] text-xs text-gray-500">
                {doc.fileName || "—"}
              </td>

              <td className="text-xs text-gray-500">
                {doc.uploadDate || "—"}
              </td>

              {/* <td>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                    doc.status
                  )}`}
                >
                  {formatStatus(doc.status)}
                </span>
              </td> */}

              <td>
                {doc.id ? (
                  <button
                    onClick={() => handlePreview(doc.id)}
                    className="px-3 py-1 text-xs border border-blue-200 text-blue-600 rounded hover:bg-blue-50"
                  >
                    View
                  </button>
                ) : (
                  <span className="text-gray-400 text-xs">
                    Not available
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  )}
</div>

      {/* 🔥 ACTION PANEL (LIKE ADMIN) */}
      <div className="bg-white rounded-2xl shadow p-6 border">

        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Actions
        </h3>

        <div className="flex flex-wrap gap-3">

          <button
            onClick={() => handleUpdate("APPROVED")}
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
          >
            Approve
          </button>

          <button
            onClick={() => setShowRemarkModal(true)}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
          >
            Reject
          </button>

          {/* <button
            onClick={() => handleUpdate("UNDER_REVIEW")}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Under Review
          </button> */}

          <button
            onClick={() => setShowRemarkModal(true)}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Add Remark
          </button>
        </div>
      </div>

      {/* PREVIEW MODAL (UNCHANGED) */}
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

  
          </div>
        </div>
      )}

      {/* REMARK MODAL (UNCHANGED) */}
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