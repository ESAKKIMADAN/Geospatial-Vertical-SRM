-- ========================================================
-- SRMIST GEOSPATIAL COMPUTING RESEARCH VERTICAL
-- SUPABASE POSTGRESQL DATABASE SCHEMA & RLS POLICIES
-- Project: https://supabase.com/dashboard/project/yugdbcbdbiyqodhcioag
-- ========================================================

-- 1. REGISTRATIONS TABLE
CREATE TABLE IF NOT EXISTS public.registrations (
    id TEXT PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "eventTitle" TEXT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    "registerNumber" TEXT NOT NULL,
    department TEXT,
    year TEXT,
    phone TEXT,
    "registeredAt" TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Allow public to register (Insert)
CREATE POLICY "Allow public insert registrations" 
ON public.registrations 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- Allow public & admin to read registrations
CREATE POLICY "Allow public read registrations" 
ON public.registrations 
FOR SELECT 
TO anon, authenticated 
USING (true);

-- Allow admin delete registrations
CREATE POLICY "Allow delete registrations" 
ON public.registrations 
FOR DELETE 
TO anon, authenticated 
USING (true);


-- 2. MESSAGES TABLE (Contact / Inquiries)
CREATE TABLE IF NOT EXISTS public.messages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    comment TEXT NOT NULL,
    timestamp TEXT,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert messages" 
ON public.messages 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

CREATE POLICY "Allow read messages" 
ON public.messages 
FOR SELECT 
TO anon, authenticated 
USING (true);

CREATE POLICY "Allow update messages" 
ON public.messages 
FOR UPDATE 
TO anon, authenticated 
USING (true);

CREATE POLICY "Allow delete messages" 
ON public.messages 
FOR DELETE 
TO anon, authenticated 
USING (true);


-- 3. EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    date TEXT,
    time TEXT,
    venue TEXT,
    description TEXT,
    image TEXT,
    "isUpcoming" BOOLEAN DEFAULT true,
    "registrationType" TEXT DEFAULT 'form',
    "registrationLink" TEXT,
    "registrationOpen" BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read events" 
ON public.events 
FOR SELECT 
TO anon, authenticated 
USING (true);

CREATE POLICY "Allow manage events" 
ON public.events 
FOR ALL 
TO anon, authenticated 
USING (true);


-- 4. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    domain TEXT,
    "facultyMentor" TEXT,
    "studentTeam" TEXT,
    status TEXT DEFAULT 'Ongoing',
    description TEXT,
    overview TEXT,
    "problemStatement" TEXT,
    objectives TEXT,
    methodology TEXT,
    technologies TEXT,
    "expectedOutcome" TEXT,
    image TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read projects" 
ON public.projects 
FOR SELECT 
TO anon, authenticated 
USING (true);

CREATE POLICY "Allow manage projects" 
ON public.projects 
FOR ALL 
TO anon, authenticated 
USING (true);


-- 5. FACULTY TABLE
CREATE TABLE IF NOT EXISTS public.faculty (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    designation TEXT,
    department TEXT,
    email TEXT,
    domain TEXT,
    bio TEXT,
    office TEXT,
    image TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read faculty" 
ON public.faculty 
FOR SELECT 
TO anon, authenticated 
USING (true);

CREATE POLICY "Allow manage faculty" 
ON public.faculty 
FOR ALL 
TO anon, authenticated 
USING (true);


-- 6. SITE SETTINGS / PORTFOLIO CLUB INFO TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    name TEXT,
    institution TEXT,
    tagline TEXT,
    "heroDescription" TEXT,
    "aboutDescription" TEXT,
    vision TEXT,
    mission TEXT,
    stats JSONB,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read site_settings" 
ON public.site_settings 
FOR SELECT 
TO anon, authenticated 
USING (true);

CREATE POLICY "Allow manage site_settings" 
ON public.site_settings 
FOR ALL 
TO anon, authenticated 
USING (true);


-- ========================================================
-- SEED INITIAL DATA (PORTFOLIO TO ADMIN)
-- ========================================================

-- Initial Events Seed
INSERT INTO public.events (id, title, date, time, venue, description, image, "isUpcoming", "registrationType", "registrationLink", "registrationOpen")
VALUES
  ('evt-001', 'GeoAI & Smart Mapping Workshop', '20 November 2026', '10:00 AM – 1:00 PM', 'SRM Institute of Science and Technology', 'Join us for an immersive workshop exploring the intersection of Artificial Intelligence and geospatial mapping. Learn how to apply machine learning to spatial datasets.', 'https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', true, 'form', '', true),
  ('evt-002', 'Introduction to Remote Sensing', '05 December 2026', '2:00 PM – 4:00 PM', 'Geospatial Innovation Lab', 'A beginner-friendly session on understanding Earth observation technologies, satellite imagery analysis, and their practical applications.', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', true, 'form', '', true),
  ('evt-003', 'Campus Mapathon 2026', '18 December 2026', '9:00 AM – 4:00 PM', 'SRMIST Campus', 'An exciting collaborative event where students will work together to digitize and create detailed maps of the university campus using modern GIS tools.', 'https://images.unsplash.com/photo-1526778548025-fa2fbfb25c0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', true, 'link', 'https://forms.google.com', true),
  ('evt-p001', 'GIS Workshop', 'September 2026', '10:00 AM - 1:00 PM', 'Tech Park Lab', 'An introductory workshop on Geographic Information Systems and digital mapping techniques.', 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', false, 'form', '', false)
ON CONFLICT (id) DO NOTHING;

-- Initial Registrations Seed
INSERT INTO public.registrations (id, "eventId", "eventTitle", name, email, "registerNumber", department, year, phone, "registeredAt")
VALUES 
  ('REG-GEO-1001', 'evt-001', 'GeoAI & Smart Mapping Workshop', 'Kavya Sundaram', 'ks8214@srmist.edu.in', 'RA2311003010145', 'Computer Science & Engineering', '3rd Year', '+91 98765 43210', '10 Oct 2026, 02:40 PM'),
  ('REG-GEO-1002', 'evt-001', 'GeoAI & Smart Mapping Workshop', 'Aditya Nair', 'an3921@srmist.edu.in', 'RA2311003010212', 'Data Science & GenAI', '2nd Year', '+91 91234 56780', '10 Oct 2026, 05:15 PM'),
  ('REG-GEO-1003', 'evt-002', 'Introduction to Remote Sensing', 'Sneha Reddy', 'sr9042@srmist.edu.in', 'RA2211004020088', 'Civil Engineering & GIS', '4th Year', '+91 99887 76655', '11 Oct 2026, 08:30 AM')
ON CONFLICT (id) DO NOTHING;

-- Initial Site Settings Seed
INSERT INTO public.site_settings (id, name, institution, tagline, "heroDescription", "aboutDescription", vision, mission, stats)
VALUES (
  'default',
  'Geospatial Computing Research Vertical',
  'SRM Institute of Science and Technology',
  'Explore • Analyze • Innovate',
  'The Geospatial Computing Research Vertical brings together students and researchers passionate about Geographic Information Systems, Remote Sensing, GeoAI, mapping, and spatial data science to explore real-world challenges through technology and innovation.',
  'The Geospatial Computing Research Vertical is a research-driven academic initiative focused on exploring technologies that help us understand and analyze the world through location-based information. The vertical encourages students and scholars to learn, collaborate, experiment and develop innovative solutions using modern geospatial technologies.',
  'To foster a leading research vertical of scholars and students who leverage geospatial computing technologies to understand the world, solve complex real-world challenges, and create meaningful technological breakthroughs.',
  'To create an active research and learning environment where members develop advanced geospatial computing skills, collaborate on interdisciplinary research projects, participate in technical activities, and apply spatial data science to real-world challenges.',
  '[{"label":"Student Members","value":"25+"},{"label":"Activities","value":"10+"},{"label":"Current Projects","value":"6"},{"label":"Workshops & Events","value":"8+"}]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

