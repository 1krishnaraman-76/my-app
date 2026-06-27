import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { ClipboardCheck, ShieldAlert, Sparkles, CheckSquare, MessageSquare, ArrowRight, UserCheck, Search, ShieldX } from 'lucide-react';

export default function OfficerDashboard({ setView }) {
  const { lang, applications, officerReviewApp } = useContext(AppContext);
  const [selectedApp, setSelectedApp] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [searchFilter, setSearchFilter] = useState('');

  // Show all submitted/under_review/doc_verification applications
  const pendingApps = applications.filter(app => 
    (app.status === 'under_review' || app.status === 'submitted' || app.status === 'doc_verification') &&
    (searchFilter === '' || `${app.first_name} ${app.last_name}`.toLowerCase().includes(searchFilter.toLowerCase()) || app.tracking_id.includes(searchFilter))
  );

  const handleSelectApp = (app) => {
    setSelectedApp(app);
    setRemarks('');
  };

  const handleDecision = (statusVal) => {
    if (!selectedApp) return;
    
    // Trigger master state machine action
    officerReviewApp(selectedApp.id, statusVal, remarks || 'Document matches verification parameters. Approved for next phase.');
    
    // Clear selection
    setSelectedApp(null);
    setRemarks('');
  };

  return (
    <div class="max-w-7xl mx-auto px-4 md:px-8 py-10 flex flex-col md:flex-row gap-8">
      
      {/* 1. LEFT SIDE: APPLICATIONS IN QUEUE LIST */}
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
              <h3 class="font-extrabold text-base text-gov-navy dark:text-white font-serif">{lang === 'EN' ? 'Document Audit Queue' : 'दस्तावेज़ सत्यापन कतार'}</h3>
              <span class="text-[10px] text-slate-400 font-semibold uppercase">{pendingApps.length} {lang === 'EN' ? 'Files Awaiting Review' : 'फाइलें समीक्षा के लिए लंबित'}</span>
            </div>
            <ClipboardCheck size={20} class="text-gov-blue dark:text-gov-light animate-pulse" />
          </div>

          {/* Search box filter */}
          <div class="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs mb-4">
            <Search size={14} class="text-slate-400" />
            <input 
              type="text" 
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search by name or reference..."
              class="bg-transparent border-none focus:outline-none flex-1 dark:text-white"
            />
          </div>

          <div class="flex flex-col gap-3 max-h-[450px] overflow-y-auto pr-1">
            {pendingApps.length === 0 ? (
              <p class="text-xs text-slate-400 text-center py-10">No applications in the document queue.</p>
            ) : (
              pendingApps.map(app => (
                <div 
                  key={app.id} 
                  onClick={() => handleSelectApp(app)}
                  class={`p-4 rounded-2xl border text-xs cursor-pointer text-left flex flex-col gap-2 transition-all ${selectedApp && selectedApp.id === app.id ? 'bg-gov-blue/5 border-gov-blue/50 dark:bg-slate-700/50' : 'bg-slate-50 border-slate-250 dark:bg-slate-900/40 dark:border-slate-800 hover:border-slate-300'}`}
                >
                  <div class="flex justify-between items-center w-full">
                    <h4 class="font-extrabold text-slate-800 dark:text-white">{app.first_name} {app.last_name}</h4>
                    <span class="px-2 py-0.5 rounded bg-gov-orange text-white text-[8px] font-bold uppercase">{app.application_type}</span>
                  </div>
                  <span class="text-[10px] font-mono text-slate-400 tracking-wider truncate">{app.tracking_id}</span>
                  <div class="flex items-center gap-2 mt-1">
                    {app.appointment ? (
                      <span class="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-[8px] font-bold uppercase">✓ PSK Visit Done</span>
                    ) : (
                      <span class="px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-600 text-[8px] font-bold uppercase">⏳ Awaiting PSK</span>
                    )}
                    <span class={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase ${
                      app.status === 'submitted' 
                        ? 'bg-blue-500/10 border border-blue-400/30 text-blue-500' 
                        : 'bg-indigo-500/10 border border-indigo-400/30 text-indigo-500'
                    }`}>{app.status.replace('_',' ')}</span>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>

      {/* 2. RIGHT SIDE: HIGH-FIDELITY REVIEW PANEL COMPARISON */}
      <div class="md:w-7/12 w-full text-left">
        {!selectedApp ? (
          <div class="h-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-16 text-center flex flex-col items-center justify-center gap-4 shadow-sm min-h-[400px]">
            <CheckSquare size={48} class="text-slate-300" />
            <h3 class="font-extrabold text-base text-slate-700 dark:text-white font-serif">{lang === 'EN' ? 'Select File Awaiting Audit' : 'ऑडिट के लिए फ़ाइल चुनें'}</h3>
            <p class="text-xs text-slate-400 max-w-xs">{lang === 'EN' ? 'Select an applicant from the document validation queue side panel to display Aadhaar OCR details side-by-side.' : 'पार्श्व पैनल से किसी आवेदक का चयन करें।'}</p>
          </div>
        ) : (
          <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-6 animate-in fade-in duration-200">
            
            {/* Header info */}
            <div class="flex justify-between items-start border-b pb-4 dark:border-slate-700">
              <div>
                <span class="text-[9px] uppercase font-bold text-slate-400">{lang === 'EN' ? 'Active Review Audit File' : 'सक्रिय समीक्षा फ़ाइल'}</span>
                <h3 class="font-extrabold text-lg text-gov-navy dark:text-white font-serif">{selectedApp.first_name} {selectedApp.last_name}</h3>
                <p class="text-[10px] font-mono text-slate-400 mt-0.5">{selectedApp.tracking_id}</p>
              </div>
              <span class="px-2.5 py-1 rounded bg-gov-blue/10 border border-gov-blue/20 text-gov-blue dark:text-gov-light text-[10px] font-bold uppercase">{selectedApp.application_type}</span>
            </div>

            {/* Sidebar particulars comparing */}
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Profile Details Entered by Applicant */}
              <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border text-xs flex flex-col gap-3">
                <h4 class="font-extrabold text-xs text-slate-800 dark:text-white border-b pb-1.5 dark:border-slate-800">{lang === 'EN' ? 'Form Field Declarations' : 'घोषित विवरण'}</h4>
                <div class="flex flex-col gap-2">
                  <div>
                    <span class="text-slate-400 font-bold uppercase text-[8px]">{lang === 'EN' ? 'Name' : 'नाम'}</span>
                    <p class="font-bold text-slate-800 dark:text-white">{selectedApp.first_name} {selectedApp.last_name}</p>
                  </div>
                  <div>
                    <span class="text-slate-400 font-bold uppercase text-[8px]">{lang === 'EN' ? 'Date of Birth' : 'जन्म तिथि'}</span>
                    <p class="font-bold text-slate-800 dark:text-white">{selectedApp.date_of_birth}</p>
                  </div>
                  <div>
                    <span class="text-slate-400 font-bold uppercase text-[8px]">{lang === 'EN' ? 'Residential Address' : 'आवासीय पता'}</span>
                    <p class="font-bold text-slate-800 dark:text-white leading-tight">{selectedApp.address_line1}, {selectedApp.city} ({selectedApp.pincode})</p>
                  </div>
                </div>
              </div>

              {/* Side-by-Side OCR and face matching scores from AI engine */}
              <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border text-xs flex flex-col gap-3">
                <h4 class="font-extrabold text-xs text-slate-800 dark:text-white border-b pb-1.5 dark:border-slate-800 flex items-center gap-1">
                  <Sparkles size={12} class="text-gov-ashokaGold" />
                  <span>{lang === 'EN' ? 'AI OCR Validation Output' : 'एआई ओसीआर परिणाम'}</span>
                </h4>
                
                {selectedApp.documents.length === 0 ? (
                  <p class="text-[10px] text-yellow-500 font-semibold flex items-center gap-1 py-4">
                    <ShieldAlert size={14} />
                    <span>Applicant did not execute AI OCR validation scans.</span>
                  </p>
                ) : (
                  <div class="flex flex-col gap-2.5">
                    {/* Aadhaar check */}
                    {selectedApp.documents.find(d => d.document_type === 'aadhaar') && (
                      <div class="p-2 rounded bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-850">
                        <span class="text-[8px] text-gov-green font-bold uppercase block mb-1">Aadhaar OCR Extracted text matches name & DOB:</span>
                        <p class="text-[9px] leading-tight font-mono text-slate-500 dark:text-slate-450">{selectedApp.documents.find(d => d.document_type === 'aadhaar').ocr_extracted_text}</p>
                      </div>
                    )}
                    
                    {/* Face check */}
                    {selectedApp.documents.find(d => d.document_type === 'photo') && (
                      <div class="p-2 rounded bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-850 text-left">
                        <div class="flex justify-between items-center">
                          <span class="text-[8px] text-gov-green font-bold uppercase block">AI Biometric LIKENESS MATCH:</span>
                          <span class="text-[10px] text-gov-green font-black">{selectedApp.documents.find(d => d.document_type === 'photo').face_match_score}%</span>
                        </div>
                        <div class="w-full bg-slate-200 dark:bg-slate-700 h-1 rounded-full mt-1.5 overflow-hidden">
                          <div class="bg-gov-green h-full rounded-full" style={{ width: `${selectedApp.documents.find(d => d.document_type === 'photo').face_match_score}%` }}></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>

            {/* Remarks Input */}
            <div class="flex flex-col gap-1.5 text-xs text-left">
              <label class="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <MessageSquare size={12} />
                <span>{lang === 'EN' ? 'Official Auditing Remarks (Printed on Application History)' : 'आधिकारिक लेखापरीक्षा टिप्पणी'}</span>
              </label>
              <textarea 
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                rows={3}
                placeholder="Declare document matching integrity, original verification criteria details..."
                class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-gov-blue text-xs dark:text-white"
              />
            </div>

            {/* Decisive Actions */}
            <div class="flex flex-wrap items-center justify-between gap-3 border-t pt-4 dark:border-slate-700">
              <button 
                type="button"
                onClick={() => handleDecision('under_review')}
                class="px-5 py-2.5 rounded-xl border border-rose-500/30 hover:bg-rose-500/10 text-rose-500 text-xs font-bold transition-all flex items-center gap-1"
              >
                <ShieldX size={14} />
                <span>{lang === 'EN' ? 'Reject / Request Corrections' : 'अस्वीकार / सुधार अनुरोध'}</span>
              </button>

              <div class="flex items-center gap-2">
                {/* Quick direct-to-police button when PSK appointment is done */}
                {selectedApp.appointment && (
                  <button 
                    type="button"
                    onClick={() => handleDecision('police_verification')}
                    class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg"
                  >
                    <UserCheck size={14} />
                    <span>✓ Approve & Send to Police</span>
                    <ArrowRight size={12} />
                  </button>
                )}

                {!selectedApp.appointment && (
                  <button 
                    type="button"
                    onClick={() => handleDecision('police_verification')}
                    class="px-5 py-2.5 rounded-xl bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow"
                  >
                    <UserCheck size={14} />
                    <span>{lang === 'EN' ? 'Approve & Route to Police' : 'स्वीकृत करें और पुलिस भेजें'}</span>
                    <ArrowRight size={12} />
                  </button>
                )}
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
