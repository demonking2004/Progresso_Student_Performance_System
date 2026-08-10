CREATE DATABASE IF NOT EXISTS student_performance_system;
USE student_performance_system;

CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(190) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('student', 'teacher') NOT NULL DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS student_profiles (
    user_id INT UNSIGNED PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL UNIQUE,
    department VARCHAR(120) NULL,
    semester VARCHAR(30) NULL,
    section_name VARCHAR(30) NULL,
    phone VARCHAR(25) NULL,
    guardian_name VARCHAR(120) NULL,
    guardian_phone VARCHAR(25) NULL,
    education_level VARCHAR(120) NULL,
    bio TEXT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS teacher_profiles (
    user_id INT UNSIGNED PRIMARY KEY,
    employee_id VARCHAR(50) NOT NULL UNIQUE,
    department VARCHAR(120) NULL,
    designation VARCHAR(120) NULL,
    subject_specialization VARCHAR(150) NULL,
    years_of_experience INT NULL,
    highest_qualification VARCHAR(150) NULL,
    phone VARCHAR(25) NULL,
    professional_bio TEXT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Assignments table
CREATE TABLE assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    description TEXT,
    due_date DATE,
    status VARCHAR(50),
    marks VARCHAR(50) DEFAULT '-',
    feedback TEXT 
);

-- Submissions table
CREATE TABLE submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    assignment_id INT,
    student_name VARCHAR(100),
    assignment_title VARCHAR(255),
    file_name VARCHAR(255),
    notes TEXT,
    submitted_at DATE,
    FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE
);

-- Attendance table
CREATE TABLE attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT UNSIGNED NOT NULL,
    teacher_id INT UNSIGNED NOT NULL,
    subject VARCHAR(100),
    attendance_date DATE NOT NULL,
    status ENUM('present', 'absent', 'leave') DEFAULT 'absent',
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_attendance (student_id, teacher_id, attendance_date)
);

-- Marks table
CREATE TABLE marks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT UNSIGNED NOT NULL,
    teacher_id INT UNSIGNED NOT NULL,
    subject VARCHAR(100) NOT NULL,
    exam_type VARCHAR(50) NOT NULL,
    marks_obtained DECIMAL(5, 2) NOT NULL,
    total_marks DECIMAL(5, 2) DEFAULT 100,
    percentage DECIMAL(5, 2),
    grade CHAR(2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Mentee Assignments table
CREATE TABLE mentee_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id INT UNSIGNED NOT NULL,
    student_id INT UNSIGNED NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_assignment (teacher_id, student_id)
);

-- Student Reports table
CREATE TABLE student_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT UNSIGNED NOT NULL,
    teacher_id INT UNSIGNED NOT NULL,
    report_type VARCHAR(100) NOT NULL,
    report_content TEXT NOT NULL,
    overall_performance VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Teacher Notes table

CREATE TABLE teacher_notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    batch_name VARCHAR(100) NOT NULL,
    description TEXT,
    file_name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    document_type VARCHAR(20),
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE teacher_notices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    audience VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    priority VARCHAR(50) NOT NULL,
    attachment_name VARCHAR(255),
    original_name VARCHAR(255),
    file_type VARCHAR(100),
    notice_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE DATABASE student_admin;

USE student_admin;

CREATE TABLE students (
    roll_number INT PRIMARY KEY,
    student_name VARCHAR(100) NOT NULL
);