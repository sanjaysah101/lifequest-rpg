"use client";

import { useState } from "react";

import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormSelect } from "@/components/ui/form-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useAppContext } from "@/contexts/AppContext";

interface WizardFormData {
  name: string;
  wakeTime: string;
  sleepTime: string;
  focusArea: string;
  motivation: string;
  difficultyPreference: string;
  rewardPreference: string;
}

export default function KnowThyselfWizard({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user, updateUser } = useAppContext();
  const [step, setStep] = useState(1);
  const { register, handleSubmit, watch, formState } = useForm<WizardFormData>({
    defaultValues: {
      name: user.name || "Adventurer",
      wakeTime: user.preferences?.wakeTime || "07:00",
      sleepTime: user.preferences?.sleepTime || "22:00",
      focusArea: user.preferences?.focusArea || "productivity",
      motivation: user.preferences?.motivation || "achievement",
      difficultyPreference: user.preferences?.difficultyPreference || "moderate",
      rewardPreference: user.preferences?.rewardPreference || "balanced",
    },
  });

  const totalSteps = 5;

  const onSubmit = (data: WizardFormData) => {
    // Update user with personalized settings
    const updatedUser = {
      ...user,
      name: data.name,
      preferences: {
        wakeTime: data.wakeTime,
        sleepTime: data.sleepTime,
        focusArea: data.focusArea,
        motivation: data.motivation,
        difficultyPreference: data.difficultyPreference,
        rewardPreference: data.rewardPreference,
      },
      // Initialize the progressive load system based on preferences
      progressiveLoad: {
        difficulty:
          data.difficultyPreference === "challenging" ? 1.2 : data.difficultyPreference === "moderate" ? 1.0 : 0.8,
        reward: data.rewardPreference === "high" ? 1.2 : data.rewardPreference === "balanced" ? 1.0 : 0.8,
      },
      // Initialize time context settings based on wake/sleep times
      timeContext: {
        wakeTime: data.wakeTime,
        sleepTime: data.sleepTime,
        optimizedHours: calculateOptimizedHours(data.wakeTime, data.sleepTime, data.focusArea),
      },
    };

    // Save to localStorage directly as a backup
    localStorage.setItem("lifequest_user_preferences", JSON.stringify(updatedUser.preferences));
    localStorage.setItem("lifequest_user_progressiveLoad", JSON.stringify(updatedUser.progressiveLoad));
    localStorage.setItem("lifequest_user_timeContext", JSON.stringify(updatedUser.timeContext));

    updateUser(updatedUser);
    onClose();
  };
  // Calculate optimal hours based on user's schedule and preferences
  const calculateOptimizedHours = (wakeTime: string, sleepTime: string, focusArea: string) => {
    const optimizedHours = [];
    const wake = parseInt(wakeTime.split(":")[0]);
    const sleep = parseInt(sleepTime.split(":")[0]);

    // Morning productivity window (2 hours after waking)
    optimizedHours.push({
      start: wake + 1,
      end: wake + 3,
      bonus: 0.2,
      type: focusArea === "productivity" ? "productivity" : "focus",
    });

    // Mid-day window
    const midDay = Math.floor((wake + sleep) / 2);
    optimizedHours.push({
      start: midDay - 1,
      end: midDay + 1,
      bonus: 0.15,
      type: focusArea === "health" ? "health" : "energy",
    });

    // Evening window (based on focus area)
    const eveningStart = Math.max(17, sleep - 4);
    optimizedHours.push({
      start: eveningStart,
      end: eveningStart + 2,
      bonus: 0.18,
      type: focusArea === "mindfulness" ? "mindfulness" : "reflection",
    });

    return optimizedHours;
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-none bg-gradient-to-b from-blue-900 to-purple-900 text-white sm:max-w-[500px]">
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

        <form onSubmit={handleSubmit(onSubmit)}>
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Welcome to Your Personal Economy Setup</h3>
              <p className="text-blue-200">
                Let's calibrate your system to match your personal goals and rhythms. This will help optimize your
                rewards and bonuses.
              </p>

              <div className="grid gap-2">
                <Label htmlFor="name">What should we call you?</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  className="border-white/20 bg-black/30 text-white"
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
                    {...register("wakeTime", { required: true })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="sleepTime">When do you usually go to sleep?</Label>
                  <Input
                    id="sleepTime"
                    type="time"
                    className="border-white/20 bg-black/30 text-white"
                    {...register("sleepTime", { required: true })}
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
                  options={[
                    { value: "health", label: "Physical Health" },
                    { value: "productivity", label: "Productivity" },
                    { value: "learning", label: "Learning & Growth" },
                    { value: "mindfulness", label: "Mindfulness & Mental Health" },
                    { value: "social", label: "Social Connections" },
                  ]}
                  className="border-white/20 bg-black/30 text-white"
                  {...register("focusArea", { required: true })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="motivation">What motivates you most?</Label>
                <FormSelect
                  id="motivation"
                  options={[
                    { value: "achievement", label: "Sense of Achievement" },
                    { value: "growth", label: "Personal Growth" },
                    { value: "competition", label: "Competition with Others" },
                    { value: "rewards", label: "Tangible Rewards" },
                    { value: "wellbeing", label: "Overall Wellbeing" },
                  ]}
                  className="border-white/20 bg-black/30 text-white"
                  {...register("motivation", { required: true })}
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Progressive Load Calibration</h3>
              <p className="text-blue-200">Let's calibrate how challenges and rewards scale as you improve.</p>

              <div className="grid gap-2">
                <Label htmlFor="difficultyPreference">How challenging do you want your habits to be?</Label>
                <FormSelect
                  id="difficultyPreference"
                  options={[
                    { value: "gentle", label: "Gentle - I prefer easier, consistent progress" },
                    { value: "moderate", label: "Moderate - Balanced difficulty" },
                    { value: "challenging", label: "Challenging - I thrive under pressure" },
                  ]}
                  className="border-white/20 bg-black/30 text-white"
                  {...register("difficultyPreference", { required: true })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="rewardPreference">How would you like rewards to scale?</Label>
                <FormSelect
                  id="rewardPreference"
                  options={[
                    { value: "conservative", label: "Conservative - Smaller, more frequent rewards" },
                    { value: "balanced", label: "Balanced - Moderate rewards" },
                    { value: "high", label: "High - Larger rewards for bigger achievements" },
                  ]}
                  className="border-white/20 bg-black/30 text-white"
                  {...register("rewardPreference", { required: true })}
                />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Ready to Begin Your Journey</h3>
              <p className="text-blue-200">
                Based on your preferences, we've calibrated your personal economy system. Your habits, rewards, and
                bonuses will now be optimized for your unique profile.
              </p>

              <div className="rounded-lg bg-blue-800/30 p-4">
                <h4 className="mb-2 font-semibold">Your Personalized Features:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20 text-green-400">
                      ✓
                    </span>
                    <span>Time Context: Optimized for your {watch("focusArea")} focus and daily schedule</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20 text-green-400">
                      ✓
                    </span>
                    <span>Progressive Load: Tailored to your {watch("difficultyPreference")} preference</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20 text-green-400">
                      ✓
                    </span>
                    <span>Reward System: Calibrated to your {watch("rewardPreference")} reward style</span>
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
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Complete Setup
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
