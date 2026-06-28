import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Bell, Moon, Sun, Globe, Search, ChevronDown, LogOut, ChevronRight } from 'lucide-react';

export default function Navbar({ setView, setAuthIsLogin, handleServiceSelect, handleNavbarAction }) {
  const { lang, setLang, darkMode, setDarkMode, currentRole, setCurrentRole, currentUser, setCurrentUser, notifications, t } = useContext(AppContext);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.is_read);

  return (
    <header class="w-full flex flex-col z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors shadow-sm">
      
      {/* 1. Official National Tri-Color Top Accent strip */}
      <div class="national-accent w-full"></div>

      {/* 2. Top Header Sizing Bar (Cream-Yellow/Beige background as in Screenshot 1) */}
      <div class="w-full bg-[#f6eedc] dark:bg-slate-950 px-4 md:px-8 py-1.5 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-700 dark:text-slate-350 font-semibold gap-2 border-b border-amber-100 dark:border-slate-900 select-none">
        <div class="flex items-center gap-1.5">
          <span>🕒 {lang === 'EN' ? 'Tuesday, June 02, 2026 | 10:39:06 PM' : 'मंगलवार, जून 02, 2026 | 10:39:06 अपराह्न'}</span>
        </div>
        
        <div class="flex flex-wrap items-center justify-center gap-3 sm:gap-4 font-bold">
          <a href="#" class="hover:underline">{lang === 'EN' ? 'Skip to Main Content' : 'मुख्य सामग्री पर जाएं'}</a>
          <span class="text-slate-300">|</span>
          <a href="#" class="hover:underline">{lang === 'EN' ? 'Screen Reader Access' : 'स्क्रीन रीडर एक्सेस'}</a>
          <span class="text-slate-300">|</span>
          <a href="#" class="hover:underline">{lang === 'EN' ? 'Sitemap' : 'साइटमैप'}</a>
          <span class="text-slate-300">|</span>
          
          {/* Sizing helpers */}
          <div class="flex items-center gap-1.5">
            <button class="px-1.5 py-0.5 rounded bg-white hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 border border-slate-250/50 dark:border-slate-700 text-[10px]">A-</button>
            <button class="px-1.5 py-0.5 rounded bg-white hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 border border-slate-250/50 dark:border-slate-700 text-[10px]">A</button>
            <button class="px-1.5 py-0.5 rounded bg-white hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 border border-slate-250/50 dark:border-slate-700 text-[10px]">A+</button>
          </div>
          <span class="text-slate-300">|</span>

          {/* Hindi toggle */}
          <button 
            onClick={() => setLang(lang === 'EN' ? 'HN' : 'EN')}
            class="hover:text-gov-blue hover:underline transition-colors text-[11px] font-bold"
          >
            {lang === 'EN' ? 'हिन्दी' : 'English'}
          </button>
          <span class="text-slate-300">|</span>

          {/* Call Center Info */}
          <div class="flex items-center gap-1 text-gov-navy dark:text-gov-light">
            <span>📞 {lang === 'EN' ? 'National Call Center:' : 'राष्ट्रीय कॉल सेंटर:'}</span>
            <strong class="text-gov-orange">1800-258-1800</strong>
          </div>
        </div>
      </div>

      {/* 3. Main Navigation Bar (Clean White Theme as in Screenshot 1) */}
      <div class="w-full px-4 md:px-8 py-3.5 flex flex-col lg:flex-row justify-between items-center gap-4 bg-white dark:bg-slate-900">
        
        {/* Emblem & Portal Brand */}
        <div class="flex items-center gap-3 cursor-pointer select-none" onClick={() => setView('home')}>
          {/* Gold Emblem SVG */}
          <svg class="h-12 w-auto text-gov-navy dark:text-gov-ashokaGold" viewBox="0 0 100 130" fill="none">
            <path d="M50,15 C42,15 38,20 38,28 C38,36 42,42 42,48 C37,48 34,51 34,55 C34,60 38,62 40,63 C35,65 33,68 33,72 C33,78 37,82 43,84 C38,87 35,90 35,95 C35,102 43,105 50,105 C57,105 65,102 65,95 C65,90 62,87 57,84 C63,82 67,78 67,72 C67,68 65,65 60,63 C62,62 66,60 66,55 C66,51 63,48 58,48 C58,42 62,36 62,28 C62,20 58,15 50,15 Z" fill="#d4af37"/>
            <circle cx="50" cy="30" r="4" fill="#a47c1e"/>
            <circle cx="43" cy="55" r="2" fill="#a47c1e"/>
            <circle cx="57" cy="55" r="2" fill="#a47c1e"/>
            <rect x="35" y="105" width="30" height="8" rx="2" fill="#a47c1e"/>
            <circle cx="50" cy="109" r="3" fill="#ffffff" stroke="#a47c1e" stroke-width="1"/>
            <text x="50" y="125" text-anchor="middle" font-size="7" font-weight="bold" fill="#a47c1e">सत्यमेव जयते</text>
          </svg>
          <div class="text-left">
            <h1 class="font-extrabold text-[#112d53] dark:text-white text-2xl tracking-tight leading-none font-serif flex items-center gap-1.5">
              <span>GlobalPassport AI India</span>
            </h1>
            <p class="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 font-bold uppercase tracking-wider">
              {lang === 'EN' ? 'Ministry of External Affairs, Government of India' : 'विदेश मंत्रालय, भारत सरकार'}
            </p>
          </div>
        </div>

        {/* Center & Right Navigation controls */}
        <div class="flex flex-wrap items-center justify-center lg:justify-end gap-5 lg:gap-6 w-full lg:w-auto">
          
          {/* Navigation Links */}
          <nav class="flex flex-wrap items-center justify-center gap-4 text-xs font-black text-[#112d53] dark:text-slate-200">
            <button onClick={() => setView('home')} class="hover:text-gov-blue dark:hover:text-gov-light transition-colors pb-1 border-b-2 border-gov-blue">{t('home')}</button>
            
            {/* About Us Menu */}
            <div class="relative group">
              <button class="hover:text-gov-blue dark:hover:text-gov-light transition-colors flex items-center gap-0.5 pb-1">
                <span>{lang === 'EN' ? 'About Us' : 'हमारे बारे में'}</span>
                <ChevronDown size={12} />
              </button>
              <div class="absolute hidden group-hover:block left-0 mt-0 w-44 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl p-2 z-50 animate-in fade-in duration-100">
                <a href="#" class="block px-3 py-2 rounded-lg text-left hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold">{lang === 'EN' ? 'Overview MEA' : 'विदेश मंत्रालय का अवलोकन'}</a>
                <a href="#" class="block px-3 py-2 rounded-lg text-left hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold">{lang === 'EN' ? 'System Mission' : 'प्रणाली का उद्देश्य'}</a>
              </div>
            </div>

            {/* Passport Offices Menu */}
            <div class="relative group">
              <button class="hover:text-gov-blue dark:hover:text-gov-light transition-colors flex items-center gap-0.5 pb-1">
                <span>{lang === 'EN' ? 'Passport Offices' : 'पासपोर्ट कार्यालय'}</span>
                <ChevronDown size={12} />
              </button>
              <div class="absolute hidden group-hover:block left-0 mt-0 w-44 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl p-2 z-50 animate-in fade-in duration-100">
                <a href="#" class="block px-3 py-2 rounded-lg text-left hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold">{lang === 'EN' ? 'Locate PSK / PO' : 'पीएसके / पीओ खोजें'}</a>
                <a href="#" class="block px-3 py-2 rounded-lg text-left hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold">{lang === 'EN' ? 'Schedules & Slots' : 'समय सारणी और स्लॉट'}</a>
              </div>
            </div>

            {/* Services Menu */}
            <div class="relative group">
              <button class="hover:text-gov-blue dark:hover:text-gov-light transition-colors flex items-center gap-0.5 pb-1">
                <span>{lang === 'EN' ? 'Services' : 'सेवाएं'}</span>
                <ChevronDown size={12} />
              </button>
              <div class="absolute hidden group-hover:block left-0 mt-0 w-64 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl p-2.5 z-50 animate-in fade-in duration-100 flex flex-col gap-1 select-none">
                
                {/* 1. Check Appointment Availability */}
                <button 
                  onClick={() => handleNavbarAction && handleNavbarAction('appointment')}
                  class="w-full block px-3.5 py-2.5 rounded-lg text-left hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold bg-transparent border-0 cursor-pointer text-xs transition-colors"
                >
                  {lang === 'EN' ? 'Check Appointment Availability' : 'अपॉइंटमेंट उपलब्धता जांचें'}
                </button>

                {/* 2. Fee Calculator */}
                <button 
                  onClick={() => handleNavbarAction && handleNavbarAction('fee_calculator')}
                  class="w-full block px-3.5 py-2.5 rounded-lg text-left hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold bg-transparent border-0 cursor-pointer text-xs transition-colors"
                >
                  {lang === 'EN' ? 'Fee Calculator' : 'शुल्क कैलकुलेटर'}
                </button>

                {/* 3. Apply For (Submenu) */}
                <div class="relative group/sub w-full">
                  <button class="w-full flex justify-between items-center px-3.5 py-2.5 rounded-lg text-left hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold bg-transparent border-0 cursor-pointer text-xs transition-colors">
                    <span>{lang === 'EN' ? 'Apply For' : 'आवेदन करें'}</span>
                    <ChevronRight size={12} class="text-slate-400" />
                  </button>
                  <div class="absolute hidden group-hover/sub:block left-full top-0 ml-1.5 w-52 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl p-2 z-50 animate-in fade-in duration-100 flex flex-col gap-0.5">
                    <button 
                      onClick={() => handleServiceSelect && handleServiceSelect('ordinary')}
                      class="w-full block px-3 py-2 rounded-lg text-left hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold bg-transparent border-0 cursor-pointer text-xs"
                    >
                      {lang === 'EN' ? 'Ordinary Passports' : 'सामान्य पासपोर्ट'}
                    </button>
                    <button 
                      onClick={() => handleServiceSelect && handleServiceSelect('tatkal')}
                      class="w-full block px-3 py-2 rounded-lg text-left hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold bg-transparent border-0 cursor-pointer text-xs"
                    >
                      {lang === 'EN' ? 'Tatkaal Passports' : 'तत्काल पासपोर्ट'}
                    </button>
                    <button 
                      onClick={() => handleServiceSelect && handleServiceSelect('pcc')}
                      class="w-full block px-3 py-2 rounded-lg text-left hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold bg-transparent border-0 cursor-pointer text-xs"
                    >
                      {lang === 'EN' ? 'Police Clearance' : 'पुलिस सत्यापन'}
                    </button>
                  </div>
                </div>

                {/* 4. Locator (Submenu) */}
                <div class="relative group/sub w-full">
                  <button class="w-full flex justify-between items-center px-3.5 py-2.5 rounded-lg text-left hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold bg-transparent border-0 cursor-pointer text-xs transition-colors">
                    <span>{lang === 'EN' ? 'Locator' : 'लोकेटर'}</span>
                    <ChevronRight size={12} class="text-slate-400" />
                  </button>
                  <div class="absolute hidden group-hover/sub:block left-full top-0 ml-1.5 w-52 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl p-2 z-50 animate-in fade-in duration-100 flex flex-col gap-0.5">
                    <button 
                      onClick={() => handleNavbarAction && handleNavbarAction('locator')}
                      class="w-full block px-3 py-2 rounded-lg text-left hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold bg-transparent border-0 cursor-pointer text-xs"
                    >
                      {lang === 'EN' ? 'Locate PSK / PO' : 'पीएसके / पीओ खोजें'}
                    </button>
                    <button 
                      onClick={() => handleNavbarAction && handleNavbarAction('appointment')}
                      class="w-full block px-3 py-2 rounded-lg text-left hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold bg-transparent border-0 cursor-pointer text-xs"
                    >
                      {lang === 'EN' ? 'Schedules & Slots' : 'समय सारणी और स्लॉट'}
                    </button>
                  </div>
                </div>

                {/* 5. Document Advisory (Submenu) */}
                <div class="relative group/sub w-full">
                  <button class="w-full flex justify-between items-center px-3.5 py-2.5 rounded-lg text-left hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold bg-transparent border-0 cursor-pointer text-xs transition-colors">
                    <span>{lang === 'EN' ? 'Document Advisory' : 'दस्तावेज़ एडवाइजरी'}</span>
                    <ChevronRight size={12} class="text-slate-400" />
                  </button>
                  <div class="absolute hidden group-hover/sub:block left-full top-0 ml-1.5 w-56 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl p-2 z-50 animate-in fade-in duration-100 flex flex-col gap-0.5">
                    <button 
                      onClick={() => handleNavbarAction && handleNavbarAction('doc_ordinary')}
                      class="w-full block px-3 py-2 rounded-lg text-left hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold bg-transparent border-0 cursor-pointer text-xs"
                    >
                      {lang === 'EN' ? 'Required Docs (Normal)' : 'आवश्यक दस्तावेज (सामान्य)'}
                    </button>
                    <button 
                      onClick={() => handleNavbarAction && handleNavbarAction('doc_tatkal')}
                      class="w-full block px-3 py-2 rounded-lg text-left hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold bg-transparent border-0 cursor-pointer text-xs"
                    >
                      {lang === 'EN' ? 'Required Docs (Tatkaal)' : 'आवश्यक दस्तावेज (तत्काल)'}
                    </button>
                    <button 
                      onClick={() => handleNavbarAction && handleNavbarAction('doc_pcc')}
                      class="w-full block px-3 py-2 rounded-lg text-left hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold bg-transparent border-0 cursor-pointer text-xs"
                    >
                      {lang === 'EN' ? 'Required Docs (PCC)' : 'आवश्यक दस्तावेज (पीसीसी)'}
                    </button>
                  </div>
                </div>

                {/* 6. Feedback / Grievance */}
                <button 
                  onClick={() => handleNavbarAction && handleNavbarAction('feedback')}
                  class="w-full block px-3.5 py-2.5 rounded-lg text-left hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold bg-transparent border-0 cursor-pointer text-xs transition-colors"
                >
                  {lang === 'EN' ? 'Feedback / Grievance' : 'प्रतिक्रिया / शिकायत'}
                </button>

                {/* 7. Track Application Status */}
                <button 
                  onClick={() => handleNavbarAction && handleNavbarAction('tracking')}
                  class="w-full block px-3.5 py-2.5 rounded-lg text-left hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold bg-transparent border-0 cursor-pointer text-xs transition-colors"
                >
                  {lang === 'EN' ? 'Track Application Status' : 'आवेदन की स्थिति ट्रैक करें'}
                </button>

              </div>
            </div>

            <button onClick={() => setView('home')} class="hover:text-gov-blue dark:hover:text-gov-light transition-colors pb-1">{lang === 'EN' ? 'Useful Links' : 'उपयोगी लिंक्स'}</button>
            <button onClick={() => setView('home')} class="hover:text-gov-blue dark:hover:text-gov-light transition-colors pb-1">{lang === 'EN' ? 'Contact Us' : 'संपर्क करें'}</button>
          </nav>

          {/* Configuration controls & profile */}
          <div class="flex items-center gap-3">
            
            {/* Search Icon */}
            <button class="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all flex items-center justify-center">
              <Search size={16} />
            </button>

            {/* Dark Mode Switch */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              title="Toggle Theme" 
              class="p-2 rounded-full bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all flex items-center justify-center border border-slate-100 dark:border-slate-700"
            >
              {darkMode ? <Sun size={15} class="text-yellow-400" /> : <Moon size={15} class="text-[#112d53]" />}
            </button>

            {/* Notifications Alert Dropdown */}
            <div class="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                class="p-2 rounded-full bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all flex items-center justify-center relative border border-slate-100 dark:border-slate-700"
              >
                <Bell size={15} />
                {unreadNotifs.length > 0 && (
                  <span class="absolute top-0 right-0 w-3.5 h-3.5 bg-gov-orange text-white rounded-full text-[8px] font-black flex items-center justify-center border border-white">
                    {unreadNotifs.length}
                  </span>
                )}
              </button>

              {/* Notification Popover Panel */}
              {showNotifications && (
                <div class="absolute right-0 mt-3 w-80 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 shadow-2xl p-4.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div class="flex justify-between items-center mb-3 pb-2 border-b border-slate-100 dark:border-slate-700">
                    <span class="font-black text-xs text-slate-700 dark:text-slate-250">{lang === 'EN' ? 'System Alerts' : 'सिस्टम चेतावनियां'}</span>
                    <span class="text-[10px] text-gov-blue dark:text-gov-light cursor-pointer hover:underline font-black" onClick={() => setShowNotifications(false)}>
                      {lang === 'EN' ? 'Close' : 'बंद करें'}
                    </span>
                  </div>
                  <div class="max-h-60 overflow-y-auto flex flex-col gap-2.5">
                    {notifications.length === 0 ? (
                      <p class="text-[11px] text-slate-400 text-center py-4">{lang === 'EN' ? 'No recent notifications.' : 'कोई नई सूचना नहीं।'}</p>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} class={`p-2.5 rounded-xl text-[11px] border text-left ${n.is_read ? 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-500' : 'bg-gov-blue/5 dark:bg-slate-700 border-gov-blue/20 dark:border-slate-600 text-slate-700 dark:text-slate-100 font-semibold'}`}>
                          <h4 class="font-extrabold mb-0.5">{n.title}</h4>
                          <p class="leading-tight text-slate-500 dark:text-slate-355">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Workspace Widget / Auth Actions */}
            <div class="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-750">
              {!currentUser ? (
                <div class="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      setAuthIsLogin(true);
                      setView('auth');
                    }} 
                    class="px-3.5 py-1.5 rounded-xl bg-white border border-[#112d53] text-[#112d53] hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-all text-xs font-black cursor-pointer"
                  >
                    {lang === 'EN' ? 'Login' : 'लॉगिन'}
                  </button>
                  <button 
                    onClick={() => {
                      setAuthIsLogin(false);
                      setCurrentUser(null);
                      setCurrentRole('citizen');
                      setView('auth');
                    }} 
                    class="px-3.5 py-1.5 rounded-xl bg-[#112d53] hover:bg-[#1b4372] dark:bg-gov-blue dark:hover:bg-gov-blue/90 text-white transition-all text-xs font-black shadow-md shadow-slate-100/50 dark:shadow-none cursor-pointer"
                  >
                    {lang === 'EN' ? 'Register' : 'पंजीकरण'}
                  </button>
                </div>
              ) : (
                <div class="flex items-center gap-2.5">
                  <button
                    onClick={() => setView('dashboard')}
                    class="w-7 h-7 rounded-full bg-gov-blue dark:bg-slate-750 text-white flex items-center justify-center font-black text-xs border border-gov-ashokaGold shadow-inner uppercase"
                  >
                    {currentUser.full_name[0]}
                  </button>
                  <div class="hidden lg:flex flex-col text-left">
                    <span class="text-xs font-black text-slate-880 dark:text-slate-200 leading-none">
                      {currentUser.full_name.split(' ')[0]}
                    </span>
                    <span class="text-[9px] text-gov-orange font-bold uppercase tracking-wider mt-0.5">
                      {currentRole === 'citizen' ? t('citizen') : currentRole === 'officer' ? t('officer') : currentRole === 'police' ? t('police') : t('admin')}
                    </span>
                  </div>
                  <button 
                    onClick={() => {
                      setCurrentUser(null);
                      setCurrentRole('citizen');
                      setView('home');
                    }}
                    title="Exit / Log Out"
                    class="p-2 rounded-full hover:bg-rose-50 text-rose-500 transition-all border border-transparent hover:border-rose-100 cursor-pointer"
                  >
                    <LogOut size={14} />
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

    </header>
  );
}
