"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { MapIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function GameWorldNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const worlds = [
    {
      id: "dashboard",
      name: "Home Base",
      description: "Your central command center",
      path: "/dashboard",
      color: "bg-blue-600",
    },
    {
      id: "adventure",
      name: "Adventure World",
      description: "Explore magical realms and complete quests",
      path: "/adventure",
      color: "bg-green-600",
    },
    {
      id: "habits",
      name: "Training Grounds",
      description: "Build your character through daily practice",
      path: "/habits",
      color: "bg-orange-600",
    },
    {
      id: "rewards",
      name: "Treasure Vault",
      description: "Claim rewards for your achievements",
      path: "/rewards",
      color: "bg-purple-600",
    },
    {
      id: "game",
      name: "Mini-Game Arena",
      description: "Play interactive challenges",
      path: "/game",
      color: "bg-red-600",
    },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <MapIcon className="h-5 w-5" />
          <span className="sr-only">Open game map</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="border-none bg-gradient-to-b from-blue-900 to-purple-900 text-white">
        <SheetHeader>
          <SheetTitle className="text-white">Game World Map</SheetTitle>
          <SheetDescription className="text-blue-200">Choose a realm to explore</SheetDescription>
        </SheetHeader>
        <div className="mt-6 grid gap-4">
          {worlds.map((world) => (
            <Link
              key={world.id}
              href={world.path}
              onClick={() => setOpen(false)}
              className={`${world.color} rounded-lg p-4 transition-opacity hover:opacity-90 ${
                pathname === world.path ? "ring-2 ring-white" : ""
              }`}
            >
              <h3 className="font-bold">{world.name}</h3>
              <p className="text-sm opacity-80">{world.description}</p>
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
