import os
import sys
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from config import Config
from models import db, User
from seed_data import seed_database, seed_dummy_guests, rebalance_host_properties

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
from routes.trust_routes import trust_bp

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Enable CORS for all origins in production and development
    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
    
    # Initialize Database
    db.init_app(app)
    
    # Register Blueprints with /api prefix
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(property_bp, url_prefix='/api/properties')
    app.register_blueprint(booking_bp, url_prefix='/api/bookings')
    app.register_blueprint(pricing_bp, url_prefix='/api/pricing')
    app.register_blueprint(ai_bp, url_prefix='/api/ai')
    app.register_blueprint(chat_bp, url_prefix='/api/chat')
    app.register_blueprint(analytics_bp, url_prefix='/api/analytics')
    app.register_blueprint(notification_bp, url_prefix='/api/notifications')
    app.register_blueprint(guest_bp, url_prefix='/api/guest')
    app.register_blueprint(trust_bp, url_prefix='/api/trust')

    # Also register root prefixes as aliases so calls without /api never 404
    app.register_blueprint(auth_bp, url_prefix='/auth', name='auth_alt')
    app.register_blueprint(property_bp, url_prefix='/properties', name='properties_alt')
    app.register_blueprint(booking_bp, url_prefix='/bookings', name='bookings_alt')
    app.register_blueprint(pricing_bp, url_prefix='/pricing', name='pricing_alt')
    app.register_blueprint(ai_bp, url_prefix='/ai', name='ai_alt')
    app.register_blueprint(chat_bp, url_prefix='/chat', name='chat_alt')
    app.register_blueprint(analytics_bp, url_prefix='/analytics', name='analytics_alt')
    app.register_blueprint(notification_bp, url_prefix='/notifications', name='notifications_alt')
    app.register_blueprint(guest_bp, url_prefix='/guest', name='guest_alt')
    app.register_blueprint(trust_bp, url_prefix='/trust', name='trust_alt')

    @app.route('/health', methods=['GET'])
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'online',
            'service': 'Trustora Trust Intelligence Backend',
            'tagline': "Don't just book what looks good. Book what you can trust.",
            'database': 'connected',
            'version': '3.0.0'
        }), 200

    @app.route('/api/seed', methods=['POST', 'GET'])
    def trigger_seed():
        try:
            seed_database(app)
            return jsonify({'message': 'Trustora Database successfully seeded!'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/api/seed/dummy-guests', methods=['POST', 'GET'])
    def trigger_seed_guests():
        try:
            seed_dummy_guests(app)
            return jsonify({'message': 'Dummy Guest Accounts (Aarav, Ananya, Rohit, Meera) successfully seeded with bookings & reviews!'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/api/seed/rebalance-hosts', methods=['POST', 'GET'])
    def trigger_rebalance_hosts():
        try:
            rebalance_host_properties(app)
            return jsonify({'message': 'Host property ownership successfully rebalanced! Sarthak owns 3 properties.'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    # Global Error Handlers
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({'error': 'Resource not found'}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({'error': 'An internal server error occurred. Please try again.'}), 500

    with app.app_context():
        try:
            db.create_all()
            if User.query.count() == 0:
                seed_database(app)
            print("[Trustora AI] Database connected and initialized successfully!")
        except Exception as e:
            print(f"[Trustora AI Warning] Remote DB init warning (falling back if needed): {e}")

    return app

app = create_app()

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    print(f'[Trustora AI] Backend running on http://127.0.0.1:{port}')
    app.run(host='0.0.0.0', port=port, debug=True)
