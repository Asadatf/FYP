class ChallengesScreen extends Phaser.Scene {
    constructor() {
        super('ChallengesScreen');
        this.scalingManager = null;
    }

    preload() {
        // Load assets
        this.load.image('button', 'assets/button.png');
    }

    create() {
        // Initialize the scaling manager
        this.scalingManager = new ScalingManager(this);
        
        // Create a dark background
        this.createBackground();
        
        // Header for the challenges screen
        this.createHeader();
        
        // Create challenge buttons
        this.createChallengeButtons();
        
        // Listen for resize events
        this.scale.on('resize', this.refreshUI, this);
    }
    
    refreshUI() {
        // Update scaling manager
        if (this.scalingManager) {
            this.scalingManager.updateScaleFactor();
        }
        
        // Clear the existing display
        this.children.removeAll(true);
        
        // Recreate the UI elements
        this.createBackground();
        this.createHeader();
        this.createChallengeButtons();
    }
    
    createBackground() {
        // Create a dark background that fills the entire screen
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        const bg = this.add.rectangle(0, 0, width, height, 0x000033);
        bg.setOrigin(0, 0);
        
        // Create a grid pattern overlay
        const gridSize = Math.min(width, height) / 20; // Responsive grid size
        const graphics = this.add.graphics();
        graphics.lineStyle(1, 0x001133, 0.3);
        
        // Draw vertical lines
        for(let x = 0; x < width; x += gridSize) {
            graphics.moveTo(x, 0);
            graphics.lineTo(x, height);
        }
        
        // Draw horizontal lines
        for(let y = 0; y < height; y += gridSize) {
            graphics.moveTo(0, y);
            graphics.lineTo(width, y);
        }
        
        graphics.strokePath();
        
        // Add vignette effect
        const vignette = this.add.graphics();
        const vignetteColor = 0x000022;
        
        vignette.fillGradientStyle(
            vignetteColor, vignetteColor, 
            vignetteColor, vignetteColor, 
            0.8, 0.8, 0, 0
        );
        
        vignette.fillRect(0, 0, width, height);
    }
    
    createHeader() {
        const centerX = this.cameras.main.width / 2;
        
        // Main header text
        const headerText = this.add.text(centerX, this.scalingManager.scale(25), 'SELECT CHALLENGE', {
            fontFamily: 'Arial Black, Impact, sans-serif',
            fontSize: `${this.scalingManager.scale(40)}px`,
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'center',
            stroke: '#3366ff',
            strokeThickness: this.scalingManager.scale(2),
            shadow: {
                offsetX: this.scalingManager.scale(2),
                offsetY: this.scalingManager.scale(2),
                color: '#3366ff',
                blur: this.scalingManager.scale(5),
                stroke: true,
                fill: true
            }
        });
        
        headerText.setOrigin(0.5);
        
        // Add subtle animation
        this.tweens.add({
            targets: headerText,
            y: this.scalingManager.scale(85),
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Back button to title screen
        this.createBackButton();
    }
    
    createBackButton() {
        const backButton = this.add.container(this.scalingManager.scale(100), this.scalingManager.scale(50));
        
        // Button background
        const buttonBg = this.add.graphics();
        const buttonWidth = this.scalingManager.scale(120);
        const buttonHeight = this.scalingManager.scale(50);
        
        buttonBg.fillStyle(0x222266, 1);
        buttonBg.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, buttonHeight/5);
        buttonBg.lineStyle(this.scalingManager.scale(2), 0x3366ff, 1);
        buttonBg.strokeRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, buttonHeight/5);
        
        // Button text
        const buttonText = this.add.text(0, 0, 'BACK', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${this.scalingManager.scale(18)}px`,
            color: '#ffffff',
            align: 'center'
        });
        
        buttonText.setOrigin(0.5);
        
        // Add components to container
        backButton.add(buttonBg);
        backButton.add(buttonText);
        
        // Make interactive
        backButton.setSize(buttonWidth, buttonHeight);
        backButton.setInteractive({ useHandCursor: true });
        
        // Hover effects
        backButton.on('pointerover', () => {
            buttonBg.clear();
            buttonBg.fillStyle(0x3366ff, 1);
            buttonBg.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, buttonHeight/5);
            buttonBg.lineStyle(this.scalingManager.scale(2), 0x66aaff, 1);
            buttonBg.strokeRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, buttonHeight/5);
        });
        
        backButton.on('pointerout', () => {
            buttonBg.clear();
            buttonBg.fillStyle(0x222266, 1);
            buttonBg.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, buttonHeight/5);
            buttonBg.lineStyle(this.scalingManager.scale(2), 0x3366ff, 1);
            buttonBg.strokeRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, buttonHeight/5);
        });
        
        // Click action
        backButton.on('pointerdown', () => {
            this.cameras.main.fade(500, 0, 0, 0);
            this.time.delayedCall(500, () => {
                this.scene.start('TitleScreen');
            });
        });
    }
    
    createChallengeButtons() {
        const centerX = this.cameras.main.width / 2;
        // Calculate starting Y based on available space
        const startY = this.cameras.main.height * 0.25;
        const spacing = this.scalingManager.scale(180); // Increased spacing for better layout
        
        // Challenge data - now with both A1, A2 and A3
        const challenges = [
            {
                id: 'A1',
                title: 'Challenge A1',
                description: 'Authentication & Access Control',
                color: 0x0066ff,
                hoverColor: 0x3399ff,
                nextScene: 'A1LevelSelect'
            },
            {
                id: 'A2',
                title: 'Challenge A2',
                description: 'Cryptographic Failures',
                color: 0x00aa44,
                hoverColor: 0x33cc66,
                nextScene: 'A2LevelSelect'
            },
            {
                id: 'A3',
                title: 'Challenge A3',
                description: 'Injection Attacks',
                color: 0xaa3300,
                hoverColor: 0xcc6633,
                nextScene: 'A3LevelSelect'
            }
            // Future challenges can be added here
        ];
        
        // Create each challenge button
        challenges.forEach((challenge, index) => {
            const y = startY + index * spacing;
            this.createChallengeButton(centerX, y, challenge);
        });
    }
    
    createChallengeButton(x, y, challenge) {
        const buttonContainer = this.add.container(x, y);
        
        // Button background - using scaling for responsiveness
        const buttonWidth = this.scalingManager.scale(450);
        const buttonHeight = this.scalingManager.scale(140);
        const cornerRadius = buttonHeight / 10;
        
        const buttonBg = this.add.graphics();
        buttonBg.fillStyle(challenge.color, 0.8);
        buttonBg.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, cornerRadius);
        buttonBg.lineStyle(this.scalingManager.scale(3), 0x3366ff, 1);
        buttonBg.strokeRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, cornerRadius);
        
        // Challenge title
        const titleText = this.add.text(0, -buttonHeight/4, challenge.title, {
            fontFamily: 'Arial Black, Impact, sans-serif',
            fontSize: `${this.scalingManager.scale(32)}px`,
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'center'
        });
        
        titleText.setOrigin(0.5);
        
        // Challenge description
        const descText = this.add.text(0, buttonHeight/5, challenge.description, {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${this.scalingManager.scale(20)}px`,
            color: '#dddddd',
            align: 'center'
        });
        
        descText.setOrigin(0.5);
        
        // Add components to container
        buttonContainer.add(buttonBg);
        buttonContainer.add(titleText);
        buttonContainer.add(descText);
        
        // Make interactive
        buttonContainer.setSize(buttonWidth, buttonHeight);
        buttonContainer.setInteractive({ useHandCursor: true });
        
        // Hover effects
        buttonContainer.on('pointerover', () => {
            buttonBg.clear();
            buttonBg.fillStyle(challenge.hoverColor, 0.9);
            buttonBg.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, cornerRadius);
            buttonBg.lineStyle(this.scalingManager.scale(3), 0x66aaff, 1);
            buttonBg.strokeRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, cornerRadius);
            
            // Scale up slightly
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 1.03,
                scaleY: 1.03,
                duration: 100,
                ease: 'Power1'
            });
        });
        
        buttonContainer.on('pointerout', () => {
            buttonBg.clear();
            buttonBg.fillStyle(challenge.color, 0.8);
            buttonBg.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, cornerRadius);
            buttonBg.lineStyle(this.scalingManager.scale(3), 0x3366ff, 1);
            buttonBg.strokeRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, cornerRadius);
            
            // Scale back to normal
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 1,
                scaleY: 1,
                duration: 100,
                ease: 'Power1'
            });
        });
        
        // Click action
        buttonContainer.on('pointerdown', () => {
            this.cameras.main.flash(500, 0, 102, 255);
            
            this.time.delayedCall(300, () => {
                this.scene.start(challenge.nextScene);
            });
        });
        
        // Add pulsing animation
        this.tweens.add({
            targets: buttonContainer,
            scaleX: 1.02,
            scaleY: 1.02,
            duration: 1200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        return buttonContainer;
    }

    update() {
        // Frame updates if needed
    }
}