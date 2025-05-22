/**
 * Extension of the existing ChallengeA2Level1Gameplay class
 * Adds the back and reset buttons to the scene
 */
class ChallengeA2Level1Extension extends ChallengeA2Level1Gameplay {
    constructor() {
        super();
    }

    create() {
        // Call the original create method
        super.create();
        
        // Add back and reset buttons
        GameUIUtils.addLevelControlButtons(this, 'A2LevelSelect', 'ChallengeA2Level1Gameplay');
    }
    
    // Override the showSuccessScreen method to add back button alongside next level
    showSuccessScreen() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        
        // Create success container
        const successContainer = this.add.container(centerX, centerY);
        
        // Success background
        const successBg = this.add.rectangle(0, 0, 600, 400, 0x001100, 0.95);
        successBg.setStrokeStyle(3, 0x33cc99);
        
        // Success header
        const successHeader = this.add.text(0, -150, 'CHALLENGE COMPLETE!', {
            fontFamily: 'Arial Black, Impact, sans-serif',
            fontSize: '36px',
            fontStyle: 'bold',
            color: '#33cc99',
            align: 'center'
        });
        successHeader.setOrigin(0.5);
        
        // Success message
        const successTitle = this.add.text(0, -90, 'You cracked the weak encryption!', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '24px',
            color: '#ffffff',
            align: 'center'
        });
        successTitle.setOrigin(0.5);
        
        // Explanation
        const explanationTitle = this.add.text(0, -40, 'What you learned:', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '20px',
            fontStyle: 'bold',
            color: '#33cc99',
            align: 'center'
        });
        explanationTitle.setOrigin(0.5);
        
        const explanation = [
            "• The password was encrypted using a weak Caesar Cipher.",
            "",
            "• Attackers can easily break weak ciphers with brute force",
            "  or pattern recognition.",
            "",
            "• To secure data, use modern encryption methods like",
            "  AES-256 or SHA-256 hashing."
        ].join('\n');
        
        const explanationText = this.add.text(0, 50, explanation, {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: '#ffffff',
            align: 'center',
            lineSpacing: 5
        });
        explanationText.setOrigin(0.5);
        
        // Next level button
        const nextButton = this.add.rectangle(100, 150, 200, 40, 0x33cc99);
        nextButton.setInteractive({ useHandCursor: true });
        
        const nextText = this.add.text(100, 150, 'NEXT LEVEL', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '18px',
            color: '#ffffff',
            align: 'center'
        });
        nextText.setOrigin(0.5);
        
        // Back to level select button
        const backButton = this.add.rectangle(-100, 150, 200, 40, 0x116644);
        backButton.setInteractive({ useHandCursor: true });
        
        const backText = this.add.text(-100, 150, 'LEVEL SELECT', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '18px',
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
                this.scene.start('ChallengeA2Level2'); // Transition to Level 2
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