"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

import { useGame } from "../contexts/GameContext";

export default function HomePage() {
  const { user, isLoading } = useGame();

  if (isLoading) return <div>Loading...</div>;

  if (!user) return <div>User not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <main className="flex flex-col items-center justify-center text-center">
          <h1 className="mb-6 text-5xl font-bold">Welcome to LifeQuest RPG</h1>
          <p className="mb-8 max-w-2xl text-xl">
            Transform your daily habits into an epic adventure. Complete quests, earn rewards, and level up your real
            life!
          </p>

          <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <FeatureCard
              title="Build Habits"
              description="Create daily habits that transform into quests in your adventure."
            />
            <FeatureCard
              title="Explore Worlds"
              description="Journey through different realms, each with unique challenges and rewards."
            />
            <FeatureCard title="Earn Rewards" description="Claim real-life rewards for your in-game achievements." />
          </div>

          <div className="flex gap-4">
            {user.level > 1 ? (
              <Link href="/adventure">
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  Continue Adventure
                </Button>
              </Link>
            ) : (
              <Link href="/dashboard">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Start Your Quest
                </Button>
              </Link>
            )}

            <Link href="/game">
              <Button size="lg" variant="outline">
                Try Mini-Game
              </Button>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
      <h2 className="mb-4 text-2xl font-bold">{title}</h2>
      <p className="mb-4">{description}</p>
    </div>
  );
}
