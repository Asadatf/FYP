// RootkitMiniGame.js - Mini game for the rootkit threat with fixes
class RootkitMiniGame extends Phaser.Scene {
  constructor() {
    super("RootkitMiniGame");
    this.timeLeft = 40; // 40 seconds time limit
    this.score = 0;
    this.threatType = "rootkit";
    this.directories = [];
    this.totalRootkits = 4;
    this.rootkitsFound = 0;
    this.scansRemaining = 8;
    this.hintUsed = false;
    this.consecutiveRootkitsFound = 0; // Track consecutive rootkit finds
    this.resultOverlay = null; // Reference to the result overlay
    this.resultPanel = null; // Reference to the result panel
    this.resultComponents = []; // References to all result screen elements

    // Directory structure for file system
    this.directoryStructure = [
      { name: "/system", icon: "🖥️", hasChildren: true },
      { name: "/system/bin", icon: "⚙️", hasChildren: false },
      { name: "/system/lib", icon: "📚", hasChildren: true },
      { name: "/system/lib/drivers", icon: "🔌", hasChildren: false },
      { name: "/system/config", icon: "⚙️", hasChildren: false },
      { name: "/user", icon: "👤", hasChildren: true },
      { name: "/user/docs", icon: "📄", hasChildren: false },
      { name: "/user/apps", icon: "📲", hasChildren: false },
      { name: "/network", icon: "🌐", hasChildren: true },
      { name: "/network/services", icon: "🔄", hasChildren: false },
      { name: "/network/logs", icon: "📋", hasChildren: false },
      { name: "/boot", icon: "🚀", hasChildren: false },
      { name: "/var", icon: "📂", hasChildren: true },
      { name: "/var/logs", icon: "📋", hasChildren: false },
      { name: "/var/temp", icon: "🧊", hasChildren: false },
      { name: "/dev", icon: "💽", hasChildren: false },
    ];
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
      .text(width / 2, 30, "SYSTEM SCAN QUEST", {
        font: "bold 28px Arial",
        fill: "#00cc99",
        stroke: "#000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    // Instructions
    this.add
      .text(
        width / 2,
        80,
        "Find all rootkits hiding in your system directories!\nUse your scanners wisely - you have limited scans.",
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

    // Display scans remaining
    this.scanText = this.add
      .text(120, 30, `Scans: ${this.scansRemaining}`, {
        font: "18px Arial",
        fill: "#00aaff",
      })
      .setOrigin(0.5);

    // Create progress display
    this.progressText = this.add
      .text(
        width / 2,
        150,
        `Rootkits: ${this.rootkitsFound}/${this.totalRootkits}`,
        {
          font: "16px Arial",
          fill: "#ffffff",
          backgroundColor: "#333333",
          padding: { x: 10, y: 5 },
        }
      )
      .setOrigin(0.5);

    // Create status text for consecutive rootkits
    this.streakText = this.add
      .text(width / 2, 180, "", {
        font: "14px Arial",
        fill: "#ffaa00",
        padding: { x: 5, y: 2 },
      })
      .setOrigin(0.5)
      .setVisible(false);

    // Create file system explorer
    this.createFileSystem();

    // Place rootkits randomly in directories
    this.placeRootkits();

    // Add hint button
    this.addHintButton();

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
    this.add.rectangle(0, 0, width, height, 0x001a15).setOrigin(0);

    // Create cyber grid effect
    const bgGraphics = this.add.graphics();
    bgGraphics.lineStyle(1, 0x00664d, 0.1);

    // Draw grid effect
    for (let i = 0; i < 20; i++) {
      const y = i * 40;
      bgGraphics.lineBetween(0, y, width, y);
    }

    for (let i = 0; i < 30; i++) {
      const x = i * 40;
      bgGraphics.lineBetween(x, 0, x, height);
    }

    // Add some decorative elements
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = 0.2 + Math.random() * 0.3;
      const alpha = 0.1 + Math.random() * 0.2;

      this.add
        .text(x, y, "🌱", {
          font: "24px Arial",
        })
        .setAlpha(alpha)
        .setScale(size);
    }
  }

  createFileSystem() {
    const { width, height } = this.cameras.main;

    // Create grid layout for directories
    const gridWidth = 4;
    const gridHeight = 4;
    const cellWidth = 160;
    const cellHeight = 100;
    const startX = (width - gridWidth * cellWidth) / 2 + cellWidth / 2;
    const startY = 200;

    // Create directory tiles
    for (let i = 0; i < this.directoryStructure.length; i++) {
      const row = Math.floor(i / gridWidth);
      const col = i % gridWidth;
      const x = startX + col * cellWidth;
      const y = startY + row * cellHeight;

      const dirInfo = this.directoryStructure[i];

      // Directory container
      const dirContainer = this.add.container(x, y);

      // Directory background
      const dirBg = this.add
        .rectangle(0, 0, cellWidth - 20, cellHeight - 20, 0x003326)
        .setStrokeStyle(2, 0x00664d);

      // Directory icon
      const icon = this.add
        .text(-50, 0, dirInfo.icon, {
          font: "24px Arial",
        })
        .setOrigin(0.5);

      // Directory name
      const nameText = this.add
        .text(15, 0, dirInfo.name, {
          font: "14px monospace",
          fill: "#ffffff",
        })
        .setOrigin(0, 0.5);

      // Add elements to container
      dirContainer.add([dirBg, icon, nameText]);

      // Create scan button
      const scanButton = this.add
        .rectangle(50, 25, 70, 24, 0x008066)
        .setStrokeStyle(1, 0x00b392);

      const scanText = this.add
        .text(50, 25, "SCAN", {
          font: "12px Arial",
          fill: "#ffffff",
        })
        .setOrigin(0.5);

      // Add scan button to container
      dirContainer.add([scanButton, scanText]);

      // Make the scan button interactive
      scanButton
        .setInteractive({ useHandCursor: true })
        .on("pointerover", () => scanButton.setFillStyle(0x00997a))
        .on("pointerout", () => scanButton.setFillStyle(0x008066))
        .on("pointerdown", () => this.scanDirectory(i));

      // Store directory data
      this.directories.push({
        container: dirContainer,
        bg: dirBg,
        hasRootkit: false,
        scanned: false,
        scanButton: scanButton,
        scanText: scanText,
        info: dirInfo,
      });
    }
  }

  placeRootkits() {
    // Choose random directories to place rootkits
    const dirIndices = [...Array(this.directoryStructure.length).keys()];
    const shuffledIndices = Phaser.Utils.Array.Shuffle([...dirIndices]);
    const rootkitIndices = shuffledIndices.slice(0, this.totalRootkits);

    // Place rootkits
    rootkitIndices.forEach((index) => {
      this.directories[index].hasRootkit = true;
    });
  }

  addHintButton() {
    const { width, height } = this.cameras.main;

    // Create hint button
    const hintButton = this.add
      .rectangle(width - 100, height - 40, 150, 40, 0x00664d)
      .setStrokeStyle(1, 0x00997a)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => {
        if (!this.hintUsed) hintButton.setFillStyle(0x00997a);
      })
      .on("pointerout", () => {
        if (!this.hintUsed) hintButton.setFillStyle(0x00664d);
      })
      .on("pointerdown", () => this.useHint());

    this.add
      .text(width - 100, height - 40, "USE LOG ANALYZER", {
        font: "14px Arial",
        fill: "#ffffff",
      })
      .setOrigin(0.5);

    this.hintButton = hintButton;
  }

  scanDirectory(index) {
    const dir = this.directories[index];

    // Only scan if we have scans remaining and directory hasn't been scanned
    if (this.scansRemaining <= 0 || dir.scanned) return;

    // Use a scan
    this.scansRemaining--;
    this.scanText.setText(`Scans: ${this.scansRemaining}`);
    dir.scanned = true;

    // Play scan animation
    this.tweens.add({
      targets: [dir.bg, dir.scanButton],
      alpha: { from: 1, to: 0.5 },
      scaleX: { from: 1, to: 0.95 },
      scaleY: { from: 1, to: 0.95 },
      duration: 200,
      yoyo: true,
      repeat: 2,
      onComplete: () => {
        this.revealScanResults(index);
      },
    });

    // Play sound
    this.game.soundManager.play("button-click");
  }

  revealScanResults(index) {
    const dir = this.directories[index];

    // Change the scan button to show result
    dir.scanButton.setFillStyle(dir.hasRootkit ? 0xcc0000 : 0x00cc66);
    dir.scanText.setText(dir.hasRootkit ? "INFECTED" : "CLEAN");

    // If rootkit is found, increment counter and score
    if (dir.hasRootkit) {
      this.rootkitsFound++;
      this.progressText.setText(
        `Rootkits: ${this.rootkitsFound}/${this.totalRootkits}`
      );

      // Increment consecutive rootkits counter
      this.consecutiveRootkitsFound++;

      // Check if player found 2 rootkits in a row
      if (this.consecutiveRootkitsFound == 2 && this.hintUsed) {
        // Reset the hint
        this.hintUsed = false;
        this.hintButton.setFillStyle(0x00664d);

        // Show message about hint being available again
        this.streakText.setText(
          "Log Analyzer recharged! 2 rootkits found in a row!"
        );
        this.streakText.setVisible(true);

        // Flash animation on the hint button
        this.tweens.add({
          targets: this.hintButton,
          fillColor: { from: 0x00664d, to: 0x00ff99 },
          duration: 300,
          yoyo: true,
          repeat: 3,
        });

        // Make streak message disappear after a few seconds
        this.time.delayedCall(3000, () => {
          this.streakText.setVisible(false);
        });
      }

      // Add score based on remaining scans (efficiency bonus)
      const baseScore = 25;
      const scanBonus = this.scansRemaining * 5;
      const pointsEarned = baseScore + scanBonus;

      this.score += pointsEarned;
      this.scoreText.setText(`Score: ${this.score}`);

      // Show points earned
      const pointsText = this.add
        .text(dir.container.x, dir.container.y - 40, `+${pointsEarned}`, {
          font: "bold 18px Arial",
          fill: "#00ff66",
        })
        .setOrigin(0.5);

      this.tweens.add({
        targets: pointsText,
        y: "-=30",
        alpha: { from: 1, to: 0 },
        duration: 1500,
        onComplete: () => pointsText.destroy(),
      });

      // Play success sound
      this.game.soundManager.play("success");

      // Check if all rootkits are found
      if (this.rootkitsFound >= this.totalRootkits) {
        this.miniGameSuccess();
      }
    } else {
      // Reset consecutive rootkits counter when scanning clean directory
      this.consecutiveRootkitsFound = 0;

      // Penalty for scanning clean directory
      this.score -= 5;
      this.scoreText.setText(`Score: ${this.score}`);

      // Play negative sound
      this.game.soundManager.play("button-click");
    }

    // Check if out of scans but not all rootkits found
    if (this.scansRemaining <= 0 && this.rootkitsFound < this.totalRootkits) {
      this.miniGameFailure();
    }
  }

  useHint() {
    // Can only use hint once (unless recharged)
    if (this.hintUsed) return;

    this.hintUsed = true;
    this.hintButton.setFillStyle(0x333333);

    // Find an infected directory that hasn't been scanned
    const hiddenRootkits = this.directories.filter(
      (dir) => dir.hasRootkit && !dir.scanned
    );

    if (hiddenRootkits.length > 0) {
      // Randomly select one hidden rootkit to hint
      const selectedDir = Phaser.Utils.Array.GetRandom(hiddenRootkits);

      // Show hint animation pointing to this directory
      const hintArrow = this.add
        .text(selectedDir.container.x, selectedDir.container.y - 40, "⚠️", {
          font: "24px Arial",
        })
        .setOrigin(0.5);

      this.tweens.add({
        targets: hintArrow,
        y: "-=10",
        duration: 500,
        yoyo: true,
        repeat: 5,
        onComplete: () => hintArrow.destroy(),
      });

      // Also pulse the directory
      this.tweens.add({
        targets: selectedDir.bg,
        strokeColor: 0xff9900,
        duration: 300,
        yoyo: true,
        repeat: 5,
        onComplete: () => {
          selectedDir.bg.setStrokeStyle(2, 0x00664d);
        },
      });

      // Play hint sound
      this.game.soundManager.play("button-click");
    }
  }

  updateTimer() {
    this.timeLeft--;
    this.timerText.setText(`Time: ${this.timeLeft}s`);

    // Time's up
    if (this.timeLeft <= 0) {
      this.countdownTimer.remove();

      // Check if player found enough rootkits
      if (this.rootkitsFound >= this.totalRootkits) {
        this.miniGameSuccess();
      } else {
        this.miniGameFailure();
      }
    }

    // Make timer text red when time is running out
    if (this.timeLeft <= 10) {
      this.timerText.setColor("#ff3333");

      // Add pulsing animation when time is low
      if (this.timeLeft === 10) {
        this.tweens.add({
          targets: this.timerText,
          scale: { from: 1, to: 1.2 },
          duration: 500,
          yoyo: true,
          repeat: 1,
        });
      }
    }
  }

  miniGameSuccess() {
    // Stop the timer
    if (this.countdownTimer) {
      this.countdownTimer.remove();
    }

    // Calculate bonus based on time left and scans remaining
    const timeBonus = this.timeLeft * 3;
    const scanBonus = this.scansRemaining * 10;
    const totalBonus = timeBonus + scanBonus;
    this.score += totalBonus;

    // Display success message
    const { width, height } = this.cameras.main;
    this.resultOverlay = this.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      0x000000,
      0.7
    );
    this.resultComponents.push(this.resultOverlay);

    this.resultPanel = this.add
      .rectangle(width / 2, height / 2, 400, 350, 0x003326)
      .setStrokeStyle(3, 0x00cc99);
    this.resultComponents.push(this.resultPanel);

    const successTitle = this.add
      .text(width / 2, height / 2 - 130, "SYSTEM CLEANED!", {
        font: "bold 32px Arial",
        fill: "#00cc99",
      })
      .setOrigin(0.5);
    this.resultComponents.push(successTitle);

    const resultText = this.add
      .text(
        width / 2,
        height / 2 - 80,
        `Rootkits Removed: ${this.rootkitsFound}/${this.totalRootkits}`,
        {
          font: "20px Arial",
          fill: "#ffffff",
        }
      )
      .setOrigin(0.5);
    this.resultComponents.push(resultText);

    const scanText = this.add
      .text(
        width / 2,
        height / 2 - 40,
        `Scans Remaining: ${this.scansRemaining}`,
        {
          font: "18px Arial",
          fill: "#00aaff",
        }
      )
      .setOrigin(0.5);
    this.resultComponents.push(scanText);

    const timeBonusText = this.add
      .text(width / 2, height / 2, `Time Bonus: +${timeBonus}`, {
        font: "18px Arial",
        fill: "#ffcc00",
      })
      .setOrigin(0.5);
    this.resultComponents.push(timeBonusText);

    const scanBonusText = this.add
      .text(
        width / 2,
        height / 2 + 30,
        `Scan Efficiency Bonus: +${scanBonus}`,
        {
          font: "18px Arial",
          fill: "#ffcc00",
        }
      )
      .setOrigin(0.5);
    this.resultComponents.push(scanBonusText);

    const totalBonusText = this.add
      .text(width / 2, height / 2 + 60, `Total Bonus: +${totalBonus}`, {
        font: "18px Arial",
        fill: "#ffcc00",
      })
      .setOrigin(0.5);
    this.resultComponents.push(totalBonusText);

    const finalScoreText = this.add
      .text(width / 2, height / 2 + 100, `Total Score: ${this.score}`, {
        font: "bold 24px Arial",
        fill: "#00aaff",
      })
      .setOrigin(0.5);
    this.resultComponents.push(finalScoreText);

    // Continue button
    const continueButton = this.add
      .rectangle(width / 2, height / 2 + 150, 200, 50, 0x00aa66)
      .setStrokeStyle(2, 0x00cc88)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => continueButton.setFillStyle(0x00bb77))
      .on("pointerout", () => continueButton.setFillStyle(0x00aa66))
      .on("pointerdown", () => this.returnToMainGame(true));
    this.resultComponents.push(continueButton);

    const continueText = this.add
      .text(width / 2, height / 2 + 150, "CONTINUE", {
        font: "bold 20px Arial",
        fill: "#ffffff",
      })
      .setOrigin(0.5);
    this.resultComponents.push(continueText);

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
    this.resultOverlay = this.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      0x000000,
      0.7
    );
    this.resultComponents.push(this.resultOverlay);

    this.resultPanel = this.add
      .rectangle(width / 2, height / 2, 400, 350, 0x330000)
      .setStrokeStyle(3, 0xff3333);
    this.resultComponents.push(this.resultPanel);

    const failureTitle = this.add
      .text(width / 2, height / 2 - 130, "ROOTKITS REMAIN!", {
        font: "bold 32px Arial",
        fill: "#ff3333",
      })
      .setOrigin(0.5);
    this.resultComponents.push(failureTitle);

    const resultText = this.add
      .text(
        width / 2,
        height / 2 - 80,
        `Rootkits Found: ${this.rootkitsFound}/${this.totalRootkits}`,
        {
          font: "20px Arial",
          fill: "#ffffff",
        }
      )
      .setOrigin(0.5);
    this.resultComponents.push(resultText);

    const missingText = this.add
      .text(
        width / 2,
        height / 2 - 40,
        `Rootkits Remaining: ${this.totalRootkits - this.rootkitsFound}`,
        {
          font: "20px Arial",
          fill: "#ff6666",
        }
      )
      .setOrigin(0.5);
    this.resultComponents.push(missingText);

    const failReason =
      this.scansRemaining <= 0
        ? "You ran out of scans!"
        : "You ran out of time!";

    const reasonText = this.add
      .text(width / 2, height / 2, failReason, {
        font: "18px Arial",
        fill: "#ffdd00",
      })
      .setOrigin(0.5);
    this.resultComponents.push(reasonText);

    const tipText = this.add
      .text(
        width / 2,
        height / 2 + 40,
        "Tip: Use the Log Analyzer to find hidden rootkits\nand scan each directory carefully!",
        {
          font: "16px Arial",
          fill: "#00aaff",
          align: "center",
        }
      )
      .setOrigin(0.5);
    this.resultComponents.push(tipText);

    // Show where the rootkits were hiding
    const revealText = this.add
      .text(
        width / 2,
        height / 2 + 80,
        "The remaining rootkits were hiding in:",
        {
          font: "16px Arial",
          fill: "#ffffff",
        }
      )
      .setOrigin(0.5);
    this.resultComponents.push(revealText);

    // List missed rootkit locations
    const missedRootkits = this.directories.filter(
      (dir) => dir.hasRootkit && !dir.scanned
    );

    if (missedRootkits.length > 0) {
      let locations = "";
      missedRootkits.forEach((dir, i) => {
        locations += dir.info.name;
        if (i < missedRootkits.length - 1) locations += ", ";
      });

      const locationsText = this.add
        .text(width / 2, height / 2 + 110, locations, {
          font: "14px monospace",
          fill: "#ff9999",
          align: "center",
          wordWrap: { width: 350 },
        })
        .setOrigin(0.5);
      this.resultComponents.push(locationsText);
    }

    // Try again button
    const tryAgainButton = this.add
      .rectangle(width / 2, height / 2 + 150, 200, 50, 0xaa0000)
      .setStrokeStyle(2, 0xff3333)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => tryAgainButton.setFillStyle(0xcc0000))
      .on("pointerout", () => tryAgainButton.setFillStyle(0xaa0000))
      .on("pointerdown", () => this.restartMiniGame());
    this.resultComponents.push(tryAgainButton);

    const tryAgainText = this.add
      .text(width / 2, height / 2 + 150, "TRY AGAIN", {
        font: "bold 20px Arial",
        fill: "#ffffff",
      })
      .setOrigin(0.5);
    this.resultComponents.push(tryAgainText);

    // Play failure sound
    this.game.soundManager.play("failure");
  }

  restartMiniGame() {
    // Stop any running timers
    if (this.countdownTimer) {
      this.countdownTimer.remove();
      this.countdownTimer = null;
    }

    // Clear the result overlay and components
    this.resultComponents.forEach((component) => {
      if (component && component.destroy) {
        component.destroy();
      }
    });
    this.resultComponents = [];

    // Reset game state variables
    this.timeLeft = 40; // Reset time
    this.rootkitsFound = 0;
    this.scansRemaining = 8;
    this.hintUsed = false;
    this.consecutiveRootkitsFound = 0;

    // Reset UI text
    this.timerText.setText(`Time: ${this.timeLeft}s`);
    this.timerText.setColor("#ffdd00"); // Reset color
    this.timerText.setScale(1); // Reset scale from animations
    this.scanText.setText(`Scans: ${this.scansRemaining}`);
    this.progressText.setText(
      `Rootkits: ${this.rootkitsFound}/${this.totalRootkits}`
    );
    this.streakText.setVisible(false);

    // Reset directories
    this.directories.forEach((dir) => {
      // Reset scan state
      dir.scanned = false;
      dir.hasRootkit = false;

      // Reset visual appearance
      dir.bg.setStrokeStyle(2, 0x00664d);
      dir.scanButton.setFillStyle(0x008066);
      dir.scanText.setText("SCAN");
    });

    // Re-place rootkits
    this.placeRootkits();

    // Reset hint button
    this.hintButton.setFillStyle(0x00664d);

    // Restart timer
    this.countdownTimer = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    });
  }

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
