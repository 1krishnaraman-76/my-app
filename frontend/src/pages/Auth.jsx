import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { ShieldCheck, Mail, Lock, Phone, User, Fingerprint, RefreshCw, Key, AlertCircle, Eye, EyeOff, Shield, UserCheck, Star } from 'lucide-react';

export default function Auth({ setView, isLogin, setIsLogin, setSelectedTrackId }) {
  const { lang, users, setUsers, setCurrentRole, setCurrentUser, recordActivity, addNotification } = useContext(AppContext);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [otp, setOtp] = useState('');
  const [role, setRole] = useState('citizen');

  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isRealEmailSent, setIsRealEmailSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Role definitions with colors and icons
  const roleOptions = [
    {
      value: 'citizen',
      label: lang === 'EN' ? 'Citizen' : 'नागरिक',
      desc: lang === 'EN' ? 'Apply for passport' : 'पासपोर्ट आवेदन करें',
      icon: '🧑',
      color: 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300',
      activeColor: 'border-blue-600 bg-blue-100 dark:bg-blue-900/40 ring-2 ring-blue-400'
    },
    {
      value: 'officer',
      label: lang === 'EN' ? 'Passport Officer' : 'पासपोर्ट अधिकारी',
      desc: lang === 'EN' ? 'Review applications' : 'आवेदन समीक्षा करें',
      icon: '📋',
      color: 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300',
      activeColor: 'border-indigo-600 bg-indigo-100 dark:bg-indigo-900/40 ring-2 ring-indigo-400'
    },
    {
      value: 'police',
      label: lang === 'EN' ? 'Police Officer' : 'पुलिस अधिकारी',
      desc: lang === 'EN' ? 'Field verification' : 'क्षेत्र सत्यापन',
      icon: '🛡️',
      color: 'border-orange-400 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300',
      activeColor: 'border-orange-600 bg-orange-100 dark:bg-orange-900/40 ring-2 ring-orange-400'
    },
    {
      value: 'admin',
      label: lang === 'EN' ? 'Admin' : 'व्यवस्थापक',
      desc: lang === 'EN' ? 'Grant passports' : 'पासपोर्ट स्वीकृत करें',
      icon: '⭐',
      color: 'border-purple-400 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300',
      activeColor: 'border-purple-600 bg-purple-100 dark:bg-purple-900/40 ring-2 ring-purple-400'
    }
  ];

  const validateEmail = (emailVal, roleVal) => {
    if (roleVal === 'citizen') {
      return emailVal.toLowerCase().endsWith('@gmail.com');
    }
    // Officers, police, admin can use any valid email
    return emailVal.includes('@') && emailVal.includes('.');
  };

  const getEmailPlaceholder = () => {
    if (role === 'citizen') return 'yourname@gmail.com';
    if (role === 'officer') return 'officer@gov.in or officer@gmail.com';
    if (role === 'police') return 'inspector@police.gov.in or police@gmail.com';
    return 'admin@mea.gov.in or admin@gmail.com';
  };

  const handleSendOtp = () => {
    setAuthError('');
    if (!fullName || !email || !password || !phone || !aadhaar) {
      setAuthError(lang === 'EN' ? 'Please complete all registration fields.' : 'कृपया सभी पंजीकरण फ़ील्ड पूरे करें।');
      return;
    }

    if (!validateEmail(email, role)) {
      if (role === 'citizen') {
        setAuthError(lang === 'EN' ? 'Citizens must use a @gmail.com email address.' : 'नागरिकों को @gmail.com ईमेल पता उपयोग करना होगा।');
      } else {
        setAuthError(lang === 'EN' ? 'Please enter a valid email address.' : 'कृपया एक वैध ईमेल पता दर्ज करें।');
      }
      return;
    }

    if (password.length < 6 || password.length > 12) {
      setAuthError(lang === 'EN' ? 'Password must be 6 to 12 characters long.' : 'पासवर्ड 6 से 12 अक्षरों का होना चाहिए।');
      return;
    }

    if (phone.length !== 10 || isNaN(phone)) {
      setAuthError(lang === 'EN' ? 'Mobile number must be exactly 10 digits.' : 'मोबाइल नंबर ठीक 10 अंकों का होना चाहिए।');
      return;
    }

    if (aadhaar.length !== 12 || isNaN(aadhaar)) {
      setAuthError(lang === 'EN' ? 'Aadhaar must be exactly 12 digits.' : 'आधार ठीक 12 अंकों का होना चाहिए।');
      return;
    }

    // Check for duplicate email
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      setAuthError(lang === 'EN' ? 'This email is already registered. Please log in instead.' : 'यह ईमेल पहले से पंजीकृत है। कृपया लॉगिन करें।');
      return;
    }

    setIsLoading(true);

    fetch('http://localhost:5000/api/auth/aadhaar-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ aadhaar_number: aadhaar, phone_number: phone, email: email })
    })
    .then(res => {
      if (!res.ok) throw new Error('offline');
      return res.json();
    })
    .then(data => {
      setIsLoading(false);
      if (data.success) {
        setGeneratedOtp(data.demoOtp || '');
        setOtpSent(true);
        if (data.isRealEmail) {
          setIsRealEmailSent(true);
          alert(`🇮🇳 OTP sent to ${email}. Check your inbox!`);
        } else {
          setIsRealEmailSent(false);
          alert(`Simulated OTP generated. The code is shown in the green box below.`);
        }
      } else {
        setAuthError(data.error || 'Failed to send OTP.');
      }
    })
    .catch(() => {
      // Offline fallback
      setTimeout(() => {
        setIsLoading(false);
        const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(mockCode);
        setOtpSent(true);
        setIsRealEmailSent(false);
      }, 500);
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setAuthError('');

    if (!fullName || !email || !password || !phone || !aadhaar) {
      setAuthError(lang === 'EN' ? 'Please complete all fields.' : 'कृपया सभी फ़ील्ड पूरे करें।');
      return;
    }

    if (!validateEmail(email, role)) {
      if (role === 'citizen') {
        setAuthError(lang === 'EN' ? 'Citizens must use a @gmail.com email.' : 'नागरिकों को @gmail.com ईमेल उपयोग करना होगा।');
      } else {
        setAuthError(lang === 'EN' ? 'Please enter a valid email address.' : 'कृपया एक वैध ईमेल दर्ज करें।');
      }
      return;
    }

    if (password.length < 6 || password.length > 12) {
      setAuthError(lang === 'EN' ? 'Password must be 6-12 characters.' : 'पासवर्ड 6-12 अक्षरों का होना चाहिए।');
      return;
    }

    if (otp !== generatedOtp) {
      setAuthError(lang === 'EN' ? 'Incorrect OTP. Please check and try again.' : 'गलत ओटीपी। कृपया दोबारा जांचें।');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);

      const newUser = {
        id: Date.now(),
        full_name: fullName,
        email: email,
        password: password,
        role: role,
        phone_number: phone,
        aadhaar_number: aadhaar
      };

      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      if (setSelectedTrackId) setSelectedTrackId('');
      setCurrentRole(role);
      recordActivity(`${role.toUpperCase()} registered: ${fullName} (${email})`);
      addNotification(newUser.id, 'Welcome to SmartPassport!', `Hello ${fullName}! Your account is created as ${role.toUpperCase()}. ${role === 'citizen' ? 'You can now apply for a passport.' : 'You can now access your dashboard.'}`);
      setView('dashboard');
    }, 600);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError('');

    if (!email || !password) {
      setAuthError(lang === 'EN' ? 'Please enter your email and password.' : 'कृपया ईमेल और पासवर्ड दर्ज करें।');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);

      const userMatch = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (userMatch && userMatch.password === password) {
        setCurrentUser(userMatch);
        setCurrentRole(userMatch.role);
        if (setSelectedTrackId) setSelectedTrackId('');
        recordActivity(`User logged in: ${userMatch.full_name} (${userMatch.role})`);
        setView('dashboard');
      } else {
        setAuthError(lang === 'EN' ? 'Authentication failed: Incorrect email or password.' : 'प्रमाणीकरण विफल: गलत ईमेल या पासवर्ड।');
      }
    }, 500);
  };

  const selectedRoleOption = roleOptions.find(r => r.value === role);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 flex flex-col items-center justify-center min-h-[80vh]">

      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col gap-5 relative overflow-hidden">

        {/* Top tricolor accent bar */}
        <div className="national-accent absolute top-0 left-0 right-0"></div>

        {/* Back Button */}
        <button
          onClick={() => setView('home')}
          className="absolute top-4 left-5 flex items-center gap-1.5 text-xs text-slate-400 hover:text-gov-blue dark:hover:text-gov-light transition-colors font-bold group bg-transparent border-0 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:-translate-x-0.5 transition-transform"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          <span>{lang === 'EN' ? 'Back' : 'पीछे'}</span>
        </button>

        {/* Header */}
        <div className="text-center flex flex-col items-center mt-4 gap-2">
          <div className="w-12 h-12 rounded-full bg-gov-navy flex items-center justify-center border-2 border-gov-ashokaGold text-gov-ashokaGold font-bold text-lg mb-1 shadow-inner">
            <span>印</span>
          </div>
          <h2 className="text-2xl font-extrabold text-gov-navy dark:text-white font-serif">
            {isLogin
              ? (lang === 'EN' ? 'Sign In to Portal' : 'पोर्टल में साइन इन करें')
              : (lang === 'EN' ? `${selectedRoleOption?.label} Registration` : `${selectedRoleOption?.label} पंजीकरण`)}
          </h2>
          <p className="text-xs text-slate-400 font-semibold">
            {isLogin
              ? (lang === 'EN' ? 'Enter your registered email and password.' : 'अपना पंजीकृत ईमेल और पासवर्ड दर्ज करें।')
              : (lang === 'EN' ? 'Create your account with Aadhaar OTP verification.' : 'आधार ओटीपी सत्यापन के साथ खाता बनाएं।')}
          </p>
        </div>

        {/* Error */}
        {authError && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold flex items-center gap-2 text-left">
            <AlertCircle size={16} className="shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        {/* ─── LOGIN FORM ──────────────────────────────────── */}
        {isLogin ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-4 text-left">

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <Mail size={11} />
                <span>{lang === 'EN' ? 'Email Address' : 'ईमेल पता'}</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@gmail.com"
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-gov-blue"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <Lock size={11} />
                <span>{lang === 'EN' ? 'Password' : 'पासवर्ड'}</span>
              </label>
              <div className="relative flex items-center w-full">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-gov-blue"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 text-slate-400 hover:text-gov-blue transition-colors bg-transparent border-0 cursor-pointer p-0 focus:outline-none"
                >
                  {showLoginPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {isLoading && <RefreshCw size={14} className="animate-spin" />}
              <span>{lang === 'EN' ? 'Secure Log In' : 'सुरक्षित लॉगिन'}</span>
            </button>

          </form>

        ) : (
          /* ─── REGISTRATION FORM ──────────────────────────── */
          <form onSubmit={handleRegister} className="flex flex-col gap-4 text-left">

            {/* STEP 1: Role Selection Cards */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <ShieldCheck size={11} />
                <span>{lang === 'EN' ? 'Step 1: Select Your Role' : 'चरण 1: अपनी भूमिका चुनें'}</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {roleOptions.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => { setRole(opt.value); setOtpSent(false); setGeneratedOtp(''); setOtp(''); setAuthError(''); }}
                    className={`p-3 rounded-xl border-2 text-left flex items-center gap-2.5 cursor-pointer transition-all ${
                      role === opt.value ? opt.activeColor : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xl">{opt.icon}</span>
                    <div>
                      <p className={`text-xs font-extrabold leading-tight ${role === opt.value ? '' : 'text-slate-700 dark:text-slate-200'}`}>{opt.label}</p>
                      <p className={`text-[9px] font-medium leading-tight ${role === opt.value ? 'opacity-80' : 'text-slate-400'}`}>{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              {/* Role explanation banner */}
              <div className={`p-2.5 rounded-xl border text-[10px] font-semibold ${selectedRoleOption?.color}`}>
                {role === 'citizen' && (lang === 'EN' ? '🧑 As a Citizen, you can apply for a passport. Your application goes to the Officer → Police → Admin for approval.' : 'नागरिक के रूप में, आप पासपोर्ट के लिए आवेदन कर सकते हैं।')}
                {role === 'officer' && (lang === 'EN' ? '📋 As a Passport Officer, you review submitted citizen applications and forward them to Police for field verification.' : 'पासपोर्ट अधिकारी के रूप में, आप आवेदनों की समीक्षा करते हैं।')}
                {role === 'police' && (lang === 'EN' ? '🛡️ As a Police Officer, you perform physical address & background verification for applications forwarded by the Passport Officer.' : 'पुलिस अधिकारी के रूप में, आप क्षेत्र सत्यापन करते हैं।')}
                {role === 'admin' && (lang === 'EN' ? '⭐ As Admin, you grant final passport approval after police clearance and dispatch the booklet to citizens.' : 'व्यवस्थापक के रूप में, आप अंतिम पासपोर्ट स्वीकृति देते हैं।')}
              </div>
            </div>

            {/* STEP 2: Personal Info */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <User size={11} />
                <span>{lang === 'EN' ? 'Step 2: Your Details' : 'चरण 2: आपका विवरण'}</span>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold text-slate-400">{lang === 'EN' ? 'Full Name' : 'पूरा नाम'}</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={lang === 'EN' ? 'e.g. Ravi Kumar' : 'जैसे रवि कुमार'}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-gov-blue"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold text-slate-400">{lang === 'EN' ? 'Mobile Number' : 'मोबाइल नंबर'}</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="9876543210"
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-gov-blue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold text-slate-400">
                    {lang === 'EN' ? 'Email Address' : 'ईमेल पता'}
                    {role === 'citizen' && <span className="text-red-400 ml-1">(@gmail.com only)</span>}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={getEmailPlaceholder()}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-gov-blue"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold text-slate-400">{lang === 'EN' ? 'Password (6–12 chars)' : 'पासवर्ड (6–12 अक्षर)'}</label>
                  <div className="relative flex items-center w-full">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      maxLength={12}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full p-2.5 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-gov-blue"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-slate-400 hover:text-gov-blue transition-colors bg-transparent border-0 cursor-pointer p-0 focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 3: Aadhaar OTP Verification */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <Fingerprint size={11} />
                <span>{lang === 'EN' ? 'Step 3: Aadhaar Verification' : 'चरण 3: आधार सत्यापन'}</span>
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  maxLength={12}
                  disabled={otpSent}
                  value={aadhaar}
                  onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ''))}
                  placeholder={lang === 'EN' ? 'Aadhaar Number (12 digits)' : 'आधार नंबर (12 अंक)'}
                  className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-gov-blue disabled:opacity-60"
                />
                {!otpSent && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isLoading}
                    className="px-4 bg-gov-orange hover:bg-gov-orange/90 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 disabled:opacity-60"
                  >
                    {isLoading && <RefreshCw size={12} className="animate-spin" />}
                    {lang === 'EN' ? 'Send OTP' : 'ओटीपी भेजें'}
                  </button>
                )}
              </div>

              {/* OTP Result Box */}
              {otpSent && (
                <div className={`p-3.5 rounded-xl text-left flex flex-col gap-3 animate-in fade-in duration-200 ${
                  isRealEmailSent
                    ? 'bg-blue-500/10 border border-blue-500/20'
                    : 'bg-emerald-500/10 border border-emerald-500/20'
                }`}>
                  <div className="flex justify-between items-center text-[10px] uppercase font-extrabold tracking-wider">
                    <span className={isRealEmailSent ? 'text-blue-600 dark:text-blue-400' : 'text-emerald-600 dark:text-emerald-400'}>
                      {isRealEmailSent ? '📬 OTP sent to your email' : '🔊 Simulated OTP (use this code):'}
                    </span>
                    {!isRealEmailSent && generatedOtp && (
                      <span className="px-3 py-1 rounded-lg bg-emerald-500 text-white font-black tracking-widest text-sm">{generatedOtp}</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                      <Key size={11} />
                      <span>{lang === 'EN' ? 'Enter OTP Code' : 'ओटीपी कोड दर्ज करें'}</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="e.g. 583920"
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-gov-blue"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    {isLoading && <RefreshCw size={14} className="animate-spin" />}
                    <ShieldCheck size={14} />
                    <span>{lang === 'EN' ? `Create ${selectedRoleOption?.label} Account` : `${selectedRoleOption?.label} खाता बनाएं`}</span>
                  </button>
                </div>
              )}
            </div>

          </form>
        )}

        {/* Toggle Login / Register */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-4 text-center">
          <button
            onClick={() => { setAuthError(''); setIsLogin(!isLogin); setOtpSent(false); setGeneratedOtp(''); setOtp(''); }}
            className="text-xs text-gov-blue dark:text-gov-light hover:underline font-extrabold"
          >
            {isLogin
              ? (lang === 'EN' ? 'New user? Register here →' : 'नए उपयोगकर्ता? यहां पंजीकरण करें →')
              : (lang === 'EN' ? 'Already registered? Log In →' : 'पहले से पंजीकृत? लॉगिन करें →')}
          </button>
        </div>

      </div>
    </div>
  );
}
