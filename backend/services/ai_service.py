import json

class AIService:
    @staticmethod
    def generate_listing(property_data, target_guests='Couples & Families', tone='Luxury & Inviting', nearby_attractions=''):
        name = property_data.get('name', 'Boutique Stay')
        p_type = property_data.get('property_type', 'Villa')
        city = property_data.get('city', 'Goa')
        rooms = property_data.get('total_rooms', 2)
        bathrooms = property_data.get('total_bathrooms', 2)
        guests = property_data.get('max_guests', 4)
        amenities = property_data.get('amenities', ['High-Speed Wi-Fi', 'Air Conditioning', 'Kitchen', 'Pool'])
        
        amenity_str = ', '.join(amenities[:6])
        attractions_str = nearby_attractions or f'prime cafes, serene beaches, and cultural landmarks in {city}'
        
        if 'Luxury' in tone:
            title = f'Exquisite {rooms}-BHK {p_type} in {city} | Private Sanctuary & Scenic Views'
            headline = f'Experience quintessential luxury at {name}, a masterfully curated {p_type.lower()} designed for discerning travelers seeking comfort, tranquility, and refined hospitality in {city}.'
        elif 'Cozy' in tone or 'Boho' in tone:
            title = f'Charming {rooms}-BHK {p_type} in Heart of {city} | Boho Retreat with Fast Wi-Fi'
            headline = f'Welcome to {name}, your cozy home-away-from-home in {city}. Immerse yourself in warm, sunlit interiors and thoughtful handcrafted details.'
        else:
            title = f'Modern {rooms}-BHK {p_type} in {city} | High-Speed Wi-Fi, Pool & Great Location'
            headline = f'Discover the perfect getaway at {name}, a modern and fully equipped {p_type.lower()} strategically located in {city}.'

        description = (
            f'{headline}\n\n'
            f'Whether you are visiting for a rejuvenating vacation, a productive workcation, or memorable family moments, '
            f'this sanctuary offers everything you need. Featuring {rooms} beautifully appointed bedrooms, {bathrooms} pristine bathrooms, '
            f'and generous living spaces that accommodate up to {guests} guests in supreme comfort.\n\n'
            f'✦ THE SPACE:\n'
            f'- Spacious master bedroom with premium plush bedding\n'
            f'- Sunlit open-concept living area with ergonomic workstations and high-speed Wi-Fi\n'
            f'- Fully equipped gourmet kitchen with modern cookware, microwave, and coffee maker\n'
            f'- Private balcony / outdoor relaxation zone overlooking lush greenery\n\n'
            f'✦ PRIME LOCATION & ACCESSIBILITY:\n'
            f'Nestled in a peaceful, secure neighborhood just minutes away from {attractions_str}. Enjoy seamless access to '
            f'top-rated local dining, supermarkets, and transport hubs while retreating to absolute quiet at night.\n\n'
            f'✦ HOSTBOOST VERIFIED HOSPITALITY:\n'
            f'Managed with professional care, continuous sanitization, 24/7 self check-in support, and local recommendations '
            f'to make your stay extraordinary.'
        )

        highlights = [
            f'Prime {city} location within minutes of top attractions & dining',
            f'Blazing-fast 200+ Mbps Wi-Fi and dedicated ergonomic desk for remote work',
            f'{rooms} plush bedrooms sleeping up to {guests} guests with premium linens',
            f'Fully stocked kitchen with microwave, refrigerator, and essentials',
            f'Trustora Verified host badge & keyless self check-in'
        ]

        amenities_summary = f'Features premium essentials including {amenity_str}, power backup, 24/7 security, dedicated parking, and spotless private bathrooms.'
        seo_description = f'Book {name} in {city}. Top-rated {rooms}-bedroom {p_type.lower()} for up to {guests} guests featuring {amenity_str}. Best price guarantee & verified host.'

        return {
            'title': title,
            'description': description,
            'highlights': highlights,
            'amenities_summary': amenities_summary,
            'seo_description': seo_description,
            'target_audience': target_guests,
            'tone': tone
        }

    @staticmethod
    def generate_growth_recommendations(property_id, kpis=None):
        return [
            {
                'category': 'Revenue & Pricing',
                'title': 'Capture High Weekend Demand (+12% ADR)',
                'recommendation': 'Increase Friday and Saturday nightly rates by Rs. 350 - Rs. 500 for the upcoming 4 weekends.',
                'reasoning': 'Historical occupancy on weekends exceeds 88% while weekday occupancy is 58%. The local market has strong leisure travel demand that easily absorbs weekend rate increases without hurting bookings.',
                'potential_impact': '+Rs. 18,500 monthly revenue',
                'impact_metric': 'Revenue'
            },
            {
                'category': 'Photography & Conversion',
                'title': 'Upgrade Bedroom & Workspace Photography',
                'recommendation': 'Add 2 wide-angle daytime photos of the master bedroom and dedicated work desk.',
                'reasoning': 'Photo quality analysis detected low contrast in bedroom photo #2. Listings with well-lit workspace photos convert 28% faster for high-value mid-week stays.',
                'potential_impact': '+24% listing conversion rate',
                'impact_metric': 'Conversion'
            },
            {
                'category': 'Trustora Reputation',
                'title': 'Complete Host Identity Verification',
                'recommendation': 'Submit government ID and property utility bill for verified host badge activation.',
                'reasoning': 'Guests prioritize trust on independent rentals. Listings with the Trustora Verified badge command a 15% price premium and 40% lower cancellation rates.',
                'potential_impact': '+15% guest trust index',
                'impact_metric': 'Trust'
            },
            {
                'category': 'Operations & Amenities',
                'title': 'Promote Self Check-In & Power Backup',
                'recommendation': 'Highlight your digital keypad lock and inverter in the top 3 bullet points.',
                'reasoning': 'Over 65% of guest inquiries ask about late check-in flexibility and continuous power supply for work.',
                'potential_impact': '-50% pre-booking support inquiries',
                'impact_metric': 'Efficiency'
            }
        ]
