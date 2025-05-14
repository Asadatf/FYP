class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MenuScene" });
  }

  create() {
    // Background color with grid effect
    this.cameras.main.setBackgroundColor("#0a0a2a");

    // Create grid background
    const gridSize = 30;
    const gridGraphics = this.add.graphics();
    gridGraphics.lineStyle(1, 0x00ffff, 0.3);

    // Draw vertical lines
    for (let x = 0; x <= 800; x += gridSize) {
      gridGraphics.moveTo(x, 0);
      gridGraphics.lineTo(x, 600);
    }

    // Draw horizontal lines
    for (let y = 0; y <= 600; y += gridSize) {
      gridGraphics.moveTo(0, y);
      gridGraphics.lineTo(800, y);
    }

    gridGraphics.strokePath();

    // Create cyber-themed title
    const titleText = this.add
      .text(400, 120, "PHISHING DEFENSE", {
        fontSize: "48px",
        fontFamily: "Arial Black, Arial",
        fill: "#00ffff",
        stroke: "#0000aa",
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    // Add subtitle
    const subtitleText = this.add
      .text(400, 180, "SECURE YOUR NETWORK", {
        fontSize: "24px",
        fontFamily: "Arial",
        fill: "#ffffff",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    // Create pulsating effect for title
    this.tweens.add({
      targets: titleText,
      scale: 1.1,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    // Add digital circuit decoration lines
    const decorGraphics = this.add.graphics();
    decorGraphics.lineStyle(2, 0x00ffff, 0.7);

    // Draw decorative circuit lines
    decorGraphics.moveTo(100, 250);
    decorGraphics.lineTo(300, 250);
    decorGraphics.lineTo(300, 350);
    decorGraphics.lineTo(500, 350);
    decorGraphics.lineTo(500, 450);
    decorGraphics.lineTo(700, 450);

    decorGraphics.moveTo(700, 250);
    decorGraphics.lineTo(500, 250);
    decorGraphics.lineTo(500, 150);
    decorGraphics.lineTo(300, 150);
    decorGraphics.lineTo(300, 50);
    decorGraphics.lineTo(100, 50);

    decorGraphics.strokePath();

    // Create start button with cyberpunk style
    const buttonBg = this.add
      .rectangle(400, 320, 220, 60, 0x000000)
      .setStrokeStyle(2, 0x00ffff);

    const startButton = this.add
      .text(400, 320, "START MISSION", {
        fontSize: "28px",
        fontFamily: "Arial",
        fill: "#00ffff",
      })
      .setOrigin(0.5)
      .setInteractive();

    // Button hover effects
    startButton.on("pointerover", () => {
      buttonBg.setFillStyle(0x003366);
      startButton.setScale(1.1);
    });

    startButton.on("pointerout", () => {
      buttonBg.setFillStyle(0x000000);
      startButton.setScale(1);
    });

    // Start game on click with transition
    startButton.on("pointerdown", () => {
      // Play click sound if available
      if (this.sound.get("click")) {
        this.sound.play("click");
      }

      // Transition effect
      this.cameras.main.fade(500, 0, 0, 0);
      this.time.delayedCall(500, () => {
        this.scene.start("GameScene");
      });
    });

    // Add game instructions
    const instructionsBox = this.add
      .rectangle(400, 450, 600, 120, 0x000000, 0.6)
      .setStrokeStyle(1, 0x00ffff, 0.5);

    const instructions = [
      "❯ MISSION: Identify and neutralize phishing threats",
      "❯ Click to destroy phishing messages",
      "❯ Let legitimate messages pass through",
      "❯ Beware: Security breaches cost points",
    ];

    instructions.forEach((text, index) => {
      this.add.text(200, 410 + index * 25, text, {
        fontSize: "16px",
        fontFamily: "Arial",
        fill: "#ffffff",
      });
    });

    // Add version number
    this.add
      .text(780, 580, "v1.0", {
        fontSize: "12px",
        fontFamily: "Arial",
        fill: "#666666",
      })
      .setOrigin(1);

    // Add animated scanner effect
    const scanLine = this.add.rectangle(400, 0, 800, 4, 0x00ffff, 0.3);

    this.tweens.add({
      targets: scanLine,
      y: 600,
      duration: 2000,
      repeat: -1,
      yoyo: false,
    });
  }
}
