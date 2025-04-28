import { Progress } from "@/components/ui/progress";

import { useGame } from "../contexts/GameContext";

export default function ProgressiveLoadDetails() {
  const { user, habits } = useGame();

  if (!user || !habits) return null;

  // Calculate consistency metrics
  const consistentHabits = habits.filter((habit) => habit.streak >= 3).length;
  const totalHabits = habits.length;
  const consistencyRatio = totalHabits > 0 ? consistentHabits / totalHabits : 0;

  // Get progressive load values
  const progressiveLoad = user.progressiveLoad || {
    difficulty: Math.min(1.5, 1 + consistencyRatio * 0.5),
    reward: Math.min(2, 1 + consistencyRatio * 1.0),
  };

  // Calculate next threshold
  const nextDifficultyThreshold = Math.min(2.0, progressiveLoad.difficulty + 0.1);
  const nextRewardThreshold = Math.min(2.5, progressiveLoad.reward + 0.2);

  // Calculate progress to next threshold
  const difficultyProgress = ((progressiveLoad.difficulty - 1) / (nextDifficultyThreshold - 1)) * 100;
  const rewardProgress = ((progressiveLoad.reward - 1) / (nextRewardThreshold - 1)) * 100;

  return (
    <div className="rounded-lg border border-blue-800 bg-blue-950/30 p-6">
      <h3 className="mb-3 text-lg font-semibold">Progressive Load System</h3>

      <div className="space-y-4">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-sm">Challenge Difficulty</span>
            <span className="text-sm font-medium">{progressiveLoad.difficulty.toFixed(1)}x</span>
          </div>
          <Progress value={difficultyProgress} className="h-2" />
          <p className="mt-1 text-xs text-blue-200">
            Next threshold: {nextDifficultyThreshold.toFixed(1)}x at higher consistency
          </p>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-sm">Reward Multiplier</span>
            <span className="text-sm font-medium">{progressiveLoad.reward.toFixed(1)}x</span>
          </div>
          <Progress value={rewardProgress} className="h-2" />
          <p className="mt-1 text-xs text-blue-200">
            Next threshold: {nextRewardThreshold.toFixed(1)}x at higher consistency
          </p>
        </div>

        <div className="rounded border border-blue-700 bg-blue-950/50 p-2 text-xs">
          <p>
            <span className="font-semibold">How it works:</span> Your system adapts as you maintain habit streaks.
            Currently {consistentHabits} of {totalHabits} habits have streaks of 3+ days.
          </p>
        </div>
      </div>
    </div>
  );
}
