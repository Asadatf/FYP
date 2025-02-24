class TutorialScene extends Phaser.Scene {
  constructor() {
    super("Tutorial");
  }

  create() {
    // Add background
    this.background = this.add.image(0, 0, "background");
    this.background.setOrigin(0, 0);
    this.background.displayWidth = this.scale.width;
    this.background.displayHeight = this.scale.height;

    // Initialize tutorial state
    this.tutorialStep = 0;
    this.tutorialComplete = false;
    this.hasPlayerMoved = false;
    this.hasConfiguredIP = false;
    this.hasInteractedWithSwitch = false;
    this.hasCompletedEncryption = false;

    // Create all UI elements first
    this.createUI();

    // WalletManager without timer
    this.walletManager = new WalletManager(this);
    this.walletManager.coins = 100; // Give plenty of coins for tutorial
    this.walletManager.updateDisplay();

    // Create game elements
    this.createGameElements();

    // Set up controls
    this.setupControls();

    // Start tutorial sequence
    this.startTutorialSequence();
  }

  createUI() {
    // Create tutorial overlay
    this.instructionBox = this.add
      .container(this.scale.width / 2, 100)
      .setDepth(101);

    const boxBackground = this.add
      .rectangle(0, 0, 600, 100, 0x000000, 0.8)
      .setStrokeStyle(2, 0x00ff00);

    this.instructionText = this.add
      .text(0, 0, "", {
        fontSize: "24px",
        fill: "#00ff00",
        align: "center",
        wordWrap: { width: 580 },
      })
      .setOrigin(0.5);

    this.instructionBox.add([boxBackground, this.instructionText]);

    // Create help text
    this.helpText = this.add
      .text(this.scale.width / 2, this.scale.height - 50, "", {
        fontSize: "20px",
        fill: "#00ff00",
        backgroundColor: "#000000",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setDepth(100);

    // Create interaction text
    this.interactText = this.add
      .text(this.scale.width / 2, this.scale.height / 2, "", {
        fontSize: "24px",
        fill: "#00ff00",
        stroke: "#003300",
        strokeThickness: 2,
      })
      .setOrigin(0.5)
      .setDepth(1)
      .setVisible(false);

    // Create back button
    this.createBackButton();
  }

  createGameElements() {
    // Create defender
    const dX = window.innerWidth / 4;
    const dY = 300;
    this.defender = new Defender(this, dX - 100, dY + 200, "defender");
    this.addGlowEffect(this.defender);
    this.initialDefenderPos = { x: this.defender.x, y: this.defender.y };

    // Create receiver
    const rX = (window.innerWidth * 3) / 4;
    const rY = 300;
    this.receiver = new Receiver(this, rX + 60, rY, "receiver");
    this.addGlowEffect(this.receiver);

    // Create network devices
    this.obstacles = this.physics.add.staticGroup();
    this.leftSwitch = new NetworkDevice(this, dX, dY, "switch");
    this.rightSwitch = new NetworkDevice(this, rX, rY, "switch");
    [this.leftSwitch, this.rightSwitch].forEach((device) => {
      this.addGlowEffect(device);
      this.obstacles.add(device);
    });

    // Add connection lines
    this.createNetworkConnections();

    // Add collider
    this.physics.add.collider(this.defender, this.obstacles);

    // Initialize NetworkPathManager
    this.pathManager = new NetworkPathManager(this, this.obstacles);
    this.pathManager.correctIP = "192.168.1.1";
    this.pathManager.initializeNetworkTopology();

    // Create packet and briefcase
    this.packet = new Packet(
      this,
      this.defender.x + 10,
      this.defender.y,
      "packet"
    );
    this.briefcase_red = this.add.image(
      this.scale.width / 2,
      this.scale.height / 2,
      "briefcase"
    );
    this.briefcase_red.setScale(2).setDepth(1).setVisible(false);

    // Initialize tutorial components
    this.Encryptiontutorial = new EncryptionTutorial(this);
    this.decryptionPuzzle = new DecryptionPuzzle(this);

    // Initialize MessageHandler
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
  }

  startTutorialSequence() {
    this.tutorialSteps = [
      {
        text: "Welcome to Network Defender! Use WASD keys to move your character.",
        condition: () => this.hasPlayerMoved,
        onStart: () => this.highlightObject(this.defender),
        helpText: "Press W/A/S/D to move",
      },
      {
        text: "Move near the network switch and press E to interact with it.",
        condition: () => this.nearObstacle,
        onStart: () => this.highlightObject(this.leftSwitch),
        helpText: "Get closer to the switch",
      },
      {
        text: "Configure the switch with IP address: 192.168.1.1",
        condition: () => this.pathManager.isPathValid(),
        onStart: () => this.flashObject(this.leftSwitch),
        helpText: "Enter the IP: 192.168.1.1",
      },
      {
        text: "Press E near the switch to send an encrypted message.",
        condition: () => this.hasInteractedWithSwitch,
        onStart: () => this.highlightObject(this.leftSwitch),
        helpText: "Press E to interact",
      },
      {
        text: "Select words to encrypt and choose an encryption method.",
        condition: () => this.hasCompletedEncryption,
        onStart: () => this.showEncryptionDemo(),
        helpText: "Select words and encrypt them",
      },
    ];

    this.currentStep = 0;
    this.showCurrentStep();
  }

  showCurrentStep() {
    if (this.currentStep < this.tutorialSteps.length) {
      const step = this.tutorialSteps[this.currentStep];
      this.instructionText.setText(step.text);
      this.helpText.setText(step.helpText);
      if (step.onStart) {
        step.onStart();
      }
    }
  }

  highlightObject(object) {
    if (this.currentHighlight) {
      this.currentHighlight.destroy();
    }

    this.currentHighlight = this.add
      .circle(object.x, object.y, object.width * 0.7, 0x00ff00, 0.3)
      .setDepth(99);

    this.tweens.add({
      targets: this.currentHighlight,
      alpha: 0,
      duration: 1000,
      yoyo: true,
      repeat: -1,
    });
  }

  flashObject(object) {
    if (this.currentHighlight) {
      this.currentHighlight.destroy();
    }

    this.currentHighlight = this.add
      .circle(object.x, object.y, object.width * 0.7, 0x00ff00, 0.5)
      .setDepth(99);

    this.tweens.add({
      targets: this.currentHighlight,
      alpha: 0,
      duration: 500,
      yoyo: true,
      repeat: 3,
      onComplete: () => {
        this.currentHighlight.destroy();
      },
    });
  }

  showEncryptionDemo() {
    const demoText = this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2,
        "1. Select words\n2. Choose encryption method\n3. Complete the puzzle",
        {
          fontSize: "24px",
          fill: "#00ff00",
          align: "center",
          backgroundColor: "#000000",
          padding: { x: 20, y: 10 },
        }
      )
      .setOrigin(0.5)
      .setDepth(101);

    this.time.delayedCall(4000, () => {
      demoText.destroy();
    });
  }

  setupControls() {
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
  }

  createBackButton() {
    const backButton = new UiButton(
      this,
      this.scale.width - 150,
      50,
      "button1",
      "button2",
      "Back",
      () => this.scene.start("Title")
    );
    backButton.setDepth(102);
  }

  update() {
    // Check initial movement
    if (!this.hasPlayerMoved) {
      const dx = Math.abs(this.defender.x - this.initialDefenderPos.x);
      const dy = Math.abs(this.defender.y - this.initialDefenderPos.y);
      if (dx > 10 || dy > 10) {
        this.hasPlayerMoved = true;
      }
    }

    // Update defender movement
    this.defender.update(this.keys, this.MessageHandler.menuActive);

    // Check proximity to obstacles
    this.nearObstacle = false;
    this.obstacles.children.iterate((obstacle) => {
      if (
        Phaser.Math.Distance.Between(
          this.defender.x,
          this.defender.y,
          obstacle.x,
          obstacle.y
        ) < 100
      ) {
        this.nearObstacle = true;
      }
    });

    // Handle interaction with switch
    if (
      this.keys.e.isDown &&
      this.nearObstacle &&
      !this.MessageHandler.menuActive
    ) {
      this.hasInteractedWithSwitch = true;
    }

    // Check step completion
    if (this.currentStep < this.tutorialSteps.length) {
      const currentStepObj = this.tutorialSteps[this.currentStep];
      if (currentStepObj.condition()) {
        this.currentStep++;
        if (this.currentStep < this.tutorialSteps.length) {
          this.showCurrentStep();
        } else {
          this.completeTutorial();
        }
      }
    }

    // Show/hide interaction prompt
    if (this.nearObstacle && !this.MessageHandler.menuActive) {
      this.interactText.setText("Press E to interact").setVisible(true);
    } else {
      this.interactText.setVisible(false);
    }
  }

  completeTutorial() {
    const completionText = this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2,
        "Tutorial Complete!\nYou're ready to defend the network!",
        {
          fontSize: "32px",
          fill: "#00ff00",
          align: "center",
          stroke: "#000000",
          strokeThickness: 6,
          backgroundColor: "#000000",
          padding: { x: 20, y: 10 },
        }
      )
      .setOrigin(0.5)
      .setDepth(102);

    this.time.delayedCall(3000, () => {
      this.scene.start("Title");
    });
  }

  createVisualEffects() {
    this.packetTrail = this.add.group();

    this.time.addEvent({
      delay: 100,
      callback: this.createPacketTrail,
      callbackScope: this,
      loop: true,
    });
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
      this.connectionGraphics.clear();
    }
  }

  drawAnimatedConnection(graphics, x1, y1, x2, y2, progress) {
    graphics.beginPath();
    graphics.moveTo(x1, y1);
    graphics.lineTo(x2, y2);
    graphics.strokePath();

    const dotCount = 3;
    for (let i = 0; i < dotCount; i++) {
      const dotProgress = (progress + i / dotCount) % 1;
      const dotX = x1 + (x2 - x1) * dotProgress;
      const dotY = y1 + (y2 - y1) * dotProgress;

      graphics.fillStyle(0x00ff00, 1);
      graphics.fillCircle(dotX, dotY, 3);
    }
  }
}
