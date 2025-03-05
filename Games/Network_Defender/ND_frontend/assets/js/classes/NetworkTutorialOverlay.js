class NetworkTutorialOverlay {
  constructor(scene) {
    this.scene = scene;
    this.container = null;
    this.slides = [];
    this.slideElements = []; // Track all created elements for proper cleanup
    this.currentSlide = 0;
    this.isActive = false;
  }

  showTutorial() {
    if (this.isActive) return;

    this.isActive = true;
    this.createTutorialContainer();
    this.createTutorialContent();
    this.showCurrentSlide();
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

    // Add everything to the container
    this.container.add(this.slideElements);

    // Create network diagram if needed
    if (slide.diagram) {
      this.createNetworkDiagram();
    }

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

  createNetworkDiagram() {
    // Create graphics for the diagram
    const graphics = this.scene.add.graphics();
    this.slideElements.push(graphics);

    // Set line style for connections
    graphics.lineStyle(3, 0x00aaff, 0.8);

    // Draw connection lines
    graphics.lineBetween(-150, 50, 0, 50);
    graphics.lineBetween(0, 50, 150, 50);

    // Create device icons
    this.createDeviceIcon(-150, 50, "Switch 1\n192.168.1.2", 0x00ff00);
    this.createDeviceIcon(0, 50, "Router\n192.168.1.1", 0xff9900);
    this.createDeviceIcon(150, 50, "Switch 2\n192.168.2.2", 0x00ff00);
  }

  createDeviceIcon(x, y, label, color) {
    // Create device circle
    const circle = this.scene.add
      .circle(x, y, 20, color, 1)
      .setStrokeStyle(2, 0xffffff);
    this.slideElements.push(circle);

    // Create label text
    const labelText = this.scene.add
      .text(x, y + 35, label, {
        fontSize: "14px",
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
