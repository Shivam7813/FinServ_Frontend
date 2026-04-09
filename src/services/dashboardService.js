// src/services/dashboardService.js

// 🔹 Fake data (for now)
let dashboardData = [
  { month: "Jan", approved: 30, rejected: 10 },
  { month: "Feb", approved: 45, rejected: 15 },
  { month: "Mar", approved: 60, rejected: 20 },
  { month: "Apr", approved: 50, rejected: 12 },
];

// simulate API delay
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// ✅ Get dashboard stats (derived)
export const getDashboardStats = async () => {
  await delay(400);

  const totalApproved = dashboardData.reduce(
    (sum, item) => sum + item.approved,
    0
  );

  const totalRejected = dashboardData.reduce(
    (sum, item) => sum + item.rejected,
    0
  );

  const total = totalApproved + totalRejected;

  return {
    total,
    approved: totalApproved,
    rejected: totalRejected,
    pending: Math.floor(total * 0.2), 
  };
};

// ✅ Get chart data
export const getChartData = async () => {
  await delay(300);
  return dashboardData;
};