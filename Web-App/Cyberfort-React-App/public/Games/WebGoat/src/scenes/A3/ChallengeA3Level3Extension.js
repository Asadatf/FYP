/**
 * Extension of the existing ChallengeA3Level3 class
 * Adds the back and reset buttons to the scene
 */
class ChallengeA3Level3Extension extends ChallengeA3Level3 {
    constructor() {
        super();
    }

    create() {
        // Call the original create method
        super.create();
        
        // Add back and reset buttons
        GameUIUtils.addLevelControlButtons(this, 'A3LevelSelect', 'ChallengeA3Level3');
    }
    
    // Override the showSuccessScreen method to add back button alongside next level
    showSuccessScreen(container) {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        
        // Create success container
        const successContainer = this.add.container(centerX, centerY);
        
        // Success background - INCREASED SIZE
        const successBg = this.add.rectangle(0, 0, 800, 500, 0x000000, 0.95);
        successBg.setStrokeStyle(3, 0xff9900);
        
        // Success header - MOVED UP
        const successHeader = this.add.text(0, -200, 'PATH TRAVERSAL EXPLOITED!', {
            fontFamily: 'Arial Black, Impact, sans-serif',
            fontSize: '36px',
            fontStyle: 'bold',
            color: '#ff9900',
            align: 'center'
        });
        successHeader.setOrigin(0.5);
        
        // Success message - ADJUSTED POSITION
        const successTitle = this.add.text(0, -140, 'You found all the critical files using LFI!', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '26px',
            color: '#ffffff',
            align: 'center'
        });
        successTitle.setOrigin(0.5);
        
        // Explanation - ADJUSTED POSITION
        // const explanationTitle = this.add.text(0, -80, 'What you learned:', {
        //     fontFamily: 'Arial, sans-serif',
        //     fontSize: '22px',
        //     fontStyle: 'bold',
        //     color: '#ff9900',
        //     align: 'center'
        // });
        // explanationTitle.setOrigin(0.5);
        
        // INCREASED LINE SPACING in explanation
        const explanation = [
            "• Local File Inclusion (LFI) vulnerabilities allow attackers to",
            "  access files outside the intended directories.",
            "",
            "• User-supplied input should never be directly used in file paths",
            "  without proper validation and sanitization.",
            "",
            "• Use allowlists instead of denylists to validate file paths.",
            "",
            "• Always store sensitive configuration files outside the web root."
        ].join('\n');
        
        // MOVED DOWN explanation text
        const explanationText = this.add.text(0, 30, explanation, {
            fontFamily: 'Arial, sans-serif',
            fontSize: '18px',
            color: '#ffffff',
            align: 'center',
            lineSpacing: 10  // INCREASED LINE SPACING
        });
        explanationText.setOrigin(0.5);
        
        // MOVED DOWN and SPREAD OUT buttons
        // Next level button - moved to the right
        const nextButton = this.add.rectangle(200, 180, 220, 50, 0xff9900);
        nextButton.setInteractive({ useHandCursor: true });
        
        const nextText = this.add.text(200, 180, 'NEXT CHALLENGE', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '20px',
            color: '#ffffff',
            align: 'center'
        });
        nextText.setOrigin(0.5);
        
        // Back to level select button - moved to the left
        const backButton = this.add.rectangle(-200, 180, 220, 50, 0xaa6633);
        backButton.setInteractive({ useHandCursor: true });
        
        const backText = this.add.text(-200, 180, 'LEVEL SELECT', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '20px',
            color: '#ffffff',
            align: 'center'
        });
        backText.setOrigin(0.5);
        
        // Add components to container
        successContainer.add(successBg);
        successContainer.add(successHeader);
        successContainer.add(successTitle);
        // successContainer.add(explanationTitle);
        successContainer.add(explanationText);
        successContainer.add(nextButton);
        successContainer.add(nextText);
        successContainer.add(backButton);
        successContainer.add(backText);
        
        // Fade out the web app
        if (container) {
            this.tweens.add({
                targets: container,
                alpha: 0,
                duration: 500
            });
        }
        
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
                this.scene.start('A3LevelSelect'); // Return to A3 level select
            });
        });
        
        // Back button action
        backButton.on('pointerdown', () => {
            this.cameras.main.fade(800, 0, 0, 0);
            this.time.delayedCall(800, () => {
                this.scene.start('A3LevelSelect');
            });
        });
        
        // Hover effects
        nextButton.on('pointerover', () => {
            nextButton.fillColor = 0xffbb33;
            nextButton.scaleX = 1.05;
            nextButton.scaleY = 1.05;
            nextText.scaleX = 1.05;
            nextText.scaleY = 1.05;
        });
        
        nextButton.on('pointerout', () => {
            nextButton.fillColor = 0xff9900;
            nextButton.scaleX = 1;
            nextButton.scaleY = 1;
            nextText.scaleX = 1;
            nextText.scaleY = 1;
        });
        
        backButton.on('pointerover', () => {
            backButton.fillColor = 0xcc8855;
            backButton.scaleX = 1.05;
            backButton.scaleY = 1.05;
            backText.scaleX = 1.05;
            backText.scaleY = 1.05;
        });
        
        backButton.on('pointerout', () => {
            backButton.fillColor = 0xaa6633;
            backButton.scaleX = 1;
            backButton.scaleY = 1;
            backText.scaleX = 1;
            backText.scaleY = 1;
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