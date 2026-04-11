// src/services/reportService.js

// 🔹 Fake data (moved from page)
const approvalData = [
  { month: "Aug", approved: 45, rejected: 12 },
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

// simulate delay
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// ✅ GET REPORT DATA
export const getReportsData = async () => {
  await delay(300);

  return {
    approvalData,
    disbursementData,
    bankData,
    tatData,
  };
};