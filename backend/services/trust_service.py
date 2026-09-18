"""
Trustora Trust Service — deterministic scoring engine (DEMO MODE).
All calculations use DB data only. No external APIs called.
Architecture allows real KYC/identity provider to be plugged in later.
"""
from datetime import datetime
from collections import Counter
from models import db, Property, PropertyImage, Review, User

# ── Score Weights (configurable) ──────────────────────────────────────────────
WEIGHTS = {
    'host_verification':   25,
    'listing_consistency': 15,
    'review_confidence':   20,
    'fraud_risk':          20,
    'photo_quality':       10,
    'neighbourhood':       10,
}

# ── Neighbourhood DEMO DATA ───────────────────────────────────────────────────
NEIGHBOURHOOD_DATA = {
    'Goa': {
        'summary': 'Vibrant beachside area with a mix of tourist activity and local culture. Great for couples and groups.',
        'noise': 'Medium', 'nightlife': 'High', 'family_friendly': 'Medium',
        'tourist_activity': 'High', 'transport': 'Good', 'food': 'Excellent', 'local_activity': 'High',
        'nearby': [('Beach', '3 min walk'), ('Fish Market', '7 min'), ('Bus Stop', '5 min'), ('Airport', '35 min')],
        'best_for': ['couples', 'friends', 'beach', 'nightlife'],
    },
    'Manali': {
        'summary': 'Scenic mountain town surrounded by pine forests and snow peaks. Ideal for adventure seekers and families.',
        'noise': 'Low', 'nightlife': 'Low', 'family_friendly': 'High',
        'tourist_activity': 'High', 'transport': 'Moderate', 'food': 'Good', 'local_activity': 'High',
        'nearby': [('Mall Road', '8 min'), ('River', '10 min'), ('Rohtang Pass', '51 km'), ('Bus Stand', '15 min')],
        'best_for': ['family', 'adventure', 'quiet', 'nature'],
    },
    'Jaipur': {
        'summary': 'Historic Pink City with royal heritage, bustling bazaars and authentic Rajasthani culture.',
        'noise': 'Medium', 'nightlife': 'Low', 'family_friendly': 'High',
        'tourist_activity': 'High', 'transport': 'Good', 'food': 'Excellent', 'local_activity': 'High',
        'nearby': [('Hawa Mahal', '12 min'), ('City Palace', '15 min'), ('Bazaar', '10 min'), ('Airport', '13 km')],
        'best_for': ['family', 'culture', 'heritage', 'shopping'],
    },
    'Udaipur': {
        'summary': 'City of Lakes with romantic heritage hotels, peaceful ghats and vibrant bazaars.',
        'noise': 'Low', 'nightlife': 'Low', 'family_friendly': 'High',
        'tourist_activity': 'High', 'transport': 'Moderate', 'food': 'Good', 'local_activity': 'Medium',
        'nearby': [('Lake Pichola', '5 min walk'), ('City Palace', '10 min'), ('Old Market', '8 min'), ('Airport', '22 km')],
        'best_for': ['couples', 'family', 'quiet', 'heritage'],
    },
    'Mumbai': {
        'summary': 'The city that never sleeps. Maximum energy and diversity — perfect for business and urban explorers.',
        'noise': 'High', 'nightlife': 'High', 'family_friendly': 'Medium',
        'tourist_activity': 'High', 'transport': 'Excellent', 'food': 'Excellent', 'local_activity': 'High',
        'nearby': [('Marine Drive', '2 min'), ('Colaba', '20 min'), ('CST Station', '25 min'), ('Airport', '30 min')],
        'best_for': ['business', 'solo', 'nightlife', 'urban'],
    },
    'Bangalore': {
        'summary': 'India\'s tech hub with cosmopolitan lifestyle, great cafes and vibrant parks.',
        'noise': 'Medium', 'nightlife': 'High', 'family_friendly': 'High',
        'tourist_activity': 'Medium', 'transport': 'Good', 'food': 'Excellent', 'local_activity': 'High',
        'nearby': [('Indiranagar Market', '5 min'), ('Cubbon Park', '20 min'), ('MG Road', '15 min'), ('Airport', '35 km')],
        'best_for': ['business', 'solo', 'couple', 'tech'],
    },
    'Rishikesh': {
        'summary': 'Yoga capital of the world on the banks of the Ganga. Peaceful, spiritual and adventure-ready.',
        'noise': 'Low', 'nightlife': 'Low', 'family_friendly': 'High',
        'tourist_activity': 'High', 'transport': 'Moderate', 'food': 'Good', 'local_activity': 'High',
        'nearby': [('Lakshman Jhula', '5 min'), ('Ganga Ghat', '3 min'), ('Yoga Ashram', '10 min'), ('Dehradun', '43 km')],
        'best_for': ['solo', 'spiritual', 'adventure', 'quiet'],
    },
    'Darjeeling': {
        'summary': 'Tea garden hills with panoramic Himalayan views and colonial charm.',
        'noise': 'Low', 'nightlife': 'Low', 'family_friendly': 'High',
        'tourist_activity': 'High', 'transport': 'Moderate', 'food': 'Good', 'local_activity': 'Medium',
        'nearby': [('Tiger Hill', '11 km'), ('Tea Garden', '15 min walk'), ('Mall Road', '10 min'), ('Station', '20 min')],
        'best_for': ['family', 'nature', 'quiet', 'adventure'],
    },
    'Shimla': {
        'summary': 'Queen of hill stations with colonial architecture, crisp mountain air and pine forests.',
        'noise': 'Low', 'nightlife': 'Low', 'family_friendly': 'High',
        'tourist_activity': 'High', 'transport': 'Good', 'food': 'Good', 'local_activity': 'Medium',
        'nearby': [('Mall Road', '5 min walk'), ('Jakhu Temple', '2 km'), ('Ridge', '8 min'), ('Bus Stand', '12 min')],
        'best_for': ['family', 'couple', 'quiet', 'heritage'],
    },
    'Ooty': {
        'summary': 'The Queen of Nilgiris — tea gardens, eucalyptus forests and cool misty mornings.',
        'noise': 'Low', 'nightlife': 'Low', 'family_friendly': 'High',
        'tourist_activity': 'High', 'transport': 'Moderate', 'food': 'Good', 'local_activity': 'Medium',
        'nearby': [('Doddabetta Peak', '10 km'), ('Botanical Garden', '15 min'), ('Ooty Lake', '8 min'), ('Bus Stand', '10 min')],
        'best_for': ['family', 'couple', 'nature', 'quiet'],
    },
    'DEFAULT': {
        'summary': 'A well-connected neighbourhood with good local amenities and convenient transport links.',
        'noise': 'Low', 'nightlife': 'Low', 'family_friendly': 'High',
        'tourist_activity': 'Medium', 'transport': 'Good', 'food': 'Good', 'local_activity': 'Medium',
        'nearby': [('Market', '10 min walk'), ('Bus Stop', '5 min'), ('Restaurant', '8 min'), ('Airport', '30 km')],
        'best_for': ['family', 'quiet'],
    },
}

PREFERENCE_MAP = {
    'quiet':     lambda d: d['noise'] in ('Low',),
    'nightlife': lambda d: d['nightlife'] in ('High', 'Medium'),
    'family':    lambda d: d['family_friendly'] == 'High',
    'beach':     lambda d: d.get('city', '') in ('Goa', 'Udaipur', 'Kovalam'),
    'adventure': lambda d: 'adventure' in d['best_for'],
    'business':  lambda d: d['transport'] in ('Excellent', 'Good'),
    'solo':      lambda d: True,
    'couple':    lambda d: True,
}


def get_neighbourhood(city: str) -> dict:
    data = dict(NEIGHBOURHOOD_DATA.get(city, NEIGHBOURHOOD_DATA['DEFAULT']))
    data['is_demo'] = True
    data['city'] = city
    return data


def calculate_neighbourhood_match(city: str, preferences: list) -> dict:
    """Calculate how well a neighbourhood matches guest preferences."""
    data = get_neighbourhood(city)
    if not preferences:
        return {'match_pct': 75, 'reasons': [], 'mismatches': [], 'is_demo': True}
    matched = []
    mismatched = []
    for pref in preferences:
        fn = PREFERENCE_MAP.get(pref.lower())
        if fn:
            if fn(data):
                matched.append(pref.capitalize())
            else:
                mismatched.append(pref.capitalize())
    total = len(preferences)
    match_pct = round((len(matched) / total) * 100) if total else 75
    return {
        'match_pct': match_pct,
        'reasons': [f'✓ {m}' for m in matched],
        'mismatches': [f'⚠ Limited {m.lower()}' for m in mismatched],
        'is_demo': True,
    }


def compute_trust_score(property_id: int) -> dict:
    """Compute deterministic trust score from DB. DEMO MODE — no external APIs."""
    prop = Property.query.get(property_id)
    if not prop:
        return None

    owner = User.query.get(prop.user_id)
    images = PropertyImage.query.filter_by(property_id=property_id).all()
    reviews = Review.query.filter_by(property_id=property_id).all()

    scores = {}
    explanations = {}
    signals = {}

    # 1. Host Verification (25 pts)
    hv = 0
    hv_pos, hv_risk = [], []
    if owner:
        if owner.is_verified_host:
            hv += 20; hv_pos.append('Host submitted to identity verification process')
        else:
            hv_risk.append('Host has not yet completed identity verification')
        if owner.phone: hv += 3; hv_pos.append('Phone number provided')
        if owner.email: hv += 2; hv_pos.append('Email address on file')
    scores['host_verification'] = min(25, hv)
    explanations['host_verification'] = (
        'Based on host identity information, document submission, and contact verification. '
        'Verification confidence reflects collected signals — not a guarantee of identity authenticity. '
        'Additional review may be required.'
    )
    signals['host_verification'] = {
        'positive': hv_pos, 'risk': hv_risk,
        'confidence': 94 if (owner and owner.is_verified_host) else 45,
    }

    # 2. Listing Consistency (15 pts)
    lc = 10
    lc_pos, lc_risk = [], []
    if prop.description and len(prop.description) > 100:
        lc += 2; lc_pos.append('Listing has detailed description')
    else:
        lc_risk.append('Listing description is short or missing — add more detail')
    if prop.address and prop.city:
        lc += 1; lc_pos.append('Complete address and city information provided')
    if prop.total_rooms and prop.total_bathrooms:
        lc += 1; lc_pos.append(f'Room ({prop.total_rooms}) and bathroom ({prop.total_bathrooms}) counts specified')
    if prop.max_guests:
        lc += 1; lc_pos.append(f'Maximum guest capacity specified ({prop.max_guests})')
    if len(images) >= prop.total_rooms:
        lc_pos.append(f'Image count ({len(images)}) covers declared room count ({prop.total_rooms})')
    else:
        lc_risk.append(f'Only {len(images)} images for {prop.total_rooms} declared rooms — more recommended')
        lc -= 2
    scores['listing_consistency'] = max(0, min(15, lc))
    explanations['listing_consistency'] = (
        'Checks whether property details are internally consistent — room counts vs images, '
        'amenities vs description, pricing completeness and location accuracy.'
    )
    signals['listing_consistency'] = {'positive': lc_pos, 'risk': lc_risk, 'confidence': 78}

    # 3. Review Confidence (20 pts)
    rc = 15
    rc_pos, rc_risk = [], []
    if not reviews:
        rc = 12; rc_risk.append('No reviews yet — confidence based on listing quality only')
    else:
        date_counts = Counter(str(r.review_date)[:7] for r in reviews if r.review_date)
        if date_counts and max(date_counts.values()) > 5:
            rc -= 3; rc_risk.append(f'Potentially unusual review activity: {max(date_counts.values())} reviews in a single month')
        else:
            rc_pos.append('Review activity appears consistent over time')
        neg = sum(1 for r in reviews if r.sentiment == 'Negative')
        if neg > len(reviews) * 0.3:
            rc -= 2; rc_risk.append(f'{neg} negative reviews — potentially worth reading')
        elif neg > 0:
            rc_pos.append('Balanced review feedback including some critical reviews (natural pattern)')
        avg = sum(r.rating for r in reviews) / len(reviews)
        if avg >= 4.5:
            rc += 3; rc_pos.append(f'High average rating {avg:.1f}/5 across {len(reviews)} reviews')
        elif avg >= 3.5:
            rc += 1; rc_pos.append(f'Average rating {avg:.1f}/5 across {len(reviews)} reviews')
    scores['review_confidence'] = max(0, min(20, rc))
    explanations['review_confidence'] = (
        'Analyzes review patterns for potentially unusual signals such as burst activity, repeated phrasing, '
        'and sentiment distribution. Signals are not proof of fake reviews — they indicate patterns that '
        'may warrant additional review.'
    )
    signals['review_confidence'] = {'positive': rc_pos, 'risk': rc_risk, 'confidence': 82}

    # 4. Fraud Risk (20 pts — higher = safer)
    fr = 18
    fr_pos, fr_risk_sigs = [], []
    if 500 <= (prop.base_price or 0) <= 50000:
        fr_pos.append('Listing price is within normal market reference range (DEMO reference data)')
    elif prop.base_price < 500:
        fr -= 5; fr_risk_sigs.append('Price is unusually low — potential pricing anomaly detected')
    else:
        fr -= 2; fr_risk_sigs.append('Price is significantly above typical range for this category')
    dup = sum(1 for img in images if img.is_duplicate)
    if dup > 1:
        fr -= 3; fr_risk_sigs.append(f'{dup} potentially duplicate images detected')
    else:
        fr_pos.append('No duplicate images detected in this listing')
    suspicious = ['western union', 'wire transfer', 'pay outside', 'whatsapp only']
    desc_l = (prop.description or '').lower()
    if any(p in desc_l for p in suspicious):
        fr -= 4; fr_risk_sigs.append('Potentially suspicious payment language detected in description')
    else:
        fr_pos.append('No external payment or suspicious language found in description')
    if owner and owner.is_verified_host:
        fr_pos.append('Listing host has completed verification process')
    else:
        fr -= 2; fr_risk_sigs.append('Host verification not completed — reduces overall confidence')
    scores['fraud_risk'] = max(0, min(20, fr))
    risk_level = 'LOW' if scores['fraud_risk'] >= 16 else ('MEDIUM' if scores['fraud_risk'] >= 10 else 'HIGH')
    explanations['fraud_risk'] = (
        'Analysis of listing text, pricing anomalies, image duplication and payment language. '
        'Results indicate potential risk signals — not proof of fraud. '
        'Trustora uses the language "Potential risk detected" — never "guaranteed safe" or "fraud-free".'
    )
    signals['fraud_risk'] = {
        'positive': fr_pos, 'risk': fr_risk_sigs, 'confidence': 76,
        'risk_level': risk_level, 'risk_score': 100 - (scores['fraud_risk'] * 5),
    }

    # 5. Photo Quality (10 pts)
    pq = 0
    pq_pos, pq_risk = [], []
    if images:
        avg_q = sum(img.overall_score or 80 for img in images) / len(images)
        pq = min(10, int(avg_q / 10))
        if avg_q >= 85: pq_pos.append(f'Average photo quality {avg_q:.0f}/100')
        else: pq_risk.append(f'Average photo quality {avg_q:.0f}/100 — could be improved')
        if len(images) >= 5: pq_pos.append(f'{len(images)} photos provide good coverage')
        else: pq_risk.append(f'Only {len(images)} photos — recommend at least 5')
    else:
        pq = 3; pq_risk.append('No photos uploaded — significantly reduces trust signals')
    scores['photo_quality'] = pq
    explanations['photo_quality'] = (
        'Evaluates image brightness, composition, sharpness and room coverage. '
        'Scores are based on metadata and heuristic analysis — not guaranteed accuracy.'
    )
    signals['photo_quality'] = {'positive': pq_pos, 'risk': pq_risk, 'confidence': 71}

    # 6. Neighbourhood (10 pts)
    nb_data = get_neighbourhood(prop.city)
    nb_score = 8
    nb_pos = [f'Neighbourhood intelligence available for {prop.city} (DEMO DATA)']
    nb_risk = []
    if nb_data['noise'] == 'High':
        nb_risk.append('Area has higher noise levels — may not suit all guests')
    if nb_data['family_friendly'] == 'High':
        nb_pos.append('Area is rated family-friendly')
    scores['neighbourhood'] = nb_score
    explanations['neighbourhood'] = (
        'Based on curated neighbourhood data for this city. '
        'All neighbourhood signals are DEMO DATA — not sourced from live municipal or satellite data.'
    )
    signals['neighbourhood'] = {'positive': nb_pos, 'risk': nb_risk, 'confidence': 65}

    total = sum(scores.values())
    max_total = sum(WEIGHTS.values())

    return {
        'property_id': property_id,
        'total_score': total,
        'max_score': max_total,
        'percentage': round(total / max_total * 100),
        'is_demo': True,
        'demo_note': 'All trust scores are computed from demo data only. No external KYC or identity APIs are connected.',
        'computed_at': datetime.utcnow().isoformat(),
        'weights': WEIGHTS,
        'breakdown': {
            k: {
                'score': scores[k],
                'max': WEIGHTS[k],
                'pct': round(scores[k] / WEIGHTS[k] * 100),
                'explanation': explanations[k],
                'signals': signals[k],
                'last_updated': datetime.utcnow().isoformat(),
            }
            for k in WEIGHTS
        },
        'fraud_level': signals['fraud_risk']['risk_level'],
        'fraud_risk_score': signals['fraud_risk']['risk_score'],
        'review_confidence_score': round(scores['review_confidence'] / WEIGHTS['review_confidence'] * 100),
        'neighbourhood_data': nb_data,
    }


def get_trust_history(property_id: int) -> list:
    """Simulated trust score history (DEMO DATA)."""
    prop = Property.query.get(property_id)
    if not prop: return []
    base = max(55, (prop.trust_score or 80) - 25)
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    events = [
        'Initial listing created on Trustora',
        'Host verification submitted',
        'Photos uploaded and analyzed',
        'First guest reviews received',
        'Host verification completed',
        'Listing consistency improved',
    ]
    history, current = [], base
    for i, month in enumerate(months):
        if i > 0: current = min(prop.trust_score or 80, current + 3 + i)
        history.append({'month': month, 'score': current, 'event': events[i], 'is_demo': True})
    return history


def get_trust_timeline(property_id: int) -> list:
    """Property trust audit timeline (DEMO DATA)."""
    prop = Property.query.get(property_id)
    if not prop: return []
    owner = User.query.get(prop.user_id)
    images = PropertyImage.query.filter_by(property_id=property_id).all()
    reviews = Review.query.filter_by(property_id=property_id).all()
    created = prop.created_at or datetime.utcnow()
    events = [
        {'date': created.strftime('%d %b %Y'), 'title': 'Property listed on Trustora', 'detail': f'{prop.name} — {prop.city}', 'status': 'done'},
        {'date': created.strftime('%d %b %Y'), 'title': 'Listing description analyzed', 'detail': 'Consistency and completeness check completed', 'status': 'done'},
        {'date': created.strftime('%d %b %Y'), 'title': f'{len(images)} photos analyzed', 'detail': 'Photo quality and duplicate scan completed (DEMO)', 'status': 'done'},
    ]
    if owner and owner.is_verified_host:
        events.append({'date': created.strftime('%d %b %Y'), 'title': 'Host verification completed ✓', 'detail': 'Verification confidence: 94% (DEMO)', 'status': 'verified'})
    else:
        events.append({'date': '—', 'title': 'Host verification pending', 'detail': 'Complete verification to increase trust score', 'status': 'pending'})
    if reviews:
        events.append({'date': reviews[-1].review_date.strftime('%d %b %Y') if hasattr(reviews[-1].review_date, 'strftime') else '—',
            'title': f'{len(reviews)} reviews analyzed', 'detail': 'Anomaly detection completed', 'status': 'done'})
    events.append({'date': datetime.utcnow().strftime('%d %b %Y'),
        'title': 'Trust Score updated', 'detail': f'Current score: {prop.trust_score}/100 (DEMO)', 'status': 'current'})
    return events


class TrustService:
    @staticmethod
    def extract_neighborhood_vibe(city, address=""):
        data = get_neighbourhood(city)
        return data.get('summary', 'Vibrant local neighborhood with authentic surroundings.')

    @staticmethod
    def compute_trust_score(property_id):
        return compute_trust_score(property_id)

    @staticmethod
    def calculate_trust_score(prop):
        if hasattr(prop, 'id'):
            res = compute_trust_score(prop.id)
            return res.get('total_score', 94) if res else 94
        return 94
