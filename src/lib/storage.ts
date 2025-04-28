/* eslint-disable no-console */
// Import all your models
import { Achievement, GameState, Habit, Quest, Reward, User } from "./models";

// Storage Keys
const STORAGE_KEYS = {
  user: "lifeBalance_user",
  habits: "lifeBalance_habits",
  rewards: "lifeBalance_rewards",
  gameState: "lifeBalance_gameState",
  quests: "lifeBalance_quests",
  achievements: "lifeBalance_achievements",
} as const;

// Generic Storage Functions
function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to storage`, error);
  }
}

function loadFromStorage<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error loading ${key} from storage`, error);
    return null;
  }
}

function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from storage`, error);
  }
}

function clearAllStorage(): void {
  try {
    Object.values(STORAGE_KEYS).forEach(removeFromStorage);
  } catch (error) {
    console.error("Error clearing storage", error);
  }
}

// User-specific functions
export function saveUser(user: User) {
  saveToStorage<User>(STORAGE_KEYS.user, user);
}

export function loadUser(): User | null {
  return loadFromStorage<User>(STORAGE_KEYS.user);
}

// Habits
export function saveHabits(habits: Habit[]) {
  saveToStorage<Habit[]>(STORAGE_KEYS.habits, habits);
}

export function loadHabits(): Habit[] | null {
  return loadFromStorage<Habit[]>(STORAGE_KEYS.habits) || [];
}

// Rewards
export function saveRewards(rewards: Reward[]) {
  saveToStorage<Reward[]>(STORAGE_KEYS.rewards, rewards);
}

export function loadRewards(): Reward[] | null {
  return loadFromStorage<Reward[]>(STORAGE_KEYS.rewards) || [];
}

// GameState
export function saveGameState(gameState: GameState) {
  saveToStorage<GameState>(STORAGE_KEYS.gameState, gameState);
}

export function loadGameState(): GameState | null {
  return loadFromStorage<GameState>(STORAGE_KEYS.gameState);
}

// Quests
export function saveQuests(quests: Quest[]) {
  saveToStorage<Quest[]>(STORAGE_KEYS.quests, quests);
}

export function loadQuests(): Quest[] {
  return loadFromStorage<Quest[]>(STORAGE_KEYS.quests) || [];
}

// Achievements
export function saveAchievements(achievements: Achievement[]) {
  saveToStorage<Achievement[]>(STORAGE_KEYS.achievements, achievements);
}

export function loadAchievements(): Achievement[] | null {
  return loadFromStorage<Achievement[]>(STORAGE_KEYS.achievements) || [];
}

// Utility to reset all data
export function resetAllData() {
  clearAllStorage();
}
