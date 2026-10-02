-- ==========================================================
-- CarCare Egypt - Automotive Service & Maintenance Platform
-- قاعدة بيانات مركز كار كير مصر لصيانة السيارات
-- Target Engine: MariaDB 10.5+ / MySQL 8.0+
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `carcare` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `carcare`;

-- --------------------------------------------------------
-- Table structure for `users`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `appointments`;
DROP TABLE IF EXISTS `cars`;
DROP TABLE IF EXISTS `contact_messages`;
DROP TABLE IF EXISTS `services`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `phone` VARCHAR(25) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `cars`
-- --------------------------------------------------------
CREATE TABLE `cars` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `brand` VARCHAR(50) NOT NULL,
  `model` VARCHAR(50) NOT NULL,
  `year` INT NOT NULL,
  `license_plate` VARCHAR(30) NOT NULL,
  `mileage` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_cars_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_cars_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `services`
-- --------------------------------------------------------
CREATE TABLE `services` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `description` TEXT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `duration` VARCHAR(50) NOT NULL,
  `image` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `appointments`
-- --------------------------------------------------------
CREATE TABLE `appointments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `car_id` INT NOT NULL,
  `service_id` INT NOT NULL,
  `appointment_date` DATE NOT NULL,
  `appointment_time` VARCHAR(25) NOT NULL,
  `problem_description` TEXT DEFAULT NULL,
  `status` ENUM('Pending', 'Confirmed', 'In Service', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Pending',
  `reference_code` VARCHAR(25) NOT NULL UNIQUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_appointments_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_appointments_car` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_appointments_service` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX `idx_appointments_user` (`user_id`),
  INDEX `idx_appointments_date` (`appointment_date`),
  INDEX `idx_appointments_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `contact_messages`
-- --------------------------------------------------------
CREATE TABLE `contact_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(25) DEFAULT NULL,
  `message` TEXT NOT NULL,
  `status` ENUM('Unread', 'Read') NOT NULL DEFAULT 'Unread',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================================
-- Authentic Egyptian Seed Data (بيانات واقعية مصرية بالكامل)
-- ==========================================================

-- 1. Users
-- المدير الفني والمسؤول: م. محمد متولي (almetwalym9@gmail.com أو admin@carcare.eg) | الباسورد: admin123
-- العملاء: أحمد السيد، سارة الجوهري، محمود حسن | الباسورد: customer123
INSERT INTO `users` (`id`, `full_name`, `email`, `phone`, `password`, `role`) VALUES
(1, 'م. محمد متولي (المدير الفني)', 'almetwalym9@gmail.com', '01023456789', '$2y$10$eHpFeiZSlS4FBI0y7xeBdefsiYoAxSfIEDpXO4N.aUH8RHa9bDhSy', 'admin'),
(2, 'إدارة كار كير مصر', 'admin@carcare.eg', '01123456780', '$2y$10$eHpFeiZSlS4FBI0y7xeBdefsiYoAxSfIEDpXO4N.aUH8RHa9bDhSy', 'admin'),
(3, 'م. أحمد السيد الشناوي', 'customer@example.com', '01091234567', '$2y$10$.PHyNG6Z2RNcIngRVrkfMegS8fe9Z3vOTDIBOV5q6ah4/EsWoIWTK', 'customer'),
(4, 'أ. سارة الجوهري', 'sara.elgohary@yahoo.com', '01149876543', '$2y$10$.PHyNG6Z2RNcIngRVrkfMegS8fe9Z3vOTDIBOV5q6ah4/EsWoIWTK', 'customer'),
(5, 'م. محمود حسن علي', 'mahmoud.hassan@hotmail.com', '01275678901', '$2y$10$.PHyNG6Z2RNcIngRVrkfMegS8fe9Z3vOTDIBOV5q6ah4/EsWoIWTK', 'customer');

-- 2. Services (خدمات الصيانة والأسعار الواقعية بالجنيه المصري EGP)
INSERT INTO `services` (`id`, `name`, `description`, `price`, `duration`, `image`) VALUES
(1, 'غيار زيت تخليقي وفلتر أصلي', 'تغيير زيت محرك تخليقي بالكامل 10,000 كم (شل هيلكس ألترا / موبيل 1 / كاسترول)، تغيير فلتر زيت أصلي معتمد، وفحص مجاني لمستوى كافة سوائل السيارة ونقاط السلامة.', 1450.00, '45 دقيقة', 'oil-change.jpg'),
(2, 'فحص كمبيوتر وتشخيص أعطال شامل OBD-II', 'كشف إلكتروني بأحدث أجهزة Launch و Autel المعتمدة، قراءة وتحليل لمبة الأعطال Check Engine، فحص حساسات الأكسجين والهواء، وكنترول الفتيس والفرامل ABS وطباعة تقرير معتمد.', 450.00, '30 دقيقة', 'engine-diagnostics.jpg'),
(3, 'صيانة وتغيير تيل وطنابير الفرامل', 'فحص كامل لمنظومة الفرامل الهيدروليكية، تركيب تيل فرامل سيراميك أصلي كوري/ياباني/ألماني، خرط وتنعيم الطنابير بمخرطة كمبيوتر دقيقة، واختبار ضغط زيت الفرامل DOT4.', 850.00, '60 دقيقة', 'brake-service.jpg'),
(4, 'شحن وصيانة تكييف السيارة', 'تفريغ وفحص تسريب دورة التكييف بضغط النيتروجين والصبغة الفسفورية UV، شحن غاز فريون R134a فرنسي أصلي بالميزان الدقيق، وتغيير فلتر التكييف وتطهير مخارج الهواء.', 950.00, '45 دقيقة', 'ac-service.jpg'),
(5, 'ضبط زوايا 3D وترصيص كمبيوتر', 'ضبط زوايا العجلات بأحدث أجهزة الليزر ثلاثية الأبعاد 3D Computer Alignment لمنع انحراف السيارة وتآكل الكاوتش، وترصيص الجنوط بالأوزان الدقيقة ومعايرة حساسات TPMS.', 400.00, '40 دقيقة', 'wheel-alignment.jpg'),
(6, 'فحص واختبار البطارية ونظام الشحن', 'فحص كفاءة البطارية بالكمبيوتر Digital CCA Test، فحص دائرة الشحن والدينامو والمارش، تنظيف وعزل الأقطاب من الأملاح، وتوفير بطاريات كلورايد وفارتا أصلية بضمان عام.', 250.00, '25 دقيقة', 'battery-service.jpg'),
(7, 'صيانة دورية شاملة (سيرفيس كامل)', 'فحص 50 نقطة أمان تشمل: السيور، البوجيهات، فلاتر الهواء والبنزين، العفشة، خراطيم التبريد، دورة الفرامل، وفحص كامل لحالة المحرك وناقل الحركة مع تقرير مفصل.', 2800.00, '120 دقيقة', 'general-maintenance.jpg'),
(8, 'صيانة العفشة ونظام التعليق', 'فحص وتغيير المساعدين والبطاحات، جلب المقصات، بارات الدركسيون، كبالن داخلية وخارجية، كاوتش الميزان، واختبار ثبات واتزان السيارة على الطرق والمطبات.', 1200.00, '90 دقيقة', 'suspension-service.jpg');

-- 3. Cars (سيارات مصرية حقيقية بأرقام لوحات مرورية مصرية)
INSERT INTO `cars` (`id`, `user_id`, `brand`, `model`, `year`, `license_plate`, `mileage`) VALUES
(1, 3, 'هيونداي (Hyundai)', 'Elantra CN7 Smart Fun', 2022, 'س ق ر 6318', 42000),
(2, 3, 'كيا (Kia)', 'Sportage Topline', 2023, 'أ ج د 7150', 19500),
(3, 4, 'نيسان (Nissan)', 'Sunny N17 Super Saloon', 2021, 'ب و د 4925', 31500),
(4, 5, 'فيات (Fiat)', 'Tipo Hatchback Lounge', 2023, 'ط ع م 1582', 18200);

-- 4. Appointments (حجوزات حقيقية في فروع القاهرة والجيزة)
INSERT INTO `appointments` (`id`, `user_id`, `car_id`, `service_id`, `appointment_date`, `appointment_time`, `problem_description`, `status`, `reference_code`) VALUES
(1, 3, 1, 1, '2026-09-20', '10:30 ص', 'صيانة الـ 40,000 كم الدورية، غيار زيت تخليقي شل وفلتر أصلي مع فحص تبريد المحرك (فرع التجمع الخامس).', 'Confirmed', 'EG-7182'),
(2, 4, 3, 4, '2026-09-12', '02:00 م', 'ضعف في تبريد التكييف أثناء الوقوف في إشارات المرور وقت الظهيرة (فرع مدينة نصر).', 'Completed', 'EG-8941'),
(3, 5, 4, 3, '2026-09-22', '11:30 ص', 'سماع صوت صفارة خفيفة من العجلات الأمامية أثناء التهدئة والفرملة (فرع المهندسين).', 'In Service', 'EG-9410'),
(4, 5, 4, 2, '2026-09-26', '04:00 م', 'فحص كمبيوتر شامل لجميع الحساسات قبل السفر لطريق الساحل الشمالي (فرع الشيخ زايد).', 'Pending', 'EG-5520');

-- 5. Contact Messages (رسائل واستفسارات عملاء واقعية)
INSERT INTO `contact_messages` (`id`, `name`, `email`, `phone`, `message`, `status`) VALUES
(1, 'د. طارق القاضي', 'tarek.kadi@eng-cairo.edu.eg', '01001234567', 'مساء الخير، هل متاح فحص شامل لسيارة رينو ميجان 2024 قبل الشراء (كشف شراء مستعمل) مع تقرير شاسيه وصبغة ومحرك بفرع التجمع الخامس؟', 'Unread'),
(2, 'أ. كريم عبد العزيز', 'karim.abdelaziz@cibeg.com', '01112345678', 'لدينا أسطول مكون من 6 سيارات تابعة للشركة بالتجمع، هل يتوفر لديكم عقود صيانة دورية شهرية للشركات مع فواتير ضريبية معتمدة؟', 'Read');
