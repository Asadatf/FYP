window.PRODUCTION = true;
class MessageHandler {
  constructor(
    scene,
    packet,
    red_briefcase,
    dX,
    dY,
    rX,
    rY,
    EncryptionTutorial,
    puzzle
  ) {
    this.dX = dX;
    this.dY = dY;
    this.rX = rX;
    this.rY = rY;
    this.receiverX = rX;
    this.receiverY = rY;
    this.red_briefcase = red_briefcase;
    this.scene = scene;
    this.lastMessage = "";
    this.menuActive = false;
    this.packetTween = null;
    this.packet = packet;
    this.currentEncryptIndex = 0;
    this.aiFeedbackText = null;
    this.isEncrypted = false;
    this.isEncrypting = false;
    this.keydownListener = null;
    this.wallet = 10;
    this.selectedWords = [];
    this.wordTextObjects = [];
    this.tokenizedMessage = [];
    this.caesarShift = 3;
    this.securityScore = 0;
    this.userScore = 0;
    this.interceptAnimationGroup = null;

    this.encryptionAnalysisEndpoint = window.PRODUCTION
      ? "http://localhost:5000/analyze_encryption"
      : "http://localhost:5000/analyze_encryption";

    this.EncryptionTutorial = EncryptionTutorial;
    this.encryptionMethod = null;

    // Adding Timer Functionality
    this.encryptionTimeLimit = 60; // 30 seconds to encrypt
    this.encryptionTimer = null;
    this.timeRemainingText = null;

    // Puzzle
    this.puzzle = puzzle;

    // Game over vars
    this.isTerminating = false;

    this.wordSelectionTimeLimit = 5; // 5 seconds for word selection
    this.wordSelectionTimer = null;
    this.wordSelectionText = null;
    this.isSelectingWords = false;

    // Initialize the Man-in-the-Middle attack handler
    this.mitmAttack = new ManInTheMiddleAttack(scene, this);
  }

  // RSA
  visualizeRSAEncryption(word) {
    // Clear previous visualizations
    if (this.shiftVisualizationObjects) {
      this.shiftVisualizationObjects.forEach((obj) => obj.destroy());
    }
    this.shiftVisualizationObjects = [];

    const popupWidth = 600;
    const popupHeight = 500;
    const centerX = this.scene.scale.width / 2;
    const centerY = this.scene.scale.height / 2;

    // Create background for visualization
    const background = this.scene.add.rectangle(
      centerX,
      centerY,
      popupWidth,
      popupHeight,
      0x001a2e,
      0.9
    );
    this.shiftVisualizationObjects.push(background);

    // Generate RSA keys (simple for educational purposes)
    // Using small prime numbers for demonstration
    const p = 3;
    const q = 11;
    const n = p * q;
    const phi = (p - 1) * (q - 1);
    const e = 3; // Common public exponent

    // Calculate private key d (multiplicative inverse of e mod phi)
    let d = 0;
    for (let i = 1; i < phi; i++) {
      if ((e * i) % phi === 1) {
        d = i;
        break;
      }
    }

    // Store keys for reference
    this.rsaPublicKey = { e, n };
    this.rsaPrivateKey = { d, n };

    // Add header with animated effect
    const titleText = this.scene.add
      .text(centerX, centerY - 200, "RSA Encryption Challenge", {
        fontSize: "28px",
        fill: "#ffffff",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5);
    this.shiftVisualizationObjects.push(titleText);

    // Add glowing effect to title
    this.scene.tweens.add({
      targets: titleText,
      alpha: 0.7,
      duration: 1000,
      yoyo: true,
      repeat: -1,
    });

    // Display mission brief
    const missionText = this.scene.add
      .text(
        centerX,
        centerY - 165,
        "Your mission: Apply the RSA encryption formula",
        {
          fontSize: "18px",
          fill: "#00ffff",
        }
      )
      .setOrigin(0.5);
    this.shiftVisualizationObjects.push(missionText);

    // Create formula breakdown container
    const breakdownContainer = this.scene.add.container(centerX, centerY - 110);
    this.shiftVisualizationObjects.push(breakdownContainer);

    // Formula breakdown
    const formulaBreakdown = [
      { text: "C", color: "#ffffff", explanation: "= encrypted value" },
      {
        text: "M",
        color: "#00ff00",
        explanation: "= message character (as ASCII)",
      },
      {
        text: "e",
        color: "#ffff00",
        explanation: `= public exponent (${this.rsaPublicKey.e})`,
      },
      {
        text: "n",
        color: "#ff9900",
        explanation: `= modulus (${this.rsaPublicKey.n})`,
      },
    ];

    // Calculate total width for centering
    let totalWidth = 0;
    const padding = 20;
    formulaBreakdown.forEach((item) => {
      // Estimate width (rough calculation)
      totalWidth += 80 + padding;
    });

    // Position starting from left
    let xPos = -(totalWidth / 2);

    // Create formula breakdown items
    formulaBreakdown.forEach((item) => {
      const itemBg = this.scene.add.rectangle(xPos, 0, 80, 60, 0x222222, 0.8);
      itemBg.setStrokeStyle(1, 0x444444);
      breakdownContainer.add(itemBg);

      // Term
      const term = this.scene.add
        .text(xPos, -15, item.text, {
          fontSize: "24px",
          fill: item.color,
          fontStyle: "bold",
        })
        .setOrigin(0.5);
      breakdownContainer.add(term);

      // Explanation
      const explanation = this.scene.add
        .text(xPos, 15, item.explanation, {
          fontSize: "12px",
          fill: "#ffffff",
          align: "center",
          wordWrap: { width: 75 },
        })
        .setOrigin(0.5);
      breakdownContainer.add(explanation);

      // Move to next position
      xPos += 80 + padding;
    });

    // Hide initially and show with animation after a short delay
    breakdownContainer.setAlpha(0);
    breakdownContainer.setScale(0.8);
    this.scene.time.delayedCall(1000, () => {
      this.scene.tweens.add({
        targets: breakdownContainer,
        alpha: 1,
        scale: 1,
        duration: 500,
        ease: "Back.easeOut",
      });
    });

    // Display original message
    const originalWordText = this.scene.add
      .text(centerX, centerY - 40, `Message to encrypt: "${word}"`, {
        fontSize: "22px",
        fill: "#ffffff",
      })
      .setOrigin(0.5);
    this.shiftVisualizationObjects.push(originalWordText);

    // Display keys section with nice styling
    const keysBackground = this.scene.add.rectangle(
      centerX,
      centerY,
      popupWidth - 100,
      50,
      0x0f3460,
      1
    );
    this.shiftVisualizationObjects.push(keysBackground);

    // Add keys with different colors
    const publicKeyText = this.scene.add
      .text(
        centerX,
        centerY,
        `Public Key: (e=${this.rsaPublicKey.e}, n=${this.rsaPublicKey.n})`,
        {
          fontSize: "20px",
          fill: "#00ff00",
        }
      )
      .setOrigin(0.5);
    this.shiftVisualizationObjects.push(publicKeyText);

    // Add helpful instructions for first-time users
    const instructionsBox = this.scene.add.rectangle(
      centerX,
      centerY + 65,
      popupWidth - 50,
      80,
      0x222244,
      0.8
    );
    this.shiftVisualizationObjects.push(instructionsBox);

    const instructionsText = this.scene.add
      .text(
        centerX,
        centerY + 65,
        "HOW TO ENTER THE FORMULA:\n" +
          "1. Type only the values (not the variable names)\n" +
          "2. For this key, enter: " +
          this.rsaPublicKey.e +
          " mod " +
          this.rsaPublicKey.n +
          " or " +
          this.rsaPublicKey.e +
          "%" +
          this.rsaPublicKey.n +
          "\n" +
          "3. Press ENTER or click VERIFY when done",
        {
          fontSize: "16px",
          fill: "#ffff00",
          align: "center",
          lineSpacing: 5,
        }
      )
      .setOrigin(0.5);
    this.shiftVisualizationObjects.push(instructionsText);

    // Example container with animation to draw attention
    const exampleContainer = this.scene.add.container(
      centerX + 200,
      centerY + 10
    );
    this.shiftVisualizationObjects.push(exampleContainer);

    // Example background with arrow
    const exampleBg = this.scene.add.graphics();
    exampleBg.fillStyle(0x004400, 0.8);
    exampleBg.fillRoundedRect(-80, -25, 160, 50, 10);
    exampleBg.lineStyle(2, 0x00ff00, 1);
    exampleBg.strokeRoundedRect(-80, -25, 160, 50, 10);
    exampleContainer.add(exampleBg);

    // Example text
    const exampleText = this.scene.add
      .text(0, 0, "Example:\nC = M^3 mod 33", {
        fontSize: "14px",
        fill: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);
    exampleContainer.add(exampleText);

    // Add a subtle animation to draw attention to the example
    this.scene.tweens.add({
      targets: exampleContainer,
      y: centerY + 20,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Display RSA formula instruction
    const formulaText = this.scene.add
      .text(centerX, centerY + 130, "Enter the RSA formula:", {
        fontSize: "20px",
        fill: "#ffffff",
      })
      .setOrigin(0.5);
    this.shiftVisualizationObjects.push(formulaText);

    // Create input field background
    const inputBackground = this.scene.add.rectangle(
      centerX,
      centerY + 160,
      300,
      40,
      0x333333,
      1
    );
    inputBackground.setStrokeStyle(2, 0x00ff00);
    this.shiftVisualizationObjects.push(inputBackground);

    // Create fixed prefix text (C = M^)
    const prefixText = this.scene.add
      .text(centerX - 140, centerY + 160, "C = M^", {
        fontSize: "20px",
        fill: "#ffffff",
      })
      .setOrigin(0, 0.5);
    this.shiftVisualizationObjects.push(prefixText);

    // Get width of prefix text to position user input correctly
    const prefixWidth = prefixText.width;

    // User answer field - what they need to type
    this.rsaUserInput = "";
    this.rsaCorrectAnswer = `${this.rsaPublicKey.e} mod ${this.rsaPublicKey.n}`;

    // Create answer text that updates as user types - positioned AFTER the prefix
    this.rsaAnswerText = this.scene.add
      .text(
        centerX - 140 + prefixWidth,
        centerY + 160,
        this.rsaUserInput + "_",
        {
          fontSize: "20px",
          fill: "#00ff00",
        }
      )
      .setOrigin(0, 0.5);
    this.shiftVisualizationObjects.push(this.rsaAnswerText);

    // Show the ASCII conversion as a hint
    const charConversions = [];
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      const ascii = char.charCodeAt(0);
      charConversions.push(`${char} = ${ascii}`);
    }

    const asciiText = this.scene.add
      .text(
        centerX,
        centerY + 200,
        `ASCII values: ${charConversions.join(", ")}`,
        {
          fontSize: "16px",
          fill: "#ffff00",
        }
      )
      .setOrigin(0.5);
    this.shiftVisualizationObjects.push(asciiText);

    // Create submit button
    const submitButton = this.scene.add
      .rectangle(centerX, centerY + 240, 160, 50, 0x004400, 1)
      .setInteractive();
    submitButton.setStrokeStyle(2, 0x00ff00);
    this.shiftVisualizationObjects.push(submitButton);

    const submitText = this.scene.add
      .text(centerX, centerY + 240, "VERIFY FORMULA", {
        fontSize: "18px",
        fill: "#ffffff",
      })
      .setOrigin(0.5);
    this.shiftVisualizationObjects.push(submitText);

    // Add pulsing effect to button
    this.scene.tweens.add({
      targets: [submitButton, submitText],
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    // Status message text (for feedback)
    this.rsaStatusText = this.scene.add
      .text(centerX, centerY + 280, "", {
        fontSize: "18px",
        fill: "#ffffff",
      })
      .setOrigin(0.5);
    this.shiftVisualizationObjects.push(this.rsaStatusText);

    // Set up keyboard input handler
    this.setupRSAInputHandler();

    // Add hover effects to button
    submitButton.on("pointerover", () => {
      submitButton.fillColor = 0x006600;
      submitText.setScale(1.1);
    });

    submitButton.on("pointerout", () => {
      submitButton.fillColor = 0x004400;
      submitText.setScale(1.0);
    });

    // Add click handler to submit button
    submitButton.on("pointerdown", () => {
      this.verifyRSAFormula(word);
    });
  }

  // Set up keyboard input handler for RSA formula
  setupRSAInputHandler() {
    // Remove any existing keyboard listeners
    if (this.keydownListener) {
      this.scene.input.keyboard.off("keydown", this.keydownListener);
    }

    // Create new listener for RSA input
    this.keydownListener = (event) => {
      console.log("Key pressed:", event.key); // Debug log

      // Handle backspace key
      if (event.key === "Backspace") {
        // Make sure there's text to delete
        if (this.rsaUserInput.length > 0) {
          this.rsaUserInput = this.rsaUserInput.slice(0, -1);
          console.log("Backspace pressed, new input:", this.rsaUserInput); // Debug log
        }
      }
      // Handle Enter key for submission
      else if (event.key === "Enter") {
        this.verifyRSAFormula(this.selectedWords[0]);
      }
      // Handle alphanumeric and special keys for formula
      else if (/^[0-9a-z\s^%mod]$/i.test(event.key)) {
        this.rsaUserInput += event.key;
      }

      // Update the text display with cursor
      this.rsaAnswerText.setText(this.rsaUserInput + "_");
    };

    // Add the keyboard listener
    this.scene.input.keyboard.on("keydown", this.keydownListener);

    // Ensure this input field has focus
    this.scene.input.keyboard.enabled = true;
  }

  // Verify the RSA formula entered by the user
  verifyRSAFormula(word) {
    console.log("Verifying formula:", this.rsaUserInput);
    console.log("Correct answer:", this.rsaCorrectAnswer);

    // Clean up user input (remove extra spaces, standardize format)
    const cleanInput = this.rsaUserInput
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();

    // Check various valid formats of the answer
    const validFormats = [
      `${this.rsaPublicKey.e} mod ${this.rsaPublicKey.n}`,
      `${this.rsaPublicKey.e}mod${this.rsaPublicKey.n}`,
      `${this.rsaPublicKey.e}%${this.rsaPublicKey.n}`,
    ];

    const isCorrect = validFormats.some(
      (format) =>
        cleanInput === format.toLowerCase() ||
        cleanInput === format.toLowerCase().replace(/\s+/g, "")
    );

    if (isCorrect) {
      // Show success message
      this.rsaStatusText
        .setText("Correct! Encrypting message...")
        .setColor("#00ff00");

      // Remove keyboard listener
      if (this.keydownListener) {
        this.scene.input.keyboard.off("keydown", this.keydownListener);
      }

      // Proceed with encryption after a short delay
      this.scene.time.delayedCall(1500, () => {
        // Calculate encryption and proceed
        const encryptedData = this.rsaEncrypt(word);
        const encryptedString = this.rsaEncryptedToString(encryptedData);

        // Show encryption result
        this.showRSAEncryptionResult(word, encryptedData, encryptedString);
      });
    } else {
      // Show error message
      this.rsaStatusText.setText("Incorrect. Try again!").setColor("#ff0000");

      // Shake the input field
      this.scene.tweens.add({
        targets: this.rsaAnswerText,
        x: { from: this.rsaAnswerText.x - 5, to: this.rsaAnswerText.x },
        duration: 50,
        yoyo: true,
        repeat: 3,
      });
    }
  }

  // Set up keyboard input handler for RSA formula
  setupRSAInputHandler() {
    // Remove any existing keyboard listeners
    if (this.keydownListener) {
      this.scene.input.keyboard.off("keydown", this.keydownListener);
    }

    // Create new listener for RSA input
    this.keydownListener = (event) => {
      // Handle backspace
      if (event.key === "Backspace") {
        // Make sure there's text to delete
        if (this.rsaUserInput.length > 0) {
          this.rsaUserInput = this.rsaUserInput.slice(0, -1);
        }
      }
      // Handle Enter key for submission
      else if (event.key === "Enter") {
        this.verifyRSAFormula(this.selectedWords[0]);
      }
      // Handle alphanumeric and special keys for formula
      else if (/^[0-9a-z\s^%mod]$/i.test(event.key)) {
        this.rsaUserInput += event.key;
      }

      // Update ONLY the user input text (not the prefix)
      this.rsaAnswerText.setText(this.rsaUserInput + "_");
    };

    // Add the keyboard listener
    this.scene.input.keyboard.on("keydown", this.keydownListener);
  }

  // Verify the RSA formula entered by the user
  verifyRSAFormula(word) {
    console.log("Verifying formula:", this.rsaUserInput);
    console.log("Correct answer:", this.rsaCorrectAnswer);

    // Clean up user input (remove extra spaces, standardize format)
    const cleanInput = this.rsaUserInput
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();

    // Check various valid formats of the answer
    const validFormats = [
      `${this.rsaPublicKey.e} mod ${this.rsaPublicKey.n}`,
      `${this.rsaPublicKey.e}mod${this.rsaPublicKey.n}`,
      `${this.rsaPublicKey.e}%${this.rsaPublicKey.n}`,
    ];

    const isCorrect = validFormats.some(
      (format) =>
        cleanInput === format.toLowerCase() ||
        cleanInput === format.toLowerCase().replace(/\s+/g, "")
    );

    if (isCorrect) {
      // Show success message
      this.rsaStatusText
        .setText("Correct! Encrypting message...")
        .setColor("#00ff00");

      // Remove keyboard listener
      if (this.keydownListener) {
        this.scene.input.keyboard.off("keydown", this.keydownListener);
      }

      // Proceed with encryption after a short delay
      this.scene.time.delayedCall(1500, () => {
        // Calculate encryption and proceed
        const encryptedData = this.rsaEncrypt(word);
        const encryptedString = this.rsaEncryptedToString(encryptedData);

        // Show encryption result
        this.showRSAEncryptionResult(word, encryptedData, encryptedString);
      });
    } else {
      // Show error message
      this.rsaStatusText.setText("Incorrect. Try again!").setColor("#ff0000");

      // Shake the input field
      this.scene.tweens.add({
        targets: this.rsaAnswerText,
        x: { from: this.rsaAnswerText.x - 5, to: this.rsaAnswerText.x },
        duration: 50,
        yoyo: true,
        repeat: 3,
      });
    }
  }

  // RSA encryption method
  rsaEncrypt(message) {
    return message.split("").map((char) => {
      // Convert character to number (ASCII code)
      const charCode = char.charCodeAt(0);
      // Apply encryption formula: c = m^e mod n
      let encrypted = 1;
      for (let i = 0; i < this.rsaPublicKey.e; i++) {
        encrypted = (encrypted * charCode) % this.rsaPublicKey.n;
      }
      return encrypted;
    });
  }

  rsaEncryptedToString(encryptedArray) {
    return encryptedArray.join("|");
  }

  // Show the RSA encryption result
  showRSAEncryptionResult(word, encryptedData, encryptedString) {
    // Clear previous visualization
    this.shiftVisualizationObjects.forEach((obj) => {
      this.scene.tweens.killTweensOf(obj);
      obj.destroy();
    });
    this.shiftVisualizationObjects = [];

    // Create new results display
    const popupWidth = 550;
    const popupHeight = 400;
    const centerX = this.scene.scale.width / 2;
    const centerY = this.scene.scale.height / 2;

    // Background
    const background = this.scene.add.rectangle(
      centerX,
      centerY,
      popupWidth,
      popupHeight,
      0x001a2e,
      0.9
    );
    this.shiftVisualizationObjects.push(background);

    // Title
    const titleText = this.scene.add
      .text(centerX, centerY - 150, "Encryption Complete!", {
        fontSize: "28px",
        fill: "#00ff00",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
    this.shiftVisualizationObjects.push(titleText);

    // Original and encrypted message
    const originalText = this.scene.add
      .text(centerX, centerY - 90, `Original: ${word}`, {
        fontSize: "22px",
        fill: "#ffffff",
      })
      .setOrigin(0.5);
    this.shiftVisualizationObjects.push(originalText);

    const encryptedText = this.scene.add
      .text(centerX, centerY - 50, `Encrypted: ${encryptedString}`, {
        fontSize: "22px",
        fill: "#00ffff",
      })
      .setOrigin(0.5);
    this.shiftVisualizationObjects.push(encryptedText);

    // Show step-by-step calculation
    const stepTitle = this.scene.add
      .text(centerX, centerY, "Step-by-step calculation:", {
        fontSize: "20px",
        fill: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
    this.shiftVisualizationObjects.push(stepTitle);

    let stepText = "";
    word.split("").forEach((char, index) => {
      const charCode = char.charCodeAt(0);
      stepText += `${char}(${charCode}) → ${charCode}^${this.rsaPublicKey.e} mod ${this.rsaPublicKey.n} = ${encryptedData[index]}\n`;
    });

    const calculationText = this.scene.add
      .text(centerX, centerY + 60, stepText, {
        fontSize: "18px",
        fill: "#00ff00",
        align: "center",
      })
      .setOrigin(0.5);
    this.shiftVisualizationObjects.push(calculationText);

    // Continue button
    const continueButton = this.scene.add
      .rectangle(centerX, centerY + 140, 160, 50, 0x004400, 1)
      .setInteractive();
    continueButton.setStrokeStyle(2, 0x00ff00);
    this.shiftVisualizationObjects.push(continueButton);

    const continueText = this.scene.add
      .text(centerX, centerY + 140, "CONTINUE", {
        fontSize: "20px",
        fill: "#ffffff",
      })
      .setOrigin(0.5);
    this.shiftVisualizationObjects.push(continueText);

    // Add hover effects
    continueButton.on("pointerover", () => {
      continueButton.fillColor = 0x006600;
      continueText.setScale(1.1);
    });

    continueButton.on("pointerout", () => {
      continueButton.fillColor = 0x004400;
      continueText.setScale(1.0);
    });

    // Add click handler
    continueButton.on("pointerdown", () => {
      // Clean up visualization
      this.shiftVisualizationObjects.forEach((obj) => {
        this.scene.tweens.killTweensOf(obj);
        obj.destroy();
      });
      this.shiftVisualizationObjects = [];

      // Process the encrypted word and continue
      this.handleRSAEncryptedWord(word, encryptedData, encryptedString);
    });
  }

  // Handle RSA encrypted word (process it and continue)
  handleRSAEncryptedWord(originalWord, encryptedData, encryptedString) {
    // Find the index of the current word being encrypted
    const wordIndex = this.tokenizedMessage.indexOf(originalWord);

    // Replace the current word with its encrypted version
    this.tokenizedMessage[wordIndex] = encryptedString;

    // Update the corresponding word text object
    if (this.wordTextObjects[wordIndex]) {
      this.wordTextObjects[wordIndex].setText(encryptedString);
      this.wordTextObjects[wordIndex].setBackgroundColor("#ff0000");
    }

    // Remove the processed word from selectedWords
    this.selectedWords.shift();

    // Reconstruct the full encrypted message
    this.encryptedMessage = this.tokenizedMessage.join(" ");
    console.log("Partially Encrypted Message (RSA):", this.encryptedMessage);

    // Check if we still have words to encrypt
    if (this.selectedWords.length > 0) {
      console.log(
        "Preparing to encrypt next word with RSA:",
        this.selectedWords[0]
      );

      // Hide all word text objects to prevent overlap
      this.wordTextObjects.forEach((wordText) => {
        wordText.setVisible(false);
      });

      // Small delay to ensure clean transition
      this.scene.time.delayedCall(100, () => {
        if (this.encryptionMethod === "rsa") {
          this.visualizeRSAEncryption(this.selectedWords[0]);
        } else if (this.encryptionMethod === "manual") {
          this.visualizeCaesarCipherShift(this.selectedWords[0]);
        } else {
          this.animateCaesarCipherEncryption();
        }
      });
    } else {
      console.log("All words encrypted. Launching packet.");
      this.launchEncryptedPacket();
    }
  }

  visualizeCaesarCipherShift(word) {
    // Clear previous visualizations
    if (this.shiftVisualizationObjects) {
      this.shiftVisualizationObjects.forEach((obj) => obj.destroy());
    }
    this.shiftVisualizationObjects = [];

    const popupWidth = 500;
    const popupHeight = 300;
    const centerX = this.scene.scale.width / 2;
    const centerY = this.scene.scale.height / 2;

    // Create background for visualization
    const background = this.scene.add.rectangle(
      centerX,
      centerY,
      popupWidth,
      popupHeight,
      0x000000,
      0.8
    );
    this.shiftVisualizationObjects.push(background);

    // Title explaining Caesar cipher
    const titleText = this.scene.add
      .text(centerX, centerY - 100, "Caesar Cipher Encryption", {
        fontSize: "24px",
        fill: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);
    this.shiftVisualizationObjects.push(titleText);

    // Shift explanation
    const shiftExplanation = this.scene.add
      .text(
        centerX,
        centerY - 50,
        `Use LEFT/RIGHT to navigate, UP/DOWN to shift characters`,
        {
          fontSize: "18px",
          fill: "#00ff00",
          align: "center",
        }
      )
      .setOrigin(0.5);
    this.shiftVisualizationObjects.push(shiftExplanation);

    // Original word display
    const originalWordText = this.scene.add
      .text(centerX, centerY, `Original: ${word}`, {
        fontSize: "22px",
        fill: "#ffffff",
      })
      .setOrigin(0.5);
    this.shiftVisualizationObjects.push(originalWordText);

    // Encrypted word display with cursor
    this.encryptedWordText = this.scene.add
      .text(centerX, centerY + 50, `Encrypted: ${word}`, {
        fontSize: "22px",
        fill: "#00ff00",
        fontFamily: "monospace",
      })
      .setOrigin(0.5);
    this.shiftVisualizationObjects.push(this.encryptedWordText);

    // Create cursor with proper initial position
    this.cursorText = this.scene.add
      .text(centerX, centerY + 80, "^", {
        fontSize: "22px",
        fill: "#ffff00",
        fontFamily: "monospace",
      })
      .setOrigin(0.5);
    this.shiftVisualizationObjects.push(this.cursorText);

    // Instructions for completion
    const completeText = this.scene.add
      .text(centerX, centerY + 130, "Press ENTER when finished", {
        fontSize: "18px",
        fill: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);
    this.shiftVisualizationObjects.push(completeText);

    // Store the current word and encryption state
    this.currentEncryptWord = word;
    this.currentEncryptedWord = word.split("");
    this.currentCharIndex = 0;

    // Update cursor position initially
    this.updateCursorPosition();

    // Remove any existing keyboard listener
    if (this.keydownListener) {
      this.scene.input.keyboard.off("keydown", this.keydownListener);
    }

    // Set up keyboard handler
    this.keydownListener = (event) => {
      if (
        this.shiftVisualizationObjects &&
        this.shiftVisualizationObjects.length > 0
      ) {
        switch (event.key) {
          case "ArrowLeft":
            // Move cursor left
            this.currentCharIndex = Math.max(0, this.currentCharIndex - 1);
            this.updateCursorPosition();
            break;

          case "ArrowRight":
            // Move cursor right
            this.currentCharIndex = Math.min(
              this.currentEncryptWord.length - 1,
              this.currentCharIndex + 1
            );
            this.updateCursorPosition();
            break;

          case "ArrowUp":
            // Shift character up
            this.shiftCurrentCharacter("up");
            this.updateDisplay();
            break;

          case "ArrowDown":
            // Shift character down
            this.shiftCurrentCharacter("down");
            this.updateDisplay();
            break;

          case "Enter":
            const encryptedWord = this.currentEncryptedWord.join("");

            // Remove visualization objects
            this.shiftVisualizationObjects.forEach((obj) => obj.destroy());
            this.shiftVisualizationObjects = null;

            // Remove keyboard listener
            this.scene.input.keyboard.off("keydown", this.keydownListener);

            // Process the encrypted word
            this.handleEncryptedWord(encryptedWord);
            break;
        }
      }
    };

    // Add keyboard listener
    this.scene.input.keyboard.on("keydown", this.keydownListener);
  }
  updateCursorPosition() {
    // Calculate position of cursor to align with the current character
    const prefix = "Encrypted: ";

    // Calculate base position (start of the encrypted text)
    const textMetrics = this.scene.add.text(0, 0, prefix, {
      fontSize: "22px",
      fill: "#00ff00",
      fontFamily: "monospace",
    });
    const prefixWidth = textMetrics.width;

    // Get character width using a single character
    const charMetrics = this.scene.add.text(0, 0, "W", {
      fontSize: "22px",
      fill: "#00ff00",
      fontFamily: "monospace",
    });
    const charWidth = charMetrics.width;

    // Calculate cursor position
    const baseX =
      this.encryptedWordText.x - this.encryptedWordText.width / 2 + prefixWidth;
    const cursorX = baseX + charWidth * this.currentCharIndex;

    // Clean up temporary text objects
    textMetrics.destroy();
    charMetrics.destroy();

    // Update cursor position
    this.cursorText.x = cursorX;
  }
  updateDisplay() {
    this.encryptedWordText.setText(
      `Encrypted: ${this.currentEncryptedWord.join("")}`
    );
    this.updateCursorPosition();
  }
  updateEncryptionVisualization(encryptedWordText) {
    // Update to properly display the current character
    const displayWord = this.currentEncryptWord
      .split("")
      .map((char, index) =>
        index === this.currentCharIndex
          ? `${this.currentEncryptedWord[index] || char}`
          : this.currentEncryptedWord[index] || char
      )
      .join("");

    encryptedWordText.setText(`Encrypted: ${displayWord}`);
  }
  shiftCurrentCharacter(direction) {
    const char = this.currentEncryptWord[this.currentCharIndex];

    if (char.match(/[a-zA-Z]/)) {
      // Get the current character from the encrypted word
      const currentChar = this.currentEncryptedWord[this.currentCharIndex];
      const base =
        currentChar === currentChar.toLowerCase()
          ? "a".charCodeAt(0)
          : "A".charCodeAt(0);
      const shift = direction === "up" ? this.caesarShift : -this.caesarShift;

      // Calculate new character code
      const currentCode = currentChar.charCodeAt(0);
      const newCode = ((currentCode - base + shift + 26) % 26) + base;
      this.currentEncryptedWord[this.currentCharIndex] =
        String.fromCharCode(newCode);
    }
  }

  // 2. Modify the showEncryptionMethodSelection method to check for attacks:
  showEncryptionMethodSelection() {
    // Close any existing popups first
    this.closePopup();

    // Ensure all word text objects are hidden
    this.wordTextObjects.forEach((wordText) => {
      wordText.setVisible(false);
    });

    // Check if a MITM attack should occur
    if (this.mitmAttack.checkForAttack()) {
      // Trigger the attack before showing encryption methods
      this.mitmAttack.triggerAttack((messageCorrupted) => {
        if (messageCorrupted) {
          // If message is corrupted, store that info for later
          this.messageCorrupted = true;
        }
        // Continue with showing encryption methods after attack is handled
        this.createEncryptionMethodUI();
      });
    } else {
      // No attack, proceed normally
      this.createEncryptionMethodUI();
    }
  }

  // 3. Add this new method:
  createEncryptionMethodUI() {
    // Create method selection popup
    this.menuBackground = this.scene.add.rectangle(
      this.scene.scale.width / 2,
      this.scene.scale.height / 2,
      500,
      500, // Increased height to accommodate RSA button
      0x000000,
      0.8
    );

    const titleText = this.scene.add
      .text(
        this.scene.scale.width / 2,
        this.scene.scale.height / 2 - 200,
        "Choose Encryption Method",
        {
          fontSize: "24px",
          fill: "#ffffff",
          align: "center",
        }
      )
      .setOrigin(0.5);

    // Show current wallet balance
    const balanceText = this.scene.add
      .text(
        this.scene.scale.width / 2,
        this.scene.scale.height / 2 - 150,
        `Available: ${this.scene.walletManager.coins} CC`,
        {
          fontSize: "18px",
          fill: "#ffd700",
          align: "center",
        }
      )
      .setOrigin(0.5);

    // Automatic Encryption Button
    const autoEncryptButton = this.scene.add
      .text(
        this.scene.scale.width / 2,
        this.scene.scale.height / 2 - 80,
        "Automatic Encryption\nCost: 20 CC | Time: 5s",
        {
          fontSize: "20px",
          fill: "#00ff00",
          backgroundColor: "#004400",
          padding: 10,
          align: "center",
        }
      )
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        if (this.scene.walletManager.spend(20)) {
          this.closePopup();
          this.isEncrypting = true;
          this.encryptionMethod = "automatic";
          this.performAutomaticEncryption();
        } else {
          this.showInsufficientFundsError();
        }
      });

    // Manual Encryption Button (Caesar Cipher)
    const manualEncryptButton = this.scene.add
      .text(
        this.scene.scale.width / 2,
        this.scene.scale.height / 2,
        "Caesar Cipher (Manual)\nCost: 5 CC | Time: 15s",
        {
          fontSize: "20px",
          fill: "#0000ff",
          backgroundColor: "#000044",
          padding: 10,
          align: "center",
        }
      )
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        if (this.scene.walletManager.spend(5)) {
          this.closePopup();
          this.isEncrypting = true;
          this.encryptionMethod = "manual";
          const firstWord = this.selectedWords[0];
          this.visualizeCaesarCipherShift(firstWord);
        } else {
          this.showInsufficientFundsError();
        }
      });

    // RSA Encryption Button
    const rsaEncryptButton = this.scene.add
      .text(
        this.scene.scale.width / 2,
        this.scene.scale.height / 2 + 80,
        "RSA Encryption\nCost: 15 CC | Time: 10s",
        {
          fontSize: "20px",
          fill: "#ff9900",
          backgroundColor: "#663300",
          padding: 10,
          align: "center",
        }
      )
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        if (this.scene.walletManager.spend(15)) {
          this.closePopup();
          this.isEncrypting = true;
          this.encryptionMethod = "rsa";
          const firstWord = this.selectedWords[0];
          // Use the direct visualization method instead of startRSAEncryption
          this.visualizeRSAEncryption(firstWord);
        } else {
          this.showInsufficientFundsError();
        }
      });

    // Add hover effects
    [autoEncryptButton, manualEncryptButton, rsaEncryptButton].forEach(
      (button) => {
        button.on("pointerover", () => {
          button.setScale(1.1);
          this.scene.tweens.add({
            targets: button,
            alpha: 0.8,
            duration: 100,
          });
        });
        button.on("pointerout", () => {
          button.setScale(1);
          this.scene.tweens.add({
            targets: button,
            alpha: 1,
            duration: 100,
          });
        });
      }
    );

    // Store elements for cleanup
    this.menuElements = [
      this.menuBackground,
      titleText,
      balanceText,
      autoEncryptButton,
      manualEncryptButton,
      rsaEncryptButton,
    ];
  }

  showInsufficientFundsError() {
    const errorText = this.scene.add
      .text(
        this.scene.scale.width / 2,
        this.scene.scale.height / 2 - 200,
        "Not enough CyberCoins!",
        {
          fontSize: "24px",
          fill: "#ff0000",
          backgroundColor: "#000000",
          padding: 5,
          stroke: "#ffffff",
          strokeThickness: 2,
        }
      )
      .setOrigin(0.5);

    this.scene.tweens.add({
      targets: errorText,
      alpha: { from: 1, to: 0 },
      y: "-=30",
      duration: 1500,
      ease: "Power2",
      onComplete: () => {
        errorText.destroy();
      },
    });
  }

  performAutomaticEncryption() {
    // Ensure we have two words selected
    if (this.selectedWords.length !== 2) {
      console.error("Not enough words selected for encryption");
      return;
    }

    // Create a separate popup for automatic encryption progress
    this.menuBackground = this.scene.add.rectangle(
      this.scene.scale.width / 2,
      this.scene.scale.height / 2,
      500,
      300,
      0x000000,
      0.8
    );

    const progressText = this.scene.add
      .text(
        this.scene.scale.width / 2,
        this.scene.scale.height / 2,
        "Performing Automatic Encryption...",
        {
          fontSize: "24px",
          fill: "#ffffff",
          align: "center",
        }
      )
      .setOrigin(0.5);

    this.menuElements = [this.menuBackground, progressText];

    // Trigger the Caesar cipher encryption animation
    this.animateCaesarCipherEncryption();
  }

  async performAdvancedEncryptionAnalysis(originalMessage, encryptedMessage) {
    try {
      const response = await fetch("http://localhost:5000/analyze_encryption", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          original_message: originalMessage,
          encrypted_message: encryptedMessage,
          encryption_method: this.encryptionMethod || "caesar_cipher",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        this.processEncryptionAnalysis(result);
      } else {
        console.error("Encryption analysis failed", result.error);
      }
    } catch (error) {
      console.error("Network or analysis error:", error);
      // Fallback to local scoring method
      this.fallbackLocalScoring(originalMessage, encryptedMessage);
    }
  }

  fallbackLocalScoring(originalMessage, encryptedMessage) {
    console.log("Original Message:", originalMessage);
    console.log("Encrypted Message:", encryptedMessage);

    const localScore = this.calculateLocalEncryptionScore(
      originalMessage,
      encryptedMessage
    );

    console.log("Calculated Local Score:", localScore);

    this.displayLocalEncryptionFeedback(localScore);
  }

  displayReceiverEncryptedMessage() {
    // Use the encrypted message from the class property
    const encryptedMessage = this.encryptedMessage;

    // Verify we have an encrypted message to display
    if (!encryptedMessage) {
      console.warn("No encrypted message to display");
      return;
    }

    // Create a cyberpunk-themed container for our custom speech bubble
    const bubbleContainer = this.scene.add
      .container(this.receiverX, this.receiverY - 80)
      .setDepth(10);

    // Create a custom speech bubble background with hexagonal/terminal style
    const bubbleBg = this.scene.add.graphics();
    const bubbleWidth = 350; // Slightly wider for encrypted message
    const bubbleHeight = 180;
    const cornerSize = 15;

    // Fill with translucent dark background (red tint for encrypted)
    bubbleBg.fillStyle(0x140a0a, 0.85);
    bubbleBg.fillRoundedRect(
      -bubbleWidth / 2,
      -bubbleHeight / 2,
      bubbleWidth,
      bubbleHeight,
      5
    );

    // Add tech-styled border (pink/red for encrypted)
    bubbleBg.lineStyle(2, 0xff33aa, 0.9);
    bubbleBg.strokeRoundedRect(
      -bubbleWidth / 2,
      -bubbleHeight / 2,
      bubbleWidth,
      bubbleHeight,
      5
    );

    // Add corner accents for cyberpunk style (pink/red)
    // Top-left corner
    bubbleBg.lineStyle(3, 0xff33aa, 1);
    bubbleBg.beginPath();
    bubbleBg.moveTo(-bubbleWidth / 2, -bubbleHeight / 2 + cornerSize);
    bubbleBg.lineTo(-bubbleWidth / 2, -bubbleHeight / 2);
    bubbleBg.lineTo(-bubbleWidth / 2 + cornerSize, -bubbleHeight / 2);
    bubbleBg.strokePath();

    // Top-right corner
    bubbleBg.beginPath();
    bubbleBg.moveTo(bubbleWidth / 2 - cornerSize, -bubbleHeight / 2);
    bubbleBg.lineTo(bubbleWidth / 2, -bubbleHeight / 2);
    bubbleBg.lineTo(bubbleWidth / 2, -bubbleHeight / 2 + cornerSize);
    bubbleBg.strokePath();

    // Bottom-left corner
    bubbleBg.beginPath();
    bubbleBg.moveTo(-bubbleWidth / 2, bubbleHeight / 2 - cornerSize);
    bubbleBg.lineTo(-bubbleWidth / 2, bubbleHeight / 2);
    bubbleBg.lineTo(-bubbleWidth / 2 + cornerSize, bubbleHeight / 2);
    bubbleBg.strokePath();

    // Bottom-right corner
    bubbleBg.beginPath();
    bubbleBg.moveTo(bubbleWidth / 2 - cornerSize, bubbleHeight / 2);
    bubbleBg.lineTo(bubbleWidth / 2, bubbleHeight / 2);
    bubbleBg.lineTo(bubbleWidth / 2, bubbleHeight / 2 - cornerSize);
    bubbleBg.strokePath();

    // Add a terminal-style header bar (darker for encrypted)
    const headerBg = this.scene.add
      .rectangle(0, -bubbleHeight / 2 + 15, bubbleWidth - 4, 30, 0x1a0a0a, 1)
      .setStrokeStyle(1, 0xff33aa);

    // Add message source indicator
    const headerText = this.scene.add
      .text(0, -bubbleHeight / 2 + 15, "RECEIVER: RX [ENCRYPTED]", {
        fontSize: "14px",
        fontFamily: "Courier New",
        fill: "#ff33aa",
        align: "center",
      })
      .setOrigin(0.5);

    // Add a connection strength indicator (encrypted)
    const encryptionIndicator = this.scene.add.container(
      bubbleWidth / 2 - 40,
      -bubbleHeight / 2 + 15
    );

    // Create a flashing encryption indicator
    const encryptText = this.scene.add
      .text(0, 0, "ENCRYPTED", {
        fontSize: "11px",
        fontFamily: "Courier New",
        fill: "#ff0066",
        align: "right",
      })
      .setOrigin(0.5);

    encryptionIndicator.add(encryptText);

    // Add a flashing animation to the encryption indicator
    this.scene.tweens.add({
      targets: encryptText,
      alpha: 0.5,
      duration: 500,
      yoyo: true,
      repeat: -1,
    });

    // Add a triangle pointer at the bottom of the bubble
    const pointer = this.scene.add.graphics();
    pointer.fillStyle(0x140a0a, 0.85);
    pointer.lineStyle(2, 0xff33aa, 0.9);
    pointer.beginPath();
    pointer.moveTo(-15, bubbleHeight / 2);
    pointer.lineTo(0, bubbleHeight / 2 + 20);
    pointer.lineTo(15, bubbleHeight / 2);
    pointer.closePath();
    pointer.fillPath();
    pointer.strokePath();

    // Add encryption status line
    const statusLine = this.scene.add
      .text(0, -10, "// ENCRYPTED TRANSMISSION //", {
        fontSize: "12px",
        fontFamily: "Courier New",
        fill: "#ff5599",
        align: "center",
      })
      .setOrigin(0.5);

    // Add the encrypted text with better wrapping and style - use exact same message
    const bubbleText = this.scene.add
      .text(0, 20, encryptedMessage, {
        fontSize: "18px",
        fontFamily: "Courier New",
        fill: "#ffaaff",
        stroke: "#330022",
        strokeThickness: 1,
        align: "center",
        wordWrap: { width: bubbleWidth - 40, useAdvancedWrap: true },
        lineSpacing: 5,
      })
      .setOrigin(0.5);

    // Add scan lines overlay effect (subtle)
    const scanLines = this.scene.add.graphics();
    scanLines.lineStyle(1, 0xff33aa, 0.1);
    for (let i = -bubbleHeight / 2 + 30; i < bubbleHeight / 2; i += 4) {
      scanLines.beginPath();
      scanLines.moveTo(-bubbleWidth / 2 + 5, i);
      scanLines.lineTo(bubbleWidth / 2 - 5, i);
      scanLines.strokePath();
    }

    // Add digital noise effect for encrypted message
    const noise = this.scene.add.graphics();

    const updateNoise = () => {
      noise.clear();
      noise.fillStyle(0xff33aa, 0.03);

      for (let i = 0; i < 15; i++) {
        const x = Phaser.Math.Between(
          -bubbleWidth / 2 + 10,
          bubbleWidth / 2 - 10
        );
        const y = Phaser.Math.Between(
          -bubbleHeight / 2 + 30,
          bubbleHeight / 2 - 10
        );
        const size = Phaser.Math.Between(2, 6);

        noise.fillRect(x, y, size, size);
      }
    };

    // Update noise every 100ms
    const noiseTimer = this.scene.time.addEvent({
      delay: 100,
      callback: updateNoise,
      loop: true,
    });

    // Add all elements to the container
    bubbleContainer.add([
      bubbleBg,
      headerBg,
      headerText,
      encryptionIndicator,
      statusLine,
      bubbleText,
      pointer,
      scanLines,
      noise,
    ]);

    // Start with zero alpha
    bubbleContainer.setAlpha(0);

    // Add fade-in animation with slight bounce effect
    this.scene.tweens.add({
      targets: bubbleContainer,
      alpha: 1,
      y: this.receiverY - 70, // Slight upward animation
      duration: 500,
      ease: "Back.easeOut",
    });

    // Add subtle floating animation
    this.scene.tweens.add({
      targets: bubbleContainer,
      y: "-=5",
      duration: 2000,
      yoyo: true,
      repeat: 1,
      ease: "Sine.easeInOut",
    });

    // Automatically remove the speech bubble after a delay
    this.scene.time.delayedCall(6000, () => {
      // Slightly longer for encrypted messages
      this.scene.tweens.add({
        targets: bubbleContainer,
        alpha: 0,
        y: "-=30",
        duration: 700,
        ease: "Power2",
        onComplete: () => {
          bubbleContainer.destroy();
          noiseTimer.remove(); // Clean up the noise timer
        },
      });
    });
  }

  caesarCipherEncrypt(text, shift) {
    return text
      .split("")
      .map((char) => {
        // Only encrypt alphabetic characters
        if (char.match(/[a-zA-Z]/)) {
          // Determine the base (uppercase or lowercase)
          const base =
            char.toLowerCase() === char ? "a".charCodeAt(0) : "A".charCodeAt(0);

          // Apply Caesar cipher shift
          return String.fromCharCode(
            ((char.charCodeAt(0) - base + shift + 26) % 26) + base
          );
        }
        // Return non-alphabetic characters as-is
        return char;
      })
      .join("");
  }

  animateCaesarCipherEncryption() {
    if (!this.isEncrypting || this.selectedWords.length !== 2) return;

    // Remove the previous popup first
    this.closePopup();

    // Ensure word text objects are visible
    this.wordTextObjects.forEach((wordText) => {
      wordText.setVisible(true);
      wordText.setAlpha(1);
    });

    // Find the indices of the selected words
    const wordIndices = this.selectedWords.map((word) =>
      this.tokenizedMessage.indexOf(word)
    );

    // Create encryption animation
    wordIndices.forEach((wordIndex) => {
      const originalWord = this.tokenizedMessage[wordIndex];
      const encryptedWord = this.caesarCipherEncrypt(
        originalWord,
        this.caesarShift
      );

      // Animate word transformation
      const wordText = this.wordTextObjects[wordIndex];

      // Create a tween to animate the word encryption
      this.scene.tweens.add({
        targets: wordText,
        scaleX: 1.5,
        scaleY: 1.5,
        duration: 500,
        yoyo: true,
        ease: "Quad.easeInOut",
        onUpdate: (tween) => {
          const progress = tween.getValue();
          // Interpolate between original and encrypted word
          const currentWord = this.interpolateWord(
            originalWord,
            encryptedWord,
            progress
          );
          wordText.setText(currentWord);
        },
        onComplete: () => {
          // Set final encrypted word
          wordText.setText(encryptedWord);
          wordText.setBackgroundColor("#ff0000"); // Red to indicate encryption
          this.updateEncryptedMessage(encryptedWord, wordIndex);
        },
      });
    });

    // Close encryption menu after animation
    this.scene.time.delayedCall(1500, () => {
      this.closeEncryptionMenu();
      this.launchEncryptedPacket();
    });
  }

  updateEncryptedMessage(encryptedWord, wordIndex) {
    // Replace the original word with its encrypted version in the tokenized message
    this.tokenizedMessage[wordIndex] = encryptedWord;

    // Reconstruct the full encrypted message
    this.encryptedMessage = this.tokenizedMessage.join(" ");
    console.log("Full Encrypted Message:", this.encryptedMessage);
  }

  launchEncryptedPacket() {
    // Check if message is corrupted from MITM attack
    if (this.messageCorrupted) {
      // Corrupt the message
      this.encryptedMessage = this.mitmAttack.corruptMessage(
        this.encryptedMessage
      );
      this.messageCorrupted = false; // Reset the flag
    }

    // Stopping Timer when packet is launched
    if (this.scene.timeManager && this.scene.timeManager.isActive) {
      // Get remaining time for potential bonus
      const remainingSeconds = Math.ceil(
        this.scene.timeManager.timeRemaining / 1000
      );

      // Stop the timer
      this.scene.timeManager.isActive = false;
      if (this.scene.timeManager.timerEvent) {
        this.scene.timeManager.timerEvent.remove();
      }

      // Award bonus coins if completed quickly
      if (remainingSeconds >= 15) {
        this.scene.walletManager.addBonus(10);
        // Show bonus message
        const bonusText = this.scene.add
          .text(
            this.scene.scale.width / 2,
            this.scene.scale.height / 2 - 100,
            "Time Bonus: +10 CC!",
            {
              fontSize: "24px",
              fill: "#00ff00",
              stroke: "#000000",
              strokeThickness: 4,
            }
          )
          .setOrigin(0.5);

        this.scene.tweens.add({
          targets: bonusText,
          alpha: 0,
          y: "-=50",
          duration: 2000,
          ease: "Power2",
          onComplete: () => bonusText.destroy(),
        });
      }
    }

    // Make sure packet is visible at the defender's position
    this.packet.setPosition(this.dX, this.dY);
    this.packet.setVisible(true);

    // Get references to receiver and its final position
    const receiver = this.scene.receiver;
    const receiverFinalX = this.scene.receiverFinalX || this.rX;
    const receiverFinalY = this.scene.receiverFinalY || this.rY;

    // First display the encrypted message on defender side
    this.displaySpeechBubble(
      this.dX,
      this.dY - 50,
      `Sending encrypted packet: ${this.encryptedMessage}`,
      true
    );

    // Define the network path nodes
    const leftSwitchX = this.scene.leftSwitch
      ? this.scene.leftSwitch.x
      : this.dX;
    const leftSwitchY = this.scene.leftSwitch
      ? this.scene.leftSwitch.y
      : this.dY;
    const rightSwitchX = this.scene.rightSwitch
      ? this.scene.rightSwitch.x
      : this.rX;
    const rightSwitchY = this.scene.rightSwitch
      ? this.scene.rightSwitch.y
      : this.rY;

    // Step 1: Packet moves from defender to the left switch
    this.packetTween = this.scene.tweens.add({
      targets: this.packet,
      x: leftSwitchX,
      y: leftSwitchY,
      duration: 600,
      ease: "Cubic.easeInOut",
      onComplete: () => {
        // Pause briefly at the switch to show data processing
        this.scene.time.delayedCall(200, () => {
          // Step 2: Packet moves from left switch to right switch
          this.scene.tweens.add({
            targets: this.packet,
            x: rightSwitchX,
            y: rightSwitchY,
            duration: 600,
            ease: "Cubic.easeInOut",
            onComplete: () => {
              // As the packet reaches the right switch, have the receiver move toward it
              this.scene.tweens.add({
                targets: receiver,
                x: receiverFinalX,
                y: receiverFinalY,
                duration: 400,
                ease: "Power2",
                onComplete: () => {
                  // Step 3: Packet completes journey to receiver
                  this.scene.tweens.add({
                    targets: this.packet,
                    x: this.rX,
                    y: this.rY,
                    duration: 400,
                    ease: "Power2.easeIn",
                    onComplete: () => {
                      // Display packet arrival effect and encrypted message
                      this.displayPacketArrivalEffect();
                      this.displayReceiverEncryptedMessage();
                      this.performAdvancedEncryptionAnalysis(
                        this.lastMessage,
                        this.encryptedMessage
                      );
                    },
                  });
                },
              });
            },
          });
        });
      },
    });
  }
  processEncryptionAnalysis(result) {
    // Update security score based on the analysis result
    if (result && result.security_score) {
      this.securityScore = result.security_score;
      this.userScore += result.security_score;

      // Optional: Display feedback
      console.log("Encryption Analysis Result:", result);
      this.displayEncryptionFeedback(result);
    }
  }

  displayEncryptionFeedback(result) {
    // Create a more comprehensive feedback text
    const feedbackText = this.scene.add
      .text(
        this.rX,
        this.rY - 150, // Adjusted position
        `⁠Security Score: ${result.security_score}\n` +
          `⁠Recommendations:\n${result.recommendations.join("\n")}⁠`,
        {
          fontSize: "16px",
          fill: "#ffffff",
          backgroundColor: "#000000",
          padding: 10,
          align: "center",
          wordWrap: { width: 300 },
        }
      )
      .setOrigin(0.5);

    // Fade out the feedback after a few seconds
    this.scene.tweens.add({
      targets: feedbackText,
      alpha: 0,
      duration: 5000,
      delay: 3000,
      onComplete: () => {
        feedbackText.destroy();
      },
    });
  }

  fallbackLocalScoring(originalMessage, encryptedMessage) {
    // Implement a simplified local scoring mechanism
    const localScore = this.calculateLocalEncryptionScore(
      originalMessage,
      encryptedMessage
    );

    this.displayLocalEncryptionFeedback(localScore);
  }

  calculateLocalEncryptionScore(originalMessage, encryptedMessage) {
    // More comprehensive local scoring algorithm
    const lengthFactor = originalMessage.length;
    const uniqueCharsFactor = new Set(encryptedMessage).size;
    const shiftComplexity = this.caesarShift;

    // Calculate a more nuanced score
    const baseScore = (uniqueCharsFactor / lengthFactor) * 10;
    const shiftBonus = (shiftComplexity / 26) * 5;
    const complexityBonus = this.checkEncryptionComplexity(
      originalMessage,
      encryptedMessage
    );

    const totalScore = Math.round(baseScore + shiftBonus + complexityBonus);

    console.log("Encryption Score Breakdown:", {
      baseScore,
      shiftBonus,
      complexityBonus,
      totalScore,
    });

    return Math.min(totalScore, 100); // Cap the score at 100
  }

  checkEncryptionComplexity(originalMessage, encryptedMessage) {
    // Add additional complexity checks
    const differentCharacters = originalMessage
      .split("")
      .filter((char, index) => char !== encryptedMessage[index]).length;

    const complexityRatio = differentCharacters / originalMessage.length;

    return complexityRatio * 20; // Bonus up to 20 points for complexity
  }

  displayLocalEncryptionFeedback(localScore) {
    // Create a more prominent and longer-lasting feedback text
    const feedbackText = this.scene.add
      .text(
        this.scene.scale.width / 2, // Center horizontally
        this.scene.scale.height * 0.2, // Position higher on the screen
        `Local Security Score: ${localScore}`,
        {
          fontSize: "24px",
          fill: "#ffffff",
          backgroundColor: "#000000",
          padding: 10,
          align: "center",
        }
      )
      .setOrigin(0.5)
      .setDepth(100); // Ensure it's above other elements

    // Make the feedback more visible and stay longer
    this.scene.tweens.add({
      targets: feedbackText,
      alpha: { from: 0, to: 1 },
      duration: 500,
      yoyo: true,
      hold: 3000,
      onComplete: () => {
        feedbackText.destroy();
      },
    });

    // Update the user's score
    this.userScore = localScore;
    console.log("User Score Updated:", this.userScore);
  }

  openEncryptionTutorial(word) {
    console.log("openEncryptionTutorial called with word:", word);
    console.log("EncryptionTutorial exists:", !!this.EncryptionTutorial);

    if (!this.EncryptionTutorial) {
      console.error("EncryptionTutorial class is not defined");
      return;
    }
    console.log("reached here", word);
    // Start tutorial with the current word
    this.EncryptionTutorial.startEncryptionTutorial(word, (encryptedWord) => {
      console.log("Encryption Tutorial callback received:", encryptedWord);
      this.handleEncryptedWord(encryptedWord);
    });
  }

  handleEncryptedWord(encryptedWord) {
    console.log("handleEncryptedWord called with:", encryptedWord);

    // Find the index of the current word being encrypted
    const currentWord = this.selectedWords[0];
    const wordIndex = this.tokenizedMessage.indexOf(currentWord);

    // Replace the current word with its encrypted version
    this.tokenizedMessage[wordIndex] = encryptedWord;

    // Update the corresponding word text object
    if (this.wordTextObjects[wordIndex]) {
      this.wordTextObjects[wordIndex].setText(encryptedWord);
      this.wordTextObjects[wordIndex].setBackgroundColor("#ff0000");
    }

    // Remove the processed word from selectedWords
    this.selectedWords.shift();

    // Reconstruct the full encrypted message
    this.encryptedMessage = this.tokenizedMessage.join(" ");
    console.log("Partially Encrypted Message:", this.encryptedMessage);

    // Check if we still have words to encrypt
    if (this.selectedWords.length > 0) {
      console.log("Preparing to encrypt next word:", this.selectedWords[0]);

      // Hide all word text objects to prevent overlap
      this.wordTextObjects.forEach((wordText) => {
        wordText.setVisible(false);
      });

      // Directly start encryption for the next word without showing method selection
      if (this.encryptionMethod === "manual") {
        // Small delay to ensure clean transition
        this.scene.time.delayedCall(100, () => {
          this.visualizeCaesarCipherShift(this.selectedWords[0]);
        });
      } else if (this.encryptionMethod === "automatic") {
        this.animateCaesarCipherEncryption();
      }
    } else {
      console.log("All words encrypted. Launching packet.");
      this.launchEncryptedPacket();
    }
  }

  displayPacketArrivalEffect() {
    // Create a more visually impressive highlight at the receiver's switch
    const arrivalHighlight = this.scene.add.circle(
      this.rX,
      this.rY,
      this.packet.width * 1.5, // Larger radius
      0x00ff88, // Brighter green
      0.6 // Higher opacity
    );

    // Add a second, larger highlight for a better effect
    const outerHighlight = this.scene.add.circle(
      this.rX,
      this.rY,
      this.packet.width * 2.5,
      0x00ff88,
      0.2
    );

    // Add particles for more excitement
    const particles = this.scene.add.particles(this.rX, this.rY, "packet", {
      speed: { min: 50, max: 150 },
      scale: { start: 0.08, end: 0 },
      blendMode: "ADD",
      lifespan: 800,
      quantity: 15,
    });

    // Fade out the highlight with pulse animation
    this.scene.tweens.add({
      targets: arrivalHighlight,
      alpha: 0,
      scale: 1.3,
      duration: 800,
      ease: "Sine.easeOut",
      onComplete: () => {
        arrivalHighlight.destroy();
      },
    });

    // Fade out the outer highlight
    this.scene.tweens.add({
      targets: outerHighlight,
      alpha: 0,
      scale: 1.5,
      duration: 1200,
      ease: "Sine.easeOut",
      onComplete: () => {
        outerHighlight.destroy();
      },
    });

    // Clean up particles after animation
    this.scene.time.delayedCall(800, () => {
      particles.destroy();
    });
  }

  interpolateWord(original, encrypted, progress) {
    if (progress <= 0.5) {
      // First half of animation: gradually distort original word
      return original
        .split("")
        .map((char, index) => {
          if (index < Math.floor(progress * original.length * 2)) {
            return char;
          }
          return String.fromCharCode(
            char.charCodeAt(0) + Math.floor(Math.random() * 10)
          );
        })
        .join("");
    } else {
      // Second half of animation: gradually reveal encrypted word
      return encrypted
        .split("")
        .map((char, index) => {
          if (index < Math.floor((progress - 0.5) * 2 * encrypted.length)) {
            return char;
          }
          return "_";
        })
        .join("");
    }
  }

  openMessagePopup() {
    if (!this.menuActive) {
      this.menuActive = true;
      this.isSelectingWords = false;

      // Popup Menu setup
      // Create a dark overlay for better focus
      this.menuOverlay = this.scene.add
        .rectangle(
          0,
          0,
          this.scene.scale.width,
          this.scene.scale.height,
          0x000000,
          0.5
        )
        .setOrigin(0, 0);

      // Enhanced popup menu background
      this.menuBackground = this.scene.add.rectangle(
        this.scene.scale.width / 2,
        this.scene.scale.height / 2,
        460,
        320,
        0x000000,
        0.85
      );

      // Add a cyber-themed border
      this.menuBorder = this.scene.add.graphics();
      this.menuBorder.lineStyle(2, 0x00ffaa, 0.8);
      this.menuBorder.strokeRect(
        this.scene.scale.width / 2 - 230,
        this.scene.scale.height / 2 - 160,
        460,
        320
      );

      // Add corner accents
      this.menuBorder.lineStyle(3, 0x00ffff, 1);
      // Top-left corner
      this.menuBorder.beginPath();
      this.menuBorder.moveTo(
        this.scene.scale.width / 2 - 230,
        this.scene.scale.height / 2 - 140
      );
      this.menuBorder.lineTo(
        this.scene.scale.width / 2 - 230,
        this.scene.scale.height / 2 - 160
      );
      this.menuBorder.lineTo(
        this.scene.scale.width / 2 - 210,
        this.scene.scale.height / 2 - 160
      );
      this.menuBorder.strokePath();

      // Top-right corner
      this.menuBorder.beginPath();
      this.menuBorder.moveTo(
        this.scene.scale.width / 2 + 210,
        this.scene.scale.height / 2 - 160
      );
      this.menuBorder.lineTo(
        this.scene.scale.width / 2 + 230,
        this.scene.scale.height / 2 - 160
      );
      this.menuBorder.lineTo(
        this.scene.scale.width / 2 + 230,
        this.scene.scale.height / 2 - 140
      );
      this.menuBorder.strokePath();

      // Bottom-left corner
      this.menuBorder.beginPath();
      this.menuBorder.moveTo(
        this.scene.scale.width / 2 - 230,
        this.scene.scale.height / 2 + 140
      );
      this.menuBorder.lineTo(
        this.scene.scale.width / 2 - 230,
        this.scene.scale.height / 2 + 160
      );
      this.menuBorder.lineTo(
        this.scene.scale.width / 2 - 210,
        this.scene.scale.height / 2 + 160
      );
      this.menuBorder.strokePath();

      // Bottom-right corner
      this.menuBorder.beginPath();
      this.menuBorder.moveTo(
        this.scene.scale.width / 2 + 210,
        this.scene.scale.height / 2 + 160
      );
      this.menuBorder.lineTo(
        this.scene.scale.width / 2 + 230,
        this.scene.scale.height / 2 + 160
      );
      this.menuBorder.lineTo(
        this.scene.scale.width / 2 + 230,
        this.scene.scale.height / 2 + 140
      );
      this.menuBorder.strokePath();

      // Terminal header bar
      this.headerBar = this.scene.add.rectangle(
        this.scene.scale.width / 2,
        this.scene.scale.height / 2 - 140,
        458,
        30,
        0x001a1a,
        1
      );

      let promptText = this.lastMessage
        ? "Select two words for encryption"
        : "Write your message:";

      this.menuText = this.scene.add
        .text(
          this.scene.scale.width / 2,
          this.scene.scale.height / 2 - 100,
          promptText,
          {
            fontSize: "24px",
            fill: "#ffffff",
            align: "center",
          }
        )
        .setOrigin(0.5);

      this.messageInput = this.scene.add
        .text(this.scene.scale.width / 2, this.scene.scale.height / 2, "_", {
          fontSize: "20px",
          fill: "#ffffff",
        })
        .setOrigin(0.5);

      if (!this.lastMessage) {
        this.userMessage = ""; // New message entry
      } else {
        this.userMessage = this.lastMessage; // For encryption
        this.displayTokenizedMessage(this.tokenizedMessage);
        this.isSelectingWords = true;
        this.startWordSelectionTimer(); // Start timer for word selection
      }

      // Remove previous keydown listener if exists
      if (this.keydownListener) {
        this.scene.input.keyboard.off("keydown", this.keydownListener);
      }

      this.keydownListener = (event) => {
        if (this.menuActive) {
          if (!this.lastMessage) {
            // Message typing logic
            if (event.key === "Backspace") {
              this.userMessage = this.userMessage.slice(0, -1);
            } else if (
              event.key.length === 1 &&
              /[a-zA-Z0-9 ]/.test(event.key)
            ) {
              this.userMessage += event.key;
            } else if (event.key === "Enter") {
              this.lastMessage = this.userMessage;
              this.menuActive = false;

              this.displaySpeechBubble(this.dX, this.dY - 50, this.userMessage);

              // Tokenize and store the message
              this.tokenizedMessage = this.userMessage.split(/\s+/);
              console.log("Tokenized message:", this.tokenizedMessage);

              // Clean up the message input popup
              this.closePopup();

              // Reopen for word selection with timer
              this.scene.time.delayedCall(500, () => {
                this.openMessagePopup();
              });
            }
            this.messageInput.setText(this.userMessage + "_");
          } else {
            // Word selection phase is handled by handleWordClick
            if (event.key === "Escape") {
              this.closePopup();
              if (this.wordSelectionTimer) {
                this.wordSelectionTimer.remove();
              }
              if (this.wordSelectionText) {
                this.wordSelectionText.destroy();
              }
            }
          }
        }
      };

      // Attach the new listener
      this.scene.input.keyboard.on("keydown", this.keydownListener);

      // Store all menu elements for cleanup
      this.menuElements = [
        this.menuBackground,
        this.menuText,
        this.messageInput,
      ];
    }
  }
  startWordSelectionTimer() {
    // Clear any existing timer
    if (this.wordSelectionTimer) {
      this.wordSelectionTimer.remove();
    }

    // Remove previous timer text if exists
    if (this.wordSelectionText) {
      this.wordSelectionText.destroy();
    }

    // Create timer text
    this.wordSelectionText = this.scene.add
      .text(
        this.scene.scale.width / 2,
        this.scene.scale.height / 2 - 150,
        `Time Remaining: ${this.wordSelectionTimeLimit}`,
        {
          fontSize: "24px",
          fill: "#ffffff",
          backgroundColor: "#000000",
          padding: 10,
        }
      )
      .setOrigin(0.5);

    // Start countdown
    this.wordSelectionTimer = this.scene.time.addEvent({
      delay: 1000,
      repeat: this.wordSelectionTimeLimit - 1,
      callback: () => {
        const timeRemaining = this.wordSelectionTimer.getRepeatCount();
        this.wordSelectionText.setText(`Time Remaining: ${timeRemaining}`);

        // Change color when time is low
        if (timeRemaining <= 2) {
          this.wordSelectionText.setColor("#ff0000");
        }

        // Time's up
        if (timeRemaining === 0) {
          this.handleWordSelectionTimeout();
        }
      },
    });
  }
  // Update the handleWordSelectionTimeout method
  handleWordSelectionTimeout() {
    // Clear the timer display
    if (this.wordSelectionText) {
      this.wordSelectionText.destroy();
    }

    // Hide all word text objects before random selection
    this.wordTextObjects.forEach((wordText) => {
      wordText.setVisible(false);
    });

    // Handle different cases based on number of selected words
    if (this.selectedWords.length === 0) {
      // Select two random words
      this.selectRandomWords(2);
    } else if (this.selectedWords.length === 1) {
      // Select one additional random word
      this.selectRandomWords(1);
    }

    // Short delay before showing encryption method selection
    this.scene.time.delayedCall(100, () => {
      this.showEncryptionMethodSelection();
    });
  }
  selectRandomWords(count) {
    // Get all available words (excluding already selected ones)
    const availableWords = this.tokenizedMessage.filter(
      (word) => !this.selectedWords.includes(word)
    );

    // Randomly select required number of words
    for (let i = 0; i < count; i++) {
      if (availableWords.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableWords.length);
        const selectedWord = availableWords.splice(randomIndex, 1)[0];
        this.selectedWords.push(selectedWord);
      }
    }

    console.log("Final selected words:", this.selectedWords);
  }
  displaySpeechBubble(x, y, message, isEncrypted = false) {
    // Store the message that's being displayed for consistency
    if (isEncrypted) {
      this.currentDisplayedEncryptedMessage = message;
    } else {
      this.currentDisplayedMessage = message;
    }

    // Create a cyberpunk-themed container for our custom speech bubble
    const bubbleContainer = this.scene.add.container(x, y - 80).setDepth(10);

    // Create a custom speech bubble background with hexagonal/terminal style
    const bubbleBg = this.scene.add.graphics();
    const bubbleWidth = 320;
    const bubbleHeight = 160;
    const cornerSize = 15;

    // Fill with translucent dark background
    bubbleBg.fillStyle(0x000a14, 0.85);
    bubbleBg.fillRoundedRect(
      -bubbleWidth / 2,
      -bubbleHeight / 2,
      bubbleWidth,
      bubbleHeight,
      5
    );

    // Add tech-styled border
    bubbleBg.lineStyle(2, 0x00ffaa, 0.9);
    bubbleBg.strokeRoundedRect(
      -bubbleWidth / 2,
      -bubbleHeight / 2,
      bubbleWidth,
      bubbleHeight,
      5
    );

    // Add corner accents for cyberpunk style
    // Top-left corner
    bubbleBg.lineStyle(3, 0x00ffaa, 1);
    bubbleBg.beginPath();
    bubbleBg.moveTo(-bubbleWidth / 2, -bubbleHeight / 2 + cornerSize);
    bubbleBg.lineTo(-bubbleWidth / 2, -bubbleHeight / 2);
    bubbleBg.lineTo(-bubbleWidth / 2 + cornerSize, -bubbleHeight / 2);
    bubbleBg.strokePath();

    // Top-right corner
    bubbleBg.beginPath();
    bubbleBg.moveTo(bubbleWidth / 2 - cornerSize, -bubbleHeight / 2);
    bubbleBg.lineTo(bubbleWidth / 2, -bubbleHeight / 2);
    bubbleBg.lineTo(bubbleWidth / 2, -bubbleHeight / 2 + cornerSize);
    bubbleBg.strokePath();

    // Bottom-left corner
    bubbleBg.beginPath();
    bubbleBg.moveTo(-bubbleWidth / 2, bubbleHeight / 2 - cornerSize);
    bubbleBg.lineTo(-bubbleWidth / 2, bubbleHeight / 2);
    bubbleBg.lineTo(-bubbleWidth / 2 + cornerSize, bubbleHeight / 2);
    bubbleBg.strokePath();

    // Bottom-right corner
    bubbleBg.beginPath();
    bubbleBg.moveTo(bubbleWidth / 2 - cornerSize, bubbleHeight / 2);
    bubbleBg.lineTo(bubbleWidth / 2, bubbleHeight / 2);
    bubbleBg.lineTo(bubbleWidth / 2, bubbleHeight / 2 - cornerSize);
    bubbleBg.strokePath();

    // Add a terminal-style header bar
    const headerBg = this.scene.add
      .rectangle(0, -bubbleHeight / 2 + 15, bubbleWidth - 4, 30, 0x001a1a, 1)
      .setStrokeStyle(1, 0x00ffaa);

    // Add message source indicator
    const headerText = this.scene.add
      .text(0, -bubbleHeight / 2 + 15, "DEFENDER: TX", {
        fontSize: "14px",
        fontFamily: "Courier New",
        fill: "#00ffaa",
        align: "center",
      })
      .setOrigin(0.5);

    // Add a connection strength indicator
    const connectionText = this.scene.add
      .text(bubbleWidth / 2 - 40, -bubbleHeight / 2 + 15, "SECURE", {
        fontSize: "11px",
        fontFamily: "Courier New",
        fill: "#00ff00",
        align: "right",
      })
      .setOrigin(0.5);

    // Add a triangle pointer at the bottom of the bubble
    const pointer = this.scene.add.graphics();
    pointer.fillStyle(0x000a14, 0.85);
    pointer.lineStyle(2, 0x00ffaa, 0.9);
    pointer.beginPath();
    pointer.moveTo(-15, bubbleHeight / 2);
    pointer.lineTo(0, bubbleHeight / 2 + 20);
    pointer.lineTo(15, bubbleHeight / 2);
    pointer.closePath();
    pointer.fillPath();
    pointer.strokePath();

    // Add the text with better wrapping and style
    const bubbleText = this.scene.add
      .text(0, 5, message, {
        fontSize: "18px",
        fontFamily: "Courier New",
        fill: "#ffffff",
        stroke: "#00332a",
        strokeThickness: 1,
        align: "center",
        wordWrap: { width: bubbleWidth - 40, useAdvancedWrap: true },
        lineSpacing: 5,
      })
      .setOrigin(0.5);

    // Add scan lines overlay effect (subtle)
    const scanLines = this.scene.add.graphics();
    scanLines.lineStyle(1, 0x00ffaa, 0.1);
    for (let i = -bubbleHeight / 2 + 30; i < bubbleHeight / 2; i += 4) {
      scanLines.beginPath();
      scanLines.moveTo(-bubbleWidth / 2 + 5, i);
      scanLines.lineTo(bubbleWidth / 2 - 5, i);
      scanLines.strokePath();
    }

    // Add a typing animation for the text
    const fullText = message;
    bubbleText.setText("");
    let currentCharacter = 0;

    // Create typing timer
    const typingTimer = this.scene.time.addEvent({
      delay: 20,
      repeat: fullText.length - 1,
      callback: () => {
        bubbleText.text += fullText[currentCharacter];
        currentCharacter++;
      },
    });

    // Add all elements to the container
    bubbleContainer.add([
      bubbleBg,
      headerBg,
      headerText,
      connectionText,
      bubbleText,
      pointer,
      scanLines,
    ]);

    // Start with zero alpha
    bubbleContainer.setAlpha(0);

    // Add fade-in animation with slight bounce effect
    this.scene.tweens.add({
      targets: bubbleContainer,
      alpha: 1,
      y: y - 70, // Slight upward animation
      duration: 500,
      ease: "Back.easeOut",
    });

    // Add subtle floating animation
    this.scene.tweens.add({
      targets: bubbleContainer,
      y: "-=5",
      duration: 2000,
      yoyo: true,
      repeat: 1,
      ease: "Sine.easeInOut",
    });

    // Automatically remove the speech bubble after a delay
    this.scene.time.delayedCall(5000, () => {
      this.scene.tweens.add({
        targets: bubbleContainer,
        alpha: 0,
        y: "-=30",
        duration: 700,
        ease: "Power2",
        onComplete: () => {
          bubbleContainer.destroy();
        },
      });
    });

    return bubbleContainer; // Return for potential future reference
  }

  // Update the closePopup method to ensure proper cleanup of word selection elements

  closePopup() {
    // Destroy previous menu background and text
    if (this.menuBackground) {
      this.menuBackground.destroy();
      this.menuBackground = null;
    }

    if (this.menuText) {
      this.menuText.destroy();
      this.menuText = null;
    }

    if (this.messageInput) {
      this.messageInput.destroy();
      this.messageInput = null;
    }

    if (this.menuOverlay) {
      this.menuOverlay.destroy();
      this.menuOverlay = null;
    }

    if (this.menuBorder) {
      this.menuBorder.destroy();
      this.menuBorder = null;
    }

    if (this.headerBar) {
      this.headerBar.destroy();
      this.headerBar = null;
    }

    // Clean up word selection timer
    if (this.wordSelectionTimer) {
      this.wordSelectionTimer.remove();
      this.wordSelectionTimer = null;
    }

    if (this.wordSelectionText) {
      this.wordSelectionText.destroy();
      this.wordSelectionText = null;
    }

    // Clean up keyboard listener
    if (this.keydownListener) {
      this.scene.input.keyboard.off("keydown", this.keydownListener);
      this.keydownListener = null;
    }

    // Destroy any additional menu elements
    if (this.menuElements) {
      this.menuElements.forEach((element) => {
        if (element && element.destroy) {
          element.destroy();
        }
      });
      this.menuElements = [];
    }

    // Set menuActive state to false
    this.menuActive = false;
  }

  displayTokenizedMessage(tokenizedMessage) {
    // Clear any previous word text objects
    this.wordTextObjects.forEach((wordText) => wordText.destroy());
    this.wordTextObjects = [];

    // Calculate starting position within the popup
    const popupCenterX = this.scene.scale.width / 2;
    const popupCenterY = this.scene.scale.height / 2;
    const wordSpacing = 100; // Space between words
    const startX =
      popupCenterX - ((tokenizedMessage.length - 1) * wordSpacing) / 2;

    this.wordTextObjects = tokenizedMessage.map((word, index) => {
      const wordText = this.scene.add
        .text(
          startX + index * wordSpacing,
          popupCenterY + 50, // Position below the prompt text
          word,
          {
            font: "20px Arial",
            fill: "#ffffff",
            backgroundColor: "#000000",
            padding: 5,
          }
        )
        .setOrigin(0.5)
        .setDepth(2)
        .setInteractive();

      // Add click event for word selection
      wordText.on("pointerdown", () => this.handleWordClick(index));

      return wordText;
    });
  }

  handleWordClick(index) {
    const selectedWord = this.tokenizedMessage[index];

    if (!this.selectedWords.includes(selectedWord)) {
      if (this.selectedWords.length < 2) {
        // Highlight the selected word
        this.wordTextObjects[index].setBackgroundColor("#00ff00");
        this.selectedWords.push(selectedWord);
        console.log("Selected word:", selectedWord);

        if (this.selectedWords.length === 2) {
          // Clear the timer when two words are selected
          if (this.wordSelectionTimer) {
            this.wordSelectionTimer.remove();
          }
          if (this.wordSelectionText) {
            this.wordSelectionText.destroy();
          }
          this.closePopup();
          this.puzzle.generatePuzzle();
          console.log("Ready to encrypt:", this.selectedWords);
          this.wordTextObjects.forEach((wordText) =>
            wordText.setVisible(false)
          );
          this.puzzle.onSolved(() => {
            console.log("Puzzle solved!");
            this.showEncryptionMethodSelection();
          });
        }
      }
    }
  }
  handleManualEncryption(event) {
    // Shift visualization active
    if (
      this.shiftVisualizationObjects &&
      this.shiftVisualizationObjects.length > 0
    ) {
      if (event.key === "ArrowUp") {
        // Shift character up (increase Caesar cipher shift)
        this.shiftCurrentCharacter("up");
        this.updateEncryptionVisualization(this.shiftVisualizationObjects[4]); // Assuming the encrypted word text is the 5th object
      } else if (event.key === "ArrowDown") {
        // Shift character down (decrease Caesar cipher shift)
        this.shiftCurrentCharacter("down");
        this.updateEncryptionVisualization(this.shiftVisualizationObjects[4]);
      } else if (event.key === "Enter") {
        // Proceed to next encryption step
        const word = this.tokenizedMessage[this.currentEncryptIndex];

        // Remove shift visualization objects
        this.shiftVisualizationObjects.forEach((obj) => obj.destroy());
        this.shiftVisualizationObjects = null;

        // Open encryption tutorial for the current word
        this.selectedWords.push(word);

        if (this.selectedWords.length === 2) {
          this.isEncrypting = true;
          this.openEncryptionTutorial(this.selectedWords[0]);
        }
        return;
      }
    }

    // Word selection logic remains similar to previous implementation
    if (this.selectedWords.length < 2) {
      if (event.key === "ArrowRight") {
        this.currentEncryptIndex =
          (this.currentEncryptIndex + 1) % this.tokenizedMessage.length;
        this.highlightSelectedWord();
      } else if (event.key === "ArrowLeft") {
        this.currentEncryptIndex =
          (this.currentEncryptIndex - 1 + this.tokenizedMessage.length) %
          this.tokenizedMessage.length;
        this.highlightSelectedWord();
      } else if (event.key === "Enter") {
        const selectedWord = this.tokenizedMessage[this.currentEncryptIndex];

        // If no visualization exists, create Caesar cipher shift visualization
        if (!this.shiftVisualizationObjects) {
          this.visualizeCaesarCipherShift(selectedWord);
        }
      }
    }
  }

  highlightSelectedWord() {
    const word = this.tokenizedMessage[this.currentEncryptIndex];
    this.menuText.setText(`Currently selecting: ${word}`);
  }

  closeEncryptionMenu() {
    this.isEncrypting = false;
    this.selectedWords = [];

    // Destroy word text objects
    this.wordTextObjects.forEach((wordText) => wordText.destroy());
    this.wordTextObjects = [];

    // Reset menu text
    // this.menuText.setText("Encryption complete!");

    // Optional: Add a delay and then close the popup
    this.scene.time.delayedCall(1000, () => {
      this.closePopup();
    });
  }

  // Adding Timer Functionality
  startEncryptionTimer() {
    // Clear any existing timer
    if (this.encryptionTimer) {
      this.encryptionTimer.remove();
    }

    // Remove previous time remaining text if exists
    if (this.timeRemainingText) {
      this.timeRemainingText.destroy();
    }

    // Create timer text
    this.timeRemainingText = this.scene.add
      .text(
        this.scene.scale.width / 2,
        this.scene.scale.height * 0.1,
        `Time Remaining: ${this.encryptionTimeLimit}`,
        {
          fontSize: "24px",
          fill: "#ffffff",
          backgroundColor: "#000000",
          padding: 10,
        }
      )
      .setOrigin(0.5);

    // Start countdown
    this.encryptionTimer = this.scene.time.addEvent({
      delay: 1000, // 1 second intervals
      repeat: this.encryptionTimeLimit - 1,
      callback: () => {
        const timeRemaining = this.encryptionTimer.getRepeatCount();

        // Update timer text
        this.timeRemainingText.setText(`Time Remaining: ${timeRemaining}`);

        // Change color as time runs out
        if (timeRemaining <= 10) {
          this.timeRemainingText.setColor("#ff0000"); // Red when time is low
        }

        // Time expired
        if (timeRemaining === 0) {
          this.handleEncryptionFailure();
        }
      },
    });
  }

  handleEncryptionFailure() {
    // Stop any ongoing encryption
    this.isEncrypting = false;

    // Display failure message
    const failureText = this.scene.add
      .text(
        this.scene.scale.width / 2,
        this.scene.scale.height / 2,
        "Encryption Failed!\nTime Ran Out",
        {
          fontSize: "36px",
          fill: "#ff0000",
          backgroundColor: "#000000",
          padding: 10,
          align: "center",
        }
      )
      .setOrigin(0.5);

    // Fade out failure message
    this.scene.tweens.add({
      targets: failureText,
      alpha: 0,
      duration: 2000,
      delay: 2000,
      onComplete: () => {
        failureText.destroy();
        this.closePopup();
        this.gameOver();
      },
    });
  }

  gameOver() {
    // initiated game over sequence
    this.isTerminating = true;

    // Adding shake effect
    this.scene.cameras.main.shake(500);

    // listen for event completion
    this.scene.cameras.main.on(
      "camerashakecomplete",
      function (camera, effect) {
        // fade out
        this.scene.cameras.main.fade(500);
        // this.scene.restart();
      },
      this
    );

    this.scene.cameras.main.on(
      "camerafadeoutcomplete",
      function () {
        this.scene.scene.restart();
      },
      this
    );
  }
}