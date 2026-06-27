const express = require('express');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { JWT_SECRET } = require('../middleware/auth');
const { authRateLimiter } = require('../middleware/security');

const router = express.Router();

// Mock database storage for demo (simulating user query fallback)
const MOCK_DB_USERS = [
  {
    id: 1,
    full_name: 'Amit Sharma',
    email: 'amit.sharma@example.com',
    phone_number: '9876543210',
    aadhaar_number: '123456789012',
    role: 'citizen',
    password: 'citizen123',
    is_verified: true
  },
  {
    id: 3,
    full_name: 'Rajesh Kumar',
    email: 'rajesh.kumar@gov.in',
    phone_number: '9876543212',
    aadhaar_number: '123456789014',
    role: 'officer',
    password: 'officer123',
    is_verified: true
  },
  {
    id: 4,
    full_name: 'Inspector Vijay Patil',
    email: 'vijay.patil@police.gov.in',
    phone_number: '9876543213',
    aadhaar_number: '123456789015',
    role: 'police',
    password: 'police123',
    is_verified: true
  },
  {
    id: 5,
    full_name: 'Dr. Shrikant Verma',
    email: 'shrikant.verma@gov.in',
    phone_number: '9876543214',
    aadhaar_number: '123456789016',
    role: 'admin',
    password: 'admin123',
    is_verified: true
  }
];

// In-memory OTP store for session validation
const activeOtps = new Map();

// SMTP transporter getter reading backend/.env
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
 * @route POST /api/auth/send-email-otp
 * @desc Sends a real OTP verification code to the user's Gmail address
 */
router.post('/send-email-otp', authRateLimiter, async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid Email: Please provide a valid email address.' 
    });
  }

  // Generate 6-digit numeric OTP
  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

  // Store OTP with 10-minute expiry
  const key = `${email.toLowerCase()}_email_otp`;
  activeOtps.set(key, {
    otp: generatedOtp,
    expiresAt: Date.now() + 10 * 60 * 1000
  });

  console.log(`[SmartPassport Secure Mailer] OTP generated for ${email}: ${generatedOtp}`);

  const transporter = getTransporter();

  if (transporter) {
    try {
      const mailOptions = {
        from: `"SmartPassport AI Support" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: '🇮🇳 SmartPassport AI Registration OTP Verification Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e0e0e0; border-radius: 16px; background-color: #fdfdfd; box-shadow: 0 4px 10px rgba(0,0,0,0.03);">
            <div style="text-align: center; border-bottom: 3px solid #ff671f; padding-bottom: 20px;">
              <h2 style="color: #134074; margin: 0; font-size: 24px; font-family: 'Georgia', serif; font-weight: bold; letter-spacing: 0.5px;">SmartPassport AI</h2>
              <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #666; font-weight: 800; display: block; margin-top: 4px;">Ministry of External Affairs | Government of India</span>
            </div>
            
            <div style="padding: 30px 15px; text-align: left; line-height: 1.6; color: #333333;">
              <p style="font-size: 14px; font-weight: bold; margin-bottom: 15px;">Jai Hind,</p>
              <p style="font-size: 13.5px; margin-bottom: 25px;">You have initiated the account registration process on the official SmartPassport AI management portal. Please use the secure verification OTP displayed below to verify your email identity:</p>
              
              <div style="margin: 30px auto; text-align: center; background-color: #f3f7fa; padding: 20px 30px; border-radius: 12px; border: 1px solid #d4e3f0; width: fit-content;">
                <span style="font-size: 9px; color: #555555; font-weight: 800; text-transform: uppercase; display: block; margin-bottom: 6px; letter-spacing: 1px;">Secure Email Verification OTP</span>
                <strong style="font-size: 32px; color: #ff671f; font-family: monospace; letter-spacing: 5px; font-weight: 900;">${generatedOtp}</strong>
              </div>
              
              <p style="font-size: 11px; color: #777777; font-style: italic; margin-top: 25px; line-height: 1.5; border-left: 2px solid #ff671f; padding-left: 10px;">
                * This OTP verification code is valid for exactly 10 minutes. 
                For safety reasons, do not share this OTP or personal Aadhaar details with unauthorized government agents or external parties.
              </p>
            </div>
            
            <div style="text-align: center; border-top: 1px solid #eeeeee; padding-top: 20px; font-size: 9.5px; color: #999999;">
              <p style="margin: 4px 0;">This is an automated security system notification. Please do not reply directly to this mail address.</p>
              <p style="margin: 4px 0; font-weight: bold; color: #134074; text-transform: uppercase; letter-spacing: 0.5px;">SmartPassport AI Systems © 2026</p>
            </div>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log(`[SmartPassport Secure Mailer] Real email dispatched successfully to: ${email}`);

      return res.status(200).json({
        success: true,
        message: 'OTP dispatched successfully to your email address.',
        isRealEmail: true,
        demoOtp: generatedOtp
      });

    } catch (err) {
      console.error('[SmartPassport Secure Mailer] SMTP sending error:', err);
      return res.status(200).json({
        success: true,
        message: 'OTP generated. Real email dispatch failed due to server SMTP config. Mock OTP printed in server console.',
        isRealEmail: false,
        demoOtp: generatedOtp
      });
    }
  } else {
    console.log(`[SmartPassport Secure Mailer] SMTP credentials not set in backend/.env. Simulated dispatch.`);
    return res.status(200).json({
      success: true,
      message: 'OTP generated (Simulated). Real email dispatch requires SMTP credentials in backend/.env. Mock OTP shown below.',
      isRealEmail: false,
      demoOtp: generatedOtp
    });
  }
});

router.post('/aadhaar-otp', authRateLimiter, async (req, res) => {
  const { aadhaar_number, phone_number, email } = req.body;

  if (!aadhaar_number || aadhaar_number.length !== 12 || isNaN(aadhaar_number)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid Aadhaar: Must be a 12-digit numeric identifier.' 
    });
  }

  if (!phone_number || phone_number.length !== 10 || isNaN(phone_number)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid Phone: Must be exactly a 10-digit contact number.' 
    });
  }

  if (!email || !email.toLowerCase().endsWith('@gmail.com')) {
    return res.status(400).json({
      success: false,
      error: 'Invalid Email: Only @gmail.com addresses are acceptable.'
    });
  }

  // Generate 6-digit numeric OTP code
  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Store with a 5-minute expiration
  const key = `${aadhaar_number}_otp`;
  activeOtps.set(key, {
    otp: generatedOtp,
    expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
  });

  console.log(`[Gov-Aadhaar Gateway] OTP generated for Aadhaar ${aadhaar_number}: ${generatedOtp}`);

  const transporter = getTransporter();

  if (email && email.includes('@') && transporter) {
    try {
      const mailOptions = {
        from: `"Gov-Aadhaar Verification" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: '🇮🇳 Aadhaar Verification OTP Code - SmartPassport AI',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e0e0e0; border-radius: 16px; background-color: #fdfdfd; box-shadow: 0 4px 10px rgba(0,0,0,0.03);">
            <div style="text-align: center; border-bottom: 3px solid #ff671f; padding-bottom: 20px;">
              <h2 style="color: #134074; margin: 0; font-size: 24px; font-family: 'Georgia', serif; font-weight: bold; letter-spacing: 0.5px;">Gov-Aadhaar Gateway</h2>
              <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #666; font-weight: 800; display: block; margin-top: 4px;">UIDAI | Government of India</span>
            </div>
            
            <div style="padding: 30px 15px; text-align: left; line-height: 1.6; color: #333333;">
              <p style="font-size: 14px; font-weight: bold; margin-bottom: 15px;">Jai Hind,</p>
              <p style="font-size: 13.5px; margin-bottom: 25px;">You have requested an Aadhaar verification code for registration on the MEA SmartPassport AI Portal. Please use the secure 6-digit verification OTP below to verify your identity:</p>
              
              <div style="margin: 30px auto; text-align: center; background-color: #f3f7fa; padding: 20px 30px; border-radius: 12px; border: 1px solid #d4e3f0; width: fit-content;">
                <span style="font-size: 9px; color: #555555; font-weight: 800; text-transform: uppercase; display: block; margin-bottom: 6px; letter-spacing: 1px;">Secure Aadhaar Verification OTP</span>
                <strong style="font-size: 32px; color: #ff671f; font-family: monospace; letter-spacing: 5px; font-weight: 900;">${generatedOtp}</strong>
              </div>
              
              <p style="font-size: 11px; color: #777777; font-style: italic; margin-top: 25px; line-height: 1.5; border-left: 2px solid #ff671f; padding-left: 10px;">
                * This OTP verification code is valid for exactly 5 minutes. 
                Do not share this code or personal Aadhaar credentials with unauthorized third parties.
              </p>
            </div>
            
            <div style="text-align: center; border-top: 1px solid #eeeeee; padding-top: 20px; font-size: 9.5px; color: #999999;">
              <p style="margin: 4px 0;">This is an automated system notification. Please do not reply directly to this email.</p>
              <p style="margin: 4px 0; font-weight: bold; color: #134074; text-transform: uppercase; letter-spacing: 0.5px;">UIDAI Verification Systems © 2026</p>
            </div>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log(`[Gov-Aadhaar Gateway] Real verification email dispatched successfully to: ${email}`);

      return res.status(200).json({
        success: true,
        message: 'Aadhaar OTP sent successfully to your email address.',
        isRealEmail: true,
        demoOtp: generatedOtp
      });
    } catch (err) {
      console.error('[Gov-Aadhaar Gateway] SMTP email error:', err);
    }
  }

  // Fallback if no SMTP transporter or email fails
  return res.status(200).json({
    success: true,
    message: 'OTP generated (Simulated). Real email dispatch requires SMTP credentials in backend/.env. Mock OTP shown below.',
    isRealEmail: false,
    demoOtp: generatedOtp
  });
});

/**
 * @route POST /api/auth/register
 * @desc Completes registration by verifying Aadhaar OTP and creating a new citizen user profile
 */
router.post('/register', (req, res) => {
  const { full_name, email, password, phone_number, aadhaar_number, role, otp } = req.body;

  if (!full_name || !email || !password || !phone_number || !aadhaar_number || !otp) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing required credentials: Check all registration fields.' 
    });
  }

  if (!email.toLowerCase().endsWith('@gmail.com')) {
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid Email: Only @gmail.com addresses are acceptable.' 
    });
  }

  if (password.length !== 8) {
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid Password: Portal password must be exactly 8 characters long.' 
    });
  }

  if (phone_number.length !== 10 || isNaN(phone_number)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid Phone: Must be exactly a 10-digit contact number.' 
    });
  }

  const key = `${aadhaar_number}_otp`;
  const savedOtpRecord = activeOtps.get(key);

  if (!savedOtpRecord || savedOtpRecord.expiresAt < Date.now()) {
    activeOtps.delete(key);
    return res.status(400).json({ 
      success: false, 
      error: 'Expired: The OTP has expired. Please request a new validation OTP.' 
    });
  }

  if (savedOtpRecord.otp !== otp) {
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid OTP: Aadhaar verification failed.' 
    });
  }

  // Clear OTP on success
  activeOtps.delete(key);

  const newUser = {
    id: Date.now(),
    full_name,
    email,
    password,
    phone_number,
    aadhaar_number,
    role: role || 'citizen',
    is_verified: true
  };

  // Push user to our mock database memory list so they can log in standardly afterward
  MOCK_DB_USERS.push(newUser);

  const token = jwt.sign(
    { id: newUser.id, email: newUser.email, role: newUser.role, full_name: newUser.full_name },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  return res.status(201).json({
    success: true,
    message: 'Registration and Aadhaar validation successful.',
    token,
    user: newUser
  });
});

/**
 * @route POST /api/auth/login
 * @desc Login using registered Email and Password. Yields a stateful session JWT.
 */
router.post('/login', authRateLimiter, (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing credentials: Email and Password are required.' 
    });
  }

  // Search in mock user collection
  const matchedUser = MOCK_DB_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!matchedUser || (matchedUser.password && matchedUser.password !== password)) {
    return res.status(401).json({ 
      success: false, 
      error: 'Unauthorized: Incorrect email or password.' 
    });
  }

  // For simulation, any password matching the demo credentials standard is accepted
  const token = jwt.sign(
    { id: matchedUser.id, email: matchedUser.email, role: matchedUser.role, full_name: matchedUser.full_name },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  return res.status(200).json({
    success: true,
    message: 'Authentication successful. Welcome to SmartPassport AI.',
    token,
    user: matchedUser
  });
});

module.exports = router;
