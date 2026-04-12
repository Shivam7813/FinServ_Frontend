-- Fix: Data truncated for column 'status' at row 1
--
-- Hibernate ddl-auto=update often leaves MySQL ENUM columns unchanged when you add
-- new Java enum constants. New values (ASSIGNED_TO_BANK, REJECTED_BY_ADMIN, etc.)
-- then fail with "Data truncated".
--
-- Run this ONCE against your Caryanam_Finserv database (e.g. MySQL Workbench / CLI):

USE Caryanam_Finserv;

ALTER TABLE loan_application
    MODIFY COLUMN status VARCHAR(64) NOT NULL;

-- If NOT NULL fails because some rows have NULL status, run first:
-- UPDATE loan_application SET status = 'PENDING' WHERE status IS NULL OR TRIM(status) = '';
-- then re-run the ALTER above.
