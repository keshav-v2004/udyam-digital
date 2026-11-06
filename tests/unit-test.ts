import { recommendProducts, BusinessRequirements } from '../src/lib/recommendation-engine';
import { checkGstinFormat, checkUdyamFormat, checkAddressProofAge } from '../src/lib/kyc-verification';

// Synthetic catalogue mock subset for testing
const mockProducts = [
  {
    id: 'P01',
    category: 'Connectivity',
    name: 'Biz Fibre 100',
    description: '100 Mbps',
    unit: 'per site',
    priceMinInrPerMonth: 999,
    priceMaxInrPerMonth: 1199,
    oneTimeSetupInr: 0,
    minContractMonths: 12,
    availableCityTiers: '1;2',
    minEmployees: 1,
    minSites: 1,
    requiresGstin: false,
    requiresOneOf: null,
    typicalInstallDays: 5,
    targetSegments: 'micro;prof'
  },
  {
    id: 'P02',
    category: 'Connectivity',
    name: 'Biz Fibre 300',
    description: '300 Mbps',
    unit: 'per site',
    priceMinInrPerMonth: 1499,
    priceMaxInrPerMonth: 1799,
    oneTimeSetupInr: 0,
    minContractMonths: 12,
    availableCityTiers: '1;2',
    minEmployees: 1,
    minSites: 1,
    requiresGstin: false,
    requiresOneOf: null,
    typicalInstallDays: 5,
    targetSegments: 'prof;multi'
  },
  {
    id: 'P12',
    category: 'Communication',
    name: 'Cloud Telephony / SIP',
    description: 'IVR & call recording',
    unit: 'per channel',
    priceMinInrPerMonth: 1000,
    priceMaxInrPerMonth: 1500,
    oneTimeSetupInr: 2000,
    minContractMonths: 12,
    availableCityTiers: '1;2',
    minEmployees: 3,
    minSites: 1,
    requiresGstin: true,
    requiresOneOf: 'P01|P02',
    typicalInstallDays: 5,
    targetSegments: 'prof;multi'
  },
  {
    id: 'P19',
    category: 'Cloud & Productivity',
    name: 'Cloud POS & Billing',
    description: 'GST-ready billing',
    unit: 'per counter',
    priceMinInrPerMonth: 599,
    priceMaxInrPerMonth: 899,
    oneTimeSetupInr: 2500,
    minContractMonths: 12,
    availableCityTiers: '1;2',
    minEmployees: 1,
    minSites: 1,
    requiresGstin: false,
    requiresOneOf: null,
    typicalInstallDays: 3,
    targetSegments: 'micro;multi'
  }
];

function runTests() {
  console.log('🧪 Running Accel Business Udyam Digital Automated Tests...\n');
  let passed = 0;
  let total = 0;

  function assert(name: string, condition: boolean) {
    total++;
    if (condition) {
      console.log(`  ✓ ${name}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${name}`);
    }
  }

  // 1. Test Kirana Recommendation
  const kiranaReq: BusinessRequirements = {
    businessType: 'Kirana & Grocery Retail',
    employeeCount: 2,
    numSites: 1,
    city: 'Jaipur',
    cityTier: 2,
    hasGstin: true,
    hasUdyam: false,
    internetNeed: 'basic',
    toolsNeeded: ['pos'],
    communicationNeed: [],
  };
  const kiranaBundle = recommendProducts(kiranaReq, mockProducts as any);
  assert('Kirana Store recommends Retail Connect bundle', kiranaBundle.bundleName === 'Retail Connect');
  assert('Kirana bundle contains Biz Fibre 100 as core', kiranaBundle.primaryProducts.some(p => p.product.id === 'P01'));
  assert('Kirana bundle includes Cloud POS for billing', kiranaBundle.primaryProducts.some(p => p.product.id === 'P19'));

  // 2. Test Clinic Recommendation
  const clinicReq: BusinessRequirements = {
    businessType: 'Dental clinic',
    employeeCount: 6,
    numSites: 1,
    city: 'Kochi',
    cityTier: 2,
    hasGstin: true,
    hasUdyam: true,
    internetNeed: 'high_speed',
    toolsNeeded: [],
    communicationNeed: ['sip_ivr'],
  };
  const clinicBundle = recommendProducts(clinicReq, mockProducts as any);
  assert('Clinic recommends Clinic Connect bundle', clinicBundle.bundleName === 'Clinic Connect');
  assert('Clinic bundle includes Biz Fibre 300', clinicBundle.primaryProducts.some(p => p.product.id === 'P02'));
  assert('Clinic bundle includes Cloud Telephony/SIP', clinicBundle.primaryProducts.some(p => p.product.id === 'P12'));

  // 3. Test GSTIN & Udyam Validators
  assert('Valid synthetic GSTIN passes check', checkGstinFormat('32TTNXB7384T1ZW'));
  assert('Invalid GSTIN length or characters rejected', !checkGstinFormat('INVALID_GSTIN_123'));
  assert('Valid synthetic Udyam format passes check', checkUdyamFormat('UDYAM-KL-00-3078801'));
  assert('Invalid Udyam pattern rejected', !checkUdyamFormat('UDYAM-12345'));

  // 4. Test Address Proof Recency (Cutoff July 15, 2026)
  const freshBill = checkAddressProofAge('2026-06-15'); // 30 days old
  assert('Utility bill under 90 days is accepted', freshBill.valid && freshBill.daysOld <= 90);

  const staleBill = checkAddressProofAge('2026-02-15'); // 150 days old
  assert('Utility bill over 90 days is rejected', !staleBill.valid && staleBill.daysOld > 90);

  console.log(`\n🎉 Test Results: ${passed}/${total} assertions passed!`);
}

runTests();

