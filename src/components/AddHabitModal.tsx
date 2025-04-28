"use client";

import { useId } from "react";

import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormSelect } from "@/components/ui/form-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useGame } from "../contexts/GameContext";
import { Frequency, Habit, HabitCategory } from "../lib/models";

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const categoryOptions = Object.values(HabitCategory).map((category) => ({
  value: category,
  label: category,
}));

const frequencyOptions = Object.values(Frequency).map((category) => ({
  value: category,
  label: category,
}));

export default function AddHabitModal({ isOpen, onClose }: AddHabitModalProps) {
  const { setHabits, habits } = useGame();
  const newId = useId();

  const { register, handleSubmit, reset } = useForm<Habit>({
    defaultValues: {
      name: "",
      description: "",
      frequency: Frequency.Daily,
      points: 10,
      category: HabitCategory.Wellness,
      completedDates: [],
      createdAt: new Date().toISOString(),
      id: newId,
      streak: 0,
    },
  });

  const onSubmit = (data: Habit) => {
    const updatedHabits: Habit[] = habits ? [...habits, data] : [data];
    setHabits(updatedHabits);
    onClose();
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-none bg-gradient-to-b from-blue-900 to-purple-900 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Add New Habit</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-blue-200">
                Habit Name
              </Label>
              <Input
                id="name"
                className="border-white/20 bg-black/30 text-white"
                required
                {...register("name", { required: true })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-blue-200">
                Description
              </Label>
              <Input
                id="description"
                className="border-white/20 bg-black/30 text-white"
                required
                {...register("description", { required: true })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="frequency" className="text-blue-200">
                  Frequency
                </Label>
                <FormSelect
                  id="frequency"
                  options={frequencyOptions}
                  className="border-white/20 bg-black/30 text-white"
                  {...register("frequency", { required: true })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="points" className="text-blue-200">
                  Points
                </Label>
                <Input
                  id="points"
                  type="number"
                  min="1"
                  className="border-white/20 bg-black/30 text-white"
                  required
                  {...register("points", { required: true, valueAsNumber: true, min: 1 })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category" className="text-blue-200">
                Category
              </Label>
              <FormSelect
                id="category"
                options={categoryOptions}
                className="border-white/20 bg-black/30 text-white"
                {...register("category", { required: true })}
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
