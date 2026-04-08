// src/pages/admin/AdminDashboard.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ ADD THIS
import AdminLayout from "../../layouts/AdminLayout";
import StatCard from "../../components/StatCard";
import LoanTable from "../../components/LoanTable";

export default function AdminDashboard() {

  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // ✅ ADD THIS

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
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
        {getGreeting()}, {user?.name || "User"}
      </h2>

      <p className="text-gray-500 mb-6">
        Here's what's happening with your loan cases today.
      </p>

      {/* ✅ UPDATED BUTTON */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate("/admin/create-loan")} // ✅ REDIRECT
          className="bg-teal-500 text-white px-4 py-2 rounded-lg shadow hover:bg-teal-600 transition"
        >
          + Create New Loan Case
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Active Loan Cases" 
          value="124" 
          change="+12%" 
          color="green" 
        />
        <StatCard 
          title="Pending Documents" 
          value="38" 
          change="-5%" 
          color="yellow" 
        />
        <StatCard 
          title="Approved Today" 
          value="8" 
          change="+25%" 
          color="green" 
        />
        <StatCard 
          title="Disbursed This Month" 
          value="₹2.4Cr" 
          change="+18%" 
          color="green" 
        />
      </div>

      {/* Table */}
      <LoanTable />

    </AdminLayout>
  );
}