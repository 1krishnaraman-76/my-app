const express = require('express');
const router = express.Router();

// Knowledge base for instant AI guidelines responses
const PASSPORT_FAQ_KNOWLEDGE = [
  {
    keywords: ['hi', 'hello', 'hey', 'namaste', 'greetings'],
    response: 'Namaste! 🙏 I am your GlobalPassport AI assistant. How can I help you with your Indian passport application, fee payment, document upload, or scheduling verification today?'
  },
  {
    keywords: ['document', 'aadhaar', 'pan', 'upload', 'photo', 'signature'],
    response: 'For a fresh citizen application, the primary required files are:\n1. Aadhaar Card (Address & identity verification)\n2. PAN Card (Financial/employment validation)\n3. Birth Certificate or School Leaving Certificate (DOB validity)\n4. Passport-size photograph (White background, 2"x2")\n5. Scanned specimen signature.\nYou can upload these directly via our secure S3 Drag-and-Drop section in Step 5 of the Citizen Dashboard!'
  },
  {
    keywords: ['fee', 'payment', 'charge', 'cost', 'money', 'price'],
    response: 'The passport application fee schedule under government regulations is as follows:\n- Fresh / Renewal (Normal - 36 Pages): INR 1,500\n- Fresh / Renewal (Normal - 60 Pages): INR 2,000\n- Tatkal (Urgent - 36 Pages): INR 3,500\n- Minor Passport (36 Pages): INR 1,000\nPayments are processed securely via our integrated Razorpay payment gateway simulation with instant QR receipts!'
  },
  {
    keywords: ['tatkal', 'urgent', 'fast', 'speedy'],
    response: 'Tatkal Passport Applications receive high-priority processing:\n1. Appointments are scheduled within 24-48 hours.\n2. Document validation takes place instantly.\n3. Passports are generally printed and dispatched within 3-4 working days (subject to subsequent post-police verification).\nAn additional Tatkal urgency fee of INR 2,000 applies.'
  },
  {
    keywords: ['police', 'verification', 'station', 'address', 'constable'],
    response: 'Once the Passport Officer approves your documents physically at the Passport Seva Kendra (PSK), your application is routed to your local police station based on your residential address pincode. A police officer will conduct a quick field address check. Make sure to keep your original Aadhaar and PAN handy!'
  },
  {
    keywords: ['status', 'tracking', 'where', 'stage', 'track'],
    response: 'You can check your application progress using the tracking input on the homepage or citizen panel. Status stages transition automatically: Submitted -> Under Review (Officer checks documents) -> Police Verification (Address audit) -> Approved & Printing -> Dispatched (Shipped with tracking link).'
  }
];

const PASSPORT_RELATED_KEYWORDS = [
  'passport', 'visa', 'document', 'aadhaar', 'pan', 'photo', 'signature', 'upload',
  'fee', 'payment', 'charge', 'cost', 'money', 'price', 'tatkal', 'urgent', 'fast',
  'speedy', 'police', 'verification', 'station', 'address', 'constable', 'status',
  'tracking', 'where', 'stage', 'track', 'apply', 'renew', 'slot', 'appointment',
  'office', 'kendra', 'psk', 'pcc', 'authority', 'grant', 'booklet', 'india',
  'seva', 'help', 'assist', 'support', 'guideline'
];

/**
 * @route POST /api/chatbot/query
 * @desc Accepts user question and scans local knowledge base. Simulates OpenAI LLM stream fallback.
 */
router.post('/query', (req, res) => {
  const { query } = req.body;

  if (!query || query.trim() === '') {
    return res.status(400).json({ success: false, error: 'Query parameter cannot be empty.' });
  }

  const cleanQuery = query.toLowerCase();
  
  // 1. Check for specific FAQ matches
  let matchedFaq = PASSPORT_FAQ_KNOWLEDGE.find(faq => 
    faq.keywords.some(keyword => cleanQuery.includes(keyword))
  );

  let responseText = '';
  if (matchedFaq) {
    responseText = matchedFaq.response;
  } else {
    // 2. Check if the query contains any passport-related keywords
    const isPassportRelated = PASSPORT_RELATED_KEYWORDS.some(keyword => cleanQuery.includes(keyword));

    if (isPassportRelated) {
      responseText = `I understand you are asking about passport guidelines. \n\nTo apply for or renew a passport, please log into your Citizen Dashboard, fill in your address details, upload your required documents (Aadhaar & photo), process the secure application fee, and schedule a document check slot at your local Passport Office. \n\nIf you have a specific question about documents, fees, Tatkal, or police verification, feel free to use the quick buttons below!`;
    } else {
      responseText = `I am the GlobalPassport India virtual assistant. I can only assist with passport-related inquiries (such as application processes, required documents, fees, Tatkal, police verification, and slot bookings).\n\nPlease ask a question related to Indian passport services.`;
    }
  }

  // Simulate server thinking latency
  setTimeout(() => {
    return res.status(200).json({
      success: true,
      query,
      response: responseText,
      timestamp: new Date().toISOString()
    });
  }, 400);
});

module.exports = router;
