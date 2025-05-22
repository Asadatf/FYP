class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this.GRID_SIZE = 3;
    this.highScoreManager = new HighScore();

    // Game state
    this.score = 0;
    this.level = 1;
    this.correctSolutions = 0;
    this.totalThreatsResolved = 0;
    this.activeThreatCount = 0;
    this.gameState = "initializing"; // initializing, playing, levelComplete, gameOver

    // Grid data
    this.grid = [];
    this.threatGrid = [];
    this.visibleThreats = [];

    // UI elements
    this.cells = [];
    this.defenseButtons = [];
    this.selectedDefense = null;

    // Timers
    this.revealTimer = null;
    this.hideTimer = null;

    // Define threats and defenses
    this.THREATS = {
      portScan: {
        name: "Port Scan",
        icon: "🔍",
        color: 0xeab308, // yellow-500
        solution: "firewall",
      },
      passwordCrack: {
        name: "Password Crack",
        icon: "🔨",
        color: 0xef4444, // red-500
        solution: "password",
      },
      dataSniffer: {
        name: "Data Sniffer",
        icon: "🕵️",
        color: 0xa855f7, // purple-500
        solution: "encryption",
      },
      malware: {
        name: "Malware",
        icon: "🦠",
        color: 0x166534, // green-800
        solution: "antivirus",
      },
      phishing: {
        name: "Phishing",
        icon: "🎣",
        color: 0x1d4ed8, // blue-700
        solution: "training",
      },
      ddos: {
        name: "DDoS Attack",
        icon: "🌊",
        color: 0xb91c1c, // red-700
        solution: "loadBalancer",
      },
      ransomware: {
        name: "Ransomware",
        icon: "🔒",
        color: 0xc2410c, // orange-700
        solution: "backup",
      },
      rootkit: {
        name: "Rootkit",
        icon: "🌱",
        color: 0x0f766e, // teal-700
        solution: "scanner",
      },
      trojan: {
        name: "Trojan",
        icon: "🐴",
        color: 0x92400e, // amber-800
        solution: "sandbox",
      },
    };

    this.DEFENSES = {
      firewall: { name: "Firewall", icon: "🛡️", color: 0x3b82f6 }, // blue-500
      password: { name: "Strong Password", icon: "🔐", color: 0x22c55e }, // green-500
      encryption: { name: "Encryption", icon: "🔑", color: 0xa855f7 }, // purple-500
      antivirus: { name: "Antivirus", icon: "🦸", color: 0x15803d }, // green-700
      training: { name: "Security Training", icon: "📚", color: 0xca8a04 }, // yellow-600
      loadBalancer: { name: "Load Balancer", icon: "⚖️", color: 0x1e40af }, // blue-800
      backup: { name: "Data Backup", icon: "💾", color: 0xf97316 }, // orange-500
      scanner: { name: "Rootkit Scanner", icon: "🔬", color: 0x14b8a6 }, // teal-500
      sandbox: { name: "Sandbox Environment", icon: "📦", color: 0xd97706 }, // amber-600
    };
  }

  create() {
    // Set up the game layout
    this.createGameInterface();

    // Create the game grid
    this.createGrid();

    // Generate the initial threats
    this.prepareLevel();

    // Set up interval for revealing threats
    this.time.delayedCall(3000, () => {
      this.gameState = "playing";
      this.statusText.setText(
        "Watch for threats and select the correct defense!"
      );

      // Show first threat
      this.revealRandomThreat();

      // Set up timer for next threats
      this.revealTimer = this.time.addEvent({
        delay: 3000,
        callback: this.revealRandomThreat,
        callbackScope: this,
        loop: true,
      });
    });
  }

  createGameInterface() {
    const { width, height } = this.cameras.main;

    // Create background
    this.createBackground();

    // Game title
    this.add
      .text(width / 2, 30, "CYBER FORTRESS", {
        font: "bold 32px Arial",
        fill: "#00aaff",
        stroke: "#000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    // Status bar
    const statusBg = this.add
      .rectangle(width / 2, 80, width - 40, 40, 0x2d2d2d)
      .setStrokeStyle(1, 0x4d4d4d);

    // Score display
    this.scoreText = this.add
      .text(100, 80, "Score: 0", {
        font: "18px Arial",
        fill: "#00cc66",
      })
      .setOrigin(0.5);

    // Level display
    this.levelText = this.add
      .text(width / 2, 80, "Level: 1", {
        font: "18px Arial",
        fill: "#ffbb00",
      })
      .setOrigin(0.5);

    // Threats resolved display
    this.threatsText = this.add
      .text(width - 140, 80, "Threats: 0", {
        font: "18px Arial",
        fill: "#ff9900",
      })
      .setOrigin(0.5);

    // High score display
    this.highScoreText = this.add
      .text(
        width - 320,
        80,
        `High Score: ${this.highScoreManager.getHighScore()}`,
        {
          font: "18px Arial",
          fill: "#00aaff",
        }
      )
      .setOrigin(0.5);

    // Status message
    this.statusText = this.add
      .text(width / 2, 120, "Preparing cyber defenses...", {
        font: "18px Arial",
        fill: "#ffffff",
        backgroundColor: "#00498b",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5);

    // Create defense selection buttons
    this.createDefenseButtons();

    // Create legend with threat-defense relationships side by side
    this.createThreatsAndCounters();
  }

  createBackground() {
    const { width, height } = this.cameras.main;

    // Fill background
    this.add.rectangle(0, 0, width, height, 0x1a1a1a).setOrigin(0);

    // Create cyber grid effect
    const bgGraphics = this.add.graphics();
    bgGraphics.lineStyle(1, 0x004e92, 0.1);

    // Draw perspective grid effect
    for (let i = 0; i < 20; i++) {
      const y = i * 40;
      // Horizontal lines with perspective effect
      bgGraphics.lineBetween(0, y, width, y);
    }

    for (let i = 0; i < 30; i++) {
      const x = i * 40;
      // Vertical lines
      bgGraphics.lineBetween(x, 0, x, height);
    }

    // Add some animated particles for more cyber feel
    const particles = this.add.particles(0, 0, "pixel", {
      speed: { min: 30, max: 60 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.5, end: 0 },
      blendMode: "ADD",
      lifespan: 1000,
      frequency: 40,
      x: { min: 0, max: width },
      y: { min: 0, max: height },
    });
  }

  createGrid() {
    const cellSize = 100;
    const padding = 10;
    const gridWidth =
      cellSize * this.GRID_SIZE + padding * (this.GRID_SIZE - 1);
    const gridHeight =
      cellSize * this.GRID_SIZE + padding * (this.GRID_SIZE - 1);

    // Universal positioning that works on every screen
    const { width, height } = this.cameras.main;
    const topUISpace = 200; // Space reserved for top UI elements (title, status, etc.)
    const bottomMargin = 80; // Universal bottom margin
    const availableHeight = height - topUISpace - bottomMargin;

    // Center the grid in the available space
    const startX = (width - gridWidth) / 2 - 50;
    const startY = topUISpace + (availableHeight - gridHeight) / 2 - 100;

    // Initialize grid arrays
    this.grid = Array(this.GRID_SIZE)
      .fill()
      .map(() => Array(this.GRID_SIZE).fill(null));
    this.cells = Array(this.GRID_SIZE)
      .fill()
      .map(() => Array(this.GRID_SIZE).fill(null));

    // Create grid background
    this.add
      .rectangle(
        startX + gridWidth / 2,
        startY + gridHeight / 2,
        gridWidth + padding * 2,
        gridHeight + padding * 2,
        0x2d2d2d
      )
      .setStrokeStyle(1, 0x4d4d4d);

    // Create grid cells
    for (let row = 0; row < this.GRID_SIZE; row++) {
      for (let col = 0; col < this.GRID_SIZE; col++) {
        const x = startX + col * (cellSize + padding) + cellSize / 2;
        const y = startY + row * (cellSize + padding) + cellSize / 2;

        // Cell background
        const cell = this.add
          .rectangle(x, y, cellSize, cellSize, 0x3d3d3d)
          .setStrokeStyle(1, 0x5d5d5d)
          .setInteractive({ useHandCursor: true })
          .on("pointerover", () => {
            cell.setFillStyle(0x4d4d4d);
          })
          .on("pointerout", () => {
            cell.setFillStyle(0x3d3d3d);
          })
          .on("pointerdown", () => {
            this.placeDefense(row, col);
          });

        // Create container for cell contents
        const container = this.add.container(x, y);

        // Create the question mark - properly positioned INSIDE the container
        const hiddenIcon = this.add
          .text(0, 0, "?", {
            // Position is (0,0) because it's relative to the container
            font: "bold 42px Arial",
            fill: "rgba(255,255,255,0.5)", // More visible
            stroke: "#004e92", // Add outline for better visibility
            strokeThickness: 1,
          })
          .setOrigin(0.5)
          .setVisible(false);

        // Add question mark to container
        container.add(hiddenIcon);

        // Store reference to cell
        this.cells[row][col] = {
          container: container,
          cell,
          defenseIcon: null,
          threatIcon: null,
          hiddenIcon: hiddenIcon,
        };
      }
    }
  }

  // Updated defense buttons layout - moved higher and with larger panels
  createDefenseButtons() {
    const { width, height } = this.cameras.main;

    // Defense buttons section - moved higher up
    const sectionWidth = width / 2 - 30; // Left half of the screen minus margin
    const buttonWidth = 75;
    const buttonHeight = 75;
    const padding = 10;

    // Create a larger panel for defense buttons (left side) - moved higher
    const defensePanel = this.add
      .rectangle(
        sectionWidth / 2 + 20, // Position from left edge
        height - 100, // Position from bottom - moved up by 80 pixels
        sectionWidth + 40, // Made wider
        400, // Made taller
        0x2d2d2d
      )
      .setStrokeStyle(1, 0x4d4d4d);

    // Defense section title - moved up
    this.add
      .text(sectionWidth / 2 + 20, height - 290, "DEFENSE OPTIONS", {
        font: "bold 16px Arial",
        fill: "#00aaff",
      })
      .setOrigin(0.5);

    // Calculate grid layout
    const rows = 3;
    const cols = 3;
    const gridWidth = cols * buttonWidth + (cols - 1) * padding;
    const gridHeight = rows * buttonHeight + (rows - 1) * padding;

    // Center the grid in the left section - moved higher
    const startX = (sectionWidth - gridWidth) / 2 + 20; // Add left margin
    const startY = height - 280; // Position from top - moved up

    // Create buttons for each defense type
    let index = 0;
    for (const [key, defense] of Object.entries(this.DEFENSES)) {
      const row = Math.floor(index / cols);
      const col = index % cols;
      const x = startX + col * (buttonWidth + padding) + buttonWidth / 2;
      const y = startY + row * (buttonHeight + padding) + buttonHeight / 2;

      // Button background
      const button = this.add
        .rectangle(x, y, buttonWidth, buttonHeight, 0x3d3d3d)
        .setStrokeStyle(1, 0x5d5d5d)
        .setInteractive({ useHandCursor: true })
        .on("pointerover", () => {
          if (this.selectedDefense !== key) {
            button.setFillStyle(0x4d4d4d);
          }
        })
        .on("pointerout", () => {
          if (this.selectedDefense !== key) {
            button.setFillStyle(0x3d3d3d);
          }
        })
        .on("pointerdown", () => {
          this.selectDefense(key);
        });

      // Defense icon
      const icon = this.add
        .text(x, y - 10, defense.icon, {
          font: "24px Arial",
        })
        .setOrigin(0.5);

      // Defense name
      const name = this.add
        .text(x, y + 20, defense.name, {
          font: "10px Arial",
          fill: "#ffffff",
          wordWrap: { width: buttonWidth - 10 },
        })
        .setOrigin(0.5);

      // Store button reference
      this.defenseButtons[key] = { button, icon, name };

      index++;
    }
  }

  // Updated threats and counters layout - moved higher and with larger panels
  createThreatsAndCounters() {
    const { width, height } = this.cameras.main;

    // Threat-counters section (right side)
    const sectionWidth = width / 2 - 30; // Right half of the screen minus margin
    const sectionX = width / 2 + 10; // Start from the middle

    // Create a larger panel for threat-defense relationships - moved higher
    const threatPanel = this.add
      .rectangle(
        sectionX + sectionWidth / 2,
        height - 100, // Same Y position as defense buttons - moved up by 80 pixels
        sectionWidth + 40, // Made wider
        400, // Made taller
        0x2d2d2d
      )
      .setStrokeStyle(1, 0x4d4d4d);

    // Threat section title - moved up
    this.add
      .text(
        sectionX + sectionWidth / 2,
        height - 330, // Moved up
        "THREAT TYPES & COUNTERS",
        {
          font: "bold 16px Arial",
          fill: "#00aaff",
        }
      )
      .setOrigin(0.5);

    // Create a grid of threat-defense pairs
    const threatKeys = Object.keys(this.THREATS);
    const pairWidth = 150; // Width for each threat-defense pair
    const pairHeight = 80; // Height for each pair
    const padding = 30;
    const rows = 3;
    const cols = 3;

    // Calculate start position in the right section - moved higher
    const startX =
      sectionX + (sectionWidth - (cols * pairWidth + (cols - 1) * padding)) / 2;
    const startY = height - 320; // Same Y starting point as defense grid - moved up

    // Create the threat-defense pairs in a grid
    threatKeys.forEach((key, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;

      const x = startX + col * (pairWidth + padding - 10) + pairWidth / 2;
      const y = startY + row * (pairHeight + padding) + pairHeight / 2;

      const threat = this.THREATS[key];
      const defense = this.DEFENSES[threat.solution];

      // Background for this pair
      this.add
        .rectangle(x, y, pairWidth, pairHeight, 0x3d3d3d, 0.7)
        .setStrokeStyle(1, threat.color);

      // Threat icon and name
      this.add
        .text(x - 25, y - 10, threat.icon, { font: "16px Arial" })
        .setOrigin(0.5);

      this.add
        .text(x + 10, y - 10, threat.name, {
          font: "10px Arial",
          fill: "#ffffff",
        })
        .setOrigin(0, 0.5);

      // Arrow connecting threat to defense
      this.add
        .text(x - 25, y + 5, "↓", {
          font: "10px Arial",
          fill: "#00cc66",
        })
        .setOrigin(0.5);

      // Defense icon and name
      this.add
        .text(x - 25, y + 18, defense.icon, { font: "14px Arial" })
        .setOrigin(0.5);

      this.add
        .text(x + 10, y + 18, defense.name, {
          font: "9px Arial",
          fill: "#00cc66",
        })
        .setOrigin(0, 0.5);
    });
  }

  selectDefense(defenseKey) {
    // Deselect previous defense
    if (this.selectedDefense) {
      this.defenseButtons[this.selectedDefense].button.setFillStyle(0x3d3d3d);
    }

    // Select new defense
    this.selectedDefense = defenseKey;
    this.defenseButtons[defenseKey].button.setFillStyle(0x0066cc);

    // Play sound effect
    this.game.soundManager.play("button-click");
  }

  prepareLevel() {
    // Clear any existing timers
    if (this.revealTimer) {
      this.revealTimer.remove();
      this.revealTimer = null;
    }

    if (this.hideTimer) {
      this.hideTimer.remove();
      this.hideTimer = null;
    }

    // Initialize threat grid
    const threatTypes = Object.keys(this.THREATS);
    const shuffledThreats = [...threatTypes]
      .sort(() => Math.random() - 0.5)
      .slice(0, this.GRID_SIZE * this.GRID_SIZE);

    this.threatGrid = Array(this.GRID_SIZE)
      .fill()
      .map(() => Array(this.GRID_SIZE).fill(null));
    this.visibleThreats = Array(this.GRID_SIZE)
      .fill()
      .map(() => Array(this.GRID_SIZE).fill(false));

    // Distribute threats across the grid
    let threatIndex = 0;
    for (let row = 0; row < this.GRID_SIZE; row++) {
      for (let col = 0; col < this.GRID_SIZE; col++) {
        this.threatGrid[row][col] = shuffledThreats[threatIndex++];

        // Show hidden threat indicators
        if (this.cells[row][col]) {
          this.cells[row][col].hiddenIcon.setVisible(true);
        }
      }
    }

    // Count active threats
    this.activeThreatCount = this.threatGrid
      .flat()
      .filter((threat) => threat !== null).length;

    // Reset grid
    this.grid = Array(this.GRID_SIZE)
      .fill()
      .map(() => Array(this.GRID_SIZE).fill(null));

    // Update UI
    this.levelText.setText(`Level: ${this.level}`);
    this.scoreText.setText(`Score: ${this.score}`);
    this.threatsText.setText(`Threats: ${this.totalThreatsResolved}`);

    // Update status
    this.statusText.setText("Prepare for incoming cyber threats!");
    this.statusText.setBackgroundColor("#cc6600");
  }

  revealRandomThreat() {
    if (this.gameState !== "playing") return;

    // Get all unresolved threat positions
    const unresolvedPositions = [];
    for (let row = 0; row < this.GRID_SIZE; row++) {
      for (let col = 0; col < this.GRID_SIZE; col++) {
        if (this.threatGrid[row][col] !== null) {
          unresolvedPositions.push({ row, col });
        }
      }
    }

    if (unresolvedPositions.length === 0) {
      // All threats resolved, don't try to reveal more
      if (this.revealTimer) {
        this.revealTimer.remove();
        this.revealTimer = null;
      }
      return;
    }

    // Hide any currently visible threats first
    for (let row = 0; row < this.GRID_SIZE; row++) {
      for (let col = 0; col < this.GRID_SIZE; col++) {
        this.hideVisibleThreat(row, col);
      }
    }

    // Select a random unresolved position
    const randomPosition = Phaser.Utils.Array.GetRandom(unresolvedPositions);
    const { row, col } = randomPosition;

    // Show threat at this position
    this.showThreat(row, col);

    // Hide threat after delay
    if (this.hideTimer) {
      this.hideTimer.remove();
    }

    this.hideTimer = this.time.delayedCall(2000, () => {
      this.hideVisibleThreat(row, col);
      this.hideTimer = null;
    });
  }

  showThreat(row, col) {
    const threatType = this.threatGrid[row][col];
    if (!threatType) return;

    const cell = this.cells[row][col];
    if (!cell) return;

    // Hide question mark
    cell.hiddenIcon.setVisible(false);

    // Create threat display
    const threat = this.THREATS[threatType];

    // Create a container for the threat info
    const threatContainer = this.add.container(
      cell.container.x,
      cell.container.y
    );

    // Add background
    const bg = this.add
      .rectangle(0, 0, 90, 90, 0x000000, 0.7)
      .setStrokeStyle(2, threat.color);

    // Add icon
    const icon = this.add
      .text(0, -15, threat.icon, {
        font: "32px Arial",
      })
      .setOrigin(0.5);

    // Add name
    const name = this.add
      .text(0, 20, threat.name, {
        font: "14px Arial",
        fill: "#ffffff",
      })
      .setOrigin(0.5);

    // Add to container
    threatContainer.add([bg, icon, name]);

    // Store reference and mark as visible
    cell.threatIcon = threatContainer;
    this.visibleThreats[row][col] = true;

    // Add animation
    this.tweens.add({
      targets: threatContainer,
      scale: { from: 0.5, to: 1 },
      alpha: { from: 0, to: 1 },
      duration: 300,
      ease: "Back.easeOut",
    });

    // Add glow to cell
    this.tweens.add({
      targets: cell.cell,
      strokeColor: threat.color,
      duration: 200,
    });
  }

  hideVisibleThreat(row, col) {
    if (!this.visibleThreats[row][col]) return;

    const cell = this.cells[row][col];
    if (!cell || !cell.threatIcon) return;

    // Remove the threat icon with animation
    this.tweens.add({
      targets: cell.threatIcon,
      scale: { from: 1, to: 0.5 },
      alpha: 0,
      duration: 300,
      onComplete: () => {
        if (cell.threatIcon) {
          cell.threatIcon.destroy();
          cell.threatIcon = null;
        }

        // Show question mark if there's still a threat
        if (this.threatGrid[row][col] !== null) {
          cell.hiddenIcon.setVisible(true);
        }

        // Reset cell highlight
        this.tweens.add({
          targets: cell.cell,
          strokeColor: 0x5d5d5d,
          duration: 200,
        });
      },
    });

    this.visibleThreats[row][col] = false;
  }

  launchMiniGame(row, col, threatType) {
    // Check if there is a mini-game for this threat type
    const hasMinigame = [
      "portScan",
      "passwordCrack",
      "ransomware",
      "rootkit",
      "malware",
      "ddos",
    ].includes(threatType);

    // If no mini-game exists for this threat, proceed directly with normal defense placement
    if (!hasMinigame) {
      this.finalizeDefensePlacement(row, col, true);
      return;
    }

    // Save current game state and position for later use
    this.gameState = "miniGame";
    this.miniGameRow = row;
    this.miniGameCol = col;
    this.miniGameThreat = threatType;

    // Pause timers during mini-game
    if (this.revealTimer) {
      this.revealTimer.paused = true;
    }

    if (this.hideTimer) {
      this.hideTimer.remove();
      this.hideTimer = null;
    }

    // Update status
    this.statusText.setText("Launching mini-game challenge...");
    this.statusText.setBackgroundColor("#00498b");

    // Define a callback function to handle mini-game results
    const miniGameCallback = (success, score) => {
      console.log(
        "miniGameCallback executed with success:",
        success,
        "score:",
        score
      );

      // Resume the game state
      this.gameState = "playing";

      // Resume timers
      if (this.revealTimer) {
        this.revealTimer.paused = false;
      }

      // Update score from mini-game
      this.score = score;
      this.scoreText.setText(`Score: ${this.score}`);

      // Process the defense placement based on mini-game success
      if (success) {
        console.log(
          `Placing correct defense for threat: ${this.miniGameThreat} at row: ${this.miniGameRow}, col: ${this.miniGameCol}`
        );

        // Get the correct solution for this threat
        const correctSolution = this.THREATS[this.miniGameThreat].solution;

        // Set selected defense to the correct one
        this.selectDefense(correctSolution);

        // Place the defense
        this.finalizeDefensePlacement(this.miniGameRow, this.miniGameCol, true);
      } else {
        // Mini-game failed, don't place defense
        this.statusText.setText("Mini-game failed! Try again.");
        this.statusText.setBackgroundColor("#cc6600");
      }
    };

    // Make sure the callback is bound to this context
    const boundCallback = miniGameCallback.bind(this);

    // Set up a listener for when the mini-game scene stops without proper completion
    const miniGameKey = this.getMiniGameKey(threatType);
    if (miniGameKey) {
      // Listen for when the scene stops (user might press escape or close it somehow)
      this.events.once("resume", this.handleMiniGameReturn, this);
    }

    // Launch appropriate mini-game based on threat type
    switch (threatType) {
      case "portScan":
        this.scene.launch("PortScanMiniGame", {
          mainScene: this,
          row: row,
          col: col,
          score: this.score,
          callback: boundCallback,
        });
        this.scene.pause();
        break;
      case "passwordCrack":
        this.scene.launch("PasswordCrackMiniGame", {
          mainScene: this,
          row: row,
          col: col,
          score: this.score,
          callback: boundCallback,
        });
        this.scene.pause();
        break;
      case "ransomware":
        console.log("Launching RansomwareMiniGame");
        this.scene.launch("RansomwareMiniGame", {
          mainScene: this,
          row: row,
          col: col,
          score: this.score,
          callback: boundCallback,
        });
        this.scene.pause();
        break;
      case "rootkit":
        console.log("Launching RootkitMiniGame");
        this.scene.launch("RootkitMiniGame", {
          mainScene: this,
          row: row,
          col: col,
          score: this.score,
          callback: boundCallback,
        });
        this.scene.pause();
        break;
      case "malware":
        console.log("Launching MalwareWhackMiniGame");
        this.scene.launch("MalwareWhackMiniGame", {
          mainScene: this,
          row: row,
          col: col,
          score: this.score,
          callback: boundCallback,
        });
        this.scene.pause();
        break;
      case "ddos":
        console.log("Launching DDoSMiniGame");
        this.scene.launch("DDOSMiniGame", {
          mainScene: this,
          row: row,
          col: col,
          score: this.score,
          callback: boundCallback,
        });
        this.scene.pause();
        break;
    }
  }

  // Helper method to get the scene key based on threat type
  getMiniGameKey(threatType) {
    switch (threatType) {
      case "portScan":
        return "PortScanMiniGame";
      case "passwordCrack":
        return "PasswordCrackMiniGame";
      case "ransomware":
        return "RansomwareMiniGame";
      case "rootkit":
        return "RootkitMiniGame";
      case "malware":
        return "MalwareWhackMiniGame";
      case "ddos":
        return "DDOSMiniGame";
      default:
        return null;
    }
  }

  handleMiniGameReturn() {
    // This method will be called when returning from a mini-game
    // without completing it, to ensure the game state is properly reset
    console.log("Handling return from mini-game");

    // Reset game state to playing
    this.gameState = "playing";

    // Resume any paused timers
    if (this.revealTimer && this.revealTimer.paused) {
      this.revealTimer.paused = false;
    }

    // Update status
    this.statusText.setText("Select a defense and place it on a threat cell!");
    this.statusText.setBackgroundColor("#00498b");

    // Clear any mini-game related data
    this.miniGameRow = null;
    this.miniGameCol = null;
    this.miniGameThreat = null;
  }

  placeDefense(row, col) {
    if (this.gameState !== "playing") {
      // If game state is not playing, it might be stuck in "miniGame" state
      // Reset the state and try again
      if (this.gameState === "miniGame") {
        this.handleMiniGameReturn();
        // Now attempt to place defense again with the corrected state
        this.placeDefense(row, col);
        return;
      }
      return;
    }

    if (!this.selectedDefense || !this.DEFENSES[this.selectedDefense]) return;
    if (this.grid[row][col]) return; // Cell already has a defense

    const threatType = this.threatGrid[row][col];
    if (!threatType) return; // No threat in this cell

    // Launch mini-game based on threat type
    this.launchMiniGame(row, col, threatType);
  }

  // Add this method to handle the final defense placement after mini-game
  finalizeDefensePlacement(row, col, wasSuccessful) {
    const threatType = this.threatGrid[row][col];
    if (!threatType) return; // No threat in this cell

    const correctSolution = this.THREATS[threatType].solution;

    // Update grid data
    this.grid[row][col] = this.selectedDefense;

    // Get cell and place defense icon
    const cell = this.cells[row][col];
    if (!cell) return;

    // Remove any existing defense icon
    if (cell.defenseIcon) {
      cell.defenseIcon.destroy();
    }

    // Create defense icon
    const defense = this.DEFENSES[this.selectedDefense];
    cell.defenseIcon = this.add
      .text(cell.container.x, cell.container.y, defense.icon, {
        font: "32px Arial",
      })
      .setOrigin(0.5);

    // Check if correct solution was applied
    if (this.selectedDefense === correctSolution) {
      // Correct defense!
      this.score += 25;
      this.correctSolutions++;
      this.totalThreatsResolved++;

      // Update counters
      this.scoreText.setText(`Score: ${this.score}`);
      this.threatsText.setText(`Threats: ${this.totalThreatsResolved}`);

      // Play success sound
      this.game.soundManager.play("success");

      // Show success animation
      this.showResultAnimation(row, col, true);

      // Remove the threat from the grid
      this.threatGrid[row][col] = null;

      // Check if all threats are resolved for this level
      const remainingThreats = this.threatGrid
        .flat()
        .filter((threat) => threat !== null).length;
      if (remainingThreats === 0) {
        this.levelComplete();
      }
    } else {
      // Wrong defense!
      this.score = Math.max(0, this.score - 10);

      // Play failure sound
      this.game.soundManager.play("failure");

      // Show failure animation
      this.showResultAnimation(row, col, false);

      // Update score
      this.scoreText.setText(`Score: ${this.score}`);
    }

    // Update high score if needed
    this.updateHighScore();
  }

  showResultAnimation(row, col, success) {
    const cell = this.cells[row][col];
    if (!cell) return;

    // Create animation overlay
    const resultIcon = this.add
      .text(cell.container.x, cell.container.y, success ? "✓" : "✗", {
        font: "bold 48px Arial",
        fill: success ? "#00cc66" : "#ff3333",
      })
      .setOrigin(0.5);

    // Create background glow
    const glow = this.add.rectangle(
      cell.container.x,
      cell.container.y,
      100,
      100,
      success ? 0x00cc66 : 0xff3333,
      0.4
    );

    // Animation for result icon
    this.tweens.add({
      targets: resultIcon,
      scale: { from: 0.5, to: 1.2, to: 1 },
      duration: 800,
      ease: "Back.easeOut",
      onComplete: () => {
        resultIcon.destroy();
        glow.destroy();
      },
    });

    // Animation for glow
    this.tweens.add({
      targets: glow,
      alpha: { from: 0.4, to: 0 },
      scale: { from: 1, to: 1.2 },
      duration: 800,
    });
  }

  levelComplete() {
    // Stop the threat reveal timer
    if (this.revealTimer) {
      this.revealTimer.remove();
      this.revealTimer = null;
    }

    this.gameState = "levelComplete";

    // Update status message
    this.statusText.setText("Level Complete! Advancing to next level...");
    this.statusText.setBackgroundColor("#00cc66");

    // Play level complete sound
    this.game.soundManager.play("level-up");

    // Check if game is won (level 5 completed)
    if (this.level >= 5) {
      // Game won!
      this.time.delayedCall(2000, () => {
        this.scene.start("GameOverScene", {
          victory: true,
          score: this.score,
          level: this.level,
          threatsResolved: this.totalThreatsResolved,
        });
      });
      return;
    }

    // Advance to next level after delay
    this.time.delayedCall(2000, () => {
      this.level++;
      this.prepareLevel();

      // Restart the threat reveal cycle
      this.gameState = "playing";

      this.time.delayedCall(1000, () => {
        // Show first threat immediately
        this.revealRandomThreat();

        // Set up timer for next threats
        this.revealTimer = this.time.addEvent({
          delay: 3000,
          callback: this.revealRandomThreat,
          callbackScope: this,
          loop: true,
        });
      });
    });
  }

  updateHighScore() {
    const highScore = this.highScoreManager.getHighScore();
    if (this.score > highScore) {
      this.highScoreManager.updateHighScore(this.score);
      this.highScoreText.setText(`High Score: ${this.score}`);
    }
  }

  update() {
    // Update game logic that needs to run every frame
  }
}
