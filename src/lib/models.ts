  // Define our data models with TypeScript interfaces

  export interface User {     
    id: string;
    name: string;
    level: number;
    experience: number;
    nextLevelAt: number;
    points: number;
    streakDays: number;
    createdAt: string;
    lastLogin: string | null;
    // Add chain reaction tracking
    chainReaction: {
      count: number;
      lastCompletedAt: string | null;
    };
    // User preferences from Know Thyself Wizard
    preferences?: {
      wakeTime: string;
      sleepTime: string;
      focusArea: string;
      motivation: string;
      difficultyPreference: string;
      rewardPreference: string;
    };
    // Progressive load system settings
    progressiveLoad?: {
      difficulty: number;
      reward: number;
    };
    // Time context settings
    timeContext?: {
      wakeTime: string;
      sleepTime: string;
      optimizedHours: Array<{
        start: number;
        end: number;
        bonus: number;
        type: string;
      }>;
    };
  }

  export interface Habit {
    id: string;
    name: string;
    description: string;
    frequency: "Daily" | "Weekdays" | "Weekly" | "Monthly" | "Custom";
    points: number;
    streak: number;
    category: string;
    createdAt: string;
    completedDates: string[]; // ISO date strings
  }

  export interface Reward {
    id: string;
    name: string;
    description: string;
    cost: number;
    category: string;
    createdAt: string;
    redeemedDates: string[]; // ISO date strings
  }

  export interface GameState {
    characterLevel: number;
    achievements: string[];
    lastPlayed: string;
    // Add adventure tracking
    worldsDiscovered: string[];
    questsCompleted: string[];
    currentWorld: string;
  }

  // Default data for initial setup
  export const defaultUser: User = {
    id: "user-1",
    name: "Adventurer",
    level: 1,
    experience: 0,
    nextLevelAt: 100,
    points: 0,
    streakDays: 0,
    lastLogin: null,
    createdAt: new Date().toISOString(),
    // Initialize chain reaction
    chainReaction: {
      count: 0,
      lastCompletedAt: null,
    },
    // Initialize with empty preferences
    preferences: {
      wakeTime: "07:00",
      sleepTime: "22:00",
      focusArea: "productivity",
      motivation: "achievement",
      difficultyPreference: "moderate",
      rewardPreference: "balanced",
    },
    // Initialize progressive load system
    progressiveLoad: {
      difficulty: 1.0,
      reward: 1.0,
    },
    // Initialize time context
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
      frequency: "Daily",
      points: 10,
      streak: 0,
      category: "Wellness",
      createdAt: new Date().toISOString(),
      completedDates: [],
    },
    {
      id: "habit-2",
      name: "Exercise",
      description: "30 minutes of physical activity",
      frequency: "Daily",
      points: 15,
      streak: 0,
      category: "Health",
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
      category: "Entertainment",
      createdAt: new Date().toISOString(),
      redeemedDates: [],
    },
    {
      id: "reward-2",
      name: "Coffee Shop Visit",
      description: "Treat yourself to a nice coffee",
      cost: 75,
      category: "Food & Drink",
      createdAt: new Date().toISOString(),
      redeemedDates: [],
    },
  ];

  export const defaultGameState: GameState = {
    characterLevel: 1,
    achievements: [],
    lastPlayed: new Date().toISOString(),
    // Initialize adventure state
    worldsDiscovered: ["forest"],
    questsCompleted: [],
    currentWorld: "forest",
  };
