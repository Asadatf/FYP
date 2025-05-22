class ChallengeA2Level4 extends Phaser.Scene {
    constructor() {
        super('ChallengeA2Level4');
        this.currentStep = 0;
        this.validationBypassed = false;
    }

    preload() {
        // Load any specific assets for this challenge
    }

    create() {
        // Set up the challenge level screen
        this.createBackground();
        this.createStartMessage();
    }
    
    createBackground() {
        // Create a dark background with green tint
        const bg = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x002211);
        bg.setOrigin(0, 0);
        
        // Create a subtle grid pattern
        const gridSize = 40;
        const graphics = this.add.graphics();
        graphics.lineStyle(1, 0x003322, 0.2);
        
        // Draw vertical lines
        for(let x = 0; x < this.cameras.main.width; x += gridSize) {
            graphics.moveTo(x, 0);
            graphics.lineTo(x, this.cameras.main.height);
        }
        
        // Draw horizontal lines
        for(let y = 0; y < this.cameras.main.height; y += gridSize) {
            graphics.moveTo(0, y);
            graphics.lineTo(this.cameras.main.width, y);
        }
        
        graphics.strokePath();
    }
    
    createStartMessage() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 4;
        
        // Create the message with animation
        const message = this.add.text(centerX, centerY, 'CHALLENGE A2: LEVEL 4', {
            fontFamily: 'Courier New, monospace',
            fontSize: '32px',
            fontStyle: 'bold',
            color: '#00ff66',
            align: 'center'
        });
        
        message.setOrigin(0.5);
        message.setAlpha(0);
        
        // Animate the message appearance
        this.tweens.add({
            targets: message,
            alpha: 1,
            duration: 800,
            ease: 'Power2',
            onComplete: () => {
                // Add blinking cursor effect
                const cursor = this.add.text(message.x + message.width / 2 + 10, message.y, '_', {
                    fontFamily: 'Courier New, monospace',
                    fontSize: '32px',
                    color: '#00ff66'
                });
                cursor.setOrigin(0.5);
                
                this.tweens.add({
                    targets: cursor,
                    alpha: 0,
                    duration: 500,
                    yoyo: true,
                    repeat: 5,
                    onComplete: () => {
                        cursor.destroy();
                        
                        // Fade out the initial message
                        this.time.delayedCall(1000, () => {
                            this.tweens.add({
                                targets: message,
                                alpha: 0,
                                y: centerY - 50,
                                duration: 800,
                                ease: 'Power2'
                            });
                        });
                    }
                });
            }
        });
        
        // Add a subtitle
        const subtitle = this.add.text(centerX, centerY + 50, 'Certificate Bypass: Insecure Connections', {
            fontFamily: 'Courier New, monospace',
            fontSize: '20px',
            color: '#33cc99',
            align: 'center'
        });
        
        subtitle.setOrigin(0.5);
        subtitle.setAlpha(0);
        
        this.tweens.add({
            targets: subtitle,
            alpha: 1,
            duration: 800,
            delay: 1200,
            ease: 'Power2',
            onComplete: () => {
                this.time.delayedCall(2000, () => {
                    this.tweens.add({
                        targets: subtitle,
                        alpha: 0,
                        y: centerY,
                        duration: 800,
                        ease: 'Power2',
                        onComplete: () => {
                            this.showInstructionPopup();
                        }
                    });
                });
            }
        });
    }
    
    showInstructionPopup() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        
        // Create popup container
        const popupContainer = this.add.container(centerX, centerY);
        
        // Tutorial popup background
        const popupBg = this.add.rectangle(0, 0, 500, 300, 0x000000, 0.9);
        popupBg.setStrokeStyle(2, 0x33cc99);
        
        // Popup header
        const popupHeader = this.add.text(0, -120, 'CERTIFICATE VALIDATION', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '24px',
            fontStyle: 'bold',
            color: '#33cc99',
            align: 'center'
        });
        popupHeader.setOrigin(0.5);
        
        // Popup content
        const content = [
            "SSL/TLS certificates secure communication between websites",
            "and browsers by verifying a site's identity.",
            "",
            "Bypassing certificate validation warnings can lead to",
            "man-in-the-middle attacks!",
            "",
            "Your goal: Identify an invalid certificate and understand",
            "the security risks of bypassing validation."
        ].join('\n');
        
        const popupContent = this.add.text(0, 0, content, {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: '#ffffff',
            align: 'center',
            lineSpacing: 5
        });
        popupContent.setOrigin(0.5);
        
        // Continue button
        const buttonBg = this.add.rectangle(0, 110, 150, 40, 0x33cc99);
        buttonBg.setInteractive({ useHandCursor: true });
        
        const buttonText = this.add.text(0, 110, 'START', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: '#ffffff',
            align: 'center'
        });
        buttonText.setOrigin(0.5);
        
        // Add components to the popup container
        popupContainer.add(popupBg);
        popupContainer.add(popupHeader);
        popupContainer.add(popupContent);
        popupContainer.add(buttonBg);
        popupContainer.add(buttonText);
        
        // Animation for popup appearance
        popupContainer.setAlpha(0);
        popupContainer.setScale(0.8);
        
        this.tweens.add({
            targets: popupContainer,
            alpha: 1,
            scale: 1,
            duration: 300,
            ease: 'Power2'
        });
        
        // Continue button action
        buttonBg.on('pointerdown', () => {
            this.tweens.add({
                targets: popupContainer,
                alpha: 0,
                scale: 0.8,
                duration: 300,
                ease: 'Power2',
                onComplete: () => {
                    popupContainer.destroy();
                    this.showCertificateGame();
                }
            });
        });
        
        // Hover effects for button
        buttonBg.on('pointerover', () => {
            buttonBg.fillColor = 0x66eebb;
        });
        
        buttonBg.on('pointerout', () => {
            buttonBg.fillColor = 0x33cc99;
        });
    }
    
    // Modify the showCertificateGame method in ChallengeA2Level4.js to better utilize screen space
showCertificateGame() {
    // Clear everything first to avoid any overlapping with previous elements
    this.children.removeAll(true);
    
    // Recreate background
    this.createBackground();
    
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    // Create the browser simulation container - adapt to screen size
    const browserContainer = this.add.container(width/2, height/2);
    
    // Browser window background - make it responsive to screen size
    const browserWidth = Math.min(width * 0.9, 800);
    const browserHeight = Math.min(height * 0.85, 550);
    
    const browserBg = this.add.rectangle(0, 0, browserWidth, browserHeight, 0xffffff);
    browserBg.setStrokeStyle(2, 0x999999);
    
    // Browser toolbar - positioned relative to browser size
    const toolbarHeight = browserHeight * 0.1;
    const toolbarY = -browserHeight/2 + toolbarHeight/2;
    
    const toolbarBg = this.add.rectangle(0, toolbarY, browserWidth, toolbarHeight, 0xeeeeee);
    toolbarBg.setStrokeStyle(1, 0xcccccc);
    
    // URL bar - properly positioned within toolbar
    const urlBarWidth = browserWidth * 0.8;
    const urlBarBg = this.add.rectangle(0, toolbarY, urlBarWidth, toolbarHeight * 0.6, 0xffffff);
    urlBarBg.setStrokeStyle(1, 0xcccccc);
    
    // URL text - position relative to URL bar
    const urlText = this.add.text(-urlBarWidth/2 + 10, toolbarY, 'https://secure-banking.example.com', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '16px',
        color: '#333333',
        align: 'left'
    });
    urlText.setOrigin(0, 0.5);
    
    // Create the certificate error screen - make it fill most of the browser area
    const contentAreaHeight = browserHeight - toolbarHeight;
    const contentAreaY = toolbarY + toolbarHeight/2 + contentAreaHeight/2;
    const errorBg = this.add.rectangle(0, contentAreaY/2, browserWidth * 0.95, contentAreaHeight * 0.95, 0xf5f5f5);
    
    // Warning icon (simple red triangle) - positioned on left side with proper spacing
    const iconSize = Math.min(browserWidth, browserHeight) * 0.1;
    const warningIcon = this.add.graphics();
    warningIcon.fillStyle(0xff0000, 1);
    warningIcon.fillTriangle(
        -browserWidth/3, contentAreaY/2 + iconSize/2, 
        -browserWidth/3 + iconSize, contentAreaY/2 - iconSize/2, 
        -browserWidth/3 + iconSize*2, contentAreaY/2 + iconSize/2
    );
    warningIcon.fillStyle(0xffffff, 1);
    warningIcon.fillCircle(-browserWidth/3 + iconSize, contentAreaY/2 + iconSize/4, iconSize/8);
    warningIcon.fillRect(-browserWidth/3 + iconSize - iconSize/16, contentAreaY/2 - iconSize/4, iconSize/8, iconSize/3);
    
    // Error title - positioned at top of content area
    const errorTitle = this.add.text(0, -browserHeight/4, 'Your connection is not private', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '24px',
        fontStyle: 'bold',
        color: '#cc0000',
        align: 'center'
    });
    errorTitle.setOrigin(0.5);
    
    // Error details - positioned below title with proper spacing
    const errorDetails = [
        "Attackers might be trying to steal your information from",
        "secure-banking.example.com (for example, passwords, messages,",
        "or credit cards).",
        "",
        "NET::ERR_CERT_AUTHORITY_INVALID",
        "",
        "The certificate is not trusted because it is self-signed.",
        "The certificate expired on 05/01/2025.",
        "The name on the certificate is invalid."
    ].join('\n');
    
    const errorText = this.add.text(0, 0, errorDetails, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '16px',
        color: '#333333',
        align: 'center',
        lineSpacing: 5,
        wordWrap: { width: browserWidth * 0.8 }
    });
    errorText.setOrigin(0.5);
    
    // Options buttons - position at bottom with proper spacing
    const buttonY = browserHeight/4;
    const buttonSpacing = browserWidth * 0.25;
    
    const backButton = this.add.rectangle(-buttonSpacing, buttonY, browserWidth * 0.3, 50, 0x4285f4);
    backButton.setInteractive({ useHandCursor: true });
    
    const backText = this.add.text(-buttonSpacing, buttonY, 'Back to safety', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '16px',
        fontStyle: 'bold',
        color: '#ffffff',
        align: 'center'
    });
    backText.setOrigin(0.5);
    
    const advancedButton = this.add.rectangle(buttonSpacing, buttonY, browserWidth * 0.3, 50, 0x999999);
    advancedButton.setInteractive({ useHandCursor: true });
    
    const advancedText = this.add.text(buttonSpacing, buttonY, 'Advanced', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '16px',
        color: '#333333',
        align: 'center'
    });
    advancedText.setOrigin(0.5);
    
    // Add components to browser container
    browserContainer.add(browserBg);
    browserContainer.add(toolbarBg);
    browserContainer.add(urlBarBg);
    browserContainer.add(urlText);
    browserContainer.add(errorBg);
    browserContainer.add(warningIcon);
    browserContainer.add(errorTitle);
    browserContainer.add(errorText);
    browserContainer.add(backButton);
    browserContainer.add(backText);
    browserContainer.add(advancedButton);
    browserContainer.add(advancedText);
    
    // Animation for browser appearance
    browserContainer.setAlpha(0);
    
    this.tweens.add({
        targets: browserContainer,
        alpha: 1,
        duration: 500,
        ease: 'Power2'
    });
    
    // Back button action - simulate going back
    backButton.on('pointerdown', () => {
        // Flash effect
        this.cameras.main.flash(300, 255, 255, 255);
        
        this.time.delayedCall(400, () => {
            // Update the error message to show a better choice was made
            errorTitle.setText('Good choice!');
            errorTitle.setColor('#00aa00');
            
            errorText.setText([
                "You chose to return to safety instead of bypassing the warning.",
                "",
                "In real-world situations, invalid certificates often indicate:",
                "• Man-in-the-middle attacks",
                "• Phishing attempts",
                "• Compromised websites",
                "",
                "Always verify website certificates before proceeding!"
            ].join('\n'));
            
            // Update buttons
            backButton.fillColor = 0x00aa00;
            backText.setText('Continue');
            
            // Remove the advanced button
            advancedButton.setVisible(false);
            advancedText.setVisible(false);
            
            // Update action on the back button to proceed to success
            backButton.off('pointerdown');
            backButton.on('pointerdown', () => {
                // Show the success screen
                this.tweens.add({
                    targets: browserContainer,
                    alpha: 0,
                    duration: 500,
                    ease: 'Power2',
                    onComplete: () => {
                        browserContainer.destroy();
                        this.showSuccessScreen(false); // Safe choice made
                    }
                });
            });
        });
    });
    
    // Advanced button action - show options to bypass with better positioning
    advancedButton.on('pointerdown', () => {
        // Create advanced options menu - positioned better
        const menuY = buttonY + 80;
        const advancedMenu = this.add.container(0, menuY);
        
        const menuBg = this.add.rectangle(0, 0, browserWidth * 0.7, 70, 0xf9f9f9);
        menuBg.setStrokeStyle(1, 0xdddddd);
        
        const bypassButton = this.add.rectangle(0, 0, browserWidth * 0.65, 50, 0xeeeeee);
        bypassButton.setInteractive({ useHandCursor: true });
        
        const bypassText = this.add.text(0, 0, 'Proceed to site (unsafe)', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: '#dd0000',
            align: 'center'
        });
        bypassText.setOrigin(0.5);
        
        advancedMenu.add(menuBg);
        advancedMenu.add(bypassButton);
        advancedMenu.add(bypassText);
        
        // Add to browser container
        browserContainer.add(advancedMenu);
        
        // Animation for menu appearance
        advancedMenu.setAlpha(0);
        
        this.tweens.add({
            targets: advancedMenu,
            alpha: 1,
            duration: 200,
            ease: 'Power2'
        });
        
        // Bypass button action with improved UI for fake banking page
        bypassButton.on('pointerdown', () => {
            // Flash red to indicate danger
            this.cameras.main.flash(300, 255, 0, 0);
            
            this.time.delayedCall(400, () => {
                // Remove previous elements
                errorBg.destroy();
                warningIcon.destroy();
                errorTitle.destroy();
                errorText.destroy();
                backButton.destroy();
                backText.destroy();
                advancedButton.destroy();
                advancedText.destroy();
                advancedMenu.destroy();
                
                // Change URL color to indicate insecure
                urlText.setText('https://secure-banking.example.com');
                urlText.setColor('#cc0000');
                
                // Add lock icon with red X
                const lockIcon = this.add.graphics();
                lockIcon.fillStyle(0xcc0000, 1);
                lockIcon.fillCircle(-urlBarWidth/2 - 15, toolbarY, 8);
                
                lockIcon.lineStyle(2, 0xffffff, 1);
                lockIcon.moveTo(-urlBarWidth/2 - 19, toolbarY - 4);
                lockIcon.lineTo(-urlBarWidth/2 - 11, toolbarY + 4);
                lockIcon.moveTo(-urlBarWidth/2 - 19, toolbarY + 4);
                lockIcon.lineTo(-urlBarWidth/2 - 11, toolbarY - 4);
                
                browserContainer.add(lockIcon);
                
                // Fake banking page content - better positioned
                const contentY = contentAreaY/2;
                const pageBg = this.add.rectangle(0, contentY, browserWidth * 0.95, contentAreaHeight * 0.95, 0xffffff);
                browserContainer.add(pageBg);
                
                const bankLogo = this.add.text(0, -browserHeight/4, 'EXAMPLE BANK', {
                    fontFamily: 'Arial Black, Impact, sans-serif',
                    fontSize: '32px',
                    fontStyle: 'bold',
                    color: '#003366',
                    align: 'center'
                });
                bankLogo.setOrigin(0.5);
                browserContainer.add(bankLogo);
                
                // Login form (fake) - better spacing
                const formSpacing = browserHeight * 0.08;
                const formTitle = this.add.text(0, -browserHeight/4 + formSpacing, 'Login to Your Account', {
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '22px',
                    color: '#333333',
                    align: 'center'
                });
                formTitle.setOrigin(0.5);
                browserContainer.add(formTitle);
                
                // Username field - better positioned
                const fieldWidth = browserWidth * 0.5;
                const userField = this.add.rectangle(0, -browserHeight/8, fieldWidth, 50, 0xf5f5f5);
                userField.setStrokeStyle(1, 0xcccccc);
                browserContainer.add(userField);
                
                const userLabel = this.add.text(-fieldWidth/2 + 20, -browserHeight/8, 'Username:', {
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '16px',
                    color: '#333333',
                    align: 'left'
                });
                userLabel.setOrigin(0, 0.5);
                browserContainer.add(userLabel);
                
                // Password field - better positioned
                const passField = this.add.rectangle(0, 0, fieldWidth, 50, 0xf5f5f5);
                passField.setStrokeStyle(1, 0xcccccc);
                browserContainer.add(passField);
                
                const passLabel = this.add.text(-fieldWidth/2 + 20, 0, 'Password:', {
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '16px',
                    color: '#333333',
                    align: 'left'
                });
                passLabel.setOrigin(0, 0.5);
                browserContainer.add(passLabel);
                
                // Login button - better positioned
                const loginButton = this.add.rectangle(0, browserHeight/8, 150, 50, 0x003366);
                browserContainer.add(loginButton);
                
                const loginText = this.add.text(0, browserHeight/8, 'LOGIN', {
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '16px',
                    fontStyle: 'bold',
                    color: '#ffffff',
                    align: 'center'
                });
                loginText.setOrigin(0.5);
                browserContainer.add(loginText);
                
                // Warning message - better positioned
                const warningMsg = this.add.text(0, browserHeight/8 + 70, '[ATTACKER CONTROLLED SITE]', {
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '20px',
                    fontStyle: 'bold',
                    color: '#cc0000',
                    align: 'center'
                });
                warningMsg.setOrigin(0.5);
                browserContainer.add(warningMsg);
                
                // Continue button - better positioned
                const continueButton = this.add.rectangle(0, browserHeight/8 + 130, 200, 50, 0x333333);
                continueButton.setInteractive({ useHandCursor: true });
                browserContainer.add(continueButton);
                
                const continueText = this.add.text(0, browserHeight/8 + 130, 'Continue Lesson', {
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '16px',
                    color: '#ffffff',
                    align: 'center'
                });
                continueText.setOrigin(0.5);
                browserContainer.add(continueText);
                
                // Set validation bypassed flag
                this.validationBypassed = true;
                
                // Continue button action
                continueButton.on('pointerdown', () => {
                    this.tweens.add({
                        targets: browserContainer,
                        alpha: 0,
                        duration: 500,
                        ease: 'Power2',
                        onComplete: () => {
                            browserContainer.destroy();
                            this.showSuccessScreen(true); // Unsafe choice made
                        }
                    });
                });
                
                // Hover effects
                continueButton.on('pointerover', () => {
                    continueButton.fillColor = 0x555555;
                });
                
                continueButton.on('pointerout', () => {
                    continueButton.fillColor = 0x333333;
                });
            });
        });
        
        // Hover effects
        bypassButton.on('pointerover', () => {
            bypassButton.fillColor = 0xdddddd;
        });
        
        bypassButton.on('pointerout', () => {
            bypassButton.fillColor = 0xeeeeee;
        });
    });
    
    // Hover effects for main buttons
    backButton.on('pointerover', () => {
        backButton.fillColor = 0x5c98ff;
    });
    
    backButton.on('pointerout', () => {
        backButton.fillColor = 0x4285f4;
    });
    
    advancedButton.on('pointerover', () => {
        advancedButton.fillColor = 0xaaaaaa;
    });
    
    advancedButton.on('pointerout', () => {
        advancedButton.fillColor = 0x999999;
    });
    
    // Add back and reset buttons
    this.time.delayedCall(100, () => {
        // Ensure UI control buttons are visible above other elements
        const backButton = GameUIUtils.createBackButton(this, 'A2LevelSelect', 80, 40);
        const resetButton = GameUIUtils.createResetButton(this, 'ChallengeA2Level4', this.cameras.main.width - 40, 40);
        backButton.setDepth(100);
        resetButton.setDepth(100);
    });
}
    
    showSuccessScreen(bypassedValidation) {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        
        // Create success container
        const successContainer = this.add.container(centerX, centerY);
        
        // Success background
        const successBg = this.add.rectangle(0, 0, 650, 450, 0x001100, 0.95);
        successBg.setStrokeStyle(3, 0x33cc99);
        
        // Success header
        const successHeader = this.add.text(0, -180, 'CHALLENGE COMPLETE!', {
            fontFamily: 'Arial Black, Impact, sans-serif',
            fontSize: '36px',
            fontStyle: 'bold',
            color: '#33cc99',
            align: 'center'
        });
        successHeader.setOrigin(0.5);
        
        // Success message
        let successTitle;
        if (bypassedValidation) {
            successTitle = this.add.text(0, -120, 'You experienced the dangers of bypassing certificate validation!', {
                fontFamily: 'Arial, sans-serif',
                fontSize: '22px',
                color: '#ffffff',
                align: 'center'
            });
        } else {
            successTitle = this.add.text(0, -120, 'You made the secure choice by respecting certificate warnings!', {
                fontFamily: 'Arial, sans-serif',
                fontSize: '22px',
                color: '#ffffff',
                align: 'center'
            });
        }
        successTitle.setOrigin(0.5);
        
        // Explanation
        const explanationTitle = this.add.text(0, -60, 'What you learned:', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '22px',
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
        
        const explanationText = this.add.text(0, 40, explanation, {
            fontFamily: 'Arial, sans-serif',
            fontSize: '18px',
            color: '#ffffff',
            align: 'center',
            lineSpacing: 8
        });
        explanationText.setOrigin(0.5);
        
        // Complete challenge button
        const completeButton = this.add.rectangle(0, 160, 250, 50, 0x33cc99);
        completeButton.setInteractive({ useHandCursor: true });
        
        const completeText = this.add.text(0, 160, 'COMPLETE CHALLENGE', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '20px',
            color: '#ffffff',
            align: 'center'
        });
        completeText.setOrigin(0.5);
        
        // Add components to container
        successContainer.add(successBg);
        successContainer.add(successHeader);
        successContainer.add(successTitle);
        successContainer.add(explanationTitle);
        successContainer.add(explanationText);
        successContainer.add(completeButton);
        successContainer.add(completeText);
        
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

    update() {
        // Game logic that runs on every frame
    }
}