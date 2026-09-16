import React, { useEffect, useState } from 'react';
import { Star, MessageSquare, Loader2 } from 'lucide-react';
import api from '../../services/api';

export const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch reviews from the first few properties as demo data
    Promise.all([1,2,3,4,5].map(id =>
      api.get(`/properties/${id}/reviews`).then(r => r.data.reviews).catch(() => [])
    )).then(all => {
      const flat = all.flat().slice(0, 8);
      setReviews(flat);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 text-emerald-400 animate-spin" /></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-400 fill-amber-400" /> My Reviews
        </h1>
        <p className="text-slate-400 text-sm mt-1">Reviews you've shared with the community</p>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <Star className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="font-semibold">No reviews yet</p>
          <p className="text-xs mt-1">After a stay, share your experience to help other travellers</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-white font-bold text-sm">{r.reviewer_name || 'Anonymous'}</p>
                  <p className="text-slate-500 text-xs">{r.review_date || 'Recently'}</p>
                </div>
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`w-3.5 h-3.5 ${s <= (r.rating || 5) ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} />
                  ))}
                </div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{r.comment || 'Great stay!'}</p>
              {r.is_flagged && (
                <span className="mt-2 inline-block text-[10px] px-2 py-0.5 rounded-full bg-rose-900/20 border border-rose-500/30 text-rose-400 font-semibold">
                  Flagged by Trustora
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
