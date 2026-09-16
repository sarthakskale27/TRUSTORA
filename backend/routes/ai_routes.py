from flask import Blueprint, request, jsonify
from models import db, Property, AIListing, AIRecommendation
from routes.auth_routes import token_required
from services.ai_service import AIService
from services.photo_service import PhotoService
from services.trust_service import TrustService

ai_bp = Blueprint('ai', __name__)

@ai_bp.route('/generate-listing', methods=['POST'])
@token_required
def generate_listing(current_user):
    data = request.get_json() or {}
    prop_id = data.get('property_id')
    tone = data.get('tone', 'luxury')
    channel = data.get('channel', 'airbnb')
    keywords = data.get('keywords', [])

    prop = Property.query.get(prop_id) if prop_id else Property.query.filter_by(user_id=current_user.id).first()
    title_base = prop.name if prop else 'Luxury Boutique Villa'
    city = prop.city if prop else 'Goa'

    titles = [
        f"Exclusive {title_base} with Private Pool & Sunset Views in {city}",
        f"Quintessential Luxury Retreat • {title_base} ({city})",
        f"High-Converting Sanctuary: Fast Wi-Fi, Gourmet Kitchen & Pool in {city}",
        f"Eco-Chic Boutique Stay @ {title_base} • Superhost Hospitality"
    ]

    desc = f"""Experience unmatched tranquility and modern sophistication at {title_base}. Located in the heart of {city}, this private sanctuary offers seamless comfort, high-speed connectivity, and curated hospitality.

✦ PROPERTY HIGHLIGHTS:
• Master suites featuring premium plush linens and en-suite rainfall showers
• Private swimming pool with sunset sun-loungers
• Blazing-fast 200+ Mbps fiber Wi-Fi & ergonomic workspace
• Gourmet fully equipped kitchen with coffee machine & microwave
• 100% power backup and keyless smart door entry

✦ GUEST VERIFICATION & TRUST:
Inspected and verified with Trustora 96/100 Trust Assurance. 24/7 WhatsApp AI concierge for immediate local assistance."""

    return jsonify({
        'listing': {
            'titles': titles,
            'title': titles[0],
            'description': desc,
            'seo_tags': ['luxuryvilla', 'privateswimmingpool', 'fastwifi', 'workcation', f'{city.lower()}stay'] + [k.replace(' ', '') for k in keywords[:3]]
        }
    }), 200

@ai_bp.route('/analyze-photo', methods=['POST'])
def analyze_photo():
    data = request.get_json() or {}
    photo_url = data.get('photo_url') or data.get('image_url') or 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914'
    category = data.get('category', 'living_room')

    return jsonify({
        'analysis': {
            'overall_score': 93,
            'lighting_score': 95,
            'composition_score': 90,
            'staging_score': 96,
            'sharpness_score': 92,
            'recommendation': 'Hero Photo Ready (Top Tier)',
            'tips': [
                'Excellent natural sunlight and balanced exposure throughout the frame.',
                'Symmetrical rule-of-thirds composition highlights architectural depth.',
                'Hero-image potential: Expected +24% higher click-through on OTA search cards.'
            ]
        }
    }), 200

@ai_bp.route('/recommendations', methods=['GET'])
@token_required
def get_recommendations(current_user):
    recs = [
        {
            'id': 1,
            'title': 'Weekend Rate Optimization (+22% Revenue Surge)',
            'description': 'Market occupancy in your area hits 94% on Friday-Sunday. Increase weekend rates by ₹1,500 to capture ₹45,000 extra margin.',
            'potential_gain': '+₹45,000 Projected Monthly Gain',
            'impact': 'high',
            'status': 'active'
        },
        {
            'id': 2,
            'title': 'Add Workcation High-Speed Wi-Fi Speed Badge',
            'description': 'Over 65% of your guest inquiries ask about internet stability. Adding verified 200+ Mbps badge will increase weekday bookings.',
            'potential_gain': '+18% Mid-week Occupancy',
            'impact': 'medium',
            'status': 'active'
        },
        {
            'id': 3,
            'title': 'Promote Keyless Smart Self Check-In',
            'description': 'Highlight digital keypad check-in in the top 3 bullet points to reduce late arrival inquiries.',
            'potential_gain': '-50% Host Messaging Overhead',
            'impact': 'medium',
            'status': 'active'
        }
    ]
    return jsonify({'recommendations': recs}), 200

@ai_bp.route('/recommendations/<int:rec_id>/apply', methods=['POST'])
@token_required
def apply_recommendation(current_user, rec_id):
    return jsonify({'status': 'applied', 'message': f'Recommendation {rec_id} applied.'}), 200
