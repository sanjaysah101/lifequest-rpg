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
    <header className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
      <div className="flex items-center gap-2">
        <Link href="/" className="text-2xl font-bold">
          LifeQuest RPG
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <GameWorldNav />
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
          </ul>
        </nav>
      </div>
    </header>
  );
}
