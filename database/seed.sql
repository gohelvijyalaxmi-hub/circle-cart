PRAGMA foreign_keys = ON;

DELETE FROM verification_requests;
DELETE FROM location_permissions;
DELETE FROM user_settings;
DELETE FROM notifications;
DELETE FROM messages;
DELETE FROM chat_participants;
DELETE FROM chats;
DELETE FROM reviews;
DELETE FROM listing_reports;
DELETE FROM cart_items;
DELETE FROM carts;
DELETE FROM favorites;
DELETE FROM listing_attributes;
DELETE FROM listing_images;
DELETE FROM listings;
DELETE FROM categories;
DELETE FROM users;

INSERT INTO users (
  id, name, email, phone, avatar_url, bio, city, rating, review_count, is_verified, member_since, response_rate, listings_count
) VALUES
  ('user-1', 'goyel vora', 'user1@cityconnect.local', '+919876543210', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', 'Local buyer and occasional seller.', 'Ahmedabad', 4.8, 24, 1, '2023-06-15', 95, 12),
  ('seller-1', 'Priya Sharma', 'priya@cityconnect.local', '+919111111111', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face', 'Selling verified electronics and home products.', 'Ahmedabad', 4.9, 156, 1, '2022-03-10', 98, 45),
  ('seller-2', 'Amit Kumar', 'amit@cityconnect.local', '+919222222222', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', 'Vehicles and premium used goods.', 'Ahmedabad', 4.5, 89, 1, '2023-01-20', 92, 28),
  ('seller-3', 'Neha Gupta', 'neha@cityconnect.local', '+919333333333', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', 'Property and service listings.', 'Ahmedabad', 4.7, 67, 0, '2023-08-05', 88, 15),
  ('seller-4', 'Vikram Singh', 'vikram@cityconnect.local', '+919444444444', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', 'Furniture and job postings.', 'Ahmedabad', 4.2, 34, 1, '2024-02-12', 85, 8),
  ('reviewer-1', 'Ankit Mehta', 'ankit@cityconnect.local', '+919555555555', 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=150&h=150&fit=crop&crop=face', NULL, 'Ahmedabad', 0, 0, 0, '2023-01-01', 0, 0),
  ('reviewer-2', 'Pooja Shah', 'pooja@cityconnect.local', '+919666666666', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face', NULL, 'Ahmedabad', 0, 0, 0, '2023-01-01', 0, 0),
  ('reviewer-3', 'Rahul Joshi', 'rahul@cityconnect.local', '+919777777777', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', NULL, 'Ahmedabad', 0, 0, 0, '2023-01-01', 0, 0);

INSERT INTO categories (id, name, icon, listing_count) VALUES
  ('electronics', 'Electronics', 'Smartphone', 156),
  ('vehicles', 'Vehicles', 'Car', 89),
  ('property', 'Property', 'Home', 234),
  ('services', 'Services', 'Wrench', 67),
  ('furniture', 'Furniture', 'Sofa', 145),
  ('jobs', 'Jobs', 'Briefcase', 78),
  ('aesthetic-products', 'Aesthetic Products', 'Sparkles', 34),
  ('stationery', 'Stationery & Study Material', 'BookOpen', 52),
  ('others', 'Others', 'Package', 203);

INSERT INTO listings (
  id, seller_id, category_id, title, description, price, area, city, primary_image_url, views, is_active, status, created_at
) VALUES
  ('listing-1', 'seller-1', 'electronics', 'iPhone 14 Pro Max - 256GB Deep Purple', 'Brand new iPhone 14 Pro Max in Deep Purple. 256GB storage, still under warranty. Original box and accessories included. No scratches, used with case since day 1.', 89000, 'Satellite', 'Ahmedabad', 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400&h=400&fit=crop', 234, 1, 'published', '2024-01-15'),
  ('listing-2', 'seller-2', 'vehicles', 'Royal Enfield Classic 350 - 2023 Model', 'Royal Enfield Classic 350, 2023 model, only 5000 km driven. First owner, all service records available. Matte black color, excellent condition.', 175000, 'Navrangpura', 'Ahmedabad', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', 567, 1, 'published', '2024-01-14'),
  ('listing-3', 'seller-3', 'property', '2BHK Apartment for Rent - SG Highway', 'Spacious 2BHK apartment for rent on SG Highway. Fully furnished with modular kitchen, AC in both rooms. Society with gym, swimming pool, and 24/7 security.', 25000, 'SG Highway', 'Ahmedabad', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=400&fit=crop', 1023, 1, 'published', '2024-01-13'),
  ('listing-4', 'seller-4', 'furniture', 'L-Shaped Sofa Set - Premium Fabric', '7-seater L-shaped sofa set in premium grey fabric. 2 years old, excellent condition. Includes cushions and center table. Moving out sale.', 35000, 'Bodakdev', 'Ahmedabad', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop', 189, 1, 'published', '2024-01-12'),
  ('listing-5', 'seller-1', 'electronics', 'MacBook Pro M2 - 14 inch', 'MacBook Pro 14-inch with M2 Pro chip. 16GB RAM, 512GB SSD. Purchased 6 months ago, barely used. Includes original charger and box.', 145000, 'Prahlad Nagar', 'Ahmedabad', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop', 456, 1, 'published', '2024-01-11'),
  ('listing-6', 'seller-2', 'vehicles', 'Honda City ZX - 2022 Petrol', 'Honda City ZX variant, 2022 model. Petrol, automatic transmission. Single owner, 15000 km driven. Top-end with sunroof, leather seats.', 1150000, 'Vastrapur', 'Ahmedabad', 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=400&fit=crop', 890, 1, 'published', '2024-01-10'),
  ('listing-7', 'seller-3', 'services', 'Home Cleaning Services', 'Professional home cleaning services. Deep cleaning, regular maintenance, move-in/move-out cleaning. Trained staff, eco-friendly products.', 500, 'Thaltej', 'Ahmedabad', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=400&fit=crop', 234, 1, 'published', '2024-01-09'),
  ('listing-8', 'seller-4', 'jobs', 'Software Developer Position - React/Node', 'Looking for experienced React/Node.js developers. 3-5 years experience required. Remote-friendly, competitive salary. Apply with portfolio.', 0, 'Ashram Road', 'Ahmedabad', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=400&fit=crop', 1567, 1, 'published', '2024-01-08'),
  ('listing-9', 'seller-1', 'electronics', 'Samsung 55-inch QLED Smart TV', 'Samsung 55-inch QLED 4K Smart TV. Crystal clear picture, excellent sound. 1 year old, under warranty. Wall mount included.', 65000, 'Chandkheda', 'Ahmedabad', 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop', 345, 1, 'published', '2024-01-07'),
  ('listing-10', 'seller-2', 'furniture', 'Study Table with Chair', 'Wooden study table with ergonomic chair. Perfect for home office or students. Good condition, minor wear.', 8500, 'Memnagar', 'Ahmedabad', 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=400&fit=crop', 123, 1, 'published', '2024-01-06'),
  ('listing-11', 'seller-1', 'electronics', 'Boat Airdopes 141 - Wireless Earbuds', 'Boat Airdopes 141 in excellent condition. Battery backup around 5 hours on single charge. Charging cable and box included.', 1200, 'Naranpura', 'Ahmedabad', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop', 198, 1, 'published', '2024-01-05'),
  ('listing-12', 'seller-2', 'vehicles', 'TVS Jupiter 125 - 2022', 'TVS Jupiter 125 scooter, single owner, good mileage and well-maintained. Insurance valid till next year.', 72000, 'Maninagar', 'Ahmedabad', 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=400&h=400&fit=crop', 276, 1, 'published', '2024-01-04'),
  ('listing-13', 'seller-3', 'property', '1RK Studio Flat for Rent', 'Compact 1RK studio near metro connectivity. Ideal for students or working professionals. Semi-furnished with attached bathroom.', 9500, 'Sabarmati', 'Ahmedabad', 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=400&fit=crop', 412, 1, 'published', '2024-01-03'),
  ('listing-14', 'seller-3', 'services', 'AC Repair and Service at Home', 'Doorstep AC service including gas check, basic cleaning, and performance testing. Same-day slots available in most areas.', 799, 'Gota', 'Ahmedabad', 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=400&h=400&fit=crop', 165, 1, 'published', '2024-01-02'),
  ('listing-15', 'seller-4', 'furniture', 'Queen Size Bed with Storage', 'Solid wood queen bed with hydraulic storage. 2.5 years old and in very good condition. Mattress can be included at extra cost.', 18000, 'Bopal', 'Ahmedabad', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=400&fit=crop', 144, 1, 'published', '2024-01-01'),
  ('listing-16', 'seller-4', 'jobs', 'Part-time Content Writer Needed', 'Hiring part-time content writer for blogs and product descriptions. Freshers can apply if writing samples are good.', 0, 'CG Road', 'Ahmedabad', 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=400&fit=crop', 539, 1, 'published', '2023-12-31'),
  ('listing-17', 'seller-2', 'others', 'Used Cricket Kit (Bat, Pads, Gloves)', 'Complete cricket kit in good condition. Great for school/college players. Slight wear on gloves but fully usable.', 3500, 'Nikol', 'Ahmedabad', 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=400&fit=crop', 118, 1, 'published', '2023-12-30'),
  ('listing-18', 'seller-1', 'stationery', 'Class 11 PCM Books + Notes Bundle', 'Complete Class 11 Physics, Chemistry, and Maths books with handwritten notes and solved assignments. Good condition.', 2200, 'Paldi', 'Ahmedabad', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop', 96, 1, 'published', '2023-12-29');

INSERT INTO listing_images (listing_id, image_url, position) VALUES
  ('listing-1', 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800&h=800&fit=crop', 0),
  ('listing-1', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=800&fit=crop', 1),
  ('listing-2', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop', 0),
  ('listing-2', 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&h=800&fit=crop', 1),
  ('listing-3', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=800&fit=crop', 0),
  ('listing-3', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=800&fit=crop', 1),
  ('listing-4', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop', 0),
  ('listing-4', 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&h=800&fit=crop', 1),
  ('listing-5', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop', 0),
  ('listing-6', 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=800&fit=crop', 0),
  ('listing-7', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=800&fit=crop', 0),
  ('listing-8', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=800&fit=crop', 0),
  ('listing-9', 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=800&fit=crop', 0),
  ('listing-10', 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&h=800&fit=crop', 0),
  ('listing-11', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=800&fit=crop', 0),
  ('listing-11', 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&h=800&fit=crop', 1),
  ('listing-12', 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=800&h=800&fit=crop', 0),
  ('listing-13', 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=800&fit=crop', 0),
  ('listing-13', 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&h=800&fit=crop', 1),
  ('listing-14', 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&h=800&fit=crop', 0),
  ('listing-15', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=800&fit=crop', 0),
  ('listing-16', 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=800&fit=crop', 0),
  ('listing-17', 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&h=800&fit=crop', 0),
  ('listing-18', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=800&fit=crop', 0),
  ('listing-18', 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=800&fit=crop', 1);

INSERT INTO listing_attributes (listing_id, attribute_key, attribute_value) VALUES
  ('listing-1', 'condition', 'Like New'),
  ('listing-1', 'storage', '256GB'),
  ('listing-2', 'kms_driven', '5000'),
  ('listing-3', 'type', '2BHK'),
  ('listing-3', 'furnished', 'Yes'),
  ('listing-8', 'experience_required', '3-5 years'),
  ('listing-11', 'condition', 'Excellent'),
  ('listing-12', 'owner', 'First owner'),
  ('listing-14', 'service_type', 'Doorstep'),
  ('listing-17', 'sport', 'Cricket'),
  ('listing-18', 'class_level', 'Class 11');

INSERT INTO favorites (user_id, listing_id) VALUES
  ('user-1', 'listing-1'),
  ('user-1', 'listing-3'),
  ('user-1', 'listing-9');

INSERT INTO carts (id, user_id, updated_at) VALUES
  ('cart-1', 'user-1', '2024-01-15T11:00:00');

INSERT INTO cart_items (cart_id, listing_id, quantity) VALUES
  ('cart-1', 'listing-5', 1),
  ('cart-1', 'listing-11', 2);

INSERT INTO listing_reports (id, listing_id, reporter_user_id, reason, status, created_at) VALUES
  ('report-1', 'listing-10', 'user-1', 'Wrong category', 'open', '2024-01-12T15:30:00');

INSERT INTO chats (id, listing_id, last_message_at) VALUES
  ('chat-1', 'listing-1', '2024-01-15T10:40:00'),
  ('chat-2', 'listing-2', '2024-01-14T14:15:00');

INSERT INTO chat_participants (chat_id, user_id) VALUES
  ('chat-1', 'user-1'),
  ('chat-1', 'seller-1'),
  ('chat-2', 'user-1'),
  ('chat-2', 'seller-2');

INSERT INTO messages (id, chat_id, sender_id, body, is_read, created_at) VALUES
  ('msg-1', 'chat-1', 'user-1', 'Hi, is this iPhone still available?', 1, '2024-01-15T10:30:00'),
  ('msg-2', 'chat-1', 'seller-1', 'Yes, it is! Are you interested?', 1, '2024-01-15T10:32:00'),
  ('msg-3', 'chat-1', 'user-1', 'Can you do 85,000?', 1, '2024-01-15T10:35:00'),
  ('msg-4', 'chat-1', 'seller-1', 'I can do 87,000. Final price. It''s in mint condition.', 1, '2024-01-15T10:40:00'),
  ('msg-5', 'chat-2', 'user-1', 'Hello, I want to see the bike. When can I visit?', 1, '2024-01-14T14:00:00'),
  ('msg-6', 'chat-2', 'seller-2', 'Hi! You can come tomorrow evening around 5 PM. I''ll share the location.', 0, '2024-01-14T14:15:00');

INSERT INTO reviews (id, reviewer_user_id, reviewee_user_id, rating, body, created_at) VALUES
  ('review-1', 'reviewer-1', 'seller-1', 5, 'Excellent seller! Product was exactly as described. Quick response and smooth transaction.', '2024-01-10'),
  ('review-2', 'reviewer-2', 'seller-1', 4, 'Good experience overall. Seller was punctual and the item was in good condition.', '2024-01-05'),
  ('review-3', 'reviewer-3', 'seller-1', 5, 'Super fast response! Got a great deal. Highly recommend this seller.', '2023-12-28');

INSERT INTO notifications (
  id, user_id, type, title, description, image_url, link_url, is_read, created_at
) VALUES
  ('notification-1', 'user-1', 'message', 'New message from Priya Sharma', 'I can do 87,000. Final price.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', '/chat/seller-1', 0, '2024-01-15T10:45:00'),
  ('notification-2', 'user-1', 'price_drop', 'Price dropped!', 'iPhone 14 Pro Max is now 85,000', 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=150', '/listing/listing-1', 0, '2024-01-15T09:30:00'),
  ('notification-3', 'user-1', 'review', 'New review received', 'Ankit Mehta gave you 5 stars', 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=150', '/reviews/user-1', 1, '2024-01-15T07:30:00'),
  ('notification-4', 'user-1', 'system', 'Verification complete', 'Your profile is now verified', NULL, NULL, 1, '2024-01-14T09:00:00');

INSERT INTO user_settings (user_id, push_notifications, dark_mode, language, updated_at) VALUES
  ('user-1', 1, 0, 'en', '2024-01-15T08:00:00');

INSERT INTO location_permissions (user_id, has_permission, detected_city, granted_at) VALUES
  ('user-1', 1, 'Ahmedabad', '2024-01-01T10:00:00');

INSERT INTO verification_requests (
  id, user_id, phone, id_document_url, status, submitted_at, verified_at, notes
) VALUES
  ('verification-1', 'user-1', '+919876543210', 'https://example.com/id/user-1.png', 'approved', '2024-01-02T10:00:00', '2024-01-02T16:00:00', 'Auto approved after manual review');
