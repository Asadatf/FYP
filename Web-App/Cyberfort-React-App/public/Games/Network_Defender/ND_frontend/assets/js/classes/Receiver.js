class Receiver extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);
    this.scene = scene;

    // Store original position for reference
    this.origX = x;
    this.origY = y;

    // Calculate responsive scaling
    this.calculateResponsiveProperties();

    // Enable physics
    this.scene.physics.world.enable(this);

    // Set Immovable
    this.setImmovable(false);

    // Apply responsive scaling
    this.setScale(this.receiverScale);

    // Collide with world bounds, prevent from leaving world
    this.setCollideWorldBounds(true);

    // Flipping towards left
    this.flipX = true;

    // Add receiver to existing scene
    this.scene.add.existing(this);

    // Add listener for screen resize
    this.scene.scale.on("resize", this.handleResize, this);
  }

  // Calculate responsive properties based on screen size
  calculateResponsiveProperties() {
    // Get current screen dimensions
    const screenWidth = this.scene.scale.width;
    const screenHeight = this.scene.scale.height;

    // Calculate scale factor based on screen dimensions
    const scaleFactor = Math.min(screenWidth / 1280, screenHeight / 720);

    // Determine if we're on a mobile device
    const isMobile = screenWidth < 768;

    // Set movement duration based on screen size (faster on smaller screens)
    this.moveDuration = isMobile
      ? Math.max(600, 800 * scaleFactor) // Slightly faster on mobile
      : Math.max(800, 800 * scaleFactor); // Standard duration on desktop

    // Set scale based on device and screen size
    this.receiverScale = isMobile
      ? Math.max(0.12, 0.15 * scaleFactor) // Slightly smaller on mobile
      : Math.max(0.15, 0.15 * scaleFactor); // Standard scale on desktop
  }

  // Handle screen resize events
  handleResize() {
    // Recalculate responsive properties
    this.calculateResponsiveProperties();

    // Update scale
    this.setScale(this.receiverScale);
  }

  moveToSwitch(switchX, switchY, onComplete) {
    // Calculate distance for proportional duration
    const distance = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      switchX,
      switchY
    );

    // Adjust duration based on distance
    const proportionalDuration = Math.min(
      this.moveDuration,
      Math.max(400, (distance / 300) * this.moveDuration)
    );

    // Create tween animation with responsive duration
    this.scene.tweens.add({
      targets: this,
      x: switchX,
      y: switchY,
      duration: proportionalDuration,
      ease: "Power2",
      onComplete: onComplete,
    });
  }

  // New method to handle packet receiving animation
  animatePacketReceive() {
    // Scale up and down animation for receiving a packet
    this.scene.tweens.add({
      targets: this,
      scaleX: this.receiverScale * 1.2,
      scaleY: this.receiverScale * 1.2,
      duration: 300,
      yoyo: true,
      ease: "Sine.easeOut",
      onComplete: () => {
        // Reset to original scale
        this.setScale(this.receiverScale);
      },
    });

    // Create a highlight effect
    const highlight = this.scene.add.circle(
      this.x,
      this.y,
      this.width,
      0x00ff00,
      0.4
    );

    // Animate and remove the highlight
    this.scene.tweens.add({
      targets: highlight,
      alpha: 0,
      scale: 1.5,
      duration: 500,
      onComplete: () => {
        highlight.destroy();
      },
    });
  }
}
