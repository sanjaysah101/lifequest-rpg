// Enums for consistency and type safety
export enum Frequency {
  Daily = "Daily",
  Weekdays = "Weekdays",
  Weekly = "Weekly",
  Monthly = "Monthly",
  Custom = "Custom",
}

export enum HabitCategory {
  Wellness = "Wellness",
  Health = "Health",
  Productivity = "Productivity",
  Learning = "Learning",
  Other = "Other",
}

export enum RewardCategory {
  Digital = "Digital",
  Entertainment = "Entertainment",
  FoodAndDrink = "Food & Drink",
  Rest = "Rest",
  Shopping = "Shopping",
  Other = "Other",
}

export enum FocusArea {
  Productivity = "Productivity",
  Wellness = "Wellness",
  Health = "Health",
  Learning = "Learning",
  Relationships = "Relationships",
  Other = "Other",
}

export enum MotivationType {
  Achievement = "Achievement",
  Mastery = "Mastery",
  Connection = "Connection",
  Autonomy = "Autonomy",
  Other = "Other",
}

// Core Interfaces

export interface User {
  id: string;
  name: string;
  createdAt: string;
  lastLogin: string | null; // ISO date string

  level: number;
  experience: number;
  nextLevelAt: number;
  points: number;
  streakDays: number;

  chainReaction: ChainReactionStatus;
  preferences?: UserPreferences;
  progressiveLoad?: ProgressiveLoadSettings;
  timeContext?: TimeContextSettings;
}

export interface ChainReactionStatus {
  count: number;
  lastCompletedAt: string | null;
}

export enum DifficultyPreference {
  Easy = "Easy",
  Moderate = "Moderate",
  Hard = "Hard",
}

export enum RewardPreference {
  Balanced = "Balanced",
  Delayed = "Delayed",
  Instant = "Instant",
}

export interface UserPreferences {
  wakeTime: string; // e.g., "07:00"
  sleepTime: string; // e.g., "22:00"
  focusArea: FocusArea;
  motivation: MotivationType;
  difficultyPreference: DifficultyPreference;
  rewardPreference: RewardPreference;
}

export interface ProgressiveLoadSettings {
  difficulty: number; // e.g., 1.0 = baseline, scales up
  reward: number; // e.g., 1.0 = baseline, scales up
}

export interface TimeContextSettings {
  wakeTime: string;
  sleepTime: string;
  optimizedHours: OptimizedHour[];
}

export interface OptimizedHour {
  start: number; // Hour in 24-hour format (0–23)
  end: number;
  bonus: number; // E.g., 0.2 = +20% points
  type: string; // Context like "focus", "energy boost", etc.
}

// Habits and Rewards

export interface Habit {
  id: string;
  name: string;
  description: string;
  frequency: Frequency;
  points: number;
  streak: number;
  category: HabitCategory;
  createdAt: string;
  completedDates: string[]; // Array of ISO date strings
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: RewardCategory;
  createdAt: string;
  redeemedDates: string[];
}

// Game and Adventure System

export interface GameState {
  characterLevel: number;
  achievements: string[];
  lastPlayed: string;
  worldsDiscovered: string[];
  questsCompleted: string[];
  currentWorld: string;
}

// Economy Engine Logic

export interface EconomyContext {
  basePoints: number;
  difficultyMultiplier: number; // from ProgressiveLoad
  timeBonusMultiplier: number; // from TimeContext
  chainReactionBonus: number; // bonus % if part of a chain
}

export function calculateFinalPoints(context: EconomyContext): number {
  const { basePoints, difficultyMultiplier, timeBonusMultiplier, chainReactionBonus } = context;

  const rawPoints = basePoints * difficultyMultiplier;
  const withTimeBonus = rawPoints * (1 + timeBonusMultiplier);
  const withChainBonus = withTimeBonus * (1 + chainReactionBonus);

  return Math.round(withChainBonus);
}

export enum QuestType {
  Daily = "Daily",
  Weekly = "Weekly",
  Special = "Special",
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  targetHabits: string[]; // habit IDs linked to the quest
  goal: number; // e.g., "Complete X habits"
  rewardPoints: number;
  bonusRewards?: string[]; // reward IDs or achievement IDs
  isCompleted: boolean;
  createdAt: string;
  completedAt: string | null;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  unlockedAt?: string;
  condition: AchievementCondition;
}

export interface AchievementCondition {
  type: "habits" | "rewards" | "system" | "special";
  threshold: number;
}
