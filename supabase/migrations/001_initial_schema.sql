-- Users (no auth, just names)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  photo_url TEXT,
  starting_weight DECIMAL,
  goal_weight DECIMAL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Daily check-ins
CREATE TABLE checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  workout BOOLEAN DEFAULT FALSE,
  ate_clean BOOLEAN DEFAULT FALSE,
  steps BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Weight logs
CREATE TABLE weight_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  weight DECIMAL NOT NULL,
  logged_at DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security (RLS) - open access for simplicity
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;

-- Allow all operations (no auth required)
CREATE POLICY "Allow all users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all checkins" ON checkins FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all weight_logs" ON weight_logs FOR ALL USING (true) WITH CHECK (true);

-- Indexes for performance
CREATE INDEX idx_checkins_user_date ON checkins(user_id, date);
CREATE INDEX idx_weight_logs_user ON weight_logs(user_id, logged_at DESC);
