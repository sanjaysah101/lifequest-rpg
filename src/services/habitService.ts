import { Habit } from "@/lib/models";
import { loadHabits, saveHabits } from "@/lib/storage";

export function getHabits(): Habit[] | null {
  return loadHabits();
}

export function addHabit(habit: Habit) {
  const habits = loadHabits();
  if (!habits) return;

  habits.push(habit);
  saveHabits(habits);
}

export function completeHabit(habitId: string) {
  const habits = loadHabits();
  if (!habits) return;

  const habit = habits.find((h) => h.id === habitId);
  if (!habit) return;

  habit.streak += 1;
  habit.completedDates.push(new Date().toISOString());
  saveHabits(habits);
}
