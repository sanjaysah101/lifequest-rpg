"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/AppContext";

import KnowThyselfWizard from "../../components/KnowThyselfWizard";

export default function GamePage() {
  const gameRef = useRef<HTMLDivElement>(null);
  const gameInstanceRef = useRef<any>(null); // Store the game instance reference
  const { user, habits, updateUser } = useAppContext();
  const [collectedPoints, setCollectedPoints] = useState(0);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [bonusMessage, setBonusMessage] = useState("");
  const [chainReactionActive, setChainReactionActive] = useState(false);
  const [timeContextBonus, setTimeContextBonus] = useState(0);
  const [showWizard, setShowWizard] = useState(false);

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

      // Calculate Time Context bonus based on user's optimized hours from the wizard
      const calculateTimeContextBonus = () => {
        const hour = new Date().getHours();
        let bonus = 0;

        // Use user's optimized hours if available from the wizard
        if (user.timeContext && user.timeContext.optimizedHours && user.timeContext.optimizedHours.length > 0) {
          // Check if current hour falls within any optimized time windows
          for (const timeWindow of user.timeContext.optimizedHours) {
            if (hour >= timeWindow.start && hour < timeWindow.end) {
              bonus = timeWindow.bonus;
              break;
            }
          }
        } else {
          // Fallback to default time windows if user hasn't completed the wizard
          // Morning bonus (5am-9am)
          if (hour >= 5 && hour < 9) {
            bonus = 0.25; // 25% bonus for morning activities
          }
          // Evening bonus (7pm-10pm)
          else if (hour >= 19 && hour < 22) {
            bonus = 0.15; // 15% bonus for evening activities
          }
        }
        return bonus;
      };

      const timeBonus = calculateTimeContextBonus();
      setTimeContextBonus(timeBonus);

      // Track active features
      const features = [];
      if (timeBonus > 0) features.push("Time Context");

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
            this.load.image("emerald", "assets/sprites/gem.png"); // New special reward
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

            // Progressive Load System - Use personalized settings from the wizard if available
            const calculateProgressiveLoad = () => {
              // Check if user has personalized settings from the wizard
              if (user.progressiveLoad) {
                // Use the personalized difficulty and reward settings
                return {
                  difficulty: user.progressiveLoad.difficulty,
                  reward: user.progressiveLoad.reward,
                };
              } else {
                // Fallback to default calculation if wizard hasn't been completed
                // Check if user has been consistently completing habits
                const consistentHabits = habits.filter((habit) => habit.streak >= 3).length;
                const consistencyRatio = totalHabits > 0 ? consistentHabits / totalHabits : 0;

                // Higher consistency = higher difficulty but also higher rewards
                return {
                  difficulty: Math.min(1.5, 1 + consistencyRatio * 0.5),
                  reward: Math.min(2, 1 + consistencyRatio * 1.0),
                };
              }
            };

            const progressiveLoad = calculateProgressiveLoad();

            // Add to active features if using personalized settings
            if (user.progressiveLoad) {
              features.push("Progressive Load");
            }

            // Create a progress bar to visualize the Goal Gradient
            const progressBarWidth = 300;
            const progressBarHeight = 20;
            const progressBarX = 400;
            const progressBarY = 120;

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

            // Display Progressive Load System
            this.add
              .text(
                progressBarX,
                progressBarY + 85,
                `Progressive Load: ${progressiveLoad.difficulty.toFixed(1)}x difficulty`,
                {
                  fontSize: "14px",
                  color: "#ff9900",
                }
              )
              .setOrigin(0.5);

            this.add
              .text(
                progressBarX,
                progressBarY + 105,
                `Progressive Reward: ${progressiveLoad.reward.toFixed(1)}x points`,
                {
                  fontSize: "14px",
                  color: "#ff9900",
                }
              )
              .setOrigin(0.5);

            // Display Time Context bonus if applicable
            if (timeBonus > 0) {
              this.add
                .text(progressBarX, progressBarY + 125, `Time Context Bonus: +${(timeBonus * 100).toFixed(0)}%`, {
                  fontSize: "14px",
                  color: "#ff66ff",
                })
                .setOrigin(0.5);
            }

            // Chain Reaction System - Display current chain status
            if (user.chainReaction && user.chainReaction.count > 0) {
              setChainReactionActive(true);
              const chainBonus = Math.min(0.5, user.chainReaction.count * 0.1); // Max 50% bonus

              this.add
                .text(
                  progressBarX,
                  progressBarY + 145,
                  `Chain Reaction: ${user.chainReaction.count}x chain (${(chainBonus * 100).toFixed(0)}% bonus)`,
                  {
                    fontSize: "14px",
                    color: "#ff3333",
                  }
                )
                .setOrigin(0.5);
            }

            // Create collectibles based on completion ratio - higher completion = more valuable items
            const itemsToCreate = Math.min(12, Math.max(5, completedHabitsCount * 2));

            // Create a path for chain reaction items (if chain is active)
            const chainPath = [];
            if (chainReactionActive && user.chainReaction && user.chainReaction.count >= 3) {
              // Create a zigzag path for special chain items
              for (let i = 0; i < 5; i++) {
                chainPath.push({
                  x: 150 + i * 120,
                  y: 200 + (i % 2 === 0 ? 0 : 50),
                });
              }
            }

            for (let i = 0; i < itemsToCreate; i++) {
              let x, y, itemType, pointValue;

              // If we have an active chain and this is a chain item
              if (chainPath.length > 0 && i < chainPath.length) {
                x = chainPath[i].x;
                y = chainPath[i].y;
                itemType = "emerald"; // Special item for chain reaction
                pointValue = 40; // Higher base value
              } else {
                // Regular random placement
                x = Phaser.Math.Between(50, 750);
                y = Phaser.Math.Between(180, 300);

                // Apply Goal Gradient - as user completes more habits, more valuable items appear
                itemType = "star";
                pointValue = 10;

                // Scale rewards based on completion ratio and streak
                if (completionRatio > 0.5 || (habits[i] && habits[i].streak > 3)) {
                  itemType = "diamond";
                  pointValue = 25;
                }
              }

              const item = collectibles.create(x, y, itemType);
              item.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

              // Store the point value and type on the item
              item.setData("pointValue", pointValue);
              item.setData("itemType", itemType);

              // Add a glow effect to chain items
              if (itemType === "emerald") {
                const particles = this.add.particles(x, y, "red", {
                  speed: 20,
                  scale: { start: 0.2, end: 0 },
                  blendMode: "ADD",
                  lifespan: 1000,
                  frequency: 50,
                });
                particles.startFollow(item);
              }
            }

            this.physics.add.collider(collectibles, platforms);

            // Track collected points and chain in this scene
            let pointsCollected = 0;
            let chainItemsCollected = 0;
            let lastCollectedTime = 0;
            const pointsText = this.add.text(16, 16, "Points: 0", { fontSize: "32px", color: "#ffffff" });

            // Add chain counter if chain is active
            let chainText: Phaser.GameObjects.Text;
            if (chainReactionActive) {
              chainText = this.add.text(16, 56, "Chain: 0/5", { fontSize: "24px", color: "#ff3333" });
            }

            // Add overlap detection for collecting items
            this.physics.add.overlap(player, collectibles, collectItem, null, this);

            function collectItem(player: Phaser.Physics.Arcade.Sprite, item: Phaser.Physics.Arcade.Image) {
              item.disableBody(true, true);

              // Get the point value from the item
              const pointValue = item.getData("pointValue");
              const itemType = item.getData("itemType");

              // Calculate various bonuses
              const goalGradientMultiplier = baseMultiplier;
              const progressiveMultiplier = progressiveLoad.reward;
              const timeContextMultiplier = 1 + timeBonus;

              // Chain reaction bonus
              let chainMultiplier = 1;
              if (itemType === "emerald") {
                chainItemsCollected++;

                // Update chain text if it exists
                if (chainText) {
                  chainText.setText(`Chain: ${chainItemsCollected}/5`);
                }

                // Check if items are collected in sequence (within 3 seconds)
                const currentTime = this.time.now;
                if (currentTime - lastCollectedTime < 3000 || lastCollectedTime === 0) {
                  // Chain is maintained
                  chainMultiplier = 1 + chainItemsCollected * 0.2; // Each item in chain adds 20% bonus
                } else {
                  // Chain is broken
                  chainItemsCollected = 1;
                  if (chainText) {
                    chainText.setText(`Chain: ${chainItemsCollected}/5 (broken)`);
                  }
                }
                lastCollectedTime = currentTime;
              }

              // Calculate final points with all multipliers
              const adjustedPoints = Math.floor(
                pointValue * goalGradientMultiplier * progressiveMultiplier * timeContextMultiplier * chainMultiplier
              );

              // Update the points
              pointsCollected += adjustedPoints;
              pointsText.setText(`Points: ${pointsCollected}`);

              // Create a floating text to show points earned
              const pointText = this.add.text(item.x, item.y, `+${adjustedPoints}`, {
                fontSize: "16px",
                color: itemType === "emerald" ? "#ff3333" : "#ffff00",
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
                let bonusText = "";

                if (baseMultiplier > 1) {
                  bonusText = "Goal Gradient Bonus Applied!";
                }

                if (progressiveMultiplier > 1) {
                  bonusText += "\nProgressive Load Bonus Applied!";
                }

                if (timeBonus > 0) {
                  bonusText += "\nTime Context Bonus Applied!";
                }

                if (chainItemsCollected >= 3) {
                  bonusText += `\nChain Reaction x${chainItemsCollected} Completed!`;
                }

                if (bonusText) {
                  const finalBonusText = this.add
                    .text(400, 300, bonusText, {
                      fontSize: "24px",
                      color: "#00ff00",
                      align: "center",
                    })
                    .setOrigin(0.5);

                  // Animate the bonus text
                  this.tweens.add({
                    targets: finalBonusText,
                    scaleX: 1.2,
                    scaleY: 1.2,
                    duration: 1000,
                    yoyo: true,
                    repeat: 1,
                    onComplete: function () {
                      finalBonusText.destroy();

                      // Set the collected points in the React state
                      setCollectedPoints(pointsCollected);
                      setShowSaveButton(true);

                      // Build bonus message for the UI
                      let bonusMessage = "";

                      if (baseMultiplier > 1) {
                        bonusMessage += "• Goal Gradient bonus: +" + ((baseMultiplier - 1) * 100).toFixed(0) + "%\n";
                      }

                      if (progressiveMultiplier > 1) {
                        bonusMessage +=
                          "• Progressive Load bonus: +" + ((progressiveMultiplier - 1) * 100).toFixed(0) + "%\n";
                      }

                      if (timeBonus > 0) {
                        bonusMessage += "• Time Context bonus: +" + (timeBonus * 100).toFixed(0) + "%\n";
                      }

                      if (chainItemsCollected >= 3) {
                        bonusMessage +=
                          "• Chain Reaction bonus: +" + (chainItemsCollected * 0.2 * 100).toFixed(0) + "%\n";
                      }

                      if (bonusMessage) {
                        setBonusMessage("You've earned bonuses:\n" + bonusMessage);
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
    return () => {
      if (gameInstanceRef.current) {
        gameInstanceRef.current.destroy(true);
      }
    };
  }, [habits, user]);

  // Save points to user account
  const savePoints = () => {
    if (collectedPoints > 0) {
      const updatedUser = {
        ...user,
        points: user.points + collectedPoints,
      };

      // Update chain reaction if applicable
      if (chainReactionActive) {
        updatedUser.chainReaction = {
          count: user.chainReaction.count + 1,
          lastCompletedAt: new Date().toISOString(),
        };
      }

      updateUser(updatedUser);
      setShowSaveButton(false);
      setCollectedPoints(0);
      setBonusMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <Header />
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Game Arena</h1>
          <div className="flex space-x-4">
            <Button onClick={() => setShowWizard(true)} className="mr-2 bg-purple-600 hover:bg-purple-700">
              Personalize Your Experience
            </Button>
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>

        {/* Render the wizard conditionally */}
        {showWizard && <KnowThyselfWizard isOpen={showWizard} onClose={() => setShowWizard(false)} />}

        <main>
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Mini-Game Arena</h1>
            <p className="text-blue-200">Collect items to earn points with bonus multipliers based on your habits!</p>
          </div>

          {/* Game explanation */}
          <div className="mb-6 rounded-lg bg-blue-900 p-4 text-white">
            <h2 className="mb-2 text-xl font-semibold">How to Play</h2>
            <p>
              Use arrow keys to move and collect stars. Stars represent your completed habits converted into a fun game
              experience. The more habits you complete, the more valuable the collectibles become!
            </p>
          </div>

          {/* Welcome message for new users */}
          {!user.preferences?.name && (
            <div className="mb-6 rounded-lg border border-green-500 bg-green-900/30 p-4">
              <h2 className="mb-2 text-xl font-semibold text-green-300">Welcome to LifeQuest RPG!</h2>
              <p className="mb-3 text-green-100">
                Personalize your experience by clicking the "Personalize Your Experience" button above. This will help
                optimize your rewards and bonuses based on your preferences and daily schedule.
              </p>
              <Button onClick={() => setShowWizard(true)} className="bg-green-600 hover:bg-green-700">
                Start Personalization Wizard
              </Button>
            </div>
          )}

          {/* Bonus Features Highlight */}
          <div className="mb-6 rounded-lg border border-blue-800 bg-blue-950/30 p-4">
            <h2 className="mb-2 text-lg font-semibold">Active Bonus Features:</h2>
            <div className="grid gap-2 md:grid-cols-2">
              {timeContextBonus > 0 && (
                <div className="rounded-md bg-blue-900/50 p-3">
                  <h3 className="font-semibold text-blue-300">Time Context Engine</h3>
                  <p className="text-sm text-blue-100">
                    Current time bonus: +{(timeContextBonus * 100).toFixed(0)}% points
                  </p>
                  {user.timeContext && (
                    <p className="mt-1 text-xs text-blue-200">
                      Optimized for your {user.timeContext.wakeTime} to {user.timeContext.sleepTime} schedule
                    </p>
                  )}
                </div>
              )}

              {chainReactionActive && (
                <div className="rounded-md bg-blue-900/50 p-3">
                  <h3 className="font-semibold text-blue-300">Chain Reaction</h3>
                  <p className="text-sm text-blue-100">Complete related activities in sequence for bonus points!</p>
                </div>
              )}

              <div className="rounded-md bg-blue-900/50 p-3">
                <h3 className="font-semibold text-blue-300">Goal Gradient System</h3>
                <p className="text-sm text-blue-100">Rewards increase as you approach completion of your goals.</p>
              </div>

              <div className="rounded-md bg-blue-900/50 p-3">
                <h3 className="font-semibold text-blue-300">Progressive Load</h3>
                <p className="text-sm text-blue-100">Challenges and rewards scale as you improve.</p>
                {user.progressiveLoad && (
                  <p className="mt-1 text-xs text-blue-200">
                    Current settings: {user.progressiveLoad.difficulty.toFixed(1)}x difficulty,{" "}
                    {user.progressiveLoad.reward.toFixed(1)}x rewards
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Game Container */}
          <div className="mb-6 overflow-hidden rounded-lg border border-blue-800 bg-black">
            <div ref={gameRef} className="h-[600px] w-full" />
          </div>

          {/* Game Controls */}
          <div className="mb-8 rounded-lg border border-blue-800 bg-blue-950/30 p-4">
            <h2 className="mb-2 text-lg font-semibold">Controls:</h2>
            <p className="text-blue-200">Use arrow keys to move and jump. Collect stars and diamonds for points!</p>
            {chainReactionActive && (
              <p className="mt-2 text-red-300">
                Chain Reaction Active: Collect emeralds in sequence for bonus multipliers!
              </p>
            )}
          </div>

          {/* Results Panel */}
          {showSaveButton && (
            <div className="rounded-lg border border-blue-800 bg-blue-950/30 p-6">
              <h2 className="mb-4 text-xl font-bold">Game Complete!</h2>
              <p className="mb-2 text-lg">
                You earned <span className="font-bold text-yellow-300">{collectedPoints} points</span>!
              </p>

              {bonusMessage && (
                <div className="mb-4 rounded-lg bg-blue-900/30 p-4 whitespace-pre-line text-blue-200">
                  {bonusMessage}
                </div>
              )}

              <div className="flex gap-4">
                <Button onClick={savePoints} className="bg-green-600 hover:bg-green-700">
                  Save Points to Account
                </Button>
                <Button
                  onClick={() => {
                    setShowSaveButton(false);
                    setCollectedPoints(0);
                    setBonusMessage("");
                    loadPhaser();
                  }}
                  variant="outline"
                >
                  Play Again
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
