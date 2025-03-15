class ManInTheMiddleAttack {
  constructor(scene, messageHandler) {
    this.scene = scene;
    this.messageHandler = messageHandler;
    this.attackChance = 1.0; // 100% chance for testing, change to 0.3 (30%) for production
    this.isAttacking = false;
    this.attackContainer = null;
    this.attackElements = [];
    this.onAttackResolved = null;

    // Specific references to ensure proper cleanup
    this.attackerAvatar = null;
    this.attackGraphics = null;
    this.attackAnimationTimer = null;
    this.attackerTween = null;
  }

  checkForAttack() {
    // Determine if attack happens based on chance
    return Math.random() < this.attackChance;
  }

  triggerAttack(callback) {
    this.isAttacking = true;
    this.onAttackResolved = callback;

    // Create attack notification
    this.showAttackNotification();

    // Play alert sound if available
    try {
      this.scene.sound.play("clickSound", { volume: 0.8 });
    } catch (e) {
      console.log("Sound not available");
    }

    // Add camera shake for dramatic effect
    this.scene.cameras.main.shake(300, 0.005);
  }

  showAttackNotification() {
    // Create overlay for better focus
    const overlay = this.scene.add
      .rectangle(
        0,
        0,
        this.scene.scale.width,
        this.scene.scale.height,
        0x000000,
        0.7
      )
      .setOrigin(0, 0);

    // Create container for attack elements
    this.attackContainer = this.scene.add.container(
      this.scene.scale.width / 2,
      this.scene.scale.height / 2
    );

    // Create alert background
    const alertBg = this.scene.add.rectangle(0, 0, 550, 350, 0x330000, 0.9);
    alertBg.setStrokeStyle(3, 0xff0000);

    // Warning icon (using text emoji for simplicity)
    const warningIcon = this.scene.add
      .text(0, -130, "🚨", { fontSize: "64px" })
      .setOrigin(0.5);

    // Add animated effect to warning icon
    this.scene.tweens.add({
      targets: warningIcon,
      scale: { from: 1, to: 1.2 },
      duration: 500,
      yoyo: true,
      repeat: -1,
    });

    // Alert title
    const titleText = this.scene.add
      .text(0, -80, "WARNING: MAN-IN-THE-MIDDLE ATTACK DETECTED!", {
        fontSize: "22px",
        fill: "#ff0000",
        fontStyle: "bold",
        align: "center",
        wordWrap: { width: 500 },
      })
      .setOrigin(0.5);

    // Alert description
    const descriptionText = this.scene.add
      .text(
        0,
        -20,
        "An attacker is trying to intercept your message before it reaches its destination!",
        {
          fontSize: "18px",
          fill: "#ffffff",
          align: "center",
          wordWrap: { width: 500 },
        }
      )
      .setOrigin(0.5);

    // Create choice buttons
    const ignoreButton = this.createChoiceButton(
      -150,
      80,
      "Ignore Attack\n(Risky)",
      "#ff9900",
      "#663300",
      () => this.resolveAttack("ignore")
    );

    const firewallButton = this.createChoiceButton(
      150,
      80,
      `Use Firewall\n(10 CC)`,
      "#00ff00",
      "#006600",
      () => this.resolveAttack("firewall")
    );

    // Add animated attacker visualization
    this.createAttackerVisualization();

    // Add all elements to container
    this.attackContainer.add([
      alertBg,
      warningIcon,
      titleText,
      descriptionText,
      ignoreButton.container,
      firewallButton.container,
    ]);

    // Store elements for cleanup
    this.attackElements = [overlay, this.attackContainer];
  }

  createChoiceButton(x, y, text, textColor, bgColor, callback) {
    const buttonWidth = 200;
    const buttonHeight = 80;

    // Create container for button elements
    const container = this.scene.add.container(x, y);

    // Button background
    const background = this.scene.add
      .rectangle(
        0,
        0,
        buttonWidth,
        buttonHeight,
        parseInt(bgColor.replace("#", "0x")),
        1
      )
      .setStrokeStyle(2, 0xffffff);

    // Button text
    const buttonText = this.scene.add
      .text(0, 0, text, {
        fontSize: "18px",
        fill: textColor,
        align: "center",
      })
      .setOrigin(0.5);

    // Make button interactive
    background
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => {
        background.setScale(1.05);
        buttonText.setScale(1.05);
      })
      .on("pointerout", () => {
        background.setScale(1);
        buttonText.setScale(1);
      })
      .on("pointerdown", callback);

    // Add to container
    container.add([background, buttonText]);

    return { container, background, buttonText };
  }

  createAttackerVisualization() {
    // Create a visual representation of the attack for better player understanding
    try {
      // Try to use existing packet and defender/receiver assets
      const packet = this.messageHandler.packet;
      const attackerPosition = {
        x: (this.messageHandler.dX + this.messageHandler.rX) / 2,
        y: (this.messageHandler.dY + this.messageHandler.rY) / 2 - 50,
      };

      // Create attacker icon (using the attacker image if available, or a red circle if not)
      let attacker;
      try {
        attacker = this.scene.add
          .image(attackerPosition.x, attackerPosition.y, "attacker")
          .setScale(0.1);
      } catch (e) {
        // Fallback to a simple red circle
        attacker = this.scene.add.circle(
          attackerPosition.x,
          attackerPosition.y,
          15,
          0xff0000
        );
      }

      // Store attacker reference specifically
      this.attackerAvatar = attacker;

      // Add attack visualization with red laser lines
      const attackGraphics = this.scene.add.graphics();
      attackGraphics.lineStyle(2, 0xff0000, 0.7);

      // Store graphics reference specifically
      this.attackGraphics = attackGraphics;

      // Create timer event for animation
      this.attackAnimationTimer = this.scene.time.addEvent({
        delay: 300,
        callback: () => {
          if (this.attackGraphics) {
            this.attackGraphics.clear();

            // Draw attack lines (if the attack is still active)
            if (this.isAttacking) {
              this.attackGraphics.lineStyle(2, 0xff0000, 0.7);

              // Draw zigzag line from sender to attacker
              this.drawZigzagLine(
                this.attackGraphics,
                this.messageHandler.dX,
                this.messageHandler.dY,
                attackerPosition.x,
                attackerPosition.y,
                4
              );

              // Draw zigzag line from attacker to receiver
              this.drawZigzagLine(
                this.attackGraphics,
                attackerPosition.x,
                attackerPosition.y,
                this.messageHandler.rX,
                this.messageHandler.rY,
                4
              );
            }
          }
        },
        callbackScope: this,
        loop: true,
      });

      // Add to cleanup list
      this.attackElements.push(attacker, attackGraphics);

      // Add pulsing effect to attacker
      this.attackerTween = this.scene.tweens.add({
        targets: attacker,
        scale: attacker.scale * 1.3,
        alpha: 0.7,
        duration: 500,
        yoyo: true,
        repeat: -1,
      });
    } catch (e) {
      console.log("Could not create attack visualization:", e);
    }
  }

  drawZigzagLine(graphics, x1, y1, x2, y2, steps) {
    graphics.beginPath();
    graphics.moveTo(x1, y1);

    const stepX = (x2 - x1) / steps;
    const stepY = (y2 - y1) / steps;

    for (let i = 1; i < steps; i++) {
      const xOffset = i % 2 === 0 ? 20 : -20;
      graphics.lineTo(x1 + stepX * i + xOffset, y1 + stepY * i);
    }

    graphics.lineTo(x2, y2);
    graphics.strokePath();
  }

  // Modification for ManInTheMiddleAttack.js
  // Update the resolveAttack method to deduct coins when ignoring an attack that succeeds

  resolveAttack(choice) {
    // Thoroughly clean up all attack UI elements
    if (this.attackContainer) {
      // Destroy all container children
      this.attackContainer.each((child) => {
        this.scene.tweens.killTweensOf(child);
        child.destroy();
      });
      this.attackContainer.destroy();
      this.attackContainer = null;
    }

    // Clean up any additional attack elements
    this.attackElements.forEach((element) => {
      if (element && element.destroy) {
        this.scene.tweens.killTweensOf(element);
        element.destroy();
      }
    });
    this.attackElements = [];

    if (choice === "firewall") {
      // Player chooses to use firewall
      const hasEnoughCoins = this.scene.walletManager.spend(10);

      if (hasEnoughCoins) {
        // Show success message
        this.showResolutionMessage(
          "Firewall Protection Activated!",
          "Your message is now secure from interception.",
          "#00ff00",
          false
        );

        // Add firewall effect animation
        this.createFirewallEffect();

        // Emit attack prevented event for scoring
        this.scene.events.emit("attackPrevented");
      } else {
        // Not enough coins, attack proceeds
        this.showResolutionMessage(
          "Insufficient CyberCoins!",
          "You don't have enough CC for firewall protection.",
          "#ff0000",
          true
        );

        // Player must now ignore the attack
        this.scene.time.delayedCall(2000, () => {
          this.resolveAttack("ignore");
        });
      }
    } else {
      // Player chooses to ignore attack
      const attackSucceeds = Math.random() < 0.7; // 70% chance attack succeeds

      if (attackSucceeds) {
        // NEW CODE: Deduct 15 CyberCoins when attack succeeds after ignoring
        if (
          this.scene.walletManager &&
          typeof this.scene.walletManager.spend === "function"
        ) {
          this.scene.walletManager.spend(15);

          // Show penalty notification separately
          const penaltyText = this.scene.add
            .text(
              this.scene.scale.width / 2,
              this.scene.scale.height / 2 - 130,
              "SECURITY BREACH: -15 CC",
              {
                fontSize: "24px",
                fill: "#ff0000",
                backgroundColor: "#000000",
                padding: { x: 10, y: 5 },
                stroke: "#ffffff",
                strokeThickness: 2,
              }
            )
            .setOrigin(0.5)
            .setDepth(1000);

          // Fade out penalty text
          this.scene.tweens.add({
            targets: penaltyText,
            alpha: 0,
            y: "-=30",
            duration: 2000,
            delay: 500,
            ease: "Power2",
            onComplete: () => {
              penaltyText.destroy();
            },
          });
        }

        // Message gets corrupted
        this.showResolutionMessage(
          "Message Intercepted!",
          "The attacker has altered your message!",
          "#ff0000",
          true
        );

        this.scene.events.emit("attackFailed");
      } else {
        // Attack fails by chance
        this.showResolutionMessage(
          "Attack Failed!",
          "The attacker failed to intercept your message.",
          "#ffff00",
          false
        );

        // Emit attack prevented event for scoring
        this.scene.events.emit("attackPrevented");
      }
    }
  }

  showResolutionMessage(title, description, color, isError) {
    const messageBox = this.scene.add.container(
      this.scene.scale.width / 2,
      this.scene.scale.height / 2
    );

    const boxBg = this.scene.add
      .rectangle(0, 0, 400, 200, isError ? 0x330000 : 0x003300, 0.9)
      .setStrokeStyle(2, color.replace("#", "0x"));

    const titleText = this.scene.add
      .text(0, -50, title, {
        fontSize: "28px",
        fill: color,
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5);

    const descText = this.scene.add
      .text(0, 20, description, {
        fontSize: "20px",
        fill: "#ffffff",
        align: "center",
        wordWrap: { width: 350 },
      })
      .setOrigin(0.5);

    messageBox.add([boxBg, titleText, descText]);

    // Add animated effect based on success/failure
    if (isError) {
      this.scene.cameras.main.shake(300, 0.005);
    } else {
      // Success effect
      const successParticles = this.scene.add.particles(0, 0, "packet", {
        x: this.scene.scale.width / 2,
        y: this.scene.scale.height / 2,
        speed: { min: 50, max: 150 },
        scale: { start: 0.05, end: 0 },
        lifespan: 1000,
        blendMode: "ADD",
        frequency: 20,
        quantity: 5,
      });

      this.scene.time.delayedCall(2000, () => {
        if (successParticles) successParticles.destroy();
      });
    }

    // Store resolution message for cleanup
    this.resolutionMessage = messageBox;

    // The attack resolution message will stay visible for a longer time (3.5 seconds)
    // We'll call the callback after this delay
    this.scene.time.delayedCall(3500, () => {
      if (this.resolutionMessage) {
        this.resolutionMessage.destroy();
        this.resolutionMessage = null;
      }

      // Now call the callback to continue game flow
      this.completeAttackResolution(isError);
    });
  }

  createFirewallEffect() {
    try {
      // Create a container for all firewall elements
      this.firewallContainer = this.scene.add.container(0, 0);
      this.attackElements.push(this.firewallContainer);

      // Create a shield effect along the entire packet path
      const shieldGraphics = this.scene.add.graphics();
      this.firewallContainer.add(shieldGraphics);

      // Create firewall nodes at key points
      const firewallNodes = [];

      // Calculate the number of nodes based on distance
      const startPoint = {
        x: this.messageHandler.dX,
        y: this.messageHandler.dY,
      };
      const endPoint = { x: this.messageHandler.rX, y: this.messageHandler.rY };
      const distance = Phaser.Math.Distance.Between(
        startPoint.x,
        startPoint.y,
        endPoint.x,
        endPoint.y
      );

      // Place nodes every 80 pixels along the path
      const nodeCount = Math.max(3, Math.floor(distance / 80));

      // Create firewall nodes along the path
      for (let i = 0; i <= nodeCount; i++) {
        const progress = i / nodeCount;
        const x = startPoint.x + (endPoint.x - startPoint.x) * progress;
        const y = startPoint.y + (endPoint.y - startPoint.y) * progress;

        // Create a firewall node (cyan hexagon)
        const node = this.scene.add.polygon(
          x,
          y,
          [
            { x: -15, y: 0 },
            { x: -7.5, y: -13 },
            { x: 7.5, y: -13 },
            { x: 15, y: 0 },
            { x: 7.5, y: 13 },
            { x: -7.5, y: 13 },
          ],
          0x00ffff,
          0.7
        );

        // Add stroke to the node
        node.setStrokeStyle(2, 0x00ffff, 1);

        // Add pulsing animation
        this.scene.tweens.add({
          targets: node,
          scaleX: 1.2,
          scaleY: 1.2,
          alpha: 0.5,
          duration: 800 + Math.random() * 400,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut",
        });

        firewallNodes.push(node);
        this.firewallContainer.add(node);
      }

      // Create animated connection lines between firewall nodes
      const connectionGraphics = this.scene.add.graphics();
      this.firewallContainer.add(connectionGraphics);

      // Digital code particles that float along the path
      this.createDigitalParticles(startPoint, endPoint);

      // Add scanning beam effect
      this.createScanningBeam(startPoint, endPoint);

      // Create shield animation timer - will continue even after attack is resolved
      const shieldAnimation = this.scene.time.addEvent({
        delay: 50,
        callback: () => {
          // Note: Removed the isAttacking check so animation continues

          // Update shield graphics
          shieldGraphics.clear();

          // Draw outer shield perimeter
          shieldGraphics.lineStyle(3, 0x00ffff, 0.3);

          // Create wavy perimeter effect by calculating points along the path
          const time = this.scene.time.now / 1000;
          const wavePoints = [];

          // Calculate points for shield perimeter
          for (let i = 0; i <= 20; i++) {
            const progress = i / 20;
            const baseX = startPoint.x + (endPoint.x - startPoint.x) * progress;
            const baseY = startPoint.y + (endPoint.y - startPoint.y) * progress;

            // Add wave effect perpendicular to the path
            const angle =
              Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x) +
              Math.PI / 2;
            const waveAmplitude = 30 + Math.sin(time * 3 + progress * 10) * 10;

            const offsetX = Math.cos(angle) * waveAmplitude;
            const offsetY = Math.sin(angle) * waveAmplitude;

            wavePoints.push({ x: baseX + offsetX, y: baseY + offsetY });
            wavePoints.unshift({ x: baseX - offsetX, y: baseY - offsetY }); // Add to beginning for closed shape
          }

          // Draw the shield perimeter
          shieldGraphics.beginPath();
          shieldGraphics.moveTo(wavePoints[0].x, wavePoints[0].y);

          for (let i = 1; i < wavePoints.length; i++) {
            shieldGraphics.lineTo(wavePoints[i].x, wavePoints[i].y);
          }

          shieldGraphics.closePath();
          shieldGraphics.strokePath();

          // Draw connection lines between nodes with animated data flow
          connectionGraphics.clear();
          connectionGraphics.lineStyle(2, 0x00ffff, 0.8);

          const dataFlowOffset = (time * 5) % 1; // For animated dashed effect

          for (let i = 0; i < firewallNodes.length - 1; i++) {
            const startNode = firewallNodes[i];
            const endNode = firewallNodes[i + 1];

            this.drawAnimatedDataLine(
              connectionGraphics,
              startNode.x,
              startNode.y,
              endNode.x,
              endNode.y,
              dataFlowOffset
            );
          }
        },
        callbackScope: this,
        loop: true,
      });

      // Store timer for cleanup
      // this.attackElements.push({
      //   destroy: () => {
      //     shieldAnimation.remove();
      //     if (this.firewallContainer) {
      //       this.firewallContainer.destroy();
      //       this.firewallContainer = null;
      //     }
      //   },
      // });

      // Add "FIREWALL ACTIVE" text that fades in and out
      const statusText = this.scene.add
        .text(
          this.scene.scale.width / 2,
          this.scene.scale.height - 100,
          "FIREWALL ACTIVE",
          {
            fontFamily: "monospace",
            fontSize: "28px",
            color: "#00ffff",
            stroke: "#003333",
            strokeThickness: 4,
          }
        )
        .setOrigin(0.5);

      this.scene.tweens.add({
        targets: statusText,
        alpha: { from: 1, to: 0.5 },
        duration: 1000,
        yoyo: true,
        repeat: -1,
      });

      this.firewallContainer.add(statusText);

      // Create success sound effect if available
      try {
        this.scene.sound.play("clickSound", { volume: 0.5 });
      } catch (e) {
        console.log("Sound not available");
      }
    } catch (e) {
      console.log("Could not create enhanced firewall effect:", e);
    }
  }

  // Helper method to create animated data line with dashes
  drawAnimatedDataLine(graphics, x1, y1, x2, y2, offset) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const segments = Math.ceil(distance / 10); // One segment every 10 pixels

    // Draw dashed line with motion
    for (let i = 0; i < segments; i++) {
      const segmentOffset = (i / segments + offset) % 1;
      if (segmentOffset < 0.5) {
        // Only draw half the segments for dashed effect
        const startProgress = i / segments;
        const endProgress = (i + 0.5) / segments;

        const startX = x1 + dx * startProgress;
        const startY = y1 + dy * startProgress;
        const endX = x1 + dx * endProgress;
        const endY = y1 + dy * endProgress;

        graphics.beginPath();
        graphics.moveTo(startX, startY);
        graphics.lineTo(endX, endY);
        graphics.strokePath();
      }
    }
  }

  // Create digital-looking particles that float along the path
  createDigitalParticles(startPoint, endPoint) {
    // Use existing packet image or create text-based particles
    let particleTexture;

    try {
      // Check if we can use the packet image
      particleTexture = "packet";

      // Create particle emitter
      const particles = this.scene.add.particles(0, 0, particleTexture, {
        x: startPoint.x,
        y: startPoint.y,
        quantity: 1,
        frequency: 300,
        lifespan: 2000,
        scale: { start: 0.03, end: 0.01 },
        speed: { min: 50, max: 100 },
        emitting: true,
        emitZone: {
          type: "edge",
          source: new Phaser.Geom.Line(
            startPoint.x,
            startPoint.y,
            endPoint.x,
            endPoint.y
          ),
          quantity: 24,
          yoyo: false,
        },
        blendMode: "ADD",
        tint: 0x00ffff,
      });

      this.firewallContainer.add(particles);
    } catch (e) {
      console.log("Using alternate particle approach:", e);

      // Create binary code-like text particles
      const binaryChars = ["0", "1"];

      // Create several binary text particles
      for (let i = 0; i < 10; i++) {
        // Create random binary digit
        const char =
          binaryChars[Math.floor(Math.random() * binaryChars.length)];
        const textParticle = this.scene.add
          .text(startPoint.x, startPoint.y, char, {
            fontFamily: "monospace",
            fontSize: "14px",
            color: "#00ffff",
          })
          .setOrigin(0.5);

        this.firewallContainer.add(textParticle);

        // Animate along path with random variation
        const duration = 1500 + Math.random() * 1000;
        const delay = Math.random() * 2000;

        this.scene.tweens.add({
          targets: textParticle,
          x: endPoint.x,
          y: endPoint.y,
          alpha: { start: 1, end: 0 },
          delay: delay,
          duration: duration,
          ease: "Linear",
          onComplete: () => {
            // Reset position and repeat
            textParticle.setPosition(startPoint.x, startPoint.y);
            textParticle.setAlpha(1);

            this.scene.tweens.add({
              targets: textParticle,
              x: endPoint.x,
              y: endPoint.y,
              alpha: { start: 1, end: 0 },
              duration: duration,
              ease: "Linear",
              loop: -1,
            });
          },
        });
      }
    }
  }

  // Create scanning beam effect
  createScanningBeam(startPoint, endPoint) {
    // Calculate perpendicular direction to the path
    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;
    const length = Math.sqrt(dx * dx + dy * dy);

    // Normalize and rotate 90 degrees for perpendicular
    const perpX = -dy / length;
    const perpY = dx / length;

    // Create the scanning beam graphics
    const scanBeam = this.scene.add.graphics();
    this.firewallContainer.add(scanBeam);

    // Create scanning animation
    const scanAnimation = this.scene.time.addEvent({
      delay: 50,
      callback: () => {
        if (!this.isAttacking) return;

        scanBeam.clear();

        // Calculate current scan position based on time
        const time = this.scene.time.now / 1000;
        const scanProgress = (Math.sin(time * 2) + 1) / 2; // 0 to 1, oscillating

        const scanX = startPoint.x + dx * scanProgress;
        const scanY = startPoint.y + dy * scanProgress;

        // Draw vertical scan line
        scanBeam.lineStyle(3, 0x00ffff, 0.7);

        // Length of scan line
        const scanLength = 80;

        scanBeam.beginPath();
        scanBeam.moveTo(scanX + perpX * scanLength, scanY + perpY * scanLength);
        scanBeam.lineTo(scanX - perpX * scanLength, scanY - perpY * scanLength);
        scanBeam.strokePath();

        // Add glow effect at scan point
        scanBeam.fillStyle(0x00ffff, 0.3);
        scanBeam.fillCircle(scanX, scanY, 15);
      },
      callbackScope: this,
      loop: true,
    });

    // Add to cleanup
    this.attackElements.push({
      destroy: () => {
        scanAnimation.remove();
      },
    });
  }

  completeAttackResolution(messageCorrupted) {
    // Ensure ALL attack-related elements are destroyed

    // Clean up animation timer
    if (this.attackAnimationTimer) {
      this.attackAnimationTimer.remove();
      this.attackAnimationTimer = null;
    }

    // Clean up attacker tween specifically
    if (this.attackerTween) {
      this.attackerTween.stop();
      this.attackerTween = null;
    }

    // Specifically destroy the attacker avatar
    if (this.attackerAvatar) {
      this.scene.tweens.killTweensOf(this.attackerAvatar);
      this.attackerAvatar.destroy();
      this.attackerAvatar = null;
    }

    // Specifically destroy attack graphics
    if (this.attackGraphics) {
      this.attackGraphics.clear();
      this.attackGraphics.destroy();
      this.attackGraphics = null;
    }

    // Clean up any remaining animations and graphics
    this.attackElements.forEach((element) => {
      if (element && element.destroy) {
        this.scene.tweens.killTweensOf(element);
        element.destroy();
      }
    });
    this.attackElements = [];

    // Double-check for any remaining containers or graphics
    if (this.attackContainer) {
      this.attackContainer.destroy();
      this.attackContainer = null;
    }

    // Clear any attack-related tweens
    this.scene.tweens.killTweensOf(this);

    // Reset the attack state completely
    this.isAttacking = false;

    // Call the original callback with corruption status
    if (this.onAttackResolved) {
      this.onAttackResolved(messageCorrupted);
      this.onAttackResolved = null;
    }
  }

  // Method to corrupt the message if attack succeeds
  corruptMessage(message) {
    if (!message) return message;

    // Apply random corruptions to the message
    const words = message.split(" ");
    const corruptedWords = words.map((word) => {
      if (Math.random() < 0.3) {
        // 30% chance to corrupt each word
        if (word.length > 2) {
          // Scramble middle letters
          const middleIndex = Math.floor(word.length / 2);
          return (
            word.slice(0, middleIndex - 1) +
            word[middleIndex] +
            word[middleIndex - 1] +
            word.slice(middleIndex + 1)
          );
        } else {
          // For short words, just reverse
          return word.split("").reverse().join("");
        }
      }
      return word;
    });

    return corruptedWords.join(" ");
  }
}

window.ManInTheMiddleAttack = ManInTheMiddleAttack;
