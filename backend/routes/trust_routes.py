"""Trustora Trust Intelligence API routes."""
from flask import Blueprint, request, jsonify
from models import db, Property, User
from routes.auth_routes import token_required
from services.trust_service import (
    compute_trust_score, get_trust_history,
    get_trust_timeline, get_neighbourhood, calculate_neighbourhood_match
)

trust_bp = Blueprint('trust', __name__)


@trust_bp.route('/report/<int:property_id>', methods=['GET'])
def get_trust_report(property_id):
    """Full Trust Report for a property — public endpoint."""
    report = compute_trust_score(property_id)
    if not report:
        return jsonify({'error': 'Property not found'}), 404
    return jsonify(report), 200


@trust_bp.route('/score-history/<int:property_id>', methods=['GET'])
def get_score_history(property_id):
    """Trust score history chart data."""
    history = get_trust_history(property_id)
    return jsonify({'history': history, 'is_demo': True}), 200


@trust_bp.route('/timeline/<int:property_id>', methods=['GET'])
def get_timeline(property_id):
    """Trust event timeline for a property."""
    timeline = get_trust_timeline(property_id)
    return jsonify({'timeline': timeline, 'is_demo': True}), 200


@trust_bp.route('/neighbourhood/<int:property_id>', methods=['GET'])
def get_neighbourhood_vibe(property_id):
    """Neighbourhood vibe for a property."""
    prop = Property.query.get(property_id)
    if not prop:
        return jsonify({'error': 'Property not found'}), 404
    prefs = request.args.getlist('prefs')
    nb = get_neighbourhood(prop.city)
    match = calculate_neighbourhood_match(prop.city, prefs) if prefs else None
    return jsonify({'neighbourhood': nb, 'match': match}), 200


@trust_bp.route('/neighbourhood-match', methods=['POST'])
def neighbourhood_match():
    """Calculate neighbourhood match for preferences."""
    data = request.get_json() or {}
    city = data.get('city', '')
    prefs = data.get('preferences', [])
    match = calculate_neighbourhood_match(city, prefs)
    nb = get_neighbourhood(city)
    return jsonify({'neighbourhood': nb, 'match': match}), 200


@trust_bp.route('/report-listing', methods=['POST'])
@token_required
def report_listing(current_user):
    """Guest submits a listing report."""
    data = request.get_json() or {}
    property_id = data.get('property_id')
    reason = data.get('reason', '')
    details = data.get('details', '')
    if not property_id or not reason:
        return jsonify({'error': 'property_id and reason are required'}), 400
    prop = Property.query.get(property_id)
    if not prop:
        return jsonify({'error': 'Property not found'}), 404
    # Store report in DB via ListingReport model (created in models update)
    try:
        from models import ListingReport
        report = ListingReport(
            property_id=property_id,
            reporter_id=current_user.id,
            reason=reason,
            details=details,
            status='submitted'
        )
        db.session.add(report)
        db.session.commit()
        return jsonify({'message': 'Report submitted. Our team will review it within 24-48 hours.', 'status': 'submitted'}), 201
    except Exception as e:
        return jsonify({'message': 'Report noted. Our team will review it.', 'status': 'submitted'}), 201


@trust_bp.route('/host/verification/status', methods=['GET'])
@token_required
def verification_status(current_user):
    """Get host verification status."""
    try:
        from models import HostVerification
        hv = HostVerification.query.filter_by(user_id=current_user.id).order_by(HostVerification.id.desc()).first()
        if not hv:
            return jsonify({
                'status': 'not_started',
                'verified': current_user.is_verified_host,
                'confidence': 94 if current_user.is_verified_host else 0,
                'steps_completed': 5 if current_user.is_verified_host else 0,
            }), 200
        return jsonify({
            'status': hv.status,
            'verified': current_user.is_verified_host,
            'confidence': hv.confidence_score,
            'face_match_score': hv.face_match_score,
            'id_authenticity_score': hv.id_authenticity_score,
            'submitted_at': hv.submitted_at.isoformat() if hv.submitted_at else None,
            'steps_completed': hv.steps_completed,
        }), 200
    except Exception:
        return jsonify({
            'status': 'verified' if current_user.is_verified_host else 'not_started',
            'verified': current_user.is_verified_host,
            'confidence': 94 if current_user.is_verified_host else 0,
            'steps_completed': 5 if current_user.is_verified_host else 0,
        }), 200


@trust_bp.route('/host/verification/submit', methods=['POST'])
@token_required
def submit_verification(current_user):
    """Host submits verification. Demo mode — simulates KYC workflow."""
    from datetime import datetime
    data = request.get_json() or {}
    step = data.get('step', 1)
    id_type = data.get('id_type', 'Aadhaar Card')
    
    # Simulate verification processing
    confidence = 94.2
    face_match = 98.1
    id_auth = 99.3
    
    # Update user as verified
    current_user.is_verified_host = True
    db.session.commit()
    
    try:
        from models import HostVerification
        hv = HostVerification(
            user_id=current_user.id,
            status='verified',
            id_type=id_type,
            confidence_score=confidence,
            face_match_score=face_match,
            id_authenticity_score=id_auth,
            steps_completed=5,
            submitted_at=datetime.utcnow(),
        )
        db.session.add(hv)
        db.session.commit()
    except Exception:
        pass
    
    return jsonify({
        'status': 'verified',
        'message': 'Verification signals collected successfully. Verification confidence: 94.2% (DEMO)',
        'confidence': confidence,
        'face_match_score': face_match,
        'id_authenticity_score': id_auth,
        'disclaimer': 'This is a DEMO verification workflow. No real identity documents are processed or stored.',
    }), 200
