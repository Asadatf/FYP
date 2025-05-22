class TitleScreen extends Phaser.Scene {
    constructor() {
        super('TitleScreen');
        this.scalingManager = null;
    }

    preload() {
        // Load assets
        console.log('TitleScreen preload called');
        this.load.image('button', 'assets/button.png');
        this.load.image('logo_bg', 'assets/button.png'); // Placeholder for logo background
    }

    create() {
        console.log('TitleScreen create called');
        
        // Initialize the scaling manager
        this.scalingManager = new ScalingManager(this);
        
        // Background with subtle pattern
        this.createBackground();
        
        // Title and effects
        this.createTitle();
        
        // Start button with hover effects
        this.createStartButton();
        
        // Add additional visual flair
        this.createParticleEffects();
        
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
        this.createTitle();
        this.createStartButton();
        this.createParticleEffects();
    }
    
    createBackground() {
        // Create a dark background that fills the entire screen
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        const bg = this.add.rectangle(0, 0, width, height, 0x000000);
        bg.setOrigin(0, 0);
        
        // Create a grid pattern overlay
        const gridSize = Math.min(width, height) / 20; // Responsive grid size
        const graphics = this.add.graphics();
        graphics.lineStyle(1, 0x330000, 0.3);
        
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
    
    createTitle() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height * 0.3; // Positioned higher up
        
        // Create a subtle glow background for the title
        const glowBg = this.add.graphics();
        glowBg.fillStyle(0x330000, 0.3);
        glowBg.fillCircle(centerX, centerY, this.scalingManager.scale(150));
        
        // Main title with a red glow effect
        const title = this.add.text(centerX, centerY, 'WEBGOAT', {
            fontFamily: 'Arial Black, Impact, sans-serif',
            fontSize: `${this.scalingManager.scale(80)}px`, // Scale the font size
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'center',
            stroke: '#ff0000',
            strokeThickness: this.scalingManager.scale(2),
            shadow: {
                offsetX: this.scalingManager.scale(3),
                offsetY: this.scalingManager.scale(3),
                color: '#ff0000',
                blur: this.scalingManager.scale(10),
                stroke: true,
                fill: true
            }
        });
        
        title.setOrigin(0.5);
        
        // Create cybersecurity-themed subtitle with typewriter effect
        const subtitleText = 'A Cyber Security Adventure';
        const subtitle = this.add.text(centerX, centerY + this.scalingManager.scale(80), '', {
            fontFamily: 'Courier New, monospace',
            fontSize: `${this.scalingManager.scale(24)}px`,
            color: '#ff3333',
            align: 'center'
        });
        
        subtitle.setOrigin(0.5);
        
        // Add glitch effect container
        const glitchGroup = this.add.group();
        glitchGroup.add(subtitle);
        
        // Title animation
        this.tweens.add({
            targets: title,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Typewriter effect for subtitle
        let currentChar = 0;
        const typewriterEvent = this.time.addEvent({
            delay: 100,
            callback: () => {
                subtitle.text += subtitleText[currentChar];
                currentChar++;
                
                // Random glitch effect
                if (currentChar % 3 === 0) {
                    this.createGlitchEffect(subtitle);
                }
                
                if (currentChar === subtitleText.length) {
                    typewriterEvent.remove();
                    this.setupSubtitleAnimations(subtitle);
                }
            },
            repeat: subtitleText.length - 1
        });
    }
    
    createGlitchEffect(textObject) {
        // Save original position and color
        const originalX = textObject.x;
        const originalY = textObject.y;
        const originalColor = textObject.style.color;
        
        // Random offset and color change
        textObject.setX(originalX + Phaser.Math.Between(-5, 5) * this.scalingManager.scale(1));
        textObject.setY(originalY + Phaser.Math.Between(-3, 3) * this.scalingManager.scale(1));
        textObject.setTint(Math.random() > 0.5 ? 0x00ffff : 0xff00ff);
        
        // Reset after short delay
        this.time.delayedCall(50, () => {
            textObject.setPosition(originalX, originalY);
            textObject.setTint(0xffffff);
        });
    }
    
    setupSubtitleAnimations(subtitle) {
        // Create recurring glitch effect after typing completes
        this.time.addEvent({
            delay: Phaser.Math.Between(2000, 5000),
            callback: () => {
                // Multiple rapid glitches
                for (let i = 0; i < 5; i++) {
                    this.time.delayedCall(i * 50, () => {
                        this.createGlitchEffect(subtitle);
                    });
                }
            },
            loop: true
        });
        
        // Subtle pulse animation
        this.tweens.add({
            targets: subtitle,
            alpha: 0.7,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    createStartButton() {
        const centerX = this.cameras.main.width / 2;
        const buttonY = this.cameras.main.height * 0.7;
        
        // Create the button container
        const buttonContainer = this.add.container(centerX, buttonY);
        
        // Button background with red gradient
        const buttonWidth = this.scalingManager.scale(250);
        const buttonHeight = this.scalingManager.scale(60);
        
        const buttonBg = this.add.graphics();
        buttonBg.fillStyle(0x990000, 1);
        buttonBg.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, buttonHeight/5);
        
        // Add button text with scaled font size
        const buttonText = this.add.text(0, 0, 'START GAME', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${this.scalingManager.scale(24)}px`,
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
        
        // Hover effects
        buttonContainer.on('pointerover', () => {
            buttonBg.clear();
            buttonBg.fillStyle(0xff0000, 1);
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
            buttonBg.fillStyle(0x990000, 1);
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
            // Flash effect
            this.cameras.main.flash(500, 255, 0, 0);
            
            // Start the game after a short delay
            this.time.delayedCall(500, () => {
                // Navigate to the first game scene
                this.scene.start('ChallengesScreen');
                
                // Optional: Stop title music if you have any
                // this.sound.stopByKey('title-music');
            });
        });
        
        // Button pulse animation
        this.tweens.add({
            targets: buttonContainer,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    createParticleEffects() {
        // Add some particle effects for visual flair
        const particles = this.add.particles('button'); // Reusing the button image as a particle
        
        // Create emitter for red particles floating up from the bottom
        const emitter = particles.createEmitter({
            x: { min: 0, max: this.cameras.main.width },
            y: this.cameras.main.height + this.scalingManager.scale(10),
            scale: { start: 0.1, end: 0 },
            speed: { min: this.scalingManager.scale(50), max: this.scalingManager.scale(100) },
            angle: { min: 260, max: 280 },
            lifespan: 4000,
            blendMode: 'ADD',
            frequency: 500,
            tint: 0xff0000,
            quantity: Math.max(1, Math.floor(this.cameras.main.width / 200)) // More particles for wider screens
        });
        
        // Add a second emitter for occasional floating particles from sides
        const sideEmitter = particles.createEmitter({
            x: { min: -10, max: this.cameras.main.width + 10 },
            y: { min: this.cameras.main.height * 0.3, max: this.cameras.main.height * 0.7 },
            scale: { start: 0.05, end: 0 },
            speedX: { min: -this.scalingManager.scale(20), max: this.scalingManager.scale(20) },
            speedY: { min: -this.scalingManager.scale(40), max: -this.scalingManager.scale(20) },
            lifespan: { min: 3000, max: 6000 },
            blendMode: 'ADD',
            frequency: 2000,
            tint: [0xff3333, 0xff6666, 0xffcccc],
            quantity: 1
        });
    }

    update() {
        // Add any frame-by-frame updates here
    }
}