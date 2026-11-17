import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateCampaignStrategy } from '@/lib/gemini';
import { fileStore } from '@/lib/storage';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    const { threadId } = await params;
    if (!threadId) {
      return NextResponse.json({ success: true, messages: [] });
    }

    let remoteMessages: any[] = [];

    if (supabaseAdmin) {
      try {
        const { data, error } = await supabaseAdmin
          .from('chat_messages')
          .select('*')
          .eq('thread_id', threadId)
          .order('created_at', { ascending: true });

        if (!error && Array.isArray(data) && data.length > 0) {
          remoteMessages = data;
        }
      } catch (e) {
        // Table pending creation
      }
    }

    const diskMessages = fileStore.getMessages(threadId);
    const combined = remoteMessages.length > 0 ? remoteMessages : diskMessages;

    return NextResponse.json({ success: true, messages: combined });
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

    // Call fast Gemini model
    const strategy = await generateCampaignStrategy(rawQuery, 'general');

    const userMessageId = crypto.randomUUID();
    const assistantMessageId = crypto.randomUUID();
    const now = new Date().toISOString();

    const userMsgObj = {
      id: userMessageId,
      thread_id: threadId,
      user_id: userId,
      role: 'user',
      content: rawQuery,
      created_at: now,
    };

    const assistantMsgObj = {
      id: assistantMessageId,
      thread_id: threadId,
      user_id: userId,
      role: 'assistant',
      content: strategy.summary,
      strategy_data: strategy,
      created_at: now,
    };

    // Store in disk storage permanently
    fileStore.saveMessages(threadId, [userMsgObj, assistantMsgObj]);

    // Store in Supabase if table exists
    if (supabaseAdmin) {
      try {
        const { error: mErr } = await supabaseAdmin.from('chat_messages').insert([userMsgObj, assistantMsgObj]);
        if (mErr && mErr.message?.includes('strategy_data')) {
          const cleanAssistant = { ...assistantMsgObj };
          delete (cleanAssistant as any).strategy_data;
          await supabaseAdmin.from('chat_messages').insert([userMsgObj, cleanAssistant]);
        }
        await supabaseAdmin
          .from('chat_threads')
          .update({ updated_at: now })
          .eq('id', threadId);
      } catch (dbError) {
        console.warn('Supabase message insert warning:', dbError);
      }
    }

    return NextResponse.json({
      success: true,
      userMessage: userMsgObj,
      assistantMessage: assistantMsgObj,
    });
  } catch (err: any) {
    console.error('Error posting message:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
