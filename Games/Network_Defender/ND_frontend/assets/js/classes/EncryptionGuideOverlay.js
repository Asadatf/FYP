class EncryptionGuideOverlay {
  constructor(scene) {
    this.scene = scene;
    this.container = null;
    this.slides = [];
    this.slideElements = []; // Track all created elements for proper cleanup
    this.currentSlide = 0;
    this.isActive = false;
    this.escKeyListener = null; // Track ESC key listener for cleanup
  }

  showTutorial() {
    if (this.isActive) return;

    this.isActive = true;
    this.createTutorialContainer();
    this.createTutorialContent();
    this.showCurrentSlide();

    // Setup ESC key listener
    this.setupEscapeKeyListener();
  }

  setupEscapeKeyListener() {
    // Create a listener for the ESC key to exit the tutorial immediately
    this.escKeyListener = this.scene.input.keyboard.addKey("ESC");
    this.escKeyListener.on("down", () => {
      // Close the tutorial immediately
      this.closeTutorial();
    });

    // Note: We're no longer adding the ESC hint text here
    // It's now added in the showCurrentSlide method for better positioning
  }

  createTutorialContainer() {
    // Create a semi-transparent overlay background
    this.overlay = this.scene.add
      .rectangle(
        0,
        0,
        this.scene.scale.width,
        this.scene.scale.height,
        0x000000,
        0.7
      )
      .setOrigin(0, 0)
      .setDepth(1000);

    // Create the tutorial container
    this.container = this.scene.add
      .container(this.scene.scale.width / 2, this.scene.scale.height / 2)
      .setDepth(1001);
  }

  createTutorialContent() {
    // Create tutorial slides
    this.slides = [
      {
        title: "Message Encryption Guide",
        content:
          "Secure your communications with encryption! This guide will explain how to send encrypted messages and protect against hackers.",
        image: null,
      },
      {
        title: "Sending Messages",
        content:
          "After configuring the network devices, approach a configured switch and press E to send a message.\n\nYou'll need to select specific words to encrypt and choose an encryption method.",
        image: null,
      },
      {
        title: "Word Selection",
        content:
          "When composing a message, you'll be prompted to select specific words to encrypt.\n\n• Select 1-2 critical words that contain sensitive information\n• Choose words that would compromise security if intercepted\n• You have a limited time to make your selection",
        image: null,
      },
      {
        title: "Encryption Methods",
        content:
          "Network Defender offers three encryption methods, each with different costs, security levels, and gameplay mechanics.",
        image: null,
        table: true,
      },
      {
        title: "Caesar Cipher (Manual)",
        content:
          "Cost: 5 CC | Security: Low\n\nYou manually shift each character in the alphabet.\n\nPROS: Low cost, educational\nCONS: Time consuming, less secure\nBEST FOR: Training and learning encryption basics",
        image: null,
      },
      {
        title: "Automatic Encryption",
        content:
          "Cost: 20 CC | Security: Medium\n\nThe system automatically encrypts your selected words.\n\nPROS: Fast, consistent security\nCONS: Higher cost, less educational\nBEST FOR: Quick secure messaging",
        image: null,
      },
      {
        title: "RSA Encryption",
        content:
          "Cost: 15 CC | Security: High\n\nUses public/private key cryptography with mathematical formulas.\n\nPROS: Highest security level, modern encryption\nCONS: More complex puzzle challenge\nBEST FOR: Critical communications",
        image: null,
      },
      {
        title: "Man-In-The-Middle Attacks",
        content:
          "Attackers may try to intercept your communications!\n\nWhen detected, you can either:\n• Use a Firewall (10 CC): Guaranteed protection\n• Ignore the Attack: Risk message interception and corruption\n\nFailed attacks waste your coins and compromise the message!",
        image: null,
      },
      {
        title: "Decryption Puzzles",
        content:
          "After selecting your encryption method, you may need to solve a decryption puzzle.\n\nThese puzzles simulate cryptographic principles and test your understanding of encryption techniques.\n\nCompleting puzzles successfully adds a security layer to your message.",
        image: null,
      },
      {
        title: "Security Scoring",
        content:
          "Each encrypted message receives a security score based on:\n\n• Encryption method chosen\n• Puzzle completion success\n• Word selection strategy\n• Attack defense success\n\nHigher scores earn bonus CyberCoins (CC) and unlock advanced features!",
        image: null,
      },
    ];
  }

  showCurrentSlide() {
    // Clear all previous elements
    this.clearSlideElements();

    // Get current slide content
    const slide = this.slides[this.currentSlide];

    // Create slide background
    const slideBg = this.scene.add.rectangle(0, 0, 600, 400, 0x001a33, 0.9);
    slideBg.setStrokeStyle(2, 0x00aaff);
    this.slideElements.push(slideBg);

    // Create header background
    const headerBg = this.scene.add.rectangle(0, -170, 600, 60, 0x003366, 1);
    this.slideElements.push(headerBg);

    // Create title text
    const titleText = this.scene.add
      .text(0, -170, slide.title, {
        fontSize: "28px",
        fill: "#00ffff",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5);
    this.slideElements.push(titleText);

    // Create content text
    const contentText = this.scene.add
      .text(0, 0, slide.content, {
        fontSize: "20px",
        fill: "#ffffff",
        align: "center",
        lineSpacing: 10,
        wordWrap: { width: 550 },
      })
      .setOrigin(0.5);
    this.slideElements.push(contentText);

    // Create encryption methods comparison table if needed
    if (slide.table) {
      this.createEncryptionTable();
    }

    // Create navigation buttons
    const prevButton = this.createButton(-250, 170, "Previous", () =>
      this.prevSlide()
    );

    const nextButton = this.createButton(
      250,
      170,
      this.currentSlide === this.slides.length - 1 ? "Finish" : "Next",
      () => this.nextSlide()
    );

    // Add page indicator
    const pageIndicator = this.scene.add
      .text(0, 170, `${this.currentSlide + 1}/${this.slides.length}`, {
        fontSize: "18px",
        fill: "#ffffff",
      })
      .setOrigin(0.5);
    this.slideElements.push(pageIndicator);

    // Add ESC key hint at the top-left corner
    const escHint = this.scene.add
      .text(-290, -190, "Press ESC to exit", {
        fontSize: "14px",
        fill: "#aaaaaa",
      })
      .setOrigin(0, 0);
    this.slideElements.push(escHint);

    // Add everything to the container
    this.container.add(this.slideElements);

    // Disable previous button on first slide
    if (this.currentSlide === 0) {
      prevButton.setAlpha(0.5);
      prevButton.disableInteractive();
    }

    // Entrance animation
    this.container.setScale(0.9);
    this.container.alpha = 0;

    this.scene.tweens.add({
      targets: this.container,
      scale: 1,
      alpha: 1,
      duration: 300,
      ease: "Back.easeOut",
    });
  }

  clearSlideElements() {
    // Remove all elements from the container
    if (this.container) {
      this.container.removeAll(true);
    }

    // Clear the tracking array
    this.slideElements = [];
  }

  createButton(x, y, text, callback) {
    // Create button background
    const button = this.scene.add
      .rectangle(x, y, 160, 50, 0x004466, 1)
      .setInteractive();
    button.setStrokeStyle(2, 0x00ffff);
    this.slideElements.push(button);

    // Create button text
    const buttonText = this.scene.add
      .text(x, y, text, {
        fontSize: "20px",
        fill: "#ffffff",
      })
      .setOrigin(0.5);
    this.slideElements.push(buttonText);

    // Add hover effect
    button.on("pointerover", () => {
      button.fillColor = 0x006699;
      buttonText.setScale(1.1);
    });

    button.on("pointerout", () => {
      button.fillColor = 0x004466;
      buttonText.setScale(1);
    });

    button.on("pointerdown", callback);

    return button;
  }

  createEncryptionTable() {
    // Table header
    const createTableCell = (x, y, text, isHeader, width, height) => {
      const bg = this.scene.add
        .rectangle(x, y, width, height, isHeader ? 0x00aaff : 0x004466, 1)
        .setStrokeStyle(1, 0xffffff);

      const textObj = this.scene.add
        .text(x, y, text, {
          fontSize: isHeader ? "16px" : "14px",
          fill: "#ffffff",
          align: "center",
          wordWrap: { width: width - 10 },
        })
        .setOrigin(0.5);

      this.slideElements.push(bg, textObj);
      return { bg, textObj };
    };

    // Create table with method comparison
    const tableY = 10;
    const colWidth = 130;
    const rowHeight = 40;
    const tableX = -colWidth * 1.5;

    // Header row
    createTableCell(tableX, tableY - 50, "Method", true, colWidth, rowHeight);
    createTableCell(
      tableX + colWidth,
      tableY - 50,
      "Cost",
      true,
      colWidth,
      rowHeight
    );
    createTableCell(
      tableX + colWidth * 2,
      tableY - 50,
      "Security",
      true,
      colWidth,
      rowHeight
    );

    // Data rows - Caesar
    createTableCell(
      tableX,
      tableY,
      "Caesar Cipher",
      false,
      colWidth,
      rowHeight
    );
    createTableCell(
      tableX + colWidth,
      tableY,
      "5 CC",
      false,
      colWidth,
      rowHeight
    );
    createTableCell(
      tableX + colWidth * 2,
      tableY,
      "Low",
      false,
      colWidth,
      rowHeight
    );

    // Data rows - Auto
    createTableCell(
      tableX,
      tableY + rowHeight,
      "Automatic",
      false,
      colWidth,
      rowHeight
    );
    createTableCell(
      tableX + colWidth,
      tableY + rowHeight,
      "20 CC",
      false,
      colWidth,
      rowHeight
    );
    createTableCell(
      tableX + colWidth * 2,
      tableY + rowHeight,
      "Medium",
      false,
      colWidth,
      rowHeight
    );

    // Data rows - RSA
    createTableCell(
      tableX,
      tableY + rowHeight * 2,
      "RSA",
      false,
      colWidth,
      rowHeight
    );
    createTableCell(
      tableX + colWidth,
      tableY + rowHeight * 2,
      "15 CC",
      false,
      colWidth,
      rowHeight
    );
    createTableCell(
      tableX + colWidth * 2,
      tableY + rowHeight * 2,
      "High",
      false,
      colWidth,
      rowHeight
    );
  }

  nextSlide() {
    if (this.currentSlide < this.slides.length - 1) {
      this.currentSlide++;
      this.showCurrentSlide();
    } else {
      this.closeTutorial();
    }
  }

  prevSlide() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
      this.showCurrentSlide();
    }
  }

  closeTutorial() {
    if (!this.isActive) return;

    // Remove the ESC key listener
    if (this.escKeyListener) {
      this.escKeyListener.off("down");
      this.scene.input.keyboard.removeKey("ESC");
      this.escKeyListener = null;
    }

    // Fade out animation
    this.scene.tweens.add({
      targets: [this.container, this.overlay],
      alpha: 0,
      duration: 300,
      onComplete: () => {
        // First make sure all children are removed properly
        this.clearSlideElements();

        // Then destroy the container and overlay
        if (this.container) {
          this.container.destroy();
          this.container = null;
        }

        if (this.overlay) {
          this.overlay.destroy();
          this.overlay = null;
        }

        this.isActive = false;

        // Emit event that tutorial is complete
        this.scene.events.emit("encryptionGuideComplete");
      },
    });
  }
}

window.EncryptionGuideOverlay = EncryptionGuideOverlay;
