"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/AppContext";

export default function GamePage() {
  const gameRef = useRef<HTMLDivElement>(null);
  const gameInstanceRef = useRef<any>(null); // Store the game instance reference
  const { user, habits, updateUser } = useAppContext();
  const [collectedPoints, setCollectedPoints] = useState(0);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [bonusMessage, setBonusMessage] = useState("");

  useEffect(() => {
    // Dynamic import of Phaser to avoid SSR issues
    const loadPhaser = async () => {
      const Phaser = (await import("phaser")).default;

      // Only initialize if the component is mounted
      if (!gameRef.current) return;

      // Destroy any existing game instance before creating a new one
      if (gameInstanceRef.current) {
        gameInstanceRef.current.destroy(true);
        gameInstanceRef.current = null;
      }

      // Game configuration with user data integration
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: gameRef.current,
        physics: {
          default: "arcade",
          arcade: {
            gravity: { x: 0, y: 300 },
            debug: false,
          },
        },
        scene: {
          preload: function (this: Phaser.Scene) {
            // Load assets
            this.load.setBaseURL("https://labs.phaser.io");
            this.load.image("sky", "assets/skies/space3.png");
            this.load.image("logo", "assets/sprites/phaser3-logo.png");
            this.load.image("red", "assets/particles/red.png");
            this.load.image("star", "assets/sprites/star.png");
            this.load.image("diamond", "assets/sprites/diamond.png"); // For higher value rewards
            this.load.image("platform", "assets/sprites/platform.png");
            this.load.spritesheet("dude", "assets/sprites/dude.png", { frameWidth: 32, frameHeight: 48 });
          },
          create: function (this: Phaser.Scene) {
            // Create game elements
            this.add.image(400, 300, "sky");

            // Add platforms
            const platforms = this.physics.add.staticGroup();
            platforms.create(400, 568, "platform").setScale(2).refreshBody();

            // Add some floating platforms
            platforms.create(600, 400, "platform");
            platforms.create(50, 250, "platform");
            platforms.create(750, 220, "platform");

            // Create player character
            const player = this.physics.add.sprite(100, 450, "dude");
            player.setBounce(0.2);
            player.setCollideWorldBounds(true);

            // Player animations
            this.anims.create({
              key: "left",
              frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
              frameRate: 10,
              repeat: -1,
            });

            this.anims.create({
              key: "turn",
              frames: [{ key: "dude", frame: 4 }],
              frameRate: 20,
            });

            this.anims.create({
              key: "right",
              frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
              frameRate: 10,
              repeat: -1,
            });

            // Add collision between player and platforms
            this.physics.add.collider(player, platforms);

            // Implement Goal Gradient System - rewards scale with progress
            const collectibles = this.physics.add.group();

            // Calculate habit completion metrics
            const completedHabitsCount = habits.reduce(
              (count, habit) => count + (habit.completedDates.length > 0 ? 1 : 0),
              0
            );

            const totalHabits = habits.length;
            const completionRatio = totalHabits > 0 ? completedHabitsCount / totalHabits : 0;

            // Create a progress bar to visualize the Goal Gradient
            const progressBarWidth = 300;
            const progressBarHeight = 20;
            const progressBarX = 400;
            const progressBarY = 150;

            // Background bar
            this.add
              .rectangle(progressBarX, progressBarY, progressBarWidth, progressBarHeight, 0x333333)
              .setOrigin(0.5);

            // Progress fill with gradient color based on completion
            const gradientColor = completionRatio > 0.75 ? 0x00ffff : completionRatio > 0.5 ? 0x00ff00 : 0xffff00;
            const progressFill = this.add
              .rectangle(
                progressBarX - progressBarWidth / 2,
                progressBarY - progressBarHeight / 2,
                progressBarWidth * completionRatio,
                progressBarHeight,
                gradientColor
              )
              .setOrigin(0, 0);

            // Add text above progress bar
            this.add
              .text(progressBarX, progressBarY - 25, `Goal Progress: ${Math.floor(completionRatio * 100)}%`, {
                fontSize: "16px",
                color: "#ffffff",
              })
              .setOrigin(0.5);

            // Add visual indicators for Goal Gradient thresholds
            const thresholds = [
              { position: 0.5, label: "50%", color: 0x00ff00 },
              { position: 0.75, label: "75%", color: 0x00ffff },
            ];

            thresholds.forEach((threshold) => {
              // Add threshold marker
              const markerX = progressBarX - progressBarWidth / 2 + progressBarWidth * threshold.position;

              // Add vertical line marker
              this.add.line(markerX, progressBarY, 0, -15, 0, 15, threshold.color).setLineWidth(2);

              // Add threshold label
              this.add
                .text(markerX, progressBarY + 25, threshold.label, {
                  fontSize: "12px",
                  color: "#ffffff",
                })
                .setOrigin(0.5);

              // Add reward indicator
              const rewardText = threshold.position === 0.5 ? "Diamonds" : "Max Bonus";
              this.add
                .text(markerX, progressBarY + 40, rewardText, {
                  fontSize: "10px",
                  color: `#${threshold.color.toString(16).padStart(6, "0")}`,
                })
                .setOrigin(0.5);
            });

            // Add current multiplier text
            const baseMultiplier = completionRatio > 0.75 ? 2 : completionRatio > 0.5 ? 1.5 : 1;
            this.add
              .text(progressBarX, progressBarY + 60, `Current Multiplier: x${baseMultiplier.toFixed(1)}`, {
                fontSize: "14px",
                color: "#ffffff",
              })
              .setOrigin(0.5);

            // Create collectibles based on completion ratio - higher completion = more valuable items
            const itemsToCreate = Math.min(12, Math.max(5, completedHabitsCount * 2));

            for (let i = 0; i < itemsToCreate; i++) {
              const x = Phaser.Math.Between(50, 750);
              const y = Phaser.Math.Between(180, 300);

              // Apply Goal Gradient - as user completes more habits, more valuable items appear
              let itemType = "star";
              let pointValue = 10;

              // Scale rewards based on completion ratio and streak
              if (completionRatio > 0.5 || (habits[i] && habits[i].streak > 3)) {
                itemType = "diamond";
                pointValue = 25;
              }

              const item = collectibles.create(x, y, itemType);
              item.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

              // Store the point value on the item
              item.setData("pointValue", pointValue);
            }

            this.physics.add.collider(collectibles, platforms);

            // Track collected points in this scene
            let pointsCollected = 0;
            const pointsText = this.add.text(16, 16, "Points: 0", { fontSize: "32px", color: "#ffffff" });

            // Add overlap detection for collecting items
            this.physics.add.overlap(player, collectibles, collectItem, null, this);

            function collectItem(player: Phaser.Physics.Arcade.Sprite, item: Phaser.Physics.Arcade.Image) {
              item.disableBody(true, true);

              // Get the point value from the item
              const pointValue = item.getData("pointValue");

              // Apply the Goal Gradient multiplier
              const adjustedPoints = Math.floor(pointValue * baseMultiplier);

              // Update the points
              pointsCollected += adjustedPoints;
              pointsText.setText(`Points: ${pointsCollected}`);

              // Create a floating text to show points earned
              const pointText = this.add.text(item.x, item.y, `+${adjustedPoints}`, {
                fontSize: "16px",
                color: "#ffff00",
              });

              // Animate the text floating up and fading out
              this.tweens.add({
                targets: pointText,
                y: item.y - 50,
                alpha: 0,
                duration: 1000,
                onComplete: function () {
                  pointText.destroy();
                },
              });

              // Check if all items are collected
              if (collectibles.countActive(true) === 0) {
                // All items collected, show bonus message if applicable
                if (baseMultiplier > 1) {
                  const bonusText = this.add
                    .text(400, 300, "Goal Gradient Bonus Applied!", {
                      fontSize: "24px",
                      color: "#00ff00",
                    })
                    .setOrigin(0.5);

                  // Animate the bonus text
                  this.tweens.add({
                    targets: bonusText,
                    scaleX: 1.2,
                    scaleY: 1.2,
                    duration: 1000,
                    yoyo: true,
                    repeat: 1,
                    onComplete: function () {
                      bonusText.destroy();

                      // Set the collected points in the React state
                      setCollectedPoints(pointsCollected);
                      setShowSaveButton(true);

                      if (baseMultiplier > 1) {
                        setBonusMessage("You've earned points through the Goal Gradient system!");
                      }
                    },
                  });
                } else {
                  // No bonus, just update the state
                  setCollectedPoints(pointsCollected);
                  setShowSaveButton(true);
                }
              }
            }

            // Add keyboard controls
            const cursors = this.input.keyboard.createCursorKeys();

            // Update function to handle player movement
            this.update = function () {
              if (cursors.left.isDown) {
                player.setVelocityX(-160);
                player.anims.play("left", true);
              } else if (cursors.right.isDown) {
                player.setVelocityX(160);
                player.anims.play("right", true);
              } else {
                player.setVelocityX(0);
                player.anims.play("turn");
              }

              if (cursors.up.isDown && player.body.touching.down) {
                player.setVelocityY(-330);
              }
            };
          },
        },
      };

      // Create the game instance and store the reference
      gameInstanceRef.current = new Phaser.Game(config);
    };

    loadPhaser();

    // Cleanup function
    return () => {
      // Properly destroy the game instance when component unmounts
      if (gameInstanceRef.current) {
        gameInstanceRef.current.destroy(true);
        gameInstanceRef.current = null;
      }
    };
  }, [habits, user]);

  // Function to save collected points to user account
  const savePoints = () => {
    if (collectedPoints > 0) {
      const updatedUser = {
        ...user,
        points: user.points + collectedPoints,
        experience: user.experience + collectedPoints,
      };

      // Level up if enough experience
      if (updatedUser.experience >= updatedUser.nextLevelAt) {
        updatedUser.level += 1;
        updatedUser.nextLevelAt = Math.floor(updatedUser.nextLevelAt * 1.5);
      }

      updateUser(updatedUser);
      setCollectedPoints(0);
      setShowSaveButton(false);
      setBonusMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <Header />

        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-center text-3xl font-bold">Your Quest Adventure</h1>
          <p className="mb-8 text-center text-lg">
            Complete habits to advance your character! Collect stars and diamonds to earn points.
          </p>

          {/* Game container */}
          <div ref={gameRef} className="mx-auto overflow-hidden rounded-lg border-4 border-white/20 bg-black"></div>

          {/* Points collection UI */}
          {showSaveButton && (
            <div className="mt-6 rounded-lg bg-blue-800/50 p-4 text-center">
              <h2 className="text-xl font-bold">Quest Complete!</h2>
              <p className="mb-2">You collected {collectedPoints} points in this quest.</p>
              {bonusMessage && <p className="mb-3 text-green-200">{bonusMessage}</p>}
              <Button onClick={savePoints} className="bg-green-600 hover:bg-green-700">
                Add Points to Your Account
              </Button>
            </div>
          )}

          <div className="mt-8 text-center">
            <h2 className="mb-4 text-xl font-bold">Game Controls</h2>
            <div className="mb-6 grid grid-cols-2 gap-4 text-left md:grid-cols-4">
              <div className="rounded-lg bg-white/10 p-3">
                <p className="font-bold">Left Arrow</p>
                <p className="text-sm">Move Left</p>
              </div>
              <div className="rounded-lg bg-white/10 p-3">
                <p className="font-bold">Right Arrow</p>
                <p className="text-sm">Move Right</p>
              </div>
              <div className="rounded-lg bg-white/10 p-3">
                <p className="font-bold">Up Arrow</p>
                <p className="text-sm">Jump</p>
              </div>
              <div className="rounded-lg bg-white/10 p-3">
                <p className="font-bold">Goal</p>
                <p className="text-sm">Collect all items</p>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="rounded-full bg-blue-500 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-600"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
