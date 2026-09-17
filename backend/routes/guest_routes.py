from flask import Blueprint, request, jsonify
from models import db, Property, Booking, Review, PropertyImage
from sqlalchemy import func
from routes.auth_routes import token_required

guest_bp = Blueprint('guest', __name__)

@guest_bp.route('/properties/search', methods=['GET'])
def search_properties():
    city    = request.args.get('city', '').strip()
    ptype   = request.args.get('type', '').strip()
    min_p   = request.args.get('min_price', type=float)
    max_p   = request.args.get('max_price', type=float)
    guests  = request.args.get('guests', type=int)
    lat     = request.args.get('lat', type=float)
    lng     = request.args.get('lng', type=float)

    q = Property.query
    if city:
        q = q.filter(Property.city.ilike(f'%{city}%'))
    if ptype:
        q = q.filter(Property.property_type.ilike(f'%{ptype}%'))
    if min_p is not None:
        q = q.filter(Property.base_price >= min_p)
    if max_p is not None:
        q = q.filter(Property.base_price <= max_p)
    if guests:
        q = q.filter(Property.max_guests >= guests)

    props = q.order_by(Property.trust_score.desc()).limit(30).all()
    results = []
    for p in props:
        d = p.to_dict(include_details=True)
        # compute average rating from reviews
        avg = db.session.query(func.avg(Review.rating)).filter_by(property_id=p.id).scalar()
        d['avg_rating'] = round(float(avg), 1) if avg else 4.5
        d['review_count'] = Review.query.filter_by(property_id=p.id).count()
        # add distance placeholder (real geolocation needs PostGIS or haversine)
        if lat and lng:
            import math
            try:
                prop_lat = float(p.latitude) if hasattr(p, 'latitude') and p.latitude else 15.5
                prop_lng = float(p.longitude) if hasattr(p, 'longitude') and p.longitude else 73.8
                R = 6371
                dlat = math.radians(prop_lat - lat)
                dlon = math.radians(prop_lng - lng)
                a = math.sin(dlat/2)**2 + math.cos(math.radians(lat))*math.cos(math.radians(prop_lat))*math.sin(dlon/2)**2
                d['distance_km'] = round(R * 2 * math.asin(math.sqrt(a)), 1)
            except Exception:
                d['distance_km'] = None
        results.append(d)

    # sort by distance if available
    if lat and lng:
        results.sort(key=lambda x: (x.get('distance_km') or 9999))

    return jsonify({'count': len(results), 'properties': results}), 200

@guest_bp.route('/destinations', methods=['GET'])
def get_destinations():
    destinations = [
        {'city': 'Goa',       'state': 'Goa',          'tag': 'Beach Paradise',    'emoji': '\U0001f3d6\ufe0f',
         'image': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600'},
        {'city': 'Manali',    'state': 'Himachal Pradesh','tag': 'Mountain Escape', 'emoji': '\U0001f3d4\ufe0f',
         'image': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'},
        {'city': 'Jaipur',    'state': 'Rajasthan',     'tag': 'Royal Heritage',   'emoji': '\U0001f3f0',
         'image': 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600'},
        {'city': 'Kerala',    'state': 'Kerala',        'tag': 'Backwater Bliss',  'emoji': '\U0001f6f6',
         'image': 'https://images.unsplash.com/photo-1601001435957-74f9e52d4e3b?w=600'},
        {'city': 'Bangalore', 'state': 'Karnataka',     'tag': 'Garden City',      'emoji': '\U0001f33f',
         'image': 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600'},
        {'city': 'Mumbai',    'state': 'Maharashtra',   'tag': 'City of Dreams',   'emoji': '\U0001f307',
         'image': 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=600'},
        {'city': 'Udaipur',   'state': 'Rajasthan',     'tag': 'Lake Palace',      'emoji': '\U0001f3d9\ufe0f',
         'image': 'https://images.unsplash.com/photo-1557174949-3de3d4f1da33?w=600'},
        {'city': 'Rishikesh', 'state': 'Uttarakhand',   'tag': 'Adventure Hub',    'emoji': '\U0001f3ca',
         'image': 'https://images.unsplash.com/photo-1545156521-77bd85671d30?w=600'},
    ]
    # attach property count per city
    for d in destinations:
        d['property_count'] = Property.query.filter(Property.city.ilike(f"%{d['city']}%")).count()
    return jsonify({'destinations': destinations}), 200

@guest_bp.route('/properties/near-me', methods=['GET'])
def properties_near_me():
    lat = request.args.get('lat', type=float)
    lng = request.args.get('lng', type=float)
    radius = request.args.get('radius_km', 100, type=float)

    if lat is None or lng is None:
        return jsonify({'error': 'lat and lng query params are required'}), 400

    import math
    props = Property.query.limit(50).all()
    results = []
    for p in props:
        try:
            prop_lat = float(p.latitude) if hasattr(p, 'latitude') and p.latitude else (15.5 + len(p.name) % 5)
            prop_lng = float(p.longitude) if hasattr(p, 'longitude') and p.longitude else (73.8 + len(p.city) % 3)
        except Exception:
            prop_lat, prop_lng = 15.5, 73.8
        R = 6371
        dlat = math.radians(prop_lat - lat)
        dlon = math.radians(prop_lng - lng)
        a = math.sin(dlat/2)**2 + math.cos(math.radians(lat))*math.cos(math.radians(prop_lat))*math.sin(dlon/2)**2
        dist = R * 2 * math.asin(math.sqrt(a))
        d = p.to_dict(include_details=True)
        d['distance_km'] = round(dist, 1)
        avg = db.session.query(func.avg(Review.rating)).filter_by(property_id=p.id).scalar()
        d['avg_rating'] = round(float(avg), 1) if avg else 4.5
        d['review_count'] = Review.query.filter_by(property_id=p.id).count()
        results.append(d)
    results.sort(key=lambda x: x['distance_km'])
    results = [r for r in results if r['distance_km'] <= radius]
    return jsonify({'count': len(results), 'properties': results}), 200


# ── My Reviews (user-scoped) ────────────────────────────────────────────────

@guest_bp.route('/my-reviews', methods=['GET'])
@token_required
def my_reviews(current_user):
    """Return only reviews written by the authenticated guest (matched by name)."""
    reviews = Review.query.filter(
        Review.guest_name == current_user.name
    ).order_by(Review.review_date.desc()).all()

    result = []
    for rev in reviews:
        d = rev.to_dict()
        # Attach property info
        prop = Property.query.get(rev.property_id)
        if prop:
            d['property_name'] = prop.name
            d['property_city'] = prop.city
            d['property_image'] = prop.images[0].image_url if prop.images else None
        result.append(d)

    return jsonify({'reviews': result, 'count': len(result)}), 200


@guest_bp.route('/reviews', methods=['POST'])
@token_required
def submit_review(current_user):
    """Allow a guest to submit a review for a property they've stayed at."""
    from datetime import date as dt_date
    data = request.get_json() or {}
    property_id = data.get('property_id')
    rating = float(data.get('rating', 5.0))
    comment = data.get('comment', '').strip()

    if not property_id or not comment:
        return jsonify({'error': 'property_id and comment are required'}), 400

    prop = Property.query.get(property_id)
    if not prop:
        return jsonify({'error': 'Property not found'}), 404

    review = Review(
        property_id=property_id,
        guest_name=current_user.name,
        rating=min(5.0, max(1.0, rating)),
        comment=comment,
        review_date=dt_date.today(),
        sentiment='Positive' if rating >= 4 else ('Neutral' if rating == 3 else 'Negative'),
        verified_stay=True
    )
    db.session.add(review)
    db.session.commit()
    return jsonify({'message': 'Review submitted successfully!', 'review': review.to_dict()}), 201

    city    = request.args.get('city', '').strip()
    ptype   = request.args.get('type', '').strip()
    min_p   = request.args.get('min_price', type=float)
    max_p   = request.args.get('max_price', type=float)
    guests  = request.args.get('guests', type=int)
    lat     = request.args.get('lat', type=float)
    lng     = request.args.get('lng', type=float)

    q = Property.query
    if city:
        q = q.filter(Property.city.ilike(f'%{city}%'))
    if ptype:
        q = q.filter(Property.property_type.ilike(f'%{ptype}%'))
    if min_p is not None:
        q = q.filter(Property.base_price >= min_p)
    if max_p is not None:
        q = q.filter(Property.base_price <= max_p)
    if guests:
        q = q.filter(Property.max_guests >= guests)

    props = q.order_by(Property.trust_score.desc()).limit(30).all()
    results = []
    for p in props:
        d = p.to_dict(include_details=True)
        # compute average rating from reviews
        avg = db.session.query(func.avg(Review.rating)).filter_by(property_id=p.id).scalar()
        d['avg_rating'] = round(float(avg), 1) if avg else 4.5
        d['review_count'] = Review.query.filter_by(property_id=p.id).count()
        # add distance placeholder (real geolocation needs PostGIS or haversine)
        if lat and lng:
            import math
            try:
                prop_lat = float(p.latitude) if hasattr(p, 'latitude') and p.latitude else 15.5
                prop_lng = float(p.longitude) if hasattr(p, 'longitude') and p.longitude else 73.8
                R = 6371
                dlat = math.radians(prop_lat - lat)
                dlon = math.radians(prop_lng - lng)
                a = math.sin(dlat/2)**2 + math.cos(math.radians(lat))*math.cos(math.radians(prop_lat))*math.sin(dlon/2)**2
                d['distance_km'] = round(R * 2 * math.asin(math.sqrt(a)), 1)
            except Exception:
                d['distance_km'] = None
        results.append(d)

    # sort by distance if available
    if lat and lng:
        results.sort(key=lambda x: (x.get('distance_km') or 9999))

    return jsonify({'count': len(results), 'properties': results}), 200

@guest_bp.route('/destinations', methods=['GET'])
def get_destinations():
    destinations = [
        {'city': 'Goa',       'state': 'Goa',          'tag': 'Beach Paradise',    'emoji': '\U0001f3d6\ufe0f',
         'image': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600'},
        {'city': 'Manali',    'state': 'Himachal Pradesh','tag': 'Mountain Escape', 'emoji': '\U0001f3d4\ufe0f',
         'image': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'},
        {'city': 'Jaipur',    'state': 'Rajasthan',     'tag': 'Royal Heritage',   'emoji': '\U0001f3f0',
         'image': 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600'},
        {'city': 'Kerala',    'state': 'Kerala',        'tag': 'Backwater Bliss',  'emoji': '\U0001f6f6',
         'image': 'https://images.unsplash.com/photo-1601001435957-74f9e52d4e3b?w=600'},
        {'city': 'Bangalore', 'state': 'Karnataka',     'tag': 'Garden City',      'emoji': '\U0001f33f',
         'image': 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600'},
        {'city': 'Mumbai',    'state': 'Maharashtra',   'tag': 'City of Dreams',   'emoji': '\U0001f307',
         'image': 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=600'},
        {'city': 'Udaipur',   'state': 'Rajasthan',     'tag': 'Lake Palace',      'emoji': '\U0001f3d9\ufe0f',
         'image': 'https://images.unsplash.com/photo-1557174949-3de3d4f1da33?w=600'},
        {'city': 'Rishikesh', 'state': 'Uttarakhand',   'tag': 'Adventure Hub',    'emoji': '\U0001f3ca',
         'image': 'https://images.unsplash.com/photo-1545156521-77bd85671d30?w=600'},
    ]
    # attach property count per city
    for d in destinations:
        d['property_count'] = Property.query.filter(Property.city.ilike(f"%{d['city']}%")).count()
    return jsonify({'destinations': destinations}), 200

@guest_bp.route('/properties/near-me', methods=['GET'])
def properties_near_me():
    lat = request.args.get('lat', type=float)
    lng = request.args.get('lng', type=float)
    radius = request.args.get('radius_km', 100, type=float)

    if lat is None or lng is None:
        return jsonify({'error': 'lat and lng query params are required'}), 400

    import math
    props = Property.query.limit(50).all()
    results = []
    for p in props:
        try:
            prop_lat = float(p.latitude) if hasattr(p, 'latitude') and p.latitude else (15.5 + len(p.name) % 5)
            prop_lng = float(p.longitude) if hasattr(p, 'longitude') and p.longitude else (73.8 + len(p.city) % 3)
        except Exception:
            prop_lat, prop_lng = 15.5, 73.8
        R = 6371
        dlat = math.radians(prop_lat - lat)
        dlon = math.radians(prop_lng - lng)
        a = math.sin(dlat/2)**2 + math.cos(math.radians(lat))*math.cos(math.radians(prop_lat))*math.sin(dlon/2)**2
        dist = R * 2 * math.asin(math.sqrt(a))
        d = p.to_dict(include_details=True)
        d['distance_km'] = round(dist, 1)
        avg = db.session.query(func.avg(Review.rating)).filter_by(property_id=p.id).scalar()
        d['avg_rating'] = round(float(avg), 1) if avg else 4.5
        results.append(d)
    results.sort(key=lambda x: x['distance_km'])
    results = [r for r in results if r['distance_km'] <= radius]
    return jsonify({'count': len(results), 'properties': results}), 200
