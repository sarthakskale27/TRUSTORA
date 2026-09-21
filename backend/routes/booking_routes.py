from datetime import datetime, date, timedelta
import random
from flask import Blueprint, request, jsonify
from models import db, Property, Booking, Room, User, Guest
from routes.auth_routes import token_required

booking_bp = Blueprint('bookings', __name__)

@booking_bp.route('', methods=['GET'])
@token_required
def get_bookings(current_user):
    limit = request.args.get('limit', type=int)
    
    # If user is a GUEST, return their bookings
    if current_user.role == 'guest':
        return get_my_bookings(current_user)
    else:
        # User is a HOST, return bookings strictly for their properties
        properties = Property.query.filter_by(user_id=current_user.id).all()
        prop_ids = [p.id for p in properties]
        
        if not prop_ids:
            return jsonify({'count': 0, 'bookings': []}), 200
            
        query = Booking.query.filter(Booking.property_id.in_(prop_ids)).order_by(Booking.created_at.desc(), Booking.check_in.desc())
    
    if limit:
        bookings = query.limit(limit).all()
    else:
        bookings = query.all()

    # Deduplicate host bookings
    seen = set()
    deduped = []
    for b in bookings:
        key = f"{b.property_id}_{b.check_in}_{b.check_out}_{b.guest_id}"
        if key not in seen:
            seen.add(key)
            deduped.append(b)
        
    return jsonify({
        'count': len(deduped),
        'bookings': [b.to_dict() for b in deduped]
    }), 200

@booking_bp.route('/my-bookings', methods=['GET'])
@token_required
def get_my_bookings(current_user):
    """Guest-specific bookings endpoint with auto-deduplication. Returns 0 for new accounts."""
    guest_ids = [current_user.id]
    g = Guest.query.filter_by(email=current_user.email).first()
    if g and g.id not in guest_ids:
        guest_ids.append(g.id)

    raw_bookings = Booking.query.filter(Booking.guest_id.in_(guest_ids)).order_by(Booking.check_in.desc()).all()

    # Clean Deduplication: Exactly ONE booking per hotel per check_in date
    seen = set()
    deduped = []
    for b in raw_bookings:
        key = f"{b.property_id}_{b.check_in}_{b.check_out}"
        if key not in seen:
            seen.add(key)
            deduped.append(b)

    return jsonify({
        'count': len(deduped),
        'bookings': [b.to_dict() for b in deduped]
    }), 200

@booking_bp.route('', methods=['POST'])
@token_required
def create_booking(current_user):
    data = request.get_json() or {}
    prop_id = data.get('property_id')
    prop = Property.query.get_or_404(prop_id)
    
    cin_str = data.get('check_in')
    cout_str = data.get('check_out')
    
    today = date.today()
    if cin_str:
        cin = datetime.strptime(cin_str, '%Y-%m-%d').date()
    else:
        cin = today + timedelta(days=7)
        
    if cout_str:
        cout = datetime.strptime(cout_str, '%Y-%m-%d').date()
    else:
        cout = cin + timedelta(days=3)
        
    nights = max(1, (cout - cin).days)
    ref = f"TR-{random.randint(10000, 99999)}"
    
    room = Room.query.filter_by(property_id=prop.id).first()
    room_id = room.id if room else None
    
    # Ensure guest record in Guest table
    g = Guest.query.filter_by(email=current_user.email).first()
    if not g:
        g = Guest(
            name=current_user.name or 'Guest User',
            email=current_user.email,
            phone=current_user.phone or '+91 98200 12345',
            trust_rating=4.9
        )
        db.session.add(g)
        db.session.flush()
    
    # Prevent duplicate booking on exact same dates
    existing = Booking.query.filter(
        Booking.property_id == prop.id,
        Booking.guest_id.in_([current_user.id, g.id]),
        Booking.check_in == cin,
        Booking.status != 'cancelled'
    ).first()

    if existing:
        return jsonify({'message': 'Booking already confirmed', 'booking': existing.to_dict()}), 200

    new_booking = Booking(
        booking_reference=ref,
        property_id=prop.id,
        room_id=room_id,
        guest_id=g.id,
        check_in=cin,
        check_out=cout,
        total_nights=nights,
        guest_count=int(data.get('guests_count', data.get('guest_count', 2))),
        total_amount=float(data.get('total_amount', (prop.base_price or 5000) * nights)),
        status=data.get('status', 'confirmed'),
        payment_status='paid',
        channel=data.get('channel', 'Trustora Direct'),
        created_at=datetime.utcnow()
    )
    db.session.add(new_booking)
    db.session.commit()
    
    return jsonify({'message': 'Booking confirmed with Trustora protection', 'booking': new_booking.to_dict()}), 201

@booking_bp.route('/<int:booking_id>/status', methods=['PUT'])
@token_required
def update_booking_status(current_user, booking_id):
    booking = Booking.query.get_or_404(booking_id)
    data = request.get_json() or {}
    new_status = data.get('status')
    if new_status:
        booking.status = new_status
        db.session.commit()
    return jsonify({'message': f'Booking status updated to {new_status}', 'booking': booking.to_dict()}), 200
