import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { BarChart, Users, Settings, Receipt, Layers, ArrowUpRight, TrendingUp, AlertTriangle, UserMinus, ShieldAlert, Activity } from 'lucide-react';

export default function AdminDashboard({ setView }) {
  const { lang, users, applications, payments, activities, recordActivity, grantPassport } = useContext(AppContext);
  const [adminTab, setAdminTab] = useState('analytics'); // analytics | users | auditing | granting

  // 1. Analytical calculations
  const totalAppsCount = applications.length;
  const approvedAppsCount = applications.filter(a => a.status === 'approved').length;
  const pendingAppsCount = applications.filter(a => a.status !== 'approved').length;
  const totalRevenue = payments.reduce((acc, pay) => acc + pay.amount, 0);

  // 2. Custom inline SVG chart graphics coordinates
  // Sample data: Normal fresh vs renewal vs Tatkal
  const typeCounts = {
    new: applications.filter(a => a.application_type === 'new').length,
    renewal: applications.filter(a => a.application_type === 'renewal').length,
    tatkal: applications.filter(a => a.application_type === 'tatkal').length
  };

  return (
    <div class="max-w-7xl mx-auto px-4 md:px-8 py-10 flex flex-col gap-8">
      
      {/* 1. ADMIN HEADER BAR */}
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm text-left">
        <div>
          {setView && (
            <button 
              onClick={() => setView('home')} 
              class="mb-2 flex items-center gap-1.5 text-xs text-slate-450 hover:text-gov-blue dark:hover:text-gov-light transition-colors font-bold group select-none bg-transparent border-0 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left transform group-hover:-translate-x-0.5 transition-transform"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
              <span>{lang === 'EN' ? 'Back to Home Portal' : 'मुख्य पोर्टल पर वापस जाएं'}</span>
            </button>
          )}
          <h2 class="text-xl font-extrabold text-gov-navy dark:text-white font-serif tracking-tight">{lang === 'EN' ? 'National Control Console' : 'राष्ट्रीय नियंत्रण कंसोल'}</h2>
          <span class="text-[10px] text-slate-400 font-semibold uppercase">{lang === 'EN' ? 'MEA Admin Command Dashboard' : 'विदेश मंत्रालय प्रशासनिक डैशबोर्ड'}</span>
        </div>
        
        {/* Tab switcher */}
        <div class="flex gap-2 text-xs font-bold">
          <button 
            onClick={() => setAdminTab('analytics')}
            class={`px-4 py-2 rounded-xl transition-all ${adminTab === 'analytics' ? 'bg-gov-blue text-white' : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 dark:text-slate-300 text-slate-700'}`}
          >
            {lang === 'EN' ? 'Analytics Summary' : 'विश्लेषण सारांश'}
          </button>
          <button 
            onClick={() => setAdminTab('granting')}
            class={`px-4 py-2 rounded-xl transition-all ${adminTab === 'granting' ? 'bg-gov-blue text-white' : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 dark:text-slate-300 text-slate-700'}`}
          >
            {lang === 'EN' ? 'Passport Granting' : 'पासपोर्ट अनुदान'}
          </button>
          <button 
            onClick={() => setAdminTab('users')}
            class={`px-4 py-2 rounded-xl transition-all ${adminTab === 'users' ? 'bg-gov-blue text-white' : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 dark:text-slate-300 text-slate-700'}`}
          >
            {lang === 'EN' ? 'User Control' : 'उपयोगकर्ता नियंत्रण'}
          </button>
          <button 
            onClick={() => setAdminTab('auditing')}
            class={`px-4 py-2 rounded-xl transition-all ${adminTab === 'auditing' ? 'bg-gov-blue text-white' : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 dark:text-slate-300 text-slate-700'}`}
          >
            {lang === 'EN' ? 'System Forensics' : 'सिस्टम फोरेंसिक'}
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION VIEW: KEY ANALYTICS WIDGETS */}
      {/* ========================================================= */}
      {adminTab === 'analytics' && (
        <div class="flex flex-col gap-8 w-full animate-in fade-in duration-200">
          
          {/* Global counter matrices */}
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: lang === 'EN' ? 'Total Applications' : 'कुल आवेदन', val: totalAppsCount, icon: <Layers size={16} />, trend: '+12% MoM', color: 'text-gov-blue' },
              { label: lang === 'EN' ? 'Approved Passports' : 'स्वीकृत पासपोर्ट', val: approvedAppsCount, icon: <ShieldAlert size={16} />, trend: '94% Clear', color: 'text-gov-green' },
              { label: lang === 'EN' ? 'Pending Clearance' : 'लंबित मामले', val: pendingAppsCount, icon: <AlertTriangle size={16} />, trend: 'Awaiting checks', color: 'text-gov-orange' },
              { label: lang === 'EN' ? 'Total Fee Collected' : 'कुल शुल्क संग्रह', val: `₹${totalRevenue.toLocaleString()}`, icon: <Receipt size={16} />, trend: 'Instant clearing', color: 'text-gov-ashokaGold' }
            ].map((card, idx) => (
              <div key={idx} class="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 text-left flex flex-col gap-3 shadow-sm relative overflow-hidden">
                <div class="flex justify-between items-center text-slate-400">
                  <span class="text-[10px] uppercase font-bold tracking-wider">{card.label}</span>
                  <div class={`${card.color} shrink-0 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-lg`}>{card.icon}</div>
                </div>
                <div>
                  <h3 class="text-2xl font-black text-slate-800 dark:text-white leading-none mb-1 font-sans">{card.val}</h3>
                  <span class="text-[9px] text-slate-400 font-extrabold flex items-center gap-0.5">
                    <TrendingUp size={10} class="text-gov-green" />
                    <span>{card.trend}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            
            {/* Visual native customized bar charts of schemes distribution */}
            <div class="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col gap-4">
              <h4 class="font-extrabold text-sm text-slate-800 dark:text-white font-serif border-b pb-2 dark:border-slate-700">{lang === 'EN' ? 'Scheme Category Breakdown' : 'श्रेणी वार वितरण'}</h4>
              
              <div class="flex flex-col gap-4 text-xs mt-2">
                {[
                  { name: 'Fresh Passport Scheme (Normal)', count: typeCounts.new, percent: totalAppsCount ? (typeCounts.new / totalAppsCount) * 100 : 0, color: 'bg-gov-blue' },
                  { name: 'Passport Renewal/Reissue', count: typeCounts.renewal, percent: totalAppsCount ? (typeCounts.renewal / totalAppsCount) * 100 : 0, color: 'bg-gov-green' },
                  { name: 'Tatkal Urgent Clearance Scheme', count: typeCounts.tatkal, percent: totalAppsCount ? (typeCounts.tatkal / totalAppsCount) * 100 : 0, color: 'bg-gov-orange' }
                ].map((item, idx) => (
                  <div key={idx} class="flex flex-col gap-1.5">
                    <div class="flex justify-between items-center text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                      <span>{item.name}</span>
                      <strong>{item.count} ({Math.round(item.percent)}%)</strong>
                    </div>
                    <div class="w-full h-3 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                      <div class={`${item.color} h-full rounded-full transition-all duration-500`} style={{ width: `${item.percent || 5}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual SVG trend line showing application loads */}
            <div class="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col gap-4">
              <h4 class="font-extrabold text-sm text-slate-800 dark:text-white font-serif border-b pb-2 dark:border-slate-700">{lang === 'EN' ? 'Load Submission Activity Trend' : 'दैनिक आवेदन भार'}</h4>
              
              <div class="w-full flex items-center justify-center py-2 h-44 bg-slate-50 dark:bg-slate-900/60 rounded-2xl relative border dark:border-slate-800">
                <span class="absolute top-2 left-3 text-[9px] text-slate-400 font-extrabold uppercase">Daily Load Metric</span>
                
                {/* SVG trend line */}
                <svg viewBox="0 0 100 40" class="w-full h-full overflow-visible px-4">
                  <path 
                    d="M0,35 Q15,30 30,22 T60,15 T90,5 L100,5" 
                    fill="none" 
                    stroke="#134074" 
                    strokeWidth="2.5" 
                    strokeLinecap="round"
                    class="drop-shadow-lg"
                  />
                  <circle cx="30" cy="22" r="2.5" fill="#ff671f" />
                  <circle cx="60" cy="15" r="2.5" fill="#ff671f" />
                  <circle cx="90" cy="5" r="2.5" fill="#ff671f" />
                </svg>

                {/* Legend tags */}
                <div class="absolute bottom-2 right-4 flex gap-4 text-[9px] font-bold text-slate-400">
                  <span class="flex items-center gap-1"><span class="w-2 h-2 bg-gov-blue rounded-full"></span>Submissions</span>
                  <span class="flex items-center gap-1"><span class="w-2 h-2 bg-gov-orange rounded-full"></span>Biometric audits</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION VIEW: USER ROLE CONTROLLER */}
      {/* ========================================================= */}
      {adminTab === 'users' && (
        <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 shadow-sm text-left animate-in fade-in duration-200">
          <h4 class="font-extrabold text-sm text-slate-800 dark:text-white font-serif border-b pb-2 dark:border-slate-700 mb-4 flex items-center gap-2">
            <Users size={16} class="text-gov-blue" />
            <span>{lang === 'EN' ? 'National MEA Registered Credentials' : 'पंजीकृत उपयोगकर्ता साख'}</span>
          </h4>

          <div class="overflow-x-auto w-full">
            <table class="w-full text-xs text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-250 dark:border-slate-800 text-[10px] text-slate-400 font-extrabold uppercase">
                  <th class="p-3">{lang === 'EN' ? 'Full Name' : 'पूरा नाम'}</th>
                  <th class="p-3">{lang === 'EN' ? 'Email Address' : 'ईमेल पता'}</th>
                  <th class="p-3">{lang === 'EN' ? 'Linked Aadhaar' : 'लिंक्ड आधार'}</th>
                  <th class="p-3">{lang === 'EN' ? 'System Role' : 'सिस्टम भूमिका'}</th>
                  <th class="p-3 text-center">{lang === 'EN' ? 'Status' : 'स्थिति'}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {users.map(u => (
                  <tr key={u.id} class="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 text-slate-700 dark:text-slate-300">
                    <td class="p-3 font-bold text-slate-850 dark:text-white">{u.full_name}</td>
                    <td class="p-3">{u.email}</td>
                    <td class="p-3 font-mono">{u.aadhaar_number}</td>
                    <td class="p-3 capitalize text-gov-blue dark:text-gov-light font-bold">{u.role}</td>
                    <td class="p-3 text-center">
                      <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-[10px] font-extrabold uppercase">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION VIEW: SYSTEM AUDITING SECURITY LOGS */}
      {/* ========================================================= */}
      {adminTab === 'auditing' && (
        <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 shadow-sm text-left animate-in fade-in duration-200">
          <h4 class="font-extrabold text-sm text-slate-800 dark:text-white font-serif border-b pb-2 dark:border-slate-700 mb-4 flex items-center gap-2">
            <Activity size={16} class="text-gov-orange" />
            <span>{lang === 'EN' ? 'System Auditing Forensic Activity Logs' : 'सिस्टम सुरक्षा फोरेंसिक लॉग'}</span>
          </h4>

          <p class="text-xs text-slate-400 text-left mb-4">
            {lang === 'EN' 
              ? 'Security audits capture user actions, IP routes, role verification, and login logs for high anti-tamper forensics protection.'
              : 'सुरक्षा ऑडिट विरोधी छेड़छाड़ सुरक्षा के लिए उपयोगकर्ता क्रियाओं, आईपी मार्गों और लॉगिन लॉग को कैप्चर करते हैं।'}
          </p>

          <div class="flex flex-col gap-2.5 max-h-[400px] overflow-y-auto pr-1">
            {activities.map(act => (
              <div key={act.id} class="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex justify-between gap-4 font-mono text-[10px] text-slate-500 text-left">
                <span class="font-bold text-slate-700 dark:text-slate-300">✓ {act.action}</span>
                <div class="flex gap-4 shrink-0 font-bold">
                  <span>IP: {act.ip_address}</span>
                  <span>{new Date(act.created_at).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION VIEW: PASSPORT GRANTING CONTROL PANEL */}
      {/* ========================================================= */}
      {adminTab === 'granting' && (
        <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 shadow-sm text-left animate-in fade-in duration-200">
          <h4 class="font-extrabold text-sm text-slate-800 dark:text-white font-serif border-b pb-2 dark:border-slate-700 mb-4 flex items-center gap-2">
            <ShieldAlert size={16} class="text-gov-orange" />
            <span>{lang === 'EN' ? 'Passport Booklet Granting & Clearance Control' : 'पासपोर्ट बुकलेट अनुदान और निकासी नियंत्रण'}</span>
          </h4>

          <p class="text-xs text-slate-400 text-left mb-4">
            {lang === 'EN' 
              ? 'Applications cleared by local police station checks. Review verification comments, check details integrity, and authorize booklet dispatch.'
              : 'स्थानीय पुलिस स्टेशन द्वारा स्वीकृत आवेदन। टिप्पणियों की समीक्षा करें और पासपोर्ट बुकलेट अनुदान अधिकृत करें।'}
          </p>

          <div class="overflow-x-auto w-full">
            <table class="w-full text-xs text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-250 dark:border-slate-800 text-[10px] text-slate-400 font-extrabold uppercase">
                  <th class="p-3">Tracking ID</th>
                  <th class="p-3">Applicant Name</th>
                  <th class="p-3">Category</th>
                  <th class="p-3">Auditing Authority & Remarks</th>
                  <th class="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {applications.filter(a => a.status === 'police_cleared').length === 0 ? (
                  <tr>
                    <td colSpan="5" class="p-8 text-center text-slate-400">No applications cleared by police are currently awaiting booklet granting authorization.</td>
                  </tr>
                ) : (
                  applications.filter(a => a.status === 'police_cleared').map(app => (
                    <tr key={app.id} class="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 text-slate-700 dark:text-slate-300">
                      <td class="p-3 font-mono font-bold text-gov-blue dark:text-gov-light">{app.tracking_id}</td>
                      <td class="p-3 font-bold text-slate-850 dark:text-white">{app.first_name} {app.last_name}</td>
                      <td class="p-3 uppercase font-extrabold">{app.application_type}</td>
                      <td class="p-3 text-slate-500">
                        <p class="font-bold text-[10px] text-slate-600 dark:text-slate-400">{app.assigned_police_station || 'Local Police Headquarters'}</p>
                        <p class="text-[9px] mt-0.5 font-medium italic">"{app.police_remarks || 'Biometrics matched. Clear record found.'}"</p>
                      </td>
                      <td class="p-3 text-center">
                        <button 
                          onClick={() => {
                            const dynamicPostId = `SPEEDPOST-IN-${Math.floor(100000000 + Math.random() * 900000000)}`;
                            grantPassport(app.id, dynamicPostId);
                          }}
                          class="px-3 py-1.5 rounded-lg bg-gov-orange hover:bg-gov-orange/90 text-white font-extrabold text-[10px] uppercase shadow-md flex items-center gap-1.5 transition-all mx-auto"
                        >
                          <ShieldAlert size={12} />
                          <span>Grant Passport</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
