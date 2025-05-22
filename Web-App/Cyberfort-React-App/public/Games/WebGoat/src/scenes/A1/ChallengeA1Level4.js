class ChallengeA1Level4 extends Phaser.Scene {
    constructor() {
        super('ChallengeA1Level4');
        this.currentStep = 0;
        this.cookieData = { user: "Bob", role: "user" };
    }

    preload() {
        // Load any specific assets for this challenge level
        this.load.image('cookie_icon', 'assets/button.png'); // Placeholder, replace with actual cookie icon
    }

    create() {
        // Set up the challenge level 4 screen
        this.createBackground();
        this.createStartMessage();
    }
    
    createBackground() {
        // Create a dark background with an orange/amber tint for this level
        const bg = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x221100);
        bg.setOrigin(0, 0);
        
        // Create a subtle grid pattern 
        const gridSize = 40;
        const graphics = this.add.graphics();
        graphics.lineStyle(1, 0x553300, 0.2);
        
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
        const message = this.add.text(centerX, centerY, 'CHALLENGE A1: LEVEL 4', {
            fontFamily: 'Courier New, monospace',
            fontSize: '32px',
            fontStyle: 'bold',
            color: '#ff9900', // Orange/amber
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
                    color: '#ff9900'
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
        const subtitle = this.add.text(centerX, centerY + 50, 'Cookie Impersonator', {
            fontFamily: 'Courier New, monospace',
            fontSize: '20px',
            color: '#ffaa33', // Lighter orange
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
        popupBg.setStrokeStyle(2, 0xff9900);
        
        // Popup header
        const popupHeader = this.add.text(0, -120, 'COOKIE SPOOFING', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '24px',
            fontStyle: 'bold',
            color: '#ff9900',
            align: 'center'
        });
        popupHeader.setOrigin(0.5);
        
        // Popup content
        const content = [
            "Web applications use cookies to remember logged-in users.",
            "",
            "If a cookie is poorly protected, an attacker can modify it",
            "to gain higher privileges.",
            "",
            "Your goal: Change your cookie to become an admin!"
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
        const buttonBg = this.add.rectangle(0, 110, 150, 40, 0xff9900);
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
            buttonBg.fillColor = 0xffaa33;
        });
        
        buttonBg.on('pointerout', () => {
            buttonBg.fillColor = 0xff9900;
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
        
        const urlText = this.add.text(-220, -180, 'https://game.com/dashboard', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            color: '#333333',
            align: 'left'
        });
        urlText.setOrigin(0, 0.5);
        
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
        const usernameText = this.add.text(-180, -90, 'Username: Bob', {
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
        const viewProfileButton = this.createOptionButton(dashboardContainer, -75, 40, 'View Profile');
        const logoutButton = this.createOptionButton(dashboardContainer, 75, 40, 'Logout');
        
        // Cookie icon in the corner
        const cookieIcon = this.add.circle(250, -170, 15, 0xff9900);
        cookieIcon.setInteractive({ useHandCursor: true });
        
        // Add cookie image/text
        const cookieText = this.add.text(250, -170, 'C', {
            fontFamily: 'Arial Black, Impact, sans-serif',
            fontSize: '16px',
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'center'
        });
        cookieText.setOrigin(0.5);
        
        // Hint message
        const hintBox = this.add.rectangle(0, 100, 500, 40, 0xfff8e1);
        hintBox.setStrokeStyle(1, 0xffe0b2);
        
        const hintText = this.add.text(0, 100, 'Hint: Can you change your role? Check the cookie.', {
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
        dashboardContainer.add(cookieIcon);
        dashboardContainer.add(cookieText);
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
        
        // Cookie icon interaction - the main mechanic of this level
        cookieIcon.on('pointerdown', () => {
            this.showCookieEditor(dashboardContainer);
        });
        
        // Hover effect for cookie icon
        cookieIcon.on('pointerover', () => {
            cookieIcon.fillColor = 0xffaa33;
            
            // Show tooltip
            const tooltipBg = this.add.rectangle(250, -140, 100, 25, 0x333333, 0.8);
            tooltipBg.setOrigin(0.5);
            dashboardContainer.add(tooltipBg);
            
            const tooltipText = this.add.text(250, -140, 'View Cookie', {
                fontFamily: 'Arial, sans-serif',
                fontSize: '12px',
                color: '#ffffff',
                align: 'center'
            });
            tooltipText.setOrigin(0.5);
            dashboardContainer.add(tooltipText);
            
            // Store references to tooltip elements
            cookieIcon.tooltipBg = tooltipBg;
            cookieIcon.tooltipText = tooltipText;
        });
        
        cookieIcon.on('pointerout', () => {
            cookieIcon.fillColor = 0xff9900;
            
            // Remove tooltip
            if (cookieIcon.tooltipBg) {
                cookieIcon.tooltipBg.destroy();
                cookieIcon.tooltipText.destroy();
                cookieIcon.tooltipBg = null;
                cookieIcon.tooltipText = null;
            }
        });
    }
    
    createOptionButton(container, x, y, label) {
        const buttonBg = this.add.rectangle(x, y, 120, 40, 0xeeeeee);
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
    
    showCookieEditor(dashboardContainer) {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        
        // Create editor container
        const editorContainer = this.add.container(centerX, centerY);
        
        // Cookie editor background
        const editorBg = this.add.rectangle(0, 0, 400, 250, 0x333333, 0.95);
        editorBg.setStrokeStyle(2, 0xff9900);
        
        // Editor header
        const editorHeader = this.add.text(0, -100, 'COOKIE EDITOR', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '20px',
            fontStyle: 'bold',
            color: '#ff9900',
            align: 'center'
        });
        editorHeader.setOrigin(0.5);
        
        // Current cookie value
        const cookieJson = JSON.stringify(this.cookieData, null, 2);
        
        // Cookie value box
        const cookieBox = this.add.rectangle(0, 0, 350, 100, 0x222222);
        cookieBox.setStrokeStyle(1, 0x555555);
        
        // Display cookie JSON
        const cookieText = this.add.text(0, 0, cookieJson, {
            fontFamily: 'Courier New, monospace',
            fontSize: '16px',
            color: '#ffaa33',
            align: 'center'
        });
        cookieText.setOrigin(0.5);
        
        // Make cookie value editable
        cookieBox.setInteractive({ useHandCursor: true });
        
        // Edit button
        const editButton = this.add.rectangle(-75, 70, 120, 30, 0xff9900);
        editButton.setInteractive({ useHandCursor: true });
        
        const editText = this.add.text(-75, 70, 'EDIT', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            color: '#ffffff',
            align: 'center'
        });
        editText.setOrigin(0.5);
        
        // Close button
        const closeButton = this.add.rectangle(75, 70, 120, 30, 0x555555);
        closeButton.setInteractive({ useHandCursor: true });
        
        const closeText = this.add.text(75, 70, 'CLOSE', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            color: '#ffffff',
            align: 'center'
        });
        closeText.setOrigin(0.5);
        
        // Add components to container
        editorContainer.add(editorBg);
        editorContainer.add(editorHeader);
        editorContainer.add(cookieBox);
        editorContainer.add(cookieText);
        editorContainer.add(editButton);
        editorContainer.add(editText);
        editorContainer.add(closeButton);
        editorContainer.add(closeText);
        
        // Animation for editor appearance
        editorContainer.setAlpha(0);
        editorContainer.setScale(0.8);
        
        this.tweens.add({
            targets: editorContainer,
            alpha: 1,
            scale: 1,
            duration: 300,
            ease: 'Power2'
        });
        
        // Edit button action
        editButton.on('pointerdown', () => {
            this.openCookieEditMode(editorContainer, dashboardContainer);
        });
        
        // Close button action
        closeButton.on('pointerdown', () => {
            this.tweens.add({
                targets: editorContainer,
                alpha: 0,
                scale: 0.8,
                duration: 300,
                ease: 'Power2',
                onComplete: () => {
                    editorContainer.destroy();
                }
            });
        });
        
        // Hover effects
        editButton.on('pointerover', () => {
            editButton.fillColor = 0xffaa33;
        });
        
        editButton.on('pointerout', () => {
            editButton.fillColor = 0xff9900;
        });
        
        closeButton.on('pointerover', () => {
            closeButton.fillColor = 0x777777;
        });
        
        closeButton.on('pointerout', () => {
            closeButton.fillColor = 0x555555;
        });
    }
    
    // This is the updated openCookieEditMode method for ChallengeA1Level4.js
// Replace the existing method with this improved version

openCookieEditMode(editorContainer, dashboardContainer) {
    // Clear any previous edit elements
    editorContainer.list.forEach(item => {
        if (item.type === 'Text' && (
            item.text.includes('arrow keys') ||
            item.text.includes('Move cursor') ||
            item.text === 'SAVE'
        )) {
            item.destroy();
        }
    });
    
    // Create a cleaner cookie text display
    const cookieTextArea = this.add.rectangle(0, 0, 350, 120, 0x222222);
    cookieTextArea.setStrokeStyle(1, 0xff9900);
    editorContainer.add(cookieTextArea);
    
    // Format cookie data for display
    const formattedCookie = {
        user: this.cookieData.user,
        role: this.cookieData.role
    };
    
    // Create text lines manually for better formatting and readability
    const textLines = [
        '{',
        '  "user": "' + formattedCookie.user + '",',
        '  "role": "' + formattedCookie.role + '"',
        '}'
    ];
    
    // Create text elements for each line
    const textElements = [];
    const lineHeight = 24; // Increased for better spacing
    const startY = -40; // Adjusted position
    
    for (let i = 0; i < textLines.length; i++) {
        const yPos = startY + (i * lineHeight);
        
        // Highlight the role line
        const color = textLines[i].includes('"role"') ? '#ffff00' : '#ffaa33';
        
        const lineText = this.add.text(0, yPos, textLines[i], {
            fontFamily: 'Courier New, monospace',
            fontSize: '16px',
            color: color,
            align: 'center'
        });
        lineText.setOrigin(0.5);
        
        textElements.push(lineText);
        editorContainer.add(lineText);
    }
    
    // Simplified instructions
    const instructions = this.add.text(0, -80, 'Change "user" to "admin"', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        color: '#ffffff',
        align: 'center'
    });
    instructions.setOrigin(0.5);
    editorContainer.add(instructions);
    
    // Quick change button - make it more prominent
    const quickChangeButton = this.add.rectangle(0, 70, 250, 35, 0xff9900);
    quickChangeButton.setStrokeStyle(2, 0xffcc00);
    quickChangeButton.setInteractive({ useHandCursor: true });
    
    const quickChangeText = this.add.text(0, 70, 'Change "user" to "admin"', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '16px',
        fontStyle: 'bold',
        color: '#ffffff',
        align: 'center'
    });
    quickChangeText.setOrigin(0.5);
    
    editorContainer.add(quickChangeButton);
    editorContainer.add(quickChangeText);
    
    // Add a Close button that will apply changes
    const closeButton = this.add.rectangle(0, 120, 150, 30, 0x555555);
    closeButton.setInteractive({ useHandCursor: true });
    
    const closeText = this.add.text(0, 120, 'Close & Apply', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        color: '#ffffff',
        align: 'center'
    });
    closeText.setOrigin(0.5);
    
    editorContainer.add(closeButton);
    editorContainer.add(closeText);
    
    // Modify any existing buttons
    editorContainer.list.forEach(item => {
        if (item.type === 'Text' && item.text === 'EDIT') {
            item.destroy();
        }
        if (item.type === 'Rectangle' && item.width === 120 && item.height === 30 && item.fillColor === 0xff9900) {
            item.destroy();
        }
    });
    
    // Quick change functionality - simplified
    quickChangeButton.on('pointerdown', () => {
        // Update the text display immediately
        textElements.forEach(element => {
            if (element.text.includes('"role"')) {
                element.setText(element.text.replace('"user"', '"admin"'));
                element.setColor('#00ff00'); // Green to show success
                
                // Visual feedback
                this.tweens.add({
                    targets: element,
                    alpha: 0.5,
                    duration: 100,
                    yoyo: true,
                    repeat: 2
                });
                
                // Update cookie data
                this.cookieData.role = "admin";
            }
        });
    });
    
    // Close button with guaranteed transition
    closeButton.on('pointerdown', () => {
        // Always transition to admin dashboard if role is admin
        if (this.cookieData.role === "admin") {
            this.transitionToAdminDashboard(editorContainer, dashboardContainer);
        } else {
            // Just close the editor if role wasn't changed
            this.tweens.add({
                targets: editorContainer,
                alpha: 0,
                scale: 0.8,
                duration: 300,
                ease: 'Power2',
                onComplete: () => {
                    editorContainer.destroy();
                }
            });
        }
    });
    
    // Hover effects
    quickChangeButton.on('pointerover', () => {
        quickChangeButton.fillColor = 0xffaa33;
    });
    
    quickChangeButton.on('pointerout', () => {
        quickChangeButton.fillColor = 0xff9900;
    });
    
    closeButton.on('pointerover', () => {
        closeButton.fillColor = 0x777777;
    });
    
    closeButton.on('pointerout', () => {
        closeButton.fillColor = 0x555555;
    });
}
transitionToAdminDashboard(editorContainer, dashboardContainer) {
    // First close the editor
    this.tweens.add({
        targets: editorContainer,
        alpha: 0,
        scale: 0.8,
        duration: 300,
        ease: 'Power2',
        onComplete: () => {
            editorContainer.destroy();
            
            // Flash effect for page reload
            this.cameras.main.flash(300, 255, 255, 255);
            
            // Transition to admin dashboard
            this.tweens.add({
                targets: dashboardContainer,
                alpha: 0,
                duration: 500,
                ease: 'Power2',
                onComplete: () => {
                    dashboardContainer.destroy();
                    
                    // Explicitly call showAdminDashboard
                    this.showAdminDashboard();
                }
            });
        }
    });
}

// Helper method to measure text width - add this to the ChallengeA1Level4 class
getTextWidth(text, fontSize) {
    // Create a temporary text object to measure the width
    const tempText = this.add.text(0, 0, text, {
        fontFamily: 'Courier New, monospace',
        fontSize: `${fontSize}px`
    });
    
    // Get the width
    const width = tempText.width;
    
    // Remove the temporary text
    tempText.destroy();
    
    // Return the width
    return width;
}
    
saveCookieChanges(cookieText, editorContainer, dashboardContainer) {
    try {
        // Parse the cookie content or use the existing updated cookieData
        let newCookieData;
        
        try {
            newCookieData = JSON.parse(cookieText);
        } catch (e) {
            // If parsing fails, use the current data (which may have been updated via button)
            newCookieData = this.cookieData;
        }
        
        // Update the cookie data
        this.cookieData = newCookieData;
        
        // Close the editor
        this.tweens.add({
            targets: editorContainer,
            alpha: 0,
            scale: 0.8,
            duration: 300,
            ease: 'Power2',
            onComplete: () => {
                editorContainer.destroy();
                
                // Check if the user set role to admin
                if (this.cookieData.role && this.cookieData.role.toLowerCase() === 'admin') {
                    // Show page reloading effect
                    this.cameras.main.flash(300, 255, 255, 255);
                    
                    this.time.delayedCall(400, () => {
                        // Make sure we are actually transitioning to admin dashboard
                        this.tweens.add({
                            targets: dashboardContainer,
                            alpha: 0,
                            duration: 300,
                            ease: 'Power2',
                            onComplete: () => {
                                dashboardContainer.destroy();
                                // Force transition to admin dashboard
                                this.showAdminDashboard();
                            }
                        });
                    });
                }
            }
        });
    } catch (e) {
        console.error("Error with cookie:", e);
        
        // Show error message
        const errorText = this.add.text(0, 120, 'Error with cookie format. Try again.', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            color: '#ff0000',
            align: 'center'
        });
        errorText.setOrigin(0.5);
        editorContainer.add(errorText);
        
        // Remove error message after 2 seconds
        this.time.delayedCall(2000, () => {
            errorText.destroy();
        });
    }
}
    
    showAdminDashboard() {
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
        
        const urlText = this.add.text(-220, -180, 'https://game.com/dashboard', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            color: '#333333',
            align: 'left'
        });
        urlText.setOrigin(0, 0.5);
        
        // Cookie icon in the corner
        const cookieIcon = this.add.circle(250, -170, 15, 0xff9900);
        cookieIcon.setInteractive({ useHandCursor: true });
        
        // Add cookie image/text
        const cookieText = this.add.text(250, -170, 'C', {
            fontFamily: 'Arial Black, Impact, sans-serif',
            fontSize: '16px',
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'center'
        });
        cookieText.setOrigin(0.5);
        
        // Admin dashboard header - with an orange color to indicate admin area
        const dashboardHeader = this.add.text(0, -130, 'Admin Dashboard', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '24px',
            fontStyle: 'bold',
            color: '#ff9900', // Orange for admin
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
            color: '#ff9900', // Orange for admin
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
        adminContainer.add(cookieIcon);
        adminContainer.add(cookieText);
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
        
        // Cookie icon interaction - add new cookie data display
        cookieIcon.on('pointerdown', () => {
            // Create a simple display of the current admin cookie
            const cookieDisplay = this.add.container(centerX, centerY);
            
            const displayBg = this.add.rectangle(0, 0, 300, 100, 0x333333, 0.9);
            displayBg.setStrokeStyle(1, 0xff9900);
            
            const cookieHeader = this.add.text(0, -30, 'Current Cookie:', {
                fontFamily: 'Arial, sans-serif',
                fontSize: '16px',
                color: '#ffffff',
                align: 'center'
            });
            cookieHeader.setOrigin(0.5);
            
            const cookieValue = this.add.text(0, 0, JSON.stringify(this.cookieData), {
                fontFamily: 'Courier New, monospace',
                fontSize: '14px',
                color: '#ff9900',
                align: 'center'
            });
            cookieValue.setOrigin(0.5);
            
            const closeButton = this.add.text(0, 30, 'Close', {
                fontFamily: 'Arial, sans-serif',
                fontSize: '14px',
                color: '#ffffff',
                align: 'center'
            });
            closeButton.setOrigin(0.5);
            closeButton.setInteractive({ useHandCursor: true });
            
            // Add components to display
            cookieDisplay.add(displayBg);
            cookieDisplay.add(cookieHeader);
            cookieDisplay.add(cookieValue);
            cookieDisplay.add(closeButton);
            
            // Add to scene
            this.add.existing(cookieDisplay);
            
            // Close button action
            closeButton.on('pointerdown', () => {
                cookieDisplay.destroy();
            });
        });
    }
    
    createAdminButton(container, x, y, label) {
        const buttonBg = this.add.rectangle(x, y, 200, 40, 0xfff3e0);
        buttonBg.setStrokeStyle(1, 0xffe0b2);
        buttonBg.setInteractive({ useHandCursor: true });
        
        const buttonText = this.add.text(x, y, label, {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: '#e65100',
            align: 'center'
        });
        buttonText.setOrigin(0.5);
        
        container.add(buttonBg);
        container.add(buttonText);
        
        // Hover effects
        buttonBg.on('pointerover', () => {
            buttonBg.fillColor = 0xffe0b2;
            buttonText.setColor('#cc4700');
        });
        
        buttonBg.on('pointerout', () => {
            buttonBg.fillColor = 0xfff3e0;
            buttonText.setColor('#e65100');
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
        messageBg.setStrokeStyle(2, 0xff9900);
        
        // Success message
        const messageTitle = this.add.text(0, -60, 'Unauthorized Access!', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '24px',
            fontStyle: 'bold',
            color: '#ff9900',
            align: 'center'
        });
        messageTitle.setOrigin(0.5);
        
        const messageText = this.add.text(0, 0, 'You gained admin privileges by modifying a cookie!', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: 400 }
        });
        messageText.setOrigin(0.5);
        
        // Continue button
        const continueButton = this.add.rectangle(0, 60, 150, 40, 0xff9900);
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
            continueButton.fillColor = 0xffaa33;
        });
        
        continueButton.on('pointerout', () => {
            continueButton.fillColor = 0xff9900;
        });
    }
    
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
        const nextButton = this.add.rectangle(0, 150, 200, 40, 0xff9900);
        nextButton.setInteractive({ useHandCursor: true });
        
        const nextText = this.add.text(0, 150, 'NEXT CHALLENGE', {
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
        
        // Next challenge button action
        nextButton.on('pointerdown', () => {
            this.cameras.main.fade(800, 0, 0, 0);
            this.time.delayedCall(800, () => {
                this.scene.start('A2ChallengeScreen'); // Transition to A2 Challenges
            });
        });
        
        // Hover effects
        nextButton.on('pointerover', () => {
            nextButton.fillColor = 0xffaa33;
        });
        
        nextButton.on('pointerout', () => {
            nextButton.fillColor = 0xff9900;
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

    update() {
        // Game logic that runs on every frame
    }
}