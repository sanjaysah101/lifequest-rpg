import { Habit, Reward, User } from "./models";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  category: "habits" | "rewards" | "system" | "special";
  unlockedAt?: string;
}

export const defaultAchievements: Achievement[] = [
  {
    id: "habit-starter",
    name: "Habit Starter",
    description: "Create your first habit",
    icon: "🌱",
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    category: "habits",
  },
  {
    id: "habit-master",
    name: "Habit Master",
    description: "Create 5 different habits",
    icon: "🌟",
    unlocked: false,
    progress: 0,
    maxProgress: 5,
    category: "habits",
  },
  {
    id: "streak-warrior",
    name: "Streak Warrior",
    description: "Maintain a 7-day streak on any habit",
    icon: "🔥",
    unlocked: false,
    progress: 0,
    maxProgress: 7,
    category: "habits",
  },
  {
    id: "reward-creator",
    name: "Reward Creator",
    description: "Create your first custom reward",
    icon: "🎁",
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    category: "rewards",
  },
  {
    id: "reward-redeemer",
    name: "Reward Redeemer",
    description: "Redeem 3 rewards",
    icon: "💎",
    unlocked: false,
    progress: 0,
    maxProgress: 3,
    category: "rewards",
  },
  {
    id: "level-up",
    name: "Level Up",
    description: "Reach level 5",
    icon: "📈",
    unlocked: false,
    progress: 1,
    maxProgress: 5,
    category: "system",
  },
  {
    id: "wizard-graduate",
    name: "Wizard Graduate",
    description: "Complete the Know Thyself Wizard",
    icon: "🧙",
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    category: "special",
  },
  {
    id: "chain-master",
    name: "Chain Master",
    description: "Achieve a 5x chain reaction",
    icon: "⚡",
    unlocked: false,
    progress: 0,
    maxProgress: 5,
    category: "special",
  },
];

export function checkAchievements(user: User, habits: Habit[], rewards: Reward[]): Achievement[] {
  // Get current achievements or use defaults
  const achievements = JSON.parse(
    localStorage.getItem("lifequest_achievements") || JSON.stringify(defaultAchievements)
  );

  let updated = false;

  // Check each achievement
  achievements.forEach((achievement: Achievement) => {
    if (achievement.unlocked) return;

    let newProgress = 0;

    switch (achievement.id) {
      case "habit-starter":
        newProgress = habits.length > 0 ? 1 : 0;
        break;
      case "habit-master":
        newProgress = Math.min(habits.length, 5);
        break;
      case "streak-warrior":
        newProgress = Math.min(Math.max(...habits.map((h) => h.streak), 0), 7);
        break;
      case "reward-creator":
        // Check if user has created any custom rewards (not default)
        newProgress = rewards.some((r) => !r.id.startsWith("default-")) ? 1 : 0;
        break;
      case "reward-redeemer":
        newProgress = Math.min(
          rewards.reduce((count, r) => count + (r.redeemedDates.length > 0 ? 1 : 0), 0),
          3
        );
        break;
      case "level-up":
        newProgress = Math.min(user.level, 5);
        break;
      case "wizard-graduate":
        newProgress = user.preferences && user.preferences.name !== "Adventurer" ? 1 : 0;
        break;
      case "chain-master":
        newProgress = user.chainReaction ? Math.min(user.chainReaction.count, 5) : 0;
        break;
    }

    // Update progress
    if (newProgress !== achievement.progress) {
      achievement.progress = newProgress;
      updated = true;
    }

    // Check if achievement is now unlocked
    if (achievement.progress >= achievement.maxProgress && !achievement.unlocked) {
      achievement.unlocked = true;
      achievement.unlockedAt = new Date().toISOString();
      updated = true;
    }
  });

  // Save updated achievements
  if (updated) {
    localStorage.setItem("lifequest_achievements", JSON.stringify(achievements));
  }

  return achievements;
}
