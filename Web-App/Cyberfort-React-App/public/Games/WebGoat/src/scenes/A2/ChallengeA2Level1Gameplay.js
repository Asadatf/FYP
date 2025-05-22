class ChallengeA2Level1Gameplay extends Phaser.Scene {
    constructor() {
        super('ChallengeA2Level1Gameplay');
        this.currentStep = 0;
        this.encryptedPassword = 'Vwxy321'; // Caesar Cipher (-4 shift) for "Test123"
        this.correctPassword = 'Test123';
    }

    preload() {
        // Load any specific assets for this challenge
        this.load.image('terminal_bg', 'assets/terminal_bg.png');
    }

    create() {
        // Set up the challenge gameplay screen
        this.createBackground();
        this.createStartMessage();
    }
    
    createBackground() {
        // Create a dark background with green tint
        const bg = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x002211);
        bg.setOrigin(0, 0);
        
        // Create a subtle grid pattern (darker than challenge select screen)
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
        const message = this.add.text(centerX, centerY, 'CHALLENGE A2 HAS STARTED', {
            fontFamily: 'Courier New, monospace',
            fontSize: '32px',
            fontStyle: 'bold',
            color: '#00ff66', // Hacker green
            align: 'center'
        });
        
        message.setOrigin(0.5);
        message.setAlpha(0);
        
        // Animate the message appearance with a typewriter effect
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
                        
                        // Fade out the initial message to make room for the challenge interface
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
        
        // Add a subtitle that appears after the main message
        const subtitle = this.add.text(centerX, centerY + 50, 'Crypto Breaker: The Weak Cipher', {
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
        const popupHeader = this.add.text(0, -120, 'CRYPTOGRAPHY BASICS', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '24px',
            fontStyle: 'bold',
            color: '#33cc99',
            align: 'center'
        });
        popupHeader.setOrigin(0.5);
        
        // Popup content
        const content = [
            "Cryptography is used to protect sensitive information.",
            "",
            "Weak encryption makes it easy for attackers to break security.",
            "",
            "Your goal: Break a weakly encrypted password and reveal",
            "its plaintext form!"
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
                    this.showLoginSystem();
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
    
    showLoginSystem() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        
        // Create login system container
        const loginContainer = this.add.container(centerX, centerY);
        
        // Login system background
        const loginBg = this.add.rectangle(0, 0, 500, 350, 0x001100, 0.9);
        loginBg.setStrokeStyle(2, 0x33cc99);
        
        // System header
        const loginHeader = this.add.text(0, -150, 'LOCKED ACCOUNT LOGIN', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '24px',
            fontStyle: 'bold',
            color: '#33cc99',
            align: 'center'
        });
        loginHeader.setOrigin(0.5);
        
        // Username field
        const usernameLabel = this.add.text(-200, -100, 'Username:', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '18px',
            color: '#ffffff',
            align: 'left'
        });
        usernameLabel.setOrigin(0, 0.5);
        
        const usernameBox = this.add.rectangle(0, -100, 300, 40, 0x003322);
        usernameBox.setStrokeStyle(1, 0x33cc99);
        
        const usernameText = this.add.text(-140, -100, 'admin', {
            fontFamily: 'Courier New, monospace',
            fontSize: '18px',
            color: '#cccccc',
            align: 'left'
        });
        usernameText.setOrigin(0, 0.5);
        
        // Password field
        const passwordLabel = this.add.text(-200, -40, 'Password:', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '18px',
            color: '#ffffff',
            align: 'left'
        });
        passwordLabel.setOrigin(0, 0.5);
        
        const passwordBox = this.add.rectangle(0, -40, 300, 40, 0x003322);
        passwordBox.setStrokeStyle(1, 0x33cc99);
        
        const passwordText = this.add.text(-140, -40, '********', {
            fontFamily: 'Courier New, monospace',
            fontSize: '18px',
            color: '#cccccc',
            align: 'left'
        });
        passwordText.setOrigin(0, 0.5);
        
        // Encrypted password section
        const encryptedLabel = this.add.text(0, 20, 'Encrypted Password:', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '18px',
            color: '#33cc99',
            align: 'center'
        });
        encryptedLabel.setOrigin(0.5);
        
        const encryptedBox = this.add.rectangle(0, 60, 200, 40, 0x003322);
        encryptedBox.setStrokeStyle(1, 0x33cc99);
        
        const encryptedText = this.add.text(0, 60, this.encryptedPassword, {
            fontFamily: 'Courier New, monospace',
            fontSize: '20px',
            fontStyle: 'bold',
            color: '#00ff66',
            align: 'center'
        });
        encryptedText.setOrigin(0.5);
        
        // Hint message
        const hintText = this.add.text(0, 100, 'This is encoded using a weak cipher. Try guessing how it was encrypted!', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            fontStyle: 'italic',
            color: '#ffcc00',
            align: 'center'
        });
        hintText.setOrigin(0.5);
        
        // Crack password button
        const crackButton = this.add.rectangle(0, 150, 200, 40, 0x33cc99);
        crackButton.setInteractive({ useHandCursor: true });
        
        const crackText = this.add.text(0, 150, 'CRACK PASSWORD', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: '#ffffff',
            align: 'center'
        });
        crackText.setOrigin(0.5);
        
        // Add components to the login container
        loginContainer.add(loginBg);
        loginContainer.add(loginHeader);
        loginContainer.add(usernameLabel);
        loginContainer.add(usernameBox);
        loginContainer.add(usernameText);
        loginContainer.add(passwordLabel);
        loginContainer.add(passwordBox);
        loginContainer.add(passwordText);
        loginContainer.add(encryptedLabel);
        loginContainer.add(encryptedBox);
        loginContainer.add(encryptedText);
        loginContainer.add(hintText);
        loginContainer.add(crackButton);
        loginContainer.add(crackText);
        
        // Animation for login system appearance
        loginContainer.setAlpha(0);
        
        this.tweens.add({
            targets: loginContainer,
            alpha: 1,
            duration: 500,
            ease: 'Power2'
        });
        
        // Crack button action
        crackButton.on('pointerdown', () => {
            this.showDecryptionOptions(loginContainer);
        });
        
        // Hover effects for button
        crackButton.on('pointerover', () => {
            crackButton.fillColor = 0x66eebb;
        });
        
        crackButton.on('pointerout', () => {
            crackButton.fillColor = 0x33cc99;
        });
    }
    
    showDecryptionOptions(loginContainer) {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        
        // Create options container
        const optionsContainer = this.add.container(centerX, centerY);
        
        // Options background
        const optionsBg = this.add.rectangle(0, 0, 400, 300, 0x000000, 0.95);
        optionsBg.setStrokeStyle(2, 0x33cc99);
        
        // Options header
        const optionsHeader = this.add.text(0, -120, 'SELECT DECRYPTION METHOD', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '20px',
            fontStyle: 'bold',
            color: '#33cc99',
            align: 'center'
        });
        optionsHeader.setOrigin(0.5);
        
        // Option 1: Caesar Cipher
        const option1 = this.add.rectangle(0, -60, 300, 40, 0x003322);
        option1.setStrokeStyle(1, 0x33cc99);
        option1.setInteractive({ useHandCursor: true });
        
        const option1Text = this.add.text(0, -60, 'Caesar Cipher (-4 shift)', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: '#ffffff',
            align: 'center'
        });
        option1Text.setOrigin(0.5);
        
        // Option 2: Base64 Encoding
        const option2 = this.add.rectangle(0, 0, 300, 40, 0x003322);
        option2.setStrokeStyle(1, 0x33cc99);
        option2.setInteractive({ useHandCursor: true });
        
        const option2Text = this.add.text(0, 0, 'Base64 Encoding', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: '#ffffff',
            align: 'center'
        });
        option2Text.setOrigin(0.5);
        
        // Option 3: AES-256
        const option3 = this.add.rectangle(0, 60, 300, 40, 0x003322);
        option3.setStrokeStyle(1, 0x33cc99);
        option3.setInteractive({ useHandCursor: true });
        
        const option3Text = this.add.text(0, 60, 'AES-256 (Unbreakable without a key)', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: '#ffffff',
            align: 'center'
        });
        option3Text.setOrigin(0.5);
        
        // Add components to the options container
        optionsContainer.add(optionsBg);
        optionsContainer.add(optionsHeader);
        optionsContainer.add(option1);
        optionsContainer.add(option1Text);
        optionsContainer.add(option2);
        optionsContainer.add(option2Text);
        optionsContainer.add(option3);
        optionsContainer.add(option3Text);
        
        // Animation for options appearance
        optionsContainer.setAlpha(0);
        optionsContainer.setScale(0.8);
        
        this.tweens.add({
            targets: optionsContainer,
            alpha: 1,
            scale: 1,
            duration: 300,
            ease: 'Power2'
        });
        
        // Option 1 action - Caesar Cipher (correct)
        option1.on('pointerdown', () => {
            this.tweens.add({
                targets: optionsContainer,
                alpha: 0,
                scale: 0.8,
                duration: 300,
                ease: 'Power2',
                onComplete: () => {
                    optionsContainer.destroy();
                    this.showCorrectDecryption(loginContainer);
                }
            });
        });
        
        // Option 2 action - Base64 (incorrect)
        option2.on('pointerdown', () => {
            const feedbackText = this.add.text(0, 110, 'Nope! This looks like a simple character shift.', {
                fontFamily: 'Arial, sans-serif',
                fontSize: '14px',
                color: '#ff6666',
                align: 'center'
            });
            feedbackText.setOrigin(0.5);
            optionsContainer.add(feedbackText);
            
            // Remove feedback after 2 seconds
            this.time.delayedCall(2000, () => {
                feedbackText.destroy();
            });
        });
        
        // Option 3 action - AES-256 (incorrect)
        option3.on('pointerdown', () => {
            const feedbackText = this.add.text(0, 110, 'This encryption is strong! Without the right key, it\'s impossible to decrypt.', {
                fontFamily: 'Arial, sans-serif',
                fontSize: '12px',
                color: '#ff6666',
                align: 'center',
                wordWrap: { width: 350 }
            });
            feedbackText.setOrigin(0.5);
            optionsContainer.add(feedbackText);
            
            // Remove feedback after 2 seconds
            this.time.delayedCall(2000, () => {
                feedbackText.destroy();
            });
        });
        
        // Hover effects for options
        option1.on('pointerover', () => {
            option1.fillColor = 0x006633;
        });
        
        option1.on('pointerout', () => {
            option1.fillColor = 0x003322;
        });
        
        option2.on('pointerover', () => {
            option2.fillColor = 0x006633;
        });
        
        option2.on('pointerout', () => {
            option2.fillColor = 0x003322;
        });
        
        option3.on('pointerover', () => {
            option3.fillColor = 0x006633;
        });
        
        option3.on('pointerout', () => {
            option3.fillColor = 0x003322;
        });
    }
    
    showCorrectDecryption(loginContainer) {
        // First, update the password field in the login container to show the decrypted password
        loginContainer.list.forEach(item => {
            if (item.type === 'Text' && item.text === '********') {
                // Show the decrypted password
                item.setText(this.correctPassword);
                item.setColor('#00ff66'); // Green color to highlight success
            }
        });
        
        // Create success message
        const successMessage = this.add.text(this.cameras.main.width / 2, 400, 'You cracked the password!', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '24px',
            fontStyle: 'bold',
            color: '#00ff66',
            align: 'center'
        });
        successMessage.setOrigin(0.5);
        
        // Animate success message
        successMessage.setAlpha(0);
        successMessage.setScale(0.8);
        
        this.tweens.add({
            targets: successMessage,
            alpha: 1,
            scale: 1,
            y: 380,
            duration: 500,
            ease: 'Power2'
        });
        
        // Show complete button after a short delay
        this.time.delayedCall(1500, () => {
            const completeButton = this.add.rectangle(this.cameras.main.width / 2, 450, 200, 40, 0x33cc99);
            completeButton.setInteractive({ useHandCursor: true });
            
            const completeText = this.add.text(this.cameras.main.width / 2, 450, 'COMPLETE LEVEL', {
                fontFamily: 'Arial, sans-serif',
                fontSize: '16px',
                color: '#ffffff',
                align: 'center'
            });
            completeText.setOrigin(0.5);
            
            // Complete button animation
            completeButton.setAlpha(0);
            completeText.setAlpha(0);
            
            this.tweens.add({
                targets: [completeButton, completeText],
                alpha: 1,
                duration: 300,
                ease: 'Power2'
            });
            
            // Complete button action
            completeButton.on('pointerdown', () => {
                this.showSuccessScreen();
            });
            
            // Hover effects for complete button
            completeButton.on('pointerover', () => {
                completeButton.fillColor = 0x66eebb;
            });
            
            completeButton.on('pointerout', () => {
                completeButton.fillColor = 0x33cc99;
            });
        });
    }
    
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
        const nextButton = this.add.rectangle(0, 150, 200, 40, 0x33cc99);
        nextButton.setInteractive({ useHandCursor: true });
        
        const nextText = this.add.text(0, 150, 'NEXT LEVEL', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '18px',
            color: '#ffffff',
            align: 'center'
        });
        nextText.setOrigin(0.5);
        
        // Add components to container
        successContainer.add(successBg);
        successContainer.add(successHeader);
        successContainer.add(successTitle);
        successContainer.add(explanationTitle);
        successContainer.add(explanationText);
        successContainer.add(nextButton);
        successContainer.add(nextText);
        
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
        
        // Hover effects
        nextButton.on('pointerover', () => {
            nextButton.fillColor = 0x66eebb;
        });
        
        nextButton.on('pointerout', () => {
            nextButton.fillColor = 0x33cc99;
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