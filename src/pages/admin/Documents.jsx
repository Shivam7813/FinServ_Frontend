import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";

// ❌ REMOVE MOCK
// import { applications, documents } from "../../mock/mockData";

// ✅ ADD SERVICE
import {
  getApplications,
  getDocuments,
} from "../../services/documentService";

export default function Documents() {
  const [applications, setApplications] = useState([]);
  const [documents, setDocuments] = useState([]);

  // ✅ FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      const apps = await getApplications();
      const docs = await getDocuments();

      setApplications(apps);
      setDocuments(docs);
    };

    fetchData();
  }, []);

  // ✅ SAME LOGIC (UNCHANGED)
  const getDocsByApplication = (appId) => {
    return documents.filter((doc) => doc.applicationId === appId);
  };

  const statusStyles = {
    VERIFIED: "bg-green-100 text-green-600",
    PENDING: "bg-yellow-100 text-yellow-600",
    REJECTED: "bg-red-100 text-red-600",
  };

  return (
    <AdminLayout>
      <div className="p-6">

        <h1 className="text-2xl font-semibold text-gray-800">
          Documents
        </h1>
        <p className="text-gray-500 mt-1">
          Upload and verify loan documents.
        </p>

        <div className="flex justify-between items-center mt-6">
          <div className="flex gap-3 w-full max-w-md">
            <input
              type="text"
              placeholder="Search documents..."
              className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-3 py-2 border rounded-lg hover:bg-gray-100">
              ⚙️
            </button>
          </div>

          <button className="flex items-center gap-2 border px-4 py-2 rounded-lg text-sm hover:bg-gray-100">
            ⬇️ Bulk Download
          </button>
        </div>

        <div className="mt-6 space-y-6">
          {applications.map((app) => {
            const appDocs = getDocsByApplication(app.id);

            return (
              <div
                key={app.id}
                className="bg-white p-5 rounded-2xl shadow"
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-blue-600 font-semibold">
                      CASE-{app.id}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {app.fullName}
                    </p>
                  </div>

                  <p className="text-sm text-gray-400">
                    {appDocs.length} documents
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {appDocs.length > 0 ? (
                    appDocs.map((doc) => (
                      <div
                        key={doc.id}
                        className="border rounded-lg p-3 hover:shadow-sm transition"
                      >
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-xs text-gray-400">
                          {app.submittedAt}
                        </p>

                        <span
                          className={`mt-2 inline-block px-2 py-1 text-xs rounded-full ${
                            statusStyles[doc.status] ||
                            "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {doc.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">
                      No documents uploaded
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}