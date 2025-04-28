"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import GameWorldNav from "./GameWorldNav";

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? "text-blue-300 hover:text-blue-100" : "hover:text-blue-300";
  };

  return (
    <header className="w-full border-b border-white/10 bg-white/10 shadow-lg backdrop-blur-md">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 p-6 sm:flex-row">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-2xl font-bold tracking-tight text-white drop-shadow">
            LifeQuest RPG
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <nav>
            <ul className="flex gap-6">
              <li>
                <Link href="/dashboard" className={isActive("/dashboard")}>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/adventure" className={isActive("/adventure")}>
                  Adventure
                </Link>
              </li>
              <li>
                <Link href="/game" className={isActive("/game")}>
                  Game
                </Link>
              </li>
              <li>
                <Link href="/habits" className={isActive("/habits")}>
                  Habits
                </Link>
              </li>
              <li>
                <Link href="/rewards" className={isActive("/rewards")}>
                  Rewards
                </Link>
              </li>
              <li>
                <Link href="/achievements" className={isActive("/achievements")}>
                  Achievements
                </Link>
              </li>
            </ul>
          </nav>
          <GameWorldNav />
        </div>
      </div>
    </header>
  );
}
