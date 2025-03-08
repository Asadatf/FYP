class DecryptionPuzzle {
  constructor(scene, messageHandler) {
    this.scene = scene;
    this.messageHandler = messageHandler;
    this.puzzleText = null;
    this.solution = "";
    this.playerInput = "";
    this.checkSolutionButton = null;
    this.isPuzzleSolved = false;
    this.onSolvedCallbacks = [];
    this.particles = null;
    this.backgroundElements = [];

    // Track screen dimensions
    this.screenWidth = this.scene.scale.width;
    this.screenHeight = this.scene.scale.height;

    // Add resize handler
    this.scene.scale.on("resize", this.handleResize, this);
  }

  handleResize(gameSize) {
    // Update dimensions
    this.screenWidth = gameSize.width;
    this.screenHeight = gameSize.height;

    // Regenerate puzzle if active
    if (this.puzzleActive) {
      this.closeExistingElements();
      this.generatePuzzle();
    }
  }

  generatePuzzle() {
    this.puzzleActive = true;
    this.isPuzzleSolved = false;
    this.closeExistingElements();
    this.createBackground();

    this.originalText = this.generateRandomWord();
    this.solution = this.caesarCipherEncrypt(this.originalText, 3);
    this.playerInput = "";

    // Calculate appropriate scaling based on screen size
    // We want to maintain the original design but ensure everything fits
    const scale = Math.min(
      this.screenWidth / 1280, // Standard width reference
      this.screenHeight / 720 // Standard height reference
    );

    // Determine spacing between main components
    // Make sure puzzle and guide don't overlap
    const isSmallScreen = this.screenWidth < 1000;

    // On small screens, position puzzle in center, guide below
    // On large screens, position puzzle left, guide right
    if (isSmallScreen) {
      this.createCenteredLayout(scale);
    } else {
      this.createSideBySideLayout(scale);
    }

    this.setupInputHandler();
    this.createParticleEffect();
  }

  createCenteredLayout(scale) {
    // For small screens, center the puzzle and put instructions below
    const centerX = this.screenWidth / 2;

    // ===== Main Puzzle Section =====
    // Create a container for the main puzzle
    const puzzleContainer = this.scene.add.container(
      centerX,
      this.screenHeight * 0.25
    );

    // Title
    this.titleText = this.scene.add
      .text(0, -80 * scale, "DECRYPT THE MESSAGE", {
        fontSize: Math.max(16, Math.floor(28 * scale)) + "px",
        fill: "#00ff00",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Add pulse animation to title
    this.scene.tweens.add({
      targets: this.titleText,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Decorative line
    this.decorativeLine = this.scene.add.graphics();
    this.decorativeLine.lineStyle(2, 0x00ff00, 0.8);
    this.decorativeLine.lineBetween(
      -150 * scale,
      -40 * scale,
      150 * scale,
      -40 * scale
    );

    // Encrypted text
    this.encryptedText = this.scene.add
      .text(0, 0, "", {
        fontSize: Math.max(16, Math.floor(32 * scale)) + "px",
        fill: "#ffffff",
        fontFamily: "monospace",
      })
      .setOrigin(0.5);

    // Typewriter effect
    this.startTypewriterEffect(this.solution);

    // Input field - scale width appropriately
    const inputWidth = Math.min(300 * scale, this.screenWidth * 0.8);
    this.inputText = this.scene.add
      .text(0, 60 * scale, "Your Input: ", {
        fontSize: Math.max(14, Math.floor(24 * scale)) + "px",
        fill: "#4CAF50",
        backgroundColor: "#1a1a1a",
        padding: { x: 10, y: 5 },
        fixedWidth: inputWidth,
      })
      .setOrigin(0.5);

    // Add all elements to puzzle container
    puzzleContainer.add([
      this.titleText,
      this.decorativeLine,
      this.encryptedText,
      this.inputText,
    ]);
    this.backgroundElements.push(puzzleContainer);

    // ===== Instructions Section =====
    // Position instructions below the puzzle
    this.createInstructionsPanel(
      centerX,
      this.screenHeight * 0.58,
      scale,
      true // Compact mode for vertical layout
    );

    // ===== Button =====
    // Position check button at bottom
    this.createCheckButton(centerX, this.screenHeight * 0.8, scale);
  }

  createSideBySideLayout(scale) {
    // Side-by-side layout for larger screens
    const leftX = this.screenWidth * 0.35;
    const rightX = this.screenWidth * 0.75;
    const centerY = this.screenHeight / 2 - 50; // Slight adjustment up

    // ===== Left Side: Puzzle =====
    const puzzleContainer = this.scene.add.container(leftX, centerY - 50);

    // Title
    this.titleText = this.scene.add
      .text(0, -80 * scale, "DECRYPT THE MESSAGE", {
        fontSize: Math.max(16, Math.floor(28 * scale)) + "px",
        fill: "#00ff00",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Add pulse animation to title
    this.scene.tweens.add({
      targets: this.titleText,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Decorative line
    this.decorativeLine = this.scene.add.graphics();
    this.decorativeLine.lineStyle(2, 0x00ff00, 0.8);
    this.decorativeLine.lineBetween(
      -150 * scale,
      -40 * scale,
      150 * scale,
      -40 * scale
    );

    // Encrypted text
    this.encryptedText = this.scene.add
      .text(0, 0, "", {
        fontSize: Math.max(16, Math.floor(32 * scale)) + "px",
        fill: "#ffffff",
        fontFamily: "monospace",
      })
      .setOrigin(0.5);

    // Typewriter effect
    this.startTypewriterEffect(this.solution);

    // Input field - scale width appropriately
    const inputWidth = Math.min(300 * scale, this.screenWidth * 0.25);
    this.inputText = this.scene.add
      .text(0, 60 * scale, "Your Input: ", {
        fontSize: Math.max(14, Math.floor(24 * scale)) + "px",
        fill: "#4CAF50",
        backgroundColor: "#1a1a1a",
        padding: { x: 10, y: 5 },
        fixedWidth: inputWidth,
      })
      .setOrigin(0.5);

    // Add all elements to puzzle container
    puzzleContainer.add([
      this.titleText,
      this.decorativeLine,
      this.encryptedText,
      this.inputText,
    ]);
    this.backgroundElements.push(puzzleContainer);

    // ===== Right Side: Instructions =====
    this.createInstructionsPanel(
      rightX,
      centerY,
      scale,
      false // Full instructions for side-by-side
    );

    // ===== Button below puzzle =====
    this.createCheckButton(leftX, centerY + 140 * scale, scale);
  }

  createInstructionsPanel(x, y, scale, isCompact) {
    // Calculate panel dimensions based on scale and layout
    const panelWidth = isCompact
      ? Math.min(400 * scale, this.screenWidth * 0.9)
      : Math.min(400 * scale, this.screenWidth * 0.3);

    const panelHeight = isCompact
      ? Math.min(200 * scale, this.screenHeight * 0.3)
      : Math.min(400 * scale, this.screenHeight * 0.5);

    const instructionsContainer = this.scene.add.container(x, y);

    // Create panel background
    const panel = this.scene.add.graphics();
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

    // Title text size based on scale
    const titleFontSize = Math.max(16, Math.floor(24 * scale));
    const title = this.scene.add
      .text(0, -panelHeight / 2 + 30, "Decryption Guide", {
        fontSize: titleFontSize + "px",
        fill: "#00ff00",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Content based on layout mode
    const textFontSize = Math.max(12, Math.floor(16 * scale));
    let contentText;

    if (isCompact) {
      // Simplified content for compact/vertical layout
      contentText = [
        "Caesar Cipher Shift: 3",
        "",
        "To decrypt: Shift letters LEFT by 3",
        "ABCDEFG → XYZABCD",
      ];
    } else {
      // Full content for side-by-side layout
      contentText = [
        "Caesar Cipher Shift: 3",
        "",
        "Original:  ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        "Shifted:   DEFGHIJKLMNOPQRSTUVWXYZABC",
        "",
        "To decrypt:",
        "• Find encrypted letter",
        "• Shift 3 places LEFT",
        "• Type solution",
        "",
        "Press BACKSPACE to undo",
      ];
    }

    const instructions = this.scene.add
      .text(0, 10, contentText.join("\n"), {
        fontSize: textFontSize + "px",
        fill: "#ffffff",
        align: "center",
        lineSpacing: isCompact ? 2 : 5,
      })
      .setOrigin(0.5);

    instructionsContainer.add([panel, title, instructions]);
    this.backgroundElements.push(instructionsContainer);
  }

  createCheckButton(x, y, scale) {
    // Calculate button dimensions based on scale
    const buttonWidth = 200 * scale;
    const buttonHeight = 50 * scale;

    const buttonBackground = this.scene.add.graphics();
    buttonBackground.fillStyle(0x00ff00, 1);
    buttonBackground.fillRoundedRect(
      -buttonWidth / 2,
      -buttonHeight / 2,
      buttonWidth,
      buttonHeight,
      10
    );

    const buttonText = this.scene.add
      .text(0, 0, "CHECK SOLUTION", {
        fontSize: Math.max(14, Math.floor(20 * scale)) + "px",
        fill: "#000000",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.checkSolutionButton = this.scene.add
      .container(x, y, [buttonBackground, buttonText])
      .setSize(buttonWidth, buttonHeight);

    this.checkSolutionButton
      .setInteractive()
      .on("pointerover", () => {
        buttonBackground.clear();
        buttonBackground.fillStyle(0x4caf50, 1);
        buttonBackground.fillRoundedRect(
          -buttonWidth / 2,
          -buttonHeight / 2,
          buttonWidth,
          buttonHeight,
          10
        );
      })
      .on("pointerout", () => {
        buttonBackground.clear();
        buttonBackground.fillStyle(0x00ff00, 1);
        buttonBackground.fillRoundedRect(
          -buttonWidth / 2,
          -buttonHeight / 2,
          buttonWidth,
          buttonHeight,
          10
        );
      })
      .on("pointerdown", () => this.checkSolution());

    this.backgroundElements.push(this.checkSolutionButton);
  }

  startTypewriterEffect(text) {
    let currentChar = 0;
    const typewriterTimer = this.scene.time.addEvent({
      delay: 100,
      callback: () => {
        this.encryptedText.text += text[currentChar];
        currentChar++;
        if (currentChar === text.length) {
          typewriterTimer.destroy();
        }
      },
      repeat: text.length - 1,
    });
  }

  createBackground() {
    // Create a dark overlay for the entire screen
    const overlay = this.scene.add.rectangle(
      this.screenWidth / 2,
      this.screenHeight / 2,
      this.screenWidth,
      this.screenHeight,
      0x000000,
      0.85
    );

    // Create matrix-style falling characters - adjust count based on screen size
    const charCount = Math.floor(this.screenWidth / 80);

    for (let i = 0; i < charCount; i++) {
      const x = Math.random() * this.screenWidth;
      const startY = Math.random() * this.screenHeight;
      const text = this.scene.add.text(x, startY, this.getRandomChar(), {
        fontSize: "16px",
        fill: "#00ff00",
        alpha: 0.3,
      });

      this.scene.tweens.add({
        targets: text,
        y: this.screenHeight + 50,
        duration: 3000 + Math.random() * 5000,
        repeat: -1,
        onRepeat: () => {
          text.y = -50;
        },
      });

      this.backgroundElements.push(text);
    }

    this.backgroundElements.push(overlay);
  }

  createParticleEffect() {
    // Create particle effect for correct solution
    this.particles = this.scene.add.particles(0, 0, "packet", {
      speed: { min: -800, max: 800 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.1, end: 0 },
      blendMode: "ADD",
      active: false,
      lifespan: 600,
      gravityY: 800,
    });
  }

  checkSolution() {
    if (this.playerInput.toLowerCase() === this.originalText.toLowerCase()) {
      // Success! Show animation
      const successText = this.scene.add
        .text(
          this.screenWidth / 2,
          this.screenHeight / 2,
          "DECRYPTION SUCCESSFUL!",
          {
            fontSize: Math.min(36, Math.max(24, this.screenWidth / 40)) + "px",
            fill: "#00ff00",
            fontStyle: "bold",
          }
        )
        .setOrigin(0.5)
        .setAlpha(0);

      // Trigger particle effect
      this.particles.setPosition(this.screenWidth / 2, this.screenHeight / 2);
      this.particles.explode(50);

      // Success animation sequence
      this.scene.tweens.add({
        targets: successText,
        alpha: 1,
        scale: 1.2,
        duration: 1000,
        ease: "Power2",
        onComplete: () => {
          // Fade out animation
          this.scene.tweens.add({
            targets: successText,
            alpha: 0,
            duration: 500,
            ease: "Power2",
            onComplete: () => {
              // Clean up all elements
              successText.destroy();
              this.closeExistingElements();
              this.isPuzzleSolved = true;
              this.puzzleActive = false;
              this.emitSolved();
            },
          });
        },
      });
    } else {
      // Wrong answer handling
      if (
        this.scene.walletManager &&
        typeof this.scene.walletManager.spend === "function"
      ) {
        this.scene.walletManager.spend(10);

        // Show penalty notification
        const penaltyText = this.scene.add
          .text(
            this.screenWidth / 2,
            this.screenHeight / 2 - 100,
            "WRONG SOLUTION: -10 CC",
            {
              fontSize:
                Math.min(24, Math.max(18, this.screenWidth / 50)) + "px",
              fill: "#ff0000",
              backgroundColor: "#000000",
              padding: { x: 10, y: 5 },
              stroke: "#ffffff",
              strokeThickness: 2,
            }
          )
          .setOrigin(0.5)
          .setDepth(1000);

        // Fade out penalty text
        this.scene.tweens.add({
          targets: penaltyText,
          alpha: 0,
          y: "-=30",
          duration: 1500,
          ease: "Power2",
          onComplete: () => {
            penaltyText.destroy();
          },
        });
      }

      // Wrong answer shake animation
      this.scene.tweens.add({
        targets: this.inputText,
        x: "+=10",
        duration: 50,
        yoyo: true,
        repeat: 3,
        onComplete: () => {
          this.playerInput = "";
          this.inputText.setText("Your Input: ");
        },
      });
    }
  }

  closeExistingElements() {
    // Ensure all elements are properly destroyed
    if (this.puzzleText) this.puzzleText.destroy();
    if (this.inputText) this.inputText.destroy();
    if (this.checkSolutionButton) this.checkSolutionButton.destroy();
    if (this.particles) this.particles.destroy();
    if (this.titleText) this.titleText.destroy();
    if (this.encryptedText) this.encryptedText.destroy();
    if (this.decorativeLine) this.decorativeLine.destroy();

    // Clean up background elements
    this.backgroundElements.forEach((element) => {
      if (element && element.destroy) {
        element.destroy();
      }
    });
    this.backgroundElements = [];

    // Remove any remaining tweens
    this.scene.tweens.killAll();

    this.puzzleActive = false;
  }

  getRandomChar() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return chars.charAt(Math.floor(Math.random() * chars.length));
  }

  // Existing utility methods remain the same
  generateRandomWord() {
    const words = [
      "cyber",
      "secure",
      "network",
      "packet",
      "encrypt",
      "defend",
      "protect",
      "shield",
    ];
    return words[Math.floor(Math.random() * words.length)];
  }

  caesarCipherEncrypt(text, shift) {
    return text
      .split("")
      .map((char) =>
        String.fromCharCode(((char.charCodeAt(0) - 97 + shift) % 26) + 97)
      )
      .join("");
  }

  setupInputHandler() {
    this.scene.input.keyboard.removeAllListeners("keydown");
    this.scene.input.keyboard.on("keydown", (event) => {
      if (/^[a-z]$/i.test(event.key)) {
        this.playerInput += event.key;
        this.inputText.setText(`Your Input: ${this.playerInput}`);
      } else if (event.key === "Backspace") {
        this.playerInput = this.playerInput.slice(0, -1);
        this.inputText.setText(`Your Input: ${this.playerInput}`);
      }
    });
  }

  emitSolved() {
    this.onSolvedCallbacks.forEach((callback) => callback());
  }

  onSolved(callback) {
    this.onSolvedCallbacks.push(callback);
  }

  isSolved() {
    return this.isPuzzleSolved;
  }

  // Clean up method for scene changes
  destroy() {
    this.closeExistingElements();
    this.scene.scale.off("resize", this.handleResize, this);
  }
}

window.DecryptionPuzzle = DecryptionPuzzle;
