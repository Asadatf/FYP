// PortScanMiniGame.js - Mini game for the port scan threat
class PortScanMiniGame extends Phaser.Scene {
  constructor() {
    super("PortScanMiniGame");
    this.devices = [];
    this.timeLeft = 30; // 30 seconds time limit
    this.score = 0;
    this.totalOpenPorts = 0;
    this.foundOpenPorts = 0;
    this.threatType = "portScan";
  }

  init(data) {
    // Receive data from the main game
    this.mainScene = data.mainScene;
    this.row = data.row;
    this.col = data.col;
    this.score = data.score || 0;
    this.returnCallback = data.callback;
  }

  create() {
    const { width, height } = this.cameras.main;

    // Create background
    this.createBackground();

    // Game title
    this.add
      .text(width / 2, 30, "PORT SCANNER CHALLENGE", {
        font: "bold 28px Arial",
        fill: "#00aaff",
        stroke: "#000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    // Instructions
    this.add
      .text(
        width / 2,
        80,
        "Find all the open ports on the network devices before time runs out!\nClick on devices to scan them.",
        {
          font: "16px Arial",
          fill: "#ffffff",
          align: "center",
        }
      )
      .setOrigin(0.5);

    // Create timer display
    this.timerText = this.add
      .text(width / 2, 120, `Time: ${this.timeLeft}s`, {
        font: "bold 20px Arial",
        fill: "#ffdd00",
      })
      .setOrigin(0.5);

    // Create score display
    this.scoreText = this.add
      .text(width - 120, 30, `Score: ${this.score}`, {
        font: "18px Arial",
        fill: "#00cc66",
      })
      .setOrigin(0.5);

    // Create progress display
    this.progressText = this.add
      .text(120, 30, "Ports: 0/0", {
        font: "18px Arial",
        fill: "#00aaff",
      })
      .setOrigin(0.5);

    // Create network devices
    this.createNetworkDevices();

    // Update progress text
    this.progressText.setText(
      `Ports: ${this.foundOpenPorts}/${this.totalOpenPorts}`
    );

    // Start timer
    this.countdownTimer = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    });

    // Add back button
    const backButton = this.add
      .rectangle(100, height - 40, 150, 40, 0x3d3d3d)
      .setStrokeStyle(1, 0x5d5d5d)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => backButton.setFillStyle(0x4d4d4d))
      .on("pointerout", () => backButton.setFillStyle(0x3d3d3d))
      .on("pointerdown", () => this.returnToMainGame(false));

    this.add
      .text(100, height - 40, "BACK TO GAME", {
        font: "16px Arial",
        fill: "#ffffff",
      })
      .setOrigin(0.5);
  }

  createBackground() {
    const { width, height } = this.cameras.main;

    // Fill background
    this.add.rectangle(0, 0, width, height, 0x001528).setOrigin(0);

    // Create cyber grid effect
    const bgGraphics = this.add.graphics();
    bgGraphics.lineStyle(1, 0x004e92, 0.1);

    // Draw grid effect
    for (let i = 0; i < 20; i++) {
      const y = i * 40;
      bgGraphics.lineBetween(0, y, width, y);
    }

    for (let i = 0; i < 30; i++) {
      const x = i * 40;
      bgGraphics.lineBetween(x, 0, x, height);
    }
  }

  createNetworkDevices() {
    const { width, height } = this.cameras.main;
    const deviceTypes = ["server", "router", "desktop", "cloud"];
    const deviceIcons = ["🖥️", "📡", "💻", "☁️"];

    // Define a grid for the devices
    const cols = 3;
    const rows = 3;
    const cellWidth = 180;
    const cellHeight = 140;
    const startX = (width - cols * cellWidth) / 2 + cellWidth / 2;
    const startY = 180;

    let totalOpenPorts = 0;

    // Create devices in a grid
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = startX + col * cellWidth;
        const y = startY + row * cellHeight;

        // Randomly select device type
        const typeIndex = Math.floor(Math.random() * deviceTypes.length);
        const deviceType = deviceTypes[typeIndex];
        const deviceIcon = deviceIcons[typeIndex];

        // Generate random IP address
        const ip = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(
          Math.random() * 255
        )}`;

        // Create device container
        const deviceContainer = this.add.container(x, y);

        // Device background
        const deviceBg = this.add
          .rectangle(0, 0, cellWidth - 20, cellHeight - 20, 0x002244)
          .setStrokeStyle(2, 0x0066aa);

        // Device icon
        const icon = this.add
          .text(0, -30, deviceIcon, {
            font: "32px Arial",
          })
          .setOrigin(0.5);

        // Device info
        const nameText = this.add
          .text(0, -5, deviceType.toUpperCase(), {
            font: "bold 16px Arial",
            fill: "#00aaff",
          })
          .setOrigin(0.5);

        const ipText = this.add
          .text(0, 20, ip, {
            font: "14px monospace",
            fill: "#ffffff",
          })
          .setOrigin(0.5);

        // Generate ports
        const ports = [20, 21, 22, 23, 25, 53, 80, 110, 143, 443, 3306, 8080];
        const devicePorts = [];

        // Randomly select 3-5 ports for this device
        const numPorts = 3 + Math.floor(Math.random() * 3);
        const shuffledPorts = Phaser.Utils.Array.Shuffle([...ports]);
        const selectedPorts = shuffledPorts.slice(0, numPorts);

        // Decide which ports are open (1-3 open ports per device)
        const numOpenPorts =
          1 + Math.floor(Math.random() * Math.min(2, numPorts));
        const openPorts = [];

        for (let i = 0; i < numPorts; i++) {
          const port = selectedPorts[i];
          const isOpen = i < numOpenPorts;

          if (isOpen) {
            openPorts.push(port);
            totalOpenPorts++;
          }

          devicePorts.push({
            number: port,
            isOpen: isOpen,
            discovered: false,
          });
        }

        // Add port info container (initially hidden)
        const portContainer = this.add.container(0, 40);
        portContainer.setVisible(false);

        // Add the device to our array
        this.devices.push({
          container: deviceContainer,
          portContainer: portContainer,
          bg: deviceBg,
          ports: devicePorts,
          scanned: false,
          openPorts: openPorts,
        });

        // Add all elements to the container
        deviceContainer.add([deviceBg, icon, nameText, ipText]);
        deviceContainer.add(portContainer);

        // Make device interactive
        deviceBg
          .setInteractive({ useHandCursor: true })
          .on("pointerover", () => {
            if (!this.devices[row * cols + col].scanned) {
              deviceBg.setFillStyle(0x003366);
            }
          })
          .on("pointerout", () => {
            if (!this.devices[row * cols + col].scanned) {
              deviceBg.setFillStyle(0x002244);
            }
          })
          .on("pointerdown", () => {
            this.scanDevice(row * cols + col);
          });
      }
    }

    this.totalOpenPorts = totalOpenPorts;
  }

  scanDevice(index) {
    if (this.devices[index].scanned) return;

    const device = this.devices[index];
    device.scanned = true;

    // Play scan animation
    this.tweens.add({
      targets: device.bg,
      fillColor: 0x004488,
      strokeColor: 0x00aaff,
      duration: 300,
      yoyo: true,
      repeat: 2,
      onComplete: () => {
        // Show port scan results
        this.showPortResults(index);
      },
    });

    // Play sound
    this.game.soundManager.play("button-click");
  }

  showPortResults(index) {
    const device = this.devices[index];
    const portSpacing = 25;

    // Clear previous port display
    if (device.portContainer.length > 0) {
      device.portContainer.removeAll(true);
    }

    // Show port results
    device.ports.forEach((port, i) => {
      const yOffset = i * portSpacing;

      // Port background
      const portBg = this.add.rectangle(
        0,
        yOffset,
        120,
        20,
        port.isOpen ? 0x00aa44 : 0x882200
      );

      // Port text
      const portText = this.add
        .text(
          0,
          yOffset,
          `Port ${port.number}: ${port.isOpen ? "OPEN" : "CLOSED"}`,
          {
            font: "12px monospace",
            fill: "#ffffff",
          }
        )
        .setOrigin(0.5);

      // Add to container
      device.portContainer.add([portBg, portText]);

      // Update port discovery status
      if (port.isOpen && !port.discovered) {
        port.discovered = true;
        this.foundOpenPorts++;
        this.score += 10;
        this.scoreText.setText(`Score: ${this.score}`);
        this.progressText.setText(
          `Ports: ${this.foundOpenPorts}/${this.totalOpenPorts}`
        );

        // Check if all open ports are found
        if (this.foundOpenPorts >= this.totalOpenPorts) {
          this.miniGameSuccess();
        }
      }
    });

    // Make port container visible
    device.portContainer.setVisible(true);

    // Update display position
    device.portContainer.setPosition(0, 50);
  }

  updateTimer() {
    this.timeLeft--;
    this.timerText.setText(`Time: ${this.timeLeft}s`);

    // Time's up
    if (this.timeLeft <= 0) {
      this.countdownTimer.remove();

      // Check if player found enough ports
      if (this.foundOpenPorts >= this.totalOpenPorts * 0.7) {
        this.miniGameSuccess();
      } else {
        this.miniGameFailure();
      }
    }

    // Make timer text red when time is running out
    if (this.timeLeft <= 5) {
      this.timerText.setColor("#ff3333");

      // Add pulsing animation when time is low
      if (this.timeLeft === 5) {
        this.tweens.add({
          targets: this.timerText,
          scale: { from: 1, to: 1.2 },
          duration: 500,
          yoyo: true,
          repeat: 4,
        });
      }
    }
  }

  miniGameSuccess() {
    // Stop the timer
    if (this.countdownTimer) {
      this.countdownTimer.remove();
    }

    // Calculate bonus based on time left
    const timeBonus = this.timeLeft * 5;
    const completionBonus =
      this.foundOpenPorts === this.totalOpenPorts ? 50 : 0;
    const totalBonus = timeBonus + completionBonus;
    this.score += totalBonus;

    // Display success message
    const { width, height } = this.cameras.main;
    const overlay = this.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      0x000000,
      0.7
    );

    const resultPanel = this.add
      .rectangle(width / 2, height / 2, 400, 300, 0x002244)
      .setStrokeStyle(3, 0x00aaff);

    const successTitle = this.add
      .text(width / 2, height / 2 - 100, "SCAN COMPLETE!", {
        font: "bold 32px Arial",
        fill: "#00cc66",
      })
      .setOrigin(0.5);

    const resultText = this.add
      .text(
        width / 2,
        height / 2 - 40,
        `Ports Found: ${this.foundOpenPorts}/${this.totalOpenPorts}`,
        {
          font: "20px Arial",
          fill: "#ffffff",
        }
      )
      .setOrigin(0.5);

    const bonusText = this.add
      .text(width / 2, height / 2, `Time Bonus: +${timeBonus}`, {
        font: "20px Arial",
        fill: "#ffdd00",
      })
      .setOrigin(0.5);

    const completionText = this.add
      .text(
        width / 2,
        height / 2 + 40,
        `Completion Bonus: +${completionBonus}`,
        {
          font: "20px Arial",
          fill: "#ffdd00",
        }
      )
      .setOrigin(0.5);

    const scoreText = this.add
      .text(width / 2, height / 2 + 80, `Total Score: ${this.score}`, {
        font: "bold 24px Arial",
        fill: "#00aaff",
      })
      .setOrigin(0.5);

    // Continue button
    const continueButton = this.add
      .rectangle(width / 2, height / 2 + 130, 200, 50, 0x00aa66)
      .setStrokeStyle(2, 0x00cc88)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => continueButton.setFillStyle(0x00bb77))
      .on("pointerout", () => continueButton.setFillStyle(0x00aa66))
      .on("pointerdown", () => this.returnToMainGame(true));

    const continueText = this.add
      .text(width / 2, height / 2 + 130, "CONTINUE", {
        font: "bold 20px Arial",
        fill: "#ffffff",
      })
      .setOrigin(0.5);

    // Play success sound
    this.game.soundManager.play("success");
  }

  miniGameFailure() {
    // Stop the timer
    if (this.countdownTimer) {
      this.countdownTimer.remove();
    }

    // Display failure message
    const { width, height } = this.cameras.main;
    const overlay = this.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      0x000000,
      0.7
    );

    const resultPanel = this.add
      .rectangle(width / 2, height / 2, 400, 300, 0x220000)
      .setStrokeStyle(3, 0xff3333);

    const failureTitle = this.add
      .text(width / 2, height / 2 - 100, "SCAN FAILED!", {
        font: "bold 32px Arial",
        fill: "#ff3333",
      })
      .setOrigin(0.5);

    const resultText = this.add
      .text(
        width / 2,
        height / 2 - 40,
        `Ports Found: ${this.foundOpenPorts}/${this.totalOpenPorts}`,
        {
          font: "20px Arial",
          fill: "#ffffff",
        }
      )
      .setOrigin(0.5);

    const tipText = this.add
      .text(
        width / 2,
        height / 2 + 20,
        "Tip: You need to find at least 70% of open ports\nto successfully identify the threat!",
        {
          font: "16px Arial",
          fill: "#ffdd00",
          align: "center",
        }
      )
      .setOrigin(0.5);

    // Try again button
    const tryAgainButton = this.add
      .rectangle(width / 2, height / 2 + 100, 200, 50, 0xaa0000)
      .setStrokeStyle(2, 0xff3333)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => tryAgainButton.setFillStyle(0xcc0000))
      .on("pointerout", () => tryAgainButton.setFillStyle(0xaa0000))
      .on("pointerdown", () => this.restartMiniGame());

    const tryAgainText = this.add
      .text(width / 2, height / 2 + 100, "TRY AGAIN", {
        font: "bold 20px Arial",
        fill: "#ffffff",
      })
      .setOrigin(0.5);

    // Play failure sound
    this.game.soundManager.play("failure");
  }

  restartMiniGame() {
    // Reset game state
    this.scene.restart();
  }

  // Fixed returnToMainGame function in PortScanMiniGame.js
  returnToMainGame(success) {
    // Stop any running timers
    if (this.countdownTimer) {
      this.countdownTimer.remove();
    }

    // Make sure we properly return to the main game with results
    if (this.returnCallback) {
      // Call the callback function with the success status and score
      this.returnCallback(success, this.score);

      // Resume the main scene and hide this one
      this.scene.resume("GameScene");
      this.scene.stop();
    } else {
      // Fallback to direct scene transition if callback is not available
      this.scene.start("GameScene", {
        miniGameSuccess: success,
        score: this.score,
        row: this.row,
        col: this.col,
        threatType: this.threatType,
      });
    }
  }

  update() {
    // Game update logic
  }
}
