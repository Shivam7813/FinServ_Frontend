// src/services/userApplicationService.js

import {
  getApplications,
  updateApplicationStatus,
} from "./applicationService";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));


// ==============================
// ✅ GET USER APPLICATIONS
// ==============================
export const getUserApplications = async (userName) => {
  await delay(200);

  const apps = await getApplications();

  return (apps || []).filter(
    (app) => app.fullName === userName
  );
};


// ==============================
// ✅ GET USER STATS
// ==============================
export const getUserStats = async (userName) => {
  await delay(200);

  const apps = await getUserApplications(userName);

  return {
    total: apps.length,
    underReview: apps.filter((a) => a.status === "UNDER_REVIEW").length,
    approved: apps.filter((a) => a.status === "APPROVED").length,
    rejected: apps.filter((a) => a.status === "REJECTED").length,
  };
};


// ==============================
// ✅ APPLY LOAN
// ==============================
export const applyLoan = async (data) => {
  await delay(200);

  const apps = await getApplications();

  const newApp = {
    id: Date.now(),
    fullName: data.fullName,
    loanType: data.carType
      ? `${data.carType} Car Loan`
      : "Car Loan",
    loanAmount: Number(data.loanAmount) || 0,
    status: "PENDING",
    submittedAt: new Date().toISOString().split("T")[0],
    ...data,
  };

  const updatedApps = [...(apps || []), newApp];

  localStorage.setItem(
    "applications_data",
    JSON.stringify(updatedApps)
  );

  return newApp;
};


// ==============================
// ✅ UPDATE STATUS
// ==============================
export const updateUserApplicationStatus = async (id, status) => {
  await delay(200);
  return updateApplicationStatus(id, status);
};