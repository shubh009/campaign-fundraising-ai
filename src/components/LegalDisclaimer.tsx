import React from 'react';
import { ShieldAlert, Scale, Lock, RefreshCcw } from 'lucide-react';

export default function LegalDisclaimer() {
  const safeguards = [
    {
      icon: Scale,
      title: 'Operational Strategy, Not Legal Counsel',
      desc: 'Campaign Fundraising AI is an operational planning tool. It does not provide legal, tax, or regulatory advice. Always verify with your election authority.',
    },
    {
      icon: ShieldAlert,
      title: 'Jurisdiction-Specific Nuances',
      desc: 'Campaign finance limits and filing deadlines vary across federal, state, and municipal elections. We actively discourage fabricating compliance rules.',
    },
    {
      icon: Lock,
      title: 'No Donor Financial Data',
      desc: 'Our system never asks for, processes, or stores donor credit card details, banking info, or sensitive identification numbers.',
    },
    {
      icon: RefreshCcw,
      title: 'Transparent AI Technology',
      desc: 'All plans are generated using Google Gemini with strict prompt constraints, human-in-the-loop review, and continuous feedback auditing.',
    },
  ];

  return (
    <section id="safeguards" className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-200/80">
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-xs">
        <div className="text-center space-y-2 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-[#0F1F38]">
            Compliance & Transparency
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F1F38]">Our Safety & Compliance Safeguards</h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Ethical, transparent, and lawful campaign planning built into every layer of our platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {safeguards.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex gap-4 p-5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                <div className="p-3 rounded-xl bg-blue-50 text-[#0F1F38] h-fit border border-blue-100">
                  <Icon className="w-5 h-5 flex-shrink-0" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#0F1F38]">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
