import { useEffect, useState } from "react";

import { ClockIcon } from "lucide-react";

import { useAppContext } from "@/contexts/AppContext";

export default function TimeContextDisplay() {
  const { user } = useAppContext();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTimeWindow, setActiveTimeWindow] = useState<any>(null);

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Check if current time is in an optimized window
  useEffect(() => {
    const hour = currentTime.getHours();

    if (user.timeContext && user.timeContext.optimizedHours) {
      const activeWindow = user.timeContext.optimizedHours.find(
        (window: any) => hour >= window.start && hour < window.end
      );

      setActiveTimeWindow(activeWindow);
    } else {
      // Default time windows
      if (hour >= 5 && hour < 9) {
        setActiveTimeWindow({
          start: 5,
          end: 9,
          bonus: 0.25,
          type: "morning",
        });
      } else if (hour >= 19 && hour < 22) {
        setActiveTimeWindow({
          start: 19,
          end: 22,
          bonus: 0.15,
          type: "evening",
        });
      } else {
        setActiveTimeWindow(null);
      }
    }
  }, [currentTime, user.timeContext]);

  // Format time window
  const formatTimeWindow = (start: number, end: number) => {
    const formatHour = (h: number) => {
      const period = h >= 12 ? "PM" : "AM";
      const hour = h % 12 || 12;
      return `${hour}${period}`;
    };

    return `${formatHour(start)} - ${formatHour(end)}`;
  };

  return (
    <div className="rounded-lg border border-blue-800 bg-blue-950/30 p-6">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Time Context</h3>
        <div className="flex items-center gap-1 text-sm">
          <ClockIcon className="h-4 w-4" />
          <span>{currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
      </div>

      {activeTimeWindow ? (
        <div className="rounded-lg bg-green-900/30 p-3">
          <div className="flex items-center justify-between">
            <span className="font-medium">Active Bonus Window</span>
            <span className="rounded-full bg-green-500/20 px-2 py-1 text-xs text-green-300">
              +{(activeTimeWindow.bonus * 100).toFixed(0)}% bonus
            </span>
          </div>
          <p className="mt-1 text-sm text-blue-200">
            {formatTimeWindow(activeTimeWindow.start, activeTimeWindow.end)} - {activeTimeWindow.type} window
          </p>
        </div>
      ) : (
        <div className="rounded-lg bg-blue-900/50 p-3">
          <p className="text-sm text-blue-200">
            No active bonus window right now. Next window:{" "}
            {user.timeContext && user.timeContext.optimizedHours
              ? formatTimeWindow(user.timeContext.optimizedHours[0].start, user.timeContext.optimizedHours[0].end)
              : "5AM - 9AM"}
          </p>
        </div>
      )}

      <div className="mt-3 grid grid-cols-24 gap-0.5">
        {Array.from({ length: 24 }).map((_, i) => {
          const isActive = activeTimeWindow && i >= activeTimeWindow.start && i < activeTimeWindow.end;
          const isOptimized =
            user.timeContext &&
            user.timeContext.optimizedHours &&
            user.timeContext.optimizedHours.some((w: any) => i >= w.start && i < w.end);

          return (
            <div
              key={i}
              className={`h-3 ${isActive ? "bg-green-500" : isOptimized ? "bg-blue-500/50" : "bg-blue-900/30"}`}
              title={`${i}:00 - ${i + 1}:00`}
            />
          );
        })}
      </div>
      <div className="mt-1 flex justify-between text-xs text-blue-300">
        <span>12AM</span>
        <span>6AM</span>
        <span>12PM</span>
        <span>6PM</span>
        <span>12AM</span>
      </div>
    </div>
  );
}
