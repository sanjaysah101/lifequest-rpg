"use client";

import { useState } from "react";

import AddHabitModal from "@/components/AddHabitModal";
// import HabitCalendar from "@/components/HabitCalendar";
import { Button } from "@/components/ui/button";

import { useGame } from "../../contexts/GameContext";

export default function HabitsPage() {
  const { habits, completeHabit } = useGame();
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  if (!habits) return null;

  // Get today's date in ISO format for checking completed habits
  const today = new Date().toISOString().split("T")[0];

  // Filter habits by category if needed
  const filteredHabits =
    selectedCategory === "All" ? habits : habits.filter((habit) => habit.category === selectedCategory);

  // Get unique categories from habits
  const categories = ["All", ...Array.from(new Set(habits.map((habit) => habit.category)))];

  return (
    <div className="container mx-auto px-4 py-8">
      <main>
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-3xl font-bold">Your Habits</h1>
          <Button
            className="rounded-full bg-blue-500 px-4 py-2 font-medium hover:bg-blue-600"
            onClick={() => setIsHabitModalOpen(true)}
          >
            Create New Habit
          </Button>
        </div>

        {/* Category Filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant="ghost"
              className={`rounded-full px-4 py-1 text-sm ${
                category === selectedCategory ? "bg-blue-500 hover:bg-blue-600" : "bg-white/10 hover:bg-white/20"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Habits Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredHabits.map((habit) => {
            const completed = habit.completedDates.some((date) => date.startsWith(today));

            return (
              <div key={habit.id} className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
                <div className="mb-2 flex items-center justify-between">
                  <span className="rounded-full bg-blue-500/20 px-2 py-1 text-xs">{habit.category}</span>
                  <span className="text-sm text-blue-200">{habit.frequency}</span>
                </div>
                <h3 className="mb-1 text-xl font-bold">{habit.name}</h3>
                <p className="mb-4 text-sm text-blue-200">{habit.description}</p>
                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <div>
                    <p className="text-xs text-blue-200">Reward</p>
                    <p className="font-bold">{habit.points} points</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-200">Current Streak</p>
                    <p className="font-bold">{habit.streak} days 🔥</p>
                  </div>
                  <Button
                    className={`rounded-full px-3 py-1 text-sm ${
                      completed ? "cursor-not-allowed bg-gray-500" : "bg-green-500 hover:bg-green-600"
                    }`}
                    disabled={completed}
                    onClick={() => !completed && completeHabit(habit.id)}
                  >
                    {completed ? "Completed" : "Complete"}
                  </Button>
                </div>
                {/* <HabitCalendar habit={habit} /> */}
              </div>
            );
          })}
          {filteredHabits.length === 0 && (
            <div className="col-span-full py-8 text-center">
              <p className="mb-4 text-xl text-blue-200">No habits found in this category</p>
              <Button onClick={() => setIsHabitModalOpen(true)}>Create your first habit</Button>
            </div>
          )}
        </div>
      </main>

      <AddHabitModal isOpen={isHabitModalOpen} onClose={() => setIsHabitModalOpen(false)} />
    </div>
  );
}
