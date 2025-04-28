"use client";

import { useEffect, useState } from "react";

import { MapIcon, SparklesIcon, TrophyIcon } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import { useGame } from "../../contexts/GameContext";
import { WorldData } from "../../lib/models";

export default function AdventurePage() {
  const { user, gameState, setGameState, addExperience, worldData, updateCurrentWorld, updateWorldData } = useGame();
  const [showQuest, setShowQuest] = useState(false);
  const [currentQuest, setCurrentQuest] = useState<any>(null);
  const [questCompleted, setQuestCompleted] = useState(false);
  const [questHistory, setQuestHistory] = useState<string[]>(gameState?.questsCompleted || []);
  // const [worldsUnlocked, setWorldsUnlocked] = useState<string[]>(gameState?.worldsDiscovered || ["forest"]);
  const [questAnimation, setQuestAnimation] = useState("");

  // Check for world unlocks when user level changes
  useEffect(() => {
    const checkWorldUnlocks = () => {
      if (!worldData) return;

      worldData.forEach((world) => {
        if (world.isUnlocked) {
          toast(`🌟 New world unlocked: ${world.name}!`, {
            description: "Sunday, December 03, 2023 at 9:00 AM",
          });
        }
      });
    };

    checkWorldUnlocks();
  }, [worldData]);

  // Handle quest completion
  const completeQuest = () => {
    if (!currentQuest || !user || !gameState) return;
    closeQuest();

    // Check if quest already completed
    if (questHistory.includes(currentQuest.id)) {
      toast.warning("You've already completed this quest!");
      return;
    }

    // Calculate bonus points based on streak
    const streakBonus = Math.floor(user.streakDays * 0.1 * currentQuest.points);
    const totalPoints = currentQuest.points + streakBonus;

    // Add experience using the context method
    addExperience(totalPoints);

    // Update quest history
    const newQuestHistory = [...questHistory, currentQuest.id];
    setQuestHistory(newQuestHistory);

    // Show notification
    if (user.experience + totalPoints >= user.nextLevelAt) {
      toast.success(`🎉 Level Up! You are now level ${user.level + 1}!`);
    } else {
      if (streakBonus > 0) {
        toast.success(`✨ Earned ${currentQuest.points} points + ${streakBonus} streak bonus!`);
      } else {
        toast.success(`✨ Earned ${currentQuest.points} points!`);
      }
    }

    setQuestCompleted(true);
    setQuestAnimation("animate-success");
  };

  // Start a new quest
  const startQuest = (quest: any) => {
    setCurrentQuest(quest);
    setShowQuest(true);
    setQuestCompleted(false);
    setQuestAnimation("");
  };

  // Close quest dialog
  const closeQuest = () => {
    setShowQuest(false);
    setCurrentQuest(null);
    setQuestCompleted(false);
  };

  if (!user || !gameState || !worldData) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  const currentWorld = gameState.currentWorld;
  const worldsDiscovered = worldData.reduce((acc: string[], world) => {
    if (world.isUnlocked) {
      acc.push(world.id);
    }
    return acc;
  }, []);

  const handleQuestCompletion = (worldId: string, questId: string) => {
    const updatedWorldData: WorldData[] = worldData.map((world) => {
      if (world.id === worldId) {
        const updateWorld = {
          ...world,
          quests: world.quests.map((quest) => {
            if (quest.id === questId) {
              return {
                ...quest,
                isCompleted: true,
              };
            }
            return quest;
          }),
        };
        updateCurrentWorld(updateWorld);
      }
      return world;
    });

    console.log(updatedWorldData);
    updateWorldData(updatedWorldData);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b ${currentWorld.color} overflow-hidden text-white`}>
      {/* Content overlay */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Player stats */}
        <div className="mb-8 rounded-lg border border-white/10 bg-black/40 p-6 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-blue-400">
                <AvatarFallback className="bg-blue-600 text-2xl font-bold">{user.level}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xl font-bold">Level {user.level} Adventurer</p>
                  {user.streakDays > 0 && (
                    <Badge variant="outline" className="bg-orange-500/20 text-orange-300">
                      {user.streakDays} Day Streak 🔥
                    </Badge>
                  )}
                </div>
                <div className="mt-1 w-64">
                  <div className="mb-1 flex justify-between text-xs">
                    <span>
                      EXP: {user.experience}/{user.nextLevelAt}
                    </span>
                    <span>{Math.floor((user.experience / user.nextLevelAt) * 100)}%</span>
                  </div>
                  <Progress value={(user.experience / user.nextLevelAt) * 100} className="h-2" />
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2">
                <SparklesIcon className="h-5 w-5 text-yellow-300" />
                <p className="text-2xl font-bold text-yellow-300">{user.points}</p>
              </div>
              <p className="text-xs text-blue-200">Available Points</p>
            </div>
          </div>
        </div>

        {/* World information */}
        <div className="mb-8 rounded-lg border border-white/10 bg-black/40 p-6 shadow-lg backdrop-blur-sm transition-all duration-300">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="mb-2 text-3xl font-bold">{currentWorld.name}</h2>
              <p className="mb-4 text-blue-200">{currentWorld.description}</p>
            </div>
            <div className="rounded-lg bg-black/30 p-2">
              <div className="flex items-center gap-2">
                <MapIcon className="h-5 w-5" />
                <span className="text-sm">
                  Worlds Discovered: {worldsDiscovered.length}/{worldData.length}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <TrophyIcon className="h-5 w-5" />
                <span className="text-sm">Quests Completed: {questHistory.length}</span>
              </div>
            </div>
          </div>
          {/* World navigation */}
          <div className="mt-4 flex flex-wrap gap-4">
            {worldData.map((world) => (
              <div key={world.id} className="group relative">
                <Button
                  variant={currentWorld.id === world.id ? "default" : "outline"}
                  onClick={() => updateCurrentWorld(world)}
                  disabled={!world.isUnlocked}
                >
                  {/* {!worldData.includes(key) && ( */}
                  <div className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {world.unlockRequirement}
                  </div>
                  {/* )} */}
                  {world.name}
                </Button>
                {/* {!worldsUnlocked.includes(key) && ( */}
                <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 rounded bg-black/80 px-3 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  Unlocks at level {world.unlockRequirement}
                </div>
                {/* )} */}
              </div>
            ))}
          </div>
        </div>

        {/* Quests */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {currentWorld.quests.map(({ isCompleted, id, description, habitCategory, points, task, title }) => {
            return (
              <div
                role="button"
                key={id}
                className={`rounded-lg border border-white/10 bg-black/40 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 ${
                  isCompleted
                    ? "cursor-not-allowed border-green-500/30 bg-green-900/20 opacity-70"
                    : "cursor-pointer hover:bg-black/50"
                }`}
                onClick={() => !isCompleted && handleQuestCompletion(currentWorld.id, id)}
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;
                  !isCompleted && handleQuestCompletion(currentWorld.id, id);
                }}
                tabIndex={isCompleted ? -1 : 0}
              >
                <div className="flex items-start justify-between">
                  <h3 className="mb-2 text-xl font-bold">{title}</h3>
                  {isCompleted && <Badge className="bg-green-600">Completed</Badge>}
                </div>
                <p className="mb-4 text-blue-200">{description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-blue-900/50">
                    {habitCategory}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <SparklesIcon className="h-4 w-4 text-yellow-300" />
                    <span className="font-bold text-yellow-300">{points}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quest dialog */}
        {showQuest && currentQuest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div
              className={`w-full max-w-md rounded-lg border border-white/20 bg-gradient-to-b from-blue-900 to-purple-900 p-8 shadow-2xl ${questAnimation}`}
            >
              <h3 className="mb-4 text-2xl font-bold">{currentQuest.title}</h3>
              <p className="mb-6 text-blue-200">{currentQuest.description}</p>

              <div className="mb-6 rounded-lg border border-white/10 bg-black/30 p-4">
                <h4 className="mb-2 font-semibold">Your Quest:</h4>
                <p>{currentQuest.task}</p>

                {user.streakDays > 0 && !questCompleted && (
                  <div className="mt-4 rounded border border-orange-500/30 bg-orange-500/20 p-2">
                    <p className="flex items-center gap-1 text-sm">
                      <span>
                        🔥 {user.streakDays} day streak bonus: +
                        {Math.floor(user.streakDays * 0.1 * currentQuest.points)} points
                      </span>
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={closeQuest}>
                  {questCompleted ? "Close" : "Cancel"}
                </Button>
                {!questCompleted ? (
                  <Button onClick={completeQuest} className="bg-green-600 hover:bg-green-700">
                    I&apos;ve Completed This
                  </Button>
                ) : (
                  <div className="flex items-center gap-2 text-green-300">
                    <span>✓ Quest Completed!</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Notification - removed as we're using toast instead */}
      </div>
    </div>
  );
}
