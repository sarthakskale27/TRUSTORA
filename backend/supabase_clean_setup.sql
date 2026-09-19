-- =================================================================
-- TRUSTORA COMPLETE SUPABASE DATABASE SETUP SCRIPT
-- Copy and paste this entire code into Supabase SQL Editor and click RUN
-- =================================================================

-- 1. DROP EXISTING TABLES (CLEAN SLATE)
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS chat_sessions CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS ai_recommendations CASCADE;
DROP TABLE IF EXISTS ai_listings CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS pricing_factors CASCADE;
DROP TABLE IF EXISTS pricing CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS property_images CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS property_amenities CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS guests CASCADE;
DROP TABLE IF EXISTS amenities CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 2. CREATE ALL TABLES

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(30),
    role VARCHAR(20) DEFAULT 'host',
    is_verified_host BOOLEAN DEFAULT FALSE,
    verification_documents TEXT,
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE amenities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50) DEFAULT 'General',
    icon VARCHAR(50)
);

CREATE TABLE guests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(120) NOT NULL,
    phone VARCHAR(30),
    country VARCHAR(100) DEFAULT 'India',
    trust_rating DOUBLE PRECISION DEFAULT 4.9,
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    property_type VARCHAR(50) NOT NULL,
    description TEXT,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    zip_code VARCHAR(20),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    base_price DOUBLE PRECISION NOT NULL DEFAULT 2000.0,
    currency VARCHAR(10) DEFAULT 'INR',
    status VARCHAR(20) DEFAULT 'active',
    total_rooms INTEGER DEFAULT 1,
    total_bathrooms INTEGER DEFAULT 1,
    max_guests INTEGER DEFAULT 2,
    trust_score INTEGER DEFAULT 94,
    neighborhood_vibe VARCHAR(255) DEFAULT 'Serene, Walkable, Near cafes & transit',
    fraud_risk_level VARCHAR(20) DEFAULT 'low',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE property_amenities (
    property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    amenity_id INTEGER NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
    PRIMARY KEY (property_id, amenity_id)
);

CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    name VARCHAR(120) NOT NULL,
    room_type VARCHAR(50) DEFAULT 'Standard',
    max_occupancy INTEGER DEFAULT 2,
    bed_type VARCHAR(50) DEFAULT 'Queen Bed',
    price_per_night DOUBLE PRECISION NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE property_images (
    id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    caption VARCHAR(150),
    is_primary BOOLEAN DEFAULT FALSE,
    brightness_score INTEGER DEFAULT 85,
    blur_score INTEGER DEFAULT 90,
    composition_score INTEGER DEFAULT 88,
    overall_score INTEGER DEFAULT 88,
    recommendations TEXT,
    is_duplicate BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    booking_reference VARCHAR(30) UNIQUE NOT NULL,
    property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    room_id INTEGER REFERENCES rooms(id) ON DELETE SET NULL,
    guest_id INTEGER NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    total_nights INTEGER DEFAULT 1,
    guest_count INTEGER DEFAULT 2,
    total_amount DOUBLE PRECISION NOT NULL,
    status VARCHAR(30) DEFAULT 'confirmed',
    payment_status VARCHAR(30) DEFAULT 'paid',
    special_requests TEXT,
    channel VARCHAR(50) DEFAULT 'Direct Booking',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pricing (
    id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    current_price DOUBLE PRECISION NOT NULL,
    recommended_price DOUBLE PRECISION NOT NULL,
    min_range DOUBLE PRECISION NOT NULL,
    max_range DOUBLE PRECISION NOT NULL,
    occupancy_forecast DOUBLE PRECISION DEFAULT 70.0,
    is_accepted BOOLEAN DEFAULT FALSE,
    confidence_score DOUBLE PRECISION DEFAULT 88.0,
    factors TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pricing_factors (
    id SERIAL PRIMARY KEY,
    pricing_id INTEGER NOT NULL REFERENCES pricing(id) ON DELETE CASCADE,
    factor_name VARCHAR(100) NOT NULL,
    multiplier DOUBLE PRECISION DEFAULT 1.0,
    impact_amount DOUBLE PRECISION DEFAULT 0.0,
    description VARCHAR(255)
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    guest_id INTEGER NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
    booking_id INTEGER REFERENCES bookings(id) ON DELETE SET NULL,
    cleanliness DOUBLE PRECISION DEFAULT 5.0,
    accuracy DOUBLE PRECISION DEFAULT 5.0,
    communication DOUBLE PRECISION DEFAULT 5.0,
    location DOUBLE PRECISION DEFAULT 5.0,
    check_in DOUBLE PRECISION DEFAULT 5.0,
    value DOUBLE PRECISION DEFAULT 5.0,
    overall_rating DOUBLE PRECISION NOT NULL,
    comment TEXT,
    sentiment_score DOUBLE PRECISION DEFAULT 90.0,
    is_anomaly BOOLEAN DEFAULT FALSE,
    anomaly_reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ai_listings (
    id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    tone VARCHAR(50) DEFAULT 'luxury',
    headline VARCHAR(255) NOT NULL,
    short_description TEXT NOT NULL,
    long_description TEXT NOT NULL,
    highlights TEXT,
    neighborhood_summary TEXT,
    seo_keywords TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ai_recommendations (
    id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    impact_potential VARCHAR(50) DEFAULT 'high',
    action_type VARCHAR(50),
    is_dismissed BOOLEAN DEFAULT FALSE,
    is_applied BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    link VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chat_sessions (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id) ON DELETE SET NULL,
    guest_id INTEGER REFERENCES guests(id) ON DELETE SET NULL,
    session_channel VARCHAR(50) DEFAULT 'whatsapp',
    channel_contact VARCHAR(100),
    guest_name VARCHAR(120),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    sender_type VARCHAR(50) NOT NULL,
    message_content TEXT NOT NULL,
    intent_detected VARCHAR(100),
    confidence DOUBLE PRECISION,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =================================================================
-- 3. INSERT ESSENTIAL SEED ACCOUNTS & AMENITIES
-- =================================================================

-- Standard Host and Guest Accounts (password: password123 or host123)
INSERT INTO users (id, name, email, password_hash, phone, role, is_verified_host, avatar_url) VALUES 
(1, 'Sarthak Kale', 'host@hostboost.ai', '$2b$12$Kv/K7frFY0f12vr.xX7uvOI2ZomQQXsFulFOL3q.efRHbLWNdtVyy', '+91 98230 11223', 'host', TRUE, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'),
(2, 'Priya Sharma', 'priya@gmail.com', '$2b$12$z20X/8eXj9l5wL4y6l5.w.P3gD7xK3l5wL4y6l5.w.P3gD7xK3l5w', '+91 98201 11223', 'guest', TRUE, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'),
(3, 'Rohan Mehta', 'host@trustora.ai', '$2b$12$8K1p/a0dL1m9e1h2t3a4u5v6w7x8y9z0a1b2c3d4e5f6g7h8i9j0k', '+91 98221 44556', 'host', TRUE, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'),
(4, 'Rohan Mehta', 'rohan.host@trustora.ai', '$2b$12$8K1p/a0dL1m9e1h2t3a4u5v6w7x8y9z0a1b2c3d4e5f6g7h8i9j0k', '+91 98221 44556', 'host', TRUE, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d')
ON CONFLICT (email) DO NOTHING;

-- Standard Guests
INSERT INTO guests (id, name, email, phone, country, trust_rating, avatar_url) VALUES
(1, 'Priya Sharma', 'priya@gmail.com', '+91 98201 11223', 'India', 4.9, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'),
(2, 'Rahul Verma', 'rahul.verma@gmail.com', '+91 98192 33445', 'India', 4.8, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'),
(3, 'Ananya Iyer', 'ananya.iyer@gmail.com', '+91 98334 55667', 'India', 4.95, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'),
(4, 'Vikram Malhotra', 'vikram.m@gmail.com', '+91 98450 77889', 'India', 4.85, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e'),
(5, 'Sneha Patel', 'sneha.patel@gmail.com', '+91 98765 43210', 'India', 4.9, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2')
ON CONFLICT (id) DO NOTHING;

-- Standard Amenities
INSERT INTO amenities (id, name, category, icon) VALUES
(1, 'High-Speed WiFi', 'Connectivity', 'wifi'),
(2, 'Air Conditioning', 'Climate', 'wind'),
(3, 'Infinity Pool', 'Luxury', 'waves'),
(4, 'Private Parking', 'Facilities', 'car'),
(5, 'Smart TV with OTT', 'Entertainment', 'tv'),
(6, 'Full Gourmet Kitchen', 'Dining', 'utensils'),
(7, '24/7 Security & CCTV', 'Safety', 'shield-check'),
(8, 'Power Backup Generator', 'Convenience', 'zap'),
(9, 'Work Desk & Chair', 'Work', 'briefcase'),
(10, 'Hot Tub & Jacuzzi', 'Luxury', 'bath')
ON CONFLICT (id) DO NOTHING;

-- Sample Verified Property
INSERT INTO properties (id, user_id, name, property_type, description, address, city, state, country, zip_code, latitude, longitude, base_price, currency, status, total_rooms, total_bathrooms, max_guests, trust_score, neighborhood_vibe) VALUES
(1, 1, 'Villa Azure • Calangute Beach Sanctuary', 'Villa', 'Luxury 4-bedroom beachfront villa with private infinity pool, lush tropical gardens, and 24/7 concierge.', '14/2 Holiday Street, Calangute', 'Goa', 'Goa', 'India', '403516', 15.5428, 73.7553, 12500, 'INR', 'active', 4, 4, 8, 96, 'Beachfront, lively night markets, safe family area'),
(2, 1, 'Pine Shadows • Luxury Cedar Cottage', 'Cottage', 'Scenic 3-bedroom cedarwood chalet overlooking snowcapped Himalayan peaks with cozy fireplace.', 'Hadimba Temple Road, Old Manali', 'Manali', 'Himachal Pradesh', 'India', '175131', 32.2472, 77.1856, 8500, 'INR', 'active', 3, 3, 6, 95, 'Serene mountain valley, walking trails, cafe culture'),
(3, 1, 'Lake Pichola Palace Heritage View', 'Heritage Villa', 'Restored Rajasthani royal haveli with private jharokhas overlooking the illuminated Lake Pichola.', 'Lal Ghat, Behind Jagdish Temple', 'Udaipur', 'Rajasthan', 'India', '313001', 24.5764, 73.6835, 14000, 'INR', 'active', 4, 4, 8, 97, 'Historic ghats, artisan bazaars, rooftop dining')
ON CONFLICT (id) DO NOTHING;

-- Property Images
INSERT INTO property_images (property_id, image_url, caption, is_primary, overall_score) VALUES
(1, 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914', 'Villa Front View', TRUE, 94),
(1, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750', 'Infinity Pool', FALSE, 92),
(2, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb', 'Cottage Exterior', TRUE, 93),
(3, 'https://images.unsplash.com/photo-1566073771259-6a8506099945', 'Heritage View', TRUE, 96)
ON CONFLICT DO NOTHING;

-- Reset Sequences
SELECT setval('users_id_seq', (SELECT COALESCE(MAX(id), 1) FROM users));
SELECT setval('guests_id_seq', (SELECT COALESCE(MAX(id), 1) FROM guests));
SELECT setval('amenities_id_seq', (SELECT COALESCE(MAX(id), 1) FROM amenities));
SELECT setval('properties_id_seq', (SELECT COALESCE(MAX(id), 1) FROM properties));
