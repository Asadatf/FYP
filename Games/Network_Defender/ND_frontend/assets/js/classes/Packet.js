class Packet extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);
    this.scene = scene;
    this.followTarget = null;
    this.followOffset = { x: 10, y: 0 }; // Offset from the defender
    this.isDelivering = false;
    this.networkPath = [];
    this.currentPathIndex = 0;
    this.deliverySpeed = 200; // Delivery movement speed

    // Enable physics
    this.scene.physics.world.enable(this);

    // Scale the packet
    this.setScale(0.05);

    // Collide with world bounds, prevent from leaving world
    this.setCollideWorldBounds(true);

    // Add packet to existing scene
    this.scene.add.existing(this);
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

      // Calculate distance and duration based on speed
      const distance = Phaser.Math.Distance.Between(
        this.x,
        this.y,
        target.x,
        target.y
      );
      const duration = (distance / this.deliverySpeed) * 1000;

      // Create tween to move packet to next node
      this.scene.tweens.add({
        targets: this,
        x: target.x,
        y: target.y,
        duration: duration,
        ease: "Power2",
        onComplete: () => {
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
}
