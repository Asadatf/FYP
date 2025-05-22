
    
    // Simple black background
    class ChallengeA2Level2 extends Phaser.Scene {
constructor() {
    super('ChallengeA2Level2');
    this.currentStep = 0;
    this.passwordDatabase = [
        { username: 'admin', passwordHash: 'e10adc3949ba59abbe56e057f20f883e' },
        { username: 'user1', passwordHash: '5f4dcc3b5aa765d61d8327deb882cf99' },
        { username: 'securityOfficer', passwordHash: '098f6bcd4621d373cade4e832627b4f6' }
    ];
    this.commonPasswords = [
        { password: '123456', hash: 'e10adc3949ba59abbe56e057f20f883e' },
        { password: 'password', hash: '5f4dcc3b5aa765d61d8327deb882cf99' },
        { password: 'test', hash: '098f6bcd4621d373cade4e832627b4f6' },
        { password: 'qwerty', hash: 'd8578edf8458ce06fbc5bb76a58c5ca4' },
        { password: 'admin123', hash: '0192023a7bbd73250516f069df18b500' },
        { password: 'welcome', hash: '40be4e59b9a2a2b5dffb918c0e86b3d7' }
    ];
    this.targetAccount = this.passwordDatabase[0]; // Targeting admin account
    this.selectedPasswordHash = '';
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
    const message = this.add.text(centerX, centerY, 'CHALLENGE A2 LEVEL 2', {
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
    const subtitle = this.add.text(centerX, centerY + 50, 'Hash Cracking Challenge', {
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
    const popupBg = this.add.rectangle(0, 0, 600, 350, 0x000000, 0.9);
    popupBg.setStrokeStyle(2, 0x33cc99);
    
    // Popup header
    const popupHeader = this.add.text(0, -140, 'HASH CRACKING CHALLENGE', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '24px',
        fontStyle: 'bold',
        color: '#33cc99',
        align: 'center'
    });
    popupHeader.setOrigin(0.5);
    
    // Popup content
    const content = [
        "Passwords should never be stored in plaintext. Instead, they are",
        "typically 'hashed' using a one-way function that converts the",
        "password into a unique string of characters.",
        "",
        "However, weak hashing without proper salting can be vulnerable",
        "to various attacks, including rainbow tables and dictionary attacks.",
        "",
        "Your goal: Identify which common password matches the hash in the",
        "database to gain unauthorized access to the system."
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
    const buttonBg = this.add.rectangle(0, 130, 150, 40, 0x33cc99);
    buttonBg.setInteractive({ useHandCursor: true });
    
    const buttonText = this.add.text(0, 130, 'START', {
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
                this.showHashCrackingSystem();
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

showHashCrackingSystem() {
    // SIMPLIFIED APPROACH but maintaining the container pattern from Level 1
    // Clear everything and start fresh
    this.children.removeAll(true);
    
    // Simple black background
    this.add.rectangle(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2,
        this.cameras.main.width,
        this.cameras.main.height,
        0x000000
    );
    
    // Create a global container for the game interface
    const mainContainer = this.add.container(this.cameras.main.width / 2, this.cameras.main.height / 2);
    
    // Green border around the screen
    const border = this.add.graphics();
    border.lineStyle(3, 0x33ff99, 1);
    border.strokeRect(-this.cameras.main.width/2 + 10, -this.cameras.main.height/2 + 10, 
                      this.cameras.main.width - 20, this.cameras.main.height - 20);
    mainContainer.add(border);
    
    // Title at the top
    const headerText = this.add.text(
        0, 
        -this.cameras.main.height/2 + 40, 
        'PASSWORD DATABASE ANALYSIS',
        {
            fontFamily: 'Arial Black, Impact, sans-serif',
            fontSize: '32px',
            fontStyle: 'bold',
            color: '#33ff99',
            align: 'center'
        }
    );
    headerText.setOrigin(0.5);
    mainContainer.add(headerText);
    
    // ==== LEFT SIDE - DATABASE ====
    const leftX = -this.cameras.main.width * 0.25;
    const startY = -this.cameras.main.height * 0.25;
    
    // Database header
    const dbHeader = this.add.text(
        leftX, 
        startY - 30, 
        'USER DATABASE',
        {
            fontFamily: 'Arial Black, sans-serif',
            fontSize: '24px',
            fontStyle: 'bold',
            color: '#33ff99',
            align: 'center'
        }
    );
    dbHeader.setOrigin(0.5);
    mainContainer.add(dbHeader);
    
    // Background for user database table
    const dbTableBg = this.add.rectangle(
        leftX,
        startY + 100,
        550, // Much wider to fit hash values
        200,
        0x002211,
        1
    );
    dbTableBg.setStrokeStyle(2, 0x33ff99);
    mainContainer.add(dbTableBg);
    
    // Database column headers
    const usernameHeader = this.add.text(
        leftX - 200, 
        startY + 40, 
        'USERNAME',
        {
            fontFamily: 'Courier New, monospace',
            fontSize: '18px',
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'left'
        }
    );
    mainContainer.add(usernameHeader);
    
    const hashHeader = this.add.text(
        leftX - 40, 
        startY + 40, 
        'PASSWORD HASH (MD5)',
        {
            fontFamily: 'Courier New, monospace',
            fontSize: '18px',
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'left'
        }
    );
    mainContainer.add(hashHeader);
    
    // Separator line
    const separator = this.add.graphics();
    separator.lineStyle(2, 0x33ff99, 1);
    separator.lineBetween(leftX - 240, startY + 60, leftX + 240, startY + 60);
    mainContainer.add(separator);
    
    // Database entries
    let entryY = startY + 90;
    for (const entry of this.passwordDatabase) {
        // Username
        const usernameText = this.add.text(
            leftX - 200, 
            entryY, 
            entry.username,
            {
                fontFamily: 'Courier New, monospace',
                fontSize: '16px',
                color: '#ffffff',
                align: 'left'
            }
        );
        mainContainer.add(usernameText);
        
        // Password hash
        const hashText = this.add.text(
            leftX - 40, 
            entryY, 
            entry.passwordHash,
            {
                fontFamily: 'Courier New, monospace',
                fontSize: '16px',
                color: entry === this.targetAccount ? '#00ff66' : '#ffffff',
                align: 'left'
            }
        );
        mainContainer.add(hashText);
        
        entryY += 30;
    }
    
    // Target instruction - positioned below the table
    const targetText = this.add.text(
        leftX, 
        startY + 200, 
        'Target: Crack the admin password hash',
        {
            fontFamily: 'Arial, sans-serif',
            fontSize: '18px',
            fontStyle: 'italic',
            color: '#ffff00',
            align: 'center'
        }
    );
    targetText.setOrigin(0.5);
    mainContainer.add(targetText);
    
    // ==== RIGHT SIDE - COMMON PASSWORDS ====
    const rightX = this.cameras.main.width * 0.25;
    
    // Common passwords header
    const pwHeader = this.add.text(
        rightX, 
        startY - 30, 
        'COMMON PASSWORDS',
        {
            fontFamily: 'Arial Black, sans-serif',
            fontSize: '24px',
            fontStyle: 'bold',
            color: '#33ff99',
            align: 'center'
        }
    );
    pwHeader.setOrigin(0.5);
    mainContainer.add(pwHeader);
    
    // Background for common passwords table
    const pwTableBg = this.add.rectangle(
        rightX,
        startY + 150,
        550, // Much wider to fit hash values
        250,
        0x002211,
        1
    );
    pwTableBg.setStrokeStyle(2, 0x33ff99);
    mainContainer.add(pwTableBg);
    
    // Common passwords column headers
    const passwordHeader = this.add.text(
        rightX - 200, 
        startY + 40, 
        'PASSWORD',
        {
            fontFamily: 'Courier New, monospace',
            fontSize: '18px',
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'left'
        }
    );
    mainContainer.add(passwordHeader);
    
    const commonHashHeader = this.add.text(
        rightX - 40, 
        startY + 40, 
        'MD5 HASH',
        {
            fontFamily: 'Courier New, monospace',
            fontSize: '18px',
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'left'
        }
    );
    mainContainer.add(commonHashHeader);
    
    // Separator line
    const pwSeparator = this.add.graphics();
    pwSeparator.lineStyle(2, 0x33ff99, 1);
    pwSeparator.lineBetween(rightX - 240, startY + 60, rightX + 240, startY + 60);
    mainContainer.add(pwSeparator);
    
    // Create a container for result messages
    const resultContainer = this.add.container(rightX, startY + 230);
    mainContainer.add(resultContainer);
    
    // Password dictionary entries and buttons
    const passwordButtons = [];
    let pwEntryY = startY + 90;
    for (const entry of this.commonPasswords) {
        // Background for the row (slightly visible)
        const rowBg = this.add.rectangle(
            rightX, 
            pwEntryY, 
            500, // Wider row
            24, 
            0x33cc99, 
            0.1
        );
        mainContainer.add(rowBg);
        
        // Password text
        const passwordText = this.add.text(
            rightX - 200, 
            pwEntryY, 
            entry.password,
            {
                fontFamily: 'Courier New, monospace',
                fontSize: '16px',
                color: '#ffffff',
                align: 'left'
            }
        );
        mainContainer.add(passwordText);
        
        // Hash text
        const hashText = this.add.text(
            rightX - 40, 
            pwEntryY, 
            entry.hash,
            {
                fontFamily: 'Courier New, monospace',
                fontSize: '16px',
                color: '#ffffff',
                align: 'left'
            }
        );
        mainContainer.add(hashText);
        
        // Make the row interactive
        rowBg.setInteractive({ useHandCursor: true });
        passwordButtons.push(rowBg);
        
        // Hover effect
        rowBg.on('pointerover', () => {
            rowBg.fillAlpha = 0.5;
            passwordText.setColor('#00ff66');
            hashText.setColor('#00ff66');
        });
        
        rowBg.on('pointerout', () => {
            rowBg.fillAlpha = 0.1;
            passwordText.setColor('#ffffff');
            hashText.setColor('#ffffff');
        });
        
        // Click event - MORE LIKE LEVEL 1
        rowBg.on('pointerdown', () => {
            this.selectedPasswordHash = entry.hash;
            
            // Reset all selections
            passwordButtons.forEach(btn => {
                btn.fillAlpha = 0.1;
            });
            
            // Clear all text colors
            mainContainer.list.forEach(item => {
                if (item.type === 'Text' && item.y >= startY + 90 && item.y <= startY + 90 + (this.commonPasswords.length * 30)) {
                    item.setColor('#ffffff');
                }
            });
            
            // Highlight this selection
            rowBg.fillAlpha = 0.6;
            passwordText.setColor('#00ff66');
            hashText.setColor('#00ff66');
            
            // Clear any existing result messages
            resultContainer.removeAll();
            
            // Check if match found
            if (entry.hash === this.targetAccount.passwordHash) {
                // Create success message
                const successText = this.add.text(
                    0,
                    0,
                    'MATCH FOUND! This is the admin password.',
                    {
                        fontFamily: 'Arial Black, sans-serif',
                        fontSize: '18px',
                        fontStyle: 'bold',
                        color: '#00ff66',
                        align: 'center'
                    }
                );
                successText.setOrigin(0.5);
                resultContainer.add(successText);
                
                // Enable access button
                accessButton.fillColor = 0x00ff66;
                accessButton.fillAlpha = 1;
                accessButton.setInteractive({ useHandCursor: true });
            } else {
                // Create failure message
                const failText = this.add.text(
                    0,
                    0,
                    'No match with admin hash. Try another password.',
                    {
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '18px',
                        fontStyle: 'bold',
                        color: '#ff6666',
                        align: 'center'
                    }
                );
                failText.setOrigin(0.5);
                resultContainer.add(failText);
                
                // Disable access button
                accessButton.fillColor = 0x33cc99;
                accessButton.fillAlpha = 0.5;
                accessButton.disableInteractive();
            }
        });
        
        pwEntryY += 30;
    }
    
    // Access button - positioned well below the password table
    const accessButton = this.add.rectangle(
        rightX,
        startY + 310,
        200,
        50,
        0x33cc99,
        1
    );
    mainContainer.add(accessButton);
    
    const accessText = this.add.text(
        rightX,
        startY + 310,
        'ACCESS SYSTEM',
        {
            fontFamily: 'Arial Black, sans-serif',
            fontSize: '18px',
            color: '#ffffff',
            align: 'center'
        }
    );
    accessText.setOrigin(0.5);
    mainContainer.add(accessText);
    
    // Access button action - SIMILAR TO LEVEL 1
    accessButton.on('pointerdown', () => {
        // Directly call showSuccessScreen without fading
        this.showSuccessScreen();
    });
}

showSuccessScreen() {
    // FOLLOWING LEVEL 1'S APPROACH MORE CLOSELY WITH EXPANDED LAYOUT
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    
    // Create a success container like in Level 1
    const successContainer = this.add.container(centerX, centerY);
    
    // Success background - LARGER to fit all content comfortably
    const successBg = this.add.rectangle(0, 0, 700, 500, 0x001100, 0.95);
    successBg.setStrokeStyle(3, 0x33cc99);
    successContainer.add(successBg);
    
    // Success header - positioned higher in the larger box
    const successHeader = this.add.text(0, -200, 'CHALLENGE COMPLETE!', {
        fontFamily: 'Arial Black, Impact, sans-serif',
        fontSize: '36px',
        fontStyle: 'bold',
        color: '#33cc99',
        align: 'center'
    });
    successHeader.setOrigin(0.5);
    successContainer.add(successHeader);
    
    // Success message - more space below the header
    const successTitle = this.add.text(0, -140, 'You successfully cracked the password hash!', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '24px',
        color: '#ffffff',
        align: 'center'
    });
    successTitle.setOrigin(0.5);
    successContainer.add(successTitle);
    
    // Lessons learned - more space below success message
    const lessonsTitle = this.add.text(0, -80, 'What you learned:', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '22px',
        fontStyle: 'bold',
        color: '#33cc99',
        align: 'center'
    });
    lessonsTitle.setOrigin(0.5);
    successContainer.add(lessonsTitle);
    
    // Lessons content with more line spacing
    const lessonsContent = [
        "1. Weak hashing allows attackers to discover passwords using",
        "   lookup tables and rainbow tables.",
        "",
        "2. MD5 is considered cryptographically broken and should not",
        "   be used for password storage.",
        "",
        "3. Modern password storage should use strong algorithms like",
        "   bcrypt, Argon2, or PBKDF2 with unique salts per password."
    ].join('\n');
    
    const lessons = this.add.text(0, 40, lessonsContent, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '18px', // Larger font
        color: '#ffffff',
        align: 'center',
        lineSpacing: 10 // More line spacing
    });
    lessons.setOrigin(0.5);
    successContainer.add(lessons);
    
    // Next Level button - positioned lower and to the right
    const nextButton = this.add.rectangle(150, 180, 200, 50, 0x33cc99);
    nextButton.setInteractive({ useHandCursor: true });
    successContainer.add(nextButton);
    
    const nextText = this.add.text(150, 180, 'NEXT LEVEL', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '20px', // Larger font
        color: '#ffffff',
        align: 'center'
    });
    nextText.setOrigin(0.5);
    successContainer.add(nextText);
    
    // Back to level select button - positioned lower and to the left
    const backButton = this.add.rectangle(-150, 180, 200, 50, 0x116644);
    backButton.setInteractive({ useHandCursor: true });
    successContainer.add(backButton);
    
    const backText = this.add.text(-150, 180, 'LEVEL SELECT', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '20px', // Larger font
        color: '#ffffff',
        align: 'center'
    });
    backText.setOrigin(0.5);
    successContainer.add(backText);
    
    // Animation for success screen appearance
    successContainer.setAlpha(0);
    
    this.tweens.add({
        targets: successContainer,
        alpha: 1,
        duration: 800,
        ease: 'Power2'
    });
    
    // Next Level button action
    nextButton.on('pointerdown', () => {
        this.cameras.main.fade(800, 0, 0, 0);
        this.time.delayedCall(800, () => {
            this.scene.start('ChallengeA2Level3');
        });
    });
    
    // Back button action
    backButton.on('pointerdown', () => {
        this.cameras.main.fade(800, 0, 0, 0);
        this.time.delayedCall(800, () => {
            this.scene.start('A2LevelSelect');
        });
    });
    
    // Hover effects
    nextButton.on('pointerover', () => {
        nextButton.fillColor = 0x66eebb;
    });
    
    nextButton.on('pointerout', () => {
        nextButton.fillColor = 0x33cc99;
    });
    
    backButton.on('pointerover', () => {
        backButton.fillColor = 0x33aa77;
    });
    
    backButton.on('pointerout', () => {
        backButton.fillColor = 0x116644;
    });
    
    // Victory particles
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