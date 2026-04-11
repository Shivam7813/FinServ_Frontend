// src/pages/admin/Reports.jsx

import AdminLayout from "../../layouts/AdminLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const approvalData = [
  { month: "Aug", approved: 45, rejected: 12},
  { month: "Sep", approved: 52, rejected: 8 },
  { month: "Oct", approved: 48, rejected: 14 },
  { month: "Nov", approved: 60, rejected: 10 },
  { month: "Dec", approved: 55, rejected: 9 },
  { month: "Jan", approved: 68, rejected: 7 },
];

const disbursementData = [
  { month: "Aug", value: 2.1 },
  { month: "Sep", value: 2.4 },
  { month: "Oct", value: 2.2 },
  { month: "Nov", value: 2.8 },
  { month: "Dec", value: 2.6 },
  { month: "Jan", value: 3.2 },
];

const bankData = [
  { name: "HDFC", value: 35 },
  { name: "ICICI", value: 25 },
  { name: "SBI", value: 20 },
  { name: "Axis", value: 12 },
  { name: "Others", value: 8 },
];

const tatData = [
  { name: "HDFC", value: 1.2 },
  { name: "ICICI", value: 1.8 },
  { name: "SBI", value: 2.5 },
  { name: "Axis", value: 1.5 },
  { name: "Kotak", value: 1.0 },
];

export default function Reports() {
  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold">MIS Reports</h1>
          <p className="text-gray-500">
            Performance analytics and insights
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Approval vs Rejection */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="font-semibold mb-4">
              Approval vs Rejection Ratio
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={approvalData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="approved" fill="#14b8a6" />
                <Bar dataKey="rejected" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Disbursement */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="font-semibold mb-4">
              Disbursement Volume
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={disbursementData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#1f2937"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bank Distribution */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="font-semibold mb-4">
              Bank-wise Distribution
            </h2>
            <div className="flex items-center justify-center">
              <PieChart width={250} height={250}>
                <Pie
                  data={bankData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={50}
                >
                  {bankData.map((entry, index) => (
                    <Cell key={index} />
                  ))}
                </Pie>
              </PieChart>
            </div>
          </div>

          {/* Turnaround Time */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="font-semibold mb-4">
              Average Turnaround Time
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={tatData} layout="vertical">
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" />
                <Tooltip />
                <Bar dataKey="value" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}