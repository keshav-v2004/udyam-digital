'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Building,
  Info,
  Clock,
  Sparkles,
} from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  category: string;
  monthlyPrice: number;
  setupFee: number;
  quantity: number;
  isMandatory: boolean;
  requiresOneOf?: string | null;
  unit: string;
}

export default function QuotePage() {
  const router = useRouter();
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  // Quote Customer Details
  const [businessName, setBusinessName] = useState('Balaji Dental Care LLP');
  const [contactName, setContactName] = useState('Prakash Shah');
  const [contactPhone, setContactPhone] = useState('9876543210');
  const [contactEmail, setContactEmail] = useState('prakash@balajidental.in');
  const [businessType, setBusinessType] = useState('Dental clinic');
  const [city, setCity] = useState('Kochi');
  const [state, setState] = useState('Kerala');
  const [pinCode, setPinCode] = useState('682001');

  // Contract selection
  const [contractMonths, setContractMonths] = useState(12);
  const [discountPercent, setDiscountPercent] = useState(10); // 10% annual commitment discount

  // Items in Quote
  const [items, setItems] = useState<CartItem[]>([
    {
      id: 'P02',
      name: 'Biz Fibre 300',
      category: 'Connectivity',
      monthlyPrice: 1499,
      setupFee: 0,
      quantity: 1,
      isMandatory: true,
      unit: 'per site',
    },
    {
      id: 'P12',
      name: 'Cloud Telephony / SIP',
      category: 'Communication',
      monthlyPrice: 1000,
      setupFee: 2000,
      quantity: 2,
      isMandatory: false,
      requiresOneOf: 'P01|P02|P03|P04|P05|P06',
      unit: 'per channel',
    },
    {
      id: 'P15',
      name: 'WhatsApp Business API Starter',
      category: 'Communication',
      monthlyPrice: 999,
      setupFee: 0,
      quantity: 1,
      isMandatory: false,
      unit: 'per account',
    },
    {
      id: 'P22',
      name: 'Secure Wi-Fi with Guest Network',
      category: 'Security',
      monthlyPrice: 399,
      setupFee: 1000,
      quantity: 1,
      isMandatory: false,
      requiresOneOf: 'P01|P02|P03|P04',
      unit: 'per site',
    },
  ]);

  // Catalog add-ons available to toggle
  const availableAddons: CartItem[] = [
    {
      id: 'P23',
      name: 'Cloud CCTV (1080p)',
      category: 'IoT & Physical',
      monthlyPrice: 199,
      setupFee: 1800,
      quantity: 1,
      isMandatory: false,
      requiresOneOf: 'P01|P02|P03|P04|P05|P06',
      unit: 'per camera',
    },
    {
      id: 'P17',
      name: 'Cloud Backup 1 TB',
      category: 'Cloud & Productivity',
      monthlyPrice: 499,
      setupFee: 0,
      quantity: 1,
      isMandatory: false,
      unit: 'per account',
    },
    {
      id: 'P11',
      name: 'Static IP',
      category: 'Connectivity',
      monthlyPrice: 200,
      setupFee: 0,
      quantity: 1,
      isMandatory: false,
      requiresOneOf: 'P01|P02|P03',
      unit: 'per IP',
    },
    {
      id: 'P20',
      name: 'Endpoint Security',
      category: 'Security',
      monthlyPrice: 99,
      setupFee: 0,
      quantity: 3,
      isMandatory: false,
      unit: 'per device',
    },
  ];

  // Try to load bundle from advisor if saved
  useEffect(() => {
    const saved = localStorage.getItem('current_bundle');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.recommendation) {
          const r = parsed.recommendation;
          const mappedItems: CartItem[] = [];

          r.primaryProducts.forEach((p: any) => {
            mappedItems.push({
              id: p.product.id,
              name: p.product.name,
              category: p.product.category,
              monthlyPrice: p.monthlyPrice,
              setupFee: p.setupFee,
              quantity: p.quantity,
              isMandatory: true,
              unit: p.product.unit,
            });
          });

          // Preload recommended add-ons
          r.addOnProducts.forEach((a: any) => {
            if (a.isRecommended) {
              mappedItems.push({
                id: a.product.id,
                name: a.product.name,
                category: a.product.category,
                monthlyPrice: a.monthlyPrice,
                setupFee: a.setupFee,
                quantity: a.quantity,
                isMandatory: false,
                unit: a.product.unit,
              });
            }
          });

          setItems(mappedItems);
          if (parsed.requirements) {
            setBusinessType(parsed.requirements.businessType);
            setCity(parsed.requirements.city);
          }
        }
      } catch (e) {
        console.error('Error restoring bundle from storage:', e);
      }
    }
  }, []);

  // Calculated totals
  const subtotalMonthly = items.reduce((sum, item) => sum + item.monthlyPrice * item.quantity, 0);
  const totalSetup = items.reduce((sum, item) => sum + item.setupFee * item.quantity, 0);
  const discountInr = Math.round((subtotalMonthly * discountPercent) / 100);
  const discountedMonthly = subtotalMonthly - discountInr;
  const gstInr = Math.round(discountedMonthly * 0.18); // 18% GST standard telecom
  const netMonthlyRecurring = discountedMonthly + gstInr;

  // Add-on Handlers
  const handleAddItem = (addon: CartItem) => {
    if (items.some(i => i.id === addon.id)) return;
    setItems([...items, addon]);
  };

  const handleRemoveItem = (id: string) => {
    const item = items.find(i => i.id === id);
    if (item?.isMandatory) {
      alert(
        lang === 'hi'
          ? 'यह मुख्य कनेक्टिविटी उत्पाद आपके बंडल के लिए अनिवार्य है और इसे हटाया नहीं जा सकता।'
          : 'This core connectivity product is required for your bundle and cannot be removed.'
      );
      return;
    }
    setItems(items.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems(
      items.map(item => {
        if (item.id === id) {
          const next = Math.max(1, item.quantity + delta);
          return { ...item, quantity: next };
        }
        return item;
      })
    );
  };

  const [saving, setSaving] = useState(false);
  const [savedQuoteId, setSavedQuoteId] = useState<string | null>(null);

  const handleSaveAndCheckout = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName,
          contactName,
          contactPhone,
          contactEmail,
          businessType,
          segment: 'Professional offices',
          city,
          cityTier: 2,
          state,
          pinCode,
          items,
          monthlyRecurring: subtotalMonthly,
          oneTimeCharges: totalSetup,
          discountInr,
          taxInr: gstInr,
          netMonthlyInr: netMonthlyRecurring,
          contractMonths,
          notes: 'Configured from Quote Studio',
        }),
      });

      const data = await res.json();
      if (data.success && data.quote) {
        setSavedQuoteId(data.quote.id);
        localStorage.setItem('active_quote_id', data.quote.id);
        localStorage.setItem('active_quote_data', JSON.stringify(data.quote));
        router.push(`/kyc?quoteId=${data.quote.id}`);
      }
    } catch (err) {
      console.error('Error saving quote:', err);
    } finally {
      setSaving(false);
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Commercial Configuration & Items */}
          <div className="lg:col-span-8 space-y-6">
            {/* Customer Details Box */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Building className="w-5 h-5 text-rose-600" />
                <span>{lang === 'hi' ? 'ग्राहक और सेवा स्थान विवरण' : 'Customer & Service Location Details'}</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block uppercase font-bold text-slate-500 mb-1">
                    {lang === 'hi' ? 'व्यापार का नाम' : 'Business Name'}
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={e => setBusinessName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block uppercase font-bold text-slate-500 mb-1">
                    {lang === 'hi' ? 'अधिकृत संपर्क व्यक्ति' : 'Authorized Contact'}
                  </label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={e => setContactName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block uppercase font-bold text-slate-500 mb-1">
                    {lang === 'hi' ? 'मोबाइल नंबर' : 'Mobile Number'}
                  </label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={e => setContactPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block uppercase font-bold text-slate-500 mb-1">
                    {lang === 'hi' ? 'शहर' : 'City'}
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block uppercase font-bold text-slate-500 mb-1">
                    {lang === 'hi' ? 'राज्य' : 'State'}
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={e => setState(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block uppercase font-bold text-slate-500 mb-1">
                    {lang === 'hi' ? 'पिन कोड' : 'PIN Code'}
                  </label>
                  <input
                    type="text"
                    value={pinCode}
                    onChange={e => setPinCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>
            </div>

            {/* Selected Products List */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-rose-600" />
                  <span>
                    {lang === 'hi'
                      ? `चयनित बंडल उत्पाद (${items.length})`
                      : `Selected Bundle Components (${items.length})`}
                  </span>
                </h2>
                <span className="text-xs text-slate-500">
                  {lang === 'hi' ? 'लाइव स्वचालित कीमत गणना' : 'Live automatic price recalculation'}
                </span>
              </div>

              <div className="space-y-3">
                {items.map(item => (
                  <div
                    key={item.id}
                    className="border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{item.name}</span>
                        <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          {item.category}
                        </span>
                        {item.isMandatory && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                            {lang === 'hi' ? 'मुख्य (अनिवार्य)' : 'Core (Mandatory)'}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        ₹{item.monthlyPrice.toLocaleString('en-IN')}{lang === 'hi' ? '/माह' : '/mo'} • {item.unit}{' '}
                        {item.setupFee > 0
                          ? (lang === 'hi' ? `• सेटअप: ₹${item.setupFee}` : `• Setup: ₹${item.setupFee}`)
                          : (lang === 'hi' ? '• सेटअप: निःशुल्क' : '• Setup: Free')}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      {/* Quantity Controls */}
                      <div className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={item.quantity <= 1}
                          className="w-6 h-6 rounded-lg bg-white shadow-2xs flex items-center justify-center text-slate-600 hover:text-slate-900 disabled:opacity-30"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-6 h-6 rounded-lg bg-white shadow-2xs flex items-center justify-center text-slate-600 hover:text-slate-900"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <div className="w-24 text-right">
                        <div className="font-black text-sm text-slate-900">
                          ₹{(item.monthlyPrice * item.quantity).toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-slate-400">{lang === 'hi' ? '/माह' : '/mo'}</div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={item.isMandatory}
                        title={item.isMandatory ? 'Mandatory dependency' : 'Remove product'}
                        className="text-slate-400 hover:text-rose-600 disabled:opacity-20 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Add-on Toggles */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
                {lang === 'hi' ? 'उपलब्ध ऐड-ऑन अपग्रेड्स' : 'Available Add-on Upgrades'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availableAddons
                  .filter(addon => !items.some(i => i.id === addon.id))
                  .map(addon => (
                    <div
                      key={addon.id}
                      className="border border-slate-200/90 rounded-2xl p-4 flex items-center justify-between gap-3 bg-slate-50/50"
                    >
                      <div>
                        <div className="font-bold text-xs text-slate-900">{addon.name}</div>
                        <div className="text-[11px] text-slate-500">
                          ₹{addon.monthlyPrice}{lang === 'hi' ? '/माह' : '/mo'} {addon.setupFee > 0 ? `+ ₹${addon.setupFee} setup` : ''}
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddItem(addon)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-700 hover:border-rose-500 hover:text-rose-600 transition shadow-2xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{lang === 'hi' ? 'जोड़ें' : 'Add'}</span>
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Right Column: Pricing Breakdown & Commercial Terms */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 mb-4">
                {lang === 'hi' ? 'व्यावसायिक सारांश' : 'Commercial Summary'}
              </h2>

              {/* Contract Term Selector */}
              <div className="mb-5">
                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
                  {lang === 'hi' ? 'अनुबंध अवधि प्रतिबद्धता' : 'Contract Duration Commitment'}
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => {
                      setContractMonths(12);
                      setDiscountPercent(10);
                    }}
                    className={`p-3 rounded-xl border font-bold text-center transition ${
                      contractMonths === 12
                        ? 'bg-rose-50 border-rose-500 text-rose-700'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div>{lang === 'hi' ? '12 महीने' : '12 Months'}</div>
                    <span className="text-[10px] text-rose-600 font-semibold">
                      {lang === 'hi' ? '10% बंडल छूट' : '10% Bundle Discount'}
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setContractMonths(24);
                      setDiscountPercent(15);
                    }}
                    className={`p-3 rounded-xl border font-bold text-center transition ${
                      contractMonths === 24
                        ? 'bg-rose-50 border-rose-500 text-rose-700'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div>{lang === 'hi' ? '24 महीने' : '24 Months'}</div>
                    <span className="text-[10px] text-emerald-600 font-semibold">
                      {lang === 'hi' ? '15% अधिकतम बचत' : '15% Max Savings'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Price Calculation Line Items */}
              <div className="space-y-3 text-xs border-b border-slate-100 pb-4 mb-4">
                <div className="flex items-center justify-between text-slate-600">
                  <span>{lang === 'hi' ? 'मासिक आवर्ती उप-योग' : 'Monthly Recurring Subtotal'}</span>
                  <span className="font-semibold text-slate-900">
                    ₹{subtotalMonthly.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-emerald-600 font-medium">
                  <span>{lang === 'hi' ? `बंडल प्रतिबद्धता छूट (${discountPercent}%)` : `Bundle Commitment Discount (${discountPercent}%)`}</span>
                  <span>- ₹{discountInr.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span>{lang === 'hi' ? 'छूट के बाद मूल शुल्क' : 'Discounted Base Charges'}</span>
                  <span className="font-semibold text-slate-900">
                    ₹{discountedMonthly.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span>{lang === 'hi' ? 'लागू जीएसटी (18% इनपुट क्रेडिट योग्य)' : 'Applicable GST (18% Input Credit Eligible)'}</span>
                  <span className="font-semibold text-slate-900">
                    + ₹{gstInr.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600 pt-2 border-t border-dashed border-slate-200">
                  <span>{lang === 'hi' ? 'एकमुश्त सेटअप / राउटर शुल्क' : 'One-time Setup / Router Fees'}</span>
                  <span className="font-semibold text-slate-900">
                    ₹{totalSetup.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Total Net Monthly */}
              <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-200/80">
                <div className="text-[11px] font-bold uppercase text-slate-400">
                  {lang === 'hi' ? 'कुल शुद्ध मासिक बिल' : 'Total Net Monthly Bill'}
                </div>
                <div className="text-3xl font-black text-slate-900 mt-1">
                  ₹{netMonthlyRecurring.toLocaleString('en-IN')}
                  <span className="text-xs font-medium text-slate-500"> {lang === 'hi' ? '/माह (जीएसटी सहित)' : '/month (incl. GST)'}</span>
                </div>
                <p className="mt-1 text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {lang === 'hi'
                    ? 'आपके व्यावसायिक इनवॉइस पर पूर्ण जीएसटी इनपुट क्रेडिट उपलब्ध।'
                    : 'Full GST credit available on your business invoice.'}
                </p>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleSaveAndCheckout}
                disabled={saving}
                className="w-full inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm py-4 rounded-xl shadow-lg shadow-rose-200 hover:shadow-rose-300 transition"
              >
                {saving ? (
                  <span>{lang === 'hi' ? 'कोट तैयार किया जा रहा है...' : 'Generating Quote Record...'}</span>
                ) : (
                  <>
                    <span>{lang === 'hi' ? 'स्मार्ट डिजिटल सत्यापन (KYC) पर आगे बढ़ें' : 'Proceed to Smart Digital KYC'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="mt-4 text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>{lang === 'hi' ? 'पारदर्शी कीमतें • कोट 15 दिनों के लिए वैध' : 'Transparent Pricing • Quote valid for 15 days'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
