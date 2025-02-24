class NetworkPathManager {
  constructor(scene, nodesGroup) {
    this.scene = scene;
    this.nodes = nodesGroup.getChildren(); // Use pre-existing nodes from the group
    this.currentPath = []; // Selected path for message
    this.maxNodes = nodesGroup.getChildren().length;
    this.isValid = false;
    this.menuActive = false;
    this.correctIP = "192.168.1.1"; // Example correct IP (can be dynamically set)
    this.timeManager = this.scene.timeManager;
    
    // Sound effects for IP configuration
    this.configSuccessSound = this.scene.sound.add("clickSound", { volume: 0.5 });
    this.configErrorSound = this.scene.sound.add("clickSound", { volume: 0.3 });
  }

  initializeNetworkTopology() {
    let firstInteraction = true;

    this.nodes.forEach((node) => {
      node.setInteractive();
      node.on("pointerdown", () => {
        // Start timer on first interaction only
        if (firstInteraction && this.timeManager) {
          this.timeManager.startTimer();
          firstInteraction = false;
        }
        this.openIPPopup(node);
      });
      
      // Add hover effect for better user feedback
      node.on("pointerover", () => {
        node.setTint(0x00ffff); // Cyan tint on hover
        
        // Show IP configuration prompt
        if (!this.menuActive && !this.currentPath.includes(node)) {
          this.createHoverPrompt(node, "Configure IP");
        }
      });
      
      node.on("pointerout", () => {
        if (!this.currentPath.includes(node)) {
          node.clearTint();
        }
        if (this.hoverPrompt) {
          this.hoverPrompt.destroy();
          this.hoverPrompt = null;
        }
      });
    });
  }
  
  createHoverPrompt(node, text) {
    // Remove any existing prompt
    if (this.hoverPrompt) {
      this.hoverPrompt.destroy();
    }
    
    // Create a small background for the text
    const promptBg = this.scene.add.rectangle(
      node.x,
      node.y - 40,
      text.length * 8 + 20,
      30,
      0x000000,
      0.7
    ).setOrigin(0.5);
    
    // Add text
    const promptText = this.scene.add.text(
      node.x,
      node.y - 40,
      text,
      {
        fontSize: "14px",
        fontFamily: "Courier New",
        fill: "#00ff00"
      }
    ).setOrigin(0.5);
    
    // Create a container for easy management
    this.hoverPrompt = this.scene.add.container(0, 0, [promptBg, promptText]);
    this.hoverPrompt.setDepth(100);
  }

  validatePath() {
    // Simple path validation logic
    const hasSwitch = this.currentPath.some((node) => node.type === "switch");

    if (hasSwitch) {
      // Path is valid, allow message transmission
      this.highlightValidPath();
      
      // Celebrate valid path with particles
      this.createSuccessParticles();
    } else {
      console.log("Resetting Path");
      // Invalid path, reset
      this.resetPath();
    }
  }

  createSuccessParticles() {
    // Create success particles along the path
    this.currentPath.forEach((node) => {
      try {
        const particles = this.scene.add.particles(node.x, node.y, 'packet', {
          speed: { min: 50, max: 150 },
          angle: { min: 0, max: 360 },
          scale: { start: 0.05, end: 0 },
          lifespan: 800,
          blendMode: 'ADD',
          frequency: -1,
          quantity: 15
        });
        
        // Auto-destroy after animation completes
        this.scene.time.delayedCall(800, () => {
          particles.destroy();
        });
      } catch (e) {
        console.error("Error creating particles:", e);
      }
    });
  }

  highlightValidPath() {
    this.isValid = true;
    
    // Create connection lines container
    this.connectionLines = [];
    
    // Draw lines between nodes with animation
    this.currentPath.forEach((node, index) => {
      if (index < this.currentPath.length - 1) {
        const nextNode = this.currentPath[index + 1];
        
        // Create the connection line
        const line = this.scene.add
          .line(
            0,
            0,
            node.x,
            node.y,
            nextNode.x,
            nextNode.y,
            0x00ff00 // Green connection line
          )
          .setOrigin(0, 0)
          .setLineWidth(2)
          .setAlpha(0);
        
        this.connectionLines.push(line);
        
        // Animate line appearance
        this.scene.tweens.add({
          targets: line,
          alpha: 1,
          duration: 500,
          ease: 'Power2',
          delay: index * 200
        });
      }
    });
    
    // Add data flow animation
    this.scene.time.delayedCall(500, () => {
      this.startDataFlowAnimation();
    });
  }
  
  startDataFlowAnimation() {
    if (!this.isValid) return;
    
    // Create data packet that travels along the path
    for (let i = 0; i < this.currentPath.length - 1; i++) {
      const startNode = this.currentPath[i];
      const endNode = this.currentPath[i + 1];
      
      try {
        // Create data packet
        const packet = this.scene.add.circle(
          startNode.x, 
          startNode.y, 
          4, 
          0x00ff00, 
          1
        ).setAlpha(0.8);
        
        // Animate packet along the path
        this.scene.tweens.add({
          targets: packet,
          x: endNode.x,
          y: endNode.y,
          duration: 1000,
          delay: i * 1200,
          ease: 'Sine.easeInOut',
          onComplete: () => {
            // Flash effect when packet reaches destination
            this.scene.tweens.add({
              targets: packet,
              alpha: 0,
              scale: 2,
              duration: 300,
              onComplete: () => {
                packet.destroy();
              }
            });
          }
        });
      } catch (e) {
        console.error("Error in data flow animation:", e);
      }
    }
  }

  isPathValid() {
    return this.isValid;
  }

  resetPath() {
    // Clear node highlights and path
    this.currentPath.forEach((node) => node.highlight(false));
    this.currentPath = [];
    
    // Clear any connection lines
    if (this.connectionLines) {
      this.connectionLines.forEach(line => line.destroy());
      this.connectionLines = [];
    }
    
    this.isValid = false;
  }

  openIPPopup(node) {
    if (!this.menuActive) {
      this.menuActive = true;

      // Create cybersecurity-themed popup container
      this.menuContainer = this.scene.add.container(
        this.scene.scale.width / 2,
        this.scene.scale.height / 2
      ).setDepth(100);

      // Create a terminal-style background
      this.menuBackground = this.scene.add.rectangle(
        0, 0,
        500, 300,
        0x000000, 0.9
      );
      
      // Add terminal-style border
      this.menuBorder = this.scene.add.graphics();
      this.menuBorder.lineStyle(2, 0x00ff00, 1);
      this.menuBorder.strokeRect(-250, -150, 500, 300);
      
      // Add decorative header
      this.terminalHeader = this.scene.add.rectangle(
        0, -120,
        490, 30,
        0x003300, 1
      );
      
      // Terminal window title
      this.terminalTitle = this.scene.add.text(
        0, -120,
        "NETWORK CONFIGURATION TERMINAL",
        {
          fontSize: "18px",
          fontFamily: "Courier New",
          fill: "#00ff00",
          align: "center"
        }
      ).setOrigin(0.5);
      
      // Add node type and address information
      this.nodeInfo = this.scene.add.text(
        0, -80,
        `Configure ${node.type.toUpperCase()} Node [${node.x.toFixed(0)}, ${node.y.toFixed(0)}]`,
        {
          fontSize: "16px",
          fontFamily: "Courier New",
          fill: "#00ffff",
          align: "center"
        }
      ).setOrigin(0.5);

      // Add animated prompt
      this.promptText = this.scene.add.text(
        0, -30,
        "Enter IPv4 address to configure this node:",
        {
          fontSize: "20px",
          fontFamily: "Courier New",
          fill: "#ffffff",
          align: "center"
        }
      ).setOrigin(0.5);
      
      // Blinking cursor animation
      this.scene.tweens.add({
        targets: this.promptText,
        alpha: 0.7,
        duration: 500,
        yoyo: true,
        repeat: -1
      });

      // Create terminal-style input field
      this.inputBox = this.scene.add.rectangle(
        0, 20,
        300, 40,
        0x003300, 1
      );
      this.inputBox.setStrokeStyle(1, 0x00ff00, 1);
      
      this.ipInputField = this.scene.add.text(
        0, 20, 
        ">_",
        {
          fontSize: "24px",
          fontFamily: "Courier New",
          fill: "#00ff00"
        }
      ).setOrigin(0.5);

      // Terminal commands section
      this.commandsText = this.scene.add.text(
        0, 80,
        "[Enter] Submit | [Escape] Cancel | [Backspace] Delete",
        {
          fontSize: "14px",
          fontFamily: "Courier New",
          fill: "#888888",
          align: "center"
        }
      ).setOrigin(0.5);

      // Add all elements to container
      this.menuContainer.add([
        this.menuBackground,
        this.menuBorder,
        this.terminalHeader,
        this.terminalTitle,
        this.nodeInfo,
        this.promptText,
        this.inputBox,
        this.ipInputField,
        this.commandsText
      ]);

      this.userIP = ""; // New IP entry

      // Add typing animation
      this.updateInputText();

      // Remove previous keydown listener if exists
      if (this.keydownListener) {
        this.scene.input.keyboard.off("keydown", this.keydownListener);
      }

      this.keydownListener = (event) => {
        if (this.menuActive) {
          // IP typing logic
          if (event.key === "Backspace") {
            this.userIP = this.userIP.slice(0, -1);
            this.updateInputText();
          } else if (event.key.length === 1 && /[0-9.]|\b/.test(event.key)) {
            // Limit to valid IP format (numbers and dots)
            if (this.userIP.length < 15) { // Prevent overly long input
              this.userIP += event.key;
              this.updateInputText();
              
              // Add typing sound effect
              try {
                this.scene.sound.play("clickSound", { volume: 0.1 });
              } catch (e) {
                console.log("Sound not available");
              }
            }
          } else if (event.key === "Enter") {
            this.checkIP(node);
          } else if (event.key === "Escape") {
            this.closePopup();
          }
        }
      };

      // Attach the new listener
      this.scene.input.keyboard.on("keydown", this.keydownListener);
      
      // Add an animated blinking cursor
      this.createBlinkingCursor();
    }
  }
  
  updateInputText() {
    this.ipInputField.setText(`>${this.userIP}<`);
  }
  
  createBlinkingCursor() {
    this.cursorVisible = true;
    
    // Blink cursor timer
    this.cursorTimer = this.scene.time.addEvent({
      delay: 530,
      callback: () => {
        this.cursorVisible = !this.cursorVisible;
        this.updateInputText();
      },
      callbackScope: this,
      loop: true
    });
  }

  checkIP(node) {
    if (this.userIP === this.correctIP) {
      // Correct IP entered
      console.log("Correct IP entered!");
      
      // Play success sound
      try {
        this.configSuccessSound.play();
      } catch (e) {
        console.log("Sound not available");
      }
      
      // Show success message before closing popup
      this.showResponseMessage("IP Configuration Successful", "#00ff00", true);
      
      // Update node with success animation
      this.scene.tweens.add({
        targets: node,
        scale: { from: node.scale * 1.2, to: node.scale },
        duration: 500,
        ease: 'Bounce.Out',
        onComplete: () => {
          node.highlight(true);
          this.currentPath.push(node);
          
          // Check if path is complete
          if (this.currentPath.length === this.maxNodes) {
            this.validatePath();
          }
        }
      });
      
      // Close popup with delay for feedback
      this.scene.time.delayedCall(1200, () => {
        this.closePopup();
      });
      
    } else {
      // Incorrect IP entered
      console.log("Incorrect IP! Try again.");
      
      // Play error sound
      try {
        this.configErrorSound.play();
      } catch (e) {
        console.log("Sound not available");
      }
      
      // Show error message with server response
      this.showResponseMessage("Invalid IP Configuration - Access Denied", "#ff0000", false);
      
      // Create screen shake effect
      this.scene.cameras.main.shake(200, 0.005);
      
      // Reset input after a brief delay
      this.scene.time.delayedCall(1500, () => {
        this.userIP = "";
        this.updateInputText();
        
        // Remove the error message
        if (this.responseMessage) {
          this.responseMessage.destroy();
          this.responseMessage = null;
        }
      });

      // Add time penalty for incorrect IP
      if (this.timeManager) {
        this.timeManager.addPenalty(5); // 5-second penalty
      }
    }
  }
  
  showResponseMessage(message, color, isSuccess) {
    // Remove any existing message
    if (this.responseMessage) {
      this.responseMessage.destroy();
    }
    
    // Create response background
    const responseBg = this.scene.add.rectangle(
      0, 130,
      450, 36,
      isSuccess ? 0x003300 : 0x330000,
      0.9
    );
    
    // Create response text
    const responseText = this.scene.add.text(
      0, 130,
      message,
      {
        fontSize: "16px",
        fontFamily: "Courier New",
        fill: color,
        align: "center"
      }
    ).setOrigin(0.5);
    
    // Add to container
    this.responseMessage = this.scene.add.container(0, 0, [responseBg, responseText]);
    this.menuContainer.add(this.responseMessage);
    
    // Add blinking effect for success or error indicator
    if (isSuccess) {
      this.scene.tweens.add({
        targets: responseBg,
        alpha: { from: 0.9, to: 0.5 },
        duration: 300,
        yoyo: true,
        repeat: 2
      });
    } else {
      this.scene.tweens.add({
        targets: [responseBg, responseText],
        alpha: { from: 1, to: 0.7 },
        duration: 100,
        yoyo: true,
        repeat: 3
      });
    }
  }

  closePopup() {
    if (!this.menuActive) return;
    
    this.menuActive = false;
    
    // Cancel cursor blinking
    if (this.cursorTimer) {
      this.cursorTimer.remove();
    }
    
    // Animate container closing
    this.scene.tweens.add({
      targets: this.menuContainer,
      alpha: 0,
      scaleX: 0.9,
      scaleY: 0.9,
      duration: 200,
      onComplete: () => {
        // Clean up all menu elements
        this.menuContainer.destroy();
        this.menuContainer = null;
        
        // Remove keyboard listener
        if (this.keydownListener) {
          this.scene.input.keyboard.off("keydown", this.keydownListener);
        }
      }
    });
  }
}

window.NetworkPathManager = NetworkPathManager;