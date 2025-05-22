/**
 * Extension of the existing ChallengeA1Level4 class
 * Adds the back and reset buttons to the scene
 */
class ChallengeA1Level4Extension extends ChallengeA1Level4 {
    constructor() {
        super();
    }

    create() {
        // Call the original create method
        super.create();
        
        // Add back and reset buttons
        GameUIUtils.addLevelControlButtons(this, 'A1LevelSelect', 'ChallengeA1Level4');
    }
    
    // Override the showSuccessScreen method to add back button alongside next challenge
    showSuccessScreen() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        
        // Create success container
        const successContainer = this.add.container(centerX, centerY);
        
        // Success background
        const successBg = this.add.rectangle(0, 0, 600, 400, 0x221100, 0.95);
        successBg.setStrokeStyle(3, 0xff9900);
        
        // Success header
        const successHeader = this.add.text(0, -150, 'CHALLENGE COMPLETE!', {
            fontFamily: 'Arial Black, Impact, sans-serif',
            fontSize: '36px',
            fontStyle: 'bold',
            color: '#ff9900',
            align: 'center'
        });
        successHeader.setOrigin(0.5);
        
        // Success message
        const successTitle = this.add.text(0, -90, 'By modifying a weakly protected cookie, you gained admin access!', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '18px',
            color: '#ffffff',
            align: 'center'
        });
        successTitle.setOrigin(0.5);
        
        // Vulnerability explanation
        const explanationTitle = this.add.text(0, -50, 'This is called Cookie Spoofing', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '20px',
            fontStyle: 'bold',
            color: '#ff9900',
            align: 'center'
        });
        explanationTitle.setOrigin(0.5);
        
        const explanation = [
            "To prevent this, web apps must:",
            "",
            "• Encrypt cookies with strong algorithms",
            "• Use secure and HttpOnly flags",
            "• Store sensitive data server-side, not in cookies",
            "• Always validate user roles on the server",
            "• Use signed tokens (like JWT) with proper validation"
        ].join('\n');
        
        const explanationText = this.add.text(0, 30, explanation, {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: '#cccccc',
            align: 'center',
            lineSpacing: 5
        });
        explanationText.setOrigin(0.5);
        
        // Next challenge button
        const nextButton = this.add.rectangle(100, 150, 200, 40, 0xff9900);
        nextButton.setInteractive({ useHandCursor: true });
        
        const nextText = this.add.text(100, 150, 'NEXT CHALLENGE', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '18px',
            color: '#ffffff',
            align: 'center'
        });
        nextText.setOrigin(0.5);
        
        // Back to level select button
        const backButton = this.add.rectangle(-100, 150, 200, 40, 0xaa6633);
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
        
        // Next challenge button action
        nextButton.on('pointerdown', () => {
            this.cameras.main.fade(800, 0, 0, 0);
            this.time.delayedCall(800, () => {
                this.scene.start('ChallengesScreen'); // Go back to challenges screen for future A2 Challenge
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
            nextButton.fillColor = 0xffaa33;
        });
        
        nextButton.on('pointerout', () => {
            nextButton.fillColor = 0xff9900;
        });
        
        backButton.on('pointerover', () => {
            backButton.fillColor = 0xcc8855;
        });
        
        backButton.on('pointerout', () => {
            backButton.fillColor = 0xaa6633;
        });
        
        // Victory particles with orange tint
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
            tint: 0xff9900,
            blendMode: 'ADD'
        });
    }
}