-- Update lecturers table to remove user_id dependency and ensure proper schema
-- Drop any user_id column if it exists and make sure we have the right fields

-- Check if user_id column exists and drop it
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'lecturers' AND column_name = 'user_id') THEN
        ALTER TABLE public.lecturers DROP COLUMN user_id;
    END IF;
END $$;

-- Ensure the table structure matches application expectations
-- The table should have: id, name, email, department_id, specialization, created_at