class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameOverScene" });
  }

  init(data) {
    this.finalScore = data.score || 0;
  }

  create() {
    // Setup digital background
    this.cameras.main.setBackgroundColor("#0a0a2a");

    // Create grid effect
    const gridGraphics = this.add.graphics();
    gridGraphics.lineStyle(1, 0x00ffff, 0.2);

    // Draw vertical lines
    for (let x = 0; x <= 800; x += 40) {
      gridGraphics.moveTo(x, 0);
      gridGraphics.lineTo(x, 600);
    }

    // Draw horizontal lines
    for (let y = 0; y <= 600; y += 40) {
      gridGraphics.moveTo(0, y);
      gridGraphics.lineTo(800, y);
    }

    gridGraphics.strokePath();

    // Create summary panel with cyber style
    const panel = this.add
      .rectangle(400, 300, 500, 400, 0x000000, 0.8)
      .setStrokeStyle(3, 0x00ffff);

    // Determine status based on score
    const succeeded = this.finalScore >= 50;
    const resultTitle = succeeded ? "MISSION COMPLETE" : "MISSION FAILED";
    const resultColor = succeeded ? "#00ff00" : "#ff0000";

    // Add mission status with glow effect
    const gameOver = this.add
      .text(400, 180, resultTitle, {
        fontSize: "40px",
        fontFamily: "Arial Black, Arial",
        fill: resultColor,
        stroke: "#000000",
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    // Create pulse animation
    this.tweens.add({
      targets: gameOver,
      scale: 1.1,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    // Add security rating
    let rating, ratingColor;
    if (this.finalScore >= 200) {
      rating = "S+";
      ratingColor = "#ffff00";
    } else if (this.finalScore >= 150) {
      rating = "A";
      ratingColor = "#00ff00";
    } else if (this.finalScore >= 100) {
      rating = "B";
      ratingColor = "#00ffff";
    } else if (this.finalScore >= 50) {
      rating = "C";
      ratingColor = "#ffffff";
    } else {
      rating = "D";
      ratingColor = "#ff0000";
    }

    // Add final score with counting animation
    const scoreText = this.add
      .text(400, 250, "FINAL SCORE: 0", {
        fontSize: "32px",
        fontFamily: "Arial",
        fill: "#ffffff",
      })
      .setOrigin(0.5);

    // Animated counter
    let displayScore = 0;
    const scoreCounter = this.time.addEvent({
      delay: 30,
      callback: () => {
        displayScore = Math.min(
          displayScore + Math.ceil(this.finalScore / 50),
          this.finalScore
        );
        scoreText.setText(`FINAL SCORE: ${displayScore}`);

        if (displayScore >= this.finalScore) {
          // Display rating when counter finishes
          this.displayRating(rating, ratingColor);
        }
      },
      repeat: 50,
    });

    // Add decorative elements
    const decor1 = this.add.graphics();
    decor1.lineStyle(2, 0x00ffff, 0.7);
    decor1.strokeCircle(400, 300, 180);

    const decor2 = this.add.graphics();
    decor2.lineStyle(2, 0x00ffff, 0.5);
    decor2.strokeCircle(400, 300, 190);

    // Rotate decoration
    this.tweens.add({
      targets: [decor1, decor2],
      rotation: Math.PI * 2,
      duration: 10000,
      repeat: -1,
    });

    // Add restart button with cyber style
    const restartButton = this.add
      .rectangle(400, 400, 200, 50, 0x000000)
      .setStrokeStyle(2, 0x00ffff)
      .setInteractive({ useHandCursor: true });

    const restartText = this.add
      .text(400, 400, "PLAY AGAIN", {
        fontSize: "24px",
        fontFamily: "Arial",
        fill: "#00ffff",
      })
      .setOrigin(0.5);

    // Button hover effects
    restartButton.on("pointerover", () => {
      restartButton.setFillStyle(0x001133);
      restartText.setScale(1.1);
    });

    restartButton.on("pointerout", () => {
      restartButton.setFillStyle(0x000000);
      restartText.setScale(1);
    });

    // Restart game with transition
    restartButton.on("pointerdown", () => {
      // Play click sound if available
      if (this.sound.get("click")) {
        this.sound.play("click");
      }

      this.cameras.main.fade(500, 0, 0, 0);
      this.time.delayedCall(500, () => {
        this.scene.start("GameScene");
      });
    });

    // Add main menu button
    const menuButton = this.add
      .rectangle(400, 470, 200, 50, 0x000000)
      .setStrokeStyle(2, 0x00ffff)
      .setInteractive({ useHandCursor: true });

    const menuText = this.add
      .text(400, 470, "MAIN MENU", {
        fontSize: "24px",
        fontFamily: "Arial",
        fill: "#00ffff",
      })
      .setOrigin(0.5);

    // Button hover effects
    menuButton.on("pointerover", () => {
      menuButton.setFillStyle(0x001133);
      menuText.setScale(1.1);
    });

    menuButton.on("pointerout", () => {
      menuButton.setFillStyle(0x000000);
      menuText.setScale(1);
    });

    // Go to main menu
    menuButton.on("pointerdown", () => {
      // Play click sound if available
      if (this.sound.get("click")) {
        this.sound.play("click");
      }

      this.cameras.main.fade(500, 0, 0, 0);
      this.time.delayedCall(500, () => {
        this.scene.start("MenuScene");
      });
    });
  }

  displayRating(rating, color) {
    // Create security rating display with animation
    const ratingTitle = this.add
      .text(400, 320, "SECURITY RATING", {
        fontSize: "24px",
        fontFamily: "Arial",
        fill: "#ffffff",
      })
      .setOrigin(0.5);

    const ratingText = this.add
      .text(400, 350, rating, {
        fontSize: "72px",
        fontFamily: "Arial Black",
        fill: color,
        stroke: "#000000",
        strokeThickness: 6,
      })
      .setOrigin(0.5)
      .setAlpha(0)
      .setScale(2);

    // Dramatic reveal
    this.tweens.add({
      targets: ratingText,
      alpha: 1,
      scale: 1,
      duration: 800,
      ease: "Power2",
    });

    // Add rating circle
    const ratingCircle = this.add.circle(400, 350, 60);
    ratingCircle.setStrokeStyle(3, 0x00ffff);

    // Pulse effect
    this.tweens.add({
      targets: ratingCircle,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 1000,
      yoyo: true,
      repeat: -1,
    });
  }
}
