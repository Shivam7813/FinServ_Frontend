package com.finserv.enums;

public enum DocumentStatus {

    PENDING,            // Uploaded, waiting for review
    IN_REVIEW,          // Under verification

    VERIFIED,           // Verified successfully
    REJECTED,           // Rejected due to issues

    APPROVED,           // Final approval
    DISAPPROVED,        // Final rejection

    NEEDS_CORRECTION,   // User must re-upload
    RESUBMITTED,        // User uploaded again

    ON_HOLD,            // Temporarily paused
    ESCALATED,          // Sent to higher authority

    EXPIRED,            // Document expired
    CANCELLED           // Cancelled by system/user
}
