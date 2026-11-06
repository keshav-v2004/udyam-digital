'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Truck,
  Wrench,
  Wifi,
  PhoneCall,
  User,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

function TrackerContent() {
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get('orderId') || 'ORD-202607-0001';

  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);

  const orderStages = [
    {
      key: 'APPLICATION_RECEIVED',
      label: lang === 'hi' ? 'आवेदन प्राप्त हुआ' : 'Application Received',
      desc: lang === 'hi' ? 'डिजिटल बंडल सफलतापूर्वक जमा किया गया।' : 'Online digital bundle submitted.',
    },
    {
      key: 'KYC_PROCESSING',
      label: lang === 'hi' ? 'दस्तावेज़ प्रसंस्करण' : 'KYC Processing',
      desc: lang === 'hi' ? 'दस्तावेज़ ओसीआर और प्रारंभिक डेटा जांच।' : 'Document OCR and heuristics check.',
    },
    {
      key: 'KYC_VERIFIED',
      label: lang === 'hi' ? 'सत्यापन पूर्ण' : 'KYC Verified',
      desc: lang === 'hi' ? 'जीएसटीएन और उद्यम डेटाबेस से मिलान सफल।' : 'Cross-registry GSTIN and Udyam validation passed.',
    },
    {
      key: 'ORDER_CONFIRMED',
      label: lang === 'hi' ? 'ऑर्डर की पुष्टि' : 'Order Confirmed',
      desc: lang === 'hi' ? 'कोट स्वीकृत और उपकरण डिस्पैच हेतु तैयार।' : 'Commercial quote locked and hardware dispatched.',
    },
    {
      key: 'INSTALLATION_SCHEDULED',
      label: lang === 'hi' ? 'इंस्टॉलेशन निर्धारित' : 'Installation Scheduled',
      desc: lang === 'hi' ? 'फील्ड इंजीनियर और समय स्लॉट आरक्षित।' : 'Fibre team and engineer time slot reserved.',
    },
    {
      key: 'INSTALLATION_IN_PROGRESS',
      label: lang === 'hi' ? 'इंस्टॉलेशन प्रगति पर' : 'Installation in Progress',
      desc: lang === 'hi' ? 'परिसर में वायरिंग, फाइबर स्प्लिसिंग और राउटर सेटअप।' : 'Premises wiring, ONT splicing and router setup.',
    },
    {
      key: 'ACTIVATED',
      label: lang === 'hi' ? 'सेवा सक्रिय (लाइव)' : 'Activated',
      desc: lang === 'hi' ? 'लाइव ब्रॉडबैंड सिग्नल चालू और बिलिंग शुरू।' : 'Live broadband signal verified and billing initiated.',
    },
  ];

  useEffect(() => {
    fetchOrder();
  }, [orderIdParam]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders?id=${orderIdParam}`);
      const data = await res.json();
      if (data.success && data.order) {
        setOrder(data.order);
      }
    } catch (err) {
      console.error('Error fetching order:', err);
    } finally {
      setLoading(false);
    }
  };

  const advanceStatus = async (nextStatus: string) => {
    if (!order) return;
    setSimulating(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: order.id,
          nextStatus,
          actorName: 'Field Dispatch Lead (Suresh Kumar)',
          notes: `Milestone advanced to ${nextStatus}`,
        }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrder(data.order);
      }
    } catch (err) {
      console.error('Error advancing status:', err);
    } finally {
      setSimulating(false);
    }
  };

  const currentStageIndex = orderStages.findIndex(s => s.key === order?.status);

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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {loading ? (
          <div className="text-center py-20 text-slate-500">
            {lang === 'hi' ? 'ऑर्डर की स्थिति लोड हो रही है...' : 'Loading order milestones...'}
          </div>
        ) : !order ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-slate-900">
              {lang === 'hi' ? 'ऑर्डर नहीं मिला' : 'Order Not Found'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {lang === 'hi' ? 'कृपया अपनी ऑर्डर आईडी जांचें।' : 'Please verify your Order ID.'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top Order Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-rose-600 mb-1">
                    {lang === 'hi' ? 'ऑर्डर संदर्भ' : 'Order Reference'}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                    {order.id}
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {order.businessName} • {order.serviceAddress}
                  </p>
                </div>

                <div className="sm:text-right">
                  <div className="text-[11px] uppercase font-bold text-slate-400">
                    {lang === 'hi' ? 'अनुमानित एक्टिवेशन' : 'Estimated Activation'}
                  </div>
                  <div className="text-xl font-black text-emerald-600">
                    {order.scheduledInstallDate || (lang === 'hi' ? '5 कार्य दिवसों के भीतर' : 'Within 5 Working Days')}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {lang === 'hi' ? 'त्वरित एमएसएमई सेवा गारंटी' : 'Rapid MSME SLA Commitment'}
                  </div>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                  {orderStages.map((stg, idx) => {
                    const isPassed = idx <= currentStageIndex;
                    const isCurrent = idx === currentStageIndex;

                    return (
                      <div
                        key={stg.key}
                        className={`rounded-2xl p-3 border transition flex flex-col justify-between ${
                          isCurrent
                            ? 'bg-rose-50 border-rose-500 text-slate-900 shadow-2xs'
                            : isPassed
                            ? 'bg-emerald-50/50 border-emerald-200 text-slate-900'
                            : 'bg-slate-50 border-slate-200 opacity-60'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-bold uppercase text-slate-400">
                              0{idx + 1}
                            </span>
                            {isPassed ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Clock className="w-3.5 h-3.5 text-slate-300" />
                            )}
                          </div>
                          <div className="font-bold text-xs">{stg.label}</div>
                        </div>
                        <div className="mt-2 text-[10px] text-slate-500 leading-tight">
                          {stg.desc}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Demo Progression Controller */}
              <div className="mt-8 pt-6 border-t border-slate-100 bg-slate-50/70 -mx-6 sm:-mx-8 -mb-6 sm:-mb-8 p-6 sm:p-8 rounded-b-3xl">
                <div className="text-xs font-bold uppercase text-slate-500 mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                  <span>{lang === 'hi' ? 'लाइव परीक्षण नियंत्रण: स्थिति आगे बढ़ाएं' : 'Evaluation & Demo Controls: Advance Order Lifecycle'}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {orderStages.map(stg => (
                    <button
                      key={stg.key}
                      onClick={() => advanceStatus(stg.key)}
                      disabled={simulating}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                        order.status === stg.key
                          ? 'bg-rose-600 text-white border-rose-600'
                          : 'bg-white text-slate-700 border-slate-300 hover:border-rose-400'
                      }`}
                    >
                      {stg.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Field Assignment and Status Audit Log */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Field Engineer Card */}
              <div className="md:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-rose-600" />
                  <span>{lang === 'hi' ? 'निर्दिष्ट फील्ड इंजीनियरिंग टीम' : 'Assigned Field Engineering Team'}</span>
                </h3>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">{lang === 'hi' ? 'प्रमुख फील्ड इंजीनियर' : 'Lead Field Engineer'}</span>
                    <span className="font-bold text-slate-900">Suresh Kumar (NOC-KOC)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{lang === 'hi' ? 'स्थानीय चैनल पार्टनर' : 'Local Channel Partner'}</span>
                    <span className="font-bold text-slate-900">Malabar Infocom (PRT-KOC-01)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{lang === 'hi' ? 'फाइबर टर्मिनेशन नोड' : 'Fibre Termination Node'}</span>
                    <span className="font-mono text-slate-900">SPL-KOC-STN-04</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{lang === 'hi' ? 'ग्राहक हेल्पलाइन' : 'Customer Helpline'}</span>
                    <span className="font-bold text-rose-600">1800-103-UDYAM</span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>
                    {lang === 'hi'
                      ? 'स्थान व्यवहार्यता स्वीकृत: 40 मीटर के भीतर भूमिगत डीपी उपलब्ध।'
                      : 'Feasibility pre-cleared: Underground DP available within 40m.'}
                  </span>
                </div>
              </div>

              {/* Audit Log Timeline */}
              <div className="md:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
                <h3 className="font-bold text-sm text-slate-900 mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-rose-600" />
                  <span>{lang === 'hi' ? 'रीयल-टाइम माइलस्टोन ऑडिट लॉग' : 'Real-time Milestone Audit Trail'}</span>
                </h3>

                <div className="space-y-3">
                  {order.historyJson &&
                    JSON.parse(order.historyJson).map((h: any, idx: number) => (
                      <div key={idx} className="flex items-start gap-3 text-xs">
                        <div className="w-2 h-2 rounded-full bg-rose-600 mt-1.5 shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">{h.status}</span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {lang === 'hi' ? 'कार्यकर्ता:' : 'Actor:'} {h.actor} {h.notes ? `• ${h.notes}` : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackerPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading Order Tracker...</div>}>
      <TrackerContent />
    </Suspense>
  );
}
