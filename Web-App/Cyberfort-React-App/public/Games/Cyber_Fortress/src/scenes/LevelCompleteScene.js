// LevelCompleteScene - displayed after completing a level
class LevelCompleteScene extends Phaser.Scene {
  constructor() {
    super("LevelCompleteScene");
  }

  init(data) {
    this.level = data.level || 1;
    this.score = data.score || 0;
    this.threatsResolved = data.threatsResolved || 0;
    this.nextLevel = this.level + 1;
  }

  create() {
    const { width, height } = this.cameras.main;

    // Create background
    this.add.rectangle(0, 0, width, height, 0x000000, 0.8).setOrigin(0);

    // Add container for content with scaling animation
    const container = this.add.container(width / 2, height / 2);

    // Create panel background
    const panel = this.add
      .rectangle(0, 0, 400, 300, 0x2d2d2d)
      .setStrokeStyle(3, 0x00cc66);
    container.add(panel);

    // Title
    const title = this.add
      .text(0, -120, "LEVEL COMPLETE!", {
        font: "bold 32px Arial",
        fill: "#00cc66",
      })
      .setOrigin(0.5);
    container.add(title);

    // Stats
    const statsStyle = {
      font: "20px Arial",
      fill: "#ffffff",
    };

    const levelText = this.add
      .text(0, -60, `Level ${this.level} Completed`, statsStyle)
      .setOrigin(0.5);
    const scoreText = this.add
      .text(0, -20, `Score: ${this.score}`, statsStyle)
      .setOrigin(0.5);
    const threatsText = this.add
      .text(0, 20, `Threats Resolved: ${this.threatsResolved}`, statsStyle)
      .setOrigin(0.5);

    container.add([levelText, scoreText, threatsText]);

    // Next level button
    const nextLevelButton = this.add
      .rectangle(0, 80, 200, 50, 0x00cc66)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => nextLevelButton.setFillStyle(0x00dd77))
      .on("pointerout", () => nextLevelButton.setFillStyle(0x00cc66))
      .on("pointerdown", () => this.startNextLevel());

    const nextLevelText = this.add
      .text(0, 80, "NEXT LEVEL", {
        font: "bold 18px Arial",
        fill: "#ffffff",
      })
      .setOrigin(0.5);

    container.add([nextLevelButton, nextLevelText]);

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

    // Particle effects - check if pixel texture exists
    if (this.textures.exists("pixel")) {
      const emitter = this.add.particles(0, 0, "pixel", {
        x: width / 2,
        y: height / 2,
        speed: { min: 100, max: 200 },
        angle: { min: 0, max: 360 },
        scale: { start: 1, end: 0 },
        lifespan: 1000,
        blendMode: "ADD",
        frequency: 30,
        tint: 0x00cc66,
        emitZone: {
          type: "edge",
          source: new Phaser.Geom.Rectangle(-200, -150, 400, 300),
          quantity: 20,
        },
      });
    }
  }

  // Replace the startNextLevel method in LevelCompleteScene
  startNextLevel() {
    // Play sound if available
    this.game.soundManager.play("button-click");

    // Transition to next level
    this.scene.start("GameScene", {
      level: this.nextLevel,
      score: this.score,
      threatsResolved: this.threatsResolved,
    });
  }
}
