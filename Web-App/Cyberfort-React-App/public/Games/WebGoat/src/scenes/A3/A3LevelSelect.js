class A3LevelSelect extends Phaser.Scene {
    constructor() {
        super('A3LevelSelect');
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
        
        // Header for the level select screen
        this.createHeader();
        
        // Create level selection buttons
        this.createLevelButtons();
        
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
        this.createLevelButtons();
    }
    
    createBackground() {
        // Create a dark background with orange/red tint
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        const bg = this.add.rectangle(0, 0, width, height, 0x330000);
        bg.setOrigin(0, 0);
        
        // Create a grid pattern overlay
        const gridSize = Math.min(width, height) / 20; // Responsive grid size
        const graphics = this.add.graphics();
        graphics.lineStyle(1, 0x551100, 0.3);
        
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
        const vignetteColor = 0x220000;
        
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
        const headerText = this.add.text(centerX, this.scalingManager.scale(80), 'CHALLENGE A3 LEVELS', {
            fontFamily: 'Arial Black, Impact, sans-serif',
            fontSize: `${this.scalingManager.scale(40)}px`,
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'center',
            stroke: '#ff6600',
            strokeThickness: this.scalingManager.scale(2),
            shadow: {
                offsetX: this.scalingManager.scale(2),
                offsetY: this.scalingManager.scale(2),
                color: '#ff6600',
                blur: this.scalingManager.scale(5),
                stroke: true,
                fill: true
            }
        });
        
        headerText.setOrigin(0.5);
        
        // Subtitle
        const subtitleText = this.add.text(centerX, this.scalingManager.scale(140), 'Injection Attacks', {
            fontFamily: 'Courier New, monospace',
            fontSize: `${this.scalingManager.scale(24)}px`,
            color: '#ff9933',
            align: 'center',
            fontStyle: 'bold'
        });
        
        subtitleText.setOrigin(0.5);
        
        // Add subtle animation
        this.tweens.add({
            targets: headerText,
            y: this.scalingManager.scale(85),
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Back button to challenge screen
        this.createBackButton();
    }
    
    createBackButton() {
        const backButton = this.add.container(this.scalingManager.scale(100), this.scalingManager.scale(50));
        
        // Button background
        const buttonBg = this.add.graphics();
        const buttonWidth = this.scalingManager.scale(120);
        const buttonHeight = this.scalingManager.scale(50);
        
        buttonBg.fillStyle(0x662222, 1);
        buttonBg.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, buttonHeight/5);
        buttonBg.lineStyle(this.scalingManager.scale(2), 0xff6633, 1);
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
            buttonBg.fillStyle(0xff6633, 1);
            buttonBg.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, buttonHeight/5);
            buttonBg.lineStyle(this.scalingManager.scale(2), 0xffaa66, 1);
            buttonBg.strokeRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, buttonHeight/5);
        });
        
        backButton.on('pointerout', () => {
            buttonBg.clear();
            buttonBg.fillStyle(0x662222, 1);
            buttonBg.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, buttonHeight/5);
            buttonBg.lineStyle(this.scalingManager.scale(2), 0xff6633, 1);
            buttonBg.strokeRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, buttonHeight/5);
        });
        
        // Click action
        backButton.on('pointerdown', () => {
            this.cameras.main.fade(500, 0, 0, 0);
            this.time.delayedCall(500, () => {
                this.scene.start('ChallengesScreen');
            });
        });
    }
    
    createLevelButtons() {
        const centerX = this.cameras.main.width / 2;
        const startY = this.cameras.main.height * 0.39;
        const spacing = this.scalingManager.scale(130); // Increased spacing
        
        // Level data
        const levels = [
            {
                level: 1,
                title: 'SQL Injection',
                description: 'Exploit a database through vulnerable queries',
                color: 0xaa3300,
                hoverColor: 0xcc6633,
                scene: 'ChallengeA3Level1'
            },
            {
                level: 2,
                title: 'Cross-Site Scripting (XSS)',
                description: 'Inject malicious scripts into web pages',
                color: 0xaa3300,
                hoverColor: 0xcc6633,
                scene: 'ChallengeA3Level2'
            },
            {
                level: 3,
                title: 'Command Injection',
                description: 'Execute system commands through vulnerable inputs',
                color: 0xaa3300,
                hoverColor: 0xcc6633,
                scene: 'ChallengeA3Level3'
            }
        ];
        
        // Create each level button
        levels.forEach((level, index) => {
            const y = startY + index * spacing;
            this.createLevelButton(centerX, y, level);
        });
    }
    
    createLevelButton(x, y, levelData) {
        const buttonContainer = this.add.container(x, y);
        
        // Button background - using scaling for responsiveness
        const buttonWidth = this.scalingManager.scale(550);
        const buttonHeight = this.scalingManager.scale(100);
        const cornerRadius = this.scalingManager.scale(12);
        
        const buttonBg = this.add.graphics();
        buttonBg.fillStyle(levelData.color, 0.8);
        buttonBg.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, cornerRadius);
        buttonBg.lineStyle(this.scalingManager.scale(3), 0xff6633, 1);
        buttonBg.strokeRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, cornerRadius);
        
        // Level number badge
        const badgeSize = this.scalingManager.scale(45);
        const badgeX = -buttonWidth/2 + this.scalingManager.scale(40);
        const badgeY = 0;
        
        const badge = this.add.graphics();
        badge.fillStyle(0x330000, 1);
        badge.fillCircle(badgeX, badgeY, badgeSize/2);
        badge.lineStyle(this.scalingManager.scale(2), 0xff9933, 1);
        badge.strokeCircle(badgeX, badgeY, badgeSize/2);
        
        const levelNumber = this.add.text(badgeX, badgeY, levelData.level.toString(), {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${this.scalingManager.scale(24)}px`,
            fontStyle: 'bold',
            color: '#ffffff'
        });
        
        levelNumber.setOrigin(0.5);
        
        // Level title
        const titleText = this.add.text(badgeX + this.scalingManager.scale(50), -buttonHeight/4, levelData.title, {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${this.scalingManager.scale(26)}px`,
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'left'
        });
        
        titleText.setOrigin(0, 0.5);
        
        // Level description
        const descText = this.add.text(badgeX + this.scalingManager.scale(50), buttonHeight/4, levelData.description, {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${this.scalingManager.scale(18)}px`,
            color: '#dddddd',
            align: 'left'
        });
        
        descText.setOrigin(0, 0.5);
        
        // Add components to container
        buttonContainer.add(buttonBg);
        buttonContainer.add(badge);
        buttonContainer.add(levelNumber);
        buttonContainer.add(titleText);
        buttonContainer.add(descText);
        
        // Make interactive
        buttonContainer.setSize(buttonWidth, buttonHeight);
        buttonContainer.setInteractive({ useHandCursor: true });
        
        // Hover effects
        buttonContainer.on('pointerover', () => {
            buttonBg.clear();
            buttonBg.fillStyle(levelData.hoverColor, 0.9);
            buttonBg.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, cornerRadius);
            buttonBg.lineStyle(this.scalingManager.scale(3), 0xffaa66, 1);
            buttonBg.strokeRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, cornerRadius);
            
            // Scale up slightly
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 1.02,
                scaleY: 1.02,
                duration: 100,
                ease: 'Power1'
            });
        });
        
        buttonContainer.on('pointerout', () => {
            buttonBg.clear();
            buttonBg.fillStyle(levelData.color, 0.8);
            buttonBg.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, cornerRadius);
            buttonBg.lineStyle(this.scalingManager.scale(3), 0xff6633, 1);
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
            this.cameras.main.flash(500, 255, 102, 0); // Orange flash
            
            this.time.delayedCall(300, () => {
                this.scene.start(levelData.scene);
            });
        });
        
        // Add subtle pulsing animation to the level buttons
        this.tweens.add({
            targets: buttonContainer,
            scaleX: 1.01,
            scaleY: 1.01,
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