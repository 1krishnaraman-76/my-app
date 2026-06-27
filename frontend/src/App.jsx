import React, { useState, useContext } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import Auth from './pages/Auth';
import CitizenDashboard from './pages/CitizenDashboard';
import OfficerDashboard from './pages/OfficerDashboard';
import PoliceDashboard from './pages/PoliceDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { ShieldCheck, User, Users, MapPin, Eye, Lock, X, AlertCircle } from 'lucide-react';

function AppContent() {
  const [view, setView] = useState('home'); // home | auth | dashboard
  const [authIsLogin, setAuthIsLogin] = useState(true); // login or register
  const [selectedTrackId, setSelectedTrackId] = useState(''); // Track specific applications in citizen console
  const [initialDashboardTab, setInitialDashboardTab] = useState('overview');
  const [initialAppType, setInitialAppType] = useState('new');
  const { currentRole, setCurrentRole, currentUser, setCurrentUser, users, recordActivity, lang, t, applications } = useContext(AppContext);

  // States for navbar action modals
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [showGrievanceModalGlobal, setShowGrievanceModalGlobal] = useState(false);
  const [showTrackingModalGlobal, setShowTrackingModalGlobal] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
  const [activeDocAdvisory, setActiveDocAdvisory] = useState('ordinary'); // 'ordinary' | 'tatkal' | 'pcc'

  // States for Fee Calculator Modal
  const [feeCategory, setFeeCategory] = useState('ordinary');
  const [feeAge, setFeeAge] = useState('adult');
  const [feePages, setFeePages] = useState('36');

  // States for Global Grievance Modal
  const [grivName, setGrivName] = useState('');
  const [grivEmail, setGrivEmail] = useState('');
  const [grivPhone, setGrivPhone] = useState('');
  const [grivType, setGrivType] = useState('Complaint');
  const [grivDesc, setGrivDesc] = useState('');
  const [grivSubmitted, setGrivSubmitted] = useState(false);
  const [grivRefId, setGrivRefId] = useState('');

  // States for Global Tracking Modal
  const [trackInputGlobal, setTrackInputGlobal] = useState('');
  const [trackResultGlobal, setTrackResultGlobal] = useState(null);
  const [trackErrorGlobal, setTrackErrorGlobal] = useState('');

  const calculateFee = () => {
    let base = 1500;
    if (feeCategory === 'tatkal') base = 3500;
    else if (feeCategory === 'pcc') return 500;
    else if (feeCategory === 'renewal') base = 1500;

    if (feeAge === 'minor') {
      base = base * 0.7; // 30% discount for minors
    }
    if (feePages === '60') {
      base += 500;
    }
    return Math.round(base);
  };

  const handleGlobalGrievanceSubmit = (e) => {
    e.preventDefault();
    const ref = 'GP-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000);
    setGrivRefId(ref);
    setGrivSubmitted(true);
    recordActivity(`Global Grievance submitted: Category: ${grivType}. Reference ID: ${ref}`);
  };

  const resetGlobalGrievance = () => {
    setGrivName('');
    setGrivEmail('');
    setGrivPhone('');
    setGrivType('Complaint');
    setGrivDesc('');
    setGrivSubmitted(false);
    setGrivRefId('');
  };

  const handleGlobalTrack = () => {
    setTrackErrorGlobal('');
    setTrackResultGlobal(null);

    if (!trackInputGlobal.trim()) {
      setTrackErrorGlobal(lang === 'EN' ? 'Please enter a valid Tracking ID.' : 'कृपया वैध ट्रैकिंग आईडी दर्ज करें।');
      return;
    }

    const matched = applications.find(a => a.tracking_id.toLowerCase() === trackInputGlobal.trim().toLowerCase());

    if (matched) {
      setTrackResultGlobal(matched);
      // NOTE: Do NOT set selectedTrackId here — that would show another user's app in the dashboard.
      // selectedTrackId is only set for the currently logged-in user's own applications.
    } else {
      setTrackErrorGlobal(lang === 'EN' ? 'Tracking ID not found in system archives.' : 'सिस्टम अभिलेखागार में ट्रैकिंग आईडी नहीं मिली।');
    }
  };

  const handleServiceSelect = (serviceType) => {
    const mappedType = serviceType === 'ordinary' ? 'new' : serviceType === 'tatkal' ? 'tatkal' : 'reissue';
    setInitialDashboardTab('apply');
    setInitialAppType(mappedType);
    if (!currentUser) {
      setAuthIsLogin(false);
      setView('auth');
    } else if (currentRole === 'citizen') {
      setView('dashboard');
    } else {
      setView('dashboard');
    }
  };

  const handleNavbarAction = (action) => {
    if (action === 'appointment' || action === 'locator') {
      if (view !== 'home') {
        setView('home');
        setTimeout(() => {
          const locator = document.getElementById('locator-widget');
          if (locator) locator.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const locator = document.getElementById('locator-widget');
        if (locator) locator.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (action === 'fee_calculator') {
      setShowFeeModal(true);
    } else if (action === 'feedback') {
      setShowGrievanceModalGlobal(true);
    } else if (action === 'tracking') {
      setShowTrackingModalGlobal(true);
    } else if (action === 'doc_ordinary') {
      setActiveDocAdvisory('ordinary');
      setShowDocModal(true);
    } else if (action === 'doc_tatkal') {
      setActiveDocAdvisory('tatkal');
      setShowDocModal(true);
    } else if (action === 'doc_pcc') {
      setActiveDocAdvisory('pcc');
      setShowDocModal(true);
    }
  };

  // Toggle to true to show the Simulator Switcher Toolbar (Production Security Mode)
  const SHOW_SIMULATOR_TOOLBAR = false;

  // States for Secure Bypass verification popup modal
  const [showBypassModal, setShowBypassModal] = useState(false);
  const [targetBypassRole, setTargetBypassRole] = useState('');
  const [bypassPassword, setBypassPassword] = useState('');
  const [bypassError, setBypassError] = useState('');

  const handleRoleBypass = (roleVal) => {
    setCurrentRole(roleVal);
    // Auto route to dashboard when they bypass
    setView('dashboard');
    recordActivity(`Bypassed workspace permission constraints with verified credentials. Assumed Role: ${roleVal.toUpperCase()}`);

    // Explicitly set developer default profile on sandbox bypass
    if (roleVal === 'citizen') {
      setCurrentUser(users[0]); // Amit
    } else if (roleVal === 'officer') {
      setCurrentUser(users[2]); // Rajesh
    } else if (roleVal === 'police') {
      setCurrentUser(users[3]); // Vijay
    } else if (roleVal === 'admin') {
      setCurrentUser(users[4]); // Shrikant
    }
  };

  const triggerBypassVerification = (roleVal) => {
    setTargetBypassRole(roleVal);
    setBypassPassword('');
    setBypassError('');
    setShowBypassModal(true);
  };

  const handleVerifyBypass = (e) => {
    e.preventDefault();
    setBypassError('');

    // Assign passwords for verification
    let expectedPass = 'citizen123';
    if (targetBypassRole === 'officer') expectedPass = 'officer123';
    else if (targetBypassRole === 'police') expectedPass = 'police123';
    else if (targetBypassRole === 'admin') expectedPass = 'admin123';

    if (bypassPassword === expectedPass) {
      handleRoleBypass(targetBypassRole);
      setShowBypassModal(false);
      setBypassPassword('');
    } else {
      setBypassError(lang === 'EN' ? 'Incorrect authorization password.' : 'गलत प्रमाणीकरण पासवर्ड।');
    }
  };

  return (
    <div class="flex flex-col min-h-screen bg-gov-softBg dark:bg-slate-900 transition-colors">

      {/* ========================================================= */}
      {/* 1. DYNAMIC DEVELOPER WORKSPACE SWITCHER TOOLBAR */}
      {/* ========================================================= */}
      {SHOW_SIMULATOR_TOOLBAR && (
        <div class="w-full bg-slate-900 text-white dark:bg-slate-950 px-4 py-2.5 flex flex-col md:flex-row justify-between items-center border-b border-gov-ashokaGold/30 text-xs font-semibold select-none gap-3 shadow-inner">
          <div class="flex items-center gap-2 text-gov-ashokaGold">
            <ShieldCheck size={15} class="animate-pulse" />
            <span>🇮🇳  MEA Portal Simulator Toolbar (Role Controls):</span>
          </div>
          <div class="flex flex-wrap gap-2">
            {[
              { id: 'citizen', label: t('citizen'), icon: <User size={12} /> },
              { id: 'officer', label: t('officer'), icon: <ShieldCheck size={12} /> },
              { id: 'police', label: t('police'), icon: <MapPin size={12} /> },
              { id: 'admin', label: t('admin'), icon: <Users size={12} /> }
            ].map((role) => (
              <button
                key={role.id}
                onClick={() => triggerBypassVerification(role.id)}
                class={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all font-extrabold tracking-wide ${currentRole === role.id ? 'bg-gov-ashokaGold text-gov-navy shadow-lg font-black' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
              >
                {role.icon}
                <span>{role.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2. DYNAMIC GOVERNMENT STYLE NAVBAR */}
      <Navbar 
        setView={setView} 
        setAuthIsLogin={setAuthIsLogin} 
        handleServiceSelect={handleServiceSelect}
        handleNavbarAction={handleNavbarAction}
      />

      {/* 3. DYNAMIC ROUTING SHELL */}
      <div class="flex-1">
        {view === 'home' && (
          <Home setView={setView} setSelectedTrackId={setSelectedTrackId} setAuthIsLogin={setAuthIsLogin} />
        )}

        {view === 'auth' && (
          <Auth setView={setView} isLogin={authIsLogin} setIsLogin={setAuthIsLogin} setSelectedTrackId={setSelectedTrackId} />
        )}

        {view === 'dashboard' && (
          <>
            {currentRole === 'citizen' && (
              currentUser ? (
                <CitizenDashboard 
                  setView={setView} 
                  selectedTrackId={selectedTrackId} 
                  setSelectedTrackId={setSelectedTrackId} 
                  initialTab={initialDashboardTab}
                  setInitialTab={setInitialDashboardTab}
                  initialAppType={initialAppType}
                  setInitialAppType={setInitialAppType}
                />
              ) : (
                <Auth setView={setView} isLogin={authIsLogin} setIsLogin={setAuthIsLogin} />
              )
            )}
            {currentRole === 'officer' && (
              <OfficerDashboard setView={setView} />
            )}
            {currentRole === 'police' && (
              <PoliceDashboard setView={setView} />
            )}
            {currentRole === 'admin' && (
              <AdminDashboard setView={setView} />
            )}
          </>
        )}
      </div>

      {/* 4. SMART FLOATING AI CHATBOT VIRTUAL ASSISTANT */}
      <Chatbot />

      {/* 5. DYNAMIC GOVERNMENT FOOTER */}
      <Footer />

      {/* ========================================================= */}
      {/* 6. SECURE AUTHORIZATION GATEWAY POPUP MODAL */}
      {/* ========================================================= */}
      {showBypassModal && (
        <div class="fixed inset-0 bg-slate-900/85 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div class="bg-white dark:bg-slate-900 border border-gov-ashokaGold/30 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative overflow-hidden text-left flex flex-col gap-5">
            {/* Top National tri-color strip inside modal */}
            <div class="national-accent absolute top-0 left-0 right-0"></div>

            <div class="flex justify-between items-start mt-2">
              <div class="flex items-center gap-2.5 text-gov-navy dark:text-white">
                <div class="w-10 h-10 rounded-full bg-gov-blue/10 dark:bg-slate-800 flex items-center justify-center text-gov-blue dark:text-gov-light border border-gov-ashokaGold/20">
                  <Lock size={18} />
                </div>
                <div>
                  <h3 class="font-extrabold text-base font-serif tracking-tight">MEA Secure Verification</h3>
                  <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Role Access Authorization Gate</span>
                </div>
              </div>
              <button 
                onClick={() => setShowBypassModal(false)}
                class="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div class="p-4 rounded-xl bg-gov-blue/5 border border-gov-blue/20 dark:bg-slate-800/40 dark:border-slate-700 text-xs">
              <p class="font-medium text-slate-650 dark:text-slate-350">
                You are requesting to bypass standard access controls and assume the official workspace role of:
              </p>
              <div class="mt-2.5 py-1.5 px-3 rounded-lg bg-gov-ashokaGold/10 border border-gov-ashokaGold text-gov-navy dark:text-gov-ashokaGold font-black uppercase tracking-widest text-center">
                {targetBypassRole.toUpperCase()}
              </div>
            </div>

            {bypassError && (
              <div class="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold flex items-center gap-2">
                <AlertCircle size={15} class="shrink-0" />
                <span>{bypassError}</span>
              </div>
            )}

            <form onSubmit={handleVerifyBypass} class="flex flex-col gap-4">
              <div class="flex flex-col gap-1.5">
                <label class="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">
                  Enter Secure Role Password:
                </label>
                <input 
                  type="password"
                  required
                  autoFocus
                  value={bypassPassword}
                  onChange={(e) => setBypassPassword(e.target.value)}
                  placeholder="e.g. officer123, admin123"
                  class="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-gov-blue font-mono"
                />
              </div>

              <div class="flex gap-3 mt-1.5">
                <button
                  type="button"
                  onClick={() => setShowBypassModal(false)}
                  class="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 text-xs font-extrabold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="flex-1 py-2.5 rounded-xl bg-gov-blue hover:bg-gov-navy text-white text-xs font-extrabold transition-all shadow-md animate-pulse"
                >
                  Verify & Assure Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fee Calculator Modal */}
      {showFeeModal && (
        <div class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div class="bg-white dark:bg-slate-900 border border-gov-ashokaGold/30 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative overflow-hidden text-left flex flex-col gap-5">
            <div class="national-accent absolute top-0 left-0 right-0"></div>
            <div class="flex justify-between items-start mt-2">
              <div class="flex items-center gap-2.5 text-gov-navy dark:text-white">
                <div class="w-10 h-10 rounded-full bg-[#fdf5dd] dark:bg-slate-800 flex items-center justify-center text-gov-navy dark:text-gov-ashokaGold border border-gov-ashokaGold/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calculator"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/></svg>
                </div>
                <div>
                  <h3 class="font-extrabold text-base font-serif tracking-tight">{lang === 'EN' ? 'Passport Fee Calculator' : 'पासपोर्ट शुल्क कैलकुलेटर'}</h3>
                  <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{lang === 'EN' ? 'Official MEA Fee Calculation' : 'आधिकारिक एमईए शुल्क शुल्क गणना'}</span>
                </div>
              </div>
              <button onClick={() => setShowFeeModal(false)} class="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors cursor-pointer border-0 bg-transparent">
                <X size={16} />
              </button>
            </div>

            <div class="flex flex-col gap-4 text-xs font-semibold text-slate-650 dark:text-slate-350">
              <div class="flex flex-col gap-1.5">
                <label class="text-[10px] uppercase font-bold text-slate-400">{lang === 'EN' ? 'Service Category' : 'सेवा प्रकार'}</label>
                <select value={feeCategory} onChange={(e) => setFeeCategory(e.target.value)} class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs dark:text-white focus:outline-none">
                  <option value="ordinary">{lang === 'EN' ? 'Fresh Passport (Normal)' : 'नया पासपोर्ट (सामान्य)'}</option>
                  <option value="tatkal">{lang === 'EN' ? 'Tatkal Scheme (Express)' : 'तत्काल योजना (एक्सप्रेस)'}</option>
                  <option value="renewal">{lang === 'EN' ? 'Passport Renewal/Reissue' : 'पासपोर्ट नवीनीकरण'}</option>
                  <option value="pcc">{lang === 'EN' ? 'Police Clearance Certificate (PCC)' : 'पुलिस क्लीयरेंस सर्टिफिकेट (पीसीसी)'}</option>
                </select>
              </div>

              {feeCategory !== 'pcc' && (
                <>
                  <div class="flex flex-col gap-1.5">
                    <label class="text-[10px] uppercase font-bold text-slate-400">{lang === 'EN' ? 'Applicant Age' : 'आवेदक की आयु'}</label>
                    <select value={feeAge} onChange={(e) => setFeeAge(e.target.value)} class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs dark:text-white focus:outline-none">
                      <option value="adult">{lang === 'EN' ? 'Adult (18 years and above)' : 'वयस्क (18 वर्ष और उससे अधिक)'}</option>
                      <option value="minor">{lang === 'EN' ? 'Minor (Below 18 years)' : 'नाबालिग (18 वर्ष से कम)'}</option>
                    </select>
                  </div>

                  <div class="flex flex-col gap-1.5">
                    <label class="text-[10px] uppercase font-bold text-slate-400">{lang === 'EN' ? 'Booklet Pages' : 'बुकलेट पृष्ठ'}</label>
                    <select value={feePages} onChange={(e) => setFeePages(e.target.value)} class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs dark:text-white focus:outline-none">
                      <option value="36">{lang === 'EN' ? '36 Pages (Standard Booklet)' : '36 पृष्ठ (मानक बुकलेट)'}</option>
                      <option value="60">{lang === 'EN' ? '60 Pages (Jumbo Booklet)' : '60 पृष्ठ (जंबो बुकलेट)'}</option>
                    </select>
                  </div>
                </>
              )}

              <div class="mt-4 p-4.5 rounded-2xl bg-gov-blue/5 border border-gov-blue/20 dark:bg-slate-800/40 dark:border-slate-700 flex justify-between items-center">
                <div>
                  <span class="text-[9px] uppercase font-bold text-slate-400">{lang === 'EN' ? 'Total Payable Fee:' : 'कुल देय शुल्क:'}</span>
                  <p class="text-2xl font-black text-gov-navy dark:text-white mt-0.5">₹ {calculateFee().toLocaleString('en-IN')}.00</p>
                </div>
                <div class="text-right text-[10px] text-slate-450 leading-relaxed font-bold">
                  <p>{lang === 'EN' ? '✔ Online Payment Eligible' : '✔ ऑनलाइन भुगतान योग्य'}</p>
                  <p>{lang === 'EN' ? '✔ Includes Tax & Post Charges' : '✔ डाक शुल्क शामिल है'}</p>
                </div>
              </div>
            </div>

            <div class="mt-2 pt-4 border-t dark:border-slate-800 flex gap-3">
              <button onClick={() => setShowFeeModal(false)} class="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 text-xs font-extrabold transition-all cursor-pointer bg-transparent">
                {lang === 'EN' ? 'Close' : 'बंद करें'}
              </button>
              <button onClick={() => { setShowFeeModal(false); handleServiceSelect(feeCategory); }} class="flex-1 py-2.5 rounded-xl bg-gov-blue hover:bg-gov-navy text-white text-xs font-extrabold transition-all shadow-md cursor-pointer">
                {lang === 'EN' ? 'Apply Now' : 'अब आवेदन करें'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Grievance Modal */}
      {showGrievanceModalGlobal && (
        <div class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div class="bg-white dark:bg-slate-900 border border-gov-ashokaGold/30 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative overflow-hidden text-left flex flex-col gap-5">
            <div class="national-accent absolute top-0 left-0 right-0"></div>
            <div class="flex justify-between items-start mt-2">
              <div class="flex items-center gap-2.5 text-gov-navy dark:text-white">
                <div class="w-10 h-10 rounded-full bg-[#fdf5dd] dark:bg-slate-800 flex items-center justify-center text-gov-navy dark:text-gov-ashokaGold border border-gov-ashokaGold/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-alert"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                </div>
                <div>
                  <h3 class="font-extrabold text-base font-serif tracking-tight">{lang === 'EN' ? 'Submit Feedback / Grievance' : 'प्रतिक्रिया / शिकायत दर्ज करें'}</h3>
                  <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{lang === 'EN' ? 'National Grievance Cell Portal' : 'राष्ट्रीय शिकायत निवारण सेल'}</span>
                </div>
              </div>
              <button onClick={() => { setShowGrievanceModalGlobal(false); resetGlobalGrievance(); }} class="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors cursor-pointer border-0 bg-transparent">
                <X size={16} />
              </button>
            </div>

            {grivSubmitted ? (
              <div class="flex flex-col items-center gap-4 text-center py-6 animate-in zoom-in-95 duration-200">
                <div class="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500 flex items-center justify-center text-emerald-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle-2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                </div>
                <div>
                  <h4 class="font-black text-sm text-slate-800 dark:text-white">{lang === 'EN' ? 'Grievance Registered Successfully!' : 'शिकायत दर्ज कर दी गई है!'}</h4>
                  <p class="text-xs text-slate-400 mt-1">{lang === 'EN' ? 'Your feedback reference ticket is issued below. Our administrative unit will audit your query within 48 hours.' : 'आपका शिकायत संदर्भ टिकट संख्या नीचे जारी कर दी गई है।'}</p>
                </div>
                <div class="p-3 bg-slate-50 dark:bg-slate-900 border rounded-xl border-slate-200 dark:border-slate-800 text-xs font-mono font-black text-gov-orange select-all">
                  {grivRefId}
                </div>
                <button onClick={() => { setShowGrievanceModalGlobal(false); resetGlobalGrievance(); }} class="mt-2 w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-750 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer bg-transparent">
                  {lang === 'EN' ? 'Close Window' : 'बंद करें'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleGlobalGrievanceSubmit} class="flex flex-col gap-3.5 text-xs text-left">
                <div class="flex flex-col gap-1">
                  <label class="text-[10px] uppercase font-bold text-slate-400">{lang === 'EN' ? 'Full Name' : 'पूरा नाम'}</label>
                  <input type="text" required value={grivName} onChange={(e) => setGrivName(e.target.value)} placeholder="Amit Sharma" class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-white focus:outline-none" />
                </div>
                <div class="grid grid-cols-2 gap-3.5">
                  <div class="flex flex-col gap-1">
                    <label class="text-[10px] uppercase font-bold text-slate-400">{lang === 'EN' ? 'Email Address' : 'ईमेल पता'}</label>
                    <input type="email" required value={grivEmail} onChange={(e) => setGrivEmail(e.target.value)} placeholder="amit@example.com" class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-white focus:outline-none" />
                  </div>
                  <div class="flex flex-col gap-1">
                    <label class="text-[10px] uppercase font-bold text-slate-400">{lang === 'EN' ? 'Phone Number' : 'फ़ोन नंबर'}</label>
                    <input type="tel" required value={grivPhone} onChange={(e) => setGrivPhone(e.target.value)} placeholder="9876543210" class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-white focus:outline-none" />
                  </div>
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-[10px] uppercase font-bold text-slate-400">{lang === 'EN' ? 'Feedback Category' : 'श्रेणी'}</label>
                  <select value={grivType} onChange={(e) => setGrivType(e.target.value)} class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs dark:text-white focus:outline-none">
                    <option value="Complaint">{lang === 'EN' ? 'Complaint / Issue' : 'शिकायत / मुद्दा'}</option>
                    <option value="Feedback">{lang === 'EN' ? 'General Feedback' : 'सामान्य प्रतिक्रिया'}</option>
                    <option value="Suggestion">{lang === 'EN' ? 'Suggestion' : 'सुझाव'}</option>
                    <option value="Query">{lang === 'EN' ? 'Enquiry' : 'पूछताछ'}</option>
                  </select>
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-[10px] uppercase font-bold text-slate-400">{lang === 'EN' ? 'Grievance Description' : 'शिकायत का विवरण'}</label>
                  <textarea required rows="3" value={grivDesc} onChange={(e) => setGrivDesc(e.target.value)} placeholder={lang === 'EN' ? 'Describe your issue in detail...' : 'अपने मुद्दे का विस्तार से वर्णन करें...'} class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-white focus:outline-none resize-none" />
                </div>
                <div class="flex gap-3 mt-2">
                  <button type="button" onClick={() => { setShowGrievanceModalGlobal(false); resetGlobalGrievance(); }} class="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 text-xs font-bold transition-all cursor-pointer bg-transparent">
                    {lang === 'EN' ? 'Cancel' : 'रद्द करें'}
                  </button>
                  <button type="submit" class="flex-1 py-2.5 rounded-xl bg-gov-orange hover:bg-gov-orange/90 text-white text-xs font-extrabold transition-all shadow-md cursor-pointer">
                    {lang === 'EN' ? 'File Grievance' : 'शिकायत दर्ज करें'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Global Tracking Modal */}
      {showTrackingModalGlobal && (
        <div class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div class="bg-white dark:bg-slate-900 border border-gov-ashokaGold/30 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative overflow-hidden text-left flex flex-col gap-5">
            <div class="national-accent absolute top-0 left-0 right-0"></div>
            <div class="flex justify-between items-start mt-2">
              <div class="flex items-center gap-2.5 text-gov-navy dark:text-white">
                <div class="w-10 h-10 rounded-full bg-[#fdf5dd] dark:bg-slate-800 flex items-center justify-center text-gov-navy dark:text-gov-ashokaGold border border-gov-ashokaGold/20">
                  <Search size={18} />
                </div>
                <div>
                  <h3 class="font-extrabold text-base font-serif tracking-tight">{lang === 'EN' ? 'Track Passport Application' : 'पासपोर्ट आवेदन की ट्रैकिंग'}</h3>
                  <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{lang === 'EN' ? 'Official MEA File Status Tracker' : 'आधिकारिक विदेश मंत्रालय फ़ाइल स्थिति ट्रैकर'}</span>
                </div>
              </div>
              <button onClick={() => { setShowTrackingModalGlobal(false); setTrackInputGlobal(''); setTrackResultGlobal(null); setTrackErrorGlobal(''); }} class="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors cursor-pointer border-0 bg-transparent">
                <X size={16} />
              </button>
            </div>

            <div class="flex flex-col gap-4 text-xs font-semibold">
              <div class="flex flex-col gap-2">
                <label class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  {lang === 'EN' ? 'Enter Application Tracking ID' : 'आवेदन ट्रैकिंग आईडी दर्ज करें'}
                </label>
                <div class="flex gap-2">
                  <input 
                    type="text" 
                    value={trackInputGlobal}
                    onChange={(e) => setTrackInputGlobal(e.target.value)}
                    placeholder="e.g. IND-20260523-984321"
                    class="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-gov-blue"
                  />
                  <button 
                    onClick={handleGlobalTrack}
                    class="px-5 py-2.5 rounded-xl bg-gov-orange hover:bg-gov-orange/90 text-white text-xs font-bold transition-all shadow-md cursor-pointer border-0"
                  >
                    {lang === 'EN' ? 'Track' : 'जांचें'}
                  </button>
                </div>
              </div>

              {trackErrorGlobal && (
                <p class="text-xs font-bold text-red-500 animate-in fade-in duration-200">{trackErrorGlobal}</p>
              )}

              {trackResultGlobal && (
                <div class="p-4 rounded-2xl bg-gov-blue/5 border border-gov-blue/20 dark:bg-slate-850 dark:border-slate-800 flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-200">
                  <div class="flex justify-between items-center border-b pb-2 dark:border-slate-800">
                    <span class="text-xs font-black text-gov-blue dark:text-gov-light">{trackResultGlobal.tracking_id}</span>
                    <span class="px-2 py-0.5 rounded bg-gov-orange text-white text-[9px] font-bold uppercase">
                      {trackResultGlobal.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div class="text-xs flex flex-col gap-1.5 text-slate-750 dark:text-slate-300">
                    <p class="font-semibold">
                      {lang === 'EN' ? 'Applicant: ' : 'आवेदक: '} 
                      <span class="text-slate-800 dark:text-white font-bold">{trackResultGlobal.first_name} {trackResultGlobal.last_name}</span>
                    </p>
                    <p class="text-[11px] text-slate-400">
                      {lang === 'EN' ? 'Submitted Date: ' : 'प्रस्तुत करने की तिथि: '} {new Date(trackResultGlobal.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      setShowTrackingModalGlobal(false);
                      setAuthIsLogin(true);
                      setView('auth');
                    }}
                    class="text-xs text-gov-orange hover:underline font-bold self-end mt-1 cursor-pointer bg-transparent border-0"
                  >
                    {lang === 'EN' ? 'Log in for full details' : 'पूर्ण विवरण के लिए लॉगिन करें'} →
                  </button>
                </div>
              )}

              <div class="text-center pt-2">
                <span class="text-[10px] text-slate-450 bg-slate-50 dark:bg-slate-800 py-1.5 px-3 rounded-lg font-bold inline-block">
                  Demo hint: Use tracking ID: <strong class="text-gov-orange font-mono">IND-20260523-984321</strong>
                </span>
              </div>
            </div>

            <div class="mt-2 pt-4 border-t dark:border-slate-800">
              <button onClick={() => { setShowTrackingModalGlobal(false); setTrackInputGlobal(''); setTrackResultGlobal(null); setTrackErrorGlobal(''); }} class="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 text-xs font-bold transition-all cursor-pointer bg-transparent">
                {lang === 'EN' ? 'Close' : 'बंद करें'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Advisory Modal */}
      {showDocModal && (
        <div class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div class="bg-white dark:bg-slate-900 border border-gov-ashokaGold/30 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative overflow-hidden text-left flex flex-col gap-5">
            <div class="national-accent absolute top-0 left-0 right-0"></div>
            <div class="flex justify-between items-start mt-2">
              <div class="flex items-center gap-2.5 text-gov-navy dark:text-white">
                <div class="w-10 h-10 rounded-full bg-[#fdf5dd] dark:bg-slate-800 flex items-center justify-center text-gov-navy dark:text-gov-ashokaGold border border-gov-ashokaGold/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
                </div>
                <div>
                  <h3 class="font-extrabold text-base font-serif tracking-tight">
                    {activeDocAdvisory === 'ordinary' ? (lang === 'EN' ? 'Ordinary Passport Documents' : 'सामान्य पासपोर्ट दस्तावेज') :
                     activeDocAdvisory === 'tatkal' ? (lang === 'EN' ? 'Tatkaal Passport Documents' : 'तत्काल पासपोर्ट दस्तावेज') :
                     (lang === 'EN' ? 'Police Clearance Documents' : 'पुलिस सत्यापन दस्तावेज')}
                  </h3>
                  <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{lang === 'EN' ? 'Required Verification Checklist' : 'आवश्यक सत्यापन चेकलिस्ट'}</span>
                </div>
              </div>
              <button onClick={() => setShowDocModal(false)} class="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors cursor-pointer border-0 bg-transparent">
                <X size={16} />
              </button>
            </div>

            <div class="flex flex-col gap-4 text-xs font-semibold text-slate-655 dark:text-slate-350">
              <p class="leading-relaxed">
                {activeDocAdvisory === 'ordinary' 
                  ? (lang === 'EN' ? 'For Fresh or Re-issue Ordinary Passports, you must physically present original copies of the following documents during your verification appointment:' : 'सामान्य पासपोर्ट के लिए आपको निम्नलिखित मूल दस्तावेज प्रस्तुत करने होंगे:')
                  : activeDocAdvisory === 'tatkal'
                  ? (lang === 'EN' ? 'For Tatkaal (Urgent) applications, the applicant must present at least 3 documents from the official list of 12 identification cards, including:' : 'तत्काल पासपोर्ट के लिए आवेदक को कम से कम 3 दस्तावेज प्रस्तुत करने होंगे, जिनमें शामिल हैं:')
                  : (lang === 'EN' ? 'For Police Clearance Certificate (PCC) verification, please bring the following documents:' : 'पुलिस क्लीयरेंस सर्टिफिकेट (पीसीसी) के लिए निम्नलिखित दस्तावेज लाएं:')}
              </p>

              <ul class="flex flex-col gap-2.5 pl-1.5 text-slate-700 dark:text-slate-300">
                {activeDocAdvisory === 'ordinary' && (
                  <>
                    <li class="flex gap-2 items-start"><span class="w-1.5 h-1.5 rounded-full bg-gov-orange mt-1.5 shrink-0"></span><span><strong>Address Proof</strong>: Aadhaar Card, Water Bill, Electricity Bill, or active Rent Agreement.</span></li>
                    <li class="flex gap-2 items-start"><span class="w-1.5 h-1.5 rounded-full bg-gov-orange mt-1.5 shrink-0"></span><span><strong>Date of Birth Proof</strong>: Birth Certificate, Matriculation Certificate, or School Leaving Certificate.</span></li>
                    <li class="flex gap-2 items-start"><span class="w-1.5 h-1.5 rounded-full bg-gov-orange mt-1.5 shrink-0"></span><span><strong>Identity Card</strong>: Aadhaar UID, Voter ID, or PAN Card.</span></li>
                  </>
                )}
                {activeDocAdvisory === 'tatkal' && (
                  <>
                    <li class="flex gap-2 items-start"><span class="w-1.5 h-1.5 rounded-full bg-gov-orange mt-1.5 shrink-0"></span><span><strong>Aadhaar Card</strong> (UIDAI digital copy or physical card).</span></li>
                    <li class="flex gap-2 items-start"><span class="w-1.5 h-1.5 rounded-full bg-gov-orange mt-1.5 shrink-0"></span><span><strong>PAN Card</strong> issued by the Income Tax Department.</span></li>
                    <li class="flex gap-2 items-start"><span class="w-1.5 h-1.5 rounded-full bg-gov-orange mt-1.5 shrink-0"></span><span><strong>Voter ID / Electors Photo Identity Card (EPIC)</strong>.</span></li>
                    <li class="flex gap-2 items-start"><span class="w-1.5 h-1.5 rounded-full bg-gov-orange mt-1.5 shrink-0"></span><span><strong>Urgency Declaration</strong> signed by the applicant.</span></li>
                  </>
                )}
                {activeDocAdvisory === 'pcc' && (
                  <>
                    <li class="flex gap-2 items-start"><span class="w-1.5 h-1.5 rounded-full bg-gov-orange mt-1.5 shrink-0"></span><span><strong>Active Indian Passport Book</strong> (Original booklet and self-attested copy of first/last pages).</span></li>
                    <li class="flex gap-2 items-start"><span class="w-1.5 h-1.5 rounded-full bg-gov-orange mt-1.5 shrink-0"></span><span><strong>Present Address Proof</strong> (supporting residence verification).</span></li>
                    <li class="flex gap-2 items-start"><span class="w-1.5 h-1.5 rounded-full bg-gov-orange mt-1.5 shrink-0"></span><span><strong>Purpose Document</strong>: Visa copy, employment offer, or immigration clearance sheet.</span></li>
                  </>
                )}
              </ul>
            </div>

            <div class="mt-2 pt-4 border-t dark:border-slate-800 flex gap-3">
              <button onClick={() => setShowDocModal(false)} class="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-355 text-xs font-bold transition-all cursor-pointer bg-transparent">
                {lang === 'EN' ? 'Close' : 'बंद करें'}
              </button>
              <button onClick={() => { setShowDocModal(false); handleServiceSelect(activeDocAdvisory); }} class="flex-1 py-2.5 rounded-xl bg-gov-blue hover:bg-gov-navy text-white text-xs font-extrabold transition-all shadow-md cursor-pointer">
                {lang === 'EN' ? 'Apply Now' : 'अब आवेदन करें'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
