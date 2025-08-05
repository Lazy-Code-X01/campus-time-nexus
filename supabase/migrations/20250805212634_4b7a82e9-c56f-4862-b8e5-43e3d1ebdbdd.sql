-- Ensure lecturers table has the correct schema for the application
-- Remove user_id constraint if it exists and ensure name/email fields are present

-- First, let's make sure we have the name and email columns (they should exist)
ALTER TABLE public.lecturers 
  ALTER COLUMN name SET NOT NULL,
  ALTER COLUMN email SET NOT NULL;

-- Add unique constraint on email to prevent duplicates
ALTER TABLE public.lecturers 
  ADD CONSTRAINT lecturers_email_unique UNIQUE (email);

-- Ensure we have proper indexes for performance
CREATE INDEX IF NOT EXISTS idx_lecturers_department_id ON public.lecturers(department_id);
CREATE INDEX IF NOT EXISTS idx_lecturers_email ON public.lecturers(email);