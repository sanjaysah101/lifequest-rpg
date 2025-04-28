"use client";

import { useState } from "react";

import AddRewardModal from "@/components/AddRewardModal";
import RewardCard from "@/components/RewardCard";
import { Button } from "@/components/ui/button";

import { useGame } from "../../contexts/GameContext";

export default function RewardsPage() {
  const { user, rewards } = useGame();
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  if (!user || !rewards) {
    return <div>Loading...</div>;
  }

  // Filter rewards by category if needed
  const filteredRewards =
    selectedCategory === "All" ? rewards : rewards.filter((reward) => reward.category === selectedCategory);

  // Get unique categories from rewards
  const categories = ["All", ...Array.from(new Set(rewards.map((reward) => reward.category)))];

  return (
    <div className="container mx-auto px-4 py-8">
      <main>
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">Rewards Shop</h1>
            <p className="text-blue-200">
              You have <span className="font-bold text-blue-300">{user.points} points</span> to spend
            </p>
          </div>
          <Button
            className="rounded-full bg-blue-500 px-4 py-2 font-medium hover:bg-blue-600"
            onClick={() => setIsRewardModalOpen(true)}
          >
            Create Custom Reward
          </Button>
        </div>

        {/* Category Filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((category) => (
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

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredRewards.map((reward) => (
            <RewardCard key={reward.id} reward={reward} userPoints={user.points} />
          ))}
          {filteredRewards.length === 0 && (
            <div className="col-span-full py-8 text-center">
              <p className="mb-4 text-xl text-blue-200">No rewards found in this category</p>
              <Button onClick={() => setIsRewardModalOpen(true)}>Create your first reward</Button>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      <AddRewardModal isOpen={isRewardModalOpen} onClose={() => setIsRewardModalOpen(false)} />
    </div>
  );
}
