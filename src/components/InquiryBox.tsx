'use client';

import React, { useState } from 'react';
import { Sparkles, Loader2, ShieldCheck, HelpCircle } from 'lucide-react';

interface InquiryBoxProps {
  onSubmitQuery: (query: string, category: string) => void;
  isLoading: boolean;
  initialQuery?: string;
}

const EXAMPLE_PROMPTS = [
  {
    title: 'How do I attract more donors?',
    category: 'donor_outreach',
    icon: '👥',
    fullQuery: 'How can our campaign attract first-time and grassroots small-dollar donors?',
  },
  {
    title: 'Plan a successful fundraising event',
    category: 'event',
    icon: '📅',
    fullQuery: 'How can we organize and plan a small-dollar community fundraising dinner or backyard reception?',
  },
  {
    title: 'Build a fundraising budget',
    category: 'budget',
    icon: '📊',
    fullQuery: 'How do we construct a realistic 90-day campaign finance budget and target milestones?',
  },
  {
    title: 'Boost small donor support',
    category: 'digital',
    icon: '🚀',
    fullQuery: 'What digital and email outreach workflows yield the highest recurring donor conversion?',
  },
];

export default function InquiryBox({ onSubmitQuery, isLoading, initialQuery = '' }: InquiryBoxProps) {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [errorMessage, setErrorMessage] = useState('');

  const handlePromptClick = (fullQuery: string, category: string) => {
    setQuery(fullQuery);
    setSelectedCategory(category);
    setErrorMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();

    if (!trimmed) {
      setErrorMessage('Please enter a question about your campaign fundraising plan.');
      return;
    }

    if (trimmed.length < 5) {
      setErrorMessage('Please provide a bit more detail (at least 5 characters).');
      return;
    }

    if (trimmed.length > 800) {
      setErrorMessage('Question is too long (maximum 800 characters).');
      return;
    }

    setErrorMessage('');
    onSubmitQuery(trimmed, selectedCategory);
  };

  return (
    <section id="inquiry-section" className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Background Soft Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-blue-100/60 blur-[130px] pointer-events-none rounded-full" />

      {/* Hero Headline */}
      <div className="text-center space-y-4 mb-10 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-[#0F1F38] border border-blue-200/80 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Powered by Google Gemini AI & Supabase
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0F1F38] leading-tight">
          Smarter Fundraising.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600">
            Stronger Campaign.
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal">
          Get AI-powered insights, custom roadmaps, and practical strategies to grow your campaign support.
        </p>
      </div>

      {/* Main Inquiry Card (Light Theme) */}
      <div className="relative z-10 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-200/60">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
            <span className="flex items-center gap-2 text-[#0F1F38]">
              <HelpCircle className="w-4 h-4 text-amber-600" /> What is your campaign inquiry?
            </span>
            <span className={query.length > 750 ? 'text-amber-600 font-bold' : 'text-slate-400'}>
              {query.length}/800
            </span>
          </div>

          <div className="relative">
            <textarea
              rows={3}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="e.g. How can I raise my first $10,000 for a local council campaign?"
              disabled={isLoading}
              className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-base sm:text-lg rounded-xl p-4 border border-slate-200 focus:bg-white focus:border-amber-500 focus:ring-3 focus:ring-amber-500/15 focus:outline-none transition-all resize-none shadow-xs disabled:opacity-60"
            />
          </div>

          {errorMessage && (
            <p className="text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {errorMessage}
            </p>
          )}

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 order-2 sm:order-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Your campaign strategy inquiries are encrypted & strictly private.</span>
            </div>

            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#0F1F38] to-[#1A3158] hover:from-[#152A4A] hover:to-[#223F6E] disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-950/15 transition-all hover:scale-[1.02] active:scale-[0.98] order-1 sm:order-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
                  Generating Strategy...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  Generate Recommendations
                </>
              )}
            </button>
          </div>
        </form>

        {/* Try These Examples Section */}
        <div id="examples" className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 text-center sm:text-left">
            Try These Examples:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {EXAMPLE_PROMPTS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePromptClick(item.fullQuery, item.category)}
                disabled={isLoading}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/80 hover:border-blue-300 text-left transition-all hover:scale-[1.02] group disabled:opacity-50 shadow-2xs"
              >
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <span className="text-xs font-bold text-slate-700 group-hover:text-[#0F1F38] transition-colors line-clamp-2">
                  {item.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
