import { useState } from "react";

import { CalendarIcon } from "lucide-react";

import { Habit } from "@/lib/models";

interface HabitCalendarProps {
  habit: Habit;
}

export default function HabitCalendar({ habit }: HabitCalendarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Generate dates for the last 30 days
  const generateCalendarDays = () => {
    const days = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split("T")[0];

      days.push({
        date: dateString,
        isCompleted: habit.completedDates.includes(dateString),
        dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
        dayNumber: date.getDate(),
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="flex items-center gap-1 text-xs text-blue-300 hover:text-blue-100"
      >
        <CalendarIcon className="h-3 w-3" />
        <span>View history</span>
      </button>
    );
  }

  return (
    <div className="mt-3 rounded-lg bg-blue-900/30 p-3">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-semibold">30-Day History</h4>
        <button onClick={() => setIsExpanded(false)} className="text-xs text-blue-300 hover:text-blue-100">
          Close
        </button>
      </div>

      <div className="flex flex-wrap gap-1">
        {calendarDays.map((day) => (
          <div
            key={day.date}
            className={`flex h-8 w-8 flex-col items-center justify-center rounded-md text-xs ${
              day.isCompleted ? "bg-green-500/50 text-white" : "bg-blue-900/50 text-blue-300"
            }`}
            title={`${day.dayName}, ${day.date}`}
          >
            <span className="text-[10px]">{day.dayName.substring(0, 1)}</span>
            <span>{day.dayNumber}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
