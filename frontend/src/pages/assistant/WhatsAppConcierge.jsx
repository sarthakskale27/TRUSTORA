import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Sparkles, Phone, Video, MoreVertical, CheckCheck, Bot, ShieldCheck } from 'lucide-react';
import api from '../../services/api';
import { Badge } from '../../components/common/Badge';

export const WhatsAppConcierge = () => {
  const [messages, setMessages] = useState([
    {
      id: 1, sender: 'guest',
      text: "Hi! We just arrived. What's the WiFi password and how do we check in?",
      time: '14:20'
    },
    {
      id: 2, sender: 'ai',
      text: "Welcome to Azure Beach Villa, Priya! 🌴\n\nHere are your check-in details:\n• WiFi: AzureVilla_Guest | Password: SunsetGoa2026\n• Smart lock code: 4829#\n• Pool hours: 6 AM – 10 PM\n\nYou'll find complimentary welcome drinks in the fridge. Let me know if you need anything at all!",
      time: '14:20'
    },
    {
      id: 3, sender: 'guest',
      text: "Amazing! Can you suggest the best beach shack for dinner tonight?",
      time: '14:22'
    },
    {
      id: 4, sender: 'ai',
      text: "Absolutely! Here are my top picks within 5 minutes of the villa:\n\n🦞 Britto's – Iconic Goa seafood, beachfront. Open till 11 PM.\n🍛 Fisherman's Wharf – Prawn curry & Goan fish thali. Scenic sunset views.\n🍹 Curlies Beach Shack – Chill vibe, great cocktails, live music on Saturdays.\n\nShall I make a reservation for any of these?",
      time: '14:22'
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Host's own property context
  const PROPERTY = { name: 'Azure Beach Villa', city: 'Goa', guest: 'Priya Sharma', checkin: 'Day 2 of 4' };

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typing]);

  const handleSend = async (customText) => {
    const text = customText || inputMessage;
    if (!text.trim()) return;

    const userMsg = { id: Date.now(), sender: 'guest', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputMessage('');
    setTyping(true);

    try {
      const res = await api.post('/chat/send', { message: text, guest_name: PROPERTY.guest, property_name: PROPERTY.name });
      setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: res.data.response || "I'll take care of that for you right away! Is there anything else you need?", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        setTyping(false);
      }, 700);
    } catch {
      setTimeout(() => {
        const fallbacks = [
          "I've arranged that for you! Fresh towels will be at your door in 15 minutes. 🛎️",
          "Great choice! I've noted your request and our concierge will confirm within minutes.",
          "Absolutely! Late check-out until 1 PM has been approved for your stay. Enjoy your morning! ☀️",
          "The scooter rental contact is Rajan: +91 98001 23456. Mention 'Azure Villa' for a 10% discount!"
        ];
        setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: fallbacks[Math.floor(Math.random() * fallbacks.length)], time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        setTyping(false);
      }, 700);
    }
  };

  const quickPrompts = [
    { label: '🔑 WiFi & Lock Code',    prompt: 'Can you resend the WiFi password and door lock code?' },
    { label: '🍽️ Restaurant Near Villa', prompt: 'Which is the best restaurant for dinner within 5 minutes?' },
    { label: '🛵 Scooter Rental',       prompt: 'Can you arrange a scooter rental for tomorrow morning?' },
    { label: '🕐 Late Check-out',       prompt: 'Can I get a late check-out at 1 PM tomorrow?' },
    { label: '🏄 Water Sports',         prompt: 'What water sports activities are available near the beach?' },
    { label: '🧹 Housekeeping',         prompt: 'Can you send housekeeping with fresh towels?' },
  ];

  return (
    <div className="space-y-5 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400">AI Hospitality Concierge</span>
            <Badge variant="success" size="sm">Live · 24/7</Badge>
          </div>
          <h1 className="text-xl font-black text-white">WhatsApp AI Guest Concierge</h1>
          <p className="text-xs text-slate-400 mt-1">Automated WhatsApp replies for {PROPERTY.name}, {PROPERTY.city} — Real-time NLP response engine</p>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <div className="p-3 rounded-xl bg-emerald-900/20 border border-emerald-500/30 text-center">
            <p className="text-emerald-400 font-black text-lg leading-none">0.8s</p>
            <p className="text-slate-500 text-[10px] font-semibold">Avg Response</p>
          </div>
        </div>
      </div>

      {/* Property context bar */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: 'Property', val: PROPERTY.name + ', ' + PROPERTY.city, color: 'emerald' },
          { label: 'Current Guest', val: PROPERTY.guest, color: 'indigo' },
          { label: 'Stay Status', val: PROPERTY.checkin, color: 'amber' },
          { label: 'AI Status', val: 'Active & Monitoring', color: 'teal' },
        ].map(item => (
          <div key={item.label} className={`px-4 py-2 rounded-xl bg-${item.color}-900/20 border border-${item.color}-500/30 flex items-center gap-2`}>
            <div className={`w-2 h-2 rounded-full bg-${item.color}-400 animate-pulse`} />
            <span className="text-slate-400 text-[10px] font-semibold">{item.label}:</span>
            <span className={`text-${item.color}-300 text-xs font-bold`}>{item.val}</span>
          </div>
        ))}
      </div>

      {/* WhatsApp Frame */}
      <div className="bg-[#0b141a] border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden" style={{ height: 560 }}>
        {/* WA Header */}
        <div className="bg-[#202c33] px-5 py-3.5 flex items-center justify-between border-b border-[#2a3942]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-md">P</div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-white">{PROPERTY.guest}</h4>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold">GUEST</span>
              </div>
              <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Trustora AI Concierge · Online
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <Phone className="w-4 h-4 hover:text-white cursor-pointer" />
            <Video className="w-4 h-4 hover:text-white cursor-pointer" />
            <MoreVertical className="w-4 h-4 hover:text-white cursor-pointer" />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: '#0d1117' }}>
          {messages.map(m => (
            <div key={m.id} className={`flex ${m.sender === 'guest' ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-xs sm:max-w-sm p-3.5 rounded-2xl text-xs leading-relaxed shadow-lg ${
                m.sender === 'guest'
                  ? 'bg-[#202c33] text-slate-200 rounded-tl-none border border-[#2a3942]'
                  : 'bg-[#005c4b] text-white rounded-tr-none'
              }`}>
                <div className="flex items-center gap-1.5 mb-1">
                  {m.sender === 'ai'
                    ? <span className="text-[10px] font-bold text-emerald-300 flex items-center gap-1"><Sparkles className="w-3 h-3" /> Trustora AI</span>
                    : <span className="text-[10px] font-bold text-slate-400">{PROPERTY.guest}</span>}
                </div>
                <p className="whitespace-pre-line">{m.text}</p>
                <div className="flex items-center justify-end gap-1 text-[9px] text-slate-400 mt-1.5">
                  <span>{m.time}</span>
                  {m.sender === 'ai' && <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-end">
              <div className="bg-[#005c4b] text-emerald-200 text-xs px-4 py-2.5 rounded-2xl rounded-tr-none flex items-center gap-1.5 animate-pulse">
                <Bot className="w-3.5 h-3.5 animate-spin" /> Trustora AI is typing...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="bg-[#202c33]/90 px-4 py-2 border-t border-[#2a3942] flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-bold uppercase text-slate-400 shrink-0">Simulate Guest:</span>
          {quickPrompts.map((qp, i) => (
            <button key={i} onClick={() => handleSend(qp.prompt)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-[#111b21] hover:bg-emerald-950 text-slate-300 hover:text-emerald-300 border border-[#2a3942] shrink-0 transition-colors font-medium whitespace-nowrap">
              {qp.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="bg-[#202c33] p-3 flex items-center gap-2 border-t border-[#2a3942]">
          <input type="text" value={inputMessage} onChange={e => setInputMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Type a guest message to simulate..."
            className="flex-1 bg-[#2a3942] border-none rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
          <button onClick={() => handleSend()} className="w-10 h-10 rounded-xl bg-[#00a884] hover:bg-[#008f70] text-white flex items-center justify-center shadow-md transition-colors">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total AI Replies', val: '142', color: 'emerald' },
          { label: 'Avg Response',     val: '0.8s', color: 'teal' },
          { label: 'Guest Rating',     val: '4.9★', color: 'amber' },
          { label: 'Escalations',      val: '0',    color: 'indigo' },
        ].map(s => (
          <div key={s.label} className={`p-4 rounded-2xl bg-slate-900 border border-${s.color}-500/20 text-center`}>
            <p className={`text-2xl font-black text-${s.color}-400`}>{s.val}</p>
            <p className="text-slate-500 text-[10px] font-semibold mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
