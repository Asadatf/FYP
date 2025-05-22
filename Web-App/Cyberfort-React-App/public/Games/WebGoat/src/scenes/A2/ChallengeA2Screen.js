class ChallengeA2Screen extends Phaser.Scene {
    constructor() {
        super('ChallengeA2Screen');
        this.scalingManager = null;
    }

    preload() {
        // Load assets
        this.load.image('button', 'assets/button.png');
    }

    create() {
        // Initialize scaling manager for responsive design
        this.scalingManager = new ScalingManager(this);
        
        // Create a dark background
        this.createBackground();
        
        // Challenge title with animation
        this.createChallengeTitle();
        
        // Create binary code animation effect
        this.createBinaryEffect();
        
        // Start button
        this.createStartButton();
        
        // Add back button
        this.createBackButton();
        
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
        this.createChallengeTitle();
        this.createBinaryEffect();
        this.createStartButton();
        this.createBackButton();
    }
    
    createBackground() {
        // Create a dark background with green tint for A2 challenge
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        const bg = this.add.rectangle(0, 0, width, height, 0x001100);
        bg.setOrigin(0, 0);
        
        // Create a grid pattern overlay with responsive sizing
        const gridSize = this.scalingManager ? this.scalingManager.scale(40) : 40;
        const graphics = this.add.graphics();
        graphics.lineStyle(1, 0x003311, 0.3);
        
        // Draw vertical lines to fill screen
        for(let x = 0; x < width; x += gridSize) {
            graphics.moveTo(x, 0);
            graphics.lineTo(x, height);
        }
        
        // Draw horizontal lines to fill screen
        for(let y = 0; y < height; y += gridSize) {
            graphics.moveTo(0, y);
            graphics.lineTo(width, y);
        }
        
        graphics.strokePath();
        
        // Add digital circuit pattern in the background
        this.createCircuitPattern();
        
        // Add vignette effect (darker at the edges)
        const vignette = this.add.graphics();
        const vignetteColor = 0x000a00;
        
        vignette.fillGradientStyle(
            vignetteColor, vignetteColor, 
            vignetteColor, vignetteColor, 
            0.8, 0.8, 0, 0
        );
        
        vignette.fillRect(0, 0, width, height);
    }
    
    createCircuitPattern() {
        // Create digital circuit lines in the background for a crypto feel
        const graphics = this.add.graphics();
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const scale = this.scalingManager ? this.scalingManager.scale(1) : 1;
        
        // Set line style for circuit paths
        graphics.lineStyle(2 * scale, 0x00ff66, 0.15);
        
        // Create 10-15 random circuit paths
        for (let i = 0; i < 12; i++) {
            const startX = Phaser.Math.Between(0, width);
            const startY = Phaser.Math.Between(0, height);
            
            // Start the path
            graphics.beginPath();
            graphics.moveTo(startX, startY);
            
            // Create 3-6 segments for each path
            let currentX = startX;
            let currentY = startY;
            const segments = Phaser.Math.Between(3, 6);
            
            for (let j = 0; j < segments; j++) {
                // Decide if we're going horizontal or vertical
                if (Math.random() > 0.5) {
                    // Horizontal line
                    const newX = currentX + Phaser.Math.Between(-200, 200) * scale;
                    graphics.lineTo(newX, currentY);
                    currentX = newX;
                } else {
                    // Vertical line
                    const newY = currentY + Phaser.Math.Between(-200, 200) * scale;
                    graphics.lineTo(currentX, newY);
                    currentY = newY;
                }
                
                // Add a "node" at certain points (small circle)
                if (Math.random() > 0.7) {
                    graphics.strokeCircle(currentX, currentY, 5 * scale);
                }
            }
            
            // Stroke the path
            graphics.strokePath();
        }
    }
    
    createBinaryEffect() {
        // Create falling binary code (0s and 1s) effect - very fitting for crypto theme
        const binaryTexts = [];
        const columnCount = Math.floor(this.cameras.main.width / 40);
        
        for (let i = 0; i < columnCount; i++) {
            const x = i * 40 + 20;
            const y = Phaser.Math.Between(-100, this.cameras.main.height);
            const binaryString = this.generateRandomBinary(Phaser.Math.Between(8, 16));
            
            const binaryText = this.add.text(x, y, binaryString, {
                fontFamily: 'Courier New, monospace',
                fontSize: this.scalingManager ? `${this.scalingManager.scale(16)}px` : '16px',
                color: '#00ff66',
                align: 'center'
            });
            
            binaryText.setAlpha(Phaser.Math.Between(1, 6) / 10); // Different opacity levels
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
    
    createChallengeTitle() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 3;
        const scale = this.scalingManager ? this.scalingManager.scale(1) : 1;
        
        // Main challenge title with green glow effect
        const title = this.add.text(centerX, centerY, 'CHALLENGE A2', {
            fontFamily: 'Arial Black, Impact, sans-serif',
            fontSize: `${70 * scale}px`,
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'center',
            stroke: '#00ff66',
            strokeThickness: 2 * scale,
            shadow: {
                offsetX: 3 * scale,
                offsetY: 3 * scale,
                color: '#00ff66',
                blur: 10 * scale,
                stroke: true,
                fill: true
            }
        });
        
        title.setOrigin(0.5);
        title.setAlpha(0); // Start invisible for animation
        
        // Animated entrance for the title
        this.tweens.add({
            targets: title,
            alpha: 1,
            y: centerY - 20 * scale,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => {
                // After appearing, start pulsing animation
                this.tweens.add({
                    targets: title,
                    scaleX: 1.05,
                    scaleY: 1.05,
                    duration: 2000,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            }
        });
        
        // Create a "decrypting" effect for the subtitle
        this.createDecryptingSubtitle(centerX, centerY + 80 * scale);
        
        // Add an enhanced crypto visual element
        this.createEncryptionVisual(centerX, centerY - 120 * scale);
    }
    
    createDecryptingSubtitle(x, y) {
        const finalText = "Cryptographic Failures";
        const scale = this.scalingManager ? this.scalingManager.scale(1) : 1;
        
        // Create the description text object
        const description = this.add.text(x, y, "", {
            fontFamily: 'Courier New, monospace',
            fontSize: `${24 * scale}px`,
            color: '#33ff99',
            align: 'center',
            fontStyle: 'bold'
        });
        
        description.setOrigin(0.5);
        
        // Create the "decrypting" effect by starting with random characters
        // and gradually revealing the correct ones
        const startingChars = this.generateRandomChars(finalText.length);
        description.setText(startingChars);
        
        // Set up the decryption animation
        this.time.delayedCall(1000, () => {
            let currentText = startingChars;
            let iterations = 0;
            
            const decryptEvent = this.time.addEvent({
                delay: 100,
                callback: () => {
                    iterations++;
                    
                    // Gradually replace random chars with the correct ones
                    let newText = "";
                    for (let i = 0; i < finalText.length; i++) {
                        // The more iterations, the more likely we are to show the correct char
                        if (i < iterations / 2 || Math.random() < iterations / 20) {
                            newText += finalText[i];
                        } else {
                            // Otherwise show a random char
                            newText += this.getRandomChar();
                        }
                    }
                    
                    description.setText(newText);
                    currentText = newText;
                    
                    // Glitch effect
                    if (iterations % 3 === 0) {
                        this.createGlitchEffect(description);
                    }
                    
                    // Check if we're done
                    if (currentText === finalText || iterations > 25) {
                        description.setText(finalText);
                        decryptEvent.remove();
                        this.setupDescriptionAnimations(description);
                    }
                },
                repeat: 25
            });
        });
    }
    
    generateRandomChars(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    
    getRandomChar() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
        return chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    createGlitchEffect(textObject) {
        // Enhanced glitch effect
        const originalX = textObject.x;
        const originalY = textObject.y;
        const originalText = textObject.text;
        const scale = this.scalingManager ? this.scalingManager.scale(1) : 1;
        
        // Random offset
        textObject.setX(originalX + Phaser.Math.Between(-5, 5) * scale);
        textObject.setY(originalY + Phaser.Math.Between(-3, 3) * scale);
        
        // Random color variation (green hues for crypto theme)
        textObject.setTint(Math.random() > 0.5 ? 0x00ffaa : 0x66ff99);
        
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
    
    setupDescriptionAnimations(description) {
        // Create recurring glitch effect after decryption completes
        this.time.addEvent({
            delay: Phaser.Math.Between(3000, 6000),
            callback: () => {
                // Multiple rapid glitches
                for (let i = 0; i < 3; i++) {
                    this.time.delayedCall(i * 50, () => {
                        this.createGlitchEffect(description);
                    });
                }
            },
            loop: true
        });
    }
    
    createEncryptionVisual(x, y) {
        const scale = this.scalingManager ? this.scalingManager.scale(1) : 1;
        
        // Create a container for all encryption visual elements
        const visualContainer = this.add.container(x, y);
        
        // Create the main circle
        const circle = this.add.graphics();
        circle.fillStyle(0x003311, 1);
        circle.fillCircle(0, 0, 50 * scale);
        circle.lineStyle(3 * scale, 0x00ff66, 1);
        circle.strokeCircle(0, 0, 50 * scale);
        
        // Create inner circles with rotating segments
        const innerCircle1 = this.add.graphics();
        innerCircle1.fillStyle(0x00ff66, 0.2);
        innerCircle1.fillCircle(0, 0, 40 * scale);
        innerCircle1.lineStyle(2 * scale, 0x00ff66, 0.5);
        
        // Draw segments in the circle
        for (let i = 0; i < 8; i++) {
            const angle = i * Math.PI / 4;
            innerCircle1.moveTo(0, 0);
            innerCircle1.lineTo(
                Math.cos(angle) * 40 * scale,
                Math.sin(angle) * 40 * scale
            );
        }
        
        // Create key symbol in the center
        const key = this.add.graphics();
        key.fillStyle(0x00ff66, 1);
        // Draw a more detailed key
        key.fillRect(-15 * scale, -5 * scale, 30 * scale, 10 * scale); // Key bow
        key.fillRect(-25 * scale, -2 * scale, 10 * scale, 4 * scale);  // Key bit
        key.fillRect(0, -20 * scale, 5 * scale, 15 * scale);          // Key stem
        
        // Add binary digits around the circle
        for (let i = 0; i < 8; i++) {
            const angle = i * Math.PI / 4;
            const radius = 65 * scale;
            const digit = this.add.text(
                Math.cos(angle) * radius,
                Math.sin(angle) * radius,
                Math.random() > 0.5 ? '0' : '1',
                {
                    fontFamily: 'Courier New, monospace',
                    fontSize: `${16 * scale}px`,
                    color: '#00ff66',
                    align: 'center'
                }
            );
            digit.setOrigin(0.5);
            visualContainer.add(digit);
            
            // Randomly change the digits over time
            this.time.addEvent({
                delay: Phaser.Math.Between(1000, 3000),
                callback: () => {
                    digit.setText(Math.random() > 0.5 ? '0' : '1');
                },
                loop: true
            });
        }
        
        // Add elements to container
        visualContainer.add(circle);
        visualContainer.add(innerCircle1);
        visualContainer.add(key);
        
        // Add rotation animation
        this.tweens.add({
            targets: innerCircle1,
            angle: 360,
            duration: 20000,
            repeat: -1,
            ease: 'Linear'
        });
        
        // Add pulse animation
        this.tweens.add({
            targets: [circle, key],
            alpha: 0.7,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        return visualContainer;
    }
    
    createStartButton() {
        const centerX = this.cameras.main.width / 2;
        const buttonY = this.cameras.main.height * 0.7;
        const scale = this.scalingManager ? this.scalingManager.scale(1) : 1;
        
        // Create the button container
        const buttonContainer = this.add.container(centerX, buttonY);
        
        // Button background with green gradient
        const buttonBg = this.add.graphics();
        buttonBg.fillStyle(0x006633, 1);
        buttonBg.fillRoundedRect(-100 * scale, -25 * scale, 200 * scale, 50 * scale, 10 * scale);
        buttonBg.lineStyle(2 * scale, 0x00ff66, 1);
        buttonBg.strokeRoundedRect(-100 * scale, -25 * scale, 200 * scale, 50 * scale, 10 * scale);
        
        // Add button text
        const buttonText = this.add.text(0, 0, 'BEGIN CHALLENGE', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${22 * scale}px`,
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'center'
        });
        
        buttonText.setOrigin(0.5);
        
        // Add components to container
        buttonContainer.add(buttonBg);
        buttonContainer.add(buttonText);
        
        // Make the button interactive
        buttonContainer.setSize(200 * scale, 50 * scale);
        buttonContainer.setInteractive({ useHandCursor: true });
        
        // Start with button hidden, then fade in
        buttonContainer.setAlpha(0);
        this.tweens.add({
            targets: buttonContainer,
            alpha: 1,
            duration: 1000,
            delay: 2500,
            ease: 'Power2'
        });
        
        // Hover effects
        buttonContainer.on('pointerover', () => {
            buttonBg.clear();
            buttonBg.fillStyle(0x00cc66, 1);
            buttonBg.fillRoundedRect(-100 * scale, -25 * scale, 200 * scale, 50 * scale, 10 * scale);
            buttonBg.lineStyle(2 * scale, 0x33ff99, 1);
            buttonBg.strokeRoundedRect(-100 * scale, -25 * scale, 200 * scale, 50 * scale, 10 * scale);
            
            buttonText.setShadow(0, 0, '#ffffff', 5 * scale);
            
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 100,
                ease: 'Power1'
            });
        });
        
        buttonContainer.on('pointerout', () => {
            buttonBg.clear();
            buttonBg.fillStyle(0x006633, 1);
            buttonBg.fillRoundedRect(-100 * scale, -25 * scale, 200 * scale, 50 * scale, 10 * scale);
            buttonBg.lineStyle(2 * scale, 0x00ff66, 1);
            buttonBg.strokeRoundedRect(-100 * scale, -25 * scale, 200 * scale, 50 * scale, 10 * scale);
            
            buttonText.setShadow(0, 0, '#ffffff', 0);
            
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
            // Flash effect - green flash for A2
            this.cameras.main.flash(500, 0, 255, 102);
            
            // Start the game after a short delay
            this.time.delayedCall(500, () => {
                // Navigate to the A2 level select scene
                this.scene.start('A2LevelSelect');
            });
        });
        
        // Button pulse animation
        this.time.delayedCall(3000, () => {
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
    }
    
    createBackButton() {
        const scale = this.scalingManager ? this.scalingManager.scale(1) : 1;
        const backButton = this.add.container(80 * scale, 40 * scale);
        
        // Button background
        const buttonBg = this.add.graphics();
        buttonBg.fillStyle(0x224422, 1);
        buttonBg.fillRoundedRect(-40 * scale, -20 * scale, 80 * scale, 40 * scale, 8 * scale);
        buttonBg.lineStyle(2 * scale, 0x33ff66, 1);
        buttonBg.strokeRoundedRect(-40 * scale, -20 * scale, 80 * scale, 40 * scale, 8 * scale);
        
        // Button text
        const buttonText = this.add.text(0, 0, 'BACK', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${16 * scale}px`,
            color: '#ffffff',
            align: 'center'
        });
        
        buttonText.setOrigin(0.5);
        
        // Add components to container
        backButton.add(buttonBg);
        backButton.add(buttonText);
        
        // Make the button interactive
        backButton.setSize(80 * scale, 40 * scale);
        backButton.setInteractive({ useHandCursor: true });
        
        // Hover effects
        backButton.on('pointerover', () => {
            buttonBg.clear();
            buttonBg.fillStyle(0x33ff66, 1);
            buttonBg.fillRoundedRect(-40 * scale, -20 * scale, 80 * scale, 40 * scale, 8 * scale);
            buttonBg.lineStyle(2 * scale, 0x66ffaa, 1);
            buttonBg.strokeRoundedRect(-40 * scale, -20 * scale, 80 * scale, 40 * scale, 8 * scale);
        });
        
        backButton.on('pointerout', () => {
            buttonBg.clear();
            buttonBg.fillStyle(0x224422, 1);
            buttonBg.fillRoundedRect(-40 * scale, -20 * scale, 80 * scale, 40 * scale, 8 * scale);
            buttonBg.lineStyle(2 * scale, 0x33ff66, 1);
            buttonBg.strokeRoundedRect(-40 * scale, -20 * scale, 80 * scale, 40 * scale, 8 * scale);
        });
        
        // Click action
        backButton.on('pointerdown', () => {
            this.cameras.main.fade(500, 0, 0, 0);
            this.time.delayedCall(500, () => {
                this.scene.start('ChallengesScreen');
            });
        });
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
        // Add any frame-by-frame updates here
    }
}