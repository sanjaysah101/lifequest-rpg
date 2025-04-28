import { useGame } from "@/contexts/GameContext";

const STREAK_THRESHOLD = 7; // Streak threshold for achievements in days

export function useHabitCompletion() {
  const { user, habits, completeHabit, addExperience, incrementStreak, unlockAchievement, discoverWorld, reload } =
    useGame();

  function complete(habitId: string) {
    completeHabit(habitId);
    addExperience(10); // or dynamic points based on habit!
    incrementStreak();

    // Example: Unlock an achievement after STREAK_THRESHOLD streak
    if (user && user.streakDays === STREAK_THRESHOLD) {
      unlockAchievement("streak-7");
    }

    // Example: Discover new world after 10 habits
    if (habits && habits.length >= 10) {
      discoverWorld("mountains");
    }

    reload();
  }

  return { complete };
}
