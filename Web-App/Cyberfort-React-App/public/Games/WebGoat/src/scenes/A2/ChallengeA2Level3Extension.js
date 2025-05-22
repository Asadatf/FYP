/**
 * Extension of the existing ChallengeA2Level3 class
 * Adds the back and reset buttons to the scene
 */
class ChallengeA2Level3Extension extends ChallengeA2Level3 {
    constructor() {
        super();
    }

    create() {
        // Call the original create method
        super.create();
        this.time.delayedCall(100, ()=> {
            GameUIUtils.addLevelControlButtons(this, 'A2LevelSelect', 'ChallengeA2Level3');
        })
        // Add back and reset buttons
        
    }
    
    // Override the showSuccessScreen method to add back button alongside next level
    showSuccessScreen() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        
        // Create success container
        const successContainer = this.add.container(centerX, centerY);
        
        // Create a better sized background that fits the screen properly
        const bgWidth = Math.min(this.cameras.main.width * 0.8, 800);
        const bgHeight = Math.min(this.cameras.main.height * 0.8, 500);
        const successBg = this.add.rectangle(0, 0, bgWidth, bgHeight, 0x001100, 0.95);
        successBg.setStrokeStyle(3, 0x33cc99);
        
        // Success header - positioned higher
        const headerY = -bgHeight/2 + 60;
        const successHeader = this.add.text(0, headerY, 'CHALLENGE COMPLETE!', {
            fontFamily: 'Arial Black, Impact, sans-serif',
            fontSize: '36px', // Slightly smaller for clarity
            fontStyle: 'bold',
            color: '#33cc99',
            align: 'center'
        });
        successHeader.setOrigin(0.5);
        
        // Success message - positioned with fixed spacing
        const successTitle = this.add.text(0, headerY + 70, 'You discovered the dangers of hardcoded encryption keys!', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '22px', // Slightly smaller for clarity
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: bgWidth * 0.8 }
        });
        successTitle.setOrigin(0.5);
        
        // Explanation title - moved higher
        const explanationTitle = this.add.text(0, headerY + 130, 'What you learned:', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '22px',
            fontStyle: 'bold',
            color: '#33cc99',
            align: 'center'
        });
        explanationTitle.setOrigin(0.5);
        
        const explanation = [
            "• Improper key management can expose encrypted data!",
            "",
            "• Hardcoded keys in source code, logs, or public",
            "  repositories can be stolen.",
            "",
            "• Always store keys in a secure key management system",
            "  or environment variables!"
        ].join('\n');
        
        // Explanation text - positioned properly relative to its title
        const explanationText = this.add.text(0, headerY + 160, explanation, {
            fontFamily: 'Arial, sans-serif',
            fontSize: '18px',
            color: '#ffffff',
            align: 'left', // Changed to left alignment for better readability
            lineSpacing: 8
        });
        explanationText.setOrigin(0.5, 0); // Anchor to top-center
        
        // Button positions - fixed Y position closer to the bottom of the container
        const buttonY = bgHeight/2 - 60;
        const buttonSpacing = bgWidth/4;
        
        // FIXED: Next level button positioning and size
        const nextButton = this.add.rectangle(buttonSpacing, buttonY, 220, 50, 0x33cc99);
        nextButton.setInteractive({ useHandCursor: true });
        
        // FIXED: Next level text properly positioned with the button
        const nextText = this.add.text(buttonSpacing, buttonY, 'NEXT LEVEL', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '22px',
            color: '#ffffff',
            align: 'center'
        });
        nextText.setOrigin(0.5);
        
        // FIXED: Back button positioning and size
        const backButton = this.add.rectangle(-buttonSpacing, buttonY, 220, 50, 0x116644);
        backButton.setInteractive({ useHandCursor: true });
        
        // FIXED: Back text properly positioned with the button
        const backText = this.add.text(-buttonSpacing, buttonY, 'LEVEL SELECT', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '22px',
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
        
        // FIXED: Next level button action - simplified and more reliable
        nextButton.on('pointerdown', () => {
            // Disable interactivity to prevent multiple clicks
            nextButton.disableInteractive();
            backButton.disableInteractive();
            
            this.cameras.main.fade(800, 0, 0, 0);
            this.time.delayedCall(800, () => {
                this.scene.start('ChallengeA2Level4'); // Transition to Level 4
            });
        });
        
        // FIXED: Back button action - simplified and more reliable
        backButton.on('pointerdown', () => {
            // Disable interactivity to prevent multiple clicks
            nextButton.disableInteractive();
            backButton.disableInteractive();
            
            this.cameras.main.fade(800, 0, 0, 0);
            this.time.delayedCall(800, () => {
                this.scene.start('A2LevelSelect');
            });
        });
        
        // Hover effects - kept the same
        nextButton.on('pointerover', () => {
            nextButton.fillColor = 0x66eebb;
            nextButton.scaleX = 1.05;
            nextButton.scaleY = 1.05;
            nextText.scaleX = 1.05;
            nextText.scaleY = 1.05;
        });
        
        nextButton.on('pointerout', () => {
            nextButton.fillColor = 0x33cc99;
            nextButton.scaleX = 1;
            nextButton.scaleY = 1;
            nextText.scaleX = 1;
            nextText.scaleY = 1;
        });
        
        backButton.on('pointerover', () => {
            backButton.fillColor = 0x33aa77;
            backButton.scaleX = 1.05;
            backButton.scaleY = 1.05;
            backText.scaleX = 1.05;
            backText.scaleY = 1.05;
        });
        
        backButton.on('pointerout', () => {
            backButton.fillColor = 0x116644;
            backButton.scaleX = 1;
            backButton.scaleY = 1;
            backText.scaleX = 1;
            backText.scaleY = 1;
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