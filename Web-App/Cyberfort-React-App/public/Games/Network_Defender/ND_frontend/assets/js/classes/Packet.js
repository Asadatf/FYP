class Packet extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);
    this.scene = scene;
    this.followTarget = null;

    // Calculate responsive properties
    this.calculateResponsiveProperties();

    // Initialize with responsive values
    this.followOffset = {
      x: 10 * this.scaleFactor,
      y: 0,
    }; // Offset from the defender

    this.isDelivering = false;
    this.networkPath = [];
    this.currentPathIndex = 0;
    this.deliverySpeed = 200 * this.scaleFactor; // Delivery movement speed adjusted for screen size

    // Enable physics
    this.scene.physics.world.enable(this);

    // Scale the packet based on screen size
    this.setScale(this.packetScale);

    // Collide with world bounds, prevent from leaving world
    this.setCollideWorldBounds(true);

    // Add packet to existing scene
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
    this.scaleFactor = Math.min(screenWidth / 1280, screenHeight / 720);

    // Determine if we're on a mobile device
    const isMobile = screenWidth < 768;

    // Set scale based on device and screen size
    this.packetScale = isMobile
      ? Math.max(0.04, 0.05 * this.scaleFactor) // Slightly smaller on mobile
      : Math.max(0.05, 0.05 * this.scaleFactor); // Standard scale on desktop

    // Update follow offset if target exists
    if (this.followTarget) {
      this.followOffset = {
        x: 10 * this.scaleFactor,
        y: 0,
      };
    }
  }

  // Handle screen resize events
  handleResize() {
    // Recalculate responsive properties
    this.calculateResponsiveProperties();

    // Update scale
    this.setScale(this.packetScale);

    // Update delivery speed
    this.deliverySpeed = 200 * this.scaleFactor;

    // Update position if following a target
    if (this.followTarget && !this.isDelivering) {
      this.updatePosition();
    }
  }

  // Method to attach the packet to a target (like the defender)
  followDefender(target) {
    this.followTarget = target;
    this.setVisible(true);
    // Initially position at the target's position with offset
    this.updatePosition();
  }

  // Method to update packet position relative to its target
  updatePosition() {
    if (this.followTarget && !this.isDelivering) {
      this.setPosition(
        this.followTarget.x + this.followOffset.x,
        this.followTarget.y + this.followOffset.y
      );
    }
  }

  // Method to start delivery along network path
  startDelivery(path) {
    this.isDelivering = true;
    this.networkPath = path;
    this.currentPathIndex = 0;
    this.moveToNextNode();
  }

  // Move to the next node in the path
  moveToNextNode() {
    if (this.currentPathIndex < this.networkPath.length) {
      const target = this.networkPath[this.currentPathIndex];

      // Calculate distance and duration based on speed and screen size
      const distance = Phaser.Math.Distance.Between(
        this.x,
        this.y,
        target.x,
        target.y
      );

      // Adjust duration based on screen size - faster on smaller screens for better UX
      const duration = (distance / this.deliverySpeed) * 1000;

      // Create tween to move packet to next node
      this.scene.tweens.add({
        targets: this,
        x: target.x,
        y: target.y,
        duration: duration,
        ease: "Power2",
        onComplete: () => {
          // Create arrival effect
          this.createArrivalEffect(target.x, target.y);

          // Move to next node if available
          this.currentPathIndex++;
          if (this.currentPathIndex < this.networkPath.length) {
            this.moveToNextNode();
          } else {
            // Delivery complete
            this.onDeliveryComplete();
          }
        },
      });
    }
  }

  // Create visual effect when arriving at a node
  createArrivalEffect(x, y) {
    // Create pulse effect
    const pulse = this.scene.add.circle(
      x,
      y,
      15 * this.scaleFactor,
      0x00ff00,
      0.7
    );

    // Animate and remove
    this.scene.tweens.add({
      targets: pulse,
      alpha: 0,
      scale: 2,
      duration: 300,
      onComplete: () => {
        pulse.destroy();
      },
    });

    // Optionally add particles if available
    try {
      const particles = this.scene.add.particles(x, y, "packet", {
        scale: { start: this.packetScale * 0.5, end: 0 },
        speed: { min: 30 * this.scaleFactor, max: 60 * this.scaleFactor },
        lifespan: 300,
        quantity: 5,
      });

      // Clean up particles
      this.scene.time.delayedCall(300, () => {
        particles.destroy();
      });
    } catch (e) {
      // Particles not available, skip
    }
  }

  // Called when delivery is complete
  onDeliveryComplete() {
    this.isDelivering = false;
    if (this.followTarget) {
      // Return to following the defender
      this.updatePosition();
    }

    // You can emit an event for the game to handle
    if (this.scene.events) {
      this.scene.events.emit("packetDelivered");
    }
  }

  // Update function called by the scene
  update() {
    if (this.followTarget && !this.isDelivering) {
      this.updatePosition();
    }
  }

  // Create trail effect with responsive sizing
  createTrail() {
    const trail = this.scene.add.circle(
      this.x,
      this.y,
      3 * this.scaleFactor,
      0x00ff00,
      0.7
    );

    // Add to trail group if exists
    if (this.scene.packetTrail) {
      this.scene.packetTrail.add(trail);
    }

    // Animate trail fading
    this.scene.tweens.add({
      targets: trail,
      alpha: 0,
      scale: 0.1,
      duration: 500,
      onComplete: () => {
        trail.destroy();
      },
    });

    return trail;
  }
}
