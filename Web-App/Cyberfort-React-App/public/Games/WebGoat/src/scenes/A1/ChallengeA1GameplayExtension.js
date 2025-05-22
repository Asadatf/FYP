/**
 * Extension of the existing ChallengeA1Gameplay class
 * Adds the back and reset buttons to the scene and enhances the UI with responsive scaling
 */
class ChallengeA1GameplayExtension extends ChallengeA1Gameplay {
    constructor() {
        super();
        this.scalingManager = null;
    }
    // Add this method to the ChallengeA1GameplayExtension class
    init() {
        this.currentStep = 0;
        this.cursorTimer = null;
        // Make sure any timers are cleared
        if (this.time) {
            this.time.removeAllEvents();
        }
        if (this.input && this.input.keyboard) {
            this.input.keyboard.removeAllKeys();
            this.input.keyboard.enabled = true;
        }
    }

    create() {
        this.scalingManager = new ScalingManager(this);
        
        // Call the original create method
        super.create();
        
        // Add control buttons
        this.addControlButtons();
        
        // Listen for resize events - but make sure we don't add duplicate listeners
        this.scale.off('resize', this.handleResize, this); // Remove any existing listener
        this.scale.on('resize', this.handleResize, this);  // Add fresh listener
    }
    
    handleResize() {
        // Update scaling manager
        if (this.scalingManager) {
            this.scalingManager.updateScaleFactor();
            
            // Redraw buttons after resize
            this.addControlButtons();
        }
    }
    
    addControlButtons() {
        // Add back and reset buttons with proper scaling
        GameUIUtils.addLevelControlButtons(this, 'A1LevelSelect', 'ChallengeA1GameplayExtension');
    }

    shutdown() {
        if (this.scalingManager) {
            this.scalingManager.destroy();
            this.scalingManager = null;
        }
        
        // Clean up any timers
        if (this.cursorTimer) {
            this.cursorTimer.remove();
            this.cursorTimer = null;
        }
        
        // Remove event listeners
        this.scale.off('resize', this.handleResize, this);
        
        // Call super shutdown if it exists
        if (super.shutdown) {
            super.shutdown();
        }
    }
    
    // Override the showSuccessScreen method to add back button alongside next level
    showSuccessScreen(username) {
        // Stop the cursor blinking timer if it exists
        if (this.cursorTimer) {
            this.cursorTimer.remove();
            this.cursorTimer = null;
        }
        
        // Clear any keyboard listeners
        this.input.keyboard.removeAllKeys();
        this.input.keyboard.enabled = false;
        
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        
        // Create success container
        const successContainer = this.add.container(centerX, centerY);
        
        // Success background with scaled dimensions
        const successWidth = this.scalingManager.scale(600);
        const successHeight = this.scalingManager.scale(400);
        
        const successBg = this.add.rectangle(0, 0, successWidth, successHeight, 0x000000, 0.9);
        successBg.setStrokeStyle(this.scalingManager.scale(2), 0x00ff00);
        
        // Success header with scaled font
        const successHeader = this.add.text(0, -this.scalingManager.scale(150), 'MISSION ACCOMPLISHED', {
            fontFamily: 'Arial Black, Impact, sans-serif',
            fontSize: `${this.scalingManager.scale(30)}px`,
            fontStyle: 'bold',
            color: '#00ff00',
            align: 'center'
        });
        successHeader.setOrigin(0.5);
        
        // User info
        const userInfo = this.add.text(0, -this.scalingManager.scale(100), `You are now logged in as: ${username}`, {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${this.scalingManager.scale(20)}px`,
            color: '#ffffff',
            align: 'center'
        });
        userInfo.setOrigin(0.5);
        
        // Lesson title
        const lessonTitle = this.add.text(0, -this.scalingManager.scale(50), 'WHAT YOU LEARNED:', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${this.scalingManager.scale(18)}px`,
            fontStyle: 'bold',
            color: '#3399ff',
            align: 'center'
        });
        lessonTitle.setOrigin(0.5);
        
        // Lesson content
        const lessonContent = [
            "• You successfully hijacked a session!",
            "",
            "• In real-world attacks, exposed session IDs can let",
            "  attackers steal user accounts.",
            "",
            "• To prevent this, web apps must use secure session handling,",
            "  expiration policies, and token validation."
        ].join('\n');
        
        const lesson = this.add.text(0, this.scalingManager.scale(50), lessonContent, {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${this.scalingManager.scale(16)}px`,
            color: '#ffffff',
            align: 'center',
            lineSpacing: this.scalingManager.scale(5)
        });
        lesson.setOrigin(0.5);
        
        // Next level button with scaled dimensions and positioning
        const buttonWidth = this.scalingManager.scale(200);
        const buttonHeight = this.scalingManager.scale(40);
        const buttonY = this.scalingManager.scale(150);
        const buttonSpacing = this.scalingManager.scale(200);
        
        const nextButton = this.add.rectangle(buttonSpacing/2, buttonY, buttonWidth, buttonHeight, 0x00aa00);
        nextButton.setInteractive({ useHandCursor: true });
        
        const nextText = this.add.text(buttonSpacing/2, buttonY, 'NEXT LEVEL', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${this.scalingManager.scale(16)}px`,
            color: '#ffffff',
            align: 'center'
        });
        nextText.setOrigin(0.5);
        
        // Back to level select button
        const backButton = this.add.rectangle(-buttonSpacing/2, buttonY, buttonWidth, buttonHeight, 0x0066aa);
        backButton.setInteractive({ useHandCursor: true });
        
        const backText = this.add.text(-buttonSpacing/2, buttonY, 'LEVEL SELECT', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${this.scalingManager.scale(16)}px`,
            color: '#ffffff',
            align: 'center'
        });
        backText.setOrigin(0.5);
        
        // Add components to the success container
        successContainer.add(successBg);
        successContainer.add(successHeader);
        successContainer.add(userInfo);
        successContainer.add(lessonTitle);
        successContainer.add(lesson);
        successContainer.add(nextButton);
        successContainer.add(nextText);
        successContainer.add(backButton);
        successContainer.add(backText);
        
        // Animation for success container appearance
        successContainer.setAlpha(0);
        
        this.tweens.add({
            targets: successContainer,
            alpha: 1,
            duration: 500,
            ease: 'Power2'
        });
        
        // Next level button action
        nextButton.on('pointerdown', () => {
            // Make sure all timers are stopped
            if (this.cursorTimer) {
                this.cursorTimer.remove();
                this.cursorTimer = null;
            }
            this.time.removeAllEvents();
            
            this.cameras.main.fade(500, 0, 0, 0);
            this.time.delayedCall(500, () => {
                // Transition to Level 2
                this.scene.start('ChallengeA1Level2');
            });
        });
        
        // Back button action
        backButton.on('pointerdown', () => {
            // Make sure all timers are stopped
            if (this.cursorTimer) {
                this.cursorTimer.remove();
                this.cursorTimer = null;
            }
            this.time.removeAllEvents();
            
            this.cameras.main.fade(500, 0, 0, 0);
            this.time.delayedCall(500, () => {
                // Transition to Level Select
                this.scene.start('A1LevelSelect');
            });
        });
        
        // Hover effects
        nextButton.on('pointerover', () => {
            nextButton.fillColor = 0x00dd00;
        });
        
        nextButton.on('pointerout', () => {
            nextButton.fillColor = 0x00aa00;
        });
        
        backButton.on('pointerover', () => {
            backButton.fillColor = 0x0088cc;
        });
        
        backButton.on('pointerout', () => {
            backButton.fillColor = 0x0066aa;
        });
        
        // Add some background particle effects for celebration
        const particles = this.add.particles('button'); // Assuming you have a particle texture
        
        particles.createEmitter({
            x: { min: 0, max: this.cameras.main.width },
            y: -this.scalingManager.scale(50),
            speed: { 
                min: this.scalingManager.scale(100), 
                max: this.scalingManager.scale(200) 
            },
            angle: { min: 80, max: 100 },
            scale: { 
                start: this.scalingManager.scale(0.1), 
                end: 0 
            },
            lifespan: 4000,
            quantity: 1,
            frequency: 200,
            blendMode: 'ADD',
            tint: 0x00ff00
        });
    }
    
    // Add any additional methods needed for the extension
}