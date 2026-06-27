import React, { useState, useEffect, useRef } from 'react';
import { Bot, MessageSquare, X, Send, Sparkles, HelpCircle } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showWelcomeTip, setShowWelcomeTip] = useState(true);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Namaste! 🙏 Welcome to SmartPassport AI Assistant. I can help guide you through document requirements, appointment scheduling, fee schedules, and police verification steps.\n\nWhat are you applying for today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const closeChat = () => {
    setIsOpen(false);
    setMessages([
      {
        sender: 'bot',
        text: 'Namaste! 🙏 Welcome to SmartPassport AI Assistant. I can help guide you through document requirements, appointment scheduling, fee schedules, and police verification steps.\n\nWhat are you applying for today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const toggleChat = () => {
    if (isOpen) {
      closeChat();
    } else {
      setIsOpen(true);
    }
    setShowWelcomeTip(false);
  };

  // Auto-scroll chat body on incoming messages
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Suggested chips keywords
  const faqChips = [
    { label: '📂 Document checklist', query: 'What documents do I need to upload?' },
    { label: '💰 Passport fees', query: 'What is the passport application fee?' },
    { label: '⚡ Tatkal processing', query: 'How does Tatkal urgent passport work?' },
    { label: '👮 Police Verification', query: 'How does police verification check address?' }
  ];

  const handleSendMessage = async (textToSend) => {
    if (!textToSend.trim()) return;

    const userMsg = {
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate calling Express API (with offline local fallback response matching keywords)
    try {
      const response = await fetch('/api/chatbot/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textToSend })
      });
      const data = await response.json();

      setIsTyping(false);
      
      const botMsg = {
        sender: 'bot',
        text: data.success ? data.response : 'I am experiencing connection delays. Let me fall back to standard assistance:\n\nTo apply for a passport, fill the multi-step form, pay the secure INR 1,500 fee, and schedule a slot at your local PSK Kendra.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);

    } catch (err) {
      // Local keyword parsing in case backend is offline
      setTimeout(() => {
        setIsTyping(false);
        let fallbackText = '';
        const lower = textToSend.toLowerCase();
        const passportTerms = [
          'passport', 'visa', 'document', 'aadhaar', 'pan', 'photo', 'signature', 'upload',
          'fee', 'payment', 'charge', 'cost', 'money', 'price', 'tatkal', 'urgent', 'fast',
          'speedy', 'police', 'verification', 'station', 'address', 'constable', 'status',
          'tracking', 'where', 'stage', 'track', 'apply', 'renew', 'slot', 'appointment',
          'office', 'kendra', 'psk', 'pcc', 'authority', 'grant', 'booklet', 'india',
          'seva', 'help', 'assist', 'support', 'guideline'
        ];

        if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey') || lower.includes('namaste')) {
          fallbackText = 'Namaste! 🙏 I am your GlobalPassport AI assistant. How can I help you with your Indian passport application, fee payment, document upload, or scheduling verification today?';
        } else if (lower.includes('document') || lower.includes('aadhaar') || lower.includes('upload') || lower.includes('photo') || lower.includes('signature')) {
          fallbackText = 'Primary documents required:\n1. Aadhaar Card (Identity & address proof)\n2. PAN Card\n3. Birth Certificate\n4. White-background photograph.\nUpload them in Step 5 of the Citizen Portal!';
        } else if (lower.includes('fee') || lower.includes('pay') || lower.includes('cost') || lower.includes('money') || lower.includes('price')) {
          fallbackText = 'Passport fee schedule:\n- Normal: INR 1,500\n- Tatkal (Urgent): INR 3,500\n- Minor Passport: INR 1,000\nPayments processed via Razorpay.';
        } else if (lower.includes('tatkal') || lower.includes('urgent')) {
          fallbackText = 'Tatkal applications bypass standard queues. Physical appointment scheduling is set within 24 hours, and passports are printed in 3-4 days. A Tatkal fee of INR 3,500 applies.';
        } else if (lower.includes('police') || lower.includes('verification')) {
          fallbackText = 'Following officer review at the Seva Kendra, your files are forwarded to your local police station. A police constable visits your address for verification.';
        } else if (passportTerms.some(term => lower.includes(term))) {
          fallbackText = 'I understand you are asking about passport guidelines. To proceed, log in to your Citizen Dashboard, complete your address details, execute payment, and book a document check slot.';
        } else {
          fallbackText = 'I am the GlobalPassport India virtual assistant. I can only assist with passport-related inquiries (such as application processes, required documents, fees, Tatkal, police verification, and slot bookings).\n\nPlease ask a question related to Indian passport services.';
        }

        const botMsg = {
          sender: 'bot',
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMsg]);
      }, 700);
    }
  };

  return (
    <div class="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* 1. Chat Window Panel Overlay */}
      {isOpen && (
        <div class="w-72 sm:w-80 h-[380px] mb-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* Header Panel */}
          <div class="bg-gov-navy text-white px-3 py-2 flex justify-between items-center border-b border-gov-ashokaGold/30">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-slate-800/80 border border-gov-ashokaGold flex items-center justify-center relative">
                <Bot size={16} class="text-gov-ashokaGold animate-pulse" />
                <span class="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-gov-navy"></span>
              </div>
              <div class="text-left">
                <h3 class="font-bold text-xs tracking-wide flex items-center gap-1">
                  <span>SmartPassport AI</span>
                  <Sparkles size={9} class="text-gov-ashokaGold" />
                </h3>
                <span class="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">Gov Assistant • Online</span>
              </div>
            </div>
            <button 
              onClick={closeChat}
              class="p-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>

          {/* Dialogue timeline panel */}
          <div class="flex-1 overflow-y-auto p-3 bg-slate-50 dark:bg-slate-900 flex flex-col gap-2.5">
            {messages.map((m, idx) => (
              <div 
                key={idx} 
                class={`flex flex-col max-w-[85%] ${m.sender === 'user' ? 'self-end items-end' : 'self-start items-start'}`}
              >
                <div class={`px-2.5 py-1.5 rounded-xl text-[11px] whitespace-pre-wrap text-left leading-relaxed ${m.sender === 'user' ? 'bg-gov-blue text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/50 dark:border-slate-700/50 rounded-tl-none shadow-sm'}`}>
                  {m.text}
                </div>
                <span class="text-[8px] text-slate-400 font-bold mt-0.5 px-0.5">{m.timestamp}</span>
              </div>
            ))}

            {/* Simulated AI typing element */}
            {isTyping && (
              <div class="self-start flex flex-col items-start max-w-[80%]">
                <div class="bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 px-3 py-1.5 rounded-xl rounded-tl-none flex items-center gap-1 shadow-sm">
                  <span class="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span class="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span class="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef}></div>
          </div>

          {/* Suggested Quick Chip Cards */}
          <div class="px-3 py-1.5 border-t border-slate-100 dark:border-slate-700/40 bg-slate-50 dark:bg-slate-900 overflow-x-auto flex gap-1.5 no-scrollbar">
            {faqChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip.query)}
                class="flex items-center gap-1 px-2 py-0.5 rounded-full border border-gov-blue/20 dark:border-slate-700 text-[9px] font-bold text-gov-blue dark:text-gov-light bg-white dark:bg-slate-800 hover:bg-gov-blue hover:text-white dark:hover:bg-gov-blue transition-all whitespace-nowrap cursor-pointer"
              >
                <HelpCircle size={9} />
                <span>{chip.label}</span>
              </button>
            ))}
          </div>

          {/* Bottom input area */}
          <div class="p-2 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex gap-1.5">
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'ENTER' || e.key === 'Enter') handleSendMessage(inputText);
              }}
              placeholder="Ask passport guidelines..."
              class="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] focus:outline-none focus:ring-1 focus:ring-gov-blue dark:focus:ring-gov-light dark:text-white"
            />
            <button 
              onClick={() => handleSendMessage(inputText)}
              class="p-2 rounded-lg bg-gov-blue hover:bg-gov-navy text-white transition-colors flex items-center justify-center cursor-pointer"
            >
              <Send size={12} />
            </button>
          </div>

        </div>
      )}

      {/* 2. Style injection block for Robot Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        @keyframes eyeBlink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.15); }
        }
        .robot-float {
          animation: float 3s ease-in-out infinite;
        }
        .robot-eye-blink {
          animation: eyeBlink 5s infinite;
          transform-origin: center;
        }
      `}} />

      {/* 3. Floating Robot Assistant Launcher */}
      <div class="relative flex items-center gap-2 select-none">
        {/* Welcome tip popup speech bubble */}
        {showWelcomeTip && !isOpen && (
          <div 
            onClick={() => {
              setIsOpen(true);
              setShowWelcomeTip(false);
            }}
            class="bg-white dark:bg-slate-800 border border-gov-ashokaGold/30 dark:border-slate-700 shadow-xl px-3 py-2 rounded-2xl text-[10px] font-black text-gov-navy dark:text-gov-ashokaGold cursor-pointer hover:bg-[#fffdf2] transition-all duration-200 animate-in fade-in slide-in-from-right-4 relative mr-2 flex items-center gap-1.5 whitespace-nowrap"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Hi! Ask Seva AI 🤖</span>
            {/* Close tip */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowWelcomeTip(false);
              }}
              class="ml-1 p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-450"
            >
              <X size={10} />
            </button>
            {/* Speech bubble tail pointer */}
            <div class="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-white dark:border-l-slate-800"></div>
          </div>
        )}

        <button 
          onClick={toggleChat}
          class="robot-float w-16 h-20 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 duration-300 relative focus:outline-none cursor-pointer border-0 bg-transparent"
          title="Toggle Seva AI Chatbot"
        >
          {/* Custom SVG Robot Character */}
          <svg width="64" height="72" viewBox="0 0 64 72" fill="none" xmlns="http://www.w3.org/2000/svg" class="filter drop-shadow-md">
            {/* Hover Jet Glow Light */}
            <ellipse cx="32" cy="63" rx="14" ry="4" fill="#00f0ff" opacity="0.6" class="animate-pulse" />
            <path d="M26 63L32 67L38 63" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" opacity="0.8" />
            
            {/* Body */}
            <rect x="18" y="30" width="28" height="24" rx="12" fill="#ffffff" stroke="#cdd5e0" stroke-width="2" />
            <rect x="23" y="35" width="18" height="10" rx="4" fill="#0f172a" />
            
            {/* Glowing Chest Badge - Tri-Color Heartbeat Indicator */}
            <line x1="26" y1="40" x2="38" y2="40" stroke="#00f0ff" stroke-width="1.5" stroke-linecap="round" class="animate-pulse" />
            <circle cx="32" cy="40" r="2" fill="#ff9933" />
            
            {/* Left and Right Small Robot Arms */}
            <path d="M15 36C12 38 10 42 11 47C12 49 14 49 15 46" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" />
            <path d="M49 36C52 38 54 42 53 47C52 49 50 49 49 46" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" />
            
            {/* Neck Joint */}
            <rect x="28" y="25" width="8" height="6" rx="2" fill="#94a3b8" />
            
            {/* Helmet / Head */}
            <rect x="14" y="6" width="36" height="22" rx="11" fill="#ffffff" stroke="#cdd5e0" stroke-width="2" />
            
            {/* Visor Glass Faceplate */}
            <rect x="17" y="9" width="30" height="15" rx="7.5" fill="#1e293b" stroke="#00f0ff" stroke-width="1" />
            
            {/* LED Glowing Eyes - Blink Animation */}
            {isOpen ? (
              // Happy Arc Eyes when chat is open
              <g class="robot-eye-blink">
                <path d="M21 16C22.5 14.5 24.5 14.5 26 16" stroke="#00f0ff" stroke-width="2.5" stroke-linecap="round" />
                <path d="M38 16C39.5 14.5 41.5 14.5 43 16" stroke="#00f0ff" stroke-width="2.5" stroke-linecap="round" />
              </g>
            ) : (
              // Standard horizontal LED eyes
              <g class="robot-eye-blink">
                <rect x="21" y="14" width="6" height="2.5" rx="1.25" fill="#00f0ff" />
                <rect x="37" y="14" width="6" height="2.5" rx="1.25" fill="#00f0ff" />
              </g>
            )}

            {/* Antennas on helmet */}
            <line x1="32" y1="6" x2="32" y2="2" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" />
            <circle cx="32" cy="2" r="2" fill="#ff9933" />
          </svg>
          
          {/* Badge Alert indicator */}
          {!isOpen && (
            <span class="absolute top-2 right-2 w-4.5 h-4.5 bg-gov-orange rounded-full text-[9px] font-black flex items-center justify-center text-white border-2 border-white animate-bounce shadow">
              AI
            </span>
          )}
        </button>
      </div>

    </div>
  );
}
