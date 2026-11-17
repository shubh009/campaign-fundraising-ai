import React from 'react';
import { Target, Shield, Zap, Award, Star } from 'lucide-react';

export default function TrustPillars() {
  const pillars = [
    {
      icon: Target,
      title: 'Actionable Strategies',
      subtitle: 'Tailored to Your Goals',
      desc: 'Get concrete milestones, estimated budgets, and volunteer assignments designed for real-world execution.',
    },
    {
      icon: Shield,
      title: 'Trusted & Private',
      subtitle: 'Powered by Gemini & Supabase',
      desc: 'Enterprise-grade encryption and privacy. Your campaign inquiries and strategies remain confidential.',
    },
    {
      icon: Zap,
      title: 'Real-Time Guidance',
      subtitle: 'When You Need Them',
      desc: 'Instant 24/7 campaign intelligence ready to adapt to unexpected event changes or urgent budget targets.',
    },
    {
      icon: Award,
      title: 'Built for Campaign Success',
      subtitle: 'Tested Operational Frameworks',
      desc: 'Engineered specifically around modern grassroots, digital, and small-dollar fundraising methodologies.',
    },
  ];

  return (
    <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-800/80">
      <div className="text-center space-y-2 mb-12">
        <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400">Why Campaign Fundraising AI</h2>
        <p className="text-2xl sm:text-3xl font-extrabold text-white">Your Campaign. Our AI Support.</p>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Get expert-backed ideas, personalized strategies, and actionable steps to reach your fundraising goals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pillars.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-[#0D1C36]/80 border border-blue-900/40 hover:border-amber-400/40 rounded-xl p-6 space-y-3 transition-all hover:scale-[1.02] shadow-lg"
            >
              <div className="w-12 h-12 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-amber-400">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{item.title}</h3>
                <p className="text-xs font-semibold text-amber-400/90">{item.subtitle}</p>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Decorative Stars Banner */}
      <div className="mt-16 text-center">
        <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-[#0E1F3B] border border-slate-800 text-xs font-bold tracking-widest text-slate-300 uppercase shadow-md">
          <div className="flex gap-1 text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <Star className="w-3.5 h-3.5 fill-amber-400" />
          </div>
          <span className="text-white">PLAN</span>
          <span className="text-amber-400">•</span>
          <span className="text-white">ENGAGE</span>
          <span className="text-amber-400">•</span>
          <span className="text-white">RAISE MORE</span>
          <div className="flex gap-1 text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <Star className="w-3.5 h-3.5 fill-amber-400" />
          </div>
        </div>
      </div>
    </section>
  );
}

