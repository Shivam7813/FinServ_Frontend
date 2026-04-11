import AdminLayout from "../../layouts/AdminLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config/apiBase";

export default function Documents() {
  const [search, setSearch] = useState("");
  const [applications, setApplications] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [previewDoc, setPreviewDoc] = useState(null);

  const fetchData = async () => {
    try {
      const appRes = await axios.get(
        `${API_BASE_URL}/api/loans/dashboard`
      );

      const apps = appRes.data || [];
      setApplications(apps);

      let allDocs = [];

      for (let app of apps) {
        try {

          // ✅ FIXED: GET CORRECT LOAN ID (IMPORTANT 🔥)
          const loanId =
            app.loanId ||
            app.id ||
            app.caseId ||
            app.caseNumber;

          if (!loanId) {
            console.warn("❌ No valid loanId found:", app);
            continue;
          }

          const docRes = await axios.post(
            `${API_BASE_URL}/api/documents/loan`,
            { id: loanId },
            { headers: { "Content-Type": "application/json" } }
          );

          console.log("✅ Docs for loanId:", loanId, docRes.data);

          if (Array.isArray(docRes.data)) {
            const docsWithAppId = docRes.data.map((doc) => ({
              ...doc,
              applicationId: loanId, // ✅ FIXED HERE
            }));

            allDocs = [...allDocs, ...docsWithAppId];
          }
        } catch (err) {
          console.error("Error fetching docs for loan:", app);
        }
      }

      const uniqueDocs = Array.from(
        new Map(allDocs.map((doc) => [doc.id, doc])).values()
      );

      setDocuments(uniqueDocs);

    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs";
      case "REJECTED":
        return "bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs";
      default:
        return "bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs";
    }
  };

  const formatStatus = (status) =>
    status ? status.replaceAll("_", " ") : "N/A";

  const getPreviewUrl = (doc) => {
    if (!doc?.id) return null;
    return `${API_BASE_URL}/api/documents/preview/${doc.id}`;
  };

  const handleDownload = (doc) => {
    if (!doc?.id) return;

    const url = `${API_BASE_URL}/api/documents/preview/${doc.id}`;

    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.download = doc.fileName || "document.pdf";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout>
      <div className="p-4">

        <h2 className="text-2xl font-semibold mb-4">
          Documents
        </h2>

        <div className="mb-5">
          <input
            type="text"
            placeholder="Search by applicant..."
            className="border px-3 py-2 rounded-lg w-full md:w-1/3"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

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
              {applications.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-6 text-gray-500">
                    No applications found
                  </td>
                </tr>
              ) : (
                applications
                  .filter((app) =>
                    (app.customerName || app.fullName || "")
                      .toLowerCase()
                      .includes(search.toLowerCase())
                  )
                  .map((app) => {

                    // ✅ FIXED MATCHING HERE ALSO
                    const loanId =
                      app.loanId ||
                      app.id ||
                      app.caseId ||
                      app.caseNumber;

                    const appDocs = documents.filter(
                      (doc) => doc.applicationId === loanId
                    );

                    const applicantName =
                      app.customerName || app.fullName || "Unknown";

                    if (appDocs.length === 0) {
                      return (
                        <tr key={app.id}>
                          <td className="p-3">{applicantName}</td>
                          <td className="p-3 text-gray-400">Not Available</td>
                          <td className="p-3 text-gray-400">Not Available</td>
                          <td className="p-3 text-gray-400">N/A</td>
                          <td className="p-3 text-gray-400">No Action</td>
                        </tr>
                      );
                    }

                    return appDocs.map((doc) => (
                      <tr key={doc.id}>
                        <td className="p-3">{applicantName}</td>

                        <td className="p-3">
                          {doc.documentType || "Not Available"}
                        </td>

                        <td className="p-3">
                          <span
                            onClick={() => setPreviewDoc(doc)}
                            className="text-blue-600 cursor-pointer"
                          >
                            📄 {doc.fileName || "View"}
                          </span>
                        </td>

                        <td className="p-3">
                          <span className={getStatusStyle(doc.status)}>
                            {formatStatus(doc.status)}
                          </span>
                        </td>

                        <td className="p-3 flex gap-2">
                          <button
                            onClick={() => setPreviewDoc(doc)}
                            className="bg-green-600 text-white px-3 py-1 rounded"
                          >
                            Preview
                          </button>

                          <button
                            onClick={() => handleDownload(doc)}
                            className="bg-blue-600 text-white px-3 py-1 rounded"
                          >
                            Download
                          </button>
                        </td>
                      </tr>
                    ));
                  })
              )}
            </tbody>
          </table>
        </div>

        {previewDoc && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded w-full max-w-4xl">

              <iframe
                src={getPreviewUrl(previewDoc)}
                className="w-full h-[600px]"
                title="preview"
              />

              <button
                onClick={() => setPreviewDoc(null)}
                className="mt-4 bg-gray-800 text-white px-4 py-2 rounded"
              >
                Close
              </button>

            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}