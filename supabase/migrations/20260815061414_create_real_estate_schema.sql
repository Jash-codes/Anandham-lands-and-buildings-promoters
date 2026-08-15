/*
# Create real estate schema for Anandham Lands and Building Promoters

## Overview
This migration creates the complete database schema for a plotted-development real estate website.
It supports multiple project layouts/phases, individual plots with availability status, amenities,
proximity landmarks, photo galleries, customer testimonials, and site-visit inquiries.

## New Tables

1. **projects** — Top-level layouts/phases (e.g. "Anandham Greens Phase 1")
   - id, slug, name, location, city, total_acres, phase_acres, plot_count, plot_size_min, plot_size_max,
     starting_price, dtcp_number, rera_number, possession_status, description, hero_image,
     master_plan_image, status, featured, created_at

2. **plots** — Individual plots within a project
   - id, project_id (FK), plot_number, size_sqft, facing_direction, price, status (available/sold/hold),
     row, col (grid position for SVG layout), width, height (SVG rect dimensions), x, y (SVG position)

3. **amenities** — Amenities for a project
   - id, project_id (FK), icon_name (lucide icon), title, description

4. **landmarks** — Proximity landmarks with distance and drive time
   - id, project_id (FK), name, category, distance_km, drive_time_mins

5. **gallery_images** — Photo/video gallery for a project
   - id, project_id (FK), image_url, caption, category (drone/entrance/sample/surrounding)

6. **testimonials** — Customer testimonials
   - id, name, location, photo_url, rating, text, created_at

7. **inquiries** — Site-visit inquiry submissions
   - id, name, phone, preferred_date, project_id (nullable FK), message, status, created_at

## Security
- All tables have RLS enabled.
- This is a no-auth public website (no sign-in screen), so all policies use `TO anon, authenticated`.
- Public data (projects, plots, amenities, landmarks, gallery, testimonials) is readable by all.
- Inquiries can be inserted by anyone (public form) but only readable by authenticated (admin) users.
*/

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  location text NOT NULL,
  city text NOT NULL,
  total_acres numeric(10,2) NOT NULL,
  phase_acres numeric(10,2) NOT NULL,
  plot_count integer NOT NULL,
  plot_size_min integer NOT NULL,
  plot_size_max integer NOT NULL,
  starting_price bigint NOT NULL,
  dtcp_number text,
  rera_number text,
  possession_status text DEFAULT 'Ready to Register',
  description text,
  hero_image text,
  master_plan_image text,
  status text DEFAULT 'Open',
  featured boolean DEFAULT false,
  latitude numeric(10,7),
  longitude numeric(10,7),
  created_at timestamptz DEFAULT now()
);

-- Plots table
CREATE TABLE IF NOT EXISTS plots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  plot_number text NOT NULL,
  size_sqft integer NOT NULL,
  facing_direction text NOT NULL,
  price bigint NOT NULL,
  status text NOT NULL DEFAULT 'available',
  row integer NOT NULL DEFAULT 0,
  col integer NOT NULL DEFAULT 0,
  x numeric(8,2) NOT NULL DEFAULT 0,
  y numeric(8,2) NOT NULL DEFAULT 0,
  width numeric(8,2) NOT NULL DEFAULT 60,
  height numeric(8,2) NOT NULL DEFAULT 40,
  UNIQUE(project_id, plot_number)
);

-- Amenities table
CREATE TABLE IF NOT EXISTS amenities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  icon_name text NOT NULL DEFAULT 'Check',
  title text NOT NULL,
  description text
);

-- Landmarks table
CREATE TABLE IF NOT EXISTS landmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text NOT NULL,
  distance_km numeric(5,1) NOT NULL,
  drive_time_mins integer NOT NULL
);

-- Gallery images table
CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  caption text,
  category text NOT NULL DEFAULT 'drone'
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text,
  photo_url text,
  rating integer NOT NULL DEFAULT 5,
  text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  preferred_date date,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  message text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE plots ENABLE ROW LEVEL SECURITY;
ALTER TABLE amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE landmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Projects: public read
DROP POLICY IF EXISTS "anon_select_projects" ON projects;
CREATE POLICY "anon_select_projects" ON projects FOR SELECT
  TO anon, authenticated USING (true);

-- Plots: public read
DROP POLICY IF EXISTS "anon_select_plots" ON plots;
CREATE POLICY "anon_select_plots" ON plots FOR SELECT
  TO anon, authenticated USING (true);

-- Amenities: public read
DROP POLICY IF EXISTS "anon_select_amenities" ON amenities;
CREATE POLICY "anon_select_amenities" ON amenities FOR SELECT
  TO anon, authenticated USING (true);

-- Landmarks: public read
DROP POLICY IF EXISTS "anon_select_landmarks" ON landmarks;
CREATE POLICY "anon_select_landmarks" ON landmarks FOR SELECT
  TO anon, authenticated USING (true);

-- Gallery: public read
DROP POLICY IF EXISTS "anon_select_gallery" ON gallery_images;
CREATE POLICY "anon_select_gallery" ON gallery_images FOR SELECT
  TO anon, authenticated USING (true);

-- Testimonials: public read
DROP POLICY IF EXISTS "anon_select_testimonials" ON testimonials;
CREATE POLICY "anon_select_testimonials" ON testimonials FOR SELECT
  TO anon, authenticated USING (true);

-- Inquiries: public insert, authenticated read
DROP POLICY IF EXISTS "anon_insert_inquiries" ON inquiries;
CREATE POLICY "anon_insert_inquiries" ON inquiries FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_select_inquiries" ON inquiries;
CREATE POLICY "auth_select_inquiries" ON inquiries FOR SELECT
  TO authenticated USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_plots_project_id ON plots(project_id);
CREATE INDEX IF NOT EXISTS idx_amenities_project_id ON amenities(project_id);
CREATE INDEX IF NOT EXISTS idx_landmarks_project_id ON landmarks(project_id);
CREATE INDEX IF NOT EXISTS idx_gallery_project_id ON gallery_images(project_id);
CREATE INDEX IF NOT EXISTS idx_projects_city ON projects(city);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at);