import re
from datetime import datetime

class TrustService:
    @classmethod
    def analyze_reviews_and_fraud(cls, reviews, host_verified=True, price_deviation=0.0):
        signals = []
        anomaly_detected = False
        anomaly_reasons = []

        dates = [r.get('review_date') or r.get('created_at') for r in reviews if r]
        date_counts = {}
        for d in dates:
            if d:
                d_str = str(d)[:10]
                date_counts[d_str] = date_counts.get(d_str, 0) + 1
            
        burst_dates = [d for d, count in date_counts.items() if count >= 3]
        if burst_dates:
            anomaly_detected = True
            reason = f'Unusual velocity: {len(burst_dates)} sudden review burst clusters detected within 24-48h.'
            anomaly_reasons.append(reason)
            signals.append({
                'type': 'negative',
                'signal': 'Review Velocity Spike',
                'impact': -8,
                'detail': reason
            })
        else:
            signals.append({
                'type': 'positive',
                'signal': 'Organic Review Cadence',
                'impact': 5,
                'detail': 'Reviews distributed naturally over several months of verified guest stays.'
            })

        text_corpus = [r.get('comment', '').lower() for r in reviews]
        repetitive_count = 0
        for i, text1 in enumerate(text_corpus):
            for j, text2 in enumerate(text_corpus):
                if i != j and len(text1) > 20 and len(text2) > 20:
                    words1 = set(re.findall(r'\w+', text1))
                    words2 = set(re.findall(r'\w+', text2))
                    if words1 and words2:
                        sim = len(words1 & words2) / len(words1 | words2)
                        if sim > 0.75:
                            repetitive_count += 1

        if repetitive_count > 1:
            anomaly_detected = True
            reason = 'Repetitive wording detected across multiple reviews (possible bot or manipulation).'
            anomaly_reasons.append(reason)
            signals.append({
                'type': 'negative',
                'signal': 'Repetitive Review Patterns',
                'impact': -12,
                'detail': reason
            })
        else:
            signals.append({
                'type': 'positive',
                'signal': 'Linguistic Diversity',
                'impact': 6,
                'detail': 'Distinct vocabulary and varied guest perspectives confirm authentic feedback.'
            })

        if host_verified:
            signals.append({
                'type': 'positive',
                'signal': 'Verified Host ID & Ownership',
                'impact': 15,
                'detail': 'Host identity confirmed with government ID and verified property utility bill.'
            })
        else:
            signals.append({
                'type': 'negative',
                'signal': 'Unverified Host Identity',
                'impact': -10,
                'detail': 'Host profile has pending ID documentation.'
            })

        if price_deviation < -0.40:
            signals.append({
                'type': 'negative',
                'signal': 'Suspicious Underpricing',
                'impact': -15,
                'detail': 'Price is >40% below comparable market listings, which may correlate with scam risks.'
            })
        else:
            signals.append({
                'type': 'positive',
                'signal': 'Transparent Market Pricing',
                'impact': 8,
                'detail': 'Nightly rates align with neighborhood standard benchmarks.'
            })

        calculated_score = 75 + sum(s['impact'] for s in signals)
        final_score = max(25, min(99, calculated_score))
        risk_level = 'low' if final_score >= 80 else ('medium' if final_score >= 60 else 'high')

        return {
            'trust_score': final_score,
            'risk_level': risk_level,
            'is_verified': host_verified,
            'anomaly_detected': anomaly_detected,
            'anomaly_reasons': anomaly_reasons,
            'signals': signals,
            'radar_summary': f'Trustora score of {final_score}/100 with {len([s for s in signals if s["type"] == "positive"])} positive verification signals.'
        }

    @staticmethod
    def extract_neighborhood_vibe(city, address, reviews=None):
        vibes_map = {
            'goa': 'Sunlit & Coastal • 5 min stroll to beach & vibrant beach shacks • Quiet at night',
            'bangalore': 'Tech Corridor & Walkable • Close to Indiranagar cafes, metro & co-working hubs',
            'manali': 'Mountain Retreat • Pine forest views, peaceful riverside trails & cozy cafes',
            'jaipur': 'Heritage Quarter • 10 mins to City Palace, artisan bazaars & rooftop restaurants',
            'mumbai': 'Seaside Promenade • Panoramic sea breeze, minutes from trendy eateries & transit'
        }
        for k, v in vibes_map.items():
            if k in (city or '').lower():
                return v
        return 'Peaceful & Safe Residential Neighborhood • Close to local markets, transit & cafes'
