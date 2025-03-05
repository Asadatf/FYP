class TimeManager {
  constructor(scene) {
    this.scene = scene;
    this.totalTime = 60000; // 60 seconds in milliseconds
    this.timeRemaining = this.totalTime;
    this.isActive = false;
    this.penalties = 0;
    this.warningTween = null; // Initialize as null

    // Create timer display
    this.createTimerDisplay();

    // NEW CODE: Add time purchase button
    this.createTimePurchaseButton();
  }

  createTimerDisplay() {
    // Timer container
    this.timerContainer = this.scene.add.container(10, 10);

    // Background for timer
    const bg = this.scene.add
      .rectangle(0, 0, 200, 40, 0x000000, 0.7)
      .setOrigin(0, 0);

    // Timer icon
    const timerIcon = this.scene.add
      .text(10, 10, "⏱️", { fontSize: "20px" })
      .setOrigin(0, 0);

    // Timer text
    this.timerText = this.scene.add
      .text(40, 10, "60:00", {
        fontSize: "20px",
        fontFamily: "Courier New",
        fill: "#00ff00",
      })
      .setOrigin(0, 0);

    this.timerContainer.add([bg, timerIcon, this.timerText]);

    // Create warning flash tween
    this.createWarningTween();
  }

  createWarningTween() {
    // Create the warning tween but don't start it yet
    this.warningTween = this.scene.tweens.create({
      targets: this.timerText,
      alpha: { from: 1, to: 0.2 },
      duration: 500,
      yoyo: true,
      repeat: -1,
      paused: true, // Start paused
    });
  }

  createTimePurchaseButton() {
    // Create a "Buy Time" button in the bottom right corner
    const buttonX = this.scene.scale.width - 100;
    const buttonY = this.scene.scale.height - 50;

    // Create button container (separate from timer container)
    this.timeButtonContainer = this.scene.add.container(0, 0).setDepth(100);

    const buttonBg = this.scene.add
      .rectangle(buttonX, buttonY, 150, 50, 0x003300, 0.8)
      .setOrigin(0.5)
      .setStrokeStyle(2, 0x00ff00)
      .setInteractive()
      .on("pointerdown", () => this.purchaseExtraTime())
      .on("pointerover", () => buttonBg.setFillStyle(0x006600))
      .on("pointerout", () => buttonBg.setFillStyle(0x003300));

    // Add button text
    const buttonText = this.scene.add
      .text(buttonX, buttonY, "+5s (10 CC)", {
        fontSize: "18px",
        fontFamily: "Courier New",
        fill: "#00ff00",
        stroke: "#003300",
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    // Add items to button container
    this.timeButtonContainer.add([buttonBg, buttonText]);
  }

  purchaseExtraTime() {
    // Only allow time purchase when timer is active
    if (!this.isActive) return;

    // Check if player has enough coins
    if (
      this.scene.walletManager &&
      typeof this.scene.walletManager.spend === "function"
    ) {
      const purchased = this.scene.walletManager.spend(10);

      if (purchased) {
        // Add 5 seconds to timer
        this.timeRemaining += 5000; // 5 seconds in milliseconds

        // Create success effect
        const successText = this.scene.add
          .text(
            this.scene.scale.width / 2,
            this.scene.scale.height / 2,
            "+5 SECONDS ADDED",
            {
              fontSize: "28px",
              fill: "#00ff00",
              backgroundColor: "#000000",
              padding: { x: 15, y: 10 },
              stroke: "#ffffff",
              strokeThickness: 2,
            }
          )
          .setOrigin(0.5)
          .setDepth(1000);

        // Add pulse effect
        this.scene.tweens.add({
          targets: successText,
          scale: { from: 0.8, to: 1.2 },
          duration: 500,
          yoyo: true,
          repeat: 1,
          onComplete: () => {
            this.scene.tweens.add({
              targets: successText,
              alpha: 0,
              y: "-=50",
              duration: 500,
              onComplete: () => successText.destroy(),
            });
          },
        });

        // Flash the timer text to indicate time added
        this.timerText.setColor("#00ffff");
        this.scene.time.delayedCall(500, () => {
          this.timerText.setColor("#00ff00");
        });
      } else {
        // Show insufficient funds message
        const errorText = this.scene.add
          .text(
            this.scene.scale.width / 2,
            this.scene.scale.height / 2,
            "NOT ENOUGH CYBERCOINS",
            {
              fontSize: "24px",
              fill: "#ff0000",
              backgroundColor: "#000000",
              padding: { x: 10, y: 5 },
            }
          )
          .setOrigin(0.5)
          .setDepth(1000);

        // Fade out error text
        this.scene.tweens.add({
          targets: errorText,
          alpha: 0,
          y: "-=30",
          duration: 1500,
          onComplete: () => errorText.destroy(),
        });
      }
    }
  }

  destroy() {
    if (this.warningTween) {
      this.warningTween.stop();
      this.warningTween = null;
    }
    if (this.timerEvent) {
      this.timerEvent.remove();
    }
    if (this.timerContainer) {
      this.timerContainer.destroy();
    }
    if (this.timeButtonContainer) {
      this.timeButtonContainer.destroy();
    }
  }

  startTimer() {
    if (!this.isActive) {
      this.isActive = true;
      this.lastUpdate = this.scene.time.now;

      // Create timer event
      this.timerEvent = this.scene.time.addEvent({
        delay: 100,
        callback: this.updateTimer,
        callbackScope: this,
        loop: true,
      });
    }
  }

  updateTimer() {
    if (!this.isActive) return;

    const currentTime = this.scene.time.now;
    const delta = currentTime - this.lastUpdate;
    this.lastUpdate = currentTime;

    // this.timeRemaining -= delta;

    // Update display
    const seconds = Math.ceil(this.timeRemaining / 1000);
    this.timerText.setText(`${seconds.toString().padStart(2, "0")}s`);

    // Warning colors based on time remaining
    if (seconds <= 10) {
      this.timerText.setColor("#ff0000");
      if (this.warningTween && !this.warningTween.isPlaying()) {
        this.warningTween.play();
      }
    } else if (seconds <= 20) {
      this.timerText.setColor("#ff9900");
      if (this.warningTween && this.warningTween.isPlaying()) {
        this.warningTween.stop();
        this.timerText.alpha = 1; // Reset alpha
      }
    } else {
      this.timerText.setColor("#00ff00");
      if (this.warningTween && this.warningTween.isPlaying()) {
        this.warningTween.stop();
        this.timerText.alpha = 1; // Reset alpha
      }
    }

    // Time's up
    if (this.timeRemaining <= 0) {
      this.timeRemaining = 0;
      this.isActive = false;
      this.timerEvent.remove();
      if (this.warningTween) {
        this.warningTween.stop();
        this.timerText.alpha = 1; // Reset alpha
      }
      this.scene.events.emit("timeUp");
    }
  }

  addPenalty(seconds) {
    this.timeRemaining -= seconds * 1000;
    this.penalties += 1;

    // Create penalty flash effect
    const penaltyText = this.scene.add
      .text(
        this.scene.scale.width / 2,
        this.scene.scale.height / 2,
        `-${seconds}s PENALTY`,
        {
          fontSize: "32px",
          fill: "#ff0000",
          stroke: "#000000",
          strokeThickness: 4,
        }
      )
      .setOrigin(0.5);

    this.scene.tweens.add({
      targets: penaltyText,
      alpha: 0,
      y: "-=50",
      duration: 1000,
      ease: "Power2",
      onComplete: () => penaltyText.destroy(),
    });
  }

  // Clean up when scene is shut down
  destroy() {
    if (this.warningTween) {
      this.warningTween.stop();
      this.warningTween = null;
    }
    if (this.timerEvent) {
      this.timerEvent.remove();
    }
    this.timerContainer.destroy();
  }
}

window.TimeManager = TimeManager;
