class AchievementTracker {
  constructor(scene) {
    this.scene = scene;

    // Initialize achievements list
    this.achievements = [
      {
        id: "network_master",
        title: "Network Master",
        description: "Configure all network devices correctly",
        awarded: false,
        points: 100,
      },
      {
        id: "encryption_expert",
        title: "Encryption Expert",
        description: "Successfully use all encryption methods",
        awarded: false,
        points: 150,
        requirements: {
          caesar: false,
          automatic: false,
          rsa: false,
        },
      },
      {
        id: "security_guardian",
        title: "Security Guardian",
        description: "Prevent 3 man-in-the-middle attacks",
        awarded: false,
        points: 200,
        counter: 0,
        required: 3,
      },
      {
        id: "speed_demon",
        title: "Speed Demon",
        description: "Complete a level with 30+ seconds remaining",
        awarded: false,
        points: 250,
      },
      {
        id: "crypto_wizard",
        title: "Crypto Wizard",
        description: "Achieve a security score of 90+",
        awarded: false,
        points: 300,
      },
    ];

    // Set up achievement notification container
    this.setupAchievementNotification();

    // Listen for game events
    this.setupEventListeners();
  }

  setupAchievementNotification() {
    // Create notification container (off-screen initially)
    this.notificationContainer = this.scene.add
      .container(this.scene.scale.width + 300, this.scene.scale.height - 100)
      .setDepth(150);

    // Background
    const background = this.scene.add
      .rectangle(0, 0, 300, 80, 0x000000, 0.9)
      .setStrokeStyle(2, 0xffcc00);

    // Trophy icon
    const trophyIcon = this.scene.add
      .text(-120, 0, "🏆", { fontSize: "36px" })
      .setOrigin(0.5);

    // Text elements
    this.achievementTitle = this.scene.add
      .text(0, -15, "Achievement Unlocked!", {
        fontSize: "18px",
        fill: "#ffcc00",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.achievementDesc = this.scene.add
      .text(0, 15, "", {
        fontSize: "14px",
        fill: "#ffffff",
      })
      .setOrigin(0.5);

    // Points badge
    this.pointsBadge = this.scene.add.container(120, 0);

    const badgeCircle = this.scene.add.circle(0, 0, 25, 0xffcc00, 1);

    this.pointsText = this.scene.add
      .text(0, 0, "+100", {
        fontSize: "14px",
        fill: "#000000",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.pointsBadge.add([badgeCircle, this.pointsText]);

    // Add all elements to container
    this.notificationContainer.add([
      background,
      trophyIcon,
      this.achievementTitle,
      this.achievementDesc,
      this.pointsBadge,
    ]);
  }

  setupEventListeners() {
    // Listen for network configuration events
    this.scene.events.on("networkComplete", this.checkNetworkMaster, this);

    // Listen for encryption events
    this.scene.events.on(
      "encryptionComplete",
      this.checkEncryptionAchievements,
      this
    );

    // Listen for attack events
    this.scene.events.on("attackPrevented", this.checkSecurityGuardian, this);

    // Listen for level completion
    this.scene.events.on("levelComplete", this.checkSpeedDemon, this);
  }

  // Achievement check methods
  checkNetworkMaster() {
    const achievement = this.achievements.find(
      (a) => a.id === "network_master"
    );
    if (!achievement.awarded) {
      achievement.awarded = true;
      this.awardAchievement(achievement);
    }
  }

  checkEncryptionAchievements(encryptionMethod, securityScore) {
    const expertAchievement = this.achievements.find(
      (a) => a.id === "encryption_expert"
    );
    const wizardAchievement = this.achievements.find(
      (a) => a.id === "crypto_wizard"
    );

    // Track encryption method usage
    if (!expertAchievement.awarded && expertAchievement.requirements) {
      expertAchievement.requirements[encryptionMethod] = true;

      // Check if all encryption methods have been used
      if (Object.values(expertAchievement.requirements).every((v) => v)) {
        expertAchievement.awarded = true;
        this.awardAchievement(expertAchievement);
      }
    }

    // Check security score achievement
    if (!wizardAchievement.awarded && securityScore >= 90) {
      wizardAchievement.awarded = true;
      this.awardAchievement(wizardAchievement);
    }
  }

  checkSecurityGuardian() {
    const achievement = this.achievements.find(
      (a) => a.id === "security_guardian"
    );
    if (!achievement.awarded) {
      achievement.counter = (achievement.counter || 0) + 1;

      if (achievement.counter >= achievement.required) {
        achievement.awarded = true;
        this.awardAchievement(achievement);
      }
    }
  }

  checkSpeedDemon(remainingTime) {
    const achievement = this.achievements.find((a) => a.id === "speed_demon");
    const remainingSeconds = Math.ceil(remainingTime / 1000);

    if (!achievement.awarded && remainingSeconds >= 30) {
      achievement.awarded = true;
      this.awardAchievement(achievement);
    }
  }

  // Award achievement and show notification
  awardAchievement(achievement) {
    console.log(`Achievement unlocked: ${achievement.title}`);

    // Update score if ScoreManager exists
    if (this.scene.scoreManager) {
      this.scene.scoreManager.addScore("achievements", achievement.points);
    }

    // Show notification
    this.showAchievementNotification(achievement);

    // Save to local storage for persistence
    this.saveAchievements();
  }

  // Display achievement notification
  showAchievementNotification(achievement) {
    // Update notification text
    this.achievementTitle.setText(achievement.title);
    this.achievementDesc.setText(achievement.description);
    this.pointsText.setText(`+${achievement.points}`);

    // Reset position and slide in from right
    this.notificationContainer.x = this.scene.scale.width + 300;
    this.notificationContainer.alpha = 1;

    // Slide in animation
    this.scene.tweens.add({
      targets: this.notificationContainer,
      x: this.scene.scale.width - 160,
      duration: 800,
      ease: "Back.easeOut",
      onComplete: () => {
        // Wait a few seconds then slide out
        this.scene.time.delayedCall(3000, () => {
          this.scene.tweens.add({
            targets: this.notificationContainer,
            x: this.scene.scale.width + 300,
            duration: 800,
            ease: "Back.easeIn",
          });
        });
      },
    });

    // Add a confetti particle effect
    this.createConfettiEffect();
  }

  // Create confetti particle effect for achievement notification
  createConfettiEffect() {
    try {
      // Use packet image if available
      const particles = this.scene.add.particles(
        this.scene.scale.width - 160,
        this.scene.scale.height - 100,
        "packet",
        {
          speed: { min: 100, max: 300 },
          angle: { min: 230, max: 310 },
          scale: { start: 0.05, end: 0 },
          lifespan: 2000,
          blendMode: "ADD",
          tint: [0xffff00, 0x00ff00, 0x00ffff, 0xff00ff],
          quantity: 20,
        }
      );

      // Auto destroy after animation completes
      this.scene.time.delayedCall(2000, () => {
        particles.destroy();
      });
    } catch (e) {
      console.error("Error creating achievement particles:", e);
    }
  }

  // Save achievements to localStorage
  saveAchievements() {
    try {
      // Filter just the data we need to save
      const achievementData = this.achievements.map((a) => ({
        id: a.id,
        awarded: a.awarded,
        counter: a.counter || 0,
        requirements: a.requirements,
      }));

      // Save to localStorage
      localStorage.setItem(
        "networkDefender_achievements",
        JSON.stringify(achievementData)
      );
    } catch (e) {
      console.error("Error saving achievements:", e);
    }
  }

  // Load achievements from localStorage
  loadAchievements() {
    try {
      const savedData = localStorage.getItem("networkDefender_achievements");

      if (savedData) {
        const achievementData = JSON.parse(savedData);

        // Update our achievements with saved data
        achievementData.forEach((saved) => {
          const achievement = this.achievements.find((a) => a.id === saved.id);
          if (achievement) {
            achievement.awarded = saved.awarded;
            if (saved.counter) achievement.counter = saved.counter;
            if (saved.requirements)
              achievement.requirements = saved.requirements;
          }
        });
      }
    } catch (e) {
      console.error("Error loading achievements:", e);
    }
  }

  // Display achievements menu
  showAchievementsMenu() {
    // Create a container for the menu
    const menuContainer = this.scene.add
      .container(this.scene.scale.width / 2, this.scene.scale.height / 2)
      .setDepth(1000);

    // Background overlay
    const overlay = this.scene.add
      .rectangle(
        0,
        0,
        this.scene.scale.width,
        this.scene.scale.height,
        0x000000,
        0.8
      )
      .setOrigin(0.5);

    // Achievement panel
    const panel = this.scene.add
      .rectangle(0, 0, 600, 400, 0x000000, 0.9)
      .setStrokeStyle(2, 0xffcc00);

    // Title
    const title = this.scene.add
      .text(0, -170, "ACHIEVEMENTS", {
        fontSize: "32px",
        fill: "#ffcc00",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Create list of achievements
    const achievementItems = [];
    let yPos = -120;

    this.achievements.forEach((achievement) => {
      // Achievement container
      const achievementContainer = this.scene.add.container(0, yPos);

      // Background - different color based on unlocked status
      const itemBg = this.scene.add
        .rectangle(
          0,
          0,
          550,
          50,
          achievement.awarded ? 0x003300 : 0x330000,
          0.7
        )
        .setStrokeStyle(1, achievement.awarded ? 0x00ff00 : 0x880000);

      // Trophy icon
      const trophy = this.scene.add
        .text(-250, 0, achievement.awarded ? "🏆" : "🔒", { fontSize: "24px" })
        .setOrigin(0.5);

      // Achievement text
      const achievementTitle = this.scene.add
        .text(-200, -10, achievement.title, {
          fontSize: "18px",
          fill: achievement.awarded ? "#00ff00" : "#888888",
          fontStyle: achievement.awarded ? "bold" : "normal",
        })
        .setOrigin(0, 0.5);

      const achievementDesc = this.scene.add
        .text(-200, 10, achievement.description, {
          fontSize: "14px",
          fill: achievement.awarded ? "#ffffff" : "#666666",
        })
        .setOrigin(0, 0.5);

      // Points display
      const pointsText = this.scene.add
        .text(230, 0, `+${achievement.points}`, {
          fontSize: "18px",
          fill: achievement.awarded ? "#ffcc00" : "#666666",
          fontStyle: "bold",
        })
        .setOrigin(0.5);

      // Add progress if applicable
      if (
        !achievement.awarded &&
        achievement.counter !== undefined &&
        achievement.required
      ) {
        const progressText = this.scene.add
          .text(150, 0, `${achievement.counter}/${achievement.required}`, {
            fontSize: "14px",
            fill: "#888888",
          })
          .setOrigin(0.5);

        achievementContainer.add(progressText);
      }

      // Add all elements to container
      achievementContainer.add([
        itemBg,
        trophy,
        achievementTitle,
        achievementDesc,
        pointsText,
      ]);
      achievementItems.push(achievementContainer);

      yPos += 60;
    });

    // Close button
    const closeButton = this.scene.add
      .rectangle(0, 170, 160, 50, 0x000000, 0.8)
      .setStrokeStyle(2, 0xffcc00)
      .setInteractive();

    const closeText = this.scene.add
      .text(0, 170, "CLOSE", {
        fontSize: "20px",
        fill: "#ffcc00",
      })
      .setOrigin(0.5);

    // Add hover effect
    closeButton
      .on("pointerover", () => {
        closeButton.fillColor = 0x331100;
        closeText.setScale(1.1);
      })
      .on("pointerout", () => {
        closeButton.fillColor = 0x000000;
        closeText.setScale(1);
      })
      .on("pointerdown", () => {
        // Animate menu closing
        this.scene.tweens.add({
          targets: menuContainer,
          alpha: 0,
          scale: 0.8,
          duration: 300,
          ease: "Power2",
          onComplete: () => menuContainer.destroy(),
        });
      });

    // Add all elements to menu container
    menuContainer.add([
      overlay,
      panel,
      title,
      ...achievementItems,
      closeButton,
      closeText,
    ]);

    // Animate menu opening
    menuContainer.setScale(0.8);
    menuContainer.alpha = 0;

    this.scene.tweens.add({
      targets: menuContainer,
      scale: 1,
      alpha: 1,
      duration: 300,
      ease: "Power2",
    });

    return menuContainer;
  }
}

window.AchievementTracker = AchievementTracker;
