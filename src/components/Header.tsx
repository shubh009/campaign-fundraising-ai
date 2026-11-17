'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, Menu, X, ArrowRight, MessageSquare, LogOut, User } from 'lucide-react';
import { supabasePublic } from '@/lib/supabase';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!supabasePublic) return;

    // Check active session
    supabasePublic.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabasePublic.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    if (supabasePublic) {
      await supabasePublic.auth.signOut();
      setUser(null);
      window.location.href = '/';
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#0F1F38] flex items-center justify-center shadow-md shadow-blue-900/10 border border-blue-900/20 group-hover:scale-105 transition-transform">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-[#0F1F38] flex items-center gap-1.5">
                Campaign <span className="text-amber-600">Fundraising</span> AI
              </span>
              <span className="block text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                Strategic Intelligence for Campaigns
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
            <a href="/#how-it-works" className="hover:text-[#0F1F38] transition-colors">
              How It Works
            </a>
            <a href="/#features" className="hover:text-[#0F1F38] transition-colors">
              Features
            </a>
            <a href="/#examples" className="hover:text-[#0F1F38] transition-colors">
              Example Prompts
            </a>
            <a href="/#safeguards" className="hover:text-[#0F1F38] transition-colors">
              Safeguards
            </a>
          </nav>

          {/* Call to Action & Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  href="/chat"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white bg-[#0F1F38] hover:bg-[#1A3158] shadow-sm transition-all"
                >
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  Chat Workspace
                </Link>
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-slate-100 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-sm font-bold text-slate-700 hover:text-[#0F1F38] px-3 py-2 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/login?tab=signup"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-[#0F1F38] hover:bg-[#1A3158] shadow-md shadow-blue-950/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Get Started <ArrowRight className="w-4 h-4 text-amber-400" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <a
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-semibold text-slate-700 hover:bg-slate-50"
          >
            How It Works
          </a>
          <a
            href="/#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-semibold text-slate-700 hover:bg-slate-50"
          >
            Features
          </a>
          <a
            href="/#examples"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-semibold text-slate-700 hover:bg-slate-50"
          >
            Example Prompts
          </a>
          <a
            href="/#safeguards"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-semibold text-slate-700 hover:bg-slate-50"
          >
            Safeguards
          </a>

          <div className="pt-2 border-t border-slate-100">
            {user ? (
              <div className="space-y-2">
                <Link
                  href="/chat"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center w-full px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-[#0F1F38]"
                >
                  Open Chat Workspace
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block text-center w-full px-5 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-lg text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/login?tab=signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-lg text-sm font-bold text-white bg-[#0F1F38]"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
