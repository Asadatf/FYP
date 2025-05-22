/**
 * Extension of the existing ChallengeA1Level3 class
 * Adds the back and reset buttons to the scene
 */
class ChallengeA1Level3Extension extends ChallengeA1Level3 {
    constructor() {
        super();
    }

    create() {
        // Call the original create method
        super.create();
        
        // Add back and reset buttons
        GameUIUtils.addLevelControlButtons(this, 'A1LevelSelect', 'ChallengeA1Level3');
    }
    
    // Override the showSuccessScreen method to add back button alongside next level
    showSuccessScreen() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        
        // Create success container
        const successContainer = this.add.container(centerX, centerY);
        
        // Success background
        const successBg = this.add.rectangle(0, 0, 600, 400, 0x110022, 0.95);
        successBg.setStrokeStyle(3, 0xcc33ff);
        
        // Success header
        const successHeader = this.add.text(0, -150, 'CHALLENGE COMPLETE!', {
            fontFamily: 'Arial Black, Impact, sans-serif',
            fontSize: '36px',
            fontStyle: 'bold',
            color: '#cc33ff',
            align: 'center'
        });
        successHeader.setOrigin(0.5);
        
        // Success message
        const successTitle = this.add.text(0, -90, 'You accessed a restricted admin panel simply by changing the URL!', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '18px',
            color: '#ffffff',
            align: 'center'
        });
        successTitle.setOrigin(0.5);
        
        // Vulnerability explanation
        const explanationTitle = this.add.text(0, -50, 'This is called Missing Function Level Access Control', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '20px',
            fontStyle: 'bold',
            color: '#cc33ff',
            align: 'center'
        });
        explanationTitle.setOrigin(0.5);
        
        const explanation = [
            "Developers often hide admin functions in the UI,",
            "thinking that users won't find them.",
            "",
            "However, hackers can bypass the UI by simply guessing URLs",
            "or parameter values.",
            "",
            "To prevent this vulnerability, web applications must check",
            "user roles and permissions on the server-side before",
            "granting access to admin-only features."
        ].join('\n');
        
        const explanationText = this.add.text(0, 30, explanation, {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: '#cccccc',
            align: 'center',
            lineSpacing: 5
        });
        explanationText.setOrigin(0.5);
        
        // Next level button
        const nextButton = this.add.rectangle(100, 150, 200, 40, 0xcc33ff);
        nextButton.setInteractive({ useHandCursor: true });
        
        const nextText = this.add.text(100, 150, 'NEXT LEVEL', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '18px',
            color: '#ffffff',
            align: 'center'
        });
        nextText.setOrigin(0.5);
        
        // Back to level select button
        const backButton = this.add.rectangle(-100, 150, 200, 40, 0x6633aa);
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
                this.scene.start('ChallengeA1Level4');
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
            nextButton.fillColor = 0xd966ff;
        });
        
        nextButton.on('pointerout', () => {
            nextButton.fillColor = 0xcc33ff;
        });
        
        backButton.on('pointerover', () => {
            backButton.fillColor = 0x8855cc;
        });
        
        backButton.on('pointerout', () => {
            backButton.fillColor = 0x6633aa;
        });
        
        // Victory particles with purple tint
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
            tint: 0xcc33ff,
            blendMode: 'ADD'
        });
    }
}