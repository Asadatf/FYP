// PasswordCrackMiniGame.js - Mini game for the password crack threat
class PasswordCrackMiniGame extends Phaser.Scene {
  constructor() {
    super("PasswordCrackMiniGame");
    this.timeLeft = 30;
    this.score = 0;
    this.passwordStrength = 0;
    this.threatType = "passwordCrack";
    this.partialPassword = "Pa$$w_"; // Initial incomplete password
    this.crackedLetters = 0;
    this.crackSpeed = 2000; // ms between letters being cracked

    // Password strength criteria
    this.criteria = [
      { name: "Length", achieved: false, description: "8+ characters" },
      { name: "Uppercase", achieved: false, description: "A-Z" },
      { name: "Lowercase", achieved: false, description: "a-z" },
      { name: "Numbers", achieved: false, description: "0-9" },
      { name: "Symbols", achieved: false, description: "!@#$%^&*" },
      {
        name: "No Common Words",
        achieved: false,
        description: "Not easily guessable",
      },
    ];

    // List of common weak passwords to check against
    this.commonPasswords = [
      "password",
      "12345",
      "qwerty",
      "admin",
      "welcome",
      "123456",
      "football",
      "monkey",
      "letmein",
      "abc123",
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
      .text(width / 2, 30, "PASSWORD FORTRESS", {
        font: "bold 28px Arial",
        fill: "#ff6666",
        stroke: "#000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    // Instructions
    this.add
      .text(
        width / 2,
        80,
        "Complete the password before the attacker cracks it!\nCreate a strong password that meets security requirements.",
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

    // Create attacker progress display
    this.createAttackerProgress();

    // Create password input area
    this.createPasswordInput();

    // Create strength meter
    this.createStrengthMeter();

    // Create criteria checklist
    this.createCriteriaChecklist();

    // Start timer
    this.countdownTimer = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    });

    // Start attacker cracking timer
    this.crackTimer = this.time.addEvent({
      delay: this.crackSpeed,
      callback: this.updateAttackerProgress,
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
    this.add.rectangle(0, 0, width, height, 0x150515).setOrigin(0);

    // Create cyber grid effect
    const bgGraphics = this.add.graphics();
    bgGraphics.lineStyle(1, 0x4e0092, 0.1);

    // Draw grid effect
    for (let i = 0; i < 20; i++) {
      const y = i * 40;
      bgGraphics.lineBetween(0, y, width, y);
    }

    for (let i = 0; i < 30; i++) {
      const x = i * 40;
      bgGraphics.lineBetween(x, 0, x, height);
    }

    // Add some "digital" decoration
    const decorGraphics = this.add.graphics();
    decorGraphics.lineStyle(2, 0x660066, 0.3);

    // Draw some decorative binary streams
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;

      decorGraphics.lineBetween(x, y, x, y + 100 + Math.random() * 200);

      // Add some "bits" along the line
      for (let j = 0; j < 8; j++) {
        const bit = Math.random() > 0.5 ? "1" : "0";
        const bitY = y + j * 20 + Math.random() * 10;

        this.add
          .text(x + 5, bitY, bit, {
            font: "14px monospace",
            fill: "#660066",
          })
          .setAlpha(0.7);
      }
    }
  }

  createAttackerProgress() {
    const { width, height } = this.cameras.main;

    // Attacker label
    this.add
      .text(width / 2, 150, "Attacker Progress:", {
        font: "16px Arial",
        fill: "#ff6666",
      })
      .setOrigin(0.5);

    // Attacker progress bar background
    this.add
      .rectangle(width / 2, 180, 400, 30, 0x222222)
      .setStrokeStyle(1, 0x444444);

    // Attacker progress bar fill (starts empty)
    this.attackerProgressBar = this.add
      .rectangle(width / 2 - 200 + 1, 180, 2, 28, 0xff3333)
      .setOrigin(0, 0.5);

    // Visual representation of attacker
    const attackerIcon = this.add
      .text(width / 2 - 220, 180, "🕵️", {
        font: "24px Arial",
      })
      .setOrigin(0.5);

    // Add typing animation to attacker
    this.tweens.add({
      targets: attackerIcon,
      y: "-=5",
      duration: 300,
      yoyo: true,
      repeat: -1,
    });

    // Attacker status text
    this.attackerText = this.add
      .text(width / 2 + 210, 180, "Cracking: 0%", {
        font: "16px Arial",
        fill: "#ff3333",
      })
      .setOrigin(0, 0.5);
  }

  createPasswordInput() {
    const { width, height } = this.cameras.main;

    // Password label and prompt - moved higher
    this.add
      .text(width / 2, 220, "Complete the Password:", {
        font: "bold 18px Arial",
        fill: "#ffffff",
      })
      .setOrigin(0.5);

    // Password input background - made taller for better visibility
    const inputBg = this.add
      .rectangle(width / 2, 260, 400, 60, 0x220022)
      .setStrokeStyle(2, 0xaa00aa);

    // Password display with the partial password already shown - larger font
    this.passwordText = this.add
      .text(width / 2, 260, this.partialPassword, {
        font: "28px monospace",
        fill: "#ffffff",
      })
      .setOrigin(0.5);

    // Create keyboard layout - moved down for better spacing
    this.createKeyboard();
  }

  createKeyboard() {
    const { width, height } = this.cameras.main;

    // Keyboard rows - standard QWERTY layout
    const rows = [
      "1234567890".split(""),
      "QWERTYUIOP".split(""),
      "ASDFGHJKL".split(""),
      "ZXCVBNM".split(""),
    ];

    // Special characters row - reduced to most common ones to avoid clutter
    const specialRow = "!@#$%^&*-_=+".split("");

    // Increased key size and padding for better visibility and touch targets
    const keySize = 45;
    const keyPadding = 8;
    const rowVerticalSpace = 16; // Increased vertical space between rows (was 8 implicitly)
    const startY = 310; // Moved down from password input

    // Create keys for each row
    rows.forEach((row, rowIndex) => {
      const rowWidth = row.length * (keySize + keyPadding);
      const startX = width / 2 - rowWidth / 2 + keySize / 2;

      row.forEach((key, keyIndex) => {
        const x = startX + keyIndex * (keySize + keyPadding);
        const y = startY + rowIndex * (keySize + rowVerticalSpace);

        const keyBg = this.add
          .rectangle(x, y, keySize, keySize, 0x440044)
          .setStrokeStyle(1, 0x660066)
          .setInteractive({ useHandCursor: true })
          .on("pointerover", () => keyBg.setFillStyle(0x550055))
          .on("pointerout", () => keyBg.setFillStyle(0x440044))
          .on("pointerdown", () => this.addCharacter(key));

        this.add
          .text(x, y, key, {
            font: "20px monospace", // Larger font for better visibility
            fill: "#ffffff",
          })
          .setOrigin(0.5);
      });
    });

    // Button row - moved further right/left and made more prominent
    const buttonY = startY + 4 * (keySize + 10); // Position between main keyboard and special chars

    // Add lowercase toggle - moved left
    const lowerBg = this.add
      .rectangle(width / 2 - 220, buttonY, 100, keySize, 0x333333)
      .setStrokeStyle(1, 0x555555)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => lowerBg.setFillStyle(0x444444))
      .on("pointerout", () => lowerBg.setFillStyle(0x333333))
      .on("pointerdown", () => this.toggleCase());

    this.lowerCaseText = this.add
      .text(width / 2 - 220, buttonY, "a→A", {
        font: "20px monospace",
        fill: "#ffffff",
      })
      .setOrigin(0.5);

    // Add backspace button - moved right
    const backspaceBg = this.add
      .rectangle(width / 2 + 220, buttonY, 100, keySize, 0x333333)
      .setStrokeStyle(1, 0x555555)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => backspaceBg.setFillStyle(0x444444))
      .on("pointerout", () => backspaceBg.setFillStyle(0x333333))
      .on("pointerdown", () => this.backspace());

    this.add
      .text(width / 2 + 220, buttonY, "⌫", {
        font: "24px monospace",
        fill: "#ffffff",
      })
      .setOrigin(0.5);

    // Add clear button - moved below backspace
    const clearBg = this.add
      .rectangle(
        width / 2 + 220,
        buttonY + keySize + keyPadding,
        100,
        keySize,
        0x660000
      )
      .setStrokeStyle(1, 0x880000)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => clearBg.setFillStyle(0x770000))
      .on("pointerout", () => clearBg.setFillStyle(0x660000))
      .on("pointerdown", () => this.clearPassword());

    this.add
      .text(width / 2 + 220, buttonY + keySize + keyPadding, "CLEAR", {
        font: "16px monospace",
        fill: "#ffffff",
      })
      .setOrigin(0.5);

    // Special characters row - increased vertical spacing from keyboard
    const specialY = buttonY + keySize + rowVerticalSpace * 2; // More space between buttons and special chars
    const spRowWidth = specialRow.length * (keySize + keyPadding);
    const spStartX = width / 2 - spRowWidth / 2 + keySize / 2;

    specialRow.forEach((key, keyIndex) => {
      const x = spStartX + keyIndex * (keySize + keyPadding);
      const y = specialY;

      const keyBg = this.add
        .rectangle(x, y, keySize, keySize, 0x660022)
        .setStrokeStyle(1, 0x880033)
        .setInteractive({ useHandCursor: true })
        .on("pointerover", () => keyBg.setFillStyle(0x770033))
        .on("pointerout", () => keyBg.setFillStyle(0x660022))
        .on("pointerdown", () => this.addCharacter(key));

      this.add
        .text(x, y, key, {
          font: "20px monospace", // Larger font for better visibility
          fill: "#ffffff",
        })
        .setOrigin(0.5);
    });

    this.upperCase = true;
  }

  createStrengthMeter() {
    const { width, height } = this.cameras.main;

    // Move strength meter to the left side for better balance
    const meterX = width / 2 - 500;
    const meterY = 380;

    // Add "Strength:" label
    this.add
      .text(meterX, meterY - 30, "Strength:", {
        font: "18px Arial",
        fill: "#ffffff",
      })
      .setOrigin(0.5);

    // Strength meter background
    this.add
      .rectangle(meterX, meterY, 200, 30, 0x222222)
      .setStrokeStyle(1, 0x444444);

    // Strength meter fill
    this.strengthMeter = this.add
      .rectangle(meterX - 100 + 1, meterY, 2, 28, 0xff0000)
      .setOrigin(0, 0.5);

    // Strength text
    this.strengthText = this.add
      .text(meterX, meterY + 50, "Very Weak", {
        font: "16px Arial",
        fill: "#ff0000",
      })
      .setOrigin(0.5);
  }

  // Fix the createAttackerProgress function for better placement
  createAttackerProgress() {
    const { width, height } = this.cameras.main;

    // Attacker label
    this.add
      .text(width / 2, 150, "Attacker Progress:", {
        font: "18px Arial",
        fill: "#ff6666",
      })
      .setOrigin(0.5);

    // Attacker progress bar background
    this.add
      .rectangle(width / 2, 180, 500, 30, 0x222222)
      .setStrokeStyle(1, 0x444444);

    // Attacker progress bar fill (starts empty)
    this.attackerProgressBar = this.add
      .rectangle(width / 2 - 250 + 1, 180, 2, 28, 0xff3333)
      .setOrigin(0, 0.5);

    // Visual representation of attacker
    const attackerIcon = this.add
      .text(width / 2 - 270, 180, "🕵️", {
        font: "24px Arial",
      })
      .setOrigin(0.5);

    // Add typing animation to attacker
    this.tweens.add({
      targets: attackerIcon,
      y: "-=5",
      duration: 300,
      yoyo: true,
      repeat: -1,
    });

    // Attacker status text
    this.attackerText = this.add
      .text(width / 2 + 260, 180, "Cracking: 0%", {
        font: "16px Arial",
        fill: "#ff3333",
      })
      .setOrigin(0, 0.5);
  }

  createCriteriaChecklist() {
    const { width, height } = this.cameras.main;

    // Moved the criteria panel to the right side for better layout
    const panelX = width / 2 + 500;
    const panelY = 380;

    // Criteria panel
    this.add
      .rectangle(panelX, panelY, 250, 280, 0x220022, 0.8)
      .setStrokeStyle(1, 0x440044);

    // Title
    this.add
      .text(panelX, panelY - 120, "Password Requirements", {
        font: "bold 16px Arial",
        fill: "#ff66ff",
      })
      .setOrigin(0.5);

    // Create checklist with more spacing
    this.criteriaTexts = [];

    this.criteria.forEach((criterion, index) => {
      const y = panelY - 90 + index * 40; // More vertical spacing between criteria

      // Checkbox
      const checkbox = this.add
        .rectangle(panelX - 100, y, 20, 20, 0x220022)
        .setStrokeStyle(1, 0xaa00aa);

      // Check mark (hidden initially)
      const checkmark = this.add
        .text(panelX - 100, y, "✓", {
          font: "16px Arial",
          fill: "#00ff00",
        })
        .setOrigin(0.5)
        .setVisible(false);

      // Criterion name
      const text = this.add
        .text(panelX - 70, y, `${criterion.name}: ${criterion.description}`, {
          font: "14px Arial",
          fill: "#ffffff",
        })
        .setOrigin(0, 0.5);

      this.criteriaTexts.push({ checkbox, checkmark, text, criterion });
    });
  }

  addCharacter(char) {
    // If uppercase is off, convert to lowercase if it's a letter
    if (!this.upperCase && char.match(/[A-Z]/)) {
      char = char.toLowerCase();
    }

    // Add character to password if not too long
    if (this.passwordText.text.length < 20) {
      // Replace the first underscore with the character
      let pwd = this.passwordText.text;
      if (pwd.includes("_")) {
        pwd = pwd.replace("_", char);
      } else {
        pwd = pwd + char;
      }

      this.passwordText.setText(pwd);
      this.checkPasswordStrength();

      // Play sound
      this.game.soundManager.play("button-click");
    }
  }

  backspace() {
    // Remove last character only if it's not part of the initial partial password
    if (this.passwordText.text.length > this.partialPassword.length) {
      this.passwordText.setText(
        this.passwordText.text.substring(0, this.passwordText.text.length - 1)
      );
      this.checkPasswordStrength();

      // Play sound
      this.game.soundManager.play("button-click");
    }
  }

  clearPassword() {
    // Reset to the initial partial password
    this.passwordText.setText(this.partialPassword);
    this.checkPasswordStrength();

    // Play sound
    this.game.soundManager.play("button-click");
  }

  toggleCase() {
    this.upperCase = !this.upperCase;
    this.lowerCaseText.setText(this.upperCase ? "a→A" : "A→a");

    // Play sound
    this.game.soundManager.play("button-click");
  }

  checkPasswordStrength() {
    const password = this.passwordText.text;

    // Reset criteria
    this.criteria.forEach((criterion) => (criterion.achieved = false));

    // Check each criterion
    if (password.length >= 8) {
      this.criteria[0].achieved = true;
    }

    if (password.match(/[A-Z]/)) {
      this.criteria[1].achieved = true;
    }

    if (password.match(/[a-z]/)) {
      this.criteria[2].achieved = true;
    }

    if (password.match(/[0-9]/)) {
      this.criteria[3].achieved = true;
    }

    if (password.match(/[^A-Za-z0-9]/)) {
      this.criteria[4].achieved = true;
    }

    // Check if the password contains any common words
    const lowerPassword = password.toLowerCase();
    let containsCommonWord = false;
    for (const word of this.commonPasswords) {
      if (lowerPassword.includes(word)) {
        containsCommonWord = true;
        break;
      }
    }
    this.criteria[5].achieved = !containsCommonWord;

    // Update criteria display
    this.criteriaTexts.forEach((item) => {
      item.checkmark.setVisible(item.criterion.achieved);
    });

    // Calculate strength (0-6)
    this.passwordStrength = this.criteria.filter((c) => c.achieved).length;

    // Update strength meter
    const meterWidth = Math.floor(
      this.passwordStrength * (400 / this.criteria.length)
    );
    this.strengthMeter.width = meterWidth;

    // Set meter color based on strength
    if (this.passwordStrength <= 1) {
      this.strengthMeter.fillColor = 0xff0000; // Red - Very Weak
      this.strengthText.setText("Very Weak");
      this.strengthText.setColor("#ff0000");
    } else if (this.passwordStrength <= 2) {
      this.strengthMeter.fillColor = 0xff6600; // Orange - Weak
      this.strengthText.setText("Weak");
      this.strengthText.setColor("#ff6600");
    } else if (this.passwordStrength <= 3) {
      this.strengthMeter.fillColor = 0xffcc00; // Yellow - Fair
      this.strengthText.setText("Fair");
      this.strengthText.setColor("#ffcc00");
    } else if (this.passwordStrength <= 4) {
      this.strengthMeter.fillColor = 0x66cc00; // Light Green - Good
      this.strengthText.setText("Good");
      this.strengthText.setColor("#66cc00");
    } else {
      this.strengthMeter.fillColor = 0x00cc00; // Green - Strong
      this.strengthText.setText("Strong");
      this.strengthText.setColor("#00cc00");
    }

    // Check if password is strong enough to complete challenge
    if (this.passwordStrength >= 4 && !this.passwordText.text.includes("_")) {
      // Enable completion with a check button
      if (!this.checkButton) {
        const { width, height } = this.cameras.main;

        this.checkButton = this.add
          .rectangle(width / 2 + 200, 320, 120, 50, 0x006600)
          .setStrokeStyle(2, 0x00aa00)
          .setInteractive({ useHandCursor: true })
          .on("pointerover", () => this.checkButton.setFillStyle(0x007700))
          .on("pointerout", () => this.checkButton.setFillStyle(0x006600))
          .on("pointerdown", () => this.submitPassword());

        this.add
          .text(width / 2 + 200, 320, "SUBMIT", {
            font: "bold 16px Arial",
            fill: "#ffffff",
          })
          .setOrigin(0.5);

        // Add pulse animation to draw attention
        this.tweens.add({
          targets: this.checkButton,
          scaleX: { from: 1, to: 1.05 },
          scaleY: { from: 1, to: 1.05 },
          duration: 500,
          yoyo: true,
          repeat: -1,
        });
      }
    } else if (this.checkButton) {
      // Hide check button if password is no longer strong enough
      this.checkButton.destroy();
      this.checkButton = null;
    }
  }

  updateAttackerProgress() {
    // Attacker makes progress on cracking
    this.crackedLetters++;
    const totalLettersToGuess = 12; // Adjust based on expected password length
    const crackPercentage = Math.min(
      100,
      Math.floor((this.crackedLetters / totalLettersToGuess) * 100)
    );

    // Update progress bar
    const barWidth = Math.floor((crackPercentage / 100) * 400);
    this.attackerProgressBar.width = barWidth;

    // Update text
    this.attackerText.setText(`Cracking: ${crackPercentage}%`);

    // Check if attacker has cracked the password
    if (crackPercentage >= 100) {
      this.attackerWins();
    }

    // Make the progress bar red and pulsing when getting close
    if (crackPercentage >= 75) {
      this.attackerText.setColor("#ff0000");

      // Add pulsing animation when close to cracking
      if (crackPercentage === 75) {
        this.tweens.add({
          targets: this.attackerProgressBar,
          alpha: { from: 1, to: 0.6 },
          duration: 300,
          yoyo: true,
          repeat: -1,
        });
      }
    }
  }

  attackerWins() {
    // Stop the timers
    if (this.countdownTimer) {
      this.countdownTimer.remove();
    }

    if (this.crackTimer) {
      this.crackTimer.remove();
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
      .rectangle(width / 2, height / 2, 400, 300, 0x220022)
      .setStrokeStyle(3, 0xff0000);

    const failureTitle = this.add
      .text(width / 2, height / 2 - 100, "PASSWORD CRACKED!", {
        font: "bold 28px Arial",
        fill: "#ff3333",
      })
      .setOrigin(0.5);

    const resultText = this.add
      .text(
        width / 2,
        height / 2 - 50,
        "The attacker broke into your system!",
        {
          font: "18px Arial",
          fill: "#ffffff",
        }
      )
      .setOrigin(0.5);

    const strengthText = this.add
      .text(
        width / 2,
        height / 2 - 10,
        `Password Strength: ${this.getStrengthText()}`,
        {
          font: "18px Arial",
          fill: this.strengthText.style.color,
        }
      )
      .setOrigin(0.5);

    const tipText = this.add
      .text(
        width / 2,
        height / 2 + 30,
        "Tip: Create a stronger password faster\nto beat the attacker!",
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

  submitPassword() {
    // Stop the timers
    if (this.countdownTimer) {
      this.countdownTimer.remove();
    }

    if (this.crackTimer) {
      this.crackTimer.remove();
    }

    // Calculate score based on password strength and time left
    const strengthBonus = this.passwordStrength * 20;
    const timeBonus = this.timeLeft * 3;
    const securityBonus = 100 - Math.floor((this.crackedLetters / 12) * 100);
    const totalBonus = strengthBonus + timeBonus + securityBonus;
    this.score += totalBonus;

    // Show success message
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
      .rectangle(width / 2, height / 2, 400, 350, 0x002222)
      .setStrokeStyle(3, 0x00ff88);

    const successTitle = this.add
      .text(width / 2, height / 2 - 130, "PASSWORD SECURED!", {
        font: "bold 28px Arial",
        fill: "#00cc66",
      })
      .setOrigin(0.5);

    const passwordText = this.add
      .text(
        width / 2,
        height / 2 - 90,
        `Final Password: ${this.passwordText.text}`,
        {
          font: "18px monospace",
          fill: "#ffffff",
        }
      )
      .setOrigin(0.5);

    const resultText = this.add
      .text(
        width / 2,
        height / 2 - 50,
        `You secured your system before the attacker could break in!`,
        {
          font: "16px Arial",
          fill: "#ffffff",
        }
      )
      .setOrigin(0.5);

    const strengthText = this.add
      .text(
        width / 2,
        height / 2 - 10,
        `Password Strength: ${this.getStrengthText()}`,
        {
          font: "18px Arial",
          fill: this.strengthText.style.color,
        }
      )
      .setOrigin(0.5);

    const strengthBonusText = this.add
      .text(width / 2, height / 2 + 20, `Strength Bonus: +${strengthBonus}`, {
        font: "16px Arial",
        fill: "#ff66ff",
      })
      .setOrigin(0.5);

    const timeBonusText = this.add
      .text(width / 2, height / 2 + 50, `Time Bonus: +${timeBonus}`, {
        font: "16px Arial",
        fill: "#ffdd00",
      })
      .setOrigin(0.5);

    const securityBonusText = this.add
      .text(width / 2, height / 2 + 80, `Security Bonus: +${securityBonus}`, {
        font: "16px Arial",
        fill: "#00aaff",
      })
      .setOrigin(0.5);

    const totalText = this.add
      .text(width / 2, height / 2 + 120, `Total Score: ${this.score}`, {
        font: "bold 22px Arial",
        fill: "#00aaff",
      })
      .setOrigin(0.5);

    // Continue button
    const continueButton = this.add
      .rectangle(width / 2, height / 2 + 170, 200, 50, 0x00aa66)
      .setStrokeStyle(2, 0x00cc88)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => continueButton.setFillStyle(0x00bb77))
      .on("pointerout", () => continueButton.setFillStyle(0x00aa66))
      .on("pointerdown", () => this.returnToMainGame(true));

    const continueText = this.add
      .text(width / 2, height / 2 + 170, "CONTINUE", {
        font: "bold 20px Arial",
        fill: "#ffffff",
      })
      .setOrigin(0.5);

    // Play success sound
    this.game.soundManager.play("success");
  }

  getStrengthText() {
    switch (this.passwordStrength) {
      case 0:
      case 1:
        return "Very Weak";
      case 2:
        return "Weak";
      case 3:
        return "Fair";
      case 4:
        return "Good";
      case 5:
      case 6:
        return "Strong";
      default:
        return "Unknown";
    }
  }

  // Fixed updateTimer function to prevent negative time
  updateTimer() {
    this.timeLeft--;

    // Make sure timeLeft doesn't go below 0
    if (this.timeLeft < 0) {
      this.timeLeft = 0;
      this.countdownTimer.remove();
      this.attackerWins();
      return;
    }

    this.timerText.setText(`Time: ${this.timeLeft}s`);

    // Time's up
    if (this.timeLeft <= 0) {
      this.countdownTimer.remove();

      // Check if player has a strong enough password
      if (this.passwordStrength >= 4 && !this.passwordText.text.includes("_")) {
        this.submitPassword();
      } else {
        this.attackerWins();
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

  // Fixed restartMiniGame function to properly reset game state
  restartMiniGame() {
    // Stop any existing timers first
    if (this.countdownTimer) {
      this.countdownTimer.remove();
      this.countdownTimer = null;
    }

    if (this.crackTimer) {
      this.crackTimer.remove();
      this.crackTimer = null;
    }

    // Reset key game variables
    this.timeLeft = 30;
    this.crackedLetters = 0;

    // Remove any result screens or overlays
    this.children.each((child) => {
      // Only remove the overlay elements, not the main game elements
      if (child.type === "Rectangle" && child.fillColor === 0x000000) {
        child.destroy();
      }
      if (
        child.type === "Rectangle" &&
        (child.fillColor === 0x220022 || child.fillColor === 0x002222)
      ) {
        child.destroy();
      }
      if (
        child.type === "Text" &&
        (child.text.includes("PASSWORD CRACKED") ||
          child.text.includes("PASSWORD SECURED") ||
          child.text.includes("CONTINUE") ||
          child.text.includes("TRY AGAIN"))
      ) {
        child.destroy();
      }
    });

    // Reset UI elements
    this.passwordText.setText(this.partialPassword);
    this.timerText.setText(`Time: ${this.timeLeft}s`);
    this.timerText.setColor("#ffdd00");
    this.timerText.setScale(1);

    // Reset attacker progress
    this.attackerProgressBar.width = 2;
    this.attackerText.setText("Cracking: 0%");
    this.attackerText.setColor("#ff3333");

    // Reset strength meter
    this.strengthMeter.width = 2;
    this.strengthText.setText("Very Weak");
    this.strengthText.setColor("#ff0000");

    // Reset criteria
    this.criteria.forEach((criterion) => (criterion.achieved = false));
    this.criteriaTexts.forEach((item) => {
      item.checkmark.setVisible(false);
    });

    // Remove the check button if it exists
    if (this.checkButton) {
      this.checkButton.destroy();
      this.checkButton = null;
    }

    // Restart timers
    this.countdownTimer = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    });

    this.crackTimer = this.time.addEvent({
      delay: this.crackSpeed,
      callback: this.updateAttackerProgress,
      callbackScope: this,
      loop: true,
    });
  }
  returnToMainGame(success) {
    // Stop any running timers
    if (this.countdownTimer) {
      this.countdownTimer.remove();
    }

    if (this.crackTimer) {
      this.crackTimer.remove();
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
