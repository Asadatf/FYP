class A2LevelSelect extends Phaser.Scene {
    constructor() {
        super('A2LevelSelect');
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
        
        // Create binary code animation effect
        this.createBinaryEffect();
        
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
        this.createBinaryEffect();
    }
    
    createBackground() {
        // Create a dark background with green tint
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        const bg = this.add.rectangle(0, 0, width, height, 0x002211);
        bg.setOrigin(0, 0);
        
        // Create a grid pattern overlay
        const gridSize = this.scalingManager.scale(30);
        const graphics = this.add.graphics();
        graphics.lineStyle(1, 0x003322, 0.3);
        
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
        
        // Add circuit pattern
        this.createCircuitPattern();
        
        // Add vignette effect
        const vignette = this.add.graphics();
        const vignetteColor = 0x001100;
        
        vignette.fillGradientStyle(
            vignetteColor, vignetteColor, 
            vignetteColor, vignetteColor, 
            0.8, 0.8, 0, 0
        );
        
        vignette.fillRect(0, 0, width, height);
    }
    
    createCircuitPattern() {
        // Create digital circuit lines in the background
        const graphics = this.add.graphics();
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Set line style for circuit paths
        graphics.lineStyle(2, 0x00ff66, 0.1);
        
        // Create random circuit paths
        for (let i = 0; i < 10; i++) {
            const startX = Phaser.Math.Between(0, width);
            const startY = Phaser.Math.Between(0, height);
            
            // Start the path
            graphics.beginPath();
            graphics.moveTo(startX, startY);
            
            // Create segments for each path
            let currentX = startX;
            let currentY = startY;
            const segments = Phaser.Math.Between(3, 6);
            
            for (let j = 0; j < segments; j++) {
                // Decide if we're going horizontal or vertical
                if (Math.random() > 0.5) {
                    // Horizontal line
                    const newX = currentX + Phaser.Math.Between(-200, 200);
                    graphics.lineTo(newX, currentY);
                    currentX = newX;
                } else {
                    // Vertical line
                    const newY = currentY + Phaser.Math.Between(-200, 200);
                    graphics.lineTo(currentX, newY);
                    currentY = newY;
                }
                
                // Add a "node" at certain points
                if (Math.random() > 0.7) {
                    graphics.strokeCircle(currentX, currentY, 5);
                }
            }
            
            // Stroke the path
            graphics.strokePath();
        }
    }
    
    createBinaryEffect() {
        // Create falling binary code (0s and 1s) effect
        const binaryTexts = [];
        const columnCount = Math.floor(this.cameras.main.width / 40);
        
        for (let i = 0; i < columnCount; i++) {
            const x = i * 40 + 20;
            const y = Phaser.Math.Between(-100, this.cameras.main.height);
            const binaryString = this.generateRandomBinary(Phaser.Math.Between(8, 16));
            
            const binaryText = this.add.text(x, y, binaryString, {
                fontFamily: 'Courier New, monospace',
                fontSize: `${this.scalingManager.scale(16)}px`,
                color: '#00ff66',
                align: 'center'
            });
            
            binaryText.setAlpha(Phaser.Math.Between(1, 3) / 10); // Different opacity levels
            binaryTexts.push(binaryText);
            
            // Set up animation for falling
            this.tweens.add({
                targets: binaryText,
                y: this.cameras.main.height + 100,
                duration: Phaser.Math.Between(10000, 20000),
                onComplete: () => {
                    // Reset to top with new binary
                    binaryText.y = -100;
                    binaryText.setText(this.generateRandomBinary(Phaser.Math.Between(8, 16)));
                    
                    // Start another tween
                    this.tweens.add({
                        targets: binaryText,
                        y: this.cameras.main.height + 100,
                        duration: Phaser.Math.Between(10000, 20000),
                        loop: -1
                    });
                }
            });
        }
    }
    
    generateRandomBinary(length) {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += Math.random() > 0.5 ? '1' : '0';
        }
        return result;
    }
    
    createHeader() {
        const centerX = this.cameras.main.width / 2;
        
        // Main header text
        const headerText = this.add.text(centerX, this.scalingManager.scale(10), 'CHALLENGE A2 LEVELS', {
            fontFamily: 'Arial Black, Impact, sans-serif',
            fontSize: `${this.scalingManager.scale(38)}px`,
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'center',
            stroke: '#00ff66',
            strokeThickness: this.scalingManager.scale(2),
            shadow: {
                offsetX: this.scalingManager.scale(2),
                offsetY: this.scalingManager.scale(2),
                color: '#00ff66',
                blur: this.scalingManager.scale(5),
                stroke: true,
                fill: true
            }
        });
        
        headerText.setOrigin(0.5);
        
        // Subtitle
        const subtitleText = this.add.text(centerX, this.scalingManager.scale(85), 'Cryptographic Failures', {
            fontFamily: 'Courier New, monospace',
            fontSize: `${this.scalingManager.scale(22)}px`,
            color: '#33ff99',
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
        
        // Create glitch effect for subtitle
        this.time.addEvent({
            delay: Phaser.Math.Between(3000, 6000),
            callback: () => {
                this.createGlitchEffect(subtitleText);
            },
            loop: true
        });
        
        // Back button to challenge screen
        this.createBackButton();
    }
    
    createGlitchEffect(textObject) {
        // Save original position and text
        const originalX = textObject.x;
        const originalY = textObject.y;
        const originalText = textObject.text;
        
        // Random offset
        textObject.setX(originalX + Phaser.Math.Between(-5, 5));
        textObject.setY(originalY + Phaser.Math.Between(-3, 3));
        
        // Random color
        textObject.setTint(Math.random() > 0.5 ? 0x00ffaa : 0x33ff99);
        
        // Sometimes corrupt some characters
        if (Math.random() > 0.7) {
            let corruptedText = '';
            for (let i = 0; i < originalText.length; i++) {
                if (Math.random() > 0.8) {
                    corruptedText += this.getRandomChar();
                } else {
                    corruptedText += originalText[i];
                }
            }
            textObject.setText(corruptedText);
        }
        
        // Reset after short delay
        this.time.delayedCall(50, () => {
            textObject.setPosition(originalX, originalY);
            textObject.setTint(0xffffff);
            textObject.setText(originalText);
        });
    }
    
    getRandomChar() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
        return chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    createBackButton() {
        const backButton = this.add.container(this.scalingManager.scale(100), this.scalingManager.scale(50));
        
        // Button background
        const buttonBg = this.add.graphics();
        buttonBg.fillStyle(0x224422, 1);
        buttonBg.fillRoundedRect(-50, -20, 100, 40, 8);
        buttonBg.lineStyle(2, 0x33ff66, 1);
        buttonBg.strokeRoundedRect(-50, -20, 100, 40, 8);
        
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
        backButton.setSize(100, 40);
        backButton.setInteractive({ useHandCursor: true });
        
        // Hover effects
        backButton.on('pointerover', () => {
            buttonBg.clear();
            buttonBg.fillStyle(0x33ff66, 1);
            buttonBg.fillRoundedRect(-50, -20, 100, 40, 8);
            buttonBg.lineStyle(2, 0x66ffaa, 1);
            buttonBg.strokeRoundedRect(-50, -20, 100, 40, 8);
        });
        
        backButton.on('pointerout', () => {
            buttonBg.clear();
            buttonBg.fillStyle(0x224422, 1);
            buttonBg.fillRoundedRect(-50, -20, 100, 40, 8);
            buttonBg.lineStyle(2, 0x33ff66, 1);
            buttonBg.strokeRoundedRect(-50, -20, 100, 40, 8);
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
        const startY = this.cameras.main.height * 0.25;
        const spacing = this.scalingManager.scale(110);
        
        // Level data with cryptography themes
        const levels = [
            {
                level: 1,
                title: 'Crypto Basics',
                description: 'Learn about encryption/decryption techniques',
                color: 0x006633,
                hoverColor: 0x33cc66,
                scene: 'ChallengeA2Level1Gameplay',
                icon: this.createLevelIcon.bind(this, 'key')
            },
            {
                level: 2,
                title: 'Weak Encryption',
                description: 'Exploit vulnerabilities in weak encryptions',
                color: 0x006633,
                hoverColor: 0x33cc66,
                scene: 'ChallengeA2Level2',
                icon: this.createLevelIcon.bind(this, 'lock')
            },
            {
                level: 3,
                title: 'Hash Cracking',
                description: 'Crack poorly implemented password hashes',
                color: 0x006633,
                hoverColor: 0x33cc66,
                scene: 'ChallengeA2Level3',
                icon: this.createLevelIcon.bind(this, 'hash')
            },
            {
                level: 4,
                title: 'Certificate Validation',
                description: 'Bypass security certificate validation',
                color: 0x006633,
                hoverColor: 0x33cc66,
                scene: 'ChallengeA2Level4',
                icon: this.createLevelIcon.bind(this, 'cert')
            }
        ];
        
        // Create each level button
        levels.forEach((level, index) => {
            const y = startY + index * spacing;
            this.createLevelButton(centerX, y, level);
        });
    }
    
    createLevelIcon(type, x, y, size) {
        const icon = this.add.graphics();
        
        switch(type) {
            case 'key':
                // Draw a key
                icon.fillStyle(0x00ff66, 1);
                icon.fillRect(x - size/2, y - size/8, size/2, size/4); // Key bow
                icon.fillRect(x, y - size/4, size/2, size/8);          // Key bit 1
                icon.fillRect(x, y + size/8, size/2, size/8);          // Key bit 2
                break;
                
            case 'lock':
                // Draw a padlock
                icon.fillStyle(0x00ff66, 1);
                icon.fillRect(x - size/4, y - size/8, size/2, size/2); // Lock body
                icon.lineStyle(size/10, 0x00ff66, 1);
                icon.strokeCircle(x, y - size/8, size/6);              // Lock hole
                icon.strokeRect(x - size/3, y - size/2, size*2/3, size/3); // Lock shackle
                break;
                
            case 'hash':
                // Draw a hash symbol with binary
                icon.lineStyle(size/8, 0x00ff66, 1);
                icon.moveTo(x - size/2, y - size/4);
                icon.lineTo(x + size/2, y - size/4);
                icon.moveTo(x - size/2, y + size/4);
                icon.lineTo(x + size/2, y + size/4);
                icon.moveTo(x - size/4, y - size/2);
                icon.lineTo(x, y + size/2);
                icon.moveTo(x + size/4, y - size/2);
                icon.lineTo(x - size/6, y + size/2);
                break;
                
            case 'cert':
                // Draw a certificate
                icon.fillStyle(0x00ff66, 1);
                icon.fillRect(x - size/2, y - size/3, size, size*2/3); // Certificate body
                icon.fillStyle(0x003311, 1);
                icon.fillRect(x - size/3, y - size/5, size*2/3, size/10); // Line 1
                icon.fillRect(x - size/3, y, size*2/3, size/10);         // Line 2
                icon.fillRect(x - size/3, y + size/5, size/2, size/10);  // Line 3
                
                // Draw a seal
                icon.fillStyle(0x00ff66, 1);
                icon.fillCircle(x + size/4, y + size/6, size/6);
                break;
        }
        
        return icon;
    }
    
    createLevelButton(x, y, levelData) {
        const buttonContainer = this.add.container(x, y);
        
        // Button background
        const buttonWidth = this.scalingManager.scale(500);
        const buttonHeight = this.scalingManager.scale(90);
        const buttonBg = this.add.graphics();
        buttonBg.fillStyle(levelData.color, 0.8);
        buttonBg.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 12);
        buttonBg.lineStyle(3, 0x33ff66, 1);
        buttonBg.strokeRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 12);
        
        // Level number badge
        const badgeSize = 40;
        const badgeX = -buttonWidth/2 + 30;
        const badgeY = 0;
        
        const badge = this.add.graphics();
        badge.fillStyle(0x003322, 1);
        badge.fillCircle(badgeX, badgeY, badgeSize/2);
        badge.lineStyle(2, 0x33ff99, 1);
        badge.strokeCircle(badgeX, badgeY, badgeSize/2);
        
        const levelNumber = this.add.text(badgeX, badgeY, levelData.level.toString(), {
            fontFamily: 'Arial, sans-serif',
            fontSize: '24px',
            fontStyle: 'bold',
            color: '#ffffff'
        });
        
        levelNumber.setOrigin(0.5);
        
        // Level icon
        const iconSize = this.scalingManager.scale(30);
        const iconX = badgeX + this.scalingManager.scale(80);
        const icon = levelData.icon(iconX, badgeY, iconSize);
        
        // Level title
        const titleText = this.add.text(iconX + this.scalingManager.scale(50), -20, levelData.title, {
            fontFamily: 'Arial, sans-serif',
            fontSize: '24px',
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'left'
        });
        
        titleText.setOrigin(0, 0.5);
        
        // Level description
        const descText = this.add.text(iconX + this.scalingManager.scale(50), 15, levelData.description, {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: '#dddddd',
            align: 'left'
        });
        
        descText.setOrigin(0, 0.5);
        
        // Add components to container
        buttonContainer.add(buttonBg);
        buttonContainer.add(badge);
        buttonContainer.add(levelNumber);
        buttonContainer.add(icon);
        buttonContainer.add(titleText);
        buttonContainer.add(descText);
        
        // Make interactive
        buttonContainer.setSize(buttonWidth, buttonHeight);
        buttonContainer.setInteractive({ useHandCursor: true });
        
        // Hover effects
        buttonContainer.on('pointerover', () => {
            buttonBg.clear();
            buttonBg.fillStyle(levelData.hoverColor, 0.9);
            buttonBg.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 12);
            buttonBg.lineStyle(3, 0x66ffaa, 1);
            buttonBg.strokeRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 12);
            
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
            buttonBg.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 12);
            buttonBg.lineStyle(3, 0x33ff66, 1);
            buttonBg.strokeRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 12);
            
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
            this.cameras.main.flash(500, 0, 255, 102);
            
            this.time.delayedCall(300, () => {
                this.scene.start(levelData.scene);
            });
        });
        
        return buttonContainer;
    }

    shutdown() {
        // Clean up resources when scene is shutdown
        if (this.scalingManager) {
            this.scalingManager.destroy();
            this.scalingManager = null;
        }
        
        // Remove event listeners
        this.scale.off('resize', this.refreshUI, this);
        
        // Clean up timers
        this.time.removeAllEvents();
    }

    update() {
        // Frame updates if needed
    }
}