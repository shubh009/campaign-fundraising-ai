import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateCampaignStrategy } from '@/lib/gemini';
import { fileStore } from '@/lib/storage';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'guest_user';

    let remoteThreads: any[] = [];

    if (supabaseAdmin) {
      try {
        const { data, error } = await supabaseAdmin
          .from('chat_threads')
          .select('*')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false });

        if (!error && Array.isArray(data) && data.length > 0) {
          remoteThreads = data;
        }
      } catch (e) {
        // Table not created yet in Supabase
      }
    }

    // Disk-persisted storage fallback
    const diskList = fileStore.getThreads(userId);

    const combined = [...remoteThreads];
    for (const dt of diskList) {
      if (!combined.some((t: any) => t.id === dt.id)) {
        combined.push(dt);
      }
    }

    return NextResponse.json({ success: true, threads: combined });
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

    // 1. Generate strategy via fast Gemini model
    const strategy = await generateCampaignStrategy(rawQuery, category);

    // Create thread title from query
    const title = rawQuery.length > 45 ? rawQuery.slice(0, 42) + '...' : rawQuery;
    let threadId = crypto.randomUUID();
    const now = new Date().toISOString();

    const threadObj = {
      id: threadId,
      user_id: userId,
      title: title,
      category: category,
      created_at: now,
      updated_at: now,
    };

    const userMsgObj = {
      id: crypto.randomUUID(),
      thread_id: threadId,
      user_id: userId,
      role: 'user',
      content: rawQuery,
      created_at: now,
    };

    const assistantMsgObj = {
      id: crypto.randomUUID(),
      thread_id: threadId,
      user_id: userId,
      role: 'assistant',
      content: strategy.summary,
      strategy_data: strategy,
      created_at: now,
    };

    // 2. Always persist to disk storage permanently
    fileStore.saveThread(userId, threadObj);
    fileStore.saveMessages(threadId, [userMsgObj, assistantMsgObj]);

    // 3. Try Supabase insertion if tables exist
    if (supabaseAdmin) {
      try {
        const { data: threadData } = await supabaseAdmin
          .from('chat_threads')
          .insert([threadObj])
          .select()
          .single();

        if (threadData?.id) {
          await supabaseAdmin.from('chat_messages').insert([userMsgObj, assistantMsgObj]);
        }
      } catch (dbError) {
        // Table pending creation
      }
    }

    return NextResponse.json({
      success: true,
      thread: threadObj,
      strategy: strategy,
    });
  } catch (err: any) {
    console.error('Error creating thread:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
