import { Reward } from "@/lib/models";
import { loadRewards, saveRewards } from "@/lib/storage";

export function redeemReward(rewardId: Reward["id"]) {
  const rewards = loadRewards();
  if (!rewards) return;

  const reward = rewards.find((r) => r.id === rewardId);
  if (!reward) return;

  reward.redeemedDates.push(new Date().toISOString());
  saveRewards(rewards);
}
