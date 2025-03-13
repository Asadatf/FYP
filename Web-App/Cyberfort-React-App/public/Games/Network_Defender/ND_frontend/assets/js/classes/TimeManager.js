class TimeManager {
  constructor(scene) {
    this.scene = scene;
    this.totalTime = 60000; // 60 seconds in milliseconds
    this.timeRemaining = this.totalTime;
    this.isActive = false;
    this.penalties = 0;
    this.warningTween = null; // Initialize as null

    // Calculate responsive properties
    this.calculateResponsiveProperties();

    // Create timer display
    this.createTimerDisplay();

    // Create time purchase button
    this.createTimePurchaseButton();

    // Listen for screen resize
    this.scene.scale.on("resize", this.handleResize, this);
  }

  // Calculate responsive properties based on screen size
  calculateResponsiveProperties() {
    // Get current screen dimensions
    this.screenWidth = this.scene.scale.width;
    this.screenHeight = this.scene.scale.height;

    // Calculate scale factor based on screen dimensions
    this.scaleFactor = Math.min(
      this.screenWidth / 1280,
      this.screenHeight / 720
    );

    // Determine if we're on a mobile device
    this.isMobile = this.screenWidth < 768;

    // Calculate UI dimensions based on screen size
    this.containerWidth = Math.min(
      200 * this.scaleFactor,
      this.screenWidth * 0.25
    );
    this.containerHeight = Math.min(
      40 * this.scaleFactor,
      this.screenHeight * 0.06
    );

    // Calculate font sizes
    this.fontSize = Math.max(Math.floor(20 * this.scaleFactor), 12);
    this.iconSize = Math.max(Math.floor(20 * this.scaleFactor), 14);

    // Keep timer consistently at top left regardless of screen size
    this.timerX = 10;
    this.timerY = 10;

    // Calculate button sizes
    this.buttonWidth = Math.min(150 * this.scaleFactor, this.screenWidth * 0.2);
    this.buttonHeight = Math.min(
      50 * this.scaleFactor,
      this.screenHeight * 0.07
    );

    // Button position
    if (this.isMobile) {
      // For mobile, position at bottom center
      this.buttonX = this.screenWidth / 2;
      this.buttonY = this.screenHeight - this.buttonHeight / 2 - 10;
    } else {
      // For desktop, position at bottom right
      this.buttonX = this.screenWidth - this.buttonWidth / 2 - 10;
      this.buttonY = this.screenHeight - this.buttonHeight / 2 - 10;
    }
  }

  // Handle screen resize events
  handleResize() {
    // Recalculate responsive properties
    this.calculateResponsiveProperties();

    // Remove existing elements
    if (this.timerContainer) {
      this.timerContainer.destroy();
    }
    if (this.timeButtonContainer) {
      this.timeButtonContainer.destroy();
    }

    // Recreate UI elements with new sizes
    this.createTimerDisplay();
    this.createTimePurchaseButton();
  }

  createTimerDisplay() {
    // Timer container
    this.timerContainer = this.scene.add.container(this.timerX, this.timerY);

    // Background for timer
    const bg = this.scene.add
      .rectangle(0, 0, this.containerWidth, this.containerHeight, 0x000000, 0.7)
      .setOrigin(0, 0);

    // Timer icon with responsive size
    const timerIcon = this.scene.add
      .text(10, this.containerHeight / 2, "⏱️", {
        fontSize: this.iconSize + "px",
      })
      .setOrigin(0, 0.5);

    // Timer text with responsive font size
    this.timerText = this.scene.add
      .text(10 + this.iconSize + 10, this.containerHeight / 2, "60s", {
        fontSize: this.fontSize + "px",
        fontFamily: "Courier New",
        fill: "#00ff00",
      })
      .setOrigin(0, 0.5);

    this.timerContainer.add([bg, timerIcon, this.timerText]);

    // Create warning flash tween
    this.createWarningTween();

    // Make sure the container is visible on top
    this.timerContainer.setDepth(100);
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
    // Create a "Buy Time" button with responsive positioning and sizing
    const buttonX = this.buttonX;
    const buttonY = this.buttonY;

    // Create button container
    this.timeButtonContainer = this.scene.add.container(0, 0).setDepth(100);

    // Responsive button text size and padding
    const buttonTextSize = Math.max(Math.floor(18 * this.scaleFactor), 12);
    const buttonPadding = Math.max(Math.floor(10 * this.scaleFactor), 5);

    // Create button text based on available space and device
    const buttonText = this.isMobile ? "+5s" : "+5s (10 CC)";

    const buttonBg = this.scene.add
      .rectangle(
        buttonX,
        buttonY,
        this.buttonWidth,
        this.buttonHeight,
        0x003300,
        0.8
      )
      .setOrigin(0.5)
      .setStrokeStyle(2, 0x00ff00)
      .setInteractive()
      .on("pointerdown", () => this.purchaseExtraTime())
      .on("pointerover", () => buttonBg.setFillStyle(0x006600))
      .on("pointerout", () => buttonBg.setFillStyle(0x003300));

    // Add button text
    const textObj = this.scene.add
      .text(buttonX, buttonY, buttonText, {
        fontSize: buttonTextSize + "px",
        fontFamily: "Courier New",
        fill: "#00ff00",
        stroke: "#003300",
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    // Add items to button container
    this.timeButtonContainer.add([buttonBg, textObj]);
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

        // Create success effect scaled to screen size
        const successText = this.scene.add
          .text(
            this.scene.scale.width / 2,
            this.scene.scale.height / 2,
            "+5 SECONDS ADDED",
            {
              fontSize: Math.max(28 * this.scaleFactor, 18) + "px",
              fill: "#00ff00",
              backgroundColor: "#000000",
              padding: {
                x: 15 * this.scaleFactor,
                y: 10 * this.scaleFactor,
              },
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
              y: "-=" + 50 * this.scaleFactor,
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
        // Show insufficient funds message scaled to screen size
        const errorText = this.scene.add
          .text(
            this.scene.scale.width / 2,
            this.scene.scale.height / 2,
            "NOT ENOUGH COINS",
            {
              fontSize: Math.max(24 * this.scaleFactor, 16) + "px",
              fill: "#ff0000",
              backgroundColor: "#000000",
              padding: {
                x: 10 * this.scaleFactor,
                y: 5 * this.scaleFactor,
              },
            }
          )
          .setOrigin(0.5)
          .setDepth(1000);

        // Fade out error text
        this.scene.tweens.add({
          targets: errorText,
          alpha: 0,
          y: "-=" + 30 * this.scaleFactor,
          duration: 1500,
          onComplete: () => errorText.destroy(),
        });
      }
    }
  }

  destroy() {
    // Clean up resize listener
    this.scene.scale.off("resize", this.handleResize, this);

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

    // Create penalty flash effect with responsive sizing
    const penaltyText = this.scene.add
      .text(
        this.scene.scale.width / 2,
        this.scene.scale.height / 2,
        `-${seconds}s PENALTY`,
        {
          fontSize: Math.max(32 * this.scaleFactor, 20) + "px",
          fill: "#ff0000",
          stroke: "#000000",
          strokeThickness: 4,
        }
      )
      .setOrigin(0.5);

    this.scene.tweens.add({
      targets: penaltyText,
      alpha: 0,
      y: "-=" + 50 * this.scaleFactor,
      duration: 1000,
      ease: "Power2",
      onComplete: () => penaltyText.destroy(),
    });
  }
}

window.TimeManager = TimeManager;
