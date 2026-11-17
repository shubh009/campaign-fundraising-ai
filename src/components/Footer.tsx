import React from 'react';
import { Star } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-[#071122] text-slate-400 text-xs py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-md bg-blue-600/30 flex items-center justify-center border border-blue-500/40">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <span className="font-bold text-sm text-white">Campaign Fundraising AI</span>
          <span className="text-slate-500">|</span>
          <span>© 2026 All rights reserved.</span>
        </div>

        <div className="flex items-center space-x-6">
          <a href="#how-it-works" className="hover:text-amber-400 transition-colors">How It Works</a>
          <a href="#features" className="hover:text-amber-400 transition-colors">Features</a>
          <a href="#safeguards" className="hover:text-amber-400 transition-colors">Safeguards</a>
          <a href="#inquiry-section" className="text-amber-400 hover:underline font-semibold">Start Planning</a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-slate-900 text-center text-[11px] text-slate-500">
        Disclaimer: This platform provides AI-generated strategy roadmaps and is not affiliated with any election commission, political party, or regulatory authority.
      </div>
    </footer>
  );
}
