/**
 * Extension of the improved ChallengeA2Level2 class
 * Adds the back and reset buttons to the scene
 */
class ChallengeA2Level2Extension extends ChallengeA2Level2 {
    constructor() {
        super();
    }

    create() {
        // Call the original create method
        super.create();
        
        // Add back and reset buttons
        GameUIUtils.addLevelControlButtons(this, 'A2LevelSelect', 'ChallengeA2Level2Extension');
    }
    
    // Override the showSuccessScreen method to add back button alongside next level
    showSuccessScreen() {
        // FOLLOWING LEVEL 1 EXTENSION'S APPROACH WITH EXPANDED LAYOUT
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        
        // Create success container
        const successContainer = this.add.container(centerX, centerY);
        
        // Success background - LARGER to fit content
        const successBg = this.add.rectangle(0, 0, 700, 500, 0x001100, 0.95);
        successBg.setStrokeStyle(3, 0x33cc99);
        
        // Success header - positioned higher
        const successHeader = this.add.text(0, -200, 'CHALLENGE COMPLETE!', {
            fontFamily: 'Arial Black, Impact, sans-serif',
            fontSize: '36px',
            fontStyle: 'bold',
            color: '#33cc99',
            align: 'center'
        });
        successHeader.setOrigin(0.5);
        
        // Success message - more space
        const successTitle = this.add.text(0, -140, 'You successfully cracked the password hash!', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '24px',
            color: '#ffffff',
            align: 'center'
        });
        successTitle.setOrigin(0.5);
        
        // Explanation - more space
        const explanationTitle = this.add.text(0, -80, 'What you learned:', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '22px',
            fontStyle: 'bold',
            color: '#33cc99',
            align: 'center'
        });
        explanationTitle.setOrigin(0.5);
        
        const lessonsContent = [
            "1. Weak hashing allows attackers to discover passwords using",
            "   lookup tables and rainbow tables.",
            "",
            "2. MD5 is considered cryptographically broken and should not",
            "   be used for password storage.",
            "",
            "3. Modern password storage should use strong algorithms like",
            "   bcrypt, Argon2, or PBKDF2 with unique salts per password."
        ].join('\n');
        
        const explanationText = this.add.text(0, 40, lessonsContent, {
            fontFamily: 'Arial, sans-serif',
            fontSize: '18px', // Larger font
            color: '#ffffff',
            align: 'center',
            lineSpacing: 10 // More line spacing
        });
        explanationText.setOrigin(0.5);
        
        // Next level button - positioned lower and further to the right
        const nextButton = this.add.rectangle(150, 180, 200, 50, 0x33cc99);
        nextButton.setInteractive({ useHandCursor: true });
        
        const nextText = this.add.text(150, 180, 'NEXT LEVEL', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '20px', // Larger font
            color: '#ffffff',
            align: 'center'
        });
        nextText.setOrigin(0.5);
        
        // Back to level select button - positioned lower and further to the left
        const backButton = this.add.rectangle(-150, 180, 200, 50, 0x116644);
        backButton.setInteractive({ useHandCursor: true });
        
        const backText = this.add.text(-150, 180, 'LEVEL SELECT', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '20px', // Larger font
            color: '#ffffff',
            align: 'center'
        });
        backText.setOrigin(0.5);
        
        // Add components to container
        successContainer.add(successBg);
        successContainer.add(successHeader);
        successContainer.add(successTitle);
        successContainer.add(explanationTitle);
        successContainer.add(explanationText);
        successContainer.add(nextButton);
        successContainer.add(nextText);
        successContainer.add(backButton);
        successContainer.add(backText);
        
        // Animation for success screen appearance
        successContainer.setAlpha(0);
        
        this.tweens.add({
            targets: successContainer,
            alpha: 1,
            duration: 800,
            ease: 'Power2'
        });
        
        // Next level button action
        nextButton.on('pointerdown', () => {
            this.cameras.main.fade(800, 0, 0, 0);
            this.time.delayedCall(800, () => {
                this.scene.start('ChallengeA2Level3'); // Transition to Level 3
            });
        });
        
        // Back button action
        backButton.on('pointerdown', () => {
            this.cameras.main.fade(800, 0, 0, 0);
            this.time.delayedCall(800, () => {
                this.scene.start('A2LevelSelect');
            });
        });
        
        // Hover effects
        nextButton.on('pointerover', () => {
            nextButton.fillColor = 0x66eebb;
        });
        
        nextButton.on('pointerout', () => {
            nextButton.fillColor = 0x33cc99;
        });
        
        backButton.on('pointerover', () => {
            backButton.fillColor = 0x33aa77;
        });
        
        backButton.on('pointerout', () => {
            backButton.fillColor = 0x116644;
        });
        
        // Victory particles with green tint
        const particles = this.add.particles('button');
        
        particles.createEmitter({
            x: { min: 0, max: this.cameras.main.width },
            y: -50,
            speed: { min: 100, max: 200 },
            angle: { min: 80, max: 100 },
            scale: { start: 0.2, end: 0 },
            lifespan: 4000,
            quantity: 2,
            frequency: 40,
            tint: 0x33cc99,
            blendMode: 'ADD'
        });
    }
}