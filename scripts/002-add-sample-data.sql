INSERT INTO users (email, password_hash, role, first_name, last_name, department) VALUES
('admin@disaster.gov', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.PmvlxO', 'admin', 'John', 'Smith', 'Emergency Management'),
('coordinator@disaster.gov', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.PmvlxO', 'coordinator', 'Sarah', 'Johnson', 'Operations'),
('operator@disaster.gov', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.PmvlxO', 'operator', 'Mike', 'Davis', 'Field Operations')
ON CONFLICT (email) DO NOTHING;

INSERT INTO alerts (type, severity, title, description, location, affected_population, status, created_by) VALUES
('flood', 'critical', 'Severe Flood Warning - Downtown District', 'Water levels have exceeded critical threshold. Immediate evacuation recommended for all residents in the downtown area.', 'Downtown District, Zone A', 15000, 'active', (SELECT id FROM users WHERE email = 'admin@disaster.gov' LIMIT 1)),
('earthquake', 'high', 'Seismic Activity Detected - Northern Hills', 'Minor tremors detected in the Northern Hills region. Monitoring for potential escalation.', 'Northern Hills, Zone C', 8500, 'monitoring', (SELECT id FROM users WHERE email = 'coordinator@disaster.gov' LIMIT 1)),
('weather', 'medium', 'High Wind Advisory - Coastal Region', 'High wind advisory has been lifted. Normal weather conditions have been restored.', 'Coastal Region, Zone B', 12000, 'resolved', (SELECT id FROM users WHERE email = 'operator@disaster.gov' LIMIT 1))
ON CONFLICT DO NOTHING;

INSERT INTO sensors (sensor_id, name, type, location, latitude, longitude, battery_level, signal_strength) VALUES
('WS-001', 'Downtown Weather Station', 'weather', 'Central District', 40.7128, -74.0060, 85, 92),
('FS-002', 'River Level Monitor', 'flood', 'Riverside Area', 40.7589, -73.9851, 72, 88),
('SS-003', 'Seismic Monitor Alpha', 'seismic', 'Northern Hills', 40.6892, -74.0445, 94, 96),
('AQ-004', 'Industrial Air Monitor', 'air_quality', 'Industrial Zone', 40.7282, -74.0776, 45, 78),
('WS-005', 'Coastal Weather Station', 'weather', 'Coastal Region', 40.7505, -73.9934, 88, 94)
ON CONFLICT (sensor_id) DO NOTHING;

INSERT INTO resources (type, name, total_quantity, available_quantity, unit, location, status) VALUES
('medical', 'Medical Supplies', 1000, 850, 'units', 'Central Warehouse', 'available'),
('food', 'Emergency Food Rations', 3000, 2400, 'rations', 'Distribution Center A', 'available'),
('vehicles', 'Emergency Vehicles', 15, 12, 'vehicles', 'Motor Pool', 'available'),
('personnel', 'Emergency Personnel', 60, 45, 'people', 'Command Center', 'available'),
('shelter', 'Emergency Shelter Capacity', 2000, 1200, 'beds', 'Multiple Locations', 'available')
ON CONFLICT DO NOTHING;

INSERT INTO evacuation_zones (zone_id, name, population, status, priority) VALUES
('ZONE-A', 'Downtown District', 15000, 'warning', 'high'),
('ZONE-B', 'Riverside Area', 8200, 'safe', 'medium'),
('ZONE-C', 'Industrial Park', 3500, 'evacuated', 'low'),
('ZONE-D', 'Northern Hills', 12000, 'safe', 'medium'),
('ZONE-E', 'Coastal Region', 18000, 'safe', 'low')
ON CONFLICT (zone_id) DO NOTHING;


INSERT INTO evacuation_routes (route_id, name, zone_id, capacity, current_usage, status) VALUES
('ROUTE-1', 'Main Street Evacuation Route', (SELECT id FROM evacuation_zones WHERE zone_id = 'ZONE-A'), 5000, 2500, 'open'),
('ROUTE-2', 'Riverside Highway', (SELECT id FROM evacuation_zones WHERE zone_id = 'ZONE-B'), 8000, 1200, 'open'),
('ROUTE-3', 'Industrial Parkway', (SELECT id FROM evacuation_zones WHERE zone_id = 'ZONE-C'), 3000, 800, 'congested'),
('ROUTE-4', 'Northern Hills Road', (SELECT id FROM evacuation_zones WHERE zone_id = 'ZONE-D'), 6000, 500, 'open'),
('ROUTE-5', 'Coastal Highway', (SELECT id FROM evacuation_zones WHERE zone_id = 'ZONE-E'), 10000, 1500, 'open')
ON CONFLICT (route_id) DO UPDATE SET name = EXCLUDED.name, capacity = EXCLUDED.capacity, current_usage = EXCLUDED.current_usage, status = EXCLUDED.status;

INSERT INTO shelters (shelter_id, name, location, capacity, current_occupancy, status, facilities) VALUES
('SHELTER-1', 'Community Center', 'Downtown District', 2000, 850, 'available', ARRAY['power', 'water', 'medical', 'food']),
('SHELTER-2', 'High School Gymnasium', 'Northern Hills', 1500, 200, 'available', ARRAY['power', 'water', 'food']),
('SHELTER-3', 'Sports Arena', 'Riverside Area', 4000, 1200, 'limited', ARRAY['power', 'water', 'medical', 'food', 'showers']),
('SHELTER-4', 'Church Community Hall', 'Coastal Region', 800, 750, 'full', ARRAY['power', 'water', 'food']),
('SHELTER-5', 'University Dormitories', 'Northern Hills', 1200, 300, 'available', ARRAY['power', 'water', 'medical', 'food', 'showers'])
ON CONFLICT (shelter_id) DO UPDATE SET name = EXCLUDED.name, capacity = EXCLUDED.capacity, current_occupancy = EXCLUDED.current_occupancy;

INSERT INTO resource_allocations (resource_id, quantity, destination, requested_by, approved_by, status, priority, requested_at) VALUES
((SELECT id FROM resources WHERE name = 'Medical Supplies'), 150, 'Downtown District', (SELECT id FROM users WHERE email = 'coordinator@disaster.gov'), (SELECT id FROM users WHERE email = 'admin@disaster.gov'), 'approved', 'high', NOW() - interval '2 hours'),
((SELECT id FROM resources WHERE name = 'Emergency Food Rations'), 600, 'Northern Hills', (SELECT id FROM users WHERE email = 'operator@disaster.gov'), (SELECT id FROM users WHERE email = 'admin@disaster.gov'), 'in_transit', 'medium', NOW() - interval '5 hours'),
((SELECT id FROM resources WHERE name = 'Emergency Vehicles'), 3, 'Riverside Area', (SELECT id FROM users WHERE email = 'coordinator@disaster.gov'), NULL, 'pending', 'critical', NOW() - interval '1 hour'),
((SELECT id FROM resources WHERE name = 'Emergency Personnel'), 15, 'Coastal Region', (SELECT id FROM users WHERE email = 'admin@disaster.gov'), (SELECT id FROM users WHERE email = 'admin@disaster.gov'), 'delivered', 'high', NOW() - interval '12 hours')
ON CONFLICT DO NOTHING;

INSERT INTO messages (type, title, content, channels, target_audience, sent_by, delivery_status) VALUES 
('emergency_alert', 'FLASH FLOOD WARNING', 'Flash flood warning for Downtown District. Seek higher ground immediately. Expected to continue for next 6 hours.', 
 ARRAY['mobile', 'radio', 'tv'], 'downtown_residents', 
 (SELECT id FROM users WHERE email = 'admin@disaster.gov'),
 '{"mobile": {"delivered": true, "timestamp": "2025-06-10T10:15:32Z", "recipients": 178540, "deliveryTime": 8}, "radio": {"delivered": true, "timestamp": "2025-06-10T10:15:45Z", "recipients": 245000, "deliveryTime": 12}, "tv": {"delivered": true, "timestamp": "2025-06-10T10:16:02Z", "recipients": 315200, "deliveryTime": 15}}'),
 
('evacuation_notice', 'EVACUATION ORDER - Northern Hills', 'All residents in Northern Hills Zone C must evacuate immediately. Proceed to designated shelters. Estimated duration: 48 hours.', 
 ARRAY['mobile', 'radio', 'tv', 'social'], 'northern_hills_residents', 
 (SELECT id FROM users WHERE email = 'coordinator@disaster.gov'),
 '{"mobile": {"delivered": true, "timestamp": "2025-06-09T18:22:15Z", "recipients": 182300, "deliveryTime": 7}, "radio": {"delivered": true, "timestamp": "2025-06-09T18:22:30Z", "recipients": 248000, "deliveryTime": 14}, "tv": {"delivered": true, "timestamp": "2025-06-09T18:23:05Z", "recipients": 318500, "deliveryTime": 18}, "social": {"delivered": true, "timestamp": "2025-06-09T18:24:12Z", "recipients": 142800, "deliveryTime": 22}}'),
 
('all_clear', 'ALL CLEAR - Coastal Region', 'The tsunami warning for the Coastal Region has been lifted. It is now safe to return to coastal areas. Follow local authority instructions for safe return procedures.',
 ARRAY['mobile', 'radio', 'tv', 'social', 'satellite'], 'coastal_residents', 
 (SELECT id FROM users WHERE email = 'admin@disaster.gov'),
 '{"mobile": {"delivered": true, "timestamp": "2025-06-07T09:45:12Z", "recipients": 175600, "deliveryTime": 9}, "radio": {"delivered": true, "timestamp": "2025-06-07T09:45:25Z", "recipients": 242000, "deliveryTime": 11}, "tv": {"delivered": true, "timestamp": "2025-06-07T09:46:08Z", "recipients": 310000, "deliveryTime": 16}, "social": {"delivered": true, "timestamp": "2025-06-07T09:47:15Z", "recipients": 148500, "deliveryTime": 20}, "satellite": {"delivered": true, "timestamp": "2025-06-07T09:45:05Z", "recipients": 485000, "deliveryTime": 7}}')
ON CONFLICT DO NOTHING;

INSERT INTO system_logs (user_id, action, resource_type, resource_id, details) VALUES
((SELECT id FROM users WHERE email = 'admin@disaster.gov'), 'user_login', 'user', (SELECT id FROM users WHERE email = 'admin@disaster.gov'), '{"ip": "192.168.1.1", "device": "desktop"}'),
((SELECT id FROM users WHERE email = 'admin@disaster.gov'), 'create_alert', 'alert', (SELECT id FROM alerts WHERE title LIKE 'Severe Flood Warning%'), '{"severity": "critical", "notification_sent": true}'),
((SELECT id FROM users WHERE email = 'coordinator@disaster.gov'), 'update_resource', 'resource', (SELECT id FROM resources WHERE name = 'Emergency Food Rations'), '{"previous_quantity": 3000, "new_quantity": 2400, "operation": "allocate"}'),
((SELECT id FROM users WHERE email = 'operator@disaster.gov'), 'sensor_update', 'sensor', (SELECT id FROM sensors WHERE sensor_id = 'AQ-004'), '{"battery_level": {"previous": 60, "current": 45}}')
ON CONFLICT DO NOTHING;

UPDATE evacuation_zones SET evacuated = CASE 
  WHEN status = 'evacuated' THEN population 
  WHEN status = 'evacuating' THEN FLOOR(population * 0.7)
  WHEN status = 'warning' THEN FLOOR(population * 0.3)
  ELSE 0 END;

INSERT INTO sensor_readings (sensor_id, reading_type, value, unit, status, recorded_at) VALUES
((SELECT id FROM sensors WHERE sensor_id = 'WS-001'), 'temperature', 26.8, '°C', 'normal', NOW() - interval '30 minutes'),
((SELECT id FROM sensors WHERE sensor_id = 'WS-001'), 'humidity', 72.5, '%', 'warning', NOW() - interval '30 minutes'),
((SELECT id FROM sensors WHERE sensor_id = 'WS-001'), 'wind_speed', 12.4, 'km/h', 'normal', NOW() - interval '30 minutes'),
((SELECT id FROM sensors WHERE sensor_id = 'FS-002'), 'water_level', 4.8, 'm', 'critical', NOW() - interval '15 minutes'),
((SELECT id FROM sensors WHERE sensor_id = 'FS-002'), 'flow_rate', 1250, 'm³/s', 'critical', NOW() - interval '15 minutes'),
((SELECT id FROM sensors WHERE sensor_id = 'SS-003'), 'magnitude', 1.2, 'Richter', 'normal', NOW() - interval '45 minutes'),
((SELECT id FROM sensors WHERE sensor_id = 'SS-003'), 'depth', 5.3, 'km', 'normal', NOW() - interval '45 minutes'),
((SELECT id FROM sensors WHERE sensor_id = 'AQ-004'), 'pm25', 75.2, 'μg/m³', 'warning', NOW() - interval '1 hour'),
((SELECT id FROM sensors WHERE sensor_id = 'AQ-004'), 'ozone', 0.058, 'ppm', 'normal', NOW() - interval '1 hour'),
((SELECT id FROM sensors WHERE sensor_id = 'WS-005'), 'temperature', 22.3, '°C', 'normal', NOW() - interval '20 minutes'),
((SELECT id FROM sensors WHERE sensor_id = 'WS-005'), 'humidity', 85.0, '%', 'warning', NOW() - interval '20 minutes'),
((SELECT id FROM sensors WHERE sensor_id = 'WS-005'), 'wind_speed', 45.2, 'km/h', 'critical', NOW() - interval '20 minutes'),
((SELECT id FROM sensors WHERE sensor_id = 'WS-005'), 'rainfall', 25.4, 'mm', 'warning', NOW() - interval '20 minutes');
