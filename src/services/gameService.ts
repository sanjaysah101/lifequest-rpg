import { GameState } from "@/lib/models";
import { loadGameState, saveGameState } from "@/lib/storage";

export function getGameState(): GameState | null {
  return loadGameState();
}

export function discoverWorld(worldName: string) {
  const state = loadGameState();
  if (!state) return;

  if (!state.worldsDiscovered.includes(worldName)) {
    state.worldsDiscovered.push(worldName);
  }

  saveGameState(state);
}
