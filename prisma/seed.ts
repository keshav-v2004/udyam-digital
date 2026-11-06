import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { prisma } from '../src/lib/prisma';

async function seed() {
  console.log('🌱 Starting database seeding from CSV files in ../data ...');
  const dataDir = path.resolve(process.cwd(), '../data');

  // 1. Seed Product Catalogue
  console.log('Seeding products...');
  const prodCsvPath = path.join(dataDir, 'product_catalogue.csv');
  const prodContent = fs.readFileSync(prodCsvPath, 'utf-8');
  const prodRecords: any[] = parse(prodContent, { columns: true, skip_empty_lines: true });

  await prisma.product.deleteMany({});
  for (const r of prodRecords) {
    await prisma.product.create({
      data: {
        id: r.product_id,
        category: r.category,
        name: r.product_name,
        description: r.description,
        unit: r.unit,
        priceMinInrPerMonth: parseInt(r.price_min_inr_per_month, 10),
        priceMaxInrPerMonth: parseInt(r.price_max_inr_per_month, 10),
        oneTimeSetupInr: parseInt(r.one_time_setup_inr, 10),
        minContractMonths: parseInt(r.min_contract_months, 10),
        availableCityTiers: r.available_city_tiers,
        minEmployees: parseInt(r.min_employees, 10),
        minSites: parseInt(r.min_sites, 10),
        requiresGstin: r.requires_gstin === 'Y',
        requiresOneOf: r.requires_one_of || null,
        typicalInstallDays: parseInt(r.typical_install_days, 10),
        targetSegments: r.target_segments,
      },
    });
  }
  console.log(`✓ Seeded ${prodRecords.length} products`);

  // 2. Seed GSTIN Registry
  console.log('Seeding GSTIN registry...');
  const gstCsvPath = path.join(dataDir, 'mock_gstin_registry.csv');
  const gstContent = fs.readFileSync(gstCsvPath, 'utf-8');
  const gstRecords: any[] = parse(gstContent, { columns: true, skip_empty_lines: true });

  await prisma.gstinRecord.deleteMany({});
  // Insert in batches of 500 for sqlite speed
  const gstBatchSize = 500;
  for (let i = 0; i < gstRecords.length; i += gstBatchSize) {
    const batch = gstRecords.slice(i, i + gstBatchSize).map(r => ({
      gstin: r.gstin,
      legalName: r.legal_name,
      tradeName: r.trade_name,
      constitution: r.constitution,
      principalPlaceOfBusiness: r.principal_place_of_business,
      state: r.state,
      registrationDate: r.registration_date,
      status: r.status,
    }));
    await prisma.gstinRecord.createMany({ data: batch });
  }
  console.log(`✓ Seeded ${gstRecords.length} GSTIN records`);

  // 3. Seed Udyam Registry
  console.log('Seeding Udyam registry...');
  const udyamCsvPath = path.join(dataDir, 'mock_udyam_registry.csv');
  const udyamContent = fs.readFileSync(udyamCsvPath, 'utf-8');
  const udyamRecords: any[] = parse(udyamContent, { columns: true, skip_empty_lines: true });

  await prisma.udyamRecord.deleteMany({});
  const udyamBatchSize = 500;
  for (let i = 0; i < udyamRecords.length; i += udyamBatchSize) {
    const batch = udyamRecords.slice(i, i + udyamBatchSize).map(r => ({
      udyamNumber: r.udyam_number,
      enterpriseName: r.enterprise_name,
      enterpriseType: r.enterprise_type,
      majorActivity: r.major_activity,
      nicDescription: r.nic_description,
      state: r.state,
      city: r.city,
      dateOfRegistration: r.date_of_registration,
    }));
    await prisma.udyamRecord.createMany({ data: batch });
  }
  console.log(`✓ Seeded ${udyamRecords.length} Udyam records`);

  // 4. Seed SMB Leads (5,000)
  console.log('Seeding SMB Leads...');
  const leadsCsvPath = path.join(dataDir, 'smb_leads.csv');
  const leadsContent = fs.readFileSync(leadsCsvPath, 'utf-8');
  const leadsRecords: any[] = parse(leadsContent, { columns: true, skip_empty_lines: true });

  await prisma.smbLead.deleteMany({});
  const leadsBatchSize = 500;
  for (let i = 0; i < leadsRecords.length; i += leadsBatchSize) {
    const batch = leadsRecords.slice(i, i + leadsBatchSize).map(r => ({
      leadId: r.lead_id,
      createdDate: r.created_date,
      leadSource: r.lead_source,
      businessName: r.business_name,
      businessType: r.business_type,
      segment: r.segment,
      city: r.city,
      cityTier: parseInt(r.city_tier, 10),
      state: r.state,
      preferredLanguage: r.preferred_language,
      employeeCount: parseInt(r.employee_count, 10),
      numSites: parseInt(r.num_sites, 10),
      annualTurnoverBand: r.annual_turnover_band,
      hasGstin: r.has_gstin,
      gstin: r.gstin || null,
      hasUdyam: r.has_udyam,
      udyamNumber: r.udyam_number || null,
      currentInternet: r.current_internet || null,
      currentProvider: r.current_provider || null,
      monthlySpendInr: r.monthly_telecom_spend_inr ? parseInt(r.monthly_telecom_spend_inr, 10) : null,
      productsOfInterest: r.products_of_interest || null,
      contactName: r.contact_name,
      contactRole: r.contact_role,
      stageReached: r.stage_reached,
      outcome: r.outcome,
      dropReason: r.drop_reason || null,
      contactedDate: r.contacted_date || null,
      needsAssessedDate: r.needs_assessed_date || null,
      quoteAcceptedDate: r.quote_accepted_date || null,
      kycCompleteDate: r.kyc_complete_date || null,
      activatedDate: r.activated_date || null,
      daysLeadToActivation: r.days_lead_to_activation ? parseInt(r.days_lead_to_activation, 10) : null,
      customerFollowUpCalls: r.customer_follow_up_calls ? parseInt(r.customer_follow_up_calls, 10) : null,
      bundleProducts: r.bundle_products || null,
      monthlyBundleValueInr: r.monthly_bundle_value_inr ? parseInt(r.monthly_bundle_value_inr, 10) : null,
      oneTimeSetupInr: r.one_time_setup_inr ? parseInt(r.one_time_setup_inr, 10) : null,
      contractMonths: r.contract_months ? parseInt(r.contract_months, 10) : null,
      churnedWithin6Months: r.churned_within_6_months || null,
      npsScore: r.nps_score ? parseInt(r.nps_score, 10) : null,
      acquisitionCostInr: parseInt(r.acquisition_cost_inr, 10) || 0,
    }));
    await prisma.smbLead.createMany({ data: batch });
  }
  console.log(`✓ Seeded ${leadsRecords.length} SMB Leads`);

  // 5. Seed some initial demo Orders and Partner Referrals
  console.log('Seeding demo quotes and orders...');
  const sampleQuote = await prisma.savedQuote.create({
    data: {
      id: 'QUOTE-DEMO-K01',
      businessName: 'Balaji Dental Care LLP',
      contactName: 'Prakash Shah',
      contactPhone: '9876543210',
      contactEmail: 'prakash@balajidental.in',
      businessType: 'Dental clinic',
      segment: 'Professional offices',
      city: 'Kochi',
      cityTier: 2,
      state: 'Kerala',
      pinCode: '682001',
      itemsJson: JSON.stringify([
        { id: 'P02', name: 'Biz Fibre 300', price: 1499, qty: 1, setup: 0, category: 'Connectivity' },
        { id: 'P12', name: 'Cloud Telephony / SIP', price: 1000, qty: 2, setup: 2000, category: 'Communication' },
        { id: 'P15', name: 'WhatsApp Business API Starter', price: 999, qty: 1, setup: 0, category: 'Communication' },
        { id: 'P22', name: 'Secure Wi-Fi with Guest Network', price: 399, qty: 1, setup: 1000, category: 'Security' },
      ]),
      monthlyRecurring: 4897,
      oneTimeCharges: 3000,
      discountInr: 400,
      taxInr: 809,
      netMonthlyInr: 5306,
      contractMonths: 12,
      notes: 'Demo pre-loaded quote for Clinic Connect Bundle',
    }
  });

  await prisma.order.create({
    data: {
      id: 'ORD-202607-0001',
      quoteId: sampleQuote.id,
      businessName: 'Balaji Dental Care LLP',
      contactName: 'Prakash Shah',
      contactPhone: '9876543210',
      serviceAddress: 'Shop/Unit 164, Station Road, Kochi, Kerala - 289398',
      status: 'INSTALLATION_SCHEDULED',
      scheduledInstallDate: '2026-07-20',
      assignedPartnerId: 'PRT-KOC-01',
      assignedAgentId: 'AGT-ACCEL-104',
      notes: 'Customer requested afternoon slot for fibre termination and ONT setup.',
      historyJson: JSON.stringify([
        { status: 'APPLICATION_RECEIVED', timestamp: '2026-07-15T09:30:00Z', actor: 'Prakash Shah (Owner)' },
        { status: 'KYC_PROCESSING', timestamp: '2026-07-15T09:35:00Z', actor: 'Smart KYC Engine' },
        { status: 'KYC_VERIFIED', timestamp: '2026-07-15T09:38:00Z', actor: 'Automated Registry Match' },
        { status: 'ORDER_CONFIRMED', timestamp: '2026-07-15T09:40:00Z', actor: 'Payment Gateway (Auto-Debit)' },
        { status: 'INSTALLATION_SCHEDULED', timestamp: '2026-07-15T11:00:00Z', actor: 'Field Dispatch Lead (Suresh)' },
      ])
    }
  });

  // Partner referrals
  await prisma.partnerReferral.createMany({
    data: [
      {
        partnerId: 'PRT-KOC-01',
        partnerName: 'Malabar Infocom Services',
        businessName: 'Malabar Diagnostic Lab',
        contactName: 'George Kurian',
        contactPhone: '9847012345',
        city: 'Kochi',
        status: 'QUOTED',
        commissionInr: 1200,
      },
      {
        partnerId: 'PRT-DEL-02',
        partnerName: 'Apex Telecom Solutions',
        businessName: 'Sharma Auto Spares',
        contactName: 'Vikram Sharma',
        contactPhone: '9811098765',
        city: 'Delhi',
        status: 'ACTIVATED',
        commissionInr: 2500,
      },
      {
        partnerId: 'PRT-DEL-02',
        partnerName: 'Apex Telecom Solutions',
        businessName: 'Gupta Medical Clinic',
        contactName: 'Dr. R. Gupta',
        contactPhone: '9811011223',
        city: 'Delhi',
        status: 'KYC_COMPLETE',
        commissionInr: 1800,
      }
    ]
  });

  console.log('🎉 Seeding completed successfully!');
}

seed()
  .catch(e => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

