-- Create profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'lecturer', 'student')),
  department_id UUID,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create departments table
CREATE TABLE public.departments (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create lecturers table
CREATE TABLE public.lecturers (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  department_id UUID NOT NULL REFERENCES public.departments(id),
  specialization TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create schedules table
CREATE TABLE public.schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  lecturer_id UUID NOT NULL REFERENCES public.lecturers(id),
  room TEXT NOT NULL,
  department_id UUID NOT NULL REFERENCES public.departments(id),
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration INTERVAL GENERATED ALWAYS AS (end_time - start_time) STORED,
  student_count INTEGER DEFAULT 0,
  capacity INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('lecture', 'lab', 'tutorial', 'exam')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create schedule_conflicts table
CREATE TABLE public.schedule_conflicts (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  schedule_id_1 UUID NOT NULL REFERENCES public.schedules(id) ON DELETE CASCADE,
  schedule_id_2 UUID NOT NULL REFERENCES public.schedules(id) ON DELETE CASCADE,
  conflict_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  resolved BOOLEAN NOT NULL DEFAULT FALSE,
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id),
  CONSTRAINT different_schedules CHECK (schedule_id_1 != schedule_id_2)
);

-- Add foreign key constraint to profiles.department_id
ALTER TABLE public.profiles
ADD CONSTRAINT fk_profiles_department 
FOREIGN KEY (department_id) REFERENCES public.departments(id);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lecturers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_conflicts ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Departments policies (readable by all, manageable by admins)
CREATE POLICY "Everyone can view departments" ON public.departments
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage departments" ON public.departments
  FOR ALL USING (public.get_current_user_role() = 'admin');

-- Lecturers policies
CREATE POLICY "Everyone can view lecturers" ON public.lecturers
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage lecturers" ON public.lecturers
  FOR ALL USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Lecturers can update their own info" ON public.lecturers
  FOR UPDATE USING (user_id = auth.uid());

-- Schedules policies
CREATE POLICY "Everyone can view schedules" ON public.schedules
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage all schedules" ON public.schedules
  FOR ALL USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Lecturers can manage their own schedules" ON public.schedules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.lecturers 
      WHERE lecturers.id = schedules.lecturer_id 
      AND lecturers.user_id = auth.uid()
    )
  );

-- Schedule conflicts policies
CREATE POLICY "Everyone can view conflicts" ON public.schedule_conflicts
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage conflicts" ON public.schedule_conflicts
  FOR ALL USING (public.get_current_user_role() = 'admin');

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, department_id)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', new.email),
    COALESCE(new.raw_user_meta_data->>'role', 'student'),
    CASE 
      WHEN new.raw_user_meta_data->>'department_id' IS NOT NULL 
      THEN (new.raw_user_meta_data->>'department_id')::UUID
      ELSE NULL 
    END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Insert sample departments
INSERT INTO public.departments (id, name, color, description) VALUES
  ('cs-dept', 'Computer Science', 'hsl(217, 91%, 60%)', 'Department of Computer Science'),
  ('math-dept', 'Mathematics', 'hsl(142, 76%, 36%)', 'Department of Mathematics'),
  ('physics-dept', 'Physics', 'hsl(262, 83%, 58%)', 'Department of Physics'),
  ('eng-dept', 'Engineering', 'hsl(25, 95%, 53%)', 'Department of Engineering');

-- Function to detect schedule conflicts
CREATE OR REPLACE FUNCTION public.detect_schedule_conflicts()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert conflicts for overlapping schedules
  INSERT INTO public.schedule_conflicts (schedule_id_1, schedule_id_2, conflict_type, severity)
  SELECT 
    NEW.id,
    s.id,
    CASE 
      WHEN NEW.room = s.room THEN 'room_conflict'
      WHEN NEW.lecturer_id = s.lecturer_id THEN 'lecturer_conflict'
      ELSE 'time_conflict'
    END,
    CASE 
      WHEN NEW.room = s.room AND NEW.lecturer_id = s.lecturer_id THEN 'critical'
      WHEN NEW.room = s.room OR NEW.lecturer_id = s.lecturer_id THEN 'high'
      ELSE 'medium'
    END
  FROM public.schedules s
  WHERE s.id != NEW.id
    AND s.day_of_week = NEW.day_of_week
    AND (
      (NEW.start_time >= s.start_time AND NEW.start_time < s.end_time) OR
      (NEW.end_time > s.start_time AND NEW.end_time <= s.end_time) OR
      (NEW.start_time <= s.start_time AND NEW.end_time >= s.end_time)
    )
    AND (NEW.room = s.room OR NEW.lecturer_id = s.lecturer_id);
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for automatic conflict detection
CREATE TRIGGER trigger_detect_conflicts
  AFTER INSERT OR UPDATE ON public.schedules
  FOR EACH ROW EXECUTE FUNCTION public.detect_schedule_conflicts();