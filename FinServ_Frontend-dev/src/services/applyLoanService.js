// src/services/applyLoanService.js

import { getApplications } from "./applicationService";

// 🔹 delay
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// ==============================
// ✅ APPLY LOAN
// ==============================
export const applyLoan = async (formData) => {
  await delay(200);

  const existingApps = await getApplications();

  const newApplication = {
    id: Date.now(),

    // 🔥 IMPORTANT FIELDS
    fullName: formData.fullName,
    loanType: formData.carType + " Car Loan",
    loanAmount: Number(formData.loanAmount),

    // 🔥 DEFAULTS
    status: "PENDING",
    submittedAt: new Date().toISOString().split("T")[0],
  };

  const updated = [...existingApps, newApplication];

  // 🔥 SAVE TO SAME STORAGE (shared with dashboard)
  localStorage.setItem("applications_data", JSON.stringify(updated));

  return newApplication;
};