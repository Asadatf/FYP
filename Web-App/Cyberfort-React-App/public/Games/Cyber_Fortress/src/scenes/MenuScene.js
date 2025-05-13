// MenuScene - main menu
class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
    // Make sure HighScore is defined in the global scope
    if (typeof HighScore === "undefined") {
      console.error(
        "HighScore is not defined! Make sure highscore.js is loaded before MenuScene."
      );
      this.highScoreManager = { getHighScore: () => 0 }; // Fallback
    } else {
      this.highScoreManager = new HighScore();
    }
  }

  create() {
    const { width, height } = this.cameras.main;

    // Add background with grid effect
    this.createBackgroundEffect();

    // Title
    this.add
      .text(width / 2, height / 4, "CYBER FORTRESS", {
        font: "bold 42px Arial",
        fill: "#00aaff",
        stroke: "#000",
        strokeThickness: 6,
        shadow: {
          offsetX: 2,
          offsetY: 2,
          color: "#000",
          blur: 2,
          stroke: true,
          fill: true,
        },
      })
      .setOrigin(0.5);

    // High Score display
    const highScore = this.highScoreManager.getHighScore();
    this.add
      .text(width / 2, height / 4 + 60, `High Score: ${highScore}`, {
        font: "24px Arial",
        fill: "#ffffff",
      })
      .setOrigin(0.5);

    // Create Start Button
    const startButton = this.add.container(width / 2, height / 2 + 50);

    const buttonBg = this.add
      .rectangle(0, 0, 200, 60, 0x00cc66, 1)
      .setStrokeStyle(2, 0x00ff77)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => {
        buttonBg.setFillStyle(0x00dd77);
        startText.setScale(1.05);
        buttonBg.setScale(1.05);
      })
      .on("pointerout", () => {
        buttonBg.setFillStyle(0x00cc66);
        startText.setScale(1);
        buttonBg.setScale(1);
      })
      .on("pointerdown", () => this.startGame());

    const startText = this.add
      .text(0, 0, "START GAME", {
        font: "bold 24px Arial",
        fill: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);

    startButton.add([buttonBg, startText]);

    // Add instructions text
    this.add
      .text(
        width / 2,
        height - 100,
        "Defend against cyber threats by matching the correct defense!",
        {
          font: "18px Arial",
          fill: "#ffffff",
          align: "center",
        }
      )
      .setOrigin(0.5);

    // Add animation to button
    this.tweens.add({
      targets: startButton,
      scale: { from: 1, to: 1.05 },
      duration: 800,
      yoyo: true,
      repeat: -1,
    });
  }

  createBackgroundEffect() {
    const { width, height } = this.cameras.main;

    // Create cyber grid background
    const bgGraphics = this.add.graphics();

    // Fill background
    bgGraphics.fillStyle(0x000428);
    bgGraphics.fillRect(0, 0, width, height);

    // Draw grid
    bgGraphics.lineStyle(1, 0x0066ff, 0.1);

    // Horizontal lines
    for (let y = 0; y < height; y += 40) {
      bgGraphics.lineBetween(0, y, width, y);
    }

    // Vertical lines
    for (let x = 0; x < width; x += 40) {
      bgGraphics.lineBetween(x, 0, x, height);
    }

    // Add animated particles for cyber effect using pixel texture
    if (this.textures.exists("pixel")) {
      const particles = this.add.particles(0, 0, "pixel", {
        x: { min: 0, max: width },
        y: { min: 0, max: height },
        lifespan: 4000,
        speedY: { min: -20, max: -50 },
        scale: { start: 0.2, end: 0 },
        quantity: 1,
        blendMode: "ADD",
        frequency: 200,
        tint: 0x00aaff,
      });
    } else {
      console.warn("Pixel texture not found for particles");
    }
  }

  startGame() {
    // Play sound effect
    this.game.soundManager.play("button-click");

    // Transition to the game scene
    this.scene.start("GameScene");
  }
}
