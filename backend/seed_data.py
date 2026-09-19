
import random
from datetime import datetime, date, timedelta
from flask_bcrypt import Bcrypt
from models import (db, User, Property, Room, PropertyImage,
                    Booking, Guest, Review, Notification,
                    Pricing, AIListing, AIRecommendation)

bcrypt = Bcrypt()
random.seed(42)

FIRST = ['Aarav','Aditya','Akash','Amit','Anjali','Ankit','Ananya','Arjun','Aryan',
         'Deepak','Deepika','Divya','Gaurav','Ishaan','Kabir','Karan','Kavya','Khushi',
         'Kunal','Lakshmi','Manish','Meera','Mohit','Naman','Neha','Nikhil','Nitin',
         'Pooja','Priya','Rahul','Rajesh','Riya','Rohit','Rohan','Sachin','Sangeeta',
         'Sanjay','Sara','Shivam','Shreya','Simran','Sneha','Sonal','Suresh','Tanvi',
         'Varun','Vikram','Vikas','Yash','Zara','Aditi','Bhavna','Chetan','Disha',
         'Eshaan','Gauri','Harsh','Isha','Jatin','Kiran','Lalit','Mohan','Nisha',
         'Onkar','Puja','Ramesh','Shweta','Tejas','Usha','Vivek','Yamini','Aakash',
         'Bhavesh','Chandni','Dev','Ekta','Farah','Girish','Hema','Imran','Jyoti']
LAST  = ['Sharma','Verma','Patel','Gupta','Kumar','Singh','Joshi','Mehta','Nair',
         'Reddy','Iyer','Mishra','Sinha','Rao','Pandey','Kapoor','Malhotra','Bose',
         'Pillai','Chatterjee','Agarwal','Bajaj','Chopra','Das','Dubey','Gandhi',
         'Hegde','Jain','Kaur','Lal','More','Naik','Qureshi','Rajan','Shetty',
         'Tiwari','Varma','Yadav','Ahuja','Bakshi','Chauhan','Deshpande','Gaikwad',
         'Khanna','Menon','Patil','Pillai','Shah','Thakur','Walia']

def rand_name():
    return f"{random.choice(FIRST)} {random.choice(LAST)}"

def rand_email(name, idx):
    slug = name.lower().replace(' ','.')
    domains = ['gmail.com','yahoo.com','hotmail.com','outlook.com','rediffmail.com']
    return f"{slug}{idx}@{random.choice(domains)}"

def rand_phone():
    return f"+91 {random.randint(6,9)}{random.randint(100000000,999999999)}"

def rand_country():
    return random.choice(['India','India','India','USA','UK','Australia','UAE','Singapore'])

REVIEW_TEXTS = [
    "Absolutely loved this place! Clean, cozy, and exactly as described. Will definitely come back.",
    "Stunning views and impeccable hospitality. The host was very helpful and responsive.",
    "Perfect location for our family trip. The property had everything we needed.",
    "Great value for money. The amenities were top-notch and the ambiance was serene.",
    "The breakfast arranged by the host was delicious. Overall an amazing experience!",
    "Beautiful property nestled in nature. Highly recommended for a peaceful getaway.",
    "Loved this stay! The rooms were spotless and the decor was tasteful. 10/10.",
    "Loved the local tips shared by the host. Made our trip much more enjoyable.",
    "The pool was amazing and the BBQ setup was a bonus. Great for groups!",
    "Authentic experience with warm hospitality. Felt like home away from home.",
    "The property photos were accurate, if not better in person. Very honest listing.",
    "Fantastic for a solo traveller. Safe, clean, and great WiFi for remote work.",
    "The mountain views from the balcony were absolutely breathtaking!",
    "Proximity to beach was the highlight. Walked out and were on the sand in minutes.",
    "Heritage property with modern amenities. Best of both worlds!",
    "Very prompt check-in process. Host had everything organized perfectly.",
    "Loved the garden area. Kids had a wonderful time. Perfect family vacation spot.",
    "Exceeded our expectations in every way. Already planning our next visit!",
    "Incredible property with thoughtful touches everywhere. Highly professional host.",
    "Good location but the WiFi could be better. Otherwise a very pleasant stay.",
    "Peaceful retreat from the city hustle. Exactly what we needed.",
    "The evening sunset views were magical. Worth every rupee!",
    "Staff was attentive and the food recommendations were spot on.",
    "A hidden gem! We were blown away by the quality for the price.",
    "The Trustora verified badge was reassuring. Property matched every description.",
]

PROPERTIES_DATA = [
    dict(name='Azure Beach Villa', city='Goa', state='Goa', address='Calangute Beach Road, North Goa',
         ptype='villa', price=8500, rooms=4, baths=4, guests=8, trust=96, lat=15.544, lng=73.752,
         desc='Luxury beachfront villa with private pool, 4 en-suite bedrooms, and breathtaking Arabian Sea views.',
         img='https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'),
    dict(name='Sunset Guesthouse Goa', city='Goa', state='Goa', address='Anjuna Village, North Goa',
         ptype='homestay', price=3200, rooms=6, baths=4, guests=10, trust=88, lat=15.573, lng=73.744,
         desc='Cozy guesthouse surrounded by coconut groves, 5 min walk to Anjuna Beach. Home-cooked Goan breakfast.',
         img='https://images.unsplash.com/photo-1601605650959-cf2b94a81c18?w=800'),
    dict(name='Palolem Palm Resort', city='Goa', state='Goa', address='Palolem Beach, South Goa',
         ptype='resort', price=15000, rooms=8, baths=8, guests=16, trust=94, lat=15.010, lng=74.024,
         desc='Premium boutique resort steps from serene Palolem Beach. Yoga deck, spa, and private beach chairs.',
         img='https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'),
    dict(name='Himalayan Snow Chalet', city='Manali', state='Himachal Pradesh', address='Old Manali Road',
         ptype='cottage', price=6200, rooms=4, baths=3, guests=6, trust=91, lat=32.253, lng=77.179,
         desc='Rustic-chic wooden chalet with panoramic snow-peak views. Fireplace, bonfire area, homemade meals.',
         img='https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'),
    dict(name='Solang Valley Homestay', city='Manali', state='Himachal Pradesh', address='Solang Nala Road',
         ptype='homestay', price=2800, rooms=3, baths=2, guests=5, trust=85, lat=32.328, lng=77.142,
         desc='Authentic Himachali family homestay near the adventure sports hub. Local meals and trekking guidance.',
         img='https://images.unsplash.com/photo-1612810806695-30f7a8258391?w=800'),
    dict(name='Amber Heritage Haveli', city='Jaipur', state='Rajasthan', address='Near Amber Fort, Amer',
         ptype='heritage hotel', price=12000, rooms=6, baths=6, guests=12, trust=95, lat=26.986, lng=75.851,
         desc='Exquisite 200-year-old haveli converted into luxury boutique hotel. Mughal frescoes, rooftop dining.',
         img='https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800'),
    dict(name='Pink City Boutique Inn', city='Jaipur', state='Rajasthan', address='MI Road, Pink City Area',
         ptype='hotel', price=5500, rooms=8, baths=8, guests=16, trust=89, lat=26.912, lng=75.788,
         desc='Modern boutique hotel in the heart of Jaipur. Rajasthani decor meets contemporary comfort.',
         img='https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800'),
    dict(name='Royal Rambagh Palace Suite', city='Jaipur', state='Rajasthan', address='Bhawani Singh Road',
         ptype='resort', price=25000, rooms=4, baths=4, guests=8, trust=98, lat=26.883, lng=75.797,
         desc='Royal palace suites with gold-leaf interiors, butler service, and legendary palace gardens.',
         img='https://images.unsplash.com/photo-1548918901-9f4b1d2db39a?w=800'),
    dict(name='Alleppey Houseboat Stay', city='Alleppey', state='Kerala', address='DTPC Jetty Road, Alleppey',
         ptype='resort', price=9000, rooms=3, baths=3, guests=6, trust=92, lat=9.498, lng=76.339,
         desc='Traditional Kerala houseboat (Kettuvallam) with AC bedrooms, sit-out deck, and live fishing.',
         img='https://images.unsplash.com/photo-1601001435957-74f9e52d4e3b?w=800'),
    dict(name='Munnar Plantation Villa', city='Munnar', state='Kerala', address='Devikulam, Munnar',
         ptype='villa', price=7500, rooms=5, baths=4, guests=10, trust=90, lat=10.089, lng=77.059,
         desc='Luxury villa in a working tea plantation. Morning tea walks, bonfire nights, valley views.',
         img='https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=800'),
    dict(name='Kumarakom Backwater Retreat', city='Kumarakom', state='Kerala', address='Kottayam-Kumarakom Road',
         ptype='resort', price=13000, rooms=6, baths=6, guests=12, trust=93, lat=9.614, lng=76.428,
         desc='Exclusive lakeside resort with infinity pool overlooking Vembanad Lake. Ayurvedic spa, canoe rides.',
         img='https://images.unsplash.com/photo-1596700698255-b2b5c9b3e9a0?w=800'),
    dict(name='Indiranagar Urban Studio', city='Bangalore', state='Karnataka', address='12th Main, Indiranagar',
         ptype='apartment', price=3800, rooms=4, baths=3, guests=6, trust=86, lat=12.978, lng=77.641,
         desc='Contemporary co-living studios in Bangalore\'s trendiest neighborhood. Co-working space included.',
         img='https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'),
    dict(name='Whitefield Garden Villa', city='Bangalore', state='Karnataka', address='EPIP Zone, Whitefield',
         ptype='villa', price=8000, rooms=5, baths=4, guests=10, trust=88, lat=12.980, lng=77.750,
         desc='Spacious garden villa in Whitefield with private terrace, BBQ pit, and lush landscaped grounds.',
         img='https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800'),
    dict(name='Marine Drive Sea View Flat', city='Mumbai', state='Maharashtra', address='Marine Drive, Churchgate',
         ptype='apartment', price=12000, rooms=3, baths=3, guests=6, trust=92, lat=18.943, lng=72.824,
         desc='Premium sea-view apartment on the iconic Queen\'s Necklace. Unobstructed Arabian Sea views.',
         img='https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800'),
    dict(name='Bandra Boutique Hotel', city='Mumbai', state='Maharashtra', address='Hill Road, Bandra West',
         ptype='hotel', price=9500, rooms=6, baths=6, guests=12, trust=90, lat=19.059, lng=72.836,
         desc='Chic boutique hotel in Bandra, steps from Bandstand promenade and the city\'s best cafes.',
         img='https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800'),
    dict(name='Lake Pichola Palace View', city='Udaipur', state='Rajasthan', address='Gangaur Ghat Road',
         ptype='heritage hotel', price=18000, rooms=4, baths=4, guests=8, trust=97, lat=24.577, lng=73.683,
         desc='Opulent heritage hotel with floor-to-ceiling lake views, Mewar-style interiors, rooftop dining.',
         img='https://images.unsplash.com/photo-1557174949-3de3d4f1da33?w=800'),
    dict(name='Fateh Sagar Rooftop Haveli', city='Udaipur', state='Rajasthan', address='Fateh Sagar Road',
         ptype='homestay', price=8500, rooms=5, baths=4, guests=10, trust=89, lat=24.597, lng=73.666,
         desc='Authentic haveli with a stunning rooftop terrace and the best lakeside view in Udaipur.',
         img='https://images.unsplash.com/photo-1571771919582-c1087a4a86be?w=800'),
    dict(name='Ganga Riverside Cottage', city='Rishikesh', state='Uttarakhand', address='Lakshman Jhula',
         ptype='cottage', price=4500, rooms=4, baths=3, guests=6, trust=87, lat=30.128, lng=78.323,
         desc='Tranquil riverside cottage with private Ganga access, meditation deck, and dawn yoga sessions.',
         img='https://images.unsplash.com/photo-1545156521-77bd85671d30?w=800'),
    dict(name='Swarg Ashram Yoga Retreat', city='Rishikesh', state='Uttarakhand', address='Swarg Ashram Road',
         ptype='resort', price=6500, rooms=6, baths=5, guests=12, trust=91, lat=30.114, lng=78.313,
         desc='Luxury wellness retreat with certified yoga instructors, Ayurvedic spa, and sattvic cuisine.',
         img='https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800'),
    dict(name='Tiger Hill Tea Estate', city='Darjeeling', state='West Bengal', address='Tiger Hill Road',
         ptype='cottage', price=7200, rooms=4, baths=3, guests=7, trust=90, lat=26.978, lng=88.243,
         desc='Bungalow set amidst tea gardens with panoramic Kanchenjunga views. Watch the sunrise over Everest!',
         img='https://images.unsplash.com/photo-1544621401-5e3d4937bef3?w=800'),
    dict(name='Colonial Heritage Cottage Shimla', city='Shimla', state='Himachal Pradesh', address='Mall Road',
         ptype='cottage', price=5500, rooms=4, baths=3, guests=8, trust=88, lat=31.104, lng=77.167,
         desc='Charming British-era colonial cottage on the famous Mall Road with valley views and fireplace.',
         img='https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=800'),
    dict(name='Jakhu Hills Inn Shimla', city='Shimla', state='Himachal Pradesh', address='Jakhu Temple Road',
         ptype='hotel', price=3800, rooms=6, baths=5, guests=12, trust=84, lat=31.110, lng=77.180,
         desc='Cozy hill-station inn near Jakhu Temple. Great food, warm hospitality, stunning Himalayan views.',
         img='https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800'),
    dict(name='Nilgiris Plantation Stay', city='Ooty', state='Tamil Nadu', address='Doddabetta Road',
         ptype='homestay', price=5000, rooms=4, baths=3, guests=8, trust=86, lat=11.414, lng=76.693,
         desc='Tranquil homestay amidst eucalyptus and tea plantations. Morning mist walks, fresh organic produce.',
         img='https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'),
    dict(name='Honey Valley Coffee Estate', city='Coorg', state='Karnataka', address='Galibeedu, Madikeri',
         ptype='cottage', price=6800, rooms=4, baths=3, guests=8, trust=92, lat=12.358, lng=75.824,
         desc='Off-grid coffee estate cottage in the mist. Plantation tours, elephant spotting, jungle treks.',
         img='https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=800'),
    dict(name='Ladakh Mountain Homestay', city='Leh', state='Jammu & Kashmir', address='Changspa Road, Leh',
         ptype='homestay', price=4500, rooms=3, baths=2, guests=5, trust=89, lat=34.167, lng=77.583,
         desc='Authentic Ladakhi homestay with panoramic views of Stok Kangri. Butter tea and traditional cuisine.',
         img='https://images.unsplash.com/photo-1558979158-65a1eaa08691?w=800'),
]

ROOM_TYPES_POOL = [
    ('Standard Room',  'double', 2, 1.0),
    ('Deluxe Room',    'queen',  2, 1.3),
    ('Superior Room',  'king',   2, 1.5),
    ('Premium Suite',  'king',   3, 2.0),
    ('Family Room',    'twin',   4, 1.8),
    ('Studio Loft',    'double', 2, 1.2),
    ('Garden Cottage', 'queen',  2, 1.4),
    ('Penthouse Suite','king',   4, 2.5),
]


def seed_database(app):
    with app.app_context():
        if Property.query.count() >= 20:
            print("[seed] Expanded data already present. Skipping.")
            return

        print("[seed] Starting expanded seed — 25 properties, 150 guests, 300+ bookings...")

        # ── Demo accounts ────────────────────────────────────────────────────
        DEMO_ACCOUNTS = [
            # email,                    name,              role,    verified, password
            ('host@trustora.ai',       'Rohan Mehta',     'host',  True,    'host123'),
            ('guest@trustora.ai',      'Priya Sharma',    'guest', False,   'guest123'),
            # Additional guest demo accounts for presentation
            ('arjun@trustora.ai',      'Arjun Kapoor',    'guest', False,   'guest123'),
            ('sneha@trustora.ai',      'Sneha Patel',     'guest', False,   'guest123'),
            ('vikram@trustora.ai',     'Vikram Singh',    'guest', False,   'guest123'),
            ('ananya@trustora.ai',     'Ananya Reddy',    'guest', False,   'guest123'),
            # Restaurant / Cafe host demo
            ('restaurant@trustora.ai', 'Deepa Nair',      'host',  True,    'restaurant123'),
        ]
        for email, name, role, verified, pwd in DEMO_ACCOUNTS:
            if not User.query.filter_by(email=email).first():
                db.session.add(User(
                    name=name, email=email, role=role,
                    password_hash=bcrypt.generate_password_hash(pwd).decode('utf-8'),
                    is_verified_host=verified, phone=rand_phone()
                ))
        db.session.commit()
        host_user        = User.query.filter_by(email='host@trustora.ai').first()
        restaurant_user  = User.query.filter_by(email='restaurant@trustora.ai').first()


        # Properties
        props_created = []
        for pd in PROPERTIES_DATA:
            if Property.query.filter_by(name=pd['name']).first():
                props_created.append(Property.query.filter_by(name=pd['name']).first())
                continue
            p = Property(
                user_id=host_user.id,
                name=pd['name'], property_type=pd['ptype'], description=pd['desc'],
                address=pd['address'], city=pd['city'], state=pd['state'], country='India',
                zip_code=str(random.randint(400001, 799999)),
                latitude=pd['lat'], longitude=pd['lng'],
                base_price=pd['price'], total_rooms=pd['rooms'], total_bathrooms=pd['baths'],
                max_guests=pd['guests'], trust_score=pd['trust'],
                neighborhood_vibe='Vibrant local area with good connectivity'
            )
            db.session.add(p)
            db.session.flush()

            # Primary photo
            db.session.add(PropertyImage(property_id=p.id, image_url=pd['img'],
                caption='Main View', is_primary=True, overall_score=random.randint(85, 98)))
            # Extra photos
            extras = [
                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600',
                'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600',
                'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600',
                'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600',
            ]
            for url in random.sample(extras, 2):
                db.session.add(PropertyImage(property_id=p.id, image_url=url,
                    caption='Interior', is_primary=False, overall_score=random.randint(78, 93)))

            # Rooms — use actual columns: name, room_type, max_occupancy, bed_type, price_per_night, is_available
            n_rooms = pd['rooms']
            sampled = random.choices(ROOM_TYPES_POOL, k=n_rooms)
            for i, (rtype, bed, cap, mult) in enumerate(sampled):
                db.session.add(Room(
                    property_id=p.id,
                    name=f'{rtype} {i+1:02d}',
                    room_type=rtype,
                    max_occupancy=cap,
                    bed_type=bed,
                    price_per_night=round(pd['price'] * mult, -2),
                    is_available=True,
                ))

            # AI Listing
            db.session.add(AIListing(
                property_id=p.id,
                title=f"Stunning {pd['ptype'].title()} in {pd['city']} — Your Perfect Escape",
                description=pd['desc'],
                highlights=f"Trustora Verified | {pd['rooms']} Rooms | Up to {pd['guests']} Guests",
                seo_description=f"Book {pd['name']} in {pd['city']}, {pd['state']}. {pd['desc'][:100]}",
                tone='professional',
            ))

            # AI Recommendation
            recs = [
                ('pricing',   'Optimize Weekend Pricing',       'Increase weekend rates by 25% to capture peak demand.', 'high'),
                ('listing',   'Add More Photos',                'Properties with 10+ photos get 3x more bookings.',      'medium'),
                ('marketing', 'Enable Instant Book',            'Instant booking increases revenue by 25%.',             'high'),
            ]
            for cat, title, rec, impact in random.sample(recs, 2):
                db.session.add(AIRecommendation(
                    property_id=p.id, category=cat, title=title,
                    recommendation=rec, reasoning='Based on platform analytics.',
                    potential_impact=impact, impact_metric='bookings',
                    is_applied=random.random() < 0.3
                ))

            props_created.append(p)
        db.session.commit()
        print(f"[seed] {len(props_created)} properties created")

        # Guests (150)
        guests_created = []
        seen_emails = set(e for (e,) in db.session.query(Guest.email).all())
        for idx in range(150):
            name  = rand_name()
            email = rand_email(name, idx)
            if email in seen_emails:
                email = email.replace('@', f'{idx}@')
            seen_emails.add(email)
            g = Guest(
                name=name, email=email, phone=rand_phone(),
                country=rand_country(),
                trust_rating=round(random.uniform(3.5, 5.0), 1),
            )
            db.session.add(g)
            guests_created.append(g)
        db.session.flush()
        db.session.commit()
        print(f"[seed] {len(guests_created)} guests created")

        # Bookings (300) — use actual columns: guest_count, channel, total_nights
        today   = date.today()
        statuses = ['confirmed','confirmed','confirmed','pending','completed','cancelled']
        bookings_created = []
        for _ in range(300):
            prop   = random.choice(props_created)
            guest  = random.choice(guests_created)
            nights = random.randint(1, 7)
            offset = random.randint(-180, 90)
            check_in  = today + __import__('datetime').timedelta(days=offset)
            check_out = check_in + __import__('datetime').timedelta(days=nights)
            status = random.choice(statuses)
            if check_out < today:
                status = random.choice(['completed', 'completed', 'cancelled'])
            elif check_in > today:
                status = random.choice(['confirmed', 'pending'])
            total = prop.base_price * nights * random.uniform(0.9, 1.3)
            b = Booking(
                property_id=prop.id,
                guest_id=guest.id,
                check_in=check_in,
                check_out=check_out,
                total_nights=nights,
                guest_count=random.randint(1, min(4, prop.max_guests)),
                total_amount=round(total, 2),
                status=status,
                special_requests=random.choice(['','','Early check-in please','Late checkout if possible',
                    'Airport pickup needed','Vegetarian meals only','Quiet room please']),
                channel=random.choice(['direct','airbnb','booking.com','makemytrip','expedia','direct','direct']),
                payment_status='paid' if status in ('confirmed','completed') else ('refunded' if status == 'cancelled' else 'pending'),
                booking_reference=f'TR{random.randint(100000,999999)}',
            )
            db.session.add(b)
            bookings_created.append(b)
        db.session.flush()
        db.session.commit()
        print(f"[seed] {len(bookings_created)} bookings created")

        # Reviews (200) — actual columns: guest_name, rating, title, comment, review_date, sentiment, verified_stay
        reviewed_pairs = set()
        reviews_created = 0
        for b in bookings_created:
            if b.status not in ('completed', 'confirmed'):
                continue
            pair = (b.guest_id, b.property_id)
            if pair in reviewed_pairs or random.random() > 0.72:
                continue
            reviewed_pairs.add(pair)
            rating = random.choices([3, 4, 4, 5, 5, 5], k=1)[0]
            g = Guest.query.get(b.guest_id)
            review_date = (b.check_out + __import__('datetime').timedelta(days=random.randint(1,10))
                           if b.check_out else today)
            db.session.add(Review(
                property_id=b.property_id,
                guest_name=g.name if g else rand_name(),
                rating=rating,
                title=random.choice(['Wonderful Stay!','Great Experience','Highly Recommended',
                    'Perfect Getaway','Loved Every Moment','Amazing Property','Will Visit Again']),
                comment=random.choice(REVIEW_TEXTS),
                review_date=review_date,
                sentiment='positive' if rating >= 4 else ('neutral' if rating == 3 else 'negative'),
                verified_stay=True,
                anomaly_flag=(random.random() < 0.04),
            ))
            reviews_created += 1
            if reviews_created >= 200:
                break
        db.session.commit()
        print(f"[seed] {reviews_created} reviews created")

        # Notifications (50)
        notif_templates = [
            ('New Booking!',           'You have a new booking for {prop}.'),
            ('5-Star Review!',         'A guest left a 5-star review for {prop}.'),
            ('Price Alert',            'Competitor prices shifted in {city}. Check your pricing.'),
            ('Trustora Alert',         'Review anomaly detected for {prop}. Check your radar.'),
            ('Occupancy Milestone',    '{prop} hit 90% occupancy this month!'),
            ('AI Tip Ready',           'New AI growth recommendation available for {prop}.'),
        ]
        for _ in range(50):
            prop = random.choice(props_created)
            title, msg_tmpl = random.choice(notif_templates)
            db.session.add(Notification(
                user_id=host_user.id,
                title=title,
                message=msg_tmpl.replace('{prop}', prop.name).replace('{city}', prop.city),
                notification_type=random.choice(['booking','review','alert','tip','milestone']),
                is_read=random.random() < 0.5,
            ))
        db.session.commit()
        print("[seed] Done! 25 properties, 150 guests, 300 bookings, 200 reviews, 50 notifications.")
        
        # Seed the 4 verified guest dummy accounts
        seed_dummy_guests(app)


def seed_dummy_guests(app=None):
    """Seed 4 verified guest accounts with passbooking records and reviews."""
    from datetime import date, timedelta
    import random

    ctx = app.app_context() if app else None
    if ctx:
        ctx.push()

    try:
        pw_hash = bcrypt.generate_password_hash('1234').decode('utf-8')
        today = date.today()
        properties = Property.query.all()
        if not properties:
            print("[seed_dummy_guests] No properties found in database.")
            return

        guests_data = [
            {
                'name': 'Aarav Patel',
                'email': 'aarav@gmail.com',
                'phone': '+91 98201 54321',
                'avatar': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                'bookings': [
                    {'prop_idx': 0, 'offset': -35, 'nights': 3, 'guests': 2, 'status': 'checked_out', 'amount': 25500.0, 'channel': 'Trustora Direct'},
                    {'prop_idx': 1, 'offset': -75, 'nights': 4, 'guests': 3, 'status': 'checked_out', 'amount': 24800.0, 'channel': 'Airbnb'},
                    {'prop_idx': 2, 'offset': 10, 'nights': 2, 'guests': 2, 'status': 'confirmed', 'amount': 18000.0, 'channel': 'Trustora Direct'},
                ],
                'reviews': [
                    {'prop_idx': 0, 'rating': 5.0, 'title': 'Magical Stay & Superb Host', 'comment': 'The villa was stunning with a crystal-clear private pool and authentic Goan hospitality. The Trustora verification badge was 100% accurate!'},
                    {'prop_idx': 1, 'rating': 5.0, 'title': 'Snow Peaks & Cozy Fireplace', 'comment': 'Exceptional mountain retreat. Fast WiFi allowed us to work comfortably with pine forest views.'}
                ]
            },
            {
                'name': 'Ananya Sharma',
                'email': 'ananya@gmail.com',
                'phone': '+91 98112 34567',
                'avatar': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
                'bookings': [
                    {'prop_idx': 3, 'offset': -40, 'nights': 3, 'guests': 2, 'status': 'checked_out', 'amount': 21000.0, 'channel': 'Trustora Direct'},
                    {'prop_idx': 4, 'offset': -95, 'nights': 2, 'guests': 2, 'status': 'checked_out', 'amount': 14000.0, 'channel': 'Booking.com'},
                    {'prop_idx': 0, 'offset': 15, 'nights': 5, 'guests': 4, 'status': 'confirmed', 'amount': 42500.0, 'channel': 'Trustora Direct'},
                ],
                'reviews': [
                    {'prop_idx': 3, 'rating': 5.0, 'title': 'Serene Backwater Oasis', 'comment': 'Calm, pristine, and surrounded by nature. Organic Kerala breakfast served every morning was top tier.'},
                    {'prop_idx': 4, 'rating': 4.5, 'title': 'Heritage Charm with Modern Comfort', 'comment': 'Courtyard and traditional Rajasthani decor were beautiful. Very safe and central neighbourhood.'}
                ]
            },
            {
                'name': 'Rohit Verma',
                'email': 'rohit@gmail.com',
                'phone': '+91 98334 56789',
                'avatar': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
                'bookings': [
                    {'prop_idx': 1, 'offset': -50, 'nights': 4, 'guests': 2, 'status': 'checked_out', 'amount': 24000.0, 'channel': 'Trustora Direct'},
                    {'prop_idx': 2, 'offset': -110, 'nights': 3, 'guests': 2, 'status': 'checked_out', 'amount': 16500.0, 'channel': 'WhatsApp Concierge'},
                    {'prop_idx': 5, 'offset': -180, 'nights': 2, 'guests': 1, 'status': 'checked_out', 'amount': 12000.0, 'channel': 'Direct Booking'},
                ],
                'reviews': [
                    {'prop_idx': 1, 'rating': 5.0, 'title': 'Best Mountain Stay Ever', 'comment': 'Clean wooden interiors, heater worked flawlessly, and the host gave great hiking route tips!'},
                    {'prop_idx': 2, 'rating': 4.8, 'title': 'Peaceful Riverside Sanctuary', 'comment': 'Meditative atmosphere by the river. Clean rooms and very polite housekeeping staff.'}
                ]
            },
            {
                'name': 'Meera Iyer',
                'email': 'meera@gmail.com',
                'phone': '+91 98450 12345',
                'avatar': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
                'bookings': [
                    {'prop_idx': 0, 'offset': -20, 'nights': 3, 'guests': 3, 'status': 'checked_out', 'amount': 27000.0, 'channel': 'Trustora Direct'},
                    {'prop_idx': 4, 'offset': -80, 'nights': 3, 'guests': 2, 'status': 'checked_out', 'amount': 25500.0, 'channel': 'Trustora Direct'},
                    {'prop_idx': 3, 'offset': 20, 'nights': 4, 'guests': 2, 'status': 'confirmed', 'amount': 32000.0, 'channel': 'Trustora Direct'},
                ],
                'reviews': [
                    {'prop_idx': 0, 'rating': 5.0, 'title': 'Flawless Beach Vacation', 'comment': 'Walking distance to the beach. Highly accurate listing description and effortless self-checkin.'},
                    {'prop_idx': 4, 'rating': 5.0, 'title': 'Spectacular Lake Views', 'comment': 'Watching the sunset from the terrace over Lake Pichola was unforgettable. 10/10 recommendation!'}
                ]
            }
        ]

        for g_data in guests_data:
            # 1. User Account
            user = User.query.filter_by(email=g_data['email']).first()
            if not user:
                user = User(
                    name=g_data['name'],
                    email=g_data['email'],
                    password_hash=pw_hash,
                    phone=g_data['phone'],
                    role='guest',
                    is_verified_host=False,
                    avatar_url=g_data['avatar']
                )
                db.session.add(user)
                db.session.flush()
            else:
                user.name = g_data['name']
                user.password_hash = pw_hash
                user.role = 'guest'
                user.avatar_url = g_data['avatar']
                db.session.flush()

            # 2. Guest Profile
            guest = Guest.query.filter_by(email=g_data['email']).first()
            if not guest:
                guest = Guest(
                    name=g_data['name'],
                    email=g_data['email'],
                    phone=g_data['phone'],
                    trust_rating=4.9,
                    avatar_url=g_data['avatar']
                )
                db.session.add(guest)
                db.session.flush()
            else:
                guest.name = g_data['name']
                guest.avatar_url = g_data['avatar']
                db.session.flush()

            # 3. Bookings (Link to both user.id and guest.id)
            for b_spec in g_data['bookings']:
                p = properties[b_spec['prop_idx'] % len(properties)]
                cin = today + timedelta(days=b_spec['offset'])
                cout = cin + timedelta(days=b_spec['nights'])
                b_ref = f"TR-{random.randint(10000, 99999)}"
                
                existing_bk = Booking.query.filter_by(property_id=p.id, guest_id=user.id, check_in=cin).first()
                if not existing_bk:
                    bk = Booking(
                        booking_reference=b_ref,
                        property_id=p.id,
                        guest_id=user.id,
                        check_in=cin,
                        check_out=cout,
                        total_nights=b_spec['nights'],
                        guest_count=b_spec['guests'],
                        total_amount=b_spec['amount'],
                        status=b_spec['status'],
                        payment_status='paid',
                        channel=b_spec['channel'],
                        created_at=datetime.combine(cin - timedelta(days=12), datetime.min.time())
                    )
                    db.session.add(bk)

            # 4. Reviews (insert under both full name and short name so it matches any format)
            for r_spec in g_data['reviews']:
                p = properties[r_spec['prop_idx'] % len(properties)]
                for name_variant in [g_data['name'], g_data['name'].split()[0]]:
                    existing_rev = Review.query.filter_by(property_id=p.id, guest_name=name_variant).first()
                    if not existing_rev:
                        rev = Review(
                            property_id=p.id,
                            guest_name=name_variant,
                            guest_avatar=g_data['avatar'],
                            rating=r_spec['rating'],
                            title=r_spec['title'],
                            comment=r_spec['comment'],
                            review_date=today - timedelta(days=random.randint(5, 45)),
                            sentiment='Positive',
                            verified_stay=True
                        )
                        db.session.add(rev)

        db.session.commit()
        print("[seed_dummy_guests] Successfully created 4 dummy guest accounts with past bookings and reviews!")
    except Exception as e:
        db.session.rollback()
        print(f"[seed_dummy_guests] Error: {e}")
    finally:
        if ctx:
            ctx.pop()


def rebalance_host_properties(app=None):
    """Ensure Sarthak owns exactly 3 properties, and other hosts own their respective portfolios."""
    from models import db, User, Property, PropertyImage, Booking, Guest
    from datetime import date, timedelta
    import random

    ctx = app.app_context() if app else None
    if ctx:
        ctx.push()

    try:
        today = date.today()
        # 1. Find or create Sarthak User
        sarthak_users = User.query.filter((User.email == 'sarthakskale27@gmail.com') | (User.email == 'host@hostboost.ai') | (User.email.ilike('%sarthak%'))).all()
        sarthak = next((u for u in sarthak_users if u.email == 'sarthakskale27@gmail.com'), None)
        if not sarthak and sarthak_users:
            sarthak = sarthak_users[0]

        if not sarthak:
            pw_hash = bcrypt.generate_password_hash('password123').decode('utf-8')
            sarthak = User(
                name='Sarthak Kale',
                email='sarthakskale27@gmail.com',
                password_hash=pw_hash,
                phone='+91 98230 11223',
                role='host',
                is_verified_host=True
            )
            db.session.add(sarthak)
            db.session.flush()
        else:
            for u in sarthak_users:
                u.role = 'host'
                u.is_verified_host = True
            db.session.flush()

        # 2. Find Rohan Mehta
        rohan = User.query.filter_by(email='host@trustora.ai').first()
        if not rohan:
            pw_hash = bcrypt.generate_password_hash('password123').decode('utf-8')
            rohan = User(
                name='Rohan Mehta',
                email='host@trustora.ai',
                password_hash=pw_hash,
                phone='+91 98200 11222',
                role='host',
                is_verified_host=True
            )
            db.session.add(rohan)
            db.session.flush()

        # 3. Create or update Sarthak's 3 properties
        sarthak_props_specs = [
            {
                'name': "Sarthak's Heritage Sanctuary & Beachfront Villa",
                'city': 'Goa', 'state': 'Goa', 'address': 'Calangute Beach Road, North Goa',
                'property_type': 'villa', 'base_price': 9500.0, 'total_rooms': 3, 'total_bathrooms': 3, 'max_guests': 6,
                'trust_score': 96, 'neighborhood_vibe': 'Beachfront, scenic cafes, 24/7 security',
                'img': 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914'
            },
            {
                'name': "Sarthak's Himalayan Snow Pine Chalet",
                'city': 'Manali', 'state': 'Himachal Pradesh', 'address': 'Old Manali Pine Forest Ridge',
                'property_type': 'chalet', 'base_price': 6800.0, 'total_rooms': 2, 'total_bathrooms': 2, 'max_guests': 4,
                'trust_score': 95, 'neighborhood_vibe': 'Scenic mountain trails, peaceful & safe',
                'img': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4'
            },
            {
                'name': "Sarthak's Lakeview Royal Heritage Suite",
                'city': 'Udaipur', 'state': 'Rajasthan', 'address': 'Near Lake Pichola Ghat, Udaipur',
                'property_type': 'heritage', 'base_price': 8200.0, 'total_rooms': 2, 'total_bathrooms': 2, 'max_guests': 4,
                'trust_score': 97, 'neighborhood_vibe': 'Romantic lakefront, historic ghats, cultural center',
                'img': 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10'
            }
        ]

        # Reset any existing properties currently assigned to Sarthak to avoid overflow
        existing_s_props = Property.query.filter_by(user_id=sarthak.id).all()
        for p in existing_s_props:
            if not any(spec['name'] in p.name for spec in sarthak_props_specs):
                p.user_id = rohan.id
        db.session.flush()

        channels = ['Airbnb', 'Booking.com', 'WhatsApp Concierge', 'Trustora Direct', 'Direct Booking']
        guests = Guest.query.limit(10).all()

        for spec in sarthak_props_specs:
            p = Property.query.filter_by(name=spec['name']).first()
            if not p:
                p = Property(
                    user_id=sarthak.id,
                    name=spec['name'],
                    property_type=spec['property_type'],
                    description=f"Exclusive luxury stay hosted by Sarthak with premium amenities, verified authentic listing.",
                    address=spec['address'],
                    city=spec['city'],
                    state=spec['state'],
                    country='India',
                    zip_code='403516',
                    base_price=spec['base_price'],
                    total_rooms=spec['total_rooms'],
                    total_bathrooms=spec['total_bathrooms'],
                    max_guests=spec['max_guests'],
                    trust_score=spec['trust_score'],
                    neighborhood_vibe=spec['neighborhood_vibe']
                )
                db.session.add(p)
                db.session.flush()

                p_img = PropertyImage(
                    property_id=p.id,
                    image_url=spec['img'],
                    caption="Main Front View",
                    is_primary=True,
                    overall_score=95
                )
                db.session.add(p_img)
            else:
                p.user_id = sarthak.id
                p.base_price = spec['base_price']
                p.trust_score = spec['trust_score']
                db.session.flush()

            # Ensure bookings for Sarthak's properties
            if not p.bookings or len(p.bookings) < 4:
                for idx, ch in enumerate(channels):
                    cin = today - timedelta(days=(idx + 1) * 8)
                    cout = cin + timedelta(days=3)
                    g = guests[idx % len(guests)] if guests else None
                    bk = Booking(
                        booking_reference=f"TR-{random.randint(10000, 99999)}",
                        property_id=p.id,
                        guest_id=g.id if g else 1,
                        check_in=cin,
                        check_out=cout,
                        total_nights=3,
                        guest_count=2,
                        total_amount=float(p.base_price * 3),
                        status='checked_out' if idx > 0 else 'confirmed',
                        payment_status='paid',
                        channel=ch,
                        created_at=datetime.combine(cin - timedelta(days=10), datetime.min.time())
                    )
                    db.session.add(bk)

        db.session.commit()
        print(f"[rebalance_host_properties] Sarthak (ID: {sarthak.id}) now owns EXACTLY 3 luxury properties!")
    except Exception as e:
        db.session.rollback()
        print(f"[rebalance_host_properties] Error: {e}")
    finally:
        if ctx:
            ctx.pop()
