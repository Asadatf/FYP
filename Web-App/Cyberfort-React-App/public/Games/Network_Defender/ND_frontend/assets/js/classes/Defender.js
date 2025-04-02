class Defender extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);
    this.scene = scene;

    // Store original position for reference
    this.origX = x;
    this.origY = y;

    // Calculate responsive velocity and scaling
    this.calculateResponsiveProperties();

    // Enable physics
    this.scene.physics.world.enable(this);

    // Set Immovable
    this.setImmovable(false);

    // Apply responsive scaling
    this.setScale(this.defenderScale);

    this.body.setSize(this.width * 0.6, this.height * 0.6);
    this.body.setOffset(this.width * 0.2, this.height * 0.2);
    // Collide with world bounds, prevent from leaving world
    this.setCollideWorldBounds(true);

    // Add defender to existing scene
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

    // Set velocity based on screen size (faster on larger screens)
    this.velocity = isMobile
      ? Math.min(200, 250 * scaleFactor) // Slightly slower on mobile for better control
      : Math.min(300, 250 * scaleFactor); // Standard velocity on desktop

    // Set scale based on device and screen size
    this.defenderScale = isMobile
      ? Math.max(0.12, 0.15 * scaleFactor) // Slightly smaller on mobile
      : Math.max(0.15, 0.15 * scaleFactor); // Standard scale on desktop
  }

  // Handle screen resize events
  handleResize() {
    // Recalculate responsive properties
    this.calculateResponsiveProperties();

    // Update scale
    this.setScale(this.defenderScale);
  }

  update(keys, isPopupActive) {
    this.body.setVelocity(0);

    // Only allow movement when no popup is active
    if (!isPopupActive) {
      if (keys.a.isDown) {
        this.body.setVelocityX(-this.velocity); // Move left
        this.flipX = true; // Flip sprite to face left
      } else if (keys.d.isDown) {
        this.body.setVelocityX(this.velocity); // Move right
        this.flipX = false; // Flip sprite to face right
      }

      if (keys.w.isDown) {
        this.body.setVelocityY(-this.velocity); // Move up
      } else if (keys.s.isDown) {
        this.body.setVelocityY(this.velocity); // Move down
      }

      // Add touch controls for mobile devices
      this.handleTouchControls();
    }
  }

  // Add touch control support for mobile devices
  handleTouchControls() {
    // Only add touch controls on mobile devices
    if (this.scene.scale.width < 768 && this.scene.input.activePointer.isDown) {
      const pointer = this.scene.input.activePointer;

      // Get center point of screen
      const centerX = this.scene.scale.width / 2;
      const centerY = this.scene.scale.height / 2;

      // Calculate distance from center to determine movement magnitude
      const distX = pointer.x - centerX;
      const distY = pointer.y - centerY;
      const distance = Math.sqrt(distX * distX + distY * distY);

      // Set minimum distance for movement to prevent accidental touches
      const minDistance = 50;

      if (distance > minDistance) {
        // Normalize vector for consistent speed
        const normalizedX = distX / distance;
        const normalizedY = distY / distance;

        // Apply velocity
        this.body.setVelocityX(normalizedX * this.velocity);
        this.body.setVelocityY(normalizedY * this.velocity);

        // Update sprite orientation
        if (normalizedX < 0) {
          this.flipX = true;
        } else {
          this.flipX = false;
        }
      }
    }
  }
}
