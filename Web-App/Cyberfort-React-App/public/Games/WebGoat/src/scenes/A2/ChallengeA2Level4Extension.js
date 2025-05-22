/**
 * Extension of the existing ChallengeA2Level4 class
 * Adds the back and reset buttons to the scene
 */
class ChallengeA2Level4Extension extends ChallengeA2Level4 {
    constructor() {
        super();
    }

    create() {
        // Call the original create method
        super.create();
        
        // Add back and reset buttons
        GameUIUtils.addLevelControlButtons(this, 'A2LevelSelect', 'ChallengeA2Level4');
    }
    
    // Override the showSuccessScreen method to add back button alongside complete button
// Override the showSuccessScreen method to add back button alongside complete button
showSuccessScreen(bypassedValidation) {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    // Create success container
    const successContainer = this.add.container(centerX, centerY);
    
    // Success background - scale based on screen size
    const bgWidth = Math.min(width * 0.9, 800);
    const bgHeight = Math.min(height * 0.9, 550);
    
    const successBg = this.add.rectangle(0, 0, bgWidth, bgHeight, 0x001100, 0.95);
    successBg.setStrokeStyle(3, 0x33cc99);
    
    // Success header - positioned near top
    const headerY = -bgHeight/2 + bgHeight * 0.12;
    const successHeader = this.add.text(0, headerY, 'CHALLENGE COMPLETE!', {
        fontFamily: 'Arial Black, Impact, sans-serif',
        fontSize: Math.min(36, width * 0.05) + 'px',
        fontStyle: 'bold',
        color: '#33cc99',
        align: 'center'
    });
    successHeader.setOrigin(0.5);
    
    // Success message - properly spaced below header
    const titleY = headerY + bgHeight * 0.15;
    let successTitle;
    if (bypassedValidation) {
        successTitle = this.add.text(0, titleY, 'You experienced the dangers of bypassing certificate validation!', {
            fontFamily: 'Arial, sans-serif',
            fontSize: Math.min(22, width * 0.03) + 'px',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: bgWidth * 0.85 }
        });
    } else {
        successTitle = this.add.text(0, titleY, 'You made the secure choice by respecting certificate warnings!', {
            fontFamily: 'Arial, sans-serif',
            fontSize: Math.min(22, width * 0.03) + 'px',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: bgWidth * 0.85 }
        });
    }
    successTitle.setOrigin(0.5);
    
    // Explanation title - proper spacing
    const explanationTitleY = titleY + bgHeight * 0.05;
    const explanationTitle = this.add.text(0, explanationTitleY, 'What you learned:', {
        fontFamily: 'Arial, sans-serif',
        fontSize: Math.min(22, width * 0.03) + 'px',
        fontStyle: 'bold',
        color: '#33cc99',
        align: 'center'
    });
    explanationTitle.setOrigin(0.5);
    
    const explanation = [
        "• Certificate warnings protect you from man-in-the-middle attacks",
        "  where attackers can intercept your data.",
        "",
        "• Bypassing certificate validation puts your sensitive information",
        "  at risk, including passwords and financial details.",
        "",
        "• Applications should never disable certificate validation,",
        "  and users should never ignore certificate warnings!"
    ].join('\n');
    
    // Main content - centered with proper spacing and word wrap
    const contentY = -75 + bgHeight * 0.2;
    const explanationText = this.add.text(0, contentY, explanation, {
        fontFamily: 'Arial, sans-serif',
        fontSize: Math.min(18, width * 0.025) + 'px',
        color: '#ffffff',
        align: 'center',
        lineSpacing: 8,
        wordWrap: { width: bgWidth * 0.85 }
    });
    explanationText.setOrigin(0.5);
    
    // Buttons at bottom with proper spacing
    const buttonY = bgHeight/2 - bgHeight * 0.15;
    const buttonSpacing = bgWidth * 0.25;
    
    // Complete challenge button (positioned to the right)
    const completeButton = this.add.rectangle(buttonSpacing, buttonY, bgWidth * 0.35, 50, 0x33cc99);
    completeButton.setInteractive({ useHandCursor: true });
    
    const completeText = this.add.text(buttonSpacing, buttonY, 'COMPLETE CHALLENGE', {
        fontFamily: 'Arial, sans-serif',
        fontSize: Math.min(20, width * 0.025) + 'px',
        color: '#ffffff',
        align: 'center'
    });
    completeText.setOrigin(0.5);
    
    // Back to level select button (positioned to the left)
    const backButton = this.add.rectangle(-buttonSpacing, buttonY, bgWidth * 0.35, 50, 0x116644);
    backButton.setInteractive({ useHandCursor: true });
    
    const backText = this.add.text(-buttonSpacing, buttonY, 'LEVEL SELECT', {
        fontFamily: 'Arial, sans-serif',
        fontSize: Math.min(20, width * 0.025) + 'px',
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
    successContainer.add(completeButton);
    successContainer.add(completeText);
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
        
        // Complete button action
        completeButton.on('pointerdown', () => {
            this.cameras.main.fade(800, 0, 0, 0);
            this.time.delayedCall(800, () => {
                this.scene.start('ChallengesScreen'); // Return to challenges screen
            });
        });
        
        // Back button action
        backButton.on('pointerdown', () => {
            this.cameras.main.fade(800, 0, 0, 0);
            this.time.delayedCall(800, () => {
                this.scene.start('A2LevelSelect'); // Go back to A2 level select
            });
        });
        
        // Hover effects
        completeButton.on('pointerover', () => {
            completeButton.fillColor = 0x66eebb;
            completeButton.scaleX = 1.05;
            completeButton.scaleY = 1.05;
            completeText.scaleX = 1.05;
            completeText.scaleY = 1.05;
        });
        
        completeButton.on('pointerout', () => {
            completeButton.fillColor = 0x33cc99;
            completeButton.scaleX = 1;
            completeButton.scaleY = 1;
            completeText.scaleX = 1;
            completeText.scaleY = 1;
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