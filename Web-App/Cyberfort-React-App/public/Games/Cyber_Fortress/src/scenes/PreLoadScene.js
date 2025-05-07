// PreloadScene - handles asset loading
class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    // Make sure GraphicsUtils is defined in the global scope
    if (typeof GraphicsUtils === "undefined") {
      console.error(
        "GraphicsUtils is not defined! Make sure graphics-utils.js is loaded before PreloadScene."
      );
      return;
    }

    // Create background using the texture from BootScene
    const { width, height } = this.cameras.main;
    this.add.image(0, 0, "cyber-background").setOrigin(0);

    // Create loading bar
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

    const loadingText = this.add
      .text(width / 2, height / 2 - 50, "Loading...", {
        font: "20px monospace",
        fill: "#ffffff",
      })
      .setOrigin(0.5);

    const percentText = this.add
      .text(width / 2, height / 2, "0%", {
        font: "18px monospace",
        fill: "#ffffff",
      })
      .setOrigin(0.5);

    // Update the loading bar as assets are loaded
    this.load.on("progress", (value) => {
      progressBar.clear();
      progressBar.fillStyle(0x00aaff, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
      percentText.setText(parseInt(value * 100) + "%");
    });

    this.load.on("complete", () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
    });

    // Instead of using data URIs, manually simulate loading progress
    // This avoids the "Local data URIs are not supported" warning
    this.simulateLoading();
  }

  simulateLoading() {
    // Manually trigger progress events instead of loading dummy assets
    let progress = 0;
    const interval = 50; // ms between updates
    const step = 0.02; // progress increment per step

    const progressTimer = this.time.addEvent({
      delay: interval,
      callback: () => {
        progress += step;
        if (progress <= 1) {
          // Manually trigger the progress event
          this.load.emit("progress", progress);
        } else {
          // Complete loading
          progressTimer.remove();
          this.load.emit("complete");
          this.time.delayedCall(500, () => this.create());
        }
      },
      callbackScope: this,
      loop: true,
    });
  }

  create() {
    // Define animations that will be used in the game
    this.createAnimations();

    // Create additional graphical assets
    this.createAdditionalAssets();

    // Initialize sound manager
    if (typeof SoundManager !== "undefined") {
      this.game.soundManager = new SoundManager(this).init();
    } else {
      console.warn("SoundManager not found. Sound will be disabled.");
      this.game.soundManager = {
        play: () => {}, // Empty function as fallback
      };
    }

    // Start the menu scene after loading is complete
    this.scene.start("MenuScene");
  }

  createAnimations() {
    // Define any animations for the game here
    // In a more complex game with sprite sheets, you would define animations
    // like player movements, effects, etc.
  }

  createAdditionalAssets() {
    // Create any additional graphical assets needed for the game

    // Create threat icons - normally these would be loaded from image files
    // but we're creating them programmatically for this example
    const threats = [
      { key: "portScan", symbol: "🔍" },
      { key: "passwordCrack", symbol: "🔨" },
      { key: "dataSniffer", symbol: "🕵️" },
      { key: "malware", symbol: "🦠" },
      { key: "phishing", symbol: "🎣" },
      { key: "ddos", symbol: "🌊" },
      { key: "ransomware", symbol: "🔒" },
      { key: "rootkit", symbol: "🌱" },
      { key: "trojan", symbol: "🐴" },
    ];

    // Create defense icons
    const defenses = [
      { key: "firewall", symbol: "🛡️" },
      { key: "password", symbol: "🔐" },
      { key: "encryption", symbol: "🔑" },
      { key: "antivirus", symbol: "🦸" },
      { key: "training", symbol: "📚" },
      { key: "loadBalancer", symbol: "⚖️" },
      { key: "backup", symbol: "💾" },
      { key: "scanner", symbol: "🔬" },
      { key: "sandbox", symbol: "📦" },
    ];

    // In a real implementation, these would be actual image assets
    // For this example, we're just noting that they exist in the game data
    console.log("Created threat and defense icons");
  }
}
