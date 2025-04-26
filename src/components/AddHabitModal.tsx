"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormSelect } from "@/components/ui/form-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/contexts/AppContext";

import { Habit } from "../lib/models";

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddHabitModal({ isOpen, onClose }: AddHabitModalProps) {
  const { addHabit } = useAppContext();
  const [habitData, setHabitData] = useState<Omit<Habit, "id" | "createdAt" | "completedDates" | "streak">>({
    name: "",
    description: "",
    frequency: "Daily",
    points: 10,
    category: "Wellness",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setHabitData((prev) => ({
      ...prev,
      [name]: name === "points" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addHabit(habitData);
    setHabitData({
      name: "",
      description: "",
      frequency: "Daily",
      points: 10,
      category: "Wellness",
    });
    onClose();
  };

  const frequencyOptions = [
    { value: "Daily", label: "Daily" },
    { value: "Weekdays", label: "Weekdays" },
    { value: "Weekly", label: "Weekly" },
    { value: "Monthly", label: "Monthly" },
  ];

  const categoryOptions = [
    { value: "Wellness", label: "Wellness" },
    { value: "Health", label: "Health" },
    { value: "Growth", label: "Growth" },
    { value: "Productivity", label: "Productivity" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-none bg-gradient-to-b from-blue-900 to-purple-900 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Add New Habit</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-blue-200">
                Habit Name
              </Label>
              <Input
                id="name"
                name="name"
                value={habitData.name}
                onChange={handleChange}
                required
                className="border-white/20 bg-black/30 text-white"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-blue-200">
                Description
              </Label>
              <Input
                id="description"
                name="description"
                value={habitData.description}
                onChange={handleChange}
                required
                className="border-white/20 bg-black/30 text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="frequency" className="text-blue-200">
                  Frequency
                </Label>
                <FormSelect
                  id="frequency"
                  name="frequency"
                  value={habitData.frequency}
                  onChange={handleChange}
                  options={frequencyOptions}
                  className="border-white/20 bg-black/30 text-white"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="points" className="text-blue-200">
                  Points
                </Label>
                <Input
                  id="points"
                  name="points"
                  type="number"
                  min="1"
                  value={habitData.points}
                  onChange={handleChange}
                  required
                  className="border-white/20 bg-black/30 text-white"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category" className="text-blue-200">
                Category
              </Label>
              <FormSelect
                id="category"
                name="category"
                value={habitData.category}
                onChange={handleChange}
                options={categoryOptions}
                className="border-white/20 bg-black/30 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Add Habit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
