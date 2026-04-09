// src/services/loanService.js

// 🔹 Fake database (acts like backend)
let loans = [
  {
    id: 1,
    fullName: "Rahul Sharma",
    loanType: "Car Loan",
    loanAmount: 500000,
    status: "PENDING",
    submittedAt: "2026-04-01",
  },
  {
    id: 2,
    fullName: "Priya Verma",
    loanType: "Home Loan",
    loanAmount: 2500000,
    status: "APPROVED",
    submittedAt: "2026-04-02",
  },
];

// 🔹 Simulate API delay
const delay = (ms) => new Promise((res) => setTimeout(res, ms));


// ==============================
// ✅ GET ALL LOANS
// ==============================
export const getLoans = async () => {
  await delay(300);
  return [...loans]; // return copy
};


// ==============================
// ✅ GET SINGLE LOAN (DETAIL PAGE)
// ==============================
export const getLoanById = async (id) => {
  await delay(200);
  return loans.find((loan) => loan.id === Number(id));
};


// ==============================
// ✅ CREATE NEW LOAN
// ==============================
export const createLoan = async (loanData) => {
  await delay(300);

  const newLoan = {
    id: Date.now(), // unique id
    status: "PENDING",
    submittedAt: new Date().toISOString().split("T")[0],
    ...loanData,
  };

  loans.unshift(newLoan); // add on top
  return newLoan;
};


// ==============================
// ✅ UPDATE LOAN STATUS
// ==============================
export const updateLoanStatus = async (id, status) => {
  await delay(200);

  loans = loans.map((loan) =>
    loan.id === id ? { ...loan, status } : loan
  );

  return true;
};


// ==============================
// ✅ DELETE LOAN (optional future)
// ==============================
export const deleteLoan = async (id) => {
  await delay(200);

  loans = loans.filter((loan) => loan.id !== id);
  return true;
};