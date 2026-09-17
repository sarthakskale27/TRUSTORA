from datetime import datetime, date, timedelta
from collections import defaultdict
from flask import Blueprint, request, jsonify
from models import db, Property, Booking, Room, Review
from routes.auth_routes import token_required

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/dashboard', methods=['GET'])
@analytics_bp.route('/summary', methods=['GET'])
@token_required
def get_dashboard_stats(current_user):
    properties = Property.query.filter_by(user_id=current_user.id).all()
    prop_ids = [p.id for p in properties]

    is_new_host = len(prop_ids) == 0

    bookings = Booking.query.filter(Booking.property_id.in_(prop_ids)).all() if prop_ids else []
    active_bookings = [b for b in bookings if b.status != 'cancelled']
    total_revenue = sum(b.total_amount for b in active_bookings)
    total_nights = sum(b.total_nights for b in active_bookings)
    adr = round(total_revenue / max(1, total_nights)) if total_nights > 0 else 0

    # Build revenue trend from actual bookings (last 6 months)
    month_revenue = defaultdict(float)
    today = date.today()
    for b in active_bookings:
        if b.created_at:
            key = b.created_at.strftime('%b')
            month_revenue[key] += b.total_amount

    # Always show last 6 calendar months as labels
    month_labels = []
    for i in range(5, -1, -1):
        dt = today.replace(day=1) - timedelta(days=i * 28)
        month_labels.append(dt.strftime('%b'))

    revenue_trend = [
        {'month': m, 'revenue': round(month_revenue.get(m, 0)), 'occupancy': 0}
        for m in month_labels
    ]

    # Occupancy: active bookings / (props * 30 days)
    occupancy_rate = 0.0
    if prop_ids:
        booked_nights = total_nights
        total_capacity = len(prop_ids) * 30
        occupancy_rate = round(min(100.0, (booked_nights / total_capacity) * 100), 1)

    return jsonify({
        'total_revenue': total_revenue,
        'total_bookings': len(bookings),
        'total_properties': len(prop_ids),
        'occupancy_rate': occupancy_rate,
        'avg_occupancy': occupancy_rate,
        'adr': adr,
        'is_new_host': is_new_host,
        'revenue_trend': revenue_trend,
        'revenue_chart': revenue_trend
    }), 200
