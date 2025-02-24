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

    // Creating Receiver
    const rX = (window.innerWidth * 3) / 4;
    const rY = 300;

    this.receiver = new Receiver(this, rX + 60, rY, "receiver");
    this.addGlowEffect(this.receiver);

    // Creating Network Devices
    this.obstacles = this.physics.add.staticGroup();

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
    grid.lineStyle(1, 0x00ffff, 0.15);  // Cyan lines, subtle opacity
    
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
      ease: 'Sine.easeInOut'
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
      loop: true
    });
  }
  
  createCircuitPulse() {
    // Choose a random circuit path and send a pulse down it
    const isHorizontal = Math.random() > 0.5;
    const position = Math.random() * (isHorizontal ? this.scale.height : this.scale.width);
    
    const pulse = this.add.circle(
      isHorizontal ? 0 : position,
      isHorizontal ? position : 0,
      3,
      0x00ffaa,
      1
    ).setAlpha(0.8);
    
    this.tweens.add({
      targets: pulse,
      x: isHorizontal ? this.scale.width : pulse.x,
      y: isHorizontal ? pulse.y : this.scale.height,
      duration: 2000,
      ease: 'Linear',
      onComplete: () => pulse.destroy()
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
          Phaser.Math.Distance.Between(x, y, this.defender.x, this.defender.y) > minDistanceFromElements &&
          Phaser.Math.Distance.Between(x, y, this.receiver.x, this.receiver.y) > minDistanceFromElements &&
          Phaser.Math.Distance.Between(x, y, this.leftSwitch.x, this.leftSwitch.y) > minDistanceFromElements &&
          Phaser.Math.Distance.Between(x, y, this.rightSwitch.x, this.rightSwitch.y) > minDistanceFromElements
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
        ease: 'Sine.easeInOut'
      });
      
      // Add a glow effect
      const glow = this.add.circle(x, y, 12, 0x00ff88, 0.3);
      this.tweens.add({
        targets: glow,
        scale: { from: 0.5, to: 1.5 },
        alpha: { from: 0.3, to: 0 },
        duration: 1500,
        repeat: -1,
        ease: 'Sine.easeOut'
      });
    }
  }

  createBackButton() {
    // Create a confirmation dialog container
    this.confirmDialog = this.add
      .container(this.scale.width / 2, this.scale.height / 2)
      .setDepth(1000)
      .setVisible(false);

    // Add dialog background
    const dialogBg = this.add
      .rectangle(0, 0, 400, 200, 0x000000, 0.9)
      .setStrokeStyle(2, 0x00ff00);

    // Add dialog text
    const dialogText = this.add
      .text(0, -40, "Return to main menu?\nYour progress will be lost.", {
        fontSize: "24px",
        fill: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);

    // Add confirm and cancel buttons
    const confirmButton = new UiButton(
      this,
      -80,
      40,
      "button1",
      "button2",
      "Yes",
      () => {
        this.scene.start("Title");
      }
    );

    const cancelButton = new UiButton(
      this,
      80,
      40,
      "button1",
      "button2",
      "No",
      () => {
        this.confirmDialog.setVisible(false);
      }
    );

    // Add all elements to the dialog container
    this.confirmDialog.add([dialogBg, dialogText, confirmButton, cancelButton]);

    // Create the main back button
    const backButton = new UiButton(
      this,
      this.scale.width - 150,
      50,
      "button1",
      "button2",
      "Back",
      () => {
        if (this.timeManager.isActive) {
          // Pause the timer
          this.timeManager.isActive = false;
          // Show confirmation dialog
          this.confirmDialog.setVisible(true);
        } else {
          this.scene.start("Title");
        }
      }
    );
    backButton.setDepth(102);
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
    // Only draw connection if path is valid (both IPs configured)
    if (this.pathManager && this.pathManager.isPathValid()) {
      this.connectionGraphics.clear();
      this.connectionGraphics.lineStyle(2, 0x00ff00, 0.5);

      const progress = (Date.now() % 2000) / 2000;

      this.drawAnimatedConnection(
        this.connectionGraphics,
        this.leftSwitch.x,
        this.leftSwitch.y,
        this.rightSwitch.x,
        this.rightSwitch.y,
        progress
      );
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

  // Updated update method for GameScene.js that fixes the interaction issue
// Add this to your GameScene.js file

update() {
  this.defender.update(this.keys, this.MessageHandler.menuActive);

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

  // Show interaction prompt when near an obstacle and when valid path exists
  // Important: We no longer check if the object is part of the path - we allow interaction with configured devices
  if (
    this.nearObstacle &&
    !this.MessageHandler.menuActive &&
    this.pathManager.isPathValid()
  ) {
    // Position the prompt near the player and obstacle
    this.interactText.setPosition(
      nearestObstacle ? nearestObstacle.x : this.defender.x,
      (nearestObstacle ? nearestObstacle.y : this.defender.y) - 50
    );
    
    // Check if the switch is already configured (in the path)
    const isConfigured = nearestObstacle && 
                         this.pathManager.currentPath.includes(nearestObstacle);
    
    // Change prompt text based on whether the device is configured or not
    if (isConfigured) {
      this.interactText.setText("Press E to Send Message")
                      .setFill("#00ffaa");
    } else {
      this.interactText.setText("Press E to Interact")
                      .setFill("#00ff00");
    }
    
    this.interactText.setVisible(true);
  } else {
    this.interactText.setVisible(false);
  }

  // Show the context-specific menu when E is pressed near an obstacle
  if (this.keys.e.isDown && this.nearObstacle) {
    this.nearObstacle = false;
    this.MessageHandler.openMessagePopup();
  }
}
}
