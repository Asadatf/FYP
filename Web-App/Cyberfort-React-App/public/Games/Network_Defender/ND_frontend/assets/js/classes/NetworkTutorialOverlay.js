class NetworkTutorialOverlay {
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

    // Button sizes - ensure they're large enough for touch
    this.buttonWidth = Math.max(150, Math.min(180, this.slideWidth * 0.25));
    this.buttonHeight = Math.max(50, Math.min(60, this.slideHeight * 0.1));
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

  hideTutorial() {
    // This method is deprecated - use closeTutorial instead
    this.closeTutorial();
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

    // Create the tutorial container centered on screen
    this.container = this.scene.add
      .container(this.scene.scale.width / 2, this.scene.scale.height / 2)
      .setDepth(1001);
  }

  createTutorialContent() {
    // Create tutorial slides
    this.slides = [
      {
        title: "Network Configuration",
        content:
          "Welcome to Network Defender! Your mission is to configure the network devices to create a secure connection.",
        image: null,
      },
      {
        title: "Network Topology",
        content:
          "This network has 2 switches connected through a router.\nEach device needs a proper IP address to function.",
        image: null,
        diagram: true,
      },
      {
        title: "Switch 1 Configuration",
        content:
          "Configure Switch 1 with IP address: 192.168.1.2\nThis allows it to communicate with the router.",
        image: null,
      },
      {
        title: "Router Configuration",
        content:
          "Configure the Router with IP address: 192.168.1.1\nThe router connects different network segments.",
        image: null,
      },
      {
        title: "Switch 2 Configuration",
        content:
          "Configure Switch 2 with IP address: 192.168.2.2\nThis completes the network connection path.",
        image: null,
      },
      {
        title: "Ready to Defend!",
        content:
          "Once all devices are configured, you can send encrypted messages through the network. Protect your data!",
        image: null,
      },
    ];
  }

  showCurrentSlide() {
    // Clear all previous elements
    this.clearSlideElements();

    // Get current slide content
    const slide = this.slides[this.currentSlide];

    // Create slide background with responsive dimensions
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

    // Calculate header height based on screen size but with a minimum
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

    // Create content text with responsive font size and position
    const contentText = this.scene.add
      .text(0, 0, slide.content, {
        fontSize: this.contentFontSize + "px",
        fill: "#ffffff",
        align: "center",
        lineSpacing: 10,
        wordWrap: { width: this.slideWidth - 80 }, // More padding for readability
      })
      .setOrigin(0.5);
    this.slideElements.push(contentText);

    // Add ESC key hint at the top-left corner with responsive positioning and size
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

    // Calculate button positions based on slide dimensions
    const buttonY = this.slideHeight / 2 - this.buttonHeight / 2 - 20; // More space at bottom
    const buttonSpacing = Math.min(this.slideWidth * 0.5, 350); // Limit maximum spacing

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

    // Create network diagram if needed
    if (slide.diagram) {
      this.createNetworkDiagram();
    }

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

    // Create button text with responsive font size
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

  createNetworkDiagram() {
    // Use fixed size nodes for better visibility
    const nodeRadius = Math.max(25, Math.min(30, this.slideWidth * 0.05));

    // Ensure diagram fits well on the slide and is properly spaced
    const nodeSpacing = Math.min(this.slideWidth * 0.3, 180);

    // Create graphics for the diagram
    const graphics = this.scene.add.graphics();
    this.slideElements.push(graphics);

    // Set line style for connections with responsive thickness
    const lineThickness = Math.max(3, Math.min(4, this.scaleFactor * 4));
    graphics.lineStyle(lineThickness, 0x00aaff, 0.8);

    // Calculate node positions
    const centerY = 30; // Shift up slightly to make room for content
    const switch1X = -nodeSpacing;
    const routerX = 0;
    const switch2X = nodeSpacing;

    // Draw connection lines
    graphics.lineBetween(switch1X, centerY, routerX, centerY);
    graphics.lineBetween(routerX, centerY, switch2X, centerY);

    // Create device icons with responsive sizing
    this.createDeviceIcon(
      switch1X,
      centerY,
      "Switch 1\n192.168.1.2",
      0x00ff00,
      nodeRadius
    );
    this.createDeviceIcon(
      routerX,
      centerY,
      "Router\n192.168.1.1",
      0xff9900,
      nodeRadius
    );
    this.createDeviceIcon(
      switch2X,
      centerY,
      "Switch 2\n192.168.2.2",
      0x00ff00,
      nodeRadius
    );
  }

  createDeviceIcon(x, y, label, color, radius) {
    // Create device circle with responsive size
    const circle = this.scene.add
      .circle(x, y, radius, color, 1)
      .setStrokeStyle(2, 0xffffff);
    this.slideElements.push(circle);

    // Font size based on circle size but with a minimum
    const fontSize = Math.max(16, Math.min(18, radius * 0.7));

    // Adjust label position based on circle size
    const labelY = y + radius + 18;

    // Create label text with responsive font
    const labelText = this.scene.add
      .text(x, labelY, label, {
        fontSize: fontSize + "px",
        fill: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);
    this.slideElements.push(labelText);

    // Add to container
    this.container.add([circle, labelText]);
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
        this.scene.events.emit("tutorialComplete");
      },
    });
  }
}

window.NetworkTutorialOverlay = NetworkTutorialOverlay;
