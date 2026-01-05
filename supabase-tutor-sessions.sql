-- =====================================================
-- TUTOPLUS TUTOR-STUDENT SESSION SYSTEM
-- Run this in your Supabase SQL Editor
-- Dashboard → SQL Editor → New Query
-- =====================================================

-- 1. Update profiles role constraint to include 'tutor'
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('user', 'admin', 'tutor'));

-- 2. Create tutor_assignments table (links tutors to students)
CREATE TABLE IF NOT EXISTS tutor_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tutor_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tutor_id, student_id)
);

-- 3. Create tutoring_sessions table (calendar appointments)
CREATE TABLE IF NOT EXISTS tutoring_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tutor_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  session_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'facture_envoyee', 'recu_envoye', 'cancelled')),
  is_paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable RLS
ALTER TABLE tutor_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutoring_sessions ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for tutor_assignments
-- Admins can do everything
CREATE POLICY "Admins full access to assignments" ON tutor_assignments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Tutors can view their own assignments
CREATE POLICY "Tutors view own assignments" ON tutor_assignments
  FOR SELECT USING (tutor_id = auth.uid());

-- Students can view their own assignments
CREATE POLICY "Students view own assignments" ON tutor_assignments
  FOR SELECT USING (student_id = auth.uid());

-- 6. RLS Policies for tutoring_sessions
-- Admins can do everything
CREATE POLICY "Admins full access to sessions" ON tutoring_sessions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Tutors can manage sessions for their assigned students
CREATE POLICY "Tutors manage own sessions" ON tutoring_sessions
  FOR ALL USING (tutor_id = auth.uid());

-- Students can view their own sessions
CREATE POLICY "Students view own sessions" ON tutoring_sessions
  FOR SELECT USING (student_id = auth.uid());

-- =====================================================
-- INSTRUCTIONS:
-- 1. Copy all the SQL above
-- 2. Go to Supabase Dashboard → SQL Editor
-- 3. Create a new query and paste
-- 4. Click "Run"
-- =====================================================
