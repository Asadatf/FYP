class GameScene extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  init() {
    // Text setup for interaction prompt
    this.interactText = this.add
      .text(window.innerWidth / 2, window.innerHeight / 2, "", {
        fontSize: this.calculateFontSize(24),
        fill: "#00ff00",
        fontFamily: "Courier New",
        stroke: "#003300",
        strokeThickness: 2,
        shadow: { color: "#00ff00", blur: 10, fill: true },
      })
      .setOrigin(0.5, 0)
      .setDepth(1)
      .setVisible(false);
    this.scene.launch("Ui");

    // Initialize responsive scaling properties
    this.setResponsiveProperties();
  }

  // New method to set responsive properties based on screen size
  setResponsiveProperties() {
    // Get current screen dimensions
    this.screenWidth = this.scale.width;
    this.screenHeight = this.scale.height;

    // Determine if we're on a mobile device
    this.isMobile = this.screenWidth < 768;

    // Set scaling factor based on screen size
    this.scaleFactor = Math.min(
      this.screenWidth / 1280,
      this.screenHeight / 720
    );

    // Set minimum device scale to ensure visibility on small screens
    this.deviceScale = this.isMobile
      ? Math.max(0.08, this.scaleFactor * 0.15)
      : Math.max(0.1, this.scaleFactor * 0.15);

    // Add this new code for character scaling
    // Set scaling for characters (larger than devices)
    this.characterScale = this.isMobile
      ? Math.max(0.12, this.scaleFactor * 0.25)
      : Math.max(0.15, this.scaleFactor * 0.25);

    // Define responsive positions using relative coordinates
    this.devicePositions = {
      defender: {
        x: this.screenWidth * 0.25,
        y: this.screenHeight * 0.5,
      },
      receiver: {
        x: this.screenWidth * 0.75,
        y: this.screenHeight * 0.5,
      },
      leftSwitch: {
        x: this.screenWidth * 0.25,
        y: this.screenHeight * 0.4,
      },
      rightSwitch: {
        x: this.screenWidth * 0.75,
        y: this.screenHeight * 0.4,
      },
      router: {
        x: this.screenWidth * 0.5,
        y: this.screenHeight * 0.3,
      },
    };

    // Calculate spacing between elements based on screen size
    this.deviceSpacing = this.screenWidth * 0.05;
  }

  // Helper method to calculate font size based on screen
  calculateFontSize(baseSize) {
    const fontScaleFactor = Math.min(
      this.screenWidth / 1280,
      this.screenHeight / 720
    );
    return Math.max(Math.floor(baseSize * fontScaleFactor), 12) + "px";
  }

  create() {
    // Create cybersecurity-themed background with circuit patterns
    this.createEnhancedBackground();

    // Add back button
    // this.createBackButton();
    this.initializeUIButtons();

    // Initialize TimeManager and WalletManager first
    this.timeManager = new TimeManager(this);
    this.walletManager = new WalletManager(this);

    this.scoreManager = new ScoreManager(this);
    this.scoreManager.init();
    this.highScoreManager = new HighScoreManager(this);

    this.achievementTracker = new AchievementTracker(this);
    this.createAchievementsButton();

    this.createVisualEffects();

    // Creating Defender with responsive positioning
    const defenderPos = this.devicePositions.defender;
    this.defender = new Defender(
      this,
      defenderPos.x - this.deviceSpacing,
      defenderPos.y + this.deviceSpacing,
      "defender"
    );
    this.defender.setScale(this.characterScale); // Use character scale instead of device scale
    this.addGlowEffect(this.defender);

    // Creating Receiver with responsive positioning
    const receiverPos = this.devicePositions.receiver;
    const receiverOffset = this.deviceSpacing * 2; // Adjust based on screen size

    // Position receiver farther from the switch
    this.receiver = new Receiver(
      this,
      receiverPos.x + receiverOffset,
      receiverPos.y + 100,
      "receiver"
    );
    this.receiver.setScale(this.characterScale); // Use character scale instead of device scale
    this.addGlowEffect(this.receiver);

    // Store the receiver's final position (near the switch)
    this.receiverFinalX = receiverPos.x + this.deviceSpacing * 0.4;
    this.receiverFinalY = receiverPos.y;

    // Creating Network Devices with responsive positioning
    this.obstacles = this.physics.add.staticGroup();

    // Create router in the middle position
    const routerPos = this.devicePositions.router;
    this.router = new NetworkDevice(this, routerPos.x, routerPos.y, "router");
    this.router.setScale(this.deviceScale); // Apply responsive scaling
    this.addGlowEffect(this.router);
    this.obstacles.add(this.router);

    // Create switches with responsive positioning
    const leftSwitchPos = this.devicePositions.leftSwitch;
    this.leftSwitch = new NetworkDevice(
      this,
      leftSwitchPos.x,
      leftSwitchPos.y,
      "switch"
    );
    this.leftSwitch.setScale(this.deviceScale); // Apply responsive scaling
    this.obstacles.add(this.leftSwitch);

    const rightSwitchPos = this.devicePositions.rightSwitch;
    this.rightSwitch = new NetworkDevice(
      this,
      rightSwitchPos.x,
      rightSwitchPos.y,
      "switch"
    );
    this.rightSwitch.setScale(this.deviceScale); // Apply responsive scaling
    this.obstacles.add(this.rightSwitch);

    [this.leftSwitch, this.rightSwitch].forEach((device) => {
      this.addGlowEffect(device);
      this.obstacles.add(device);
    });

    // Add connection lines between devices
    this.createNetworkConnections();

    this.physics.add.collider(this.defender, this.obstacles);

    // Initialize NetworkPathManager with obstacles group
    this.pathManager = new NetworkPathManager(this, this.obstacles);
    this.pathManager.initializeNetworkTopology();

    // Decryption Mini Puzzle
    this.decryptionPuzzle = new DecryptionPuzzle(this);

    // Creating Packet
    this.packet = new Packet(
      this,
      this.defender.x + 10 * this.scaleFactor, // Scale the offset
      this.defender.y,
      "packet"
    );
    this.packet.setScale(0.05 * this.scaleFactor); // Scale based on screen size

    // Make the packet follow the defender
    this.packet.followDefender(this.defender);

    // Creating briefcase for encryption
    this.briefcase_red = this.add.image(
      this.scale.width / 2,
      this.scale.height / 2,
      "briefcase"
    );
    this.briefcase_red
      .setScale(2 * this.scaleFactor)
      .setDepth(1)
      .setVisible(false);

    this.Encryptiontutorial = new EncryptionTutorial(this);

    // Message handler with responsive positions
    this.MessageHandler = new MessageHandler(
      this,
      this.packet,
      this.briefcase_red,
      leftSwitchPos.x,
      leftSwitchPos.y,
      rightSwitchPos.x,
      rightSwitchPos.y,
      this.Encryptiontutorial,
      this.decryptionPuzzle
    );

    // Creating Control Keys
    this.keys = this.input.keyboard.addKeys({
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      x: Phaser.Input.Keyboard.KeyCodes.X,
      e: Phaser.Input.Keyboard.KeyCodes.E,
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      d: Phaser.Input.Keyboard.KeyCodes.D,
      esc: Phaser.Input.Keyboard.KeyCodes.ESC,
    });

    Object.keys(this.keys).forEach((key) => {
      this.keys[key].on("down", () => this.createKeyPressEffect(key));
    });

    // Add interactive data nodes as decoration
    this.createDataNodes();

    // Listen for timeUp event
    this.events.on("timeUp", this.handleTimeUp, this);

    // Initialize network tutorial and help components
    // this.initializeNetworkComponents();

    // // Initialize Encryption Guide
    // this.initializeEncryptionGuide();

    // Setup resize handler for responsiveness
    this.scale.on("resize", this.handleResize, this);
  }

  createAchievementsButton() {
    // Calculate responsive sizes - use the same calculations as in initializeUIButtons
    const scaleFactor = Math.min(
      this.scale.width / 1280,
      this.scale.height / 720
    );
    const isMobile = this.scale.width < 768;

    // Use the position of the encryption guide button and add an additional buttonSpacing
    const buttonX = this.uiButtonX;
    const buttonY = 50 * scaleFactor + this.buttonSpacing * 3; // Position below encryption guide button

    // Create achievements button container
    const achievementsButton = this.add
      .container(buttonX, buttonY)
      .setDepth(101);

    // Button background
    const buttonBg = this.add
      .rectangle(0, 0, 60, 60, 0x331100, 0.8)
      .setStrokeStyle(2, 0xffcc00)
      .setInteractive();

    // Trophy icon
    const trophyIcon = this.add
      .text(0, -10, "🏆", { fontSize: "28px" })
      .setOrigin(0.5);

    // Button label
    const buttonLabel = this.add
      .text(0, 20, "Achievements", {
        fontSize: "12px",
        fill: "#ffcc00",
      })
      .setOrigin(0.5);

    // Add elements to container
    achievementsButton.add([buttonBg, trophyIcon, buttonLabel]);

    // Add hover effects
    buttonBg
      .on("pointerover", () => {
        buttonBg.fillColor = 0x663300;
        trophyIcon.setScale(1.1);
      })
      .on("pointerout", () => {
        buttonBg.fillColor = 0x331100;
        trophyIcon.setScale(1);
      })
      .on("pointerdown", () => {
        // Show achievements menu
        if (this.achievementTracker) {
          this.achievementTracker.showAchievementsMenu();
        }
      });

    // Add a pulse animation to draw attention
    this.tweens.add({
      targets: trophyIcon,
      scale: { from: 1, to: 1.2 },
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Store reference to update in handleUIButtonsResize
    this.achievementsButtonContainer = achievementsButton;
  }

  initializeUIButtons() {
    // Calculate responsive sizes
    const scaleFactor = Math.min(
      this.scale.width / 1280,
      this.scale.height / 720
    );
    const isMobile = this.scale.width < 768;

    // Calculate base position for top-right corner buttons
    this.uiButtonX = this.scale.width - 50 * scaleFactor;

    // Create vertical spacing between buttons
    // Use smaller spacing on mobile
    this.buttonSpacing = isMobile
      ? Math.max(50, 60 * scaleFactor)
      : Math.max(70, 80 * scaleFactor);

    // Create buttons in order from top to bottom
    // 1. Exit button (highest)
    this.createBackButton(this.uiButtonX, 50 * scaleFactor);

    // 2. Network guide button (middle)
    this.createNetworkGuideButton(
      this.uiButtonX,
      50 * scaleFactor + this.buttonSpacing
    );

    // 3. Encryption guide button (lowest)
    this.createEncryptionGuideButton(
      this.uiButtonX,
      50 * scaleFactor + this.buttonSpacing * 2
    );

    // Add listener for screen resize
    this.scale.on("resize", this.handleUIButtonsResize, this);
  }

  // Handle resize for all UI buttons
  // Handle resize for all UI buttons
  handleUIButtonsResize() {
    // Recalculate responsive sizes
    const scaleFactor = Math.min(
      this.scale.width / 1280,
      this.scale.height / 720
    );
    const isMobile = this.scale.width < 768;

    // Update base position
    this.uiButtonX = this.scale.width - 50 * scaleFactor;

    // Update spacing
    this.buttonSpacing = isMobile
      ? Math.max(50, 60 * scaleFactor)
      : Math.max(70, 80 * scaleFactor);

    // Update each button position
    if (this.backButtonContainer) {
      this.backButtonContainer.setPosition(this.uiButtonX, 50 * scaleFactor);
    }

    if (this.networkGuideButton) {
      const networkY = 50 * scaleFactor + this.buttonSpacing;
      this.networkGuideButton.setPosition(this.uiButtonX, networkY);

      if (this.networkGuideText) {
        this.networkGuideText.setPosition(
          this.uiButtonX,
          networkY + 25 * scaleFactor
        );
      }
    }

    if (this.encryptHelpButton) {
      const encryptY = 50 * scaleFactor + this.buttonSpacing * 2;
      this.encryptHelpButton.setPosition(this.uiButtonX, encryptY);

      if (this.encryptHelpText) {
        this.encryptHelpText.setPosition(
          this.uiButtonX,
          encryptY + 25 * scaleFactor
        );
      }
    }

    // Update achievements button position
    if (this.achievementsButtonContainer) {
      const achievementsY = 50 * scaleFactor + this.buttonSpacing * 3;
      this.achievementsButtonContainer.setPosition(
        this.uiButtonX,
        achievementsY
      );
    }
  }

  // Updated createBackButton method with fixed positioning
  createBackButton(x, y) {
    // Calculate responsive sizes
    const scaleFactor = Math.min(
      this.scale.width / 1280,
      this.scale.height / 720
    );
    const isMobile = this.scale.width < 768;

    // Calculate size based on screen dimensions
    const hexSize = Math.max(
      25,
      isMobile ? 30 * scaleFactor : 40 * scaleFactor
    );

    // Create button container
    this.backButtonContainer = this.add.container(x, y).setDepth(102);

    // Create hexagonal shape for the back button
    const hexagon = this.add.graphics();
    hexagon.fillStyle(0x003300, 0.8);
    hexagon.lineStyle(2, 0x00ff00, 1);

    // Draw hexagon path scaled for screen size
    const hexPoints = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3 - Math.PI / 6;
      hexPoints.push({
        x: hexSize * Math.cos(angle),
        y: hexSize * Math.sin(angle),
      });
    }

    hexagon.beginPath();
    hexagon.moveTo(hexPoints[0].x, hexPoints[0].y);
    for (let i = 1; i < 6; i++) {
      hexagon.lineTo(hexPoints[i].x, hexPoints[i].y);
    }
    hexagon.closePath();
    hexagon.fillPath();
    hexagon.strokePath();

    // Add button text with responsive font size
    const fontSize = Math.max(
      12,
      isMobile ? 14 * scaleFactor : 16 * scaleFactor
    );
    const text = this.add
      .text(0, 0, "EXIT", {
        fontSize: fontSize + "px",
        fill: "#00ff00",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Add a blinking cursor effect for cyberpunk feel
    const cursor = this.add
      .text(text.width / 2 + 3, 0, "_", {
        fontSize: fontSize + "px",
        fill: "#00ff00",
        fontFamily: "Courier New",
      })
      .setOrigin(0, 0.5);

    this.tweens.add({
      targets: cursor,
      alpha: 0,
      duration: 600,
      yoyo: true,
      repeat: -1,
    });

    // Add elements to container
    this.backButtonContainer.add([hexagon, text, cursor]);

    // Add interactivity
    hexagon
      .setInteractive(
        new Phaser.Geom.Polygon(hexPoints),
        Phaser.Geom.Polygon.Contains
      )
      .on("pointerover", () => {
        this.tweens.add({
          targets: [text, cursor],
          scale: 1.1,
          duration: 100,
        });

        // Create glow effect
        const glowGraphics = this.add.graphics();
        glowGraphics.lineStyle(4, 0x00ff00, 0.7);
        glowGraphics.strokePath();
        this.backButtonContainer.add(glowGraphics);

        // Animate glow
        this.tweens.add({
          targets: glowGraphics,
          alpha: 0.3,
          duration: 500,
          yoyo: true,
          repeat: -1,
          onUpdate: () => {
            glowGraphics.clear();
            glowGraphics.lineStyle(4, 0x00ff00, glowGraphics.alpha);
            glowGraphics.strokePath();
          },
        });

        // Store reference for cleanup
        this.backButtonGlow = glowGraphics;
      })
      .on("pointerout", () => {
        this.tweens.add({
          targets: [text, cursor],
          scale: 1,
          duration: 100,
        });

        if (this.backButtonGlow) {
          this.tweens.killTweensOf(this.backButtonGlow);
          this.backButtonGlow.destroy();
          this.backButtonGlow = null;
        }
      })
      .on("pointerdown", () => {
        if (this.timeManager && this.timeManager.isActive) {
          // Pause the timer
          this.timeManager.isActive = false;
          // Show confirmation dialog
          this.showConfirmationDialog();
        } else {
          this.scene.start("Title");
        }
      });

    // Add a terminal-style animation on first appearance
    this.backButtonContainer.setAlpha(0);
    this.tweens.add({
      targets: this.backButtonContainer,
      alpha: 1,
      duration: 600,
      ease: "Power2",
    });
  }

  // Updated createNetworkGuideButton method with fixed positioning
  createNetworkGuideButton(x, y) {
    // Create and initialize network tutorial overlay
    this.networkTutorial = new NetworkTutorialOverlay(this);

    // Calculate responsive sizes
    const scaleFactor = Math.min(
      this.scale.width / 1280,
      this.scale.height / 720
    );
    const isMobile = this.scale.width < 768;

    // Button and text sizes - make smaller on mobile
    const buttonSize = Math.max(
      24,
      isMobile ? 26 * scaleFactor : 32 * scaleFactor
    );
    const buttonPadding = Math.max(
      6,
      isMobile ? 8 * scaleFactor : 12 * scaleFactor
    );
    const fontSize = Math.max(
      8,
      isMobile ? 10 * scaleFactor : 12 * scaleFactor
    );

    // Create network guide button
    this.networkGuideButton = this.add
      .text(x, y, "?", {
        fontSize: buttonSize + "px",
        fontStyle: "bold",
        backgroundColor: "#004466",
        padding: {
          x: buttonPadding,
          y: buttonPadding,
        },
        borderRadius: 15,
        fill: "#00ffff",
      })
      .setOrigin(0.5)
      .setInteractive()
      .setDepth(101);

    // Add hover effects
    this.networkGuideButton.on("pointerover", () => {
      this.networkGuideButton.setScale(1.1);
      this.networkGuideButton.setBackgroundColor("#006699");
    });

    this.networkGuideButton.on("pointerout", () => {
      this.networkGuideButton.setScale(1);
      this.networkGuideButton.setBackgroundColor("#004466");
    });

    // Show network tutorial when clicked
    this.networkGuideButton.on("pointerdown", () => {
      this.networkTutorial.showTutorial();
    });

    // Add help text with responsive positioning and font size
    this.networkGuideText = this.add
      .text(x, y + 25 * scaleFactor, "Network Guide", {
        fontSize: fontSize + "px",
        fill: "#ffffff",
      })
      .setOrigin(0.5)
      .setDepth(101);

    // Show tutorial on first load
    this.time.delayedCall(1000, () => {
      // Only show tutorial automatically if no devices are configured yet
      if (
        this.pathManager &&
        !this.pathManager.isPathValid() &&
        this.pathManager.currentPath.length === 0
      ) {
        this.networkTutorial.showTutorial();
      }
    });
  }

  // Updated createEncryptionGuideButton method with fixed positioning
  createEncryptionGuideButton(x, y) {
    // Create and initialize encryption guide overlay
    this.encryptionGuide = new EncryptionGuideOverlay(this);

    // Calculate responsive sizes
    const scaleFactor = Math.min(
      this.scale.width / 1280,
      this.scale.height / 720
    );
    const isMobile = this.scale.width < 768;

    // Button and text sizes - make smaller on mobile
    const buttonSize = Math.max(
      24,
      isMobile ? 26 * scaleFactor : 32 * scaleFactor
    );
    const buttonPadding = Math.max(
      6,
      isMobile ? 8 * scaleFactor : 12 * scaleFactor
    );
    const fontSize = Math.max(
      8,
      isMobile ? 10 * scaleFactor : 12 * scaleFactor
    );

    // Create help button for encryption guide
    this.encryptHelpButton = this.add
      .text(x, y, "?", {
        fontSize: buttonSize + "px",
        fontStyle: "bold",
        backgroundColor: "#440066",
        padding: {
          x: buttonPadding,
          y: buttonPadding,
        },
        borderRadius: 15,
        fill: "#ff00ff",
      })
      .setOrigin(0.5)
      .setInteractive()
      .setDepth(101);

    // Add hover effects
    this.encryptHelpButton.on("pointerover", () => {
      this.encryptHelpButton.setScale(1.1);
      this.encryptHelpButton.setBackgroundColor("#660099");
    });

    this.encryptHelpButton.on("pointerout", () => {
      this.encryptHelpButton.setScale(1);
      this.encryptHelpButton.setBackgroundColor("#440066");
    });

    // Show encryption guide when clicked
    this.encryptHelpButton.on("pointerdown", () => {
      this.encryptionGuide.showTutorial();
    });

    // Add help text with responsive positioning and font size
    this.encryptHelpText = this.add
      .text(x, y + 25 * scaleFactor, "Encryption Guide", {
        fontSize: fontSize + "px",
        fill: "#ffffff",
      })
      .setOrigin(0.5)
      .setDepth(101);
  }

  // New method to handle resize events
  handleResize(gameSize) {
    // Update screen dimensions
    this.screenWidth = gameSize.width;
    this.screenHeight = gameSize.height;

    // Recalculate responsive properties
    this.setResponsiveProperties();

    // Update positions of network devices
    this.updateDevicePositions();
  }

  // New method to update device positions on resize
  updateDevicePositions() {
    if (!this.leftSwitch || !this.rightSwitch || !this.router) return;

    // Update defender position (only if not actively controlled by player)
    if (
      !this.keys.w.isDown &&
      !this.keys.a.isDown &&
      !this.keys.s.isDown &&
      !this.keys.d.isDown
    ) {
      const defenderPos = this.devicePositions.defender;
      this.defender.setPosition(
        defenderPos.x - this.deviceSpacing,
        defenderPos.y + this.deviceSpacing
      );
      this.defender.setScale(this.characterScale); // Use character scale
    }

    // Update receiver position
    const receiverPos = this.devicePositions.receiver;
    const receiverOffset = this.deviceSpacing * 0.6;
    this.receiver.setPosition(receiverPos.x + receiverOffset, receiverPos.y);
    this.receiver.setScale(this.characterScale); // Use character scale
    // Update receiver final position
    this.receiverFinalX = receiverPos.x + this.deviceSpacing * 0.4;
    this.receiverFinalY = receiverPos.y;

    // Update network devices positions
    const leftSwitchPos = this.devicePositions.leftSwitch;
    this.leftSwitch.setPosition(leftSwitchPos.x, leftSwitchPos.y);
    this.leftSwitch.setScale(this.deviceScale);

    const rightSwitchPos = this.devicePositions.rightSwitch;
    this.rightSwitch.setPosition(rightSwitchPos.x, rightSwitchPos.y);
    this.rightSwitch.setScale(this.deviceScale);

    const routerPos = this.devicePositions.router;
    this.router.setPosition(routerPos.x, routerPos.y);
    this.router.setScale(this.deviceScale);

    // Update MessageHandler positions
    this.MessageHandler.dX = leftSwitchPos.x;
    this.MessageHandler.dY = leftSwitchPos.y;
    this.MessageHandler.rX = rightSwitchPos.x;
    this.MessageHandler.rY = rightSwitchPos.y;
    this.MessageHandler.receiverX = rightSwitchPos.x;
    this.MessageHandler.receiverY = rightSwitchPos.y;
  }

  createEnhancedBackground() {
    // First add the base image background
    this.background = this.add.image(0, 0, "background");
    this.background.setOrigin(0, 0);
    this.background.displayWidth = this.scale.width;
    this.background.displayHeight = this.scale.height;

    // Add a grid overlay to enhance the cybersecurity feel
    this.createCyberGrid();

    // Add animated circuit elements
    this.createCircuitElements();
  }

  createCyberGrid() {
    // Create a grid overlay
    const grid = this.add.graphics();
    grid.lineStyle(1, 0x00ffff, 0.15); // Cyan lines, subtle opacity

    // Draw horizontal lines
    const gridSize = 40;
    for (let y = 0; y < this.scale.height; y += gridSize) {
      grid.moveTo(0, y);
      grid.lineTo(this.scale.width, y);
    }

    // Draw vertical lines
    for (let x = 0; x < this.scale.width; x += gridSize) {
      grid.moveTo(x, 0);
      grid.lineTo(x, this.scale.height);
    }

    // Animate grid subtly
    this.tweens.add({
      targets: grid,
      alpha: { from: 0.15, to: 0.05 },
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  createCircuitElements() {
    // Create circuit trace graphics
    const circuits = this.add.graphics();
    circuits.lineStyle(2, 0x00ffaa, 0.3);

    // Draw some horizontal circuit traces
    for (let i = 0; i < 5; i++) {
      const y = Math.random() * this.scale.height;
      circuits.beginPath();
      circuits.moveTo(0, y);

      // Create a zig-zag pattern
      for (let x = 100; x < this.scale.width; x += 100) {
        const offset = Math.random() > 0.5 ? 30 : -30;
        circuits.lineTo(x, y + offset);
      }

      circuits.strokePath();
    }

    // Draw some vertical circuit traces
    for (let i = 0; i < 5; i++) {
      const x = Math.random() * this.scale.width;
      circuits.beginPath();
      circuits.moveTo(x, 0);

      // Create a zig-zag pattern
      for (let y = 100; y < this.scale.height; y += 100) {
        const offset = Math.random() > 0.5 ? 30 : -30;
        circuits.lineTo(x + offset, y);
      }

      circuits.strokePath();
    }

    // Create animated circuit pulses
    this.time.addEvent({
      delay: 2000,
      callback: this.createCircuitPulse,
      callbackScope: this,
      loop: true,
    });
  }

  createCircuitPulse() {
    // Choose a random circuit path and send a pulse down it
    const isHorizontal = Math.random() > 0.5;
    const position =
      Math.random() * (isHorizontal ? this.scale.height : this.scale.width);

    const pulse = this.add
      .circle(
        isHorizontal ? 0 : position,
        isHorizontal ? position : 0,
        3,
        0x00ffaa,
        1
      )
      .setAlpha(0.8);

    this.tweens.add({
      targets: pulse,
      x: isHorizontal ? this.scale.width : pulse.x,
      y: isHorizontal ? pulse.y : this.scale.height,
      duration: 2000,
      ease: "Linear",
      onComplete: () => pulse.destroy(),
    });
  }

  createDataNodes() {
    // Create interactive data nodes that pulse
    for (let i = 0; i < 8; i++) {
      // Position nodes around the game area but away from critical gameplay elements
      let x, y;
      let validPosition = false;

      // Make sure nodes don't overlap with important game elements
      while (!validPosition) {
        x = Phaser.Math.Between(50, this.scale.width - 50);
        y = Phaser.Math.Between(50, this.scale.height - 50);

        // Check distance from defender, receiver, and switches
        const minDistanceFromElements = 150;
        if (
          Phaser.Math.Distance.Between(x, y, this.defender.x, this.defender.y) >
            minDistanceFromElements &&
          Phaser.Math.Distance.Between(x, y, this.receiver.x, this.receiver.y) >
            minDistanceFromElements &&
          Phaser.Math.Distance.Between(
            x,
            y,
            this.leftSwitch.x,
            this.leftSwitch.y
          ) > minDistanceFromElements &&
          Phaser.Math.Distance.Between(
            x,
            y,
            this.rightSwitch.x,
            this.rightSwitch.y
          ) > minDistanceFromElements
        ) {
          validPosition = true;
        }
      }

      // Create the node
      const node = this.add.circle(x, y, 6, 0x00ff88, 1);

      // Add pulsing animation
      this.tweens.add({
        targets: node,
        scale: { from: 0.7, to: 1.3 },
        alpha: { from: 0.7, to: 0.3 },
        duration: 1200 + Math.random() * 800,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });

      // Add a glow effect
      const glow = this.add.circle(x, y, 12, 0x00ff88, 0.3);
      this.tweens.add({
        targets: glow,
        scale: { from: 0.5, to: 1.5 },
        alpha: { from: 0.3, to: 0 },
        duration: 1500,
        repeat: -1,
        ease: "Sine.easeOut",
      });
    }
  }

  // Create a new method for the enhanced confirmation dialog
  showConfirmationDialog() {
    // Calculate responsive sizes
    const scaleFactor = Math.min(
      this.scale.width / 1280,
      this.scale.height / 720
    );
    const isMobile = this.scale.width < 768;

    // Font sizes
    const titleSize = Math.max(20, 28 * scaleFactor);
    const textSize = Math.max(16, 24 * scaleFactor);
    const buttonTextSize = Math.max(16, 20 * scaleFactor);

    // Dialog dimensions
    const dialogWidth = Math.min(500 * scaleFactor, this.scale.width * 0.9);
    const dialogHeight = Math.min(300 * scaleFactor, this.scale.height * 0.7);

    // Hide previous dialog if exists
    if (this.confirmDialog) {
      this.confirmDialog.destroy();
    }

    // Create a new stylized confirmation dialog
    this.confirmDialog = this.add
      .container(this.scale.width / 2, this.scale.height / 2)
      .setDepth(1000)
      .setAlpha(0);

    // Add a dark overlay
    const overlay = this.add
      .rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.7)
      .setOrigin(0.5)
      .setInteractive() // Makes it act as a modal barrier
      .on("pointerdown", () => {
        // Keep the event from propagating
        return false;
      });

    // Add background with terminal style
    const bg = this.add.graphics();
    bg.fillStyle(0x000000, 0.9);
    bg.fillRect(-dialogWidth / 2, -dialogHeight / 2, dialogWidth, dialogHeight);
    bg.lineStyle(3, 0x00ffaa, 1);
    bg.strokeRect(
      -dialogWidth / 2,
      -dialogHeight / 2,
      dialogWidth,
      dialogHeight
    );

    // Add decorative terminal elements
    bg.lineStyle(2, 0x00ffaa, 0.8);
    // Scale corner details based on dialog size
    const cornerSize = Math.min(30, dialogWidth * 0.06);

    // Top-left corner detail
    bg.beginPath();
    bg.moveTo(-dialogWidth / 2, -dialogHeight / 2 + cornerSize);
    bg.lineTo(-dialogWidth / 2, -dialogHeight / 2);
    bg.lineTo(-dialogWidth / 2 + cornerSize, -dialogHeight / 2);
    bg.strokePath();

    // Top-right corner detail
    bg.beginPath();
    bg.moveTo(dialogWidth / 2, -dialogHeight / 2 + cornerSize);
    bg.lineTo(dialogWidth / 2, -dialogHeight / 2);
    bg.lineTo(dialogWidth / 2 - cornerSize, -dialogHeight / 2);
    bg.strokePath();

    // Bottom-left corner detail
    bg.beginPath();
    bg.moveTo(-dialogWidth / 2, dialogHeight / 2 - cornerSize);
    bg.lineTo(-dialogWidth / 2, dialogHeight / 2);
    bg.lineTo(-dialogWidth / 2 + cornerSize, dialogHeight / 2);
    bg.strokePath();

    // Bottom-right corner detail
    bg.beginPath();
    bg.moveTo(dialogWidth / 2, dialogHeight / 2 - cornerSize);
    bg.lineTo(dialogWidth / 2, dialogHeight / 2);
    bg.lineTo(dialogWidth / 2 - cornerSize, dialogHeight / 2);
    bg.strokePath();

    // Add header bar with responsive sizing
    const headerHeight = Math.min(30, dialogHeight * 0.1);
    const headerBg = this.add.rectangle(
      0,
      -dialogHeight / 2 + headerHeight / 2,
      dialogWidth,
      headerHeight,
      0x001a1a,
      1
    );

    const headerText = this.add
      .text(0, -dialogHeight / 2 + headerHeight / 2, "SYSTEM WARNING", {
        fontFamily: "Courier New",
        fontSize: titleSize + "px",
        fill: "#00ffaa",
        align: "center",
      })
      .setOrigin(0.5);

    // Add system prompt text using a typewriter effect
    const warningText = this.add
      .text(0, -dialogHeight / 4, "", {
        fontFamily: "Courier New",
        fontSize: textSize + "px",
        fill: "#ff3300",
        align: "center",
        wordWrap: { width: dialogWidth - 50 },
      })
      .setOrigin(0.5);

    // Typewriter effect
    let displayText = "Exit to main menu?\nAll mission progress will be lost.";
    let currentChar = 0;

    const typewriterTimer = this.time.addEvent({
      delay: 30,
      callback: () => {
        warningText.text += displayText[currentChar];
        currentChar++;
        if (currentChar === displayText.length) {
          typewriterTimer.destroy();
        }
      },
      repeat: displayText.length - 1,
    });

    // Scale button sizes
    const buttonWidth = Math.min(160, dialogWidth * 0.4);
    const buttonHeight = Math.min(50, dialogHeight * 0.15);

    // Add button style function
    const createCyberButton = (x, y, text, color, callback) => {
      const buttonContainer = this.add.container(x, y);

      // Button shape - scaled for screen size
      const buttonShape = this.add.graphics();
      buttonShape.fillStyle(color === "green" ? 0x003300 : 0x330000, 0.9);
      buttonShape.lineStyle(2, color === "green" ? 0x00ff00 : 0xff0000, 1);

      // Draw angled rectangle with responsive sizing
      const buttonPoints = [
        { x: -buttonWidth / 2, y: -buttonHeight / 2 },
        { x: buttonWidth / 2, y: -buttonHeight / 2 },
        { x: buttonWidth / 2 + 10 * scaleFactor, y: 0 },
        { x: buttonWidth / 2, y: buttonHeight / 2 },
        { x: -buttonWidth / 2, y: buttonHeight / 2 },
        { x: -buttonWidth / 2 - 10 * scaleFactor, y: 0 },
      ];

      buttonShape.beginPath();
      buttonShape.moveTo(buttonPoints[0].x, buttonPoints[0].y);
      for (let i = 1; i < buttonPoints.length; i++) {
        buttonShape.lineTo(buttonPoints[i].x, buttonPoints[i].y);
      }
      buttonShape.closePath();
      buttonShape.fillPath();
      buttonShape.strokePath();

      // Button text with responsive font size
      const buttonText = this.add
        .text(0, 0, text, {
          fontFamily: "Courier New",
          fontSize: buttonTextSize + "px",
          fill: color === "green" ? "#00ff00" : "#ff0000",
          align: "center",
        })
        .setOrigin(0.5);

      // Add to container
      buttonContainer.add([buttonShape, buttonText]);

      // Make interactive
      buttonShape
        .setInteractive(
          new Phaser.Geom.Polygon(buttonPoints),
          Phaser.Geom.Polygon.Contains
        )
        .on("pointerover", () => {
          this.tweens.add({
            targets: buttonContainer,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 100,
          });
        })
        .on("pointerout", () => {
          this.tweens.add({
            targets: buttonContainer,
            scaleX: 1,
            scaleY: 1,
            duration: 100,
          });
        })
        .on("pointerdown", callback);

      return buttonContainer;
    };

    // Responsive button positioning
    const buttonY = dialogHeight / 3;
    const buttonSpacing = Math.min(240, dialogWidth * 0.6);

    // Create confirm and cancel buttons with responsive sizing and positioning
    const confirmButton = createCyberButton(
      -buttonSpacing / 2,
      buttonY,
      "CONFIRM",
      "green",
      () => {
        this.scene.start("Title");
      }
    );

    const cancelButton = createCyberButton(
      buttonSpacing / 2,
      buttonY,
      "CANCEL",
      "red",
      () => {
        // Resume timer
        this.timeManager.isActive = true;

        // Close dialog with animation
        this.tweens.add({
          targets: this.confirmDialog,
          alpha: 0,
          y: this.scale.height / 2 + 20,
          duration: 300,
          ease: "Power2",
          onComplete: () => {
            this.confirmDialog.destroy();
            this.confirmDialog = null;
          },
        });
      }
    );

    // Add a blinking cursor for immersion - scaled for screen size
    const cursor = this.add
      .text(0, 0, "_", {
        fontFamily: "Courier New",
        fontSize: textSize + "px",
        fill: "#00ffaa",
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: cursor,
      alpha: 0,
      duration: 500,
      yoyo: true,
      repeat: -1,
    });

    // Add all elements to container
    this.confirmDialog.add([
      overlay,
      bg,
      headerBg,
      headerText,
      warningText,
      confirmButton,
      cancelButton,
      cursor,
    ]);

    // Show dialog with animation
    this.tweens.add({
      targets: this.confirmDialog,
      alpha: 1,
      y: { from: this.scale.height / 2 - 30, to: this.scale.height / 2 },
      duration: 300,
      ease: "Power2",
    });
  }

  handleTimeUp() {
    // Create game over overlay
    const overlay = this.add
      .rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.8)
      .setOrigin(0);

    const gameOverText = this.add
      .text(this.scale.width / 2, this.scale.height / 2, "TIME'S UP!", {
        fontSize: "48px",
        fill: "#ff0000",
        stroke: "#000000",
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    // Add final score
    const finalScore = this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 + 60,
        `Final Score: ${this.walletManager.coins} CC`,
        {
          fontSize: "32px",
          fill: "#ffd700",
          stroke: "#000000",
          strokeThickness: 4,
        }
      )
      .setOrigin(0.5);

    this.events.emit("gameOver");

    // Shake camera
    this.cameras.main.shake(500, 0.05);

    // Restart game after delay
    this.time.delayedCall(3000, () => {
      this.scene.restart();
    });
  }

  createKeyPressEffect(key) {
    const keyText = this.add
      .text(this.scale.width - 100, this.scale.height - 50, key.toUpperCase(), {
        fontSize: "24px",
        fill: "#00ff00",
        fontFamily: "Courier New",
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: keyText,
      alpha: 0,
      y: this.scale.height - 70,
      duration: 500,
      onComplete: () => keyText.destroy(),
    });
  }

  createVisualEffects() {
    // Create a group for packet trail effects
    this.packetTrail = this.add.group();

    // Setup packet trail effect
    this.time.addEvent({
      delay: 100,
      callback: this.createPacketTrail,
      callbackScope: this,
      loop: true,
    });
  }

  createPacketTrail() {
    if (this.packet && this.packet.visible) {
      const trail = this.add.circle(
        this.packet.x,
        this.packet.y,
        3,
        0x00ff00,
        0.7
      );

      this.packetTrail.add(trail);

      this.tweens.add({
        targets: trail,
        alpha: 0,
        scale: 0.1,
        duration: 500,
        onComplete: () => {
          trail.destroy();
        },
      });
    }
  }

  // Updating NetworkDevice sizing in the NetworkDevice class
  addGlowEffect(gameObject) {
    const glowGraphics = this.add.graphics();
    const glowColor = 0x00ff00;

    // Calculate glow radius based on device scale
    const glowRadius = gameObject.displayWidth * 0.6;

    this.tweens.add({
      targets: glowGraphics,
      alpha: { from: 0.5, to: 0.2 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
      onUpdate: () => {
        glowGraphics.clear();
        glowGraphics.lineStyle(2, glowColor, glowGraphics.alpha);
        glowGraphics.strokeCircle(gameObject.x, gameObject.y, glowRadius);
      },
    });
  }

  createNetworkConnections() {
    this.connectionGraphics = this.add.graphics();

    this.time.addEvent({
      delay: 50,
      callback: this.updateNetworkConnections,
      callbackScope: this,
      loop: true,
    });
  }

  updateNetworkConnections() {
    // Only draw connection if path is valid (devices configured)
    if (this.pathManager && this.pathManager.isPathValid()) {
      this.connectionGraphics.clear();
      this.connectionGraphics.lineStyle(2, 0x00ff00, 0.5);

      const progress = (Date.now() % 2000) / 2000;

      // Draw connection from left switch to router
      if (this.leftSwitch && this.router) {
        this.drawAnimatedConnection(
          this.connectionGraphics,
          this.leftSwitch.x,
          this.leftSwitch.y,
          this.router.x,
          this.router.y,
          progress
        );
      }

      // Draw connection from router to right switch
      if (this.router && this.rightSwitch) {
        this.drawAnimatedConnection(
          this.connectionGraphics,
          this.router.x,
          this.router.y,
          this.rightSwitch.x,
          this.rightSwitch.y,
          (progress + 0.33) % 1 // Offset for visual variety
        );
      }
    } else {
      // Clear any existing connection if path becomes invalid
      this.connectionGraphics.clear();
    }
  }

  drawAnimatedConnection(graphics, x1, y1, x2, y2, progress) {
    // Draw base line
    graphics.beginPath();
    graphics.moveTo(x1, y1);
    graphics.lineTo(x2, y2);
    graphics.strokePath();

    // Draw moving data packets
    const dotCount = 3;
    for (let i = 0; i < dotCount; i++) {
      const dotProgress = (progress + i / dotCount) % 1;
      const dotX = x1 + (x2 - x1) * dotProgress;
      const dotY = y1 + (y2 - y1) * dotProgress;

      graphics.fillStyle(0x00ff00, 1);
      graphics.fillCircle(dotX, dotY, 3);
    }
  }

  // Add this to your GameScene.js file's create() method after initializing other components

  // Add to GameScene's update method

  handleNetworkStatus() {
    // Check if all network devices are configured
    if (this.pathManager && this.pathManager.isPathValid()) {
      // Show success message if this is the first time path is valid
      if (!this.networkConfigured) {
        this.networkConfigured = true;

        // Create celebratory message
        const networkReadyText = this.add
          .text(this.scale.width / 2, 100, "NETWORK CONFIGURED SUCCESSFULLY!", {
            fontSize: "28px",
            fontStyle: "bold",
            fill: "#00ff00",
            backgroundColor: "#003300",
            padding: 10,
            stroke: "#000000",
            strokeThickness: 2,
          })
          .setOrigin(0.5)
          .setDepth(100);

        // Add particles for visual celebration
        const particles = this.add.particles(
          this.scale.width / 2,
          120,
          "packet",
          {
            speed: { min: 100, max: 200 },
            scale: { start: 0.1, end: 0 },
            blendMode: "ADD",
            lifespan: 1000,
            quantity: 20,
          }
        );

        // Animate and remove after a few seconds
        this.tweens.add({
          targets: networkReadyText,
          y: 120,
          alpha: { from: 1, to: 0 },
          duration: 3000,
          delay: 2000,
          ease: "Power2",
          onComplete: () => {
            networkReadyText.destroy();
            particles.destroy();

            // Show encryption guide hint after network is configured
            this.showEncryptionGuideHint();
          },
        });
      }
    }
  }

  // Add this method to show a hint about the encryption guide
  showEncryptionGuideHint() {
    // Only show once
    if (this.encryptionHintShown) return;
    this.encryptionHintShown = true;

    // Calculate responsive sizes
    const scaleFactor = Math.min(
      this.scale.width / 1280,
      this.scale.height / 720
    );
    const fontSize = Math.max(14, 16 * scaleFactor);

    // Create hint message with responsive sizing
    const hintText = this.add
      .text(
        this.scale.width / 2,
        150 * scaleFactor,
        "Ready to send encrypted messages! Check the Encryption Guide for help.",
        {
          fontSize: fontSize + "px",
          fill: "#ff00ff",
          backgroundColor: "#330033",
          padding: {
            x: 10 * scaleFactor,
            y: 5 * scaleFactor,
          },
        }
      )
      .setOrigin(0.5)
      .setDepth(100);

    // Calculate arrow coordinates based on encryption button position
    const arrowEndX = this.encryptHelpButton
      ? this.encryptHelpButton.x
      : this.uiButtonX;
    const arrowEndY = this.encryptHelpButton
      ? this.encryptHelpButton.y
      : 50 * scaleFactor + this.buttonSpacing * 2;

    // Add an arrow pointing to the encryption guide button
    const arrow = this.add.graphics().setDepth(100);
    arrow.lineStyle(3 * scaleFactor, 0xff00ff, 1);
    arrow.lineBetween(
      this.scale.width / 2 + 200 * scaleFactor,
      150 * scaleFactor,
      arrowEndX - 20 * scaleFactor,
      arrowEndY
    );

    // Add arrowhead scaled for screen size
    const arrowHeadSize = 10 * scaleFactor;
    arrow.fillStyle(0xff00ff, 1);
    arrow.fillTriangle(
      arrowEndX - 20 * scaleFactor,
      arrowEndY,
      arrowEndX - 20 * scaleFactor - arrowHeadSize,
      arrowEndY - arrowHeadSize,
      arrowEndX - 20 * scaleFactor - arrowHeadSize,
      arrowEndY + arrowHeadSize
    );

    // Store references to ensure proper cleanup
    this.encryptionHintElements = [hintText, arrow];

    // Animate and fade out - ensure it disappears
    const fadeTween = this.tweens.add({
      targets: [hintText, arrow],
      alpha: { from: 1, to: 0 },
      duration: 1500,
      delay: 3000,
      ease: "Power2",
      onComplete: () => {
        // Ensure complete destruction of elements
        hintText.destroy();
        arrow.destroy();

        // Clear references
        this.encryptionHintElements = null;
      },
    });

    // Store tween reference for potential cleanup
    this.encryptionHintTween = fadeTween;

    // Flash the encryption help button to draw attention
    if (this.encryptHelpButton) {
      const buttonTween = this.tweens.add({
        targets: this.encryptHelpButton,
        scale: { from: 1, to: 1.2 },
        duration: 500,
        yoyo: true,
        repeat: 3,
        ease: "Sine.easeInOut",
        onComplete: () => {
          // Reset button scale
          if (this.encryptHelpButton) {
            this.encryptHelpButton.setScale(1);
          }
        },
      });

      // Also store this tween reference
      this.encryptHelpButtonTween = buttonTween;
    }
  }
  // Updated update method for GameScene.js that fixes the interaction issue
  // Add this to your GameScene.js file

  // Update method to handle responsiveness during gameplay
  // In GameScene.js, replace the entire obstacle checking section in the update() method with this improved version:

  update() {
    this.defender.update(this.keys, this.MessageHandler.menuActive);

    // Update packet position to follow defender
    if (this.packet) {
      this.packet.update();
    }

    this.nearObstacle = false;
    let nearestObstacle = null;
    let minDistance = Infinity;

    // Find the nearest obstacle and check if player is near any obstacle
    this.obstacles.children.iterate((obstacle) => {
      // Calculate the interaction distance dynamically based on sprite sizes
      // This takes into account both the defender and device sizes
      const interactionDistance =
        this.defender.width * 0.5 + obstacle.width * 0.5 + 10; // Added a small buffer

      const distance = Phaser.Math.Distance.Between(
        this.defender.x,
        this.defender.y,
        obstacle.x,
        obstacle.y
      );

      if (distance < interactionDistance) {
        this.nearObstacle = true;

        // Track the nearest obstacle
        if (distance < minDistance) {
          minDistance = distance;
          nearestObstacle = obstacle;
        }
      }
    });

    // Show interaction prompt when near an obstacle
    if (this.nearObstacle && !this.MessageHandler.menuActive) {
      // Position the prompt near the nearest obstacle
      this.interactText.setPosition(
        nearestObstacle ? nearestObstacle.x : this.defender.x,
        (nearestObstacle ? nearestObstacle.y : this.defender.y) - 50
      );

      // Check if the device is already configured
      const isConfigured =
        nearestObstacle &&
        this.pathManager.currentPath.includes(nearestObstacle);

      // Check if we have a valid path (all required devices configured)
      const hasValidPath = this.pathManager.isPathValid();

      // Change prompt text based on device status
      if (isConfigured && hasValidPath) {
        this.interactText.setText("Press E to Send Message").setFill("#00ffaa");
      } else if (isConfigured) {
        this.interactText
          .setText("Configure other devices!")
          .setFill("#ffaa00");
      } else {
        this.interactText.setText("Press E to Configure").setFill("#00ff00");
      }

      this.interactText.setVisible(true);

      // Create or update a highlight circle around the nearest device
      if (!this.interactionHighlight) {
        this.interactionHighlight = this.add
          .circle(
            nearestObstacle.x,
            nearestObstacle.y,
            nearestObstacle.width * 0.7,
            0x00ff00,
            0.3
          )
          .setDepth(5);

        // Add pulsing animation
        this.tweens.add({
          targets: this.interactionHighlight,
          alpha: { from: 0.3, to: 0.6 },
          scale: { from: 1, to: 1.2 },
          duration: 800,
          yoyo: true,
          repeat: -1,
        });
      } else {
        // Update position if highlight already exists
        this.interactionHighlight.setPosition(
          nearestObstacle.x,
          nearestObstacle.y
        );
        this.interactionHighlight.setVisible(true);
      }
    } else {
      this.interactText.setVisible(false);

      // Hide highlight when not near any device
      if (this.interactionHighlight) {
        this.interactionHighlight.setVisible(false);
      }
    }

    // Show the context-specific menu when E is pressed near an obstacle
    if (
      Phaser.Input.Keyboard.JustDown(this.keys.e) &&
      this.nearObstacle &&
      nearestObstacle
    ) {
      if (
        this.pathManager.isPathValid() &&
        this.pathManager.currentPath.includes(nearestObstacle)
      ) {
        // If path is valid and this device is configured, open message popup
        this.MessageHandler.openMessagePopup();
      } else {
        // Otherwise, open the IP configuration popup
        this.pathManager.openIPPopup(nearestObstacle);
      }
    }

    this.handleNetworkStatus();
  }
}
