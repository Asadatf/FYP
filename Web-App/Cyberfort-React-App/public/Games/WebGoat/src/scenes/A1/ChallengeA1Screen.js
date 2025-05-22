class ChallengeA1Screen extends Phaser.Scene {
    constructor() {
        super('ChallengeA1Screen');
        this.scalingManager = null;
    }

    preload() {
        // Load assets
        this.load.image('button', 'assets/button.png');
    }

    create() {
        // Initialize the scaling manager
        this.scalingManager = new ScalingManager(this);
        
        // Create a dark background with grid similar to title screen
        this.createBackground();
        
        // Challenge title with animation
        this.createChallengeTitle();
        
        // Start button
        this.createStartButton();
        
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
        this.createStartButton();
    }
    
    createBackground() {
        // Create a dark background
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        const bg = this.add.rectangle(0, 0, width, height, 0x000000);
        bg.setOrigin(0, 0);
        
        // Create a grid pattern overlay - using blue for a different look than title
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
        
        // Add vignette effect (darker at the edges)
        const vignette = this.add.graphics();
        const vignetteColor = 0x000000;
        
        vignette.fillGradientStyle(
            vignetteColor, vignetteColor, 
            vignetteColor, vignetteColor, 
            0.8, 0.8, 0, 0
        );
        
        vignette.fillRect(0, 0, width, height);
    }
    
    createChallengeTitle() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 3;
        
        // Main challenge title with blue glow effect
        const title = this.add.text(centerX, centerY, 'CHALLENGE A1', {
            fontFamily: 'Arial Black, Impact, sans-serif',
            fontSize: `${this.scalingManager.scale(70)}px`,
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'center',
            stroke: '#0066ff', // Blue stroke instead of red
            strokeThickness: this.scalingManager.scale(2),
            shadow: {
                offsetX: this.scalingManager.scale(3),
                offsetY: this.scalingManager.scale(3),
                color: '#0066ff', // Blue shadow instead of red
                blur: this.scalingManager.scale(10),
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
            y: centerY - this.scalingManager.scale(20), // Slight upward movement during fade-in
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
        
        // Description with typewriter effect
        const descriptionText = 'Session Hijacker';
        const description = this.add.text(centerX, centerY + this.scalingManager.scale(80), '', {
            fontFamily: 'Courier New, monospace',
            fontSize: `${this.scalingManager.scale(24)}px`,
            color: '#3399ff',
            align: 'center',
            fontStyle: 'bold'
        });
        
        description.setOrigin(0.5);
        
        // Typewriter effect for description
        let currentChar = 0;
        this.time.delayedCall(1000, () => {
            const typewriterEvent = this.time.addEvent({
                delay: 100,
                callback: () => {
                    description.text += descriptionText[currentChar];
                    currentChar++;
                    
                    // Random glitch effect occasionally
                    if (currentChar % 5 === 0) {
                        this.createGlitchEffect(description);
                    }
                    
                    if (currentChar === descriptionText.length) {
                        typewriterEvent.remove();
                        this.setupDescriptionAnimations(description);
                    }
                },
                repeat: descriptionText.length - 1
            });
        });
        
        // Add back button in the top left
        this.createBackButton();
        
        // Add an icon or symbol for the challenge - scaled appropriately
        const iconSize = this.scalingManager.scale(40);
        const securityIcon = this.add.graphics();
        securityIcon.fillStyle(0x0066ff, 1);
        securityIcon.fillCircle(centerX, centerY - this.scalingManager.scale(120), iconSize);
        securityIcon.fillStyle(0x000000, 1);
        securityIcon.fillCircle(centerX, centerY - this.scalingManager.scale(120), iconSize * 0.75);
        securityIcon.lineStyle(this.scalingManager.scale(3), 0x0066ff, 1);
        securityIcon.strokeCircle(centerX, centerY - this.scalingManager.scale(120), iconSize * 0.875);
        
        // Lock icon in the middle
        const lockIcon = this.add.graphics();
        lockIcon.fillStyle(0x0066ff, 1);
        lockIcon.fillRect(centerX - this.scalingManager.scale(10), centerY - this.scalingManager.scale(130), this.scalingManager.scale(20), this.scalingManager.scale(20));
        lockIcon.fillRect(centerX - this.scalingManager.scale(15), centerY - this.scalingManager.scale(110), this.scalingManager.scale(30), this.scalingManager.scale(15));
        
        // Pulse animation for the security icon
        this.tweens.add({
            targets: [securityIcon, lockIcon],
            alpha: 0.7,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
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
                this.scene.start('ChallengesScreen');
            });
        });
    }
    
    createGlitchEffect(textObject) {
        // Save original position and color
        const originalX = textObject.x;
        const originalY = textObject.y;
        
        // Random offset and color change
        textObject.setX(originalX + Phaser.Math.Between(-5, 5) * this.scalingManager.scale(1));
        textObject.setY(originalY + Phaser.Math.Between(-3, 3) * this.scalingManager.scale(1));
        textObject.setTint(Math.random() > 0.5 ? 0x00ffff : 0x0066ff);
        
        // Reset after short delay
        this.time.delayedCall(50, () => {
            textObject.setPosition(originalX, originalY);
            textObject.setTint(0xffffff);
        });
    }
    
    setupDescriptionAnimations(description) {
        // Create recurring glitch effect after typing completes
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
    
    createStartButton() {
        const centerX = this.cameras.main.width / 2;
        const buttonY = this.cameras.main.height * 0.7;
        
        // Create the button container
        const buttonContainer = this.add.container(centerX, buttonY);
        
        // Button background with blue gradient
        const buttonWidth = this.scalingManager.scale(250);
        const buttonHeight = this.scalingManager.scale(60);
        
        const buttonBg = this.add.graphics();
        buttonBg.fillStyle(0x003366, 1);
        buttonBg.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, buttonHeight/5);
        
        // Add button text
        const buttonText = this.add.text(0, 0, 'BEGIN CHALLENGE', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${this.scalingManager.scale(22)}px`,
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'center'
        });
        
        buttonText.setOrigin(0.5);
        
        // Add components to container
        buttonContainer.add(buttonBg);
        buttonContainer.add(buttonText);
        
        // Make the button interactive
        buttonContainer.setSize(buttonWidth, buttonHeight);
        buttonContainer.setInteractive({ useHandCursor: true });
        
        // Start with button hidden, then fade in
        buttonContainer.setAlpha(0);
        this.tweens.add({
            targets: buttonContainer,
            alpha: 1,
            duration: 1000,
            delay: 2500, // Appear after title and description animations
            ease: 'Power2'
        });
        
        // Hover effects
        buttonContainer.on('pointerover', () => {
            buttonBg.clear();
            buttonBg.fillStyle(0x0066ff, 1);
            buttonBg.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, buttonHeight/5);
            buttonText.setShadow(0, 0, '#ffffff', this.scalingManager.scale(5));
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
            buttonBg.fillStyle(0x003366, 1);
            buttonBg.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, buttonHeight/5);
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
            // Flash effect - blue instead of red
            this.cameras.main.flash(500, 0, 102, 255);
            
            // Start the game after a short delay
            this.time.delayedCall(500, () => {
                // Navigate to the challenge gameplay scene
                this.scene.start('ChallengeA1GameplayExtension');
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
    
    createParticleEffects() {
        // Add some particle effects for visual flair
        const particles = this.add.particles('button'); // Reusing the button image as a particle
        
        // Create emitter for blue particles floating up from the bottom
        const emitter = particles.createEmitter({
            x: { min: 0, max: this.cameras.main.width },
            y: this.cameras.main.height + this.scalingManager.scale(10),
            scale: { start: 0.1, end: 0 },
            speed: { min: this.scalingManager.scale(50), max: this.scalingManager.scale(100) },
            angle: { min: 260, max: 280 },
            lifespan: 4000,
            blendMode: 'ADD',
            frequency: 500,
            tint: 0x0066ff,
            quantity: Math.max(1, Math.floor(this.cameras.main.width / 200)) // More particles for wider screens
        });
    }

    update() {
        // Add any frame-by-frame updates here
    }
}