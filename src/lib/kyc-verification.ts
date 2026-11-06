import { prisma } from './prisma';

export interface GstinValidationResult {
  validFormat: boolean;
  foundInRegistry: boolean;
  status: 'Active' | 'Suspended' | 'Cancelled' | 'Not Found' | 'Invalid Format';
  record?: {
    gstin: string;
    legalName: string;
    tradeName: string;
    constitution: string;
    principalPlaceOfBusiness: string;
    state: string;
    registrationDate: string;
  };
  mismatches: string[];
  message: string;
}

export interface UdyamValidationResult {
  validFormat: boolean;
  foundInRegistry: boolean;
  status: 'Verified' | 'Not Found' | 'Invalid Format';
  record?: {
    udyamNumber: string;
    enterpriseName: string;
    enterpriseType: string;
    majorActivity: string;
    nicDescription: string;
    state: string;
    city: string;
    dateOfRegistration: string;
  };
  mismatches: string[];
  message: string;
}

/**
 * Validates GSTIN format:
 * 15 chars: 2 digits (state) + 10 char PAN (accepting 'X' as 4th char as documented) + 1 entity num + 1 'Z' + 1 check digit
 */
export function checkGstinFormat(gstin: string): boolean {
  if (!gstin || typeof gstin !== 'string') return false;
  const clean = gstin.trim().toUpperCase();
  // Document instructions: GSTINs follow real 15-char structure with 4th PAN char as X
  const regex = /^[0-9]{2}[A-Z]{3}[X|A-Z][A-Z][0-9]{4}[A-Z][0-9A-Z]Z[0-9A-Z]$/;
  return regex.test(clean);
}

/**
 * Validates Udyam Registration format:
 * Pattern: UDYAM-XX-00-0000000 (XX is 2 letter state code, 00 is district code)
 */
export function checkUdyamFormat(udyam: string): boolean {
  if (!udyam || typeof udyam !== 'string') return false;
  const clean = udyam.trim().toUpperCase();
  const regex = /^UDYAM-[A-Z]{2}-00-[0-9]{7}$/;
  return regex.test(clean);
}

export async function lookupGstin(
  gstinInput: string,
  expectedBusinessName?: string
): Promise<GstinValidationResult> {
  const gstin = gstinInput?.trim().toUpperCase();
  if (!checkGstinFormat(gstin)) {
    return {
      validFormat: false,
      foundInRegistry: false,
      status: 'Invalid Format',
      mismatches: ['Invalid GSTIN checksum or 15-character alphanumeric format structure'],
      message: 'GSTIN does not match the standard GST format (e.g. 32TTNXB7384T1ZW).',
    };
  }

  const record = await prisma.gstinRecord.findUnique({
    where: { gstin },
  });

  if (!record) {
    return {
      validFormat: true,
      foundInRegistry: false,
      status: 'Not Found',
      mismatches: ['GSTIN not present in official GST Common Portal registry'],
      message: 'GSTIN not found in government database records.',
    };
  }

  const mismatches: string[] = [];
  if (record.status !== 'Active') {
    mismatches.push(`GSTIN registration is currently ${record.status} (non-operational)`);
  }

  if (expectedBusinessName) {
    const expNorm = expectedBusinessName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const tradeNorm = record.tradeName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const legalNorm = record.legalName.toLowerCase().replace(/[^a-z0-9]/g, '');

    const nameMatches =
      tradeNorm.includes(expNorm) ||
      expNorm.includes(tradeNorm) ||
      legalNorm.includes(expNorm) ||
      expNorm.includes(legalNorm);

    if (!nameMatches) {
      mismatches.push(
        `Business name on application ("${expectedBusinessName}") does not match trade/legal name on GST certificate ("${record.tradeName}")`
      );
    }
  }

  return {
    validFormat: true,
    foundInRegistry: true,
    status: record.status as any,
    record: {
      gstin: record.gstin,
      legalName: record.legalName,
      tradeName: record.tradeName,
      constitution: record.constitution,
      principalPlaceOfBusiness: record.principalPlaceOfBusiness,
      state: record.state,
      registrationDate: record.registrationDate,
    },
    mismatches,
    message: mismatches.length === 0 ? 'GSTIN verified and active' : 'Discrepancies identified in GSTIN record',
  };
}

export async function lookupUdyam(
  udyamInput: string,
  expectedBusinessName?: string
): Promise<UdyamValidationResult> {
  const udyam = udyamInput?.trim().toUpperCase();
  if (!checkUdyamFormat(udyam)) {
    return {
      validFormat: false,
      foundInRegistry: false,
      status: 'Invalid Format',
      mismatches: ['Invalid Udyam registration structure (Expected UDYAM-XX-00-XXXXXXX)'],
      message: 'Udyam number format is invalid.',
    };
  }

  const record = await prisma.udyamRecord.findUnique({
    where: { udyamNumber: udyam },
  });

  if (!record) {
    return {
      validFormat: true,
      foundInRegistry: false,
      status: 'Not Found',
      mismatches: ['Udyam registration number not located in MSME ministry registry'],
      message: 'Udyam record not found in MSME national portal database.',
    };
  }

  const mismatches: string[] = [];
  if (expectedBusinessName) {
    const expNorm = expectedBusinessName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const regNorm = record.enterpriseName.toLowerCase().replace(/[^a-z0-9]/g, '');

    const matches = regNorm.includes(expNorm) || expNorm.includes(regNorm);
    if (!matches) {
      mismatches.push(
        `Application business name ("${expectedBusinessName}") differs from Udyam enterprise title ("${record.enterpriseName}")`
      );
    }
  }

  return {
    validFormat: true,
    foundInRegistry: true,
    status: 'Verified',
    record: {
      udyamNumber: record.udyamNumber,
      enterpriseName: record.enterpriseName,
      enterpriseType: record.enterpriseType,
      majorActivity: record.majorActivity,
      nicDescription: record.nicDescription,
      state: record.state,
      city: record.city,
      dateOfRegistration: record.dateOfRegistration,
    },
    mismatches,
    message: mismatches.length === 0 ? 'Udyam registration verified' : 'Udyam enterprise details mismatch',
  };
}

/**
 * Checks address proof validity:
 * Document instruction: Use 2026-07-15 as 'today' for date-based checks (bills must be <= 90 days old)
 */
export function checkAddressProofAge(billDateString: string): { valid: boolean; daysOld: number; message: string } {
  const referenceDate = new Date('2026-07-15T00:00:00Z');
  const billDate = new Date(billDateString);

  if (isNaN(billDate.getTime())) {
    return { valid: false, daysOld: 999, message: 'Unreadable or missing utility bill invoice date' };
  }

  const diffMs = referenceDate.getTime() - billDate.getTime();
  const daysOld = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (daysOld > 90) {
    return {
      valid: false,
      daysOld,
      message: `Utility bill is ${daysOld} days old (exceeds RBI & DPDP 90-day validity window as of July 15, 2026)`,
    };
  }

  if (daysOld < 0) {
    return {
      valid: false,
      daysOld,
      message: 'Utility bill carries a future issue date relative to the verification baseline (2026-07-15)',
    };
  }

  return {
    valid: true,
    daysOld,
    message: `Utility bill issued within acceptable ${daysOld}-day window`,
  };
}

