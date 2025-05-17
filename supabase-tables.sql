
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT NOT NULL,
  avatar_url TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  resume_url TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  website_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  proficiency INTEGER NOT NULL,
  order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  live_url TEXT,
  github_url TEXT,
  technologies TEXT[] NOT NULL,
  categories TEXT[] NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT false,
  order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create experiences table
CREATE TABLE IF NOT EXISTS experiences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  description TEXT NOT NULL,
  current BOOLEAN NOT NULL DEFAULT false,
  company_logo TEXT,
  order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  company TEXT NOT NULL,
  content TEXT NOT NULL,
  avatar_url TEXT,
  order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create site_visits table for analytics
CREATE TABLE IF NOT EXISTS site_visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage buckets for file uploads
-- Note: This needs to be done from the Supabase Dashboard
-- Create buckets for: avatars, project_images, resumes, testimonial_avatars, etc.

-- Insert sample profile data
INSERT INTO profiles (full_name, title, bio)
VALUES ('John Doe', 'Full Stack Developer', 'Experienced developer with a passion for creating beautiful and functional web applications.');

-- Create RLS policies (Run these in Supabase SQL Editor)
-- Example RLS policy for public read access to profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." 
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Profiles can only be updated by authenticated users." 
  ON profiles FOR UPDATE USING (auth.role() = 'authenticated');

-- Enable RLS on all tables
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_visits ENABLE ROW LEVEL SECURITY;

-- Create public read policies for all content tables
CREATE POLICY "Services are viewable by everyone."
  ON services FOR SELECT USING (true);
  
CREATE POLICY "Skills are viewable by everyone."
  ON skills FOR SELECT USING (true);
  
CREATE POLICY "Projects are viewable by everyone."
  ON projects FOR SELECT USING (true);
  
CREATE POLICY "Experiences are viewable by everyone."
  ON experiences FOR SELECT USING (true);
  
CREATE POLICY "Testimonials are viewable by everyone."
  ON testimonials FOR SELECT USING (true);
  
CREATE POLICY "Site settings are viewable by everyone."
  ON site_settings FOR SELECT USING (true);

-- Create authenticated user policies for admin operations
CREATE POLICY "Services can be modified by authenticated users."
  ON services FOR ALL USING (auth.role() = 'authenticated');
  
CREATE POLICY "Skills can be modified by authenticated users."
  ON skills FOR ALL USING (auth.role() = 'authenticated');
  
CREATE POLICY "Projects can be modified by authenticated users."
  ON projects FOR ALL USING (auth.role() = 'authenticated');
  
CREATE POLICY "Experiences can be modified by authenticated users."
  ON experiences FOR ALL USING (auth.role() = 'authenticated');
  
CREATE POLICY "Testimonials can be modified by authenticated users."
  ON testimonials FOR ALL USING (auth.role() = 'authenticated');
  
CREATE POLICY "Messages can be read by authenticated users."
  ON messages FOR SELECT USING (auth.role() = 'authenticated');
  
CREATE POLICY "Messages can be created by anyone."
  ON messages FOR INSERT WITH CHECK (true);
  
CREATE POLICY "Messages can be updated by authenticated users."
  ON messages FOR UPDATE USING (auth.role() = 'authenticated');
  
CREATE POLICY "Messages can be deleted by authenticated users."
  ON messages FOR DELETE USING (auth.role() = 'authenticated');
  
CREATE POLICY "Site settings can be modified by authenticated users."
  ON site_settings FOR ALL USING (auth.role() = 'authenticated');
  
CREATE POLICY "Site visits can be recorded by anyone."
  ON site_visits FOR INSERT WITH CHECK (true);
  
CREATE POLICY "Site visits can be viewed by authenticated users."
  ON site_visits FOR SELECT USING (auth.role() = 'authenticated');
