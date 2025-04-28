import { User } from "@/lib/models";
import { loadUser, saveUser } from "@/lib/storage";

export function getUser(): User | null {
  return loadUser();
}

export function updateUser(data: Partial<User>) {
  const existingUser = loadUser();
  if (!existingUser) return;

  const updatedUser = { ...existingUser, ...data };
  saveUser(updatedUser);
}

export function addExperience(points: number) {
  const user = loadUser();
  if (!user) return;

  user.experience += points;

  if (user.experience >= user.nextLevelAt) {
    user.level += 1;
    user.experience = user.experience - user.nextLevelAt;
    user.nextLevelAt = Math.round(user.nextLevelAt * 1.5);
  }

  saveUser(user);
}

export function incrementStreak() {
  const user = loadUser();
  if (!user) return;

  user.streakDays += 1;
  saveUser(user);
}
