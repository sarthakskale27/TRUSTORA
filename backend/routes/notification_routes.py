from flask import Blueprint, request, jsonify
from models import db, Notification
from routes.auth_routes import token_required

notification_bp = Blueprint('notifications', __name__)

@notification_bp.route('', methods=['GET'])
@token_required
def get_notifications(current_user):
    notifs = Notification.query.filter_by(user_id=current_user.id).order_by(Notification.created_at.desc()).all()
    unread_count = sum(1 for n in notifs if not n.is_read)
    return jsonify({
        'notifications': [n.to_dict() for n in notifs],
        'unread_count': unread_count
    }), 200

@notification_bp.route('/read-all', methods=['PUT'])
@token_required
def read_all(current_user):
    Notification.query.filter_by(user_id=current_user.id).update({'is_read': True})
    db.session.commit()
    return jsonify({'message': 'All notifications marked as read'}), 200
