import os
import sys
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from config import Config
from models import db, User
from seed_data import seed_database

# Import Blueprints
from routes.auth_routes import auth_bp
from routes.property_routes import property_bp
from routes.booking_routes import booking_bp
from routes.pricing_routes import pricing_bp
from routes.ai_routes import ai_bp
from routes.chat_routes import chat_bp
from routes.analytics_routes import analytics_bp
from routes.notification_routes import notification_bp
from routes.guest_routes import guest_bp

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Enable CORS for all origins in development
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Initialize Database
    db.init_app(app)
    
    # Register Blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(property_bp, url_prefix='/api/properties')
    app.register_blueprint(booking_bp, url_prefix='/api/bookings')
    app.register_blueprint(pricing_bp, url_prefix='/api/pricing')
    app.register_blueprint(ai_bp, url_prefix='/api/ai')
    app.register_blueprint(chat_bp, url_prefix='/api/chat')
    app.register_blueprint(analytics_bp, url_prefix='/api/analytics')
    app.register_blueprint(notification_bp, url_prefix='/api/notifications')
    app.register_blueprint(guest_bp, url_prefix='/api/guest')

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'online',
            'service': 'Trustora Trust Intelligence Backend',
            'tagline': "Don't just book what looks good. Book what you can trust.",
            'version': '3.0.0'
        }), 200

    @app.route('/api/seed', methods=['POST', 'GET'])
    def trigger_seed():
        seed_database(app)
        return jsonify({'message': 'Trustora Database successfully seeded!'}), 200

    # Global Error Handlers
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({'error': 'Resource not found'}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({'error': 'An internal server error occurred. Please try again.'}), 500

    with app.app_context():
        db.create_all()
        if User.query.count() == 0:
            seed_database(app)

    return app

app = create_app()

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    print(f'[Trustora AI] Backend running on http://127.0.0.1:{port}')
    app.run(host='0.0.0.0', port=port, debug=True)
