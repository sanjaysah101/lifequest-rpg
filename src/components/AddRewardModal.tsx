"use client";

import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormSelect } from "@/components/ui/form-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useGame } from "../contexts/GameContext";
import { Reward, RewardCategory } from "../lib/models";

interface AddRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const categoryOptions = Object.values(RewardCategory).map((area) => ({
  value: area,
  label: area,
}));

export default function AddRewardModal({ isOpen, onClose }: AddRewardModalProps) {
  const { setRewards, rewards } = useGame();

  const { register, handleSubmit } = useForm<Reward>({
    defaultValues: {
      name: "",
      description: "",
      cost: 50,
      category: RewardCategory.Entertainment,
    },
  });

  const onSubmit = (data: Reward) => {
    // Add the new reward to existing rewards
    const updatedRewards: Reward[] = rewards ? [...rewards, data] : [data];
    setRewards(updatedRewards);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-none bg-gradient-to-b from-blue-900 to-purple-900 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Add New Reward</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-blue-200">
                Reward Name
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
                <Label htmlFor="cost" className="text-blue-200">
                  Cost (Points)
                </Label>
                <Input
                  id="cost"
                  type="number"
                  min="1"
                  className="border-white/20 bg-black/30 text-white"
                  required
                  {...register("cost", { required: true, valueAsNumber: true, min: 1 })}
                />
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
              Add Reward
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
