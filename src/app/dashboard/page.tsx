"use client";

import Link from "next/link";
import { useState } from "react";

import AddHabitModal from "@/components/AddHabitModal";
import AddRewardModal from "@/components/AddRewardModal";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useAppContext } from "@/contexts/AppContext";

export default function Dashboard() {
  const { user, habits, rewards, completeHabit, redeemReward } = useAppContext();
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);

  // Calculate progress percentage
  const progressPercentage = (user.experience / user.nextLevelAt) * 100;

  // Get today's date in ISO format for checking completed habits
  const today = new Date().toISOString().split("T")[0];

  // Filter habits for today's display (limit to 4)
  const todaysHabits = habits.slice(0, 4).map((habit) => ({
    ...habit,
    completed: habit.completedDates.some((date) => date.startsWith(today)),
  }));

  const chainBonusPercentage = Math.min(50, user.chainReaction.count * 10);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <Header />

        <main className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Character Stats */}
          <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
            <h2 className="mb-4 text-2xl font-bold">Your Character</h2>
            <div className="mb-4 flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-500 text-3xl font-bold">
                {user.level}
              </div>
              <div>
                <p className="text-lg font-semibold">Level {user.level} Adventurer</p>
                <p className="text-sm text-blue-200">
                  {user.experience}/{user.nextLevelAt} XP
                </p>
              </div>
            </div>
            <div className="mb-4">
              <div className="mb-1 flex justify-between text-sm">
                <span>Progress to Level {user.level + 1}</span>
                <span>{progressPercentage.toFixed(0)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
            <div className="flex justify-between border-t border-white/20 pt-4">
              <div>
                <p className="text-sm text-blue-200">Available Points</p>
                <p className="text-2xl font-bold">{user.points} ✨</p>
              </div>
              <div>
                <p className="text-sm text-blue-200">Current Streak</p>
                <p className="text-2xl font-bold">{user.streakDays} days 🔥</p>
              </div>
            </div>

            {/* Chain Reaction Feature */}
            {user.chainReaction.count > 0 && (
              <div className="mt-4 rounded-lg bg-blue-500/20 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">Chain Reaction</p>
                    <p className="text-xs text-blue-200">Complete habits in sequence for bonus points!</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{user.chainReaction.count}x 🔗</p>
                    <p className="text-xs text-green-300">+{chainBonusPercentage}% bonus</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Today's Habits */}
          <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Today&apos;s Habits</h2>
              <Link href="/habits" className="text-sm text-blue-300 hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {todaysHabits.map((habit) => (
                <div key={habit.id} className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={habit.completed}
                      onCheckedChange={() => !habit.completed && completeHabit(habit.id)}
                      disabled={habit.completed}
                    />
                    <span>{habit.name}</span>
                  </div>
                  <span className="rounded-full bg-blue-500/20 px-2 py-1 text-sm">+{habit.points} pts</span>
                </div>
              ))}
              {habits.length === 0 && (
                <p className="text-center text-blue-200">No habits yet. Create your first habit!</p>
              )}
            </div>
            <Button className="mt-4 w-full bg-white/10 hover:bg-white/20" onClick={() => setIsHabitModalOpen(true)}>
              Add New Habit
            </Button>
          </div>

          {/* Available Rewards */}
          <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Rewards Shop</h2>
              <Link href="/rewards" className="text-sm text-blue-300 hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {rewards.slice(0, 3).map((reward) => (
                <div key={reward.id} className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                  <span>{reward.name}</span>
                  <Button
                    className={`rounded-full px-3 py-1 text-sm ${
                      user.points >= reward.cost ? "bg-green-500 hover:bg-green-600" : "cursor-not-allowed bg-gray-500"
                    }`}
                    disabled={user.points < reward.cost}
                    onClick={() => redeemReward(reward.id)}
                  >
                    {reward.cost} pts
                  </Button>
                </div>
              ))}
              {rewards.length === 0 && (
                <p className="text-center text-blue-200">No rewards yet. Create your first reward!</p>
              )}
            </div>
            <Button className="mt-4 w-full bg-white/10 hover:bg-white/20" onClick={() => setIsRewardModalOpen(true)}>
              Create Custom Reward
            </Button>
          </div>
        </main>

        {/* Modals */}
        <AddHabitModal isOpen={isHabitModalOpen} onClose={() => setIsHabitModalOpen(false)} />
        <AddRewardModal isOpen={isRewardModalOpen} onClose={() => setIsRewardModalOpen(false)} />
      </div>
    </div>
  );
}
