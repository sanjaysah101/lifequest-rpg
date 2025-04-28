import {
  Achievement,
  DifficultyPreference,
  FocusArea,
  Frequency,
  GameState,
  Habit,
  HabitCategory,
  MotivationType,
  Quest,
  QuestType,
  Reward,
  RewardCategory,
  RewardPreference,
  User,
} from "./models";

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
    difficultyPreference: DifficultyPreference.Moderate,
    rewardPreference: RewardPreference.Balanced,
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
  isGameInitialized: true,
};

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

export const defaultAchievements: Achievement[] = [
  {
    id: "habit-starter",
    title: "Habit Starter",
    description: "Create your first habit",
    icon: "🌱",
    unlocked: false,
    progress: 0,
    condition: {
      type: "habits",
      threshold: 1,
    },
  },
  {
    id: "habit-master",
    title: "Habit Master",
    description: "Create 5 different habits",
    icon: "🌟",
    unlocked: false,
    progress: 0,
    condition: {
      type: "habits",
      threshold: 5,
    },
  },
  {
    id: "streak-warrior",
    title: "Streak Warrior",
    description: "Maintain a 7-day streak on any habit",
    icon: "🔥",
    unlocked: false,
    progress: 0,
    condition: {
      type: "habits",
      threshold: 7,
    },
  },
  {
    id: "reward-creator",
    title: "Reward Creator",
    description: "Create your first custom reward",
    icon: "🎁",
    unlocked: false,
    progress: 0,
    condition: {
      type: "rewards",
      threshold: 1,
    },
  },
  {
    id: "reward-redeemer",
    title: "Reward Redeemer",
    description: "Redeem 3 rewards",
    icon: "💎",
    unlocked: false,
    progress: 0,
    condition: {
      type: "rewards",
      threshold: 3,
    },
  },
  {
    id: "level-up",
    title: "Level Up",
    description: "Reach level 5",
    icon: "📈",
    unlocked: false,
    progress: 1,
    condition: {
      type: "system",
      threshold: 5,
    },
  },
  {
    id: "wizard-graduate",
    title: "Wizard Graduate",
    description: "Complete the Know Thyself Wizard",
    icon: "🧙",
    unlocked: false,
    progress: 0,
    condition: {
      type: "special",
      threshold: 1,
    },
  },
  {
    id: "chain-master",
    title: "Chain Master",
    description: "Achieve a 5x chain reaction",
    icon: "⚡",
    unlocked: false,
    progress: 0,
    condition: {
      type: "special",
      threshold: 5,
    },
  },
];
