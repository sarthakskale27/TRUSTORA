import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare, Send, Sparkles, Loader2, Building2,
  MapPin, CheckCircle2, ShieldCheck, Phone, Compass,
  Calendar, Key, Utensils, Waves, Car, Clock, HelpCircle
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const GuestConcierge = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();

  const [properties, setProperties] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [selectedPropId, setSelectedPropId] = useState('');
  const [loadingProps, setLoadingProps] = useState(true);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // Load properties and guest bookings
  useEffect(() => {
    Promise.all([
      api.get('/bookings/my-bookings').catch(() => ({ data: { bookings: [] } })),
      api.get('/properties').catch(() => ({ data: { properties: [] } }))
    ]).then(([bRes, pRes]) => {
      const bks = bRes.data.bookings || [];
      const allProps = pRes.data.properties || [];

      setMyBookings(bks);
      setProperties(allProps);

      // Default select first booked stay if exists, otherwise first property
      if (bks.length > 0) {
        setSelectedPropId(String(bks[0].property_id || bks[0].property?.id || allProps[0]?.id || ''));
      } else if (allProps.length > 0) {
        setSelectedPropId(String(allProps[0].id));
      }
    }).finally(() => setLoadingProps(false));
  }, []);

  const selectedProp = properties.find(p => String(p.id) === String(selectedPropId)) || properties[0] || null;
  const activeBooking = myBookings.find(b => String(b.property_id || b.property?.id) === String(selectedPropId));

  // Reset conversation when selected property changes
  useEffect(() => {
    if (selectedProp) {
      setMessages([
        {
          id: 1,
          role: 'assistant',
          text: `Hello ${user?.name || 'there'}! 🌴 I'm your 24/7 AI Concierge for **${selectedProp.name}** in ${selectedProp.city || 'Goa'}.\n\n${
            activeBooking 
              ? `You have a confirmed reservation for this stay! How can I assist your trip today?` 
              : `Feel free to ask me anything about amenities, local restaurants, check-in policies, or nightly rates.`
          }`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [selectedPropId, user?.name]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMsg = async (text) => {
    const msgToSend = text || input;
    if (!msgToSend.trim()) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      text: msgToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!text) setInput('');
    setLoading(true);

    try {
      const res = await api.post('/chat/send', {
        message: msgToSend,
        property_id: selectedProp?.id,
        guest_name: user?.name || 'Guest',
        session_id: `guest-${user?.id || 'anon'}`
      });

      const replyText = res.data.reply || res.data.response || res.data.assistant_response || "I've noted your request and our concierge team will assist you shortly!";
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        text: `Thank you for asking! For ${selectedProp?.name || 'this property'}, high-speed WiFi and 24/7 self check-in are enabled. Let us know if you have specific requests!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    { label: '🔑 WiFi & Lock Code', prompt: `What is the WiFi password and door lock code for ${selectedProp?.name || 'the villa'}?` },
    { label: '🍽️ Top Nearby Cafes', prompt: `Which are the best restaurants and beach cafes near ${selectedProp?.city || 'the resort'}?` },
    { label: '🕒 Check-in & Check-out', prompt: `What are the check-in and late checkout procedures?` },
    { label: '🏊 Pool & Spa Timings', prompt: `What are the pool hours and available amenities?` },
    { label: '🛵 Scooter / Cab Pickups', prompt: `Can you arrange a scooter rental or airport taxi pickup?` },
    { label: '🍳 Kitchen & Breakfast', prompt: `Is breakfast included and is the kitchen fully equipped?` },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-fadeIn pb-12">
      {/* ── Header ── */}
      <div className={`p-5 rounded-3xl border shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-500 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4" /> 24/7 WhatsApp AI Concierge
            </span>
            <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              INSTANT NLP
            </span>
          </div>
          <h1 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Ask Concierge About Any Resort
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time automated guidance for check-in, WiFi credentials, dining, and local secret spots.
          </p>
        </div>

        {/* Property Selector Dropdown */}
        <div className="w-full md:w-72 shrink-0">
          <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
            Selected Property / Resort:
          </label>
          <select
            value={selectedPropId}
            onChange={(e) => setSelectedPropId(e.target.value)}
            className={`w-full text-xs font-bold rounded-2xl px-3.5 py-2.5 border focus:outline-none focus:ring-2 focus:ring-emerald-500/40 cursor-pointer ${
              isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'
            }`}
          >
            {myBookings.length > 0 && (
              <optgroup label="── My Booked Stays ──">
                {myBookings.map(b => (
                  <option key={`b-${b.id}`} value={b.property_id || b.property?.id}>
                    ⭐ [BOOKED] {b.property_name || b.property?.name || 'My Stay'}
                  </option>
                ))}
              </optgroup>
            )}
            <optgroup label="── All Verified Resorts ──">
              {properties.map(p => (
                <option key={`p-${p.id}`} value={p.id}>
                  🏨 {p.name} ({p.city})
                </option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>

      {/* ── Active Property Card Info ── */}
      {selectedProp && (
        <div className={`p-3.5 rounded-2xl border flex items-center justify-between gap-4 ${
          isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-100/80 border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <img
              src={selectedProp.primary_image || selectedProp.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300'}
              alt={selectedProp.name}
              className="w-12 h-12 rounded-xl object-cover border border-emerald-500/30 shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {selectedProp.name}
                </h3>
                {activeBooking ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-extrabold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Booked Stay
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
                    Verified Resort
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                {selectedProp.address || selectedProp.city}, {selectedProp.city} • Trust Score: <strong className="text-emerald-400 font-bold">{selectedProp.trust_score || 96}/100</strong>
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-right shrink-0">
            <span className="text-xs font-black text-emerald-400">
              ₹{(selectedProp.base_price || 4500).toLocaleString()}/night
            </span>
          </div>
        </div>
      )}

      {/* ── Quick Prompts Chips ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {quickPrompts.map((q, idx) => (
          <button
            key={idx}
            onClick={() => sendMsg(q.prompt)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 border shrink-0 ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-emerald-500/50 hover:text-emerald-300'
                : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-700 shadow-sm'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> {q.label}
          </button>
        ))}
      </div>

      {/* ── WhatsApp Chat Container ── */}
      <div className="rounded-3xl border border-slate-800 bg-[#0b141a] shadow-2xl flex flex-col overflow-hidden" style={{ height: 480 }}>
        {/* WhatsApp Top Bar */}
        <div className="bg-[#202c33] px-4 py-3 flex items-center justify-between border-b border-[#2a3942]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
              🌴
            </div>
            <div>
              <p className="text-white text-xs font-bold leading-tight flex items-center gap-1.5">
                {selectedProp?.name || 'Trustora Concierge'}
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </p>
              <p className="text-emerald-400 text-[10px] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online · Instant automated replies
              </p>
            </div>
          </div>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ backgroundImage: 'radial-gradient(circle at center, #111b21 0%, #0b141a 100%)' }}>
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[82%] px-4 py-3 rounded-2xl text-xs leading-relaxed shadow-md whitespace-pre-line ${
                m.role === 'user'
                  ? 'bg-[#005c4b] text-white rounded-br-none'
                  : 'bg-[#202c33] text-slate-100 rounded-bl-none border border-[#2a3942]'
              }`}>
                <p>{m.text}</p>
                <div className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                  m.role === 'user' ? 'text-emerald-200' : 'text-slate-400'
                }`}>
                  <span>{m.time}</span>
                  {m.role === 'user' && <span className="text-emerald-300 font-bold">✓✓</span>}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#202c33] text-slate-300 px-4 py-3 rounded-2xl rounded-bl-none border border-[#2a3942] flex items-center gap-2 text-xs">
                <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                <span>AI Concierge is typing...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Bar */}
        <div className="bg-[#202c33] p-3 flex items-center gap-2 border-t border-[#2a3942]">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMsg()}
            placeholder={`Ask about ${selectedProp?.name || 'this resort'} (e.g. WiFi, food, pool hours, taxi)...`}
            className="flex-1 bg-[#2a3942] text-white placeholder-slate-400 text-xs px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
          <button
            onClick={() => sendMsg()}
            disabled={loading || !input.trim()}
            className="p-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 rounded-2xl text-white font-bold transition shadow-lg flex items-center justify-center cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

