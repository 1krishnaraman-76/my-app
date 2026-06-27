import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

// ─── Seed Data ───────────────────────────────────────────────────────────────
// Bump SEED_VERSION to reset localStorage back to defaults (for development).
const SEED_VERSION = 'v3';

const SEED_USERS = [
  { id: 1, full_name: 'Amit Sharma',          email: 'amit.sharma@example.com',   role: 'citizen', phone_number: '9876543210', aadhaar_number: '123456789012', password: 'citizen123' },
  { id: 2, full_name: 'Priya Patel',           email: 'priya.patel@example.com',   role: 'citizen', phone_number: '9876543211', aadhaar_number: '123456789013', password: 'citizen123' },
  { id: 3, full_name: 'Rajesh Kumar',          email: 'rajesh.kumar@gov.in',       role: 'officer', phone_number: '9876543212', aadhaar_number: '123456789014', password: 'officer123' },
  { id: 4, full_name: 'Inspector Vijay Patil', email: 'vijay.patil@police.gov.in', role: 'police',  phone_number: '9876543213', aadhaar_number: '123456789015', password: 'police123' },
  { id: 5, full_name: 'Dr. Shrikant Verma',    email: 'shrikant.verma@gov.in',     role: 'admin',   phone_number: '9876543214', aadhaar_number: '123456789016', password: 'admin123'  }
];

const SEED_APPLICATIONS = [
  {
    id: 1, user_id: 1, application_type: 'new', status: 'under_review',
    tracking_id: 'IND-20260523-984321', first_name: 'Amit', last_name: 'Sharma',
    date_of_birth: '1995-08-15', gender: 'male',
    address_line1: 'Flat 402, Shiv Ganga Heights', address_line2: 'Sector 15, Vashi',
    city: 'Navi Mumbai', state: 'Maharashtra', pincode: '400703',
    employment_status: 'private_sector',
    emergency_contact_name: 'Sunita Sharma', emergency_contact_phone: '9812345678',
    payment_completed: true, current_step: 'preview',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    documents: [
      { document_type: 'aadhaar', file_path: 'amit_aadhaar.pdf', ocr_status: 'verified', ocr_extracted_text: 'Name: Amit Sharma; DOB: 15-08-1995; Gender: Male; Aadhaar No: 123456789012' },
      { document_type: 'photo',   file_path: 'amit_photo.jpg',   ocr_status: 'verified', face_match_score: 98.4 },
      { document_type: 'signature', file_path: 'amit_sig.jpg',   ocr_status: 'verified' }
    ],
    officer_remarks: 'Documents uploaded and scanned matches standard. Scheduled for police address verification.',
    appointment: { office_location: 'PSK Mumbai (Lower Parel)', appointment_date: '2026-06-01', appointment_slot: '10:00 AM', status: 'scheduled', qr_code_token: 'QR_TOK_AMIT_8329471924' }
  },
  {
    id: 2, user_id: 2, application_type: 'renewal', status: 'police_verification',
    tracking_id: 'IND-20260523-743210', first_name: 'Priya', last_name: 'Patel',
    date_of_birth: '1990-12-04', gender: 'female',
    address_line1: 'Building 12, Nandanvan Society', address_line2: 'Opposite Town Hall',
    city: 'Ahmedabad', state: 'Gujarat', pincode: '380001',
    employment_status: 'government',
    emergency_contact_name: 'Ramesh Patel', emergency_contact_phone: '9823456789',
    payment_completed: true, current_step: 'preview',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    documents: [
      { document_type: 'aadhaar', file_path: 'priya_aadhaar.pdf', ocr_status: 'verified', ocr_extracted_text: 'Name: Priya Patel; DOB: 04-12-1990; Gender: Female; Aadhaar No: 123456789013' },
      { document_type: 'photo',   file_path: 'priya_photo.jpg',   ocr_status: 'verified', face_match_score: 94.6 }
    ],
    police_status: 'pending',
    assigned_police_station: 'Navrangpura Police Station, Ahmedabad',
    appointment: { office_location: 'PSK Ahmedabad (Mithakali)', appointment_date: '2026-05-18', appointment_slot: '11:30 AM', status: 'attended', qr_code_token: 'QR_TOK_PRIYA_7438102947' }
  }
];

const SEED_PAYMENTS = [
  { id: 1, application_id: 1, transaction_id: 'pay_Rzp9138402948', amount: 1500, status: 'success', paid_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 2, application_id: 2, transaction_id: 'pay_Rzp7482910384', amount: 1500, status: 'success', paid_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() }
];

const SEED_NOTIFICATIONS = [
  { id: 1, user_id: 1, title: 'Aadhaar Verified',       message: 'Your Aadhaar Card details matched successfully via AI OCR.', is_read: false, created_at: new Date().toISOString() },
  { id: 2, user_id: 1, title: 'Appointment Booked',     message: 'Your verification slot is booked for 01-06-2026 at PSK Mumbai.', is_read: false, created_at: new Date().toISOString() },
  { id: 3, user_id: 2, title: 'Office Review Approved', message: 'Documents cleared. Application sent to Navrangpura Police.', is_read: true, created_at: new Date().toISOString() }
];

const SEED_ACTIVITIES = [
  { id: 1, user_id: 1, action: 'Citizen Registered and verified Aadhaar OTP',              ip_address: '192.168.1.5', created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 2, user_id: 1, action: 'Completed passport multi-step form entry',                  ip_address: '192.168.1.5', created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 3, user_id: 1, action: 'Processed passport application payment (INR 1500)',         ip_address: '192.168.1.5', created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 4, user_id: 3, action: 'Officer Rajesh Kumar fetched applications awaiting audit',  ip_address: '10.0.4.15',   created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() }
];

// ─── LocalStorage Helpers ─────────────────────────────────────────────────────
const loadFromStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* storage quota exceeded — fail silently */ }
};

// ─── Seed Initializer ─────────────────────────────────────────────────────────
// Runs once per SEED_VERSION. Preserves any extra users registered after seeding.
const initializeSeed = () => {
  const storedVersion = localStorage.getItem('smartpassport_seed_version');
  if (storedVersion !== SEED_VERSION) {
    const existingUsers = loadFromStorage('smartpassport_users', []);
    // Keep users that were registered after the seed (id > 5 or timestamp-based ids)
    const extraUsers = existingUsers.filter(u => !SEED_USERS.find(s => s.id === u.id));
    saveToStorage('smartpassport_users', [...SEED_USERS, ...extraUsers]);
    saveToStorage('smartpassport_applications', SEED_APPLICATIONS);
    saveToStorage('smartpassport_payments', SEED_PAYMENTS);
    saveToStorage('smartpassport_notifications', SEED_NOTIFICATIONS);
    saveToStorage('smartpassport_activities', SEED_ACTIVITIES);
    localStorage.setItem('smartpassport_seed_version', SEED_VERSION);
  }
};
initializeSeed();

// ─────────────────────────────────────────────────────────────────────────────

export const AppProvider = ({ children }) => {
  // 1. Language & Styling configurations
  const [lang, setLang] = useState('EN'); // 'EN' or 'HN'
  const [darkMode, setDarkMode] = useState(false);

  // 2. Role state
  const [currentRole, setCurrentRole] = useState('citizen'); // citizen | officer | police | admin

  // 3. Users — loaded from localStorage so registered accounts survive page refresh
  const [users, setUsers] = useState(() => loadFromStorage('smartpassport_users', SEED_USERS));

  const [currentUser, setCurrentUser] = useState(null);

  // 4. Applications — persisted
  const [applications, setApplications] = useState(() => loadFromStorage('smartpassport_applications', SEED_APPLICATIONS));

  // 5. Payments — persisted
  const [payments, setPayments] = useState(() => loadFromStorage('smartpassport_payments', SEED_PAYMENTS));

  // 6. Notifications — persisted
  const [notifications, setNotifications] = useState(() => loadFromStorage('smartpassport_notifications', SEED_NOTIFICATIONS));

  // 7. Audit Trail — persisted
  const [activities, setActivities] = useState(() => loadFromStorage('smartpassport_activities', SEED_ACTIVITIES));

  // ─── Auto-sync every state change to localStorage ──────────────────────────
  useEffect(() => { saveToStorage('smartpassport_users',        users);         }, [users]);
  useEffect(() => { saveToStorage('smartpassport_applications', applications);  }, [applications]);
  useEffect(() => { saveToStorage('smartpassport_payments',     payments);      }, [payments]);
  useEffect(() => { saveToStorage('smartpassport_notifications',notifications); }, [notifications]);
  useEffect(() => { saveToStorage('smartpassport_activities',   activities);    }, [activities]);

  // Handle dark mode DOM changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Helpers for audit trailing
  const recordActivity = (actionText) => {
    const newAct = {
      id: Date.now(),
      user_id: currentUser ? currentUser.id : null,
      action: actionText,
      ip_address: '192.168.42.' + Math.floor(10 + Math.random() * 89),
      created_at: new Date().toISOString()
    };
    setActivities(prev => [newAct, ...prev]);
  };

  // Helper for notification triggers
  const addNotification = (userId, title, message) => {
    const newNotif = {
      id: Date.now(),
      user_id: userId,
      title,
      message,
      is_read: false,
      created_at: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Helper dictionary for localized text
  const translations = {
    EN: {
      appName: 'SmartPassport',
      nationalPortal: 'Government of India | GlobalPassport Portal',
      home: 'Home',
      services: 'Services',
      faq: 'FAQ & Help',
      contact: 'Contact Us',
      applyNow: 'Apply for Passport',
      trackApp: 'Track Status',
      emergencySlogan: 'Fast, secure, and smart passport clearance ecosystem.',
      selectRole: 'Select Workspace Role:',
      citizen: 'Citizen / User',
      officer: 'Passport Officer',
      police: 'Police Officer',
      admin: 'Super Admin',
      darkMode: 'Dark Mode',
      language: 'Language',
    },
    HN: {
      appName: 'स्मार्टपासपोर्ट',
      nationalPortal: 'भारत सरकार | ग्लोबलपासपोर्ट पोर्टल',
      home: 'मुख्य पृष्ठ',
      services: 'सेवाएं',
      faq: 'एफएक्यू और सहायता',
      contact: 'संपर्क करें',
      applyNow: 'पासपोर्ट के लिए आवेदन करें',
      trackApp: 'स्थिति ट्रैक करें',
      emergencySlogan: 'तेज, सुरक्षित और स्मार्ट पासपोर्ट निकासी प्रणाली।',
      selectRole: 'कार्यक्षेत्र भूमिका चुनें:',
      citizen: 'नागरिक / उपयोगकर्ता',
      officer: 'पासपोर्ट अधिकारी',
      police: 'पुलिस अधिकारी',
      admin: 'सुपर एडमिन',
      darkMode: 'डार्क मोड',
      language: 'भाषा',
    }
  };

  const t = (key) => {
    return translations[lang][key] || key;
  };

  const triggerEmailNotification = (email, fullName, status, trackingId, remarks = '', speedpostId = '') => {
    fetch('http://localhost:5000/api/application/send-status-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        full_name: fullName,
        status,
        tracking_id: trackingId,
        remarks,
        speedpost_id: speedpostId
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log('[SmartPassport Email Dispatch Response]:', data.message);
    })
    .catch(err => {
      console.error('[SmartPassport Email Dispatch Error]:', err);
    });
  };

  // Simulation operations for citizen
  const applyPassport = (formData) => {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const trackingId = `IND-${dateStr}-${randomSuffix}`;

    const newApp = {
      ...formData,
      id: Date.now(),
      user_id: currentUser.id,
      status: 'submitted',
      tracking_id: trackingId,
      payment_completed: false,
      created_at: new Date().toISOString(),
      documents: []
    };

    setApplications(prev => [...prev, newApp]);
    recordActivity(`Citizen created a new passport application (${formData.application_type.toUpperCase()}). Tracking ID: ${trackingId}`);
    addNotification(currentUser.id, 'Application Submitted', `Your application ${trackingId} has been filed successfully. Complete fee payment to unlock document slot scheduling.`);
    
    // Dispatch automated email notification
    const applicantEmail = currentUser ? currentUser.email : 'citizen@example.com';
    const applicantName = currentUser ? currentUser.full_name : `${formData.first_name} ${formData.last_name}`;
    triggerEmailNotification(applicantEmail, applicantName, 'submitted', trackingId);

    return newApp;
  };

  const makePayment = (appId) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return { ...app, payment_completed: true };
      }
      return app;
    }));

    const transactionId = 'pay_Rzp' + Math.floor(1000000000 + Math.random() * 9000000000);
    const newPay = {
      id: Date.now(),
      application_id: appId,
      transaction_id: transactionId,
      amount: 1500,
      status: 'success',
      paid_at: new Date().toISOString()
    };

    setPayments(prev => [...prev, newPay]);
    recordActivity(`Processed payment for application ID ${appId}. Receipt: ${transactionId}`);
    
    const app = applications.find(a => a.id === appId);
    if (app) {
      addNotification(app.user_id, 'Payment Processed Successfully', `Receipt generated for transaction ${transactionId}. Proceed to book physical verification slot.`);
    }
  };

  const bookSlot = (appId, location, date, slot) => {
    const qrToken = 'QR_TOK_' + Math.floor(1000000000 + Math.random() * 9000000000);
    
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          status: 'under_review',
          appointment: {
            office_location: location,
            appointment_date: date,
            appointment_slot: slot,
            status: 'scheduled',
            qr_code_token: qrToken
          }
        };
      }
      return app;
    }));

    recordActivity(`Citizen scheduled appointment for application ID ${appId} on ${date} at ${location}`);
    
    const app = applications.find(a => a.id === appId);
    if (app) {
      addNotification(app.user_id, 'Appointment Slot Scheduled', `Document verification scheduled at ${location} for ${date} (${slot}). QR code slip issued.`);
    }
  };

  const uploadDoc = (appId, docType, file_path, ocrText, faceMatchScore) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        const updatedDocs = [...app.documents.filter(d => d.document_type !== docType)];
        updatedDocs.push({
          document_type: docType,
          file_path,
          ocr_status: 'verified',
          ocr_extracted_text: ocrText,
          face_match_score: faceMatchScore
        });
        return { ...app, documents: updatedDocs };
      }
      return app;
    }));
    recordActivity(`Citizen uploaded document: ${docType} for application ID ${appId}`);
  };

  // Simulation operations for officer
  const officerReviewApp = (appId, status, remarks) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        if (status === 'police_verification') {
          return {
            ...app,
            status: 'police_verification',
            police_status: 'pending',
            assigned_police_station: `${app.city} Police HQ, ${app.state}`,
            officer_remarks: remarks
          };
        } else {
          return {
            ...app,
            status: status,
            officer_remarks: remarks
          };
        }
      }
      return app;
    }));

    const app = applications.find(a => a.id === appId);
    recordActivity(`Officer Rajesh Kumar updated Application ID ${appId} status to '${status}'`);
    if (app) {
      addNotification(app.user_id, 'Officer Review Updated', `Your passport application status was updated to '${status}'. Officer Remarks: ${remarks}`);
      if (status === 'police_verification') {
        addNotification(app.user_id, 'Police Dispatch Alert', `Your file has been sent to local police station for physical address checks.`);
      }

      const applicantUser = users.find(u => u.id === app.user_id);
      const emailVal = applicantUser ? applicantUser.email : 'citizen@example.com';
      const nameVal = `${app.first_name} ${app.last_name}`;
      triggerEmailNotification(emailVal, nameVal, status, app.tracking_id, remarks);
    }
  };

  // Simulation operations for police verification
  const policeReviewApp = (appId, decision, remarks) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          status: decision === 'approve' ? 'police_cleared' : 'under_review',
          police_status: decision === 'approve' ? 'approved' : 'rejected',
          police_remarks: remarks
        };
      }
      return app;
    }));

    const app = applications.find(a => a.id === appId);
    recordActivity(`Police Verification filed for Application ID ${appId}. Decision: ${decision.toUpperCase()}`);
    if (app) {
      addNotification(app.user_id, 'Police Verification Cleared', `Police Verification completed successfully. Your address is verified. File sent to MEA headquarters for final booklet granting.`);

      const applicantUser = users.find(u => u.id === app.user_id);
      const emailVal = applicantUser ? applicantUser.email : 'citizen@example.com';
      const nameVal = `${app.first_name} ${app.last_name}`;
      const mappedStatus = decision === 'approve' ? 'police_cleared' : 'under_review';
      triggerEmailNotification(emailVal, nameVal, mappedStatus, app.tracking_id, remarks);
    }
  };

  // Simulation operations for Super Admin to officially grant the passport book
  const grantPassport = (appId, trackingCode) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          status: 'approved',
          tracking_id_dispatch: trackingCode
        };
      }
      return app;
    }));

    setTimeout(() => {
      const app = applications.find(a => a.id === appId);
      recordActivity(`Admin Dr. Shrikant granted Passport booklet for Application ID ${appId}. Dispatch Code: ${trackingCode}`);
      if (app) {
        addNotification(
          app.user_id,
          'Passport Details Granted & Dispatched! 🇮🇳',
          `Congratulations! Your Passport Application has been officially GRANTED by the Ministry of External Affairs. Your Speed Post tracking ID is: ${trackingCode}. You will receive your booklet at your registered address within 3 working days!`
        );

        const applicantUser = users.find(u => u.id === app.user_id);
        const emailVal = applicantUser ? applicantUser.email : 'citizen@example.com';
        const nameVal = `${app.first_name} ${app.last_name}`;
        triggerEmailNotification(emailVal, nameVal, 'approved', app.tracking_id, '', trackingCode);
      }
    }, 100);
  };

  return (
    <AppContext.Provider value={{
      lang,
      setLang,
      darkMode,
      setDarkMode,
      currentRole,
      setCurrentRole,
      currentUser,
      setCurrentUser,
      users,
      setUsers,
      applications,
      payments,
      notifications,
      activities,
      recordActivity,
      addNotification,
      t,
      applyPassport,
      makePayment,
      bookSlot,
      uploadDoc,
      officerReviewApp,
      policeReviewApp,
      grantPassport
    }}>
      {children}
    </AppContext.Provider>
  );
};
