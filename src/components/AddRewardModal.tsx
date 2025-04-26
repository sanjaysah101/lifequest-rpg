"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormSelect } from "@/components/ui/form-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/contexts/AppContext";

interface AddRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddRewardModal({ isOpen, onClose }: AddRewardModalProps) {
  const { addReward } = useAppContext();
  const [rewardData, setRewardData] = useState({
    name: "",
    description: "",
    cost: 50,
    category: "Entertainment",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRewardData((prev) => ({
      ...prev,
      [name]: name === "cost" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addReward(rewardData);
    setRewardData({
      name: "",
      description: "",
      cost: 50,
      category: "Entertainment",
    });
    onClose();
  };

  const categoryOptions = [
    { value: "Entertainment", label: "Entertainment" },
    { value: "Food & Drink", label: "Food & Drink" },
    { value: "Digital", label: "Digital" },
    { value: "Shopping", label: "Shopping" },
    { value: "Self-care", label: "Self-care" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-none bg-gradient-to-b from-blue-900 to-purple-900 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Add New Reward</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-blue-200">
                Reward Name
              </Label>
              <Input
                id="name"
                name="name"
                value={rewardData.name}
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
                value={rewardData.description}
                onChange={handleChange}
                required
                className="border-white/20 bg-black/30 text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="cost" className="text-blue-200">
                  Cost (Points)
                </Label>
                <Input
                  id="cost"
                  name="cost"
                  type="number"
                  min="1"
                  value={rewardData.cost}
                  onChange={handleChange}
                  required
                  className="border-white/20 bg-black/30 text-white"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category" className="text-blue-200">
                  Category
                </Label>
                <FormSelect
                  id="category"
                  name="category"
                  value={rewardData.category}
                  onChange={handleChange}
                  options={categoryOptions}
                  className="border-white/20 bg-black/30 text-white"
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
