import { GoogleGenerativeAI } from '@google/generative-ai';
import { StrategyPlan } from '@/types/campaign';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

const SYSTEM_INSTRUCTION = `You are "Campaign Fundraising AI", an expert campaign strategist and fundraising advisor for political, civic, and community campaigns.

CORE PURPOSE:
Help campaign managers, candidates, and organizers plan actionable fundraising strategies (small-dollar events, major donor outreach, digital campaigns, grassroot rallies, budget timelines, and volunteer mobilization).

IMPORTANT SAFEGUARDS & NON-LEGAL BOUNDARIES:
1. You are a fundraising PLANNING assistant, NOT a source of legal, tax, or regulatory compliance advice.
2. Campaign finance laws differ significantly by office (federal, state, municipal, county, or local board) and jurisdiction.
3. NEVER invent or fabricate contribution limits, filing deadlines, reporting periods, or statutory compliance definitions.
4. When compliance or jurisdiction-specific rules are relevant, explicitly state that rules vary and instruct the user to verify with their official election authority (e.g. FEC, state ethics commission) or qualified campaign counsel.
5. NEVER request, process, or advise on collecting sensitive donor credit card details or bank credentials.

ANSWER FORMAT:
You MUST respond ONLY with a valid JSON object matching the exact schema below. Do not wrap in markdown quotes if possible, or use standard json.

Schema:
{
  "summary": "2-3 concise, high-impact sentences providing an executive summary of the strategy.",
  "actionSteps": [
    {
      "stepNumber": 1,
      "title": "Clear action title",
      "description": "Specific, practical instructions on what to do and how to execute it.",
      "timeframe": "e.g. Week 1, Day 1-3, or Ongoing"
    }
  ],
  "estimatedEffort": {
    "budgetRange": "e.g. $250 - $750 or $0 (Grassroots)",
    "volunteerHours": "e.g. 5-10 hours/week",
    "difficulty": "Low" | "Medium" | "High"
  },
  "followUpQuestions": [
    "Follow-up question 1 to explore next",
    "Follow-up question 2 to refine the plan"
  ],
  "disclaimer": "This plan is for operational strategy and planning purposes only. Verify jurisdiction-specific campaign finance contribution limits and reporting requirements with your election commission or legal counsel."
}`;

// Prioritize active, fast, non-congested models (2s response time)
const CANDIDATE_MODELS = [
  'gemini-3.1-flash-lite-preview',
  'gemini-3-flash-preview',
  'gemini-3.5-flash-lite',
  'gemini-flash-latest',
];

export async function generateCampaignStrategy(query: string, category: string = 'general'): Promise<StrategyPlan> {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment variables.');
  }

  const prompt = `Campaign Representative Question: "${query}"\nCategory Focus: ${category}\n\nPlease generate a practical, step-by-step fundraising roadmap in the required JSON format.`;

  let lastError: any = null;

  for (const modelName of CANDIDATE_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: SYSTEM_INSTRUCTION,
        generationConfig: {
          temperature: 0.3,
          topP: 0.8,
          responseMimeType: 'application/json',
        },
      });

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      // Clean potential markdown fencing
      const cleanedJson = responseText
        .replace(/^```json\s*/i, '')
        .replace(/\s*```$/, '')
        .trim();

      const parsed: StrategyPlan = JSON.parse(cleanedJson);

      return {
        summary: parsed.summary || 'Strategic fundraising recommendations generated for your campaign.',
        actionSteps: Array.isArray(parsed.actionSteps) && parsed.actionSteps.length > 0
          ? parsed.actionSteps
          : [
              {
                stepNumber: 1,
                title: 'Review Goal & Target Audience',
                description: 'Define your key donor segments and specific dollar target for this initiative.',
                timeframe: 'Day 1-2',
              },
            ],
        estimatedEffort: {
          budgetRange: parsed.estimatedEffort?.budgetRange || '$200 - $1,000',
          volunteerHours: parsed.estimatedEffort?.volunteerHours || '5-10 hrs',
          difficulty: parsed.estimatedEffort?.difficulty || 'Medium',
        },
        followUpQuestions: Array.isArray(parsed.followUpQuestions)
          ? parsed.followUpQuestions
          : ['What is your target dollar amount?', 'How many active volunteers do you have?'],
        disclaimer: parsed.disclaimer || 'Operational planning guide only. Verify campaign finance regulations with official authorities.',
      };
    } catch (err: any) {
      console.warn(`Model ${modelName} attempt failed:`, err?.message || err);
      lastError = err;
      // Continue to next candidate model
    }
  }

  throw new Error(lastError?.message || 'Failed to generate structured strategy plan. Please rephrase your question.');
}
