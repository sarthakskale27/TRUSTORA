import os
import uuid
from flask import Blueprint, request, jsonify
from models import db, Property, Room, Amenity, PropertyImage, Review
from routes.auth_routes import token_required
from services.trust_service import TrustService

property_bp = Blueprint('properties', __name__)

@property_bp.route('', methods=['GET'])
@token_required
def get_properties(current_user):
    properties = Property.query.filter_by(user_id=current_user.id).order_by(Property.created_at.desc()).all()
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
    reviews = Review.query.filter_by(property_id=property_id).order_by(Review.review_date.desc()).all()
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
        state=data.get('state', 'State'),
        country=data.get('country', 'India'),
        zip_code=data.get('pincode', '403515'),
        base_price=base_price,
        total_rooms=int(data.get('rooms_count', 2)),
        total_bathrooms=int(data.get('bathrooms_count', 2)),
        max_guests=int(data.get('max_guests', 4)),
        neighborhood_vibe=vibe,
        trust_score=94
    )
    db.session.add(new_prop)
    db.session.flush()

    # Photos
    photos = data.get('photos', [])
    if photos:
        for idx, p in enumerate(photos):
            img = PropertyImage(
                property_id=new_prop.id,
                image_url=p.get('url', 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914'),
                caption=p.get('caption', 'View'),
                is_primary=p.get('is_hero', idx == 0),
                overall_score=92
            )
            db.session.add(img)
    else:
        img = PropertyImage(
            property_id=new_prop.id,
            image_url='https://images.unsplash.com/photo-1580587771525-78b9dba3b914',
            caption='Exterior',
            is_primary=True,
            overall_score=92
        )
        db.session.add(img)

    db.session.commit()
    return jsonify({'message': 'Property created', 'property': new_prop.to_dict(include_details=True)}), 201

@property_bp.route('/<int:property_id>', methods=['DELETE'])
@token_required
def delete_property(current_user, property_id):
    prop = Property.query.filter_by(id=property_id, user_id=current_user.id).first_or_404()
    db.session.delete(prop)
    db.session.commit()
    return jsonify({'message': 'Property deleted'}), 200
