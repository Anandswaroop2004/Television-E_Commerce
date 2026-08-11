DROP DATABASE IF EXISTS Telivision;
CREATE DATABASE Telivision;
USE Telivision;

CREATE TABLE users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'CUSTOMER') NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE jwt_tokens (
    token_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    category_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL
);

CREATE TABLE productimages (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    image_url TEXT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

CREATE TABLE cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

CREATE TABLE orders (
    order_id VARCHAR(255) PRIMARY KEY,
    user_id BIGINT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('PENDING', 'SUCCESS', 'FAILED') NOT NULL DEFAULT 'PENDING',
    razorpay_order_id VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(255) NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price_per_unit DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- Insert sample users with password 'password123' hashed with BCrypt
INSERT INTO users (user_id, username, email, password, role, verified, created_at, updated_at) VALUES
(1, 'john_doe', 'john@example.com', '$2a$10$GY1zUcNJ1nQ5IVPGT4Scoe12vfe9gH58Hy6W3m0t5QF00EWPPLWDu', 'ADMIN', TRUE, '2025-05-20 10:15:30', '2025-05-20 10:20:45'),
(2, 'alice_smith', 'alice@example.com', '$2a$10$GY1zUcNJ1nQ5IVPGT4Scoe12vfe9gH58Hy6W3m0t5QF00EWPPLWDu', 'CUSTOMER', TRUE, '2025-05-20 11:05:21', '2025-05-20 11:05:21'),
(3, 'bob_raj', 'bob@example.com', '$2a$10$GY1zUcNJ1nQ5IVPGT4Scoe12vfe9gH58Hy6W3m0t5QF00EWPPLWDu', 'CUSTOMER', TRUE, '2025-05-20 11:20:10', '2025-05-20 11:20:10'),
(6, 'adminstringstack', 'admin@stringstack.com', '$2a$10$GY1zUcNJ1nQ5IVPGT4Scoe12vfe9gH58Hy6W3m0t5QF00EWPPLWDu', 'ADMIN', TRUE, '2026-08-04 15:38:27', '2026-08-04 15:38:27');

-- Insert sample tokens
INSERT INTO jwt_tokens (token_id, user_id, token, created_at, expires_at) VALUES
(1, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqb2huQGV4YW1wbGUuY29tIiwiaWF0IjoxNzQ3NzM2MTYwLCJleHAiOjE3NDc3NDMzNjB9.X1a2b3C4dE5f6G7h8I9j0K', '2025-05-20 10:16:00', '2025-05-20 12:16:00'),
(2, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbGljZUBleGFtcGxlLmNvbSIsImlhdCI6MTc0NzczNjE2MCwiZXhwIjoxNzQ3NzQzMzYwfQ.A1b2C3d4E5f6G7h8I9j0L', '2025-05-20 11:06:00', '2025-05-20 13:06:00'),
(3, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqb2huQGV4YW1wbGUuY29tIiwiaWF0IjoxNzQ3NzM2MTYwLCJleHAiOjE3NDc3NDMzNjB9.Z9y8X7w6V5u4T3s2R1q0P', '2025-05-20 12:30:00', '2025-05-20 14:30:00');

-- Insert sample categories matching the TV classifications
INSERT INTO categories (category_id, category_name) VALUES
(1, '4K Ultra HD TVs'),
(2, 'OLED TVs'),
(3, 'Gaming TVs'),
(4, 'QLED TVs'),
(5, 'Curved TVs');

-- Insert 20 sample OLED TV products into category 2 (OLED TVs)
INSERT INTO products (product_id, name, description, price, stock, category_id, created_at, updated_at) VALUES
(1, 'LG Evo C3 55" 4K Smart OLED TV', 'Experience next-level viewing with the LG C3 Evo OLED TV. Features self-lit pixels, ThinQ AI, and Dolby Vision for cinematic perfection.', 119999.00, 35, 2, '2025-05-20 10:20:10', '2025-05-20 11:00:00'),
(2, 'Sony Bravia XR A80L 65" OLED TV', 'Immerse yourself in spectacular depth and realism. Cognitive Processor XR delivers pictures and sound with stunning realism.', 189999.00, 20, 2, '2025-05-20 10:25:15', '2025-05-20 11:05:30'),
(3, 'Samsung S90C 55" QD-OLED TV', 'Quantum Dot technology meets OLED. Experience exceptional brightness, pure blacks, and over a billion shades of lifelike colors.', 134999.00, 15, 2, '2025-05-20 10:30:20', '2025-05-20 11:10:45'),
(4, 'LG Evo G3 Gallery 65" OLED TV', 'Designed to hang like a picture frame with the flush-mount Gallery Design. Features the brightest OLED display with Light Booster Max.', 249999.00, 10, 2, '2025-05-20 10:31:25', '2025-05-20 11:12:00'),
(5, 'Panasonic Master OLED 55" TV', 'Tuned by Hollywood professionals, this master OLED screen delivers color accuracy, contrast, and clarity that filmmakers intended.', 124999.00, 18, 2, '2025-05-20 10:35:10', '2025-05-20 11:15:35'),
(6, 'Sony XR A95L QD-OLED 65" TV', 'Sony\'s flagship QD-OLED TV. The brightest and widest color spectrum Sony has ever offered, featuring XR Triluminos Max.', 299999.00, 8, 2, '2025-05-20 10:40:00', '2025-05-20 11:20:00'),
(7, 'LG B3 Series 55" 4K OLED TV', 'An excellent entry point into the premium world of OLED. Powered by a7 AI Processor Gen6 for optimized performance.', 99999.00, 25, 2, '2025-05-20 10:45:00', '2025-05-20 11:25:00'),
(8, 'Philips Ambilight 65" OLED TV', 'Bring movies to life with Ambilight projecting colors onto the wall. Premium OLED panel with P5 AI Dual Picture Engine.', 174999.00, 12, 2, '2025-05-20 10:50:00', '2025-05-20 11:30:00'),
(9, 'Sharp Aquos OLED 55" TV', 'Delivers incredibly vibrant colors and rich acoustic sound. Built with Japanese engineering for premium quality and durability.', 114999.00, 14, 2, '2025-05-20 10:55:00', '2025-05-20 11:35:00'),
(10, 'Loewe Bild i 65" Luxury OLED TV', 'Exquisite design meets advanced German engineering. Features integrated soundbar, premium materials, and custom smart platform.', 349999.00, 5, 2, '2025-05-20 11:00:00', '2025-05-20 11:40:00'),
(11, 'LG Evo C2 48" Compact OLED TV', 'The perfect size for gaming rooms or secondary spaces. Delivers identical OLED brightness and infinite contrast in a 48" form factor.', 84999.00, 30, 2, '2025-05-20 11:05:00', '2025-05-20 11:45:00'),
(12, 'Samsung S95C QD-OLED 65" TV', 'Stunningly thin Infinity One design with One Connect box. Combines unmatched color brightness with deep ink-black OLED pixels.', 219999.00, 15, 2, '2025-05-20 11:10:00', '2025-05-20 11:50:00'),
(13, 'Sony XR A90K 42" Desktop OLED TV', 'A compact masterclass in screen technology. Ideal for high-end gaming and desktop monitors, featuring XR Acoustic Surface Audio+.', 79999.00, 22, 2, '2025-05-20 11:15:00', '2025-05-20 11:55:00'),
(14, 'LG Evo C3 77" Giant OLED TV', 'Fill your room with an immersive cinema experience. 77 inches of self-lit OLED pixels powered by a9 AI Processor Gen6.', 329999.00, 7, 2, '2025-05-20 11:20:00', '2025-05-20 12:00:00'),
(15, 'Hisense OLED 55" Smart TV', 'Premium viewing experience with deep contrast and bright highlights. Supports Dolby Vision, HDR10+, and Dolby Atmos audio.', 89999.00, 17, 2, '2025-05-20 11:25:00', '2025-05-20 12:05:00'),
(16, 'Metz Classic OLED 65" TV', 'Metz premium German TV. Timeless design and majestic acoustic profile with luxury metal build.', 279999.00, 6, 2, '2025-05-20 11:30:00', '2025-05-20 12:10:00'),
(17, 'Toshiba Pro OLED 55" TV', 'REGZA Engine OLED delivers highly detailed pictures. Features active contrast restoration and high-fidelity bass sound system.', 94999.00, 11, 2, '2025-05-20 11:35:00', '2025-05-20 12:15:00'),
(18, 'Grundig Fine Arts 65" OLED TV', 'A masterpiece in audio-visual design. Features Magic Fidelity Pro sound and a premium brushed aluminum stand.', 159999.00, 9, 2, '2025-05-20 11:40:00', '2025-05-20 12:20:00'),
(19, 'LG Flex 42" Bendable OLED TV', 'Go from a completely flat screen to a dramatic 900R curve. Fully customizable screen curvature and position for absolute immersion.', 149999.00, 5, 2, '2025-05-20 11:45:00', '2025-05-20 12:25:00'),
(20, 'Sony Bravia XR A90J Master 83" OLED TV', 'The ultimate home theater screen. Massive 83 inches of pure self-lit OLED pixels delivering unrivaled cinema contrast.', 499999.00, 3, 2, '2025-05-20 11:50:00', '2025-05-20 12:30:00');

-- Insert 20 sample QLED TV products into category 4 (QLED TVs)
INSERT INTO products (product_id, name, description, price, stock, category_id, created_at, updated_at) VALUES
(21, 'Samsung Q60C 55" 4K Smart QLED TV', '100% Color Volume with Quantum Dot. Dual LED backlighting provides balanced, realistic contrast and vibrant color reproduction.', 64999.00, 30, 4, '2025-05-20 12:00:00', '2025-05-20 12:00:00'),
(22, 'TCL 55" C645 QLED Smart TV', 'High Dynamic Range (HDR) QLED screen with Dolby Vision & Atmos, powered by AiPQ Engine 3.0 for exceptional visual clarity.', 42999.00, 25, 4, '2025-05-20 12:05:00', '2025-05-20 12:05:00'),
(23, 'Hisense 65" U6K ULED QLED TV', 'Mini-LED meets Quantum Dot color. Enjoy bright, colorful pictures with full array local dimming and smooth 120Hz refresh rate.', 59999.00, 20, 4, '2025-05-20 12:10:00', '2025-05-20 12:10:00'),
(24, 'Samsung The Frame 55" QLED TV', 'Art Mode showcases beautiful artwork when the TV is off. Features anti-reflection matte display and custom bezel options.', 89999.00, 15, 4, '2025-05-20 12:15:00', '2025-05-20 12:15:00'),
(25, 'OnePlus TV Q2 Pro 65" QLED', 'Flagship QLED display with 120Hz refresh rate, 70W sound output from Horizon Soundbar, and Google TV integration.', 99999.00, 12, 4, '2025-05-20 12:20:00', '2025-05-20 12:20:00'),
(26, 'Xiaomi Smart TV X Pro 55" QLED', 'Gorgeous bezel-less design with Dolby Vision IQ, vivid picture engine, and powerful 30W speakers with DTS-X sound.', 47999.00, 18, 4, '2025-05-20 12:25:00', '2025-05-20 12:25:00'),
(27, 'Samsung Q70C 65" 4K QLED TV', 'Motion Xcelerator Turbo+ delivers high-speed gaming up to 120Hz. Quantum Processor 4K upscale every scene to glorious 4K.', 114999.00, 14, 4, '2025-05-20 12:30:00', '2025-05-20 12:30:00'),
(28, 'TCL C745 Gaming QLED 55" TV', 'Designed for next-gen consoles with 144Hz VRR, FreeSync Premium Pro, and Game Master 2.0 console optimizations.', 54999.00, 22, 4, '2025-05-20 12:35:00', '2025-05-20 12:35:00'),
(29, 'Toshiba M550L 55" QLED TV', 'REGZA Engine ZR delivers spectacular picture quality. Features fine-tuned color mapping and high-performance surround sound.', 44999.00, 16, 4, '2025-05-20 12:40:00', '2025-05-20 12:40:00'),
(30, 'Hisense U7K 65" Mini-LED QLED', 'Mini-LED backlight technology brings unparalleled brightness and contrast control, featuring IMAX Enhanced certification.', 79999.00, 11, 4, '2025-05-20 12:45:00', '2025-05-20 12:45:00'),
(31, 'Samsung Q80C 55" Direct Full Array QLED', 'Direct Full Array backlighting provides deep contrast and bright highlights, powered by Neural Quantum Processor 4K.', 84999.00, 13, 4, '2025-05-20 12:50:00', '2025-05-20 12:50:00'),
(32, 'TCL C845 Mini-LED QLED 65" TV', 'Flagship Mini-LED QLED TV reaching peak brightness up to 2000 nits. Features built-in ONKYO 2.1 channel speaker system.', 129999.00, 9, 4, '2025-05-20 12:55:00', '2025-05-20 12:55:00'),
(33, 'Acer V Series 55" QLED TV', 'Vibrant Quantum Dot screen with Google TV, Dolby Vision, and Intelligent Frame Stabilization engine for crisp action movies.', 39999.00, 20, 4, '2025-05-20 13:00:00', '2025-05-20 13:00:00'),
(34, 'Samsung Neo QLED QN85C 55" TV', 'Neo Quantum Dot meets Quantum Matrix technology with ultra-precise Mini LEDs. Pure color and brilliant brightness.', 124999.00, 8, 4, '2025-05-20 13:05:00', '2025-05-20 13:05:00'),
(35, 'VU Masterpiece Glossy 75" QLED TV', 'A massive 75-inch cinema screen with Armani Gold designer bezel, 800 nits peak brightness, and integrated subwoofer soundbar.', 199999.00, 4, 4, '2025-05-20 13:10:00', '2025-05-20 13:10:00'),
(36, 'Sansui 55" Premium QLED TV', 'High-fidelity entertainment with a gorgeous bezel-less display, wide color palette, and Android TV integration.', 35999.00, 15, 4, '2025-05-20 13:15:00', '2025-05-20 13:15:00'),
(37, 'Lloyd Stellar 55" QLED Smart TV', 'Vivid and sharp picture reproduction with customized picture engines and Dolby Vision. Built-in dual subwoofers.', 38999.00, 17, 4, '2025-05-20 13:20:00', '2025-05-20 13:20:00'),
(38, 'Samsung Neo QLED QN90C 65" TV', 'Samsung\'s flagship 4K Neo QLED. Anti-glare screen with ultra-wide viewing angles and dramatic sound tracking technology.', 184999.00, 6, 4, '2025-05-20 13:25:00', '2025-05-20 13:25:00'),
(39, 'TCL C645 75" Giant QLED TV', 'Experience theater scale QLED colors at home. Features Dolby Vision, HDR10+, and DTS Virtual-X surround sound.', 94999.00, 5, 4, '2025-05-20 13:30:00', '2025-05-20 13:30:00'),
(40, 'Samsung QN900C 85" 8K Neo QLED TV', 'The ultimate resolution masterclass. 85-inch Infinity Screen Neo QLED with breathtaking 8K clarity and AI upscaling.', 799999.00, 2, 4, '2025-05-20 13:35:00', '2025-05-20 13:35:00');

-- Insert 20 sample Gaming TV products into category 3 (Gaming TVs)
INSERT INTO products (product_id, name, description, price, stock, category_id, created_at, updated_at) VALUES
(41, 'LG OLED C3 48" Gaming TV', 'Unmatched 0.1ms response time, 4K 120Hz refresh rate, G-Sync & FreeSync Premium support. The ultimate screen for gaming consoles and PC.', 84999.00, 25, 3, '2025-05-20 14:00:00', '2025-05-20 14:00:00'),
(42, 'Sony BRAVIA XR X90L 55" Gaming TV', 'Perfect for PlayStation 5. Auto HDR Tone Mapping and Auto Genre Picture Mode optimize picture quality for gaming and streaming.', 99999.00, 20, 3, '2025-05-20 14:05:00', '2025-05-20 14:05:00'),
(43, 'Samsung QN90C Neo QLED 50" Gaming TV', 'Enjoy ultra-smooth gaming with 144Hz refresh rate, Motion Xcelerator Turbo+, and 4 HDMI 2.1 ports for multiple gaming consoles.', 89999.00, 15, 3, '2025-05-20 14:10:00', '2025-05-20 14:10:00'),
(44, 'TCL C745 Gaming QLED 65" TV', 'Features 144Hz VRR, AMD FreeSync Premium Pro, and Game Master 2.0. Full Array Local Dimming provides deep dark details.', 69999.00, 30, 3, '2025-05-20 14:15:00', '2025-05-20 14:15:00'),
(45, 'Hisense E7K Pro 55" Gaming QLED', 'Unbelievable 240Hz HRR panel. Features Game Mode Pro, VRR, ALLM, and Dolby Vision for ultra-responsive low latency gameplay.', 49999.00, 18, 3, '2025-05-20 14:20:00', '2025-05-20 14:20:00'),
(46, 'Acer Predator 55" Gaming QLED TV', 'Engineered for gamers. AMD FreeSync Premium, 120Hz VRR, and custom game status dashboard for absolute screen tuning.', 45999.00, 14, 3, '2025-05-20 14:25:00', '2025-05-20 14:25:00'),
(47, 'LG OLED Flex 42" Gaming TV', 'Flexible screen bends from flat to 900R curve. 0.1ms response time, 120Hz refresh, and customized gaming control menu.', 149999.00, 5, 3, '2025-05-20 14:30:00', '2025-05-20 14:30:00'),
(48, 'Samsung OLED S95C 55" Gaming TV', 'Brilliant QD-OLED colors with 144Hz refresh rate, low input lag, and Samsung Gaming Hub to stream cloud games directly.', 139999.00, 10, 3, '2025-05-20 14:35:00', '2025-05-20 14:35:00'),
(49, 'Sony XR A90K 48" Master Gaming TV', 'Designed to hang like a picture frame with custom game status dashboard.', 104999.00, 12, 3, '2025-05-20 14:40:00', '2025-05-20 14:40:00'),
(50, 'TCL C845 Mini-LED Gaming 55" TV', 'Over 2000 nits peak brightness. 144Hz VRR panel powered by AiPQ Processor 3.0 offers incredibly smooth gameplay highlights.', 74999.00, 16, 3, '2025-05-20 14:45:00', '2025-05-20 14:45:00'),
(51, 'Hisense U8K 65" Gaming Mini-LED', '144Hz Game Mode Pro with Game Bar controller overlay. Mini-LED technology delivers detailed shadows and bright explosions.', 94999.00, 11, 3, '2025-05-20 14:50:00', '2025-05-20 14:50:00'),
(52, 'LG QNED85 55" Gaming TV', 'Quantum Dot NanoCell technology offers rich colors. Features 120Hz refresh rate, FreeSync, and specialized Game Optimizer dashboard.', 59999.00, 22, 3, '2025-05-20 14:55:00', '2025-05-20 14:55:00'),
(53, 'Xiaomi Redmi MAX 86" Gaming TV', 'Massive 86-inch screen with 120Hz high refresh rate, HDMI 2.1, and Dolby Vision for an incredibly immersive gaming experience.', 129999.00, 7, 3, '2025-05-20 15:00:00', '2025-05-20 15:00:00'),
(54, 'Samsung Q80C 65" Gaming QLED TV', 'Deep black levels and vibrant details. Quantum HDR 12x and Motion Xcelerator Turbo+ for smooth, tearing-free action.', 119999.00, 9, 3, '2025-05-20 15:05:00', '2025-05-20 15:05:00'),
(55, 'Toshiba Z670MP 55" Gaming TV', 'REGZA Engine ZRi delivers premium image analysis. High refresh rate, low response latency, and dedicated gaming configurations.', 54999.00, 15, 3, '2025-05-20 15:10:00', '2025-05-20 15:10:00'),
(56, 'Sharp Aquos 55" Gaming Smart TV', 'Engineered for console gameplay. Direct LED screen with high refresh rates and specialized audio profiles for gaming immersion.', 42999.00, 19, 3, '2025-05-20 15:15:00', '2025-05-20 15:15:00'),
(57, 'Metz Classic 55" Gaming OLED TV', 'Premium German build with 120Hz display refresh. Dual game modes, low input latency, and luxury metallic design.', 134999.00, 6, 3, '2025-05-20 15:20:00', '2025-05-20 15:20:00'),
(58, 'Panasonic LX950 65" Gaming TV', 'HCX Pro AI Processor delivers professional game pictures. Fast response panel with Game Control Board support.', 109999.00, 8, 3, '2025-05-20 15:25:00', '2025-05-20 15:25:00'),
(59, 'VU Masterpiece 65" Gaming QLED TV', '120Hz refresh panel, Armani Gold design bezel, premium Game mode, and integrated acoustics for epic sound effects.', 79999.00, 14, 3, '2025-05-20 15:30:00', '2025-05-20 15:30:00'),
(60, 'TCL C645 Gaming 50" QLED TV', 'Quantum Dot screen with specialized 120Hz dual line gate gaming refresh. Dolby Vision, HDR10+, and Google TV built-in.', 36999.00, 25, 3, '2025-05-20 15:35:00', '2025-05-20 15:35:00');

-- Insert 20 sample 4K Ultra HD TV products into category 1 (4K Ultra HD TVs)
INSERT INTO products (product_id, name, description, price, stock, category_id, created_at, updated_at) VALUES
(61, 'Samsung Crystal 4K 55" UHD TV', 'Crystal Processor 4K delivers true-to-life color shades. Smart Hub organizes your movies, shows, and games in one place.', 37999.00, 50, 1, '2025-05-20 16:00:00', '2025-05-20 16:00:00'),
(62, 'LG UR7500 55" 4K Smart TV', 'Vibrant color and remarkable detail with 4K HDR10 Pro. Powered by a5 AI Processor Gen6 for an enhanced smart experience.', 39999.00, 45, 1, '2025-05-20 16:05:00', '2025-05-20 16:05:00'),
(63, 'Sony BRAVIA X74L 55" 4K Google TV', 'X1 4K Processor reduces noise and boosts detail. Live Color technology expands colors for vivid, natural pictures.', 52999.00, 35, 1, '2025-05-20 16:10:00', '2025-05-20 16:10:00'),
(64, 'TCL P635 55" 4K Google TV', 'High Dynamic Range (HDR) 10 screen offering bright highlights and detailed shadows. Features edgeless premium design.', 29999.00, 60, 1, '2025-05-20 16:15:00', '2025-05-20 16:15:00'),
(65, 'Hisense A6K 65" 4K Google TV', 'Equipped with Dolby Vision HDR and Pixel Tuning technology. Precision Color delivers over a billion shades of vibrant colors.', 49999.00, 40, 1, '2025-05-20 16:20:00', '2025-05-20 16:20:00'),
(66, 'Xiaomi Smart TV X 55" 4K', '4K Ultra HD screen with Dolby Vision support. Powerful 30W speaker system with DTS Virtual-X for cinematic sound.', 32999.00, 55, 1, '2025-05-20 16:25:00', '2025-05-20 16:25:00'),
(67, 'Samsung Crystal 4K Vivid 65" TV', 'Vivid picture engine with PurColor technology. High-speed HDR content scaling for bright and vivid visual performances.', 56999.00, 30, 1, '2025-05-20 16:30:00', '2025-05-20 16:30:00'),
(68, 'OnePlus TV Y1S Pro 55" 4K', 'Smart 4K display with HDR10+ decoding, Gamma Engine picture optimizer, and seamless oxygen connection with OnePlus buds.', 34999.00, 38, 1, '2025-05-20 16:35:00', '2025-05-20 16:35:00'),
(69, 'Acer I Series 55" 4K Google TV', 'Vibrant display with 4K UHD resolution, Dolby Vision, and MEMC engine for extremely smooth fast-action sports footage.', 31999.00, 42, 1, '2025-05-20 16:40:00', '2025-05-20 16:40:00'),
(70, 'Toshiba C350L 55" 4K Smart TV', 'REGZA Engine 4K provides stunning picture quality. Features fine-tuned color mapping and immersive stereo audio.', 30999.00, 48, 1, '2025-05-20 16:45:00', '2025-05-20 16:45:00'),
(71, 'Panasonic MX700 55" 4K Google TV', 'Google TV interface aggregates all your content. High contrast panel with vivid digital picture optimizer built-in.', 41999.00, 25, 1, '2025-05-20 16:50:00', '2025-05-20 16:50:00'),
(72, 'Sansui 55" 4K Ultra HD TV', 'A clean bezel-less display bringing 4K HDR colors to your living room. Android TV interface with Google Assistant support.', 28999.00, 32, 1, '2025-05-20 16:55:00', '2025-05-20 16:55:00'),
(73, 'Lloyd Stellar 65" 4K Smart TV', 'Vivid HDR10 screen with customized color profiles and a sleek metallic design. Built-in high-performance speakers.', 54999.00, 20, 1, '2025-05-20 17:00:00', '2025-05-20 17:00:00'),
(74, 'Samsung Crystal 4K DU7000 55" TV', 'Ultra-high-definition resolution with PurColor mapping. Powerful 4K processor upscales all content to high clarity.', 36999.00, 50, 1, '2025-05-20 17:05:00', '2025-05-20 17:05:00'),
(75, 'Hisense A6H 55" 4K UHD TV', '4K Ultra HD panel with direct LED backlight, Dolby Vision, DTS Virtual-X audio, and low latency game mode capability.', 31999.00, 44, 1, '2025-05-20 17:10:00', '2025-05-20 17:10:00'),
(76, 'Xiaomi Smart TV X Pro 43" 4K', 'Brilliant 43-inch display with Dolby Vision IQ, vivid picture engine, and powerful 30W DTS speakers.', 26999.00, 55, 1, '2025-05-20 17:15:00', '2025-05-20 17:15:00'),
(77, 'TCL 50" P635 4K Google TV', '50-inch screen with HDR 10, Google TV, OK Google control, and dynamic audio mapping for home entertainment.', 27999.00, 36, 1, '2025-05-20 17:20:00', '2025-05-20 17:20:00'),
(78, 'Acer Advanced I Series 65" 4K', '65-inch high contrast 4K panel with Dolby Vision, Google TV smart interface, and powerful 40W soundbar style speakers.', 51999.00, 18, 1, '2025-05-20 17:25:00', '2025-05-20 17:25:00'),
(79, 'VU GloLED 55" 4K Smart TV', 'GloLED panel increases color brightness by up to 60%. Features 104W DJ soundbar built-in and Dolby Atmos support.', 38999.00, 28, 1, '2025-05-20 17:30:00', '2025-05-20 17:30:00'),
(80, 'Sony BRAVIA X80L 65" 4K Google TV', 'Premium 65-inch Google TV with Triluminos Pro for realistic, lifelike colors. Features Dolby Vision and Atmos.', 84999.00, 15, 1, '2025-05-20 17:35:00', '2025-05-20 17:35:00');

-- Insert 20 sample Curved TV products into category 5 (Curved TVs)
INSERT INTO products (product_id, name, description, price, stock, category_id, created_at, updated_at) VALUES
(81, 'Samsung 55" Curved 4K UHD Smart TV', 'Immersive curved screen brings you into the center of the action. PurColor and HDR technology offer spectacular visual depth.', 54999.00, 30, 5, '2025-05-20 18:00:00', '2025-05-20 18:00:00'),
(82, 'TCL 55" Curved QLED Smart TV', 'Quantum Dot screen with a dramatic gold curve. Enjoy Dolby Vision, Dolby Atmos, and extremely responsive gaming latency.', 48999.00, 25, 5, '2025-05-20 18:05:00', '2025-05-20 18:05:00'),
(83, 'Samsung 65" TU8300 Curved UHD TV', 'Transform your entertainment with dramatic 4K resolution. Curvature naturally matches human field of view for immersion.', 74999.00, 20, 5, '2025-05-20 18:10:00', '2025-05-20 18:10:00'),
(84, 'Hisense 55" Curved Smart LED TV', 'Delivers stunning 4K details in a gorgeous curved design. Direct backlighting offers even light distribution and clarity.', 39999.00, 15, 5, '2025-05-20 18:15:00', '2025-05-20 18:15:00'),
(85, 'Sony BRAVIA 65" Curved 4K HDR TV', 'Unrivaled picture scaling powered by 4K X-Reality PRO. Precision curved profile offers a wide and natural viewing angle.', 119999.00, 12, 5, '2025-05-20 18:20:00', '2025-05-20 18:20:00'),
(86, 'LG 55" Curved OLED Cinematic TV', 'Perfect blacks meet curved screen realism. Self-lit pixels offer infinite contrast and absolute color accuracy from any angle.', 134999.00, 18, 5, '2025-05-20 18:25:00', '2025-05-20 18:25:00'),
(87, 'Samsung 55" Odyssey Ark Curved Screen', 'The ultimate curved gaming cockpit screen. 1000R curvature, Quantum Mini-LED backlight, and multi-view setup controls.', 219999.00, 8, 5, '2025-05-20 18:30:00', '2025-05-20 18:30:00'),
(88, 'TCL 65" Curved 4K HDR TV', 'Sleek metallic design featuring detailed 4K HDR scaling, micro dimming, and Dolby sound rendering for living rooms.', 59999.00, 22, 5, '2025-05-20 18:35:00', '2025-05-20 18:35:00'),
(89, 'Xiaomi Mi Curved 55" TV', 'Ultra-high-definition curved display with bezel-less frame, Google TV interface, and deep cinema audio profiles.', 41999.00, 16, 5, '2025-05-20 18:40:00', '2025-05-20 18:40:00'),
(90, 'Toshiba 55" Curved Smart LED TV', 'Immersive audio and video scaling powered by REGZA engine. Smart TV portal simplifies catalog searching.', 38999.00, 11, 5, '2025-05-20 18:45:00', '2025-05-20 18:45:00'),
(91, 'Sansui 55" Curved 4K TV', 'Enjoy wide panoramic viewing with detailed HDR colors, surround acoustics, and multiple connection ports for media players.', 35999.00, 13, 5, '2025-05-20 18:50:00', '2025-05-20 18:50:00'),
(92, 'Acer 55" Curved QLED Google TV', 'Quantum Dot display meets a smooth 1500R curve. Fluid motion scaling, Google TV catalog, and smart casting.', 47999.00, 9, 5, '2025-05-20 18:55:00', '2025-05-20 18:55:00'),
(93, 'Haier 55" Curved Smart TV', 'Detailed and rich 4K picture display with active motion smoothing and dynamic soundstage acoustics for immersive audio.', 36999.00, 20, 5, '2025-05-20 19:00:00', '2025-05-20 19:00:00'),
(94, 'Skyworth 65" Curved 4K UHD TV', 'Large 65-inch panoramic display with high contrast panel, Android TV interface, and voice remote control.', 64999.00, 8, 5, '2025-05-20 19:05:00', '2025-05-20 19:05:00'),
(95, 'Changhong 55" Curved Smart TV', 'Sleek frame with detailed 4K HDR scale, micro dimming, and direct casting compatibility from mobile devices.', 32999.00, 15, 5, '2025-05-20 19:10:00', '2025-05-20 19:10:00'),
(96, 'Panasonic 55" Curved 4K Smart TV', 'Vivid digital color processing with immersive surround sound technology. Built-in streaming platforms.', 49999.00, 15, 5, '2025-05-20 19:15:00', '2025-05-20 19:15:00'),
(97, 'Philips 55" Curved Ambilight TV', 'Vibrant curved screen with three-sided Ambilight glow. Premium image processor delivers unmatched realism.', 72999.00, 17, 5, '2025-05-20 19:20:00', '2025-05-20 19:20:00'),
(98, 'JVC 55" Curved UHD Smart TV', 'Detailed 4K video rendering on a panoramic curved glass screen. High contrast ratio offers rich black details.', 33999.00, 6, 5, '2025-05-20 19:25:00', '2025-05-20 19:25:00'),
(99, 'Westinghouse 55" Curved 4K TV', 'Panoramic viewing angle with detailed contrast rendering. Slim-bezel framing details fit cleanly into any living room.', 29999.00, 5, 5, '2025-05-20 19:30:00', '2025-05-20 19:30:00'),
(100, 'Samsung 85" Neo QLED Curved TV', 'The ultimate curved display giant. Quantum Mini-LED, Infinity Screen edge, and majestic Dolby Atmos sound channels.', 489999.00, 2, 5, '2025-05-20 19:35:00', '2025-05-20 19:35:00');

-- Insert product images for the 20 OLED TVs (image_ids 1 to 20)
INSERT INTO productimages (image_id, product_id, image_url) VALUES
(1, 1, 'https://ik.imagekit.io/StringStackAnand/OLED/OLED%201.jpg?updatedAt=1785244912371'),
(2, 2, 'https://ik.imagekit.io/StringStackAnand/OLED/OLED%202.jpg'),
(3, 3, 'https://ik.imagekit.io/StringStackAnand/OLED/OLED%203.jpg'),
(4, 4, 'https://ik.imagekit.io/StringStackAnand/OLED/OLED%204.jpg?updatedAt=1785245767436'),
(5, 5, 'https://ik.imagekit.io/StringStackAnand/OLED/OLED%205.jpg?updatedAt=1785245767454'),
(6, 6, 'https://ik.imagekit.io/StringStackAnand/OLED/OLED%206.jpg?updatedAt=1785245767869'),
(7, 7, 'https://ik.imagekit.io/StringStackAnand/OLED/OLED%207.jpg?updatedAt=1785245767870'),
(8, 8, 'https://ik.imagekit.io/StringStackAnand/OLED/OLED%208.jpg?updatedAt=1785245768006'),
(9, 9, 'https://ik.imagekit.io/StringStackAnand/OLED/OLED%209.jpg?updatedAt=1785245767872'),
(10, 10, 'https://ik.imagekit.io/StringStackAnand/OLED/OLED%2010.jpg?updatedAt=1785245767975'),
(11, 11, 'https://ik.imagekit.io/StringStackAnand/OLED/OLED%2011.jpg?updatedAt=1785246631712'),
(12, 12, 'https://ik.imagekit.io/StringStackAnand/OLED/OLED%2012.jpg?updatedAt=1785246628468'),
(13, 13, 'https://ik.imagekit.io/StringStackAnand/OLED/OLED%2013.jpg?updatedAt=1785246628510'),
(14, 14, 'https://ik.imagekit.io/StringStackAnand/OLED/OLED%2014.jpg?updatedAt=1785246631602'),
(15, 15, 'https://ik.imagekit.io/StringStackAnand/OLED/OLED%2015.jpg?updatedAt=1785246631615'),
(16, 16, 'https://ik.imagekit.io/StringStackAnand/OLED/OLED%2016.jpg?updatedAt=1785246631755'),
(17, 17, 'https://ik.imagekit.io/StringStackAnand/OLED/OLED%2017.jpg?updatedAt=1785246629973'),
(18, 18, 'https://ik.imagekit.io/StringStackAnand/OLED/OLED%2018.jpg?updatedAt=1785246630084'),
(19, 19, 'https://ik.imagekit.io/StringStackAnand/OLED/OLED%2019.jpg?updatedAt=1785246631753'),
(20, 20, 'https://ik.imagekit.io/StringStackAnand/OLED/OLED%2020.jpg?updatedAt=1785246631706');

-- Insert product images for the 20 QLED TVs (image_ids 21 to 40)
INSERT INTO productimages (image_id, product_id, image_url) VALUES
(21, 21, 'https://ik.imagekit.io/StringStackAnand/QLED%20TVs/QLED%20img%201.jpg?updatedAt=1785236595822'),
(22, 22, 'https://ik.imagekit.io/StringStackAnand/QLED%20TVs/QLED%20img%202.jpg?updatedAt=1785245176989'),
(23, 23, 'https://ik.imagekit.io/StringStackAnand/QLED%20TVs/QLED%20img%203.jpg?updatedAt=1785245177089'),
(24, 24, 'https://ik.imagekit.io/StringStackAnand/QLED%20TVs/QLED%20img%204.jpg?updatedAt=1785245177053'),
(25, 25, 'https://ik.imagekit.io/StringStackAnand/QLED%20TVs/QLED%20img%205.jpg?updatedAt=1785245177225'),
(26, 26, 'https://ik.imagekit.io/StringStackAnand/QLED%20TVs/QLED%20img%206.jpg?updatedAt=1785245572545'),
(27, 27, 'https://ik.imagekit.io/StringStackAnand/QLED%20TVs/QLED%20img%207.jpg?updatedAt=1785245572129'),
(28, 28, 'https://ik.imagekit.io/StringStackAnand/QLED%20TVs/QLED%20img%208.jpg?updatedAt=1785245572540'),
(29, 29, 'https://ik.imagekit.io/StringStackAnand/QLED%20TVs/QLED%20img%209.jpg?updatedAt=1785245572580'),
(30, 30, 'https://ik.imagekit.io/StringStackAnand/QLED%20TVs/QLED%20img%2010.jpg?updatedAt=1785245572534'),
(31, 31, 'https://ik.imagekit.io/StringStackAnand/QLED%20TVs/QLED%20img%2011.jpg?updatedAt=1785245572583'),
(32, 32, 'https://ik.imagekit.io/StringStackAnand/QLED%20TVs/QLED%20img%2012.jpg?updatedAt=1785245847777'),
(33, 33, 'https://ik.imagekit.io/StringStackAnand/QLED%20TVs/QLED%20img%2013.jpg?updatedAt=1785245847404'),
(34, 34, 'https://ik.imagekit.io/StringStackAnand/QLED%20TVs/QLED%20img%2014.jpg?updatedAt=1785245847571'),
(35, 35, 'https://ik.imagekit.io/StringStackAnand/QLED%20TVs/QLED%20img%2015.jpg?updatedAt=1785245847903'),
(36, 36, 'https://ik.imagekit.io/StringStackAnand/QLED%20TVs/QLED%20img%2016.jpg'),
(37, 37, 'https://ik.imagekit.io/StringStackAnand/QLED%20TVs/QLED%20img%2017.jpg?updatedAt=1785246343927'),
(38, 38, 'https://ik.imagekit.io/StringStackAnand/QLED%20TVs/QLED%20img%2018.jpg?updatedAt=1785246344489'),
(39, 39, 'https://ik.imagekit.io/StringStackAnand/QLED%20TVs/QLED%20img%2019.jpg?updatedAt=1785246612304'),
(40, 40, 'https://ik.imagekit.io/StringStackAnand/QLED%20TVs/QLED%20img%2020.jpg?updatedAt=1785246612179');

-- Insert product images for the 20 Gaming TVs (image_ids 41 to 60)
INSERT INTO productimages (image_id, product_id, image_url) VALUES
(41, 41, 'https://ik.imagekit.io/StringStackAnand/Gaming%20TVs/Gaming%2020.jpg?updatedAt=1785245990462'),
(42, 42, 'https://ik.imagekit.io/StringStackAnand/Gaming%20TVs/Gaming%2019.jpg?updatedAt=1785245675756'),
(43, 43, 'https://ik.imagekit.io/StringStackAnand/Gaming%20TVs/Gaming%2018.jpg?updatedAt=1785245583046'),
(44, 44, 'https://ik.imagekit.io/StringStackAnand/Gaming%20TVs/Gaming%2017.jpg?updatedAt=1785245157821'),
(45, 45, 'https://ik.imagekit.io/StringStackAnand/Gaming%20TVs/Gaming%2016.jpg?updatedAt=1785245048213'),
(46, 46, 'https://ik.imagekit.io/StringStackAnand/Gaming%20TVs/Gaming%2015.jpg?updatedAt=1785244909737'),
(47, 47, 'https://ik.imagekit.io/StringStackAnand/Gaming%20TVs/Gaming%2014.jpg?updatedAt=1785244812442'),
(48, 48, 'https://ik.imagekit.io/StringStackAnand/Gaming%20TVs/Gaming%2013.jpg?updatedAt=1785244673488'),
(49, 49, 'https://ik.imagekit.io/StringStackAnand/Gaming%20TVs/Gaming%2012.jpg?updatedAt=1785244516477'),
(50, 50, 'https://ik.imagekit.io/StringStackAnand/Gaming%20TVs/Gaming%2011.jpg?updatedAt=1785244376847'),
(51, 51, 'https://ik.imagekit.io/StringStackAnand/Gaming%20TVs/Gaming%2010.jpg?updatedAt=1785244160460'),
(52, 52, 'https://ik.imagekit.io/StringStackAnand/Gaming%20TVs/Gaming%209.jpg?updatedAt=1785243881116'),
(53, 53, 'https://ik.imagekit.io/StringStackAnand/Gaming%20TVs/Gaming%208.jpg?updatedAt=1785239277574'),
(54, 54, 'https://ik.imagekit.io/StringStackAnand/Gaming%20TVs/Gaming%207.jpg?updatedAt=1785238724829'),
(55, 55, 'https://ik.imagekit.io/StringStackAnand/Gaming%20TVs/Gaming%206.jpg?updatedAt=1785237994748'),
(56, 56, 'https://ik.imagekit.io/StringStackAnand/Gaming%20TVs/Gaming%205.jpg?updatedAt=1785237848071'),
(57, 57, 'https://ik.imagekit.io/StringStackAnand/Gaming%20TVs/Gaming%204.jpg?updatedAt=1785237725286'),
(58, 58, 'https://ik.imagekit.io/StringStackAnand/Gaming%20TVs/Gaming%203.jpg?updatedAt=1785237464576'),
(59, 59, 'https://ik.imagekit.io/StringStackAnand/Gaming%20TVs/Gaming%202.jpg?updatedAt=1785237265648'),
(60, 60, 'https://ik.imagekit.io/StringStackAnand/Gaming%20TVs/Gaming%201.jpg?updatedAt=1785236785515');

-- Insert product images for the 20 4K Ultra HD TVs (image_ids 61 to 80)
INSERT INTO productimages (image_id, product_id, image_url) VALUES
(61, 61, 'https://ik.imagekit.io/StringStackAnand/4K%20Ultra%20HD%20TVs/images%2018.jpg?updatedAt=1785305777272'),
(62, 62, 'https://ik.imagekit.io/StringStackAnand/4K%20Ultra%20HD%20TVs/images%2015.jpg?updatedAt=1785305776927'),
(63, 63, 'https://ik.imagekit.io/StringStackAnand/4K%20Ultra%20HD%20TVs/images%2017.jpg?updatedAt=1785305776905'),
(64, 64, 'https://ik.imagekit.io/StringStackAnand/4K%20Ultra%20HD%20TVs/images%2010?updatedAt=1785305776880'),
(65, 65, 'https://ik.imagekit.io/StringStackAnand/4K%20Ultra%20HD%20TVs/images%208.jpg?updatedAt=1785305776827'),
(66, 66, 'https://ik.imagekit.io/StringStackAnand/4K%20Ultra%20HD%20TVs/images%203.jpg?updatedAt=1785305776810'),
(67, 67, 'https://ik.imagekit.io/StringStackAnand/4K%20Ultra%20HD%20TVs/images%2019.jpg?updatedAt=1785305776814'),
(68, 68, 'https://ik.imagekit.io/StringStackAnand/4K%20Ultra%20HD%20TVs/images%2014.jpg?updatedAt=1785305776809'),
(69, 69, 'https://ik.imagekit.io/StringStackAnand/4K%20Ultra%20HD%20TVs/images%207.jpg?updatedAt=1785305776859'),
(70, 70, 'https://ik.imagekit.io/StringStackAnand/4K%20Ultra%20HD%20TVs/images%2013.jpg?updatedAt=1785305776818'),
(71, 71, 'https://ik.imagekit.io/StringStackAnand/4K%20Ultra%20HD%20TVs/images%2012.jpg?updatedAt=1785305776764'),
(72, 72, 'https://ik.imagekit.io/StringStackAnand/4K%20Ultra%20HD%20TVs/images%2016.jpg?updatedAt=1785305776745'),
(73, 73, 'https://ik.imagekit.io/StringStackAnand/4K%20Ultra%20HD%20TVs/images%2011.jpg?updatedAt=1785305776809'),
(74, 74, 'https://ik.imagekit.io/StringStackAnand/4K%20Ultra%20HD%20TVs/image%201.avif?updatedAt=1785305776922'),
(75, 75, 'https://ik.imagekit.io/StringStackAnand/4K%20Ultra%20HD%20TVs/images%2020.jpg?updatedAt=1785305776817'),
(76, 76, 'https://ik.imagekit.io/StringStackAnand/4K%20Ultra%20HD%20TVs/images%209.jpg?updatedAt=1785305776808'),
(77, 77, 'https://ik.imagekit.io/StringStackAnand/4K%20Ultra%20HD%20TVs/images%205.jpg?updatedAt=1785305776828'),
(78, 78, 'https://ik.imagekit.io/StringStackAnand/4K%20Ultra%20HD%20TVs/images%204.jpg?updatedAt=1785305776754'),
(79, 79, 'https://ik.imagekit.io/StringStackAnand/4K%20Ultra%20HD%20TVs/images%206.jpg?updatedAt=1785305776696'),
(80, 80, 'https://ik.imagekit.io/StringStackAnand/4K%20Ultra%20HD%20TVs/image%202.jpg?updatedAt=1785305776067');

-- Insert product images for the 20 Curved TVs (image_ids 81 to 100)
INSERT INTO productimages (image_id, product_id, image_url) VALUES
(81, 81, 'https://ik.imagekit.io/StringStackAnand/Curved%20TVs/istockphoto-915972140-612x612.jpg'),
(82, 82, 'https://ik.imagekit.io/StringStackAnand/Curved%20TVs/istockphoto-638043774-612x612.jpg'),
(83, 83, 'https://ik.imagekit.io/StringStackAnand/Curved%20TVs/istockphoto-1212499949-612x612.jpg'),
(84, 84, 'https://ik.imagekit.io/StringStackAnand/Curved%20TVs/istockphoto-467946398-612x612.jpg'),
(85, 85, 'https://ik.imagekit.io/StringStackAnand/Curved%20TVs/istockphoto-638774212-612x612.jpg'),
(86, 86, 'https://ik.imagekit.io/StringStackAnand/Curved%20TVs/istockphoto-471191906-612x612.jpg'),
(87, 87, 'https://ik.imagekit.io/StringStackAnand/Curved%20TVs/istockphoto-531069818-612x612.jpg'),
(88, 88, 'https://ik.imagekit.io/StringStackAnand/Curved%20TVs/istockphoto-1078324494-612x612.jpg'),
(89, 89, 'https://ik.imagekit.io/StringStackAnand/Curved%20TVs/images.jpg'),
(90, 90, 'https://ik.imagekit.io/StringStackAnand/Curved%20TVs/istockphoto-615237960-612x612.jpg'),
(91, 91, 'https://ik.imagekit.io/StringStackAnand/Curved%20TVs/istockphoto-482392912-612x612.jpg'),
(92, 92, 'https://ik.imagekit.io/StringStackAnand/Curved%20TVs/istockphoto-915090018-612x612.jpg'),
(93, 93, 'https://ik.imagekit.io/StringStackAnand/Curved%20TVs/istockphoto-492334523-612x612.jpg'),
(94, 94, 'https://ik.imagekit.io/StringStackAnand/Curved%20TVs/images%20(5).jpg'),
(95, 95, 'https://ik.imagekit.io/StringStackAnand/Curved%20TVs/istockphoto-524904149-612x612.jpg'),
(96, 96, 'https://ik.imagekit.io/StringStackAnand/Curved%20TVs/images%20(3).jpg'),
(97, 97, 'https://ik.imagekit.io/StringStackAnand/Curved%20TVs/istockphoto-518294773-612x612.jpg'),
(98, 98, 'https://ik.imagekit.io/StringStackAnand/Curved%20TVs/images%20(4).jpg'),
(99, 99, 'https://ik.imagekit.io/StringStackAnand/Curved%20TVs/images%20(1).jpg'),
(100, 100, 'https://ik.imagekit.io/StringStackAnand/Curved%20TVs/images%20(2).jpg');

-- Insert sample cart items (linked to OLED/QLED/Gaming/4K/Curved TVs)
INSERT INTO cart_items (id, user_id, product_id, quantity) VALUES
(1, 1, 61, 2),
(2, 1, 24, 1),
(3, 2, 82, 3),
(4, 3, 25, 1),
(5, 2, 83, 2);

-- Insert sample orders
INSERT INTO orders (order_id, user_id, total_amount, status, created_at, updated_at) VALUES
('ORD202505200001', 1, 69999.00, 'SUCCESS', '2025-05-20 11:15:30', '2025-05-20 11:20:45'),
('ORD202505200002', 2, 1198.00, 'PENDING', '2025-05-20 11:25:10', '2025-05-20 11:25:10'),
('ORD202505200003', 3, 799.00, 'FAILED', '2025-05-20 11:30:05', '2025-05-20 11:31:20'),
('ORD202505200004', 1, 1299.00, 'SUCCESS', '2025-05-20 11:35:40', '2025-05-20 11:40:22'),
('ORD202505200005', 2, 1898.00, 'PENDING', '2025-05-20 11:45:15', '2025-05-20 11:45:15');

-- Insert sample order items (linked to OLED/QLED/Gaming/4K/Curved TVs)
INSERT INTO order_items (id, order_id, product_id, quantity, price_per_unit, total_price) VALUES
(1, 'ORD202505200001', 61, 1, 69999.00, 69999.00),
(2, 'ORD202505200001', 24, 1, 1299.00, 1299.00),
(3, 'ORD202505200002', 83, 1, 699.00, 699.00),
(4, 'ORD202505200002', 25, 2, 249.50, 499.00),
(5, 'ORD202505200004', 24, 1, 1299.00, 1299.00),
(6, 'ORD202505200005', 82, 1, 59999.00, 59999.00),
(7, 'ORD202505200005', 25, 1, 249.50, 249.00);
