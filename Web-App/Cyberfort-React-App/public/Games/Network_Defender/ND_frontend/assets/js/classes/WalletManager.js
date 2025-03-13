class WalletManager {
  constructor(scene) {
    this.scene = scene;
    this.coins = 50; // Starting amount

    // Calculate responsive properties
    this.calculateResponsiveProperties();

    // Create wallet display with responsive sizing
    this.createWalletDisplay();

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

    // Position wallet next to timer (fixed position regardless of screen size)
    // Get timer width if accessible
    let timerWidth = 220; // Default value if we can't access TimeManager
    if (this.scene.timeManager && this.scene.timeManager.containerWidth) {
      timerWidth = this.scene.timeManager.containerWidth;
    }

    // Position wallet directly next to the timer with a small gap
    this.walletX = 20 + timerWidth;
    this.walletY = 10;

    // Calculate animation parameters
    this.animationDistance = 30 * this.scaleFactor;
    this.animationDuration = 1000;
  }

  // Handle screen resize events
  handleResize() {
    // Recalculate responsive properties
    this.calculateResponsiveProperties();

    // Remove existing elements
    if (this.walletContainer) {
      this.walletContainer.destroy();
    }

    // Recreate UI elements with new sizes
    this.createWalletDisplay();
  }

  createWalletDisplay() {
    // Wallet container
    this.walletContainer = this.scene.add.container(this.walletX, this.walletY);

    // Background with responsive sizing
    const bg = this.scene.add
      .rectangle(0, 0, this.containerWidth, this.containerHeight, 0x000000, 0.7)
      .setOrigin(0, 0);

    // Coin icon with responsive positioning
    const coinIcon = this.scene.add
      .text(10, this.containerHeight / 2, "💰", {
        fontSize: this.iconSize + "px",
      })
      .setOrigin(0, 0.5);

    // Coin amount text with responsive font size
    this.coinText = this.scene.add
      .text(
        10 + this.iconSize + 10,
        this.containerHeight / 2,
        `${this.coins} CC`,
        {
          fontSize: this.fontSize + "px",
          fontFamily: "Courier New",
          fill: "#ffd700",
        }
      )
      .setOrigin(0, 0.5);

    this.walletContainer.add([bg, coinIcon, this.coinText]);

    // Make sure the container is visible on top
    this.walletContainer.setDepth(100);
  }

  spend(amount) {
    if (this.coins >= amount) {
      this.coins -= amount;
      this.updateDisplay();

      // Create spending effect with responsive sizing
      this.createSpendingEffect(amount);
      return true;
    }
    return false;
  }

  createSpendingEffect(amount) {
    // Calculate position based on wallet container
    const effectX = this.walletX + this.containerWidth / 2;
    const effectY = this.walletY + this.containerHeight / 2;

    // Create text with responsive font size
    const spendText = this.scene.add
      .text(effectX, effectY, `-${amount} CC`, {
        fontSize: Math.max(24 * this.scaleFactor, 16) + "px",
        fill: "#ff0000",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setDepth(101);

    // Animate with responsive distance
    this.scene.tweens.add({
      targets: spendText,
      alpha: 0,
      y: effectY + this.animationDistance,
      duration: this.animationDuration,
      ease: "Power2",
      onComplete: () => spendText.destroy(),
    });
  }

  addBonus(amount) {
    this.coins += amount;
    this.updateDisplay();

    // Create bonus effect with responsive sizing
    // Calculate position based on wallet container
    const effectX = this.walletX + this.containerWidth / 2;
    const effectY = this.walletY + this.containerHeight / 2;

    // Create text with responsive font size
    const bonusText = this.scene.add
      .text(effectX, effectY, `+${amount} CC`, {
        fontSize: Math.max(24 * this.scaleFactor, 16) + "px",
        fill: "#00ff00",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setDepth(101);

    // Animate with responsive distance
    this.scene.tweens.add({
      targets: bonusText,
      alpha: 0,
      y: effectY - this.animationDistance,
      duration: this.animationDuration,
      ease: "Power2",
      onComplete: () => bonusText.destroy(),
    });
  }

  updateDisplay() {
    if (this.coinText) {
      this.coinText.setText(`${this.coins} CC`);
    }
  }

  // New method to create dramatic coin animation for important bonuses
  createDramaticBonusEffect(amount, x, y) {
    // Only show for significant bonuses
    if (amount < 10) return;

    // Create a more dramatic effect for large bonuses
    const largeText = this.scene.add
      .text(
        x || this.scene.scale.width / 2,
        y || this.scene.scale.height / 2,
        `+${amount} COINS`,
        {
          fontSize: Math.max(36 * this.scaleFactor, 24) + "px",
          fill: "#ffff00",
          stroke: "#000000",
          strokeThickness: 6,
          shadow: {
            offsetX: 2,
            offsetY: 2,
            color: "#000",
            blur: 5,
            fill: true,
          },
        }
      )
      .setOrigin(0.5)
      .setDepth(1000)
      .setAlpha(0);

    // Create coin particles if possible
    try {
      const particles = this.scene.add.particles(
        x || this.scene.scale.width / 2,
        y || this.scene.scale.height / 2,
        "packet", // Use packet image if coin image not available
        {
          speed: { min: 100 * this.scaleFactor, max: 200 * this.scaleFactor },
          scale: { start: 0.1 * this.scaleFactor, end: 0 },
          quantity: Math.min(amount, 20), // Cap at 20 particles
          lifespan: 1000,
          tint: 0xffff00,
        }
      );

      // Clean up particles
      this.scene.time.delayedCall(1000, () => {
        particles.destroy();
      });
    } catch (e) {
      // Particles not available, skip
    }

    // Animate text
    this.scene.tweens.add({
      targets: largeText,
      alpha: 1,
      scale: { from: 0.5, to: 1.2 },
      duration: 500,
      ease: "Back.easeOut",
      onComplete: () => {
        this.scene.tweens.add({
          targets: largeText,
          scale: 1,
          duration: 500,
          ease: "Sine.easeInOut",
          yoyo: true,
          repeat: 1,
          onComplete: () => {
            this.scene.tweens.add({
              targets: largeText,
              alpha: 0,
              y: y - 50 * this.scaleFactor,
              duration: 500,
              onComplete: () => largeText.destroy(),
            });
          },
        });
      },
    });

    // Also update the regular display
    this.updateDisplay();
  }

  // Method to show a warning when funds are low
  showLowFundsWarning() {
    if (this.coins < 10 && !this.warningActive) {
      this.warningActive = true;

      // Create warning text
      const warningText = this.scene.add
        .text(
          this.walletX + this.containerWidth / 2,
          this.walletY + this.containerHeight + 20,
          "LOW FUNDS!",
          {
            fontSize: Math.max(16 * this.scaleFactor, 12) + "px",
            fill: "#ff8800",
            backgroundColor: "#000000",
            padding: { x: 5, y: 3 },
            stroke: "#000000",
            strokeThickness: 2,
          }
        )
        .setOrigin(0.5)
        .setDepth(101);

      // Flash warning
      this.scene.tweens.add({
        targets: warningText,
        alpha: 0.5,
        duration: 500,
        yoyo: true,
        repeat: 3,
        onComplete: () => {
          warningText.destroy();
          this.warningActive = false;
        },
      });
    }
  }

  // Clean up when scene is shut down
  destroy() {
    // Remove event listener
    this.scene.scale.off("resize", this.handleResize, this);

    // Destroy container
    if (this.walletContainer) {
      this.walletContainer.destroy();
    }
  }
}

window.WalletManager = WalletManager;
