"use client";

import { ReactNode, createContext, useContext, useEffect, useState } from "react";

import { GameState, Habit, Reward, User } from "@/lib/models";
import * as storage from "@/lib/storage";

// Define the context type
interface AppContextType {
  user: User;
  habits: Habit[];
  rewards: Reward[];
  gameState: GameState;
  isLoading: boolean;
  updateUser: (user: User) => void;
  addHabit: (habit: Omit<Habit, "id" | "createdAt" | "completedDates" | "streak">) => void;
  completeHabit: (habitId: string) => void;
  addReward: (reward: Omit<Reward, "id" | "createdAt" | "redeemedDates">) => void;
  redeemReward: (rewardId: string) => boolean;
  updateGameState: (gameState: GameState) => void;
}

// Create the context with a default value
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize data on component mount
  useEffect(() => {
    const loadData = () => {
      storage.initializeData();
      setUser(storage.getUserData());
      setHabits(storage.getHabits());
      setRewards(storage.getRewards());
      setGameState(storage.getGameState());
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Update user data
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    storage.saveUserData(updatedUser);
  };

  // Add a new habit
  const addHabit = (habit: Omit<Habit, "id" | "createdAt" | "completedDates" | "streak">) => {
    const newHabit = storage.addHabit(habit);
    setHabits((prev) => [...prev, newHabit]);
  };

  // Complete a habit
  const completeHabit = (habitId: string) => {
    const updatedHabits = storage.completeHabit(habitId);
    setHabits(updatedHabits);
    setUser(storage.getUserData()); // Refresh user data as points/exp may have changed
  };

  // Add a new reward
  const addReward = (reward: Omit<Reward, "id" | "createdAt" | "redeemedDates">) => {
    const newReward = storage.addReward(reward);
    setRewards((prev) => [...prev, newReward]);
  };

  // Redeem a reward
  const redeemReward = (rewardId: string) => {
    const success = storage.redeemReward(rewardId);
    if (success) {
      setRewards(storage.getRewards());
      setUser(storage.getUserData());
    }
    return success;
  };

  // Update game state
  const updateGameState = (updatedGameState: GameState) => {
    setGameState(updatedGameState);
    storage.saveGameState(updatedGameState);
  };

  // Return early if still loading
  if (isLoading || !user || !gameState) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <AppContext.Provider
      value={{
        user,
        habits,
        rewards,
        gameState,
        isLoading,
        updateUser,
        addHabit,
        completeHabit,
        addReward,
        redeemReward,
        updateGameState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
