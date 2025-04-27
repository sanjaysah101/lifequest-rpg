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

export interface UserPreferences {
  wakeTime: string; // e.g., "07:00"
  sleepTime: string; // e.g., "22:00"
  focusArea: FocusArea;
  motivation: MotivationType;
  difficultyPreference: "easy" | "moderate" | "hard";
  rewardPreference: "balanced" | "delayed" | "instant";
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

// --- Default Data ---

export const defaultUser: User = {
  id: "user-1",
  name: "Adventurer",
  createdAt: new Date().toISOString(),
  lastLogin: null,
  level: 1,
  experience: 0,
  nextLevelAt: 100,
  points: 0,
  streakDays: 0,
  chainReaction: {
    count: 0,
    lastCompletedAt: null,
  },
  preferences: {
    wakeTime: "07:00",
    sleepTime: "22:00",
    focusArea: FocusArea.Productivity,
    motivation: MotivationType.Achievement,
    difficultyPreference: "moderate",
    rewardPreference: "balanced",
  },
  progressiveLoad: {
    difficulty: 1.0,
    reward: 1.0,
  },
  timeContext: {
    wakeTime: "07:00",
    sleepTime: "22:00",
    optimizedHours: [
      {
        start: 8,
        end: 10,
        bonus: 0.2,
        type: "productivity",
      },
      {
        start: 14,
        end: 16,
        bonus: 0.15,
        type: "focus",
      },
    ],
  },
};

export const defaultHabits: Habit[] = [
  {
    id: "habit-1",
    name: "Morning Meditation",
    description: "10 minutes of mindfulness to start the day",
    frequency: Frequency.Daily,
    points: 10,
    streak: 0,
    category: HabitCategory.Wellness,
    createdAt: new Date().toISOString(),
    completedDates: [],
  },
  {
    id: "habit-2",
    name: "Exercise",
    description: "30 minutes of physical activity",
    frequency: Frequency.Daily,
    points: 15,
    streak: 0,
    category: HabitCategory.Health,
    createdAt: new Date().toISOString(),
    completedDates: [],
  },
];

export const defaultRewards: Reward[] = [
  {
    id: "reward-1",
    name: "30min Gaming Break",
    description: "Take a break and play your favorite game",
    cost: 50,
    category: RewardCategory.Entertainment,
    createdAt: new Date().toISOString(),
    redeemedDates: [],
  },
  {
    id: "reward-2",
    name: "Coffee Shop Visit",
    description: "Treat yourself to a nice coffee",
    cost: 75,
    category: RewardCategory.FoodAndDrink,
    createdAt: new Date().toISOString(),
    redeemedDates: [],
  },
];

export const defaultGameState: GameState = {
  characterLevel: 1,
  achievements: [],
  lastPlayed: new Date().toISOString(),
  worldsDiscovered: ["forest"],
  questsCompleted: [],
  currentWorld: "forest",
};

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

// Example default quests
export const defaultQuests: Quest[] = [
  {
    id: "quest-1",
    title: "Start Strong!",
    description: "Complete 3 habits today.",
    type: QuestType.Daily,
    targetHabits: [],
    goal: 3,
    rewardPoints: 50,
    isCompleted: false,
    createdAt: new Date().toISOString(),
    completedAt: null,
  },
];

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt: string | null;
  condition: AchievementCondition;
}

export interface AchievementCondition {
  type: "habitCompletion" | "streak" | "pointsEarned" | "questCompleted";
  threshold: number;
}

// Example default achievements
export const defaultAchievements: Achievement[] = [
  {
    id: "achievement-1",
    title: "First Step",
    description: "Complete your first habit!",
    unlockedAt: null,
    condition: {
      type: "habitCompletion",
      threshold: 1,
    },
  },
  {
    id: "achievement-2",
    title: "Consistency King",
    description: "Maintain a 7-day streak!",
    unlockedAt: null,
    condition: {
      type: "streak",
      threshold: 7,
    },
  },
];
