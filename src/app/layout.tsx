import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import Header from "../components/Header";
import { GameProvider } from "../contexts/GameContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LifeQuest RPG - Gamify Your Life",
  description: "Turn your daily habits into a rewarding RPG experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <GameProvider>
          <div className="min-h-screen bg-gradient-to-b from-blue-900 to-purple-900 text-white">
            <Header />
            {children}
          </div>
        </GameProvider>
      </body>
    </html>
  );
}
