class ScoreManager {
  constructor(scene) {
    this.scene = scene;

    // Initialize score components
    this.totalScore = 0;
    this.scoreComponents = {
      networkConfig: 0, // Points for network device configuration
      encryption: 0, // Points for successful encryption
      securityScore: 0, // Security level of encryption methods
      attackPrevention: 0, // Points for preventing attacks
      timeBonus: 0, // Bonus points for completing tasks quickly
      achievements: 0, // Points from achievements
    };

    // Configuration for score values
    this.scoreValues = {
      deviceConfig: 50, // Points for configuring each device
      networkComplete: 100, // Bonus for completing the network
      encryptionBasic: 50, // Base points for encryption (Caesar)
      encryptionAdvanced: 100, // Advanced encryption (RSA)
      preventAttack: 75, // Preventing a man-in-the-middle attack
      timeBonusPerSecond: 5, // Points per second remaining
      securityThresholds: {
        // Security score thresholds
        low: 30,
        medium: 70,
        high: 100,
      },
    };

    // Create score display
    this.createScoreDisplay();

    // Listen for game events
    this.setupEventListeners();
  }

  createScoreDisplay() {
    // Score container - positioned in top-center of screen
    this.scoreContainer = this.scene.add
      .container(this.scene.scale.width / 2, 10)
      .setDepth(100);

    // Background for score
    const bg = this.scene.add
      .rectangle(0, 0, 300, 40, 0x000000, 0.7)
      .setOrigin(0.5, 0);

    // Score text
    this.scoreText = this.scene.add
      .text(0, 10, `SCORE: 0`, {
        fontSize: "20px",
        fontFamily: "Courier New",
        fill: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5, 0);

    // Add to container
    this.scoreContainer.add([bg, this.scoreText]);

    // Create minimized dashboard (expandable)
    this.createScoreDashboard();
  }

  createScoreDashboard() {
    // Create expandable dashboard container
    this.dashboardContainer = this.scene.add
      .container(this.scene.scale.width / 2, 80)
      .setDepth(100)
      .setAlpha(0); // Start hidden

    // Dashboard background
    const dashboardBg = this.scene.add
      .rectangle(0, 0, 400, 200, 0x000000, 0.85)
      .setOrigin(0.5, 0)
      .setStrokeStyle(2, 0x00ff00);

    // Dashboard title
    const dashboardTitle = this.scene.add
      .text(0, 10, "SCORE BREAKDOWN", {
        fontSize: "18px",
        fontFamily: "Courier New",
        fill: "#00ff00",
        fontStyle: "bold",
      })
      .setOrigin(0.5, 0);

    // Score component texts
    this.componentTexts = {};

    const components = [
      { key: "networkConfig", label: "Network Configuration" },
      { key: "encryption", label: "Encryption" },
      { key: "securityScore", label: "Security Rating" },
      { key: "attackPrevention", label: "Attack Prevention" },
      { key: "timeBonus", label: "Time Bonus" },
      { key: "achievements", label: "Achievements" },
    ];

    components.forEach((component, index) => {
      const y = 50 + index * 30;

      // Label
      const label = this.scene.add
        .text(-180, y, component.label + ":", {
          fontSize: "16px",
          fontFamily: "Courier New",
          fill: "#ffffff",
          align: "right",
        })
        .setOrigin(0, 0.5);

      // Value
      this.componentTexts[component.key] = this.scene.add
        .text(20, y, "0", {
          fontSize: "16px",
          fontFamily: "Courier New",
          fill: "#00ff00",
        })
        .setOrigin(0, 0.5);

      this.dashboardContainer.add([label, this.componentTexts[component.key]]);
    });

    // Total score at bottom
    const totalLabel = this.scene.add
      .text(-180, 190, "TOTAL SCORE:", {
        fontSize: "18px",
        fontFamily: "Courier New",
        fill: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0, 0.5);

    this.totalScoreText = this.scene.add
      .text(20, 190, "0", {
        fontSize: "18px",
        fontFamily: "Courier New",
        fill: "#00ff00",
        fontStyle: "bold",
      })
      .setOrigin(0, 0.5);

    // Add close button
    const closeButton = this.scene.add
      .text(180, 10, "X", {
        fontSize: "16px",
        fontFamily: "Courier New",
        fill: "#ff0000",
        backgroundColor: "#330000",
        padding: 5,
      })
      .setOrigin(0.5, 0)
      .setInteractive()
      .on("pointerdown", () => this.toggleDashboard(false));

    // Add all elements to container
    this.dashboardContainer.add([
      dashboardBg,
      dashboardTitle,
      totalLabel,
      this.totalScoreText,
      closeButton,
    ]);

    // Make score display clickable to show dashboard
    const hitArea = new Phaser.Geom.Rectangle(0, 0, 300, 40);
    this.scoreContainer
      .setInteractive(hitArea, Phaser.Geom.Rectangle.Contains)
      .on("pointerdown", () => this.toggleDashboard(true));
  }

  toggleDashboard(show) {
    // Update dashboard values before showing
    if (show) {
      this.updateDashboard();
    }

    // Animate dashboard
    this.scene.tweens.add({
      targets: this.dashboardContainer,
      alpha: show ? 1 : 0,
      y: show ? 60 : 80,
      duration: 300,
      ease: "Power2",
    });
  }

  updateDashboard() {
    // Update individual component scores
    Object.keys(this.scoreComponents).forEach((key) => {
      if (this.componentTexts[key]) {
        this.componentTexts[key].setText(this.scoreComponents[key].toString());
      }
    });

    // Update total score
    this.totalScoreText.setText(this.totalScore.toString());
  }

  setupEventListeners() {
    // Listen for network configuration events
    this.scene.events.on("deviceConfigured", this.onDeviceConfigured, this);
    this.scene.events.on("networkComplete", this.onNetworkComplete, this);

    // Listen for encryption events
    this.scene.events.on("encryptionComplete", this.onEncryptionComplete, this);

    // Listen for attack events
    this.scene.events.on("attackPrevented", this.onAttackPrevented, this);
    this.scene.events.on("attackFailed", this.onAttackFailed, this);

    // Listen for time bonus
    this.scene.events.on("levelComplete", this.onLevelComplete, this);

    // Game over event
    this.scene.events.on("gameOver", this.onGameOver, this);
  }

  // Event handlers
  onDeviceConfigured(deviceType) {
    this.addScore("networkConfig", this.scoreValues.deviceConfig);
    this.showScorePopup(
      this.scoreValues.deviceConfig,
      `${deviceType} Configured!`
    );
  }

  onNetworkComplete() {
    this.addScore("networkConfig", this.scoreValues.networkComplete);
    this.showScorePopup(this.scoreValues.networkComplete, "Network Complete!");
  }

  onEncryptionComplete(encryptionMethod, securityScore) {
    // Award points based on encryption method
    const basePoints =
      encryptionMethod === "rsa"
        ? this.scoreValues.encryptionAdvanced
        : this.scoreValues.encryptionBasic;

    this.addScore("encryption", basePoints);

    // Add security score component
    this.addScore("securityScore", securityScore);

    this.showScorePopup(basePoints + securityScore, "Message Encrypted!");
  }

  onAttackPrevented() {
    this.addScore("attackPrevention", this.scoreValues.preventAttack);
    this.showScorePopup(this.scoreValues.preventAttack, "Attack Prevented!");
  }

  onAttackFailed() {
    // Penalty for failed attack prevention
    this.addScore("attackPrevention", -this.scoreValues.preventAttack / 2);
    this.showScorePopup(
      -this.scoreValues.preventAttack / 2,
      "Attack Succeeded!",
      "#ff0000"
    );
  }

  onLevelComplete(remainingTime) {
    // Calculate time bonus
    const seconds = Math.floor(remainingTime / 1000);
    const bonus = seconds * this.scoreValues.timeBonusPerSecond;

    this.addScore("timeBonus", bonus);
    this.showScorePopup(bonus, `Time Bonus: ${seconds}s`);

    // Show final score
    this.showFinalScore();
  }

  onGameOver() {
    // Show final score
    this.showFinalScore();
  }

  // Helper methods
  addScore(component, points) {
    // Update component score
    this.scoreComponents[component] += points;

    // Update total score
    this.recalculateTotal();

    // Update display
    this.updateScoreDisplay();
  }

  recalculateTotal() {
    this.totalScore = Object.values(this.scoreComponents).reduce(
      (total, val) => total + val,
      0
    );
  }

  updateScoreDisplay() {
    this.scoreText.setText(`SCORE: ${this.totalScore}`);
  }

  showScorePopup(points, message, color = "#00ff00") {
    // Don't show popups for zero points
    if (points === 0) return;

    // Create score popup near the center of the screen
    const prefix = points > 0 ? "+" : "";
    const popupText = this.scene.add
      .text(
        this.scene.scale.width / 2,
        this.scene.scale.height / 2 - 100,
        `${message}\n${prefix}${points}`,
        {
          fontSize: "24px",
          fill: color,
          stroke: "#000000",
          strokeThickness: 4,
          align: "center",
          backgroundColor: points > 0 ? "#004400" : "#440000",
          padding: { x: 10, y: 5 },
        }
      )
      .setOrigin(0.5)
      .setDepth(1000);

    // Animate and remove
    this.scene.tweens.add({
      targets: popupText,
      y: "-=50",
      alpha: { from: 1, to: 0 },
      duration: 2000,
      ease: "Power2",
      onComplete: () => popupText.destroy(),
    });
  }

  showFinalScore() {
    // Create final score overlay
    const overlay = this.scene.add
      .rectangle(
        0,
        0,
        this.scene.scale.width,
        this.scene.scale.height,
        0x000000,
        0.8
      )
      .setOrigin(0)
      .setDepth(1000);

    // Add title
    const title = this.scene.add
      .text(
        this.scene.scale.width / 2,
        this.scene.scale.height / 3,
        "MISSION COMPLETE",
        {
          fontSize: "36px",
          fill: "#00ff00",
          fontStyle: "bold",
          stroke: "#000000",
          strokeThickness: 6,
        }
      )
      .setOrigin(0.5)
      .setDepth(1001);

    // Create score breakdown display
    const scoreBreakdown = this.scene.add
      .container(this.scene.scale.width / 2, this.scene.scale.height / 2)
      .setDepth(1001);

    // Background
    const breakdownBg = this.scene.add
      .rectangle(0, 0, 500, 300, 0x000033, 0.9)
      .setStrokeStyle(2, 0x00aaff);

    // Title
    const breakdownTitle = this.scene.add
      .text(0, -120, "SCORE BREAKDOWN", {
        fontSize: "24px",
        fill: "#00aaff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Score rows
    const components = [
      { key: "networkConfig", label: "Network Configuration" },
      { key: "encryption", label: "Message Encryption" },
      { key: "securityScore", label: "Security Rating" },
      { key: "attackPrevention", label: "Attack Prevention" },
      { key: "timeBonus", label: "Time Bonus" },
    ];

    // Check if achievements component exists
    if (this.scoreComponents.achievements) {
      components.push({ key: "achievements", label: "Achievements" });
    }

    const componentDisplays = [];
    components.forEach((component, index) => {
      const y = -70 + index * 30;

      // Label
      const label = this.scene.add
        .text(-200, y, component.label + ":", {
          fontSize: "18px",
          fill: "#ffffff",
        })
        .setOrigin(0, 0.5);

      // Value
      const value = this.scene.add
        .text(
          150,
          y,
          this.scoreComponents[component.key]
            ? this.scoreComponents[component.key].toString()
            : "0",
          {
            fontSize: "18px",
            fill: "#00ff00",
          }
        )
        .setOrigin(0, 0.5);

      componentDisplays.push(label, value);
    });

    // Line separator
    const separator = this.scene.add.graphics();
    separator.lineStyle(2, 0x00aaff, 1);
    separator.lineBetween(-200, 80, 200, 80);

    // Total score
    const totalLabel = this.scene.add
      .text(-200, 110, "TOTAL SCORE:", {
        fontSize: "24px",
        fill: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0, 0.5);

    const totalValue = this.scene.add
      .text(150, 110, this.totalScore.toString(), {
        fontSize: "24px",
        fill: "#00ff00",
        fontStyle: "bold",
      })
      .setOrigin(0, 0.5);

    // Continue button
    const continueButton = this.scene.add
      .rectangle(0, 170, 200, 50, 0x004477, 1)
      .setStrokeStyle(2, 0x00aaff);

    const continueText = this.scene.add
      .text(0, 170, "CONTINUE", {
        fontSize: "20px",
        fill: "#ffffff",
      })
      .setOrigin(0.5);

    // Make button interactive
    continueButton
      .setInteractive()
      .on("pointerover", () => {
        continueButton.fillColor = 0x0066aa;
        continueText.setScale(1.1);
      })
      .on("pointerout", () => {
        continueButton.fillColor = 0x004477;
        continueText.setScale(1);
      })
      .on("pointerdown", () => {
        // Check if score qualifies for high score list
        if (
          this.scene.highScoreManager &&
          this.scene.highScoreManager.checkHighScore(this.totalScore)
        ) {
          // Remove score breakdown
          scoreBreakdown.destroy();
          title.destroy();

          // Show high score input prompt
          this.scene.highScoreManager.showHighScorePrompt(this.totalScore);
        } else {
          // Return to title screen if no high score
          this.scene.scene.start("Title");
        }
      });

    // Add everything to the container
    scoreBreakdown.add([
      breakdownBg,
      breakdownTitle,
      ...componentDisplays,
      separator,
      totalLabel,
      totalValue,
      continueButton,
      continueText,
    ]);

    // Entrance animation
    scoreBreakdown.setScale(0.8);
    scoreBreakdown.alpha = 0;

    this.scene.tweens.add({
      targets: [title, scoreBreakdown],
      alpha: 1,
      scale: 1,
      duration: 500,
      ease: "Back.easeOut",
      delay: 500,
    });
  }

  // Add this score to the wallet for spending (optional)
  syncWithWallet() {
    // If wallet manager exists, we can add some of our score
    // as spendable currency
    if (this.scene.walletManager) {
      // Add 10% of score as coins, rounded to nearest 5
      const coinsToAdd = Math.round((this.totalScore * 0.1) / 5) * 5;
      this.scene.walletManager.addBonus(coinsToAdd);
    }
  }
}

window.ScoreManager = ScoreManager;
