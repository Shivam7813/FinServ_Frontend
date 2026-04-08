// src/pages/user/MyApplications.jsx

import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    // 🔥 For now using dummy data (later connect API/localStorage)
    const dummyData = [
      {
        id: "LN001",
        carModel: "Hyundai Creta",
        amount: "₹8,00,000",
        status: "Under Review",
        bank: "HDFC",
      },
      {
        id: "LN002",
        carModel: "Maruti Swift",
        amount: "₹5,00,000",
        status: "Approved",
        bank: "ICICI",
      },
      {
        id: "LN003",
        carModel: "Tata Nexon",
        amount: "₹6,50,000",
        status: "Rejected",
        bank: "SBI",
      },
    ];

    setApplications(dummyData);
  }, []);

  const getStatusColor = (status) => {
    if (status === "Approved") return "text-green-500";
    if (status === "Rejected") return "text-red-500";
    if (status === "Under Review") return "text-yellow-500";
    return "text-gray-500";
  };

  return (
    <AdminLayout>

      <h2 className="text-xl font-semibold mb-4">
        My Loan Applications
      </h2>

      <div className="bg-white p-4 rounded-lg shadow">

        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 border-b">
              <th className="py-2">Loan ID</th>
              <th>Car Model</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Bank</th>
            </tr>
          </thead>

          <tbody>
            {applications.map((app, index) => (
              <tr key={index} className="border-b">
                <td className="py-2">{app.id}</td>
                <td>{app.carModel}</td>
                <td>{app.amount}</td>
                <td className={getStatusColor(app.status)}>
                  {app.status}
                </td>
                <td>{app.bank}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </AdminLayout>
  );
}