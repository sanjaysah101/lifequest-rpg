"use client";

import { useEffect, useRef, useState } from "react";

import { MapIcon, SparklesIcon, TrophyIcon } from "lucide-react";

import Header from "@/components/Header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAppContext } from "@/contexts/AppContext";

// Worlds data
const worlds = {
  forest: {
    name: "Enchanted Forest",
    description: "A mystical forest filled with ancient wisdom",
    background: "url('/images/forest-bg.jpg')",
    color: "from-green-900 to-emerald-700",
    unlockRequirement: 0, // Level required to unlock
    quests: [
      {
        id: "forest-1",
        title: "Meditation Grove",
        description: "Find inner peace by completing a short meditation",
        task: "Take 3 deep breaths and focus on your breathing for 30 seconds",
        points: 15,
        habitCategory: "Wellness",
      },
      {
        id: "forest-2",
        title: "Knowledge Tree",
        description: "Absorb knowledge from the ancient tree",
        task: "Write down one thing you learned today",
        points: 20,
        habitCategory: "Growth",
      },
    ],
  },
  mountain: {
    name: "Mystic Mountains",
    description: "Challenging peaks that test your resolve",
    background: "url('/images/mountain-bg.jpg')",
    color: "from-slate-800 to-blue-900",
    unlockRequirement: 2, // Level required to unlock
    quests: [
      {
        id: "mountain-1",
        title: "Summit Challenge",
        description: "Reach the peak through perseverance",
        task: "Do 10 push-ups or a 1-minute plank",
        points: 25,
        habitCategory: "Health",
      },
      {
        id: "mountain-2",
        title: "Eagle's Vision",
        description: "Gain clarity from the mountain top",
        task: "Set one clear goal for tomorrow",
        points: 20,
        habitCategory: "Productivity",
      },
    ],
  },
  ocean: {
    name: "Serene Ocean",
    description: "Vast waters of creativity and reflection",
    background: "url('/images/ocean-bg.jpg')",
    color: "from-blue-900 to-cyan-800",
    unlockRequirement: 4, // Level required to unlock
    quests: [
      {
        id: "ocean-1",
        title: "Tide Pools of Creativity",
        description: "Discover creative inspiration in the pools",
        task: "Sketch or write something creative for 5 minutes",
        points: 30,
        habitCategory: "Growth",
      },
      {
        id: "ocean-2",
        title: "Ocean Cleanse",
        description: "Purify your space like the ocean cleanses shores",
        task: "Tidy up your immediate surroundings for 2 minutes",
        points: 15,
        habitCategory: "Productivity",
      },
    ],
  },
};

export default function AdventurePage() {
  const { user, updateUser, updateGameState, gameState } = useAppContext();
  const worldRef = useRef<HTMLDivElement>(null);
  const [currentWorld, setCurrentWorld] = useState(gameState.currentWorld || "forest");
  const [showQuest, setShowQuest] = useState(false);
  const [currentQuest, setCurrentQuest] = useState<any>(null);
  const [questCompleted, setQuestCompleted] = useState(false);
  const [notification, setNotification] = useState("");
  const [questHistory, setQuestHistory] = useState<string[]>(gameState.questsCompleted || []);
  const [worldsUnlocked, setWorldsUnlocked] = useState<string[]>(gameState.worldsDiscovered || ["forest"]);
  const [questAnimation, setQuestAnimation] = useState("");

  // Handle parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!worldRef.current) return;

      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      // Calculate parallax effect
      const moveX = (clientX / innerWidth - 0.5) * 20;
      const moveY = (clientY / innerHeight - 0.5) * 20;

      worldRef.current.style.transform = `translate(${-moveX}px, ${-moveY}px)`;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Check for world unlocks when user level changes
  useEffect(() => {
    const checkWorldUnlocks = () => {
      Object.entries(worlds).forEach(([worldKey, worldData]) => {
        if (!worldsUnlocked.includes(worldKey) && user.level >= worldData.unlockRequirement) {
          const newUnlocked = [...worldsUnlocked, worldKey];
          setWorldsUnlocked(newUnlocked);

          // Update game state
          const updatedGameState = {
            ...gameState,
            worldsDiscovered: newUnlocked,
          };
          updateGameState(updatedGameState);

          // Show notification
          setNotification(`🌟 New world unlocked: ${worldData.name}!`);
          setTimeout(() => setNotification(""), 3000);
        }
      });
    };

    checkWorldUnlocks();
  }, [user.level, worldsUnlocked, gameState, updateGameState]);

  // Handle quest completion
  const completeQuest = () => {
    if (!currentQuest) return;
    closeQuest();

    // Check if quest already completed
    if (questHistory.includes(currentQuest.id)) {
      setNotification("You've already completed this quest!");
      setTimeout(() => setNotification(""), 3000);
      return;
    }

    // Calculate bonus points based on streak
    const streakBonus = Math.floor(user.streakDays * 0.1 * currentQuest.points);
    const totalPoints = currentQuest.points + streakBonus;

    // Update user points
    const updatedUser = {
      ...user,
      points: user.points + totalPoints,
      experience: user.experience + totalPoints,
    };

    // Level up if enough experience
    if (updatedUser.experience >= updatedUser.nextLevelAt) {
      updatedUser.level += 1;
      updatedUser.nextLevelAt = Math.floor(updatedUser.nextLevelAt * 1.5);
      setNotification(`🎉 Level Up! You are now level ${updatedUser.level}!`);
    } else {
      setNotification(
        streakBonus > 0
          ? `✨ Earned ${currentQuest.points} points + ${streakBonus} streak bonus!`
          : `✨ Earned ${currentQuest.points} points!`
      );
    }

    // Update quest history
    const newQuestHistory = [...questHistory, currentQuest.id];
    setQuestHistory(newQuestHistory);

    // Update game state
    const updatedGameState = {
      ...gameState,
      questsCompleted: newQuestHistory,
      currentWorld: currentWorld,
    };

    // Apply updates
    updateUser(updatedUser);
    updateGameState(updatedGameState);
    setQuestCompleted(true);
    setQuestAnimation("animate-success");

    // Clear notification after 3 seconds
    setTimeout(() => {
      setNotification("");
    }, 3000);
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

  // Change world
  const changeWorld = (world: string) => {
    if (!worldsUnlocked.includes(world)) {
      const requiredLevel = worlds[world as keyof typeof worlds].unlockRequirement;
      setNotification(`🔒 This world unlocks at level ${requiredLevel}`);
      setTimeout(() => setNotification(""), 3000);
      return;
    }

    setCurrentWorld(world);
    closeQuest();

    // Update game state with current world
    const updatedGameState = {
      ...gameState,
      currentWorld: world,
    };
    updateGameState(updatedGameState);
  };

  // Check if a quest is completed
  const isQuestCompleted = (questId: string) => {
    return questHistory.includes(questId);
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-b ${worlds[currentWorld as keyof typeof worlds].color} overflow-hidden text-white`}
    >
      {/* World background with parallax effect */}
      <div
        ref={worldRef}
        className="absolute inset-0 -mt-5 -ml-5 h-[calc(100%+40px)] w-[calc(100%+40px)] transition-transform duration-200 ease-out"
        style={{
          backgroundImage: worlds[currentWorld as keyof typeof worlds].background,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Content overlay */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Navigation */}
        <Header />

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
              <h2 className="mb-2 text-3xl font-bold">{worlds[currentWorld as keyof typeof worlds].name}</h2>
              <p className="mb-4 text-blue-200">{worlds[currentWorld as keyof typeof worlds].description}</p>
            </div>
            <div className="rounded-lg bg-black/30 p-2">
              <div className="flex items-center gap-2">
                <MapIcon className="h-5 w-5" />
                <span className="text-sm">Worlds Discovered: {worldsUnlocked.length}/3</span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <TrophyIcon className="h-5 w-5" />
                <span className="text-sm">Quests Completed: {questHistory.length}</span>
              </div>
            </div>
          </div>

          {/* World navigation */}
          <div className="mt-4 flex flex-wrap gap-4">
            {Object.entries(worlds).map(([key, world]) => (
              <div key={key} className="group relative">
                <Button
                  variant={currentWorld === key ? "default" : "outline"}
                  onClick={() => changeWorld(key)}
                  disabled={!worldsUnlocked.includes(key)}
                  className={`relative ${!worldsUnlocked.includes(key) ? "opacity-50" : ""}`}
                >
                  {!worldsUnlocked.includes(key) && (
                    <div className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                      {world.unlockRequirement}
                    </div>
                  )}
                  {world.name}
                </Button>
                {!worldsUnlocked.includes(key) && (
                  <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 rounded bg-black/80 px-3 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    Unlocks at level {world.unlockRequirement}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quests */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {worlds[currentWorld as keyof typeof worlds].quests.map((quest) => {
            const completed = isQuestCompleted(quest.id);
            return (
              <div
                role="button"
                key={quest.id}
                className={`rounded-lg border border-white/10 bg-black/40 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 ${completed ? "border-green-500/30 bg-green-900/20" : "cursor-pointer hover:bg-black/50"}`}
                onClick={() => !completed && startQuest(quest)}
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;

                  !completed && startQuest(quest);
                }}
                tabIndex={0}
              >
                <div className="flex items-start justify-between">
                  <h3 className="mb-2 text-xl font-bold">{quest.title}</h3>
                  {completed && <Badge className="bg-green-600">Completed</Badge>}
                </div>
                <p className="mb-4 text-blue-200">{quest.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-blue-900/50">
                    {quest.habitCategory}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <SparklesIcon className="h-4 w-4 text-yellow-300" />
                    <span className="font-bold text-yellow-300">{quest.points}</span>
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

        {/* Notification */}
        {notification && (
          <div className="fixed right-8 bottom-8 animate-bounce rounded-lg border border-white/20 bg-gradient-to-r from-green-600 to-blue-600 px-6 py-3 text-white shadow-lg backdrop-blur-sm">
            {notification}
          </div>
        )}
      </div>
    </div>
  );
}
