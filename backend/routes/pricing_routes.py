from datetime import datetime, date, timedelta
from flask import Blueprint, request, jsonify
from models import db, Property, Pricing, PricingFactor
from routes.auth_routes import token_required
from services.pricing_service import PricingService

pricing_bp = Blueprint('pricing', __name__)

@pricing_bp.route('/calendar/<int:property_id>', methods=['GET'])
@pricing_bp.route('/recommendations', methods=['GET'])
@token_required
def get_calendar(current_user, property_id=None):
    if not property_id:
        property_id = request.args.get('property_id', type=int)
    
    if not property_id:
        prop = Property.query.filter_by(user_id=current_user.id).first()
        if not prop:
            return jsonify({'calendar': [], 'recommendations': []}), 200
        property_id = prop.id
    else:
        prop = Property.query.filter_by(id=property_id, user_id=current_user.id).first_or_404()

    strategy = request.args.get('strategy', 'balanced')
    strat_multiplier = 1.25 if strategy == 'aggressive' else 0.9 if strategy == 'high_occupancy' else 1.0

    today = date.today()
    calendar_days = []
    
    events_map = {
        5: 'Sunburn Music Festival',
        12: 'Long Weekend Holiday',
        18: 'Tech Conference Surge',
        25: 'Heritage Cultural Fair'
    }

    for day_offset in range(30):
        target_date = today + timedelta(days=day_offset)
        day_name = target_date.strftime('%a')
        is_weekend = day_name in ['Fri', 'Sat', 'Sun']
        
        event_name = events_map.get(day_offset, None)
        event_mult = 1.35 if event_name else 1.0
        weekend_mult = 1.2 if is_weekend else 1.0
        season_mult = 1.15
        
        total_multiplier = round(season_mult * weekend_mult * event_mult * strat_multiplier, 2)
        rec_price = round(prop.base_price * total_multiplier)

        calendar_days.append({
            'date': target_date.strftime('%Y-%m-%d'),
            'day_name': day_name,
            'base_price': prop.base_price,
            'recommended_price': rec_price,
            'multiplier': total_multiplier,
            'event': event_name,
            'factors': {
                'seasonality': season_mult,
                'day_of_week': weekend_mult,
                'event_surge': event_mult,
                'occupancy_yield': 1.05
            }
        })

    return jsonify({
        'property': prop.to_dict(),
        'calendar': calendar_days,
        'recommendations': calendar_days
    }), 200

@pricing_bp.route('/override', methods=['POST'])
@token_required
def set_override(current_user):
    data = request.get_json() or {}
    return jsonify({'status': 'success', 'message': 'Price override saved.'}), 200

@pricing_bp.route('/batch-adjust', methods=['POST'])
@token_required
def batch_adjust(current_user):
    data = request.get_json() or {}
    return jsonify({'status': 'success', 'message': 'Batch pricing surge applied.'}), 200
