import { defaultAchievements, defaultGameState, defaultHabits, defaultRewards, defaultUser } from "@/lib/defaultData";
import { saveAchievements, saveGameState, saveHabits, saveRewards, saveUser } from "@/lib/storage";

export function initializeDefaults() {
  saveUser(defaultUser);
  saveHabits(defaultHabits);
  saveRewards(defaultRewards);
  saveGameState(defaultGameState);
  saveAchievements(defaultAchievements);
}
