// User loan + profile helpers (backend: Caryanam_Finserv LoanController)

import API from "../api/api";

/**
 * Load userId + fullName from GET /api/users by logged-in email.
 * Persists onto the stored `user` object for loan create + search.
 */
export async function ensureUserProfile() {
  const raw = localStorage.getItem("user");
  if (!raw) return null;

  let user;
  try {
    user = JSON.parse(raw);
  } catch {
    return null;
  }

  const email = user?.email?.toLowerCase();
  if (!email) return user;

  if (user.userId && user.fullName) return user;

  const res = await API.get("/users");
  const list = res.data || [];
  const match = list.find((u) => u.email?.toLowerCase() === email);

  if (match) {
    user = {
      ...user,
      userId: match.userId,
      fullName: match.fullName,
      name: match.fullName,
    };
    localStorage.setItem("user", JSON.stringify(user));
  }

  return user;
}

/**
 * Loans for this user (backend search by applicant full name).
 */
export async function fetchMyLoansFromApi() {
  const user = await ensureUserProfile();
  const name = user?.fullName?.trim();
  if (!name) return [];

  const res = await API.post("/loans/search", {
    caseNumber: null,
    name,
  });

  const rows = res.data || [];
  return rows.map(mapDashboardRow);
}

function mapDashboardRow(raw) {
  const status = raw.status != null ? String(raw.status) : "PENDING";
  const amount = raw.amount ?? raw.loanAmount ?? 0;
  const date = raw.createdDate ?? raw.submittedAt ?? "";

  return {
    id: raw.caseNumber || raw.id,
    caseNumber: raw.caseNumber,
    fullName: raw.customerName || raw.fullName || "",
    loanType: raw.vehicle || raw.loanType || "Vehicle loan",
    loanAmount: amount,
    status,
    submittedAt: typeof date === "string" ? date.split("T")[0] : date,
    bank: raw.bank || "",
  };
}

/**
 * POST /api/loans/create — LoanRequestDTO
 */
export async function createLoanViaApi({
  loanType,
  loanAmount,
  downPayment,
  tenure,
  userId,
  bankId,
}) {
  const res = await API.post("/loans/create", {
    loanType,
    loanAmount,
    downPayment,
    tenure,
    userId,
    bankId,
  });
  return res.data;
}

export async function fetchBanks() {
  const res = await API.get("/banks");
  return res.data || [];
}
