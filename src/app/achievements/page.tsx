"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import { useGame } from "../../contexts/GameContext";

export default function AchievementsPage() {
  const { achievements } = useGame();
  const [selectedCategory, setSelectedCategory] = useState("All");

  if (!achievements) return null;

  // Filter achievements by category
  const filteredAchievements =
    selectedCategory === "All"
      ? achievements
      : achievements.filter((a) => a.condition.type === selectedCategory.toLowerCase());

  // Calculate completion percentage
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const completionPercentage = (unlockedCount / achievements.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <main>
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Achievements</h1>
            <p className="mt-2 text-blue-200">
              You&apos;ve unlocked {unlockedCount} of {achievements.length} achievements (
              {Math.floor(completionPercentage)}%)
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-6 flex flex-wrap gap-2">
            {["All", "Habits", "Rewards", "System", "Special"].map((category) => (
              <Button
                key={category}
                variant="ghost"
                className={`rounded-full px-4 py-1 text-sm ${
                  category === selectedCategory ? "bg-blue-500 hover:bg-blue-600" : "bg-white/10 hover:bg-white/20"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`rounded-xl p-6 backdrop-blur-sm ${
                  achievement.unlocked
                    ? "border border-green-500/30 bg-green-900/20"
                    : "border border-white/10 bg-white/10"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{achievement.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold">{achievement.title}</h3>
                      <p className="text-sm text-blue-200">{achievement.description}</p>
                    </div>
                  </div>
                  {achievement.unlocked && <div className="rounded-full bg-green-600 px-2 py-1 text-xs">Unlocked</div>}
                </div>

                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-xs">
                    <span>Progress</span>
                    <span>
                      {achievement.progress} / {achievement.condition.threshold}
                    </span>
                  </div>
                  <Progress value={(achievement.progress / achievement.condition.threshold) * 100} className="h-2" />
                </div>

                {achievement.unlocked && achievement.unlockedAt && (
                  <div className="mt-3 text-xs text-blue-200">
                    Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </div>
                )}

                {!achievement.unlocked && (
                  <div className="mt-3 text-xs text-blue-200">
                    {achievement.condition.threshold - achievement.progress} more to unlock
                  </div>
                )}
              </div>
            ))}

            {filteredAchievements.length === 0 && (
              <div className="col-span-full py-8 text-center">
                <p className="text-xl text-blue-200">No achievements in this category</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
