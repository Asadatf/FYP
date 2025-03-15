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

    // Get screen dimensions for responsive design
    this.screenWidth = this.scale.width;
    this.screenHeight = this.scale.height;
    this.isMobile = this.screenWidth < 768;

    // Update dimensions on resize
    this.scale.on("resize", this.handleResize, this);

    // Background
    this.titleBackground = this.add.image(0, 0, "titleBackground");
    this.titleBackground.setOrigin(0, 0);
    this.titleBackground.displayWidth = this.screenWidth;
    this.titleBackground.displayHeight = this.screenHeight;

    // Add cybersecurity grid overlay
    this.createGridOverlay();

    // Add network nodes and connections
    this.createNetworkElements();

    // Title Text with enhanced glow effect - adjust font size based on screen width
    const titleFontSize = this.isMobile ? "36px" : "64px";
    const titleY = this.isMobile
      ? this.screenHeight / 2 - 80
      : this.screenHeight / 2;

    this.titleText = this.add
      .text(this.screenWidth / 2, titleY, "Network Defender", {
        fontSize: titleFontSize,
        fill: "#ffffff",
        stroke: "#00ffff", // Cyan stroke for cybersecurity theme
        strokeThickness: this.isMobile ? 4 : 6,
      })
      .setOrigin(0.5);

    // Enhanced title glow animation
    this.tweens.add({
      targets: this.titleText,
      alpha: { from: 0.8, to: 1 },
      strokeThickness: {
        from: this.isMobile ? 4 : 6,
        to: this.isMobile ? 5 : 8,
      },
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Add subtitle with responsive font size
    const subtitleFontSize = this.isMobile ? "16px" : "24px";
    const subtitleY = titleY + (this.isMobile ? 30 : 50);

    this.subtitleText = this.add
      .text(
        this.screenWidth / 2,
        subtitleY,
        "Secure the Network, Protect the Data",
        {
          fontSize: subtitleFontSize,
          fill: "#00ff00",
          stroke: "#003300",
          strokeThickness: 2,
        }
      )
      .setOrigin(0.5)
      .setAlpha(0);

    // Fade in subtitle
    this.tweens.add({
      targets: this.subtitleText,
      alpha: 1,
      duration: 1000,
      delay: 500,
    });

    // Buttons with enhanced styling
    this.createButtons();
    this.createHighScoresButton();
  }

  handleResize(gameSize) {
    try {
      // Update screen dimensions
      this.screenWidth = gameSize.width;
      this.screenHeight = gameSize.height;
      this.isMobile = this.screenWidth < 768;

      // Update background size
      if (this.titleBackground) {
        this.titleBackground.displayWidth = this.screenWidth;
        this.titleBackground.displayHeight = this.screenHeight;
      }

      // Instead of modifying the text objects, destroy and recreate them
      // Store original alpha values and animation states
      const textProperties = {};

      if (this.titleText) {
        textProperties.titleAlpha = this.titleText.alpha;
        textProperties.titleScale = this.titleText.scale;

        // Store tween data if needed
        const titleTweens = this.tweens.getTweensOf(this.titleText);
        textProperties.hasTitleTween = titleTweens.length > 0;

        // Destroy the original text
        this.titleText.destroy();

        // Create a new title with updated properties
        const titleY = this.isMobile
          ? this.screenHeight / 2 - 80
          : this.screenHeight / 2;
        const titleFontSize = this.isMobile ? "36px" : "64px";
        const titleStrokeThickness = this.isMobile ? 4 : 6;

        this.titleText = this.add
          .text(this.screenWidth / 2, titleY, "Network Defender", {
            fontSize: titleFontSize,
            fill: "#ffffff",
            stroke: "#00ffff", // Cyan stroke for cybersecurity theme
            strokeThickness: titleStrokeThickness,
          })
          .setOrigin(0.5);

        // Restore original alpha and scale
        this.titleText.setAlpha(textProperties.titleAlpha);
        this.titleText.setScale(textProperties.titleScale);

        // Restore animation if it was active
        if (textProperties.hasTitleTween) {
          this.tweens.add({
            targets: this.titleText,
            alpha: { from: 0.8, to: 1 },
            strokeThickness: {
              from: titleStrokeThickness,
              to: titleStrokeThickness + 2,
            },
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut",
          });
        }
      }

      // Do the same for subtitle text
      if (this.subtitleText) {
        textProperties.subtitleAlpha = this.subtitleText.alpha;
        textProperties.subtitleScale = this.subtitleText.scale;

        // Destroy the original text
        this.subtitleText.destroy();

        // Create a new subtitle with updated properties
        const titleY = this.isMobile
          ? this.screenHeight / 2 - 80
          : this.screenHeight / 2;
        const subtitleY = titleY + (this.isMobile ? 30 : 50);
        const subtitleFontSize = this.isMobile ? "16px" : "24px";

        this.subtitleText = this.add
          .text(
            this.screenWidth / 2,
            subtitleY,
            "Secure the Network, Protect the Data",
            {
              fontSize: subtitleFontSize,
              fill: "#00ff00",
              stroke: "#003300",
              strokeThickness: 2,
            }
          )
          .setOrigin(0.5);

        // Restore original alpha and scale
        this.subtitleText.setAlpha(textProperties.subtitleAlpha);
        this.subtitleText.setScale(textProperties.subtitleScale);
      }

      // Reposition buttons
      this.repositionButtons();
    } catch (error) {
      console.log("Safe text resize error:", error);
    }
  }

  createGridOverlay() {
    // Create grid lines
    const grid = this.add.graphics();
    grid.lineStyle(1, 0x00ffff, 0.3); // Cyan grid lines

    // Adjust grid spacing based on screen size
    const gridSpacing = this.isMobile ? 20 : 30;

    // Draw horizontal lines
    for (let y = 0; y < this.screenHeight; y += gridSpacing) {
      grid.moveTo(0, y);
      grid.lineTo(this.screenWidth, y);
    }

    // Draw vertical lines
    for (let x = 0; x < this.screenWidth; x += gridSpacing) {
      grid.moveTo(x, 0);
      grid.lineTo(x, this.screenHeight);
    }

    // Add subtle pulse animation to grid
    this.tweens.add({
      targets: grid,
      alpha: { from: 0.3, to: 0.1 },
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  createNetworkElements() {
    // Create network node positions - adjusted for different screen sizes
    const nodePositions = [
      { x: this.screenWidth * 0.2, y: this.screenHeight * 0.2 },
      { x: this.screenWidth * 0.2, y: this.screenHeight * 0.8 },
      { x: this.screenWidth * 0.8, y: this.screenHeight * 0.2 },
      { x: this.screenWidth * 0.8, y: this.screenHeight * 0.8 },
      { x: this.screenWidth * 0.3, y: this.screenHeight * 0.5 },
      { x: this.screenWidth * 0.7, y: this.screenHeight * 0.5 },
    ];

    // Create nodes
    this.nodes = [];
    nodePositions.forEach((pos) => {
      // Use the existing 'switch' or 'router' image if available
      const nodeType = Math.random() > 0.5 ? "switch" : "router";
      try {
        // Scale nodes based on screen size
        const nodeScale = this.isMobile ? 0.05 : 0.08;
        const node = this.add.image(pos.x, pos.y, nodeType).setScale(nodeScale);

        // Add glow effect
        const glow = this.add.graphics();
        glow.fillStyle(0x00ffff, 0.3);
        glow.fillCircle(pos.x, pos.y, this.isMobile ? 10 : 15);

        this.tweens.add({
          targets: glow,
          alpha: { from: 0.3, to: 0.1 },
          duration: 1500 + Math.random() * 1000,
          yoyo: true,
          repeat: -1,
        });

        this.nodes.push({ node, glow, x: pos.x, y: pos.y });
      } catch (e) {
        console.error("Error creating network node:", e);
      }
    });

    // Draw network connections between nodes
    this.drawNetworkConnections();
  }

  drawNetworkConnections() {
    const connections = this.add.graphics();
    connections.lineStyle(2, 0x00ff00, 0.4); // Green connections

    // Connect nodes in a logical pattern
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        // Only connect some nodes to create a network pattern
        if ((i + j) % 3 === 0 || i === 0 || j === this.nodes.length - 1) {
          const startNode = this.nodes[i];
          const endNode = this.nodes[j];

          connections.beginPath();
          connections.moveTo(startNode.x, startNode.y);
          connections.lineTo(endNode.x, endNode.y);
          connections.strokePath();
        }
      }
    }

    // Add data packet animations
    this.time.addEvent({
      delay: 800,
      callback: this.animateDataPackets,
      callbackScope: this,
      loop: true,
    });
  }

  animateDataPackets() {
    // Create data packets that travel between nodes
    if (this.nodes && this.nodes.length > 0) {
      const startNodeIndex = Math.floor(Math.random() * this.nodes.length);
      let endNodeIndex;

      do {
        endNodeIndex = Math.floor(Math.random() * this.nodes.length);
      } while (endNodeIndex === startNodeIndex);

      const startNode = this.nodes[startNodeIndex];
      const endNode = this.nodes[endNodeIndex];

      // Create packet (use existing 'packet' image if available)
      try {
        const packetScale = this.isMobile ? 0.02 : 0.03;
        const packet = this.add
          .image(startNode.x, startNode.y, "packet")
          .setScale(packetScale)
          .setAlpha(0.7);

        // Animate packet along path
        this.tweens.add({
          targets: packet,
          x: endNode.x,
          y: endNode.y,
          duration: 1500,
          ease: "Linear",
          onComplete: () => {
            packet.destroy();
          },
        });
      } catch (e) {
        // Fallback to a simple circle if packet image isn't available
        const packet = this.add.circle(
          startNode.x,
          startNode.y,
          this.isMobile ? 3 : 5,
          0x00ff00,
          1
        );

        this.tweens.add({
          targets: packet,
          x: endNode.x,
          y: endNode.y,
          duration: 1500,
          ease: "Linear",
          onComplete: () => {
            packet.destroy();
          },
        });
      }
    }
  }

  createButtons() {
    // Calculate button positions based on screen size
    const buttonScale = this.isMobile ? 0.8 : 1;
    const buttonSpacing = this.isMobile ? 60 : 70;
    const startY = this.isMobile
      ? this.screenHeight * 0.6
      : this.screenHeight * 0.65;

    // Start Game Button
    this.startGameButton = new UiButton(
      this,
      this.screenWidth / 2,
      startY,
      "button1",
      "button2",
      "Start",
      () => {
        this.clickSound.play();
        // Transition to loading screen before starting game
        this.showLoadingScreen();
      }
    );
    this.startGameButton.setScale(buttonScale);

    // Create tutorial button
    this.tutorialButton = new UiButton(
      this,
      this.screenWidth / 2,
      startY + buttonSpacing,
      "button1",
      "button2",
      "Tutorial",
      () => {
        this.clickSound.play();
        this.titleTrack.stop();
        this.startScene("Tutorial");
      }
    );
    this.tutorialButton.setScale(buttonScale);

    // Instructions button
    this.instructionsButton = new UiButton(
      this,
      this.screenWidth / 2,
      startY + buttonSpacing * 2,
      "button1",
      "button2",
      "Instructions",
      () => {
        this.clickSound.play();
        this.showInstructions();
      }
    );
    this.instructionsButton.setScale(buttonScale);

    // Add entrance animation for buttons
    [
      this.startGameButton,
      this.tutorialButton,
      this.instructionsButton,
    ].forEach((button, index) => {
      button.y += 20;
      button.alpha = 0;

      this.tweens.add({
        targets: button,
        y: button.y - 20,
        alpha: 1,
        duration: 500,
        delay: 300 + index * 150,
        ease: "Back.easeOut",
      });
    });

    // Store buttons for repositioning on resize
    this.buttons = [
      this.startGameButton,
      this.tutorialButton,
      this.instructionsButton,
    ];
  }

  createHighScoresButton() {
    // High Scores button
    this.highScoresButton = new UiButton(
      this,
      this.scale.width / 2,
      this.scale.height * 0.95,
      "button1",
      "button2",
      "High Scores",
      () => {
        this.clickSound.play();

        // Initialize high score manager if needed
        if (!this.highScoreManager) {
          this.highScoreManager = new HighScoreManager(this);
        }

        // Show high scores table
        this.highScoreManager.showHighScoreTable();
      }
    );

    // Add entrance animation
    this.highScoresButton.y += 20;
    this.highScoresButton.alpha = 0;

    this.tweens.add({
      targets: this.highScoresButton,
      y: this.highScoresButton.y - 20,
      alpha: 1,
      duration: 500,
      delay: 300 + 4 * 150, // After other buttons
      ease: "Back.easeOut",
    });
  }

  // Method to reposition buttons when screen is resized
  repositionButtons() {
    if (!this.buttons) return;

    const buttonScale = this.isMobile ? 0.8 : 1;
    const buttonSpacing = this.isMobile ? 60 : 70;
    const startY = this.isMobile
      ? this.screenHeight * 0.6
      : this.screenHeight * 0.65;

    this.buttons.forEach((button, index) => {
      button.x = this.screenWidth / 2;
      button.y = startY + buttonSpacing * index;
      button.setScale(buttonScale);
    });
  }

  showLoadingScreen() {
    // Create overlay for loading screen
    const overlay = this.add
      .rectangle(0, 0, this.screenWidth, this.screenHeight, 0x000000, 0)
      .setOrigin(0, 0);

    // Fade in overlay
    this.tweens.add({
      targets: overlay,
      alpha: 0.9,
      duration: 500,
      onComplete: () => {
        // Create loading screen elements
        const loadingText = this.add
          .text(
            this.screenWidth / 2,
            this.screenHeight / 2 - 50,
            "Loading...",
            {
              font: this.isMobile ? "18px monospace" : "24px monospace",
              fill: "#00ff00",
            }
          )
          .setOrigin(0.5);

        const progressBoxWidth = this.isMobile ? 240 : 320;
        const progressBoxHeight = this.isMobile ? 30 : 40;

        const progressBox = this.add
          .rectangle(
            this.screenWidth / 2,
            this.screenHeight / 2,
            progressBoxWidth,
            progressBoxHeight,
            0x222222,
            0.8
          )
          .setOrigin(0.5);

        const progressBar = this.add
          .rectangle(
            this.screenWidth / 2 - progressBoxWidth / 2 + 5,
            this.screenHeight / 2,
            0,
            progressBoxHeight - 10,
            0x00ff00,
            1
          )
          .setOrigin(0, 0.5);

        const percentText = this.add
          .text(this.screenWidth / 2, this.screenHeight / 2, "0%", {
            font: this.isMobile ? "16px monospace" : "18px monospace",
            fill: "#ffffff",
          })
          .setOrigin(0.5);

        // Simulate loading progress
        let progress = 0;
        const progressInterval = this.time.addEvent({
          delay: 30,
          callback: () => {
            progress += 1;
            const progressWidth = Math.min(
              (progressBoxWidth - 10) * (progress / 100),
              progressBoxWidth - 10
            );
            progressBar.width = progressWidth;
            percentText.setText(`${progress}%`);

            // When loading completes
            if (progress >= 100) {
              progressInterval.remove();

              this.time.delayedCall(500, () => {
                this.titleTrack.stop();
                this.scene.start("Game");
              });
            }
          },
          callbackScope: this,
          repeat: 100,
        });
      },
    });
  }

  showInstructions() {
    // Create overlay with responsive dimensions
    const overlay = this.add
      .rectangle(0, 0, this.screenWidth, this.screenHeight, 0x000000, 0.85)
      .setOrigin(0, 0);

    // Create main container for instructions
    const mainContainer = this.add.container(
      this.screenWidth / 2,
      this.screenHeight / 2
    );

    // Create panel background with responsive dimensions
    const panelWidth = this.isMobile ? this.screenWidth * 0.9 : 800;
    const panelHeight = this.isMobile ? this.screenHeight * 0.8 : 600;

    const panel = this.add.graphics();
    panel.fillStyle(0x1a1a1a, 0.9);
    panel.fillRoundedRect(
      -panelWidth / 2,
      -panelHeight / 2,
      panelWidth,
      panelHeight,
      16
    );
    panel.lineStyle(2, 0x00ff00, 0.8);
    panel.strokeRoundedRect(
      -panelWidth / 2,
      -panelHeight / 2,
      panelWidth,
      panelHeight,
      16
    );
    mainContainer.add(panel);

    // Title with responsive font size
    const titleFontSize = this.isMobile ? "24px" : "32px";
    const title = this.add
      .text(0, -panelHeight / 2 + 50, "Game Instructions", {
        fontSize: titleFontSize,
        fill: "#00ff00",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
    mainContainer.add(title);

    // Instructions text with responsive font size and content
    const instructionsFontSize = this.isMobile ? "14px" : "16px";

    // Adjust instructions content based on screen size
    let instructionsContent;
    if (this.isMobile) {
      instructionsContent = [
        "Welcome to Network Defender!",
        "═════════════════",
        "",
        "1. Movement",
        "• Use W, A, S, D keys to move",
        "• Press E to interact",
        "",
        "2. Network Setup",
        "• Configure devices with IPs",
        "• Connect switches for security",
        "",
        "3. Encryption",
        "• Select words to encrypt",
        "• Complete security puzzles",
        "",
        "4. Scoring",
        "• Earn CyberCoins (CC)",
        "• Complete tasks quickly",
        "",
        "Stay vigilant and protect!",
      ].join("\n");
    } else {
      instructionsContent = [
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
      ].join("\n");
    }

    const instructions = this.add
      .text(0, 0, instructionsContent, {
        fontSize: instructionsFontSize,
        fill: "#ffffff",
        lineSpacing: 4,
      })
      .setOrigin(0.5);
    mainContainer.add(instructions);

    // Close button at the bottom of the panel with responsive position and size
    const closeButtonFontSize = this.isMobile ? "20px" : "24px";
    const closeButtonY = panelHeight / 2 - 50;

    const closeButton = this.add
      .text(0, closeButtonY, "CLOSE", {
        fontSize: closeButtonFontSize,
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
