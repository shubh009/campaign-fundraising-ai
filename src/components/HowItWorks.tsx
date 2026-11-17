import React from 'react';
import { MessageSquareText, Cpu, CheckSquare } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      icon: MessageSquareText,
      title: 'Ask in Plain English',
      desc: 'Enter any campaign question—from planning an intimate dinner event to launching a multi-channel digital small-dollar drive.',
    },
    {
      step: '02',
      icon: Cpu,
      title: 'AI Synthesizes Strategy',
      desc: 'Powered by Google Gemini and grounded in grassroots operational best practices, our engine structures a tailored blueprint.',
    },
    {
      step: '03',
      icon: CheckSquare,
      title: 'Execute & Raise Support',
      desc: 'Get prioritized action steps, volunteer hour allocations, timeline milestones, and exportable task checklists.',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-800/80">
      <div className="text-center space-y-2 mb-12">
        <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400">Simple 3-Step Process</h2>
        <p className="text-2xl sm:text-3xl font-extrabold text-white">How Campaign Fundraising AI Works</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="relative bg-[#0C1B33]/60 border border-blue-900/40 rounded-2xl p-7 space-y-4 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-3xl font-black text-slate-700/60 font-mono">{item.step}</span>
              </div>
              <h3 className="text-lg font-bold text-white">{item.title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

