'use client';

import React, { useState } from 'react';
import { StrategyPlan } from '@/types/campaign';
import {
  CheckCircle2,
  Copy,
  Check,
  Download,
  ThumbsUp,
  ThumbsDown,
  Clock,
  DollarSign,
  Users,
  Compass,
  AlertTriangle,
} from 'lucide-react';

interface StrategyResultProps {
  plan: StrategyPlan;
  onSelectFollowUp: (question: string) => void;
}

export default function StrategyResult({ plan, onSelectFollowUp }: StrategyResultProps) {
  const [copied, setCopied] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<'positive' | 'negative' | null>(null);

  const handleCopy = () => {
    const textPlan = `CAMPAIGN FUNDRAISING STRATEGY
Summary:
${plan.summary}

Estimated Effort:
- Budget Range: ${plan.estimatedEffort.budgetRange}
- Volunteer Commitment: ${plan.estimatedEffort.volunteerHours}
- Complexity: ${plan.estimatedEffort.difficulty}

Action Steps:
${plan.actionSteps.map((s) => `${s.stepNumber}. [${s.timeframe}] ${s.title}\n   ${s.description}`).join('\n\n')}

Follow-Up Questions:
${plan.followUpQuestions.map((q) => `- ${q}`).join('\n')}

Disclaimer:
${plan.disclaimer}
`;
    navigator.clipboard.writeText(textPlan);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExportTxt = () => {
    const textPlan = `CAMPAIGN FUNDRAISING STRATEGY PLAN\n\n${plan.summary}\n\nEffort:\nBudget: ${plan.estimatedEffort.budgetRange} | Volunteers: ${plan.estimatedEffort.volunteerHours} | Difficulty: ${plan.estimatedEffort.difficulty}\n\nAction Steps:\n${plan.actionSteps.map((s) => `${s.stepNumber}. ${s.title} (${s.timeframe})\n${s.description}`).join('\n\n')}\n\nDisclaimer:\n${plan.disclaimer}`;
    const blob = new Blob([textPlan], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `campaign-fundraising-plan-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFeedback = async (rating: 'positive' | 'negative') => {
    if (feedbackSubmitted || !plan.id) return;
    setFeedbackSubmitted(rating);
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queryId: plan.id, rating }),
      });
    } catch (e) {
      console.warn('Feedback submit error:', e);
    }
  };

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 animate-fade-in">
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 mb-2">
              <Compass className="w-3.5 h-3.5 text-amber-600" /> Strategic Blueprint
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F1F38]">Actionable Campaign Roadmap</h2>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all hover:scale-[1.02]"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" /> Copy Plan
                </>
              )}
            </button>
            <button
              onClick={handleExportTxt}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all hover:scale-[1.02]"
            >
              <Download className="w-4 h-4 text-slate-500" /> Export .TXT
            </button>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-5 sm:p-6">
          <h3 className="text-xs font-bold text-[#0F1F38] uppercase tracking-wider mb-2">Executive Strategy Summary</h3>
          <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-normal">{plan.summary}</p>
        </div>

        {/* Estimated Effort Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Budget Range</p>
              <p className="text-sm sm:text-base font-bold text-[#0F1F38]">{plan.estimatedEffort.budgetRange}</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Volunteer Commitment</p>
              <p className="text-sm sm:text-base font-bold text-[#0F1F38]">{plan.estimatedEffort.volunteerHours}</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Execution Difficulty</p>
              <span className="inline-block px-2.5 py-0.5 mt-0.5 rounded-full text-xs font-bold bg-amber-200/70 text-amber-900">
                {plan.estimatedEffort.difficulty} Complexity
              </span>
            </div>
          </div>
        </div>

        {/* Step-by-Step Action Plan */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[#0F1F38] flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-amber-600" /> Action Steps Roadmap
          </h3>

          <div className="space-y-3">
            {plan.actionSteps.map((step, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start gap-4 transition-all hover:border-slate-300"
              >
                <div className="flex items-center gap-3 sm:flex-col sm:items-center">
                  <div className="w-8 h-8 rounded-full bg-[#0F1F38] text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-xs">
                    {step.stepNumber}
                  </div>
                  <span className="text-[11px] font-bold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded sm:mt-1 whitespace-nowrap shadow-2xs">
                    {step.timeframe}
                  </span>
                </div>

                <div className="flex-1 space-y-1">
                  <h4 className="text-base font-bold text-[#0F1F38]">{step.title}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Suggested Next Questions */}
        {plan.followUpQuestions?.length > 0 && (
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Suggested Follow-Up Steps:</p>
            <div className="flex flex-wrap gap-2">
              {plan.followUpQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectFollowUp(q)}
                  className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-xs font-medium text-slate-700 hover:text-amber-900 text-left transition-all shadow-2xs"
                >
                  💬 {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Compliance Guardrail Box */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p>{plan.disclaimer}</p>
        </div>

        {/* Feedback Section */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500">
          <span>Was this fundraising strategy helpful?</span>
          <div className="flex items-center gap-2">
            {feedbackSubmitted ? (
              <span className="text-emerald-700 font-bold">Thank you for your feedback!</span>
            ) : (
              <>
                <button
                  onClick={() => handleFeedback('positive')}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 transition-colors"
                  title="Helpful"
                >
                  <ThumbsUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleFeedback('negative')}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 transition-colors"
                  title="Needs improvement"
                >
                  <ThumbsDown className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
