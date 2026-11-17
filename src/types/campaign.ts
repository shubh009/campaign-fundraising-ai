export type CampaignCategory = 'event' | 'donor_outreach' | 'budget' | 'digital' | 'volunteer' | 'general';

export interface ActionStep {
  stepNumber: number;
  title: string;
  description: string;
  timeframe: string;
}

export interface EstimatedEffort {
  budgetRange: string;
  volunteerHours: string;
  difficulty: 'Low' | 'Medium' | 'High';
}

export interface StrategyPlan {
  id?: string;
  summary: string;
  actionSteps: ActionStep[];
  estimatedEffort: EstimatedEffort;
  followUpQuestions: string[];
  disclaimer: string;
  createdAt?: string;
}

export interface GenerateStrategyRequest {
  query: string;
  category?: CampaignCategory;
  sessionId?: string;
}

export interface GenerateStrategyResponse {
  success: boolean;
  data?: StrategyPlan;
  error?: string;
}

export interface FeedbackRequest {
  queryId: string;
  rating: 'positive' | 'negative';
  comments?: string;
}

export interface FeedbackResponse {
  success: boolean;
  message?: string;
  error?: string;
}

