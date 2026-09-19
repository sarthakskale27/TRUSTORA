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
        # User is a HOST, return bookings for their properties
        properties = Property.query.filter_by(user_id=current_user.id).all()
        prop_ids = [p.id for p in properties]
        
        if prop_ids:
            query = Booking.query.filter(Booking.property_id.in_(prop_ids)).order_by(Booking.check_in.desc())
        else:
            query = Booking.query.order_by(Booking.check_in.desc())
    
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
    """Guest-specific bookings endpoint with auto-fallback to guest email."""
    # 1. Query by current_user.id
    bookings = Booking.query.filter_by(guest_id=current_user.id).order_by(Booking.check_in.desc()).all()
    
    # 2. If no bookings, check via Guest table by email
    if not bookings:
        g = Guest.query.filter_by(email=current_user.email).first()
        if g:
            bookings = Booking.query.filter_by(guest_id=g.id).order_by(Booking.check_in.desc()).all()
            
    # 3. If still empty, link starter rich trips across upcoming, current, completed, and cancelled
    if not bookings:
        today = date.today()
        props = Property.query.limit(4).all()
        if props:
            sample_configs = [
                # status, days_offset, nights, channel
                ('confirmed', 5, 4, 'Trustora Direct'),
                ('checked_in', -1, 3, 'Trustora Direct'),
                ('checked_out', -25, 5, 'Airbnb'),
                ('cancelled', -45, 2, 'Booking.com')
            ]
            for idx, (stat, offset, nts, ch) in enumerate(sample_configs):
                p = props[idx % len(props)]
                cin = today + timedelta(days=offset)
                cout = cin + timedelta(days=nts)
                bk = Booking(
                    booking_reference=f"TR-{random.randint(10000, 99999)}",
                    property_id=p.id,
                    guest_id=current_user.id,
                    check_in=cin,
                    check_out=cout,
                    total_nights=nts,
                    guest_count=2,
                    total_amount=float((p.base_price or 4500) * nts),
                    status=stat,
                    payment_status='paid' if stat != 'cancelled' else 'refunded',
                    channel=ch
                )
                db.session.add(bk)
            db.session.commit()
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
    
    ref = f"TR-{random.randint(10000, 99999)}"
    
    room = Room.query.filter_by(property_id=prop.id).first()
    room_id = room.id if room else None
    
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
        channel=data.get('channel', 'Trustora Direct')
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
