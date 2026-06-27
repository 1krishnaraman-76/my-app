import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { ShieldCheck, MapPin, ClipboardList, RefreshCw, BadgeAlert, AlertCircle, FileText, CheckCircle } from 'lucide-react';

export default function PoliceDashboard({ setView }) {
  const { lang, applications, policeReviewApp } = useContext(AppContext);
  const [selectedApp, setSelectedApp] = useState(null);
  
  // Checklist states
  const [isAddressChecked, setIsAddressChecked] = useState(false);
  const [isCriminalChecked, setIsCriminalChecked] = useState(false);
  const [isIdentityChecked, setIsIdentityChecked] = useState(false);

  const [policeComments, setPoliceComments] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Retrieve files routed to local police station verification
  const assignedCases = applications.filter(app => app.status === 'police_verification');

  const handleSelectCase = (app) => {
    setSelectedApp(app);
    // Reset checklists
    setIsAddressChecked(false);
    setIsCriminalChecked(false);
    setIsIdentityChecked(false);
    setPoliceComments('');
  };

  const handlePoliceSubmit = (decision) => {
    if (!selectedApp) return;

    if (decision === 'approve' && (!isAddressChecked || !isCriminalChecked || !isIdentityChecked)) {
      alert(lang === 'EN' ? 'Please complete the compliance checklist before approving.' : 'कृपया अनुमोदन करने से पहले अनुपालन चेकलिस्ट पूरी करें।');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      
      // Update global state
      policeReviewApp(selectedApp.id, decision, policeComments || 'Physical address verified. Criminal record matches cleared status.');
      
      // Clear selections
      setSelectedApp(null);
    }, 600);
  };

  return (
    <div class="max-w-7xl mx-auto px-4 md:px-8 py-10 flex flex-col md:flex-row gap-8">
      
      {/* 1. LEFT SIDEBAR: PENDING POLICE CHECKS LIST */}
      <div class="md:w-5/12 w-full flex flex-col gap-4 text-left">
        <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 shadow-sm">
          
          {setView && (
            <button 
              onClick={() => setView('home')} 
              class="mb-4 flex items-center gap-1.5 text-[11px] font-extrabold text-slate-400 hover:text-gov-blue transition-colors group bg-transparent border-0 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left transform group-hover:-translate-x-0.5 transition-transform"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
              <span>{lang === 'EN' ? 'Back to Home Portal' : 'मुख्य पोर्टल पर वापस जाएं'}</span>
            </button>
          )}

          <div class="flex justify-between items-center mb-4 border-b pb-3 dark:border-slate-700">
            <div>
              <h3 class="font-extrabold text-base text-gov-navy dark:text-white font-serif">{lang === 'EN' ? 'Assigned Police Cases' : 'पुलिस सत्यापन मामले'}</h3>
              <span class="text-[10px] text-slate-400 font-semibold uppercase">{assignedCases.length} {lang === 'EN' ? 'Cases Pending Field Visit' : 'मामले लंबित हैं'}</span>
            </div>
            <ShieldCheck size={20} class="text-gov-orange" />
          </div>

          <div class="flex flex-col gap-3 max-h-[450px] overflow-y-auto pr-1">
            {assignedCases.length === 0 ? (
              <p class="text-xs text-slate-400 text-center py-10">No pending police verification tasks.</p>
            ) : (
              assignedCases.map(app => (
                <div 
                  key={app.id} 
                  onClick={() => handleSelectCase(app)}
                  class={`p-4 rounded-2xl border text-xs cursor-pointer text-left flex flex-col gap-2 transition-all ${selectedApp && selectedApp.id === app.id ? 'bg-gov-orange/5 border-gov-orange/50 dark:bg-slate-700/50' : 'bg-slate-50 border-slate-250 dark:bg-slate-900/40 dark:border-slate-800 hover:border-slate-350'}`}
                >
                  <div class="flex justify-between items-center w-full">
                    <h4 class="font-extrabold text-slate-850 dark:text-white">{app.first_name} {app.last_name}</h4>
                    <span class="px-2 py-0.5 rounded bg-gov-blue text-white text-[8px] font-bold uppercase">{app.city}</span>
                  </div>
                  <p class="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                    <MapPin size={10} class="text-gov-orange shrink-0" />
                    <span class="truncate">{app.address_line1}</span>
                  </p>
                </div>
              ))
            )}
          </div>

        </div>
      </div>

      {/* 2. RIGHT PANEL: COMPLIANCE CHECKLIST AND AUDITING */}
      <div class="md:w-7/12 w-full text-left">
        {!selectedApp ? (
          <div class="h-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-16 text-center flex flex-col items-center justify-center gap-4 shadow-sm min-h-[400px]">
            <ClipboardList size={48} class="text-slate-300" />
            <h3 class="font-extrabold text-base text-slate-700 dark:text-white font-serif">{lang === 'EN' ? 'Select Case for Verification' : 'सत्यापन के लिए मामला चुनें'}</h3>
            <p class="text-xs text-slate-400 max-w-xs">{lang === 'EN' ? 'Select a citizen record from the left queue. Police department audits require address confirmations and criminal records inspections.' : 'पार्श्व पैनल से किसी नागरिक का चयन करें।'}</p>
          </div>
        ) : (
          <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-6 animate-in fade-in duration-200">
            
            {/* Header info */}
            <div class="flex justify-between items-start border-b pb-4 dark:border-slate-700">
              <div>
                <span class="text-[9px] uppercase font-bold text-slate-400">{lang === 'EN' ? 'Verification Case Profile' : 'सत्यापन मामला विवरण'}</span>
                <h3 class="font-extrabold text-lg text-gov-navy dark:text-white font-serif">{selectedApp.first_name} {selectedApp.last_name}</h3>
                <p class="text-[10px] text-gov-orange font-bold mt-1 flex items-center gap-1">
                  <MapPin size={11} />
                  <span>{selectedApp.address_line1}, {selectedApp.city} ({selectedApp.pincode})</span>
                </p>
              </div>
              <span class="px-2.5 py-1 rounded bg-gov-orange text-white text-[9px] font-bold uppercase">{selectedApp.tracking_id}</span>
            </div>

            {/* Checklist Section */}
            <div class="flex flex-col gap-3">
              <h4 class="font-extrabold text-xs text-slate-800 dark:text-white font-serif uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <ClipboardList size={14} class="text-gov-orange" />
                <span>{lang === 'EN' ? 'Physical Field Investigation Checklist' : 'भौतिक क्षेत्र जांच चेकलिस्ट'}</span>
              </h4>

              <div class="flex flex-col gap-2.5">
                {[
                  {
                    id: 'address',
                    checked: isAddressChecked,
                    onChange: () => setIsAddressChecked(!isAddressChecked),
                    title: lang === 'EN' ? 'Confirm Residential Address' : 'आवासीय पते की पुष्टि करें',
                    desc: lang === 'EN' ? 'Citizen resides physically at the declared address line locations.' : 'नागरिक घोषित पते पर भौतिक रूप से निवास करता है।'
                  },
                  {
                    id: 'criminal',
                    checked: isCriminalChecked,
                    onChange: () => setIsCriminalChecked(!isCriminalChecked),
                    title: lang === 'EN' ? 'Inspect Criminal Records Database' : 'आपराधिक रिकॉर्ड की जांच करें',
                    desc: lang === 'EN' ? 'Citizen does not have any active police cases or pending courts warrants.' : 'नागरिक का कोई सक्रिय पुलिस मामला या अदालती वारंट नहीं है।'
                  },
                  {
                    id: 'identity',
                    checked: isIdentityChecked,
                    onChange: () => setIsIdentityChecked(!isIdentityChecked),
                    title: lang === 'EN' ? 'Verify Face & Document Integrity' : 'चेहरे और दस्तावेज़ की अखंडता सत्यापित करें',
                    desc: lang === 'EN' ? 'Physical verification matches photo and Aadhaar data parameters.' : 'भौतिक सत्यापन फोटो और आधार डेटा से मेल खाता है।'
                  }
                ].map(item => (
                  <div 
                    key={item.id}
                    onClick={item.onChange}
                    class={`p-3.5 rounded-2xl border text-xs cursor-pointer flex gap-3 text-left transition-all ${item.checked ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-slate-50 border-slate-200 dark:bg-slate-900/60 dark:border-slate-800'}`}
                  >
                    <input 
                      type="checkbox"
                      checked={item.checked}
                      onChange={item.onChange}
                      class="mt-1 accent-gov-green"
                    />
                    <div>
                      <h5 class="font-extrabold text-slate-800 dark:text-white leading-none mb-1">{item.title}</h5>
                      <p class="text-[10px] text-slate-400 font-medium leading-tight">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Remarks / verification details */}
            <div class="flex flex-col gap-1.5 text-xs text-left">
              <label class="text-[10px] uppercase font-bold text-slate-400">{lang === 'EN' ? 'Inspector Verification Comments' : 'सत्यापन टिप्पणियां'}</label>
              <textarea 
                value={policeComments}
                onChange={e => setPoliceComments(e.target.value)}
                rows={3}
                placeholder="Log physical neighborhood inquiry metrics, verification comments..."
                class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-gov-orange text-xs dark:text-white"
              />
            </div>

            {/* Decisive verification routing */}
            <div class="flex flex-wrap items-center justify-end gap-3 border-t pt-4 dark:border-slate-700">
              <button 
                type="button"
                disabled={isLoading}
                onClick={() => handlePoliceSubmit('reject')}
                class="px-5 py-2.5 rounded-xl border border-rose-500/30 hover:bg-rose-500/10 text-rose-500 text-xs font-bold transition-all"
              >
                {lang === 'EN' ? 'Reject Address Validation' : 'पते का सत्यापन अस्वीकार करें'}
              </button>

              <button 
                type="button"
                disabled={isLoading || !isAddressChecked || !isCriminalChecked || !isIdentityChecked}
                onClick={() => handlePoliceSubmit('approve')}
                class="px-6 py-2.5 bg-gov-green hover:bg-gov-green/90 text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isLoading && <RefreshCw size={12} class="animate-spin" />}
                <CheckCircle size={14} />
                <span>{lang === 'EN' ? 'Submit Approved Police Report' : 'स्वीकृत पुलिस रिपोर्ट सबमिट करें'}</span>
              </button>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
