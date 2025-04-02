class NetworkPathManager {
  constructor(scene, nodesGroup) {
    this.scene = scene;
    this.nodes = nodesGroup.getChildren(); // Use pre-existing nodes from the group
    this.currentPath = []; // Selected path for message
    this.maxNodes = nodesGroup.getChildren().length;
    this.isValid = false;
    this.menuActive = false;

    // Default IP configurations
    this.correctIPs = {
      switch1: "192.168.1.2",
      switch2: "192.168.2.2",
      router: "192.168.1.1", // Router's primary interface
    };

    // Track device types and configurations
    this.deviceConfigs = {
      switch1: { configured: false, type: "switch" },
      switch2: { configured: false, type: "switch" },
      router: { configured: false, type: "router" },
    };

    this.timeManager = this.scene.timeManager;

    // Sound effects for IP configuration
    this.configSuccessSound = this.scene.sound.add("clickSound", {
      volume: 0.5,
    });
    this.configErrorSound = this.scene.sound.add("clickSound", { volume: 0.3 });

    // Debug
    console.log("NetworkPathManager initialized");
    console.log("Number of nodes:", this.nodes.length);
  }

  initializeNetworkTopology() {
    let firstInteraction = true;

    // Identify and assign device types based on actual scene objects
    // This ensures device types align with the visual layout
    if (this.scene.leftSwitch && this.scene.rightSwitch && this.scene.router) {
      // Manually map the devices based on their visual positions in the scene
      this.deviceMapping = {
        router: this.scene.router,
        switch1: this.scene.leftSwitch,
        switch2: this.scene.rightSwitch,
      };

      // Set deviceType properties directly on the objects
      this.scene.router.deviceType = "router";
      this.scene.leftSwitch.deviceType = "switch1";
      this.scene.rightSwitch.deviceType = "switch2";

      console.log(
        "Device types assigned:",
        this.scene.router.deviceType,
        this.scene.leftSwitch.deviceType,
        this.scene.rightSwitch.deviceType
      );
    } else {
      console.error("Required network devices not found in scene");
    }

    this.nodes.forEach((node) => {
      node.setInteractive();
      node.on("pointerdown", () => {
        // Check if this node is already configured
        const deviceType = node.deviceType || node.type;
        if (this.deviceConfigs[deviceType]?.configured) {
          console.log("Device already configured:", deviceType);
          return; // Skip opening the popup for configured devices
        }

        // Start timer on first interaction only
        if (firstInteraction && this.timeManager) {
          this.timeManager.startTimer();
          firstInteraction = false;
        }

        console.log("Node clicked:", node.deviceType || node.type);
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

    console.log("Network topology initialized");
  }

  createHoverPrompt(node, text) {
    // Remove any existing prompt
    if (this.hoverPrompt) {
      this.hoverPrompt.destroy();
    }

    // Create a small background for the text
    const promptBg = this.scene.add
      .rectangle(node.x, node.y - 40, text.length * 8 + 20, 30, 0x000000, 0.7)
      .setOrigin(0.5);

    // Add text
    const promptText = this.scene.add
      .text(node.x, node.y - 40, text, {
        fontSize: "14px",
        fontFamily: "Courier New",
        fill: "#00ff00",
      })
      .setOrigin(0.5);

    // Create a container for easy management
    this.hoverPrompt = this.scene.add.container(0, 0, [promptBg, promptText]);
    this.hoverPrompt.setDepth(100);
  }

  validatePath() {
    console.log("Validating path...");
    console.log(
      "Current path:",
      this.currentPath.map((node) => node.deviceType)
    );
    console.log("Device configs:", this.deviceConfigs);

    // Count how many devices of each type are configured
    const configuredDevices = {
      switch1: 0,
      switch2: 0,
      router: 0,
    };

    // Check each device in the path
    this.currentPath.forEach((node) => {
      const deviceType = node.deviceType;
      if (deviceType && this.deviceConfigs[deviceType]?.configured) {
        configuredDevices[deviceType]++;
      }
    });

    console.log("Configured devices count:", configuredDevices);

    // Strict validation - require both switches AND router to be configured
    const hasRouter = configuredDevices.router > 0;
    const hasBothSwitches =
      configuredDevices.switch1 > 0 && configuredDevices.switch2 > 0;

    if (hasRouter && hasBothSwitches) {
      console.log("Path is valid! Router and both switches configured.");
      this.highlightValidPath();
      this.createSuccessParticles();

      // Emit network complete event for scoring
      this.scene.events.emit("networkComplete");

      return true;
    } else {
      // Show which devices still need configuration
      const missingDevices = [];
      if (!hasRouter) missingDevices.push("Router");
      if (configuredDevices.switch1 === 0) missingDevices.push("Switch 1");
      if (configuredDevices.switch2 === 0) missingDevices.push("Switch 2");

      console.log(
        "Path is invalid. Still need to configure:",
        missingDevices.join(", ")
      );
      this.resetPath();

      // If some devices are configured but not all, show a hint message
      if (this.currentPath.length > 0 && !this.hintShown) {
        this.showConfigurationHint(missingDevices);
        this.hintShown = true; // Only show once per session
      }

      return false;
    }
  }

  showConfigurationHint(missingDevices) {
    // Create a hint message to guide the player
    const hintText = this.scene.add
      .text(
        this.scene.scale.width / 2,
        100,
        `Network incomplete! Configure: ${missingDevices.join(", ")}`,
        {
          fontSize: "18px",
          fill: "#ffff00",
          backgroundColor: "#333300",
          padding: { x: 10, y: 5 },
        }
      )
      .setOrigin(0.5)
      .setDepth(100);

    // Animate and fade out
    this.scene.tweens.add({
      targets: hintText,
      y: 120,
      alpha: { from: 1, to: 0 },
      duration: 4000,
      ease: "Power2",
      onComplete: () => {
        hintText.destroy();
      },
    });
  }

  createSuccessParticles() {
    // Create success particles along the path
    this.currentPath.forEach((node) => {
      try {
        const particles = this.scene.add.particles(node.x, node.y, "packet", {
          speed: { min: 50, max: 150 },
          angle: { min: 0, max: 360 },
          scale: { start: 0.05, end: 0 },
          lifespan: 800,
          blendMode: "ADD",
          frequency: -1,
          quantity: 15,
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
    console.log("Highlighting valid path");

    // Create connection lines container
    this.connectionLines = [];

    // Sort the path to ensure devices appear in logical order: switch1 -> router -> switch2
    const sortedPath = [];

    // Find each device and add in order
    const switch1 = this.currentPath.find(
      (node) => node.deviceType === "switch1"
    );
    const router = this.currentPath.find(
      (node) => node.deviceType === "router"
    );
    const switch2 = this.currentPath.find(
      (node) => node.deviceType === "switch2"
    );

    if (switch1) sortedPath.push(switch1);
    if (router) sortedPath.push(router);
    if (switch2) sortedPath.push(switch2);

    // For any devices that might be missing, add from original path
    this.currentPath.forEach((node) => {
      if (!sortedPath.includes(node)) {
        sortedPath.push(node);
      }
    });

    console.log(
      "Sorted path:",
      sortedPath.map((node) => node.deviceType)
    );

    // Draw connections between consecutive devices
    for (let i = 0; i < sortedPath.length - 1; i++) {
      const node = sortedPath[i];
      const nextNode = sortedPath[i + 1];

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
        ease: "Power2",
        delay: i * 200,
      });
    }

    // Add data flow animation
    this.scene.time.delayedCall(500, () => {
      this.startDataFlowAnimation(sortedPath);
    });
  }

  startDataFlowAnimation(pathNodes) {
    if (!this.isValid) return;

    pathNodes = pathNodes || this.currentPath;

    // Create data packet that travels along the path
    for (let i = 0; i < pathNodes.length - 1; i++) {
      const startNode = pathNodes[i];
      const endNode = pathNodes[i + 1];

      try {
        // Create data packet
        const packet = this.scene.add
          .circle(startNode.x, startNode.y, 4, 0x00ff00, 1)
          .setAlpha(0.8);

        // Animate packet along the path
        this.scene.tweens.add({
          targets: packet,
          x: endNode.x,
          y: endNode.y,
          duration: 1000,
          delay: i * 1200,
          ease: "Sine.easeInOut",
          onComplete: () => {
            // Flash effect when packet reaches destination
            this.scene.tweens.add({
              targets: packet,
              alpha: 0,
              scale: 2,
              duration: 300,
              onComplete: () => {
                packet.destroy();
              },
            });
          },
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
    console.log("Resetting path");

    // Clear node highlights but preserve configuration status
    this.currentPath.forEach((node) => {
      if (node.highlightEffect) {
        node.highlightEffect.destroy();
        node.highlightEffect = null;
      }
    });

    // We don't clear the currentPath completely to keep track of configured devices
    // but we'll mark the path as invalid

    // Clear any connection lines
    if (this.connectionLines) {
      this.connectionLines.forEach((line) => line.destroy());
      this.connectionLines = [];
    }

    this.isValid = false;
  }

  openIPPopup(node) {
    if (!this.menuActive) {
      this.menuActive = true;

      // Determine the device type based on the node's deviceType property
      const deviceType = node.deviceType || node.type;
      console.log("Opening IP popup for device type:", deviceType);

      // Create cybersecurity-themed popup container
      this.menuContainer = this.scene.add
        .container(this.scene.scale.width / 2, this.scene.scale.height / 2)
        .setDepth(100);

      // Create a terminal-style background
      this.menuBackground = this.scene.add.rectangle(
        0,
        0,
        500,
        320,
        0x000000,
        0.9
      );

      // Add terminal-style border
      this.menuBorder = this.scene.add.graphics();
      this.menuBorder.lineStyle(2, 0x00ff00, 1);
      this.menuBorder.strokeRect(-250, -160, 500, 320);

      // Add decorative header
      this.terminalHeader = this.scene.add.rectangle(
        0,
        -130,
        490,
        30,
        0x003300,
        1
      );

      // Terminal window title
      this.terminalTitle = this.scene.add
        .text(0, -130, "NETWORK CONFIGURATION TERMINAL", {
          fontSize: "18px",
          fontFamily: "Courier New",
          fill: "#00ff00",
          align: "center",
        })
        .setOrigin(0.5);

      // Determine device-specific text and suggestions
      let deviceTitle = "Network Device";
      let suggestedIP = "";

      // Use the deviceType property directly from the node
      if (deviceType === "switch1") {
        deviceTitle = "SWITCH 1";
        suggestedIP = this.correctIPs.switch1;
      } else if (deviceType === "switch2") {
        deviceTitle = "SWITCH 2";
        suggestedIP = this.correctIPs.switch2;
      } else if (deviceType === "router") {
        deviceTitle = "ROUTER";
        suggestedIP = this.correctIPs.router;
      } else if (deviceType === "switch") {
        // Fallback logic for generic "switch" type
        if (!this.deviceConfigs.switch1.configured) {
          deviceTitle = "SWITCH 1";
          suggestedIP = this.correctIPs.switch1;
          node.deviceType = "switch1"; // Assign specific type
        } else {
          deviceTitle = "SWITCH 2";
          suggestedIP = this.correctIPs.switch2;
          node.deviceType = "switch2"; // Assign specific type
        }
      }

      // Store the current device type for use in checkIP
      this.currentDeviceType = node.deviceType || deviceType;

      console.log("Current device type for IP config:", this.currentDeviceType);
      console.log("Suggested IP:", suggestedIP);

      // Add node type and address information
      this.nodeInfo = this.scene.add
        .text(
          0,
          -80,
          `Configure ${deviceTitle} [${node.x.toFixed(0)}, ${node.y.toFixed(
            0
          )}]`,
          {
            fontSize: "16px",
            fontFamily: "Courier New",
            fill: "#00ffff",
            align: "center",
          }
        )
        .setOrigin(0.5);

      // Add suggested IP hint
      this.ipHint = this.scene.add
        .text(0, -50, `Suggested IP: ${suggestedIP}`, {
          fontSize: "14px",
          fontFamily: "Courier New",
          fill: "#888888",
          align: "center",
        })
        .setOrigin(0.5);

      // Add animated prompt
      this.promptText = this.scene.add
        .text(0, -20, "Enter IPv4 address to configure this device:", {
          fontSize: "18px",
          fontFamily: "Courier New",
          fill: "#ffffff",
          align: "center",
        })
        .setOrigin(0.5);

      // Blinking cursor animation
      this.scene.tweens.add({
        targets: this.promptText,
        alpha: 0.7,
        duration: 500,
        yoyo: true,
        repeat: -1,
      });

      // ===== MOBILE KEYBOARD SUPPORT =====
      // Create an actual HTML input element for mobile devices
      this.isMobile = this.detectMobile();
      if (this.isMobile) {
        // Create invisible HTML input for mobile devices
        this.mobileInput = document.createElement("input");
        this.mobileInput.type = "text";
        this.mobileInput.inputMode = "numeric"; // Suggest numeric keyboard
        this.mobileInput.style.position = "fixed";
        this.mobileInput.style.opacity = "0.01"; // Nearly invisible but focusable
        this.mobileInput.style.pointerEvents = "none"; // Prevent interaction with the element directly
        this.mobileInput.style.left = "50%";
        this.mobileInput.style.top = "50%";
        this.mobileInput.style.transform = "translate(-50%, -50%)";
        this.mobileInput.style.width = "100px";
        this.mobileInput.style.height = "30px";
        this.mobileInput.style.zIndex = "1000";

        // Add input to document
        document.body.appendChild(this.mobileInput);

        // Focus the input to trigger keyboard
        setTimeout(() => this.mobileInput.focus(), 100);

        // Update game state when input changes
        this.mobileInput.addEventListener("input", (e) => {
          // Filter input to only allow numbers and dots
          let filteredValue = e.target.value.replace(/[^0-9.]/g, "");
          // Limit length
          if (filteredValue.length > 15) {
            filteredValue = filteredValue.substring(0, 15);
            e.target.value = filteredValue;
          }
          this.userIP = filteredValue;
          this.updateInputText();
        });

        // Handle submission/cancellation
        this.mobileInput.addEventListener("keyup", (e) => {
          if (e.key === "Enter") {
            this.checkIP(node);
          }
        });
      }

      // Create terminal-style input field (visual representation)
      this.inputBox = this.scene.add.rectangle(0, 20, 300, 40, 0x003300, 1);
      this.inputBox.setStrokeStyle(1, 0x00ff00, 1);

      this.ipInputField = this.scene.add
        .text(0, 20, ">_", {
          fontSize: "24px",
          fontFamily: "Courier New",
          fill: "#00ff00",
        })
        .setOrigin(0.5);

      // Make input field interactive on mobile
      if (this.isMobile) {
        this.inputBox.setInteractive().on("pointerdown", () => {
          // Refocus the input when user clicks on the visual input field
          this.mobileInput.focus();
        });
      }

      // Terminal commands section
      const commandsTextContent = this.isMobile
        ? "[Input] Type | [Enter] Submit | [Back] Cancel"
        : "[Enter] Submit | [Escape] Cancel | [Backspace] Delete";

      this.commandsText = this.scene.add
        .text(0, 80, commandsTextContent, {
          fontSize: "14px",
          fontFamily: "Courier New",
          fill: "#888888",
          align: "center",
        })
        .setOrigin(0.5);

      // Add virtual buttons for mobile
      if (this.isMobile) {
        this.createVirtualButtons(node);
      }

      // Add all elements to container
      this.menuContainer.add([
        this.menuBackground,
        this.menuBorder,
        this.terminalHeader,
        this.terminalTitle,
        this.nodeInfo,
        this.ipHint,
        this.promptText,
        this.inputBox,
        this.ipInputField,
        this.commandsText,
      ]);

      this.userIP = ""; // New IP entry

      // Add typing animation
      this.updateInputText();

      // For desktop: handle keyboard input
      if (!this.isMobile) {
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
              if (this.userIP.length < 15) {
                // Prevent overly long input
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
      }

      // Add an animated blinking cursor
      this.createBlinkingCursor();
    }
  }

  // Helper method to detect mobile devices
  detectMobile() {
    return (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) ||
      (window.innerWidth <= 800 && window.innerHeight <= 900)
    );
  }

  // Create virtual buttons for mobile devices
  createVirtualButtons(node) {
    const buttonY = 130;
    const buttonWidth = 120;
    const buttonHeight = 40;
    const spacing = 150;

    // Submit button
    const submitButton = this.scene.add
      .rectangle(-spacing / 2, buttonY, buttonWidth, buttonHeight, 0x005500, 1)
      .setStrokeStyle(2, 0x00ff00, 1);

    const submitText = this.scene.add
      .text(-spacing / 2, buttonY, "SUBMIT", {
        fontSize: "18px",
        fill: "#00ff00",
      })
      .setOrigin(0.5);

    submitButton.setInteractive().on("pointerdown", () => {
      this.checkIP(node);
    });

    // Cancel button
    const cancelButton = this.scene.add
      .rectangle(spacing / 2, buttonY, buttonWidth, buttonHeight, 0x550000, 1)
      .setStrokeStyle(2, 0xff0000, 1);

    const cancelText = this.scene.add
      .text(spacing / 2, buttonY, "CANCEL", {
        fontSize: "18px",
        fill: "#ff0000",
      })
      .setOrigin(0.5);

    cancelButton.setInteractive().on("pointerdown", () => {
      this.closePopup();
    });

    // Add buttons to container
    this.menuContainer.add([
      submitButton,
      submitText,
      cancelButton,
      cancelText,
    ]);

    // Add hover/touch effects
    [submitButton, cancelButton].forEach((button) => {
      button.on("pointerover", function () {
        this.setScale(1.05);
      });
      button.on("pointerout", function () {
        this.setScale(1);
      });
    });
  }

  // Modified to handle mobile input cleanup
  closePopup() {
    if (!this.menuActive) return;

    this.menuActive = false;

    // Clean up mobile input if it exists
    if (this.mobileInput) {
      document.body.removeChild(this.mobileInput);
      this.mobileInput = null;
    }

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
      },
    });
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
      loop: true,
    });
  }

  checkIP(node) {
    console.log("Checking IP for device type:", this.currentDeviceType);
    const correctIP = this.getCorrectIPForDevice(this.currentDeviceType);
    console.log("Correct IP:", correctIP, "User IP:", this.userIP);

    if (this.userIP === correctIP) {
      // Correct IP entered
      console.log("Correct IP entered for", this.currentDeviceType);

      // Update device configuration
      this.updateDeviceConfig(this.currentDeviceType, node);

      // Play success sound
      try {
        this.configSuccessSound.play();
      } catch (e) {
        console.log("Sound not available");
      }

      // Emit device configured event for scoring
      this.scene.events.emit("deviceConfigured", this.currentDeviceType);

      // Show success message before closing popup
      this.showResponseMessage("IP Configuration Successful", "#00ff00", true);

      // Update node with success animation
      this.scene.tweens.add({
        targets: node,
        scale: { from: node.scale * 1.2, to: node.scale },
        duration: 500,
        ease: "Bounce.Out",
        onComplete: () => {
          node.setTint(0x00ff00); // Green tint to show configured

          // Add to current path if not already included
          if (!this.currentPath.includes(node)) {
            this.currentPath.push(node);
          }

          // Check if path is complete after configuration
          this.validatePath();
        },
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
      this.showResponseMessage(
        "Invalid IP Configuration - Access Denied",
        "#ff0000",
        false
      );

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

  getCorrectIPForDevice(deviceType) {
    // Return the correct IP based on device type
    switch (deviceType) {
      case "switch1":
        return this.correctIPs.switch1;
      case "switch2":
        return this.correctIPs.switch2;
      case "router":
        return this.correctIPs.router;
      default:
        console.warn("Unknown device type:", deviceType);
        return this.correctIPs.switch1; // Default fallback
    }
  }

  updateDeviceConfig(deviceType, node) {
    // Update the device configuration status
    console.log("Updating device config for:", deviceType);

    if (this.deviceConfigs[deviceType]) {
      this.deviceConfigs[deviceType].configured = true;

      // Set the device type on the node for future reference
      node.deviceType = deviceType;

      console.log("Device configurations updated:", this.deviceConfigs);
    } else {
      console.error("Invalid device type for configuration:", deviceType);
    }
  }

  showResponseMessage(message, color, isSuccess) {
    // Remove any existing message
    if (this.responseMessage) {
      this.responseMessage.destroy();
    }

    // Create response background
    const responseBg = this.scene.add.rectangle(
      0,
      130,
      450,
      36,
      isSuccess ? 0x003300 : 0x330000,
      0.9
    );

    // Create response text
    const responseText = this.scene.add
      .text(0, 130, message, {
        fontSize: "16px",
        fontFamily: "Courier New",
        fill: color,
        align: "center",
      })
      .setOrigin(0.5);

    // Add to container
    this.responseMessage = this.scene.add.container(0, 0, [
      responseBg,
      responseText,
    ]);
    this.menuContainer.add(this.responseMessage);

    // Add blinking effect for success or error indicator
    if (isSuccess) {
      this.scene.tweens.add({
        targets: responseBg,
        alpha: { from: 0.9, to: 0.5 },
        duration: 300,
        yoyo: true,
        repeat: 2,
      });
    } else {
      this.scene.tweens.add({
        targets: [responseBg, responseText],
        alpha: { from: 1, to: 0.7 },
        duration: 100,
        yoyo: true,
        repeat: 3,
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
      },
    });
  }
}

window.NetworkPathManager = NetworkPathManager;
