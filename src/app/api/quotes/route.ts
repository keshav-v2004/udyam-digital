import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      businessName,
      contactName,
      contactPhone,
      contactEmail,
      businessType,
      segment,
      city,
      cityTier,
      state,
      pinCode,
      items,
      monthlyRecurring,
      oneTimeCharges,
      discountInr,
      taxInr,
      netMonthlyInr,
      contractMonths,
      notes,
    } = body;

    const quoteId = `QUOTE-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const saved = await prisma.savedQuote.create({
      data: {
        id: quoteId,
        businessName: businessName || 'Valued Business Client',
        contactName: contactName || 'Authorized Signatory',
        contactPhone: contactPhone || '9876543210',
        contactEmail: contactEmail || null,
        businessType: businessType || 'General Retail',
        segment: segment || 'Micro retail & services',
        city: city || 'New Delhi',
        cityTier: cityTier || 1,
        state: state || 'Delhi',
        pinCode: pinCode || '110001',
        itemsJson: JSON.stringify(items || []),
        monthlyRecurring: Number(monthlyRecurring) || 0,
        oneTimeCharges: Number(oneTimeCharges) || 0,
        discountInr: Number(discountInr) || 0,
        taxInr: Number(taxInr) || Math.round((Number(monthlyRecurring) || 0) * 0.18),
        netMonthlyInr: Number(netMonthlyInr) || (Number(monthlyRecurring) || 0) + Math.round((Number(monthlyRecurring) || 0) * 0.18),
        contractMonths: Number(contractMonths) || 12,
        notes: notes || null,
      },
    });

    return NextResponse.json({ success: true, quote: saved });
  } catch (error: any) {
    console.error('Quote save error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      const quotes = await prisma.savedQuote.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json({ success: true, quotes });
    }

    const quote = await prisma.savedQuote.findUnique({
      where: { id },
      include: { orders: true },
    });

    if (!quote) {
      return NextResponse.json({ success: false, error: 'Quote not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, quote });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

