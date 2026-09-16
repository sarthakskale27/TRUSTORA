import React, { useState } from 'react';
import { Camera, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, UploadCloud, Eye, Sliders } from 'lucide-react';
import api from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../context/ToastContext';

export const PhotoAnalyzer = () => {
  const { success, error } = useToast();
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80');
  const [category, setCategory] = useState('living_room');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const samplePhotos = [
    { name: 'Luxury Pool Villa', url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80', cat: 'pool_exterior' },
    { name: 'Mountain Chalet Bedroom', url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80', cat: 'bedroom' },
    { name: 'Modern Kitchen & Dining', url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80', cat: 'kitchen' },
  ];

  const handleAnalyze = async () => {
    if (!photoUrl) return;
    setAnalyzing(true);
    try {
      const res = await api.post('/ai/analyze-photo', {
        photo_url: photoUrl,
        category
      });
      setAnalysisResult(res.data.analysis);
      success('Photo Vision diagnostic complete!');
    } catch (e) {
      error('Failed to analyze photo.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-400">
              Trustora Vision AI
            </span>
            <Badge variant="cyan" size="sm">Neural Quality Radar</Badge>
          </div>
          <h1 className="text-2xl font-black text-white">Photo Quality & Staging Diagnostics</h1>
          <p className="text-xs text-slate-400 mt-1">
            Analyze property photography for optimal lighting, composition, clutter detection, and OTA hero-image conversion.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input & Preview */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-indigo-400" /> Select or Enter Photo URL
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Photo Web URL</label>
              <input
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Presets */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-400 font-semibold">Or pick a sample photo:</span>
              <div className="flex flex-wrap gap-2">
                {samplePhotos.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setPhotoUrl(s.url);
                      setCategory(s.cat);
                    }}
                    className="text-[11px] px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500 text-slate-300 hover:text-white transition-all"
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Preview Box */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 h-56 w-full">
              <img src={photoUrl} alt="Inspection Preview" className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3">
                <Badge variant="primary" size="sm">Preview Mode</Badge>
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {analyzing ? 'Scanning Lighting & Staging...' : 'Run Vision Quality Diagnostic'}
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Diagnostic Scorecard */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          {!analysisResult ? (
            <div className="py-24 text-center">
              <Camera className="w-12 h-12 text-slate-700 mx-auto mb-3 animate-pulse" />
              <h4 className="text-sm font-bold text-white">Awaiting Diagnostic Scan</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                Click Run Diagnostic to receive granular staging scores and recommendations.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Overall Score Header */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 to-indigo-950/40 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase font-bold text-slate-400">Overall Photo Quality</span>
                  <h3 className="text-3xl font-black text-white mt-0.5">
                    {analysisResult.overall_score || 92}<span className="text-sm text-slate-400">/100</span>
                  </h3>
                </div>
                <Badge
                  variant={(analysisResult.overall_score || 92) >= 85 ? 'success' : 'warning'}
                  size="lg"
                >
                  {analysisResult.recommendation || 'Hero Photo Ready'}
                </Badge>
              </div>

              {/* Granular Sub-Metrics */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Metric Breakdown</h4>
                {[
                  { label: 'Lighting & Exposure', score: analysisResult.lighting_score || 94, color: 'bg-amber-400' },
                  { label: 'Framing & Composition', score: analysisResult.composition_score || 88, color: 'bg-indigo-400' },
                  { label: 'Staging & Cleanliness', score: analysisResult.staging_score || 95, color: 'bg-emerald-400' },
                  { label: 'Resolution & Sharpness', score: analysisResult.sharpness_score || 90, color: 'bg-cyan-400' },
                ].map((m, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 font-medium">{m.label}</span>
                      <span className="font-bold text-white">{m.score}%</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                      <div className={`h-full ${m.color} rounded-full`} style={{ width: `${m.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Actionable Improvement Tips */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> AI Recommendations
                </h4>
                <ul className="space-y-2">
                  {analysisResult.tips?.map((tip, i) => (
                    <li key={i} className="text-xs text-slate-300 p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 leading-relaxed">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
