from datetime import datetime, date, timedelta

class PricingService:
    SEEDED_COMPETITORS = [
        {'name': 'SeaBreeze Boutique Homestay', 'type': 'Villa', 'city': 'Goa', 'avg_rate': 2850, 'rating': 4.8},
        {'name': 'Palm Shadows Luxury Stay', 'type': 'Villa', 'city': 'Goa', 'avg_rate': 3200, 'rating': 4.9},
        {'name': 'Cozy Haven Studio Apartments', 'type': 'Apartment', 'city': 'Bangalore', 'avg_rate': 2400, 'rating': 4.6},
        {'name': 'Indiranagar Urban Loft', 'type': 'Apartment', 'city': 'Bangalore', 'avg_rate': 2750, 'rating': 4.7},
        {'name': 'Snowcrest Pine Cottages', 'type': 'Cottage', 'city': 'Manali', 'avg_rate': 3600, 'rating': 4.8},
        {'name': 'Pink City Heritage Haveli', 'type': 'Homestay', 'city': 'Jaipur', 'avg_rate': 2900, 'rating': 4.9},
        {'name': 'Bandra Marine Bay View', 'type': 'Apartment', 'city': 'Mumbai', 'avg_rate': 4500, 'rating': 4.85}
    ]

    LOCAL_EVENTS = {
        'Goa': [
            {'name': 'Sunburn Music Festival & New Year', 'start': (12, 20), 'end': (1, 5), 'boost': 0.35},
            {'name': 'Goa Carnival Week', 'start': (2, 10), 'end': (2, 20), 'boost': 0.20},
            {'name': 'Monsoon Tourism Glow', 'start': (7, 1), 'end': (8, 31), 'boost': -0.10}
        ],
        'Manali': [
            {'name': 'Winter Snow Season Peak', 'start': (12, 15), 'end': (1, 31), 'boost': 0.30},
            {'name': 'Summer Escape Rush', 'start': (5, 1), 'end': (6, 30), 'boost': 0.25}
        ],
        'Bangalore': [
            {'name': 'Tech Con & Global AI Summit', 'start': (10, 10), 'end': (10, 20), 'boost': 0.15},
            {'name': 'Aero India Airshow', 'start': (2, 12), 'end': (2, 18), 'boost': 0.25}
        ],
        'Jaipur': [
            {'name': 'Jaipur Literature Festival', 'start': (1, 20), 'end': (1, 30), 'boost': 0.30},
            {'name': 'Pushkar Mela & Diwali Season', 'start': (11, 1), 'end': (11, 20), 'boost': 0.25}
        ]
    }

    @classmethod
    def calculate_recommendation(cls, base_price, target_date, city='Goa', current_occupancy=65.0):
        if isinstance(target_date, str):
            target_date = datetime.strptime(target_date, '%Y-%m-%d').date()

        day_of_week = target_date.weekday()
        month = target_date.month
        day = target_date.day

        factors = []
        multiplier = 1.0

        if day_of_week in (4, 5):
            dow_impact = 0.16
            multiplier += dow_impact
            factors.append({
                'factor_name': 'Weekend Demand Surge',
                'impact_percent': 16.0,
                'impact_amount': round(base_price * dow_impact, 2),
                'description': 'High leisure weekend booking velocity (+16%)'
            })
        elif day_of_week == 6:
            dow_impact = 0.05
            multiplier += dow_impact
            factors.append({
                'factor_name': 'Sunday Leisure Extension',
                'impact_percent': 5.0,
                'impact_amount': round(base_price * dow_impact, 2),
                'description': 'Moderate weekend extension demand (+5%)'
            })
        else:
            dow_impact = -0.04
            multiplier += dow_impact
            factors.append({
                'factor_name': 'Midweek Value Optimization',
                'impact_percent': -4.0,
                'impact_amount': round(base_price * dow_impact, 2),
                'description': 'Competitive rate to maximize business/midweek occupancy (-4%)'
            })

        if month in (11, 12, 1, 2):
            season_impact = 0.18
            multiplier += season_impact
            factors.append({
                'factor_name': 'Peak Tourism Season',
                'impact_percent': 18.0,
                'impact_amount': round(base_price * season_impact, 2),
                'description': 'Winter high tourist season in destination (+18%)'
            })
        elif month in (6, 7, 8):
            season_impact = -0.08
            multiplier += season_impact
            factors.append({
                'factor_name': 'Monsoon / Off-Peak Season',
                'impact_percent': -8.0,
                'impact_amount': round(base_price * season_impact, 2),
                'description': 'Off-season competitive dynamic adjustment (-8%)'
            })
        else:
            season_impact = 0.05
            multiplier += season_impact
            factors.append({
                'factor_name': 'Shoulder Season Balance',
                'impact_percent': 5.0,
                'impact_amount': round(base_price * season_impact, 2),
                'description': 'Steady shoulder season travel flow (+5%)'
            })

        city_events = cls.LOCAL_EVENTS.get(city, [])
        for ev in city_events:
            sm, sd = ev['start']
            em, ed = ev['end']
            if sm <= month <= em:
                if (month > sm or day >= sd) and (month < em or day <= ed):
                    boost = ev['boost']
                    multiplier += boost
                    factors.append({
                        'factor_name': f"Local Event: {ev['name']}",
                        'impact_percent': round(boost * 100, 1),
                        'impact_amount': round(base_price * boost, 2),
                        'description': f"Area-wide demand spike from {ev['name']}"
                    })
                    break

        comp = next((c for c in cls.SEEDED_COMPETITORS if c['city'].lower() == city.lower()), None)
        comp_price = comp['avg_rate'] if comp else base_price * 1.1
        comp_diff = (comp_price - base_price) / base_price
        comp_impact = max(-0.10, min(0.12, comp_diff * 0.25))
        multiplier += comp_impact
        factors.append({
            'factor_name': 'Market Competitor Index (Seeded Demo Data)',
            'impact_percent': round(comp_impact * 100, 1),
            'impact_amount': round(base_price * comp_impact, 2),
            'description': f'Benchmark against nearby verified listings (Avg Rs. {int(comp_price)})'
        })

        if current_occupancy > 75:
            occ_impact = 0.08
            factors.append({
                'factor_name': 'High Host Occupancy Rate',
                'impact_percent': 8.0,
                'impact_amount': round(base_price * occ_impact, 2),
                'description': f'Current occupancy is {int(current_occupancy)}%, protecting yield with premium rate'
            })
            multiplier += occ_impact
        elif current_occupancy < 40:
            occ_impact = -0.06
            factors.append({
                'factor_name': 'Occupancy Stimulator',
                'impact_percent': -6.0,
                'impact_amount': round(base_price * occ_impact, 2),
                'description': f'Low occupancy ({int(current_occupancy)}%), stimulating rapid guest acquisition'
            })
            multiplier += occ_impact

        raw_rec = base_price * multiplier
        recommended_price = round(raw_rec / 50) * 50
        min_range = round((recommended_price * 0.94) / 50) * 50
        max_range = round((recommended_price * 1.06) / 50) * 50

        return {
            'date': target_date.strftime('%Y-%m-%d'),
            'current_price': round(base_price),
            'recommended_price': int(recommended_price),
            'min_range': int(min_range),
            'max_range': int(max_range),
            'factors': factors,
            'summary_reason': f'Recommended rate of Rs. {int(recommended_price)} balances {len(factors)} signals including weekend trends, local events, and competitor benchmarks.'
        }
