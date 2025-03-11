class BootScene extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    // Show loading progress
    this.createLoadingBar();
    
    // load images - using the original image references to ensure they exist
    this.loadImages();

    // load spritesheet
    this.loadspritesheet();

    // load Audio
    this.loadAudio();

    // Add error handling for missing assets
    this.load.on('loaderror', function(file) {
      console.error('Error loading asset:', file.src);
    });
  }

  createLoadingBar() {
    // Create a loading progress bar
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);
    
    const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
      font: '20px monospace',
      fill: '#00ff00'
    }).setOrigin(0.5, 0.5);
    
    const percentText = this.add.text(width / 2, height / 2, '0%', {
      font: '18px monospace',
      fill: '#00ff00'
    }).setOrigin(0.5, 0.5);
    
    // Update the loading bar as assets are loaded
    this.load.on('progress', function (value) {
      progressBar.clear();
      progressBar.fillStyle(0x00ff00, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
      percentText.setText(parseInt(value * 100) + '%');
    });
    
    this.load.on('complete', function () {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      console.log('All assets loaded successfully!');
    });
  }

  loadImages() {
    // Use the original background images that we know exist in the project
    this.load.image("titleBackground", "assets/images/titleBackground.jpeg");
    this.load.image("background", "assets/images/background.jpeg");
    
    // Game elements - using existing assets
    this.load.image("defender", "assets/images/defender.png");
    this.load.image("receiver", "assets/images/receiver.png");
    this.load.image("attacker", "assets/images/attacker.png");
    this.load.image("router", "assets/images/router.png");
    this.load.image("switch", "assets/images/switch.png");
    this.load.image("packet", "assets/images/packet.png");
    this.load.image("messageBox", "assets/images/message_box.png");
    this.load.image("Popup", "assets/images/Popup.png");
    
    // UI Buttons - using existing assets
    this.load.image("button1", "assets/images/ui/blue_button01.png");
    this.load.image("button2", "assets/images/ui/blue_button02.png");
  }

  loadspritesheet() {
    this.load.spritesheet("briefcase", "assets/images/briefcase.png", {
      frameWidth: 192,
      frameHeight: 192,
    });
  }

  loadAudio() {
    this.load.audio("clickSound", ["assets/audio/clickSound.mp3"]);
    this.load.audio("titleTrack", ["assets/audio/titleTrack.mp3"]);
  }

  create() {
    console.log("RexUI available:", !!this.rexUI);
    console.log("Starting Game");
    
    try {
      // Attempt to start the Title scene
      this.scene.start("Title");
      console.log("Title scene started");
    } catch (error) {
      console.error("Error starting Title scene:", error);
      
      // Fallback - create a simple start button if Title scene fails to load
      this.createFallbackStartButton();
    }
  }
  
  createFallbackStartButton() {
    // If Title scene fails to load, show a simple start button
    const startButton = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      'START GAME',
      { 
        font: '24px Arial',
        fill: '#00ff00',
        backgroundColor: '#000000',
        padding: { x: 20, y: 10 }
      }
    ).setOrigin(0.5).setInteractive();
    
    startButton.on('pointerdown', () => {
      try {
        this.scene.start("Game");
      } catch (e) {
        console.error("Failed to start Game scene:", e);
        this.add.text(
          this.cameras.main.width / 2,
          this.cameras.main.height / 2 + 50,
          'ERROR: Could not start game. Check console.',
          { font: '16px Arial', fill: '#ff0000' }
        ).setOrigin(0.5);
      }
    });
  }
}