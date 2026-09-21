from datetime import datetime
from flask import Blueprint, request, jsonify
from models import db, Property, ChatSession, ChatMessage, ConciergeConfig
from routes.auth_routes import token_required

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/config', methods=['GET'])
def get_concierge_config():
    """Get host's automated WhatsApp & AI message configuration for a property."""
    prop_id = request.args.get('property_id', type=int)
    if not prop_id:
        # Default to first property if not specified
        prop = Property.query.first()
        prop_id = prop.id if prop else 1
    else:
        prop = Property.query.get(prop_id)
        
    p_name = prop.name if prop else 'Luxury Stay'
    p_city = prop.city if prop else 'Goa'

    cfg = ConciergeConfig.query.filter_by(property_id=prop_id).first()
    if not cfg:
        # Return intelligent defaults based on property
        return jsonify({
            'config': {
                'property_id': prop_id,
                'property_name': p_name,
                'welcome_message': f"Welcome to {p_name}! 🌴 We are thrilled to host you. Please find your check-in and WiFi details below. Enjoy your stay!",
                'wifi_ssid': f"{p_name.replace(' ', '')}_Guest",
                'wifi_password': f"TrustoraStay{p_city}2026",
                'door_lock_code': "4829#",
                'checkout_instructions': "Check-out is at 11:00 AM. Please leave the keys on the dining counter and switch off the air conditioning. Safe travels!",
                'local_recommendations': f"Top spots in {p_city}: 1. Fisherman's Wharf (Seafood) 2. Sunset Beach Cafe 3. Local Spice Plantation Tour.",
                'emergency_contact': "+91 98200 88776 (Host Manager 24/7)",
                'is_active': True
            }
        }), 200

    d = cfg.to_dict()
    d['property_name'] = p_name
    return jsonify({'config': d}), 200


@chat_bp.route('/config', methods=['POST'])
@token_required
def save_concierge_config(current_user):
    """Host saves their customized automated messages and AI concierge settings."""
    data = request.get_json() or {}
    prop_id = data.get('property_id')
    if not prop_id:
        return jsonify({'error': 'property_id is required'}), 400

    prop = Property.query.get(prop_id)
    if not prop:
        return jsonify({'error': 'Property not found'}), 404

    cfg = ConciergeConfig.query.filter_by(property_id=prop_id).first()
    if not cfg:
        cfg = ConciergeConfig(property_id=prop_id)
        db.session.add(cfg)

    cfg.welcome_message = data.get('welcome_message', cfg.welcome_message)
    cfg.wifi_ssid = data.get('wifi_ssid', cfg.wifi_ssid)
    cfg.wifi_password = data.get('wifi_password', cfg.wifi_password)
    cfg.door_lock_code = data.get('door_lock_code', cfg.door_lock_code)
    cfg.checkout_instructions = data.get('checkout_instructions', cfg.checkout_instructions)
    cfg.local_recommendations = data.get('local_recommendations', cfg.local_recommendations)
    cfg.emergency_contact = data.get('emergency_contact', cfg.emergency_contact)
    cfg.is_active = data.get('is_active', True)
    cfg.updated_at = datetime.utcnow()

    db.session.commit()
    return jsonify({
        'message': 'Automated WhatsApp message & concierge settings updated successfully!',
        'config': cfg.to_dict()
    }), 200


@chat_bp.route('/send', methods=['POST'])
def send_message():
    """24/7 AI Concierge chat endpoint with host custom configuration integration."""
    data = request.get_json() or {}
    user_msg = data.get('message', '').strip()
    guest_name = data.get('guest_name', 'Guest')
    prop_id = data.get('property_id')
    
    prop = None
    if prop_id:
        prop = Property.query.get(prop_id)
    if not prop:
        prop = Property.query.first()
        
    p_name = prop.name if prop else 'Verified Sanctuary'
    p_city = prop.city if prop else 'Goa'
    p_price = int(prop.base_price or 5000) if prop else 5000

    # Retrieve host custom settings if configured
    cfg = ConciergeConfig.query.filter_by(property_id=prop.id).first() if prop else None
    wifi_ssid = cfg.wifi_ssid if (cfg and cfg.wifi_ssid) else f"{p_name.replace(' ', '')}_Guest"
    wifi_pass = cfg.wifi_password if (cfg and cfg.wifi_password) else f"Sunset{p_city}2026"
    lock_code = cfg.door_lock_code if (cfg and cfg.door_lock_code) else "4829#"
    welcome_custom = cfg.welcome_message if (cfg and cfg.welcome_message) else None
    checkout_custom = cfg.checkout_instructions if (cfg and cfg.checkout_instructions) else None
    rec_custom = cfg.local_recommendations if (cfg and cfg.local_recommendations) else None
    emerg_contact = cfg.emergency_contact if (cfg and cfg.emergency_contact) else "+91 98200 88776"

    lower_msg = user_msg.lower()
    
    if any(w in lower_msg for w in ['hi', 'hello', 'hey', 'namaste', 'start', 'greet']):
        if welcome_custom:
            response_text = f"Hi {guest_name}! 🌴 {welcome_custom}\n\n• 📶 WiFi: {wifi_ssid} (Pass: {wifi_pass})\n• 🔑 Digital Key: {lock_code}\n\nHow can I make your stay memorable today?"
        else:
            response_text = f"Hi {guest_name}! 🌴 Welcome to *{p_name}* in {p_city}.\n\n• 📶 WiFi: {wifi_ssid} (Password: {wifi_pass})\n• 🔑 Smart Door Lock: {lock_code}\n• 🛎️ 24/7 AI Concierge: Active\n\nFeel free to ask about local dining, early check-in, or amenities!"

    elif any(w in lower_msg for w in ['wifi', 'wi-fi', 'internet', 'password', 'code', 'lock', 'door']):
        response_text = f"Here are your access details for *{p_name}*:\n\n📶 **High-Speed Optical WiFi**: '{wifi_ssid}'\n🔐 **Password**: '{wifi_pass}' (200+ Mbps Fiber)\n🚪 **Smart Door PIN**: {lock_code}\n\nLet us know if you need assistance connecting!"

    elif any(w in lower_msg for w in ['checkout', 'check-out', 'check out', 'timing', 'leave', 'late check']):
        if checkout_custom:
            response_text = f"🕒 **Check-out Guidelines for {p_name}**:\n\n{checkout_custom}\n\n📞 Host Assistance: {emerg_contact}"
        else:
            response_text = f"🕒 **Check-out Details for {p_name}**:\n\n• Standard Check-out: 11:00 AM\n• Late check-out till 1:30 PM is approved upon request!\n• Keys can be left at the digital smart lock dock.\n• Complimentary luggage storage is available."

    elif any(w in lower_msg for w in ['food', 'restaurant', 'seafood', 'dinner', 'lunch', 'eat', 'cafe', 'shack', 'recommend']):
        if rec_custom:
            response_text = f"🍴 **Host's Handpicked Recommendations for {p_name}**:\n\n{rec_custom}\n\nEnjoy authentic local dining!"
        else:
            response_text = f"🍴 **Top Recommended Dining Near {p_name}**:\n\n1. 🦞 *Fisherman's Wharf* (Fresh river catch & live music)\n2. 🍛 *Pousada by the Beach* (Scenic coastal sunset dining)\n3. ☕ *Artjuna Garden Cafe* (Artisan coffee & healthy breakfast)\n\nWould you like assistance booking a table?"

    elif any(w in lower_msg for w in ['cab', 'taxi', 'scooter', 'bike', 'rent', 'rental', 'airport', 'transport']):
        response_text = f"🛵 **Transport & Rentals for {p_name}**:\n\n• Pre-verified Activa/Scooter: Manoj (+91 98221 44550) — ₹400/day\n• Airport Taxi Pickup: Suresh Driver (+91 98230 11200) — Fixed AC Tariff\n• Mention your reservation at *{p_name}* for priority service!"

    elif any(w in lower_msg for w in ['pool', 'spa', 'amenities', 'kitchen', 'parking', 'ac', 'breakfast']):
        response_text = f"🏰 **Amenities & Facilities at {p_name}**:\n\n• 🏊 Private/Community Pool (Open 6:30 AM – 10:30 PM)\n• 🍳 Fully equipped kitchen with microwave, toaster & cookware\n• 🚗 Free on-premise secure parking\n• ❄️ Split AC in all bedrooms\n• 🛡️ Trustora 24/7 Safety Monitored"

    elif any(w in lower_msg for w in ['price', 'rate', 'cost', 'tariff', 'book', 'nightly']):
        response_text = f"💰 **Tariff for {p_name}**:\n\n• Nightly Rate: **₹{p_price.toLocaleString() if hasattr(p_price, 'toLocaleString') else f'{p_price:,}'} / night**\n• Includes all verified amenities & daily housekeeping.\n• 100% Free Cancellation active up to 48 hours prior to check-in."

    elif any(w in lower_msg for w in ['help', 'contact', 'emergency', 'phone', 'manager', 'host']):
        response_text = f"🚨 **Host & Support Contact for {p_name}**:\n\n• Host Emergency Helpline: {emerg_contact}\n• Trustora 24/7 SafeGuard: support@trustora.ai\n• Security Gate Desk: Intercom #101"

    else:
        response_text = f"Thank you for contacting *{p_name}*! 🌿\n\nOur 24/7 AI Concierge has logged your inquiry. I can help you with:\n1. 🔑 WiFi & Keyless Door Codes\n2. 🍽️ Local Restaurant Recommendations\n3. 🕒 Check-in & Late Check-out\n4. 🛵 Scooter/Cab Rentals & Airport Transfers\n\nHow else can I assist your stay?"

    return jsonify({
        'reply': response_text,
        'response': response_text,
        'assistant_response': response_text,
        'status': 'sent',
        'property_id': prop.id if prop else None,
        'property_name': p_name
    }), 200

