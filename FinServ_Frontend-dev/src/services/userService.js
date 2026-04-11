// src/services/userService.js

// ✅ IMPORT FROM MAIN SERVICE
import {
  getApplications,
  updateApplicationStatus,
} from "./applicationService";

// 🔹 delay (UX simulation)
const delay = (ms) => new Promise((res) => setTimeout(res, ms));


// ==============================
// ✅ GET USER APPLICATIONS
// ==============================
export const getUserApplications = async (userName) => {
  await delay(200);

  const apps = await getApplications();

  // 🔥 SAFETY CHECK + FILTER
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

  const total = apps.length;

  const underReview = apps.filter(
    (a) => a.status === "UNDER_REVIEW"
  ).length;

  const approved = apps.filter(
    (a) => a.status === "APPROVED"
  ).length;

  const rejected = apps.filter(
    (a) => a.status === "REJECTED"
  ).length;

  return {
    total,
    underReview,
    approved,
    rejected,
  };
};


// ==============================
// ✅ APPLY NEW LOAN (USER)
// ==============================
export const applyLoan = async (data) => {
  await delay(200);

  const apps = await getApplications();

  const newApp = {
    id: Date.now(),

    // 🔥 REQUIRED FIELDS
    fullName: data.fullName,
    loanType: data.carType
      ? `${data.carType} Car Loan`
      : "Car Loan",

    loanAmount: Number(data.loanAmount) || 0,

    // 🔥 DEFAULTS
    status: "PENDING",
    submittedAt: new Date().toISOString().split("T")[0],

    // 🔥 OPTIONAL EXTRA DATA (future backend)
    ...data,
  };

  const updatedApps = [...(apps || []), newApp];

  // 🔥 SAVE TO STORAGE (SINGLE SOURCE)
  localStorage.setItem(
    "applications_data",
    JSON.stringify(updatedApps)
  );

  return newApp;
};


// ==============================
// ✅ UPDATE USER APPLICATION STATUS
// ==============================
export const updateUserApplicationStatus = async (id, status) => {
  await delay(200);

  // 🔥 DELEGATE TO MAIN SERVICE
  return updateApplicationStatus(id, status);
};