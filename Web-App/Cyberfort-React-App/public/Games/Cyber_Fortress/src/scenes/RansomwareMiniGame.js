// RansomwareMiniGame.js - Mini game for the ransomware threat with fixed Try Again button
class RansomwareMiniGame extends Phaser.Scene {
  constructor() {
    super("RansomwareMiniGame");
    this.timeLeft = 45; // 45 seconds time limit
    this.score = 0;
    this.threatType = "ransomware";
    this.files = [];
    this.totalFiles = 12;
    this.backupsRemaining = 5;
    this.filesSaved = 0;
    this.filesLost = 0;
    this.fileTypes = [
      { name: "Financial Records", value: 3, icon: "💰" },
      { name: "Customer Database", value: 3, icon: "👥" },
      { name: "Business Plan", value: 2, icon: "📈" },
      { name: "Email Archive", value: 2, icon: "📧" },
      { name: "Source Code", value: 2, icon: "💻" },
      { name: "Product Designs", value: 2, icon: "🎨" },
      { name: "HR Records", value: 1, icon: "📁" },
      { name: "Media Files", value: 1, icon: "🎬" },
    ];
    this.encryptionInterval = null;
    this.nextEncryptionTime = 0;
    this.resultComponents = []; // Add this to track result screen elements
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
      .text(width / 2, 30, "BACKUP BLITZ", {
        font: "bold 28px Arial",
        fill: "#ff6600",
        stroke: "#000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    // Instructions
    this.add
      .text(
        width / 2,
        80,
        "Back up critical files before ransomware encrypts them!\nUse your limited backups wisely.",
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

    // Display backups remaining
    this.backupText = this.add
      .text(120, 30, `Backups: ${this.backupsRemaining}`, {
        font: "18px Arial",
        fill: "#00aaff",
      })
      .setOrigin(0.5);

    // Create status display
    this.statusText = this.add
      .text(
        width / 2,
        150,
        `Files Saved: ${this.filesSaved} | Files Lost: ${this.filesLost}`,
        {
          font: "16px Arial",
          fill: "#ffffff",
          backgroundColor: "#333333",
          padding: { x: 10, y: 5 },
        }
      )
      .setOrigin(0.5);

    // Create file grid
    this.createFileGrid();

    // Start timer
    this.countdownTimer = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    });

    // Start ransomware encryption timer
    this.scheduleNextEncryption();

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
    this.add.rectangle(0, 0, width, height, 0x220a00).setOrigin(0);

    // Create cyber grid effect
    const bgGraphics = this.add.graphics();
    bgGraphics.lineStyle(1, 0xaa3300, 0.1);

    // Draw grid effect
    for (let i = 0; i < 20; i++) {
      const y = i * 40;
      bgGraphics.lineBetween(0, y, width, y);
    }

    for (let i = 0; i < 30; i++) {
      const x = i * 40;
      bgGraphics.lineBetween(x, 0, x, height);
    }

    // Add some lock icons in the background
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const alpha = 0.05 + Math.random() * 0.1;
      const size = 0.5 + Math.random() * 1.5;

      this.add
        .text(x, y, "🔒", {
          font: "24px Arial",
        })
        .setAlpha(alpha)
        .setScale(size);
    }
  }

  createFileGrid() {
    const { width, height } = this.cameras.main;

    // Define grid layout
    const cols = 4;
    const rows = 3;
    const cellWidth = 160;
    const cellHeight = 120;
    const startX = (width - cols * cellWidth) / 2 + cellWidth / 2;
    const startY = 200;

    // Shuffle file types to get a random selection
    const shuffledFileTypes = Phaser.Utils.Array.Shuffle([...this.fileTypes]);

    // Create files in a grid
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = startX + col * cellWidth;
        const y = startY + row * cellHeight;
        const index = row * cols + col;

        // Select file type (with repeats if needed)
        const fileType = shuffledFileTypes[index % shuffledFileTypes.length];

        // Create file container
        const fileContainer = this.add.container(x, y);

        // File background
        const fileBg = this.add
          .rectangle(0, 0, cellWidth - 20, cellHeight - 20, 0x552200)
          .setStrokeStyle(2, 0xcc6600);

        // File icon
        const icon = this.add
          .text(0, -30, fileType.icon, {
            font: "32px Arial",
          })
          .setOrigin(0.5);

        // File name
        const nameText = this.add
          .text(0, 0, fileType.name, {
            font: "bold 14px Arial",
            fill: "#ffffff",
          })
          .setOrigin(0.5);

        // File value indicator (stars)
        let valueText = "";
        for (let i = 0; i < fileType.value; i++) {
          valueText += "⭐";
        }

        const valueDisplay = this.add
          .text(0, 25, valueText, {
            font: "14px Arial",
          })
          .setOrigin(0.5);

        // Add to container
        fileContainer.add([fileBg, icon, nameText, valueDisplay]);

        // Store file info
        this.files.push({
          container: fileContainer,
          bg: fileBg,
          icon: icon,
          nameText: nameText,
          valueDisplay: valueDisplay,
          type: fileType,
          state: "normal", // normal, backed-up, encrypted
          index: index,
          // Create backup and lock overlays (hidden initially)
          backupOverlay: this.add
            .text(0, 0, "✅", { font: "48px Arial" })
            .setOrigin(0.5)
            .setVisible(false)
            .setAlpha(0.9),
          lockOverlay: this.add
            .text(0, 0, "🔒", { font: "48px Arial" })
            .setOrigin(0.5)
            .setVisible(false)
            .setAlpha(0.9),
        });

        // Add overlays to container
        fileContainer.add([
          this.files[index].backupOverlay,
          this.files[index].lockOverlay,
        ]);

        // Make file interactive
        fileBg
          .setInteractive({ useHandCursor: true })
          .on("pointerover", () => {
            if (this.files[index].state === "normal") {
              fileBg.setFillStyle(0x663300);
            }
          })
          .on("pointerout", () => {
            if (this.files[index].state === "normal") {
              fileBg.setFillStyle(0x552200);
            }
          })
          .on("pointerdown", () => {
            this.backupFile(index);
          });
      }
    }
  }

  backupFile(index) {
    const file = this.files[index];

    // Only backup if file is not already backed up or encrypted
    if (file.state !== "normal" || this.backupsRemaining <= 0) return;

    // Use a backup
    this.backupsRemaining--;
    this.backupText.setText(`Backups: ${this.backupsRemaining}`);

    // Mark file as backed up
    file.state = "backed-up";
    file.backupOverlay.setVisible(true);

    // Show backup animation
    this.tweens.add({
      targets: file.backupOverlay,
      scale: { from: 0.5, to: 1 },
      alpha: { from: 0, to: 0.9 },
      duration: 300,
      ease: "Back.easeOut",
    });

    // Update file counts
    this.filesSaved++;
    this.updateStatusText();

    // Increase score
    this.score += file.type.value * 10;
    this.scoreText.setText(`Score: ${this.score}`);

    // Play backup sound
    this.game.soundManager.play("success");

    // Check if all files are handled
    this.checkGameCompletion();
  }

  encryptRandomFile() {
    // Find files that can be encrypted (not already backed-up or encrypted)
    const availableFiles = this.files.filter((file) => file.state === "normal");

    if (availableFiles.length === 0) return;

    // Select 1-2 random files to encrypt
    const filesToEncrypt = Phaser.Utils.Array.Shuffle([
      ...availableFiles,
    ]).slice(
      0,
      Math.min(1 + Math.floor(Math.random() * 2), availableFiles.length)
    );

    filesToEncrypt.forEach((file) => {
      // Mark file as encrypted
      file.state = "encrypted";
      file.lockOverlay.setVisible(true);

      // Show encryption animation
      this.tweens.add({
        targets: file.container,
        scaleX: { from: 1, to: 0.95 },
        scaleY: { from: 1, to: 0.95 },
        duration: 200,
        yoyo: true,
        repeat: 2,
      });

      this.tweens.add({
        targets: file.lockOverlay,
        scale: { from: 0.5, to: 1 },
        alpha: { from: 0, to: 0.9 },
        duration: 300,
        ease: "Back.easeOut",
      });

      // Dim the file
      this.tweens.add({
        targets: [file.icon, file.nameText, file.valueDisplay],
        alpha: 0.4,
        duration: 300,
      });

      // Update file counts
      this.filesLost++;
      this.updateStatusText();

      // Play encryption sound
      this.game.soundManager.play("failure");

      // Check if all files are handled
      this.checkGameCompletion();
    });

    // Schedule next encryption
    this.scheduleNextEncryption();
  }

  scheduleNextEncryption() {
    // Cancel any existing timer
    if (this.encryptionInterval) {
      this.encryptionInterval.remove();
    }

    // Calculate next encryption time (5-10 seconds)
    const delay = 5000 + Math.random() * 5000;

    this.encryptionInterval = this.time.delayedCall(
      delay,
      this.encryptRandomFile,
      [],
      this
    );
    this.nextEncryptionTime = this.time.now + delay;
  }

  updateStatusText() {
    this.statusText.setText(
      `Files Saved: ${this.filesSaved} | Files Lost: ${this.filesLost}`
    );
  }

  checkGameCompletion() {
    // Game is complete when all files are either backed up or encrypted
    const allFilesHandled = this.files.every((file) => file.state !== "normal");
    const noBackupsLeft = this.backupsRemaining <= 0;

    if (
      allFilesHandled ||
      (noBackupsLeft && this.filesLost + this.filesSaved === this.totalFiles)
    ) {
      // Stop the timers
      if (this.countdownTimer) {
        this.countdownTimer.remove();
      }

      if (this.encryptionInterval) {
        this.encryptionInterval.remove();
      }

      // Check if player saved enough files to win
      if (
        this.filesSaved > this.filesLost &&
        this.filesSaved >= this.totalFiles / 2
      ) {
        this.miniGameSuccess();
      } else {
        this.miniGameFailure();
      }
    }
  }

  updateTimer() {
    this.timeLeft--;
    this.timerText.setText(`Time: ${this.timeLeft}s`);

    // Time's up
    if (this.timeLeft <= 0) {
      this.countdownTimer.remove();

      // Stop encryption timer
      if (this.encryptionInterval) {
        this.encryptionInterval.remove();
      }

      // Encrypt all remaining unprotected files
      this.files.forEach((file) => {
        if (file.state === "normal") {
          file.state = "encrypted";
          file.lockOverlay.setVisible(true);

          // Dim the file
          this.tweens.add({
            targets: [file.icon, file.nameText, file.valueDisplay],
            alpha: 0.4,
            duration: 300,
          });

          this.filesLost++;
        }
      });

      this.updateStatusText();

      // Check if player saved enough files to win
      if (
        this.filesSaved > this.filesLost &&
        this.filesSaved >= this.totalFiles / 2
      ) {
        this.miniGameSuccess();
      } else {
        this.miniGameFailure();
      }
    }

    // Show warning when encryption is coming soon
    const timeToEncryption = this.nextEncryptionTime - this.time.now;
    if (timeToEncryption <= 3000 && timeToEncryption > 0) {
      // Pulse the status text to warn player
      if (!this.warningActive) {
        this.warningActive = true;
        this.statusText.setBackgroundColor("#aa0000");
        this.tweens.add({
          targets: this.statusText,
          scale: { from: 1, to: 1.1 },
          duration: 300,
          yoyo: true,
          repeat: 3,
          onComplete: () => {
            this.statusText.setBackgroundColor("#333333");
            this.warningActive = false;
          },
        });
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
    // Calculate bonus based on time left and files saved
    const timeBonus = this.timeLeft * 2;
    const fileBonus = this.filesSaved * 10;
    const totalBonus = timeBonus + fileBonus;
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
    this.resultComponents.push(overlay);

    const resultPanel = this.add
      .rectangle(width / 2, height / 2, 400, 350, 0x003300)
      .setStrokeStyle(3, 0x00cc66);
    this.resultComponents.push(resultPanel);

    const successTitle = this.add
      .text(width / 2, height / 2 - 130, "DATA SECURED!", {
        font: "bold 32px Arial",
        fill: "#00cc66",
      })
      .setOrigin(0.5);
    this.resultComponents.push(successTitle);

    const resultText = this.add
      .text(
        width / 2,
        height / 2 - 80,
        `Files Saved: ${this.filesSaved}/${this.totalFiles}`,
        {
          font: "20px Arial",
          fill: "#ffffff",
        }
      )
      .setOrigin(0.5);
    this.resultComponents.push(resultText);

    const backupText = this.add
      .text(
        width / 2,
        height / 2 - 50,
        `Backups Remaining: ${this.backupsRemaining}`,
        {
          font: "18px Arial",
          fill: "#00aaff",
        }
      )
      .setOrigin(0.5);
    this.resultComponents.push(backupText);

    const fileBonusText = this.add
      .text(width / 2, height / 2 - 10, `File Bonus: +${fileBonus}`, {
        font: "18px Arial",
        fill: "#ffcc00",
      })
      .setOrigin(0.5);
    this.resultComponents.push(fileBonusText);

    const timeBonusText = this.add
      .text(width / 2, height / 2 + 20, `Time Bonus: +${timeBonus}`, {
        font: "18px Arial",
        fill: "#ffcc00",
      })
      .setOrigin(0.5);
    this.resultComponents.push(timeBonusText);

    const totalBonusText = this.add
      .text(width / 2, height / 2 + 50, `Total Bonus: +${totalBonus}`, {
        font: "18px Arial",
        fill: "#ffcc00",
      })
      .setOrigin(0.5);
    this.resultComponents.push(totalBonusText);

    const finalScoreText = this.add
      .text(width / 2, height / 2 + 90, `Total Score: ${this.score}`, {
        font: "bold 24px Arial",
        fill: "#00aaff",
      })
      .setOrigin(0.5);
    this.resultComponents.push(finalScoreText);

    // Continue button
    const continueButton = this.add
      .rectangle(width / 2, height / 2 + 140, 200, 50, 0x00aa66)
      .setStrokeStyle(2, 0x00cc88)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => continueButton.setFillStyle(0x00bb77))
      .on("pointerout", () => continueButton.setFillStyle(0x00aa66))
      .on("pointerdown", () => this.returnToMainGame(true));
    this.resultComponents.push(continueButton);

    const continueText = this.add
      .text(width / 2, height / 2 + 140, "CONTINUE", {
        font: "bold 20px Arial",
        fill: "#ffffff",
      })
      .setOrigin(0.5);
    this.resultComponents.push(continueText);

    // Play success sound
    this.game.soundManager.play("success");
  }

  miniGameFailure() {
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
    this.resultComponents.push(overlay);

    const resultPanel = this.add
      .rectangle(width / 2, height / 2, 400, 350, 0x330000)
      .setStrokeStyle(3, 0xff3333);
    this.resultComponents.push(resultPanel);

    const failureTitle = this.add
      .text(width / 2, height / 2 - 130, "DATA LOCKED!", {
        font: "bold 32px Arial",
        fill: "#ff3333",
      })
      .setOrigin(0.5);
    this.resultComponents.push(failureTitle);

    const resultText = this.add
      .text(
        width / 2,
        height / 2 - 80,
        `Files Saved: ${this.filesSaved}/${this.totalFiles}`,
        {
          font: "20px Arial",
          fill: "#ffffff",
        }
      )
      .setOrigin(0.5);
    this.resultComponents.push(resultText);

    const lostText = this.add
      .text(
        width / 2,
        height / 2 - 50,
        `Files Lost: ${this.filesLost}/${this.totalFiles}`,
        {
          font: "20px Arial",
          fill: "#ff6666",
        }
      )
      .setOrigin(0.5);
    this.resultComponents.push(lostText);

    const tipText = this.add
      .text(
        width / 2,
        height / 2,
        "You need to save more than half your files\nand have more saved than lost to win!",
        {
          font: "16px Arial",
          fill: "#ffdd00",
          align: "center",
        }
      )
      .setOrigin(0.5);
    this.resultComponents.push(tipText);

    const strategyText = this.add
      .text(
        width / 2,
        height / 2 + 50,
        "Tip: Prioritize high-value files (more stars)\nand watch for warning signs of encryption!",
        {
          font: "16px Arial",
          fill: "#00aaff",
          align: "center",
        }
      )
      .setOrigin(0.5);
    this.resultComponents.push(strategyText);

    // Try again button
    const tryAgainButton = this.add
      .rectangle(width / 2, height / 2 + 110, 200, 50, 0xaa0000)
      .setStrokeStyle(2, 0xff3333)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => tryAgainButton.setFillStyle(0xcc0000))
      .on("pointerout", () => tryAgainButton.setFillStyle(0xaa0000))
      .on("pointerdown", () => this.restartMiniGame());
    this.resultComponents.push(tryAgainButton);

    const tryAgainText = this.add
      .text(width / 2, height / 2 + 110, "TRY AGAIN", {
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

    if (this.encryptionInterval) {
      this.encryptionInterval.remove();
      this.encryptionInterval = null;
    }

    // Clear the result overlay and components
    this.resultComponents.forEach((component) => {
      if (component && component.destroy) {
        component.destroy();
      }
    });
    this.resultComponents = [];

    // Reset game state variables
    this.timeLeft = 45; // Reset time
    this.backupsRemaining = 5;
    this.filesSaved = 0;
    this.filesLost = 0;
    this.warningActive = false;

    // Reset UI text
    this.timerText.setText(`Time: ${this.timeLeft}s`);
    this.timerText.setColor("#ffdd00"); // Reset color
    this.timerText.setScale(1); // Reset scale from animations
    this.backupText.setText(`Backups: ${this.backupsRemaining}`);
    this.updateStatusText();
    this.statusText.setBackgroundColor("#333333");

    // Reset files
    this.files.forEach((file) => {
      // Reset file state
      file.state = "normal";

      // Hide overlays
      file.backupOverlay.setVisible(false);
      file.lockOverlay.setVisible(false);

      // Reset alpha for file elements
      file.icon.setAlpha(1);
      file.nameText.setAlpha(1);
      file.valueDisplay.setAlpha(1);

      // Reset visual appearance
      file.bg.setFillStyle(0x552200);
    });

    // Restart timers
    this.countdownTimer = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    });

    // Schedule first encryption
    this.scheduleNextEncryption();
  }

  returnToMainGame(success) {
    // Stop any running timers
    if (this.countdownTimer) {
      this.countdownTimer.remove();
    }

    if (this.encryptionInterval) {
      this.encryptionInterval.remove();
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
