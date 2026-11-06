'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Users,
  Target,
  Clock,
  IndianRupee,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

const COLORS = ['#e11d48', '#0284c7', '#10b981', '#f59e0b', '#8b5cf6', '#64748b'];

export default function AdminAnalyticsPage() {
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics')
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json);
      })
      .catch(err => console.error('Analytics load error:', err))
      .finally(() => setLoading(false));
  }, []);

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
            <div className="text-xs text-slate-500 font-medium hidden sm:block">
              {lang === 'hi' ? 'डेटासेट: 5,000 सत्यापित एमएसएमई लीड्स (2026)' : 'Dataset: 5,000 Verified MSME Leads (Q1 2026 Cohort)'}
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
        {loading || !data ? (
          <div className="text-center py-20 text-slate-500">
            {lang === 'hi' ? 'डेटा विश्लेषण लोड हो रहा है...' : 'Loading dataset insights...'}
          </div>
        ) : (
          <>
            {/* Top Metric Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="text-xs font-bold uppercase text-slate-400">
                  {lang === 'hi' ? 'कुल विश्लेषित लीड्स' : 'Total Analyzed Leads'}
                </div>
                <div className="text-3xl font-black text-slate-900 mt-1">
                  {data.summary.totalLeads.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {lang === 'hi' ? '100% वास्तविक सीएसवी रिकॉर्ड्स' : '100% Real CSV records ingested'}
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="text-xs font-bold uppercase text-slate-400">
                  {lang === 'hi' ? 'सक्रिय ग्राहक' : 'Activated Customers'}
                </div>
                <div className="text-3xl font-black text-emerald-600 mt-1">
                  {data.summary.activatedCount}
                  <span className="text-xs font-semibold text-slate-400 ml-1.5">
                    ({data.summary.overallConversionRate}%)
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {lang === 'hi' ? 'पायलट लक्ष्य: ≥30% रूपांतरण' : 'Pilot Target: ≥30% Conversion'}
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="text-xs font-bold uppercase text-slate-400">
                  {lang === 'hi' ? 'पारंपरिक एक्टिवेशन समय' : 'Historical Activation Cycle'}
                </div>
                <div className="text-3xl font-black text-rose-600 mt-1">
                  {data.summary.avgActivationDays} {lang === 'hi' ? 'दिन' : 'Days'}
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                  {lang === 'hi' ? 'नया डिजिटल लक्ष्य: <5 दिन' : 'Target with Accel Digital: <5 Days'}
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="text-xs font-bold uppercase text-slate-400">
                  {lang === 'hi' ? 'औसत अधिग्रहण लागत (CAC)' : 'Blended Acquisition Cost'}
                </div>
                <div className="text-3xl font-black text-slate-900 mt-1">
                  ₹{data.summary.blendedCPA.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {lang === 'hi' ? 'प्रति एक्टिवेशन ऐतिहासिक लागत' : 'Historical cost per activation'}
                </div>
              </div>
            </div>

            {/* Segment Economics Table */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs">
              <h2 className="text-lg font-bold text-slate-900 mb-1">
                {lang === 'hi' ? 'क्षेत्रीय अर्थशास्त्र और प्राथमिकता मैट्रिक्स' : 'Segment Economics & Prioritization Matrix'}
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                {lang === 'hi'
                  ? 'यद्यपि माइक्रो रिटेल में 54.2% लीड्स हैं, मल्टी-साइट और निर्माता 8x से 12x अधिक राजस्व उत्पन्न करते हैं और उनका चर्न (रद्द दर) बहुत कम है।'
                  : 'Note: Although Micro Retail accounts for 54.2% of lead volume, Small Multi-Site and Manufacturers generate 8x-12x higher monthly revenue with significantly lower churn.'}
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase">
                      <th className="py-3 px-3">{lang === 'hi' ? 'व्यापारिक खंड' : 'Segment'}</th>
                      <th className="py-3 px-3">{lang === 'hi' ? 'कुल लीड्स' : 'Total Leads'}</th>
                      <th className="py-3 px-3">{lang === 'hi' ? 'सक्रिय' : 'Activated'}</th>
                      <th className="py-3 px-3">{lang === 'hi' ? 'रूपांतरण दर' : 'Conversion'}</th>
                      <th className="py-3 px-3">{lang === 'hi' ? 'औसत मासिक खर्च' : 'Avg Monthly Spend'}</th>
                      <th className="py-3 px-3">{lang === 'hi' ? 'अधिग्रहण लागत' : 'Acq Cost'}</th>
                      <th className="py-3 px-3">{lang === 'hi' ? '6-माह चर्न' : '6-Mo Churn'}</th>
                      <th className="py-3 px-3">{lang === 'hi' ? 'औसत NPS' : 'Avg NPS'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.segmentBreakdown.map((s: any) => (
                      <tr key={s.segment} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-3 font-bold text-slate-900">{s.segment}</td>
                        <td className="py-3 px-3 text-slate-600">
                          {s.totalLeads} ({s.leadSharePercent}%)
                        </td>
                        <td className="py-3 px-3 font-bold text-emerald-600">{s.activated}</td>
                        <td className="py-3 px-3 font-semibold text-slate-800">{s.conversionRate}%</td>
                        <td className="py-3 px-3 font-black text-slate-900">
                          ₹{s.avgMonthlySpend.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-3 text-slate-600">
                          ₹{s.avgAcquisitionCost.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                              s.churnRate > 15 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {s.churnRate}%
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-700">{s.avgNps}/10</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Funnel Progression & Drop Reasons */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Funnel Chart */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs">
                <h3 className="font-bold text-sm text-slate-900 mb-1">
                  {lang === 'hi' ? 'संपूर्ण फनल प्रगति और चरणबद्ध स्थिति' : 'Full Funnel Progression & Conversion Drop'}
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  {lang === 'hi' ? 'प्रारंभिक लीड से लेकर एक्टिवेशन तक 5,000 ग्राहकों की प्रगति।' : 'Progression across all 5,000 leads from initial ingestion to activation.'}
                </p>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.funnelProgression} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" />
                      <YAxis dataKey="stage" type="category" width={110} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#e11d48" radius={[0, 8, 8, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Drop-off Reasons */}
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs">
                <h3 className="font-bold text-sm text-slate-900 mb-1">
                  {lang === 'hi' ? 'मुख्य अड़चनें और ग्राहक छूटने के कारण' : 'Top Bottlenecks & Drop-off Causes'}
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  {lang === 'hi' ? 'किन कारणों से पारंपरिक प्रक्रिया में ग्राहकों ने आवेदन छोड़ा।' : 'Where leads abandon the traditional paper sales journey.'}
                </p>

                <div className="space-y-3">
                  {data.topDropReasons.map((r: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-slate-700 font-medium truncate max-w-[240px]">
                        {r.reason}
                      </span>
                      <span className="font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                        {r.count} {lang === 'hi' ? 'लीड्स' : 'leads'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Acquisition Channels Breakdown */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs">
              <h3 className="font-bold text-sm text-slate-900 mb-1">
                {lang === 'hi' ? 'अधिग्रहण चैनलों की दक्षता तुलना' : 'Acquisition Channel Efficiency Comparison'}
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                {lang === 'hi'
                  ? 'रेफरल और इनबाउंड कॉल्स से प्राप्त लीड्स में फील्ड विजिट की तुलना में 2x-3x अधिक रूपांतरण देखने को मिला।'
                  : 'Referral and Inbound leads show 2x-3x higher conversion compared to cold WhatsApp campaigns and Field visits.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.channelPerformance.map((ch: any) => (
                  <div key={ch.channel} className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-slate-900">{ch.channel}</span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        {ch.conversionRate}% {lang === 'hi' ? 'रूपांतरण' : 'Conv'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-1">
                      <div>{lang === 'hi' ? 'लीड्स:' : 'Leads:'} <strong className="text-slate-800">{ch.leads}</strong></div>
                      <div>{lang === 'hi' ? 'सक्रिय:' : 'Activated:'} <strong className="text-slate-800">{ch.activated}</strong></div>
                      <div>{lang === 'hi' ? 'लागत/लीड:' : 'Cost/Lead:'} <strong className="text-slate-800">₹{ch.avgCostPerLead}</strong></div>
                      <div>{lang === 'hi' ? 'लागत/सक्रिय:' : 'Cost/Act:'} <strong className="text-rose-600">₹{ch.costPerActivated}</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
