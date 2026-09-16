import React, { useState, useEffect } from 'react';
import { Sparkles, Copy, Check, RefreshCw, Layers, Wand2, Eye, Share2 } from 'lucide-react';
import api from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../context/ToastContext';

export const AICopywriter = () => {
  const { success, error } = useToast();
  const [properties, setProperties] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [tone, setTone] = useState('luxury');
  const [channel, setChannel] = useState('airbnb');
  const [customKeywords, setCustomKeywords] = useState('sunset view, private pool, high speed wifi, gourmet kitchen');
  const [generating, setGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await api.get('/properties');
        const props = res.data.properties || [];
        setProperties(props);
        if (props.length > 0) setSelectedPropertyId(props[0].id);
      } catch (e) {}
    };
    fetchProperties();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await api.post('/ai/generate-listing', {
        property_id: selectedPropertyId || undefined,
        tone,
        channel,
        keywords: customKeywords.split(',').map((k) => k.trim()).filter(Boolean)
      });
      setGeneratedResult(res.data.listing);
      success('AI listing copy & SEO highlights generated!');
    } catch (e) {
      error('Failed to generate listing copy.');
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    success('Copied to clipboard!');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-500/20 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-400">
              Trustora Creative Suite
            </span>
            <Badge variant="purple" size="sm">Multi-Tone SEO</Badge>
          </div>
          <h1 className="text-2xl font-black text-white">AI Listing Copywriter</h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate high-converting headlines, descriptions, and captions tailored for OTAs and direct bookings.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Panel */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-indigo-400" /> Prompt Configuration
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Select Listing Property</label>
            <select
              value={selectedPropertyId}
              onChange={(e) => setSelectedPropertyId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.city})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Copywriting Tone</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'luxury', label: 'Ultra Luxury & Exclusive' },
                { id: 'warm', label: 'Warm & Homely' },
                { id: 'high_converting', label: 'High-Converting & Direct' },
                { id: 'eco', label: 'Eco-Boutique & Serene' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTone(t.id)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                    tone === t.id
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Distribution Channel</label>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="airbnb">Airbnb & VRBO Listing</option>
              <option value="booking">Booking.com / Agoda Format</option>
              <option value="direct">Direct Website Landing Page</option>
              <option value="instagram">Instagram / Social Media Hook</option>
              <option value="welcome">Guest Welcome & Guidebook Note</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Keywords / Amenities</label>
            <textarea
              rows={3}
              value={customKeywords}
              onChange={(e) => setCustomKeywords(e.target.value)}
              placeholder="e.g. infinity pool, sea view, high speed fiber wifi"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {generating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Synthesizing AI Copy...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Generate High-Converting Copy
              </>
            )}
          </button>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 flex flex-col justify-between">
          {!generatedResult ? (
            <div className="py-24 text-center my-auto">
              <Sparkles className="w-12 h-12 text-slate-700 mx-auto mb-3 animate-pulse" />
              <h4 className="text-sm font-bold text-white">No copy generated yet</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                Select your listing and preferred tone, then click Generate to produce professional copy.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Catchy Titles */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    Recommended Catchy Titles
                  </h4>
                  <Badge variant="cyan" size="sm">High CTR</Badge>
                </div>
                <div className="space-y-2">
                  {generatedResult.titles?.map((t, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs font-bold text-white group"
                    >
                      <span className="truncate">{t}</span>
                      <button
                        onClick={() => copyToClipboard(t, `title-${idx}`)}
                        className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                        title="Copy title"
                      >
                        {copiedKey === `title-${idx}` ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Listing Body Description */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    Storytelling Description & Highlights
                  </h4>
                  <button
                    onClick={() => copyToClipboard(generatedResult.description, 'desc')}
                    className="flex items-center gap-1.5 text-xs text-indigo-300 hover:text-indigo-200 font-bold"
                  >
                    {copiedKey === 'desc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy All
                  </button>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed max-h-64 overflow-y-auto whitespace-pre-line">
                  {generatedResult.description}
                </div>
              </div>

              {/* SEO Tags */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Included SEO Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {generatedResult.seo_tags?.map((tag, i) => (
                    <span key={i} className="text-[11px] px-2.5 py-1 rounded-lg bg-indigo-950/40 text-indigo-300 border border-indigo-500/20 font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
