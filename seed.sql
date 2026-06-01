-- ==========================================
-- SMARTPASSPORT AI - SEED DATA
-- Default roles, offices, and sample test applications
-- ==========================================

USE smart_passport_db;

-- 1. Insert Core Users with diverse roles
-- Passwords are encrypted in standard production, represented as hashes here
INSERT INTO users (id, full_name, email, password_hash, phone_number, aadhaar_number, role, is_verified) VALUES
(1, 'Amit Sharma', 'amit.sharma@example.com', '$2b$10$wK1Gv5K1YszWv715.X7pJu1Q/0e3Q6Zt1uH.f/mX48Kz54sK8pWqG', '9876543210', '123456789012', 'citizen', TRUE),
(2, 'Priya Patel', 'priya.patel@example.com', '$2b$10$wK1Gv5K1YszWv715.X7pJu1Q/0e3Q6Zt1uH.f/mX48Kz54sK8pWqG', '9876543211', '123456789013', 'citizen', TRUE),
(3, 'Rajesh Kumar', 'rajesh.kumar@gov.in', '$2b$10$wK1Gv5K1YszWv715.X7pJu1Q/0e3Q6Zt1uH.f/mX48Kz54sK8pWqG', '9876543212', '123456789014', 'officer', TRUE),
(4, 'Inspector Vijay Patil', 'vijay.patil@police.gov.in', '$2b$10$wK1Gv5K1YszWv715.X7pJu1Q/0e3Q6Zt1uH.f/mX48Kz54sK8pWqG', '9876543213', '123456789015', 'police', TRUE),
(5, 'Dr. Shrikant Verma', 'shrikant.verma@gov.in', '$2b$10$wK1Gv5K1YszWv715.X7pJu1Q/0e3Q6Zt1uH.f/mX48Kz54sK8pWqG', '9876543214', '123456789016', 'admin', TRUE);

-- 2. Insert Sample Passport Applications at different lifecycle stages
INSERT INTO applications (id, user_id, application_type, status, tracking_id, first_name, last_name, date_of_birth, gender, address_line1, address_line2, city, state, pincode, employment_status, emergency_contact_name, emergency_contact_phone, payment_completed, current_step) VALUES
-- Amit's application: Under Review by Officer
(1, 1, 'new', 'under_review', 'IND-20260523-984321', 'Amit', 'Sharma', '1995-08-15', 'male', 'Flat 402, Shiv Ganga Heights', 'Sector 15, Vashi', 'Navi Mumbai', 'Maharashtra', '400703', 'private_sector', 'Sunita Sharma', '9812345678', TRUE, 'preview'),
-- Priya's application: In Police Verification stage
(2, 2, 'renewal', 'police_verification', 'IND-20260523-743210', 'Priya', 'Patel', '1990-12-04', 'female', 'Building 12, Nandanvan Society', 'Opposite Town Hall', 'Ahmedabad', 'Gujarat', '380001', 'government', 'Ramesh Patel', '9823456789', TRUE, 'preview');

-- 3. Insert Application Documents with simulated OCR face score results
INSERT INTO documents (id, application_id, document_type, file_path, ocr_status, ocr_extracted_text, face_match_score) VALUES
-- Amit's documents (Aadhaar & Photo)
(1, 1, 'aadhaar', '/uploads/docs/amit_aadhaar.pdf', 'verified', 'Name: Amit Sharma; DOB: 15-08-1995; Gender: Male; Aadhaar No: 123456789012', NULL),
(2, 1, 'photo', '/uploads/docs/amit_photo.jpg', 'verified', NULL, 98.4),
(3, 1, 'signature', '/uploads/docs/amit_sig.jpg', 'verified', NULL, NULL),
-- Priya's documents
(4, 2, 'aadhaar', '/uploads/docs/priya_aadhaar.pdf', 'verified', 'Name: Priya Patel; DOB: 04-12-1990; Gender: Female; Aadhaar No: 123456789013', NULL),
(5, 2, 'photo', '/uploads/docs/priya_photo.jpg', 'verified', NULL, 94.6);

-- 4. Insert Appointments
INSERT INTO appointments (id, application_id, user_id, office_location, appointment_date, appointment_slot, qr_code_token, status) VALUES
(1, 1, 1, 'PSK Mumbai (Lower Parel)', '2026-06-01', '10:00:00', 'QR_TOK_AMIT_8329471924', 'scheduled'),
(2, 2, 2, 'PSK Ahmedabad (Mithakali)', '2026-05-18', '11:30:00', 'QR_TOK_PRIYA_7438102947', 'attended');

-- 5. Insert Payments
INSERT INTO payments (id, application_id, user_id, transaction_id, amount, status, receipt_url, paid_at) VALUES
(1, 1, 1, 'pay_Rzp9138402948', 1500.00, 'success', '/receipts/rec_amit_984321.pdf', '2026-05-23 15:30:00'),
(2, 2, 2, 'pay_Rzp7482910384', 1500.00, 'success', '/receipts/rec_priya_743210.pdf', '2026-05-22 11:15:00');

-- 6. Insert Police Verification task for Priya
INSERT INTO police_verification (id, application_id, assigned_police_station, officer_remarks, status, report_file_path, completed_at) VALUES
(1, 2, 'Navrangpura Police Station, Ahmedabad', NULL, 'pending', NULL, NULL);

-- 7. System Activity Logs
INSERT INTO activity_logs (user_id, action, ip_address) VALUES
(1, 'Citizen Registered and verified Aadhaar OTP', '192.168.1.5'),
(1, 'Citizen Completed step-by-step application entry', '192.168.1.5'),
(1, 'Processed payment of INR 1500.00 via Razorpay gateway', '192.168.1.5'),
(2, 'Citizen Logged in', '192.168.1.10'),
(3, 'Officer Rajesh Kumar fetched applications awaiting audit', '10.0.4.15');

-- 8. Seed Notifications
INSERT INTO notifications (user_id, title, message, is_read) VALUES
(1, 'Aadhaar Verification Completed', 'Your Aadhaar card details have been verified successfully via SmartPassport OCR services.', FALSE),
(1, 'Appointment Confirmed', 'Your physical document checking appointment is scheduled at PSK Mumbai for 01-06-2026 at 10:00 AM. Please carry your original Aadhaar and PAN Card.', FALSE),
(2, 'Officer Review Approved', 'Passport Officer Rajesh Kumar has verified your documents. Your application has been dispatched to Gujarat Police for address verification.', FALSE);
