"use client";

import { InfoIcon } from "lucide-react";

import { useGame } from "../contexts/GameContext";
import { defaultUser } from "../lib/defaultData";

interface BonusFeatureProps {
  title: string;
  description: string;
  isActive: boolean;
  value: string;
  icon: React.ReactNode;
}

const BonusFeature = ({ title, description, isActive, value, icon }: BonusFeatureProps) => (
  <div className={`rounded-lg p-4 ${isActive ? "bg-blue-900/50" : "bg-gray-800/30"}`}>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="font-bold">{title}</h3>
      </div>
      <div
        className={`rounded-full px-2 py-1 text-xs ${
          isActive ? "bg-green-500/20 text-green-300" : "bg-gray-500/20 text-gray-300"
        }`}
      >
        {isActive ? "Active" : "Inactive"}
      </div>
    </div>
    <p className="mt-2 text-sm text-blue-200">{description}</p>
    {isActive && <p className="mt-2 font-semibold text-blue-300">{value}</p>}
  </div>
);

export default function BonusFeaturesDashboard() {
  const { user, habits } = useGame();
  if (!user || !habits) return null;

  const totalHabits = habits.length;
  const completedHabits = habits.filter((habit) => habit.completedDates.length > 0).length;
  const consistentHabits = habits.filter((habit) => habit.streak >= 3).length;

  const completionRatio = totalHabits ? completedHabits / totalHabits : 0;
  const consistencyRatio = totalHabits ? consistentHabits / totalHabits : 0;

  const goalGradientMultiplier = completionRatio > 0.75 ? 2 : completionRatio > 0.5 ? 1.5 : 1;
  const progressiveLoadMultiplier = user.progressiveLoad
    ? user.progressiveLoad.reward
    : Math.min(2, 1 + consistencyRatio);

  const hasCompletedWizard = user.preferences ? user.name !== defaultUser.name : false;

  const hour = new Date().getHours();
  const fallbackOptimalTime = (hour >= 5 && hour < 9) || (hour >= 19 && hour < 22);
  const fallbackTimeBonus = hour >= 5 && hour < 9 ? 0.25 : hour >= 19 && hour < 22 ? 0.15 : 0;

  const personalizedTimeBonus = user.timeContext?.optimizedHours?.find(
    (window) => hour >= window.start && hour < window.end
  );

  const isOptimalTime = Boolean(personalizedTimeBonus || fallbackOptimalTime);
  const timeBonus = personalizedTimeBonus?.bonus ?? (fallbackOptimalTime ? fallbackTimeBonus : 0);

  const chainReactionActive = user.chainReaction?.count > 0;
  const chainBonus = chainReactionActive ? Math.min(0.5, user.chainReaction.count * 0.1) : 0;

  const bonusFeatures: BonusFeatureProps[] = [
    {
      title: "Goal Gradient",
      description: "Points scale with your progress on habits",
      isActive: goalGradientMultiplier > 1,
      value: `${((goalGradientMultiplier - 1) * 100).toFixed(0)}% bonus (${Math.floor(completionRatio * 100)}% completion)`,
      icon: <IconBadge color="green" label="G" />,
    },
    {
      title: "Progressive Load",
      description: "Points adapt as you improve and maintain streaks",
      isActive: progressiveLoadMultiplier > 1,
      value: user.progressiveLoad
        ? `${((progressiveLoadMultiplier - 1) * 100).toFixed(0)}% bonus (Personalized settings)`
        : `${((progressiveLoadMultiplier - 1) * 100).toFixed(0)}% bonus (Based on habit consistency)`,
      icon: <IconBadge color="orange" label="P" />,
    },
    {
      title: "Time Context",
      description: "Bonus for activities during optimal times",
      isActive: isOptimalTime,
      value: isOptimalTime
        ? personalizedTimeBonus
          ? `${(timeBonus * 100).toFixed(0)}% bonus (Personalized schedule)`
          : `${(timeBonus * 100).toFixed(0)}% bonus (${hour < 12 ? "Morning" : "Evening"} bonus)`
        : "Not in optimal time window",
      icon: <IconBadge color="blue" label="T" />,
    },
    {
      title: "Chain Reaction",
      description: "Link activities for compounding bonuses",
      isActive: chainReactionActive,
      value: chainReactionActive
        ? `${(chainBonus * 100).toFixed(0)}% bonus (${user.chainReaction.count}x chain)`
        : "No active chain",
      icon: <IconBadge color="red" label="C" />,
    },
    {
      title: "Know Thyself",
      description: "Smart setup that calibrates your personal economy",
      isActive: true,
      value: "Personalized habit categories and reward system",
      icon: <IconBadge color="purple" label="K" />,
    },
  ];

  return (
    <div className="rounded-lg border border-blue-800 bg-blue-950/30 p-6">
      <Header hasCompletedWizard={hasCompletedWizard} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {bonusFeatures.map((feature) => (
          <BonusFeature key={feature.title} {...feature} />
        ))}
      </div>
    </div>
  );
}

const IconBadge = ({ color, label }: { color: string; label: string }) => (
  <div className={`flex h-6 w-6 items-center justify-center rounded-full bg-${color}-500/20 text-${color}-400`}>
    {label}
  </div>
);

const Header = ({ hasCompletedWizard }: { hasCompletedWizard: boolean }) => (
  <>
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
          tailored to your schedule and preferences.
        </p>
      </div>
    )}
  </>
);
