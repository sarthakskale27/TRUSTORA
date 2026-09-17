import React, { useEffect, useState } from 'react';
import { Star, MessageSquare, Loader2, Building2, Plus, X } from 'lucide-react';
import api from '../../services/api';

export const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ property_id: '', rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [properties, setProperties] = useState([]);

  const fetchReviews = () => {
    setLoading(true);
    api.get('/guest/my-reviews')
      .then(r => setReviews(r.data.reviews || []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReviews();
    api.get('/guest/properties/search').then(r => setProperties(r.data.properties || [])).catch(() => {});
  }, []);

  const submitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/guest/reviews', form);
      setShowForm(false);
      setForm({ property_id: '', rating: 5, comment: '' });
      fetchReviews();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 text-emerald-400 animate-spin" /></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" /> My Reviews
          </h1>
          <p className="text-slate-400 text-sm mt-1">Reviews you've shared with the community</p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white font-bold text-sm transition-all"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'Write Review'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={submitReview} className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-5 space-y-4">
          <h3 className="text-white font-bold">Share Your Experience</h3>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Property</label>
            <select
              value={form.property_id}
              onChange={e => setForm(f => ({ ...f, property_id: e.target.value }))}
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            >
              <option value="">Select a property you stayed at...</option>
              {properties.map(p => <option key={p.id} value={p.id}>{p.name} — {p.city}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Rating</label>
            <div className="flex items-center gap-2">
              {[1,2,3,4,5].map(s => (
                <button key={s} type="button" onClick={() => setForm(f => ({ ...f, rating: s }))} className="focus:outline-none">
                  <Star className={`w-7 h-7 transition-colors ${s <= form.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                </button>
              ))}
              <span className="text-slate-400 text-sm ml-2">{form.rating}/5</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Your Review</label>
            <textarea
              value={form.comment}
              onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
              required
              rows={4}
              placeholder="Describe your stay experience..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 resize-none"
            />
          </div>
          <button type="submit" disabled={submitting} className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl text-white font-bold text-sm hover:opacity-90 transition flex items-center justify-center gap-2">
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      {reviews.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <Star className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="font-semibold text-slate-400">No reviews yet</p>
          <p className="text-xs mt-1 text-slate-600">After a stay, share your experience to help other travellers</p>
          <button onClick={() => setShowForm(true)} className="mt-4 px-4 py-2 bg-emerald-600/20 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm font-semibold hover:bg-emerald-600/30 transition">
            Write your first review
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              {r.property_name && (
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-slate-400 text-xs">{r.property_name}</span>
                  {r.property_city && <span className="text-slate-600 text-xs">• {r.property_city}</span>}
                  {r.property_image && (
                    <img src={r.property_image} alt={r.property_name} className="w-8 h-8 rounded-lg object-cover ml-auto" />
                  )}
                </div>
              )}
              <div className="flex items-start justify-between mb-2">
                <p className="text-slate-500 text-xs">{r.review_date || 'Recently'}</p>
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`w-3.5 h-3.5 ${s <= (r.rating || 5) ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} />
                  ))}
                </div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{r.comment || 'Great stay!'}</p>
              {r.anomaly_flag && (
                <span className="mt-2 inline-block text-[10px] px-2 py-0.5 rounded-full bg-rose-900/20 border border-rose-500/30 text-rose-400 font-semibold">
                  Flagged by Trustora AI
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
