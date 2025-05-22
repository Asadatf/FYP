class ChallengeA1Gameplay extends Phaser.Scene {
    constructor() {
        super('ChallengeA1Gameplay');
        this.currentStep = 0;
        this.validSessionIds = {
            '52DFG67GHJ9': 'JohnDoe',
            '87TYUI9MNBL': 'Alice',
            '98GHYU67JNM': 'Bob'
        };
        this.scalingManager = null;
    }

    preload() {
        // Load any specific assets for this challenge
        this.load.image('terminal_bg', 'assets/terminal_bg.png');
    }

    create() {
        // Initialize the scaling manager
        this.scalingManager = new ScalingManager(this);
        
        // Set up the challenge gameplay screen
        console.log("Available scenes:", this.scene.manager.scenes.map(scene => scene.scene.key));
        this.createBackground();
        this.createStartMessage();
        
        // Listen for resize events
        this.scale.on('resize', this.handleResize, this);
    }
    
    handleResize() {
        // Update scaling manager
        if (this.scalingManager) {
            this.scalingManager.updateScaleFactor();
            this.refreshUI();
        }
    }
    
    refreshUI() {
        // Clear the existing display
        this.children.removeAll(true);
        
        // Recreate the UI elements
        this.createBackground();
        
        // Recreate UI based on current state
        if (this.currentStep === 0) {
            this.createStartMessage();
        } else if (this.currentStep === 1) {
            this.showInstructionPopup();
        } else if (this.currentStep === 2) {
            this.showLoginAttempt();
        } else if (this.currentStep === 3) {
            this.showServerLogs();
        }
    }
    
    createBackground() {
        // Create a dark background that fills the entire screen
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        const bg = this.add.rectangle(0, 0, width, height, 0x000022);
        bg.setOrigin(0, 0);
        
        // Create a subtle grid pattern with responsive sizing
        const gridSize = this.scalingManager.scale(40);
        const graphics = this.add.graphics();
        graphics.lineStyle(1, 0x001133, 0.2);
        
        // Draw vertical lines to fill screen
        for(let x = 0; x < width; x += gridSize) {
            graphics.moveTo(x, 0);
            graphics.lineTo(x, height);
        }
        
        // Draw horizontal lines to fill screen
        for(let y = 0; y < height; y += gridSize) {
            graphics.moveTo(0, y);
            graphics.lineTo(width, y);
        }
        
        graphics.strokePath();
    }
    
    createStartMessage() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 4;
        
        // Create the message with animation
        const message = this.add.text(centerX, centerY, 'CHALLENGE A1 HAS STARTED', {
            fontFamily: 'Courier New, monospace',
            fontSize: `${this.scalingManager.scale(32)}px`,
            fontStyle: 'bold',
            color: '#00ff00', // Hacker green
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
                const cursor = this.add.text(message.x + message.width / 2 + this.scalingManager.scale(10), message.y, '_', {
                    fontFamily: 'Courier New, monospace',
                    fontSize: `${this.scalingManager.scale(32)}px`,
                    color: '#00ff00'
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
                                y: centerY - this.scalingManager.scale(50),
                                duration: 800,
                                ease: 'Power2'
                            });
                        });
                    }
                });
            }
        });
        
        // Add a subtitle that appears after the main message
        const subtitle = this.add.text(centerX, centerY + this.scalingManager.scale(50), 'Session Hijacker', {
            fontFamily: 'Courier New, monospace',
            fontSize: `${this.scalingManager.scale(20)}px`,
            color: '#3399ff',
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
                            this.currentStep = 1;
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
        
        // Tutorial popup background with scaled dimensions
        const popupWidth = this.scalingManager.scale(500);
        const popupHeight = this.scalingManager.scale(300);
        
        const popupBg = this.add.rectangle(0, 0, popupWidth, popupHeight, 0x000000, 0.9);
        popupBg.setStrokeStyle(this.scalingManager.scale(2), 0x3399ff);
        
        // Popup header with scaled font
        const popupHeader = this.add.text(0, -this.scalingManager.scale(120), 'SESSION HIJACKING', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${this.scalingManager.scale(24)}px`,
            fontStyle: 'bold',
            color: '#3399ff',
            align: 'center'
        });
        popupHeader.setOrigin(0.5);
        
        // Popup content
        const content = [
            "Web applications use session IDs to track logged-in users.",
            "",
            "If a session ID is exposed, an attacker can hijack it",
            "and access another user's account.",
            "",
            "Your goal: Steal a session and log in as another user."
        ].join('\n');
        
        const popupContent = this.add.text(0, 0, content, {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${this.scalingManager.scale(16)}px`,
            color: '#ffffff',
            align: 'center',
            lineSpacing: this.scalingManager.scale(5)
        });
        popupContent.setOrigin(0.5);
        
        // Continue button with scaled dimensions
        const buttonWidth = this.scalingManager.scale(150);
        const buttonHeight = this.scalingManager.scale(40);
        const buttonY = this.scalingManager.scale(110);
        
        const buttonBg = this.add.rectangle(0, buttonY, buttonWidth, buttonHeight, 0x3399ff);
        buttonBg.setInteractive({ useHandCursor: true });
        
        const buttonText = this.add.text(0, buttonY, 'CONTINUE', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${this.scalingManager.scale(16)}px`,
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
                    this.currentStep = 2;
                    this.showLoginAttempt();
                }
            });
        });
        
        // Hover effects for button
        buttonBg.on('pointerover', () => {
            buttonBg.fillColor = 0x66aaff;
        });
        
        buttonBg.on('pointerout', () => {
            buttonBg.fillColor = 0x3399ff;
        });
    }
    
    showLoginAttempt() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        
        // Create login form container
        const loginContainer = this.add.container(centerX, centerY);
        
        // Login form background with scaled dimensions
        const formWidth = this.scalingManager.scale(400);
        const formHeight = this.scalingManager.scale(350);
        
        const formBg = this.add.rectangle(0, 0, formWidth, formHeight, 0x222222, 0.9);
        formBg.setStrokeStyle(this.scalingManager.scale(2), 0x555555);
        
        // Login form header with scaled font
        const formHeader = this.add.text(0, -this.scalingManager.scale(140), 'LOGIN', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${this.scalingManager.scale(24)}px`,
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'center'
        });
        formHeader.setOrigin(0.5);
        
        // Web app logo
        const logo = this.add.text(0, -this.scalingManager.scale(100), '[ SECURE APP ]', {
            fontFamily: 'Arial Black, Impact, sans-serif',
            fontSize: `${this.scalingManager.scale(16)}px`,
            fontStyle: 'bold',
            color: '#3399ff',
            align: 'center'
        });
        logo.setOrigin(0.5);
        
        // Username field
        this.createFormField(loginContainer, -this.scalingManager.scale(50), 'Username:');
        const usernameInput = this.add.text(0, -this.scalingManager.scale(20), 'hacker123', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${this.scalingManager.scale(16)}px`,
            color: '#ffffff',
            align: 'center'
        });
        usernameInput.setOrigin(0.5);
        loginContainer.add(usernameInput);
        
        // Password field
        this.createFormField(loginContainer, this.scalingManager.scale(20), 'Password:');
        const passwordInput = this.add.text(0, this.scalingManager.scale(50), '********', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${this.scalingManager.scale(16)}px`,
            color: '#ffffff',
            align: 'center'
        });
        passwordInput.setOrigin(0.5);
        loginContainer.add(passwordInput);
        
        // Login button with scaled dimensions
        const buttonWidth = this.scalingManager.scale(150);
        const buttonHeight = this.scalingManager.scale(40);
        const buttonY = this.scalingManager.scale(100);
        
        const loginButton = this.add.rectangle(0, buttonY, buttonWidth, buttonHeight, 0x3399ff);
        loginButton.setInteractive({ useHandCursor: true });
        
        const loginButtonText = this.add.text(0, buttonY, 'LOGIN', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${this.scalingManager.scale(16)}px`,
            color: '#ffffff',
            align: 'center'
        });
        loginButtonText.setOrigin(0.5);
        
        // Add components to the login container
        loginContainer.add(formBg);
        loginContainer.add(formHeader);
        loginContainer.add(logo);
        loginContainer.add(loginButton);
        loginContainer.add(loginButtonText);
        
        // Animation for login form appearance
        loginContainer.setAlpha(0);
        
        this.tweens.add({
            targets: loginContainer,
            alpha: 1,
            duration: 500,
            ease: 'Power2'
        });
        
        // Login button action - show error message
        loginButton.on('pointerdown', () => {
            // Create error message
            const errorMsg = this.add.text(0, this.scalingManager.scale(140), 'Login failed: Incorrect password', {
                fontFamily: 'Arial, sans-serif',
                fontSize: `${this.scalingManager.scale(16)}px`,
                color: '#ff3333',
                align: 'center'
            });
            errorMsg.setOrigin(0.5);
            loginContainer.add(errorMsg);
            
            // Show hint after a short delay
            this.time.delayedCall(1000, () => {
                const hintMsg = this.add.text(0, this.scalingManager.scale(170), 'Hint: Try looking at public logs to find session data!', {
                    fontFamily: 'Arial, sans-serif',
                    fontSize: `${this.scalingManager.scale(14)}px`,
                    fontStyle: 'italic',
                    color: '#ffff00',
                    align: 'center'
                });
                hintMsg.setOrigin(0.5);
                loginContainer.add(hintMsg);
                
                // Show server log button
                this.time.delayedCall(1500, () => {
                    const logButton = this.add.rectangle(0, this.scalingManager.scale(220), this.scalingManager.scale(200), this.scalingManager.scale(40), 0x555555);
                    logButton.setInteractive({ useHandCursor: true });
                    
                    const logButtonText = this.add.text(0, this.scalingManager.scale(220), 'VIEW SERVER LOGS', {
                        fontFamily: 'Arial, sans-serif',
                        fontSize: `${this.scalingManager.scale(16)}px`,
                        color: '#ffffff',
                        align: 'center'
                    });
                    logButtonText.setOrigin(0.5);
                    
                    loginContainer.add(logButton);
                    loginContainer.add(logButtonText);
                    
                    // Server log button action
                    logButton.on('pointerdown', () => {
                        this.tweens.add({
                            targets: loginContainer,
                            alpha: 0,
                            duration: 300,
                            ease: 'Power2',
                            onComplete: () => {
                                loginContainer.destroy();
                                this.currentStep = 3;
                                this.showServerLogs();
                            }
                        });
                    });
                    
                    // Hover effects for log button
                    logButton.on('pointerover', () => {
                        logButton.fillColor = 0x777777;
                    });
                    
                    logButton.on('pointerout', () => {
                        logButton.fillColor = 0x555555;
                    });
                });
            });
        });
        
        // Hover effects for login button
        loginButton.on('pointerover', () => {
            loginButton.fillColor = 0x66aaff;
        });
        
        loginButton.on('pointerout', () => {
            loginButton.fillColor = 0x3399ff;
        });
    }
    
    createFormField(container, yPos, label) {
        const fieldLabel = this.add.text(-this.scalingManager.scale(150), yPos, label, {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${this.scalingManager.scale(16)}px`,
            color: '#aaaaaa',
            align: 'right'
        });
        fieldLabel.setOrigin(0, 0.5);
        
        const fieldBg = this.add.rectangle(0, yPos + this.scalingManager.scale(30), this.scalingManager.scale(300), this.scalingManager.scale(30), 0x333333);
        fieldBg.setStrokeStyle(1, 0x555555);
        
        container.add(fieldLabel);
        container.add(fieldBg);
    }
    
    showServerLogs() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        
        // Create log container
        const logContainer = this.add.container(centerX, centerY);
        
        // Log background with scaled dimensions
        const logWidth = this.scalingManager.scale(700);
        const logHeight = this.scalingManager.scale(400);
        
        const logBg = this.add.rectangle(0, 0, logWidth, logHeight, 0x000000, 0.9);
        logBg.setStrokeStyle(this.scalingManager.scale(2), 0x00ff00);
        
        // Log header with scaled font
        const logHeader = this.add.text(0, -this.scalingManager.scale(180), 'SERVER LOGS', {
            fontFamily: 'Courier New, monospace',
            fontSize: `${this.scalingManager.scale(24)}px`,
            fontStyle: 'bold',
            color: '#00ff00',
            align: 'center'
        });
        logHeader.setOrigin(0.5);
        
        // Log content
        const logContent = [
            '[2023-03-24 08:12:37] [INFO] Server started on port 8080',
            '[2023-03-24 08:15:22] [DEBUG] Database connection established',
            '[2023-03-24 08:16:45] [INFO] User JohnDoe logged in - Session ID: 52DFG67GHJ9',
            '[2023-03-24 08:18:12] [WARN] Failed login attempt for user: admin',
            '[2023-03-24 08:19:30] [INFO] User Alice logged in - Session ID: 87TYUI9MNBL',
            '[2023-03-24 08:23:42] [DEBUG] Processing payment transaction #45621',
            '[2023-03-24 08:24:15] [INFO] User Bob logged in - Session ID: 98GHYU67JNM',
            '[2023-03-24 08:26:38] [DEBUG] File upload completed: report.pdf',
            '[2023-03-24 08:28:51] [WARN] Failed login attempt for user: hacker123',
            '[2023-03-24 08:30:10] [ERROR] Database query timeout after 30s'
        ].join('\n');
        
        const logs = this.add.text(0, 0, logContent, {
            fontFamily: 'Courier New, monospace',
            fontSize: `${this.scalingManager.scale(14)}px`,
            color: '#00ff00',
            align: 'left',
            lineSpacing: this.scalingManager.scale(8)
        });
        logs.setOrigin(0.5);
        
        // Create session ID input field with scaled dimensions
        const inputLabel = this.add.text(-this.scalingManager.scale(300), this.scalingManager.scale(130), 'Enter Session ID:', {
            fontFamily: 'Courier New, monospace',
            fontSize: `${this.scalingManager.scale(16)}px`,
            color: '#ffffff',
            align: 'left'
        });
        inputLabel.setOrigin(0, 0.5);
        
        const inputBg = this.add.rectangle(0, this.scalingManager.scale(160), this.scalingManager.scale(400), this.scalingManager.scale(30), 0x333333);
        inputBg.setStrokeStyle(1, 0x00ff00);
        
        let sessionIdInput = '';
        const inputText = this.add.text(-this.scalingManager.scale(195), this.scalingManager.scale(160), sessionIdInput + '_', {
            fontFamily: 'Courier New, monospace',
            fontSize: `${this.scalingManager.scale(16)}px`,
            color: '#ffffff',
            align: 'left'
        });
        inputText.setOrigin(0, 0.5);
        
        // Create blinking cursor effect
        const cursorTimer = this.time.addEvent({
            delay: 500,
            callback: () => {
                if (inputText.text.endsWith('_')) {
                    inputText.setText(sessionIdInput);
                } else {
                    inputText.setText(sessionIdInput + '_');
                }
            },
            loop: true
        });
        
        // Store the timer reference for later cleanup
        this.cursorTimer = cursorTimer;
        
        // Submit button with scaled dimensions
        const submitButton = this.add.rectangle(this.scalingManager.scale(250), this.scalingManager.scale(160), this.scalingManager.scale(150), this.scalingManager.scale(30), 0x00aa00);
        submitButton.setInteractive({ useHandCursor: true });
        
        const submitText = this.add.text(this.scalingManager.scale(250), this.scalingManager.scale(160), 'USE SESSION ID', {
            fontFamily: 'Courier New, monospace',
            fontSize: `${this.scalingManager.scale(14)}px`,
            color: '#ffffff',
            align: 'center'
        });
        submitText.setOrigin(0.5);
        
        // Status message
        const statusMsg = this.add.text(0, this.scalingManager.scale(200), '', {
            fontFamily: 'Courier New, monospace',
            fontSize: `${this.scalingManager.scale(16)}px`,
            color: '#ffff00',
            align: 'center'
        });
        statusMsg.setOrigin(0.5);
        
        // Add components to the log container
        logContainer.add(logBg);
        logContainer.add(logHeader);
        logContainer.add(logs);
        logContainer.add(inputLabel);
        logContainer.add(inputBg);
        logContainer.add(inputText);
        logContainer.add(submitButton);
        logContainer.add(submitText);
        logContainer.add(statusMsg);
        
        // Animation for log container appearance
        logContainer.setAlpha(0);
        
        this.tweens.add({
            targets: logContainer,
            alpha: 1,
            duration: 500,
            ease: 'Power2'
        });
        
        // Setup keyboard input
        this.input.keyboard.on('keydown', (event) => {
            // If session is already hijacked, don't process input
            if (statusMsg.text.includes('Access granted')) {
                return;
            }
            
            // Handle backspace
            if (event.keyCode === 8 && sessionIdInput.length > 0) {
                sessionIdInput = sessionIdInput.slice(0, -1);
                inputText.setText(sessionIdInput + '_');
                return;
            }
            
            // Only accept alphanumeric characters
            if ((event.keyCode >= 48 && event.keyCode <= 57) || // Numbers
                (event.keyCode >= 65 && event.keyCode <= 90) || // Uppercase letters
                (event.keyCode >= 97 && event.keyCode <= 122)) { // Lowercase letters
                
                // Limit input length
                if (sessionIdInput.length < 11) {
                    sessionIdInput += event.key;
                    inputText.setText(sessionIdInput + '_');
                }
            }
        });
        
        // Submit button action
        submitButton.on('pointerdown', () => {
            // Check if the session ID is valid
            if (this.validSessionIds[sessionIdInput]) {
                const username = this.validSessionIds[sessionIdInput];
                statusMsg.setText(`Access granted! You are now logged in as ${username}.`);
                statusMsg.setColor('#00ff00');
                
                // Show success message after a delay
                this.time.delayedCall(2000, () => {
                    this.tweens.add({
                        targets: logContainer,
                        alpha: 0,
                        duration: 500,
                        ease: 'Power2',
                        onComplete: () => {
                            logContainer.destroy();
                            this.currentStep = 4;
                            this.showSuccessScreen(username);
                        }
                    });
                });
            } else if (sessionIdInput.length > 0) {
                // Invalid session ID
                statusMsg.setText('Invalid session ID. Try again!');
                statusMsg.setColor('#ff0000');
            } else {
                // Empty input
                statusMsg.setText('Please enter a session ID.');
                statusMsg.setColor('#ff0000');
            }
        });
        
        // Back button with scaled dimensions
        const backButton = this.add.rectangle(0, -this.scalingManager.scale(220), this.scalingManager.scale(100), this.scalingManager.scale(30), 0x555555);
        backButton.setInteractive({ useHandCursor: true });
        
        const backText = this.add.text(0, -this.scalingManager.scale(220), 'BACK', {
            fontFamily: 'Courier New, monospace',
            fontSize: `${this.scalingManager.scale(14)}px`,
            color: '#ffffff',
            align: 'center'
        });
        backText.setOrigin(0.5);
        
        logContainer.add(backButton);
        logContainer.add(backText);
        
        // Back button action
        backButton.on('pointerdown', () => {
            this.tweens.add({
                targets: logContainer,
                alpha: 0,
                duration: 300,
                ease: 'Power2',
                onComplete: () => {
                    logContainer.destroy();
                    this.currentStep = 2;
                    this.showLoginAttempt();
                }
            });
        });
        
        // Hover effects
        submitButton.on('pointerover', () => {
            submitButton.fillColor = 0x00dd00;
        });
        
        submitButton.on('pointerout', () => {
            submitButton.fillColor = 0x00aa00;
        });
        
        backButton.on('pointerover', () => {
            backButton.fillColor = 0x777777;
        });
        
        backButton.on('pointerout', () => {
            backButton.fillColor = 0x555555;
        });
    }
    
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
        
        // Next level button with scaled dimensions
        const buttonWidth = this.scalingManager.scale(200);
        const buttonHeight = this.scalingManager.scale(40);
        const buttonY = this.scalingManager.scale(150);
        
        const nextButton = this.add.rectangle(0, buttonY, buttonWidth, buttonHeight, 0x00aa00);
        nextButton.setInteractive({ useHandCursor: true });
        
        const nextText = this.add.text(0, buttonY, 'NEXT LEVEL', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${this.scalingManager.scale(16)}px`,
            color: '#ffffff',
            align: 'center'
        });
        nextText.setOrigin(0.5);
        
        // Add components to the success container
        successContainer.add(successBg);
        successContainer.add(successHeader);
        successContainer.add(userInfo);
        successContainer.add(lessonTitle);
        successContainer.add(lesson);
        successContainer.add(nextButton);
        successContainer.add(nextText);
        
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
        
        // Hover effects
        nextButton.on('pointerover', () => {
            nextButton.fillColor = 0x00dd00;
        });
        
        nextButton.on('pointerout', () => {
            nextButton.fillColor = 0x00aa00;
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
    
    createControlButtons() {
        const buttonY = this.cameras.main.height - this.scalingManager.scale(50);
        
        // Help button
        this.createButton(this.scalingManager.scale(200), buttonY, 'HELP', () => {
            // Show help information
            console.log('Help button clicked');
        });
        
        // Back button
        this.createButton(this.scalingManager.scale(400), buttonY, 'BACK', () => {
            // Return to challenge selection
            this.scene.start('ChallengeA1Screen');
        });
        
        // Hint button
        this.createButton(this.scalingManager.scale(600), buttonY, 'HINT', () => {
            // Provide a hint
            console.log('Hint button clicked');
        });
    }
    
    createButton(x, y, label, callback) {
        // Button background with scaled dimensions
        const buttonWidth = this.scalingManager.scale(120);
        const buttonHeight = this.scalingManager.scale(40);
        
        const buttonBg = this.add.rectangle(x, y, buttonWidth, buttonHeight, 0x003366);
        buttonBg.setStrokeStyle(this.scalingManager.scale(2), 0x0066ff);
        buttonBg.setInteractive({ useHandCursor: true });
        
        // Button text with scaled font
        const buttonText = this.add.text(x, y, label, {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${this.scalingManager.scale(16)}px`,
            color: '#ffffff',
            align: 'center'
        });
        buttonText.setOrigin(0.5);
        
        // Click event
        buttonBg.on('pointerdown', callback);
        
        // Hover effects
        buttonBg.on('pointerover', () => {
            buttonBg.fillColor = 0x0066ff;
            buttonText.setStyle({ color: '#ffffff' });
        });
        
        buttonBg.on('pointerout', () => {
            buttonBg.fillColor = 0x003366;
            buttonText.setStyle({ color: '#ffffff' });
        });
        
        // Appear with a small animation
        buttonBg.setAlpha(0);
        buttonText.setAlpha(0);
        
        this.tweens.add({
            targets: [buttonBg, buttonText],
            alpha: 1,
            duration: 500,
            ease: 'Power2'
        });
        
        return { bg: buttonBg, text: buttonText };
    }

    update() {
        // Game logic that runs on every frame
    }
    
    launchLevel2() {
        console.log("Using alternative transition method");
        this.scene.stop('ChallengeA1Gameplay');
        this.scene.start('ChallengeA1Level2');
    }
}