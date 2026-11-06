'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users2,
  Share2,
  Award,
  TrendingUp,
  Plus,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  Clock,
  ShieldCheck,
  Building,
  UserCheck,
} from 'lucide-react';

export default function PartnerPortalPage() {
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [role, setRole] = useState<'PARTNER' | 'SALES_EXEC' | 'ADMIN'>('PARTNER');
  const [partnerId, setPartnerId] = useState('PRT-KOC-01');

  // New Lead Form State
  const [showReferModal, setShowReferModal] = useState(false);
  const [newBizName, setNewBizName] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCity, setNewCity] = useState('Kochi');

  // Referrals List State
  const [referrals, setReferrals] = useState([
    {
      id: 'REF-001',
      partnerName: 'Malabar Infocom Services',
      businessName: 'Malabar Diagnostic Lab',
      contactName: 'George Kurian',
      contactPhone: '9847012345',
      city: 'Kochi',
      status: 'QUOTED',
      commissionInr: 1200,
      createdAt: '2026-07-12',
    },
    {
      id: 'REF-002',
      partnerName: 'Apex Telecom Solutions',
      businessName: 'Sharma Auto Spares',
      contactName: 'Vikram Sharma',
      contactPhone: '9811098765',
      city: 'Delhi',
      status: 'ACTIVATED',
      commissionInr: 2500,
      createdAt: '2026-07-08',
    },
    {
      id: 'REF-003',
      partnerName: 'Apex Telecom Solutions',
      businessName: 'Gupta Medical Clinic',
      contactName: 'Dr. R. Gupta',
      contactPhone: '9811011223',
      city: 'Delhi',
      status: 'KYC_COMPLETE',
      commissionInr: 1800,
      createdAt: '2026-07-10',
    },
  ]);

  const handleAddReferral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBizName || !newPhone) return;

    const newRef = {
      id: `REF-00${referrals.length + 1}`,
      partnerName: 'Malabar Infocom Services',
      businessName: newBizName,
      contactName: newContact || 'Store Manager',
      contactPhone: newPhone,
      city: newCity,
      status: 'REFERRED',
      commissionInr: 1000,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setReferrals([newRef, ...referrals]);
    setShowReferModal(false);
    setNewBizName('');
    setNewContact('');
    setNewPhone('');
  };

  const totalEarnings = referrals
    .filter(r => r.status === 'ACTIVATED' || r.status === 'KYC_COMPLETE')
    .reduce((s, r) => s + r.commissionInr, 0);

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

          {/* Role and Language Switcher */}
          <div className="flex items-center space-x-4">
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs font-bold">
              <button
                onClick={() => setRole('PARTNER')}
                className={`px-3 py-1 rounded-md transition ${role === 'PARTNER' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
              >
                {lang === 'hi' ? 'चैनल पार्टनर' : 'Channel Partner'}
              </button>
              <button
                onClick={() => setRole('SALES_EXEC')}
                className={`px-3 py-1 rounded-md transition ${role === 'SALES_EXEC' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
              >
                {lang === 'hi' ? 'सेल्स एग्जीक्यूटिव' : 'Sales Executive'}
              </button>
              <button
                onClick={() => setRole('ADMIN')}
                className={`px-3 py-1 rounded-md transition ${role === 'ADMIN' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
              >
                {lang === 'hi' ? 'व्यवस्थापक' : 'Admin'}
              </button>
            </div>

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-xs font-bold uppercase text-slate-400">
              {lang === 'hi' ? 'कुल संदर्भित लीड्स' : 'Total Referred Leads'}
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">{referrals.length}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {lang === 'hi' ? 'स्थानीय फील्ड टीमों को आवंटित' : 'Assigned to local field nodes'}
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-xs font-bold uppercase text-slate-400">
              {lang === 'hi' ? 'सफल एक्टिवेशन' : 'Successful Activations'}
            </div>
            <div className="text-2xl font-black text-emerald-600 mt-1">
              {referrals.filter(r => r.status === 'ACTIVATED').length}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {lang === 'hi' ? '5 दिनों के भीतर सक्रिय' : 'Under 5-day cycle'}
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-xs font-bold uppercase text-slate-400">
              {lang === 'hi' ? 'अर्जित कमीशन भुगतान' : 'Earned Payouts'}
            </div>
            <div className="text-2xl font-black text-rose-600 mt-1">
              ₹{totalEarnings.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {lang === 'hi' ? 'सीधे बैंक खाते में जमा' : 'Direct bank credit'}
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase text-slate-400">
                {lang === 'hi' ? 'सहायता प्राप्त ऑनबोर्डिंग' : 'Assisted Onboarding'}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {lang === 'hi' ? 'दस्तावेज़ सत्यापन में दुकानदारों की मदद करें' : 'Help MSMEs struggling with KYC'}
              </div>
            </div>
            <button
              onClick={() => setShowReferModal(true)}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'नया व्यवसाय जोड़ें' : 'Refer MSME'}</span>
            </button>
          </div>
        </div>

        {/* Modal for Refer MSME */}
        {showReferModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-base text-slate-900">
                  {lang === 'hi' ? 'नए छोटे व्यवसाय को संदर्भित करें' : 'Refer a New Small Business'}
                </h3>
                <button
                  onClick={() => setShowReferModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddReferral} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold uppercase text-slate-500 mb-1">
                    {lang === 'hi' ? 'व्यवसाय का नाम' : 'Business Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newBizName}
                    onChange={e => setNewBizName(e.target.value)}
                    placeholder="e.g. Apex Engineering Works"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-slate-500 mb-1">
                    {lang === 'hi' ? 'मालिक / संपर्क व्यक्ति का नाम' : 'Owner Contact Name'}
                  </label>
                  <input
                    type="text"
                    value={newContact}
                    onChange={e => setNewContact(e.target.value)}
                    placeholder="e.g. Ramesh Nair"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-slate-500 mb-1">
                    {lang === 'hi' ? 'मोबाइल नंबर' : 'Mobile Number'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={e => setNewPhone(e.target.value)}
                    placeholder="e.g. 9847001122"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-slate-500 mb-1">
                    {lang === 'hi' ? 'शहर' : 'City'}
                  </label>
                  <input
                    type="text"
                    value={newCity}
                    onChange={e => setNewCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReferModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 font-semibold"
                  >
                    {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold"
                  >
                    {lang === 'hi' ? 'रेफरल जमा करें' : 'Submit Referral'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Referrals & Assisted Applications Table */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {role === 'SALES_EXEC'
                  ? (lang === 'hi' ? 'आवंटित फील्ड कार्य और लंबित आवेदन' : 'Assigned Field Queue & Lead Interventions')
                  : (lang === 'hi' ? 'रेफर किए गए व्यवसायों की पाइपलाइन' : 'Referred Business Pipeline')}
              </h2>
              <p className="text-xs text-slate-500">
                {role === 'SALES_EXEC'
                  ? (lang === 'hi'
                      ? 'अधूरे आवेदनों की पहचान करें और त्वरित सत्यापन में ग्राहकों की सहायता करें।'
                      : 'Identify incomplete quotes and assist business owners with instant Smart KYC clearance.')
                  : (lang === 'hi'
                      ? 'अपने संदर्भित ग्राहकों की प्रगति और अर्जित कमीशन की जांच करें।'
                      : 'Track your referred clients, milestone progression, and earned distributor commissions.')}
              </p>
            </div>

            <span className="text-xs font-mono font-bold text-slate-400">
              Partner ID: {partnerId}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase">
                  <th className="py-3 px-3">{lang === 'hi' ? 'लीड संदर्भ' : 'Lead Ref'}</th>
                  <th className="py-3 px-3">{lang === 'hi' ? 'व्यवसाय' : 'Business'}</th>
                  <th className="py-3 px-3">{lang === 'hi' ? 'संपर्क व्यक्ति' : 'Contact Person'}</th>
                  <th className="py-3 px-3">{lang === 'hi' ? 'स्थान' : 'Location'}</th>
                  <th className="py-3 px-3">{lang === 'hi' ? 'स्थिति' : 'Pipeline Status'}</th>
                  <th className="py-3 px-3">{lang === 'hi' ? 'कमीशन' : 'Commission'}</th>
                  <th className="py-3 px-3 text-right">{lang === 'hi' ? 'कार्रवाई' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {referrals.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">{r.id}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{r.businessName}</td>
                    <td className="py-3 px-3 text-slate-600">
                      <div>{r.contactName}</div>
                      <div className="text-[10px] text-slate-400">{r.contactPhone}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{r.city}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          r.status === 'ACTIVATED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : r.status === 'KYC_COMPLETE'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      ₹{r.commissionInr.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href={`/advisor?preset=kirana`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700"
                      >
                        <span>{lang === 'hi' ? 'सत्यापन सहायता' : 'Assist KYC'}</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
