// 2. Create the DDOSMiniGame class that matches your existing mini-game structure
class DDOSMiniGame extends Phaser.Scene {
  constructor() {
    super("DDOSMiniGame");

    // Game configuration
    this.gameConfig = {
      duration: 30, // Game duration in seconds
      startingServers: 3, // Number of servers at start
      maxServers: 5, // Maximum servers possible
      trafficRate: 1000, // Initial ms between traffic spawns
      minTrafficRate: 200, // Fastest possible traffic spawn rate
      accelerationRate: 50, // ms to decrease traffic rate by every wave
      serverRecoveryTime: 5000, // ms for a server to recover
      trafficProcessTime: 2000, // ms for a server to process traffic
      packetValue: 5, // Points per successful packet
      packetPenalty: 10, // Points lost per dropped packet
      serverCapacity: 5, // How many packets a server can handle
      comboMultiplier: 2, // Score multiplier for combos
    };

    // Game state
    this.score = 0;
    this.combo = 0;
    this.timeRemaining = this.gameConfig.duration;
    this.gameActive = false;
    this.systemHealth = 100;
    this.currentDifficulty = 1;

    // Game objects
    this.servers = [];
    this.trafficQueue = [];
    this.trafficSpawner = null;

    // References to parent scene and callback
    this.mainScene = null;
    this.row = 0;
    this.col = 0;
    this.callback = null;
  }

  init(data) {
    // Store references from parent scene
    this.mainScene = data.mainScene;
    this.row = data.row;
    this.col = data.col;
    this.returnCallback = data.callback;

    // Initialize with the current score from the main game
    this.score = data.score || 0;

    // Reset other game state
    this.combo = 0;
    this.timeRemaining = this.gameConfig.duration;
    this.gameActive = false;
    this.systemHealth = 100;
    this.currentDifficulty = 1;
    this.servers = [];
    this.trafficQueue = [];
  }

  create() {
    const { width, height } = this.cameras.main;

    // Add cyber-themed background
    this.createBackground();

    // Add game title
    this.add
      .text(width / 2, 30, "SERVER TRAFFIC DEFENDER", {
        font: "bold 28px Arial",
        fill: "#00aaff",
        stroke: "#000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    // Add instructions
    this.add
      .text(
        width / 2,
        70,
        "Distribute incoming traffic to prevent server overload!",
        {
          font: "18px Arial",
          fill: "#ffffff",
        }
      )
      .setOrigin(0.5);

    // Create load balancer
    this.createLoadBalancer(width / 2, 150);

    // Create server rack
    this.createServers(width / 2, height - 150);

    // Create HUD elements
    this.createHUD();

    // Start button
    const startButton = this.add
      .rectangle(width / 2, height / 2, 200, 60, 0x00cc66)
      .setStrokeStyle(2, 0x00ff77)
      .setInteractive({ useHandCursor: true });

    const startText = this.add
      .text(width / 2, height / 2, "START DEFENSE", {
        font: "bold 22px Arial",
        fill: "#ffffff",
      })
      .setOrigin(0.5);

    startButton.on("pointerover", () => {
      startButton.setFillStyle(0x00dd77);
    });

    startButton.on("pointerout", () => {
      startButton.setFillStyle(0x00cc66);
    });

    startButton.on("pointerdown", () => {
      this.startGame();
      startButton.setVisible(false);
      startText.setVisible(false);
    });

    // Add key controls
    this.createKeyControls();
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
      bgGraphics.lineBetween(0, y, width, y);
    }

    for (let i = 0; i < 30; i++) {
      const x = i * 40;
      bgGraphics.lineBetween(x, 0, x, height);
    }

    // Add some animated particles for cyber feel
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

  createLoadBalancer(x, y) {
    // Create load balancer visual
    const balancerSize = 80;

    // Background
    const balancerBg = this.add
      .rectangle(x, y, balancerSize, balancerSize, 0x00aaff, 0.2)
      .setStrokeStyle(2, 0x00aaff);

    // Icon
    const balancerIcon = this.add
      .text(x, y - 15, "⚖️", {
        font: "32px Arial",
      })
      .setOrigin(0.5);

    // Label
    const balancerLabel = this.add
      .text(x, y + 15, "LOAD BALANCER", {
        font: "bold 14px Arial",
        fill: "#00aaff",
      })
      .setOrigin(0.5);

    // Traffic queue area
    const queueHeight = 80;
    const queueWidth = 400;
    const queueBg = this.add
      .rectangle(x, y + 80, queueWidth, queueHeight, 0x333333, 0.5)
      .setStrokeStyle(1, 0x4d4d4d);

    // Queue label
    const queueLabel = this.add
      .text(x, y + 50, "INCOMING TRAFFIC", {
        font: "12px Arial",
        fill: "#ffffff",
      })
      .setOrigin(0.5);

    // Store references
    this.loadBalancer = {
      x,
      y,
      queueY: y + 80,
      queueWidth,
      queueHeight,
    };
  }

  createServers(centerX, centerY) {
    const numServers = this.gameConfig.startingServers;
    const serverWidth = 120;
    const serverHeight = 150;
    const spacing = 30;
    const totalWidth = numServers * serverWidth + (numServers - 1) * spacing;
    const startX = centerX - totalWidth / 2 + serverWidth / 2;

    for (let i = 0; i < numServers; i++) {
      const x = startX + i * (serverWidth + spacing);

      // Server background
      const serverBg = this.add
        .rectangle(x, centerY, serverWidth, serverHeight, 0x3d3d3d)
        .setStrokeStyle(2, 0x5d5d5d);

      // Server icon
      const serverIcon = this.add
        .text(x, centerY - 50, "🖥️", {
          font: "36px Arial",
        })
        .setOrigin(0.5);

      // Server label
      const serverLabel = this.add
        .text(x, centerY - 10, `SERVER ${i + 1}`, {
          font: "bold 14px Arial",
          fill: "#ffffff",
        })
        .setOrigin(0.5);

      // Server capacity bar background
      const barWidth = 100;
      const barHeight = 20;
      const barBg = this.add
        .rectangle(x, centerY + 20, barWidth, barHeight, 0x222222)
        .setStrokeStyle(1, 0x444444);

      // Capacity bar (initially empty)
      const capacityBar = this.add
        .rectangle(
          x - barWidth / 2,
          centerY + 20 - barHeight / 2,
          0,
          barHeight,
          0x00cc66
        )
        .setOrigin(0, 0);

      // Capacity label
      const capacityLabel = this.add
        .text(x, centerY + 20, "0/" + this.gameConfig.serverCapacity, {
          font: "12px Arial",
          fill: "#ffffff",
        })
        .setOrigin(0.5);

      // Status label
      const statusLabel = this.add
        .text(x, centerY + 50, "ONLINE", {
          font: "14px Arial",
          fill: "#00cc66",
        })
        .setOrigin(0.5);

      // Make server clickable
      serverBg.setInteractive({ useHandCursor: true }).on("pointerdown", () => {
        this.assignTrafficToServer(i);
      });

      // Add server to list
      this.servers.push({
        index: i,
        x,
        y: centerY,
        bg: serverBg,
        icon: serverIcon,
        label: serverLabel,
        barBg: barBg,
        capacityBar: capacityBar,
        capacityLabel: capacityLabel,
        statusLabel: statusLabel,
        barWidth,
        barHeight,
        currentCapacity: 0,
        maxCapacity: this.gameConfig.serverCapacity,
        trafficAssigned: [],
        isOnline: true,
        recoveryTimer: null,
      });
    }
  }

  createHUD() {
    const { width, height } = this.cameras.main;

    // Score display
    this.scoreText = this.add.text(20, 20, `Score: ${this.score}`, {
      font: "18px Arial",
      fill: "#00cc66",
    });

    // Combo display
    this.comboText = this.add.text(20, 50, "Combo: x1", {
      font: "18px Arial",
      fill: "#ffbb00",
    });
    this.comboText.setVisible(false); // Only show when combo > 1

    // Timer display
    this.timerText = this.add
      .text(width - 20, 20, `Time: ${this.timeRemaining}s`, {
        font: "18px Arial",
        fill: "#ffffff",
      })
      .setOrigin(1, 0);

    // System health bar
    const healthBarWidth = 200;
    const healthBarHeight = 20;
    const healthBarBg = this.add
      .rectangle(
        width - 20 - healthBarWidth,
        50,
        healthBarWidth,
        healthBarHeight,
        0x222222
      )
      .setOrigin(0, 0)
      .setStrokeStyle(1, 0x444444);

    this.healthBar = this.add
      .rectangle(
        width - 20 - healthBarWidth,
        50,
        healthBarWidth,
        healthBarHeight,
        0x00cc66
      )
      .setOrigin(0, 0);

    this.healthText = this.add
      .text(
        width - 20 - healthBarWidth / 2,
        50 + healthBarHeight / 2,
        "System Health: 100%",
        {
          font: "12px Arial",
          fill: "#ffffff",
        }
      )
      .setOrigin(0.5);

    // Difficulty indicator
    this.difficultyText = this.add
      .text(width / 2, 20, "Wave: 1", {
        font: "18px Arial",
        fill: "#00aaff",
      })
      .setOrigin(0.5, 0);
  }

  createKeyControls() {
    // Add number keys for server selection
    const keys = [
      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE),
      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO),
      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE),
      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR),
      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE),
    ];

    keys.forEach((key, index) => {
      key.on("down", () => {
        if (this.gameActive && index < this.servers.length) {
          this.assignTrafficToServer(index);
        }
      });
    });

    // Help hint for keyboard controls
    const { width, height } = this.cameras.main;
    this.add
      .text(
        width - 20,
        height - 20,
        "TIP: Use number keys (1-5) to assign traffic",
        {
          font: "14px Arial",
          fill: "#aaaaaa",
        }
      )
      .setOrigin(1, 1);
  }

  startGame() {
    this.gameActive = true;

    // Start timer
    this.gameTimer = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    });

    // Start traffic generation
    this.startTrafficGeneration();

    // Play sound
    if (this.mainScene && this.mainScene.game.soundManager) {
      this.mainScene.game.soundManager.play("button-click");
    }
  }

  startTrafficGeneration() {
    // Initial traffic generation rate
    let currentTrafficRate = this.gameConfig.trafficRate;

    // Start spawner
    this.trafficSpawner = this.time.addEvent({
      delay: currentTrafficRate,
      callback: this.spawnTraffic,
      callbackScope: this,
      loop: true,
    });

    // Increase difficulty over time
    this.difficultyTimer = this.time.addEvent({
      delay: 10000, // 10 seconds between waves
      callback: () => {
        // Increase difficulty
        this.currentDifficulty++;
        this.difficultyText.setText(`Wave: ${this.currentDifficulty}`);

        // Flash difficulty text
        this.tweens.add({
          targets: this.difficultyText,
          scale: { from: 1, to: 1.5, to: 1 },
          duration: 500,
          ease: "Sine.easeInOut",
        });

        // Speed up traffic generation
        currentTrafficRate = Math.max(
          this.gameConfig.minTrafficRate,
          currentTrafficRate - this.gameConfig.accelerationRate
        );
        this.trafficSpawner.delay = currentTrafficRate;

        // Special effect for new wave
        this.createWaveEffect();

        // Play sound
        if (this.mainScene && this.mainScene.game.soundManager) {
          this.mainScene.game.soundManager.play("level-up");
        }
      },
      callbackScope: this,
      loop: true,
    });
  }

  createWaveEffect() {
    const { width, height } = this.cameras.main;

    // Create wave warning text
    const warningText = this.add
      .text(width / 2, height / 2, "INCOMING ATTACK WAVE!", {
        font: "bold 36px Arial",
        fill: "#ff3333",
        stroke: "#000",
        strokeThickness: 6,
      })
      .setOrigin(0.5)
      .setAlpha(0);

    // Animate warning
    this.tweens.add({
      targets: warningText,
      alpha: { from: 0, to: 1 },
      scale: { from: 0.5, to: 1.2, to: 1 },
      duration: 1000,
      ease: "Sine.easeInOut",
      onComplete: () => {
        this.tweens.add({
          targets: warningText,
          alpha: 0,
          duration: 500,
          delay: 500,
          onComplete: () => {
            warningText.destroy();
          },
        });
      },
    });

    // Create pulse effect from load balancer
    const pulse = this.add.circle(
      this.loadBalancer.x,
      this.loadBalancer.y,
      40,
      0xff3333,
      0.5
    );

    this.tweens.add({
      targets: pulse,
      radius: 300,
      alpha: 0,
      duration: 1500,
      ease: "Sine.easeOut",
      onComplete: () => {
        pulse.destroy();
      },
    });
  }

  spawnTraffic() {
    if (!this.gameActive) return;

    const { width } = this.cameras.main;
    const trafficTypes = [
      { type: "regular", icon: "📦", color: 0x00aaff, size: 30 },
      { type: "heavy", icon: "📊", color: 0xffaa00, size: 35 },
      { type: "critical", icon: "⚡", color: 0xff3333, size: 40 },
    ];

    // Choose random traffic type (weighted)
    let typeIndex = 0;
    const rand = Math.random();
    if (rand > 0.9) {
      typeIndex = 2; // 10% critical
    } else if (rand > 0.7) {
      typeIndex = 1; // 20% heavy
    }

    const trafficType = trafficTypes[typeIndex];

    // Random position along the top edge
    const startX = Phaser.Math.Between(width * 0.2, width * 0.8);
    const startY = 0;

    // Create traffic object
    const trafficObj = {
      id: Date.now() + Math.random(),
      type: trafficType.type,
      icon: trafficType.icon,
      color: trafficType.color,
      size: trafficType.size,
      x: startX,
      y: startY,
      targetX: this.loadBalancer.x + Phaser.Math.Between(-150, 150),
      targetY: this.loadBalancer.queueY,
      sprite: this.add.container(startX, startY),
    };

    // Create traffic visual
    const bg = this.add
      .circle(0, 0, trafficType.size / 2, trafficType.color, 0.7)
      .setStrokeStyle(2, trafficType.color);
    const icon = this.add
      .text(0, 0, trafficType.icon, {
        font: `${trafficType.size}px Arial`,
      })
      .setOrigin(0.5);

    trafficObj.sprite.add([bg, icon]);

    // Add to queue
    this.trafficQueue.push(trafficObj);

    // Animate to load balancer queue
    this.tweens.add({
      targets: trafficObj.sprite,
      x: trafficObj.targetX,
      y: trafficObj.targetY,
      duration: 1500,
      ease: "Sine.easeIn",
      onComplete: () => {
        // Flash when reaching queue
        this.tweens.add({
          targets: bg,
          alpha: { from: 0.7, to: 1 },
          yoyo: true,
          duration: 200,
          repeat: 2,
        });
      },
    });

    // Add interactive behavior if in queue
    trafficObj.sprite.setInteractive({ draggable: true, useHandCursor: true });

    trafficObj.sprite.on("dragstart", (pointer) => {
      // Only allow dragging if the game is active
      if (!this.gameActive) return;

      // Bring to top
      trafficObj.sprite.setDepth(100);

      // Scale up slightly while dragging
      this.tweens.add({
        targets: trafficObj.sprite,
        scale: 1.2,
        duration: 200,
      });
    });

    trafficObj.sprite.on("drag", (pointer, x, y) => {
      // Update position
      trafficObj.sprite.x = x;
      trafficObj.sprite.y = y;
    });

    trafficObj.sprite.on("dragend", (pointer) => {
      // Return to normal scale
      this.tweens.add({
        targets: trafficObj.sprite,
        scale: 1,
        duration: 200,
      });

      // Check if dropped on a server
      let assignedToServer = false;

      for (let i = 0; i < this.servers.length; i++) {
        const server = this.servers[i];
        if (!server.isOnline) continue;

        const serverBounds = server.bg.getBounds();
        const trafficBounds = trafficObj.sprite.getBounds();

        if (Phaser.Geom.Rectangle.Overlaps(serverBounds, trafficBounds)) {
          // Remove from queue
          this.trafficQueue = this.trafficQueue.filter(
            (t) => t.id !== trafficObj.id
          );

          // Assign to this server
          this.assignTrafficToServerDirect(i, trafficObj);
          assignedToServer = true;
          break;
        }
      }

      // If not assigned, return to queue
      if (!assignedToServer) {
        this.tweens.add({
          targets: trafficObj.sprite,
          x: trafficObj.targetX,
          y: trafficObj.targetY,
          duration: 300,
          ease: "Sine.easeOut",
        });
      }
    });
  }

  assignTrafficToServer(serverIndex) {
    if (!this.gameActive) return;
    if (this.trafficQueue.length === 0) return;

    const server = this.servers[serverIndex];

    // Check if server is online
    if (!server.isOnline) {
      this.showMessage(`Server ${serverIndex + 1} is offline!`, "#ff3333");
      return;
    }

    // Check if server has capacity
    if (server.currentCapacity >= server.maxCapacity) {
      this.showMessage(`Server ${serverIndex + 1} at max capacity!`, "#ff3333");
      return;
    }

    // Get the first traffic in queue
    const traffic = this.trafficQueue.shift();

    // Assign to server
    this.assignTrafficToServerDirect(serverIndex, traffic);
  }

  assignTrafficToServerDirect(serverIndex, traffic) {
    const server = this.servers[serverIndex];

    // Increase server load
    server.currentCapacity++;

    // Update capacity bar
    const fillPercent = server.currentCapacity / server.maxCapacity;
    server.capacityBar.width = fillPercent * server.barWidth;

    // Change bar color based on load
    if (fillPercent >= 0.8) {
      server.capacityBar.fillColor = 0xff3333; // Red when near capacity
    } else if (fillPercent >= 0.5) {
      server.capacityBar.fillColor = 0xffaa00; // Yellow at medium load
    } else {
      server.capacityBar.fillColor = 0x00cc66; // Green at low load
    }

    // Update capacity text
    server.capacityLabel.setText(
      `${server.currentCapacity}/${server.maxCapacity}`
    );

    // Animate traffic to server
    this.tweens.add({
      targets: traffic.sprite,
      x: server.x,
      y: server.y,
      duration: 500,
      ease: "Sine.easeOut",
      onComplete: () => {
        // Add to server's traffic
        server.trafficAssigned.push(traffic);

        // Start processing after fixed time
        this.time.delayedCall(this.gameConfig.trafficProcessTime, () => {
          this.processTraffic(serverIndex, traffic.id);
        });

        // Process traffic completed effect
        this.tweens.add({
          targets: traffic.sprite,
          alpha: 0.7,
          scale: 0.8,
          duration: this.gameConfig.trafficProcessTime,
        });

        // Check if server is at capacity
        if (server.currentCapacity >= server.maxCapacity) {
          this.checkServerOverload(serverIndex);
        }

        // Award points
        this.addScore(this.gameConfig.packetValue);
      },
    });

    // Play sound
    if (this.mainScene && this.mainScene.game.soundManager) {
      this.mainScene.game.soundManager.play("button-click");
    }
  }

  processTraffic(serverIndex, trafficId) {
    if (!this.gameActive) return;

    const server = this.servers[serverIndex];

    // Find traffic in server's assigned list
    const trafficIndex = server.trafficAssigned.findIndex(
      (t) => t.id === trafficId
    );

    if (trafficIndex === -1) return;

    // Remove traffic from server
    const traffic = server.trafficAssigned.splice(trafficIndex, 1)[0];

    // Decrease server load
    server.currentCapacity--;

    // Update capacity bar
    const fillPercent = server.currentCapacity / server.maxCapacity;
    server.capacityBar.width = fillPercent * server.barWidth;

    // Change bar color based on load
    if (fillPercent >= 0.8) {
      server.capacityBar.fillColor = 0xff3333;
    } else if (fillPercent >= 0.5) {
      server.capacityBar.fillColor = 0xffaa00;
    } else {
      server.capacityBar.fillColor = 0x00cc66;
    }

    // Update capacity text
    server.capacityLabel.setText(
      `${server.currentCapacity}/${server.maxCapacity}`
    );

    // Remove traffic sprite with effect
    this.tweens.add({
      targets: traffic.sprite,
      alpha: 0,
      scale: 0.2,
      duration: 300,
      onComplete: () => {
        traffic.sprite.destroy();
      },
    });
  }

  checkServerOverload(serverIndex) {
    const server = this.servers[serverIndex];

    // If server is already offline, do nothing
    if (!server.isOnline) return;

    // Random chance of overload when at max capacity
    const overloadChance = server.currentCapacity / server.maxCapacity;

    if (Math.random() < overloadChance) {
      this.overloadServer(serverIndex);
    }
  }

  overloadServer(serverIndex) {
    const server = this.servers[serverIndex];

    // Mark server as offline
    server.isOnline = false;

    // Show server down effect
    server.bg.setFillStyle(0x330000);
    server.bg.setStrokeStyle(2, 0xff3333);
    server.statusLabel.setText("OFFLINE");
    server.statusLabel.setFill("#ff3333");

    // Create overload effect
    const flash = this.add.rectangle(
      server.x,
      server.y,
      server.bg.width,
      server.bg.height,
      0xff3333,
      0.7
    );

    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 500,
      yoyo: true,
      repeat: 2,
      onComplete: () => {
        flash.destroy();
      },
    });

    // Reject all traffic assigned to this server
    server.trafficAssigned.forEach((traffic) => {
      // Apply penalty
      this.decreaseHealth(10);

      // Remove traffic with effect
      this.tweens.add({
        targets: traffic.sprite,
        alpha: 0,
        scale: 0.2,
        duration: 300,
        onComplete: () => {
          traffic.sprite.destroy();
        },
      });
    });

    // Clear traffic list
    server.trafficAssigned = [];

    // Reset capacity
    server.currentCapacity = 0;
    server.capacityBar.width = 0;
    server.capacityLabel.setText(`0/${server.maxCapacity}`);

    // Start recovery timer
    this.startServerRecovery(serverIndex);

    // Show message
    this.showMessage(`Server ${serverIndex + 1} overloaded!`, "#ff3333");

    // Reset combo
    this.resetCombo();

    // Play failure sound
    if (this.mainScene && this.mainScene.game.soundManager) {
      this.mainScene.game.soundManager.play("failure");
    }

    // Check if all servers are down
    if (this.servers.every((s) => !s.isOnline)) {
      this.allServersDown();
    }
  }

  startServerRecovery(serverIndex) {
    const server = this.servers[serverIndex];

    // Add recovery countdown
    let recoveryTimeLeft = this.gameConfig.serverRecoveryTime / 1000;

    const recoveryText = this.add
      .text(server.x, server.y, `Rebooting: ${recoveryTimeLeft}s`, {
        font: "16px Arial",
        fill: "#ff9900",
        stroke: "#000",
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    // Progress bar for recovery
    const recoveryBarBg = this.add
      .rectangle(server.x, server.y + 30, 100, 10, 0x333333)
      .setOrigin(0.5);

    const recoveryBar = this.add
      .rectangle(server.x - 50, server.y + 30 - 5, 0, 10, 0xff9900)
      .setOrigin(0, 0);

    // Update recovery time
    server.recoveryTimer = this.time.addEvent({
      delay: 1000,
      callback: () => {
        recoveryTimeLeft--;
        recoveryText.setText(`Rebooting: ${recoveryTimeLeft}s`);

        // Update recovery bar
        const progress =
          1 - recoveryTimeLeft / (this.gameConfig.serverRecoveryTime / 1000);
        recoveryBar.width = progress * 100;

        if (recoveryTimeLeft <= 0) {
          // Bring server back online
          this.recoverServer(serverIndex);

          // Cleanup
          recoveryText.destroy();
          recoveryBarBg.destroy();
          recoveryBar.destroy();

          // Clear timer
          server.recoveryTimer.remove();
          server.recoveryTimer = null;
        }
      },
      callbackScope: this,
      loop: true,
    });
  }

  recoverServer(serverIndex) {
    const server = this.servers[serverIndex];

    // Mark server as online
    server.isOnline = true;

    // Reset visuals
    server.bg.setFillStyle(0x3d3d3d);
    server.bg.setStrokeStyle(2, 0x5d5d5d);
    server.statusLabel.setText("ONLINE");
    server.statusLabel.setFill("#00cc66");

    // Show recovery effect
    const glow = this.add.rectangle(
      server.x,
      server.y,
      server.bg.width,
      server.bg.height,
      0x00cc66,
      0.7
    );

    this.tweens.add({
      targets: glow,
      alpha: 0,
      duration: 500,
      onComplete: () => {
        glow.destroy();
      },
    });

    // Show message
    this.showMessage(`Server ${serverIndex + 1} back online!`, "#00cc66");
  }

  updateTimer() {
    this.timeRemaining--;

    // Update timer display
    this.timerText.setText(`Time: ${this.timeRemaining}s`);

    // Flash timer when low
    if (this.timeRemaining <= 10) {
      this.timerText.setFill("#ff3333");

      if (this.timeRemaining <= 5) {
        // Flash timer text
        this.tweens.add({
          targets: this.timerText,
          alpha: { from: 1, to: 0.5 },
          duration: 200,
          yoyo: true,
        });
      }
    }

    // Check if time is up
    if (this.timeRemaining <= 0) {
      this.endGame(true); // Survived
    }
  }

  addScore(points) {
    // Increase combo
    this.combo++;

    // Apply combo multiplier if combo > 1
    const finalPoints =
      this.combo > 1 ? points * this.gameConfig.comboMultiplier : points;

    // Add to score
    this.score += finalPoints;

    // Update score display
    this.scoreText.setText(`Score: ${this.score}`);

    // Show combo if applicable
    if (this.combo > 1) {
      this.comboText.setText(`Combo: x${this.combo}`);
      this.comboText.setVisible(true);

      // Pulse effect on combo
      this.tweens.add({
        targets: this.comboText,
        scale: { from: 1, to: 1.2, to: 1 },
        duration: 300,
      });
    }

    // Show floating score text
    const { width, height } = this.cameras.main;
    const x = Phaser.Math.Between(width * 0.4, width * 0.6);
    const y = height * 0.4;

    const scorePopup = this.add
      .text(x, y, `+${finalPoints}`, {
        font: "bold 24px Arial",
        fill: this.combo > 1 ? "#ffdd00" : "#00cc66",
        stroke: "#000",
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: scorePopup,
      y: y - 50,
      alpha: { from: 1, to: 0 },
      scale: { from: 1, to: 1.5 },
      duration: 1000,
      onComplete: () => {
        scorePopup.destroy();
      },
    });
  }

  resetCombo() {
    this.combo = 0;
    this.comboText.setVisible(false);
  }

  decreaseHealth(amount) {
    // Reduce system health
    this.systemHealth = Math.max(0, this.systemHealth - amount);

    // Update health bar
    this.healthBar.width = (this.systemHealth / 100) * 200;
    this.healthText.setText(`System Health: ${this.systemHealth}%`);

    // Change color based on health
    if (this.systemHealth < 30) {
      this.healthBar.fillColor = 0xff3333;
    } else if (this.systemHealth < 60) {
      this.healthBar.fillColor = 0xffaa00;
    }

    // Health bar flash effect
    this.tweens.add({
      targets: this.healthBar,
      alpha: { from: 1, to: 0.5 },
      duration: 200,
      yoyo: true,
      repeat: 1,
    });

    // Check for game over
    if (this.systemHealth <= 0) {
      this.endGame(false); // Failed
    }
  }

  allServersDown() {
    // Critical system failure - dramatic effect
    const { width, height } = this.cameras.main;

    // Red flash
    const flash = this.add
      .rectangle(0, 0, width, height, 0xff0000, 0)
      .setOrigin(0);

    this.tweens.add({
      targets: flash,
      alpha: { from: 0, to: 0.5 },
      duration: 200,
      yoyo: true,
      repeat: 3,
      onComplete: () => {
        flash.destroy();
      },
    });

    // Warning message
    const warningText = this.add
      .text(width / 2, height / 2, "ALL SERVERS DOWN!", {
        font: "bold 48px Arial",
        fill: "#ff3333",
        stroke: "#000",
        strokeThickness: 6,
      })
      .setOrigin(0.5)
      .setAlpha(0);

    this.tweens.add({
      targets: warningText,
      alpha: 1,
      scale: { from: 0.5, to: 1.2, to: 1 },
      duration: 1000,
      onComplete: () => {
        this.tweens.add({
          targets: warningText,
          alpha: 0,
          delay: 1000,
          duration: 500,
          onComplete: () => {
            warningText.destroy();
          },
        });
      },
    });

    // Major health penalty
    this.decreaseHealth(50);

    // Play failure sound
    if (this.mainScene && this.mainScene.game.soundManager) {
      this.mainScene.game.soundManager.play("failure");
    }
  }

  showMessage(text, color = "#ffffff") {
    const { width } = this.cameras.main;

    // Create message
    const message = this.add
      .text(width / 2, 120, text, {
        font: "bold 20px Arial",
        fill: color,
        stroke: "#000",
        strokeThickness: 3,
      })
      .setOrigin(0.5)
      .setAlpha(0);

    // Animate in and then fade out
    this.tweens.add({
      targets: message,
      alpha: 1,
      y: 100,
      duration: 300,
      onComplete: () => {
        this.tweens.add({
          targets: message,
          alpha: 0,
          y: 80,
          delay: 1500,
          duration: 300,
          onComplete: () => {
            message.destroy();
          },
        });
      },
    });
  }

  endGame(survived) {
    // Stop the game
    this.gameActive = false;

    // Clear timers
    if (this.gameTimer) {
      this.gameTimer.remove();
    }

    if (this.trafficSpawner) {
      this.trafficSpawner.remove();
    }

    if (this.difficultyTimer) {
      this.difficultyTimer.remove();
    }

    // Server recovery timers
    this.servers.forEach((server) => {
      if (server.recoveryTimer) {
        server.recoveryTimer.remove();
      }
    });

    // Show game over screen
    this.showGameOver(survived);
  }
  returnToMainGame(success) {
    console.log("Callback inside returnToMainGame:", this.callback);
    // Stop any running timers
    if (this.gameTimer) {
      this.gameTimer.remove();
    }

    if (this.trafficSpawner) {
      this.trafficSpawner.remove();
    }

    if (this.difficultyTimer) {
      this.difficultyTimer.remove();
    }

    // Clear server recovery timers
    this.servers.forEach((server) => {
      if (server.recoveryTimer) {
        server.recoveryTimer.remove();
      }
    });

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
        threatType: "ddos",
      });
    }
  }

  // Updated showGameOver method for DDOSMiniGame.js
  showGameOver(survived) {
    const { width, height } = this.cameras.main;

    // Create overlay
    const overlay = this.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      0x000000,
      0.7
    );

    // Create result panel
    const resultPanel = this.add
      .rectangle(
        width / 2,
        height / 2,
        400,
        300,
        survived ? 0x002244 : 0x220000
      )
      .setStrokeStyle(3, survived ? 0x00aaff : 0xff3333);

    // Result title
    const titleText = survived ? "ATTACK DEFENDED!" : "DEFENSE FAILED!";
    const titleColor = survived ? "#00cc66" : "#ff3333";

    const title = this.add
      .text(width / 2, height / 2 - 100, titleText, {
        font: "bold 32px Arial",
        fill: titleColor,
      })
      .setOrigin(0.5);

    // Stats
    const statsY = height / 2 - 40;

    // Score
    const scoreText = this.add
      .text(width / 2, statsY, `Final Score: ${this.score}`, {
        font: "20px Arial",
        fill: "#ffffff",
      })
      .setOrigin(0.5);

    // Time defended
    const timeText = this.add
      .text(
        width / 2,
        statsY + 40,
        survived
          ? "Defended for: full duration"
          : `Defended for: ${this.gameConfig.duration - this.timeRemaining}s`,
        {
          font: "20px Arial",
          fill: "#ffffff",
        }
      )
      .setOrigin(0.5);

    // Waves survived
    const waveText = this.add
      .text(width / 2, statsY + 80, `Attack Waves: ${this.currentDifficulty}`, {
        font: "20px Arial",
        fill: "#ffffff",
      })
      .setOrigin(0.5);

    // Button color based on success/failure
    const buttonColor = survived ? 0x00aa66 : 0xaa0000;
    const buttonHoverColor = survived ? 0x00bb77 : 0xcc0000;
    const buttonStrokeColor = survived ? 0x00cc88 : 0xff3333;

    // Create the rectangle first
    const continueButton = this.add
      .rectangle(width / 2, height / 2 + 130, 200, 50, buttonColor)
      .setStrokeStyle(2, buttonStrokeColor);

    // Add interactivity separately
    continueButton.setInteractive({ useHandCursor: true, pixelPerfect: false });

    // Add event handlers
    continueButton.on(
      "pointerover",
      function () {
        this.setFillStyle(buttonHoverColor);
      },
      continueButton
    );

    continueButton.on(
      "pointerout",
      function () {
        this.setFillStyle(buttonColor);
      },
      continueButton
    );

    const self = this;
    continueButton.on("pointerdown", function () {
      self.returnToMainGame(survived);
    });

    const continueText = this.add
      .text(width / 2, height / 2 + 130, survived ? "CONTINUE" : "TRY AGAIN", {
        font: "bold 20px Arial",
        fill: "#ffffff",
      })
      .setOrigin(0.5);

    // Play appropriate sound
    if (this.mainScene && this.mainScene.game.soundManager) {
      if (survived) {
        this.mainScene.game.soundManager.play("success");
      } else {
        this.mainScene.game.soundManager.play("failure");
      }
    }
  }

  update() {
    // Check for dropped packets (traffic that stays in queue too long)
    const currentTime = Date.now();
    const maxQueueTime = 8000; // ms before traffic times out

    const expiredTraffic = this.trafficQueue.filter((traffic) => {
      return currentTime - traffic.id > maxQueueTime;
    });

    // Remove expired traffic
    expiredTraffic.forEach((traffic) => {
      // Remove from queue
      this.trafficQueue = this.trafficQueue.filter((t) => t.id !== traffic.id);

      // Penalty for dropped traffic
      this.decreaseHealth(this.gameConfig.packetPenalty / 2); // Half penalty for queue expiry

      // Reset combo
      this.resetCombo();

      // Show drop effect
      this.tweens.add({
        targets: traffic.sprite,
        y: "+=" + 100,
        alpha: 0,
        duration: 500,
        onComplete: () => {
          traffic.sprite.destroy();
        },
      });
    });

    // Game difficulty scaling - make traffic queue position more scattered as difficulty increases
    if (this.gameActive && this.trafficQueue.length > 0) {
      const queueSpread = Math.min(200, 50 + this.currentDifficulty * 20);

      // Update position of traffic in queue to be more scattered at higher difficulties
      this.trafficQueue.forEach((traffic) => {
        const randomX = Phaser.Math.Between(-queueSpread, queueSpread);
        const randomY = Phaser.Math.Between(-20, 20);

        if (
          traffic.targetX !== this.loadBalancer.x + randomX ||
          traffic.targetY !== this.loadBalancer.queueY + randomY
        ) {
          traffic.targetX = this.loadBalancer.x + randomX;
          traffic.targetY = this.loadBalancer.queueY + randomY;

          // Subtle movement in queue
          this.tweens.add({
            targets: traffic.sprite,
            x: traffic.targetX,
            y: traffic.targetY,
            duration: 2000,
            ease: "Sine.easeInOut",
          });
        }
      });
    }
  }
}
