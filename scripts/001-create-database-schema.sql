-- Users and Authentication
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'observer',
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  department VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Emergency Alerts
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL, -- flood, earthquake, fire, etc.
  severity VARCHAR(20) NOT NULL, -- low, medium, high, critical
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(255) NOT NULL,
  affected_population INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active', -- active, resolved, monitoring
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);

-- Sensor Network
CREATE TABLE sensors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sensor_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- weather, flood, seismic, air_quality
  location VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  status VARCHAR(20) DEFAULT 'active',
  battery_level INTEGER DEFAULT 100,
  signal_strength INTEGER DEFAULT 100,
  last_reading_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Sensor Readings
CREATE TABLE sensor_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sensor_id UUID REFERENCES sensors(id),
  reading_type VARCHAR(50) NOT NULL, -- temperature, humidity, water_level, etc.
  value DECIMAL(10, 4) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'normal', -- normal, warning, critical
  recorded_at TIMESTAMP DEFAULT NOW()
);

-- Evacuation Zones
CREATE TABLE evacuation_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  population INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'safe', -- safe, warning, evacuating, evacuated
  priority VARCHAR(20) DEFAULT 'low', -- low, medium, high, critical
  evacuated INTEGER DEFAULT 0, -- Added column for tracking evacuated count
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Evacuation Routes
CREATE TABLE evacuation_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  zone_id UUID REFERENCES evacuation_zones(id),
  capacity INTEGER NOT NULL,
  current_usage INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'open', -- open, blocked, congested
  created_at TIMESTAMP DEFAULT NOW()
);

-- Emergency Shelters
CREATE TABLE shelters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shelter_id VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  capacity INTEGER NOT NULL,
  current_occupancy INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'available', -- available, full, maintenance
  facilities TEXT[], -- array of available facilities
  created_at TIMESTAMP DEFAULT NOW()
);

-- Resources
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL, -- medical, food, vehicles, personnel
  name VARCHAR(255) NOT NULL,
  total_quantity INTEGER NOT NULL,
  available_quantity INTEGER NOT NULL,
  unit VARCHAR(20) NOT NULL,
  location VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'available',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Resource Allocations
CREATE TABLE resource_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID REFERENCES resources(id),
  quantity INTEGER NOT NULL,
  destination VARCHAR(255) NOT NULL,
  requested_by UUID REFERENCES users(id),
  approved_by UUID REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, in_transit, delivered
  priority VARCHAR(20) DEFAULT 'medium',
  requested_at TIMESTAMP DEFAULT NOW(),
  delivered_at TIMESTAMP
);

-- Communication Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL, -- alert, update, instruction
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  channels VARCHAR(100)[], -- mobile, radio, tv, social
  target_audience VARCHAR(100), -- public, staff, specific_zone
  sent_by UUID REFERENCES users(id),
  sent_at TIMESTAMP DEFAULT NOW(),
  delivery_status JSONB DEFAULT '{}'
);

-- System Logs
CREATE TABLE system_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id UUID,
  details JSONB,
  ip_address INET,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_alerts_created_at ON alerts(created_at);
CREATE INDEX idx_sensor_readings_sensor_id ON sensor_readings(sensor_id);
CREATE INDEX idx_sensor_readings_recorded_at ON sensor_readings(recorded_at);
CREATE INDEX idx_messages_sent_at ON messages(sent_at);
CREATE INDEX idx_system_logs_created_at ON system_logs(created_at);
