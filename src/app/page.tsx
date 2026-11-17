'use client';

import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import InquiryBox from '@/components/InquiryBox';
import StrategyResult from '@/components/StrategyResult';
import TrustPillars from '@/components/TrustPillars';
import HowItWorks from '@/components/HowItWorks';
import LegalDisclaimer from '@/components/LegalDisclaimer';
import Footer from '@/components/Footer';
import { StrategyPlan, GenerateStrategyResponse } from '@/types/campaign';
import { AlertCircle } from 'lucide-react';
import { supabasePublic } from '@/lib/supabase';

export default function Home() {
  const [plan, setPlan] = useState<StrategyPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const [user, setUser] = useState<any>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate or retrieve persistent session ID for guest tracking
    let storedSession = localStorage.getItem('cf_session_id');
    if (!storedSession) {
      storedSession = 'cf_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('cf_session_id', storedSession);
    }
    setSessionId(storedSession);

    // Check user auth
    if (supabasePublic) {
      supabasePublic.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
      });
    }
  }, []);

  const handleGenerateStrategy = async (query: string, category: string) => {
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await fetch('/api/generate-strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          category,
          sessionId,
          userId: user?.id ?? null,
        }),
      });

      const data: GenerateStrategyResponse = await response.json().catch(() => ({
        success: false,
        error: 'Network response was not valid JSON.',
      }));

      if (!response.ok || !data.success || !data.data) {
        throw new Error(data.error || 'Failed to generate campaign strategy. Please try again.');
      }

      setPlan(data.data);

      // Smooth scroll to results
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      setApiError(err?.message || 'A network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFollowUp = (question: string) => {
    handleGenerateStrategy(question, 'general');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 selection:bg-amber-400 selection:text-slate-900">
      <Header />

      <main className="flex-1">
        <InquiryBox onSubmitQuery={handleGenerateStrategy} isLoading={isLoading} />

        {/* Global Error Alert */}
        {apiError && (
          <div className="max-w-4xl mx-auto px-4 mb-8">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
              <span>{apiError}</span>
            </div>
          </div>
        )}

        {/* Result Area */}
        <div ref={resultRef}>
          {plan && <StrategyResult plan={plan} onSelectFollowUp={handleSelectFollowUp} />}
        </div>

        <HowItWorks />
        <TrustPillars />
        <LegalDisclaimer />
      </main>

      <Footer />
    </div>
  );
}
