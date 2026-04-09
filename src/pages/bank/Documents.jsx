import AdminLayout from "../../layouts/AdminLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ✅ SERVICE
import {
  getApplications,
  getDocuments,
  updateDocumentStatus,
} from "../../services/applicationService";

export default function Documents() {
  const [search, setSearch] = useState("");
  const [applications, setApplications] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [previewDoc, setPreviewDoc] = useState(null); // 🔥 modal state

  const navigate = useNavigate();

  // ✅ FETCH DATA
  const fetchData = async () => {
    const apps = await getApplications();
    const docs = await getDocuments();

    setApplications(apps);
    setDocuments(docs);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 Map applicationId → name
  const getApplicantName = (applicationId) => {
    const app = applications.find((a) => a.id === applicationId);
    return app ? app.fullName : "Unknown";
  };

  // 🔹 FILTER
  const filteredDocs = documents.filter((doc) =>
    getApplicantName(doc.applicationId)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case "VERIFIED":
        return "bg-green-100 text-green-700";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatStatus = (status) => status.replaceAll("_", " ");

  // ✅ VERIFY
  const handleVerify = async (id) => {
    await updateDocumentStatus(id, "VERIFIED");
    fetchData();
  };

  return (
    <AdminLayout>
      <div className="p-4">

        {/* HEADER */}
        <h2 className="text-2xl font-semibold mb-4">
          Documents
        </h2>

        {/* SEARCH */}
        <div className="mb-5">
          <input
            type="text"
            placeholder="Search by applicant..."
            className="border px-3 py-2 rounded-lg w-full md:w-1/3 focus:ring-2 focus:ring-blue-400 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* TABLE */}
        <div className="bg-white shadow rounded-xl overflow-hidden">
          <table className="w-full text-left">

            <thead className="bg-gray-100 text-gray-600 text-sm">
              <tr>
                <th className="p-3">Applicant</th>
                <th className="p-3">Document</th>
                <th className="p-3">File</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-6 text-gray-500">
                    No documents found
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="border-t hover:bg-gray-50 transition">

                    {/* Applicant */}
                    <td className="p-3 font-medium flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full text-sm font-semibold">
                        {getApplicantName(doc.applicationId).charAt(0)}
                      </div>
                      {getApplicantName(doc.applicationId)}
                    </td>

                    {/* Document */}
                    <td className="p-3">{doc.name}</td>

                    {/* File */}
                    <td className="p-3">
                      <span
                        onClick={() => setPreviewDoc(doc)}
                        className="text-blue-600 cursor-pointer hover:underline"
                      >
                        📄 {doc.name.toLowerCase().replaceAll(" ", "_")}.pdf
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                          doc.status
                        )}`}
                      >
                        {formatStatus(doc.status)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3 flex gap-2">

                      {/* 🔥 VIEW → NAVIGATE */}
                      <button
                        onClick={() =>
                          navigate(`/bank/review/${doc.applicationId}`)
                        }
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        View
                      </button>

                      {/* VERIFY */}
                      {doc.status === "PENDING" && (
                        <button
                          onClick={() => handleVerify(doc.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                        >
                          Verify
                        </button>
                      )}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 🔥 DOCUMENT PREVIEW MODAL */}
        {previewDoc && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">

              <h3 className="text-lg font-semibold mb-3">
                Document Preview
              </h3>

              <p className="text-gray-600 mb-2">
                <strong>Name:</strong> {previewDoc.name}
              </p>

              <p className="text-gray-600 mb-4">
                <strong>Status:</strong> {previewDoc.status}
              </p>

              <div className="bg-gray-100 p-4 rounded text-center text-gray-500">
                📄 Preview not available (Demo Mode)
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}