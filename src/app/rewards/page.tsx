"use client";

import { useState } from "react";

import AddRewardModal from "@/components/AddRewardModal";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/AppContext";

export default function RewardsPage() {
  const { user, rewards, redeemReward } = useAppContext();
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filter rewards by category if needed
  const filteredRewards =
    selectedCategory === "All" ? rewards : rewards.filter((reward) => reward.category === selectedCategory);

  // Get unique categories from rewards
  const categories = ["All", ...Array.from(new Set(rewards.map((reward) => reward.category)))];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <Header />

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
              <div key={reward.id} className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
                <div className="mb-2 flex items-center justify-between">
                  <span className="rounded-full bg-blue-500/20 px-2 py-1 text-xs">{reward.category}</span>
                  <span className="font-bold text-yellow-300">{reward.cost} pts</span>
                </div>
                <h3 className="mb-1 text-xl font-bold">{reward.name}</h3>
                <p className="mb-4 text-sm text-blue-200">{reward.description}</p>
                <Button
                  className={`w-full rounded-lg py-2 text-center ${
                    user.points >= reward.cost ? "bg-green-500 hover:bg-green-600" : "cursor-not-allowed bg-gray-500"
                  }`}
                  disabled={user.points < reward.cost}
                  onClick={() => user.points >= reward.cost && redeemReward(reward.id)}
                >
                  {user.points >= reward.cost ? "Redeem Reward" : "Not Enough Points"}
                </Button>
              </div>
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
    </div>
  );
}
