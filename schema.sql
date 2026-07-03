-- 0. Clean drop existing tables to avoid duplicate schema / column casing conflicts
DROP TABLE IF EXISTS event_media CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS portfolio_items CASCADE;
DROP TABLE IF EXISTS cms_content CASCADE;
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS admin_accounts CASCADE;


-- 1. Create Admin Accounts Table (with correct lowercase identifier casing)
CREATE TABLE admin_accounts (
  username TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  dob DATE,
  avatar_style TEXT DEFAULT 'Circle',
  password TEXT NOT NULL,
  avatar TEXT,
  role TEXT NOT NULL
);

-- Insert default admin accounts matching user settings and requirements
INSERT INTO admin_accounts (username, name, dob, avatar_style, password, avatar, role)
VALUES 
  ('sm_gaming', 'Shimil Manoj', '2007-06-25', 'Circle', 'anna@123', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', 'Super Admin'),
  ('anandhu528', 'Anandhu EP', '1994-08-20', 'Circle', 'anandhu@123', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', 'Editor'),
  ('Joyal_joby', 'Joyal Joby', '1992-05-10', 'Circle', 'Joyal@2007', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', 'Editor'),
  ('employee', 'Creative Staff', '1994-08-20', 'Circle', 'employee123', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', 'Employee');


-- 2. Create Events Table
CREATE TABLE events (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  client_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  password TEXT NOT NULL,
  type TEXT NOT NULL,
  date DATE NOT NULL,
  venue TEXT,
  cover_image TEXT,
  qr_code_url TEXT,
  photographer TEXT,
  active_clients INTEGER DEFAULT 0,
  status TEXT DEFAULT 'Upcoming'
);


-- 3. Create Event Media Table (for real-time streaming photos & videos)
CREATE TABLE event_media (
  id TEXT PRIMARY KEY,
  event_id TEXT REFERENCES events(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('photo', 'video')),
  category TEXT, -- Used for photo categories (e.g. Ceremony, Reception)
  title TEXT, -- Used for video titles
  duration TEXT, -- Used for video duration
  likes INTEGER DEFAULT 0,
  liked_by_user BOOLEAN DEFAULT FALSE,
  tags TEXT[], -- Array of strings for AI search matching
  timestamp TEXT NOT NULL
);


-- 4. Create Employees Table
CREATE TABLE employees (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  phone TEXT,
  email TEXT NOT NULL,
  salary TEXT,
  joined DATE NOT NULL,
  attendance BOOLEAN DEFAULT TRUE,
  tasks TEXT DEFAULT 'Unassigned'
);

INSERT INTO employees (id, name, role, phone, email, salary, joined, attendance, tasks)
VALUES
  ('EMP01', 'Marcus Sterling', 'Photographer', '+1 (555) 234-5678', 'marcus@antigravity.studio', '$4,500/mo', '2024-03-12', TRUE, 'Royal Wedding Ceremony Shoot'),
  ('EMP02', 'Elena Rostova', 'Photographer', '+1 (555) 876-5432', 'elena@antigravity.studio', '$4,200/mo', '2024-09-01', TRUE, 'Eleanor Vance Portrait Shoot'),
  ('EMP03', 'Christian Vance', 'Videographer', '+1 (555) 345-6789', 'christian@antigravity.studio', '$5,000/mo', '2023-05-15', FALSE, 'Cinematography Edit - Isabella Trailer'),
  ('EMP04', 'Sophie Dubois', 'Editor', '+1 (555) 765-4321', 'sophie@antigravity.studio', '$3,800/mo', '2025-01-10', TRUE, 'Color Grading - Golden Hour Batch')
ON CONFLICT (id) DO NOTHING;


-- 5. Create Portfolio Items Table
CREATE TABLE portfolio_items (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  cat TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'Published'
);

INSERT INTO portfolio_items (id, url, cat, title, description, status)
VALUES
  ('port-1', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600', 'Wedding', 'Editorial Romance', 'Editorial romance and classical wedding session.', 'Published'),
  ('port-2', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600', 'Ceremony', 'Golden Hour Vows', 'Intimate ceremony portraits in soft golden hour light.', 'Published'),
  ('port-3', 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=600', 'Wedding', 'Timeless Connection', 'Classic editorial wedding storytelling.', 'Published'),
  ('port-4', 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=600', 'Reception', 'Luxury Tablescape', 'Sophisticated reception details and elegant dinner table setups.', 'Published'),
  ('port-5', 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=600', 'Family', 'Sacred Milestones', 'Milestone family celebrations and raw candid portraits.', 'Published'),
  ('port-6', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=600', 'Reception', 'Midnight Waltz', 'Vibrant party reception and high-fashion editorial dance coverage.', 'Published')
ON CONFLICT (id) DO NOTHING;


-- 6. Create CMS Content Table
CREATE TABLE cms_content (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL
);

INSERT INTO cms_content (key, value)
VALUES
  ('hero', $${"title": "Antigravity Studio Live", "subtitle": "Relive Every Moment Instantly", "desc": "Luxury wedding and milestone photography meets real-time digital sharing. Access your professional event gallery live as the shutter clicks.", "bgImage": "/hero_background.png"}$$),
  ('services', $${"tagline": "What We Do", "heading": "Our Premium Services", "list": [{"title": "Wedding Photography", "desc": "Capturing editorial, luxury imagery of your special day with classical romance."}, {"title": "Wedding Cinematography", "desc": "Cinematic storytelling with cinematic lenses, slow motion, and rich colors."}, {"title": "Engagement Events", "desc": "Sophisticated portraits capturing your intimate connection prior to the wedding."}, {"title": "Baptism Events", "desc": "Elegant capture of sacred milestone family religious celebrations."}, {"title": "Corporate Events", "desc": "Premium coverage of conferences, galas, and corporate PR events."}, {"title": "Live Event Sharing", "desc": "Real-time uploads and instantaneous QR gallery delivery for your guests."}]}$$),
  ('philosophy', $${"tagline": "Studio Philosophy", "heading": "Where Luxury Meets Instant Emotion", "quote": "We believe photography is not merely a service—it is a meticulous preservation of human connection. We don''t just capture how a moment looks; we capture how it feels.", "paragraph1": "Every shutter click is an act of artistic devotion. By blending high-fashion editorial styling with our proprietary live sharing technology, we ensure your loved ones are part of the celebration, no matter where they are in the world.", "paragraph2": "We invite you to experience a new standard of event storytelling, where fine-art photography is delivered in the tempo of the modern era.", "author": "The Antigravity Creative Team", "location": "New York • Milan • Paris", "image": "/studio_thoughts.png"}$$),
  ('testimonials', $${"tagline": "Client Praise", "heading": "Luxury Chronicles", "list": [{"rating": 5, "text": "\"We were absolutely stunned that our family members in Europe could view wedding photos as they were being taken! The quality was breathtaking and the real-time sharing worked perfectly. A class apart.\"", "author": "Charlotte & Michael D.", "tagline": "Royal Wedding Couple"}, {"rating": 5, "text": "\"The Live QR code setup allowed 200+ baptism guests to grab high-res photos instantly on their phones. We didn''t have to follow up or send drives. The best investment for our event!\"", "author": "Sophia Vance", "tagline": "Milestone Parent"}]}$$),
  ('contact', $${"tagline": "Reservations", "heading": "Begin Your Journey", "desc": "Reserve our luxury photography team for your upcoming wedding, baptism, gala, or birthday. Let us bring real-time magic to your celebration.", "phone": "+1 (555) 019-2831", "email": "reservations@antigravity.studio"}$$)
ON CONFLICT (key) DO NOTHING;


-- 7. Create Activity Logs Table
CREATE TABLE activity_logs (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL,
  "user" TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  tag TEXT NOT NULL
);

INSERT INTO activity_logs (id, action, "user", tag)
VALUES
  ('log-1', 'Studio settings initialized', 'System', 'System'),
  ('log-2', 'Live Sharing engine synced', 'System', 'Live Sharing')
ON CONFLICT (id) DO NOTHING;


-- 8. Create Settings Table
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL
);

INSERT INTO settings (key, value)
VALUES
  ('system', $${"studioName": "Antigravity Studio Live", "email": "info@antigravity.studio", "phone": "+1 (555) 019-2831", "address": "123 Fifth Avenue, New York, NY", "twoFactor": false, "passwordPolicy": "Strong (Min 8 chars, 1 uppercase, 1 symbol)", "cloudStorage": "Google Cloud Storage", "autoBackup": true, "qrStyle": "Classic Gold (Branded)", "aiQuality": "Ultra HDR (32-bit)", "autoEditRules": "Auto-Color & Light Skin Soften"}$$)
ON CONFLICT (key) DO NOTHING;


-- 9. Disable RLS (Row Level Security) on all tables to allow queries without policies
ALTER TABLE admin_accounts DISABLE ROW LEVEL SECURITY;
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
ALTER TABLE event_media DISABLE ROW LEVEL SECURITY;
ALTER TABLE employees DISABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE cms_content DISABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE settings DISABLE ROW LEVEL SECURITY;
