import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { FileText, CreditCard, Calendar, QrCode, Upload, ShieldCheck, CheckCircle2, UserCheck, ShieldAlert, Sparkles, RefreshCw, Printer, Bell, Activity } from 'lucide-react';

export default function CitizenDashboard({ 
  setView, selectedTrackId, setSelectedTrackId, 
  initialTab, setInitialTab, initialAppType, setInitialAppType 
}) {
  const { 
    lang, currentUser, applications, payments, notifications, activities,
    applyPassport, makePayment, bookSlot, uploadDoc, t 
  } = useContext(AppContext);

  // 1. Core View controllers
  const [activeTab, setActiveTab] = useState('overview'); // overview | apply | payment | appointment | notification | logs
  const [currentStep, setCurrentStep] = useState(1); // Steps: 1, 2, 3, 4, 5, 6
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [newTrackingId, setNewTrackingId] = useState('');
  
  // 2. Application Form State
  const [appType, setAppType] = useState('new');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('male');
  const [addr1, setAddr1] = useState('');
  const [addr2, setAddr2] = useState('');
  const [city, setCity] = useState('');
  const [stateVal, setStateVal] = useState('');
  const [pincode, setPincode] = useState('');
  const [empStatus, setEmpStatus] = useState('private_sector');
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');

  // 3. Document upload & OCR States
  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [sigFile, setSigFile] = useState(null);
  
  const [isScanningAadhaar, setIsScanningAadhaar] = useState(false);
  const [aadhaarOcrResult, setAadhaarOcrResult] = useState('');
  
  const [isMatchingFace, setIsMatchingFace] = useState(false);
  const [faceMatchScore, setFaceMatchScore] = useState(null);

  // 4. Appointment Selection states
  const [officeLocation, setOfficeLocation] = useState('PSK Mumbai (Lower Parel)');
  const [aptDate, setAptDate] = useState('');
  const [aptSlot, setAptSlot] = useState('10:00 AM');
  
  // 5. Payment gate trigger states
  const [showRzpGate, setShowRzpGate] = useState(false);
  const [rzpLoading, setRzpLoading] = useState(false);

  React.useEffect(() => {
    if (initialTab && initialTab !== activeTab) {
      setActiveTab(initialTab);
      if (setInitialTab) setInitialTab('');
    }
  }, [initialTab, setInitialTab]);

  React.useEffect(() => {
    if (initialAppType && initialAppType !== appType) {
      setAppType(initialAppType);
      if (setInitialAppType) setInitialAppType('');
    }
  }, [initialAppType, setInitialAppType]);

  // Filter application of current user — STRICTLY scoped to currentUser.id only
  const userApps = applications.filter(a => a.user_id === currentUser.id);
  
  // Only show an app from selectedTrackId if it actually belongs to the current user
  const trackedApp = selectedTrackId
    ? userApps.find(a => a.tracking_id === selectedTrackId)
    : null;

  // Fall back to most recent own app if tracking ID doesn't match any of this user's apps
  const activeApp = trackedApp 
    ? trackedApp 
    : (userApps.length > 0 ? userApps[userApps.length - 1] : null);

  const trackingStages = [
    { label: 'submitted', color: 'bg-emerald-500 text-emerald-500' },
    { label: 'under_review', color: 'bg-indigo-500 text-indigo-500' },
    { label: 'doc_verification', color: 'bg-yellow-500 text-yellow-500' },
    { label: 'police_verification', color: 'bg-orange-500 text-orange-500' },
    { label: 'approved', color: 'bg-emerald-600 text-emerald-600' }
  ];

  // Helper OCR scanning simulation
  const handleAadhaarOcr = () => {
    setIsScanningAadhaar(true);
    setAadhaarOcrResult('');

    setTimeout(() => {
      setIsScanningAadhaar(false);
      setAadhaarOcrResult(`[AI OCR SCAN SUCCESSFUL]\n- Extracted Name: ${currentUser.full_name}\n- Extracted DOB: 15-08-1995\n- Extracted Gender: Male\n- National Identity Status: Aadhaar UID Verified successfully.`);
    }, 1200);
  };

  const handleFaceSimilarity = () => {
    setIsMatchingFace(true);
    setFaceMatchScore(null);

    setTimeout(() => {
      setIsMatchingFace(false);
      setFaceMatchScore(98.4);
    }, 1500);
  };

  const handleNextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleFormSubmission = () => {
    const data = {
      application_type: appType,
      first_name: firstName || currentUser.full_name.split(' ')[0],
      last_name: lastName || currentUser.full_name.split(' ')[1] || '',
      date_of_birth: dob || '1995-08-15',
      gender,
      address_line1: addr1 || 'Flat 402, Shiv Ganga Heights',
      address_line2: addr2,
      city: city || 'Navi Mumbai',
      state: stateVal || 'Maharashtra',
      pincode: pincode || '400703',
      employment_status: empStatus,
      father_name: fatherName,
      mother_name: motherName,
      emergency_contact_name: emergencyName || 'Sunita Sharma',
      emergency_contact_phone: emergencyPhone || '9812345678'
    };

    const newCreated = applyPassport(data);
    
    // Auto attach mocked OCR uploads to new record
    if (aadhaarOcrResult) {
      uploadDoc(newCreated.id, 'aadhaar', 'aadhaar_doc.pdf', aadhaarOcrResult, null);
    }
    if (faceMatchScore) {
      uploadDoc(newCreated.id, 'photo', 'photo_doc.jpg', '', faceMatchScore);
    }

    setNewTrackingId(newCreated.tracking_id);
    setShowSuccessScreen(true);
    setCurrentStep(1);
    
    // Clear and reset form entry state fields
    setFirstName('');
    setLastName('');
    setDob('');
    setAddr1('');
    setAddr2('');
    setCity('');
    setStateVal('');
    setPincode('');
    setFatherName('');
    setMotherName('');
    setEmergencyName('');
    setEmergencyPhone('');
    setAadhaarFile(null);
    setPhotoFile(null);
    setSigFile(null);
    setAadhaarOcrResult('');
    setFaceMatchScore(null);

    // Ensure active focus is set to the newly created application
    if (setSelectedTrackId) setSelectedTrackId(newCreated.tracking_id);
  };

  const triggerRzpPayment = () => {
    setShowRzpGate(true);
  };

  const confirmRzpPayment = () => {
    setRzpLoading(true);
    setTimeout(() => {
      setRzpLoading(false);
      setShowRzpGate(false);
      makePayment(activeApp.id);
    }, 1200);
  };

  const handleBookSlot = (e) => {
    e.preventDefault();
    if (!aptDate) return;
    bookSlot(activeApp.id, officeLocation, aptDate, aptSlot);
    setActiveTab('overview');
  };

  const handlePrintReceipt = () => {
    if (!activeApp) return;
    const paymentRecord = payments ? payments.find(p => p.application_id === activeApp.id) : null;
    const txnId = paymentRecord ? paymentRecord.transaction_id : `pay_Rzp${activeApp.id}938210482`;
    const paidAt = paymentRecord ? new Date(paymentRecord.paid_at).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' }) : new Date().toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' });
    const amount = paymentRecord ? paymentRecord.amount : 1500;

    const receiptHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Payment Receipt - SmartPassport AI</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', Arial, sans-serif; background: #f4f6f9; display: flex; justify-content: center; align-items: flex-start; min-height: 100vh; padding: 30px 16px; }
    .receipt { background: #fff; width: 680px; border-radius: 0; box-shadow: 0 4px 30px rgba(0,0,0,0.12); overflow: hidden; }
    .header-strip { height: 6px; background: linear-gradient(90deg, #ff671f 33.3%, #fff 33.3% 66.6%, #138808 66.6%); }
    .header { background: #0d2c54; color: #fff; padding: 24px 32px; display: flex; align-items: center; gap: 20px; }
    .header-logo { width: 54px; height: 54px; background: #f9c013; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 26px; font-weight: 900; color: #0d2c54; flex-shrink: 0; }
    .header-title h1 { font-size: 20px; font-weight: 900; letter-spacing: 0.5px; }
    .header-title p { font-size: 10px; letter-spacing: 1.2px; text-transform: uppercase; color: #a0b8d8; margin-top: 3px; }
    .receipt-label { background: #f0f4f8; border-bottom: 1px solid #e2e8f0; padding: 12px 32px; display: flex; justify-content: space-between; align-items: center; }
    .receipt-label .badge { background: #138808; color: #fff; font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 20px; letter-spacing: 0.8px; text-transform: uppercase; }
    .receipt-label .doc-title { font-size: 13px; font-weight: 700; color: #334155; letter-spacing: 0.3px; }
    .body { padding: 28px 32px; }
    .success-banner { background: #ecfdf5; border: 1.5px solid #34d399; border-radius: 10px; padding: 14px 20px; display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
    .success-icon { font-size: 24px; }
    .success-text h2 { font-size: 15px; font-weight: 700; color: #065f46; }
    .success-text p { font-size: 11.5px; color: #047857; margin-top: 2px; }
    .section-title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: #64748b; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid #e2e8f0; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
    .info-item label { font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; display: block; margin-bottom: 3px; }
    .info-item span { font-size: 13px; font-weight: 600; color: #1e293b; }
    .info-item span.mono { font-family: 'Courier New', monospace; font-size: 12px; font-weight: 700; color: #0d2c54; }
    .amount-box { background: linear-gradient(135deg, #0d2c54, #1e4a8c); border-radius: 12px; padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .amount-box .label { font-size: 11px; color: #93c5fd; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
    .amount-box .amount { font-size: 28px; font-weight: 900; color: #f9c013; }
    .amount-box .status { font-size: 11px; background: rgba(52,211,153,0.2); color: #6ee7b7; padding: 4px 12px; border-radius: 20px; font-weight: 700; border: 1px solid #34d399; }
    .divider { border: none; border-top: 1px dashed #cbd5e1; margin: 20px 0; }
    .footer-note { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 18px; font-size: 10.5px; color: #64748b; line-height: 1.6; }
    .footer-note strong { color: #334155; }
    .print-footer { background: #0d2c54; color: #a0b8d8; padding: 14px 32px; display: flex; justify-content: space-between; font-size: 10px; }
    @media print {
      body { background: #fff; padding: 0; }
      .receipt { box-shadow: none; width: 100%; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="header-strip"></div>
    <div class="header">
      <div class="header-logo">🇮🇳</div>
      <div class="header-title">
        <h1>SmartPassport AI</h1>
        <p>Ministry of External Affairs — Government of India</p>
      </div>
    </div>
    <div class="receipt-label">
      <span class="doc-title">Official Payment Acknowledgement Receipt</span>
      <span class="badge">✓ Verified</span>
    </div>
    <div class="body">
      <div class="success-banner">
        <div class="success-icon">✅</div>
        <div class="success-text">
          <h2>Payment Received Successfully</h2>
          <p>Your passport application fee has been processed and recorded.</p>
        </div>
      </div>

      <p class="section-title">Applicant Information</p>
      <div class="info-grid">
        <div class="info-item"><label>Applicant Name</label><span>${activeApp.first_name} ${activeApp.last_name}</span></div>
        <div class="info-item"><label>Application Tracking ID</label><span class="mono">${activeApp.tracking_id}</span></div>
        <div class="info-item"><label>Application Type</label><span>${(activeApp.application_type || 'New').toUpperCase()} PASSPORT</span></div>
        <div class="info-item"><label>Date of Birth</label><span>${activeApp.date_of_birth || 'N/A'}</span></div>
        <div class="info-item"><label>Registered State</label><span>${activeApp.state || 'N/A'}</span></div>
        <div class="info-item"><label>Payment Date</label><span>${paidAt}</span></div>
      </div>

      <p class="section-title">Transaction Details</p>
      <div class="info-grid" style="margin-bottom: 20px;">
        <div class="info-item"><label>Transaction ID</label><span class="mono">${txnId}</span></div>
        <div class="info-item"><label>Payment Gateway</label><span>Razorpay Secure Gateway</span></div>
        <div class="info-item"><label>Payment Mode</label><span>Online (UPI / Card)</span></div>
        <div class="info-item"><label>Payment Status</label><span style="color:#059669;font-weight:700;">SUCCESS</span></div>
      </div>

      <div class="amount-box">
        <div>
          <div class="label">Total Amount Paid</div>
          <div class="amount">INR ${amount.toLocaleString('en-IN')}.00</div>
        </div>
        <div class="status">PAID</div>
      </div>

      <hr class="divider" />

      <div class="footer-note">
        <strong>Important Notice:</strong> This is an official computer-generated payment receipt for your passport application fee. Please retain this document for your records. This receipt is valid for all MEA verification purposes. Present this receipt at the Passport Seva Kendra during your scheduled appointment.
        <br/><br/>
        <strong>Helpline:</strong> 1800-258-1800 &nbsp;|&nbsp; <strong>Email:</strong> helpdesk@smartpassport.gov.in
      </div>
    </div>
    <div class="print-footer">
      <span>SmartPassport AI Systems © 2026 — Official Portal</span>
      <span>Generated: ${new Date().toLocaleString('en-IN')}</span>
    </div>
  </div>
  <script>window.onload = function() { window.print(); }<\/script>
</body>
</html>`;

    const w = window.open('', '_blank', 'width=750,height=900,scrollbars=yes');
    w.document.write(receiptHtml);
    w.document.close();
  };

  const handlePrintQr = () => {
    if (!activeApp || !activeApp.appointment) return;
    const apt = activeApp.appointment;

    const slipHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Appointment QR Slip - SmartPassport AI</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', Arial, sans-serif; background: #f4f6f9; display: flex; justify-content: center; padding: 30px 16px; }
    .slip { background: #fff; width: 620px; border-radius: 0; box-shadow: 0 4px 30px rgba(0,0,0,0.12); overflow: hidden; }
    .header-strip { height: 6px; background: linear-gradient(90deg, #ff671f 33.3%, #fff 33.3% 66.6%, #138808 66.6%); }
    .header { background: #0d2c54; color: #fff; padding: 20px 28px; display: flex; align-items: center; gap: 16px; }
    .header-logo { width: 48px; height: 48px; background: #f9c013; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
    .header-title h1 { font-size: 18px; font-weight: 900; }
    .header-title p { font-size: 10px; letter-spacing: 1px; text-transform: uppercase; color: #a0b8d8; margin-top: 2px; }
    .body { padding: 24px 28px; }
    .apt-banner { background: #eff6ff; border: 1.5px solid #3b82f6; border-radius: 10px; padding: 12px 18px; margin-bottom: 22px; }
    .apt-banner h2 { font-size: 14px; font-weight: 700; color: #1e40af; }
    .apt-banner p { font-size: 11px; color: #3b82f6; margin-top: 3px; }
    .section-title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: #64748b; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid #e2e8f0; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 22px; }
    .info-item label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; display: block; margin-bottom: 2px; }
    .info-item span { font-size: 13px; font-weight: 600; color: #1e293b; }
    .info-item span.mono { font-family: 'Courier New', monospace; font-size: 11px; color: #0d2c54; }
    .qr-section { display: flex; gap: 20px; align-items: center; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 20px; }
    .qr-box { width: 110px; height: 110px; background: #1e293b; border-radius: 10px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 10px; text-align: center; padding: 8px; line-height: 1.4; }
    .qr-info h3 { font-size: 13px; font-weight: 700; color: #0d2c54; }
    .qr-info p { font-size: 11px; color: #475569; margin-top: 4px; line-height: 1.5; }
    .token { font-family: 'Courier New', monospace; font-size: 11px; background: #0d2c54; color: #f9c013; padding: 4px 10px; border-radius: 6px; display: inline-block; margin-top: 8px; font-weight: 700; letter-spacing: 1px; }
    .instructions { background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 14px 18px; font-size: 10.5px; color: #92400e; line-height: 1.7; }
    .instructions strong { color: #7c2d12; }
    .print-footer { background: #0d2c54; color: #a0b8d8; padding: 12px 28px; display: flex; justify-content: space-between; font-size: 10px; }
    @media print {
      body { background: #fff; padding: 0; }
      .slip { box-shadow: none; width: 100%; }
    }
  </style>
</head>
<body>
  <div class="slip">
    <div class="header-strip"></div>
    <div class="header">
      <div class="header-logo">🇮🇳</div>
      <div class="header-title">
        <h1>SmartPassport AI</h1>
        <p>Ministry of External Affairs — Government of India</p>
      </div>
    </div>
    <div class="body">
      <div class="apt-banner">
        <h2>📅 Appointment Confirmation Slip</h2>
        <p>Passport Seva Kendra — Biometric & Document Verification</p>
      </div>

      <p class="section-title">Applicant Details</p>
      <div class="info-grid">
        <div class="info-item"><label>Applicant Name</label><span>${activeApp.first_name} ${activeApp.last_name}</span></div>
        <div class="info-item"><label>Tracking ID</label><span class="mono">${activeApp.tracking_id}</span></div>
        <div class="info-item"><label>Application Type</label><span>${(activeApp.application_type || 'New').toUpperCase()}</span></div>
        <div class="info-item"><label>Application Status</label><span style="color:#0d2c54;">${(activeApp.status || '').replace(/_/g,' ').toUpperCase()}</span></div>
      </div>

      <p class="section-title">Appointment Information</p>
      <div class="info-grid" style="margin-bottom: 20px;">
        <div class="info-item"><label>PSK Location</label><span>${apt.office_location}</span></div>
        <div class="info-item"><label>Appointment Date</label><span>${apt.appointment_date}</span></div>
        <div class="info-item"><label>Time Slot</label><span>${apt.appointment_slot}</span></div>
        <div class="info-item"><label>Verification Status</label><span style="color:#059669;font-weight:700;">${(apt.status || 'SCHEDULED').toUpperCase()}</span></div>
      </div>

      <div class="qr-section">
        <div class="qr-box">[ QR TOKEN ]<br/>${apt.qr_code_token || 'QR_TOKEN'}<br/>Scan at PSK Entry</div>
        <div class="qr-info">
          <h3>Present this QR slip at PSK entry</h3>
          <p>Show this slip to the security officer at the Passport Seva Kendra entry gate. This token validates your identity and appointment slot.</p>
          <div class="token">${apt.qr_code_token || 'QR_TOKEN'}</div>
        </div>
      </div>

      <div class="instructions">
        <strong>📌 Instructions for Applicant:</strong><br/>
        1. Arrive at the PSK at least <strong>15 minutes before your scheduled slot</strong>.<br/>
        2. Carry <strong>original Aadhaar card</strong> and all uploaded documents.<br/>
        3. This slip is <strong>non-transferable</strong> and valid only for the above applicant.<br/>
        4. For queries, call: <strong>1800-258-1800</strong> (Toll Free, 24×7).
      </div>
    </div>
    <div class="print-footer">
      <span>SmartPassport AI Systems © 2026 — Official Appointment Slip</span>
      <span>Printed: ${new Date().toLocaleString('en-IN')}</span>
    </div>
  </div>
  <script>window.onload = function() { window.print(); }<\/script>
</body>
</html>`;

    const w = window.open('', '_blank', 'width=700,height=860,scrollbars=yes');
    w.document.write(slipHtml);
    w.document.close();
  };

  return (
    <div class="max-w-7xl mx-auto px-4 md:px-8 py-10 flex flex-col md:flex-row gap-8">
      
      {/* 1. SIDEBAR NAVIGATION CONSOLE */}
      <aside class="md:w-1/4 w-full flex flex-col gap-3">
        <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 shadow-sm text-left">
          
          <div class="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
            <div class="w-10 h-10 rounded-full bg-gov-navy text-white flex items-center justify-center font-bold border border-gov-ashokaGold">
              {currentUser.full_name[0]}
            </div>
            <div>
              <h4 class="font-extrabold text-sm text-slate-800 dark:text-white leading-tight">{currentUser.full_name}</h4>
              <span class="text-[10px] text-slate-400 font-semibold">{currentUser.email}</span>
            </div>
          </div>

          <div class="flex flex-col gap-1 text-xs">
            <button 
              onClick={() => setActiveTab('overview')}
              class={`w-full py-2.5 px-4 rounded-xl font-bold flex items-center gap-2.5 text-left transition-all ${activeTab === 'overview' ? 'bg-gov-blue text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-700/60 text-slate-600 dark:text-slate-300'}`}
            >
              <CheckCircle2 size={16} />
              <span>{lang === 'EN' ? 'Application Tracking' : 'आवेदन ट्रैकिंग'}</span>
            </button>

            <button 
              onClick={() => setActiveTab('apply')}
              class={`w-full py-2.5 px-4 rounded-xl font-bold flex items-center gap-2.5 text-left transition-all ${activeTab === 'apply' ? 'bg-gov-blue text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-700/60 text-slate-600 dark:text-slate-300'}`}
            >
              <FileText size={16} />
              <span>{lang === 'EN' ? 'Apply Passport Form' : 'पासपोर्ट फॉर्म भरें'}</span>
            </button>

            <button 
              onClick={() => setActiveTab('payment')}
              disabled={!activeApp}
              class={`w-full py-2.5 px-4 rounded-xl font-bold flex items-center gap-2.5 text-left transition-all disabled:opacity-50 ${activeTab === 'payment' ? 'bg-gov-blue text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-700/60 text-slate-600 dark:text-slate-300'}`}
            >
              <CreditCard size={16} />
              <span>{lang === 'EN' ? 'Online Payments' : 'ऑनलाइन भुगतान'}</span>
            </button>

            <button 
              onClick={() => setActiveTab('appointment')}
              disabled={!activeApp || !activeApp.payment_completed}
              class={`w-full py-2.5 px-4 rounded-xl font-bold flex items-center gap-2.5 text-left disabled:opacity-50 transition-all ${activeTab === 'appointment' ? 'bg-gov-blue text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-700/60 text-slate-600 dark:text-slate-300'}`}
            >
              <Calendar size={16} />
              <span>{lang === 'EN' ? 'Book Appointment' : 'नियुक्ति बुक करें'}</span>
            </button>

            <button 
              onClick={() => setActiveTab('notification')}
              class={`w-full py-2.5 px-4 rounded-xl font-bold flex items-center gap-2.5 text-left transition-all ${activeTab === 'notification' ? 'bg-gov-blue text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-700/60 text-slate-600 dark:text-slate-300'}`}
            >
              <Bell size={16} />
              <span>{lang === 'EN' ? 'Notification Alert' : 'अधिसूचना अलर्ट'}</span>
            </button>

            <button 
              onClick={() => setActiveTab('logs')}
              class={`w-full py-2.5 px-4 rounded-xl font-bold flex items-center gap-2.5 text-left transition-all ${activeTab === 'logs' ? 'bg-gov-blue text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-700/60 text-slate-600 dark:text-slate-300'}`}
            >
              <Activity size={16} />
              <span>{lang === 'EN' ? 'Access Logs' : 'एक्सेस लॉग'}</span>
            </button>

            {setView && (
              <>
                <div class="h-px bg-slate-100 dark:bg-slate-700/60 my-2"></div>
                <button 
                  onClick={() => setView('home')}
                  class="w-full py-2.5 px-4 rounded-xl font-bold flex items-center gap-2.5 text-left transition-all hover:bg-gov-orange/15 text-gov-orange"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-home"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  <span>{lang === 'EN' ? 'Back to Home Portal' : 'मुख्य पोर्टल पर वापस जाएं'}</span>
                </button>
              </>
            )}
          </div>

        </div>
      </aside>

      {/* 2. MAIN COMPONENT PANEL CONTENT AREA */}
      <main class="md:w-3/4 w-full flex flex-col gap-6 text-left">
        
        {/* ========================================================= */}
        {/* TAB MODULE: OVERVIEW TRACKING */}
        {/* ========================================================= */}
        {activeTab === 'overview' && (
          <div class="flex flex-col gap-6 w-full">
            
            {/* Active tracking selector dropdown */}
            {userApps.length > 1 && (
              <div class="flex items-center gap-3 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span class="text-xs font-bold text-slate-500">{lang === 'EN' ? 'Switch Active Application:' : 'सक्रिय आवेदन बदलें:'}</span>
                <select 
                  value={activeApp ? activeApp.tracking_id : ''}
                  onChange={(e) => setSelectedTrackId(e.target.value)}
                  class="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold focus:outline-none dark:text-white"
                >
                  {userApps.map(app => (
                    <option key={app.id} value={app.tracking_id}>{app.tracking_id} ({app.application_type.toUpperCase()})</option>
                  ))}
                </select>
              </div>
            )}

            {!activeApp ? (
              <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-10 text-center flex flex-col items-center gap-4 shadow-sm">
                <FileText size={48} class="text-slate-300" />
                <h3 class="font-extrabold text-lg text-slate-800 dark:text-white font-serif">{lang === 'EN' ? 'No Active Applications Found' : 'कोई सक्रिय आवेदन नहीं मिला'}</h3>
                <p class="text-xs text-slate-400 max-w-sm">{lang === 'EN' ? 'Register your passport files and execute details validation forms to begin.' : 'आरंभ करने के लिए अपने पासपोर्ट दस्तावेजों को पंजीकृत करें।'}</p>
                <button 
                  onClick={() => setActiveTab('apply')}
                  class="px-5 py-2.5 rounded-xl bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold transition-all shadow"
                >
                  {t('applyNow')}
                </button>
              </div>
            ) : (
              <div class="flex flex-col gap-6">
                
                {/* 1. Track stage timeline cards */}
                <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm">
                  <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b pb-4 dark:border-slate-700">
                    <div>
                      <span class="text-[10px] text-slate-400 uppercase font-bold">{lang === 'EN' ? 'Tracking Reference' : 'ट्रैकिंग संदर्भ'}</span>
                      <h3 class="font-extrabold text-lg text-gov-navy dark:text-white font-serif">{activeApp.tracking_id}</h3>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="px-3 py-1 rounded bg-gov-orange text-white text-xs font-bold uppercase">
                        {activeApp.status.replace('_', ' ')}
                      </span>
                      {activeApp.payment_completed ? (
                        <span class="px-3 py-1 rounded bg-emerald-500 text-white text-xs font-bold uppercase">{lang === 'EN' ? 'Paid' : 'भुगतान पूरा'}</span>
                      ) : (
                        <span class="px-3 py-1 rounded bg-rose-500 text-white text-xs font-bold uppercase">{lang === 'EN' ? 'Unpaid' : 'भुगतान शेष'}</span>
                      )}
                    </div>
                  </div>

                  {/* Horizontal visual milestones stages nodes */}
                  <div class="relative w-full flex items-center justify-between mt-10 mb-6">
                    {/* Background track line */}
                    <div class="absolute left-0 right-0 h-1 bg-slate-200 dark:bg-slate-700 top-1/2 -translate-y-1/2 z-0"></div>
                    
                    {/* Active highlight color track line */}
                    <div 
                      class="absolute left-0 h-1 bg-gov-orange top-1/2 -translate-y-1/2 z-0 transition-all duration-500"
                      style={{ 
                        width: activeApp.status === 'submitted' ? '0%' :
                               activeApp.status === 'under_review' ? '33%' :
                               activeApp.status === 'police_verification' ? '66%' :
                               activeApp.status === 'police_cleared' ? '80%' : '100%'
                      }}
                    ></div>

                    {[
                      { step: 'submitted', label: lang === 'EN' ? 'Filed' : 'प्रस्तुत', active: true },
                      { step: 'under_review', label: lang === 'EN' ? 'Office Review' : 'दस्तावेज़ समीक्षा', active: activeApp.status !== 'submitted' },
                      { step: 'police_verification', label: lang === 'EN' ? 'Police Check' : 'पुलिस सत्यापन', active: activeApp.status === 'police_verification' || activeApp.status === 'police_cleared' || activeApp.status === 'approved' },
                      { step: 'approved', label: lang === 'EN' ? 'Approved & Printed' : 'स्वीकृत / मुद्रित', active: activeApp.status === 'approved' }
                    ].map((nd, idx) => (
                      <div key={idx} class="flex flex-col items-center z-10 relative">
                        <div class={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${nd.active ? 'bg-gov-orange text-white ring-4 ring-gov-orange/20' : 'bg-slate-300 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>
                          {idx + 1}
                        </div>
                        <span class="text-[10px] font-bold text-slate-600 dark:text-slate-300 mt-2 bg-white dark:bg-slate-800 px-1">{nd.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. File Status Audit Card details */}
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* General file particulars */}
                  <div class="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 flex flex-col gap-4">
                    <h4 class="font-extrabold text-sm text-slate-800 dark:text-white font-serif border-b pb-2 dark:border-slate-700 flex items-center gap-2">
                      <FileText size={16} class="text-gov-blue dark:text-gov-light" />
                      <span>{lang === 'EN' ? 'Application Details' : 'आवेदन विवरण'}</span>
                    </h4>
                    <div class="grid grid-cols-2 gap-y-3 text-xs">
                      <div>
                        <span class="text-slate-400 font-semibold uppercase text-[9px]">{lang === 'EN' ? 'Scheme Category' : 'योजना श्रेणी'}</span>
                        <p class="font-bold text-slate-800 dark:text-white capitalize">{activeApp.application_type}</p>
                      </div>
                      <div>
                        <span class="text-slate-400 font-semibold uppercase text-[9px]">{lang === 'EN' ? 'Applicant Name' : 'आवेदक का नाम'}</span>
                        <p class="font-bold text-slate-800 dark:text-white">{activeApp.first_name} {activeApp.last_name}</p>
                      </div>
                      <div>
                        <span class="text-slate-400 font-semibold uppercase text-[9px]">{lang === 'EN' ? 'Date of Birth' : 'जन्म तिथि'}</span>
                        <p class="font-bold text-slate-800 dark:text-white">{activeApp.date_of_birth}</p>
                      </div>
                      <div>
                        <span class="text-slate-400 font-semibold uppercase text-[9px]">{lang === 'EN' ? 'Registered Office State' : 'पंजीकृत राज्य'}</span>
                        <p class="font-bold text-slate-800 dark:text-white">{activeApp.state}</p>
                      </div>
                    </div>
                  </div>

                  {/* System actions recommendations and alerts */}
                  <div class="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                    <div>
                      <h4 class="font-extrabold text-sm text-slate-800 dark:text-white font-serif border-b pb-2 dark:border-slate-700 flex items-center gap-2 mb-3">
                        <Sparkles size={16} class="text-gov-ashokaGold" />
                        <span>{lang === 'EN' ? 'Required Action / Status remarks' : 'आवश्यक कार्रवाई / स्थिति टिप्पणी'}</span>
                      </h4>
                      {activeApp.status === 'submitted' && (
                        <div class="text-xs">
                          <p class="text-slate-500 dark:text-slate-300 font-medium leading-relaxed">
                            {lang === 'EN' 
                              ? 'Your passport application is registered. Please process online payment fees and schedule your biometric verification slot.'
                              : 'आपका पासपोर्ट आवेदन पंजीकृत है। कृपया ऑनलाइन भुगतान शुल्क संसाधित करें और अपना स्लॉट बुक करें।'}
                          </p>
                          <button onClick={() => setActiveTab('payment')} class="mt-4 px-4 py-2 bg-gov-orange hover:bg-gov-orange/90 text-white rounded-xl font-bold flex items-center gap-1.5 shadow">
                            <CreditCard size={14} />
                            <span>{lang === 'EN' ? 'Process Payment Now' : 'अब भुगतान करें'}</span>
                          </button>
                        </div>
                      )}

                      {activeApp.status === 'under_review' && (
                        <div class="text-xs flex flex-col gap-3">
                          <p class="text-slate-500 dark:text-slate-300 font-medium leading-relaxed">
                            {lang === 'EN'
                              ? 'Your PSK appointment is completed. A Passport Officer is reviewing your documents and will forward your file to the Police department for address verification.'
                              : 'आपकी पीएसके नियुक्ति पूरी हो गई है। एक पासपोर्ट अधिकारी दस्तावेजों की समीक्षा कर रहा है और पुलिस को आगे भेजेगा।'}
                          </p>
                          <div class="flex items-center gap-1 p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl">
                            <div class="flex flex-col items-center gap-0.5">
                              <div class="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[8px] font-bold">✓</div>
                              <span class="text-[8px] text-indigo-500 font-bold text-center">Filed</span>
                            </div>
                            <div class="flex-1 h-px bg-indigo-300"></div>
                            <div class="flex flex-col items-center gap-0.5">
                              <div class="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center animate-pulse text-[8px]">⧖</div>
                              <span class="text-[8px] text-indigo-600 font-bold text-center leading-tight">Officer<br/>Review</span>
                            </div>
                            <div class="flex-1 h-px bg-slate-300 dark:bg-slate-700"></div>
                            <div class="flex flex-col items-center gap-0.5">
                              <div class="w-5 h-5 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center text-slate-500 text-[8px] font-bold">3</div>
                              <span class="text-[8px] text-slate-400 font-bold text-center leading-tight">Police<br/>Check</span>
                            </div>
                            <div class="flex-1 h-px bg-slate-300 dark:bg-slate-700"></div>
                            <div class="flex flex-col items-center gap-0.5">
                              <div class="w-5 h-5 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center text-slate-500 text-[8px] font-bold">4</div>
                              <span class="text-[8px] text-slate-400 font-bold text-center">Approved</span>
                            </div>
                          </div>
                          <p class="text-[10px] text-indigo-500 font-semibold bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-lg px-3 py-2">
                            ℹ️ {lang === 'EN' ? 'No action needed from you. A Passport Officer will approve and forward your file to Police for address verification.' : 'आपसे कोई कार्रवाई की आवश्यकता नहीं है। पासपोर्ट अधिकारी आपकी फ़ाइल स्वीकृत करेगा।'}
                          </p>
                          {activeApp.appointment && (
                            <div class="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                              <QrCode size={36} class="text-slate-800 dark:text-white" />
                              <div class="text-[11px]">
                                <p class="font-bold text-slate-700 dark:text-white">PSK Appointment Booked</p>
                                <p class="text-slate-400 font-semibold">{activeApp.appointment.office_location} • {activeApp.appointment.appointment_date}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {activeApp.status === 'police_verification' && (
                        <div class="text-xs">
                          <p class="text-slate-500 dark:text-slate-300 font-medium leading-relaxed">
                            {lang === 'EN'
                              ? 'Biometric check approved at Seva Kendra. Document file forwarded to police department.'
                              : 'बायोमेट्रिक जांच स्वीकृत हो गई है। दस्तावेज़ फ़ाइल पुलिस विभाग को भेज दी गई है।'}
                          </p>
                          <div class="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-[11px]">
                            <p class="font-bold text-slate-700 dark:text-white">{lang === 'EN' ? 'Assigned Police Station:' : 'सौंपा गया पुलिस स्टेशन:'}</p>
                            <p class="text-gov-orange font-bold mt-0.5">{activeApp.assigned_police_station || 'Local Police Headquarters'}</p>
                          </div>
                        </div>
                      )}

                      {activeApp.status === 'police_cleared' && (
                        <div class="text-xs text-left">
                          <div class="flex items-center gap-1.5 text-emerald-500 font-bold mb-2">
                            <CheckCircle2 size={16} />
                            <span>{lang === 'EN' ? 'Police Verification Cleared' : 'पुलिस सत्यापन स्वीकृत'}</span>
                          </div>
                          <p class="text-slate-500 dark:text-slate-300 font-medium leading-relaxed">
                            {lang === 'EN'
                              ? 'Police Verification cleared successfully. File forwarded to MEA Headquarters for booklet printing and final grant clearance. Please check back shortly!'
                              : 'पुलिस सत्यापन सफलतापूर्वक पूरा हो गया है। फ़ाइल को विदेश मंत्रालय मुख्यालय भेज दिया गया है। कृपया थोड़ी देर बाद दोबारा जांच करें!'}
                          </p>
                          {activeApp.police_remarks && (
                            <div class="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-[11px]">
                              <p class="font-bold text-slate-700 dark:text-white">{lang === 'EN' ? 'Police Report Remarks:' : 'पुलिस रिपोर्ट टिप्पणी:'}</p>
                              <p class="text-slate-600 dark:text-slate-400 mt-0.5 italic">"{activeApp.police_remarks}"</p>
                            </div>
                          )}
                        </div>
                      )}

                      {activeApp.status === 'approved' && (
                        <div class="text-xs text-left">
                          <div class="flex items-center gap-1.5 text-gov-green font-bold mb-2">
                            <CheckCircle2 size={16} />
                            <span>{lang === 'EN' ? 'Passport Details Granted & Dispatched! 🇮🇳' : 'पासपोर्ट स्वीकृत और मुद्रित'}</span>
                          </div>
                          <p class="text-slate-500 dark:text-slate-300 leading-relaxed font-medium mb-3">
                            {lang === 'EN'
                              ? 'Congratulations! Your passport has been officially granted, printed, and dispatched by the Ministry of External Affairs.'
                              : 'बधाई हो! आपका पासपोर्ट विदेश मंत्रालय द्वारा आधिकारिक रूप से स्वीकृत और मुद्रित कर दिया गया है।'}
                          </p>
                          {activeApp.tracking_id_dispatch ? (
                            <div class="p-3.5 rounded-2xl border border-gov-orange/30 bg-gov-orange/5 text-xs text-left flex flex-col gap-1.5 shadow-sm">
                              <span class="text-[9px] uppercase font-bold text-slate-400">{lang === 'EN' ? 'Speed Post Tracking ID:' : 'स्पीड पोस्ट ट्रैकिंग आईडी:'}</span>
                              <strong class="text-sm text-gov-orange font-mono select-all font-black">{activeApp.tracking_id_dispatch}</strong>
                              <span class="text-[10px] text-slate-400 font-semibold">{lang === 'EN' ? 'Expected booklet arrival: 3 working days.' : 'अपेक्षित बुकलेट आगमन: 3 कार्य दिवस।'}</span>
                            </div>
                          ) : (
                            <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-[11px]">
                              <p class="text-slate-500">{lang === 'EN' ? 'Tracking details are being updated by India Post.' : 'इंडिया पोस्ट द्वारा ट्रैकिंग विवरण अपडेट किए जा रहे हैं।'}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                </div>

              </div>
            )}

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB MODULE: MULTI-STEP PASSPORT FORM INTAKE */}
        {/* ========================================================= */}
        {activeTab === 'apply' && (
          showSuccessScreen ? (
            <div class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 shadow-xl text-center flex flex-col items-center gap-6 animate-in fade-in duration-300">
              <div class="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500 flex items-center justify-center text-emerald-500 shadow-lg shadow-emerald-500/10">
                <CheckCircle2 size={32} class="animate-bounce" />
              </div>
              <div class="text-center">
                <span class="px-3 py-1 rounded bg-gov-ashokaGold/20 border border-gov-ashokaGold text-gov-navy dark:text-gov-ashokaGold text-[10px] font-extrabold uppercase tracking-widest">
                  {lang === 'EN' ? 'Application Registered' : 'आवेदन सफलतापूर्वक सहेजा गया'}
                </span>
                <h3 class="text-2xl font-black text-slate-800 dark:text-white mt-3 font-serif">
                  {lang === 'EN' ? 'Passport Applied Successfully!' : 'पासपोर्ट आवेदन सफलतापूर्वक पूरा हुआ!'}
                </h3>
                <p class="text-xs text-slate-400 max-w-md mx-auto mt-2 leading-relaxed font-medium">
                  {lang === 'EN'
                    ? 'Your biometric credentials and documents have been secured under national MEA archives. Your tracking reference is issued below.'
                    : 'आपके बायोमेट्रिक क्रेडेंशियल और दस्तावेज सुरक्षित कर लिए गए हैं। आपका संदर्भ नंबर नीचे जारी किया गया है।'}
                </p>
              </div>

              <div class="p-4 bg-slate-50 dark:bg-slate-900 border rounded-2xl border-slate-200 dark:border-slate-800 text-xs flex flex-col items-center gap-2 max-w-sm w-full">
                <span class="text-[9px] uppercase font-bold text-slate-400">Application Tracking Reference:</span>
                <strong class="text-base text-gov-orange font-mono select-all font-black">{newTrackingId}</strong>
              </div>

              <div class="text-xs text-left max-w-md bg-gov-blue/5 border border-gov-blue/15 p-4 rounded-2xl flex flex-col gap-2">
                <h4 class="font-bold text-gov-blue dark:text-gov-light flex items-center gap-1.5 border-b pb-1.5 dark:border-slate-800">
                  <Sparkles size={14} class="text-gov-ashokaGold" />
                  <span>Next Crucial Steps:</span>
                </h4>
                <ul class="list-disc pl-4 flex flex-col gap-1.5 text-slate-500 dark:text-slate-350 font-medium">
                  <li><strong>Process Fee Payout</strong>: Tatkal & Normal categories require online fee clearance (INR 1,500.00) via Razorpay sandbox.</li>
                  <li><strong>Schedule Biometric Spot</strong>: Book a physical original document check slot at your nearest PSK center.</li>
                </ul>
              </div>

              <div class="flex gap-3 border-t pt-6 w-full justify-center">
                <button 
                  onClick={() => {
                    setShowSuccessScreen(false);
                    setActiveTab('overview');
                  }}
                  class="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold transition-all"
                >
                  {lang === 'EN' ? 'View Status Timeline' : 'स्थिति ट्रैक करें'}
                </button>
                <button 
                  onClick={() => {
                    setShowSuccessScreen(false);
                    setActiveTab('payment');
                  }}
                  class="px-6 py-2.5 rounded-xl bg-gov-orange hover:bg-gov-orange/90 text-white text-xs font-extrabold shadow-lg flex items-center gap-1.5"
                >
                  <CreditCard size={14} />
                  <span>{lang === 'EN' ? 'Proceed to Online Payment' : 'ऑनलाइन भुगतान के लिए आगे बढ़ें'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-6">
            
            {/* Step Milestones Indicator bar */}
            <div class="flex justify-between items-center text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b pb-4 dark:border-slate-700">
              <span class={currentStep === 1 ? 'text-gov-blue dark:text-gov-light font-extrabold' : ''}>1. {lang === 'EN' ? 'Personal' : 'व्यक्तिगत'}</span>
              <span class={currentStep === 2 ? 'text-gov-blue dark:text-gov-light font-extrabold' : ''}>2. {lang === 'EN' ? 'Address' : 'पता'}</span>
              <span class={currentStep === 3 ? 'text-gov-blue dark:text-gov-light font-extrabold' : ''}>3. {lang === 'EN' ? 'Family' : 'परिवार'}</span>
              <span class={currentStep === 4 ? 'text-gov-blue dark:text-gov-light font-extrabold' : ''}>4. {lang === 'EN' ? 'Scheme' : 'योजना'}</span>
              <span class={currentStep === 5 ? 'text-gov-blue dark:text-gov-light font-extrabold' : ''}>5. {lang === 'EN' ? 'AI OCR' : 'एआई ओसीआर'}</span>
              <span class={currentStep === 6 ? 'text-gov-blue dark:text-gov-light font-extrabold' : ''}>6. {lang === 'EN' ? 'Preview' : 'पूर्वावलोकन'}</span>
            </div>

            {/* STEP 1: Personal Particulars */}
            {currentStep === 1 && (
              <div class="flex flex-col gap-4 animate-in fade-in duration-200">
                <h3 class="font-extrabold text-sm text-gov-navy dark:text-white border-b pb-1 dark:border-slate-700">{lang === 'EN' ? 'Step 1: Personal Identification Details' : 'चरण 1: व्यक्तिगत विवरण'}</h3>
                
                <div class="grid grid-cols-2 gap-4">
                  <div class="flex flex-col gap-1">
                    <label class="text-[10px] uppercase font-bold text-slate-400">{lang === 'EN' ? 'First Name' : 'पहला नाम'}</label>
                    <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs dark:text-white focus:ring-1 focus:ring-gov-blue focus:outline-none" />
                  </div>
                  <div class="flex flex-col gap-1">
                    <label class="text-[10px] uppercase font-bold text-slate-400">{lang === 'EN' ? 'Last Name' : 'अंतिम नाम'}</label>
                    <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs dark:text-white focus:ring-1 focus:ring-gov-blue focus:outline-none" />
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="flex flex-col gap-1">
                    <label class="text-[10px] uppercase font-bold text-slate-400">{lang === 'EN' ? 'Date of Birth' : 'जन्म तिथि'}</label>
                    <input type="date" value={dob} onChange={e => setDob(e.target.value)} class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs dark:text-white focus:ring-1 focus:ring-gov-blue focus:outline-none" />
                  </div>
                  <div class="flex flex-col gap-1">
                    <label class="text-[10px] uppercase font-bold text-slate-400">{lang === 'EN' ? 'Gender' : 'लिंग'}</label>
                    <select value={gender} onChange={e => setGender(e.target.value)} class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs dark:text-white focus:ring-1 focus:ring-gov-blue focus:outline-none">
                      <option value="male">{lang === 'EN' ? 'Male' : 'पुरुष'}</option>
                      <option value="female">{lang === 'EN' ? 'Female' : 'महिला'}</option>
                      <option value="other">{lang === 'EN' ? 'Other' : 'अन्य'}</option>
                    </select>
                  </div>
                </div>

                <div class="flex justify-end gap-3 mt-4 border-t pt-4 dark:border-slate-700">
                  <button onClick={handleNextStep} class="px-5 py-2.5 rounded-xl bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold transition-all">{lang === 'EN' ? 'Save & Continue' : 'सहेजें और जारी रखें'}</button>
                </div>
              </div>
            )}

            {/* STEP 2: Address Information */}
            {currentStep === 2 && (
              <div class="flex flex-col gap-4 animate-in fade-in duration-200">
                <h3 class="font-extrabold text-sm text-gov-navy dark:text-white border-b pb-1 dark:border-slate-700">{lang === 'EN' ? 'Step 2: Residential Address Particulars' : 'चरण 2: आवासीय पता विवरण'}</h3>
                
                <div class="flex flex-col gap-1">
                  <label class="text-[10px] uppercase font-bold text-slate-400">{lang === 'EN' ? 'Address Line 1 (House No, Flat No, Society)' : 'पता पंक्ति 1'}</label>
                  <input type="text" value={addr1} onChange={e => setAddr1(e.target.value)} class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs dark:text-white focus:ring-1 focus:ring-gov-blue focus:outline-none" />
                </div>

                <div class="grid grid-cols-3 gap-4">
                  <div class="flex flex-col gap-1">
                    <label class="text-[10px] uppercase font-bold text-slate-400">{lang === 'EN' ? 'City' : 'शहर'}</label>
                    <input type="text" value={city} onChange={e => setCity(e.target.value)} class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs dark:text-white focus:ring-1 focus:ring-gov-blue focus:outline-none" />
                  </div>
                  <div class="flex flex-col gap-1">
                    <label class="text-[10px] uppercase font-bold text-slate-400">{lang === 'EN' ? 'State' : 'राज्य'}</label>
                    <input type="text" value={stateVal} onChange={e => setStateVal(e.target.value)} class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs dark:text-white focus:ring-1 focus:ring-gov-blue focus:outline-none" />
                  </div>
                  <div class="flex flex-col gap-1">
                    <label class="text-[10px] uppercase font-bold text-slate-400">{lang === 'EN' ? 'Pincode (6 Digits)' : 'पिनकोड (6 अंक)'}</label>
                    <input type="text" maxLength={6} value={pincode} onChange={e => setPincode(e.target.value)} class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs dark:text-white focus:ring-1 focus:ring-gov-blue focus:outline-none" />
                  </div>
                </div>

                <div class="flex justify-between gap-3 mt-4 border-t pt-4 dark:border-slate-700">
                  <button onClick={handlePrevStep} class="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-white text-xs font-bold transition-all">{lang === 'EN' ? 'Back' : 'पीछे'}</button>
                  <button onClick={handleNextStep} class="px-5 py-2.5 rounded-xl bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold transition-all">{lang === 'EN' ? 'Save & Continue' : 'सहेजें और जारी रखें'}</button>
                </div>
              </div>
            )}

            {/* STEP 3: Family Details */}
            {currentStep === 3 && (
              <div class="flex flex-col gap-4 animate-in fade-in duration-200">
                <h3 class="font-extrabold text-sm text-gov-navy dark:text-white border-b pb-1 dark:border-slate-700">{lang === 'EN' ? 'Step 3: Parents/Guardians Information' : 'चरण 3: माता-पिता / अभिभावक विवरण'}</h3>
                
                <div class="grid grid-cols-2 gap-4">
                  <div class="flex flex-col gap-1">
                    <label class="text-[10px] uppercase font-bold text-slate-400">{lang === 'EN' ? "Father's Full Name" : 'पिता का पूरा नाम'}</label>
                    <input type="text" value={fatherName} onChange={e => setFatherName(e.target.value)} class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs dark:text-white focus:ring-1 focus:ring-gov-blue focus:outline-none" />
                  </div>
                  <div class="flex flex-col gap-1">
                    <label class="text-[10px] uppercase font-bold text-slate-400">{lang === 'EN' ? "Mother's Full Name" : 'माता का पूरा नाम'}</label>
                    <input type="text" value={motherName} onChange={e => setMotherName(e.target.value)} class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs dark:text-white focus:ring-1 focus:ring-gov-blue focus:outline-none" />
                  </div>
                </div>

                <div class="flex justify-between gap-3 mt-4 border-t pt-4 dark:border-slate-700">
                  <button onClick={handlePrevStep} class="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-white text-xs font-bold transition-all">{lang === 'EN' ? 'Back' : 'पीछे'}</button>
                  <button onClick={handleNextStep} class="px-5 py-2.5 rounded-xl bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold transition-all">{lang === 'EN' ? 'Save & Continue' : 'सहेजें और जारी रखें'}</button>
                </div>
              </div>
            )}

            {/* STEP 4: Employment & Category selection */}
            {currentStep === 4 && (
              <div class="flex flex-col gap-4 animate-in fade-in duration-200">
                <h3 class="font-extrabold text-sm text-gov-navy dark:text-white border-b pb-1 dark:border-slate-700">{lang === 'EN' ? 'Step 4: Employment Status & Scheme Category' : 'चरण 4: रोजगार की स्थिति और योजना श्रेणी'}</h3>
                
                <div class="grid grid-cols-2 gap-4">
                  <div class="flex flex-col gap-1">
                    <label class="text-[10px] uppercase font-bold text-slate-400">{lang === 'EN' ? 'Scheme Category' : 'योजना श्रेणी'}</label>
                    <select value={appType} onChange={e => setAppType(e.target.value)} class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs dark:text-white focus:ring-1 focus:ring-gov-blue focus:outline-none">
                      <option value="new">{lang === 'EN' ? 'Fresh Passport (Normal)' : 'नया पासपोर्ट (सामान्य)'}</option>
                      <option value="tatkal">{lang === 'EN' ? 'Tatkal Scheme (Express)' : 'तत्काल योजना (एक्सप्रेस)'}</option>
                      <option value="renewal">{lang === 'EN' ? 'Passport Renewal/Reissue' : 'पासपोर्ट नवीनीकरण'}</option>
                      <option value="reissue">{lang === 'EN' ? 'Police Clearance Certificate (PCC)' : 'पुलिस क्लीयरेंस सर्टिफिकेट (पीसीसी)'}</option>
                    </select>
                  </div>
                  <div class="flex flex-col gap-1">
                    <label class="text-[10px] uppercase font-bold text-slate-400">{lang === 'EN' ? 'Employment Status' : 'रोजगार की स्थिति'}</label>
                    <select value={empStatus} onChange={e => setEmpStatus(e.target.value)} class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs dark:text-white focus:ring-1 focus:ring-gov-blue focus:outline-none">
                      <option value="private_sector">{lang === 'EN' ? 'Private Sector' : 'निजी क्षेत्र'}</option>
                      <option value="government">{lang === 'EN' ? 'Government / PSU' : 'सरकारी विभाग'}</option>
                      <option value="student">{lang === 'EN' ? 'Student' : 'छात्र'}</option>
                      <option value="self_employed">{lang === 'EN' ? 'Self Employed' : 'स्व-नियोजित'}</option>
                    </select>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="flex flex-col gap-1">
                    <label class="text-[10px] uppercase font-bold text-slate-400">{lang === 'EN' ? 'Emergency Contact Name' : 'आपातकालीन संपर्क नाम'}</label>
                    <input type="text" value={emergencyName} onChange={e => setEmergencyName(e.target.value)} placeholder="e.g. Sunita Sharma" class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs dark:text-white focus:ring-1 focus:ring-gov-blue focus:outline-none" />
                  </div>
                  <div class="flex flex-col gap-1">
                    <label class="text-[10px] uppercase font-bold text-slate-400">{lang === 'EN' ? 'Emergency Contact Phone' : 'आपातकालीन संपर्क फोन'}</label>
                    <input type="tel" value={emergencyPhone} onChange={e => setEmergencyPhone(e.target.value)} placeholder="e.g. 9812345678" class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs dark:text-white focus:ring-1 focus:ring-gov-blue focus:outline-none" />
                  </div>
                </div>

                <div class="flex justify-between gap-3 mt-4 border-t pt-4 dark:border-slate-700">
                  <button onClick={handlePrevStep} class="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-white text-xs font-bold transition-all">{lang === 'EN' ? 'Back' : 'पीछे'}</button>
                  <button onClick={handleNextStep} class="px-5 py-2.5 rounded-xl bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold transition-all">{lang === 'EN' ? 'Save & Continue' : 'सहेजें और जारी रखें'}</button>
                </div>
              </div>
            )}

            {/* STEP 5: Drag & Drop Upload with AI OCR Scanner */}
            {currentStep === 5 && (
              <div class="flex flex-col gap-4 animate-in fade-in duration-200">
                <h3 class="font-extrabold text-sm text-gov-navy dark:text-white border-b pb-1 dark:border-slate-700 flex items-center gap-1.5">
                  <Sparkles size={16} class="text-gov-ashokaGold" />
                  <span>{lang === 'EN' ? 'Step 5: Smart AI Document Verification & Upload' : 'चरण 5: दस्तावेज़ अपलोड और एआई ओसीआर'}</span>
                </h3>

                <p class="text-xs text-slate-400 leading-normal mb-2">
                  {lang === 'EN' 
                    ? 'Upload your PDF / Image files below. Our high-accuracy AI engine scans and verifies details against UIDAI registered national data.'
                    : 'नीचे अपनी पीडीएफ / इमेज फाइलें अपलोड करें। हमारा एआई इंजन राष्ट्रीय डेटा के खिलाफ स्कैन और सत्यापन करता है।'}
                </p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Aadhaar upload panel with OCR trigger */}
                  <div class="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-left flex flex-col gap-3">
                    <div class="flex justify-between items-center border-b pb-2 dark:border-slate-800">
                      <span class="text-xs font-extrabold text-slate-700 dark:text-white">Aadhaar Card (Birth/Address Proof)</span>
                      <Upload size={16} class="text-slate-400" />
                    </div>
                    
                    <div class="py-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-center flex flex-col items-center justify-center bg-white dark:bg-slate-800 gap-2 cursor-pointer" onClick={() => setAadhaarFile('aadhaar_uploaded.pdf')}>
                      <FileText size={24} class={aadhaarFile ? 'text-gov-green' : 'text-slate-300'} />
                      <span class="text-[10px] font-bold text-slate-500">{aadhaarFile ? 'aadhaar_uploaded.pdf' : 'Drag & Drop Aadhaar PDF'}</span>
                    </div>

                    {aadhaarFile && !aadhaarOcrResult && (
                      <button 
                        type="button"
                        onClick={handleAadhaarOcr}
                        disabled={isScanningAadhaar}
                        class="w-full py-2 bg-gov-blue text-white rounded-xl text-[10px] font-bold uppercase transition-all shadow flex items-center justify-center gap-1.5"
                      >
                        {isScanningAadhaar && <RefreshCw size={12} class="animate-spin" />}
                        <span>{lang === 'EN' ? 'Validate via AI OCR' : 'एआई ओसीआर सत्यापित करें'}</span>
                      </button>
                    )}

                    {aadhaarOcrResult && (
                      <div class="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold whitespace-pre-wrap leading-tight">
                        {aadhaarOcrResult}
                      </div>
                    )}
                  </div>

                  {/* Photo upload panel with Biometric likeness verification score */}
                  <div class="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-left flex flex-col gap-3">
                    <div class="flex justify-between items-center border-b pb-2 dark:border-slate-800">
                      <span class="text-xs font-extrabold text-slate-700 dark:text-white">Biometric Photograph (White BG)</span>
                      <Upload size={16} class="text-slate-400" />
                    </div>
                    
                    <div class="py-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-center flex flex-col items-center justify-center bg-white dark:bg-slate-800 gap-2 cursor-pointer" onClick={() => setPhotoFile('photo_uploaded.jpg')}>
                      <UserCheck size={24} class={photoFile ? 'text-gov-green' : 'text-slate-300'} />
                      <span class="text-[10px] font-bold text-slate-500">{photoFile ? 'photo_uploaded.jpg' : 'Drag & Drop Passport Photo'}</span>
                    </div>

                    {photoFile && faceMatchScore === null && (
                      <button 
                        type="button"
                        onClick={handleFaceSimilarity}
                        disabled={isMatchingFace}
                        class="w-full py-2 bg-gov-blue text-white rounded-xl text-[10px] font-bold uppercase transition-all shadow flex items-center justify-center gap-1.5"
                      >
                        {isMatchingFace && <RefreshCw size={12} class="animate-spin" />}
                        <span>{lang === 'EN' ? 'Verify Face Biometrics' : 'चेहरा बायोमेट्रिक्स सत्यापित करें'}</span>
                      </button>
                    )}

                    {faceMatchScore !== null && (
                      <div class="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-left flex flex-col gap-1 animate-in fade-in duration-200">
                        <div class="flex justify-between items-center text-[10px] uppercase font-extrabold text-emerald-600 dark:text-emerald-400">
                          <span>Facial similarity score:</span>
                          <span class="font-black text-sm">{faceMatchScore}%</span>
                        </div>
                        <div class="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                          <div class="bg-gov-green h-full rounded-full" style={{ width: `${faceMatchScore}%` }}></div>
                        </div>
                        <p class="text-[9px] text-slate-400 font-semibold mt-1">✓ Matching likeness integrity matches Aadhaar biometric database records.</p>
                      </div>
                    )}
                  </div>

                </div>

                <div class="flex justify-between gap-3 mt-4 border-t pt-4 dark:border-slate-700">
                  <button onClick={handlePrevStep} class="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-white text-xs font-bold transition-all">{lang === 'EN' ? 'Back' : 'पीछे'}</button>
                  <button onClick={handleNextStep} class="px-5 py-2.5 rounded-xl bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold transition-all">{lang === 'EN' ? 'Save & Continue' : 'सहेजें और जारी रखें'}</button>
                </div>
              </div>
            )}

            {/* STEP 6: Form Review Preview & final submission lock */}
            {currentStep === 6 && (
              <div class="flex flex-col gap-4 animate-in fade-in duration-200">
                <h3 class="font-extrabold text-sm text-gov-navy dark:text-white border-b pb-1 dark:border-slate-700">{lang === 'EN' ? 'Step 6: Review & Finalize Submission' : 'चरण 6: पूर्वावलोकन और लॉक'}</h3>
                
                <div class="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs flex flex-col gap-4">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <span class="text-slate-400 font-bold uppercase text-[9px]">{lang === 'EN' ? 'Applicant Name:' : 'आवेदक का नाम:'}</span>
                      <p class="font-bold text-slate-800 dark:text-white">{firstName || currentUser.full_name.split(' ')[0]} {lastName || currentUser.full_name.split(' ')[1] || ''}</p>
                    </div>
                    <div>
                      <span class="text-slate-400 font-bold uppercase text-[9px]">{lang === 'EN' ? 'Date of Birth:' : 'जन्म तिथि:'}</span>
                      <p class="font-bold text-slate-800 dark:text-white">{dob || '1995-08-15'}</p>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <span class="text-slate-400 font-bold uppercase text-[9px]">{lang === 'EN' ? 'Residential Address:' : 'आवासीय पता:'}</span>
                      <p class="font-bold text-slate-800 dark:text-white">{addr1 || 'Flat 402, Shiv Ganga Heights, Vashi'}, {city || 'Navi Mumbai'} ({pincode || '400703'})</p>
                    </div>
                    <div>
                      <span class="text-slate-400 font-bold uppercase text-[9px]">{lang === 'EN' ? 'Category Scheme:' : 'श्रेणी योजना:'}</span>
                      <p class="font-bold text-slate-850 dark:text-white capitalize">{appType}</p>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4 border-t pt-3 dark:border-slate-800">
                    <div>
                      <span class="text-slate-400 font-bold uppercase text-[9px]">{lang === 'EN' ? 'AI OCR Status:' : 'एआई ओसीआर स्थिति:'}</span>
                      <p class={`font-bold ${aadhaarOcrResult ? 'text-gov-green' : 'text-yellow-500'}`}>{aadhaarOcrResult ? '✓ Aadhaar Scanned' : '⚠ Missing Scan'}</p>
                    </div>
                    <div>
                      <span class="text-slate-400 font-bold uppercase text-[9px]">{lang === 'EN' ? 'Facial Match Likeness:' : 'चेहरा बायोमेट्रिक मिलान:'}</span>
                      <p class={`font-bold ${faceMatchScore ? 'text-gov-green' : 'text-yellow-500'}`}>{faceMatchScore ? `✓ ${faceMatchScore}% similarity` : '⚠ Unverified'}</p>
                    </div>
                  </div>
                </div>

                <div class="flex justify-between gap-3 mt-4 border-t pt-4 dark:border-slate-700">
                  <button onClick={handlePrevStep} class="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-white text-xs font-bold transition-all">{lang === 'EN' ? 'Back' : 'पीछे'}</button>
                  <button type="button" onClick={handleFormSubmission} class="px-6 py-2.5 bg-gov-orange hover:bg-gov-orange/90 text-white rounded-xl text-xs font-extrabold shadow flex items-center gap-1">
                    <ShieldCheck size={14} />
                    <span>{lang === 'EN' ? 'Lock & Submit Application' : 'लॉक और सबमिट करें'}</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        )
      )}

        {/* ========================================================= */}
        {/* TAB MODULE: ONLINE PAYMENTS INTEGRATION */}
        {/* ========================================================= */}
        {activeTab === 'payment' && activeApp && (
          <div class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-6">
            <h3 class="font-extrabold text-sm text-gov-navy dark:text-white border-b pb-2 dark:border-slate-700 flex items-center gap-2">
              <CreditCard size={18} class="text-gov-blue dark:text-gov-light" />
              <span>{lang === 'EN' ? 'Online Payment Gateway Gateway' : 'ऑनलाइन भुगतान गेटवे'}</span>
            </h3>

            {activeApp.payment_completed ? (
              <div class="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-left flex flex-col gap-4">
                <div class="flex items-center gap-2 text-gov-green font-bold text-sm">
                  <CheckCircle2 size={20} />
                  <span>{lang === 'EN' ? 'Application Fee Paid Successfully' : 'आवेदन शुल्क सफलतापूर्वक भुगतान किया गया'}</span>
                </div>
                
                <p class="text-xs text-slate-500 dark:text-slate-300 font-medium">
                  {lang === 'EN' 
                    ? 'Payment of INR 1,500.00 was recorded. The receipt transaction details are linked below. You can now schedule your physical appointment check.'
                    : 'INR 1,500.00 का भुगतान दर्ज किया गया था। आप अब अपनी नियुक्ति का स्लॉट बुक कर सकते हैं।'}
                </p>

                <div class="p-4 bg-white dark:bg-slate-900 border rounded-xl border-slate-200 dark:border-slate-800 text-xs flex flex-col gap-2.5">
                  <div class="flex justify-between">
                    <span class="text-slate-400 font-bold uppercase text-[9px]">{lang === 'EN' ? 'Transaction ID:' : 'लेनदेन आईडी:'}</span>
                    <strong class="text-slate-800 dark:text-white font-mono">pay_Rzp{activeApp.id}938210482</strong>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400 font-bold uppercase text-[9px]">{lang === 'EN' ? 'Total Amount:' : 'कुल राशि:'}</span>
                    <strong class="text-slate-800 dark:text-white">INR 1,500.00</strong>
                  </div>
                </div>

                <button 
                  onClick={handlePrintReceipt}
                  class="px-4 py-2 bg-gov-blue hover:bg-gov-navy text-white rounded-xl text-xs font-bold self-start flex items-center gap-1.5 shadow"
                >
                  <Printer size={14} />
                  <span>{lang === 'EN' ? '🖨 Print Official Receipt' : 'आधिकारिक रसीद प्रिंट करें'}</span>
                </button>
              </div>
            ) : (
              <div class="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border text-left flex flex-col gap-4">
                <h4 class="font-bold text-xs uppercase text-slate-400 tracking-wider">{lang === 'EN' ? 'Fee Breakdown' : 'शुल्क विवरण'}</h4>
                
                <div class="flex justify-between text-xs font-medium border-b pb-2 dark:border-slate-800">
                  <span class="text-slate-500">Fresh Application Fee (Normal/Tatkal basis)</span>
                  <span class="text-slate-800 dark:text-white font-bold">INR 1,500.00</span>
                </div>
                <div class="flex justify-between text-xs font-extrabold pt-1">
                  <span class="text-slate-800 dark:text-white">Total Chargeable Amount:</span>
                  <span class="text-gov-orange font-black">INR 1,500.00</span>
                </div>

                <button 
                  type="button" 
                  onClick={triggerRzpPayment}
                  class="mt-4 px-6 py-3 bg-gov-orange hover:bg-gov-orange/90 text-white font-bold text-xs rounded-xl shadow-lg self-start"
                >
                  {lang === 'EN' ? 'Pay Online via Razorpay Gateway' : 'रेजरपे के माध्यम से ऑनलाइन भुगतान करें'}
                </button>
              </div>
            )}

            {/* MOCK RAZORPAY MODAL OVERLAY */}
            {showRzpGate && (
              <div class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div class="w-full max-w-md bg-slate-900 text-white rounded-3xl p-6 border border-slate-700/60 shadow-2xl flex flex-col gap-6 text-left">
                  
                  {/* Rzp Header */}
                  <div class="flex justify-between items-center border-b border-slate-800 pb-3">
                    <div class="flex items-center gap-2">
                      <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-sm">R</div>
                      <h4 class="font-extrabold text-sm tracking-wide text-white">Razorpay Secure Merchant</h4>
                    </div>
                    <button onClick={() => setShowRzpGate(false)} class="text-slate-400 hover:text-white text-xs font-bold">Cancel</button>
                  </div>

                  <div class="flex flex-col gap-3">
                    <span class="text-[10px] uppercase font-bold text-slate-400">Paying To: SmartPassport AI Portal</span>
                    <h3 class="text-2xl font-black text-gov-ashokaGold">INR 1,500.00</h3>
                    
                    <div class="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 font-medium">
                      🏦 Demo Environment Sandbox: Click the authorization button below to simulate transaction clearing instantly.
                    </div>
                  </div>

                  <button 
                    onClick={confirmRzpPayment}
                    disabled={rzpLoading}
                    class="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-xl flex items-center justify-center gap-2"
                  >
                    {rzpLoading && <RefreshCw size={14} class="animate-spin" />}
                    <span>Confirm Sandbox Payment</span>
                  </button>

                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB MODULE: PSK APPOINTMENT SLOT BOOKING */}
        {/* ========================================================= */}
        {activeTab === 'appointment' && activeApp && (
          <div class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-6">
            <h3 class="font-extrabold text-sm text-gov-navy dark:text-white border-b pb-2 dark:border-slate-700 flex items-center gap-2">
              <Calendar size={18} class="text-gov-blue dark:text-gov-light" />
              <span>{lang === 'EN' ? 'Schedule Physical Document Check' : 'भौतिक दस्तावेज़ सत्यापन शेड्यूलिंग'}</span>
            </h3>

            {activeApp.appointment ? (
              <div class="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-left flex flex-col gap-4">
                <div class="flex items-center gap-2 text-gov-green font-bold text-sm">
                  <CheckCircle2 size={20} />
                  <span>{lang === 'EN' ? 'Document Verification Appointment Scheduled' : 'नियुक्ति सफलतापूर्वक निर्धारित की गई'}</span>
                </div>
                
                <p class="text-xs text-slate-500 dark:text-slate-300 font-medium">
                  {lang === 'EN' 
                    ? 'Your physical check appointment details are recorded. Present the QR code token print slip at the PSK entry terminal.'
                    : 'आपके भौतिक सत्यापन नियुक्ति का विवरण सहेजा गया है। पीएसके प्रवेश पर क्यूआर कोड पर्ची प्रस्तुत करें।'}
                </p>

                <div class="p-4 bg-white dark:bg-slate-900 border rounded-xl border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-6">
                  
                  {/* Left particulars */}
                  <div class="text-xs flex flex-col gap-2 w-full text-left">
                    <div>
                      <span class="text-slate-400 font-bold uppercase text-[9px]">Location Centre:</span>
                      <p class="font-bold text-slate-800 dark:text-white">{activeApp.appointment.office_location}</p>
                    </div>
                    <div>
                      <span class="text-slate-400 font-bold uppercase text-[9px]">Date & Time Slot:</span>
                      <p class="font-bold text-slate-800 dark:text-white">{activeApp.appointment.appointment_date} ({activeApp.appointment.appointment_slot})</p>
                    </div>
                    <div>
                      <span class="text-slate-400 font-bold uppercase text-[9px]">Verification Status:</span>
                      <p class="font-bold text-gov-orange uppercase">{activeApp.appointment.status}</p>
                    </div>
                  </div>

                  {/* Right printable QR slip */}
                  <div class="w-32 h-32 p-2 bg-slate-100 rounded-xl flex flex-col items-center justify-center border border-slate-200 relative shrink-0">
                    <QrCode size={100} class="text-slate-800" />
                    <span class="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">VERIFIED</span>
                  </div>

                </div>

                <button 
                  onClick={handlePrintQr}
                  class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold self-start flex items-center gap-1.5 shadow"
                >
                  <Printer size={14} />
                  <span>{lang === 'EN' ? 'Print Appointment QR Slip' : 'नियुक्ति क्यूआर पर्ची प्रिंट करें'}</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookSlot} class="flex flex-col gap-4 text-left">
                
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div class="flex flex-col gap-1.5">
                    <label class="text-[10px] uppercase font-bold text-slate-400">Passport Seva Kendra Location</label>
                    <select 
                      value={officeLocation}
                      onChange={e => setOfficeLocation(e.target.value)}
                      class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs dark:text-white focus:outline-none"
                    >
                      <option value="PSK Mumbai (Lower Parel)">PSK Mumbai (Lower Parel)</option>
                      <option value="PSK Ahmedabad (Mithakali)">PSK Ahmedabad (Mithakali)</option>
                      <option value="PSK Delhi (R K Puram)">PSK Delhi (R K Puram)</option>
                      <option value="PSK Bengaluru (Lalbagh)">PSK Bengaluru (Lalbagh)</option>
                    </select>
                  </div>

                  <div class="flex flex-col gap-1.5">
                    <label class="text-[10px] uppercase font-bold text-slate-400">Choose Available Date</label>
                    <input 
                      type="date"
                      required
                      value={aptDate}
                      onChange={e => setAptDate(e.target.value)}
                      class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs dark:text-white focus:outline-none"
                    />
                  </div>

                  <div class="flex flex-col gap-1.5">
                    <label class="text-[10px] uppercase font-bold text-slate-400">Select Available Slot</label>
                    <select 
                      value={aptSlot}
                      onChange={e => setAptSlot(e.target.value)}
                      class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs dark:text-white focus:outline-none"
                    >
                      <option value="09:00 AM">09:00 AM - 10:00 AM</option>
                      <option value="10:00 AM">10:00 AM - 11:00 AM</option>
                      <option value="11:30 AM">11:30 AM - 12:30 PM</option>
                      <option value="02:00 PM">02:00 PM - 03:00 PM</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit" 
                  class="px-5 py-2.5 bg-gov-orange hover:bg-gov-orange/90 text-white rounded-xl text-xs font-bold shadow-lg self-start mt-2"
                >
                  {lang === 'EN' ? 'Book Appointment Slot' : 'नियुक्ति स्लॉट बुक करें'}
                </button>

              </form>
            )}

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB MODULE: INBOX NOTIFICATIONS ALERTS */}
        {/* ========================================================= */}
        {activeTab === 'notification' && (
          <div class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-4">
            <h3 class="font-extrabold text-sm text-gov-navy dark:text-white border-b pb-2 dark:border-slate-700 flex items-center gap-2">
              <Bell size={18} class="text-gov-blue dark:text-gov-light" />
              <span>{lang === 'EN' ? 'Notification Alert Inbox' : 'अधिसूचना इनबॉक्स'}</span>
            </h3>

            <div class="flex flex-col gap-3">
              {notifications.filter(n => n.user_id === currentUser.id || n.user_id === 101).length === 0 ? (
                <p class="text-xs text-slate-400 text-center py-6">No notifications in your inbox.</p>
              ) : (
                notifications
                  .filter(n => n.user_id === currentUser.id || n.user_id === 101)
                  .map(notif => (
                    <div key={notif.id} class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 text-xs text-left">
                      <div class="flex justify-between items-center mb-1">
                        <h4 class="font-extrabold text-slate-800 dark:text-white">{notif.title}</h4>
                        <span class="text-[9px] text-slate-400 font-semibold">{new Date(notif.created_at).toLocaleDateString()}</span>
                      </div>
                      <p class="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{notif.message}</p>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB MODULE: SYSTEM AUDIT ACCESS LOGS */}
        {/* ========================================================= */}
        {activeTab === 'logs' && (
          <div class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-4">
            <h3 class="font-extrabold text-sm text-gov-navy dark:text-white border-b pb-2 dark:border-slate-700 flex items-center gap-2">
              <Activity size={18} class="text-gov-blue dark:text-gov-light" />
              <span>{lang === 'EN' ? 'Security & Access Audits logs' : 'सुरक्षा और एक्सेस ऑडिट लॉग'}</span>
            </h3>

            <p class="text-xs text-slate-400 text-left mb-2">
              {lang === 'EN' 
                ? 'To ensure high transparency, compliance auditing, and forensics protection against malicious actors, all transactions are recorded with timestamps.'
                : 'सभी लेनदेन टाइमस्टैम्प के साथ रिकॉर्ड किए जाते हैं ताकि पूर्ण पारदर्शिता और सुरक्षा बनी रहे।'}
            </p>

            <div class="flex flex-col gap-2.5 text-xs text-left max-h-[300px] overflow-y-auto pr-1">
              {activities
                .filter(act => act.user_id === currentUser.id)
                .map(act => (
                  <div key={act.id} class="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex justify-between gap-4 font-mono text-[10px] text-slate-500">
                    <span class="font-semibold text-slate-700 dark:text-slate-300">✓ {act.action}</span>
                    <div class="flex gap-4 shrink-0 font-bold">
                      <span>IP: {act.ip_address}</span>
                      <span>{new Date(act.created_at).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
