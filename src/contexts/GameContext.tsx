"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { discoverWorld, getGameState } from "@/services/gameService";
import { addHabit, completeHabit as completeHabitService, getHabits } from "@/services/habitService";
import { redeemReward } from "@/services/rewardService";
import { addExperience, getUser, incrementStreak, updateUser } from "@/services/userService";

import { User } from "../lib/models";
import {
  loadAchievements,
  loadHabits,
  loadRewards,
  saveGameState,
  saveHabits,
  saveRewards,
  saveUser,
} from "../lib/storage";
import { checkAchievements } from "../services/achievementService";
import { initializeDefaults } from "../services/initService";

interface GameContextType {
  user: ReturnType<typeof getUser>;
  setUser: (user: User) => void;
  habits: ReturnType<typeof getHabits>;
  setHabits: (habits: ReturnType<typeof getHabits>) => void;
  gameState: ReturnType<typeof getGameState>;
  setGameState: (gameState: ReturnType<typeof getGameState>) => void;
  rewards: ReturnType<typeof loadRewards>;
  setRewards: (rewards: ReturnType<typeof loadRewards>) => void;
  achievements: ReturnType<typeof loadAchievements>;

  isLoading: boolean;
  reload: () => void;
  // Expose core actions
  addHabit: typeof addHabit;
  completeHabit: typeof completeHabitService;
  addExperience: typeof addExperience;
  incrementStreak: typeof incrementStreak;
  redeemReward: typeof redeemReward;
  discoverWorld: typeof discoverWorld;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<ReturnType<typeof getUser>>(getUser());
  const [habits, setHabits] = useState<ReturnType<typeof loadHabits>>(getHabits());
  const [gameState, setGameState] = useState(getGameState());
  const [rewards, setRewards] = useState<ReturnType<typeof loadRewards>>(loadRewards());
  const [isLoading, setIsLoading] = useState(true);
  const [achievements, setAchievements] = useState<ReturnType<typeof loadAchievements>>(loadAchievements());

  useEffect(() => {
    setIsLoading(true);
    if (!user || !habits || !gameState || !rewards) {
      initializeDefaults();
    }
    setIsLoading(false);
  }, [gameState, habits, rewards, user]);

  const reload = () => {
    const user = getUser();
    const habits = getHabits();
    const gameState = getGameState();
    const rewards = loadRewards();
    const achievements = loadAchievements();

    // Update all state variables at the same time to avoid race conditions and ensure consistency
    setUser(user);
    setHabits(habits);
    setGameState(gameState);
    setRewards(rewards);
    setAchievements(achievements);
  };

  useEffect(() => {
    reload();
  }, []);

  useEffect(() => {
    if (user) saveUser(user);
  }, [user]);

  useEffect(() => {
    if (!habits?.length) return;

    if (habits) saveHabits(habits);
  }, [habits]);

  useEffect(() => {
    if (gameState) saveGameState(gameState);
  }, [gameState]);

  useEffect(() => {
    if (!rewards?.length) return;

    saveRewards(rewards);
  }, [rewards]);

  useEffect(() => {
    console.log({ user, habits, rewards });
    if (!user || !habits || !rewards) return;

    checkAchievements(user, habits, rewards);
  }, [user, habits, rewards]);

  const completeHabit = (habitId: string) => {
    if (!user) return;
    completeHabitService(habitId);

    // Find the habit to get its points value
    const habit = habits?.find((h) => h.id === habitId);
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
        habits,
        gameState,
        isLoading,
        rewards,
        achievements,
        reload,
        setUser,
        setRewards,
        setHabits,
        setGameState,
        addHabit,
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
