-- =====================================================
-- TUTOPLUS DATABASE SCHEMA
-- Run this in your Supabase SQL Editor
-- Dashboard → SQL Editor → New Query
-- =====================================================

-- 1. Create profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create inscriptions table (registration requests)
CREATE TABLE IF NOT EXISTS inscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_name TEXT NOT NULL,
  student_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  service TEXT NOT NULL,
  address TEXT NOT NULL,
  mental_health TEXT,
  specifications TEXT,
  status TEXT DEFAULT 'en_attente' CHECK (status IN ('en_attente', 'approuve', 'refuse')),
  contact_status TEXT DEFAULT 'non_contacte' CHECK (contact_status IN ('non_contacte', 'contacte', 'en_discussion', 'finalise')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE inscriptions ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 5. Create RLS policies for inscriptions

-- Users can view their own inscriptions
CREATE POLICY "Users can view own inscriptions" ON inscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own inscriptions
CREATE POLICY "Users can insert own inscriptions" ON inscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can view all inscriptions
CREATE POLICY "Admins can view all inscriptions" ON inscriptions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins can update inscriptions
CREATE POLICY "Admins can update inscriptions" ON inscriptions
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 6. Create function to handle new user signup (creates profile)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Create trigger to auto-create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- AFTER RUNNING THE ABOVE, CREATE THE ADMIN ACCOUNT:
-- 
-- 1. Go to Authentication → Users → Add User
-- 2. Email: tutoplus2025@gmail.com
-- 3. Password: Tuto+2007
-- 4. Click "Create User"
-- 
-- THEN RUN THIS SQL TO SET ADMIN ROLE:
-- =====================================================

-- UPDATE profiles 
-- SET role = 'admin' 
-- WHERE email = 'tutoplus2025@gmail.com';
