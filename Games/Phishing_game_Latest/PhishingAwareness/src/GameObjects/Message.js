class Message {
  constructor(scene, x, y, data) {
    this.scene = scene;

    // Keep messages within screen bounds
    const screenWidth = scene.sys.game.config.width;
    const screenHeight = scene.sys.game.config.height;
    const messageWidth = 350;
    const messageHeight = 120;

    // Constrain x position to keep message on screen
    this.x = Math.min(
      Math.max(x, messageWidth / 2 + 10),
      screenWidth - messageWidth / 2 - 10
    );
    // Use original y for initial position (messages move down)
    this.y = y;

    this.data = data;
    this.isClicked = false;
    this.speed = Phaser.Math.Between(70, 120);

    // Format message content
    let messageText = "";

    if (data.type === "email") {
      // Format as email with truncated content if needed
      const sender = data.sender || "unknown@domain.com";
      const subject = data.subject || "Important Message";
      let body = data.text || "Click here to verify your account";

      // Truncate long sender or subject lines
      const truncatedSender =
        sender.length > 35 ? sender.substring(0, 32) + "..." : sender;
      const truncatedSubject =
        subject.length > 35 ? subject.substring(0, 32) + "..." : subject;

      messageText = `From: ${truncatedSender}\nSubject: ${truncatedSubject}\n\n${body}`;
    } else {
      messageText = data.text;
    }

    // Create temporary text to measure its size
    const tempText = scene.add.text(0, 0, data.text, {
      fontSize: "14px",
      fill: "#fff",
      wordWrap: { width: messageWidth - 40 },
      align: "left",
    });

    // Calculate the needed box size based on text (with minimum size)
    const textWidth = Math.max(tempText.width + 60, messageWidth);
    const textHeight = Math.max(tempText.height + 40, messageHeight);

    // Clean up temporary text
    tempText.destroy();

    // Create message background with cyber theme - dynamically sized
    const backgroundColor = 0x333333;
    const borderColor = data.isPhishing ? 0xff0000 : 0x00ffff;

    this.background = scene.add
      .rectangle(0, 0, textWidth, textHeight, backgroundColor, 0.8)
      .setStrokeStyle(2, borderColor);

    // Add subtle digital pattern
    const pattern = scene.add.grid(
      0,
      0,
      textWidth,
      textHeight,
      10,
      10,
      0,
      0,
      0x000000,
      0.1
    );

    // Create text with better positioning and wrapping
    this.text = scene.add
      .text(0, 0, data.text, {
        fontSize: "14px",
        fill: "#fff",
        wordWrap: { width: textWidth - 40 }, // Use our calculated width
        align: "left",
      })
      .setOrigin(0.5);

    // Create container with components
    this.container = scene.add.container(this.x, this.y, [
      this.background,
      pattern,
      this.text,
    ]);

    // Set container depth
    this.container.setDepth(1);

    // Enable physics with screen boundary check
    scene.physics.world.enable(this.container);
    this.container.body.setVelocityY(this.speed);
    this.container.body.setCollideWorldBounds(false); // Don't bounce at edges

    // Make hit areas for interaction - use actual background size
    this.container.setInteractive(
      new Phaser.Geom.Rectangle(
        -textWidth / 2,
        -textHeight / 2,
        textWidth,
        textHeight
      ),
      Phaser.Geom.Rectangle.Contains
    );

    this.background.setInteractive(
      new Phaser.Geom.Rectangle(
        -textWidth / 2,
        -textHeight / 2,
        textWidth,
        textHeight
      ),
      Phaser.Geom.Rectangle.Contains
    );

    // Click handlers for both elements
    this.container.on("pointerdown", () => this.handleClick());
    this.background.on("pointerdown", () => this.handleClick());

    // Add hover effects
    this.container.on("pointerover", () => {
      if (!this.isClicked) {
        this.background.setFillStyle(0x444444, 0.9);
        this.container.setScale(1.05);
        this.scene.input.setDefaultCursor("pointer");
      }
    });

    this.container.on("pointerout", () => {
      if (!this.isClicked) {
        this.background.setFillStyle(backgroundColor, 0.8);
        this.container.setScale(1);
        this.scene.input.setDefaultCursor("default");
      }
    });

    // Check if message will go off screen and destroy if needed
    this.scene.time.addEvent({
      delay: 100,
      callback: this.checkBounds,
      callbackScope: this,
      loop: true,
    });
  }

  // Check if message is off screen and should be removed
  checkBounds() {
    if (this.container && this.container.active) {
      // Use the actual height of the background for more accurate bounds checking
      const halfHeight = this.background.height / 2;
      const bottomY = this.container.y + halfHeight;
      const screenHeight = this.scene.sys.game.config.height;

      if (bottomY > screenHeight + 100) {
        // give extra buffer before removing
        if (this.scene.messages && this.scene.messages.indexOf(this) > -1) {
          this.scene.messages.splice(this.scene.messages.indexOf(this), 1);
        } else if (
          typeof messages !== "undefined" &&
          messages.indexOf(this) > -1
        ) {
          messages.splice(messages.indexOf(this), 1);
        }
        this.container.destroy();
      }
    }
  }

  handleClick() {
    // Initialize gameActive to true if it's undefined
    if (typeof this.scene.gameActive === "undefined") {
      this.scene.gameActive = true;
    }

    if (!this.isClicked && this.scene.gameActive) {
      this.isClicked = true;
      const correct = this.data.isPhishing;

      // Update score with effects
      const scoreChange = correct ? 10 : -5;

      if (typeof this.scene.score !== "undefined") {
        this.scene.score += scoreChange;
        if (this.scene.scoreText) {
          this.scene.scoreText.setText("Score: " + this.scene.score);

          // Add score change animation
          const scoreEffect = this.scene.add
            .text(
              this.x,
              this.y - 30,
              (scoreChange > 0 ? "+" : "") + scoreChange,
              {
                fontSize: "24px",
                fontFamily: "Arial",
                fill: correct ? "#00ff00" : "#ff0000",
                stroke: "#000",
                strokeThickness: 3,
              }
            )
            .setOrigin(0.5);

          this.scene.tweens.add({
            targets: scoreEffect,
            y: scoreEffect.y - 50,
            alpha: 0,
            duration: 800,
            onComplete: () => scoreEffect.destroy(),
          });
        }
      } else {
        // Fallback to global score variable if scene.score isn't available
        if (typeof score !== "undefined") {
          score += scoreChange;
          if (typeof scoreText !== "undefined") {
            scoreText.setText("Score: " + score);
          }
        }
      }

      // Show feedback with effects
      this.showFeedback(correct);

      // Schedule removal with animation
      this.scene.time.delayedCall(500, () => {
        // Remove from messages array
        if (this.scene.messages && this.scene.messages.indexOf(this) > -1) {
          this.scene.messages.splice(this.scene.messages.indexOf(this), 1);
        } else if (
          typeof messages !== "undefined" &&
          messages.indexOf(this) > -1
        ) {
          // Fallback to global messages array
          messages.splice(messages.indexOf(this), 1);
        }

        this.destroy();
      });
    }
  }

  showFeedback(correct) {
    const color = correct ? 0x00ff00 : 0xff0000;

    // Flash effect
    this.scene.cameras.main.flash(
      100,
      correct ? 0 : 255,
      correct ? 255 : 0,
      0,
      0.3
    );

    // Set background color for feedback
    this.background.setFillStyle(color, 0.8);

    // Add explosion effect for correct identification
    if (correct) {
      // Create particle explosion
      if (this.scene.textures.exists("particle")) {
        const particles = this.scene.add.particles(this.x, this.y, "particle", {
          speed: { min: 50, max: 150 },
          scale: { start: 1, end: 0 },
          lifespan: 500,
          blendMode: "ADD",
          quantity: 20,
        });

        // Auto-destroy particles
        this.scene.time.delayedCall(500, () => {
          particles.destroy();
        });
      }
    }

    // Add text feedback
    const feedbackText = this.scene.add
      .text(
        this.x,
        this.y,
        correct ? "THREAT ELIMINATED!" : "SECURITY BREACH!",
        {
          fontSize: "20px",
          fontFamily: "Arial",
          fill: correct ? "#00ff00" : "#ff0000",
          stroke: "#000",
          strokeThickness: 3,
        }
      )
      .setOrigin(0.5);

    // Animate feedback text
    this.scene.tweens.add({
      targets: feedbackText,
      y: feedbackText.y - 50,
      alpha: 0,
      duration: 800,
      onComplete: () => feedbackText.destroy(),
    });

    // Shake camera for wrong answers
    if (!correct) {
      this.scene.cameras.main.shake(200, 0.01);
    }
  }

  destroy() {
    // Fade out animation
    this.scene.tweens.add({
      targets: this.container,
      alpha: 0,
      scaleX: 0.8,
      scaleY: 0.8,
      duration: 200,
      onComplete: () => {
        if (this.container) {
          this.container.destroy();
        }
      },
    });
  }
}
