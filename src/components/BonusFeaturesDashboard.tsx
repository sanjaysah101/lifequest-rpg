"use client";

import { InfoIcon } from "lucide-react";

import { useAppContext } from "@/contexts/AppContext";

interface BonusFeatureProps {
  title: string;
  description: string;
  isActive: boolean;
  value: string;
  icon: React.ReactNode;
}

const BonusFeature = ({ title, description, isActive, value, icon }: BonusFeatureProps) => {
  return (
    <div className={`rounded-lg p-4 ${isActive ? "bg-blue-900/50" : "bg-gray-800/30"}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-bold">{title}</h3>
        </div>
        <div
          className={`rounded-full px-2 py-1 text-xs ${isActive ? "bg-green-500/20 text-green-300" : "bg-gray-500/20 text-gray-300"}`}
        >
          {isActive ? "Active" : "Inactive"}
        </div>
      </div>
      <p className="mt-2 text-sm text-blue-200">{description}</p>
      {isActive && <p className="mt-2 font-semibold text-blue-300">{value}</p>}
    </div>
  );
};

export default function BonusFeaturesDashboard() {
  const { user, habits } = useAppContext();

  // Calculate completion metrics for Goal Gradient
  const completedHabitsCount = habits.reduce((count, habit) => count + (habit.completedDates.length > 0 ? 1 : 0), 0);
  const totalHabits = habits.length;
  const completionRatio = totalHabits > 0 ? completedHabitsCount / totalHabits : 0;
  const goalGradientMultiplier = completionRatio > 0.75 ? 2 : completionRatio > 0.5 ? 1.5 : 1;

  // Calculate Progressive Load using personalized settings if available
  let progressiveLoadMultiplier = 1.0;

  if (user.progressiveLoad) {
    progressiveLoadMultiplier = user.progressiveLoad.reward;
  } else {
    // Fallback to default calculation
    const consistentHabits = habits.filter((habit) => habit.streak >= 3).length;
    const consistencyRatio = totalHabits > 0 ? consistentHabits / totalHabits : 0;
    progressiveLoadMultiplier = Math.min(2, 1 + consistencyRatio * 1.0);
  }

  // Check if user has completed the personalization wizard
  const hasCompletedWizard = user.preferences && user.preferences.name !== "Adventurer";

  // Calculate Time Context bonus based on user's personalized settings
  const hour = new Date().getHours();
  let isOptimalTime = false;
  let timeBonus = 0;

  if (user.timeContext && user.timeContext.optimizedHours && user.timeContext.optimizedHours.length > 0) {
    // Check if current hour falls within any optimized time windows
    for (const timeWindow of user.timeContext.optimizedHours) {
      if (hour >= timeWindow.start && hour < timeWindow.end) {
        isOptimalTime = true;
        timeBonus = timeWindow.bonus;
        break;
      }
    }
  } else {
    // Fallback to default time windows
    isOptimalTime = (hour >= 5 && hour < 9) || (hour >= 19 && hour < 22);
    timeBonus = hour >= 5 && hour < 9 ? 0.25 : hour >= 19 && hour < 22 ? 0.15 : 0;
  }

  // Chain Reaction status
  const chainReactionActive = user.chainReaction && user.chainReaction.count > 0;
  const chainBonus = chainReactionActive ? Math.min(0.5, user.chainReaction.count * 0.1) : 0;

  return (
    <div className="rounded-lg border border-blue-800 bg-blue-950/30 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Bonus Features</h2>
        <div className="flex items-center gap-1 rounded-full bg-blue-900/50 px-3 py-1 text-xs">
          <InfoIcon className="h-3 w-3" />
          <span>All 5 bonus tracks implemented</span>
        </div>
      </div>

      {!hasCompletedWizard && (
        <div className="mb-4 rounded-lg border border-yellow-500 bg-yellow-900/20 p-3 text-yellow-200">
          <p className="text-sm">
            <span className="font-bold">Tip:</span> Personalize your experience to unlock optimized bonus features
            tailored to your schedule and preferences. Click "Personalize Your Experience" above.
          </p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <BonusFeature
          title="Goal Gradient"
          description="Points scale with your progress on habits"
          isActive={goalGradientMultiplier > 1}
          value={`${((goalGradientMultiplier - 1) * 100).toFixed(0)}% bonus (${Math.floor(completionRatio * 100)}% completion)`}
          icon={
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/20 text-green-400">
              G
            </div>
          }
        />

        <BonusFeature
          title="Progressive Load"
          description="Points adapt as you improve and maintain streaks"
          isActive={progressiveLoadMultiplier > 1}
          value={
            user.progressiveLoad
              ? `${((progressiveLoadMultiplier - 1) * 100).toFixed(0)}% bonus (Personalized settings)`
              : `${((progressiveLoadMultiplier - 1) * 100).toFixed(0)}% bonus (Based on habit consistency)`
          }
          icon={
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500/20 text-orange-400">
              P
            </div>
          }
        />

        <BonusFeature
          title="Time Context"
          description="Bonus for activities during optimal times"
          isActive={isOptimalTime}
          value={
            isOptimalTime
              ? user.timeContext && user.timeContext.optimizedHours
                ? `${(timeBonus * 100).toFixed(0)}% bonus (Personalized schedule)`
                : `${(timeBonus * 100).toFixed(0)}% bonus (${hour < 12 ? "Morning" : "Evening"} bonus)`
              : "Not in optimal time window"
          }
          icon={
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">T</div>
          }
        />

        <BonusFeature
          title="Chain Reaction"
          description="Link activities for compounding bonuses"
          isActive={chainReactionActive}
          value={
            chainReactionActive
              ? `${(chainBonus * 100).toFixed(0)}% bonus (${user.chainReaction.count}x chain)`
              : "No active chain"
          }
          icon={
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20 text-red-400">C</div>
          }
        />

        <BonusFeature
          title="Know Thyself"
          description="Smart setup that calibrates your personal economy"
          isActive={true}
          value="Personalized habit categories and reward system"
          icon={
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/20 text-purple-400">
              K
            </div>
          }
        />
      </div>
    </div>
  );
}
