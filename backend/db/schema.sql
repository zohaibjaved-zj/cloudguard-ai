CREATE TABLE IF NOT EXISTS scans (
  id SERIAL PRIMARY KEY,
  provider VARCHAR(20) NOT NULL,
  total_findings INT DEFAULT 0,
  critical_count INT DEFAULT 0,
  high_count INT DEFAULT 0,
  medium_count INT DEFAULT 0,
  low_count INT DEFAULT 0,
  avg_risk_score FLOAT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS findings (
  id SERIAL PRIMARY KEY,
  scan_id INT REFERENCES scans(id) ON DELETE CASCADE,
  provider VARCHAR(20),
  service VARCHAR(50),
  check_type VARCHAR(100),
  severity VARCHAR(20),
  resource_id VARCHAR(255),
  description TEXT,
  risk_score FLOAT,
  risk_label VARCHAR(20),
  recommendations JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS alerts (
  id SERIAL PRIMARY KEY,
  provider VARCHAR(20),
  severity VARCHAR(20),
  message TEXT,
  acknowledged BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS alert_rules (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  provider VARCHAR(20),
  severity VARCHAR(20),
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);