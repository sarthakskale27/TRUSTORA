from flask import Blueprint, request, jsonify
from functools import wraps
import jwt
from datetime import datetime, timedelta
from flask_bcrypt import Bcrypt
from config import Config
from models import db, User

auth_bp = Blueprint('auth', __name__)
bcrypt = Bcrypt()

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')
        if auth_header:
            parts = auth_header.split(' ')
            if len(parts) == 2 and parts[0].lower() == 'bearer':
                token = parts[1]
        if not token:
            return jsonify({'error': 'Authentication token is missing'}), 401
        try:
            payload = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=['HS256'])
            current_user = User.query.get(payload['user_id'])
            if not current_user:
                return jsonify({'error': 'User not found'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired, please login again'}), 401
        except Exception:
            return jsonify({'error': 'Invalid authentication token'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

def generate_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + Config.JWT_ACCESS_TOKEN_EXPIRES,
        'iat': datetime.utcnow()
    }
    return jwt.encode(payload, Config.JWT_SECRET_KEY, algorithm='HS256')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    name     = data.get('name', '').strip()
    email    = data.get('email', '').strip().lower()
    password = data.get('password', '')
    phone    = data.get('phone', '')
    role     = data.get('role', 'host')   # 'host' or 'guest'
    if role not in ('host', 'guest'):
        role = 'host'

    if not name or not email or not password:
        return jsonify({'error': 'Name, email, and password are required'}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'An account with this email already exists'}), 409

    pw_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(
        name=name, email=email, password_hash=pw_hash,
        phone=phone, role=role,
        is_verified_host=(role == 'host')
    )
    db.session.add(new_user)
    db.session.commit()

    token = generate_token(new_user.id)
    return jsonify({'message': 'Registration successful', 'token': token, 'user': new_user.to_dict()}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email    = data.get('email', '').strip().lower()
    password = data.get('password', '')
    user = User.query.filter_by(email=email).first()
    if not user or not bcrypt.check_password_hash(user.password_hash, password):
        return jsonify({'error': 'Invalid email or password'}), 401
    token = generate_token(user.id)
    return jsonify({'message': 'Login successful', 'token': token, 'user': user.to_dict()}), 200

@auth_bp.route('/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    return jsonify({'user': current_user.to_dict()}), 200

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    return jsonify({'message': 'If that email exists, a password reset link has been sent.'}), 200

@auth_bp.route('/google-mock', methods=['POST'])
def google_mock():
    data = request.get_json() or {}
    google_email = data.get('email', 'host@trustora.ai')
    google_name  = data.get('name', 'Premium Host')
    role         = data.get('role', 'host')
    user = User.query.filter_by(email=google_email).first()
    if not user:
        user = User(
            name=google_name, email=google_email,
            password_hash=bcrypt.generate_password_hash('google_oauth_pass').decode('utf-8'),
            role=role, is_verified_host=(role == 'host')
        )
        db.session.add(user)
        db.session.commit()
    token = generate_token(user.id)
    return jsonify({'message': 'Google authentication successful', 'token': token, 'user': user.to_dict()}), 200
