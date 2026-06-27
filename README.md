# SmartPassport AI – Passport Office Management System

SmartPassport AI is a modern, full-stack government-style Passport Office Management System inspired by the official **Passport Seva Portal**. It is designed with a premium, state-of-the-art UI/UX, unified multi-role dashboards, integrated AI capabilities (OCR checking & Face likeness similarity audits), secure offline simulations, interactive calendared slot bookings, and a dynamic virtual FAQ chatbot assistant.

---

## 🚀 High-Fidelity Features

1. **Gov-Style Aesthetic UI**: High-fidelity official Navy & Ashoka Gold theme, flag tri-colors accents, clean typography, responsive mobile grids, and sleek micro-animations.
2. **Unified Workspace Simulator**: A simulator toolbar at the top allowing immediate 1-click bypass switching between **Citizen, Admin, Passport Officer, and Police Officer** dashboard environments.
3. **Step-by-Step Passport Intake Form**: 5-step detailed application intake (Personal, Address, Family, Categories, Uploads) with draft auto-saving.
4. **AI document scanner**: Drag-and-drop file upload zones with simulated **AI OCR reading** (name, DOB extraction) and **biometric likeness checking** (98% match scores).
5. **Interactive Appointment Booking**: Select a convenient local Passport Seva Kendra (PSK), choose calendared slot hours, and generate print-ready **QR Code confirmation slips**.
6. **Online simulated Razorpay payment**: Razorpay Sandbox overlay with instant invoice PDF download triggers.
7. **Role-Specific Dashboards**:
   - **Citizen**: View timelines, make payments, book slots, print QR receipts, and inspect audit access logs.
   - **Passport Officer**: Review files `Under Review`, check Aadhaar OCR data side-by-side, insert remarks, and assign police field checks.
   - **Police**: Auditing checklist (criminal query, address check), comments logging, and approval dispatches.
   - **Admin**: SVG graphical submissions trend line, bar-graph categories load trackers, citizen roles grid, and security audit log logs.
8. **Intelligent Chatbot assistant**: Floating dialogue box answering passport FAQs with typing bubbles and localized offline keyword fallbacks.
9. **Dark Mode & Multilingual**: 1-click toggles between English & Hindi and a full dark mode system!

---

## 📁 Directory Structure
```
passport_system/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   ├── auth.js            # JWT Validation & Role RBAC
│   │   └── security.js        # Helmet, Rate-Limit, Captcha & XSS filter
│   ├── routes/
│   │   ├── auth.js            # Login, signup & Aadhaar verification
│   │   ├── application.js     # Forms CRUD, mock OCR & likeness
│   │   └── chatbot.js         # FAQ AI scanner
│   ├── index.js               # Node server startup
│   └── package.json
├── database/
│   ├── schema.sql             # Normalised MySQL tables structure
│   └── seed.sql               # Seed sample citizens & officer profiles
├── frontend/
│   ├── public/
│   │   └── assets/
│   ├── src/
│   │   ├── components/        # Navbar, Footer & Floating Chatbot
│   │   ├── context/           # AppContext state engine
│   │   ├── pages/             # Dashboards (Citizen, Officer, Police, Admin)
│   │   ├── App.jsx            # Router and Workspace toolbar
│   │   ├── index.css          # Design system & scrollbar configs
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

---

## 🛠️ Step-by-Step Running Guide

### Step 1: Pre-requisites
Make sure you have [Node.js](https://nodejs.org) (v18+) installed.

### Step 2: Initialize Database
If you possess a local MySQL server:
1. Access your SQL prompt and load `database/schema.sql`.
2. Seed the mock profiles using `database/seed.sql`.
*(Note: If you do not possess MySQL locally, our frontend features a smart fully stateful context provider mock fallback, allowing you to test the entire application standalone without a database connection!)*

### Step 3: Run Express API Server
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install packages:
   ```bash
   npm install
   ```
3. Boot the server:
   ```bash
   npm run dev
   ```
   *(Backend will start securely on `http://localhost:5000`)*

### Step 4: Run React Vite Frontend
1. In a new terminal tab, navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install packages:
   ```bash
   npm install
   ```
3. Boot the Vite hot-reloading dev server:
   ```bash
   npm run dev
   ```
4. Access the portal in your browser: **`http://localhost:3000`**

---

## 🇮🇳 Dynamic Workspace Simulation Test cases
Once you launch the app at `http://localhost:3000`, use the **top black simulator bar** to perform this full lifecycle audit:
1. **Citizen Flow**: Under the **Citizen** role, fill a fresh passport. Go to **AI OCR**, click **Validate Aadhaar** to scan and **Verify likeness** to trigger a facial score. Complete step 6. Go to **Online payments**, click **Pay via Razorpay**, and confirm. Book a time slot under **Book appointments** and print the generated **QR Slip**.
2. **Officer Review**: Click **Passport Officer** on the simulator bar. Inspect the newly filed Citizen application. View the Aadhaar OCR details side-by-side, add remarks, and click **Approve & Route to Police verification**.
3. **Police Validation**: Click **Police Officer** on the simulator bar. Locate the Citizen address case. Complete the physical address checks, verify criminal history, add Comments, and click **Submit Approved Police Report**.
4. **Admin Dashboard Audits**: Click **Super Admin** on the simulator bar. Verify the global metrics charts have refreshed (Revenue, approved counts, categories charts) and audit the forensic trail under the **System Forensics** logs tab.
