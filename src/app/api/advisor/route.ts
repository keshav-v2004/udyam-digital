import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { recommendProducts, BusinessRequirements } from '@/lib/recommendation-engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { explainWithAi = false, unconventionalPrompt, ...requirementsInput } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    // 1. Optional unconventional / natural language input parsing
    if (unconventionalPrompt && typeof unconventionalPrompt === 'string') {
      if (!apiKey) {
        return NextResponse.json({
          success: false,
          error: 'GEMINI_API_KEY is not configured on the server to parse natural language descriptions.',
        }, { status: 400 });
      }

      try {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey });
        const parsePrompt = `You are an AI assistant for an Indian telecom SMB advisor (Airtel Business).
Extract business details from this natural language description:
"${unconventionalPrompt}"

Return ONLY a valid JSON object with the following fields (estimate sensible defaults if unspecified):
{
  "businessType": string (e.g., "Retail & Grocery", "Clinic & Diagnostic", "Coaching & Education", "Cafe & Restaurant", "Small Manufacturer", "Professional Office"),
  "employeeCount": number (integer >= 1),
  "numSites": number (integer >= 1),
  "city": string (city name in India, default "Delhi"),
  "cityTier": 1 or 2 (1 for Tier 1 / metro like Delhi, Mumbai, Bengaluru; 2 for other cities),
  "hasGstin": boolean,
  "hasUdyam": boolean,
  "internetNeed": "basic" | "high_speed" | "dedicated_sla" | "no_fibre",
  "toolsNeeded": array of strings subset of ["pos", "cctv", "wifi", "email", "backup", "security"],
  "communicationNeed": array of strings subset of ["postpaid", "sip_ivr", "whatsapp_api", "sms_marketing"],
  "budgetMonthly": number (integer in INR)
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: parsePrompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const rawText = response.text || '{}';
        const parsed = JSON.parse(rawText);

        return NextResponse.json({
          success: true,
          mode: 'parsed_intent',
          parsedRequirements: parsed,
        });
      } catch (err: any) {
        console.error('Failed to parse unconventional input with Gemini:', err);
        return NextResponse.json({
          success: false,
          error: 'Failed to interpret description with AI. Please use standard inputs or verify GEMINI_API_KEY.',
        }, { status: 500 });
      }
    }

    // 2. Local Deterministic Product Recommendation Engine
    const reqData = requirementsInput as BusinessRequirements;
    const products = await prisma.product.findMany();
    const bundle = recommendProducts(reqData, products);

    // Default to the deterministic local rationale
    let aiExplanation = bundle.rationale;
    let isAiGenerated = false;

    // 3. Optional on-demand AI Explanation (only invoked when client explicitly requests it)
    if (explainWithAi && apiKey) {
      try {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `You are the Accel Business Udyam Advisor.
The customer has specified:
- Business: ${reqData.businessType} in ${reqData.city}
- Employees: ${reqData.employeeCount}, Branches/Sites: ${reqData.numSites}
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
          isAiGenerated = true;
        }
      } catch (err) {
        console.warn('Gemini API explanation request failed, using deterministic local rationale:', err);
      }
    }

    return NextResponse.json({
      success: true,
      bundle,
      aiExplanation,
      isAiGenerated,
    });
  } catch (error: any) {
    console.error('Advisor recommendation error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
