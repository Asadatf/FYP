class GameScene extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  init() {
    // Text setup for interaction prompt
    this.interactText = this.add
      .text(window.innerWidth / 2, window.innerHeight / 2, "", {
        fontSize: "24px",
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
  }

  create() {
    // Create cybersecurity-themed background with circuit patterns
    this.createEnhancedBackground();

    // Add back button
    this.createBackButton();

    // Initialize TimeManager and WalletManager first
    this.timeManager = new TimeManager(this);
    this.walletManager = new WalletManager(this);

    this.createVisualEffects();

    // Creating Defender
    const dX = window.innerWidth / 4;
    const dY = 300;

    this.defender = new Defender(this, dX - 100, dY + 200, "defender");
    this.addGlowEffect(this.defender);

    // Creating Receiver - Position it further away initially
    const rX = (window.innerWidth * 3) / 4;
    const rY = 300;
    const receiverOffset = 150; // Distance away from the switch

    // Position receiver farther from the switch
    this.receiver = new Receiver(this, rX + receiverOffset, rY, "receiver");
    this.addGlowEffect(this.receiver);

    // Store the receiver's final position (near the switch)
    this.receiverFinalX = rX + 60;
    this.receiverFinalY = rY;

    // Creating Network Devices
    this.obstacles = this.physics.add.staticGroup();

    // Create router in the middle position
    const routerX = (dX + rX) / 2;
    const routerY = (dY + rY) / 2 - 100;
    this.router = new NetworkDevice(this, routerX, routerY, "router");
    this.addGlowEffect(this.router);
    this.obstacles.add(this.router);

    this.leftSwitch = new NetworkDevice(this, dX, dY, "switch");
    this.obstacles.add(this.leftSwitch);

    this.rightSwitch = new NetworkDevice(this, rX, rY, "switch");
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
      this.defender.x + 10,
      this.defender.y,
      "packet"
    );

    // Make the packet follow the defender
    this.packet.followDefender(this.defender);

    // Creating briefcase for encryption
    this.briefcase_red = this.add.image(
      this.scale.width / 2,
      this.scale.height / 2,
      "briefcase"
    );
    this.briefcase_red.setScale(2).setDepth(1).setVisible(false);

    this.Encryptiontutorial = new EncryptionTutorial(this);

    // Message handler
    this.MessageHandler = new MessageHandler(
      this,
      this.packet,
      this.briefcase_red,
      dX,
      dY,
      rX,
      rY,
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
    this.initializeNetworkComponents();

    // Initialize Encryption Guide
    this.initializeEncryptionGuide();
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

  // GameScene.js - Update createBackButton() method
  createBackButton() {
    // Create a more cyberpunk-styled back button instead of using UiButton
    const buttonX = this.scale.width - 80;
    const buttonY = 50;

    // Create button container
    this.backButtonContainer = this.add
      .container(buttonX, buttonY)
      .setDepth(102);

    // Create hexagonal shape for the back button
    const hexagon = this.add.graphics();
    hexagon.fillStyle(0x003300, 0.8);
    hexagon.lineStyle(2, 0x00ff00, 1);

    // Draw hexagon path
    const hexPoints = [];
    const size = 40;
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3 - Math.PI / 6;
      hexPoints.push({
        x: size * Math.cos(angle),
        y: size * Math.sin(angle),
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

    // Add button text
    const text = this.add
      .text(0, 0, "EXIT", {
        fontSize: "16px",
        fill: "#00ff00",
        fontFamily: "Courier New",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Add a blinking cursor effect for cyberpunk feel
    const cursor = this.add
      .text(text.width / 2 + 5, 0, "_", {
        fontSize: "16px",
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

    // Add hover glow effect
    const glowGraphics = this.add.graphics();
    this.backButtonContainer.add(glowGraphics);

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
        this.tweens.add({
          targets: glowGraphics,
          alpha: { from: 0.7, to: 0.3 },
          duration: 800,
          yoyo: true,
          repeat: -1,
          onUpdate: () => {
            glowGraphics.clear();
            glowGraphics.lineStyle(4, 0x00ff00, glowGraphics.alpha);
            glowGraphics.strokePath();
          },
        });
      })
      .on("pointerout", () => {
        this.tweens.add({
          targets: [text, cursor],
          scale: 1,
          duration: 100,
        });

        this.tweens.killTweensOf(glowGraphics);
        glowGraphics.clear();
      })
      .on("pointerdown", () => {
        if (this.timeManager.isActive) {
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

  // Create a new method for the enhanced confirmation dialog
  showConfirmationDialog() {
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
    bg.fillRect(-250, -150, 500, 300);
    bg.lineStyle(3, 0x00ffaa, 1);
    bg.strokeRect(-250, -150, 500, 300);

    // Add decorative terminal elements
    bg.lineStyle(2, 0x00ffaa, 0.8);
    // Top-left corner detail
    bg.beginPath();
    bg.moveTo(-250, -120);
    bg.lineTo(-220, -120);
    bg.lineTo(-220, -150);
    bg.strokePath();

    // Top-right corner detail
    bg.beginPath();
    bg.moveTo(250, -120);
    bg.lineTo(220, -120);
    bg.lineTo(220, -150);
    bg.strokePath();

    // Bottom-left corner detail
    bg.beginPath();
    bg.moveTo(-250, 120);
    bg.lineTo(-220, 120);
    bg.lineTo(-220, 150);
    bg.strokePath();

    // Bottom-right corner detail
    bg.beginPath();
    bg.moveTo(250, 120);
    bg.lineTo(220, 120);
    bg.lineTo(220, 150);
    bg.strokePath();

    // Add header bar
    const headerBg = this.add.rectangle(0, -120, 500, 30, 0x001a1a, 1);
    const headerText = this.add
      .text(0, -120, "SYSTEM WARNING", {
        fontFamily: "Courier New",
        fontSize: "20px",
        fill: "#00ffaa",
        align: "center",
      })
      .setOrigin(0.5);

    // Add system prompt text using a typewriter effect
    const warningText = this.add
      .text(0, -40, "", {
        fontFamily: "Courier New",
        fontSize: "24px",
        fill: "#ff3300",
        align: "center",
        wordWrap: { width: 450 },
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

    // Add button style function
    const createCyberButton = (x, y, text, color, callback) => {
      const buttonContainer = this.add.container(x, y);

      // Button shape - angle in radians
      const buttonShape = this.add.graphics();
      buttonShape.fillStyle(color === "green" ? 0x003300 : 0x330000, 0.9);
      buttonShape.lineStyle(2, color === "green" ? 0x00ff00 : 0xff0000, 1);

      // Draw angled rectangle
      buttonShape.beginPath();
      buttonShape.moveTo(-80, -20);
      buttonShape.lineTo(80, -20);
      buttonShape.lineTo(90, 0);
      buttonShape.lineTo(80, 20);
      buttonShape.lineTo(-80, 20);
      buttonShape.lineTo(-90, 0);
      buttonShape.closePath();
      buttonShape.fillPath();
      buttonShape.strokePath();

      // Button text
      const buttonText = this.add
        .text(0, 0, text, {
          fontFamily: "Courier New",
          fontSize: "20px",
          fill: color === "green" ? "#00ff00" : "#ff0000",
          align: "center",
        })
        .setOrigin(0.5);

      // Add to container
      buttonContainer.add([buttonShape, buttonText]);

      // Make interactive
      buttonShape
        .setInteractive(
          new Phaser.Geom.Polygon([
            -80, -20, 80, -20, 90, 0, 80, 20, -80, 20, -90, 0,
          ]),
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

    // Create confirm and cancel buttons
    const confirmButton = createCyberButton(
      -120,
      80,
      "CONFIRM",
      "green",
      () => {
        this.scene.start("Title");
      }
    );

    const cancelButton = createCyberButton(120, 80, "CANCEL", "red", () => {
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
    });

    // Add a blinking cursor for immersion
    const cursor = this.add
      .text(0, 30, "_", {
        fontFamily: "Courier New",
        fontSize: "24px",
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

  addGlowEffect(gameObject) {
    const glowGraphics = this.add.graphics();
    const glowColor = 0x00ff00;

    this.tweens.add({
      targets: glowGraphics,
      alpha: { from: 0.5, to: 0.2 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
      onUpdate: () => {
        glowGraphics.clear();
        glowGraphics.lineStyle(2, glowColor, glowGraphics.alpha);
        glowGraphics.strokeCircle(
          gameObject.x,
          gameObject.y,
          gameObject.displayWidth * 0.6
        );
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

  initializeNetworkComponents() {
    // Create and initialize network tutorial overlay
    this.networkTutorial = new NetworkTutorialOverlay(this);

    // Create help button for network configuration - aligned with exit button
    const helpButton = this.add
      .text(this.scale.width - 80, 140, "?", {
        // Updated Y position to 140 (exit button at 50 + 90px spacing)
        fontSize: "32px",
        fontStyle: "bold",
        backgroundColor: "#004466",
        padding: { x: 12, y: 8 },
        borderRadius: 15,
        fill: "#00ffff",
      })
      .setOrigin(0.5)
      .setInteractive()
      .setDepth(101);

    // Add hover effects
    helpButton.on("pointerover", () => {
      helpButton.setScale(1.1);
      helpButton.setBackgroundColor("#006699");
    });

    helpButton.on("pointerout", () => {
      helpButton.setScale(1);
      helpButton.setBackgroundColor("#004466");
    });

    // Show network tutorial when clicked
    helpButton.on("pointerdown", () => {
      this.networkTutorial.showTutorial();
    });

    // Add help text - positioned just below the button
    const helpText = this.add
      .text(this.scale.width - 80, 170, "Network Guide", {
        // Text positioned 30px below button center
        fontSize: "12px",
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

  initializeEncryptionGuide() {
    // Create and initialize encryption guide overlay
    this.encryptionGuide = new EncryptionGuideOverlay(this);

    // Create help button for encryption guide - aligned with other buttons
    const encryptHelpButton = this.add
      .text(this.scale.width - 80, 230, "?", {
        // Updated Y position to 230 (network button at 140 + 90px spacing)
        fontSize: "32px",
        fontStyle: "bold",
        backgroundColor: "#440066",
        padding: { x: 12, y: 8 },
        borderRadius: 15,
        fill: "#ff00ff",
      })
      .setOrigin(0.5)
      .setInteractive()
      .setDepth(101);

    // Add hover effects
    encryptHelpButton.on("pointerover", () => {
      encryptHelpButton.setScale(1.1);
      encryptHelpButton.setBackgroundColor("#660099");
    });

    encryptHelpButton.on("pointerout", () => {
      encryptHelpButton.setScale(1);
      encryptHelpButton.setBackgroundColor("#440066");
    });

    // Show encryption guide when clicked
    encryptHelpButton.on("pointerdown", () => {
      this.encryptionGuide.showTutorial();
    });

    // Add help text - positioned just below the button
    const encryptHelpText = this.add
      .text(this.scale.width - 80, 260, "Encryption Guide", {
        // Text positioned 30px below button center
        fontSize: "12px",
        fill: "#ffffff",
      })
      .setOrigin(0.5)
      .setDepth(101);

    // Store references
    this.encryptHelpButton = encryptHelpButton;
    this.encryptHelpText = encryptHelpText;
  }

  // Add this method to show a hint about the encryption guide
  showEncryptionGuideHint() {
    // Only show once
    if (this.encryptionHintShown) return;
    this.encryptionHintShown = true;

    // Create hint message
    const hintText = this.add
      .text(
        this.scale.width / 2,
        150,
        "Ready to send encrypted messages! Check the Encryption Guide for help.",
        {
          fontSize: "16px",
          fill: "#ff00ff",
          backgroundColor: "#330033",
          padding: { x: 10, y: 5 },
        }
      )
      .setOrigin(0.5)
      .setDepth(100);

    // Add an arrow pointing to the encryption guide button
    const arrow = this.add.graphics().setDepth(100);
    arrow.lineStyle(3, 0xff00ff, 1);
    arrow.lineBetween(
      this.scale.width / 2 + 200,
      150,
      this.scale.width - 100,
      230 // Update Y coordinate to point to the new button position
    );

    // Add arrowhead
    arrow.fillStyle(0xff00ff, 1);
    arrow.fillTriangle(
      this.scale.width - 100,
      230, // Update Y coordinate for arrowhead
      this.scale.width - 110,
      220, // Update Y coordinates for arrowhead points
      this.scale.width - 90,
      220 // Update Y coordinates for arrowhead points
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
  // Updated update method for GameScene.js that fixes the interaction issue
  // Add this to your GameScene.js file

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
      const distance = Phaser.Math.Distance.Between(
        this.defender.x,
        this.defender.y,
        obstacle.x,
        obstacle.y
      );

      if (distance < 100) {
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
      // Position the prompt near the player and obstacle
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
    } else {
      this.interactText.setVisible(false);
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
