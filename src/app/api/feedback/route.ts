import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { FeedbackResponse } from '@/types/campaign';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json<FeedbackResponse>(
        { success: false, error: 'Invalid payload.' },
        { status: 400 }
      );
    }

    const queryId = typeof body.queryId === 'string' ? body.queryId.trim() : '';
    const rating = body.rating === 'positive' || body.rating === 'negative' ? body.rating : null;
    const comments = typeof body.comments === 'string' ? body.comments.slice(0, 500) : '';

    if (!rating) {
      return NextResponse.json<FeedbackResponse>(
        { success: false, error: 'Valid rating (positive or negative) is required.' },
        { status: 400 }
      );
    }

    if (supabaseAdmin && queryId) {
      try {
        await supabaseAdmin.from('campaign_feedback').insert([
          {
            query_id: queryId,
            rating: rating,
            comments: comments || null,
          },
        ]);
      } catch (dbError) {
        console.warn('Supabase feedback logging warning:', dbError);
      }
    }

    return NextResponse.json<FeedbackResponse>(
      { success: true, message: 'Thank you for your feedback!' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json<FeedbackResponse>(
      { success: false, error: error?.message || 'Failed to submit feedback.' },
      { status: 500 }
    );
  }
}

