'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Star,
  Plus,
  MessageSquare,
  Send,
  Loader2,
  LogOut,
  Home,
  Menu,
  X,
  Compass,
  CheckCircle2,
  DollarSign,
  Users,
  Clock,
  Copy,
  Check,
  Download,
  AlertTriangle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { supabasePublic } from '@/lib/supabase';
import { ChatThread, ChatMessage, StrategyPlan } from '@/types/campaign';

const INITIAL_PROMPTS = [
  {
    title: 'Raise First $10,000',
    category: 'budget',
    icon: '📊',
    prompt: 'How can our campaign raise its first $10,000 through grassroots donors and community events?',
  },
  {
    title: 'Small-Dollar Dinner Event',
    category: 'event',
    icon: '📅',
    prompt: 'How can we organize and plan a small-dollar community fundraising dinner or backyard reception?',
  },
  {
    title: 'Donor Retention Workflow',
    category: 'donor_outreach',
    icon: '👥',
    prompt: 'What email and phone call follow-up workflow yields the highest recurring donor conversion rate?',
  },
  {
    title: 'Digital & Email Drive',
    category: 'digital',
    icon: '🚀',
    prompt: 'How do we construct an effective end-of-month digital fundraising campaign email sequence?',
  },
];

export default function ChatDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Check user session & load threads
  useEffect(() => {
    if (!supabasePublic) return;

    supabasePublic.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        // If not logged in, redirect to login
        router.push('/login?redirect=/chat');
      } else {
        setUser(session.user);
        loadThreads(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabasePublic.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/login?redirect=/chat');
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  // 2. Load Threads from API
  const loadThreads = async (userId: string) => {
    try {
      const res = await fetch(`/api/threads?userId=${userId}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.threads)) {
        setThreads(data.threads);
      }
    } catch (e) {
      console.warn('Failed to load threads:', e);
    }
  };

  // 3. Load Messages when Active Thread changes
  useEffect(() => {
    if (!activeThreadId) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/threads/${activeThreadId}/messages`);
        const data = await res.json();
        if (data.success && Array.isArray(data.messages)) {
          setMessages(data.messages);
        }
      } catch (e) {
        console.warn('Failed to load messages:', e);
      }
    };

    fetchMessages();
  }, [activeThreadId]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSignOut = async () => {
    if (supabasePublic) {
      await supabasePublic.auth.signOut();
      router.push('/');
    }
  };

  const handleStartNewChat = () => {
    setActiveThreadId(null);
    setMessages([]);
    setInputQuery('');
    setSidebarOpen(false);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = inputQuery.trim();
    if (!query || isLoading) return;

    setInputQuery('');
    setIsLoading(true);

    try {
      if (!activeThreadId) {
        // Create new thread
        const res = await fetch('/api/threads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query,
            userId: user?.id,
            category: 'general',
          }),
        });

        const data = await res.json();
        if (data.success && data.thread) {
          setThreads((prev) => [data.thread, ...prev]);
          setActiveThreadId(data.thread.id);

          setMessages([
            {
              id: crypto.randomUUID(),
              thread_id: data.thread.id,
              user_id: user?.id,
              role: 'user',
              content: query,
              created_at: new Date().toISOString(),
            },
            {
              id: crypto.randomUUID(),
              thread_id: data.thread.id,
              user_id: user?.id,
              role: 'assistant',
              content: data.strategy.summary,
              strategy_data: data.strategy,
              created_at: new Date().toISOString(),
            },
          ]);
        }
      } else {
        // Add follow-up message to existing thread
        const tempUserMsg: ChatMessage = {
          id: 'temp-' + Date.now(),
          thread_id: activeThreadId,
          user_id: user?.id,
          role: 'user',
          content: query,
          created_at: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, tempUserMsg]);

        const res = await fetch(`/api/threads/${activeThreadId}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query,
            userId: user?.id,
          }),
        });

        const data = await res.json();
        if (data.success && data.assistantMessage) {
          setMessages((prev) =>
            prev.filter((m) => m.id !== tempUserMsg.id).concat([data.userMessage, data.assistantMessage])
          );
        }
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPlan = (plan: StrategyPlan, msgId: string) => {
    const textPlan = `CAMPAIGN FUNDRAISING STRATEGY\n\nSummary:\n${plan.summary}\n\nBudget: ${plan.estimatedEffort.budgetRange} | Volunteers: ${plan.estimatedEffort.volunteerHours} | Difficulty: ${plan.estimatedEffort.difficulty}\n\nAction Steps:\n${plan.actionSteps.map((s) => `${s.stepNumber}. [${s.timeframe}] ${s.title}\n${s.description}`).join('\n\n')}\n\nDisclaimer:\n${plan.disclaimer}`;
    navigator.clipboard.writeText(textPlan);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const activeThread = threads.find((t) => t.id === activeThreadId);

  return (
    <div className="h-screen flex bg-[#F8FAFC] text-slate-900 overflow-hidden">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/30 z-40 md:hidden backdrop-blur-xs"
        />
      )}

      {/* 1. Left Sidebar (Threads Navigation) */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#0F1F38] flex items-center justify-center shadow-xs">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
            <span className="font-extrabold text-base text-[#0F1F38]">Campaign AI</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Strategy Button */}
        <div className="p-3">
          <button
            onClick={handleStartNewChat}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#0F1F38] hover:bg-[#1A3158] shadow-xs transition-all hover:scale-[1.01]"
          >
            <Plus className="w-4 h-4 text-amber-400" /> + New Strategy Plan
          </button>
        </div>

        {/* Threads List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <p className="px-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Recent Strategies ({threads.length})
          </p>
          {threads.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400 px-4">
              No saved strategies yet. Ask a question to start your first campaign roadmap!
            </div>
          ) : (
            threads.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setActiveThreadId(t.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                  activeThreadId === t.id
                    ? 'bg-amber-50 text-amber-900 border border-amber-200 font-bold'
                    : 'text-slate-700 hover:bg-slate-100 border border-transparent'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="truncate flex-1">{t.title}</span>
              </button>
            ))
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-600">
            <span className="truncate max-w-[170px]" title={user?.email}>
              👤 {user?.email || 'Campaign Organizer'}
            </span>
            <button
              onClick={handleSignOut}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-white transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#0F1F38] transition-colors"
          >
            <Home className="w-3.5 h-3.5" /> Return to Homepage
          </Link>
        </div>
      </aside>

      {/* 2. Main Chat Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#F8FAFC]">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-200 bg-white/90 backdrop-blur-md px-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-sm font-bold text-[#0F1F38] truncate max-w-md">
                {activeThread ? activeThread.title : 'New Fundraising Strategy Blueprint'}
              </h1>
              <p className="text-[11px] text-slate-400">Campaign Planning AI • Grounded in Grassroots Best Practices</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-[#0F1F38] px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50"
            >
              Home
            </Link>
          </div>
        </header>

        {/* Messages Stream Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Welcome Screen when thread is empty */}
          {!activeThreadId && messages.length === 0 ? (
            <div className="max-w-3xl mx-auto py-12 space-y-8">
              <div className="text-center space-y-3">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-[#0F1F38] flex items-center justify-center shadow-lg">
                  <Star className="w-7 h-7 text-amber-400 fill-amber-400" />
                </div>
                <h2 className="text-3xl font-black text-[#0F1F38]">Campaign Strategy Workspace</h2>
                <p className="text-sm text-slate-600 max-w-lg mx-auto">
                  What fundraising milestone or operational goal are you planning today?
                </p>
              </div>

              {/* Quick Prompts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {INITIAL_PROMPTS.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputQuery(p.prompt);
                    }}
                    className="p-4 rounded-xl bg-white border border-slate-200/90 hover:border-amber-400 hover:bg-amber-50/20 text-left transition-all hover:scale-[1.01] shadow-2xs group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{p.icon}</span>
                      <span className="text-xs font-bold text-[#0F1F38] group-hover:text-amber-700">
                        {p.title}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2">{p.prompt}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Message List
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((msg) => {
                if (msg.role === 'user') {
                  return (
                    <div key={msg.id} className="flex justify-end">
                      <div className="max-w-xl bg-[#0F1F38] text-white rounded-2xl rounded-tr-xs px-5 py-3.5 shadow-sm text-sm">
                        <p>{msg.content}</p>
                      </div>
                    </div>
                  );
                }

                const plan = msg.strategy_data;

                return (
                  <div key={msg.id} className="flex justify-start">
                    <div className="w-full bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-6">
                      {/* Blueprint Header */}
                      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-2 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                          <Compass className="w-3.5 h-3.5 text-amber-600" /> Generated Campaign Strategy
                        </div>
                        {plan && (
                          <button
                            onClick={() => handleCopyPlan(plan, msg.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-slate-500" /> Copy Plan
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      {/* Summary */}
                      <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-4 text-sm text-slate-800 leading-relaxed">
                        {msg.content}
                      </div>

                      {/* Metrics if available */}
                      {plan?.estimatedEffort && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center gap-2.5">
                            <DollarSign className="w-4 h-4 text-emerald-600" />
                            <div>
                              <p className="text-[11px] font-medium text-slate-500">Budget Range</p>
                              <p className="text-xs font-bold text-[#0F1F38]">{plan.estimatedEffort.budgetRange}</p>
                            </div>
                          </div>
                          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center gap-2.5">
                            <Users className="w-4 h-4 text-blue-600" />
                            <div>
                              <p className="text-[11px] font-medium text-slate-500">Volunteers</p>
                              <p className="text-xs font-bold text-[#0F1F38]">{plan.estimatedEffort.volunteerHours}</p>
                            </div>
                          </div>
                          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center gap-2.5">
                            <Clock className="w-4 h-4 text-amber-600" />
                            <div>
                              <p className="text-[11px] font-medium text-slate-500">Difficulty</p>
                              <p className="text-xs font-bold text-amber-800">{plan.estimatedEffort.difficulty} Complexity</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Action Steps Roadmap */}
                      {plan?.actionSteps && plan.actionSteps.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-amber-600" /> Action Roadmap
                          </h4>
                          <div className="space-y-2.5">
                            {plan.actionSteps.map((step, idx) => (
                              <div
                                key={idx}
                                className="bg-slate-50/80 border border-slate-200/70 rounded-xl p-3.5 flex items-start gap-3"
                              >
                                <div className="w-6 h-6 rounded-full bg-[#0F1F38] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                                  {step.stepNumber}
                                </div>
                                <div className="flex-1 space-y-0.5">
                                  <div className="flex items-center justify-between">
                                    <h5 className="text-xs font-bold text-[#0F1F38]">{step.title}</h5>
                                    <span className="text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                                      {step.timeframe}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-600 leading-relaxed">{step.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Follow-up suggestions */}
                      {plan?.followUpQuestions && plan.followUpQuestions.length > 0 && (
                        <div className="pt-2 border-t border-slate-100 space-y-2">
                          <p className="text-[11px] font-bold uppercase text-slate-400">Suggested Next Steps:</p>
                          <div className="flex flex-wrap gap-2">
                            {plan.followUpQuestions.map((q, qIdx) => (
                              <button
                                key={qIdx}
                                onClick={() => setInputQuery(q)}
                                className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-xs font-medium text-slate-700 hover:text-amber-900 transition-colors"
                              >
                                💬 {q}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Disclaimer */}
                      {plan?.disclaimer && (
                        <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-3 flex items-start gap-2.5 text-[11px] text-amber-900">
                          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                          <p>{plan.disclaimer}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-xs flex items-center gap-3 text-xs font-semibold text-slate-600">
                    <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                    <span>Synthesizing operational campaign roadmap...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Bottom Fixed Prompt Bar */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative">
            <textarea
              rows={2}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder="Ask a fundraising question (e.g. How can we recruit 10 volunteer hosts for a fundraiser?)"
              disabled={isLoading}
              className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-sm rounded-xl p-3.5 pr-14 border border-slate-200 focus:bg-white focus:border-amber-500 focus:outline-none transition-all resize-none shadow-xs disabled:opacity-60"
            />

            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="absolute right-3.5 top-3.5 p-2 rounded-lg bg-[#0F1F38] text-white hover:bg-[#1C3660] disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-transform active:scale-95"
              title="Send Inquiry"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              ) : (
                <Send className="w-4 h-4 text-amber-400" />
              )}
            </button>
          </form>
          <p className="text-center text-[11px] text-slate-400 mt-2">
            AI-generated recommendations. Verify local election finance statutes with your election authority.
          </p>
        </div>
      </main>
    </div>
  );
}

