-- ==========================================
-- SMARTPASSPORT AI - DATABASE SCHEMA
-- Government-grade Passport Office System
-- Target: MySQL 8.0+
-- ==========================================

CREATE DATABASE IF NOT EXISTS smart_passport_db;
USE smart_passport_db;

-- ------------------------------------------
-- Table: users
-- Represents citizens, admins, officers, and police officers
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    aadhaar_number VARCHAR(12) NOT NULL UNIQUE,
    role ENUM('citizen', 'admin', 'officer', 'police') NOT NULL DEFAULT 'citizen',
    verification_otp VARCHAR(6) NULL,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_role (role),
    INDEX idx_user_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------
-- Table: applications
-- Stores multi-step passport application forms
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    application_type ENUM('new', 'renewal', 'tatkal', 'minor', 'reissue') NOT NULL,
    status ENUM(
        'submitted', 
        'under_review', 
        'doc_verification', 
        'police_verification', 
        'approved', 
        'printing', 
        'dispatched', 
        'delivered'
    ) NOT NULL DEFAULT 'submitted',
    tracking_id VARCHAR(30) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender ENUM('male', 'female', 'other') NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255) NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(6) NOT NULL,
    employment_status VARCHAR(50) NOT NULL,
    emergency_contact_name VARCHAR(150) NOT NULL,
    emergency_contact_phone VARCHAR(15) NOT NULL,
    payment_completed BOOLEAN NOT NULL DEFAULT FALSE,
    current_step ENUM('personal', 'address', 'family', 'employment', 'documents', 'preview') NOT NULL DEFAULT 'personal',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_app_status (status),
    INDEX idx_app_tracking (tracking_id),
    INDEX idx_app_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------
-- Table: documents
-- Uploaded files for application validation & AI OCR
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    document_type ENUM('aadhaar', 'pan', 'birth_cert', 'address_proof', 'photo', 'signature') NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    ocr_status ENUM('pending', 'verified', 'failed') NOT NULL DEFAULT 'pending',
    ocr_extracted_text TEXT NULL,
    face_match_score FLOAT NULL, -- Matching profile photo against Aadhaar
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    INDEX idx_doc_app (application_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------
-- Table: appointments
-- Scheduled appointment details with QR codes
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    user_id INT NOT NULL,
    office_location VARCHAR(150) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_slot TIME NOT NULL,
    qr_code_token VARCHAR(255) NOT NULL UNIQUE,
    status ENUM('scheduled', 'attended', 'cancelled', 'rescheduled') NOT NULL DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_apt_date (appointment_date),
    INDEX idx_apt_app (application_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------
-- Table: payments
-- Payment information details via Razorpay simulation
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    user_id INT NOT NULL,
    transaction_id VARCHAR(100) NOT NULL UNIQUE,
    amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'success', 'failed') NOT NULL DEFAULT 'pending',
    receipt_url VARCHAR(255) NULL,
    paid_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_pay_tx (transaction_id),
    INDEX idx_pay_app (application_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------
-- Table: police_verification
-- Offline verification assigned to police department
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS police_verification (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    assigned_police_station VARCHAR(150) NOT NULL,
    officer_remarks TEXT NULL,
    status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    report_file_path VARCHAR(255) NULL,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    INDEX idx_police_app (application_id),
    INDEX idx_police_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------
-- Table: chatbot_logs
-- Captures AI Chatbot assistant queries for auditing and NLP analytics
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS chatbot_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    query TEXT NOT NULL,
    response TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------
-- Table: activity_logs
-- User & Officer logs for SQL injection, access auditing, and forensics
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    action VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_act_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------
-- Table: notifications
-- SMS/Email notifications stored for application alert system
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notif_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
