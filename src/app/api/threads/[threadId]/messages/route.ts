import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateCampaignStrategy } from '@/lib/gemini';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    const { threadId } = await params;
    if (!threadId || !supabaseAdmin) {
      return NextResponse.json({ success: true, messages: [] });
    }

    const { data, error } = await supabaseAdmin
      .from('chat_messages')
      .select('*')
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true });

    if (error) {
      console.warn('Error fetching thread messages:', error.message);
      return NextResponse.json({ success: true, messages: [] });
    }

    return NextResponse.json({ success: true, messages: data || [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    const { threadId } = await params;
    const body = await req.json().catch(() => null);

    if (!body || !body.query) {
      return NextResponse.json({ success: false, error: 'Query is required.' }, { status: 400 });
    }

    const rawQuery = String(body.query).trim();
    const userId = String(body.userId || 'guest_user');

    if (rawQuery.length < 3) {
      return NextResponse.json({ success: false, error: 'Question is too short.' }, { status: 400 });
    }

    // Call Gemini with context
    const strategy = await generateCampaignStrategy(rawQuery, 'general');

    const userMessageId = crypto.randomUUID();
    const assistantMessageId = crypto.randomUUID();
    const now = new Date().toISOString();

    if (supabaseAdmin && userId !== 'guest_user') {
      try {
        await supabaseAdmin.from('chat_messages').insert([
          {
            id: userMessageId,
            thread_id: threadId,
            user_id: userId,
            role: 'user',
            content: rawQuery,
          },
          {
            id: assistantMessageId,
            thread_id: threadId,
            user_id: userId,
            role: 'assistant',
            content: strategy.summary,
            strategy_data: strategy,
          },
        ]);

        // Update thread updated_at
        await supabaseAdmin
          .from('chat_threads')
          .update({ updated_at: now })
          .eq('id', threadId);
      } catch (dbError) {
        console.warn('Supabase message insert error:', dbError);
      }
    }

    return NextResponse.json({
      success: true,
      userMessage: {
        id: userMessageId,
        thread_id: threadId,
        user_id: userId,
        role: 'user',
        content: rawQuery,
        created_at: now,
      },
      assistantMessage: {
        id: assistantMessageId,
        thread_id: threadId,
        user_id: userId,
        role: 'assistant',
        content: strategy.summary,
        strategy_data: strategy,
        created_at: now,
      },
    });
  } catch (err: any) {
    console.error('Error posting message:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}

