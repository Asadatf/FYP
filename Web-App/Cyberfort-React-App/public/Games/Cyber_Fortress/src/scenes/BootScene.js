// BootScene - initial loading scene
class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    // No initial assets to load - we'll create them programmatically
  }

  create() {
    // Create placeholder textures that would normally be loaded as assets
    // Make sure GraphicsUtils is defined in the global scope before this is called
    if (typeof GraphicsUtils === "undefined") {
      console.error(
        "GraphicsUtils is not defined! Make sure graphics-utils.js is loaded before BootScene."
      );
      return;
    }

    GraphicsUtils.createPixelTexture(this);
    GraphicsUtils.createButtonTexture(this);
    GraphicsUtils.createPanelTexture(this);
    GraphicsUtils.createCyberBackgroundTexture(this);

    // Create background for this scene
    const { width, height } = this.cameras.main;
    this.add.rectangle(0, 0, width, height, 0x000428).setOrigin(0);

    // Display loading message
    const loadingText = this.add
      .text(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2,
        "Loading Cyber Fortress...",
        {
          fontSize: "24px",
          fill: "#00aaff",
          fontStyle: "bold",
        }
      )
      .setOrigin(0.5);

    // Add pulsing animation to loading text
    this.tweens.add({
      targets: loadingText,
      alpha: { from: 1, to: 0.5 },
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    // Add cyber-themed decoration
    const decoration = this.add.graphics();
    decoration.lineStyle(2, 0x00aaff, 0.3);

    // Draw a decorative hexagon around the text
    const hexRadius = 150;
    const hexPoints = [];

    for (let i = 0; i < 6; i++) {
      const angle = Phaser.Math.PI2 * (i / 6);
      const x = width / 2 + hexRadius * Math.cos(angle);
      const y = height / 2 + hexRadius * Math.sin(angle);
      hexPoints.push({ x, y });
    }

    for (let i = 0; i < 6; i++) {
      decoration.lineBetween(
        hexPoints[i].x,
        hexPoints[i].y,
        hexPoints[(i + 1) % 6].x,
        hexPoints[(i + 1) % 6].y
      );
    }

    // Move to the preload scene after a short delay
    this.time.delayedCall(1500, () => {
      this.scene.start("PreLoadScene");
    });
  }
}
