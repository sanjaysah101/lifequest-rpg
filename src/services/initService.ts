import {
  defaultAchievements,
  defaultGameState,
  defaultHabits,
  defaultRewards,
  defaultUser,
  defaultWorldData,
} from "@/lib/defaultData";
import { saveAchievements, saveGameState, saveHabits, saveRewards, saveUser, saveWorldData } from "@/lib/storage";

export function initializeDefaults() {
  saveUser(defaultUser);
  saveHabits(defaultHabits);
  saveRewards(defaultRewards);
  saveGameState(defaultGameState);
  saveAchievements(defaultAchievements);
  saveWorldData(defaultWorldData);
}
