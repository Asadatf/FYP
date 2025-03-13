class NetworkDevice extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);

    // Store original properties for reference in case of resize
    this.origX = x;
    this.origY = y;
    this.type = key;

    // Get appropriate scale based on screen size
    this.calculateResponsiveScale();

    // Apply scaling
    this.setScale(this.deviceScale);

    // Add to scene
    this.scene.add.existing(this);

    // Add visual enhancements
    this.addDeviceEffects();
  }

  // Calculate appropriate scale based on screen dimensions
  calculateResponsiveScale() {
    const screenWidth = this.scene.scale.width;
    const screenHeight = this.scene.scale.height;

    // Calculate scale factor based on screen dimensions
    const scaleFactor = Math.min(screenWidth / 1280, screenHeight / 720);

    // Determine if we're on a mobile device
    const isMobile = screenWidth < 768;

    // Set scale based on device and screen size with minimum values to ensure visibility
    this.deviceScale = isMobile
      ? Math.max(0.08, scaleFactor * 0.1)
      : Math.max(0.1, scaleFactor * 0.1);
  }

  addDeviceEffects() {
    // Add pulsing effect scaled to device size
    this.scene.tweens.add({
      targets: this,
      scaleX: this.deviceScale * 1.1,
      scaleY: this.deviceScale * 1.1,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Add hover effect
    this.setInteractive()
      .on("pointerover", () => {
        this.setTint(0x00ff00);
        this.createHoverEffect();
      })
      .on("pointerout", () => {
        this.clearTint();
        if (this.hoverEffect) {
          this.hoverEffect.destroy();
        }
      });
  }

  createHoverEffect() {
    this.hoverEffect = this.scene.add.graphics();
    this.hoverEffect.lineStyle(2, 0x00ff00, 0.8);

    // Scale hover effect based on device size
    const hoverRadius = this.width * 0.6;
    this.hoverEffect.strokeCircle(this.x, this.y, hoverRadius);

    this.scene.tweens.add({
      targets: this.hoverEffect,
      alpha: 0,
      duration: 1000,
      repeat: -1,
      yoyo: true,
    });
  }

  highlight(isHighlighted) {
    if (isHighlighted) {
      this.setTint(0x00ff00);
      this.createHighlightEffect();
    } else {
      this.clearTint();
      if (this.highlightEffect) {
        this.highlightEffect.destroy();
      }
    }
  }

  createHighlightEffect() {
    this.highlightEffect = this.scene.add.graphics();
    // Scale the radius based on device size
    const radius = this.width * 0.6;

    this.scene.tweens.add({
      targets: this.highlightEffect,
      alpha: { from: 0.8, to: 0.2 },
      duration: 1000,
      repeat: -1,
      yoyo: true,
      onUpdate: () => {
        this.highlightEffect.clear();
        this.highlightEffect.lineStyle(2, 0x00ff00, this.highlightEffect.alpha);
        this.highlightEffect.strokeCircle(this.x, this.y, radius);
      },
    });
  }

  // Method to update position and scale when screen size changes
  updateForScreenSize() {
    // Recalculate appropriate scale
    this.calculateResponsiveScale();

    // Update scale and pulse animation
    this.setScale(this.deviceScale);

    // Update any active effects
    if (this.hoverEffect) {
      this.hoverEffect.destroy();
      this.createHoverEffect();
    }

    if (this.highlightEffect) {
      this.highlightEffect.destroy();
      this.createHighlightEffect();
    }
  }
}
