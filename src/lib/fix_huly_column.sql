-- Migration: Standardize Huly ID column in status_incidents
-- This script ensures the huly_id column exists and migrates data from huly_issue_id if it exists.

DO $$ 
BEGIN 
    -- 1. Add huly_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'status_incidents' AND column_name = 'huly_id') THEN
        ALTER TABLE status_incidents ADD COLUMN huly_id TEXT;
    END IF;

    -- 2. Migrate data from huly_issue_id to huly_id if huly_issue_id exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'status_incidents' AND column_name = 'huly_issue_id') THEN
        UPDATE status_incidents SET huly_id = huly_issue_id WHERE huly_id IS NULL AND huly_issue_id IS NOT NULL;
    END IF;
END $$;
