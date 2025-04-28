"use client";

import { useState } from "react";

import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormSelect } from "@/components/ui/form-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

import { useGame } from "../contexts/GameContext";
import { DifficultyPreference, FocusArea, MotivationType, RewardPreference, User } from "../lib/models";

const focusAreaOptions = Object.values(FocusArea).map((area) => ({
  value: area,
  label: area,
}));

const motivationTypeOptions = Object.values(MotivationType).map((area) => ({
  value: area,
  label: area,
}));

const difficultyPreferenceOptions = Object.values(DifficultyPreference).map((area) => ({
  value: area,
  label: area,
}));

const rewardPreferencesOptions = Object.values(RewardPreference).map((area) => ({
  value: area,
  label: area,
}));

export default function KnowThyselfWizard({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user, setUser } = useGame();
  const [step, setStep] = useState(1);

  const { register, handleSubmit, watch } = useForm<User>({
    defaultValues: user ?? {},
  });

  const totalSteps = 5;

  const onSubmit = (data: User) => {
    // Update user with personalized settings
    const updatedUser = {
      ...user,
      ...data,
    };

    setUser(updatedUser);
    onClose();
  };

  const handleComplete = () => {
    handleSubmit(onSubmit)();
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Know Thyself Wizard</DialogTitle>
        </DialogHeader>

        <div className="mb-4">
          <div className="mb-2 flex justify-between text-xs">
            <span>
              Step {step} of {totalSteps}
            </span>
            <span>{Math.round((step / totalSteps) * 100)}% Complete</span>
          </div>
          <Progress value={(step / totalSteps) * 100} className="h-2" />
        </div>

        <form>
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Welcome to Your Personal Economy Setup</h3>
              <p className="text-blue-200">
                Let&apos;s calibrate your system to match your personal goals and rhythms. This will help optimize your
                rewards and bonuses.
              </p>

              <div className="grid gap-2">
                <Label htmlFor="name">What should we call you?</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  className="border-white/20 bg-black/30 text-white"
                  required
                  {...register("name", { required: true })}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Your Daily Rhythm</h3>
              <p className="text-blue-200">
                Understanding your daily schedule helps us optimize the Time Context feature.
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="wakeTime">When do you usually wake up?</Label>
                  <Input
                    id="wakeTime"
                    type="time"
                    className="border-white/20 bg-black/30 text-white"
                    {...register("preferences.wakeTime", { required: true })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="sleepTime">When do you usually go to sleep?</Label>
                  <Input
                    id="sleepTime"
                    type="time"
                    className="border-white/20 bg-black/30 text-white"
                    {...register("preferences.sleepTime", { required: true })}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Your Focus Areas</h3>
              <p className="text-blue-200">This helps us tailor the Progressive Load system to your priorities.</p>

              <div className="grid gap-2">
                <Label htmlFor="focusArea">What area do you most want to improve?</Label>
                <FormSelect
                  id="focusArea"
                  options={focusAreaOptions}
                  className="border-white/20 bg-black/30 text-white"
                  {...register("preferences.focusArea", { required: true })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="motivation">What motivates you most?</Label>
                <FormSelect
                  id="motivation"
                  options={motivationTypeOptions}
                  className="border-white/20 bg-black/30 text-white"
                  {...register("preferences.motivation", { required: true })}
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Progressive Load Calibration</h3>
              <p className="text-blue-200">Let&apos;s calibrate how challenges and rewards scale as you improve.</p>

              <div className="grid gap-2">
                <Label htmlFor="preferences.difficultyPreference">How challenging do you want your habits to be?</Label>
                <FormSelect
                  id="preferences.difficultyPreference"
                  options={difficultyPreferenceOptions}
                  className="border-white/20 bg-black/30 text-white"
                  {...register("preferences.difficultyPreference", { required: true })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="rewardPreference">How would you like rewards to scale?</Label>
                <FormSelect
                  id="rewardPreference"
                  options={rewardPreferencesOptions}
                  className="border-white/20 bg-black/30 text-white"
                  {...register("preferences.rewardPreference", { required: true })}
                />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Ready to Begin Your Journey</h3>
              <p className="text-blue-200">
                Based on your preferences, we&apos;ve calibrated your personal economy system. Your habits, rewards, and
                bonuses will now be optimized for your unique profile.
              </p>

              <div className="rounded-lg bg-blue-800/30 p-4">
                <h4 className="mb-2 font-semibold">Your Personalized Features:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20 text-green-400">
                      ✓
                    </span>
                    <span>
                      Time Context: Optimized for your {watch("preferences.focusArea")} focus and daily schedule
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20 text-green-400">
                      ✓
                    </span>
                    <span>
                      Progressive Load: Tailored to your {watch("preferences.difficultyPreference")} preference
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20 text-green-400">
                      ✓
                    </span>
                    <span>Reward System: Calibrated to your {watch("preferences.rewardPreference")} reward style</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-between">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={prevStep} className="border-white/20 text-white">
                Back
              </Button>
            ) : (
              <Button type="button" variant="outline" onClick={onClose} className="border-white/20 text-white">
                Cancel
              </Button>
            )}

            {step < totalSteps ? (
              <Button type="button" onClick={nextStep} className="bg-blue-600 hover:bg-blue-700">
                Next
              </Button>
            ) : (
              <Button type="button" onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
                Complete Setup
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
