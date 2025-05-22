class ChallengeA1Level3 extends Phaser.Scene {
    constructor() {
        super('ChallengeA1Level3');
        this.currentStep = 0;
    }

    preload() {
        // Load any specific assets for this challenge level
    }

    create() {
        // Set up the challenge level 3 screen
        this.createBackground();
        this.createStartMessage();
    }
    
    createBackground() {
        // Create a dark background with a purple tint for this level
        const bg = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x110022);
        bg.setOrigin(0, 0);
        
        // Create a subtle grid pattern 
        const gridSize = 40;
        const graphics = this.add.graphics();
        graphics.lineStyle(1, 0x330055, 0.2);
        
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
        const message = this.add.text(centerX, centerY, 'CHALLENGE A1: LEVEL 3', {
            fontFamily: 'Courier New, monospace',
            fontSize: '32px',
            fontStyle: 'bold',
            color: '#cc00ff', // Purple
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
                    color: '#cc00ff'
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
        const subtitle = this.add.text(centerX, centerY + 50, 'Locked But Not Secure', {
            fontFamily: 'Courier New, monospace',
            fontSize: '20px',
            color: '#cc33ff', // Lighter purple
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
        popupBg.setStrokeStyle(2, 0xcc33ff);
        
        // Popup header
        const popupHeader = this.add.text(0, -120, 'MISSING FUNCTION LEVEL ACCESS CONTROL', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '18px',
            fontStyle: 'bold',
            color: '#cc33ff',
            align: 'center'
        });
        popupHeader.setOrigin(0.5);
        
        // Popup content
        const content = [
            "Some web applications have admin-only features hidden",
            "from regular users.",
            "",
            "But if the server does not properly check user roles,",
            "anyone can access them via direct URL entry.",
            "",
            "Your goal: Find and access a restricted admin function."
        ].join('\n');
        
        const popupContent = this.add.text(0, 0, content, {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: '#ffffff',
            align: 'center',
            lineSpacing: 5
        });
        popupContent.setOrigin(0.5);
        
        // Start button
        const buttonBg = this.add.rectangle(0, 110, 150, 40, 0xcc33ff);
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
        
        // Start button action
        buttonBg.on('pointerdown', () => {
            this.tweens.add({
                targets: popupContainer,
                alpha: 0,
                scale: 0.8,
                duration: 300,
                ease: 'Power2',
                onComplete: () => {
                    popupContainer.destroy();
                    this.showUserDashboard();
                }
            });
        });
        
        // Hover effects for button
        buttonBg.on('pointerover', () => {
            buttonBg.fillColor = 0xd966ff;
        });
        
        buttonBg.on('pointerout', () => {
            buttonBg.fillColor = 0xcc33ff;
        });
    }
    
    showUserDashboard() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        
        // Create dashboard container
        const dashboardContainer = this.add.container(centerX, centerY);
        
        // Dashboard background
        const dashboardBg = this.add.rectangle(0, 0, 600, 400, 0xffffff, 0.95);
        dashboardBg.setStrokeStyle(1, 0xcccccc);
        
        // Create browser-like header
        const browserHeader = this.add.rectangle(0, -180, 600, 40, 0xeeeeee);
        
        // URL bar
        const urlBarBg = this.add.rectangle(0, -180, 450, 30, 0xffffff);
        urlBarBg.setStrokeStyle(1, 0xcccccc);
        
        const urlText = this.add.text(-220, -180, 'https://game.com/user-dashboard', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            color: '#333333',
            align: 'left'
        });
        urlText.setOrigin(0, 0.5);
        
        // Make URL clickable
        urlBarBg.setInteractive({ useHandCursor: true });
        
        // User dashboard header
        const dashboardHeader = this.add.text(0, -130, 'User Dashboard', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '24px',
            fontStyle: 'bold',
            color: '#333333',
            align: 'center'
        });
        dashboardHeader.setOrigin(0.5);
        
        // User profile section
        const profileBox = this.add.rectangle(0, -70, 400, 80, 0xf5f5f5);
        profileBox.setStrokeStyle(1, 0xdddddd);
        
        // User info
        const usernameText = this.add.text(-180, -90, 'Username: Alice', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: '#333333',
            align: 'left'
        });
        usernameText.setOrigin(0, 0.5);
        
        const roleText = this.add.text(-180, -60, 'Role: Regular User', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: '#666666',
            align: 'left'
        });
        roleText.setOrigin(0, 0.5);
        
        // Profile image placeholder
        const profileImage = this.add.circle(150, -70, 30, 0xdddddd);
        
        // Options section title
        const optionsTitle = this.add.text(0, 0, 'Options', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '20px',
            fontStyle: 'bold',
            color: '#333333',
            align: 'center'
        });
        optionsTitle.setOrigin(0.5);
        
        // Option buttons
        const viewAccountButton = this.createOptionButton(dashboardContainer, -100, 40, 'View Account');
        const editProfileButton = this.createOptionButton(dashboardContainer, 100, 40, 'Edit Profile');
        
        // Hint message
        const hintBox = this.add.rectangle(0, 100, 500, 40, 0xfff8e1);
        hintBox.setStrokeStyle(1, 0xffe0b2);
        
        const hintText = this.add.text(0, 100, 'Hint: Admin users have extra functions. Can you find one?', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            fontStyle: 'italic',
            color: '#ff9800',
            align: 'center'
        });
        hintText.setOrigin(0.5);
        
        // Add components to container
        dashboardContainer.add(dashboardBg);
        dashboardContainer.add(browserHeader);
        dashboardContainer.add(urlBarBg);
        dashboardContainer.add(urlText);
        dashboardContainer.add(dashboardHeader);
        dashboardContainer.add(profileBox);
        dashboardContainer.add(usernameText);
        dashboardContainer.add(roleText);
        dashboardContainer.add(profileImage);
        dashboardContainer.add(optionsTitle);
        dashboardContainer.add(hintBox);
        dashboardContainer.add(hintText);
        
        // Animation for dashboard appearance
        dashboardContainer.setAlpha(0);
        
        this.tweens.add({
            targets: dashboardContainer,
            alpha: 1,
            duration: 500,
            ease: 'Power2'
        });
        
        // URL bar interaction - the main mechanic of this level
        urlBarBg.on('pointerdown', () => {
            // Clear previous URL text
            urlText.setText('');
            
            // Create an input field for URL
            const newUrlText = this.add.text(-220, -180, 'https://game.com/', {
                fontFamily: 'Arial, sans-serif',
                fontSize: '14px',
                color: '#333333',
                align: 'left'
            });
            newUrlText.setOrigin(0, 0.5);
            dashboardContainer.add(newUrlText);
            
            // Create a blinking cursor
            const cursor = this.add.text(newUrlText.x + newUrlText.width, -180, '|', {
                fontFamily: 'Arial, sans-serif',
                fontSize: '14px',
                color: '#333333',
                align: 'left'
            });
            cursor.setOrigin(0, 0.5);
            dashboardContainer.add(cursor);
            
            // Set up blinking cursor animation
            const cursorBlink = this.time.addEvent({
                delay: 500,
                callback: () => {
                    cursor.visible = !cursor.visible;
                },
                loop: true
            });
            
            // Variable to store what the user types
            let typedUrl = '';
            
            // Set up keyboard input
            const keyboardInput = this.input.keyboard.on('keydown', (event) => {
                // If Enter is pressed, check the URL
                if (event.keyCode === 13) { // Enter key
                    const fullUrl = 'https://game.com/' + typedUrl;
                    this.checkUrl(fullUrl, dashboardContainer, cursorBlink, keyboardInput);
                    return;
                }
                
                // If backspace is pressed, remove the last character
                if (event.keyCode === 8 && typedUrl.length > 0) { // Backspace
                    typedUrl = typedUrl.slice(0, -1);
                    newUrlText.setText('https://game.com/' + typedUrl);
                    cursor.x = newUrlText.x + newUrlText.width;
                    return;
                }
                
                // Add the typed character to the URL
                if ((event.keyCode >= 48 && event.keyCode <= 90) || // Numbers and letters
                    (event.keyCode >= 186 && event.keyCode <= 222) || // Special chars
                    event.keyCode === 32 || // Space
                    event.keyCode === 173) { // Hyphen
                    
                    typedUrl += event.key;
                    newUrlText.setText('https://game.com/' + typedUrl);
                    cursor.x = newUrlText.x + newUrlText.width;
                }
            });
        });
    }
    
    createOptionButton(container, x, y, label) {
        const buttonBg = this.add.rectangle(x, y, 180, 40, 0xeeeeee);
        buttonBg.setStrokeStyle(1, 0xdddddd);
        buttonBg.setInteractive({ useHandCursor: true });
        
        const buttonText = this.add.text(x, y, label, {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: '#666666',
            align: 'center'
        });
        buttonText.setOrigin(0.5);
        
        container.add(buttonBg);
        container.add(buttonText);
        
        // Hover effects
        buttonBg.on('pointerover', () => {
            buttonBg.fillColor = 0xf5f5f5;
            buttonText.setColor('#333333');
        });
        
        buttonBg.on('pointerout', () => {
            buttonBg.fillColor = 0xeeeeee;
            buttonText.setColor('#666666');
        });
        
        return { bg: buttonBg, text: buttonText };
    }
    
    checkUrl(url, container, cursorBlink, keyboardInput) {
        // Stop the cursor blinking and keyboard input
        if (cursorBlink) {
            cursorBlink.remove();
        }
        
        if (keyboardInput) {
            this.input.keyboard.off('keydown', keyboardInput);
        }
        
        // Check if the user found the admin dashboard
        if (url.toLowerCase().includes('admin') || 
            url.toLowerCase().includes('admin-dashboard')) {
            // Success! Found the admin dashboard
            this.cameras.main.flash(300, 255, 255, 255);
            
            this.time.delayedCall(400, () => {
                this.tweens.add({
                    targets: container,
                    alpha: 0,
                    duration: 300,
                    ease: 'Power2',
                    onComplete: () => {
                        container.destroy();
                        this.showAdminDashboard(url);
                    }
                });
            });
        } else {
            // Invalid URL, show an error message
            const errorContainer = this.add.container(container.x, container.y - 20);
            
            const errorBox = this.add.rectangle(0, 0, 300, 50, 0xffebee);
            errorBox.setStrokeStyle(1, 0xffcdd2);
            
            const errorText = this.add.text(0, 0, 'Page not found. Try another URL.', {
                fontFamily: 'Arial, sans-serif',
                fontSize: '14px',
                color: '#f44336',
                align: 'center'
            });
            errorText.setOrigin(0.5);
            
            errorContainer.add(errorBox);
            errorContainer.add(errorText);
            
            // Add to the main container
            container.add(errorContainer);
            
            // Fade out error after 2 seconds
            this.tweens.add({
                targets: errorContainer,
                alpha: 0,
                delay: 2000,
                duration: 300,
                ease: 'Power2',
                onComplete: () => {
                    errorContainer.destroy();
                    
                    // Reset URL bar
                    const urlText = container.list.find(item => 
                        item.type === 'Text' && 
                        item.text.includes('https://game.com/'));
                    
                    if (urlText) {
                        urlText.setText('https://game.com/user-dashboard');
                    }
                }
            });
        }
    }
    
    showAdminDashboard(discoveredUrl) {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        
        // Create admin dashboard container
        const adminContainer = this.add.container(centerX, centerY);
        
        // Dashboard background
        const dashboardBg = this.add.rectangle(0, 0, 600, 400, 0xffffff, 0.95);
        dashboardBg.setStrokeStyle(1, 0xcccccc);
        
        // Create browser-like header
        const browserHeader = this.add.rectangle(0, -180, 600, 40, 0xeeeeee);
        
        // URL bar
        const urlBarBg = this.add.rectangle(0, -180, 450, 30, 0xffffff);
        urlBarBg.setStrokeStyle(1, 0xcccccc);
        
        const urlText = this.add.text(-220, -180, discoveredUrl, {
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            color: '#333333',
            align: 'left'
        });
        urlText.setOrigin(0, 0.5);
        
        // Admin dashboard header - with a red color to indicate admin area
        const dashboardHeader = this.add.text(0, -130, 'Admin Dashboard', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '24px',
            fontStyle: 'bold',
            color: '#d32f2f', // Red for admin
            align: 'center'
        });
        dashboardHeader.setOrigin(0.5);
        
        // Welcome message
        const welcomeText = this.add.text(0, -90, 'Welcome, Admin!', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '18px',
            color: '#333333',
            align: 'center'
        });
        welcomeText.setOrigin(0.5);
        
        // Admin options section title
        const optionsTitle = this.add.text(0, -50, 'Admin Functions', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '20px',
            fontStyle: 'bold',
            color: '#d32f2f', // Red for admin
            align: 'center'
        });
        optionsTitle.setOrigin(0.5);
        
        // Admin option buttons
        const viewUsersButton = this.createAdminButton(adminContainer, -120, 0, 'View All Users');
        const deleteAccountsButton = this.createAdminButton(adminContainer, 120, 0, 'Delete Accounts');
        const changeRolesButton = this.createAdminButton(adminContainer, 0, 60, 'Change User Roles');
        
        // Add components to container
        adminContainer.add(dashboardBg);
        adminContainer.add(browserHeader);
        adminContainer.add(urlBarBg);
        adminContainer.add(urlText);
        adminContainer.add(dashboardHeader);
        adminContainer.add(welcomeText);
        adminContainer.add(optionsTitle);
        
        // Animation for admin dashboard appearance
        adminContainer.setAlpha(0);
        
        this.tweens.add({
            targets: adminContainer,
            alpha: 1,
            duration: 500,
            ease: 'Power2',
            onComplete: () => {
                // Show unauthorized access message
                this.showUnauthorizedMessage(adminContainer);
            }
        });
    }
    
    createAdminButton(container, x, y, label) {
        const buttonBg = this.add.rectangle(x, y, 200, 40, 0xffebee);
        buttonBg.setStrokeStyle(1, 0xffcdd2);
        buttonBg.setInteractive({ useHandCursor: true });
        
        const buttonText = this.add.text(x, y, label, {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: '#d32f2f',
            align: 'center'
        });
        buttonText.setOrigin(0.5);
        
        container.add(buttonBg);
        container.add(buttonText);
        
        // Hover effects
        buttonBg.on('pointerover', () => {
            buttonBg.fillColor = 0xef9a9a;
            buttonText.setColor('#b71c1c');
        });
        
        buttonBg.on('pointerout', () => {
            buttonBg.fillColor = 0xffebee;
            buttonText.setColor('#d32f2f');
        });
        
        return { bg: buttonBg, text: buttonText };
    }
    
    showUnauthorizedMessage(adminContainer) {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        
        // Create message container
        const messageContainer = this.add.container(centerX, centerY);
        
        // Message background
        const messageBg = this.add.rectangle(0, 0, 500, 200, 0x000000, 0.85);
        messageBg.setStrokeStyle(2, 0xcc33ff);
        
        // Success message
        const messageTitle = this.add.text(0, -60, 'Unauthorized Access!', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '24px',
            fontStyle: 'bold',
            color: '#cc33ff',
            align: 'center'
        });
        messageTitle.setOrigin(0.5);
        
        const messageText = this.add.text(0, 0, 'You have gained admin privileges without logging in as an admin!', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: 400 }
        });
        messageText.setOrigin(0.5);
        
        // Continue button
        const continueButton = this.add.rectangle(0, 60, 150, 40, 0xcc33ff);
        continueButton.setInteractive({ useHandCursor: true });
        
        const continueText = this.add.text(0, 60, 'CONTINUE', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: '#ffffff',
            align: 'center'
        });
        continueText.setOrigin(0.5);
        
        // Add components to container
        messageContainer.add(messageBg);
        messageContainer.add(messageTitle);
        messageContainer.add(messageText);
        messageContainer.add(continueButton);
        messageContainer.add(continueText);
        
        // Animation for message appearance
        messageContainer.setAlpha(0);
        messageContainer.setScale(0.8);
        
        this.tweens.add({
            targets: messageContainer,
            alpha: 1,
            scale: 1,
            duration: 300,
            ease: 'Power2'
        });
        
        // Continue button action
        continueButton.on('pointerdown', () => {
            this.tweens.add({
                targets: messageContainer,
                alpha: 0,
                scale: 0.8,
                duration: 300,
                ease: 'Power2',
                onComplete: () => {
                    messageContainer.destroy();
                    
                    // Wait a moment and then show the success screen
                    this.time.delayedCall(500, () => {
                        this.tweens.add({
                            targets: adminContainer,
                            alpha: 0,
                            duration: 500,
                            ease: 'Power2',
                            onComplete: () => {
                                adminContainer.destroy();
                                this.showSuccessScreen();
                            }
                        });
                    });
                }
            });
        });
        
        // Hover effects for button
        continueButton.on('pointerover', () => {
            continueButton.fillColor = 0xd966ff;
        });
        
        continueButton.on('pointerout', () => {
            continueButton.fillColor = 0xcc33ff;
        });
    }
    
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
        const nextButton = this.add.rectangle(0, 150, 200, 40, 0xcc33ff);
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
                this.scene.start('ChallengeA1Level4'); // Prepare for next level
            });
        });
        
        // Hover effects
        nextButton.on('pointerover', () => {
            nextButton.fillColor = 0xd966ff;
        });
        
        nextButton.on('pointerout', () => {
            nextButton.fillColor = 0xcc33ff;
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

    update() {
        // Game logic that runs on every frame
    }
}