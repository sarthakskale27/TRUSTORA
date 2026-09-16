from datetime import datetime
from flask import Blueprint, request, jsonify
from models import db, Property, ChatSession, ChatMessage
from routes.auth_routes import token_required
from services.chat_service import ChatAssistantService

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/send', methods=['POST'])
def send_message():
    data = request.get_json() or {}
    user_msg = data.get('message', '').strip()
    guest_name = data.get('guest_name', 'Priya')
    property_name = data.get('property_name', 'Casa Bella Luxury Villa')
    
    response_text = ""
    lower_msg = user_msg.lower()
    
    if 'wifi' in lower_msg or 'wi-fi' in lower_msg or 'internet' in lower_msg or 'code' in lower_msg:
        response_text = f"Hi {guest_name}! 🌴 The high-speed 5G WiFi is 'CasaBella_Guest' and password is 'SunsetVilla2026'. The digital smart door lock code is 4829#. Let us know if you need anything else!"
    elif 'seafood' in lower_msg or 'food' in lower_msg or 'restaurant' in lower_msg or 'diner' in lower_msg or 'shack' in lower_msg:
        response_text = f"Here are the top 3 spots nearby {property_name}:\n1. Fisherman's Wharf (Fresh tiger prawns & river views)\n2. Pousada by the Beach (Quiet sunset dining)\n3. Thalassa (Greek Mediterranean & cliffside cocktails). Enjoy!"
    elif 'checkout' in lower_msg or 'check-out' in lower_msg or 'late' in lower_msg:
        response_text = f"Hi {guest_name}, late check-out till 2:00 PM is approved for your stay at {property_name}! Complimentary luggage storage is also available at reception."
    elif 'scooter' in lower_msg or 'cab' in lower_msg or 'rental' in lower_msg or 'taxi' in lower_msg:
        response_text = f"You can reach our verified scooter partner Manoj at +91 98221 44550 (₹400/day for Activa). Pre-negotiated taxi pickups can also be booked with driver Suresh at +91 98230 11200."
    else:
        response_text = f"Hello {guest_name}! Thank you for messaging {property_name}. Our 24/7 AI Hospitality Concierge has logged your inquiry. Is there anything specific regarding your stay we can assist with?"

    return jsonify({
        'response': response_text,
        'assistant_response': response_text,
        'status': 'sent'
    }), 200
