export interface Product {
  id: string;
  category: string;
  name: string;
  description: string;
  unit: string;
  priceMinInrPerMonth: number;
  priceMaxInrPerMonth: number;
  oneTimeSetupInr: number;
  minContractMonths: number;
  availableCityTiers: string;
  minEmployees: number;
  minSites: number;
  requiresGstin: boolean;
  requiresOneOf: string | null;
  typicalInstallDays: number;
  targetSegments: string;
}

export interface BusinessRequirements {
  businessType: string;
  employeeCount: number;
  numSites: number;
  city: string;
  cityTier: number; // 1 or 2
  hasGstin: boolean;
  hasUdyam: boolean;
  internetNeed: 'basic' | 'high_speed' | 'dedicated_sla' | 'no_fibre';
  toolsNeeded: string[]; // ['pos', 'cctv', 'domain', 'backup', 'security']
  communicationNeed: string[]; // ['postpaid', 'sip_ivr', 'toll_free', 'whatsapp_api', 'sms_marketing']
  budgetMonthly?: number;
}

export interface RecommendedBundle {
  bundleName: string;
  tagline: string;
  segment: string;
  rationale: string;
  primaryProducts: {
    product: Product;
    quantity: number;
    monthlyPrice: number;
    setupFee: number;
    reason: string;
  }[];
  addOnProducts: {
    product: Product;
    quantity: number;
    monthlyPrice: number;
    setupFee: number;
    reason: string;
    isRecommended: boolean;
  }[];
  totalMonthlyRecurring: number;
  totalOneTimeSetup: number;
  estimatedInstallDays: number;
  contractMonths: number;
}

export function recommendProducts(
  req: BusinessRequirements,
  allProducts: Product[]
): RecommendedBundle {
  const prodMap = new Map<string, Product>();
  allProducts.forEach(p => prodMap.set(p.id, p));

  const primary: RecommendedBundle['primaryProducts'] = [];
  const addOns: RecommendedBundle['addOnProducts'] = [];

  // Determine segment
  let segment = 'Micro retail & services';
  let bundleName = 'Retail Connect';
  let tagline = 'High-speed business connectivity with smart POS & Wi-Fi';

  const typeLower = req.businessType.toLowerCase();
  if (typeLower.includes('clinic') || typeLower.includes('doctor') || typeLower.includes('hospital') || typeLower.includes('diagnostic')) {
    segment = 'Professional offices';
    bundleName = 'Clinic Connect';
    tagline = 'HIPAA-compliant high-speed connectivity with patient appointment IVR & WhatsApp';
  } else if (typeLower.includes('school') || typeLower.includes('coaching') || typeLower.includes('education') || typeLower.includes('college')) {
    segment = 'Professional offices';
    bundleName = 'Education Connect';
    tagline = 'Campus-wide secure Wi-Fi, classroom bandwidth and parent alert broadcast';
  } else if (typeLower.includes('restaurant') || typeLower.includes('cafe') || typeLower.includes('hotel') || typeLower.includes('bakery')) {
    segment = 'Micro retail & services';
    bundleName = 'Restaurant Connect';
    tagline = 'Zero-lag billing, guest hotspot isolation, and live delivery CCTV';
  } else if (typeLower.includes('mfg') || typeLower.includes('manufacturer') || typeLower.includes('factory') || typeLower.includes('engineering') || typeLower.includes('auto')) {
    segment = 'Small manufacturers';
    bundleName = 'Manufacturer Connect';
    tagline = 'Dedicated 99.5% SLA leased line, endpoint cybersecurity and machine IoT monitoring';
  } else if (req.numSites > 1 || req.employeeCount > 25) {
    segment = 'Small multi-site businesses';
    bundleName = 'Enterprise Multi-Site Connect';
    tagline = 'Centrally managed SD-WAN connecting all branches under one unified bill';
  } else if (typeLower.includes('office') || typeLower.includes('consult') || typeLower.includes('law') || typeLower.includes('ca ') || typeLower.includes('firm')) {
    segment = 'Professional offices';
    bundleName = 'Professional Connect';
    tagline = 'Fast fibre broadband, domain email workspace, and static IP for secure data access';
  }

  // 1. Core Connectivity Product Selection
  let coreConnectivity: Product | undefined;

  if (segment === 'Small manufacturers' && req.hasGstin && req.employeeCount >= 10) {
    // Leased line if needed or high tier
    if (req.employeeCount >= 25 || req.internetNeed === 'dedicated_sla') {
      coreConnectivity = prodMap.get('P06') || prodMap.get('P05');
    } else {
      coreConnectivity = prodMap.get('P05');
    }
  } else if (req.internetNeed === 'no_fibre') {
    coreConnectivity = prodMap.get('P04'); // 5G AirFiber
  } else if (req.employeeCount > 15 || req.internetNeed === 'dedicated_sla') {
    coreConnectivity = prodMap.get('P03') || prodMap.get('P02'); // Biz Fibre 1G or 300
  } else if (req.employeeCount > 4 || segment === 'Professional offices') {
    coreConnectivity = prodMap.get('P02'); // Biz Fibre 300
  } else {
    coreConnectivity = prodMap.get('P01'); // Biz Fibre 100
  }

  if (coreConnectivity) {
    primary.push({
      product: coreConnectivity,
      quantity: 1,
      monthlyPrice: coreConnectivity.priceMinInrPerMonth,
      setupFee: coreConnectivity.oneTimeSetupInr,
      reason: `Primary dedicated connectivity engineered for ${req.numSites} site(s) and ${req.employeeCount} user(s).`,
    });
  }

  // 2. Multi-site requirement: SD-WAN and Backup Failover
  if (req.numSites > 2 && req.employeeCount >= 10 && req.hasGstin) {
    const sdwan = prodMap.get('P10');
    if (sdwan) {
      primary.push({
        product: sdwan,
        quantity: req.numSites,
        monthlyPrice: sdwan.priceMinInrPerMonth,
        setupFee: sdwan.oneTimeSetupInr,
        reason: 'Centralized network orchestration across multiple operational sites.',
      });
    }
  }

  if (req.numSites > 1 || segment === 'Small manufacturers' || req.internetNeed === 'dedicated_sla') {
    const failover = prodMap.get('P09');
    if (failover) {
      primary.push({
        product: failover,
        quantity: 1,
        monthlyPrice: failover.priceMinInrPerMonth,
        setupFee: failover.oneTimeSetupInr,
        reason: 'Zero-downtime automatic 4G/5G cellular failover when primary line experiences outages.',
      });
    }
  }

  // 3. Domain Tools & POS
  if (req.toolsNeeded.includes('pos') || segment === 'Micro retail & services') {
    const pos = prodMap.get('P19');
    if (pos) {
      primary.push({
        product: pos,
        quantity: 1,
        monthlyPrice: pos.priceMinInrPerMonth,
        setupFee: pos.oneTimeSetupInr,
        reason: 'GST-ready point-of-sale terminal, digital receipts, and integrated card/UPI payment acceptance.',
      });
    }
  }

  // 4. Communication Requirements
  if (req.communicationNeed.includes('sip_ivr') || segment === 'Professional offices') {
    const sip = prodMap.get('P12');
    if (sip && (req.hasGstin || req.employeeCount >= 3)) {
      primary.push({
        product: sip,
        quantity: 2,
        monthlyPrice: sip.priceMinInrPerMonth,
        setupFee: sip.oneTimeSetupInr,
        reason: 'Professional virtual receptionist, IVR tree, and automatic call recording for customer inquiries.',
      });
    }
  }

  if (req.communicationNeed.includes('whatsapp_api') || req.toolsNeeded.includes('whatsapp')) {
    const wa = prodMap.get('P15');
    if (wa && req.hasGstin) {
      primary.push({
        product: wa,
        quantity: 1,
        monthlyPrice: wa.priceMinInrPerMonth,
        setupFee: wa.oneTimeSetupInr,
        reason: 'Official Meta-verified WhatsApp Business channel for customer notifications and catalog order taking.',
      });
    }
  }

  // 5. Postpaid lines
  if (req.communicationNeed.includes('postpaid') || req.employeeCount >= 3) {
    const pp = prodMap.get('P07');
    if (pp) {
      const qty = Math.min(Math.max(1, Math.floor(req.employeeCount / 2)), 5);
      primary.push({
        product: pp,
        quantity: qty,
        monthlyPrice: pp.priceMinInrPerMonth,
        setupFee: pp.oneTimeSetupInr,
        reason: `Pooled CUG business postpaid lines with unlimited calling for staff.`,
      });
    }
  }

  // 6. Add-Ons Formulation
  // Wi-Fi Guest Network
  const wifi = prodMap.get('P22');
  if (wifi) {
    addOns.push({
      product: wifi,
      quantity: 1,
      monthlyPrice: wifi.priceMinInrPerMonth,
      setupFee: wifi.oneTimeSetupInr,
      reason: 'Separates internal billing network from customer Wi-Fi with OTP login and safety filtering.',
      isRecommended: segment === 'Micro retail & services' || segment === 'Professional offices',
    });
  }

  // Cloud CCTV
  const cctv = prodMap.get('P23');
  if (cctv) {
    addOns.push({
      product: cctv,
      quantity: req.numSites >= 2 ? 4 : 2,
      monthlyPrice: cctv.priceMinInrPerMonth,
      setupFee: cctv.oneTimeSetupInr,
      reason: 'Secure 1080p surveillance with 30 days tamper-proof cloud backup and remote mobile monitoring.',
      isRecommended: req.toolsNeeded.includes('cctv') || segment === 'Micro retail & services',
    });
  }

  // Static IP
  const staticIp = prodMap.get('P11');
  if (staticIp) {
    addOns.push({
      product: staticIp,
      quantity: 1,
      monthlyPrice: staticIp.priceMinInrPerMonth,
      setupFee: staticIp.oneTimeSetupInr,
      reason: 'Static IPv4 address essential for secure VPN tunnels, remote CCTV access, and ERP hosting.',
      isRecommended: segment === 'Professional offices' || segment === 'Small manufacturers',
    });
  }

  // Cloud Email / Office Suite
  const email = prodMap.get('P16');
  if (email) {
    addOns.push({
      product: email,
      quantity: Math.min(req.employeeCount, 10),
      monthlyPrice: email.priceMinInrPerMonth,
      setupFee: email.oneTimeSetupInr,
      reason: 'Branded email addresses (@yourbusiness.com) with cloud storage and video meetings.',
      isRecommended: segment === 'Professional offices' || req.toolsNeeded.includes('email'),
    });
  }

  // Cloud Backup
  const backup = prodMap.get('P17');
  if (backup) {
    addOns.push({
      product: backup,
      quantity: 1,
      monthlyPrice: backup.priceMinInrPerMonth,
      setupFee: backup.oneTimeSetupInr,
      reason: 'Automated 1 TB daily offsite encrypted backup for accounting ledgers and billing records.',
      isRecommended: req.toolsNeeded.includes('backup') || segment === 'Small manufacturers',
    });
  }

  // Endpoint Security
  const security = prodMap.get('P20');
  if (security) {
    addOns.push({
      product: security,
      quantity: Math.min(req.employeeCount, 5),
      monthlyPrice: security.priceMinInrPerMonth,
      setupFee: security.oneTimeSetupInr,
      reason: 'AI-driven antivirus and ransomware shield across payment POS and office workstations.',
      isRecommended: segment === 'Professional offices' || segment === 'Small manufacturers',
    });
  }

  // Machine Monitoring IoT (Manufacturing only)
  if (segment === 'Small manufacturers' && req.hasGstin) {
    const iot = prodMap.get('P24');
    if (iot) {
      addOns.push({
        product: iot,
        quantity: 2,
        monthlyPrice: iot.priceMinInrPerMonth,
        setupFee: iot.oneTimeSetupInr,
        reason: 'Real-time telemetry and energy tracking sensors for industrial plant machinery.',
        isRecommended: true,
      });
    }
  }

  // Total calculation
  let totalMonthly = 0;
  let totalSetup = 0;
  let maxInstallDays = 5;
  let maxContract = 12;

  primary.forEach(item => {
    totalMonthly += item.monthlyPrice * item.quantity;
    totalSetup += item.setupFee * item.quantity;
    if (item.product.typicalInstallDays > maxInstallDays) maxInstallDays = item.product.typicalInstallDays;
    if (item.product.minContractMonths > maxContract) maxContract = item.product.minContractMonths;
  });

  return {
    bundleName,
    tagline,
    segment,
    rationale: `Custom tailored for ${req.businessType} in ${req.city} (${req.cityTier === 1 ? 'Metro' : 'Tier-2'}) with ${req.employeeCount} staff. Delivers enterprise-grade reliability with zero wasted infrastructure.`,
    primaryProducts: primary,
    addOnProducts: addOns,
    totalMonthlyRecurring: totalMonthly,
    totalOneTimeSetup: totalSetup,
    estimatedInstallDays: maxInstallDays,
    contractMonths: maxContract,
  };
}

