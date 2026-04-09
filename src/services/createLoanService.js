// src/services/createLoanService.js

// 🔹 Fake DB (shared structure with loanService later)
let loanCases = [];

// 🔹 simulate API delay
const delay = (ms) => new Promise((res) => setTimeout(res, ms));


// ==============================
// ✅ CREATE LOAN CASE (MULTI-STEP)
// ==============================
export const createLoanCase = async (data) => {
  await delay(300);

  const newCase = {
    id: Date.now(),
    caseNumber: `AUTO-${new Date().getFullYear()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`,
    status: "PENDING",
    createdAt: new Date().toISOString(),

    // full form data
    ...data,
  };

  loanCases.push(newCase);

  return newCase;
};


// ==============================
// ✅ GET ALL CASES
// ==============================
export const getAllLoanCases = async () => {
  await delay(300);
  return [...loanCases];
};


// ==============================
// ✅ GET SINGLE CASE
// ==============================
export const getLoanCaseById = async (id) => {
  await delay(200);
  return loanCases.find((c) => c.id === Number(id));
};


// ==============================
// ✅ UPDATE CASE (FUTURE)
// ==============================
export const updateLoanCase = async (id, updatedData) => {
  await delay(200);

  loanCases = loanCases.map((c) =>
    c.id === id ? { ...c, ...updatedData } : c
  );

  return true;
};