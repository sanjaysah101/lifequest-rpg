"use client";

import { Button } from "@/components/ui/button";
import { Reward } from "@/lib/models";

import { useGame } from "../contexts/GameContext";

interface RewardCardProps {
  reward: Reward;
  userPoints: number;
}

export default function RewardCard({ reward, userPoints }: RewardCardProps) {
  const { redeemReward } = useGame();

  return (
    <div key={reward.id} className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
      <div className="mb-2 flex items-center justify-between">
        <span className="rounded-full bg-blue-500/20 px-2 py-1 text-xs">{reward.category}</span>
        <span className="font-bold text-yellow-300">{reward.cost} pts</span>
      </div>
      <h3 className="mb-1 text-xl font-bold">{reward.name}</h3>
      <p className="mb-4 text-sm text-blue-200">{reward.description}</p>
      <Button
        className={`w-full rounded-lg py-2 text-center ${
          userPoints >= reward.cost ? "bg-green-500 hover:bg-green-600" : "cursor-not-allowed bg-gray-500"
        }`}
        disabled={userPoints < reward.cost}
        onClick={() => userPoints >= reward.cost && redeemReward(reward.id)}
      >
        {userPoints >= reward.cost ? "Redeem Reward" : "Not Enough Points"}
      </Button>
    </div>
  );
}
