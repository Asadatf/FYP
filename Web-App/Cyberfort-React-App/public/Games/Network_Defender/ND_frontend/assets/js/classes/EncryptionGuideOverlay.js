class EncryptionGuideOverlay {
  constructor(scene) {
    this.scene = scene;
    this.container = null;
    this.slides = [];
    this.slideElements = []; // Track all created elements for proper cleanup
    this.currentSlide = 0;
    this.isActive = false;
    this.escKeyListener = null; // Track ESC key listener for cleanup

    // Calculate responsive properties for the guides
    this.calculateResponsiveProperties();

    // Listen for resize events
    this.scene.scale.on("resize", this.handleResize, this);
  }

  // Calculate responsive dimensions and sizes
  calculateResponsiveProperties() {
    // Get current screen dimensions
    this.screenWidth = this.scene.scale.width;
    this.screenHeight = this.scene.scale.height;

    // Calculate scaling factor - use a more moderate scaling
    this.scaleFactor = Math.min(
      Math.max(0.85, this.screenWidth / 1280),
      Math.max(0.85, this.screenHeight / 720)
    );

    // Determine if on mobile
    this.isMobile = this.screenWidth < 768;

    // Calculate slide dimensions (not too small on mobile)
    // Use percentage of screen width with sensible minimum
    this.slideWidth = Math.max(500, Math.min(this.screenWidth * 0.85, 800));

    this.slideHeight = Math.max(400, Math.min(this.screenHeight * 0.8, 600));

    // Calculate font sizes with sensible minimums
    this.titleFontSize = Math.max(24, Math.min(32, 28 * this.scaleFactor));
    this.contentFontSize = Math.max(18, Math.min(24, 20 * this.scaleFactor));
    this.buttonFontSize = Math.max(18, Math.min(24, 20 * this.scaleFactor));
    this.indicatorFontSize = Math.max(16, Math.min(20, 18 * this.scaleFactor));
    this.hintFontSize = Math.max(14, Math.min(16, 14 * this.scaleFactor));
    this.tableFontSize = Math.max(16, Math.min(18, 16 * this.scaleFactor));
    this.tableHeaderFontSize = Math.max(
      18,
      Math.min(20, 18 * this.scaleFactor)
    );

    // Button sizes - ensure they're large enough for touch
    this.buttonWidth = Math.max(150, Math.min(180, this.slideWidth * 0.25));
    this.buttonHeight = Math.max(50, Math.min(60, this.slideHeight * 0.1));

    // Table dimensions with minimum sizes
    this.colWidth = Math.max(130, Math.min(150, this.slideWidth * 0.25));
    this.rowHeight = Math.max(45, Math.min(50, this.slideHeight * 0.1));
  }

  // Handle resize events
  handleResize() {
    // Recalculate properties
    this.calculateResponsiveProperties();

    // Refresh slide if tutorial is active
    if (this.isActive) {
      this.refreshCurrentSlide();
    }
  }

  // Refresh current slide with new dimensions
  refreshCurrentSlide() {
    // Store current slide
    const currentSlideIndex = this.currentSlide;

    // Clear and recreate slide
    this.clearSlideElements();
    this.showCurrentSlide();

    // Make sure we're on the same slide
    this.currentSlide = currentSlideIndex;
    this.showCurrentSlide();
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

    // Create slide background with responsive size
    const slideBg = this.scene.add.rectangle(
      0,
      0,
      this.slideWidth,
      this.slideHeight,
      0x001a33,
      0.9
    );
    slideBg.setStrokeStyle(2, 0x00aaff);
    this.slideElements.push(slideBg);

    // Calculate header height based on screen size
    const headerHeight = Math.max(60, Math.min(80, this.slideHeight * 0.15));

    // Create header background
    const headerBg = this.scene.add.rectangle(
      0,
      -this.slideHeight / 2 + headerHeight / 2,
      this.slideWidth,
      headerHeight,
      0x003366,
      1
    );
    this.slideElements.push(headerBg);

    // Create title text with responsive font size
    const titleText = this.scene.add
      .text(0, -this.slideHeight / 2 + headerHeight / 2, slide.title, {
        fontSize: this.titleFontSize + "px",
        fill: "#00ffff",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5);
    this.slideElements.push(titleText);

    // Create content text with responsive positioning and font size
    // For the table slide, position content higher to make room for the table
    const contentY = slide.table ? -this.slideHeight / 5 : 0;
    const contentText = this.scene.add
      .text(0, contentY, slide.content, {
        fontSize: this.contentFontSize + "px",
        fill: "#ffffff",
        align: "center",
        lineSpacing: 10,
        wordWrap: { width: this.slideWidth - 80 }, // More padding for readability
      })
      .setOrigin(0.5);
    this.slideElements.push(contentText);

    // Create encryption methods comparison table if needed
    if (slide.table) {
      this.createEncryptionTable();
    }

    // Calculate button positions based on slide dimensions
    const buttonY = this.slideHeight / 2 - this.buttonHeight / 2 - 20; // More space at bottom
    const buttonSpacing = Math.min(this.slideWidth * 0.5, 350); // Not too wide

    // Create navigation buttons with responsive sizing
    const prevButton = this.createButton(
      -buttonSpacing / 2,
      buttonY,
      "Previous",
      () => this.prevSlide()
    );

    const nextButton = this.createButton(
      buttonSpacing / 2,
      buttonY,
      this.currentSlide === this.slides.length - 1 ? "Finish" : "Next",
      () => this.nextSlide()
    );

    // Add page indicator with responsive font size
    const pageIndicator = this.scene.add
      .text(0, buttonY, `${this.currentSlide + 1}/${this.slides.length}`, {
        fontSize: this.indicatorFontSize + "px",
        fill: "#ffffff",
      })
      .setOrigin(0.5);
    this.slideElements.push(pageIndicator);

    // Add ESC key hint at the top-left corner with responsive positioning
    const escHint = this.scene.add
      .text(
        -this.slideWidth / 2 + 15,
        -this.slideHeight / 2 + 15,
        "Press ESC to exit",
        {
          fontSize: this.hintFontSize + "px",
          fill: "#aaaaaa",
        }
      )
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
    this.container.setScale(0.95);
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
    // Create button with responsive sizing
    const button = this.scene.add
      .rectangle(x, y, this.buttonWidth, this.buttonHeight, 0x004466, 1)
      .setInteractive();
    button.setStrokeStyle(2, 0x00ffff);
    this.slideElements.push(button);

    // Create button text
    const buttonText = this.scene.add
      .text(x, y, text, {
        fontSize: this.buttonFontSize + "px",
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
    // Table header with responsive sizing
    const createTableCell = (x, y, text, isHeader, width, height) => {
      const bg = this.scene.add
        .rectangle(x, y, width, height, isHeader ? 0x00aaff : 0x004466, 1)
        .setStrokeStyle(1, 0xffffff);

      // Ensure text doesn't get cut off or wrap inappropriately
      const textObj = this.scene.add
        .text(x, y, text, {
          fontSize: isHeader
            ? this.tableHeaderFontSize + "px"
            : this.tableFontSize + "px",
          fill: "#ffffff",
          align: "center",
          // Disable wordWrap for table cells to prevent unexpected text wrapping
        })
        .setOrigin(0.5);

      this.slideElements.push(bg, textObj);
      return { bg, textObj };
    };

    // Create table with responsive sizing and positioning
    // Calculate the position to be between content text and navigation buttons

    // Find where the content ends - usually text has a small padding at the bottom
    const contentTextBottom = 20; // Approximate content text bottom position

    // Calculate where the buttons start
    const buttonY = this.slideHeight / 2 - this.buttonHeight / 2 - 20;

    // Position the table between content and buttons
    // Leave some space after content text and before buttons
    const availableSpace = buttonY - contentTextBottom;
    const tableHeight = this.rowHeight * 4; // 4 rows including header

    // Center the table in the available space
    const tableY = contentTextBottom + (availableSpace - tableHeight) / 2;

    // Adjust column width to ensure it can fit content properly
    const colWidth = Math.max(this.colWidth, 140);
    const rowHeight = Math.max(this.rowHeight, 40);

    // Center the table horizontally
    const tableWidth = colWidth * 3;
    const tableX = -tableWidth / 2 + colWidth / 2;

    // Table headers - use lighter blue for header
    createTableCell(tableX, tableY, "Method", true, colWidth, rowHeight);
    createTableCell(
      tableX + colWidth,
      tableY,
      "Cost",
      true,
      colWidth,
      rowHeight
    );
    createTableCell(
      tableX + colWidth * 2,
      tableY,
      "Security",
      true,
      colWidth,
      rowHeight
    );

    // Row 1: Caesar
    createTableCell(
      tableX,
      tableY + rowHeight,
      "Caesar Cipher",
      false,
      colWidth,
      rowHeight
    );
    createTableCell(
      tableX + colWidth,
      tableY + rowHeight,
      "5 CC",
      false,
      colWidth,
      rowHeight
    );
    createTableCell(
      tableX + colWidth * 2,
      tableY + rowHeight,
      "Low",
      false,
      colWidth,
      rowHeight
    );

    // Row 2: Automatic
    createTableCell(
      tableX,
      tableY + rowHeight * 2,
      "Automatic",
      false,
      colWidth,
      rowHeight
    );
    createTableCell(
      tableX + colWidth,
      tableY + rowHeight * 2,
      "20 CC",
      false,
      colWidth,
      rowHeight
    );
    createTableCell(
      tableX + colWidth * 2,
      tableY + rowHeight * 2,
      "Medium",
      false,
      colWidth,
      rowHeight
    );

    // Row 3: RSA - ensure text is clear and properly formatted
    createTableCell(
      tableX,
      tableY + rowHeight * 3,
      "RSA",
      false,
      colWidth,
      rowHeight
    );
    createTableCell(
      tableX + colWidth,
      tableY + rowHeight * 3,
      "15 CC",
      false,
      colWidth,
      rowHeight
    );
    createTableCell(
      tableX + colWidth * 2,
      tableY + rowHeight * 3,
      "High",
      false,
      colWidth,
      rowHeight
    );
  }

  prevSlide() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
      this.showCurrentSlide();
    }
  }

  nextSlide() {
    if (this.currentSlide < this.slides.length - 1) {
      this.currentSlide++;
      this.showCurrentSlide();
    } else {
      this.closeTutorial();
    }
  }

  closeTutorial() {
    if (!this.isActive) return;

    // Closing animation
    this.scene.tweens.add({
      targets: this.container,
      scale: 0.9,
      alpha: 0,
      duration: 250,
      ease: "Back.easeIn",
      onComplete: () => {
        // Clean up
        this.cleanup();
      },
    });
  }

  cleanup() {
    // Remove the ESC key listener
    if (this.escKeyListener) {
      this.escKeyListener.removeAllListeners();
      this.scene.input.keyboard.removeKey("ESC");
      this.escKeyListener = null;
    }

    // Destroy all elements
    this.clearSlideElements();

    // Destroy container and overlay
    if (this.container) {
      this.container.destroy();
      this.container = null;
    }

    if (this.overlay) {
      this.overlay.destroy();
      this.overlay = null;
    }

    // Reset state
    this.currentSlide = 0;
    this.isActive = false;
  }

  // Should be called when scene is shut down
  shutdown() {
    // Clean up all resources
    this.cleanup();

    // Remove resize listener
    this.scene.scale.off("resize", this.handleResize, this);
  }
}

window.EncryptionGuideOverlay = EncryptionGuideOverlay;
