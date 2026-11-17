import { NextRequest, NextResponse } from 'next/server';
import { generateCampaignStrategy } from '@/lib/gemini';
import { supabaseAdmin } from '@/lib/supabase';
import { GenerateStrategyResponse } from '@/types/campaign';

// In-memory rate limiting map for basic abuse prevention (max 10 requests per minute per IP)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 10;

  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count += 1;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    // 1. IP & Rate Limit verification
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    if (!checkRateLimit(ip)) {
      return NextResponse.json<GenerateStrategyResponse>(
        { success: false, error: 'Too many requests. Please wait a minute before asking another question.' },
        { status: 429 }
      );
    }

    // 2. Payload Extraction & Defensive Sanitization
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json<GenerateStrategyResponse>(
        { success: false, error: 'Invalid request payload.' },
        { status: 400 }
      );
    }

    const rawQuery = typeof body.query === 'string' ? body.query : '';
    const sanitizedQuery = rawQuery.trim();
    const category = typeof body.category === 'string' ? body.category.slice(0, 50) : 'general';
    const sessionId = typeof body.sessionId === 'string' ? body.sessionId.slice(0, 100) : null;

    if (!sanitizedQuery || sanitizedQuery.length < 5) {
      return NextResponse.json<GenerateStrategyResponse>(
        { success: false, error: 'Please enter a detailed fundraising question (minimum 5 characters).' },
        { status: 400 }
      );
    }

    if (sanitizedQuery.length > 800) {
      return NextResponse.json<GenerateStrategyResponse>(
        { success: false, error: 'Your question is too long. Please keep it under 800 characters.' },
        { status: 400 }
      );
    }

    // 3. Call Gemini Engine
    const strategy = await generateCampaignStrategy(sanitizedQuery, category);

    // 4. Log to Supabase Database (if configured)
    let logId = crypto.randomUUID();
    if (supabaseAdmin) {
      try {
        const { data, error } = await supabaseAdmin
          .from('campaign_queries')
          .insert([
            {
              session_id: sessionId,
              query_text: sanitizedQuery,
              category: category,
              strategy_summary: strategy.summary,
              strategy_data: strategy,
            },
          ])
          .select('id')
          .single();

        if (data?.id) {
          logId = data.id;
        } else if (error) {
          console.warn('Supabase logging warning:', error.message);
        }
      } catch (dbError) {
        console.warn('Supabase DB unreachable, continuing with generated response:', dbError);
      }
    }

    strategy.id = logId;

    return NextResponse.json<GenerateStrategyResponse>(
      {
        success: true,
        data: strategy,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error in /api/generate-strategy:', error);
    const errorMessage =
      error?.message || 'An unexpected error occurred while generating the campaign strategy.';

    return NextResponse.json<GenerateStrategyResponse>(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

