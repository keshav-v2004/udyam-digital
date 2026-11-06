'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Building2,
  MapPin,
  Users,
  Wifi,
  MonitorCheck,
  PhoneCall,
  RotateCcw,
  Zap,
  Info,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';
import { BusinessRequirements, RecommendedBundle } from '@/lib/recommendation-engine';

function AdvisorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preset = searchParams.get('preset');

  // Multi-step adaptive question state
  const [step, setStep] = useState(1);
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<RecommendedBundle | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string>('');

  // Form State
  const [requirements, setRequirements] = useState<BusinessRequirements>({
    businessType: 'Retail & Grocery',
    employeeCount: 3,
    numSites: 1,
    city: 'Ludhiana',
    cityTier: 2,
    hasGstin: true,
    hasUdyam: false,
    internetNeed: 'basic',
    toolsNeeded: ['pos'],
    communicationNeed: ['postpaid'],
    budgetMonthly: 3000,
  });

  // Apply Presets
  useEffect(() => {
    if (preset === 'kirana') {
      setRequirements({
        businessType: lang === 'hi' ? 'किराना व जनरल स्टोर' : 'Kirana & Grocery Retail',
        employeeCount: 2,
        numSites: 1,
        city: 'Jaipur',
        cityTier: 2,
        hasGstin: true,
        hasUdyam: false,
        internetNeed: 'basic',
        toolsNeeded: ['pos', 'cctv'],
        communicationNeed: ['postpaid'],
        budgetMonthly: 2500,
      });
    } else if (preset === 'clinic') {
      setRequirements({
        businessType: lang === 'hi' ? 'डेंटल क्लिनिक व डायग्नोस्टिक्स' : 'Dental & Diagnostic Clinic',
        employeeCount: 8,
        numSites: 1,
        city: 'Kochi',
        cityTier: 2,
        hasGstin: true,
        hasUdyam: true,
        internetNeed: 'high_speed',
        toolsNeeded: ['cctv', 'backup', 'email'],
        communicationNeed: ['sip_ivr', 'whatsapp_api'],
        budgetMonthly: 6000,
      });
    } else if (preset === 'coaching') {
      setRequirements({
        businessType: lang === 'hi' ? 'कोचिंग व शिक्षण संस्थान' : 'Coaching & Education Centre',
        employeeCount: 15,
        numSites: 1,
        city: 'Delhi',
        cityTier: 1,
        hasGstin: true,
        hasUdyam: false,
        internetNeed: 'high_speed',
        toolsNeeded: ['wifi', 'cctv', 'email'],
        communicationNeed: ['sms_marketing', 'whatsapp_api'],
        budgetMonthly: 5000,
      });
    } else if (preset === 'restaurant') {
      setRequirements({
        businessType: lang === 'hi' ? 'रेस्तरां व कैफ़े' : 'Cafe & Restaurant',
        employeeCount: 6,
        numSites: 1,
        city: 'Pune',
        cityTier: 1,
        hasGstin: true,
        hasUdyam: true,
        internetNeed: 'basic',
        toolsNeeded: ['pos', 'cctv', 'wifi'],
        communicationNeed: ['postpaid'],
        budgetMonthly: 3500,
      });
    } else if (preset === 'manufacturer') {
      setRequirements({
        businessType: lang === 'hi' ? 'ऑटो कंपोनेंट फैक्ट्री व निर्माण' : 'Auto Component Manufacturer',
        employeeCount: 35,
        numSites: 2,
        city: 'Chennai',
        cityTier: 1,
        hasGstin: true,
        hasUdyam: true,
        internetNeed: 'dedicated_sla',
        toolsNeeded: ['backup', 'security', 'cctv'],
        communicationNeed: ['sip_ivr', 'postpaid'],
        budgetMonthly: 20000,
      });
    } else if (preset === 'professional') {
      setRequirements({
        businessType: lang === 'hi' ? 'सीए व कानूनी सलाहकार कार्यालय' : 'Chartered Accountants & Law Firm',
        employeeCount: 10,
        numSites: 1,
        city: 'Mumbai',
        cityTier: 1,
        hasGstin: true,
        hasUdyam: false,
        internetNeed: 'high_speed',
        toolsNeeded: ['email', 'backup', 'security'],
        communicationNeed: ['sip_ivr', 'postpaid'],
        budgetMonthly: 5000,
      });
    }
  }, [preset, lang]);

  const handleNext = () => {
    if (step < 6) {
      setStep(step + 1);
    } else {
      generateBundle();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const generateBundle = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requirements),
      });
      const data = await res.json();
      if (data.success) {
        setRecommendation(data.bundle);
        setAiExplanation(data.aiExplanation);
        setStep(7); // Show recommendation view
      }
    } catch (err) {
      console.error('Failed to generate bundle:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToQuote = () => {
    if (!recommendation) return;
    localStorage.setItem(
      'current_bundle',
      JSON.stringify({
        requirements,
        recommendation,
      })
    );
    router.push('/quote');
  };

  const toggleTool = (tool: string) => {
    const exists = requirements.toolsNeeded.includes(tool);
    setRequirements({
      ...requirements,
      toolsNeeded: exists
        ? requirements.toolsNeeded.filter(t => t !== tool)
        : [...requirements.toolsNeeded, tool],
    });
  };

  const toggleComm = (comm: string) => {
    const exists = requirements.communicationNeed.includes(comm);
    setRequirements({
      ...requirements,
      communicationNeed: exists
        ? requirements.communicationNeed.filter(c => c !== comm)
        : [...requirements.communicationNeed, comm],
    });
  };

  const presetsList = [
    { key: 'kirana', label: lang === 'hi' ? 'किराना स्टोर (POS + CCTV)' : 'Kirana Store (POS + CCTV)' },
    { key: 'clinic', label: lang === 'hi' ? 'डेंटल क्लिनिक (IVR + WhatsApp)' : 'Dental Clinic (IVR + WhatsApp)' },
    { key: 'coaching', label: lang === 'hi' ? 'कोचिंग सेंटर (Wi-Fi + SMS)' : 'Coaching Centre (Wi-Fi + SMS)' },
    { key: 'restaurant', label: lang === 'hi' ? 'रेस्तरां व कैफ़े' : 'Restaurant & Bar' },
    { key: 'manufacturer', label: lang === 'hi' ? 'फैक्ट्री (Leased Line + IoT)' : 'Factory (Leased Line + IoT)' },
    { key: 'professional', label: lang === 'hi' ? 'सीए व कानूनी फर्म (Static IP)' : 'CA & Law Office (Static IP)' },
  ];

  const businessTypesList = [
    { id: 'Kirana & Grocery Retail', label: lang === 'hi' ? 'किराना व जनरल रीटेल' : 'Kirana & Grocery Retail' },
    { id: 'Dental & Diagnostic Clinic', label: lang === 'hi' ? 'डेंटल क्लिनिक व डायग्नोस्टिक्स' : 'Dental & Diagnostic Clinic' },
    { id: 'Coaching & Education Centre', label: lang === 'hi' ? 'कोचिंग व शिक्षण संस्थान' : 'Coaching & Education Centre' },
    { id: 'Cafe & Restaurant', label: lang === 'hi' ? 'कैफ़े व रेस्तरां' : 'Cafe & Restaurant' },
    { id: 'Auto Component Manufacturer', label: lang === 'hi' ? 'ऑटो कंपोनेंट निर्माण व फैक्ट्री' : 'Auto Component Manufacturer' },
    { id: 'Chartered Accountants & Law Firm', label: lang === 'hi' ? 'सीए व कानूनी सलाहकार कार्यालय' : 'Chartered Accountants & Law Firm' },
    { id: 'Electronics & Appliance Store', label: lang === 'hi' ? 'इलेक्ट्रॉनिक्स व उपकरण स्टोर' : 'Electronics & Appliance Store' },
    { id: 'Diagnostic Lab & Pharmacy', label: lang === 'hi' ? 'पैथोलॉजी लैब व मेडिकल स्टोर' : 'Diagnostic Lab & Pharmacy' },
  ];

  const internetOptions = [
    {
      id: 'basic',
      title: lang === 'hi' ? 'बिजनेस फाइबर 100 Mbps' : 'Biz Fibre 100 Mbps',
      desc: lang === 'hi' ? 'रीटेल बिलिंग, सीसीटीवी और सामान्य उपयोग के लिए असीमित हाई-स्पीड डेटा।' : 'Unlimited data for retail billing, CCTV stream and general staff browsing.',
    },
    {
      id: 'high_speed',
      title: lang === 'hi' ? 'बिजनेस फाइबर 300 Mbps / 1 Gbps' : 'Biz Fibre 300 Mbps / 1 Gbps',
      desc: lang === 'hi' ? 'अल्ट्रा-फास्ट स्पीड, स्टैटिक आईपी विकल्प और एचडी वीडियो कॉन्फ्रेंसिंग।' : 'Low latency, static IP optional, HD video conferences and rapid cloud uploads.',
    },
    {
      id: 'dedicated_sla',
      title: lang === 'hi' ? 'समर्पित इंटरनेट लीज्ड लाइन (99.5% SLA)' : 'Dedicated Leased Line (1:1 SLA)',
      desc: lang === 'hi' ? '1:1 सिमेट्रिक स्पीड, शून्य डाउनटाइम गारंटी और 24x7 प्राथमिकता सपोर्ट।' : '99.5% uptime commitment, symmetric bandwidth, 24x7 enterprise NOC support.',
    },
    {
      id: 'no_fibre',
      title: lang === 'hi' ? '5G एयरफाइबर (वायरलेस प्लग एंड प्ले)' : '5G AirFiber (FWA Plug & Play)',
      desc: lang === 'hi' ? 'बिना तार के तुरंत चालू होने वाला वायरलेस ब्रॉडबैंड।' : 'Instant wireless broadband for locations awaiting underground optical fibre ducting.',
    },
  ];

  const toolsList = [
    { id: 'pos', name: lang === 'hi' ? 'क्लाउड पीओएस और जीएसटी बिलिंग' : 'Cloud POS & GST Billing', desc: lang === 'hi' ? 'टचस्क्रीन टैबलेट, यूपीआई/कार्ड भुगतान और त्वरित रसीद।' : 'Touchscreen tablet POS with UPI/card tap and invoice auto-print.' },
    { id: 'cctv', name: lang === 'hi' ? 'क्लाउड सीसीटीवी कैमरे' : 'Cloud CCTV Cameras', desc: lang === 'hi' ? '1080p एचडी नाइट विजन, मोबाइल ऐप पर लाइव और 30 दिन का क्लाउड बैकअप।' : '1080p night vision with 30-day cloud backup viewable on phone.' },
    { id: 'wifi', name: lang === 'hi' ? 'सुरक्षित वाई-फाई + गेस्ट नेटवर्क' : 'Secure Wi-Fi + Guest Hotspot', desc: lang === 'hi' ? 'स्टाफ बिलिंग को ग्राहकों के फ्री वाई-फाई से अलग और सुरक्षित रखता है।' : 'Isolates staff payment networks from guest customer logins.' },
    { id: 'email', name: lang === 'hi' ? 'व्यावसायिक डोमेन ईमेल और ऑफिस सूट' : 'Branded Domain & Office Suite', desc: lang === 'hi' ? 'कस्टम @yourbusiness.com ईमेल, सुरक्षित क्लाउड दस्तावेज़ और मीटिंग्स।' : 'Custom @yourbrand.com emails, cloud docs and meetings.' },
    { id: 'backup', name: lang === 'hi' ? 'स्वचालित क्लाउड बैकअप (1 TB)' : 'Cloud Automated Backup (1 TB)', desc: lang === 'hi' ? 'टैली बहीखाता, बिल और मेडिकल रिकॉर्ड्स का दैनिक सुरक्षित बैकअप।' : 'Encrypts daily Tally ledgers, medical records, and CAD drawings.' },
    { id: 'security', name: lang === 'hi' ? 'एंडपॉइंट साइबर सुरक्षा' : 'Endpoint Cybersecurity', desc: lang === 'hi' ? 'बिलिंग पीओएस और कंप्यूटरों को वायरस व रैनसमवेयर से सुरक्षा।' : 'Antivirus and ransomware shields for POS and employee laptops.' },
  ];

  const commsList = [
    { id: 'postpaid', name: lang === 'hi' ? 'बिजनेस पोस्टपेड सीयूजी सिम' : 'Business Postpaid CUG SIMs', desc: lang === 'hi' ? 'कंपनी के अंदर मुफ्त असीमित कॉलिंग और 50 GB डेटा।' : 'Free intra-company calling with 50 GB data per executive line.' },
    { id: 'sip_ivr', name: lang === 'hi' ? 'क्लाउड टेलीफोनी और स्मार्ट IVR' : 'Cloud Telephony & Smart IVR', desc: lang === 'hi' ? 'पेशेवर स्वागत संदेश: "बिक्री के लिए 1 दबाएं" और कॉल रिकॉर्डिंग।' : 'Welcome greeting: "Press 1 for Sales, 2 for Support" with recording.' },
    { id: 'whatsapp_api', name: lang === 'hi' ? 'आधिकारिक व्हाट्सएप बिजनेस एपीआई' : 'Official WhatsApp Business API', desc: lang === 'hi' ? 'वेरीफाइड चैनल, स्वचालित ऑर्डर अलर्ट्स और डिजिटल कैटलॉग।' : 'Meta green tick channel, automated order alerts and catalog.' },
    { id: 'sms_marketing', name: lang === 'hi' ? 'प्रमोशनल बिजनेस एसएमएस (10,000 पैक)' : 'Promotional Business SMS (10k)', desc: lang === 'hi' ? 'त्योहारों के ऑफर और जरूरी रिमाइंडर सीधे ग्राहकों के मोबाइल पर।' : 'DLT-assisted bulk SMS for festival discounts and reminders.' },
    { id: 'toll_free', name: lang === 'hi' ? 'टोल-फ्री 1800 नंबर' : 'Toll-free 1800 Number', desc: lang === 'hi' ? 'राष्ट्रीय स्तर का मुफ्त 1800 नंबर जो मोबाइल पर कनेक्ट होता है।' : 'National toll-free number routed to owner’s mobile.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white font-bold text-lg">
              A
            </div>
            <span className="font-extrabold text-lg text-slate-900">Accel Business</span>
          </Link>

          <div className="flex items-center space-x-3">
            <div className="inline-flex rounded-md border border-slate-200 bg-slate-100 p-0.5 text-xs font-semibold">
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded ${lang === 'en' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
              >
                English
              </button>
              <button
                onClick={() => setLang('hi')}
                className={`px-2 py-1 rounded ${lang === 'hi' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
              >
                हिन्दी
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Preset Selector Banner */}
        {step < 7 && (
          <div className="mb-6 bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
            <div className="text-xs font-bold uppercase text-slate-500 mb-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-rose-600" />
              <span>{lang === 'hi' ? 'त्वरित बिजनेस उदाहरण चुनें' : 'Load Ready Business Presets'}</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-medium">
              {presetsList.map(p => (
                <button
                  key={p.key}
                  onClick={() => router.push(`/advisor?preset=${p.key}`)}
                  className={`px-3 py-1.5 rounded-lg border transition ${
                    preset === p.key
                      ? 'bg-rose-50 border-rose-400 text-rose-700 font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Progress Tracker */}
        {step < 7 && (
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
              <span>{lang === 'hi' ? `चरण ${step} / 6: अनुकूलित आवश्यकताएं` : `Step ${step} of 6: Adaptive Discovery`}</span>
              <span>{Math.round((step / 6) * 100)}% {lang === 'hi' ? 'पूर्ण' : 'Complete'}</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-rose-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${(step / 6) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Question Cards */}
        {step < 7 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm">
            {/* Step 1: Business Profile */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    {lang === 'hi' ? 'आपका व्यवसाय किस प्रकार का है?' : 'What kind of business do you run?'}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {lang === 'hi'
                      ? 'हम आपके उद्योग के अनुसार आवश्यक कनेक्टिविटी स्पीड और डिजिटल टूल्स तैयार करते हैं।'
                      : 'We customize network SLAs and product combinations based on your industry.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {businessTypesList.map(b => (
                    <button
                      key={b.id}
                      onClick={() => setRequirements({ ...requirements, businessType: b.id })}
                      className={`p-4 rounded-xl border text-left font-medium text-sm transition flex items-center justify-between ${
                        requirements.businessType === b.id
                          ? 'border-rose-600 bg-rose-50/50 text-rose-900 shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span>{b.label}</span>
                      {requirements.businessType === b.id && (
                        <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Scale and Sites */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    {lang === 'hi' ? 'कर्मचारी और शाखाओं की संख्या क्या है?' : 'How many employees and sites do you operate?'}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {lang === 'hi'
                      ? 'यह सुनिश्चित करता है कि सभी कर्मचारियों के लिए पर्याप्त बैंडविड्थ और सिम कार्ड उपलब्ध हों।'
                      : 'Ensures sufficient bandwidth, SIM lines, and SD-WAN management if you have multiple branches.'}
                  </p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
                      {lang === 'hi' ? 'कुल कर्मचारी / स्टाफ' : 'Total Employees / Staff'}
                    </label>
                    <div className="flex items-center gap-3">
                      {[1, 3, 7, 15, 30, 50].map(cnt => (
                        <button
                          key={cnt}
                          onClick={() => setRequirements({ ...requirements, employeeCount: cnt })}
                          className={`w-12 h-12 rounded-xl border font-bold text-sm transition ${
                            requirements.employeeCount === cnt
                              ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {cnt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
                      {lang === 'hi' ? 'शाखाओं / कार्यालयों की संख्या' : 'Number of Operational Branches / Sites'}
                    </label>
                    <div className="flex items-center gap-3">
                      {[1, 2, 3, 5, 8].map(sites => (
                        <button
                          key={sites}
                          onClick={() => setRequirements({ ...requirements, numSites: sites })}
                          className={`w-12 h-12 rounded-xl border font-bold text-sm transition ${
                            requirements.numSites === sites
                              ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {sites}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Location and City Tier */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    {lang === 'hi' ? 'व्यापार का मुख्य शहर कहाँ है?' : 'Where is your primary business location?'}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {lang === 'hi'
                      ? 'हम आपके क्षेत्र में ऑप्टिकल फाइबर लाइन की उपलब्धता की जांच करते हैं।'
                      : 'We verify local fibre feasibility and applicable city tier tariffs.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
                      {lang === 'hi' ? 'शहर का नाम' : 'City Name'}
                    </label>
                    <input
                      type="text"
                      value={requirements.city}
                      onChange={e => setRequirements({ ...requirements, city: e.target.value })}
                      placeholder={lang === 'hi' ? 'जैसे: लुधियाना, कोच्चि, नागपुर, जयपुर' : 'e.g. Ludhiana, Kochi, Nagpur, Delhi'}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
                      {lang === 'hi' ? 'मार्केट टियर' : 'Market Tier'}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setRequirements({ ...requirements, cityTier: 1 })}
                        className={`p-3 rounded-xl border text-center text-xs font-bold transition ${
                          requirements.cityTier === 1
                            ? 'bg-rose-600 text-white border-rose-600'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {lang === 'hi' ? 'टियर 1 (मेट्रो)' : 'Tier 1 (Metro)'}
                      </button>
                      <button
                        onClick={() => setRequirements({ ...requirements, cityTier: 2 })}
                        className={`p-3 rounded-xl border text-center text-xs font-bold transition ${
                          requirements.cityTier === 2
                            ? 'bg-rose-600 text-white border-rose-600'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {lang === 'hi' ? 'टियर 2 (उभरते शहर)' : 'Tier 2 (Emerging)'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="text-xs font-bold uppercase text-slate-500 mb-2">
                    {lang === 'hi' ? 'कर पंजीकरण (जीएसटी इनपुट क्रेडिट का लाभ)' : 'Tax Registrations (Enables GST Input Credit)'}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                      <input
                        type="checkbox"
                        checked={requirements.hasGstin}
                        onChange={e => setRequirements({ ...requirements, hasGstin: e.target.checked })}
                        className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                      />
                      <span>{lang === 'hi' ? 'सक्रिय जीएसटीएन (18% टैक्स छूट योग्य)' : 'Active GSTIN (18% input credit eligible)'}</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                      <input
                        type="checkbox"
                        checked={requirements.hasUdyam}
                        onChange={e => setRequirements({ ...requirements, hasUdyam: e.target.checked })}
                        className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                      />
                      <span>{lang === 'hi' ? 'उद्यम पंजीकृत व्यवसाय (MSME)' : 'Udyam Registered MSME'}</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Internet Connectivity Type */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    {lang === 'hi' ? 'इंटरनेट स्पीड और अपटाइम की आवश्यकता क्या है?' : 'What connectivity uptime and speed do you need?'}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {lang === 'hi'
                      ? 'सस्ते स्टोर ब्रॉडबैंड से लेकर 99.5% अपटाइम गारंटी वाली लीज्ड लाइन तक।'
                      : 'From cost-effective store broadband to mission-critical 99.5% SLA leased lines.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {internetOptions.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setRequirements({ ...requirements, internetNeed: opt.id as any })}
                      className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
                        requirements.internetNeed === opt.id
                          ? 'border-rose-600 bg-rose-50/50 text-slate-900 shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="font-bold text-sm text-slate-900 flex items-center justify-between">
                        <span>{opt.title}</span>
                        {requirements.internetNeed === opt.id && (
                          <CheckCircle2 className="w-4 h-4 text-rose-600" />
                        )}
                      </div>
                      <p className="mt-2 text-xs text-slate-500 leading-relaxed">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Essential Business Tools */}
            {step === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    {lang === 'hi' ? 'दुकान या कार्यालय के लिए कौन से डिजिटल उपकरण आवश्यक हैं?' : 'Which essential tools does your shop or office need?'}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {lang === 'hi'
                      ? 'ये सभी उत्पाद आपके मासिक बिल में एक साथ शामिल किए जाएंगे।'
                      : 'Bundled directly into your monthly bill with single-point customer service.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {toolsList.map(tool => {
                    const selected = requirements.toolsNeeded.includes(tool.id);
                    return (
                      <button
                        key={tool.id}
                        onClick={() => toggleTool(tool.id)}
                        className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
                          selected
                            ? 'border-rose-600 bg-rose-50/50 shadow-2xs'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-sm text-slate-900">
                          <span>{tool.name}</span>
                          <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${selected ? 'bg-rose-600 border-rose-600 text-white' : 'border-slate-300'}`}>
                            {selected && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">{tool.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 6: Customer Communication & Channels */}
            {step === 6 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    {lang === 'hi' ? 'ग्राहकों से बातचीत और कॉलिंग की क्या ज़रूरतें हैं?' : 'How do you communicate with customers and teams?'}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {lang === 'hi'
                      ? 'अपने व्यवसाय को आधिकारिक व्हाट्सएप, पेशेवर वॉइस आईवीआर और मोबाइल डेटा से लैस करें।'
                      : 'Equip your business with professional voice reception, official WhatsApp, and pooled mobile data.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {commsList.map(comm => {
                    const selected = requirements.communicationNeed.includes(comm.id);
                    return (
                      <button
                        key={comm.id}
                        onClick={() => toggleComm(comm.id)}
                        className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
                          selected
                            ? 'border-rose-600 bg-rose-50/50 shadow-2xs'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-sm text-slate-900">
                          <span>{comm.name}</span>
                          <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${selected ? 'bg-rose-600 border-rose-600 text-white' : 'border-slate-300'}`}>
                            {selected && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">{comm.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
              {step > 1 ? (
                <button
                  onClick={handleBack}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{lang === 'hi' ? 'पिछला' : 'Back'}</span>
                </button>
              ) : (
                <div />
              )}

              <button
                onClick={handleNext}
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold shadow-md shadow-rose-200 transition"
              >
                {loading ? (
                  <span>{lang === 'hi' ? 'सिफारिशें तैयार की जा रही हैं...' : 'Generating Recommendations...'}</span>
                ) : step === 6 ? (
                  <>
                    <span>{lang === 'hi' ? 'बंडल बनाएं' : 'Generate Bundle'}</span>
                    <Sparkles className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>{lang === 'hi' ? 'आगे बढ़ें' : 'Continue'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 7: Bundle Recommendation View */}
        {step === 7 && recommendation && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md mb-2">
                    <Sparkles className="w-3 h-3" />
                    <span>{lang === 'hi' ? 'अनुकूलित बंडल सिफारिश' : 'Engine Recommendation'}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                    {recommendation.bundleName}
                  </h1>
                  <p className="mt-1 text-sm font-medium text-slate-600">
                    {recommendation.tagline}
                  </p>
                </div>

                <div className="sm:text-right bg-slate-50 sm:bg-transparent p-4 sm:p-0 rounded-xl">
                  <div className="text-xs uppercase font-semibold text-slate-400">
                    {lang === 'hi' ? 'कुल मासिक आवर्ती शुल्क' : 'Total Monthly Recurring'}
                  </div>
                  <div className="text-3xl font-black text-slate-900">
                    ₹{recommendation.totalMonthlyRecurring.toLocaleString('en-IN')}
                    <span className="text-xs font-normal text-slate-500"> {lang === 'hi' ? '/माह + जीएसटी' : '/mo + GST'}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {lang === 'hi'
                      ? `एकमुश्त सेटअप: ₹${recommendation.totalOneTimeSetup.toLocaleString('en-IN')} • ${recommendation.estimatedInstallDays} दिनों में एक्टिवेशन`
                      : `One-time Setup: ₹${recommendation.totalOneTimeSetup.toLocaleString('en-IN')} • ${recommendation.estimatedInstallDays} Days Activation`}
                  </div>
                </div>
              </div>

              {/* Rationale Box */}
              <div className="mt-6 bg-slate-50 border border-slate-200/80 rounded-2xl p-5 text-sm leading-relaxed text-slate-700">
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
                  <Info className="w-4 h-4 text-rose-600" />
                  <span>{lang === 'hi' ? `${requirements.businessType} के लिए रणनीतिक लाभ` : `Strategic Rationale for ${requirements.businessType}`}</span>
                </div>
                <p className="whitespace-pre-line text-xs sm:text-sm text-slate-600">{aiExplanation}</p>
              </div>

              {/* Primary Products Included */}
              <div className="mt-8">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
                  {lang === 'hi' ? `मुख्य बंडल प्रोडक्ट्स (${recommendation.primaryProducts.length})` : `Core Bundle Products (${recommendation.primaryProducts.length})`}
                </h3>
                <div className="space-y-3">
                  {recommendation.primaryProducts.map(p => (
                    <div
                      key={p.product.id}
                      className="border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-base text-slate-900">{p.product.name}</span>
                          <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                            {p.product.category}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            {lang === 'hi' ? 'अनिवार्य मुख्य' : 'Mandatory Core'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">{p.product.description}</p>
                        <p className="text-xs text-rose-700 font-medium">{p.reason}</p>
                      </div>

                      <div className="sm:text-right shrink-0">
                        <div className="text-base font-extrabold text-slate-900">
                          ₹{(p.monthlyPrice * p.quantity).toLocaleString('en-IN')}{lang === 'hi' ? '/माह' : '/mo'}
                        </div>
                        <div className="text-xs text-slate-400">
                          {lang === 'hi' ? 'मात्रा:' : 'Qty:'} {p.quantity} {p.product.unit} {p.setupFee > 0 ? `• सेटअप: ₹${p.setupFee}` : '• ₹0 सेटअप'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Add-ons */}
              {recommendation.addOnProducts.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
                    {lang === 'hi' ? `संगत डिजिटल ऐड-ऑन (${recommendation.addOnProducts.length})` : `Compatible Digital Add-ons (${recommendation.addOnProducts.length})`}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {recommendation.addOnProducts.map(a => (
                      <div
                        key={a.product.id}
                        className={`border rounded-2xl p-4 flex flex-col justify-between ${
                          a.isRecommended ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200 bg-white'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-slate-900">{a.product.name}</span>
                            {a.isRecommended && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                                {lang === 'hi' ? 'सिफारिश की गई' : 'Recommended'}
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-xs text-slate-500">{a.product.description}</p>
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800">
                            ₹{a.monthlyPrice.toLocaleString('en-IN')}{lang === 'hi' ? '/माह' : '/mo'}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {lang === 'hi' ? 'कोट में बदलाव योग्य' : 'Customizable in Quote'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{lang === 'hi' ? 'उत्तर बदलें व पुनः जांचें' : 'Modify Answers & Regenerate'}</span>
                </button>

                <button
                  onClick={handleProceedToQuote}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-base font-bold shadow-lg shadow-rose-200 transition"
                >
                  <span>{lang === 'hi' ? 'बंडल स्वीकारें और कोट कस्टमाइज़ करें' : 'Accept Bundle & Customize Quote'}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdvisorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading Advisor...</div>}>
      <AdvisorContent />
    </Suspense>
  );
}
