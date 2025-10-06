-- Default 3x8 hour shifts for mining operations
INSERT INTO public."Shifts" 
(shift_name, start_time, end_time, is_enabled, note, "createdAt", "updatedAt")
VALUES
('Morning Shift', '06:00:00', '14:00:00', true, 'Default morning shift (6 AM - 2 PM)', NOW(), NOW()),
('Afternoon Shift', '14:00:00', '22:00:00', true, 'Default afternoon shift (2 PM - 10 PM)', NOW(), NOW()),
('Night Shift', '22:00:00', '06:00:00', true, 'Default night shift (10 PM - 6 AM)', NOW(), NOW())
ON CONFLICT DO NOTHING;