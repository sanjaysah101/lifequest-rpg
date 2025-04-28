import { Achievement, Habit, Reward, User } from "@/lib/models";
import { loadAchievements, saveAchievements } from "@/lib/storage";

export const checkAchievements = (user: User, habits: Habit[], rewards: Reward[]) => {
  const achievements = loadAchievements();

  if (!achievements) return;

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
        newProgress = user.preferences && user.name !== "Adventurer" ? 1 : 0;
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
    if (achievement.progress >= achievement.condition.threshold && !achievement.unlocked) {
      achievement.unlocked = true;
      achievement.unlockedAt = new Date().toISOString();
      updated = true;
    }
  });

  if (updated) {
    saveAchievements(achievements);
  }
};
