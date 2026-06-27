require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const { globalRateLimiter, inputShield } = require('./middleware/security');

// Import modular routing handlers
const authRouter = require('./routes/auth');
const appRouter = require('./routes/application');
const chatbotRouter = require('./routes/chatbot');

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

// 1. Core Security Middlewares
app.use(helmet()); // Sets protective HTTP headers
app.use(cors({
  origin: '*', // Allow connections from frontend Vite host during demo
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); // Parses incoming JSON body payloads
app.use(inputShield); // Automatically purges malicious strings (SQL injection / XSS)
app.use('/api/', globalRateLimiter); // Protect API resources with global rate limiting

// 2. Health Check API
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SmartPassport AI Backend Gateway is running securely.',
    timestamp: new Date().toISOString()
  });
});

// 3. API Route Registration
app.use('/api/auth', authRouter);
app.use('/api/application', appRouter);
app.use('/api/chatbot', chatbotRouter);

// 4. Production: Serve React frontend from /public
if (isProduction) {
  app.use(express.static(path.join(__dirname, 'public')));

  // SPA catch-all: any non-API route serves index.html for React Router
  app.get('*', (req, res) => {
    // Don't catch API routes
    if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
      return res.status(404).json({
        success: false,
        error: 'Requested API resource not found on SmartPassport AI server.'
      });
    }
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
} else {
  // Development: 404 for any unmatched route
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: 'Requested API resource not found on SmartPassport AI server.'
    });
  });
}

// 5. Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[Express Engine Error]:', err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error: Secure channel experienced an unexpected fault.'
  });
});

// 6. Launch Server
app.listen(PORT, () => {
  console.log('===============================================================');
  console.log(`🇮🇳  SmartPassport AI - Official Gateway Online`);
  console.log(`🔗  Listening securely on: http://localhost:${PORT}`);
  console.log(`🔐  JWT Auth, RBAC, Captcha, & XSS Sanitization ACTIVE`);
  console.log('===============================================================');
});
