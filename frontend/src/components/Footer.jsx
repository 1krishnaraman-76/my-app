import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { ShieldCheck, HeartHandshake, PhoneCall, HelpCircle } from 'lucide-react';

export default function Footer() {
  const { lang } = useContext(AppContext);

  return (
    <footer class="w-full mt-auto bg-slate-900 text-slate-400 dark:bg-slate-950 transition-colors border-t border-slate-800">
      
      {/* 1. Main Footer links & divisions */}
      <div class="max-w-7xl mx-auto px-4 md:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Government Identity Column */}
        <div class="flex flex-col gap-4 text-left">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-gov-ashokaGold text-gov-ashokaGold font-bold">
              印
            </div>
            <div>
              <h3 class="text-white font-extrabold text-sm tracking-wide font-serif">SmartPassport AI</h3>
              <p class="text-[10px] text-slate-500 font-semibold uppercase mt-0.5">Ministry of External Affairs</p>
            </div>
          </div>
          <p class="text-xs leading-relaxed text-slate-500">
            {lang === 'EN' 
              ? 'An official digitized system facilitating national security, high-accuracy document checking, and accelerated passport issuing mechanisms across all Indian territories.' 
              : 'सभी भारतीय क्षेत्रों में राष्ट्रीय सुरक्षा, उच्च-सटीक दस्तावेज़ जांच और त्वरित पासपोर्ट जारी करने की सुविधा प्रदान करने वाली एक आधिकारिक डिजिटल प्रणाली।'}
          </p>
          <div class="flex items-center gap-2 mt-2">
            <span class="px-2 py-1 rounded bg-slate-800 text-[10px] font-bold text-gov-ashokaGold border border-slate-700">ISO 27001 SECURE</span>
            <span class="px-2 py-1 rounded bg-slate-800 text-[10px] font-bold text-gov-ashokaGold border border-slate-700">PCI-DSS COMPLIANT</span>
          </div>
        </div>

        {/* Essential Services Links */}
        <div class="flex flex-col gap-3 text-left">
          <h4 class="text-white font-bold text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <HelpCircle size={14} class="text-gov-ashokaGold" />
            <span>{lang === 'EN' ? 'Citizen Services' : 'नागरिक सेवाएं'}</span>
          </h4>
          <ul class="text-xs flex flex-col gap-2 font-medium">
            <li class="hover:text-white transition-colors cursor-pointer">{lang === 'EN' ? 'Apply for Fresh Passport' : 'नए पासपोर्ट के लिए आवेदन करें'}</li>
            <li class="hover:text-white transition-colors cursor-pointer">{lang === 'EN' ? 'Reissue/Renewal of Passport' : 'पासपोर्ट का नवीनीकरण'}</li>
            <li class="hover:text-white transition-colors cursor-pointer">{lang === 'EN' ? 'Tatkal Urgent Booking' : 'तत्काल आपातकालीन बुकिंग'}</li>
            <li class="hover:text-white transition-colors cursor-pointer">{lang === 'EN' ? 'Diplomatic/Official Passport' : 'राजनयिक/आधिकारिक पासपोर्ट'}</li>
            <li class="hover:text-white transition-colors cursor-pointer">{lang === 'EN' ? 'Office Location Finder' : 'कार्यालय लोकेटर खोजें'}</li>
          </ul>
        </div>

        {/* Legal & Compliance Policy */}
        <div class="flex flex-col gap-3 text-left">
          <h4 class="text-white font-bold text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <ShieldCheck size={14} class="text-gov-ashokaGold" />
            <span>{lang === 'EN' ? 'Security & Terms' : 'सुरक्षा और शर्तें'}</span>
          </h4>
          <ul class="text-xs flex flex-col gap-2 font-medium">
            <li class="hover:text-white transition-colors cursor-pointer">{lang === 'EN' ? 'Privacy Policy & Data Security' : 'गोपनीयता नीति और डेटा सुरक्षा'}</li>
            <li class="hover:text-white transition-colors cursor-pointer">{lang === 'EN' ? 'UIDAI Aadhaar Data Consent' : 'यूआईडीएआई आधार डेटा सहमति'}</li>
            <li class="hover:text-white transition-colors cursor-pointer">{lang === 'EN' ? 'Hyperlink Guidelines' : 'हाइपरलिंक दिशानिर्देश'}</li>
            <li class="hover:text-white transition-colors cursor-pointer">{lang === 'EN' ? 'Anti-Fraud Alert Notice' : 'धोखाधड़ी विरोधी चेतावनी सूचना'}</li>
            <li class="hover:text-white transition-colors cursor-pointer">{lang === 'EN' ? 'Terms & Usage Restrictions' : 'नियम और उपयोग प्रतिबंध'}</li>
          </ul>
        </div>

        {/* Technical Support Hotlines */}
        <div class="flex flex-col gap-3 text-left">
          <h4 class="text-white font-bold text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <PhoneCall size={14} class="text-gov-ashokaGold" />
            <span>{lang === 'EN' ? 'Support Desk' : 'सहायता केंद्र'}</span>
          </h4>
          <p class="text-xs leading-relaxed text-slate-500">
            {lang === 'EN' 
              ? 'Connect with our 24/7 National Call Centre support or access AI chatbot assistants for immediate query processing.' 
              : 'तत्काल प्रश्न समाधान के लिए हमारे 24/7 राष्ट्रीय कॉल सेंटर से जुड़ें या एआई चैटबॉट सहायक तक पहुंचें।'}
          </p>
          <div class="flex flex-col gap-1.5 text-xs text-gov-ashokaGold font-semibold mt-1">
            <span>📞 Toll Free: 1800-258-1800</span>
            <span>📧 Support: helpdesk@smartpassport.gov.in</span>
          </div>
        </div>

      </div>

      {/* 2. Bottom Copyright Division */}
      <div class="w-full bg-slate-950 py-6 px-4 md:px-8 border-t border-slate-900 text-center text-[10px] text-slate-500 font-medium flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <span>© 2026 SmartPassport AI. {lang === 'EN' ? 'Project designed for the Ministry of External Affairs, India.' : 'विदेश मंत्रालय, भारत के लिए डिज़ाइन की गई परियोजना।'}</span>
        </div>
        <div class="flex items-center gap-4">
          <span class="hover:underline cursor-pointer">{lang === 'EN' ? 'Sitemap' : 'साइटमैप'}</span>
          <span class="hover:underline cursor-pointer">{lang === 'EN' ? 'Website Policies' : 'वेबसाइट नीतियां'}</span>
          <span class="hover:underline cursor-pointer">{lang === 'EN' ? 'Contact Officer' : 'अधिकारी से संपर्क करें'}</span>
        </div>
      </div>

      {/* 3. Official Tri-color bottom layout ribbon bar */}
      <div class="w-full h-1 flex">
        <div class="w-1/3 bg-gov-orange"></div>
        <div class="w-1/3 bg-white"></div>
        <div class="w-1/3 bg-gov-green"></div>
      </div>

    </footer>
  );
}
