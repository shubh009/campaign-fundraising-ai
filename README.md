# Campaign Fundraising AI 🏛️

**Smarter Fundraising. Stronger Campaign.**

An executive, AI-assisted fundraising strategy platform designed for political, civic, and community campaigns. Representatives enter plain-language campaign questions and receive practical, structured roadmaps, budget guidance, volunteer allocation models, and actionable next steps.

---

## 🌟 Key Features

- **Natural Language Inquiry:** Ask operational questions like *"How can we raise our first $10,000?"* or *"Plan a small-dollar grassroots backyard dinner"*.
- **Quick-Start Prompts:** Pre-curated prompts for event planning, donor outreach, budget allocation, and digital campaigns.
- **Actionable Roadmaps:** Multi-step timelines (Weeks 1-2, Event Day, 48hr follow-up) with volunteer hour estimates and budget bands.
- **Strict Compliance Safeguards:** Built-in boundaries to avoid fabricating contribution limits; guides campaign teams to official election authorities (FEC, state ethics boards).
- **Export & Copy:** 1-click clipboard copy and `.txt` file export.
- **User Feedback Loop:** Instant thumbs-up / thumbs-down ratings logged directly to Supabase.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | **Next.js 16 (App Router) & React 19** |
| **Styling** | **Tailwind CSS v4** (Executive Deep Navy & Gold design tokens) |
| **Icons** | **Lucide-react** |
| **AI Engine** | **Google Gemini API** (`gemini-flash-latest` with automated model fallback) |
| **Database & Auth** | **Supabase (PostgreSQL)** |
| **Deployment Target** | **Vercel** (Git-triggered continuous deployment) |

---

## 🚀 Quick Start (Local Setup)

### 1. Clone the repository
```bash
git clone https://github.com/shubh009/campaign-fundraising-ai.git
cd campaign-fundraising-ai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Setup Supabase Database Tables
Open your **Supabase Dashboard ➔ SQL Editor** and execute the queries in `supabase/schema.sql`.

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deploying to Vercel

1. Push your repository to GitHub.
2. In Vercel, click **"Add New Project"** and import `campaign-fundraising-ai`.
3. Add the 4 environment variables from `.env.example` in Vercel Project Settings.
4. Click **Deploy**!

---

## ⚖️ Legal & Compliance Disclaimer

Campaign Fundraising AI is an operational planning tool and does **not** provide legal, election compliance, accounting, or tax advice. Always consult your official election board or qualified legal counsel for contribution limits and reporting deadlines.
