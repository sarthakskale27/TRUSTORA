from datetime import datetime, date
from flask import Blueprint, request, jsonify
from models import db, Property, Booking, Room, User
from routes.auth_routes import token_required

booking_bp = Blueprint('bookings', __name__)

@booking_bp.route('', methods=['GET'])
@token_required
def get_bookings(current_user):
    limit = request.args.get('limit', type=int)
    
    # If user is a GUEST, return their bookings
    if current_user.role == 'guest':
        query = Booking.query.filter_by(guest_id=current_user.id).order_by(Booking.check_in.desc())
    else:
        # User is a HOST, return bookings for their properties
        properties = Property.query.filter_by(user_id=current_user.id).all()
        prop_ids = [p.id for p in properties]
        query = Booking.query.filter(Booking.property_id.in_(prop_ids)).order_by(Booking.check_in.desc())
    
    if limit:
        bookings = query.limit(limit).all()
    else:
        bookings = query.all()
        
    return jsonify({
        'count': len(bookings),
        'bookings': [b.to_dict() for b in bookings]
    }), 200

@booking_bp.route('/my-bookings', methods=['GET'])
@token_required
def get_my_bookings(current_user):
    """Guest-specific bookings endpoint."""
    bookings = Booking.query.filter_by(guest_id=current_user.id).order_by(Booking.check_in.desc()).all()
    return jsonify({
        'count': len(bookings),
        'bookings': [b.to_dict() for b in bookings]
    }), 200

@booking_bp.route('', methods=['POST'])
@token_required
def create_booking(current_user):
    data = request.get_json() or {}
    prop_id = data.get('property_id')
    prop = Property.query.get_or_404(prop_id)
    
    cin = datetime.strptime(data.get('check_in'), '%Y-%m-%d').date()
    cout = datetime.strptime(data.get('check_out'), '%Y-%m-%d').date()
    nights = max(1, (cout - cin).days)
    
    import random
    ref = f'TR-{random.randint(10000, 99999)}'
    
    room = Room.query.filter_by(property_id=prop.id).first()
    room_id = room.id if room else 1
    
    new_booking = Booking(
        booking_reference=ref,
        property_id=prop.id,
        room_id=room_id,
        guest_id=current_user.id,
        check_in=cin,
        check_out=cout,
        total_nights=nights,
        guest_count=int(data.get('guests_count', 2)),
        total_amount=float(data.get('total_amount', prop.base_price * nights)),
        status=data.get('status', 'confirmed'),
        payment_status='paid',
        channel='Trustora Direct'
    )
    db.session.add(new_booking)
    db.session.commit()
    
    return jsonify({'message': 'Booking confirmed with Trustora protection', 'booking': new_booking.to_dict()}), 201
