'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  FileCheck2,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Upload,
  ArrowRight,
  Info,
  Building,
  RotateCcw,
  Sparkles,
  Lock,
} from 'lucide-react';
import { KYC_SPECIMENS, KycSpecimen } from '@/lib/kyc-specimens';

function KycContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quoteIdParam = searchParams.get('quoteId');

  const [lang, setLang] = useState<'en' | 'hi'>('en');

  // Multi-step KYC state: 1. Privacy Consent, 2. Document & Specimen Selection, 3. OCR Review, 4. Verification Output
  const [kycStep, setKycStep] = useState<1 | 2 | 3 | 4>(1);

  // Consent Flags (Mandatory unselected by default)
  const [consentIdentity, setConsentIdentity] = useState(false);
  const [consentDocProcessing, setConsentDocProcessing] = useState(false);
  const [consentFulfillment, setConsentFulfillment] = useState(false);
  const [consentMarketing, setConsentMarketing] = useState(false);
  const [consentError, setConsentError] = useState('');

  // Selected Specimen or Custom Manual
  const [selectedSpecimen, setSelectedSpecimen] = useState<KycSpecimen>(KYC_SPECIMENS[0]); // Default K01
  const [useSpecimen, setUseSpecimen] = useState(true);

  // Extracted Document Information State
  const [businessName, setBusinessName] = useState('Balaji Dental Care LLP');
  const [gstin, setGstin] = useState('32TTNXB7384T1ZW');
  const [udyamNumber, setUdyamNumber] = useState('UDYAM-KL-00-3078801');
  const [signatoryName, setSignatoryName] = useState('Prakash Shah');
  const [addressProofDate, setAddressProofDate] = useState('2026-06-15');

  // Verification Results State
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  // Sync with selected specimen
  const handleSelectSpecimen = (specimen: KycSpecimen) => {
    setSelectedSpecimen(specimen);
    setBusinessName(specimen.businessName);
    setGstin(specimen.documents.gstin || '');
    setUdyamNumber(specimen.documents.udyam || '');
    setSignatoryName(specimen.documents.signatoryName || '');
    setAddressProofDate(specimen.documents.addressProofDate || '2026-06-15');
  };

  const handleConsentProceed = () => {
    if (!consentIdentity || !consentDocProcessing || !consentFulfillment) {
      setConsentError(
        lang === 'hi'
          ? 'सत्यापन, दस्तावेज़ प्रसंस्करण और ऑर्डर निष्पादन के लिए सहमति देना अनिवार्य है।'
          : 'Affirmative consent is required for identity verification, document processing, and telecom order fulfillment.'
      );
      return;
    }
    setConsentError('');
    setKycStep(2);
  };

  const runVerification = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/kyc/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          specimenId: useSpecimen ? selectedSpecimen.id : undefined,
          businessName,
          gstin,
          udyamNumber,
          signatoryName,
          addressProofDate,
          hasGstinConsent: consentIdentity,
          hasDocProcessingConsent: consentDocProcessing,
          hasFulfillmentConsent: consentFulfillment,
          hasMarketingConsent: consentMarketing,
          quoteId: quoteIdParam || 'QUOTE-DEMO-K01',
        }),
      });

      const data = await res.json();
      setVerificationResult(data);
      setKycStep(4);
    } catch (err) {
      console.error('KYC verification call failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async () => {
    if (!verificationResult || verificationResult.outcome === 'REJECTED') return;
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quoteId: quoteIdParam || 'QUOTE-DEMO-K01',
          businessName,
          contactName: signatoryName,
          contactPhone: '9876543210',
          serviceAddress: `${businessName}, Main Commercial Market, City Center`,
        }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        router.push(`/tracker?orderId=${data.order.id}`);
      }
    } catch (err) {
      console.error('Order creation error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white font-bold text-lg">
              A
            </div>
            <span className="font-extrabold text-lg text-slate-900">Accel Business</span>
          </Link>

          <div className="flex items-center space-x-4">
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
        {/* Step Indicator */}
        <div className="mb-8 flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center space-x-6 text-xs font-bold uppercase tracking-wider">
            <span className={kycStep === 1 ? 'text-rose-600' : 'text-emerald-600'}>
              {lang === 'hi' ? '1. गोपनीयता सूचना' : '1. Privacy Notice'}
            </span>
            <span className="text-slate-300">•</span>
            <span className={kycStep === 2 ? 'text-rose-600' : kycStep > 2 ? 'text-emerald-600' : 'text-slate-400'}>
              {lang === 'hi' ? '2. दस्तावेज़ चयन' : '2. Document Selection'}
            </span>
            <span className="text-slate-300">•</span>
            <span className={kycStep === 3 ? 'text-rose-600' : kycStep > 3 ? 'text-emerald-600' : 'text-slate-400'}>
              {lang === 'hi' ? '3. ओसीआर समीक्षा' : '3. OCR Field Review'}
            </span>
            <span className="text-slate-300">•</span>
            <span className={kycStep === 4 ? 'text-rose-600' : 'text-slate-400'}>
              {lang === 'hi' ? '4. डेटाबेस मिलान' : '4. Registry Match Result'}
            </span>
          </div>

          <div className="text-xs text-slate-400 font-mono">Notice v2.1-2026</div>
        </div>

        {/* STEP 1: Consent Notice */}
        {kycStep === 1 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md mb-2">
                <Lock className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'डिजिटल गोपनीयता व सत्यापन' : 'Digital Privacy & Verification'}</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900">
                {lang === 'hi' ? 'व्यापार और अधिकृत हस्ताक्षरकर्ता डेटा प्रसंस्करण सूचना' : 'Notice for Processing Business & Signatory Personal Data'}
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                {lang === 'hi'
                  ? 'कृपया आगे बढ़ने से पहले डेटा संग्रहण और सत्यापन की शर्तों की समीक्षा करें और सहमति दें।'
                  : 'Please review and provide affirmative consent before proceeding with digital verification.'}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-xs text-slate-600 space-y-2 leading-relaxed">
              <p className="font-semibold text-slate-900">{lang === 'hi' ? 'हम क्या जानकारी एकत्र करते हैं और इसका क्या उद्देश्य है:' : 'Information We Collect & Purpose of Processing:'}</p>
              <ul className="list-disc pl-4 space-y-1">
                <li><strong>{lang === 'hi' ? 'पहचान सत्यापन:' : 'Identity Verification:'}</strong> {lang === 'hi' ? 'आधिकारिक सरकारी पोर्टलों के साथ कानूनी नाम, जीएसटीएन और उद्यम पंजीकरण का मिलान।' : 'Legal name, GSTIN, Udyam registration, and PAN for entity existence verification against official registries.'}</li>
                <li><strong>{lang === 'hi' ? 'स्थान व्यवहार्यता:' : 'Premises Feasibility:'}</strong> {lang === 'hi' ? 'फाइबर स्थापना और नेटवर्क कनेक्टिविटी जांच के लिए पते का प्रमाण (90 दिनों के भीतर का बिजली/उपयोगिता बिल)।' : 'Principal place of business address proof (utility bills under 90 days) for telecom installation feasibility.'}</li>
                <li><strong>{lang === 'hi' ? 'हस्ताक्षरकर्ता अधिकार:' : 'Signatory Authorization:'}</strong> {lang === 'hi' ? 'दूरसंचार नियमों के तहत अधिकृत व्यक्ति की पहचान और अनुबंध क्षमता का सत्यापन।' : 'Signatory identification to establish legal contracting capacity under DOT guidelines.'}</li>
                <li><strong>{lang === 'hi' ? 'डेटा प्रतिधारण:' : 'Retention Period:'}</strong> {lang === 'hi' ? 'असफल आवेदनों का डेटा 90 दिनों में हटा दिया जाता है। सक्रिय ग्राहकों का डेटा अनुबंध अवधि तक सुरक्षित रहता है।' : 'Inactive applicant records are automatically purged after 90 days. Activated subscriber files are retained for the statutory contract period.'}</li>
              </ul>
            </div>

            {/* Checkbox Groups */}
            <div className="space-y-4 pt-2">
              <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={consentIdentity}
                  onChange={e => setConsentIdentity(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-900">
                    {lang === 'hi' ? 'पहचान और रजिस्ट्री मिलान की सहमति (अनिवार्य)' : 'Consent for Identity & Registry Lookup (Mandatory)'}
                  </span>
                  <p className="text-slate-500 mt-0.5">
                    {lang === 'hi'
                      ? 'मैं कानूनी अस्तित्व की पुष्टि के लिए जीएसटीएन और उद्यम डेटाबेस से मिलान करने की अनुमति देता/देती हूँ।'
                      : 'I authorize Accel Business to query GSTN Common Portal and MSME Udyam registries to confirm registration validity.'}
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={consentDocProcessing}
                  onChange={e => setConsentDocProcessing(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-900">
                    {lang === 'hi' ? 'दस्तावेज़ ओसीआर और डेटा निष्कर्षण की सहमति (अनिवार्य)' : 'Consent for Document OCR & Data Extraction (Mandatory)'}
                  </span>
                  <p className="text-slate-500 mt-0.5">
                    {lang === 'hi'
                      ? 'अपलोड किए गए प्रमाणपत्रों और बिजली बिलों से फॉर्म स्वतः भरने के लिए स्वचालित ओसीआर की अनुमति है।'
                      : 'I authorize automated local optical character recognition (OCR) on submitted bills and certificates.'}
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={consentFulfillment}
                  onChange={e => setConsentFulfillment(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-900">
                    {lang === 'hi' ? 'सेवा स्थापना और ऑर्डर निष्पादन की सहमति (अनिवार्य)' : 'Consent for Telecom Service Order Execution (Mandatory)'}
                  </span>
                  <p className="text-slate-500 mt-0.5">
                    {lang === 'hi'
                      ? 'फाइबर केबल बिछाने और इंस्टॉलेशन के लिए फील्ड इंजीनियरों के साथ सत्यापित पता साझा करने की अनुमति है।'
                      : 'I authorize sharing verified address coordinates with authorized field network engineers for optical fiber installation.'}
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={consentMarketing}
                  onChange={e => setConsentMarketing(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-900">
                    {lang === 'hi' ? 'वैकल्पिक: व्यावसायिक अपडेट्स और पार्टनर ऑफ़र' : 'Optional: Business Insights & Partner Offers (Optional)'}
                  </span>
                  <p className="text-slate-500 mt-0.5">
                    {lang === 'hi'
                      ? 'एमएसएमई टेक्नोलॉजी अपग्रेड, ग्रांट्स और विशेष ऑफ़र के बारे में जानकारी प्राप्त करें।'
                      : 'Receive periodic updates regarding MSME technology grants, bandwidth upgrades, and partner offers.'}
                  </p>
                </div>
              </label>
            </div>

            {consentError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{consentError}</span>
              </div>
            )}

            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              <span className="text-[11px] text-slate-400">
                {lang === 'hi' ? 'आप किसी भी समय अपनी सहमति वापस ले सकते हैं।' : 'You may withdraw consent at any time.'}
              </span>
              <button
                onClick={handleConsentProceed}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-200 transition"
              >
                <span>{lang === 'hi' ? 'सहमति दर्ज करें और आगे बढ़ें' : 'Record Consent & Continue'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Specimen or Document Selection */}
        {kycStep === 2 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md mb-2">
                <Upload className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'टेस्ट डॉसियर एक्सप्लोरर' : 'Test Dataset Specimen Explorer'}</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900">
                {lang === 'hi' ? 'सत्यापन डॉसियर चुनें (K01 — K12)' : 'Select KYC Dossier Specimen (K01 — K12)'}
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                {lang === 'hi'
                  ? 'असली और जानबूझकर समस्याग्रस्त दस्तावेजों (पुराने बिल, निलंबित जीएसटीएन आदि) के साथ स्मार्ट सत्यापन की जांच करें।'
                  : 'Test the Smart KYC engine against actual hackathon specimen documents, including intentionally flawed records.'}
              </p>
            </div>

            {/* Specimen Buttons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {KYC_SPECIMENS.map(s => {
                const isSelected = selectedSpecimen.id === s.id;
                let outcomeBadge = (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                    {lang === 'hi' ? 'सत्यापित' : 'Verified'}
                  </span>
                );
                if (s.expectedOutcome === 'MANUAL_REVIEW') {
                  outcomeBadge = (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                      {lang === 'hi' ? 'मैन्युअल समीक्षा' : 'Manual Review'}
                    </span>
                  );
                } else if (s.expectedOutcome === 'REJECTED') {
                  outcomeBadge = (
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                      {lang === 'hi' ? 'अस्वीकृत' : 'Rejected'}
                    </span>
                  );
                }

                return (
                  <button
                    key={s.id}
                    onClick={() => handleSelectSpecimen(s)}
                    className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                      isSelected
                        ? 'border-rose-600 bg-rose-50/40 shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-xs text-slate-900">
                          {s.id}: {s.businessName}
                        </span>
                        {outcomeBadge}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2">
                        {s.primaryIssue ? s.primaryIssue : s.documents.notes}
                      </p>
                    </div>

                    <div className="mt-2 text-[10px] font-mono text-slate-400">
                      GSTIN: {s.documents.gstin ? s.documents.gstin.slice(0, 10) + '...' : (lang === 'hi' ? 'अनुपलब्ध' : 'Missing')}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Specimen Summary */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2">
              <div className="font-bold text-slate-900">
                {lang === 'hi' ? 'चयनित डॉसियर:' : 'Selected Specimen Files:'} {selectedSpecimen.id} ({selectedSpecimen.businessName})
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-600 font-mono">
                <div>• {selectedSpecimen.id}_gst_certificate.png</div>
                <div>• {selectedSpecimen.id}_udyam_certificate.png</div>
                <div>• {selectedSpecimen.id}_signatory_id.png</div>
                <div>• {selectedSpecimen.id}_address_proof.png</div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              <button
                onClick={() => setKycStep(1)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                {lang === 'hi' ? 'सहमति पर वापस' : 'Back to Consent'}
              </button>
              <button
                onClick={() => setKycStep(3)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-200 transition"
              >
                <span>{lang === 'hi' ? 'ओसीआर डेटा निकालें' : 'Extract OCR Fields'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: OCR Extracted Fields & Customer Review */}
        {kycStep === 3 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'ओसीआर निष्कर्षण तैयार' : 'OCR Extraction Ready'}</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900">
                {lang === 'hi' ? 'निकाले गए विवरण की जांच व संपादन करें' : 'Review & Correct Extracted Information'}
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                {lang === 'hi'
                  ? 'डेटाबेस मिलान से पहले ग्राहक अपने विवरण की पुष्टि या उसमें आवश्यक सुधार कर सकते हैं।'
                  : 'The applicant can edit and verify extracted fields prior to automated cross-registry verification.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold uppercase text-slate-500 mb-1">
                  {lang === 'hi' ? 'कानूनी व्यापारिक नाम' : 'Legal Business Name'}
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={e => setBusinessName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-500 mb-1">
                  {lang === 'hi' ? '15-अंकीय जीएसटीएन (GSTIN)' : '15-Digit GSTIN'}
                </label>
                <input
                  type="text"
                  value={gstin}
                  onChange={e => setGstin(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-mono text-slate-900 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-500 mb-1">
                  {lang === 'hi' ? 'उद्यम पंजीकरण संख्या' : 'Udyam Registration Number'}
                </label>
                <input
                  type="text"
                  value={udyamNumber}
                  onChange={e => setUdyamNumber(e.target.value)}
                  placeholder="UDYAM-XX-00-XXXXXXX"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-mono text-slate-900 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-500 mb-1">
                  {lang === 'hi' ? 'अधिकृत हस्ताक्षरकर्ता का नाम' : 'Authorized Signatory Name'}
                </label>
                <input
                  type="text"
                  value={signatoryName}
                  onChange={e => setSignatoryName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold uppercase text-slate-500 mb-1">
                  {lang === 'hi' ? 'पते के प्रमाण बिल की तारीख (15 जुलाई 2026 से अधिकतम 90 दिन पुराना)' : 'Address Proof Utility Bill Date (Cut-off: 90 Days before July 15, 2026)'}
                </label>
                <input
                  type="date"
                  value={addressProofDate}
                  onChange={e => setAddressProofDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-mono text-slate-900 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              <button
                onClick={() => setKycStep(2)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                {lang === 'hi' ? 'डॉसियर चयन पर वापस' : 'Back to Specimens'}
              </button>

              <button
                onClick={runVerification}
                disabled={loading}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-200 transition"
              >
                {loading ? (
                  <span>{lang === 'hi' ? 'डेटाबेस से मिलान किया जा रहा है...' : 'Cross-Matching Registries...'}</span>
                ) : (
                  <>
                    <span>{lang === 'hi' ? 'जीएसटीएन और उद्यम डेटाबेस से मिलान करें' : 'Verify Against GSTIN & Udyam Registries'}</span>
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Verification Result */}
        {kycStep === 4 && verificationResult && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div>
                  <span className="text-xs uppercase font-bold text-slate-400">
                    {lang === 'hi' ? 'सत्यापन परिणाम' : 'KYC Verification Outcome'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 flex items-center gap-2">
                    {verificationResult.outcome === 'VERIFIED' && (
                      <>
                        <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                        <span>{lang === 'hi' ? 'डिजिटल सत्यापन सफल' : 'Instant Digital KYC Verified'}</span>
                      </>
                    )}
                    {verificationResult.outcome === 'MANUAL_REVIEW' && (
                      <>
                        <AlertTriangle className="w-7 h-7 text-amber-500" />
                        <span>{lang === 'hi' ? 'मैन्युअल समीक्षा आवश्यक' : 'Manual Review Required'}</span>
                      </>
                    )}
                    {verificationResult.outcome === 'REJECTED' && (
                      <>
                        <XCircle className="w-7 h-7 text-rose-600" />
                        <span>{lang === 'hi' ? 'आवेदन अस्वीकृत' : 'Application Rejected'}</span>
                      </>
                    )}
                  </h2>
                </div>

                <div className="sm:text-right text-xs">
                  <div className="text-slate-400">{lang === 'hi' ? 'सहमति संदर्भ' : 'Consent Reference'}</div>
                  <div className="font-mono font-bold text-slate-700">{verificationResult.consentId}</div>
                </div>
              </div>

              {/* Exception Warnings */}
              {verificationResult.issues && verificationResult.issues.length > 0 && (
                <div className="mt-6 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-2">
                  <div className="font-bold flex items-center gap-1.5 text-amber-800">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{lang === 'hi' ? 'पहचाने गए विसंगति व अनुपालन बिंदु:' : 'Identified Discrepancies & Compliance Flags:'}</span>
                  </div>
                  <ul className="list-disc pl-5 space-y-1">
                    {verificationResult.issues.map((issue: string, idx: number) => (
                      <li key={idx} className="font-medium">{issue}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Verification Breakdown Cards */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* GSTIN Match */}
                <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase text-slate-500">
                      {lang === 'hi' ? 'जीएसटी पोर्टल' : 'GST Portal Match'}
                    </span>
                    {verificationResult.gstinResult?.status === 'Active' ? (
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                        {lang === 'hi' ? 'सक्रिय' : 'Active'}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded">
                        {verificationResult.gstinResult?.status || (lang === 'hi' ? 'विफल' : 'Failed')}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-700 font-medium">
                    {verificationResult.gstinResult?.record ? (
                      <>
                        <div className="font-bold">{verificationResult.gstinResult.record.tradeName}</div>
                        <div className="text-[11px] text-slate-500 mt-1">
                          {verificationResult.gstinResult.record.principalPlaceOfBusiness}
                        </div>
                      </>
                    ) : (
                      <div className="text-rose-600">{lang === 'hi' ? 'कोई सक्रिय रिकॉर्ड नहीं मिला' : 'No active GST record found'}</div>
                    )}
                  </div>
                </div>

                {/* Udyam Match */}
                <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase text-slate-500">
                      {lang === 'hi' ? 'उद्यम पोर्टल' : 'Udyam MSME Match'}
                    </span>
                    {verificationResult.udyamResult?.status === 'Verified' ? (
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                        {lang === 'hi' ? 'सत्यापित' : 'Verified'}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                        {verificationResult.udyamResult?.status || (lang === 'hi' ? 'अनुपलब्ध' : 'Not Provided')}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-700 font-medium">
                    {verificationResult.udyamResult?.record ? (
                      <>
                        <div className="font-bold">{verificationResult.udyamResult.record.enterpriseName}</div>
                        <div className="text-[11px] text-slate-500 mt-1">
                          {verificationResult.udyamResult.record.nicDescription} ({verificationResult.udyamResult.record.enterpriseType})
                        </div>
                      </>
                    ) : (
                      <div className="text-slate-500 text-[11px]">
                        {lang === 'hi' ? 'वैकल्पिक या गैर-पंजीकृत' : 'Optional sole proprietor or exempt entity'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Utility Bill 90-Day Check */}
                <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase text-slate-500">
                      {lang === 'hi' ? 'पते का प्रमाण' : 'Address Proof Recency'}
                    </span>
                    {verificationResult.addressCheck?.valid ? (
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                        {lang === 'hi' ? 'वैध (<90 दिन)' : 'Valid (<90d)'}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded">
                        {lang === 'hi' ? 'समयसीमा समाप्त' : 'Expired'}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-700 font-medium">
                    <div>{lang === 'hi' ? 'जारी तिथि:' : 'Issued:'} {addressProofDate}</div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      {verificationResult.addressCheck?.message}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={() => setKycStep(2)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{lang === 'hi' ? 'अन्य डॉसियर की जांच करें' : 'Test Another Specimen'}</span>
                </button>

                {verificationResult.outcome === 'VERIFIED' ? (
                  <button
                    onClick={handleCreateOrder}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-200 transition"
                  >
                    <span>{lang === 'hi' ? 'ऑर्डर की पुष्टि करें और इंस्टॉलेशन बुक करें' : 'Confirm Order & Schedule Installation'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : verificationResult.outcome === 'MANUAL_REVIEW' ? (
                  <button
                    onClick={handleCreateOrder}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-lg shadow-amber-200 transition"
                  >
                    <span>{lang === 'hi' ? 'फील्ड सहायता व डेस्क समीक्षा हेतु जमा करें' : 'Submit for Field Assisted Desk Review'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="text-xs text-rose-600 font-bold">
                    {lang === 'hi'
                      ? 'स्वचालित ऑनबोर्डिंग रोकी गई। कृपया वैध व्यावसायिक दस्तावेज़ अपलोड करें।'
                      : 'Automatic onboarding blocked. Please update valid business documents.'}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function KycPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading Smart KYC...</div>}>
      <KycContent />
    </Suspense>
  );
}
