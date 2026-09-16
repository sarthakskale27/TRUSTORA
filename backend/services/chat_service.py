import re
from datetime import datetime

class ChatAssistantService:
    @classmethod
    def generate_response(cls, incoming_message, property_obj=None, session_history=None):
        msg = incoming_message.lower().strip()
        p_name = property_obj.name if property_obj else 'our property'
        p_city = property_obj.city if property_obj else 'Goa'
        p_price = int(property_obj.base_price) if property_obj else 2500
        p_vibe = property_obj.neighborhood_vibe if property_obj else 'safe and peaceful'
        
        if any(w in msg for w in ['hi', 'hello', 'hey', 'namaste', 'good morning', 'good evening']):
            return (
                f"Hello! 🌿 Welcome to *{p_name}* (HostBoost Concierge).\n\n"
                f"I can assist you instantly with:\n"
                f"1️#⃣ Room Availability & Dates\n"
                f"2️#⃣ Nightly Rates & Best Offers\n"
                f"3️#⃣ Amenities (Wi-Fi, Kitchen, Pool, Parking)\n"
                f"4️#⃣ Check-in Timing & Location Directions\n"
                f"5️#⃣ Existing Booking Status\n\n"
                f"How can I help you today?"
            )

        if any(w in msg for w in ['available', 'availability', 'dates', 'vacancy', 'open', 'free']):
            return (
                f"📅 *Availability Status for {p_name}*:\n\n"
                f"We have confirmed openings for the upcoming dates!\n"
                f"• Standard & Deluxe Rooms are available for instant reservation.\n"
                f"• Peak weekend slots fill up quickly.\n\n"
                f"Please share your desired **Check-in** and **Check-out** dates, and number of guests to reserve instantly! �("
            )

        if any(w in msg for w in ['price', 'rate', 'cost', 'how much', 'discount', 'quote', 'tariff']):
            return (
                f"💰 *Nightly Rates for {p_name}*:\n\n"
                f"• Base Price: **Rs. {p_price} / night** (inclusive of high-speed Wi-Fi and amenities)\n"
                f"• Stays of 5+ nights receive an automatic **10% weekly discount**!\n"
                f"• Cleaning & Sanitization: Complimentary\n\n"
                f"Would you like me to calculate the exact quote for your dates?"
            )

        if any(w in msg for w in ['wifi', 'wi-fi', 'amenities', 'pool', 'kitchen', 'parking', 'ac', 'power backup', 'gym']):
            return (
                f"�( *Amenities at {p_name}*:\n\n"
                f"• 📶 **High-Speed Wi-Fi** (200+ Mbps optical fiber with power backup)\n"
                f"• ❄️ **Air Conditioning** in all bedrooms & living lounge\n"
                f"• 🍣 **Fully Equipped Kitchen** (Microwave, fridge, gas stove, cookware)\n"
                f"• 🚗 **Free Secure Parking** on premises\n"
                f"• 🏰 **Swimming Pool / Garden Access** (Cleaned daily)\n"
                f"• 🛡 24/7 CCTV security & keyless digital door lock"
            )

        if any(w in msg for w in ['check in', 'check-in', 'check out', 'check-out', 'timing', 'address', 'location', 'where']):
            return (
                f"📍 *Check-in & Location Details*:\n\n"
                f"• 🕒 **Check-in**: From 2:00 PM (Early check-in upon prior request)\n"
                f"• 🕚 **Check-out**: By 11:00 AM\n"
                f"• 🔑 **Keyless Self Check-in**: You will receive a unique door PIN on your check-in morning.\n"
                f"• 📍 **Location**: {p_city} ({p_vibe})\n\n"
                f"Exact Google Maps coordinates and digital entry instructions are sent immediately upon booking confirmation."
            )

        if any(w in msg for w in ['booking status', 'confirm', 'reservation', 'hb-']):
            return (
                f"🔍 *Booking Lookup*:\n\n"
                f"To look up your reservation details, please reply with your **Booking Reference Code** (e.g., HB-7821) or registered phone number.\n"
                f"Our automated system will verify your confirmation instantly!"
            )

        return (
            f"Thank you for messaging *{p_name}*! 🌟\n\n"
            f"Our standard nightly rate is **Rs. {p_price}**. We offer high-speed Wi-Fi, air conditioning, fully equipped kitchen, and 24/7 self check-in.\n\n"
            f"Feel free to ask about specific dates, room types, or special discounts!"
            )
