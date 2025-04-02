class HighScoreManager {
  constructor(scene) {
    this.scene = scene;
    this.highScores = [];

    // Load existing high scores
    this.loadHighScores();
  }

  // Load high scores from localStorage
  loadHighScores() {
    try {
      const saved = localStorage.getItem("networkDefender_highScores");
      if (saved) {
        this.highScores = JSON.parse(saved);
      } else {
        // Initialize with default high scores if none exist
        this.highScores = [
          { name: "DEF", score: 1000, date: "2023-01-01" },
          { name: "SEC", score: 800, date: "2023-01-02" },
          { name: "NET", score: 600, date: "2023-01-03" },
          { name: "SYS", score: 400, date: "2023-01-04" },
          { name: "ADM", score: 200, date: "2023-01-05" },
        ];
        this.saveHighScores();
      }
    } catch (e) {
      console.error("Error loading high scores:", e);
      this.highScores = [];
    }
  }

  // Save high scores to localStorage
  saveHighScores() {
    try {
      localStorage.setItem(
        "networkDefender_highScores",
        JSON.stringify(this.highScores)
      );
    } catch (e) {
      console.error("Error saving high scores:", e);
    }
  }

  // Check if score qualifies for high score list
  checkHighScore(score) {
    // Always qualify if we don't have 5 scores yet
    if (this.highScores.length < 5) return true;

    // Check if score is higher than the lowest score
    const lowestScore = this.highScores[this.highScores.length - 1].score;
    return score > lowestScore;
  }

  // Add new high score
  addHighScore(name, score) {
    // Create new score entry
    const today = new Date();
    const newScore = {
      name: name.substring(0, 3).toUpperCase(), // Limit to 3 characters
      score: score,
      date: today.toISOString().split("T")[0], // YYYY-MM-DD format
    };

    // Add to array
    this.highScores.push(newScore);

    // Sort by score (highest first)
    this.highScores.sort((a, b) => b.score - a.score);

    // Keep only top 5
    if (this.highScores.length > 5) {
      this.highScores = this.highScores.slice(0, 5);
    }

    // Save updated scores
    this.saveHighScores();

    return this.highScores.findIndex(
      (s) => s.name === newScore.name && s.score === newScore.score
    );
  }

  // Show high score input prompt
  showHighScorePrompt(score) {
    // Create container for input prompt
    const promptContainer = this.scene.add
      .container(this.scene.scale.width / 2, this.scene.scale.height / 2)
      .setDepth(1001);

    // Background
    const bg = this.scene.add
      .rectangle(0, 0, 400, 200, 0x000000, 0.9)
      .setStrokeStyle(2, 0xffcc00);

    // Title
    const title = this.scene.add
      .text(0, -70, "NEW HIGH SCORE!", {
        fontSize: "28px",
        fill: "#ffcc00",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Score display
    const scoreText = this.scene.add
      .text(0, -30, `Score: ${score}`, {
        fontSize: "20px",
        fill: "#ffffff",
      })
      .setOrigin(0.5);

    // Input prompt
    const promptText = this.scene.add
      .text(0, 10, "Enter your initials (3 letters):", {
        fontSize: "18px",
        fill: "#ffffff",
      })
      .setOrigin(0.5);

    // Input field
    const inputField = this.scene.add
      .rectangle(0, 50, 150, 40, 0x003366, 1)
      .setStrokeStyle(2, 0x00aaff);

    // Input text
    const inputText = this.scene.add
      .text(0, 50, "___", {
        fontSize: "24px",
        fill: "#00aaff",
        fontFamily: "monospace",
      })
      .setOrigin(0.5);

    // Add elements to container
    promptContainer.add([
      bg,
      title,
      scoreText,
      promptText,
      inputField,
      inputText,
    ]);

    // Handle keyboard input
    let initials = "";
    const maxChars = 3;

    const keyboardListener = (event) => {
      // Allow only letters
      if (/^[a-zA-Z]$/.test(event.key) && initials.length < maxChars) {
        initials += event.key.toUpperCase();
        inputText.setText(initials.padEnd(maxChars, "_"));
      }
      // Allow backspace
      else if (event.key === "Backspace" && initials.length > 0) {
        initials = initials.slice(0, -1);
        inputText.setText(initials.padEnd(maxChars, "_"));
      }
      // Submit on Enter if we have at least one character
      else if (event.key === "Enter" && initials.length > 0) {
        // Clean up
        this.scene.input.keyboard.off("keydown", keyboardListener);

        // Add high score
        const position = this.addHighScore(initials, score);

        // Close prompt and show high scores
        promptContainer.destroy();
        this.showHighScoreTable(position);
      }
    };

    // Register keyboard listener
    this.scene.input.keyboard.on("keydown", keyboardListener);

    // Add enter button for mobile/touch devices
    const enterButton = this.scene.add
      .rectangle(0, 100, 120, 40, 0x006600, 1)
      .setStrokeStyle(2, 0x00ff00)
      .setInteractive();

    const enterText = this.scene.add
      .text(0, 100, "ENTER", {
        fontSize: "18px",
        fill: "#ffffff",
      })
      .setOrigin(0.5);

    enterButton
      .on("pointerover", () => {
        enterButton.fillColor = 0x009900;
      })
      .on("pointerout", () => {
        enterButton.fillColor = 0x006600;
      })
      .on("pointerdown", () => {
        if (initials.length > 0) {
          // Clean up
          this.scene.input.keyboard.off("keydown", keyboardListener);

          // Add high score
          const position = this.addHighScore(initials, score);

          // Close prompt and show high scores
          promptContainer.destroy();
          this.showHighScoreTable(position);
        }
      });

    promptContainer.add([enterButton, enterText]);

    // Animation
    promptContainer.setScale(0.8);
    promptContainer.alpha = 0;

    this.scene.tweens.add({
      targets: promptContainer,
      scale: 1,
      alpha: 1,
      duration: 300,
      ease: "Back.easeOut",
    });
  }

  // Show high score table
  showHighScoreTable(highlightPosition = -1) {
    // Create container for high score table
    const tableContainer = this.scene.add
      .container(this.scene.scale.width / 2, this.scene.scale.height / 2)
      .setDepth(1001);

    // Background
    const bg = this.scene.add
      .rectangle(0, 0, 500, 400, 0x000000, 0.9)
      .setStrokeStyle(2, 0xffcc00);

    // Title
    const title = this.scene.add
      .text(0, -160, "HIGH SCORES", {
        fontSize: "32px",
        fill: "#ffcc00",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Table header
    const rankHeader = this.scene.add
      .text(-200, -100, "RANK", {
        fontSize: "20px",
        fill: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    const nameHeader = this.scene.add
      .text(-100, -100, "NAME", {
        fontSize: "20px",
        fill: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    const scoreHeader = this.scene.add
      .text(50, -100, "SCORE", {
        fontSize: "20px",
        fill: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    const dateHeader = this.scene.add
      .text(180, -100, "DATE", {
        fontSize: "20px",
        fill: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Add elements to container
    tableContainer.add([
      bg,
      title,
      rankHeader,
      nameHeader,
      scoreHeader,
      dateHeader,
    ]);

    // Add score rows
    this.highScores.forEach((score, index) => {
      const y = -40 + index * 40;
      const isHighlighted = index === highlightPosition;

      // Row background for highlighted row
      if (isHighlighted) {
        const rowBg = this.scene.add
          .rectangle(0, y, 450, 36, 0x006600, 0.5)
          .setStrokeStyle(1, 0x00ff00);
        tableContainer.add(rowBg);
      }

      // Rank
      const rank = this.scene.add
        .text(-200, y, `${index + 1}`, {
          fontSize: "20px",
          fill: isHighlighted ? "#ffff00" : "#ffffff",
          fontStyle: isHighlighted ? "bold" : "normal",
        })
        .setOrigin(0.5);

      // Name
      const name = this.scene.add
        .text(-100, y, score.name, {
          fontSize: "20px",
          fill: isHighlighted ? "#ffff00" : "#ffffff",
          fontStyle: isHighlighted ? "bold" : "normal",
        })
        .setOrigin(0.5);

      // Score
      const scoreText = this.scene.add
        .text(50, y, score.score.toString(), {
          fontSize: "20px",
          fill: isHighlighted ? "#ffff00" : "#00ff00",
          fontStyle: isHighlighted ? "bold" : "normal",
        })
        .setOrigin(0.5);

      // Date
      const date = this.scene.add
        .text(180, y, score.date, {
          fontSize: "18px",
          fill: isHighlighted ? "#ffff00" : "#888888",
        })
        .setOrigin(0.5);

      tableContainer.add([rank, name, scoreText, date]);
    });

    // Close button
    const closeButton = this.scene.add
      .rectangle(0, 140, 160, 50, 0x000000, 0.8)
      .setStrokeStyle(2, 0xffcc00)
      .setInteractive();

    const closeText = this.scene.add
      .text(0, 140, "CLOSE", {
        fontSize: "20px",
        fill: "#ffcc00",
      })
      .setOrigin(0.5);

    // Add hover effect
    closeButton
      .on("pointerover", () => {
        closeButton.fillColor = 0x331100;
        closeText.setScale(1.1);
      })
      .on("pointerout", () => {
        closeButton.fillColor = 0x000000;
        closeText.setScale(1);
      })
      .on("pointerdown", () => {
        // Animate table closing
        this.scene.tweens.add({
          targets: tableContainer,
          alpha: 0,
          scale: 0.8,
          duration: 300,
          ease: "Power2",
          onComplete: () => {
            tableContainer.destroy();

            // Return to title after viewing scores
            this.scene.scene.start("Title");
          },
        });
      });

    tableContainer.add([closeButton, closeText]);

    // Animation
    tableContainer.setScale(0.8);
    tableContainer.alpha = 0;

    this.scene.tweens.add({
      targets: tableContainer,
      scale: 1,
      alpha: 1,
      duration: 300,
      ease: "Back.easeOut",
    });

    // Add flash effect for highlighted row
    if (highlightPosition >= 0) {
      const highlightY = -40 + highlightPosition * 40;

      const flash = this.scene.add.rectangle(
        0,
        highlightY,
        450,
        36,
        0x00ff00,
        0.7
      );

      tableContainer.add(flash);

      this.scene.tweens.add({
        targets: flash,
        alpha: 0,
        duration: 500,
        yoyo: true,
        repeat: 2,
        onComplete: () => flash.destroy(),
      });
    }
  }
}

window.HighScoreManager = HighScoreManager;
