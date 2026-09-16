from datetime import datetime, date
from flask import Blueprint, request, jsonify
from models import db, Property, Booking, Guest
from routes.auth_routes import token_required

booking_bp = Blueprint('bookings', __name__)

@booking_bp.route('', methods=['GET'])
@token_required
def get_bookings(current_user):
    properties = Property.query.filter_by(user_id=current_user.id).all()
    prop_ids = [p.id for p in properties]
    
    limit = request.args.get('limit', type=int)
    query = Booking.query.filter(Booking.property_id.in_(prop_ids)).order_by(Booking.check_in.desc())
    
    if limit:
        bookings = query.limit(limit).all()
    else:
        bookings = query.all()
        
    return jsonify({
        'count': len(bookings),
        'bookings': [b.to_dict() for b in bookings]
    }), 200

@booking_bp.route('', methods=['POST'])
@token_required
def create_booking(current_user):
    data = request.get_json() or {}
    prop_id = data.get('property_id')
    prop = Property.query.filter_by(id=prop_id, user_id=current_user.id).first_or_404()
    
    guest_name = data.get('guest_name', 'Direct Guest')
    guest_email = data.get('guest_email', f'{guest_name.lower().replace(" ", ".")}@directbooking.com')
    guest_phone = data.get('guest_phone', '+91 98765 43210')
    
    guest = Guest.query.filter_by(email=guest_email).first()
    if not guest:
        guest = Guest(name=guest_name, email=guest_email, phone=guest_phone)
        db.session.add(guest)
        db.session.flush()

    cin = datetime.strptime(data.get('check_in'), '%Y-%m-%d').date()
    cout = datetime.strptime(data.get('check_out'), '%Y-%m-%d').date()
    nights = max(1, (cout - cin).days)
    
    import random
    ref = f'HB-{random.randint(10000, 99999)}'
    
    new_booking = Booking(
        booking_reference=ref,
        property_id=prop.id,
        guest_id=guest.id,
        check_in=cin,
        check_out=cout,
        total_nights=nights,
        guest_count=int(data.get('guests_count', 2)),
        total_amount=float(data.get('total_amount', prop.base_price * nights)),
        status=data.get('status', 'confirmed'),
        channel=data.get('channel', 'direct')
    )
    db.session.add(new_booking)
    db.session.commit()
    return jsonify({'message': 'Booking created', 'booking': new_booking.to_dict()}), 201

@booking_bp.route('/<int:booking_id>/status', methods=['PUT'])
@token_required
def update_booking_status(current_user, booking_id):
    booking = Booking.query.get_or_404(booking_id)
    data = request.get_json() or {}
    booking.status = data.get('status', booking.status)
    db.session.commit()
    return jsonify({'message': 'Booking status updated', 'booking': booking.to_dict()}), 200
