from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(30), nullable=True)
    role = db.Column(db.String(20), default='host')
    is_verified_host = db.Column(db.Boolean, default=False)
    verification_documents = db.Column(db.Text, nullable=True)
    avatar_url = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    properties = db.relationship('Property', backref='owner', lazy=True, cascade='all, delete-orphan')
    notifications = db.relationship('Notification', backref='user', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'role': self.role,
            'is_verified_host': self.is_verified_host,
            'avatar_url': self.avatar_url,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Amenity(db.Model):
    __tablename__ = 'amenities'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    category = db.Column(db.String(50), default='General')
    icon = db.Column(db.String(50), nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'icon': self.icon
        }

property_amenities = db.Table('property_amenities',
    db.Column('property_id', db.Integer, db.ForeignKey('properties.id', ondelete='CASCADE'), primary_key=True),
    db.Column('amenity_id', db.Integer, db.ForeignKey('amenities.id', ondelete='CASCADE'), primary_key=True)
)

class Property(db.Model):
    __tablename__ = 'properties'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    name = db.Column(db.String(200), nullable=False)
    property_type = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=True)
    address = db.Column(db.String(255), nullable=False)
    city = db.Column(db.String(100), nullable=False, index=True)
    state = db.Column(db.String(100), nullable=False)
    country = db.Column(db.String(100), default='India')
    zip_code = db.Column(db.String(20), nullable=True)
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    base_price = db.Column(db.Float, nullable=False, default=2000.0)
    currency = db.Column(db.String(10), default='INR')
    status = db.Column(db.String(20), default='active')
    total_rooms = db.Column(db.Integer, default=1)
    total_bathrooms = db.Column(db.Integer, default=1)
    max_guests = db.Column(db.Integer, default=2)
    
    trust_score = db.Column(db.Integer, default=94)
    neighborhood_vibe = db.Column(db.String(255), default='Serene, Walkable, Near cafes & transit')
    fraud_risk_level = db.Column(db.String(20), default='low')
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    amenities = db.relationship('Amenity', secondary=property_amenities, lazy='subquery', backref=db.backref('properties', lazy=True))
    rooms = db.relationship('Room', backref='property', lazy=True, cascade='all, delete-orphan')
    images = db.relationship('PropertyImage', backref='property', lazy=True, cascade='all, delete-orphan')
    bookings = db.relationship('Booking', backref='property', lazy=True, cascade='all, delete-orphan')
    pricing_records = db.relationship('Pricing', backref='property', lazy=True, cascade='all, delete-orphan')
    reviews = db.relationship('Review', backref='property', lazy=True, cascade='all, delete-orphan')
    ai_listings = db.relationship('AIListing', backref='property', lazy=True, cascade='all, delete-orphan')
    ai_recommendations = db.relationship('AIRecommendation', backref='property', lazy=True, cascade='all, delete-orphan')
    chat_sessions = db.relationship('ChatSession', backref='property', lazy=True, cascade='all, delete-orphan')

    def to_dict(self, include_details=True):
        photos_list = []
        for img in self.images:
            photos_list.append({
                'id': img.id,
                'url': img.image_url,
                'image_url': img.image_url,
                'caption': img.caption or 'Property View',
                'is_hero': img.is_primary,
                'is_primary': img.is_primary,
                'overall_score': img.overall_score
            })

        amenity_names = [a.name for a in self.amenities]
        
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'title': self.name,
            'property_type': self.property_type,
            'description': self.description,
            'address': self.address,
            'city': self.city,
            'state': self.state,
            'country': self.country,
            'pincode': self.zip_code or '403515',
            'zip_code': self.zip_code or '403515',
            'base_price': self.base_price,
            'currency': self.currency,
            'status': self.status,
            'total_rooms': self.total_rooms,
            'rooms_count': self.total_rooms,
            'total_bathrooms': self.total_bathrooms,
            'bathrooms_count': self.total_bathrooms,
            'max_guests': self.max_guests,
            'trust_score': self.trust_score,
            'neighborhood_vibe': self.neighborhood_vibe,
            'fraud_risk_level': self.fraud_risk_level,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'primary_image': self.images[0].image_url if self.images else 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914',
            'photos': photos_list,
            'images': photos_list,
            'amenities': amenity_names,
            'amenities_count': len(self.amenities),
            'rooms': [r.to_dict() for r in self.rooms],
            'recent_reviews': [rev.to_dict() for rev in self.reviews]
        }

class Room(db.Model):
    __tablename__ = 'rooms'
    
    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(db.Integer, db.ForeignKey('properties.id', ondelete='CASCADE'), nullable=False, index=True)
    name = db.Column(db.String(120), nullable=False)
    room_type = db.Column(db.String(50), default='Standard')
    max_occupancy = db.Column(db.Integer, default=2)
    bed_type = db.Column(db.String(50), default='Queen Bed')
    price_per_night = db.Column(db.Float, nullable=False)
    is_available = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'property_id': self.property_id,
            'name': self.name,
            'room_type': self.room_type,
            'max_occupancy': self.max_occupancy,
            'bed_type': self.bed_type,
            'price_per_night': self.price_per_night,
            'is_available': self.is_available
        }

class PropertyImage(db.Model):
    __tablename__ = 'property_images'
    
    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(db.Integer, db.ForeignKey('properties.id', ondelete='CASCADE'), nullable=False, index=True)
    image_url = db.Column(db.String(500), nullable=False)
    thumbnail_url = db.Column(db.String(500), nullable=True)
    caption = db.Column(db.String(150), nullable=True)
    is_primary = db.Column(db.Boolean, default=False)
    brightness_score = db.Column(db.Integer, default=85)
    blur_score = db.Column(db.Integer, default=90)
    composition_score = db.Column(db.Integer, default=88)
    overall_score = db.Column(db.Integer, default=88)
    recommendations = db.Column(db.Text, nullable=True)
    is_duplicate = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'property_id': self.property_id,
            'url': self.image_url,
            'image_url': self.image_url,
            'caption': self.caption or 'Property Photo',
            'is_hero': self.is_primary,
            'is_primary': self.is_primary,
            'overall_score': self.overall_score
        }

class Guest(db.Model):
    __tablename__ = 'guests'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False, index=True)
    phone = db.Column(db.String(30), nullable=True)
    country = db.Column(db.String(100), default='India')
    trust_rating = db.Column(db.Float, default=4.9)
    avatar_url = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    bookings = db.relationship('Booking', backref='guest', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'country': self.country,
            'trust_rating': self.trust_rating,
            'avatar_url': self.avatar_url
        }

class Booking(db.Model):
    __tablename__ = 'bookings'
    
    id = db.Column(db.Integer, primary_key=True)
    booking_reference = db.Column(db.String(30), unique=True, nullable=False, index=True)
    property_id = db.Column(db.Integer, db.ForeignKey('properties.id', ondelete='CASCADE'), nullable=False, index=True)
    room_id = db.Column(db.Integer, db.ForeignKey('rooms.id', ondelete='SET NULL'), nullable=True)
    guest_id = db.Column(db.Integer, db.ForeignKey('guests.id', ondelete='CASCADE'), nullable=False, index=True)
    check_in = db.Column(db.Date, nullable=False)
    check_out = db.Column(db.Date, nullable=False)
    total_nights = db.Column(db.Integer, default=1)
    guest_count = db.Column(db.Integer, default=2)
    total_amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(30), default='confirmed', index=True)
    payment_status = db.Column(db.String(30), default='paid')
    special_requests = db.Column(db.Text, nullable=True)
    channel = db.Column(db.String(50), default='Direct Website')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    room = db.relationship('Room', backref='bookings', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'booking_reference': self.booking_reference,
            'property_id': self.property_id,
            'property': {'id': self.property.id, 'title': self.property.name, 'name': self.property.name, 'city': self.property.city} if self.property else None,
            'guest': self.guest.to_dict() if self.guest else None,
            'guest_name': self.guest.name if self.guest else 'Guest',
            'check_in': self.check_in.strftime('%Y-%m-%d') if self.check_in else None,
            'check_out': self.check_out.strftime('%Y-%m-%d') if self.check_out else None,
            'total_nights': self.total_nights,
            'nights_count': self.total_nights,
            'guest_count': self.guest_count,
            'guests_count': self.guest_count,
            'total_amount': self.total_amount,
            'status': self.status,
            'payment_status': self.payment_status,
            'channel': self.channel,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Pricing(db.Model):
    __tablename__ = 'pricing'
    
    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(db.Integer, db.ForeignKey('properties.id', ondelete='CASCADE'), nullable=False, index=True)
    date = db.Column(db.Date, nullable=False, index=True)
    current_price = db.Column(db.Float, nullable=False)
    recommended_price = db.Column(db.Float, nullable=False)
    min_range = db.Column(db.Float, nullable=False)
    max_range = db.Column(db.Float, nullable=False)
    occupancy_forecast = db.Column(db.Float, default=70.0)
    is_accepted = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    factors = db.relationship('PricingFactor', backref='pricing', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'property_id': self.property_id,
            'date': self.date.strftime('%Y-%m-%d'),
            'current_price': self.current_price,
            'recommended_price': self.recommended_price,
            'min_range': self.min_range,
            'max_range': self.max_range,
            'occupancy_forecast': self.occupancy_forecast,
            'is_accepted': self.is_accepted
        }

class PricingFactor(db.Model):
    __tablename__ = 'pricing_factors'
    
    id = db.Column(db.Integer, primary_key=True)
    pricing_id = db.Column(db.Integer, db.ForeignKey('pricing.id', ondelete='CASCADE'), nullable=False, index=True)
    factor_name = db.Column(db.String(100), nullable=False)
    impact_percent = db.Column(db.Float, default=0.0)
    impact_amount = db.Column(db.Float, default=0.0)
    description = db.Column(db.String(255), nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'factor_name': self.factor_name,
            'impact_percent': self.impact_percent,
            'impact_amount': self.impact_amount,
            'description': self.description
        }

class Review(db.Model):
    __tablename__ = 'reviews'
    
    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(db.Integer, db.ForeignKey('properties.id', ondelete='CASCADE'), nullable=False, index=True)
    guest_name = db.Column(db.String(120), nullable=False)
    guest_avatar = db.Column(db.String(255), nullable=True)
    rating = db.Column(db.Float, default=5.0)
    title = db.Column(db.String(200), nullable=True)
    comment = db.Column(db.Text, nullable=False)
    review_date = db.Column(db.Date, nullable=False)
    sentiment = db.Column(db.String(30), default='Positive')
    anomaly_flag = db.Column(db.Boolean, default=False)
    anomaly_reason = db.Column(db.String(255), nullable=True)
    verified_stay = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'property_id': self.property_id,
            'guest_name': self.guest_name,
            'rating': self.rating,
            'title': self.title,
            'comment': self.comment,
            'review_date': self.review_date.strftime('%Y-%m-%d'),
            'sentiment': self.sentiment,
            'anomaly_flag': self.anomaly_flag,
            'verified_stay': self.verified_stay
        }

class AIListing(db.Model):
    __tablename__ = 'ai_listings'
    
    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(db.Integer, db.ForeignKey('properties.id', ondelete='CASCADE'), nullable=False, index=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    highlights = db.Column(db.Text, nullable=True)
    amenities_summary = db.Column(db.Text, nullable=True)
    seo_description = db.Column(db.Text, nullable=True)
    target_audience = db.Column(db.String(100), default='Couples & Remote Workers')
    tone = db.Column(db.String(50), default='Luxury & Inviting')
    is_published = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'property_id': self.property_id,
            'title': self.title,
            'description': self.description,
            'highlights': self.highlights,
            'seo_description': self.seo_description,
            'is_published': self.is_published
        }

class AIRecommendation(db.Model):
    __tablename__ = 'ai_recommendations'
    
    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(db.Integer, db.ForeignKey('properties.id', ondelete='CASCADE'), nullable=False, index=True)
    category = db.Column(db.String(50), default='Revenue')
    title = db.Column(db.String(200), nullable=False)
    recommendation = db.Column(db.Text, nullable=False)
    reasoning = db.Column(db.Text, nullable=False)
    potential_impact = db.Column(db.String(100), nullable=True)
    impact_metric = db.Column(db.String(50), default='Revenue')
    is_dismissed = db.Column(db.Boolean, default=False)
    is_applied = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'property_id': self.property_id,
            'category': self.category,
            'title': self.title,
            'description': self.recommendation,
            'recommendation': self.recommendation,
            'reasoning': self.reasoning,
            'potential_gain': self.potential_impact,
            'potential_impact': self.potential_impact,
            'impact': 'high' if '12%' in self.potential_impact or '18,500' in self.potential_impact else 'medium',
            'status': 'applied' if self.is_applied else 'active',
            'is_applied': self.is_applied
        }

class Notification(db.Model):
    __tablename__ = 'notifications'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    title = db.Column(db.String(150), nullable=False)
    message = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(50), default='info')
    is_read = db.Column(db.Boolean, default=False)
    link = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'message': self.message,
            'type': self.type,
            'is_read': self.is_read,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class ChatSession(db.Model):
    __tablename__ = 'chat_sessions'
    
    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(db.Integer, db.ForeignKey('properties.id', ondelete='CASCADE'), nullable=False, index=True)
    guest_name = db.Column(db.String(120), nullable=False)
    guest_phone = db.Column(db.String(30), nullable=True)
    channel = db.Column(db.String(30), default='WhatsApp')
    status = db.Column(db.String(30), default='active')
    last_message_at = db.Column(db.DateTime, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    messages = db.relationship('ChatMessage', backref='session', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'property_id': self.property_id,
            'property_name': self.property.name if self.property else 'Property',
            'guest_name': self.guest_name,
            'guest_phone': self.guest_phone,
            'channel': self.channel,
            'status': self.status,
            'last_message_at': self.last_message_at.isoformat() if self.last_message_at else None,
            'unread_count': sum(1 for m in self.messages if not m.is_read and m.sender == 'guest'),
            'last_message': self.messages[-1].message if self.messages else None
        }

class ChatMessage(db.Model):
    __tablename__ = 'chat_messages'
    
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.Integer, db.ForeignKey('chat_sessions.id', ondelete='CASCADE'), nullable=False, index=True)
    sender = db.Column(db.String(20), nullable=False)
    message = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    is_read = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            'id': self.id,
            'session_id': self.session_id,
            'sender': self.sender,
            'message': self.message,
            'timestamp': self.timestamp.strftime('%H:%M • %d %b') if self.timestamp else None,
            'is_read': self.is_read
        }


class HostVerification(db.Model):
    """Host identity verification workflow record."""
    __tablename__ = 'host_verifications'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    status = db.Column(db.String(30), default='not_started')  # not_started / pending / verified / needs_review / rejected
    id_type = db.Column(db.String(50), nullable=True)
    confidence_score = db.Column(db.Float, default=0.0)
    face_match_score = db.Column(db.Float, default=0.0)
    id_authenticity_score = db.Column(db.Float, default=0.0)
    steps_completed = db.Column(db.Integer, default=0)
    submitted_at = db.Column(db.DateTime, nullable=True)
    reviewed_at = db.Column(db.DateTime, nullable=True)
    reviewer_notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'status': self.status,
            'id_type': self.id_type,
            'confidence_score': self.confidence_score,
            'face_match_score': self.face_match_score,
            'id_authenticity_score': self.id_authenticity_score,
            'steps_completed': self.steps_completed,
            'submitted_at': self.submitted_at.isoformat() if self.submitted_at else None,
        }


class ListingReport(db.Model):
    """Guest-submitted listing report."""
    __tablename__ = 'listing_reports'

    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(db.Integer, db.ForeignKey('properties.id', ondelete='CASCADE'), nullable=False, index=True)
    reporter_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    reason = db.Column(db.String(100), nullable=False)
    details = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(30), default='submitted')  # submitted / under_review / investigating / resolved
    admin_notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'property_id': self.property_id,
            'reason': self.reason,
            'details': self.details,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
