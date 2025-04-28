"use client";

import { SparklesIcon, TrophyIcon, ZapIcon } from "lucide-react";

import { Progress } from "@/components/ui/progress";

import { useGame } from "../contexts/GameContext";

export default function GameStats() {
  const { user, habits } = useGame();

  if (!user || !habits) return null;

  // Calculate stats
  const completedHabits = habits.reduce((count, habit) => count + (habit.completedDates.length > 0 ? 1 : 0), 0);
  const totalHabits = habits.length;
  const completionPercentage = totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0;

  // Calculate longest streak
  const longestStreak = habits.reduce((max, habit) => Math.max(max, habit.streak), 0);

  // Calculate experience percentage
  const expPercentage = (user.experience / user.nextLevelAt) * 100;

  return (
    <div className="rounded-lg border border-blue-800 bg-blue-950/30 p-6">
      <h2 className="mb-4 text-xl font-bold">Your Progress</h2>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrophyIcon className="h-5 w-5 text-yellow-400" />
              <span className="font-semibold">Level</span>
            </div>
            <span className="text-xl font-bold">{user.level}</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Experience</span>
              <span>
                {user.experience}/{user.nextLevelAt}
              </span>
            </div>
            <Progress value={expPercentage} className="h-2" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SparklesIcon className="h-5 w-5 text-blue-400" />
              <span className="font-semibold">Points</span>
            </div>
            <span className="text-xl font-bold">{user.points}</span>
          </div>
          <p className="text-sm text-blue-200">Available to spend on rewards</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ZapIcon className="h-5 w-5 text-orange-400" />
              <span className="font-semibold">Streak</span>
            </div>
            <span className="text-xl font-bold">{user.streakDays} days</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Habit Completion</span>
              <span>
                {completedHabits}/{totalHabits}
              </span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
            <div className="text-xs text-blue-200">Longest streak: {longestStreak} days</div>
          </div>
        </div>
      </div>
    </div>
  );
}
