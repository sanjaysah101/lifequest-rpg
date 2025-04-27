// Add this file if it doesn't exist or update it
import { v4 as uuidv4 } from "uuid";

import { GameState, Habit, Reward, User, defaultGameState, defaultHabits, defaultRewards, defaultUser } from "./models";

// Storage keys
const USER_KEY = "lifequest_user";
const HABITS_KEY = "lifequest_habits";
const REWARDS_KEY = "lifequest_rewards";
const GAME_STATE_KEY = "lifequest_gamestate";

// Initialize data if not present
export function initializeData() {
  if (!localStorage.getItem(USER_KEY)) {
    localStorage.setItem(USER_KEY, JSON.stringify(defaultUser));
  }

  if (!localStorage.getItem(HABITS_KEY)) {
    localStorage.setItem(HABITS_KEY, JSON.stringify(defaultHabits));
  }

  if (!localStorage.getItem(REWARDS_KEY)) {
    localStorage.setItem(REWARDS_KEY, JSON.stringify(defaultRewards));
  }

  if (!localStorage.getItem(GAME_STATE_KEY)) {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(defaultGameState));
  }

  // Load any separate preference data if it exists
  syncPreferencesData();
}

// Sync any separately stored preferences with the main user object
function syncPreferencesData() {
  const userData = getUserData();
  let updated = false;

  // Check for preferences data
  const preferencesData = localStorage.getItem("lifequest_user_preferences");
  if (preferencesData) {
    userData.preferences = JSON.parse(preferencesData);
    updated = true;
  }

  // Check for progressive load data
  const progressiveLoadData = localStorage.getItem("lifequest_user_progressiveLoad");
  if (progressiveLoadData) {
    userData.progressiveLoad = JSON.parse(progressiveLoadData);
    updated = true;
  }

  // Check for time context data
  const timeContextData = localStorage.getItem("lifequest_user_timeContext");
  if (timeContextData) {
    userData.timeContext = JSON.parse(timeContextData);
    updated = true;
  }

  // If any updates were made, save the user data
  if (updated) {
    saveUserData(userData);
  }
}

// Get user data
export function getUserData(): User {
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : defaultUser;
}

// Save user data
export function saveUserData(user: User) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  // Also save individual components for redundancy
  if (user.preferences) {
    localStorage.setItem("lifequest_user_preferences", JSON.stringify(user.preferences));
  }

  if (user.progressiveLoad) {
    localStorage.setItem("lifequest_user_progressiveLoad", JSON.stringify(user.progressiveLoad));
  }

  if (user.timeContext) {
    localStorage.setItem("lifequest_user_timeContext", JSON.stringify(user.timeContext));
  }
}

// Get habits
export function getHabits(): Habit[] {
  const data = localStorage.getItem(HABITS_KEY);
  return data ? JSON.parse(data) : defaultHabits;
}

// Add a new habit
export function addHabit(habit: Omit<Habit, "id" | "createdAt" | "completedDates" | "streak">): Habit {
  const habits = getHabits();
  const newHabit: Habit = {
    ...habit,
    id: `habit-${uuidv4()}`,
    createdAt: new Date().toISOString(),
    completedDates: [],
    streak: 0,
  };

  habits.push(newHabit);
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
  return newHabit;
}

// Complete a habit
export function completeHabit(habitId: string): Habit[] {
  const habits = getHabits();
  const today = new Date().toISOString().split("T")[0];

  const updatedHabits = habits.map((habit) => {
    if (habit.id === habitId && !habit.completedDates.includes(today)) {
      // Add today to completed dates
      const completedDates = [...habit.completedDates, today];

      // Calculate streak
      const streak = calculateStreak(completedDates);

      // Update user points and experience
      updateUserPointsAndExp(habit.points);

      return { ...habit, completedDates, streak };
    }
    return habit;
  });

  localStorage.setItem(HABITS_KEY, JSON.stringify(updatedHabits));
  return updatedHabits;
}

// Calculate streak from completed dates
function calculateStreak(dates: string[]): number {
  if (dates.length === 0) return 0;

  // Sort dates in ascending order
  const sortedDates = [...dates].sort();
  const streak = 1;

  // Check if today or yesterday is in the list
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  if (!dates.includes(today) && !dates.includes(yesterday)) {
    return 0; // Streak broken
  }

  return streak;
}

// Update chain reaction when completing habits
function updateChainReaction() {
  const user = getUserData();
  const today = new Date().toISOString().split("T")[0];

  // Initialize chain reaction if it doesn't exist
  if (!user.chainReaction) {
    user.chainReaction = { count: 0, lastCompletedAt: today };
  }

  // Check if the chain was updated today already
  if (user.chainReaction.lastCompletedAt === today) {
    // Increment the chain count
    user.chainReaction.count += 1;
  } else {
    // Start a new chain
    user.chainReaction.count = 1;
    user.chainReaction.lastCompletedAt = today;
  }

  // Cap the chain at a reasonable maximum (e.g., 5)
  if (user.chainReaction.count > 5) {
    user.chainReaction.count = 5;
  }

  saveUserData(user);
  return user.chainReaction;
}

// Update user points and experience
function updateUserPointsAndExp(points: number) {
  const user = getUserData();

  // Update points and experience
  user.points += points;
  user.experience += points;

  // Update chain reaction
  updateChainReaction();

  // Check for level up
  if (user.experience >= user.nextLevelAt) {
    user.level += 1;
    user.nextLevelAt = Math.floor(user.nextLevelAt * 1.5);
  }

  // Update streak days
  const today = new Date().toISOString().split("T")[0];
  const lastLogin = user.lastLogin || "";
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  if (lastLogin === yesterday) {
    user.streakDays += 1;
  } else if (lastLogin !== today) {
    user.streakDays = 1;
  }

  user.lastLogin = today;

  saveUserData(user);
}

// Get rewards
export function getRewards(): Reward[] {
  const data = localStorage.getItem(REWARDS_KEY);
  return data ? JSON.parse(data) : defaultRewards;
}

// Add a new reward
export function addReward(reward: Omit<Reward, "id" | "createdAt" | "redeemedDates">): Reward {
  const rewards = getRewards();
  const newReward: Reward = {
    ...reward,
    id: `reward-${uuidv4()}`,
    createdAt: new Date().toISOString(),
    redeemedDates: [],
  };

  rewards.push(newReward);
  localStorage.setItem(REWARDS_KEY, JSON.stringify(rewards));
  return newReward;
}

// Redeem a reward
export function redeemReward(rewardId: string): boolean {
  const rewards = getRewards();
  const user = getUserData();
  const reward = rewards.find((r) => r.id === rewardId);

  if (!reward) return false;

  // Check if user has enough points
  if (user.points < reward.cost) return false;

  // Update user points
  user.points -= reward.cost;
  saveUserData(user);

  // Update reward redeemed dates
  const updatedRewards = rewards.map((r) => {
    if (r.id === rewardId) {
      return {
        ...r,
        redeemedDates: [...r.redeemedDates, new Date().toISOString()],
      };
    }
    return r;
  });

  localStorage.setItem(REWARDS_KEY, JSON.stringify(updatedRewards));
  return true;
}

// Get game state
export function getGameState(): GameState {
  const data = localStorage.getItem(GAME_STATE_KEY);
  return data ? JSON.parse(data) : defaultGameState;
}

// Save game state
export function saveGameState(gameState: GameState) {
  localStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState));
}

// Save habits
export function saveHabits(habits: Habit[]) {
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
}

// Save rewards
export function saveRewards(rewards: Reward[]) {
  localStorage.setItem(REWARDS_KEY, JSON.stringify(rewards));
}
