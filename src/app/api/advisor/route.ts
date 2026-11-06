import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { recommendProducts, BusinessRequirements } from '@/lib/recommendation-engine';

export async function POST(req: NextRequest) {
  try {
    const body: BusinessRequirements = await req.json();

    // Fetch catalogue products
    const products = await prisma.product.findMany();

    // Run deterministic engine
    const bundle = recommendProducts(body, products);

    // AI explanation augmentation (Optional Gemini hook or fallback)
    let aiExplanation = bundle.rationale;
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `You are the Accel Business Udyam Advisor.
The customer has specified:
- Business: ${body.businessType} in ${body.city}
- Employees: ${body.employeeCount}, Branches/Sites: ${body.numSites}
- Core connectivity recommendation: ${bundle.primaryProducts.map(p => p.product.name).join(', ')}
- Add-ons: ${bundle.addOnProducts.filter(a => a.isRecommended).map(a => a.product.name).join(', ')}
- Total recurring charge: ₹${bundle.totalMonthlyRecurring}/mo

Write a crisp 2-paragraph professional rationale in simple, encouraging business English. Emphasize why unified connectivity and single billing saves money, eliminates downtime, and protects their business operations. Do not hallucinate any other product names or numbers.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        if (response.text) {
          aiExplanation = response.text;
        }
      } catch (err) {
        console.warn('Gemini API call failed, using deterministic rationale:', err);
      }
    }

    return NextResponse.json({
      success: true,
      bundle,
      aiExplanation,
    });
  } catch (error: any) {
    console.error('Advisor recommendation error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

