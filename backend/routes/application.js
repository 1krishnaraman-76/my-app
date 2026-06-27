const express = require('express');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Mock store for persistent demo applications
const MOCK_APPLICATIONS = [
  {
    id: 1,
    user_id: 1,
    application_type: 'new',
    status: 'under_review',
    tracking_id: 'IND-20260523-984321',
    first_name: 'Amit',
    last_name: 'Sharma',
    date_of_birth: '1995-08-15',
    gender: 'male',
    address_line1: 'Flat 402, Shiv Ganga Heights',
    address_line2: 'Sector 15, Vashi',
    city: 'Navi Mumbai',
    state: 'Maharashtra',
    pincode: '400703',
    employment_status: 'private_sector',
    emergency_contact_name: 'Sunita Sharma',
    emergency_contact_phone: '9812345678',
    payment_completed: true,
    current_step: 'preview',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    documents: [
      { document_type: 'aadhaar', file_path: '/uploads/docs/amit_aadhaar.pdf', ocr_status: 'verified', ocr_extracted_text: 'Name: Amit Sharma; DOB: 15-08-1995; Gender: Male; Aadhaar No: 123456789012' },
      { document_type: 'photo', file_path: '/uploads/docs/amit_photo.jpg', ocr_status: 'verified', face_match_score: 98.4 }
    ]
  },
  {
    id: 2,
    user_id: 2,
    application_type: 'renewal',
    status: 'police_verification',
    tracking_id: 'IND-20260523-743210',
    first_name: 'Priya',
    last_name: 'Patel',
    date_of_birth: '1990-12-04',
    gender: 'female',
    address_line1: 'Building 12, Nandanvan Society',
    address_line2: 'Opposite Town Hall',
    city: 'Ahmedabad',
    state: 'Gujarat',
    pincode: '380001',
    employment_status: 'government',
    emergency_contact_name: 'Ramesh Patel',
    emergency_contact_phone: '9823456789',
    payment_completed: true,
    current_step: 'preview',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    documents: [
      { document_type: 'aadhaar', file_path: '/uploads/docs/priya_aadhaar.pdf', ocr_status: 'verified', ocr_extracted_text: 'Name: Priya Patel; DOB: 04-12-1990; Gender: Female; Aadhaar No: 123456789013' },
      { document_type: 'photo', file_path: '/uploads/docs/priya_photo.jpg', ocr_status: 'verified', face_match_score: 94.6 }
    ],
    police_status: 'pending',
    assigned_police_station: 'Navrangpura Police Station, Ahmedabad'
  }
];

/**
 * @route GET /api/application/list
 * @desc Retrieve user-specific or role-wide applications (Admin/Officer role validation)
 */
router.get('/list', authenticateJWT, (req, res) => {
  const { role, id: userId } = req.user;

  if (role === 'admin' || role === 'officer') {
    return res.status(200).json({ success: true, applications: MOCK_APPLICATIONS });
  }

  if (role === 'police') {
    // Only return applications assigned for police checks
    const assignedApps = MOCK_APPLICATIONS.filter(app => app.status === 'police_verification');
    return res.status(200).json({ success: true, applications: assignedApps });
  }

  // Otherwise, return only citizen's personal application record
  const userApps = MOCK_APPLICATIONS.filter(app => app.user_id === userId);
  return res.status(200).json({ success: true, applications: userApps });
});

/**
 * @route POST /api/application/submit
 * @desc Draft submission or final application lock. Triggers tracking ID generation.
 */
router.post('/submit', authenticateJWT, (req, res) => {
  const { 
    application_type, 
    first_name, 
    last_name, 
    date_of_birth, 
    gender, 
    address_line1, 
    address_line2, 
    city, 
    state, 
    pincode, 
    employment_status, 
    emergency_contact_name, 
    emergency_contact_phone,
    is_draft
  } = req.body;

  if (!is_draft && (!application_type || !first_name || !last_name || !date_of_birth || !address_line1 || !city || !state || !pincode)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Form Incomplete: Missing required passport applicant details.' 
    });
  }

  const dateToken = new Date().toISOString().slice(0,10).replace(/-/g,'');
  const randomSerial = Math.floor(100000 + Math.random() * 900000);
  const trackingId = `IND-${dateToken}-${randomSerial}`;

  const newApp = {
    id: MOCK_APPLICATIONS.length + 1,
    user_id: req.user.id,
    application_type,
    status: is_draft ? 'submitted' : 'under_review',
    tracking_id: trackingId,
    first_name,
    last_name,
    date_of_birth,
    gender,
    address_line1,
    address_line2,
    city,
    state,
    pincode,
    employment_status,
    emergency_contact_name,
    emergency_contact_phone,
    payment_completed: false,
    current_step: is_draft ? 'personal' : 'preview',
    created_at: new Date().toISOString(),
    documents: []
  };

  MOCK_APPLICATIONS.push(newApp);

  return res.status(201).json({
    success: true,
    message: is_draft ? 'Draft passport application saved.' : 'Passport application locked & submitted successfully.',
    tracking_id: trackingId,
    application: newApp
  });
});

/**
 * @route POST /api/application/ocr-validate
 * @desc Mock upload handler. Performs simulated AI OCR reading and Facial comparison validation.
 */
router.post('/ocr-validate', authenticateJWT, (req, res) => {
  const { document_type, doc_name } = req.body;

  if (!document_type) {
    return res.status(400).json({ 
      success: false, 
      error: 'Upload failed: Specify document classification type.' 
    });
  }

  // Simulate remote AI Analysis computation delay and return simulated results
  let ocr_extracted_text = '';
  let face_match_score = null;

  if (document_type === 'aadhaar') {
    ocr_extracted_text = `Name: ${req.user.full_name}; Document Type: Aadhaar; ID: ${Math.floor(100000000000 + Math.random() * 900000000000)}; Extraction Match: Valid.`;
  } else if (document_type === 'pan') {
    ocr_extracted_text = `Name: ${req.user.full_name}; Document Type: PAN; PAN ID: ABCDE${Math.floor(1000 + Math.random() * 9000)}F; Extraction Match: Valid.`;
  } else if (document_type === 'photo') {
    // Generate AI matching score for Citizen's profile picture against ID database
    face_match_score = parseFloat((85 + Math.random() * 14).toFixed(1)); // 85% to 99%
  }

  return res.status(200).json({
    success: true,
    message: 'AI Document verification pipeline completed.',
    ocr_extracted_text,
    face_match_score,
    verification_status: 'verified'
  });
});

/**
 * @route POST /api/application/review/:id
 * @desc Allows Passport Officer to approve/reject documents or forward application to Police Verification
 */
router.post('/review/:id', authenticateJWT, authorizeRoles(['officer', 'admin']), (req, res) => {
  const { id } = req.params;
  const { status, remarks } = req.body;

  const app = MOCK_APPLICATIONS.find(a => a.id === parseInt(id));

  if (!app) {
    return res.status(404).json({ success: false, error: 'Application record not found.' });
  }

  if (status === 'police_verification') {
    app.status = 'police_verification';
    app.police_status = 'pending';
    app.assigned_police_station = `${app.city} Head Police Chowki`;
    app.officer_remarks = remarks;
  } else if (status === 'approved') {
    app.status = 'approved';
    app.officer_remarks = remarks;
  } else {
    return res.status(400).json({ success: false, error: 'Invalid verification state selected.' });
  }

  return res.status(200).json({
    success: true,
    message: `Application updated to ${app.status} status. Remarks recorded.`,
    application: app
  });
});

/**
 * @route POST /api/application/police-verify/:id
 * @desc Allows Police Officer to upload verification reports and log remarks
 */
router.post('/police-verify/:id', authenticateJWT, authorizeRoles(['police', 'admin']), (req, res) => {
  const { id } = req.params;
  const { decision, comments } = req.body;

  const app = MOCK_APPLICATIONS.find(a => a.id === parseInt(id));

  if (!app) {
    return res.status(404).json({ success: false, error: 'Application record not found.' });
  }

  if (decision === 'approve') {
    app.status = 'approved';
    app.police_status = 'approved';
    app.police_remarks = comments;
  } else {
    app.status = 'under_review'; // Bounce back to office check
    app.police_status = 'rejected';
    app.police_remarks = comments;
  }

  return res.status(200).json({
    success: true,
    message: `Police verification filed. Application routed back to portal with resolution: ${decision.toUpperCase()}`,
    application: app
  });
});

const nodemailer = require('nodemailer');

const getTransporter = () => {
  if (process.env.GMAIL_USER && process.env.GMAIL_PASS && !process.env.GMAIL_USER.includes('your-email')) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });
  }
  return null;
};

/**
 * @route POST /api/application/send-status-email
 * @desc Sends status stage update emails to citizens
 */
router.post('/send-status-email', (req, res) => {
  const { email, full_name, status, tracking_id, remarks, speedpost_id } = req.body;

  if (!email || !email.includes('@') || !status || !tracking_id) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing parameters: Check email, status, and tracking_id.' 
    });
  }

  let emailSubject = '';
  let emailHtml = '';

  const transporter = getTransporter();

  // Create stage-specific headings and messages
  if (status === 'submitted') {
    emailSubject = `🇮🇳 SmartPassport AI - Application Submitted (${tracking_id})`;
    emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e0e0e0; border-radius: 16px; background-color: #fdfdfd; box-shadow: 0 4px 10px rgba(0,0,0,0.03);">
        <div style="text-align: center; border-bottom: 3px solid #ff671f; padding-bottom: 20px;">
          <h2 style="color: #134074; margin: 0; font-size: 24px; font-weight: bold; font-family: 'Georgia', serif;">SmartPassport AI</h2>
          <span style="font-size: 10px; text-transform: uppercase; color: #666; font-weight: 800; display: block; margin-top: 4px;">Ministry of External Affairs | Government of India</span>
        </div>
        <div style="padding: 25px 15px; color: #333333; line-height: 1.6; text-align: left;">
          <p style="font-size: 14px; font-weight: bold;">Jai Hind <strong>${full_name}</strong>,</p>
          <p style="font-size: 13.5px;">Your passport application has been **submitted successfully** on our official MEA Management Portal.</p>
          <div style="background-color: #f3f7fa; padding: 15px; border-radius: 12px; margin: 20px 0; border: 1px solid #d4e3f0; border-left: 4px solid #134074;">
            <p style="margin: 0; font-size: 13px;"><strong>Tracking ID:</strong> <span style="font-family: monospace; font-size: 14px; font-weight: bold; color: #134074;">${tracking_id}</span></p>
            <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">Status: Under Review (Awaiting verification)</p>
          </div>
          <p style="font-size: 12px; color: #555;">Our automated AI OCR verification pipeline has successfully scanned and verified your linked Aadhaar card. Your file has been queued for physical appointment scheduling audits.</p>
        </div>
        <div style="text-align: center; border-top: 1px solid #eeeeee; padding-top: 20px; font-size: 9.5px; color: #999999;">
          <p>Please do not reply directly to this automated MEA notification.</p>
          <p style="font-weight: bold; color: #134074; text-transform: uppercase; letter-spacing: 0.5px;">SmartPassport AI Systems © 2026</p>
        </div>
      </div>
    `;
  } else if (status === 'police_verification') {
    emailSubject = `🇮🇳 SmartPassport AI - Routed to Police Verification (${tracking_id})`;
    emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e0e0e0; border-radius: 16px; background-color: #fdfdfd; box-shadow: 0 4px 10px rgba(0,0,0,0.03);">
        <div style="text-align: center; border-bottom: 3px solid #ff671f; padding-bottom: 20px;">
          <h2 style="color: #134074; margin: 0; font-size: 24px; font-weight: bold; font-family: 'Georgia', serif;">SmartPassport AI</h2>
          <span style="font-size: 10px; text-transform: uppercase; color: #666; font-weight: 800; display: block; margin-top: 4px;">Ministry of External Affairs | Government of India</span>
        </div>
        <div style="padding: 25px 15px; color: #333333; line-height: 1.6; text-align: left;">
          <p style="font-size: 14px; font-weight: bold;">Jai Hind <strong>${full_name}</strong>,</p>
          <p style="font-size: 13.5px;">Your passport application has been audited by MEA Review Officers and **routed for local Police Field Verification**.</p>
          <div style="background-color: #fdfaf2; padding: 15px; border-radius: 12px; margin: 20px 0; border: 1px solid #faebcc; border-left: 4px solid #f0ad4e;">
            <p style="margin: 0; font-size: 13px;"><strong>Tracking ID:</strong> <span style="font-family: monospace; font-size: 14px; font-weight: bold; color: #ff671f;">${tracking_id}</span></p>
            <p style="margin: 5px 0 0 0; font-size: 12px; color: #8a6d3b;">Status: Assigned for physical check checks</p>
          </div>
          <p style="font-size: 13px; font-weight: bold; margin-bottom: 5px;">Officer Remarks:</p>
          <p style="font-size: 12.5px; font-style: italic; background-color: #f9f9f9; padding: 12px; border-radius: 8px; border: 1px solid #eee; color: #555555; margin-top: 0;">"${remarks || 'Documents match validation guidelines. Dispatched to local chowki.'}"</p>
          <p style="font-size: 12px; color: #555; margin-top: 15px;">Your local police headquarters will schedule a physical inspection of your registered residential address shortly. Please keep your original birth proofs and Aadhaar cards ready for inspector verification.</p>
        </div>
        <div style="text-align: center; border-top: 1px solid #eeeeee; padding-top: 20px; font-size: 9.5px; color: #999999;">
          <p>Please do not reply directly to this automated MEA notification.</p>
          <p style="font-weight: bold; color: #134074; text-transform: uppercase; letter-spacing: 0.5px;">SmartPassport AI Systems © 2026</p>
        </div>
      </div>
    `;
  } else if (status === 'police_cleared') {
    emailSubject = `🇮🇳 SmartPassport AI - Police Verification Cleared (${tracking_id})`;
    emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e0e0e0; border-radius: 16px; background-color: #fdfdfd; box-shadow: 0 4px 10px rgba(0,0,0,0.03);">
        <div style="text-align: center; border-bottom: 3px solid #ff671f; padding-bottom: 20px;">
          <h2 style="color: #134074; margin: 0; font-size: 24px; font-weight: bold; font-family: 'Georgia', serif;">SmartPassport AI</h2>
          <span style="font-size: 10px; text-transform: uppercase; color: #666; font-weight: 800; display: block; margin-top: 4px;">Ministry of External Affairs | Government of India</span>
        </div>
        <div style="padding: 25px 15px; color: #333333; line-height: 1.6; text-align: left;">
          <p style="font-size: 14px; font-weight: bold;">Jai Hind <strong>${full_name}</strong>,</p>
          <p style="font-size: 13.5px;">We are pleased to inform you that your **Police Verification check has been CLEARED successfully**.</p>
          <div style="background-color: #dff0d8; border-color: #d6e9c6; border-left: 4px solid #3c763d; padding: 15px; border-radius: 12px; margin: 20px 0;">
            <p style="margin: 0; font-size: 13px; color: #3c763d;"><strong>Tracking ID:</strong> <span style="font-family: monospace; font-size: 14px; font-weight: bold;">${tracking_id}</span></p>
            <p style="margin: 5px 0 0 0; font-size: 12px; color: #3c763d; font-weight: bold;">Status: Local police address audit clear</p>
          </div>
          <p style="font-size: 13px; font-weight: bold; margin-bottom: 5px;">Police Inspector Remarks:</p>
          <p style="font-size: 12.5px; font-style: italic; background-color: #f9f9f9; padding: 12px; border-radius: 8px; border: 1px solid #eee; color: #555555; margin-top: 0;">"${remarks || 'Physical verification completed at registered residence. Clear record found.'}"</p>
          <p style="font-size: 12px; color: #555; margin-top: 15px;">Your file has been routed back to the Ministry of External Affairs central printing gateway for final passport booklet generation, administrative approval, and booklet dispatch.</p>
        </div>
        <div style="text-align: center; border-top: 1px solid #eeeeee; padding-top: 20px; font-size: 9.5px; color: #999999;">
          <p>Please do not reply directly to this automated MEA notification.</p>
          <p style="font-weight: bold; color: #134074; text-transform: uppercase; letter-spacing: 0.5px;">SmartPassport AI Systems © 2026</p>
        </div>
      </div>
    `;
  } else if (status === 'approved') {
    emailSubject = `🇮🇳 SmartPassport AI - Passport Granted & Dispatched! (${tracking_id})`;
    emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e0e0e0; border-radius: 16px; background-color: #fdfdfd; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
        <div style="text-align: center; border-bottom: 3px solid #ff671f; padding-bottom: 20px;">
          <h2 style="color: #134074; margin: 0; font-size: 26px; font-family: 'Georgia', serif; font-weight: bold;">SmartPassport AI</h2>
          <span style="font-size: 10px; text-transform: uppercase; color: #666; font-weight: 800; display: block; margin-top: 4px;">Ministry of External Affairs | Government of India</span>
        </div>
        <div style="padding: 30px 15px; color: #333333; line-height: 1.6; text-align: left;">
          <p style="font-size: 15px; font-weight: bold; color: #3c763d; margin-bottom: 15px;">Jai Hind <strong>${full_name}</strong>,</p>
          <p style="font-size: 14.5px; font-weight: bold; margin-bottom: 20px;">Congratulations! Your Passport Booklet has been officially GRANTED by the Ministry of External Affairs.</p>
          
          <div style="margin: 25px 0; background-color: #f3f7fa; padding: 20px; border-radius: 12px; border: 1px solid #d4e3f0;">
            <span style="font-size: 9px; color: #555555; font-weight: 800; text-transform: uppercase; display: block; margin-bottom: 6px;">Official Speed Post Tracking Code</span>
            <strong style="font-size: 24px; color: #ff671f; font-family: monospace; letter-spacing: 2px;">${speedpost_id || 'SPEEDPOST-IN-8329103'}</strong>
            <p style="margin: 8px 0 0 0; font-size: 11.5px; color: #666;">Application Reference ID: <strong>${tracking_id}</strong></p>
          </div>
          
          <p style="font-size: 12.5px; color: #555;">Your physical passport booklet has been secure-packed and dispatched via India Post Speed Post. You will receive the booklet at your registered address within 3 working days. Please show a valid identity proof to the postman at the time of delivery.</p>
        </div>
        <div style="text-align: center; border-top: 1px solid #eeeeee; padding-top: 20px; font-size: 9.5px; color: #999999;">
          <p>Please do not reply directly to this automated MEA notification.</p>
          <p style="font-weight: bold; color: #134074; text-transform: uppercase; letter-spacing: 0.5px;">SmartPassport AI Systems © 2026</p>
        </div>
      </div>
    `;
  }

  if (transporter) {
    const mailOptions = {
      from: `"SmartPassport AI Gateway" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: emailSubject,
      html: emailHtml
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(`[SmartPassport Real Email Error] SMTP error for ${email}:`, err);
        return res.status(200).json({
          success: true,
          message: 'Status processed. Real email dispatch failed (printed mock template in console).',
          isRealEmail: false,
          status: status
        });
      } else {
        console.log(`[SmartPassport Real Email Dispatched] Stage: ${status} | Recipient: ${email}`);
        return res.status(200).json({
          success: true,
          message: `Real email notification sent successfully for stage: ${status}`,
          isRealEmail: true
        });
      }
    });
  } else {
    console.log(`=============================================================`);
    console.log(`[SIMULATED MEA PASSPORT EMAIL NOTIFICATION]`);
    console.log(`To: ${email}`);
    console.log(`Subject: ${emailSubject}`);
    console.log(`Status Stage: ${status}`);
    if (remarks) console.log(`Remarks: ${remarks}`);
    if (speedpost_id) console.log(`SpeedPost Tracking: ${speedpost_id}`);
    console.log(`=============================================================`);
    return res.status(200).json({
      success: true,
      message: `Status processed. Simulated email logged in server console.`,
      isRealEmail: false,
      status: status
    });
  }
});

module.exports = router;
