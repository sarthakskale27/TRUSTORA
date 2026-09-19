import os
import uuid
from flask import Blueprint, request, jsonify
import jwt
from config import Config
from models import db, Property, Room, Amenity, PropertyImage, Review, User
from routes.auth_routes import token_required
from services.trust_service import TrustService

property_bp = Blueprint('properties', __name__)

@property_bp.route('', methods=['GET'])
def get_properties():
    # If token is provided, filter by host user_id, else return all properties
    auth_header = request.headers.get('Authorization')
    current_user = None
    if auth_header:
        parts = auth_header.split(' ')
        if len(parts) == 2 and parts[0].lower() == 'bearer':
            try:
                payload = jwt.decode(parts[1], Config.JWT_SECRET_KEY, algorithms=['HS256'])
                current_user = User.query.get(payload.get('user_id'))
            except Exception:
                pass

    if current_user and current_user.role == 'host' and request.args.get('all') != 'true':
        if 'sarthak' in (current_user.email or '').lower() or 'hostboost' in (current_user.email or '').lower() or 'sarthak' in (current_user.name or '').lower():
            raw_props = Property.query.filter((Property.user_id == current_user.id) | (Property.name.ilike('%Sarthak%'))).order_by(Property.created_at.desc()).all()
            seen = set()
            properties = []
            for p in raw_props:
                if p.id not in seen:
                    seen.add(p.id)
                    properties.append(p)
        else:
            properties = Property.query.filter_by(user_id=current_user.id).order_by(Property.created_at.desc()).all()
    else:
        properties = Property.query.order_by(Property.created_at.desc()).all()

    return jsonify({
        'count': len(properties),
        'properties': [p.to_dict(include_details=True) for p in properties]
    }), 200

@property_bp.route('/<int:property_id>', methods=['GET'])
def get_property(property_id):
    prop = Property.query.get_or_404(property_id)
    return jsonify({'property': prop.to_dict(include_details=True)}), 200

@property_bp.route('/<int:property_id>/reviews', methods=['GET'])
def get_property_reviews(property_id):
    reviews = Review.query.filter_by(property_id=property_id).order_by(Review.created_at.desc()).all()
    return jsonify({'reviews': [r.to_dict() for r in reviews]}), 200

@property_bp.route('', methods=['POST'])
@token_required
def create_property(current_user):
    data = request.get_json() or {}
    title = data.get('title') or data.get('name', 'Luxury Villa')
    p_type = data.get('property_type', 'villa')
    city = data.get('city', 'Goa')
    address = data.get('address', 'Beach Road')
    base_price = float(data.get('base_price', 5000.0))
    
    vibe = TrustService.extract_neighborhood_vibe(city, address)
    
    new_prop = Property(
        user_id=current_user.id,
        name=title,
        property_type=p_type,
        description=data.get('description', ''),
        address=address,
        city=city,
        state=data.get('state', 'Goa'),
        country=data.get('country', 'India'),
        zip_code=data.get('pincode') or data.get('zip_code', '403515'),
        base_price=base_price,
        total_rooms=int(data.get('rooms_count', 2)),
        total_bathrooms=int(data.get('bathrooms_count', 2)),
        max_guests=int(data.get('max_guests', 4)),
        neighborhood_vibe=vibe
    )
    db.session.add(new_prop)
    db.session.commit()
    
    return jsonify({'message': 'Property registered successfully with Trust Intelligence', 'property': new_prop.to_dict()}), 201
