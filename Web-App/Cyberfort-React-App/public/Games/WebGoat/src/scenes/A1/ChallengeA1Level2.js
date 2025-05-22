class ChallengeA1Level2 extends Phaser.Scene {
    constructor() {
        super('ChallengeA1Level2');
        this.currentStep = 0;
        this.currentUserId = 1001;
        this.scalingManager = null;
    }

    preload() {
        // Load any specific assets for this challenge level
    }

    create() {
        // Initialize the scaling manager
        this.scalingManager = new ScalingManager(this);
        
        // Set up the challenge level 2 screen
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
            this.showProfilePage();
        }
    }
    
    createBackground() {
        // Create a dark background that fills the entire screen
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        const bg = this.add.rectangle(0, 0, width, height, 0x001133);
        bg.setOrigin(0, 0);
        
        // Create a subtle grid pattern with responsive sizing
        const gridSize = this.scalingManager.scale(40);
        const graphics = this.add.graphics();
        graphics.lineStyle(1, 0x0033aa, 0.2);
        
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
        const message = this.add.text(centerX, centerY, 'CHALLENGE A1: LEVEL 2', {
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
        const subtitle = this.add.text(centerX, centerY + this.scalingManager.scale(50), 'IDOR Exploitation', {
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
        const popupHeight = this.scalingManager.scale(320);
        
        const popupBg = this.add.rectangle(0, 0, popupWidth, popupHeight, 0x000000, 0.9);
        popupBg.setStrokeStyle(this.scalingManager.scale(2), 0x3399ff);
        
        // Popup header with scaled font
        const popupHeader = this.add.text(0, -this.scalingManager.scale(130), 'INSECURE DIRECT OBJECT REFERENCES', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${this.scalingManager.scale(20)}px`,
            fontStyle: 'bold',
            color: '#3399ff',
            align: 'center'
        });
        popupHeader.setOrigin(0.5);
        
        // Popup content
        const content = [
            "Insecure Direct Object References (IDOR) occur when an",
            "application exposes a reference to an internal object such as",
            "a file, database record, or key.",
            "",
            "Attackers can manipulate these references to access data they",
            "shouldn't be able to access.",
            "",
            "Your mission: Exploit an IDOR vulnerability to access another",
            "user's confidential data."
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
        const buttonY = this.scalingManager.scale(120);
        
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
                    this.showProfilePage();
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
    
    showProfilePage() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        
        // Create main container
        const webAppContainer = this.add.container(centerX, centerY);
        
        // Web app background with scaled dimensions
        const appWidth = this.scalingManager.scale(600);
        const appHeight = this.scalingManager.scale(400);
        
        const appBg = this.add.rectangle(0, 0, appWidth, appHeight, 0xffffff, 0.95);
        appBg.setStrokeStyle(this.scalingManager.scale(1), 0x999999);
        
        // Header bar
        const headerBar = this.add.rectangle(0, -appHeight/2 + this.scalingManager.scale(20), appWidth, this.scalingManager.scale(40), 0x3399ff);
        
        // Logo
        const logo = this.add.text(-appWidth/2 + this.scalingManager.scale(20), -appHeight/2 + this.scalingManager.scale(20), 'SecureUser', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${this.scalingManager.scale(18)}px`,
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'left'
        });
        logo.setOrigin(0, 0.5);
        
        // Navigation
        const navItems = ['Home', 'Profile', 'Messages', 'Settings'];
        let xPos = -this.scalingManager.scale(100);
        
        for (let i = 0; i < navItems.length; i++) {
            const navItem = this.add.text(xPos, -appHeight/2 + this.scalingManager.scale(20), navItems[i], {
                fontFamily: 'Arial, sans-serif',
                fontSize: `${this.scalingManager.scale(16)}px`,
                color: i === 1 ? '#ffff00' : '#ffffff', // Highlight Profile
                align: 'center'
            });
            navItem.setOrigin(0.5);
            webAppContainer.add(navItem);
            xPos += this.scalingManager.scale(100);
        }
        
        // Profile title
        const profileTitle = this.add.text(0, -appHeight/2 + this.scalingManager.scale(80), 'Your Profile', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${this.scalingManager.scale(24)}px`,
            fontStyle: 'bold',
            color: '#333333',
            align: 'center'
        });
        profileTitle.setOrigin(0.5);
        
        // User info block
        const userInfoBlock = this.add.rectangle(0, -this.scalingManager.scale(70), this.scalingManager.scale(550), this.scalingManager.scale(100), 0xf5f5f5);
        userInfoBlock.setStrokeStyle(this.scalingManager.scale(1), 0xdddddd);
        
        // Profile info
        const profileInfo = [
            `User ID: ${this.currentUserId}`,
            'Name: John Smith',
            'Email: john.smith@example.com',
            'Role: Regular User'
        ];
        
        let yPos = -this.scalingManager.scale(110);
        for (const info of profileInfo) {
            const infoText = this.add.text(-this.scalingManager.scale(250), yPos, info, {
                fontFamily: 'Arial, sans-serif',
                fontSize: `${this.scalingManager.scale(16)}px`,
                color: '#333333',
                align: 'left'
            });
            infoText.setOrigin(0, 0.5);
            webAppContainer.add(infoText);
            yPos += this.scalingManager.scale(25);
        }
        
        // URL bar at the top
        const urlBarBg = this.add.rectangle(0, -appHeight/2 - this.scalingManager.scale(20), appWidth, this.scalingManager.scale(30), 0xeeeeee);
        const urlText = this.add.text(-appWidth/2 + this.scalingManager.scale(10), -appHeight/2 - this.scalingManager.scale(20), 'https://secureuser.example.com/profile?id=1001', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${this.scalingManager.scale(14)}px`,
            color: '#333333',
            align: 'left'
        });
        urlText.setOrigin(0, 0.5);
        
        // User settings section
        const settingsTitle = this.add.text(0, 0, 'Account Settings', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${this.scalingManager.scale(20)}px`,
            fontStyle: 'bold',
            color: '#333333',
            align: 'center'
        });
        settingsTitle.setOrigin(0.5);
        
        // Settings options
        const settingsOptions = [
            'Edit Profile',
            'Change Password',
            'Privacy Settings',
            'Payment Methods'
        ];
        
        yPos = this.scalingManager.scale(40);
        for (const option of settingsOptions) {
            const optionBg = this.add.rectangle(0, yPos, this.scalingManager.scale(300), this.scalingManager.scale(30), 0xf0f0f0);
            optionBg.setStrokeStyle(this.scalingManager.scale(1), 0xdddddd);
            optionBg.setInteractive({ useHandCursor: true });
            
            const optionText = this.add.text(0, yPos, option, {
                fontFamily: 'Arial, sans-serif',
                fontSize: `${this.scalingManager.scale(16)}px`,
                color: '#3399ff',
                align: 'center'
            });
            optionText.setOrigin(0.5);
            
            webAppContainer.add(optionBg);
            webAppContainer.add(optionText);
            
            // Hover effect
            optionBg.on('pointerover', () => {
                optionBg.fillColor = 0xe5e5e5;
            });
            
            optionBg.on('pointerout', () => {
                optionBg.fillColor = 0xf0f0f0;
            });
            
            yPos += this.scalingManager.scale(40);
        }
        
        // Hint
        const hintText = this.add.text(0, appHeight/2 - this.scalingManager.scale(50), 'Hint: Look closely at the URL. Can you change the user ID?', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${this.scalingManager.scale(14)}px`,
            fontStyle: 'italic',
            color: '#ffcc00',
            align: 'center'
        });
        hintText.setOrigin(0.5);
        
        // Add components to container
        webAppContainer.add(appBg);
        webAppContainer.add(headerBar);
        webAppContainer.add(logo);
        webAppContainer.add(urlBarBg);
        webAppContainer.add(urlText);
        webAppContainer.add(profileTitle);
        webAppContainer.add(userInfoBlock);
        webAppContainer.add(settingsTitle);
        webAppContainer.add(hintText);
        
        // Add URL change input field
        const idInput = this.add.text(-this.scalingManager.scale(140), -appHeight/2 - this.scalingManager.scale(20), '', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${this.scalingManager.scale(14)}px`,
            color: '#333333',
            align: 'left'
        });
        idInput.setOrigin(0, 0.5);
        webAppContainer.add(idInput);
        
        // Create a button to change URL
        const goButton = this.add.rectangle(this.scalingManager.scale(200), -appHeight/2 - this.scalingManager.scale(20), this.scalingManager.scale(50), this.scalingManager.scale(24), 0x3399ff);
        goButton.setInteractive({ useHandCursor: true });
        
        const goText = this.add.text(this.scalingManager.scale(200), -appHeight/2 - this.scalingManager.scale(20), 'GO', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${this.scalingManager.scale(14)}px`,
            color: '#ffffff',
            align: 'center'
        });
        goText.setOrigin(0.5);
        
        webAppContainer.add(goButton);
        webAppContainer.add(goText);
        
        // Make URL clickable
        urlBarBg.setInteractive({ useHandCursor: true });
        
        urlBarBg.on('pointerdown', () => {
            urlBarBg.fillColor = 0xffffff;
            urlBarBg.setStrokeStyle(this.scalingManager.scale(2), 0x3399ff);
            
            // Enable keyboard input for URL
            this.input.keyboard.enabled = true;
            
            // Define the base URL (this was missing)
            const urlBase = 'https://secureuser.example.com/profile?id=';
            
            // DO NOT change the URL text - keep the number visible
            // urlText.setText('https://secureuser.example.com/profile?id=');
            
            // Calculate proper position for the ID input field
            const urlBaseWidth = this.getTextWidth(urlBase, this.scalingManager.scale(14));
            
            // Position the ID input at the end of the URL text where the ID is
            const idInputX = -appWidth/2 + urlBaseWidth + this.scalingManager.scale(10);
            
            // Position the ID input at the end of the URL
            idInput.setPosition(idInputX, -appHeight/2 - this.scalingManager.scale(20));
            idInput.setOrigin(0, 0.5);
            
            // Show blinking cursor in ID field
            let blink = true;
            const cursor = this.time.addEvent({
                delay: 500,
                callback: () => {
                    if (blink) {
                        idInput.setText(this.currentUserId + '_');
                    } else {
                        idInput.setText(this.currentUserId.toString());
                    }
                    blink = !blink;
                },
                loop: true
            });
            
            // Listen for keyboard input to change ID
            this.input.keyboard.on('keydown', (event) => {
                // Only allow numbers
                if ((event.keyCode >= 48 && event.keyCode <= 57) || event.keyCode === 8) {
                    if (event.keyCode === 8) {
                        // Backspace
                        this.currentUserId = Math.floor(this.currentUserId / 10);
                        if (this.currentUserId === 0) {
                            this.currentUserId = '';
                        }
                    } else if (this.currentUserId.toString().length < 4) {
                        // Add digit
                        const digit = event.key;
                        if (this.currentUserId === '') {
                            this.currentUserId = digit;
                        } else {
                            this.currentUserId = this.currentUserId.toString() + digit;
                        }
                    }
                    
                    idInput.setText(this.currentUserId + '_');
                } else if (event.keyCode === 13) {
                    // Enter key - navigate to the new ID
                    this.navigateToUserId(this.currentUserId, webAppContainer, cursor);
                }
            });
            
            // GO button action
            goButton.on('pointerdown', () => {
                this.navigateToUserId(this.currentUserId, webAppContainer, cursor);
            });
        });
    }

    getTextWidth(text, fontSize) {
        // Create a temporary text object to measure the width
        const tempText = this.add.text(0, 0, text, {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${fontSize}px`
        });
        
        // Get the width
        const width = tempText.width;
        
        // Remove the temporary text
        tempText.destroy();
        
        // Return the width
        return width;
    }
    
    navigateToUserId(userId, container, cursorEvent) {
        // Target admin ID is 1000
        if (userId == 1000) {
            // Success - found the admin account
            cursorEvent.remove();
            this.input.keyboard.enabled = false;
            
            // Navigation animation
            this.cameras.main.flash(500, 255, 255, 255);
            
            this.time.delayedCall(600, () => {
                this.tweens.add({
                    targets: container,
                    alpha: 0,
                    duration: 300,
                    ease: 'Power2',
                    onComplete: () => {
                        container.destroy();
                        this.currentStep = 3;
                        this.showAdminProfile();
                    }
                });
            });
        } else if (userId != 1001) {
            // Regular user profile, nothing special
            this.cameras.main.flash(300, 255, 255, 255);
            
            this.time.delayedCall(400, () => {
                // Just show a different user name
                container.list.forEach(item => {
                    if (item.type === 'Text' && item.text.includes('Name:')) {
                        item.setText(`Name: User ${userId}`);
                    }
                    if (item.type === 'Text' && item.text.includes('Email:')) {
                        item.setText(`Email: user${userId}@example.com`);
                    }
                });
            });
        }
    }
    
    showAdminProfile() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        
        // Create admin profile container
        const adminContainer = this.add.container(centerX, centerY);
        
        // Web app background with scaled dimensions
        const appWidth = this.scalingManager.scale(600);
        const appHeight = this.scalingManager.scale(400);
        
        const appBg = this.add.rectangle(0, 0, appWidth, appHeight, 0xffffff, 0.95);
        appBg.setStrokeStyle(this.scalingManager.scale(1), 0x999999);
        
        // Header bar - admin gets a red header
        const headerBar = this.add.rectangle(0, -appHeight/2 + this.scalingManager.scale(20), appWidth, this.scalingManager.scale(40), 0xcc0000);
        
        // Logo
        const logo = this.add.text(-appWidth/2 + this.scalingManager.scale(20), -appHeight/2 + this.scalingManager.scale(20), 'SecureUser', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${this.scalingManager.scale(18)}px`,
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'left'
        });
        logo.setOrigin(0, 0.5);
        
        // Admin profile title
        const profileTitle = this.add.text(0, -appHeight/2 + this.scalingManager.scale(80), 'ADMIN Profile', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${this.scalingManager.scale(24)}px`,
            fontStyle: 'bold',
            color: '#cc0000',
            align: 'center'
        });
        profileTitle.setOrigin(0.5);
        
        // User info block
        const userInfoBlock = this.add.rectangle(0, -this.scalingManager.scale(70), this.scalingManager.scale(550), this.scalingManager.scale(100), 0xfdf4f4);
        userInfoBlock.setStrokeStyle(this.scalingManager.scale(1), 0xf5c4c4);
        
        // Profile info
        const profileInfo = [
            'User ID: 1000',
            'Name: Admin User',
            'Email: admin@example.com',
            'Role: System Administrator'
        ];
        
        let yPos = -this.scalingManager.scale(110);
        for (const info of profileInfo) {
            const infoText = this.add.text(-this.scalingManager.scale(250), yPos, info, {
                fontFamily: 'Arial, sans-serif',
                fontSize: `${this.scalingManager.scale(16)}px`,
                color: '#333333',
                align: 'left'
            });
            infoText.setOrigin(0, 0.5);
            adminContainer.add(infoText);
            yPos += this.scalingManager.scale(25);
        }
        
        // URL bar at the top
        const urlBarBg = this.add.rectangle(0, -appHeight/2 - this.scalingManager.scale(20), appWidth, this.scalingManager.scale(30), 0xeeeeee);
        const urlText = this.add.text(-appWidth/2 + this.scalingManager.scale(10), -appHeight/2 - this.scalingManager.scale(20), 'https://secureuser.example.com/profile?id=1000', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${this.scalingManager.scale(14)}px`,
            color: '#333333',
            align: 'left'
        });
        urlText.setOrigin(0, 0.5);
        
        // Secret API key section
        const secretTitle = this.add.text(0, 0, 'CONFIDENTIAL: API Master Key', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${this.scalingManager.scale(20)}px`,
            fontStyle: 'bold',
            color: '#cc0000',
            align: 'center'
        });
        secretTitle.setOrigin(0.5);
        
        // API key box
        const keyBox = this.add.rectangle(0, this.scalingManager.scale(40), this.scalingManager.scale(400), this.scalingManager.scale(40), 0xffeaea);
        keyBox.setStrokeStyle(this.scalingManager.scale(1), 0xffcccc);
        
        const apiKey = this.add.text(0, this.scalingManager.scale(40), 'API-KEY-7791ae74d25b48e5adfe', {
            fontFamily: 'Courier New, monospace',
            fontSize: `${this.scalingManager.scale(18)}px`,
            color: '#cc0000',
            align: 'center'
        });
        apiKey.setOrigin(0.5);
        
        // Success message
        const successMessage = this.add.text(0, this.scalingManager.scale(100), 'Congratulations! You found the admin API key!', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${this.scalingManager.scale(18)}px`,
            fontStyle: 'bold',
            color: '#00cc00',
            align: 'center'
        });
        successMessage.setOrigin(0.5);
        
        // Continue button
        const continueButton = this.add.rectangle(0, this.scalingManager.scale(150), this.scalingManager.scale(200), this.scalingManager.scale(40), 0x00cc00);
        continueButton.setInteractive({ useHandCursor: true });
        
        const continueText = this.add.text(0, this.scalingManager.scale(150), 'COMPLETE CHALLENGE', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${this.scalingManager.scale(16)}px`,
            color: '#ffffff',
            align: 'center'
        });
        continueText.setOrigin(0.5);
        
        // Add components to container
        adminContainer.add(appBg);
        adminContainer.add(headerBar);
        adminContainer.add(logo);
        adminContainer.add(urlBarBg);
        adminContainer.add(urlText);
        adminContainer.add(profileTitle);
        adminContainer.add(userInfoBlock);
        adminContainer.add(secretTitle);
        adminContainer.add(keyBox);
        adminContainer.add(apiKey);
        adminContainer.add(successMessage);
        adminContainer.add(continueButton);
        adminContainer.add(continueText);
        
        // Animation for admin page appearance
        adminContainer.setAlpha(0);
        
        this.tweens.add({
            targets: adminContainer,
            alpha: 1,
            duration: 500,
            ease: 'Power2'
        });
        
        // Continue button action
        continueButton.on('pointerdown', () => {
            this.currentStep = 4;
            this.showCompletionScreen();
        });
        
        // Hover effects
        continueButton.on('pointerover', () => {
            continueButton.fillColor = 0x00ee00;
        });
        
        continueButton.on('pointerout', () => {
            continueButton.fillColor = 0x00cc00;
        });
        
        // Celebration effect
        const particles = this.add.particles('button'); // Assuming you have a particle texture
        
        particles.createEmitter({
            x: { min: this.scalingManager.scale(100), max: this.scalingManager.scale(700) },
            y: this.scalingManager.scale(550),
            speed: { 
                min: this.scalingManager.scale(200), 
                max: this.scalingManager.scale(400) 
            },
            angle: { min: 250, max: 290 },
            scale: { 
                start: this.scalingManager.scale(0.2), 
                end: 0 
            },
            lifespan: 4000,
            quantity: 2,
            frequency: 50,
            tint: [0x00ff00, 0x0000ff, 0xff0000, 0xffff00],
            blendMode: 'ADD'
        });
    }
    
    showCompletionScreen() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        
        // Create completion container
        const completionContainer = this.add.container(centerX, centerY);
        
        // Background with scaled dimensions
        const bgWidth = this.scalingManager.scale(600);
        const bgHeight = this.scalingManager.scale(400);
        
        const completionBg = this.add.rectangle(0, 0, bgWidth, bgHeight, 0x000022, 0.95);
        completionBg.setStrokeStyle(this.scalingManager.scale(3), 0x00ff00);
        
        // Completion message with scaled font
        const completionTitle = this.add.text(0, -this.scalingManager.scale(150), 'CHALLENGE A1 LEVEL 2 COMPLETE', {
            fontFamily: 'Arial Black, Impact, sans-serif',
            fontSize: `${this.scalingManager.scale(36)}px`,
            fontStyle: 'bold',
            color: '#00ff00',
            align: 'center'
        });
        completionTitle.setOrigin(0.5);
        
        // Lessons learned
        const lessonsTitle = this.add.text(0, -this.scalingManager.scale(80), 'LESSONS LEARNED:', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${this.scalingManager.scale(24)}px`,
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'center'
        });
        lessonsTitle.setOrigin(0.5);
        
        const lessonsContent = [
            "1. Session Hijacking: Exposed session IDs can be stolen to",
            "   impersonate legitimate users.",
            "",
            "2. Insecure Direct Object References: User-controlled parameters",
            "   should always be validated to prevent unauthorized access to",
            "   objects, like user accounts or files.",
            "",
            "3. Never trust client-side input: All input must be validated",
            "   and authorized server-side before access is granted."
        ].join('\n');
        
        const lessons = this.add.text(0, this.scalingManager.scale(20), lessonsContent, {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${this.scalingManager.scale(16)}px`,
            color: '#cccccc',
            align: 'center',
            lineSpacing: this.scalingManager.scale(5)
        });
        lessons.setOrigin(0.5);
        
        // Next Level button with scaled dimensions
        const buttonWidth = this.scalingManager.scale(200);
        const buttonHeight = this.scalingManager.scale(40);
        const buttonY = this.scalingManager.scale(150);
        
        const nextButton = this.add.rectangle(0, buttonY, buttonWidth, buttonHeight, 0x33cc33);
        nextButton.setInteractive({ useHandCursor: true });
        
        const nextText = this.add.text(0, buttonY, 'NEXT LEVEL', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${this.scalingManager.scale(18)}px`,
            color: '#ffffff',
            align: 'center'
        });
        nextText.setOrigin(0.5);
        
        // Add components to container
        completionContainer.add(completionBg);
        completionContainer.add(completionTitle);
        completionContainer.add(lessonsTitle);
        completionContainer.add(lessons);
        completionContainer.add(nextButton);
        completionContainer.add(nextText);
        
        // Animation for completion screen appearance
        completionContainer.setAlpha(0);
        
        this.tweens.add({
            targets: completionContainer,
            alpha: 1,
            duration: 800,
            ease: 'Power2'
        });
        
        // Next Level button action
        nextButton.on('pointerdown', () => {
            this.cameras.main.fade(800, 0, 0, 0);
            this.time.delayedCall(800, () => {
                this.scene.start('ChallengeA1Level3');
            });
        });
        
        // Hover effects
        nextButton.on('pointerover', () => {
            nextButton.fillColor = 0x66ff66;
        });
        
        nextButton.on('pointerout', () => {
            nextButton.fillColor = 0x33cc33;
        });
        
        // Victory particles
        const particles = this.add.particles('button');
        
        particles.createEmitter({
            x: { min: 0, max: this.cameras.main.width },
            y: -this.scalingManager.scale(50),
            speed: { 
                min: this.scalingManager.scale(100), 
                max: this.scalingManager.scale(200) 
            },
            angle: { min: 80, max: 100 },
            scale: { 
                start: this.scalingManager.scale(0.2), 
                end: 0 
            },
            lifespan: 4000,
            quantity: 2,
            frequency: 40,
            tint: [0x00ff00, 0x0000ff, 0xff0000, 0xffff00],
            blendMode: 'ADD'
        });
    }

    update() {
        // Game logic that runs on every frame
    }
}