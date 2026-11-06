import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      quoteId,
      businessName,
      contactName,
      contactPhone,
      serviceAddress,
      assignedPartnerId,
      notes,
    } = body;

    if (!quoteId) {
      return NextResponse.json({ success: false, error: 'Quote ID is required to create an order' }, { status: 400 });
    }

    const orderId = `ORD-202607-${Math.floor(1000 + Math.random() * 9000)}`;

    const initialHistory = [
      {
        status: 'APPLICATION_RECEIVED',
        timestamp: new Date().toISOString(),
        actor: `${contactName || 'Customer'} (Self-service Checkout)`,
      },
      {
        status: 'KYC_PROCESSING',
        timestamp: new Date().toISOString(),
        actor: 'Smart KYC Automated Engine',
      },
    ];

    const order = await prisma.order.create({
      data: {
        id: orderId,
        quoteId,
        businessName: businessName || 'Enterprise Client',
        contactName: contactName || 'Authorized Signatory',
        contactPhone: contactPhone || '9876543210',
        serviceAddress: serviceAddress || 'Main Street, Business District',
        status: 'KYC_VERIFIED', // After passing KYC step
        scheduledInstallDate: '2026-07-21',
        assignedPartnerId: assignedPartnerId || 'PRT-ACCEL-DIRECT',
        assignedAgentId: 'AGT-DIGITAL-01',
        notes: notes || 'Online onboarding through Accel Udyam Digital Portal',
        historyJson: JSON.stringify([
          ...initialHistory,
          {
            status: 'KYC_VERIFIED',
            timestamp: new Date().toISOString(),
            actor: 'DigiLocker & GSTN Automated Registry Match',
          },
          {
            status: 'ORDER_CONFIRMED',
            timestamp: new Date().toISOString(),
            actor: 'System Auto-Approval',
          },
        ]),
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const order = await prisma.order.findUnique({
        where: { id },
        include: { quote: true },
      });
      if (!order) {
        return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, order });
    }

    const orders = await prisma.order.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: { quote: true },
    });

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Support updating order status for demo controls
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, nextStatus, actorName, notes } = body;

    const existing = await prisma.order.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const history = JSON.parse(existing.historyJson || '[]');
    history.push({
      status: nextStatus,
      timestamp: new Date().toISOString(),
      actor: actorName || 'Demo Controller',
      notes: notes || `State transitioned to ${nextStatus}`,
    });

    const updated = await prisma.order.update({
      where: { id },
      data: {
        status: nextStatus,
        historyJson: JSON.stringify(history),
      },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

