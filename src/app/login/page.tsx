'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Star, Mail, Lock, User, ArrowRight, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { supabasePublic } from '@/lib/supabase';

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'signup' ? 'signup' : 'signin';
  const redirectTo = searchParams.get('redirect') || '/chat';

  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // If already logged in, redirect directly to /chat
    if (supabasePublic) {
      supabasePublic.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          router.push(redirectTo);
        }
      });
    }
  }, [router, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (!supabasePublic) {
      setErrorMessage('Supabase client is not configured.');
      return;
    }

    setIsLoading(true);

    try {
      if (activeTab === 'signup') {
        const { data, error } = await supabasePublic.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            data: { full_name: fullName.trim() || 'Campaign Organizer' },
          },
        });

        if (error) throw error;

        if (data.session) {
          router.push(redirectTo);
        } else {
          setSuccessMessage('Account created! Please check your email to confirm your registration or sign in directly.');
          setActiveTab('signin');
        }
      } else {
        const { data, error } = await supabasePublic.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (error) throw error;

        if (data.session) {
          router.push(redirectTo);
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-[#0F1F38] flex items-center justify-center shadow-md">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          </div>
          <span className="text-2xl font-black text-[#0F1F38]">
            Campaign <span className="text-amber-600">Fundraising</span> AI
          </span>
        </Link>
        <h2 className="text-xl font-bold tracking-tight text-slate-800">
          {activeTab === 'signin' ? 'Sign in to your campaign workspace' : 'Create your campaign account'}
        </h2>
        <p className="text-xs text-slate-500">
          Access your saved strategies, past donor inquiries, and custom campaign budgets.
        </p>
      </div>

      {/* Main Form Container */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-200/60 rounded-2xl border border-slate-200/90 space-y-6">
          {/* Tabs */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setActiveTab('signin');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`py-2.5 rounded-lg transition-all ${
                activeTab === 'signin'
                  ? 'bg-white text-[#0F1F38] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('signup');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`py-2.5 rounded-lg transition-all ${
                activeTab === 'signup'
                  ? 'bg-white text-[#0F1F38] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Alerts */}
          {errorMessage && (
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
              <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name / Campaign Role
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alex Johnson (Campaign Manager)"
                    className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-sm rounded-xl pl-10 pr-4 py-2.5 border border-slate-200 focus:bg-white focus:border-amber-500 focus:outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Campaign Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@yourcampaign.org"
                  className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-sm rounded-xl pl-10 pr-4 py-2.5 border border-slate-200 focus:bg-white focus:border-amber-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-sm rounded-xl pl-10 pr-4 py-2.5 border border-slate-200 focus:bg-white focus:border-amber-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-white bg-[#0F1F38] hover:bg-[#193259] disabled:opacity-50 shadow-md shadow-blue-950/10 transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  Processing...
                </>
              ) : (
                <>
                  {activeTab === 'signin' ? 'Sign In to Workspace' : 'Create Campaign Account'}
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </>
              )}
            </button>
          </form>

          {/* Quick guest bypass if needed */}
          <div className="pt-2 text-center border-t border-slate-100">
            <Link
              href="/"
              className="text-xs font-semibold text-slate-500 hover:text-[#0F1F38] transition-colors"
            >
              ← Return to Public Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-slate-400">Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}

