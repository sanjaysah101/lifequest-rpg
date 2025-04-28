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
  WorldData,
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

export const defaultWorldData: WorldData[] = [
  {
    id: "world-1",
    name: "Enchanted Forest",
    description: "A mystical forest filled with ancient wisdom",
    color: "from-green-900 to-emerald-700",
    unlockRequirement: 0,
    isUnlocked: true,
    quests: [
      {
        id: "forest-1",
        title: "Meditation Grove",
        description: "Find inner peace by completing a short meditation",
        task: "Take 3 deep breaths and focus on your breathing for 30 seconds",
        points: 15,
        habitCategory: HabitCategory.Wellness,
        isCompleted: false,
      },
      {
        id: "forest-2",
        title: "Knowledge Tree",
        description: "Absorb knowledge from the ancient tree",
        task: "Write down one thing you learned today",
        points: 20,
        habitCategory: HabitCategory.Learning, // <- changed "Growth" to Learning for better enum fit
        isCompleted: false,
      },
    ],
  },
  {
    id: "world-2",
    name: "Mystic Mountains",
    description: "Challenging peaks that test your resolve",
    color: "from-slate-800 to-blue-900",
    unlockRequirement: 2,
    isUnlocked: false,
    quests: [
      {
        id: "mountain-1",
        title: "Summit Challenge",
        description: "Reach the peak through perseverance",
        task: "Do 10 push-ups or a 1-minute plank",
        points: 25,
        habitCategory: HabitCategory.Health,
        isCompleted: false,
      },
      {
        id: "mountain-2",
        title: "Eagle's Vision",
        description: "Gain clarity from the mountain top",
        task: "Set one clear goal for tomorrow",
        points: 20,
        habitCategory: HabitCategory.Productivity,
        isCompleted: false,
      },
    ],
  },
  {
    id: "world-3",
    name: "Serene Ocean",
    description: "Vast waters of creativity and reflection",
    color: "from-blue-900 to-cyan-800",
    unlockRequirement: 4,
    isUnlocked: false,
    quests: [
      {
        id: "ocean-1",
        title: "Tide Pools of Creativity",
        description: "Discover creative inspiration in the pools",
        task: "Sketch or write something creative for 5 minutes",
        points: 30,
        habitCategory: HabitCategory.Learning, // <- again changed from "Growth" to match enums
        isCompleted: false,
      },
      {
        id: "ocean-2",
        title: "Ocean Cleanse",
        description: "Purify your space like the ocean cleanses shores",
        task: "Tidy up your immediate surroundings for 2 minutes",
        points: 15,
        habitCategory: HabitCategory.Productivity,
        isCompleted: false,
      },
    ],
  },
];

export const defaultGameState: GameState = {
  characterLevel: 1,
  achievements: [],
  lastPlayed: new Date().toISOString(),
  worldsDiscovered: ["forest"],
  questsCompleted: [],
  currentWorld: defaultWorldData[0],
  isGameInitialized: true,
};
