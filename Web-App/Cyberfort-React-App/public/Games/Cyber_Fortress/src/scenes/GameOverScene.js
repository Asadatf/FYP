class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
    this.highScoreManager = new HighScore();
  }

  init(data) {
    this.victory = data.victory || false;
    this.score = data.score || 0;
    this.level = data.level || 1;
    this.threatsResolved = data.threatsResolved || 0;
  }

  create() {
    const { width, height } = this.cameras.main;

    // Create background with cyber grid effect
    this.createBackground();

    // Create modal container
    const modalWidth = 450;
    const modalHeight = 350;
    const container = this.add.container(width / 2, height / 2);

    // Modal background
    const modalBg = this.add
      .rectangle(0, 0, modalWidth, modalHeight, 0x2d2d2d)
      .setStrokeStyle(3, this.victory ? 0x00aaff : 0xff3333);
    container.add(modalBg);

    // Title
    const titleText = this.victory ? "MISSION SUCCESSFUL!" : "SYSTEM BREACH!";
    const titleColor = this.victory ? "#00aaff" : "#ff3333";

    const title = this.add
      .text(0, -modalHeight / 2 + 40, titleText, {
        font: "bold 32px Arial",
        fill: titleColor,
        stroke: "#000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);
    container.add(title);

    // Stats
    const statsStyle = {
      font: "20px Arial",
      fill: "#ffffff",
    };

    const scoreText = this.add
      .text(0, -60, `Final Score: ${this.score}`, statsStyle)
      .setOrigin(0.5);
    const levelText = this.add
      .text(0, -20, `Level Reached: ${this.level}`, statsStyle)
      .setOrigin(0.5);
    const threatsText = this.add
      .text(0, 20, `Threats Resolved: ${this.threatsResolved}`, statsStyle)
      .setOrigin(0.5);
    const statusText = this.add
      .text(
        0,
        60,
        `Network Status: ${this.victory ? "Secured" : "Compromised"}`,
        {
          font: "20px Arial",
          fill: this.victory ? "#00cc66" : "#ff3333",
        }
      )
      .setOrigin(0.5);

    container.add([scoreText, levelText, threatsText, statusText]);

    // Restart button
    const restartButton = this.add
      .rectangle(0, 120, 220, 50, 0x0066cc)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => restartButton.setFillStyle(0x0077dd))
      .on("pointerout", () => restartButton.setFillStyle(0x0066cc))
      .on("pointerdown", () => this.restartGame());

    const restartText = this.add
      .text(0, 120, "REINITIALIZE SYSTEM", {
        font: "bold 18px Arial",
        fill: "#ffffff",
      })
      .setOrigin(0.5);

    container.add([restartButton, restartText]);

    // High score notification if applicable
    const highScore = this.highScoreManager.getHighScore();
    if (this.score > highScore) {
      const newHighScoreText = this.add
        .text(0, modalHeight / 2 - 40, "NEW HIGH SCORE!", {
          font: "bold 22px Arial",
          fill: "#ffdd00",
        })
        .setOrigin(0.5);

      container.add(newHighScoreText);

      // Add flash animation to high score text
      this.tweens.add({
        targets: newHighScoreText,
        alpha: { from: 1, to: 0.5 },
        duration: 500,
        yoyo: true,
        repeat: -1,
      });
    }

    // Animation
    container.setScale(0.5);
    container.setAlpha(0);

    this.tweens.add({
      targets: container,
      scale: 1,
      alpha: 1,
      duration: 500,
      ease: "Back.easeOut",
    });

    // Add particle effects based on game outcome
    this.createParticleEffects();
  }

  createBackground() {
    const { width, height } = this.cameras.main;

    // Dark overlay
    this.add.rectangle(0, 0, width, height, 0x000000, 0.7).setOrigin(0);

    // Create cyber grid effect
    const bgGraphics = this.add.graphics();
    bgGraphics.lineStyle(1, 0x004e92, 0.2);

    // Draw perspective grid effect
    for (let i = 0; i < 20; i++) {
      const y = i * 40;
      // Horizontal lines with perspective effect
      bgGraphics.lineBetween(0, y, width, y);
    }

    for (let i = 0; i < 30; i++) {
      const x = i * 40;
      // Vertical lines
      bgGraphics.lineBetween(x, 0, x, height);
    }
  }

  createParticleEffects() {
    const { width, height } = this.cameras.main;

    if (this.victory) {
      // Success particles - blue/green
      const successEmitter = this.add.particles(0, 0, "pixel", {
        x: { min: 0, max: width },
        y: height + 10,
        speed: { min: 200, max: 400 },
        angle: { min: 260, max: 280 },
        scale: { start: 1, end: 0 },
        lifespan: 3000,
        blendMode: "ADD",
        tint: [0x00aaff, 0x00cc66, 0x0066cc],
        frequency: 5,
      });
    } else {
      // Failure particles - red/orange
      const failureEmitter = this.add.particles(0, 0, "pixel", {
        x: { min: 0, max: width },
        y: { min: 0, max: height },
        speed: { min: 20, max: 100 },
        angle: { min: 0, max: 360 },
        scale: { start: 1, end: 0 },
        lifespan: 2000,
        blendMode: "ADD",
        tint: [0xff3333, 0xff6600],
        frequency: 50,
      });
    }
  }

  // Replace the restartGame method in GameOverScene
  restartGame() {
    // Play sound
    this.game.soundManager.play("button-click");

    // Reset game state and return to the menu
    this.scene.start("MenuScene");
  }
}
