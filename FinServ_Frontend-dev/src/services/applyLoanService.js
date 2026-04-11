// src/services/applyLoanService.js — POST /api/loans/create

import { createLoanViaApi, ensureUserProfile } from "./userLoanApi";

function normalizeTenure(months) {
  let t = Number(months);
  if (!Number.isFinite(t) || t < 6) t = 60;
  t = Math.max(6, Math.min(360, t));
  if (t % 6 !== 0) {
    t = Math.round(t / 6) * 6;
    if (t < 6) t = 6;
    if (t > 360) t = 360;
  }
  return t;
}

/**
 * @param {object} formData — ApplyLoan form fields
 * @param {number} bankId — selected bank (required by backend)
 */
export const applyLoan = async (formData, bankId) => {
  const profile = await ensureUserProfile();
  if (!profile?.userId) {
    throw new Error(
      "Your profile could not be loaded. Log out and log in again."
    );
  }
  if (bankId == null || Number(bankId) <= 0) {
    throw new Error("Please select a bank.");
  }

  const loanAmount = Number(formData.loanAmount);
  const downPayment = Number(formData.downPayment);

  if (!Number.isFinite(loanAmount) || loanAmount <= 0) {
    throw new Error("Enter a valid loan amount.");
  }
  if (!Number.isFinite(downPayment) || downPayment <= 0) {
    throw new Error("Down payment must be greater than zero.");
  }
  if (downPayment > loanAmount) {
    throw new Error("Down payment cannot be greater than loan amount.");
  }

  const loanType =
    formData.carType === "Used" ? "AUTO_USED_CAR" : "AUTO_NEW_CAR";

  const tenure = normalizeTenure(formData.tenure);

  return createLoanViaApi({
    loanType,
    loanAmount,
    downPayment,
    tenure,
    userId: profile.userId,
    bankId: Number(bankId),
  });
};
