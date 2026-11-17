'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Users,
  Target,
  DollarSign,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Sliders,
  ChevronRight,
  Star,
  Lock,
  BarChart3,
  Layers,
  Zap,
  Copy,
  Check,
  MessageSquare,
  HelpCircle,
  ArrowUpRight,
  Award,
  CheckSquare,
  Send,
  Building2,
  HeartHandshake
} from 'lucide-react';

// Preset Scenarios for Interactive Strategy Sandbox
interface Scenario {
  id: string;
  tag: string;
  title: string;
  target: string;
  timeline: string;
  query: string;
  summary: string;
  steps: {
    number: number;
    title: string;
    description: string;
    timeframe: string;
    metric: string;
  }[];
  metrics: {
    budget: string;
    volunteerHours: string;
    projectedYield: string;
    donorVelocity: string;
  };
}

const SCENARIOS: Scenario[] = [
  {
    id: 'grassroots-blitz',
    tag: 'Digital & Grassroots',
    title: 'Digital Small-Dollar Blitz',
    target: '$25,000 Goal',
    timeline: '30-Day Sprint',
    query: 'How to organize a digital small-dollar fundraising sprint for a grassroots municipal campaign?',
    summary: 'A high-velocity digital drive leveraging tiered peer-to-peer texting and recurring micro-donor drip sequences to secure low-dollar, high-frequency contributions.',
    steps: [
      {
        number: 1,
        title: 'Segment & Audit Past Supporter Lists',
        description: 'Clean donor contacts and filter by donation propensity. Isolate repeat $15–$50 givers for day-one matching momentum.',
        timeframe: 'Days 1–5',
        metric: '1,200 contacts segmented',
      },
      {
        number: 2,
        title: 'Secure Community Seed Matchers',
        description: 'Recruit 3 prominent local community allies or steering committee members to pledge a $5,000 1:1 matching multiplier.',
        timeframe: 'Days 6–10',
        metric: '$5,000 match committed',
      },
      {
        number: 3,
        title: 'Launch 3-Touch SMS & Email Sequence',
        description: 'Deploy urgent narrative-driven calls to action highlighting grassroots voter turnout stakes and matching deadline.',
        timeframe: 'Days 11–24',
        metric: '22.4% open / 4.8% pledge',
      },
      {
        number: 4,
        title: 'Month-End Countdown & Victory Wrap-Up',
        description: 'Final 48-hour push with live donor leaderboard and automated thank-you receipt video from the candidate.',
        timeframe: 'Days 25–30',
        metric: '100% target secured',
      },
    ],
    metrics: {
      budget: '$250 - $450 (SMS fees)',
      volunteerHours: '12 hrs/week',
      projectedYield: '$26,850 avg',
      donorVelocity: '+38.4% WoW',
    },
  },
  {
    id: 'host-reception',
    tag: 'Major Donors & Events',
    title: 'Backyard Finance Host Committee',
    target: '$100,000 Goal',
    timeline: '6-Week Horizon',
    query: 'How to structure a high-dollar backyard reception with volunteer co-hosts and bundlers?',
    summary: 'An intimate, high-yield host committee model that distributes fundraising responsibility across 10 co-hosts each committing to bundle $10,000.',
    steps: [
      {
        number: 1,
        title: 'Recruit 10 Co-Hosts & Define Give/Get',
        description: 'Convene core advisors to lock host pledges with explicit $1,000 personal gift + $9,000 bundled donor minimums.',
        timeframe: 'Week 1',
        metric: '10 hosts confirmed',
      },
      {
        number: 2,
        title: 'Curate Personalized VIP Invitations',
        description: 'Send bespoke direct-mail card invitations followed by personal candidate call-time follow-ups within 48 hours.',
        timeframe: 'Weeks 2–3',
        metric: '150 VIP invitations sent',
      },
      {
        number: 3,
        title: 'Host High-Impact Intimate Reception',
        description: 'Execute backyard or private venue event with structured candidate stump speech and direct finance chair pledge collection.',
        timeframe: 'Week 5',
        metric: '85 attendees / $92k committed',
      },
      {
        number: 4,
        title: 'Immediate 72-Hour Pledge Fulfillment Sweep',
        description: 'Call-time staff sweep all outstanding pledges before weekly FEC compliance reconciliation.',
        timeframe: 'Week 6',
        metric: '96% collection rate',
      },
    ],
    metrics: {
      budget: '$1,200 - $2,500 (Catering)',
      volunteerHours: '15 hrs/week',
      projectedYield: '$104,200 avg',
      donorVelocity: '$1,180 avg gift',
    },
  },
  {
    id: 'fec-deadline',
    tag: 'Deadline Sprints',
    title: 'Quarter-End FEC Deadline Surge',
    target: '$50,000 Goal',
    timeline: '10-Day Surge',
    query: 'What is the optimal multi-channel strategy for a quarter-end FEC fundraising deadline surge?',
    summary: 'A time-delimited urgency campaign maximizing small-dollar conversions before publicly disclosed campaign finance filing deadlines.',
    steps: [
      {
        number: 1,
        title: 'Announce Sovereign Benchmark Goal',
        description: 'Publicly declare campaign readiness target to signal campaign viability to media, party chairs, and opponents.',
        timeframe: 'Day 1',
        metric: 'Public barometer live',
      },
      {
        number: 2,
        title: 'Candidate Call-Time Power Hours',
        description: 'Schedule 4 daily hours of direct candidate phone calls to previous uncommitted high-propensity donors.',
        timeframe: 'Days 2–7',
        metric: '25 direct calls / day',
      },
      {
        number: 3,
        title: 'Automated Tiered Matching Multipliers',
        description: 'Introduce tiered matching hours where donations above $50 unlock an anonymous donor board contribution.',
        timeframe: 'Days 8–9',
        metric: '3.2x pledge conversion',
      },
      {
        number: 4,
        title: 'Midnight Filing Hour Live Stream',
        description: 'Host candidate thank-you virtual broadcast crossing the finish line into statutory deadline closure.',
        timeframe: 'Day 10',
        metric: '100% FEC compliance',
      },
    ],
    metrics: {
      budget: '$300 - $600',
      volunteerHours: '20 hrs/week',
      projectedYield: '$52,400 avg',
      donorVelocity: '74 donors/hr at peak',
    },
  },
];

export default function RedesignedLandingPage() {
  const [activeScenarioId, setActiveScenarioId] = useState<string>('grassroots-blitz');
  const [copied, setCopied] = useState(false);

  // Interactive ROI Calculator State
  const [goalAmount, setGoalAmount] = useState<number>(50000);
  const [campaignWeeks, setCampaignWeeks] = useState<number>(8);
  const [avgDonation, setAvgDonation] = useState<number>(45);

  const activeScenario = useMemo(() => {
    return SCENARIOS.find((s) => s.id === activeScenarioId) || SCENARIOS[0];
  }, [activeScenarioId]);

  // Dynamic Calculator Computations
  const totalDonorsNeeded = useMemo(() => {
    return Math.ceil(goalAmount / avgDonation);
  }, [goalAmount, avgDonation]);

  const weeklyPledgesNeeded = useMemo(() => {
    return Math.ceil(totalDonorsNeeded / campaignWeeks);
  }, [totalDonorsNeeded, campaignWeeks]);

  const dailyRunRate = useMemo(() => {
    return Math.round(goalAmount / (campaignWeeks * 7));
  }, [goalAmount, campaignWeeks]);

  const estimatedVolunteerHours = useMemo(() => {
    // 1 donor conversion requires approx 0.35 volunteer phone/contact hours
    return Math.ceil((totalDonorsNeeded * 0.35) / campaignWeeks);
  }, [totalDonorsNeeded, campaignWeeks]);

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 selection:bg-amber-500 selection:text-slate-950 font-sans antialiased">
      {/* Ambient Radial Mesh Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600/15 via-amber-500/5 to-transparent blur-3xl opacity-80" />
        <div className="absolute top-[40%] right-[-10%] w-[600px] h-[500px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-600/10 via-purple-600/5 to-transparent blur-3xl opacity-60" />
        <div className="absolute bottom-10 left-[-10%] w-[700px] h-[600px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-600/10 via-blue-900/5 to-transparent blur-3xl opacity-50" />
      </div>

      {/* Floating Glassmorphic Top Navigation */}
      <nav className="sticky top-4 z-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl bg-white/[0.04] border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.12)] backdrop-blur-xl px-5 py-3.5 flex items-center justify-between transition-all duration-300">
          {/* Brand Logo */}
          <Link href="/new" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F2347] to-[#0A1628] border border-white/[0.15] shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight text-white">
                  Campaign <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">AI</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-amber-400/10 text-amber-300 border border-amber-400/25">
                  v2.6 PRO
                </span>
              </div>
              <span className="hidden sm:block text-[10px] font-medium tracking-wider text-slate-400 uppercase">
                Grassroots Fundraising Intelligence
              </span>
            </div>
          </Link>

          {/* Quick Nav Anchors */}
          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="#sandbox" className="hover:text-amber-400 transition-colors">
              Strategy Sandbox
            </a>
            <a href="#bento-architecture" className="hover:text-amber-400 transition-colors">
              Architecture
            </a>
            <a href="#calculator" className="hover:text-amber-400 transition-colors">
              War-Chest Simulator
            </a>
            <a href="#comparison" className="hover:text-amber-400 transition-colors">
              Platform vs Legacy
            </a>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.05] transition-all"
            >
              Classic UI
            </Link>
            <Link
              href="/chat"
              className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 tracking-tight bg-gradient-to-b from-amber-400 to-amber-500 shadow-[0_2px_12px_rgba(245,158,11,0.3),inset_0_1px_0_rgba(255,255,255,0.4)] hover:from-amber-300 hover:to-amber-400 active:scale-[0.97] transition-all duration-150"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>Launch Console</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION: Architectural Visual Luxury */}
      <section className="relative z-10 pt-16 sm:pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          {/* Eyebrow Status Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-medium bg-white/[0.04] border border-white/[0.1] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] backdrop-blur-md text-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-amber-400">Gemini 3.1 Fast-Inference Active</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">FEC Compliance Grounded</span>
          </div>

          {/* Display Punch Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-[-0.035em] text-white leading-[1.08]">
            Precision Fundraising.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500">
              Sovereign Campaign Velocity.
            </span>
          </h1>

          {/* Subtitle Value Proposition */}
          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Replace chaotic spreadsheets and opaque $15,000 consultant retainers with instant, AI-synthesized campaign roadmaps, volunteer capacity modeling, and statutory compliance guardrails.
          </p>

          {/* Action Button Row */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/chat"
              className="group relative inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-bold text-slate-950 tracking-tight bg-gradient-to-b from-amber-400 via-amber-400 to-amber-500 shadow-[0_4px_24px_rgba(245,158,11,0.35),inset_0_1px_0_rgba(255,255,255,0.5)] hover:from-amber-300 hover:to-amber-400 active:scale-[0.97] transition-all duration-150"
            >
              <Zap className="w-4 h-4 text-slate-950 fill-slate-950" />
              <span>Open Strategic Workspace</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#sandbox"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-white/[0.05] border border-white/[0.12] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] hover:bg-white/[0.09] hover:border-white/[0.2] active:scale-[0.97] transition-all duration-150"
            >
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Explore Live Sandbox</span>
            </a>
          </div>

          {/* Live Telemetry Bar */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-md">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Small-Dollar Velocity</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white tracking-tight">+41.8%</span>
                <span className="inline-flex items-center text-[11px] font-bold text-emerald-400">
                  <TrendingUp className="w-3 h-3 mr-0.5" /> WoW
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-md">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Average Grassroots Gift</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white tracking-tight">$48.50</span>
                <span className="text-[11px] font-bold text-amber-400">Optimal Tier</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-md">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Donor Retention Rate</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white tracking-tight">82.4%</span>
                <span className="text-[11px] font-bold text-emerald-400">2nd-Gift Lead</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-md">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Statutory Compliance</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white tracking-tight">100%</span>
                <span className="text-[11px] font-bold text-blue-400">FEC Guarded</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: INTERACTIVE STRATEGY SANDBOX (LIVE TERMINAL) */}
      <section id="sandbox" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/10 text-amber-400 border border-amber-400/20">
            <Sparkles className="w-3.5 h-3.5" /> Interactive Blueprint Simulator
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Experience Strategic Synthesis in Action
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            Select a live campaign scenario below to preview real-time structured operational timelines, volunteer allocations, and milestone metrics.
          </p>
        </div>

        {/* Scenario Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          {SCENARIOS.map((sc) => {
            const isActive = sc.id === activeScenarioId;
            return (
              <button
                key={sc.id}
                onClick={() => setActiveScenarioId(sc.id)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold tracking-tight transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-[0_4px_16px_rgba(245,158,11,0.3)] scale-[1.02]'
                    : 'bg-white/[0.04] text-slate-300 border border-white/[0.08] hover:bg-white/[0.08] hover:text-white'
                }`}
              >
                <span>{sc.title}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-mono font-semibold ${
                    isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-white/10 text-slate-400'
                  }`}
                >
                  {sc.target}
                </span>
              </button>
            );
          })}
        </div>

        {/* Live Interactive Strategy Terminal Card */}
        <div className="relative rounded-2xl bg-gradient-to-b from-white/[0.06] via-white/[0.03] to-white/[0.01] border border-white/[0.1] shadow-[0_20px_60px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.15)] backdrop-blur-2xl p-6 sm:p-10">
          {/* Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {activeScenario.tag}
                </span>
                <span className="text-xs font-semibold text-slate-400">• {activeScenario.timeline}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{activeScenario.title}</h3>
            </div>

            {/* Prompt Transfer Action */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleCopyPrompt(activeScenario.query)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium text-slate-300 bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.1] hover:text-white transition-all cursor-pointer"
                title="Copy full query"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Query'}</span>
              </button>

              <Link
                href={`/chat?prompt=${encodeURIComponent(activeScenario.query)}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow-sm"
              >
                <span>Run In AI Chat</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Strategy Summary */}
          <div className="my-6 p-4 rounded-xl bg-amber-400/[0.06] border border-amber-400/20 text-sm text-amber-200/90 leading-relaxed">
            <span className="font-bold text-amber-300">Executive Summary: </span>
            {activeScenario.summary}
          </div>

          {/* Phased Action Steps (Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
            {activeScenario.steps.map((step) => (
              <div
                key={step.number}
                className="relative rounded-xl p-5 bg-white/[0.02] border border-white/[0.06] hover:border-amber-400/40 hover:bg-white/[0.04] transition-all duration-200 space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-black flex items-center justify-center font-mono">
                    {step.number}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 font-mono">{step.timeframe}</span>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
                  {step.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">{step.description}</p>
                <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Benchmark:</span>
                  <span className="font-semibold text-emerald-400 font-mono">{step.metric}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Resource & Effort Bar */}
          <div className="pt-6 border-t border-white/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3 rounded-lg bg-white/[0.02]">
              <div className="text-[10px] uppercase font-semibold text-slate-400">Operating Budget</div>
              <div className="text-sm font-bold text-white mt-0.5">{activeScenario.metrics.budget}</div>
            </div>
            <div className="p-3 rounded-lg bg-white/[0.02]">
              <div className="text-[10px] uppercase font-semibold text-slate-400">Volunteer Allocation</div>
              <div className="text-sm font-bold text-white mt-0.5">{activeScenario.metrics.volunteerHours}</div>
            </div>
            <div className="p-3 rounded-lg bg-white/[0.02]">
              <div className="text-[10px] uppercase font-semibold text-slate-400">Projected Yield</div>
              <div className="text-sm font-bold text-emerald-400 mt-0.5">{activeScenario.metrics.projectedYield}</div>
            </div>
            <div className="p-3 rounded-lg bg-white/[0.02]">
              <div className="text-[10px] uppercase font-semibold text-slate-400">Velocity Metric</div>
              <div className="text-sm font-bold text-amber-400 mt-0.5">{activeScenario.metrics.donorVelocity}</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: ASYMMETRICAL BENTO GRID ARCHITECTURE */}
      <section id="bento-architecture" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Layers className="w-3.5 h-3.5" /> Full-Stack Campaign Engine
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Engineered for Political & Advocacy Victory
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            A cohesive suite of campaign intelligence primitives designed to synchronize candidate call-time, grassroots outreach, and statutory accountability.
          </p>
        </div>

        {/* 4-Tile Bento Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ANCHOR TILE (Spans 2 Columns): Strategic Milestone Roadmapping */}
          <div className="md:col-span-2 relative rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] p-7 sm:p-9 flex flex-col justify-between group hover:border-white/[0.18] transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/25 flex items-center justify-center text-amber-400">
                  <Target className="w-5 h-5" />
                </span>
                <span className="text-xs font-semibold text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  Real-time Synthesis
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Phased Milestone & Critical Path Architect
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                The engine breaks your macro fundraising goal into tactical weekly phases: donor list hygiene, finance committee recruitment, matching donor leverage, and deadline execution.
              </p>
            </div>

            {/* Visual Cadence Preview */}
            <div className="mt-8 pt-6 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="text-[10px] font-mono text-amber-400 font-bold">PHASE 1</div>
                <div className="text-xs font-bold text-white mt-1">Warm List Audit</div>
                <div className="text-[11px] text-slate-400 mt-1">Days 1–7</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="text-[10px] font-mono text-blue-400 font-bold">PHASE 2</div>
                <div className="text-xs font-bold text-white mt-1">Seed Matches</div>
                <div className="text-[11px] text-slate-400 mt-1">Days 8–14</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="text-[10px] font-mono text-purple-400 font-bold">PHASE 3</div>
                <div className="text-xs font-bold text-white mt-1">Digital Blitz</div>
                <div className="text-[11px] text-slate-400 mt-1">Days 15–24</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="text-[10px] font-mono text-emerald-400 font-bold">PHASE 4</div>
                <div className="text-xs font-bold text-white mt-1">Filing Sweep</div>
                <div className="text-[11px] text-slate-400 mt-1">Days 25–30</div>
              </div>
            </div>
          </div>

          {/* TILE 2: FEC Compliance & Guardrails */}
          <div className="relative rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] p-7 flex flex-col justify-between group hover:border-white/[0.18] transition-all duration-300">
            <div className="space-y-4">
              <span className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h3 className="text-xl font-bold text-white tracking-tight">Statutory FEC Guardrails</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Every generated blueprint automatically incorporates non-partisan campaign finance disclaimers, individual contribution limits, and reporting requirements.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Zero-liability verified prompts</span>
            </div>
          </div>

          {/* TILE 3: Donor Velocity & Tier Distribution */}
          <div className="relative rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] p-7 flex flex-col justify-between group hover:border-white/[0.18] transition-all duration-300">
            <div className="space-y-4">
              <span className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                <BarChart3 className="w-5 h-5" />
              </span>
              <h3 className="text-xl font-bold text-white tracking-tight">Tiered Ask Science</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Optimizes donor ask ladders based on past giving history: transforming $25 first-time givers into $15/mo recurring sustainers.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/[0.06] space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Grassroots ($5–$100)</span>
                <span className="font-bold text-white">65% of mix</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full w-[65%]" />
              </div>
            </div>
          </div>

          {/* TILE 4 (Spans 2 Columns): Multi-Channel Outreach Synthesizer */}
          <div className="md:col-span-2 relative rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] p-7 sm:p-9 flex flex-col justify-between group hover:border-white/[0.18] transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400">
                  <MessageSquare className="w-5 h-5" />
                </span>
                <span className="text-xs font-semibold text-purple-300 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
                  Unified Cadence
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Multi-Channel Narrative & Script Synthesis
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                Generate matching scripts across all donor touchpoints simultaneously: Candidate call-time phonebank guides, peer-to-peer SMS blasts, event host talking points, and rapid-response email stacks.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.06] flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-lg text-xs font-medium bg-white/[0.04] text-slate-300 border border-white/[0.06]">
                Call-Time Scripts
              </span>
              <span className="px-3 py-1 rounded-lg text-xs font-medium bg-white/[0.04] text-slate-300 border border-white/[0.06]">
                P2P SMS Cadence
              </span>
              <span className="px-3 py-1 rounded-lg text-xs font-medium bg-white/[0.04] text-slate-300 border border-white/[0.06]">
                Host Committee Deck
              </span>
              <span className="px-3 py-1 rounded-lg text-xs font-medium bg-white/[0.04] text-slate-300 border border-white/[0.06]">
                ActBlue / NGP VAN Ready
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: INTERACTIVE CAMPAIGN WAR-CHEST CALCULATOR */}
      <section id="calculator" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl bg-gradient-to-b from-[#0F1E36] via-[#0A1628] to-[#070D18] border border-blue-500/20 shadow-[0_24px_80px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.1)] p-8 sm:p-12 overflow-hidden">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-amber-500/10 blur-[120px] pointer-events-none rounded-full" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Column: Sliders */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/10 text-amber-400 border border-amber-400/20">
                  <Sliders className="w-3.5 h-3.5" /> Dynamic Planning Tool
                </div>
                <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Campaign War-Chest Simulator
                </h3>
                <p className="text-sm text-slate-300">
                  Adjust your campaign target and timeline to immediately calculate required donor yield and volunteer call-time load.
                </p>
              </div>

              {/* Slider 1: Goal Amount */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-slate-300">Fundraising Target:</span>
                  <span className="text-xl font-black text-amber-400 font-mono">
                    ${goalAmount.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={10000}
                  max={250000}
                  step={5000}
                  value={goalAmount}
                  onChange={(e) => setGoalAmount(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>$10,000</span>
                  <span>$100,000</span>
                  <span>$250,000</span>
                </div>
              </div>

              {/* Slider 2: Timeline Weeks */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-slate-300">Sprint Horizon:</span>
                  <span className="text-xl font-black text-white font-mono">{campaignWeeks} Weeks</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={20}
                  step={1}
                  value={campaignWeeks}
                  onChange={(e) => setCampaignWeeks(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>2 Weeks (Emergency)</span>
                  <span>8 Weeks (Standard)</span>
                  <span>20 Weeks (Full Cycle)</span>
                </div>
              </div>

              {/* Slider 3: Average Gift Target */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-slate-300">Average Gift Target:</span>
                  <span className="text-xl font-black text-emerald-400 font-mono">${avgDonation} / donor</span>
                </div>
                <input
                  type="range"
                  min={15}
                  max={250}
                  step={5}
                  value={avgDonation}
                  onChange={(e) => setAvgDonation(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>$15 (Micro-donor)</span>
                  <span>$45 (Grassroots)</span>
                  <span>$250 (Mid-tier)</span>
                </div>
              </div>
            </div>

            {/* Right Column: Computed Outputs */}
            <div className="lg:col-span-5 bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 sm:p-8 space-y-6 backdrop-blur-xl">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 pb-3 border-b border-white/[0.08]">
                Required Operational Run-Rate
              </h4>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">Total Donors Needed:</span>
                  <span className="text-lg font-black text-white font-mono">{totalDonorsNeeded.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">Weekly Pledges Required:</span>
                  <span className="text-lg font-black text-emerald-400 font-mono">{weeklyPledgesNeeded} / week</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">Daily Revenue Run-Rate:</span>
                  <span className="text-lg font-black text-amber-400 font-mono">${dailyRunRate.toLocaleString()} / day</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">Volunteer Phone Hours:</span>
                  <span className="text-lg font-black text-blue-400 font-mono">{estimatedVolunteerHours} hrs / week</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.08]">
                <Link
                  href={`/chat?prompt=${encodeURIComponent(
                    `Help me create a ${campaignWeeks}-week campaign fundraising strategy to raise $${goalAmount.toLocaleString()} with an average donation of $${avgDonation}.`
                  )}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow-md"
                >
                  <span>Build This Custom Blueprint</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: PLATFORM VS LEGACY COMPARISON */}
      <section id="comparison" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Traditional Consulting vs. Campaign AI
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            Why modern local, state, and congressional campaigns are switching to on-demand AI strategic synthesis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Legacy Political Consulting */}
          <div className="p-7 rounded-2xl bg-red-950/10 border border-red-500/20 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-red-400 uppercase tracking-wider">Traditional Method</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                Outdated & Slow
              </span>
            </div>
            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="text-red-400 font-bold">✕</span>
                <span><strong>$10,000–$25,000</strong> monthly retainer fee for general consultants.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-red-400 font-bold">✕</span>
                <span><strong>2 to 3 weeks</strong> waiting for static PDF fundraising memo drafts.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-red-400 font-bold">✕</span>
                <span>Recycled national boilerplates that ignore local grassroots dynamics.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-red-400 font-bold">✕</span>
                <span>Disconnected spreadsheets with zero automated volunteer capacity formulas.</span>
              </li>
            </ul>
          </div>

          {/* Campaign AI Platform */}
          <div className="p-7 rounded-2xl bg-gradient-to-b from-emerald-950/20 to-emerald-950/5 border border-emerald-500/30 shadow-[inset_0_1px_0_0_rgba(16,185,129,0.2)] space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Campaign AI Platform</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                Instant & Proven
              </span>
            </div>
            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-200">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Zero retainers</strong> — accessible for school board to Senate campaigns.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>2.1-second turnaround</strong> with multi-turn follow-up adjustments.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Tailored grassroots timelines matching your district and filing deadline.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Dynamic volunteer shift calculators and statutory FEC limits built-in.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 6: HIGH-IMPACT BOTTOM CTA BANNER */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#0F203C] via-[#162B4E] to-[#0D1A30] border border-white/[0.12] shadow-[0_20px_80px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.2)] p-10 sm:p-16 text-center space-y-6 overflow-hidden">
          {/* Ambient Flare */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-amber-400/15 blur-3xl rounded-full pointer-events-none" />

          <div className="relative z-10 space-y-4 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/25">
              <Sparkles className="w-3.5 h-3.5" /> Ready to Out-Raise Your Opponent?
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Launch Your Campaign Strategy Workspace in 10 Seconds.
            </h2>
            <p className="text-sm sm:text-base text-slate-300 font-normal">
              Get comprehensive fundraising roadmaps, donor conversion sequences, and volunteer allocation blueprints powered by Google Gemini and Supabase.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/chat"
              className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-bold text-slate-950 tracking-tight bg-gradient-to-b from-amber-400 via-amber-400 to-amber-500 shadow-[0_4px_24px_rgba(245,158,11,0.4),inset_0_1px_0_rgba(255,255,255,0.5)] hover:from-amber-300 hover:to-amber-400 active:scale-[0.97] transition-all duration-150"
            >
              <span>Start Free Strategic Chat</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-xl text-sm font-semibold text-white bg-white/[0.06] border border-white/[0.12] hover:bg-white/[0.1] active:scale-[0.97] transition-all"
            >
              <span>Create Account</span>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/[0.08] bg-[#05080F] py-12 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0F203C] border border-white/[0.1] flex items-center justify-center">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
            <div>
              <span className="font-bold text-white text-sm">Campaign Fundraising AI</span>
              <span className="block text-[11px] text-slate-500">Non-partisan strategic fundraising copilot</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">
              Classic Landing
            </Link>
            <Link href="/chat" className="hover:text-white transition-colors">
              AI Strategy Chat
            </Link>
            <Link href="/login" className="hover:text-white transition-colors">
              Login
            </Link>
          </div>

          <div className="text-[11px] text-slate-500 text-center md:text-right">
            © 2026 Campaign Fundraising AI. Grounded in grassroots fundraising best practices.
          </div>
        </div>
      </footer>
    </div>
  );
}

