import AdminLayout from "../../layouts/AdminLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Documents() {
  const [search, setSearch] = useState("");
  const [applications, setApplications] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [previewDoc, setPreviewDoc] = useState(null);

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const appRes = await axios.get(
        "http://localhost:8080/api/loans/dashboard"
      );
      const apps = appRes.data || [];
      setApplications(apps);

      let allDocs = [];

      for (let app of apps) {
        try {
          const docRes = await axios.post(
            "http://localhost:8080/api/documents/loan",
            { id: app.id }
          );

          if (Array.isArray(docRes.data)) {
            const docsWithAppId = docRes.data.map((doc) => ({
              ...doc,
              applicationId: app.id,
            }));

            allDocs = [...allDocs, ...docsWithAppId];
          }
        } catch (err) {
          console.error("Error fetching docs for loan:", app.id);
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
    if (!doc?.fileName) return null;
    return `http://localhost:8080/uploads/${doc.fileName}`;
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
            className="border px-3 py-2 rounded-lg w-full md:w-1/3 focus:ring-2 focus:ring-blue-400 outline-none"
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
                    app.fullName?.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((app) => {
                    const appDocs = documents.filter(
                      (doc) => doc.applicationId === app.id
                    );

                    // ✅ NO DOCUMENT CASE
                    if (appDocs.length === 0) {
                      return (
                        <tr key={app.id} className="border-t hover:bg-gray-50">
                          <td className="p-3">{app.fullName || "Unknown"}</td>
                          <td className="p-3 text-gray-400">Not Available</td>
                          <td className="p-3 text-gray-400">Not Available</td>
                          <td className="p-3 text-gray-400">N/A</td>
                          <td className="p-3">
                            <button
                              onClick={() =>
                                navigate(`/bank/review/${app.id}`)
                              }
                              className="bg-blue-600 text-white px-3 py-1 rounded"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    }

                    // ✅ WITH DOCUMENTS
                    return appDocs.map((doc) => (
                      <tr key={doc.id} className="border-t hover:bg-gray-50">
                        <td className="p-3">{app.fullName || "Unknown"}</td>

                        <td className="p-3">
                          {doc.documentType || "Not Available"}
                        </td>

                        <td className="p-3">
                          {doc.fileName ? (
                            <span
                              onClick={() => setPreviewDoc(doc)}
                              className="text-blue-600 cursor-pointer"
                            >
                              📄 {doc.fileName}
                            </span>
                          ) : (
                            <span className="text-gray-400">
                              Not Available
                            </span>
                          )}
                        </td>

                        <td className="p-3">
                          <span className={getStatusStyle(doc.status)}>
                            {formatStatus(doc.status)}
                          </span>
                        </td>

                        <td className="p-3">
                          <button
                            onClick={() =>
                              navigate(`/bank/review/${app.id}`)
                            }
                            className="bg-blue-600 text-white px-3 py-1 rounded"
                          >
                            View
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
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
            <div className="bg-white p-4 rounded w-full max-w-3xl">

              <iframe
                src={getPreviewUrl(previewDoc)}
                className="w-full h-[500px]"
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