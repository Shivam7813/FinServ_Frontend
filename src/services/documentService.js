// src/services/documentService.js

// 🔹 Fake applications
let applications = [
  {
    id: 1,
    fullName: "Rahul Sharma",
    submittedAt: "2026-04-01",
  },
  {
    id: 2,
    fullName: "Priya Verma",
    submittedAt: "2026-04-02",
  },
];

// 🔹 Fake documents
let documents = [
  {
    id: 1,
    applicationId: 1,
    name: "PAN Card",
    status: "VERIFIED",
  },
  {
    id: 2,
    applicationId: 1,
    name: "Aadhaar Card",
    status: "PENDING",
  },
  {
    id: 3,
    applicationId: 2,
    name: "Bank Statement",
    status: "REJECTED",
  },
];

// simulate delay
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// ✅ GET APPLICATIONS
export const getApplications = async () => {
  await delay(300);
  return [...applications];
};

// ✅ GET DOCUMENTS
export const getDocuments = async () => {
  await delay(300);
  return [...documents];
};