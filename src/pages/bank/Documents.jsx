import AdminLayout from "../../layouts/AdminLayout";
import { useState } from "react";

export default function Documents() {
  const [documents] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      docType: "Aadhar Card",
      file: "aadhar.pdf",
      status: "Verified",
    },
    {
      id: 2,
      name: "Priya Verma",
      docType: "PAN Card",
      file: "pan.pdf",
      status: "Pending",
    },
    {
      id: 3,
      name: "Amit Patel",
      docType: "Bank Statement",
      file: "statement.pdf",
      status: "Verified",
    },
    {
      id: 4,
      name: "Sneha Joshi",
      docType: "Salary Slip",
      file: "salary.pdf",
      status: "Pending",
    },
  ]);

  const getStatusStyle = (status) => {
    return status === "Verified"
      ? "bg-green-100 text-green-700"
      : "bg-yellow-100 text-yellow-700";
  };

  return (
    <AdminLayout>
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-4">Documents</h2>

        {/* Table */}
        <div className="bg-white shadow rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-600 text-sm">
              <tr>
                <th className="p-3">Applicant</th>
                <th className="p-3">Document Type</th>
                <th className="p-3">File</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} className="border-t">
                  <td className="p-3 font-medium">{doc.name}</td>
                  <td className="p-3">{doc.docType}</td>

                  {/* File */}
                  <td className="p-3 text-blue-600 cursor-pointer hover:underline">
                    {doc.file}
                  </td>

                  {/* Status */}
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                        doc.status
                      )}`}
                    >
                      {doc.status}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="p-3 flex gap-2">
                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                      View
                    </button>

                    <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                      Verify
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}