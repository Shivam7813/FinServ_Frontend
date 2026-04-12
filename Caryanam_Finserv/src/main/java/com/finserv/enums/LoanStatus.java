package com.finserv.enums;

public enum LoanStatus {
    PENDING,
    UNDER_REVIEW,
    DOCUMENTS_PENDING,
    /** Admin assigned the case to a bank for evaluation */
    ASSIGNED_TO_BANK,
    /** Legacy: same queue as assigned; kept for existing rows */
    SUBMITTED_TO_BANK,
    APPROVED,
    DISBURSED,
    REJECTED,
    /** Admin rejected after review (before / instead of bank decision) */
    REJECTED_BY_ADMIN
}
