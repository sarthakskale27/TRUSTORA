import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  Phone,
  Video,
  MoreVertical,
  CheckCheck,
  Bot,
  User,
  ShieldCheck,
  Coffee,
  Wifi,
  Clock,
  Compass
} from 'lucide-react';
import api from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../context/ToastContext';

export const WhatsAppConcierge = () => {
  const { error } = useToast();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'guest',
      text: "Hi Host! We just arrived in Goa. What's the high-speed WiFi password and check-in procedure?",
      time: '14:20'
    },
    {
      id: 2,
      sender: 'ai',
      text: "Welcome to Casa Bella Villa, Priya! 🌴 The high-speed 5G WiFi network is 'CasaBella_Guest' and password is 'SunsetVilla2026'. The digital smart lock code is 4829#. Let me know if you'd like our curated sunset dinner recommendations!",
      time: '14:20'
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState({
    name: 'Priya & Ananya',
    property: 'Casa Bella Luxury Villa, Goa',
    phone: '+91 98201 55421',
    status: 'Checked In (Stay Day 1/3)'
  });

  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  const handleSendMessage = async (customText) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'guest',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputMessage('');
    setTyping(true);

    try {
      const res = await api.post('/chat/send', {
        message: textToSend,
        guest_name: selectedGuest.name,
        property_name: selectedGuest.property
      });

      setTimeout(() => {
        const aiMsg = {
          id: Date.now() + 1,
          sender: 'ai',
          text: res.data.response || "Thank you for reaching out! Our team is available 24/7 to ensure your stay is magnificent.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, aiMsg]);
        setTyping(false);
      }, 600);
    } catch (e) {
      setTimeout(() => {
        const aiFallback = {
          id: Date.now() + 1,
          sender: 'ai',
          text: "I've noted that for you! Fresh towels, local scooter rentals, and restaurant reservations can all be arranged directly through here. Enjoy your stay!",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, aiFallback]);
        setTyping(false);
      }, 600);
    }
  };

  const quickPrompts = [
    { label: 'WiFi & Keyless Entry', prompt: 'Can you resend the WiFi password and digital door code?' },
    { label: 'Best Seafood Diners', prompt: 'What are the top 3 seafood beach shacks nearby for sunset?' },
    { label: 'Late Check-out Policy', prompt: 'Is it possible to arrange a late check-out tomorrow at 2 PM?' },
    { label: 'Scooter & Cab Rental', prompt: 'Can you connect us with a reliable scooter rental contact?' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400">
              Autonomous Guest Hospitality
            </span>
            <Badge variant="success" size="sm">24/7 NLP Concierge</Badge>
          </div>
          <h1 className="text-2xl font-black text-white">WhatsApp AI Guest Concierge</h1>
          <p className="text-xs text-slate-400 mt-1">
            Emulate instant WhatsApp automated hospitality replies with property-specific rules, local guides, and smart triggers.
          </p>
        </div>
      </div>

      {/* Emulation Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[640px]">
        {/* Guest Conversations List (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl flex flex-col justify-between overflow-hidden">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Active Guest Chats</h3>
              <Badge variant="primary" size="sm">Live Webhook</Badge>
            </div>

            <div className="space-y-2">
              {[
                { name: 'Priya & Ananya', prop: 'Casa Bella Villa, Goa', time: 'Just now', unread: 0, active: true },
                { name: 'Vikram Mehta', prop: 'The Himalayan Pine Chalet', time: '12:45', unread: 1, active: false },
                { name: 'Arjun & Sarah', prop: 'Silicon Oasis Penthouse', time: 'Yesterday', unread: 0, active: false },
              ].map((g, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                    g.active
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-white'
                      : 'bg-slate-950 border-slate-800/80 text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-slate-200">{g.name}</h5>
                    <span className="text-[10px] text-slate-500">{g.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{g.prop}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" /> Zero Host Burden
            </div>
            <p className="text-[10px] text-slate-500">
              Average response time: <strong>0.8 seconds</strong> across 142 inquiries this month.
            </p>
          </div>
        </div>

        {/* WhatsApp Mobile Frame (8 cols) */}
        <div className="lg:col-span-8 bg-[#0b141a] border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden relative">
          {/* Green WhatsApp Header */}
          <div className="bg-[#202c33] px-5 py-3.5 flex items-center justify-between border-b border-[#2a3942] z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                {selectedGuest.name[0]}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-white">{selectedGuest.name}</h4>
                  <Badge variant="success" size="sm">Guest</Badge>
                </div>
                <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Trustora AI Agent Online
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-400">
              <Phone className="w-4 h-4 hover:text-white cursor-pointer" />
              <Video className="w-4 h-4 hover:text-white cursor-pointer" />
              <MoreVertical className="w-4 h-4 hover:text-white cursor-pointer" />
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] bg-slate-950/40">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender === 'guest' ? 'justify-start' : 'justify-end'} animate-fadeIn`}
              >
                <div
                  className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed shadow-lg relative ${
                    m.sender === 'guest'
                      ? 'bg-[#202c33] text-slate-200 rounded-tl-none border border-[#2a3942]'
                      : 'bg-[#005c4b] text-white rounded-tr-none'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    {m.sender === 'ai' ? (
                      <span className="text-[10px] font-bold text-emerald-300 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Trustora Assistant
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400">{selectedGuest.name}</span>
                    )}
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
                <div className="bg-[#005c4b] text-emerald-200 text-xs px-4 py-2 rounded-2xl rounded-tr-none flex items-center gap-1.5 animate-pulse">
                  <Bot className="w-3.5 h-3.5 animate-spin" />
                  <span>Trustora is crafting instant answer...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompt Suggestions */}
          <div className="bg-[#202c33]/90 px-4 py-2 border-t border-[#2a3942] flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] font-bold uppercase text-slate-400 shrink-0">Simulate Guest:</span>
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(qp.prompt)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-[#111b21] hover:bg-emerald-950 text-slate-300 hover:text-emerald-300 border border-[#2a3942] shrink-0 transition-colors font-medium"
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Message Input Box */}
          <div className="bg-[#202c33] p-3 flex items-center gap-2 border-t border-[#2a3942]">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type message as guest or host..."
              className="flex-1 bg-[#2a3942] border-none rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <button
              onClick={() => handleSendMessage()}
              className="w-10 h-10 rounded-xl bg-[#00a884] hover:bg-[#008f70] text-white flex items-center justify-center shadow-md transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
