export interface KycSpecimen {
  id: string; // K01 to K12
  leadId: string;
  businessName: string;
  expectedOutcome: 'VERIFIED' | 'MANUAL_REVIEW' | 'REJECTED';
  primaryIssue?: string;
  documents: {
    gstin?: string;
    udyam?: string;
    signatoryName?: string;
    addressProofDate?: string;
    notes?: string;
  };
}

export const KYC_SPECIMENS: KycSpecimen[] = [
  {
    id: 'K01',
    leadId: 'L00001',
    businessName: 'Balaji Dental Care LLP',
    expectedOutcome: 'VERIFIED',
    documents: {
      gstin: '32TTNXB7384T1ZW',
      udyam: 'UDYAM-KL-00-3078801',
      signatoryName: 'Prakash Shah',
      addressProofDate: '2026-06-15',
      notes: 'Clean application, active GSTIN and matching Udyam certification in Kochi, Kerala.',
    },
  },
  {
    id: 'K02',
    leadId: 'L00002',
    businessName: 'Saffron Bakers',
    expectedOutcome: 'VERIFIED',
    documents: {
      gstin: '03PJNXS4821G1ZB',
      udyam: undefined, // Proprietorship without Udyam
      signatoryName: 'Sneha Rao',
      addressProofDate: '2026-06-20',
      notes: 'Clean sole proprietorship. Active GSTIN in Ludhiana, Punjab.',
    },
  },
  {
    id: 'K03',
    leadId: 'L00003',
    businessName: 'Star Electronics',
    expectedOutcome: 'VERIFIED',
    documents: {
      gstin: '33MFTXS9954Q1Z9',
      udyam: 'UDYAM-TN-00-3866196',
      signatoryName: 'Joseph Joshi',
      addressProofDate: '2026-06-01',
      notes: 'Retail chain with valid Chennai registry.',
    },
  },
  {
    id: 'K04',
    leadId: 'L00004',
    businessName: 'Zenith Diagnostics',
    expectedOutcome: 'VERIFIED',
    documents: {
      gstin: '27QTBXZ1995X1Z9',
      udyam: 'UDYAM-MH-00-7656096',
      signatoryName: 'Harpreet Bhat',
      addressProofDate: '2026-05-28',
      notes: 'Diagnostic lab in Nagpur. All registries active.',
    },
  },
  {
    id: 'K05',
    leadId: 'L00005',
    businessName: 'Royal Fashions',
    expectedOutcome: 'MANUAL_REVIEW',
    primaryIssue: 'Missing Udyam certificate in physical dossier despite registration on portal',
    documents: {
      gstin: '32AITXR9985H1ZT',
      udyam: 'UDYAM-KL-00-2007485',
      signatoryName: 'Vikram Bhat',
      addressProofDate: '2026-05-10',
      notes: 'Dossier lacks physical Udyam scan. Cross-registry lookup passes but manual review required.',
    },
  },
  {
    id: 'K06',
    leadId: 'L00006',
    businessName: 'Amrit Fashions',
    expectedOutcome: 'VERIFIED',
    documents: {
      gstin: '08JVKXA4705I1Z0',
      udyam: 'UDYAM-RJ-00-3201049',
      signatoryName: 'Rekha Shah',
      addressProofDate: '2026-06-12',
      notes: 'Jaipur apparel store with matching GSTIN and Udyam.',
    },
  },
  {
    id: 'K07',
    leadId: 'L00007',
    businessName: 'Green Leaf Physio Clinic',
    expectedOutcome: 'VERIFIED',
    documents: {
      gstin: '03ZCKXG5592Y1ZG',
      udyam: 'UDYAM-PB-00-4186215',
      signatoryName: 'Shalini Nair',
      addressProofDate: '2026-06-10',
      notes: 'Ludhiana clinic. Complete verified dataset.',
    },
  },
  {
    id: 'K08',
    leadId: 'L00008',
    businessName: 'Royal Auto Components',
    expectedOutcome: 'MANUAL_REVIEW',
    primaryIssue: 'Address proof electricity bill older than 90 days (issued Feb 2026 vs July 2026 cutoff)',
    documents: {
      gstin: '03JEUXR9399M1ZI',
      udyam: undefined,
      signatoryName: 'Naveen Gupta',
      addressProofDate: '2026-02-15', // Older than 90 days from 2026-07-15 (150 days)
      notes: 'Utility bill dated 2026-02-15 is 150 days old, violating the 90-day validity rule.',
    },
  },
  {
    id: 'K09',
    leadId: 'L00009',
    businessName: 'Riddhi Fashions Pvt Ltd',
    expectedOutcome: 'VERIFIED',
    documents: {
      gstin: '37ZHYXR1505E1ZY',
      udyam: 'UDYAM-AP-00-8759641',
      signatoryName: 'Rajesh Menon',
      addressProofDate: '2026-06-25',
      notes: 'Visakhapatnam Pvt Ltd enterprise, verified across both registries.',
    },
  },
  {
    id: 'K10',
    leadId: 'L00010',
    businessName: 'Ganga Stationers',
    expectedOutcome: 'MANUAL_REVIEW',
    primaryIssue: 'Signatory name mismatch: document submitted by unauthorized relative rather than registered proprietor',
    documents: {
      gstin: '09YHJXG6633U1ZC',
      udyam: undefined,
      signatoryName: 'Aman Sharma', // Registered is Farhan Sharma
      addressProofDate: '2026-06-18',
      notes: 'Signatory ID does not match proprietor name registered on GST certificate (Farhan Sharma).',
    },
  },
  {
    id: 'K11',
    leadId: 'L00011',
    businessName: 'Sahyadri Realty',
    expectedOutcome: 'REJECTED',
    primaryIssue: 'GSTIN registration status is SUSPENDED on the GST Common Portal for tax filing defaults',
    documents: {
      gstin: '23QYBXS1811Q1ZD',
      udyam: undefined,
      signatoryName: 'Meera Kulkarni',
      addressProofDate: '2026-06-05',
      notes: 'GSTIN lookup in mock_gstin_registry.csv indicates status "Suspended". Automated rejection triggered.',
    },
  },
  {
    id: 'K12',
    leadId: 'L00012',
    businessName: 'Blue Lotus Opticals',
    expectedOutcome: 'REJECTED',
    primaryIssue: 'Unregistered entity with missing mandatory GSTIN for broadband contract and invalid tax credentials',
    documents: {
      gstin: 'UNREGISTERED_00',
      udyam: undefined,
      signatoryName: 'Manoj Pillai',
      addressProofDate: '2026-06-02',
      notes: 'No GSTIN provided, unable to verify business registration.',
    },
  },
];

