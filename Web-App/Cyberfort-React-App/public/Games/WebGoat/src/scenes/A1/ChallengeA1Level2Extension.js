/**
 * Extension of the existing ChallengeA1Level2 class
 * Adds the back and reset buttons to the scene and enhances the UI with responsive scaling
 */
class ChallengeA1Level2Extension extends ChallengeA1Level2 {
    constructor() {
        super();
    }
    init() {
        // Reset any state variables when the scene is started/restarted
        this.currentStep = 0;
        this.currentUserId = 1001;
    }

    create() {
        // Initialize the scaling manager
        this.scalingManager = new ScalingManager(this);
        
        // Call the original create method
        super.create();
        
        // Add back and reset buttons with proper scaling
        GameUIUtils.addLevelControlButtons(this, 'A1LevelSelect', 'ChallengeA1Level2Extension');
        
        // Listen for resize events
        this.scale.on('resize', this.handleResize, this);
    }
    
    handleResize() {
        // Update scaling manager
        super.handleResize();
        
        // Redraw buttons after resize
        GameUIUtils.addLevelControlButtons(this, 'A1LevelSelect', 'ChallengeA1Level2Extension');
    }
    
    // Override the showCompletionScreen method to add back button alongside next level
    showCompletionScreen() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        
        // Create completion container
        const completionContainer = this.add.container(centerX, centerY);
        
        // Background with scaled dimensions
        const bgWidth = this.scalingManager.scale(600);
        const bgHeight = this.scalingManager.scale(400);
        
        const completionBg = this.add.rectangle(0, 0, bgWidth, bgHeight, 0x000022, 0.95);
        completionBg.setStrokeStyle(this.scalingManager.scale(3), 0x00ff00);
        
        // Completion message with scaled font
        const completionTitle = this.add.text(0, -this.scalingManager.scale(150), 'CHALLENGE A1 LEVEL 2 COMPLETE', {
            fontFamily: 'Arial Black, Impact, sans-serif',
            fontSize: `${this.scalingManager.scale(36)}px`,
            fontStyle: 'bold',
            color: '#00ff00',
            align: 'center'
        });
        completionTitle.setOrigin(0.5);
        
        // Lessons learned
        const lessonsTitle = this.add.text(0, -this.scalingManager.scale(80), 'LESSONS LEARNED:', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${this.scalingManager.scale(24)}px`,
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'center'
        });
        lessonsTitle.setOrigin(0.5);
        
        const lessonsContent = [
            "1. Session Hijacking: Exposed session IDs can be stolen to",
            "   impersonate legitimate users.",
            "",
            "2. Insecure Direct Object References: User-controlled parameters",
            "   should always be validated to prevent unauthorized access to",
            "   objects, like user accounts or files.",
            "",
            "3. Never trust client-side input: All input must be validated",
            "   and authorized server-side before access is granted."
        ].join('\n');
        
        const lessons = this.add.text(0, this.scalingManager.scale(20), lessonsContent, {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${this.scalingManager.scale(16)}px`,
            color: '#cccccc',
            align: 'center',
            lineSpacing: this.scalingManager.scale(5)
        });
        lessons.setOrigin(0.5);
        
        // Next Level button with scaled dimensions and positioning
        const buttonWidth = this.scalingManager.scale(200);
        const buttonHeight = this.scalingManager.scale(40);
        const buttonY = this.scalingManager.scale(150);
        const buttonSpacing = this.scalingManager.scale(200);
        
        const nextButton = this.add.rectangle(buttonSpacing/2, buttonY, buttonWidth, buttonHeight, 0x33cc33);
        nextButton.setInteractive({ useHandCursor: true });
        
        const nextText = this.add.text(buttonSpacing/2, buttonY, 'NEXT LEVEL', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${this.scalingManager.scale(18)}px`,
            color: '#ffffff',
            align: 'center'
        });
        nextText.setOrigin(0.5);
        
        // Back to level select button
        const backButton = this.add.rectangle(-buttonSpacing/2, buttonY, buttonWidth, buttonHeight, 0x3366aa);
        backButton.setInteractive({ useHandCursor: true });
        
        const backText = this.add.text(-buttonSpacing/2, buttonY, 'LEVEL SELECT', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${this.scalingManager.scale(18)}px`,
            color: '#ffffff',
            align: 'center'
        });
        backText.setOrigin(0.5);
        
        // Add components to container
        completionContainer.add(completionBg);
        completionContainer.add(completionTitle);
        completionContainer.add(lessonsTitle);
        completionContainer.add(lessons);
        completionContainer.add(nextButton);
        completionContainer.add(nextText);
        completionContainer.add(backButton);
        completionContainer.add(backText);
        
        // Animation for completion screen appearance
        completionContainer.setAlpha(0);
        
        this.tweens.add({
            targets: completionContainer,
            alpha: 1,
            duration: 800,
            ease: 'Power2'
        });
        
        // Next Level button action
        nextButton.on('pointerdown', () => {
            this.cameras.main.fade(800, 0, 0, 0);
            this.time.delayedCall(800, () => {
                this.scene.start('ChallengeA1Level3');
            });
        });
        
        // Back button action
        backButton.on('pointerdown', () => {
            this.cameras.main.fade(800, 0, 0, 0);
            this.time.delayedCall(800, () => {
                this.scene.start('A1LevelSelect');
            });
        });
        
        // Hover effects
        nextButton.on('pointerover', () => {
            nextButton.fillColor = 0x66ff66;
        });
        
        nextButton.on('pointerout', () => {
            nextButton.fillColor = 0x33cc33;
        });
        
        backButton.on('pointerover', () => {
            backButton.fillColor = 0x5588cc;
        });
        
        backButton.on('pointerout', () => {
            backButton.fillColor = 0x3366aa;
        });
        
        // Victory particles
        const particles = this.add.particles('button');
        
        particles.createEmitter({
            x: { min: 0, max: this.cameras.main.width },
            y: -this.scalingManager.scale(50),
            speed: { 
                min: this.scalingManager.scale(100), 
                max: this.scalingManager.scale(200) 
            },
            angle: { min: 80, max: 100 },
            scale: { 
                start: this.scalingManager.scale(0.2), 
                end: 0 
            },
            lifespan: 4000,
            quantity: 2,
            frequency: 40,
            tint: [0x00ff00, 0x0000ff, 0xff0000, 0xffff00],
            blendMode: 'ADD'
        });
    }
}