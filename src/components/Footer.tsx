import React from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-500 text-xs py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-[#0F1F38] flex items-center justify-center">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <span className="font-bold text-sm text-[#0F1F38]">Campaign Fundraising AI</span>
          <span className="text-slate-300">|</span>
          <span>© 2026 All rights reserved.</span>
        </div>

        <div className="flex items-center space-x-6">
          <a href="/#how-it-works" className="hover:text-[#0F1F38] transition-colors">How It Works</a>
          <a href="/#features" className="hover:text-[#0F1F38] transition-colors">Features</a>
          <a href="/#safeguards" className="hover:text-[#0F1F38] transition-colors">Safeguards</a>
          <Link href="/chat" className="text-amber-600 hover:text-amber-700 font-bold">Chat Workspace</Link>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-slate-100 text-center text-[11px] text-slate-400">
        Disclaimer: This platform provides AI-generated strategy roadmaps and is not affiliated with any election commission, political party, or regulatory authority.
      </div>
    </footer>
  );
}
