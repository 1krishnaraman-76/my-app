import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Search, MapPin, Clock, FileText, BadgeAlert, ArrowRight, ShieldCheck, ChevronDown, ChevronUp, Star } from 'lucide-react';

export default function Home({ setView, setSelectedTrackId, setAuthIsLogin }) {
  const { lang, applications, t } = useContext(AppContext);

  // Home Page States
  const [trackInput, setTrackInput] = useState('');
  const [trackResult, setTrackResult] = useState(null);
  const [trackError, setTrackError] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  // Authentic Grievance / Feedback Portal states
  const [showGrievanceModal, setShowGrievanceModal] = useState(false);
  const [grievanceName, setGrievanceName] = useState('');
  const [grievanceEmail, setGrievanceEmail] = useState('');
  const [grievanceType, setGrievanceType] = useState('Complaint');
  const [grievanceDesc, setGrievanceDesc] = useState('');
  const [grievanceSubmitted, setGrievanceSubmitted] = useState(false);
  const [grievanceRefId, setGrievanceRefId] = useState('');

  const handleGrievanceSubmit = (e) => {
    e.preventDefault();
    const ref = 'GP-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000);
    setGrievanceRefId(ref);
    setGrievanceSubmitted(true);
    
    // Simulate recording system audit log
    console.log(`Grievance submitted successfully. Ticket ID: ${ref}`);
  };

  const resetGrievanceForm = () => {
    setGrievanceName('');
    setGrievanceEmail('');
    setGrievanceType('Complaint');
    setGrievanceDesc('');
    setGrievanceSubmitted(false);
    setGrievanceRefId('');
  };

  const [showServiceModal, setShowServiceModal] = useState(false);
  const [serviceModalData, setServiceModalData] = useState(null);

  const openServiceModal = (title, desc, docs) => {
    setServiceModalData({ title, desc, docs });
    setShowServiceModal(true);
  };

  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const openTrackingModal = () => {
    setTrackInput('');
    setTrackResult(null);
    setTrackError('');
    setShowTrackingModal(true);
  };

  // 1. Office Location Seed Data
  const officeDatabase = {
    Maharashtra: ['PSK Mumbai (Lower Parel)', 'PSK Pune (Mundhwa)', 'PSK Nagpur'],
    Gujarat: ['PSK Ahmedabad (Mithakali)', 'PSK Surat (Udhna)', 'PSK Rajkot'],
    Delhi: ['PSK Delhi (R K Puram)', 'PSK Delhi (Shalimar Place)'],
    Karnataka: ['PSK Bengaluru (Lalbagh)', 'PSK Mangaluru']
  };

  // 2. FAQ list definition
  const faqs = [
    {
      q: lang === 'EN' ? 'How long does normal vs Tatkal passport issuance take?' : 'सामान्य बनाम तत्काल पासपोर्ट जारी करने में कितना समय लगता है?',
      a: lang === 'EN' 
        ? 'A Normal application takes around 15 to 20 working days to get dispatched. A Tatkal (urgent) application gets processed in high-priority queues and is typically printed and dispatched in 3 to 4 working days.'
        : 'एक सामान्य आवेदन को प्रेषित होने में लगभग 15 से 20 कार्यदिवस लगते हैं। तत्काल आवेदन को उच्च प्राथमिकता वाली कतारों में संसाधित किया जाता है और आमतौर पर 3 से 4 कार्यदिवसों में प्रिंट और प्रेषित किया जाता है।'
    },
    {
      q: lang === 'EN' ? 'Is physical verification of original documents mandatory?' : 'क्या मूल दस्तावेजों का भौतिक सत्यापन अनिवार्य है?',
      a: lang === 'EN'
        ? 'Yes. After uploading copies via AI OCR scanner and executing payments, citizens must book a scheduling slot and physically visit the selected Passport Seva Kendra (PSK) with original birth proof, address verification, and ID cards.'
        : 'हां। एआई ओसीआर स्कैनर के माध्यम से प्रतियां अपलोड करने और भुगतान करने के बाद, नागरिकों को एक शेड्यूलिंग स्लॉट बुक करना होगा और मूल जन्म प्रमाण, पता सत्यापन और आईडी कार्ड के साथ चयनित पासपोर्ट सेवा केंद्र (पीएसके) का दौरा करना होगा।'
    },
    {
      q: lang === 'EN' ? 'What should I do if my local police verification report is pending?' : 'यदि मेरी स्थानीय पुलिस सत्यापन रिपोर्ट लंबित है तो मुझे क्या करना चाहिए?',
      a: lang === 'EN'
        ? 'Police verification is automatically routed to your registered address station. You can check the assigned inspector station details via the Citizen dashboard tracking system or speak with the local chowki.'
        : 'पुलिस सत्यापन स्वचालित रूप से आपके पंजीकृत पते के स्टेशन पर भेज दिया जाता है। आप नागरिक डैशबोर्ड ट्रैकिंग प्रणाली के माध्यम से सौंपे गए निरीक्षक स्टेशन के विवरण की जांच कर सकते हैं।'
    }
  ];

  const handleTrack = () => {
    setTrackError('');
    setTrackResult(null);

    if (!trackInput.trim()) {
      setTrackError(lang === 'EN' ? 'Please enter a valid Tracking ID.' : 'कृपया वैध ट्रैकिंग आईडी दर्ज करें।');
      return;
    }

    // Match in applications context
    const matched = applications.find(a => a.tracking_id.toLowerCase() === trackInput.trim().toLowerCase());

    if (matched) {
      setTrackResult(matched);
      // NOTE: Do NOT set selectedTrackId here — that would show another user's app in the dashboard.
      // The dashboard always shows the logged-in user's own applications only.
    } else {
      setTrackError(lang === 'EN' ? 'Tracking ID not found in system archives.' : 'सिस्टम अभिलेखागार में ट्रैकिंग आईडी नहीं मिली।');
    }
  };

  return (
    <div class="w-full flex flex-col min-h-screen transition-colors">

      {/* ========================================================= */}
      {/* 1. LIVE ADVISORIES & SCROLLING NOTIFICATION BANNER (TOP AS IN REF SCREENSHOT 1) */}
      {/* =      {/* ========================================================= */}
      {/* 2. HERO SECTION WITH GOVT BRANDING AND TRI-COLOR GRADIENTS */}
      {/* ========================================================= */}
      <section class="w-full bg-gradient-to-r from-gov-navy via-[#103058] to-gov-blue dark:from-slate-950 dark:via-[#091a2e] dark:to-slate-900 text-white py-20 pb-36 md:pb-44 px-4 md:px-8 border-b border-gov-ashokaGold/30 relative overflow-hidden flex flex-col justify-center">
        
        {/* Stylized animated rotating Earth Globe watermark */}
        <svg class="absolute right-6 lg:right-24 top-1/2 -translate-y-1/2 h-[75%] w-auto opacity-[0.18] pointer-events-none text-gov-ashokaGold hidden md:block" viewBox="0 0 200 200" fill="none">
          <defs>
            <clipPath id="globe-mask">
              <circle cx="100" cy="100" r="75" />
            </clipPath>
            <radialGradient id="globe-shading" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stop-color="#ffffff" stop-opacity="0.5" />
              <stop offset="70%" stop-color="#d4af37" stop-opacity="0.1" />
              <stop offset="100%" stop-color="#0b2545" stop-opacity="0.8" />
            </radialGradient>
          </defs>

          {/* Outer Orbiting Rings (Satellite system) */}
          <g class="animate-orbit-spin">
            <circle cx="100" cy="100" r="92" stroke="currentColor" stroke-width="1.2" stroke-dasharray="5 6" />
            <circle cx="165" cy="35" r="4.5" fill="#ff671f" />
          </g>
          <circle cx="100" cy="100" r="84" stroke="currentColor" stroke-width="0.8" opacity="0.4" />

          {/* Inner Shading Backdrop */}
          <circle cx="100" cy="100" r="75" fill="url(#globe-shading)" opacity="0.15" />

          {/* Gridlines */}
          <circle cx="100" cy="100" r="75" stroke="currentColor" stroke-width="1" stroke-dasharray="2 3" opacity="0.25" />
          <path d="M 25 100 A 75 35 0 0 0 175 100" stroke="currentColor" stroke-width="0.8" stroke-dasharray="4 4" opacity="0.3" />
          <path d="M 25 100 A 75 35 0 0 1 175 100" stroke="currentColor" stroke-width="0.8" stroke-dasharray="4 4" opacity="0.3" />
          <path d="M 100 25 A 35 75 0 0 0 100 175" stroke="currentColor" stroke-width="0.8" stroke-dasharray="4 4" opacity="0.3" />
          <path d="M 100 25 A 35 75 0 0 1 100 175" stroke="currentColor" stroke-width="0.8" stroke-dasharray="4 4" opacity="0.3" />
          <line x1="25" y1="100" x2="175" y2="100" stroke="currentColor" stroke-width="1.2" opacity="0.4" />
          <line x1="100" y1="25" x2="100" y2="175" stroke="currentColor" stroke-width="1.2" opacity="0.4" />

          {/* Spinning Continents Layer (Masked to Sphere) */}
          <g clip-path="url(#globe-mask)">
            <g class="animate-globe-spin" fill="currentColor">
              
              {/* Copy 1 of World Map */}
              <g transform="translate(0, 0)">
                <path d="M 15 50 c -5 -5 -12 2 -10 10 c 2 10 5 15 2 25 c -2 8 -6 10 -4 15 c 3 6 8 -2 10 -10 c 2 -8 5 -12 7 -20 c 1 -5 -2 -15 -5 -20 Z" opacity="0.75" />
                <path d="M 20 60 c 5 5 12 10 10 20 c -2 10 -8 15 -10 25 c -3 15 0 25 5 30 c 6 6 8 -10 5 -20 c -3 -10 2 -20 8 -25 c 5 -5 -1 -25 -8 -30 Z" opacity="0.75" />
                <path d="M 65 35 c 8 -5 18 -2 22 8 c 3 8 0 12 -5 15 c -4 2 -12 0 -15 -8 c -2 -5 -5 -8 -2 -15 Z" opacity="0.8" />
                <path d="M 70 50 c 10 -4 25 0 20 15 c -4 10 -10 8 -15 15 c -5 8 -3 15 2 20 c 4 4 -2 10 -8 5 c -6 -6 -8 -15 -5 -25 c 3 -8 -1 -20 6 -30 Z" opacity="0.8" />
                <path d="M 80 85 c 5 5 8 15 5 25 c -4 12 -8 20 -5 32 c 2 8 -5 12 -10 5 c -6 -8 -4 -20 2 -30 c 5 -10 0 -22 8 -32 Z" opacity="0.8" />
                <path d="M 105 25 c 15 -10 35 -5 45 10 c 10 15 5 25 -10 30 c -15 5 -25 -10 -35 -15 c -8 -4 -8 -15 0 -25 Z" opacity="0.8" />
                <path d="M 115 45 c 8 -5 15 2 20 10 c 5 8 8 18 5 28 c -2 10 -10 12 -15 5 c -5 -8 -2 -18 -8 -25 c -4 -5 -5 -12 -2 -18 Z" opacity="0.8" />
                <path d="M 130 65 c 10 -4 18 2 20 10 c 2 8 -5 15 -12 15 c -8 0 -12 -8 -12 -15 c 0 -8 4 -10 4 -10 Z" opacity="0.8" />
                <path d="M 145 110 c 8 0 12 5 15 12 c 3 8 -5 15 -12 15 c -8 0 -12 -8 -12 -15 c 0 -8 5 -12 9 -12 Z" opacity="0.8" />
                <path d="M 125 95 c 4 -2 8 0 8 4 c 0 4 -4 4 -6 0 c -2 -4 -1 -4 -2 -4 Z" opacity="0.8" />
              </g>

              {/* Copy 2 of World Map (translated by 180 to loop seamlessly) */}
              <g transform="translate(180, 0)">
                <path d="M 15 50 c -5 -5 -12 2 -10 10 c 2 10 5 15 2 25 c -2 8 -6 10 -4 15 c 3 6 8 -2 10 -10 c 2 -8 5 -12 7 -20 c 1 -5 -2 -15 -5 -20 Z" opacity="0.75" />
                <path d="M 20 60 c 5 5 12 10 10 20 c -2 10 -8 15 -10 25 c -3 15 0 25 5 30 c 6 6 8 -10 5 -20 c -3 -10 2 -20 8 -25 c 5 -5 -1 -25 -8 -30 Z" opacity="0.75" />
                <path d="M 65 35 c 8 -5 18 -2 22 8 c 3 8 0 12 -5 15 c -4 2 -12 0 -15 -8 c -2 -5 -5 -8 -2 -15 Z" opacity="0.8" />
                <path d="M 70 50 c 10 -4 25 0 20 15 c -4 10 -10 8 -15 15 c -5 8 -3 15 2 20 c 4 4 -2 10 -8 5 c -6 -6 -8 -15 -5 -25 c 3 -8 -1 -20 6 -30 Z" opacity="0.8" />
                <path d="M 80 85 c 5 5 8 15 5 25 c -4 12 -8 20 -5 32 c 2 8 -5 12 -10 5 c -6 -8 -4 -20 2 -30 c 5 -10 0 -22 8 -32 Z" opacity="0.8" />
                <path d="M 105 25 c 15 -10 35 -5 45 10 c 10 15 5 25 -10 30 c -15 5 -25 -10 -35 -15 c -8 -4 -8 -15 0 -25 Z" opacity="0.8" />
                <path d="M 115 45 c 8 -5 15 2 20 10 c 5 8 8 18 5 28 c -2 10 -10 12 -15 5 c -5 -8 -2 -18 -8 -25 c -4 -5 -5 -12 -2 -18 Z" opacity="0.8" />
                <path d="M 130 65 c 10 -4 18 2 20 10 c 2 8 -5 15 -12 15 c -8 0 -12 -8 -12 -15 c 0 -8 4 -10 4 -10 Z" opacity="0.8" />
                <path d="M 145 110 c 8 0 12 5 15 12 c 3 8 -5 15 -12 15 c -8 0 -12 -8 -12 -15 c 0 -8 5 -12 9 -12 Z" opacity="0.8" />
                <path d="M 125 95 c 4 -2 8 0 8 4 c 0 4 -4 4 -6 0 c -2 -4 -1 -4 -2 -4 Z" opacity="0.8" />
              </g>
              
            </g>
          </g>
          
          <circle cx="100" cy="100" r="75" stroke="currentColor" stroke-width="1.5" opacity="0.4" />
        </svg>
        
        
        <div class="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-10 relative z-10 w-full">
          
          {/* Main Hero Slogan text */}
          <div class="lg:w-7/12 text-left flex flex-col gap-6">
            <span class="px-3 py-1 rounded bg-gov-ashokaGold/20 border border-gov-ashokaGold text-gov-ashokaGold text-xs font-bold w-fit uppercase tracking-wider">
              {lang === 'EN' ? 'AI-Powered Digital Transformation' : 'एआई-संचालित डिजिटल परिवर्तन'}
            </span>
            <h1 class="text-4xl md:text-5xl font-black tracking-tight font-serif leading-none">
              {lang === 'EN' ? 'Official National Portal for' : 'राष्ट्रीय पासपोर्ट पोर्टल'} <br/>
              <span class="text-gov-ashokaGold">{lang === 'EN' ? 'Smart Passport Issuance' : 'स्मार्ट पासपोर्ट वितरण'}</span>
            </h1>
            <p class="text-sm md:text-base text-slate-200 leading-relaxed max-w-xl font-medium">
              {t('emergencySlogan')} {lang === 'EN' ? 'Register with secure Aadhaar OTP, execute online uploads using high-accuracy OCR OCR extraction, match biometric photo profiles, and track files in real-time.' : 'सुरक्षित आधार ओटीपी के साथ पंजीकरण करें, ओसीआर निष्कर्षण का उपयोग करके ऑनलाइन दस्तावेज़ अपलोड करें, और वास्तविक समय में स्थिति को ट्रैक करें।'}
            </p>
            <div class="flex flex-wrap items-center gap-4 mt-2">
              <button 
                onClick={() => {
                  if (setAuthIsLogin) setAuthIsLogin(false);
                  setView('auth');
                }}
                class="px-6 py-3.5 rounded-xl bg-gov-ashokaGold hover:bg-gov-ashokaGold/90 text-gov-navy font-extrabold text-sm shadow-xl flex items-center gap-2 transform active:scale-95 transition-all"
              >
                <span>{t('applyNow')}</span>
                <ArrowRight size={16} />
              </button>
              <button 
                onClick={openTrackingModal}
                class="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 hover:border-white/30 transition-colors cursor-pointer"
              >
                {t('trackApp')}
              </button>
            </div>
          </div>

          {/* Right Section: Floating Passport SVG */}
          <div class="lg:w-5/12 w-full flex items-center justify-center">
            
            {/* Elegant Floating 3D Passport Booklet */}
            <div class="relative w-36 h-48 sm:w-44 sm:h-60 transform hover:rotate-y-12 hover:rotate-x-12 transition-transform duration-500 preserve-3d cursor-pointer filter drop-shadow-2xl animate-float">
              <div class="w-full h-full rounded-xl bg-[#0b1c33] border-2 border-amber-500/30 p-3.5 flex flex-col justify-between items-center text-white relative shadow-[inset_0_0_15px_rgba(0,0,0,0.6)]">
                <div class="w-full border border-amber-500/20 rounded h-full p-2 flex flex-col justify-between items-center">
                  <div class="flex flex-col items-center">
                    <span class="text-[8px] text-amber-400 font-extrabold tracking-widest font-serif">भारत गणराज्य</span>
                    <span class="text-[9px] text-amber-400 font-black tracking-widest font-serif mt-0.5">REPUBLIC OF INDIA</span>
                  </div>
                  
                  <svg class="h-14 w-auto text-amber-400 my-1.5" viewBox="0 0 100 130" fill="none">
                    <path d="M50,15 C42,15 38,20 38,28 C38,36 42,42 42,48 C37,48 34,51 34,55 C34,60 38,62 40,63 C35,65 33,68 33,72 C33,78 37,82 43,84 C38,87 35,90 35,95 C35,102 43,105 50,105 C57,105 65,102 65,95 C65,90 62,87 57,84 C63,82 67,78 67,72 C67,68 65,65 60,63 C62,62 66,60 66,55 C66,51 63,48 58,48 C58,42 62,36 62,28 C62,20 58,15 50,15 Z" fill="currentColor"/>
                    <circle cx="50" cy="30" r="4" fill="#6d4c00"/>
                    <text x="50" y="125" text-anchor="middle" font-size="7" font-weight="bold" fill="currentColor">सत्यमेव जयते</text>
                  </svg>
                  
                  <div class="flex flex-col items-center">
                    <span class="text-[9px] text-amber-400 font-extrabold tracking-widest font-serif">पासपोर्ट</span>
                    <span class="text-[10px] text-amber-400 font-black tracking-widest font-serif mt-0.5">PASSPORT</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* ========================================================= */}
      {/* 2.5 QUICK LINKS SECTION (OVERLAPPING THE HERO BORDER)      */}
      {/* ========================================================= */}
      <section class="w-full bg-transparent px-4 md:px-8 relative z-20">
        <div class="max-w-7xl mx-auto text-center bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 md:p-8 rounded-3xl shadow-xl -mt-20 md:-mt-24">
          <h2 class="text-2xl md:text-3xl font-black text-gov-navy dark:text-white font-serif tracking-tight flex items-center justify-center gap-2">
            <span class="w-8 h-1 bg-gov-ashokaGold rounded-full"></span>
            {lang === 'EN' ? 'Quick Links' : 'त्वरित लिंक्स'}
            <span class="w-8 h-1 bg-gov-ashokaGold rounded-full"></span>
          </h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
            {lang === 'EN' ? 'Access core passport services, check appointment availabilities, and submit grievances instantly.' : 'मुख्य पासपोर्ट सेवाओं तक पहुंचें, नियुक्ति उपलब्धता की जांच करें और तुरंत शिकायत दर्ज करें।'}
          </p>

          <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
            {/* 1. Apply For Passport */}
            <div 
              onClick={() => {
                if (setAuthIsLogin) setAuthIsLogin(false);
                setView('auth');
              }}
              class="p-5 rounded-2xl bg-white dark:bg-slate-805 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center gap-3.5 cursor-pointer shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md hover:border-gov-ashokaGold hover:bg-[#fffdf5] dark:hover:bg-slate-750 active:scale-95 group text-center"
            >
              <div class="w-14 h-14 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center border border-slate-200 dark:border-slate-650 text-gov-navy dark:text-gov-ashokaGold group-hover:scale-105 group-hover:bg-[#fdf5dd] transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              </div>
              <span class="text-xs font-black text-slate-800 dark:text-white leading-tight min-h-[32px] flex items-center justify-center font-serif px-1">
                {lang === 'EN' ? 'Apply For Passport' : 'पासपोर्ट के लिए आवेदन'}
              </span>
            </div>

            {/* 2. Check Appointment Availability */}
            <div 
              onClick={() => {
                const locator = document.getElementById('locator-widget');
                if (locator) locator.scrollIntoView({ behavior: 'smooth' });
              }}
              class="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center gap-3.5 cursor-pointer shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md hover:border-gov-ashokaGold hover:bg-[#fffdf5] dark:hover:bg-slate-750 active:scale-95 group text-center"
            >
              <div class="w-14 h-14 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center border border-slate-200 dark:border-slate-650 text-gov-navy dark:text-gov-ashokaGold group-hover:scale-105 group-hover:bg-[#fdf5dd] transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar-days"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
              </div>
              <span class="text-xs font-black text-slate-800 dark:text-white leading-tight min-h-[32px] flex items-center justify-center font-serif px-1">
                {lang === 'EN' ? 'Check Appointment Availability' : 'नियुक्ति स्लॉट उपलब्धता जांचें'}
              </span>
            </div>

            {/* 3. Track Passport Application */}
            <div 
              onClick={openTrackingModal}
              class="p-5 rounded-2xl bg-white dark:bg-slate-805 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center gap-3.5 cursor-pointer shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md hover:border-gov-ashokaGold hover:bg-[#fffdf5] dark:hover:bg-slate-750 active:scale-95 group text-center"
            >
              <div class="w-14 h-14 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center border border-slate-200 dark:border-slate-650 text-gov-navy dark:text-gov-ashokaGold group-hover:scale-105 group-hover:bg-[#fdf5dd] transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <span class="text-xs font-black text-slate-800 dark:text-white leading-tight min-h-[32px] flex items-center justify-center font-serif px-1">
                {lang === 'EN' ? 'Track Passport Application' : 'पासपोर्ट आवेदन की ट्रैकिंग'}
              </span>
            </div>

            {/* 4. Register Feedback / Grievance */}
            <div 
              onClick={() => {
                resetGrievanceForm();
                setShowGrievanceModal(true);
              }}
              class="p-5 rounded-2xl bg-white dark:bg-slate-805 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center gap-3.5 cursor-pointer shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md hover:border-gov-ashokaGold hover:bg-slate-50 dark:hover:bg-slate-750 active:scale-95 group text-center"
            >
              <div class="w-14 h-14 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center border border-slate-200 dark:border-slate-650 text-gov-navy dark:text-gov-ashokaGold group-hover:scale-105 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-alert"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
              </div>
              <span class="text-xs font-black text-slate-800 dark:text-white leading-tight min-h-[32px] flex items-center justify-center font-serif px-1">
                {lang === 'EN' ? 'Register Feedback / Grievance' : 'प्रतिक्रिया / शिकायत दर्ज करें'}
              </span>
            </div>

            {/* 5. Miscellaneous Services */}
            <div 
              onClick={() => {
                const servicesSection = document.getElementById('services-section');
                if (servicesSection) servicesSection.scrollIntoView({ behavior: 'smooth' });
              }}
              class="p-5 rounded-2xl bg-white dark:bg-slate-805 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center gap-3.5 cursor-pointer shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md hover:border-gov-ashokaGold hover:bg-slate-50 dark:hover:bg-slate-750 active:scale-95 group text-center"
            >
              <div class="w-14 h-14 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center border border-slate-200 dark:border-slate-650 text-gov-navy dark:text-gov-ashokaGold group-hover:scale-105 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-help-circle"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" x2="12" y1="17" y2="17"/></svg>
              </div>
              <span class="text-xs font-black text-slate-800 dark:text-white leading-tight min-h-[32px] flex items-center justify-center font-serif px-1">
                {lang === 'EN' ? 'Miscellaneous Services' : 'विविध सेवाएं'}
              </span>
            </div>
          </div>
        </div>
      </section>


      <section id="services-section" class="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div class="text-center mb-12">
          <h2 class="text-2xl md:text-3xl font-black text-gov-navy dark:text-white font-serif tracking-tight">
            {lang === 'EN' ? 'Know About Our Services' : 'हमारी सेवाओं के बारे में जानें'}
          </h2>
          <div class="w-16 h-1 bg-gov-ashokaGold mx-auto mt-4 rounded-full"></div>
        </div>

        {/* 8-Card Services Grid */}
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 select-none">
          
          {/* Card 1: Fresh / Re-issue Ordinary Passport */}
          <div 
            onClick={() => {
              if (setAuthIsLogin) setAuthIsLogin(false);
              setView('auth');
            }}
            class="p-6 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 text-slate-800 dark:text-white text-center flex flex-col items-center justify-center gap-4 cursor-pointer shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:bg-gradient-to-br hover:from-gov-navy hover:to-gov-blue hover:text-white hover:border-gov-ashokaGold/40 active:scale-95 group"
          >
            <div class="w-14 h-14 rounded-full bg-slate-50 dark:bg-slate-800 text-gov-navy dark:text-gov-ashokaGold flex items-center justify-center border border-slate-200 dark:border-slate-700 group-hover:bg-white/20 group-hover:text-white group-hover:scale-105 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-current"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            </div>
            <h3 class="font-extrabold text-xs md:text-sm font-serif leading-snug max-w-[130px] group-hover:text-white">
              {lang === 'EN' ? 'Fresh / Re-issue Ordinary Passport' : 'नया / पुनः जारी सामान्य पासपोर्ट'}
            </h3>
          </div>

          {/* Card 2: Tatkaal Passport */}
          <div 
            onClick={() => {
              if (setAuthIsLogin) setAuthIsLogin(false);
              setView('auth');
            }}
            class="p-6 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 text-slate-800 dark:text-white text-center flex flex-col items-center justify-center gap-4 cursor-pointer shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:bg-gradient-to-br hover:from-gov-navy hover:to-gov-blue hover:text-white hover:border-gov-ashokaGold/40 active:scale-95 group"
          >
            <div class="w-14 h-14 rounded-full bg-slate-50 dark:bg-slate-800 text-gov-navy dark:text-gov-ashokaGold flex items-center justify-center border border-slate-200 dark:border-slate-700 group-hover:bg-white/20 group-hover:text-white group-hover:scale-105 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-current"><path d="M2 22h20"/><path d="M6.36 17.4 4 17l-2-4 1.1-.55 2.24 1.85 4.66-2.83-2.02-3.5 1.21-.4 3.7 2.25 5.5-3.34c.82-.5 1.89-.17 2.4.73s.1 2.03-.73 2.54l-11 6.69Z"/></svg>
            </div>
            <h3 class="font-extrabold text-xs md:text-sm font-serif leading-snug group-hover:text-white">
              {lang === 'EN' ? 'Tatkaal Passport' : 'तत्काल पासपोर्ट'}
            </h3>
          </div>

          {/* Card 3: Diplomatic / Official Passport */}
          <div 
            onClick={() => openServiceModal(
              lang === 'EN' ? 'Diplomatic / Official Passport' : 'राजनयिक / आधिकारिक पासपोर्ट',
              lang === 'EN' 
                ? 'Issued statefully to Indian diplomats, government officials, and high-level representatives traveling abroad on official state business.'
                : 'राजनयिकों, सरकारी अधिकारियों और राज्य के व्यवसाय पर विदेश यात्रा करने वाले प्रतिनिधियों को जारी किया जाता है।',
              lang === 'EN'
                ? ['Official Dispatch Authorization Letter', 'MEA Administrative approval sheet', 'Identity Card & Aadhaar profile details', 'Passport-size official photo book']
                : ['आधिकारिक प्रेषण प्राधिकरण पत्र', 'एमईए प्रशासनिक अनुमोदन पत्र', 'आईडी कार्ड और आधार विवरण', 'पासपोर्ट आकार की तस्वीर']
            )}
            class="p-6 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 text-slate-800 dark:text-white text-center flex flex-col items-center justify-center gap-4 cursor-pointer shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:bg-gradient-to-br hover:from-gov-navy hover:to-gov-blue hover:text-white hover:border-gov-ashokaGold/40 active:scale-95 group"
          >
            <div class="w-14 h-14 rounded-full bg-slate-50 dark:bg-slate-800 text-gov-navy dark:text-gov-ashokaGold flex items-center justify-center border border-slate-200 dark:border-slate-700 group-hover:bg-white/20 group-hover:text-white group-hover:scale-105 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-current"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="11" r="3"/><path d="M12 2v6"/></svg>
            </div>
            <h3 class="font-extrabold text-xs md:text-sm font-serif leading-snug group-hover:text-white">
              {lang === 'EN' ? 'Diplomatic / Official Passport' : 'राजनयिक / आधिकारिक पासपोर्ट'}
            </h3>
          </div>

          {/* Card 4: Police Clearance Certificate (PCC) */}
          <div 
            onClick={() => openServiceModal(
              lang === 'EN' ? 'Police Clearance Certificate (PCC)' : 'पुलिस क्लीयरेंस सर्टिफिकेट (पीसीसी)',
              lang === 'EN'
                ? 'An official certificate verifying clean legal history of Indian nationals seeking employment, emigration, or long-term visas abroad.'
                : 'विदेश में रोजगार, प्रवास, या दीर्घकालिक वीजा चाहने वाले भारतीय नागरिकों के साफ कानूनी इतिहास की पुष्टि करने वाला प्रमाण पत्र।',
              lang === 'EN'
                ? ['Active Indian Passport Book', 'Address proof declarations', 'Aadhaar UID authentication details', 'Local police verification confirmation log']
                : ['सक्रिय भारतीय पासपोर्ट बुक', 'पता प्रमाण घोषणाएं', 'आधार यूआईडी विवरण', 'स्थानीय पुलिस सत्यापन लॉग']
            )}
            class="p-6 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 text-slate-800 dark:text-white text-center flex flex-col items-center justify-center gap-4 cursor-pointer shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:bg-gradient-to-br hover:from-gov-navy hover:to-gov-blue hover:text-white hover:border-gov-ashokaGold/40 active:scale-95 group"
          >
            <div class="w-14 h-14 rounded-full bg-slate-50 dark:bg-slate-800 text-gov-navy dark:text-gov-ashokaGold flex items-center justify-center border border-slate-200 dark:border-slate-700 group-hover:bg-white/20 group-hover:text-white group-hover:scale-105 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-current"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            </div>
            <h3 class="font-extrabold text-xs md:text-sm font-serif leading-snug group-hover:text-white">
              {lang === 'EN' ? 'Police Clearance Certificate' : 'पुलिस क्लीयरेंस सर्टिफिकेट'}
            </h3>
          </div>

          {/* Card 5: Identity Certificate / Surrender Certificate */}
          <div 
            onClick={() => openServiceModal(
              lang === 'EN' ? 'Identity Certificate (IC) / Surrender Certificate (SC)' : 'पहचान प्रमाण पत्र / पासपोर्ट समर्पण प्रमाण पत्र',
              lang === 'EN'
                ? 'Identity Certificates are issued to Tibetan refugees and stateless nationals. Surrender Certificates verify standard legal cancellation of passports of Indian nationals acquiring foreign citizenships.'
                : 'पहचान प्रमाण पत्र तिब्बती शरणार्थियों और स्टेटलेस नागरिकों को जारी किए जाते हैं। समर्पण प्रमाण पत्र विदेशी नागरिकता प्राप्त करने वाले नागरिकों के पासपोर्ट को कानूनी रूप से रद्द करते हैं।',
              lang === 'EN'
                ? ['Original passport booklet for cancellation', 'Naturalization certificate copy', 'Residency permit proofs', 'Foreign passport copy (as applicable)']
                : ['रद्द करने के लिए मूल पासपोर्ट बुकलेट', 'प्राकृतिककरण प्रमाण पत्र की प्रति', 'आवास परमिट प्रमाण', 'विदेशी पासपोर्ट की प्रति']
            )}
            class="p-6 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 text-slate-800 dark:text-white text-center flex flex-col items-center justify-center gap-4 cursor-pointer shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:bg-gradient-to-br hover:from-gov-navy hover:to-gov-blue hover:text-white hover:border-gov-ashokaGold/40 active:scale-95 group"
          >
            <div class="w-14 h-14 rounded-full bg-slate-50 dark:bg-slate-800 text-gov-navy dark:text-gov-ashokaGold flex items-center justify-center border border-slate-200 dark:border-slate-700 group-hover:bg-white/20 group-hover:text-white group-hover:scale-105 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-current"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M12 7v6"/><path d="M9 10h6"/></svg>
            </div>
            <h3 class="font-extrabold text-xs md:text-sm font-serif leading-snug group-hover:text-white">
              {lang === 'EN' ? 'Identity Certificate / Surrender Certificate' : 'पहचान प्रमाण पत्र / समर्पण प्रमाण पत्र'}
            </h3>
          </div>

          {/* Card 6: Line of Control (LoC) Permit */}
          <div 
            onClick={() => openServiceModal(
              lang === 'EN' ? 'Line of Control (LoC) Permit' : 'नियंत्रण रेखा (LoC) परमिट',
              lang === 'EN'
                ? 'Special entry permits issued exclusively for J&K permanent residents visiting divided relatives residing across the Line of Control.'
                : 'नियंत्रण रेखा के पार रहने वाले रिश्तेदारों से मिलने जाने वाले जम्मू-कश्मीर के स्थायी निवासियों के लिए जारी किए गए विशेष प्रवेश परमिट।',
              lang === 'EN'
                ? ['LoC Permanent Residency Proof card', 'Aadhaar Card validation verification', 'Relative sponsorship inviter sheet', 'Authorized local district stamp clearances']
                : ['एलओसी स्थायी निवास प्रमाण पत्र', 'आधार कार्ड सत्यापन', 'रिश्तेदार प्रायोजन पत्र', 'अधिकृत स्थानीय जिला टिकट मंजूरी']
            )}
            class="p-6 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 text-slate-800 dark:text-white text-center flex flex-col items-center justify-center gap-4 cursor-pointer shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:bg-gradient-to-br hover:from-gov-navy hover:to-gov-blue hover:text-white hover:border-gov-ashokaGold/40 active:scale-95 group"
          >
            <div class="w-14 h-14 rounded-full bg-slate-50 dark:bg-slate-800 text-gov-navy dark:text-gov-ashokaGold flex items-center justify-center border border-slate-200 dark:border-slate-700 group-hover:bg-white/20 group-hover:text-white group-hover:scale-105 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-current"><rect x="3" y="11" width="18" height="10" rx="2" /><path d="M12 2v9"/><path d="M8 5h8"/></svg>
            </div>
            <h3 class="font-extrabold text-xs md:text-sm font-serif leading-snug group-hover:text-white">
              {lang === 'EN' ? 'Line of Control (LoC) Permit' : 'नियंत्रण रेखा (LoC) परमिट'}
            </h3>
          </div>

          {/* Card 7: Passport Act and Rules */}
          <div 
            onClick={() => openServiceModal(
              lang === 'EN' ? 'Passport Act and Rules' : 'पासपोर्ट अधिनियम और नियम',
              lang === 'EN'
                ? 'Official legal guidelines and frameworks governing passport book booklet issuance, administrative restrictions, travel penalties, and citizen rights.'
                : 'पासपोर्ट बुकलेट जारी करने, प्रशासनिक प्रतिबंधों, यात्रा दंड और नागरिक अधिकारों को नियंत्रित करने वाले कानूनी दिशानिर्देश।',
              lang === 'EN'
                ? ['Passport Act 1967 official framework documentation', 'Manual of Indian Passport regulations', 'Penalties checklist declarations', 'Citizen rights index sheet']
                : ['पासपोर्ट अधिनियम 1967 ढांचा दस्तावेज', 'भारतीय पासपोर्ट नियमों की नियमावली', 'दंड चेकलिस्ट घोषणाएं', 'नागरिक अधिकार सूचकांक पत्र']
            )}
            class="p-6 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 text-slate-800 dark:text-white text-center flex flex-col items-center justify-center gap-4 cursor-pointer shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:bg-gradient-to-br hover:from-gov-navy hover:to-gov-blue hover:text-white hover:border-gov-ashokaGold/40 active:scale-95 group"
          >
            <div class="w-14 h-14 rounded-full bg-slate-50 dark:bg-slate-800 text-gov-navy dark:text-gov-ashokaGold flex items-center justify-center border border-slate-200 dark:border-slate-700 group-hover:bg-white/20 group-hover:text-white group-hover:scale-105 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-current"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
            </div>
            <h3 class="font-extrabold text-xs md:text-sm font-serif leading-snug group-hover:text-white">
              {lang === 'EN' ? 'Passport Act and Rules' : 'पासपोर्ट अधिनियम और नियम'}
            </h3>
          </div>

          {/* Card 8: Annexures and Affidavits */}
          <div 
            onClick={() => openServiceModal(
              lang === 'EN' ? 'Annexures and Affidavits' : 'अनुलग्नक और शपथ पत्र',
              lang === 'EN'
                ? 'Standard legal templates and formats (Annexure A to I) required for child guardianships, spouse passport inclusions, address changes, or lost booklets.'
                : 'बाल संरक्षकता, जीवनसाथी के नाम जोड़ने, पते में बदलाव, या खोई हुई पासपोर्ट बुकलेट के लिए आवश्यक मानक कानूनी प्रारूप (अनुलग्नक ए से आई)।',
              lang === 'EN'
                ? ['Standard Annexure A to I blank draft formats', 'Notary advocate clearance documentation', 'Spouse/Parents identity proof records', 'Address correction declarations']
                : ['मानक अनुलग्नक ए से आई प्रारूप', 'नोटरी अधिवक्ता मंजूरी दस्तावेज', 'पति/पत्नी/माता-पिता के पहचान प्रमाण पत्र', 'पता सुधार घोषणाएं']
            )}
            class="p-6 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 text-slate-800 dark:text-white text-center flex flex-col items-center justify-center gap-4 cursor-pointer shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:bg-gradient-to-br hover:from-gov-navy hover:to-gov-blue hover:text-white hover:border-gov-ashokaGold/40 active:scale-95 group"
          >
            <div class="w-14 h-14 rounded-full bg-slate-50 dark:bg-slate-800 text-gov-navy dark:text-gov-ashokaGold flex items-center justify-center border border-slate-200 dark:border-slate-750 group-hover:bg-white/20 group-hover:text-white group-hover:scale-105 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-current"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/></svg>
            </div>
            <h3 class="font-extrabold text-xs md:text-sm font-serif leading-snug group-hover:text-white">
              {lang === 'EN' ? 'Annexures and Affidavits' : 'अनुलग्नक और शपथ पत्र'}
            </h3>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 3.5 PORTAL WEEKLY STATISTICS COUNTER BOARD               */}
      {/* ========================================================= */}
      <section class="w-full bg-[#fdfdfd] dark:bg-slate-950 py-10 px-4 md:px-8 border-b border-slate-100 dark:border-slate-800 select-none">
        <div class="max-w-6xl mx-auto text-center flex flex-col gap-6">
          <h3 class="text-xl font-black text-gov-navy dark:text-white font-serif tracking-tight">
            {lang === 'EN' ? 'Statistics From Last Week' : 'पिछले सप्ताह के आंकड़े'}
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0 mt-4 items-center">
            {/* Stat 1 */}
            <div class="flex flex-col items-center justify-center p-4 md:border-r border-slate-200 dark:border-slate-800">
              <strong class="text-4xl md:text-5xl font-black text-[#134074] dark:text-gov-light leading-none font-sans">
                450291+
              </strong>
              <span class="text-xs text-slate-500 dark:text-slate-400 font-extrabold uppercase mt-2">
                {lang === 'EN' ? 'Appointments Released' : 'जारी की गई नियुक्तियां'}
              </span>
            </div>

            {/* Stat 2 */}
            <div class="flex flex-col items-center justify-center p-4 md:border-r border-slate-200 dark:border-slate-800">
              <strong class="text-4xl md:text-5xl font-black text-[#134074] dark:text-gov-light leading-none font-sans">
                276933+
              </strong>
              <span class="text-xs text-slate-500 dark:text-slate-400 font-extrabold uppercase mt-2">
                {lang === 'EN' ? 'Applications Processed' : 'संसाधित किए गए आवेदन'}
              </span>
            </div>

            {/* Stat 3 */}
            <div class="flex flex-col items-center justify-center p-4">
              <strong class="text-4xl md:text-5xl font-black text-[#134074] dark:text-gov-light leading-none font-sans">
                235318+
              </strong>
              <span class="text-xs text-slate-500 dark:text-slate-400 font-extrabold uppercase mt-2">
                {lang === 'EN' ? 'Passports Issued' : 'जारी किए गए पासपोर्ट'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3.6 PUBLIC NOTICE BOARD DECK                             */}
      {/* ========================================================= */}
      <section class="w-full bg-[#fefdf4] dark:bg-slate-900/60 py-12 px-4 md:px-8 border-b border-amber-100 dark:border-slate-800">
        <div class="max-w-7xl mx-auto flex flex-col gap-6">
          <div class="flex justify-between items-center border-b border-amber-200/50 pb-3 dark:border-slate-850">
            <h3 class="text-2xl font-black text-gov-navy dark:text-white font-serif tracking-tight">
              {lang === 'EN' ? 'Public Notice' : 'सार्वजनिक सूचना'}
            </h3>
            <button class="px-4 py-2 rounded-xl bg-gradient-to-r from-[#124076] to-[#4c3199] hover:opacity-90 text-white text-xs font-bold transition-all shadow-md">
              {lang === 'EN' ? 'View More' : 'अधिक देखें'}
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 text-left">
            {/* Card 1 */}
            <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300">
              <div class="flex flex-col gap-3">
                <h4 class="font-extrabold text-sm text-slate-800 dark:text-white font-serif">
                  {lang === 'EN' ? 'Tatkaal Passport' : 'तत्काल पासपोर्ट'}
                </h4>
                <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {lang === 'EN' 
                    ? 'For obtaining Passport under Tatkaal scheme, along with the address, birth and non-ECR proofs (as applicable) applicants have to submit additional documents. Click Know More to check your eligibility for Tatkaal scheme.' 
                    : 'तत्काल योजना के तहत पासपोर्ट प्राप्त करने के लिए, पते, जन्म और गैर-ईसीआर प्रमाणों (जैसा लागू हो) के साथ आवेदकों को अतिरिक्त दस्तावेज जमा करने होंगे। तत्काल योजना के लिए पात्रता की जांच करने के लिए अधिक जानें पर क्लिक करें।'}
                </p>
              </div>
              <button 
                onClick={() => openServiceModal(
                  lang === 'EN' ? 'Tatkaal Passport Notice' : 'तत्काल पासपोर्ट सूचना',
                  lang === 'EN'
                    ? 'Under Tatkaal urgent schemes, citizen files bypass standard queue and biometric appointment scheduling is verified within 24 hours. The document check is detailed.'
                    : 'तत्काल योजनाओं के तहत, नागरिक फाइलें मानक कतार से बचती हैं और बायोमेट्रिक नियुक्ति शेड्यूलिंग 24 घंटे के भीतर सत्यापित की जाती है।',
                  lang === 'EN'
                    ? ['Tatkaal extra fee of INR 2,000.00', 'Three identity check proofs required (Aadhaar, Voter ID, PAN)', 'Self-declaration of clean legal record']
                    : ['INR 2,000.00 का तत्काल अतिरिक्त शुल्क', 'तीन पहचान प्रमाण आवश्यक', 'साफ कानूनी रिकॉर्ड की आत्म-घोषणा']
                )}
                class="text-xs font-bold text-[#134074] dark:text-gov-light hover:underline mt-4 text-left self-start flex items-center gap-1 bg-transparent border-0 cursor-pointer"
              >
                <span>{lang === 'EN' ? 'Know More' : 'अधिक जानें'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
            </div>

            {/* Card 2 */}
            <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300">
              <div class="flex flex-col gap-3">
                <h4 class="font-extrabold text-sm text-slate-800 dark:text-white font-serif">
                  {lang === 'EN' ? 'Normal/Tatkaal Appointment Opening Time' : 'सामान्य/तत्काल नियुक्ति खुलने का समय'}
                </h4>
                <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {lang === 'EN' 
                    ? 'Appointments opening time corresponding to each Passport Office, Seva Kendra, and post offices is scheduled. Check local time metrics to prevent scheduling conflicts and secure verified slots.' 
                    : 'प्रत्येक पासपोर्ट कार्यालय, सेवा केंद्र और डाकघरों के अनुरूप नियुक्तियों के खुलने का समय निर्धारित है। शेड्यूलिंग संघर्षों को रोकने के लिए स्थानीय समय की जांच करें।'}
                </p>
              </div>
              <button 
                onClick={() => openServiceModal(
                  lang === 'EN' ? 'Appointment Opening Notice' : 'नियुक्ति खुलने का समय सूचना',
                  lang === 'EN'
                    ? 'Daily slot reservations are released statefully every morning. Citizens are encouraged to secure their scheduling early in regional centers.'
                    : 'दैनिक स्लॉट आरक्षण हर सुबह जारी किए जाते हैं। नागरिकों को क्षेत्रीय केंद्रों में जल्दी शेड्यूलिंग स्लॉट सुरक्षित करने के लिए प्रोत्साहित किया जाता है।',
                  lang === 'EN'
                    ? ['Standard slot booking opening: 09:00 AM IST daily', 'Tatkal prioritised checking slots bypass standard constraints', 'Active verification receipt generated immediately with QR code']
                    : ['मानक बुकिंग समय: हर सुबह 09:00 AM IST', 'तत्काल प्राथमिकता वाले स्लॉट', 'क्यूआर कोड के साथ तत्काल सत्यापन रसीद']
                )}
                class="text-xs font-bold text-[#134074] dark:text-gov-light hover:underline mt-4 text-left self-start flex items-center gap-1 bg-transparent border-0 cursor-pointer"
              >
                <span>{lang === 'EN' ? 'Know More' : 'अधिक जानें'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
            </div>

            {/* Card 3 */}
            <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300">
              <div class="flex flex-col gap-3">
                <h4 class="font-extrabold text-sm text-slate-800 dark:text-white font-serif">
                  {lang === 'EN' ? 'Advisory for Indians going on Work Abroad' : 'विदेशों में काम पर जाने वाले भारतीयों के लिए सलाह'}
                </h4>
                <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {lang === 'EN' 
                    ? 'Advisory for Indian citizens going for job in a foreign country. Go Safe Go Trained. Link verified work documents, inspect visa clearances, and report queries to protect traveling rights.' 
                    : 'विदेश में नौकरी के लिए जाने वाले भारतीय नागरिकों के लिए सलाह। गो सेफ गो ट्रेन्ड। यात्रा अधिकारों की रक्षा के लिए सत्यापित कार्य दस्तावेजों को लिंक करें।'}
                </p>
              </div>
              <button 
                onClick={() => openServiceModal(
                  lang === 'EN' ? 'Work Abroad Traveling Advisory' : 'विदेश काम पर जाने वाले यात्रियों के लिए सलाह',
                  lang === 'EN'
                    ? 'Official safety travel guidelines issued under MEA. Emigrants are advised to register under verified work agreements to secure valid residency.'
                    : 'एमईए के तहत जारी आधिकारिक सुरक्षा यात्रा दिशानिर्देश। प्रवासियों को सलाह दी जाती है कि वे वैध काम के समझौतों के तहत पंजीकरण करें।',
                  lang === 'EN'
                    ? ['Inspect visa credentials details through official gateways only', 'Do not pay money to unverified recruitment agencies', 'Keep emergency embassy contacts saved in travel profiles']
                    : ['केवल आधिकारिक द्वारों के माध्यम से वीजा क्रेडेंशियल की जांच करें', 'अनधिकृत भर्ती एजेंसियों को पैसे का भुगतान न करें', 'आपातकालीन दूतावास संपर्कों को सुरक्षित रखें']
                )}
                class="text-xs font-bold text-[#134074] dark:text-gov-light hover:underline mt-4 text-left self-start flex items-center gap-1 bg-transparent border-0 cursor-pointer"
              >
                <span>{lang === 'EN' ? 'Know More' : 'अधिक जानें'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. OFFICE LOCATION LOCATOR WIDGET */}
      {/* ========================================================= */}
      <section id="locator-widget" class="w-full bg-slate-100 dark:bg-slate-900 border-t border-b border-slate-200/60 dark:border-slate-800 py-16 px-4 md:px-8">
        <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          <div class="text-left flex flex-col gap-4">
            <span class="px-2.5 py-1 rounded bg-gov-blue/10 border border-gov-blue/20 text-gov-blue dark:text-gov-light text-xs font-bold w-fit uppercase">
              {lang === 'EN' ? 'Location Search' : 'स्थान खोज'}
            </span>
            <h2 class="text-2xl md:text-3xl font-extrabold text-gov-navy dark:text-white font-serif">
              {lang === 'EN' ? 'Find Your Nearest Passport Kendra Office' : 'अपने निकटतम पासपोर्ट केंद्र कार्यालय का पता लगाएं'}
            </h2>
            <p class="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              {lang === 'EN' ? 'Choose your region state and select nearby city networks to confirm slot booking calendar availability. Each center supports high-speed facial match verification terminals.' : 'स्लॉट बुकिंग उपलब्धता की पुष्टि करने के लिए अपने क्षेत्र और शहर का चयन करें। प्रत्येक केंद्र उच्च गति चेहरे सत्यापन का समर्थन करता है।'}
            </p>
          </div>

          <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl text-left flex flex-col gap-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col gap-1.5">
                <label class="text-[10px] uppercase font-bold text-slate-400">{lang === 'EN' ? 'Select State' : 'राज्य चुनें'}</label>
                <select 
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    setSelectedCity('');
                  }}
                  class="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-gov-blue"
                >
                  <option value="">-- Choose --</option>
                  {Object.keys(officeDatabase).map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-[10px] uppercase font-bold text-slate-400">{lang === 'EN' ? 'Select City' : 'शहर चुनें'}</label>
                <select 
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  disabled={!selectedState}
                  class="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-gov-blue disabled:opacity-50"
                >
                  <option value="">-- Choose --</option>
                  {selectedState && officeDatabase[selectedState].map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            {selectedCity && (
              <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-start gap-3 animate-in fade-in duration-200">
                <MapPin size={18} class="text-gov-orange shrink-0 mt-0.5" />
                <div class="text-xs">
                  <h4 class="font-bold text-slate-800 dark:text-white">{selectedCity}</h4>
                  <p class="text-slate-400 mt-1 leading-tight">{lang === 'EN' ? 'Government biometric registration division, Open Monday to Friday (09:00 AM - 05:00 PM).' : 'बायोमेट्रिक पंजीकरण विभाग, सोमवार से शुक्रवार खुला (09:00 AM - 05:00 PM)।'}</p>
                  <div class="flex items-center gap-1.5 text-gov-green font-bold text-[10px] uppercase mt-2">
                    <Clock size={10} />
                    <span>{lang === 'EN' ? 'Slot Availability: HIGH' : 'स्लॉट उपलब्धता: उच्च'}</span>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. COLLAPSIBLE ACCORDION FAQ SECTION */}
      {/* ========================================================= */}
      <section class="max-w-4xl mx-auto px-4 md:px-8 py-16">
        <div class="text-center mb-10">
          <h2 class="text-2xl md:text-3xl font-extrabold text-gov-navy dark:text-white font-serif">
            {lang === 'EN' ? 'Frequently Answered Questions' : 'अक्सर पूछे जाने वाले प्रश्न'}
          </h2>
          <p class="text-xs md:text-sm text-slate-400 mt-2 font-medium">{lang === 'EN' ? 'Review legal, appointment, and document process queries.' : 'कानूनी, नियुक्ति और दस्तावेज़ प्रक्रिया प्रश्नों की समीक्षा करें।'}</p>
        </div>

        <div class="flex flex-col gap-4">
          {faqs.map((faq, idx) => (
            <div key={idx} class="border border-slate-200 dark:border-slate-700/60 rounded-2xl overflow-hidden bg-white dark:bg-slate-800/40 text-left">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                class="w-full p-4 flex justify-between items-center gap-4 text-xs md:text-sm font-bold text-gov-navy dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <span>{faq.q}</span>
                {activeFaq === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {activeFaq === idx && (
                <div class="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. TRUSTED GOVERNMENT SERVICE TESTIMONIALS */}
      {/* ========================================================= */}
      <section class="w-full bg-slate-900 text-white dark:bg-slate-950 py-16 px-4 md:px-8 border-t border-slate-800">
        <div class="max-w-7xl mx-auto text-center">
          <h2 class="text-2xl md:text-3xl font-extrabold font-serif mb-2 tracking-tight">
            {lang === 'EN' ? 'What Citizens Say' : 'नागरिकों के अनुभव'}
          </h2>
          <p class="text-xs text-slate-400 max-w-lg mx-auto mb-10 font-medium">
            {lang === 'EN' ? 'Hear from citizens who experienced accelerated document clearances through AI OCR facial checking.' : 'उन नागरिकों से सुनें जिन्होंने एआई ओसीआर फेशियल चेकिंग के माध्यम से त्वरित दस्तावेज़ निकासी का अनुभव किया है।'}
          </p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Rohan Deshmukh',
                loc: 'Mumbai, Maharashtra',
                feedback: lang === 'EN' ? 'Applying under the Tatkal scheme was remarkably smooth. AI OCR verified my PAN card in seconds, and my booklet was dispatched in just 3 days!' : 'तत्काल योजना के तहत आवेदन करना बेहद आसान था। एआई ओसीआर ने सेकंडों में मेरे पैन कार्ड को सत्यापित कर दिया, और केवल 3 दिनों में पासपोर्ट प्रेषित हो गया!',
                rating: 5
              },
              {
                name: 'Neha Chawla',
                loc: 'New Delhi',
                feedback: lang === 'EN' ? 'The slot scheduling slip having QR verification is fantastic. Officer checked my files and police verification report completed without any issues.' : 'क्यूआर सत्यापन वाली स्लॉट शेड्यूलिंग पर्ची शानदार है। अधिकारी ने मेरी फाइलों की जांच की और पुलिस सत्यापन बिना किसी समस्या के पूरा हो गया।',
                rating: 5
              },
              {
                name: 'Suresh Patel',
                loc: 'Ahmedabad, Gujarat',
                feedback: lang === 'EN' ? 'I renewed my passport using this portal. Excellent clean government UI. The virtual chatbot immediately gave me the accurate list of address proofs.' : 'मैंने इस पोर्टल का उपयोग करके अपने पासपोर्ट का नवीनीकरण किया। उत्कृष्ट स्वच्छ इंटरफ़ेस। वर्चुअल चैटबॉट ने मुझे तुरंत पते के प्रमाणों की सटीक सूची दी।',
                rating: 5
              }
            ].map((test, idx) => (
              <div key={idx} class="p-6 rounded-2xl bg-slate-850 border border-slate-800 bg-slate-800/40 text-left flex flex-col justify-between gap-4">
                <div>
                  <div class="flex gap-1 mb-3 text-gov-orange">
                    {[...Array(test.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                  <p class="text-xs text-slate-300 leading-relaxed font-medium italic">"{test.feedback}"</p>
                </div>
                <div class="text-[11px] font-bold border-t border-slate-800 pt-3 flex flex-col">
                  <span class="text-white">{test.name}</span>
                  <span class="text-slate-500 font-semibold">{test.loc}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. REGISTER GRIEVANCE / FEEDBACK MODAL                   */}
      {/* ========================================================= */}
      {showGrievanceModal && (
        <div class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div class="bg-white dark:bg-slate-900 border border-gov-ashokaGold/30 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative overflow-hidden text-left flex flex-col gap-5">
            {/* Top National tri-color strip inside modal */}
            <div class="national-accent absolute top-0 left-0 right-0"></div>

            <div class="flex justify-between items-start mt-2">
              <div class="flex items-center gap-2.5 text-gov-navy dark:text-white">
                <div class="w-10 h-10 rounded-full bg-[#fdf5dd] dark:bg-slate-800 flex items-center justify-center text-gov-navy dark:text-gov-ashokaGold border border-gov-ashokaGold/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-square-text"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 10h8"/><path d="M8 6h8"/></svg>
                </div>
                <div>
                  <h3 class="font-extrabold text-base font-serif tracking-tight">
                    {lang === 'EN' ? 'National Grievance & Feedback Portal' : 'राष्ट्रीय शिकायत एवं प्रतिक्रिया पोर्टल'}
                  </h3>
                  <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {lang === 'EN' ? 'MEA Grievance Redressal Cell' : 'एमईए शिकायत निवारण सेल'}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setShowGrievanceModal(false)}
                class="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            {!grievanceSubmitted ? (
              <form onSubmit={handleGrievanceSubmit} class="flex flex-col gap-4">
                <div class="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/10 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                  💡 {lang === 'EN' 
                    ? 'Submissions are audited by MEA cell officers. Standard response SLA: 48 working hours.' 
                    : 'प्रस्तुतियों का ऑडिट एमईए सेल अधिकारियों द्वारा किया जाता है। मानक प्रतिक्रिया समय: 48 कार्य घंटे।'}
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="flex flex-col gap-1.5">
                    <label class="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">
                      {lang === 'EN' ? 'Your Full Name' : 'आपका पूरा नाम'}
                    </label>
                    <input 
                      type="text"
                      required
                      value={grievanceName}
                      onChange={(e) => setGrievanceName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-gov-blue"
                    />
                  </div>

                  <div class="flex flex-col gap-1.5">
                    <label class="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">
                      {lang === 'EN' ? 'Email Address' : 'ईमेल पता'}
                    </label>
                    <input 
                      type="email"
                      required
                      value={grievanceEmail}
                      onChange={(e) => setGrievanceEmail(e.target.value)}
                      placeholder="e.g. ramesh@gmail.com"
                      class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-gov-blue"
                    />
                  </div>
                </div>

                <div class="flex flex-col gap-1.5">
                  <label class="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">
                    {lang === 'EN' ? 'Grievance / Feedback Category' : 'शिकायत / प्रतिक्रिया श्रेणी'}
                  </label>
                  <select 
                    value={grievanceType}
                    onChange={(e) => setGrievanceType(e.target.value)}
                    class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-gov-blue"
                  >
                    <option value="Complaint">{lang === 'EN' ? 'Complaint (Delay in processing, officer issue)' : 'शिकायत (प्रसंस्करण में देरी, अधिकारी संबंधी समस्या)'}</option>
                    <option value="Feedback">{lang === 'EN' ? 'System Feedback / Review' : 'प्रणाली प्रतिक्रिया / समीक्षा'}</option>
                    <option value="Inquiry">{lang === 'EN' ? 'General Query / Clarification' : 'सामान्य प्रश्न / स्पष्टीकरण'}</option>
                    <option value="Suggestion">{lang === 'EN' ? 'Improvement Suggestion' : 'सुधार का सुझाव'}</option>
                  </select>
                </div>

                <div class="flex flex-col gap-1.5">
                  <label class="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">
                    {lang === 'EN' ? 'Detailed Description' : 'विस्तृत विवरण'}
                  </label>
                  <textarea 
                    required
                    rows="3"
                    value={grievanceDesc}
                    onChange={(e) => setGrievanceDesc(e.target.value)}
                    placeholder={lang === 'EN' ? "Please elaborate your grievance or sharing suggestion here..." : "कृपया अपनी शिकायत या सुझाव को यहाँ विस्तार से लिखें..."}
                    class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-gov-blue resize-none"
                  ></textarea>
                </div>

                <div class="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowGrievanceModal(false)}
                    class="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 text-xs font-extrabold transition-all"
                  >
                    {lang === 'EN' ? 'Cancel' : 'रद्द करें'}
                  </button>
                  <button
                    type="submit"
                    class="flex-1 py-2.5 rounded-xl bg-gov-blue hover:bg-gov-navy text-white text-xs font-extrabold transition-all shadow-md"
                  >
                    {lang === 'EN' ? 'Submit Ticket' : 'टिकट जमा करें'}
                  </button>
                </div>
              </form>
            ) : (
              <div class="flex flex-col items-center justify-center py-6 text-center gap-4 animate-in zoom-in-95 duration-200">
                <div class="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center border-4 border-emerald-50 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle-2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
                </div>
                <div>
                  <h4 class="font-extrabold text-lg text-slate-800 dark:text-white font-serif">
                    {lang === 'EN' ? 'Grievance Registered Successfully!' : 'शिकायत सफलतापूर्वक दर्ज की गई!'}
                  </h4>
                  <p class="text-xs text-slate-400 mt-1 max-w-sm">
                    {lang === 'EN' 
                      ? 'Your grievance ticket has been safely logged in MEA Seva archives. An auto-response copy has been dispatched to your email.'
                      : 'आपकी शिकायत टिकट एमईए सेवा अभिलेखागार में सुरक्षित रूप से दर्ज कर ली गई है।'}
                  </p>
                </div>

                <div class="w-full mt-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex flex-col gap-2 text-left">
                  <div class="flex justify-between items-center text-xs">
                    <span class="text-slate-400 font-semibold">{lang === 'EN' ? 'Ticket Reference:' : 'टिकट संदर्भ:'}</span>
                    <span class="font-mono font-black text-gov-blue dark:text-gov-light">{grievanceRefId}</span>
                  </div>
                  <div class="flex justify-between items-center text-xs border-t border-slate-100 dark:border-slate-700/60 pt-2">
                    <span class="text-slate-400 font-semibold">{lang === 'EN' ? 'Assigned Cell:' : 'सौंपा गया सेल:'}</span>
                    <span class="font-bold text-slate-700 dark:text-slate-200">MEA-GRC-WEST-1</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowGrievanceModal(false)}
                  class="w-full mt-2 py-2.5 rounded-xl bg-gov-blue hover:bg-gov-navy text-white text-xs font-extrabold transition-all"
                >
                  {lang === 'EN' ? 'Close Window' : 'खिड़की बंद करें'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 8. DYNAMIC SERVICES INFORMATION OVERLAY MODAL             */}
      {/* ========================================================= */}
      {showServiceModal && serviceModalData && (
        <div class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div class="bg-white dark:bg-slate-900 border border-gov-ashokaGold/30 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative overflow-hidden text-left flex flex-col gap-5">
            {/* Top National tri-color strip inside modal */}
            <div class="national-accent absolute top-0 left-0 right-0"></div>

            <div class="flex justify-between items-start mt-2">
              <div class="flex items-center gap-2.5 text-gov-navy dark:text-white">
                <div class="w-10 h-10 rounded-full bg-[#fdf5dd] dark:bg-slate-800 flex items-center justify-center text-gov-navy dark:text-gov-ashokaGold border border-gov-ashokaGold/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-alert"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                </div>
                <div>
                  <h3 class="font-extrabold text-base font-serif tracking-tight">
                    {serviceModalData.title}
                  </h3>
                  <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {lang === 'EN' ? 'MEA Service Guidelines & Requirements' : 'एमईए सेवा दिशानिर्देश और आवश्यकताएं'}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setShowServiceModal(false)}
                class="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            <div class="flex flex-col gap-4">
              <div>
                <h4 class="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider mb-1">Service Description:</h4>
                <p class="text-xs text-slate-650 dark:text-slate-350 leading-relaxed font-medium">
                  {serviceModalData.desc}
                </p>
              </div>

              <div>
                <h4 class="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider mb-2">Required Verification Documents:</h4>
                <ul class="flex flex-col gap-2">
                  {serviceModalData.docs.map((doc, i) => (
                    <li key={i} class="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                      <span class="w-1.5 h-1.5 rounded-full bg-gov-orange shrink-0 mt-1.5"></span>
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div class="flex gap-3 mt-4 pt-4 border-t dark:border-slate-800">
              <button
                onClick={() => setShowServiceModal(false)}
                class="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all"
              >
                {lang === 'EN' ? 'Close Window' : 'बंद करें'}
              </button>
              <button
                onClick={() => {
                  setShowServiceModal(false);
                  if (setAuthIsLogin) setAuthIsLogin(false);
                  setView('auth');
                }}
                class="flex-1 py-2.5 rounded-xl bg-gov-blue hover:bg-gov-navy text-white text-xs font-extrabold transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <span>{lang === 'EN' ? 'Apply Now' : 'अब आवेदन करें'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 9. TRACKING OVERLAY MODAL                                 */}
      {/* ========================================================= */}
      {showTrackingModal && (
        <div class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div class="bg-white dark:bg-slate-900 border border-gov-ashokaGold/30 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative overflow-hidden text-left flex flex-col gap-5">
            {/* Top National tri-color strip inside modal */}
            <div class="national-accent absolute top-0 left-0 right-0"></div>

            <div class="flex justify-between items-start mt-2">
              <div class="flex items-center gap-2.5 text-gov-navy dark:text-white">
                <div class="w-10 h-10 rounded-full bg-[#fdf5dd] dark:bg-slate-800 flex items-center justify-center text-gov-navy dark:text-gov-ashokaGold border border-gov-ashokaGold/20">
                  <Search size={18} />
                </div>
                <div>
                  <h3 class="font-extrabold text-base font-serif tracking-tight">
                    {lang === 'EN' ? 'Track Passport Application' : 'पासपोर्ट आवेदन की ट्रैकिंग'}
                  </h3>
                  <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {lang === 'EN' ? 'Official MEA File Status Tracker' : 'आधिकारिक विदेश मंत्रालय फ़ाइल स्थिति ट्रैकर'}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setShowTrackingModal(false)}
                class="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            <div class="flex flex-col gap-4">
              <div class="flex flex-col gap-2">
                <label class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  {lang === 'EN' ? 'Enter Application Tracking ID' : 'आवेदन ट्रैकिंग आईडी दर्ज करें'}
                </label>
                <div class="flex gap-2">
                  <input 
                    type="text" 
                    value={trackInput}
                    onChange={(e) => setTrackInput(e.target.value)}
                    placeholder="e.g. IND-20260523-984321"
                    class="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-gov-blue"
                  />
                  <button 
                    onClick={handleTrack}
                    class="px-5 py-2.5 rounded-xl bg-gov-orange hover:bg-gov-orange/90 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    {lang === 'EN' ? 'Track' : 'जांचें'}
                  </button>
                </div>
              </div>

              {trackError && (
                <p class="text-xs font-bold text-red-500 animate-in fade-in duration-200">{trackError}</p>
              )}

              {/* Real-time Tracking display status block */}
              {trackResult && (
                <div class="p-4 rounded-2xl bg-gov-blue/5 border border-gov-blue/20 dark:bg-slate-850 dark:border-slate-800 flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-200">
                  <div class="flex justify-between items-center border-b pb-2 dark:border-slate-800">
                    <span class="text-xs font-black text-gov-blue dark:text-gov-light">{trackResult.tracking_id}</span>
                    <span class="px-2 py-0.5 rounded bg-gov-orange text-white text-[9px] font-bold uppercase">
                      {trackResult.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div class="text-xs flex flex-col gap-1.5">
                    <p class="font-semibold text-slate-650 dark:text-slate-355">
                      {lang === 'EN' ? 'Applicant: ' : 'आवेदक: '} 
                      <span class="text-slate-800 dark:text-white font-bold">{trackResult.first_name} {trackResult.last_name}</span>
                    </p>
                    <p class="text-[11px] text-slate-400">
                      {lang === 'EN' ? 'Submitted Date: ' : 'प्रस्तुत करने की तिथि: '} {new Date(trackResult.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      setShowTrackingModal(false);
                      if (setAuthIsLogin) setAuthIsLogin(true);
                      setView('auth');
                    }}
                    class="text-xs text-gov-orange hover:underline font-bold self-end mt-1 cursor-pointer"
                  >
                    {lang === 'EN' ? 'Log in for full details' : 'पूर्ण विवरण के लिए लॉगिन करें'} →
                  </button>
                </div>
              )}

              {/* Demo Hint */}
              <div class="text-center pt-2">
                <span class="text-[10px] text-slate-400 bg-slate-50 dark:bg-slate-800 py-1.5 px-3 rounded-lg font-semibold inline-block">
                  Demo hint: Use tracking ID: <strong class="text-gov-orange font-bold font-mono">IND-20260523-984321</strong>
                </span>
              </div>
            </div>

            <div class="mt-2 pt-4 border-t dark:border-slate-800">
              <button
                onClick={() => setShowTrackingModal(false)}
                class="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
              >
                {lang === 'EN' ? 'Close' : 'बंद करें'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
