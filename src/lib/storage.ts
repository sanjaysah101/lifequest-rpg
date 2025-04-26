import { GameState, Habit, Reward, User, defaultGameState, defaultHabits, defaultRewards, defaultUser } from "./models";

// Storage keys
const STORAGE_KEYS = {
  USER: "lifequest_user",
  HABITS: "lifequest_habits",
  REWARDS: "lifequest_rewards",
  GAME_STATE: "lifequest_game_state",
};

// Helper to safely parse JSON from localStorage
const safelyParseJSON = <T>(key: string, defaultValue: T): T => {
  if (typeof window === "undefined") return defaultValue;

  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error parsing ${key} from localStorage:`, error);
    return defaultValue;
  }
};

// User data operations
export const getUserData = (): User => {
  return safelyParseJSON<User>(STORAGE_KEYS.USER, defaultUser);
};

export const saveUserData = (userData: User): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
};

// Habits operations
export const getHabits = (): Habit[] => {
  return safelyParseJSON<Habit[]>(STORAGE_KEYS.HABITS, defaultHabits);
};

export const saveHabits = (habits: Habit[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
};

export const addHabit = (habit: Omit<Habit, "id" | "createdAt" | "completedDates" | "streak">): Habit => {
  const habits = getHabits();
  const newHabit: Habit = {
    ...habit,
    id: `habit-${Date.now()}`,
    createdAt: new Date().toISOString(),
    completedDates: [],
    streak: 0,
  };

  saveHabits([...habits, newHabit]);
  return newHabit;
};

export const completeHabit = (habitId: string): Habit[] => {
  const habits = getHabits();
  const today = new Date().toISOString().split("T")[0];
  const now = new Date().toISOString();

  const updatedHabits = habits.map((habit) => {
    if (habit.id === habitId) {
      // Check if already completed today
      const completedToday = habit.completedDates.some((date) => date.startsWith(today));

      if (!completedToday) {
        // Add experience and points to user
        const user = getUserData();

        // Calculate chain reaction bonus
        let chainBonus = 0;
        const CHAIN_TIMEOUT_HOURS = 24; // Reset chain if more than 24 hours between completions

        if (user.chainReaction.lastCompletedAt) {
          const lastCompleted = new Date(user.chainReaction.lastCompletedAt);
          const currentTime = new Date();
          const hoursDifference = (currentTime.getTime() - lastCompleted.getTime()) / (1000 * 60 * 60);

          if (hoursDifference <= CHAIN_TIMEOUT_HOURS) {
            // Chain is active, increment and add bonus
            user.chainReaction.count += 1;

            // Bonus formula: 10% extra points per chain level, up to 50%
            const bonusMultiplier = Math.min(0.5, user.chainReaction.count * 0.1);
            chainBonus = Math.floor(habit.points * bonusMultiplier);
          } else {
            // Chain broken, reset
            user.chainReaction.count = 1;
          }
        } else {
          // First habit completion, start chain
          user.chainReaction.count = 1;
        }

        // Update last completed time
        user.chainReaction.lastCompletedAt = now;

        const totalPoints = habit.points + chainBonus;

        const updatedUser = {
          ...user,
          experience: user.experience + totalPoints,
          points: user.points + totalPoints,
        };

        // Level up if enough experience
        if (updatedUser.experience >= updatedUser.nextLevelAt) {
          updatedUser.level += 1;
          updatedUser.nextLevelAt = Math.floor(updatedUser.nextLevelAt * 1.5);
        }

        saveUserData(updatedUser);

        // Update habit
        return {
          ...habit,
          completedDates: [...habit.completedDates, now],
          streak: habit.streak + 1,
        };
      }
    }
    return habit;
  });

  saveHabits(updatedHabits);
  return updatedHabits;
};

// Rewards operations
export const getRewards = (): Reward[] => {
  return safelyParseJSON<Reward[]>(STORAGE_KEYS.REWARDS, defaultRewards);
};

export const saveRewards = (rewards: Reward[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(rewards));
};

export const addReward = (reward: Omit<Reward, "id" | "createdAt" | "redeemedDates">): Reward => {
  const rewards = getRewards();
  const newReward: Reward = {
    ...reward,
    id: `reward-${Date.now()}`,
    createdAt: new Date().toISOString(),
    redeemedDates: [],
  };

  saveRewards([...rewards, newReward]);
  return newReward;
};

export const redeemReward = (rewardId: string): boolean => {
  const rewards = getRewards();
  const user = getUserData();

  const reward = rewards.find((r) => r.id === rewardId);
  if (!reward) return false;

  // Check if user has enough points
  if (user.points < reward.cost) return false;

  // Update user points
  const updatedUser = {
    ...user,
    points: user.points - reward.cost,
  };
  saveUserData(updatedUser);

  // Update reward
  const updatedRewards = rewards.map((r) => {
    if (r.id === rewardId) {
      return {
        ...r,
        redeemedDates: [...r.redeemedDates, new Date().toISOString()],
      };
    }
    return r;
  });

  saveRewards(updatedRewards);
  return true;
};

// Game state operations
export const getGameState = (): GameState => {
  return safelyParseJSON<GameState>(STORAGE_KEYS.GAME_STATE, defaultGameState);
};

export const saveGameState = (gameState: GameState): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(gameState));
};

// Initialize data if not exists
export const initializeData = (): void => {
  if (typeof window === "undefined") return;

  if (!localStorage.getItem(STORAGE_KEYS.USER)) {
    saveUserData(defaultUser);
  }

  if (!localStorage.getItem(STORAGE_KEYS.HABITS)) {
    saveHabits(defaultHabits);
  }

  if (!localStorage.getItem(STORAGE_KEYS.REWARDS)) {
    saveRewards(defaultRewards);
  }

  if (!localStorage.getItem(STORAGE_KEYS.GAME_STATE)) {
    saveGameState(defaultGameState);
  }
};
