'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { translations } from '@/lib/translations';
import {
  ShieldCheck,
  Zap,
  Building2,
  Stethoscope,
  GraduationCap,
  UtensilsCrossed,
  Factory,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  PhoneCall,
  Clock,
  Sparkles,
  BarChart3,
  Users2,
  FileCheck2,
  Store
} from 'lucide-react';

export default function HomePage() {
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const t = translations[lang];

  const categories = [
    {
      name: lang === 'hi' ? 'किराना व रीटेल' : 'Retail & Kirana',
      icon: Store,
      badge: lang === 'hi' ? 'रीटेल कनेक्ट' : 'Retail Connect',
      desc: lang === 'hi' ? 'जीएसटी बिलिंग पीओएस, गेस्ट हॉटस्पॉट और 100 Mbps बिज़नेस फाइबर।' : 'GST Billing POS, guest hotspot isolation, and 100 Mbps Biz Fibre.',
      price: '₹1,598/mo',
      href: '/advisor?preset=kirana',
    },
    {
      name: lang === 'hi' ? 'क्लिनिक व स्वास्थ्य सेवा' : 'Clinics & Healthcare',
      icon: Stethoscope,
      badge: lang === 'hi' ? 'क्लिनिक कनेक्ट' : 'Clinic Connect',
      desc: lang === 'hi' ? 'मरीज़ अपॉइंटमेंट आईवीआर, व्हाट्सएप अलर्ट्स और 300 Mbps एसएलए कनेक्टिविटी।' : 'Patient appointment IVR, WhatsApp updates, and 300 Mbps SLA connectivity.',
      price: '₹4,897/mo',
      href: '/advisor?preset=clinic',
    },
    {
      name: lang === 'hi' ? 'कोचिंग व शिक्षण संस्थान' : 'Education & Coaching',
      icon: GraduationCap,
      badge: lang === 'hi' ? 'एजुकेशन कनेक्ट' : 'Education Connect',
      desc: lang === 'hi' ? 'कैंपस प्रबंधित वाई-फाई, अभिभावक एसएमएस प्रसारण और सुरक्षित क्लाउड बैकअप।' : 'Campus-wide managed Wi-Fi, parent SMS broadcast, and cloud data backup.',
      price: '₹3,498/mo',
      href: '/advisor?preset=coaching',
    },
    {
      name: lang === 'hi' ? 'रेस्तरां व कैफ़े' : 'Restaurants & Cafes',
      icon: UtensilsCrossed,
      badge: lang === 'hi' ? 'रेस्तरां कनेक्ट' : 'Restaurant Connect',
      desc: lang === 'hi' ? 'किचन पीओएस सिंक, लाइव क्लाउड सीसीटीवी निगरानी और 5G एयरफाइबर बैकअप।' : 'Kitchen POS sync, live cloud CCTV monitoring, and 5G AirFiber failover.',
      price: '₹2,697/mo',
      href: '/advisor?preset=restaurant',
    },
    {
      name: lang === 'hi' ? 'लघु विनिर्माण व उद्योग' : 'Small Manufacturing',
      icon: Factory,
      badge: lang === 'hi' ? 'मैन्युफैक्चरर कनेक्ट' : 'Manufacturer Connect',
      desc: lang === 'hi' ? 'समर्पित इंटरनेट लीज्ड लाइन (99.5% अपटाइम SLA), मशीन IoT और फायरवॉल सुरक्षा।' : 'Dedicated Internet Leased Line (99.5% SLA), machine IoT uptime and firewall.',
      price: '₹11,998/mo',
      href: '/advisor?preset=manufacturer',
    },
    {
      name: lang === 'hi' ? 'पेशेवर कार्यालय (CA व वकील)' : 'Professional Offices (CA / Law)',
      icon: Briefcase,
      badge: lang === 'hi' ? 'प्रोफेशनल कनेक्ट' : 'Professional Connect',
      desc: lang === 'hi' ? 'स्टैटिक आईपी वीपीएन, ब्रांडेड डोमेन ईमेल सूट और स्वचालित बहीखाता क्लाउड बैकअप।' : 'Static IP VPN access, branded domain email suite, and offsite ledger backup.',
      price: '₹3,897/mo',
      href: '/advisor?preset=professional',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-rose-200">
              A
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">Accel Business</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600">
            <Link href="/advisor" className="hover:text-rose-600 transition flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-rose-500" />
              {t.navAdvisor}
            </Link>
            <Link href="/quote" className="hover:text-rose-600 transition">
              {t.navQuote}
            </Link>
            <Link href="/kyc" className="hover:text-rose-600 transition flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-emerald-600" />
              {t.navKyc}
            </Link>
            <Link href="/tracker" className="hover:text-rose-600 transition">
              {t.navTracker}
            </Link>
            <Link href="/partner" className="hover:text-rose-600 transition flex items-center gap-1">
              <Users2 className="w-4 h-4" />
              {t.navPartner}
            </Link>
            <Link href="/admin" className="hover:text-rose-600 transition flex items-center gap-1">
              <BarChart3 className="w-4 h-4" />
              {t.navAnalytics}
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            {/* Language Switcher */}
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs font-semibold">
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-md transition ${lang === 'en' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                English
              </button>
              <button
                onClick={() => setLang('hi')}
                className={`px-2.5 py-1 rounded-md transition ${lang === 'hi' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                हिन्दी
              </button>
            </div>

            <Link
              href="/advisor"
              className="bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm px-4 py-2 rounded-lg shadow-sm hover:shadow transition"
            >
              {t.navGetStarted}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-rose-50/60 via-white to-slate-50 pt-16 pb-20 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100/80 border border-rose-200 text-rose-800 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.heroPill}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
            {t.heroTitle}
          </h1>

          <p className="mt-4 text-xl sm:text-2xl font-semibold text-rose-600">
            &ldquo;{t.tagline}&rdquo;
          </p>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t.heroSubtitle}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/advisor"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-base px-8 py-3.5 rounded-xl shadow-lg shadow-rose-200 hover:shadow-rose-300 transition duration-200"
            >
              <span>{t.ctaAdvisor}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/admin"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-base px-6 py-3.5 rounded-xl shadow-sm transition"
            >
              <BarChart3 className="w-4 h-4 text-slate-500" />
              <span>{t.ctaInsights}</span>
            </Link>
          </div>

          {/* Quick Stats Grid */}
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm text-center">
              <div className="text-2xl font-black text-slate-900">{t.statFibreTitle}</div>
              <p className="mt-1 text-xs text-slate-500 font-medium">{t.statFibreSpeed}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm text-center">
              <div className="text-2xl font-black text-rose-600">{t.statSingleBillTitle}</div>
              <p className="mt-1 text-xs text-slate-500 font-medium">{t.statSingleBill}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm text-center">
              <div className="text-2xl font-black text-emerald-600">{t.statInstallTimeTitle}</div>
              <p className="mt-1 text-xs text-slate-500 font-medium">{t.statInstallTime}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem vs Accel Digital Solution */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {t.benefitsTitle}
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base">
              {t.benefitsSubtitle}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-rose-50/50 border border-rose-200 rounded-2xl p-6 sm:p-8">
              <h3 className="font-bold text-rose-900 text-lg flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-rose-200 text-rose-700 flex items-center justify-center text-xs font-bold">✕</span>
                {t.traditionalTitle}
              </h3>
              <ul className="mt-5 space-y-3.5 text-sm text-rose-950">
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold">•</span>
                  <span><strong>{t.traditional1Title}</strong> {t.traditional1Desc}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold">•</span>
                  <span><strong>{t.traditional2Title}</strong> {t.traditional2Desc}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold">•</span>
                  <span><strong>{t.traditional3Title}</strong> {t.traditional3Desc}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold">•</span>
                  <span><strong>{t.traditional4Title}</strong> {t.traditional4Desc}</span>
                </li>
              </ul>
            </div>

            <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 sm:p-8">
              <h3 className="font-bold text-emerald-900 text-lg flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                {t.digitalTitle}
              </h3>
              <ul className="mt-5 space-y-3.5 text-sm text-emerald-950">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>{t.digital1Title}</strong> {t.digital1Desc}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>{t.digital2Title}</strong> {t.digital2Desc}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>{t.digital3Title}</strong> {t.digital3Desc}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>{t.digital4Title}</strong> {t.digital4Desc}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Business Categories / Sector Bundles */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {t.categoriesTitle}
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base">
              {t.categoriesSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((c, idx) => {
              const IconComp = c.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200/90 p-6 hover:shadow-md transition duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                        <IconComp className="w-6 h-6 text-rose-600" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                        {c.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">{c.name}</h3>
                    <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
                      {c.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-semibold text-slate-400">{t.startingFrom}</div>
                      <div className="text-base font-extrabold text-slate-900">{c.price}</div>
                    </div>
                    <Link
                      href={c.href}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline"
                    >
                      <span>{t.configureBundle}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-sm border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white font-bold text-lg">
                A
              </div>
              <span className="text-white font-bold text-lg tracking-tight">Accel Business</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.footerTagline}
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">{t.footerPortfolios}</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/advisor?preset=kirana" className="hover:text-white">{lang === 'hi' ? 'रीटेल कनेक्ट' : 'Retail Connect'}</Link></li>
              <li><Link href="/advisor?preset=clinic" className="hover:text-white">{lang === 'hi' ? 'क्लिनिक कनेक्ट' : 'Clinic Connect'}</Link></li>
              <li><Link href="/advisor?preset=coaching" className="hover:text-white">{lang === 'hi' ? 'एजुकेशन कनेक्ट' : 'Education Connect'}</Link></li>
              <li><Link href="/advisor?preset=restaurant" className="hover:text-white">{lang === 'hi' ? 'रेस्तरां कनेक्ट' : 'Restaurant Connect'}</Link></li>
              <li><Link href="/advisor?preset=manufacturer" className="hover:text-white">{lang === 'hi' ? 'मैन्युफैक्चरर कनेक्ट' : 'Manufacturer Connect'}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">{t.footerCapabilities}</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/advisor" className="hover:text-white">{t.navAdvisor}</Link></li>
              <li><Link href="/kyc" className="hover:text-white">{t.navKyc}</Link></li>
              <li><Link href="/quote" className="hover:text-white">{t.navQuote}</Link></li>
              <li><Link href="/tracker" className="hover:text-white">{t.navTracker}</Link></li>
              <li><Link href="/partner" className="hover:text-white">{t.navPartner}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">{t.footerGovernance}</h4>
            <div className="space-y-2 text-xs">
              <p className="text-slate-400">{t.footerGovernanceDesc}</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
          {t.footerCopyright}
        </div>
      </footer>
    </div>
  );
}
