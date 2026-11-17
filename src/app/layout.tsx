import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Campaign Fundraising AI | Smarter Fundraising. Stronger Campaign.',
  description:
    'AI-powered insights, custom roadmaps, and practical fundraising strategies to accelerate your political and community campaign support.',
  keywords: [
    'Campaign Fundraising',
    'AI Campaign Planner',
    'Political Campaign Strategy',
    'Grassroots Fundraising',
    'Donor Outreach',
    'Election Campaign Budget',
  ],
  authors: [{ name: 'Campaign Fundraising AI' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col antialiased bg-[#F8FAFC] text-slate-900">
        {children}
      </body>
    </html>
  );
}
