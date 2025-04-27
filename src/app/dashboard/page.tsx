"use client";

import Link from "next/link";
import { useState } from "react";

import BonusFeaturesDashboard from "@/components/BonusFeaturesDashboard";
import GameStats from "@/components/GameStats";
import Header from "@/components/Header";
import KnowThyselfWizard from "@/components/KnowThyselfWizard";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/AppContext";

import ProgressiveLoadDetails from "../../components/ProgressiveLoadDetails";
import TimeContextDisplay from "../../components/TimeContextDisplay";

export default function DashboardPage() {
  const { user, habits, rewards } = useAppContext();
  const [showWizard, setShowWizard] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <Header />

        <main className="space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Welcome to Your LifeQuest Dashboard</h1>
            <p className="mt-2 text-blue-200">Your personal economy system for better habits and rewards</p>
            <div className="mt-4">
              <Button onClick={() => setShowWizard(true)} className="bg-purple-600 hover:bg-purple-700">
                Personalize Your Experience
              </Button>
            </div>
          </div>
          {/* Know Thyself Wizard */}
          <KnowThyselfWizard isOpen={showWizard} onClose={() => setShowWizard(false)} />
          <GameStats />
          <BonusFeaturesDashboard />
          <div className="grid gap-6 md:grid-cols-2">
            <ProgressiveLoadDetails />
            <TimeContextDisplay />
            <div className="rounded-lg border border-blue-800 bg-blue-950/30 p-6">
              <h2 className="mb-4 text-xl font-bold">Recent Habits</h2>
              {habits.length > 0 ? (
                <div className="space-y-3">
                  {habits.slice(0, 3).map((habit) => (
                    <div key={habit.id} className="rounded-lg bg-blue-900/30 p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{habit.name}</h3>
                        <span className="rounded-full bg-blue-500/20 px-2 py-1 text-xs">{habit.category}</span>
                      </div>
                      <p className="mt-1 text-sm text-blue-200">{habit.description}</p>
                      <div className="mt-2 flex items-center justify-between text-sm">
                        <span>{habit.points} points</span>
                        <span>Streak: {habit.streak} days</span>
                      </div>
                    </div>
                  ))}
                  <div className="text-center">
                    <Link href="/habits">
                      <Button variant="outline" size="sm">
                        View All Habits
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="mb-4 text-blue-200">No habits created yet</p>
                  <Link href="/habits">
                    <Button>Create Your First Habit</Button>
                  </Link>
                </div>
              )}
            </div>

            <div className="rounded-lg border border-blue-800 bg-blue-950/30 p-6">
              <h2 className="mb-4 text-xl font-bold">Available Rewards</h2>
              {rewards.length > 0 ? (
                <div className="space-y-3">
                  {rewards.slice(0, 3).map((reward) => (
                    <div key={reward.id} className="rounded-lg bg-blue-900/30 p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{reward.name}</h3>
                        <span className="font-bold text-yellow-300">{reward.cost} pts</span>
                      </div>
                      <p className="mt-1 text-sm text-blue-200">{reward.description}</p>
                      <div className="mt-2 text-right">
                        <span className="rounded-full bg-blue-500/20 px-2 py-1 text-xs">{reward.category}</span>
                      </div>
                    </div>
                  ))}
                  <div className="text-center">
                    <Link href="/rewards">
                      <Button variant="outline" size="sm">
                        View All Rewards
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="mb-4 text-blue-200">No rewards created yet</p>
                  <Link href="/rewards">
                    <Button>Create Your First Reward</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-blue-800 bg-blue-950/30 p-6">
              <h2 className="mb-4 text-xl font-bold">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <Link href="/habits">
                  <Button className="w-full bg-green-600 hover:bg-green-700">Track Habits</Button>
                </Link>
                <Link href="/rewards">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Redeem Rewards</Button>
                </Link>
                <Link href="/adventure">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">Go on Adventure</Button>
                </Link>
                <Link href="/game">
                  <Button className="w-full bg-red-600 hover:bg-red-700">Play Mini-Game</Button>
                </Link>
              </div>
            </div>

            <div className="rounded-lg border border-blue-800 bg-blue-950/30 p-6">
              <h2 className="mb-4 text-xl font-bold">Hackathon Features</h2>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs">✓</div>
                  <span>Good habits earn points</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs">✓</div>
                  <span>Points can be spent on rewards</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs">✓</div>
                  <span>System encourages sustainable behavior change</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs">✓</div>
                  <span>All 5 bonus tracks implemented</span>
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
