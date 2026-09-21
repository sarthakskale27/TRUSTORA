import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare, Send, Sparkles, Phone, Video, MoreVertical,
  CheckCheck, Bot, ShieldCheck, Settings, Save, Edit3,
  Wifi, Key, Clock, Utensils, AlertTriangle, CheckCircle2,
  Building2, Loader2, RefreshCw
} from 'lucide-react';
import api from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';

export const WhatsAppConcierge = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { isDark } = useTheme();

  const [properties, setProperties] = useState([]);
  const [selectedPropId, setSelectedPropId] = useState('');
  const [loadingProps, setLoadingProps] = useState(true);

  // Host Editable Config State
  const [config, setConfig] = useState({
    welcome_message: '',
    wifi_ssid: '',
    wifi_password: '',
    door_lock_code: '',
    checkout_instructions: '',
    local_recommendations: '',
    emergency_contact: '',
    is_active: true
  });
  const [savingConfig, setSavingConfig] = useState(false);
  const [activeConfigTab, setActiveConfigTab] = useState('welcome'); // 'welcome' | 'access' | 'checkout' | 'local'

  // WhatsApp Simulator State
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Load Host Properties
  useEffect(() => {
    api.get('/properties')
      .then(res => {
        const props = res.data.properties || [];
        setProperties(props);
        if (props.length > 0) {
          setSelectedPropId(String(props[0].id));
        }
      })
      .catch(() => {})
      .finally(() => setLoadingProps(false));
  }, []);

  const selectedProp = properties.find(p => String(p.id) === String(selectedPropId)) || properties[0] || null;

  // Load Config for Selected Property
  const loadConfig = (propId) => {
    if (!propId) return;
    api.get(`/chat/config?property_id=${propId}`)
      .then(res => {
        if (res.data?.config) {
          setConfig({
            welcome_message: res.data.config.welcome_message || '',
            wifi_ssid: res.data.config.wifi_ssid || '',
            wifi_password: res.data.config.wifi_password || '',
            door_lock_code: res.data.config.door_lock_code || '',
            checkout_instructions: res.data.config.checkout_instructions || '',
            local_recommendations: res.data.config.local_recommendations || '',
            emergency_contact: res.data.config.emergency_contact || '',
            is_active: res.data.config.is_active !== false
          });
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (selectedPropId) {
      loadConfig(selectedPropId);
    }
  }, [selectedPropId]);

  // Reset simulator messages with property context
  useEffect(() => {
    if (selectedProp) {
      setMessages([
        {
          id: 1,
          sender: 'guest',
          text: `Hi! We just arrived at ${selectedProp.name}. What's the WiFi password and door code?`,
          time: '14:20'
        },
        {
          id: 2,
          sender: 'ai',
          text: `Welcome to ${selectedProp.name}! 🌴\n\n${config.welcome_message || 'We are thrilled to host you.'}\n\n• 📶 WiFi: ${config.wifi_ssid || `${selectedProp.name.replace(' ', '')}_Guest`} | Password: ${config.wifi_password || 'SunsetGoa2026'}\n• 🔑 Digital Smart Lock PIN: ${config.door_lock_code || '4829#'}\n\nLet us know if you need anything else!`,
          time: '14:20'
        }
      ]);
    }
  }, [selectedPropId, config.wifi_ssid, config.wifi_password, config.door_lock_code]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  // Save Host Config
  const handleSaveConfig = async (e) => {
    if (e) e.preventDefault();
    if (!selectedProp?.id) return;
    setSavingConfig(true);
    try {
      await api.post('/chat/config', {
        property_id: selectedProp.id,
        ...config
      });
      showToast('Automated WhatsApp message & AI Concierge templates saved successfully!', 'success');
      loadConfig(selectedProp.id);
    } catch {
      showToast('Failed to save message configuration. Please try again.', 'error');
    } finally {
      setSavingConfig(false);
    }
  };

  // Simulate Sending Message
  const handleSend = async (customText) => {
    const text = customText || inputMessage;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'guest',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputMessage('');
    setTyping(true);

    try {
      const res = await api.post('/chat/send', {
        message: text,
        property_id: selectedProp?.id,
        guest_name: 'Priya Sharma'
      });
      setTimeout(() => {
        const replyText = res.data.reply || res.data.response || res.data.assistant_response || "I've noted your request and will assist you immediately!";
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          sender: 'ai',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setTyping(false);
      }, 600);
    } catch {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          sender: 'ai',
          text: `Thank you for messaging! For ${selectedProp?.name || 'this property'}, high-speed WiFi and automated check-in are configured.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setTyping(false);
      }, 600);
    }
  };

  const quickPrompts = [
    { label: '🔑 WiFi & Lock Code',    prompt: 'Can you resend the WiFi password and door lock code?' },
    { label: '🍽️ Top Nearby Dining',   prompt: 'Which are the best restaurants and beach shacks nearby?' },
    { label: '🛵 Scooter / Cab',       prompt: 'Can you arrange a scooter rental or taxi?' },
    { label: '🕒 Late Check-out',       prompt: 'Can I get a late check-out at 1 PM tomorrow?' },
    { label: '🏊 Pool & Amenities',     prompt: 'What are the pool hours and kitchen amenities?' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto pb-12">
      {/* ── Header ── */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4" /> Automated WhatsApp Concierge
            </span>
            <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              24/7 ACTIVE
            </span>
          </div>
          <h1 className="text-2xl font-black text-white">Host Automated Guest Messaging</h1>
          <p className="text-xs text-slate-400 mt-1">
            Customize the automated welcome greeting, WiFi credentials, checkout rules, and local recommendations sent to guests.
          </p>
        </div>

        {/* Property Selector for Host */}
        <div className="w-full md:w-64 shrink-0">
          <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
            Select Property to Manage:
          </label>
          <select
            value={selectedPropId}
            onChange={(e) => setSelectedPropId(e.target.value)}
            className="w-full text-xs font-bold rounded-2xl px-3.5 py-2.5 bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 cursor-pointer"
          >
            {properties.length === 0 && (
              <option value="1">Primary Property (Demo)</option>
            )}
            {properties.map(p => (
              <option key={p.id} value={p.id}>
                🏨 {p.name} ({p.city})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── 2-Column Grid: Left (Host Message Editor) | Right (Live WhatsApp Simulator) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ── Left Column: Host Message Customizer (7 cols) ── */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-black text-white">Custom Message & Automation Settings</h2>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {selectedProp?.name || 'Property'}
              </span>
            </div>

            {/* Config Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[
                { id: 'welcome',  label: '👋 Welcome Greeting' },
                { id: 'access',   label: '🔑 WiFi & Lock PIN' },
                { id: 'checkout', label: '🕒 Check-out Policy' },
                { id: 'local',    label: '🍽️ Local Tips & Contact' },
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveConfigTab(tab.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    activeConfigTab === tab.id
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-4 pt-1">
              {/* Tab 1: Welcome Greeting */}
              {activeConfigTab === 'welcome' && (
                <div className="space-y-3 animate-fadeIn">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Default Automated Welcome Message to Guest:
                    </label>
                    <textarea
                      value={config.welcome_message}
                      onChange={(e) => setConfig(prev => ({ ...prev, welcome_message: e.target.value }))}
                      rows={5}
                      placeholder={`Welcome to ${selectedProp?.name || 'our stay'}! We are thrilled to host you...`}
                      className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 resize-none leading-relaxed"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Sent automatically when a guest arrives or messages the concierge on WhatsApp.
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 2: WiFi & Lock PIN */}
              {activeConfigTab === 'access' && (
                <div className="space-y-3 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">WiFi Network (SSID):</label>
                      <input
                        type="text"
                        value={config.wifi_ssid}
                        onChange={(e) => setConfig(prev => ({ ...prev, wifi_ssid: e.target.value }))}
                        placeholder="AzureVilla_Guest"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">WiFi Password:</label>
                      <input
                        type="text"
                        value={config.wifi_password}
                        onChange={(e) => setConfig(prev => ({ ...prev, wifi_password: e.target.value }))}
                        placeholder="SunsetGoa2026"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Digital Smart Door Lock PIN:</label>
                    <input
                      type="text"
                      value={config.door_lock_code}
                      onChange={(e) => setConfig(prev => ({ ...prev, door_lock_code: e.target.value }))}
                      placeholder="4829#"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Tab 3: Check-out Policy */}
              {activeConfigTab === 'checkout' && (
                <div className="space-y-3 animate-fadeIn">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Check-out Guidelines & Key Drop Instructions:
                    </label>
                    <textarea
                      value={config.checkout_instructions}
                      onChange={(e) => setConfig(prev => ({ ...prev, checkout_instructions: e.target.value }))}
                      rows={5}
                      placeholder="Standard check-out is at 11:00 AM. Please leave the keys on the dining counter..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 resize-none leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* Tab 4: Local Tips & Emergency */}
              {activeConfigTab === 'local' && (
                <div className="space-y-3 animate-fadeIn">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Host's Recommended Food & Sightseeing Spots:
                    </label>
                    <textarea
                      value={config.local_recommendations}
                      onChange={(e) => setConfig(prev => ({ ...prev, local_recommendations: e.target.value }))}
                      rows={4}
                      placeholder="1. Fisherman's Wharf (Seafood)\n2. Thalassa (Greek)\n3. Manoj Scooter Rental (+91 98221 44550)..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 resize-none leading-relaxed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Host Emergency Contact Phone:</label>
                    <input
                      type="text"
                      value={config.emergency_contact}
                      onChange={(e) => setConfig(prev => ({ ...prev, emergency_contact: e.target.value }))}
                      placeholder="+91 98200 88776"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                    />
                  </div>
                </div>
              )}

              {/* Save Button */}
              <button
                type="submit"
                disabled={savingConfig}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-extrabold text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {savingConfig ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {savingConfig ? 'Saving Settings...' : 'Save & Update Automated WhatsApp Message'}
              </button>
            </form>
          </div>
        </div>

        {/* ── Right Column: Live WhatsApp Simulator (6 cols) ── */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#0b141a] border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden" style={{ height: 530 }}>
            {/* WhatsApp Header */}
            <div className="bg-[#202c33] px-4 py-3 flex items-center justify-between border-b border-[#2a3942]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  P
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-white">Priya Sharma (Simulated Guest)</h4>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold">
                      GUEST
                    </span>
                  </div>
                  <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Trustora AI Concierge · Live Preview
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Phone className="w-4 h-4 hover:text-white cursor-pointer" />
                <MoreVertical className="w-4 h-4 hover:text-white cursor-pointer" />
              </div>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: '#0d1117' }}>
              {messages.map(m => (
                <div key={m.id} className={`flex ${m.sender === 'guest' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-lg ${
                    m.sender === 'guest'
                      ? 'bg-[#202c33] text-slate-200 rounded-tl-none border border-[#2a3942]'
                      : 'bg-[#005c4b] text-white rounded-tr-none'
                  }`}>
                    <div className="flex items-center gap-1.5 mb-1">
                      {m.sender === 'ai' ? (
                        <span className="text-[10px] font-bold text-emerald-300 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Trustora AI
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400">Priya Sharma</span>
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
                  <div className="bg-[#005c4b] text-emerald-200 text-xs px-4 py-2.5 rounded-2xl rounded-tr-none flex items-center gap-1.5 animate-pulse">
                    <Bot className="w-3.5 h-3.5 animate-spin" /> Trustora AI is generating reply...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="bg-[#202c33]/90 px-3 py-2 border-t border-[#2a3942] flex items-center gap-1.5 overflow-x-auto">
              <span className="text-[10px] font-bold uppercase text-slate-400 shrink-0">Simulate:</span>
              {quickPrompts.map((qp, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(qp.prompt)}
                  className="text-[10px] px-2.5 py-1 rounded-full bg-[#111b21] hover:bg-emerald-950 text-slate-300 hover:text-emerald-300 border border-[#2a3942] shrink-0 transition-colors font-medium whitespace-nowrap cursor-pointer"
                >
                  {qp.label}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="bg-[#202c33] p-3 flex items-center gap-2 border-t border-[#2a3942]">
              <input
                type="text"
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Type a simulated guest message (e.g. WiFi, food, late checkout)..."
                className="flex-1 bg-[#2a3942] border-none rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                onClick={() => handleSend()}
                className="w-9 h-9 rounded-xl bg-[#00a884] hover:bg-[#008f70] text-white flex items-center justify-center shadow-md transition-colors cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
