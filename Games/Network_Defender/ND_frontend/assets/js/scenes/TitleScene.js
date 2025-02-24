class TitleScene extends Phaser.Scene {
  constructor() {
    super("Title");
  }

  create() {
    // Audio setup
    this.titleTrack = this.sound.add("titleTrack", { loop: true, volume: 0.2 });
    this.titleTrack.play();
    this.clickSound = this.sound.add("clickSound", {
      loop: false,
      volume: 0.8,
    });

    // Background
    this.titleBackground = this.add.image(0, 0, "titleBackground");
    this.titleBackground.setOrigin(0, 0);
    this.titleBackground.displayWidth = this.scale.width;
    this.titleBackground.displayHeight = this.scale.height;

    // Title Text
    this.titleText = this.add
      .text(this.scale.width / 2, this.scale.height / 2, "Network Defender", {
        fontSize: "64px",
        fill: "#ffffff",
        stroke: "#000000",
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    // Title glow animation
    this.tweens.add({
      targets: this.titleText,
      alpha: { from: 0.8, to: 1 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Buttons
    this.startGameButton = new UiButton(
      this,
      this.scale.width / 2,
      this.scale.height * 0.65,
      "button1",
      "button2",
      "Start",
      () => {
        this.clickSound.play();
        this.titleTrack.stop();
        this.scene.start("Game");
      }
    );

    // Create tutorial button
    this.tutorialButton = new UiButton(
      this,
      this.scale.width / 2,
      this.scale.height * 0.75,
      "button1",
      "button2",
      "Tutorial",
      () => {
        this.clickSound.play();
        this.titleTrack.stop();
        this.startScene("Tutorial");
      }
    );

    this.instructionsButton = new UiButton(
      this,
      this.scale.width / 2,
      this.scale.height * 0.85,
      "button1",
      "button2",
      "Instructions",
      () => {
        this.clickSound.play();
        this.showInstructions();
      }
    );
  }

  showInstructions() {
    // Create overlay
    const overlay = this.add
      .rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.85)
      .setOrigin(0, 0);

    // Create main container for instructions
    const mainContainer = this.add.container(
      this.scale.width / 2,
      this.scale.height / 2
    );

    // Create panel background
    const panel = this.add.graphics();
    panel.fillStyle(0x1a1a1a, 0.9);
    panel.fillRoundedRect(-400, -300, 800, 600, 16);
    panel.lineStyle(2, 0x00ff00, 0.8);
    panel.strokeRoundedRect(-400, -300, 800, 600, 16);
    mainContainer.add(panel);

    // Title
    const title = this.add
      .text(0, -250, "Game Instructions", {
        fontSize: "32px",
        fill: "#00ff00",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
    mainContainer.add(title);

    // Instructions text
    const instructions = this.add
      .text(
        0,
        0,
        [
          "Welcome to Network Defender!",
          "═══════════════════════",
          "",
          "1. Movement Controls",
          "• Use W, A, S, D keys to move your character",
          "• Press E to interact with network devices",
          "",
          "2. Network Setup",
          "• Configure network devices with correct IPs",
          "• Connect switches to establish secure paths",
          "",
          "3. Message Encryption",
          "• Select specific words to encrypt",
          "• Choose between manual or automatic encryption",
          "• Complete mini-puzzles to enhance security",
          "",
          "4. Scoring System",
          "• Earn CyberCoins (CC) for successful encryptions",
          "• Complete tasks within time limits for bonuses",
          "",
          "═══════════════════════",
          "Stay vigilant and protect the network!",
        ].join("\n"),
        {
          fontSize: "16px",
          fill: "#ffffff",
          // align: "center",
          lineSpacing: 4,
          // wordWrap: {
          //   height: this.scale.height / 2,
          //   width: this.scale.width / 2,
          // },
        }
      )
      .setOrigin(0.5);
    mainContainer.add(instructions);

    // Close button at the bottom of the panel
    const closeButton = this.add
      .text(0, 250, "CLOSE", {
        fontSize: "24px",
        fill: "#00ff00",
        backgroundColor: "#004400",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerover", () => closeButton.setAlpha(0.8))
      .on("pointerout", () => closeButton.setAlpha(1))
      .on("pointerdown", () => {
        this.clickSound.play();
        mainContainer.destroy();
        overlay.destroy();
      });
    mainContainer.add(closeButton);

    // Entrance animation
    mainContainer.setScale(0.9);
    mainContainer.setAlpha(0);
    this.tweens.add({
      targets: mainContainer,
      scale: 1,
      alpha: 1,
      duration: 300,
      ease: "Back.easeOut",
    });
  }

  startScene(targetScene) {
    this.scene.start(targetScene);
  }
}
