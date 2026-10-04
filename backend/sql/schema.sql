-- ==========================================================
-- OlympiadHub Database Schema
-- Advanced Online Examination & Olympiad Management Platform
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `olympiadhub` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `olympiadhub`;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `activity_logs`;
DROP TABLE IF EXISTS `login_sessions`;
DROP TABLE IF EXISTS `exam_security_events`;
DROP TABLE IF EXISTS `certificates`;
DROP TABLE IF EXISTS `student_answers`;
DROP TABLE IF EXISTS `exam_attempts`;
DROP TABLE IF EXISTS `exam_assignments`;
DROP TABLE IF EXISTS `exam_questions`;
DROP TABLE IF EXISTS `exams`;
DROP TABLE IF EXISTS `questions`;
DROP TABLE IF EXISTS `topics`;
DROP TABLE IF EXISTS `chapters`;
DROP TABLE IF EXISTS `class_subjects`;
DROP TABLE IF EXISTS `subjects`;
DROP TABLE IF EXISTS `academic_classes`;
DROP TABLE IF EXISTS `user_permissions`;
DROP TABLE IF EXISTS `role_permissions`;
DROP TABLE IF EXISTS `permissions`;
DROP TABLE IF EXISTS `roles`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `system_settings`;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Academic Classes (Class 1 to Class 12)
CREATE TABLE `academic_classes` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL,
    `code` VARCHAR(20) NOT NULL UNIQUE,
    `order_no` INT NOT NULL DEFAULT 0,
    `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Subjects
CREATE TABLE `subjects` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `code` VARCHAR(30) NOT NULL UNIQUE,
    `icon` VARCHAR(50) DEFAULT 'BookOpen',
    `color` VARCHAR(20) DEFAULT '#4F46E5',
    `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Class Subjects Mapping
CREATE TABLE `class_subjects` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `class_id` INT NOT NULL,
    `subject_id` INT NOT NULL,
    `status` ENUM('active', 'inactive') DEFAULT 'active',
    FOREIGN KEY (`class_id`) REFERENCES `academic_classes`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE CASCADE,
    UNIQUE KEY `unique_class_subject` (`class_id`, `subject_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Chapters
CREATE TABLE `chapters` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `class_id` INT NOT NULL,
    `subject_id` INT NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `code` VARCHAR(50) NULL,
    `order_no` INT DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`class_id`) REFERENCES `academic_classes`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Topics
CREATE TABLE `topics` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `chapter_id` INT NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `description` TEXT NULL,
    `order_no` INT DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`chapter_id`) REFERENCES `chapters`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Roles
CREATE TABLE `roles` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL UNIQUE,
    `display_name` VARCHAR(100) NOT NULL,
    `description` VARCHAR(255) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Permissions
CREATE TABLE `permissions` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `code` VARCHAR(80) NOT NULL UNIQUE,
    `name` VARCHAR(120) NOT NULL,
    `description` VARCHAR(255) NULL,
    `category` VARCHAR(50) NOT NULL DEFAULT 'General'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Role Permissions
CREATE TABLE `role_permissions` (
    `role_id` INT NOT NULL,
    `permission_id` INT NOT NULL,
    PRIMARY KEY (`role_id`, `permission_id`),
    FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Users (Super Admin, Teachers, Students)
CREATE TABLE `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `login_id` VARCHAR(50) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(120) NOT NULL,
    `email` VARCHAR(150) NULL,
    `phone` VARCHAR(20) NULL,
    `role` ENUM('superadmin', 'teacher', 'student') NOT NULL,
    `role_id` INT NULL,
    `class_id` INT NULL,
    `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    `must_change_password` TINYINT(1) NOT NULL DEFAULT 0,
    `avatar` VARCHAR(255) NULL,
    `created_by` INT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`class_id`) REFERENCES `academic_classes`(`id`) ON DELETE SET NULL,
    FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. User Custom Permissions Override
CREATE TABLE `user_permissions` (
    `user_id` INT NOT NULL,
    `permission_id` INT NOT NULL,
    `is_granted` TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (`user_id`, `permission_id`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Question Bank
CREATE TABLE `questions` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `class_id` INT NOT NULL,
    `subject_id` INT NOT NULL,
    `chapter_id` INT NULL,
    `topic_id` INT NULL,
    `question_text` LONGTEXT NOT NULL,
    `option_a` TEXT NOT NULL,
    `option_b` TEXT NOT NULL,
    `option_c` TEXT NOT NULL,
    `option_d` TEXT NOT NULL,
    `correct_option` ENUM('A', 'B', 'C', 'D') NOT NULL,
    `explanation` TEXT NULL,
    `difficulty` ENUM('easy', 'medium', 'hard') NOT NULL DEFAULT 'medium',
    `marks` DECIMAL(5,2) NOT NULL DEFAULT 1.00,
    `negative_marks` DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    `question_image` VARCHAR(255) NULL,
    `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    `created_by` INT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`class_id`) REFERENCES `academic_classes`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`chapter_id`) REFERENCES `chapters`(`id`) ON DELETE SET NULL,
    FOREIGN KEY (`topic_id`) REFERENCES `topics`(`id`) ON DELETE SET NULL,
    FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Exams
CREATE TABLE `exams` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(200) NOT NULL,
    `exam_code` VARCHAR(50) NOT NULL UNIQUE,
    `exam_type` ENUM('free_trial', 'practice', 'mock', 'paid') NOT NULL DEFAULT 'practice',
    `description` TEXT NULL,
    `instructions` TEXT NULL,
    `class_id` INT NULL,
    `subject_id` INT NULL,
    `chapter_id` INT NULL,
    `total_questions` INT NOT NULL DEFAULT 0,
    `total_marks` DECIMAL(7,2) NOT NULL DEFAULT 0.00,
    `duration_minutes` INT NOT NULL DEFAULT 60,
    `passing_percentage` DECIMAL(5,2) NOT NULL DEFAULT 40.00,
    `negative_marking` TINYINT(1) NOT NULL DEFAULT 0,
    `default_negative_marks` DECIMAL(5,2) NOT NULL DEFAULT 0.25,
    `attempt_limit` INT NOT NULL DEFAULT 1,
    `start_datetime` DATETIME NULL,
    `end_datetime` DATETIME NULL,
    `result_visibility` ENUM('immediate', 'after_end_date', 'manual') NOT NULL DEFAULT 'immediate',
    `solution_visibility` ENUM('always', 'after_result', 'never') NOT NULL DEFAULT 'after_result',
    `certificate_eligibility` TINYINT(1) NOT NULL DEFAULT 1,
    `min_certificate_percentage` DECIMAL(5,2) NOT NULL DEFAULT 60.00,
    `randomize_questions` TINYINT(1) NOT NULL DEFAULT 1,
    `shuffle_options` TINYINT(1) NOT NULL DEFAULT 1,
    `tab_switch_limit` INT NOT NULL DEFAULT 3,
    `status` ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'published',
    `created_by` INT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`class_id`) REFERENCES `academic_classes`(`id`) ON DELETE SET NULL,
    FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE SET NULL,
    FOREIGN KEY (`chapter_id`) REFERENCES `chapters`(`id`) ON DELETE SET NULL,
    FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Exam Questions Mapping
CREATE TABLE `exam_questions` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `exam_id` INT NOT NULL,
    `question_id` INT NOT NULL,
    `question_order` INT NOT NULL DEFAULT 1,
    `marks` DECIMAL(5,2) NOT NULL DEFAULT 1.00,
    `negative_marks` DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    FOREIGN KEY (`exam_id`) REFERENCES `exams`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON DELETE CASCADE,
    UNIQUE KEY `unique_exam_question` (`exam_id`, `question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Exam Access / Assignments
CREATE TABLE `exam_assignments` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `exam_id` INT NOT NULL,
    `target_type` ENUM('all', 'class', 'individual') NOT NULL DEFAULT 'all',
    `target_id` INT NULL, -- class_id or user_id
    FOREIGN KEY (`exam_id`) REFERENCES `exams`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. Exam Attempts (Student Sessions)
CREATE TABLE `exam_attempts` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `exam_id` INT NOT NULL,
    `student_id` INT NOT NULL,
    `attempt_number` INT NOT NULL DEFAULT 1,
    `start_time` DATETIME NOT NULL,
    `expected_end_time` DATETIME NOT NULL,
    `submitted_at` DATETIME NULL,
    `time_spent_seconds` INT NOT NULL DEFAULT 0,
    `total_questions` INT NOT NULL DEFAULT 0,
    `answered_count` INT NOT NULL DEFAULT 0,
    `correct_count` INT NOT NULL DEFAULT 0,
    `wrong_count` INT NOT NULL DEFAULT 0,
    `unanswered_count` INT NOT NULL DEFAULT 0,
    `score` DECIMAL(7,2) NOT NULL DEFAULT 0.00,
    `percentage` DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    `passed` TINYINT(1) NOT NULL DEFAULT 0,
    `rank_exam` INT NULL,
    `rank_class` INT NULL,
    `status` ENUM('in_progress', 'submitted', 'timed_out', 'terminated') NOT NULL DEFAULT 'in_progress',
    `tab_switch_count` INT NOT NULL DEFAULT 0,
    `ip_address` VARCHAR(50) NULL,
    `user_agent` TEXT NULL,
    `question_order_json` JSON NULL,
    `option_order_json` JSON NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`exam_id`) REFERENCES `exams`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. Student Answers
CREATE TABLE `student_answers` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `attempt_id` INT NOT NULL,
    `question_id` INT NOT NULL,
    `selected_option` ENUM('A', 'B', 'C', 'D') NULL,
    `is_marked_for_review` TINYINT(1) NOT NULL DEFAULT 0,
    `is_visited` TINYINT(1) NOT NULL DEFAULT 1,
    `is_correct` TINYINT(1) NULL,
    `marks_awarded` DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    `time_spent_seconds` INT NOT NULL DEFAULT 0,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`attempt_id`) REFERENCES `exam_attempts`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON DELETE CASCADE,
    UNIQUE KEY `unique_attempt_question` (`attempt_id`, `question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 17. Certificates
CREATE TABLE `certificates` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `certificate_number` VARCHAR(50) NOT NULL UNIQUE,
    `attempt_id` INT NOT NULL UNIQUE,
    `student_id` INT NOT NULL,
    `exam_id` INT NOT NULL,
    `student_name` VARCHAR(120) NOT NULL,
    `exam_name` VARCHAR(200) NOT NULL,
    `score` DECIMAL(7,2) NOT NULL,
    `percentage` DECIMAL(5,2) NOT NULL,
    `rank_exam` INT NULL,
    `issue_date` DATE NOT NULL,
    `verification_hash` VARCHAR(64) NOT NULL,
    `status` ENUM('valid', 'revoked') NOT NULL DEFAULT 'valid',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`attempt_id`) REFERENCES `exam_attempts`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`exam_id`) REFERENCES `exams`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 18. Exam Security Events (Proctoring/Integrity Log)
CREATE TABLE `exam_security_events` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `attempt_id` INT NOT NULL,
    `student_id` INT NOT NULL,
    `exam_id` INT NOT NULL,
    `event_type` ENUM('tab_switch', 'window_blur', 'fullscreen_exit', 'multiple_login', 'reconnect') NOT NULL,
    `event_data` TEXT NULL,
    `event_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`attempt_id`) REFERENCES `exam_attempts`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`exam_id`) REFERENCES `exams`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 19. Login Sessions
CREATE TABLE `login_sessions` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `session_token` VARCHAR(128) NOT NULL UNIQUE,
    `ip_address` VARCHAR(50) NULL,
    `user_agent` TEXT NULL,
    `last_activity` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `expires_at` DATETIME NOT NULL,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 20. Audit / Activity Logs
CREATE TABLE `activity_logs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NULL,
    `user_role` VARCHAR(50) NULL,
    `action` VARCHAR(100) NOT NULL,
    `module` VARCHAR(80) NOT NULL,
    `details_json` JSON NULL,
    `ip_address` VARCHAR(50) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 21. System Settings
CREATE TABLE `system_settings` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `setting_key` VARCHAR(100) NOT NULL UNIQUE,
    `setting_value` TEXT NULL,
    `setting_group` VARCHAR(50) NOT NULL DEFAULT 'general',
    `description` VARCHAR(255) NULL,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================================
-- SEED DATA
-- ==========================================================

-- Seed Roles
INSERT INTO `roles` (`id`, `name`, `display_name`, `description`) VALUES
(1, 'superadmin', 'Super Administrator', 'Full system access, management of all users, content, exams, and settings'),
(2, 'teacher', 'Teacher / Evaluator', 'Question authoring, exam management, and student analytics based on assigned permissions'),
(3, 'student', 'Student Candidate', 'Attempt Olympiads and exams, view results, solutions, rank and certificates');

-- Seed Permissions
INSERT INTO `permissions` (`id`, `code`, `name`, `description`, `category`) VALUES
(1, 'manage_questions', 'Manage Questions', 'Create, edit, view and delete questions in question bank', 'Questions'),
(2, 'import_questions', 'Import Questions', 'Bulk upload questions via Excel/CSV', 'Questions'),
(3, 'manage_exams', 'Manage Exams', 'Create, edit, publish and manage exams', 'Exams'),
(4, 'view_students', 'View Students', 'Browse student profiles and performance', 'Students'),
(5, 'view_results', 'View Results', 'View evaluation reports and exam scorecards', 'Results'),
(6, 'view_analytics', 'View Analytics', 'Access performance analytics and graphs', 'Analytics'),
(7, 'view_leaderboards', 'View Leaderboards', 'Access class and all-India rankings', 'Leaderboards'),
(8, 'manage_academic', 'Manage Academic', 'Manage classes, subjects, chapters and topics', 'Academic'),
(9, 'manage_users', 'Manage Users', 'Create teachers and students, manage credentials', 'Users'),
(10, 'manage_settings', 'Manage System Settings', 'Configure platform settings and branding', 'Settings');

-- Grant All Permissions to Superadmin Role
INSERT INTO `role_permissions` (`role_id`, `permission_id`) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8), (1, 9), (1, 10);

-- Default Permissions for Teachers (Customizable per teacher)
INSERT INTO `role_permissions` (`role_id`, `permission_id`) VALUES
(2, 1), (2, 2), (2, 3), (2, 4), (2, 5), (2, 6), (2, 7);

-- Seed Academic Classes (Class 1 - Class 12)
INSERT INTO `academic_classes` (`id`, `name`, `code`, `order_no`, `status`) VALUES
(1, 'Class 1', 'CLASS-1', 1, 'active'),
(2, 'Class 2', 'CLASS-2', 2, 'active'),
(3, 'Class 3', 'CLASS-3', 3, 'active'),
(4, 'Class 4', 'CLASS-4', 4, 'active'),
(5, 'Class 5', 'CLASS-5', 5, 'active'),
(6, 'Class 6', 'CLASS-6', 6, 'active'),
(7, 'Class 7', 'CLASS-7', 7, 'active'),
(8, 'Class 8', 'CLASS-8', 8, 'active'),
(9, 'Class 9', 'CLASS-9', 9, 'active'),
(10, 'Class 10', 'CLASS-10', 10, 'active'),
(11, 'Class 11', 'CLASS-11', 11, 'active'),
(12, 'Class 12', 'CLASS-12', 12, 'active');

-- Seed Subjects (9 Official Disciplines)
INSERT INTO `subjects` (`id`, `name`, `code`, `icon`, `color`, `status`) VALUES
(1, 'Mathematics', 'IMO', 'Calculator', '#4e2a4a', 'active'),
(2, 'Science', 'NSO', 'Atom', '#d9775b', 'active'),
(3, 'English', 'IEO', 'BookOpen', '#6d3a68', 'active'),
(4, 'Reasoning', 'LRO', 'Brain', '#6c568d', 'active'),
(5, 'Cyber & AI', 'ICO', 'Cpu', '#b17b25', 'active'),
(6, 'Vocabulary', 'VC', 'Sparkles', '#6d3a68', 'active'),
(7, 'Environment', 'EGO', 'Atom', '#059669', 'active'),
(8, 'Creative Arts', 'CAO', 'Palette', '#80497D', 'active'),
(9, 'General Knowledge', 'IGKO', 'Globe', '#906223', 'active');

-- Seed Class-Subject links for all classes
INSERT INTO `class_subjects` (`class_id`, `subject_id`)
SELECT c.id, s.id FROM `academic_classes` c CROSS JOIN `subjects` s;

-- Seed Sample Chapters
INSERT INTO `chapters` (`id`, `class_id`, `subject_id`, `name`, `code`, `order_no`) VALUES
-- Class 5 Math
(1, 5, 1, 'Large Numbers & Operations', 'C5-MATH-CH1', 1),
(2, 5, 1, 'Fractions and Decimals', 'C5-MATH-CH2', 2),
(3, 5, 1, 'Geometry and Shapes', 'C5-MATH-CH3', 3),
-- Class 5 Science
(4, 5, 2, 'Plants and Animals', 'C5-SCI-CH1', 1),
(5, 5, 2, 'Human Body & Health', 'C5-SCI-CH2', 2),
-- Class 8 Math
(6, 8, 1, 'Rational Numbers', 'C8-MATH-CH1', 1),
(7, 8, 1, 'Linear Equations in One Variable', 'C8-MATH-CH2', 2),
-- Class 8 Science
(8, 8, 2, 'Force and Pressure', 'C8-SCI-CH1', 1),
(9, 8, 2, 'Cell Structure and Functions', 'C8-SCI-CH2', 2),
-- Class 10 Math
(10, 10, 1, 'Real Numbers & Polynomials', 'C10-MATH-CH1', 1),
(11, 10, 1, 'Quadratic Equations', 'C10-MATH-CH2', 2),
(12, 10, 1, 'Trigonometry & Applications', 'C10-MATH-CH3', 3),
-- Class 10 Science
(13, 10, 2, 'Chemical Reactions & Equations', 'C10-SCI-CH1', 1),
(14, 10, 2, 'Light - Reflection & Refraction', 'C10-SCI-CH2', 2),
(15, 10, 2, 'Life Processes', 'C10-SCI-CH3', 3),
-- Class 10 Computer
(16, 10, 5, 'Python Basics & Logic', 'C10-CS-CH1', 1),
(17, 10, 5, 'Web Fundamentals & Cyber Ethics', 'C10-CS-CH2', 2);

-- Seed Sample Topics
INSERT INTO `topics` (`id`, `chapter_id`, `name`, `description`, `order_no`) VALUES
(1, 1, 'Indian and International Number Systems', 'Place value, face value, expanded form', 1),
(2, 1, 'BODMAS & Word Problems', 'Multi-step arithmetic operations', 2),
(3, 2, 'Equivalent Fractions & Operations', 'Addition, subtraction and multiplication of fractions', 1),
(4, 4, 'Photosynthesis & Plant Adaptations', 'Cell structures and chlorophyll reactions', 1),
(5, 5, 'Circulatory and Respiratory Systems', 'Heart, lungs and oxygen transport', 1),
(6, 10, 'Euclid Division Lemma & Fundamental Theorem of Arithmetic', 'HCF and LCM properties', 1),
(7, 11, 'Nature of Roots & Quadratic Formula', 'Discriminant and finding roots', 1),
(8, 12, 'Trigonometric Ratios & Identities', 'sin, cos, tan values and basic identities', 1),
(9, 13, 'Types of Chemical Reactions', 'Combination, Decomposition, Redox', 1),
(10, 14, 'Snells Law & Lens Formula', 'Refraction indices and focal length calculations', 1),
(11, 16, 'Control Structures and Loops', 'if-else, for loops, while loops', 1);

-- Default Users (Passwords hashed using standard bcrypt algorithm for 'Admin@123', 'Teacher@123', 'Student@123')
-- Hash for 'Admin@123' / 'Teacher@123' / 'Student@123':
-- $2y$10$eO0lX9XmP9K6mNqJ/fJbveO6Fm1mEvrG3PZ5g/wU.p8iR1.442qg2
-- We will compute dynamic hashes via PHP script during setup or use standard bcrypt hashes.
INSERT INTO `users` (`id`, `login_id`, `password_hash`, `full_name`, `email`, `phone`, `role`, `role_id`, `class_id`, `status`, `must_change_password`) VALUES
(1, 'ADMIN001', '$2y$10$wT4n4Jc89xJmffmUu9rMSuY5Z2dG9E3sX.lD38s3yGqvVpM0m/tje', 'Super Administrator', 'admin@olympiadhub.com', '+91 9876543210', 'superadmin', 1, NULL, 'active', 0),
(2, 'TCH101', '$2y$10$wT4n4Jc89xJmffmUu9rMSuY5Z2dG9E3sX.lD38s3yGqvVpM0m/tje', 'Dr. Rajesh Sharma', 'rajesh.sharma@olympiadhub.com', '+91 9876543211', 'teacher', 2, NULL, 'active', 0),
(3, 'TCH102', '$2y$10$wT4n4Jc89xJmffmUu9rMSuY5Z2dG9E3sX.lD38s3yGqvVpM0m/tje', 'Prof. Ananya Sen', 'ananya.sen@olympiadhub.com', '+91 9876543212', 'teacher', 2, NULL, 'active', 0),
(4, 'STU1001', '$2y$10$wT4n4Jc89xJmffmUu9rMSuY5Z2dG9E3sX.lD38s3yGqvVpM0m/tje', 'Aarav Mehta', 'aarav.mehta@student.com', '+91 9876543220', 'student', 3, 10, 'active', 0),
(5, 'STU1002', '$2y$10$wT4n4Jc89xJmffmUu9rMSuY5Z2dG9E3sX.lD38s3yGqvVpM0m/tje', 'Priya Deshmukh', 'priya.deshmukh@student.com', '+91 9876543221', 'student', 3, 10, 'active', 0),
(6, 'STU1003', '$2y$10$wT4n4Jc89xJmffmUu9rMSuY5Z2dG9E3sX.lD38s3yGqvVpM0m/tje', 'Kabir Patel', 'kabir.patel@student.com', '+91 9876543222', 'student', 3, 8, 'active', 0),
(7, 'STU1004', '$2y$10$wT4n4Jc89xJmffmUu9rMSuY5Z2dG9E3sX.lD38s3yGqvVpM0m/tje', 'Sneha Reddy', 'sneha.reddy@student.com', '+91 9876543223', 'student', 3, 5, 'active', 0);

-- Seed System Settings
INSERT INTO `system_settings` (`setting_key`, `setting_value`, `setting_group`, `description`) VALUES
('site_name', 'OlympiadHub', 'general', 'Platform Name'),
('site_tagline', 'Advanced National Online Olympiad & Examination System', 'general', 'Tagline'),
('contact_email', 'support@olympiadhub.com', 'general', 'Support Email'),
('enable_tab_switch_detection', '1', 'security', 'Enable proctoring tab switch monitoring'),
('default_tab_switch_limit', '3', 'security', 'Default tab switch warning threshold before auto-submit'),
('default_passing_percentage', '40.0', 'exam', 'Default passing mark percentage'),
('certificate_organization', 'National Olympiad Examination Authority', 'certificate', 'Certificate issuing authority name'),
('certificate_signatory_title', 'Director of Academic Examinations', 'certificate', 'Certificate Signatory Title');
