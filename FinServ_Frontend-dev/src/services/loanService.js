import API from "../api/api";

export function mapLoanDashboardRow(row) {
  const status =
    typeof row.status === "string" ? row.status : row.status?.name ?? row.status;
  return {
    caseNumber: row.caseNumber,
    id: row.caseNumber,
    fullName: row.customerName ?? "—",
    loanType: row.vehicle?.trim() ? row.vehicle : "—",
    loanAmount: row.amount ?? 0,
    status,
    submittedAt: row.createdDate ?? "—",
    mobile: row.mobile,
    bank: row.bank,
  };
}

export async function getLoans() {
  const { data } = await API.get("/loans/dashboard");
  const list = Array.isArray(data) ? data : [];
  return list.map(mapLoanDashboardRow);
}

export async function getLoanById(caseNumber) {
  const loans = await getLoans();
  return loans.find((l) => l.caseNumber === caseNumber);
}

export async function createLoan(loanData) {
  const { data } = await API.post("/loans/create", loanData);
  return data;
}

export async function updateLoanStatus(caseNumber, status) {
  const cn = String(caseNumber ?? "").trim();
  if (!cn) {
    throw new Error("Missing case number");
  }

  const body = { caseNumber: cn };
  if (status === "APPROVED") {
    const { data } = await API.put("/loans/approve", body);
    return typeof data === "string" ? data : "Approved";
  }
  if (status === "REJECTED") {
    const { data } = await API.put("/loans/reject", body);
    return typeof data === "string" ? data : "Rejected";
  }
  throw new Error(`Unsupported status transition: ${status}`);
}

export async function deleteLoan() {
  throw new Error("DELETE_LOAN_NOT_SUPPORTED");
}
