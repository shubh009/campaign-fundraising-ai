import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateCampaignStrategy } from '@/lib/gemini';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: true, threads: [] });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ success: true, threads: [] });
    }

    const { data, error } = await supabaseAdmin
      .from('chat_threads')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.warn('Error fetching threads:', error.message);
      return NextResponse.json({ success: true, threads: [] });
    }

    return NextResponse.json({ success: true, threads: data || [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || !body.query) {
      return NextResponse.json({ success: false, error: 'Query is required.' }, { status: 400 });
    }

    const rawQuery = String(body.query).trim();
    const userId = String(body.userId || 'guest_user');
    const category = String(body.category || 'general');

    if (rawQuery.length < 5) {
      return NextResponse.json({ success: false, error: 'Question must be at least 5 characters.' }, { status: 400 });
    }

    // Generate strategy via Gemini
    const strategy = await generateCampaignStrategy(rawQuery, category);

    // Create thread title from query (first 40 characters)
    const title = rawQuery.length > 45 ? rawQuery.slice(0, 42) + '...' : rawQuery;

    let threadId = crypto.randomUUID();

    if (supabaseAdmin && userId !== 'guest_user') {
      try {
        // 1. Insert Thread
        const { data: threadData, error: threadError } = await supabaseAdmin
          .from('chat_threads')
          .insert([
            {
              id: threadId,
              user_id: userId,
              title: title,
              category: category,
            },
          ])
          .select()
          .single();

        if (threadData) {
          threadId = threadData.id;

          // 2. Insert User Prompt message
          await supabaseAdmin.from('chat_messages').insert([
            {
              thread_id: threadId,
              user_id: userId,
              role: 'user',
              content: rawQuery,
            },
            {
              thread_id: threadId,
              user_id: userId,
              role: 'assistant',
              content: strategy.summary,
              strategy_data: strategy,
            },
          ]);
        } else if (threadError) {
          console.warn('Supabase thread insert warning:', threadError.message);
        }
      } catch (dbError) {
        console.warn('Supabase thread db error:', dbError);
      }
    }

    return NextResponse.json({
      success: true,
      thread: {
        id: threadId,
        user_id: userId,
        title: title,
        category: category,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      strategy: strategy,
    });
  } catch (err: any) {
    console.error('Error creating thread:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}

