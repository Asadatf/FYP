class TitleScene extends Phaser.Scene {
  constructor() {
    super("Title");
  }

  create() {
    // Audio setup
    this.titleTrack = this.sound.add("titleTrack", { loop: true, volume: 0.2 });
    this.titleTrack.play();
    this.clickSound = this.sound.add("clickSound", {
      loop: false,
      volume: 0.8,
    });

    // Background
    this.titleBackground = this.add.image(0, 0, "titleBackground");
    this.titleBackground.setOrigin(0, 0);
    this.titleBackground.displayWidth = this.scale.width;
    this.titleBackground.displayHeight = this.scale.height;
    
    // Add cybersecurity grid overlay
    this.createGridOverlay();
    
    // Add network nodes and connections
    this.createNetworkElements();

    // Title Text with enhanced glow effect
    this.titleText = this.add
      .text(this.scale.width / 2, this.scale.height / 2, "Network Defender", {
        fontSize: "64px",
        fill: "#ffffff",
        stroke: "#00ffff", // Cyan stroke for cybersecurity theme
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    // Enhanced title glow animation
    this.tweens.add({
      targets: this.titleText,
      alpha: { from: 0.8, to: 1 },
      strokeThickness: { from: 6, to: 8 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
    
    // Add subtitle
    this.subtitleText = this.add
      .text(
        this.scale.width / 2, 
        this.scale.height / 2 + 50, 
        "Secure the Network, Protect the Data", 
        {
          fontSize: "24px",
          fill: "#00ff00",
          stroke: "#003300",
          strokeThickness: 2
        }
      )
      .setOrigin(0.5)
      .setAlpha(0);
    
    // Fade in subtitle
    this.tweens.add({
      targets: this.subtitleText,
      alpha: 1,
      duration: 1000,
      delay: 500
    });

    // Buttons with enhanced styling
    this.createButtons();
  }
  
  createGridOverlay() {
    // Create grid lines
    const grid = this.add.graphics();
    grid.lineStyle(1, 0x00ffff, 0.3); // Cyan grid lines
    
    // Draw horizontal lines
    for (let y = 0; y < this.scale.height; y += 30) {
      grid.moveTo(0, y);
      grid.lineTo(this.scale.width, y);
    }
    
    // Draw vertical lines
    for (let x = 0; x < this.scale.width; x += 30) {
      grid.moveTo(x, 0);
      grid.lineTo(x, this.scale.height);
    }
    
    // Add subtle pulse animation to grid
    this.tweens.add({
      targets: grid,
      alpha: { from: 0.3, to: 0.1 },
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut"
    });
  }
  
  createNetworkElements() {
    // Create network node positions
    const nodePositions = [
      { x: this.scale.width * 0.2, y: this.scale.height * 0.2 },
      { x: this.scale.width * 0.2, y: this.scale.height * 0.8 },
      { x: this.scale.width * 0.8, y: this.scale.height * 0.2 },
      { x: this.scale.width * 0.8, y: this.scale.height * 0.8 },
      { x: this.scale.width * 0.3, y: this.scale.height * 0.5 },
      { x: this.scale.width * 0.7, y: this.scale.height * 0.5 }
    ];
    
    // Create nodes
    this.nodes = [];
    nodePositions.forEach(pos => {
      // Use the existing 'switch' or 'router' image if available
      const nodeType = Math.random() > 0.5 ? 'switch' : 'router';
      try {
        const node = this.add.image(pos.x, pos.y, nodeType).setScale(0.08);
        
        // Add glow effect
        const glow = this.add.graphics();
        glow.fillStyle(0x00ffff, 0.3);
        glow.fillCircle(pos.x, pos.y, 15);
        
        this.tweens.add({
          targets: glow,
          alpha: { from: 0.3, to: 0.1 },
          duration: 1500 + Math.random() * 1000,
          yoyo: true,
          repeat: -1
        });
        
        this.nodes.push({ node, glow, x: pos.x, y: pos.y });
      } catch (e) {
        console.error("Error creating network node:", e);
      }
    });
    
    // Draw network connections between nodes
    this.drawNetworkConnections();
  }
  
  drawNetworkConnections() {
    const connections = this.add.graphics();
    connections.lineStyle(2, 0x00ff00, 0.4); // Green connections
    
    // Connect nodes in a logical pattern
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        // Only connect some nodes to create a network pattern
        if ((i + j) % 3 === 0 || i === 0 || j === this.nodes.length - 1) {
          const startNode = this.nodes[i];
          const endNode = this.nodes[j];
          
          connections.beginPath();
          connections.moveTo(startNode.x, startNode.y);
          connections.lineTo(endNode.x, endNode.y);
          connections.strokePath();
        }
      }
    }
    
    // Add data packet animations
    this.time.addEvent({
      delay: 800,
      callback: this.animateDataPackets,
      callbackScope: this,
      loop: true
    });
  }
  
  animateDataPackets() {
    // Create data packets that travel between nodes
    if (this.nodes && this.nodes.length > 0) {
      const startNodeIndex = Math.floor(Math.random() * this.nodes.length);
      let endNodeIndex;
      
      do {
        endNodeIndex = Math.floor(Math.random() * this.nodes.length);
      } while (endNodeIndex === startNodeIndex);
      
      const startNode = this.nodes[startNodeIndex];
      const endNode = this.nodes[endNodeIndex];
      
      // Create packet (use existing 'packet' image if available)
      try {
        const packet = this.add.image(startNode.x, startNode.y, 'packet')
          .setScale(0.03)
          .setAlpha(0.7);
        
        // Animate packet along path
        this.tweens.add({
          targets: packet,
          x: endNode.x,
          y: endNode.y,
          duration: 1500,
          ease: 'Linear',
          onComplete: () => {
            packet.destroy();
          }
        });
      } catch (e) {
        // Fallback to a simple circle if packet image isn't available
        const packet = this.add.circle(startNode.x, startNode.y, 5, 0x00ff00, 1);
        
        this.tweens.add({
          targets: packet,
          x: endNode.x,
          y: endNode.y,
          duration: 1500,
          ease: 'Linear',
          onComplete: () => {
            packet.destroy();
          }
        });
      }
    }
  }
  
  createButtons() {
    // Start Game Button
    this.startGameButton = new UiButton(
      this,
      this.scale.width / 2,
      this.scale.height * 0.65,
      "button1",
      "button2",
      "Start",
      () => {
        this.clickSound.play();
        // Transition to loading screen before starting game
        this.showLoadingScreen();
      }
    );

    // Create tutorial button
    this.tutorialButton = new UiButton(
      this,
      this.scale.width / 2,
      this.scale.height * 0.75,
      "button1",
      "button2",
      "Tutorial",
      () => {
        this.clickSound.play();
        this.titleTrack.stop();
        this.startScene("Tutorial");
      }
    );

    // Instructions button
    this.instructionsButton = new UiButton(
      this,
      this.scale.width / 2,
      this.scale.height * 0.85,
      "button1",
      "button2",
      "Instructions",
      () => {
        this.clickSound.play();
        this.showInstructions();
      }
    );
    
    // Add entrance animation for buttons
    [this.startGameButton, this.tutorialButton, this.instructionsButton].forEach((button, index) => {
      button.y += 20;
      button.alpha = 0;
      
      this.tweens.add({
        targets: button,
        y: button.y - 20,
        alpha: 1,
        duration: 500,
        delay: 300 + (index * 150),
        ease: 'Back.easeOut'
      });
    });
  }

  showLoadingScreen() {
    // Create overlay for loading screen
    const overlay = this.add.rectangle(
      0, 0, this.scale.width, this.scale.height, 0x000000, 0
    ).setOrigin(0, 0);
    
    // Fade in overlay
    this.tweens.add({
      targets: overlay,
      alpha: 0.9,
      duration: 500,
      onComplete: () => {
        // Create loading screen elements
        const loadingText = this.add.text(
          this.scale.width / 2, 
          this.scale.height / 2 - 50, 
          'Loading...', 
          {
            font: '24px monospace',
            fill: '#00ff00'
          }
        ).setOrigin(0.5);
        
        const progressBox = this.add.rectangle(
          this.scale.width / 2,
          this.scale.height / 2,
          320,
          40,
          0x222222,
          0.8
        ).setOrigin(0.5);
        
        const progressBar = this.add.rectangle(
          this.scale.width / 2 - 155,
          this.scale.height / 2,
          0,
          30,
          0x00ff00,
          1
        ).setOrigin(0, 0.5);
        
        const percentText = this.add.text(
          this.scale.width / 2, 
          this.scale.height / 2, 
          '0%', 
          {
            font: '18px monospace',
            fill: '#ffffff'
          }
        ).setOrigin(0.5);
        
        // Simulate loading progress
        let progress = 0;
        const progressInterval = this.time.addEvent({
          delay: 30,
          callback: () => {
            progress += 1;
            progressBar.width = Math.min(310 * (progress / 100), 310);
            percentText.setText(`${progress}%`);
            
            // When loading completes
            if (progress >= 100) {
              progressInterval.remove();
              
              this.time.delayedCall(500, () => {
                this.titleTrack.stop();
                this.scene.start("Game");
              });
            }
          },
          callbackScope: this,
          repeat: 100
        });
      }
    });
  }

  showInstructions() {
    // Create overlay
    const overlay = this.add
      .rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.85)
      .setOrigin(0, 0);

    // Create main container for instructions
    const mainContainer = this.add.container(
      this.scale.width / 2,
      this.scale.height / 2
    );

    // Create panel background
    const panel = this.add.graphics();
    panel.fillStyle(0x1a1a1a, 0.9);
    panel.fillRoundedRect(-400, -300, 800, 600, 16);
    panel.lineStyle(2, 0x00ff00, 0.8);
    panel.strokeRoundedRect(-400, -300, 800, 600, 16);
    mainContainer.add(panel);

    // Title
    const title = this.add
      .text(0, -250, "Game Instructions", {
        fontSize: "32px",
        fill: "#00ff00",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
    mainContainer.add(title);

    // Instructions text
    const instructions = this.add
      .text(
        0,
        0,
        [
          "Welcome to Network Defender!",
          "═══════════════════════",
          "",
          "1. Movement Controls",
          "• Use W, A, S, D keys to move your character",
          "• Press E to interact with network devices",
          "",
          "2. Network Setup",
          "• Configure network devices with correct IPs",
          "• Connect switches to establish secure paths",
          "",
          "3. Message Encryption",
          "• Select specific words to encrypt",
          "• Choose between manual or automatic encryption",
          "• Complete mini-puzzles to enhance security",
          "",
          "4. Scoring System",
          "• Earn CyberCoins (CC) for successful encryptions",
          "• Complete tasks within time limits for bonuses",
          "",
          "═══════════════════════",
          "Stay vigilant and protect the network!",
        ].join("\n"),
        {
          fontSize: "16px",
          fill: "#ffffff",
          lineSpacing: 4,
        }
      )
      .setOrigin(0.5);
    mainContainer.add(instructions);

    // Close button at the bottom of the panel
    const closeButton = this.add
      .text(0, 250, "CLOSE", {
        fontSize: "24px",
        fill: "#00ff00",
        backgroundColor: "#004400",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerover", () => closeButton.setAlpha(0.8))
      .on("pointerout", () => closeButton.setAlpha(1))
      .on("pointerdown", () => {
        this.clickSound.play();
        mainContainer.destroy();
        overlay.destroy();
      });
    mainContainer.add(closeButton);

    // Entrance animation
    mainContainer.setScale(0.9);
    mainContainer.setAlpha(0);
    this.tweens.add({
      targets: mainContainer,
      scale: 1,
      alpha: 1,
      duration: 300,
      ease: "Back.easeOut",
    });
  }

  startScene(targetScene) {
    this.scene.start(targetScene);
  }
}