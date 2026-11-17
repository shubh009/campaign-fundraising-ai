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
    <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-200/80">
      <div className="text-center space-y-2 mb-12">
        <h2 className="text-xs font-bold uppercase tracking-widest text-amber-600">Simple 3-Step Process</h2>
        <p className="text-2xl sm:text-3xl font-extrabold text-[#0F1F38]">How Campaign Fundraising AI Works</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="relative bg-white border border-slate-200/90 rounded-2xl p-7 space-y-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-3xl font-black text-slate-300 font-mono">{item.step}</span>
              </div>
              <h3 className="text-lg font-bold text-[#0F1F38]">{item.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
