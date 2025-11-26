export interface WeddingProfile {
  names: string;
  date: string;
  budget: number;
  style: string;
  guestCount: number;
  location: string;
}

export interface Task {
  id: string;
  title: string;
  month: string;
  completed: boolean;
  category: 'legal' | 'vendor' | 'fashion' | 'beauty' | 'ceremony' | 'party';
}

export interface Guest {
  id: string;
  name: string;
  category: 'family' | 'friend' | 'work' | 'vip';
  confirmed: boolean;
  conflictPotential: string[]; // Names of people they shouldn't sit with
}

export interface Table {
  id: number;
  name: string;
  guests: Guest[];
  reasoning: string;
}

export interface BudgetItem {
  id: string;
  category: string;
  estimated: number;
  actual: number;
  paid: boolean;
}

export interface MoodboardItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  prompt: string;
}

export enum AppView {
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  PLANNER = 'PLANNER',
  GUESTS = 'GUESTS',
  BUDGET = 'BUDGET',
  MOODBOARD = 'MOODBOARD',
  SOS = 'SOS',
}
