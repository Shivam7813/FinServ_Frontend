// src/pages/user/UserDashboard.jsx

import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import StatCard from "../../components/StatCard";

export default function UserDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser(storedUser);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <AdminLayout>

      {/* Greeting */}
      <h2 className="text-xl font-semibold mb-1">
        {getGreeting()}, {user?.name || "User"} 👋
      </h2>

      <p className="text-gray-500 mb-6">
        Manage your loan journey in one place.
      </p>

      {/* ACTION BUTTONS */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button className="bg-teal-500 text-white px-4 py-2 rounded-lg shadow hover:bg-teal-600">
          + Apply Loan
        </button>

        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600">
          Upload Documents
        </button>

        <button className="bg-purple-500 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-600">
          Compare Offers
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <StatCard 
          title="Applications" 
          value="3" 
          change="Active" 
          color="blue" 
        />

        <StatCard 
          title="Under Review" 
          value="1" 
          change="Processing" 
          color="yellow" 
        />

        <StatCard 
          title="Approved" 
          value="1" 
          change="Success" 
          color="green" 
        />

        <StatCard 
          title="Rejected" 
          value="1" 
          change="Check reason" 
          color="red" 
        />

      </div>

      {/* LOAN APPLICATION TABLE */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow">

        <h3 className="text-lg font-semibold mb-4">
          My Loan Applications
        </h3>

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

            <tr className="border-b">
              <td className="py-2">LN001</td>
              <td>Hyundai Creta</td>
              <td>₹8,00,000</td>
              <td className="text-yellow-500">Under Review</td>
              <td>HDFC</td>
            </tr>

            <tr className="border-b">
              <td className="py-2">LN002</td>
              <td>Maruti Swift</td>
              <td>₹5,00,000</td>
              <td className="text-green-500">Approved</td>
              <td>ICICI</td>
            </tr>

            <tr>
              <td className="py-2">LN003</td>
              <td>Tata Nexon</td>
              <td>₹6,50,000</td>
              <td className="text-red-500">Rejected</td>
              <td>SBI</td>
            </tr>

          </tbody>
        </table>
      </div>

      {/* TRACK PROGRESS */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow">

        <h3 className="text-lg font-semibold mb-4">
          Application Progress
        </h3>

        <div className="flex items-center justify-between text-sm">

          <div className="text-green-500">✔ Applied</div>
          <div className="text-green-500">✔ Documents Uploaded</div>
          <div className="text-yellow-500">⏳ Under Review</div>
          <div className="text-gray-400">Pending Approval</div>
          <div className="text-gray-400">Disbursed</div>

        </div>

      </div>

    </AdminLayout>
  );
}