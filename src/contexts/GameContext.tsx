"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

import { Achievement, GameState, Habit, Reward, User, WorldData } from "@/lib/models";
import {
  loadAchievements,
  loadRewards,
  loadWorldData,
  saveGameState,
  saveHabits,
  saveRewards,
  saveUser,
  saveWorldData,
} from "@/lib/storage";
import { discoverWorld, getGameState } from "@/services/gameService";
import { addHabit, completeHabit as completeHabitService, getHabits } from "@/services/habitService";
import { redeemReward } from "@/services/rewardService";
import { addExperience, getUser, incrementStreak, updateUser } from "@/services/userService";

import { checkAchievements } from "../services/achievementService";
import { initializeDefaults } from "../services/initService";

interface GameContextType {
  user: ReturnType<typeof getUser>;
  setUser: (user: User) => void;
  habits: ReturnType<typeof getHabits>;
  setHabits: (habits: ReturnType<typeof getHabits>) => void;
  gameState: ReturnType<typeof getGameState>;
  setGameState: (gameState: GameState) => void;
  worldData: ReturnType<typeof loadWorldData>;
  rewards: ReturnType<typeof loadRewards>;
  setRewards: (rewards: ReturnType<typeof loadRewards>) => void;
  achievements: ReturnType<typeof loadAchievements>;
  isLoading: boolean;
  reload: () => void;
  addHabit: typeof addHabit;
  updateCurrentWorld: (newWorld: WorldData) => void;
  completeHabit: (habitId: string) => void;
  addExperience: typeof addExperience;
  incrementStreak: typeof incrementStreak;
  redeemReward: typeof redeemReward;
  discoverWorld: typeof discoverWorld;
  updateWorldData: (newWorldData: WorldData[]) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [habits, setHabits] = useState<Habit[] | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [rewards, setRewards] = useState<Reward[] | null>(null);
  const [achievements, setAchievements] = useState<Achievement[] | null>(null);
  const [worldData, setWorldData] = useState<WorldData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const reload = useCallback(() => {
    setUser(getUser());
    setHabits(getHabits());
    setGameState(getGameState());
    setRewards(loadRewards());
    setAchievements(loadAchievements());
    setWorldData(loadWorldData());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    reload();
    setIsLoading(false);
  }, [reload]);

  useEffect(() => {
    setIsLoading(true);
    const gameState = getGameState();
    if (!gameState) {
      initializeDefaults();
      reload();
    }
    setIsLoading(false);
  }, [user, habits, gameState, rewards, achievements, reload]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // eslint-disable-next-line no-console
      console.log("Detected localStorage change:", e.key);
      reload(); // 🔥 auto-reload when localStorage updates
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [reload]); // ✅ reload when storage changes

  useEffect(() => {
    if (user) saveUser(user);
  }, [user]);

  useEffect(() => {
    if (habits && habits.length) saveHabits(habits);
  }, [habits]);

  useEffect(() => {
    if (gameState) saveGameState(gameState);
  }, [gameState]);

  useEffect(() => {
    if (rewards && rewards.length) saveRewards(rewards);
  }, [rewards]);

  useEffect(() => {
    if (user && habits && rewards && habits.length && rewards.length) {
      checkAchievements(user, habits, rewards);
      setAchievements(loadAchievements());
    }
  }, [user, habits, rewards]);

  const updateCurrentWorld = (newWorld: WorldData) => {
    setGameState((prev) => ({ ...prev!, currentWorld: newWorld }));
  };

  const updateWorldData = (newWorldData: WorldData[]) => {
    saveWorldData(newWorldData);
  };

  const completeHabit = (habitId: string) => {
    if (!user || !habits) return;
    completeHabitService(habitId);

    // Find the habit to get its points value
    const habit = habits.find((h) => h.id === habitId);
    const pointsToAdd = habit?.points || 10; // Default to 10 if not found

    // Add experience based on the habit's points
    addExperience(pointsToAdd);

    // Update points
    updateUser({ points: user.points + pointsToAdd });

    // Update user streak
    incrementStreak();

    reload();
  };

  return (
    <GameContext.Provider
      value={{
        user,
        setUser,
        habits,
        updateCurrentWorld,
        setHabits,
        gameState,
        setGameState,
        rewards,
        setRewards,
        worldData,
        achievements,
        isLoading,
        reload,
        addHabit,
        updateWorldData,
        completeHabit,
        addExperience,
        incrementStreak,
        redeemReward,
        discoverWorld,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
