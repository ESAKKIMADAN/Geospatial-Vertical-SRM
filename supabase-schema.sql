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

-- Insert initial sample registrations if table is fresh
INSERT INTO public.registrations (id, "eventId", "eventTitle", name, email, "registerNumber", department, year, phone, "registeredAt")
VALUES 
  ('REG-GEO-1001', 'evt-001', 'GeoAI & Smart Mapping Workshop', 'Kavya Sundaram', 'ks8214@srmist.edu.in', 'RA2311003010145', 'Computer Science & Engineering', '3rd Year', '+91 98765 43210', '10 Oct 2026, 02:40 PM'),
  ('REG-GEO-1002', 'evt-001', 'GeoAI & Smart Mapping Workshop', 'Aditya Nair', 'an3921@srmist.edu.in', 'RA2311003010212', 'Data Science & GenAI', '2nd Year', '+91 91234 56780', '10 Oct 2026, 05:15 PM'),
  ('REG-GEO-1003', 'evt-002', 'Introduction to Remote Sensing', 'Sneha Reddy', 'sr9042@srmist.edu.in', 'RA2211004020088', 'Civil Engineering & GIS', '4th Year', '+91 99887 76655', '11 Oct 2026, 08:30 AM')
ON CONFLICT (id) DO NOTHING;
