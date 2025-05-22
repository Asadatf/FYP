class ChallengeA3Level1 extends Phaser.Scene {
    constructor() {
        super('ChallengeA3Level1');
        this.currentStep = 0;
        
        // SQL Query that will be manipulated by the player
        this.baseQuery = "SELECT * FROM users WHERE username='";
        this.currentQuery = this.baseQuery;
        this.attackSuccessful = false;
        
        // Database mock data
        this.users = [
            { id: 1, username: 'admin', password: 'SuperSecretAdminPass123!', role: 'admin' },
            { id: 2, username: 'john', password: 'john123', role: 'user' },
            { id: 3, username: 'alice', password: 'alice456', role: 'user' },
            { id: 4, username: 'bob', password: 'bob789', role: 'user' }
        ];
    }

    preload() {
        // Load any specific assets for this challenge
        this.load.image('terminal_bg', 'assets/button.png');
    }

    create() {
        // Setup scaling manager if available
        if (typeof ScalingManager !== 'undefined') {
            this.scalingManager = new ScalingManager(this);
        }
        
        // Set up the challenge gameplay screen
        this.createBackground();
        this.createStartMessage();
    }
    
    // Helper function to scale values if ScalingManager is available
    scale(value) {
        if (this.scalingManager) {
            return this.scalingManager.scale(value);
        }
        return value;
    }
    
    createBackground() {
        // Create a dark background with orange tint for A3 challenge (SQL Injection theme)
        // Fill entire screen with a gradient background
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Base background
        const bg = this.add.rectangle(0, 0, width, height, 0x221100);
        bg.setOrigin(0, 0);
        
        // Add gradient overlay
        const gradientGraphics = this.add.graphics();
        gradientGraphics.fillGradientStyle(0x331800, 0x331800, 0x110900, 0x110900, 1);
        gradientGraphics.fillRect(0, 0, width, height);
        
        // Create a more pronounced grid pattern
        const gridSize = Math.max(30, Math.min(width, height) / 20); // Responsive grid size
        const graphics = this.add.graphics();
        graphics.lineStyle(1, 0x553300, 0.15);
        
        // Draw vertical lines
        for(let x = 0; x < width; x += gridSize) {
            graphics.moveTo(x, 0);
            graphics.lineTo(x, height);
        }
        
        // Draw horizontal lines
        for(let y = 0; y < height; y += gridSize) {
            graphics.moveTo(0, y);
            graphics.lineTo(width, y);
        }
        
        graphics.strokePath();
        
        // Add some decorative circuit-like patterns in the background
        const circuitGraphics = this.add.graphics();
        circuitGraphics.lineStyle(2, 0xff9900, 0.1);
        
        // Draw some random circuit-like lines
        this.drawCircuitPatterns(circuitGraphics, width, height);
        
        // Add vignette effect
        const vignette = this.add.graphics();
        vignette.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0.7, 0.7, 0, 0);
        vignette.fillRect(0, 0, width, height);
    }
    
    drawCircuitPatterns(graphics, width, height) {
        const drawCircuitLine = (x1, y1, x2, y2) => {
            graphics.moveTo(x1, y1);
            
            // Decide if we want to draw a direct line or a circuit-like pattern
            if (Math.random() > 0.5) {
                // Draw a direct line
                graphics.lineTo(x2, y2);
            } else {
                // Draw a circuit-like pattern with right angles
                const midX = x1 + (x2 - x1) * (0.3 + Math.random() * 0.4);
                graphics.lineTo(midX, y1);
                graphics.lineTo(midX, y2);
                graphics.lineTo(x2, y2);
                
                // Small circle at junction
                if (Math.random() > 0.5) {
                    graphics.strokeCircle(midX, y2, 2 + Math.random() * 3);
                }
            }
            
            // Small circle at endpoints sometimes
            if (Math.random() > 0.7) {
                graphics.strokeCircle(x2, y2, 2 + Math.random() * 3);
            }
        };
        
        // Draw several circuit patterns
        for (let i = 0; i < 25; i++) {
            const x1 = Math.random() * width;
            const y1 = Math.random() * height;
            const length = 100 + Math.random() * 200;
            const angle = Math.random() * Math.PI * 2;
            const x2 = x1 + Math.cos(angle) * length;
            const y2 = y1 + Math.sin(angle) * length;
            
            drawCircuitLine(x1, y1, x2, y2);
        }
    }
    
    createStartMessage() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 4;
        
        // Create a decorative container for the title
        const titleContainer = this.add.container(centerX, centerY);
        
        // Add a glowing effect behind the title
        const glow = this.add.graphics();
        glow.fillStyle(0xff6600, 0.15);
        glow.fillCircle(0, 0, this.scalingManager.scale(120));
        titleContainer.add(glow);
        
        // Create the message with animation
        const message = this.add.text(0, 0, 'CHALLENGE A3: LEVEL 1', {
            fontFamily: 'Courier New, monospace',
            fontSize: this.scalingManager.scale(38) + 'px',
            fontStyle: 'bold',
            color: '#ff9900', // Orange for SQL Injection theme
            align: 'center',
            stroke: '#662200',
            strokeThickness: 2
        });
        message.setOrigin(0.5);
        message.setAlpha(0);
        titleContainer.add(message);
        
        // Decorative elements around the title
        const decorGraphics = this.add.graphics();
        decorGraphics.lineStyle(3, 0xff6600, 0.6);
        decorGraphics.strokeRect(-message.width/2 - 20, -message.height/2 - 10, message.width + 40, message.height + 20);
        decorGraphics.lineStyle(1, 0xff9900, 0.4);
        decorGraphics.strokeRect(-message.width/2 - 30, -message.height/2 - 20, message.width + 60, message.height + 40);
        titleContainer.add(decorGraphics);
        
        // Animate the message appearance with a typewriter effect
        this.tweens.add({
            targets: message,
            alpha: 1,
            duration: 800,
            ease: 'Power2',
            onComplete: () => {
                // Add blinking cursor effect
                const cursor = this.add.text(message.width / 2 + 10, 0, '_', {
                    fontFamily: 'Courier New, monospace',
                    fontSize: this.scalingManager.scale(38) + 'px',
                    color: '#ff9900'
                });
                cursor.setOrigin(0.5);
                titleContainer.add(cursor);
                
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
                                targets: titleContainer,
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
        const subtitleContainer = this.add.container(centerX, centerY + this.scalingManager.scale(60));
        
        // Decorative line above subtitle
        const subtitleDecor = this.add.graphics();
        subtitleDecor.lineStyle(2, 0xff9900, 0.6);
        subtitleDecor.lineBetween(-100, -15, 100, -15);
        subtitleContainer.add(subtitleDecor);
        
        const subtitle = this.add.text(0, 0, 'SQL Injection: Basic Attack', {
            fontFamily: 'Courier New, monospace',
            fontSize: this.scalingManager.scale(24) + 'px',
            color: '#ffaa33', // Lighter orange
            align: 'center'
        });
        subtitle.setOrigin(0.5);
        subtitle.setAlpha(0);
        subtitleContainer.add(subtitle);
        
        this.tweens.add({
            targets: subtitle,
            alpha: 1,
            duration: 800,
            delay: 1200,
            ease: 'Power2',
            onComplete: () => {
                this.time.delayedCall(2000, () => {
                    this.tweens.add({
                        targets: subtitleContainer,
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
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Create fullscreen semi-transparent overlay
        const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7);
        overlay.setOrigin(0, 0);
        
        // Create popup container
        const popupContainer = this.add.container(centerX, centerY);
        
        // Tutorial popup background - larger size to use more screen space
        const popupWidth = Math.min(width * 0.8, 1200);
        const popupHeight = Math.min(height * 0.8, 600);
        
        // Main background with gradient
        const popupBg = this.add.graphics();
        popupBg.fillGradientStyle(0x331800, 0x221100, 0x110900, 0x000000, 1);
        popupBg.fillRect(-popupWidth/2, -popupHeight/2, popupWidth, popupHeight);
        popupBg.lineStyle(3, 0xff9900, 0.8);
        popupBg.strokeRect(-popupWidth/2, -popupHeight/2, popupWidth, popupHeight);
        popupContainer.add(popupBg);
        
        // Add decorative elements
        const decorGraphics = this.add.graphics();
        // Top left corner
        decorGraphics.lineStyle(2, 0xff6600, 0.6);
        decorGraphics.lineBetween(-popupWidth/2, -popupHeight/2 + 30, -popupWidth/2 + 30, -popupHeight/2);
        // Bottom right corner
        decorGraphics.lineBetween(popupWidth/2, popupHeight/2 - 30, popupWidth/2 - 30, popupHeight/2);
        popupContainer.add(decorGraphics);
        
        // Popup header with additional styling
        const headerContainer = this.add.container(0, -popupHeight/2 + 50);
        popupContainer.add(headerContainer);
        
        // Header background
        const headerBg = this.add.graphics();
        headerBg.fillStyle(0x000000, 0.3);
        headerBg.fillRect(-popupWidth/2, -30, popupWidth, 60);
        headerContainer.add(headerBg);
        
        // Header decorative elements
        const headerDecor = this.add.graphics();
        headerDecor.lineStyle(1, 0xff9900, 0.6);
        headerDecor.lineBetween(-popupWidth/2 + 40, 15, popupWidth/2 - 40, 15);
        headerContainer.add(headerDecor);
        
        const popupHeader = this.add.text(0, 0, 'SQL INJECTION ATTACK', {
            fontFamily: 'Arial Black, Impact, sans-serif',
            fontSize: this.scalingManager.scale(32) + 'px',
            fontStyle: 'bold',
            color: '#ff9900',
            align: 'center',
            stroke: '#662200',
            strokeThickness: 1
        });
        popupHeader.setOrigin(0.5);
        headerContainer.add(popupHeader);
        
        // Add an icon/illustration for SQL Injection
        const iconGraphics = this.add.graphics();
        iconGraphics.fillStyle(0xff9900, 0.2);
        iconGraphics.fillCircle(0, -popupHeight/2 + 150, 40);
        iconGraphics.lineStyle(2, 0xff9900, 0.8);
        iconGraphics.strokeCircle(0, -popupHeight/2 + 150, 40);
        
        // Simple database icon
        iconGraphics.lineStyle(2, 0xff9900, 0.8);
        iconGraphics.strokeRect(-25, -popupHeight/2 + 130, 50, 40);
        iconGraphics.lineStyle(1, 0xff9900, 0.8);
        iconGraphics.lineBetween(-25, -popupHeight/2 + 140, 25, -popupHeight/2 + 140);
        iconGraphics.lineBetween(-25, -popupHeight/2 + 150, 25, -popupHeight/2 + 150);
        
        // Add injection arrow
        iconGraphics.lineStyle(3, 0xff0000, 0.8);
        iconGraphics.lineBetween(-60, -popupHeight/2 + 150, -30, -popupHeight/2 + 150);
        iconGraphics.lineBetween(-40, -popupHeight/2 + 140, -30, -popupHeight/2 + 150);
        iconGraphics.lineBetween(-40, -popupHeight/2 + 160, -30, -popupHeight/2 + 150);
        
        popupContainer.add(iconGraphics);
        
        // Popup content - more detailed with better formatting
        const contentBox = this.add.graphics();
        contentBox.fillStyle(0x000000, 0.3);
        contentBox.fillRect(-popupWidth/2 + 40, -60, popupWidth - 80, 180);
        popupContainer.add(contentBox);
        
        const content = [
            "SQL Injection occurs when untrusted user input is incorrectly",
            "incorporated into database queries, allowing attackers to",
            "manipulate the query's logic.",
            "",
            "Your goal: Bypass the login by injecting SQL code that creates",
            "a condition that is always true!"
        ].join('\n');
        
        const popupContent = this.add.text(0, 0, content, {
            fontFamily: 'Arial, sans-serif',
            fontSize: this.scalingManager.scale(20) + 'px',
            color: '#ffffff',
            align: 'center',
            lineSpacing: 10
        });
        popupContent.setOrigin(0.5);
        popupContainer.add(popupContent);
        
        // Technical explanation with code example
        const techBox = this.add.graphics();
        techBox.fillStyle(0x000000, 0.5);
        techBox.fillRect(-popupWidth/2 + 40, 140, popupWidth - 80, 70);
        popupContainer.add(techBox);
        
        const techExample = this.add.text(0, 175, "Example: SELECT * FROM users WHERE username='input' AND password='pass'", {
            fontFamily: 'Courier New, monospace',
            fontSize: this.scalingManager.scale(16) + 'px',
            color: '#00ff66', // Green for SQL code
            align: 'center'
        });
        techExample.setOrigin(0.5);
        popupContainer.add(techExample);
        
        // Continue button - larger and more prominent
        const buttonBg = this.add.graphics();
        buttonBg.fillStyle(0xff9900, 1);
        buttonBg.fillRoundedRect(-100, popupHeight/2 - 80, 200, 60, 10);
        
        // Add gradient to button
        const buttonGradient = this.add.graphics();
        buttonGradient.fillGradientStyle(0xffaa33, 0xffaa33, 0xff8800, 0xff8800, 1);
        buttonGradient.fillRoundedRect(-95, popupHeight/2 - 75, 190, 50, 8);
        
        // Make button interactive
        const buttonHitArea = new Phaser.Geom.Rectangle(-100, popupHeight/2 - 80, 200, 60);
        popupContainer.setInteractive(buttonHitArea, Phaser.Geom.Rectangle.Contains);
        
        const buttonText = this.add.text(0, popupHeight/2 - 50, 'START', {
            fontFamily: 'Arial, sans-serif',
            fontSize: this.scalingManager.scale(24) + 'px',
            fontWeight: 'bold',
            color: '#ffffff',
            align: 'center',
            stroke: '#cc6600',
            strokeThickness: 1
        });
        buttonText.setOrigin(0.5);
        
        popupContainer.add(buttonBg);
        popupContainer.add(buttonGradient);
        popupContainer.add(buttonText);
        
        // Animation for popup appearance
        popupContainer.setAlpha(0);
        popupContainer.setScale(0.8);
        
        this.tweens.add({
            targets: popupContainer,
            alpha: 1,
            scale: 1,
            duration: 400,
            ease: 'Back.easeOut'
        });
        
        // Continue button action
        popupContainer.on('pointerdown', (pointer) => {
            if (buttonHitArea.contains(pointer.x - centerX, pointer.y - centerY)) {
                // Visual feedback on click
                buttonGradient.clear();
                buttonGradient.fillStyle(0xff7700, 1);
                buttonGradient.fillRoundedRect(-95, popupHeight/2 - 75, 190, 50, 8);
                
                this.tweens.add({
                    targets: [popupContainer, overlay],
                    alpha: 0,
                    scale: 0.9,
                    duration: 300,
                    ease: 'Power2',
                    onComplete: () => {
                        popupContainer.destroy();
                        overlay.destroy();
                        this.showSQLInjectionGame();
                    }
                });
            }
        });
        
        // Add hover effect
        popupContainer.on('pointermove', (pointer) => {
            if (buttonHitArea.contains(pointer.x - centerX, pointer.y - centerY)) {
                buttonText.setTint(0xffff00);
                document.body.style.cursor = 'pointer';
            } else {
                buttonText.clearTint();
                document.body.style.cursor = 'default';
            }
        });
        
        popupContainer.on('pointerout', () => {
            buttonText.clearTint();
            document.body.style.cursor = 'default';
        });
    }
    
    showSQLInjectionGame() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Create main game container that uses full screen
        const gameContainer = this.add.container(0, 0);
        
        // Create decorative elements for the screen edges
        const edgeDecor = this.add.graphics();
        // Top edge
        edgeDecor.lineStyle(3, 0xff8800, 0.4);
        edgeDecor.lineBetween(0, 10, width, 10);
        // Bottom edge
        edgeDecor.lineBetween(0, height - 10, width, height - 10);
        // Left edge pattern
        for (let y = 50; y < height - 50; y += 100) {
            edgeDecor.lineStyle(2, 0xff8800, 0.3);
            edgeDecor.lineBetween(20, y, 50, y);
        }
        // Right edge pattern
        for (let y = 50; y < height - 50; y += 100) {
            edgeDecor.lineStyle(2, 0xff8800, 0.3);
            edgeDecor.lineBetween(width - 20, y, width - 50, y);
        }
        gameContainer.add(edgeDecor);
        
        // Create login form container - using more screen space
        const loginWidth = Math.min(width * 0.9, 1200);
        const loginHeight = Math.min(height * 0.85, 700);
        const loginContainer = this.add.container(centerX, centerY);
        gameContainer.add(loginContainer);
        
        // Login form background with better styling
        const formBg = this.add.graphics();
        formBg.fillStyle(0x221100, 0.9);
        formBg.fillRect(-loginWidth/2, -loginHeight/2, loginWidth, loginHeight);
        formBg.lineStyle(3, 0xff9900, 0.8);
        formBg.strokeRect(-loginWidth/2, -loginHeight/2, loginWidth, loginHeight);
        loginContainer.add(formBg);
        
        // Add decorative elements to the form
        const formDecor = this.add.graphics();
        // Corner decorations
        formDecor.lineStyle(2, 0xff8800, 0.6);
        formDecor.lineBetween(-loginWidth/2, -loginHeight/2 + 30, -loginWidth/2 + 30, -loginHeight/2);
        formDecor.lineBetween(loginWidth/2, -loginHeight/2 + 30, loginWidth/2 - 30, -loginHeight/2);
        formDecor.lineBetween(-loginWidth/2, loginHeight/2 - 30, -loginWidth/2 + 30, loginHeight/2);
        formDecor.lineBetween(loginWidth/2, loginHeight/2 - 30, loginWidth/2 - 30, loginHeight/2);
        
        // Decorative pattern in the background
        for (let x = -loginWidth/2 + 80; x < loginWidth/2; x += 120) {
            for (let y = -loginHeight/2 + 80; y < loginHeight/2; y += 120) {
                if (Math.random() > 0.7) {
                    formDecor.lineStyle(1, 0xff9900, 0.1);
                    formDecor.strokeCircle(x, y, 10);
                    
                    if (Math.random() > 0.5) {
                        formDecor.lineStyle(1, 0xff9900, 0.05);
                        formDecor.strokeCircle(x, y, 20);
                    }
                }
            }
        }
        loginContainer.add(formDecor);
        
        // Create header section
        const headerBg = this.add.graphics();
        headerBg.fillGradientStyle(0x332200, 0x221100, 0x221100, 0x332200, 1);
        headerBg.fillRect(-loginWidth/2, -loginHeight/2, loginWidth, 80);
        loginContainer.add(headerBg);
        
        // Login form header with icon
        const headerIcon = this.add.graphics();
        headerIcon.fillStyle(0xff9900, 0.2);
        headerIcon.fillCircle(-loginWidth/2 + 50, -loginHeight/2 + 40, 25);
        headerIcon.lineStyle(2, 0xff9900, 0.8);
        headerIcon.strokeCircle(-loginWidth/2 + 50, -loginHeight/2 + 40, 25);
        // Lock icon
        headerIcon.lineStyle(2, 0xff9900, 0.8);
        headerIcon.strokeRect(-loginWidth/2 + 43, -loginHeight/2 + 35, 15, 12);
        headerIcon.fillRect(-loginWidth/2 + 48, -loginHeight/2 + 35, 5, 12);
        loginContainer.add(headerIcon);
        
        const formHeader = this.add.text(-loginWidth/2 + 90, -loginHeight/2 + 40, 'SECURE BANKING LOGIN', {
            fontFamily: 'Arial, sans-serif',
            fontSize: this.scalingManager.scale(32) + 'px',
            fontStyle: 'bold',
            color: '#ff9900',
            align: 'left',
            stroke: '#662200',
            strokeThickness: 1
        });
        formHeader.setOrigin(0, 0.5);
        loginContainer.add(formHeader);
        
        // Hint button - moved to top right
        const hintButton = this.add.graphics();
        hintButton.fillStyle(0x996600, 1);
        hintButton.fillRoundedRect(loginWidth/2 - 110, -loginHeight/2 + 20, 90, 40, 5);
        // Add gradient to button
        hintButton.fillGradientStyle(0xaa7700, 0xaa7700, 0x884400, 0x884400, 1);
        hintButton.fillRoundedRect(loginWidth/2 - 105, -loginHeight/2 + 25, 80, 30, 3);
        
        const hintText = this.add.text(loginWidth/2 - 65, -loginHeight/2 + 40, 'HINT', {
            fontFamily: 'Arial, sans-serif',
            fontSize: this.scalingManager.scale(18) + 'px',
            fontWeight: 'bold',
            color: '#ffffff',
            align: 'center'
        });
        hintText.setOrigin(0.5);
        
        // Make hint button interactive
        hintButton.setInteractive(new Phaser.Geom.Rectangle(loginWidth/2 - 110, -loginHeight/2 + 20, 90, 40), Phaser.Geom.Rectangle.Contains);
        
        loginContainer.add(hintButton);
        loginContainer.add(hintText);
        
        // Main content area - using a two-column layout for better space utilization
        
        // Left column - login form
        const leftCol = this.add.container(-loginWidth/4, 0);
        loginContainer.add(leftCol);
        
        // User login section with improved styling
        const loginSection = this.add.graphics();
        loginSection.fillStyle(0x332211, 0.7);
        loginSection.fillRect(-loginWidth/4, -loginHeight/2 + 100, loginWidth/2 - 50, loginHeight - 200);
        loginSection.lineStyle(2, 0x996600, 0.5);
        loginSection.strokeRect(-loginWidth/4, -loginHeight/2 + 100, loginWidth/2 - 50, loginHeight - 200);
        leftCol.add(loginSection);
        
        // Section title
        const sectionTitle = this.add.text(0, -loginHeight/2 + 130, 'USER LOGIN', {
            fontFamily: 'Arial, sans-serif',
            fontSize: this.scalingManager.scale(24) + 'px',
            fontWeight: 'bold',
            color: '#ff9900',
            align: 'center'
        });
        sectionTitle.setOrigin(0.5);
        leftCol.add(sectionTitle);
        
        // Username label and input
        const usernameLabel = this.add.text(-loginWidth/4 + 30, -loginHeight/2 + 180, 'Username:', {
            fontFamily: 'Arial, sans-serif',
            fontSize: this.scalingManager.scale(20) + 'px',
            color: '#ffffff',
            align: 'left'
        });
        usernameLabel.setOrigin(0, 0.5);
        leftCol.add(usernameLabel);
        
        // Improved input field styling
        const usernameBoxBg = this.add.graphics();
        usernameBoxBg.fillStyle(0x221100, 1);
        usernameBoxBg.fillRect(-loginWidth/4 + 30, -loginHeight/2 + 210, loginWidth/2 - 110, 50);
        usernameBoxBg.lineStyle(2, 0xff9900, 0.8);
        usernameBoxBg.strokeRect(-loginWidth/4 + 30, -loginHeight/2 + 210, loginWidth/2 - 110, 50);
        leftCol.add(usernameBoxBg);
        
        // Input text field 
        let inputText = '';
        const inputTextDisplay = this.add.text(-loginWidth/4 + 40, -loginHeight/2 + 235, inputText, {
            fontFamily: 'Courier New, monospace',
            fontSize: this.scalingManager.scale(22) + 'px',
            color: '#ffffff',
            align: 'left'
        });
        inputTextDisplay.setOrigin(0, 0.5);
        leftCol.add(inputTextDisplay);
        
        // Add blinking cursor effect
        const cursor = this.add.text(inputTextDisplay.x, inputTextDisplay.y, '_', {
            fontFamily: 'Courier New, monospace',
            fontSize: this.scalingManager.scale(22) + 'px',
            color: '#ffffff'
        });
        cursor.setOrigin(0, 0.5);
        leftCol.add(cursor);
        
        // Blink the cursor
        this.cursorBlink = this.time.addEvent({
            delay: 500,
            callback: () => {
                cursor.setVisible(!cursor.visible);
            },
            loop: true
        });
        
        // Update cursor position when text changes
        const updateCursor = () => {
            cursor.x = inputTextDisplay.x + inputTextDisplay.width + 5;
        };
        
        // Make input field interactive
        usernameBoxBg.setInteractive(new Phaser.Geom.Rectangle(-loginWidth/4 + 30, -loginHeight/2 + 210, loginWidth/2 - 110, 50), Phaser.Geom.Rectangle.Contains);
        usernameBoxBg.on('pointerdown', () => {
            // Visual feedback - change background color slightly
            usernameBoxBg.clear();
            usernameBoxBg.fillStyle(0x332211, 1);
            usernameBoxBg.fillRect(-loginWidth/4 + 30, -loginHeight/2 + 210, loginWidth/2 - 110, 50);
            usernameBoxBg.lineStyle(2, 0xffaa33, 1); // Brighter border on focus
            usernameBoxBg.strokeRect(-loginWidth/4 + 30, -loginHeight/2 + 210, loginWidth/2 - 110, 50);
            
            // Update status
            statusText.setText('Type your SQL injection attempt and press Enter');
            statusText.setColor('#ffcc00');
        });
        
        // Login button
        const loginButtonBg = this.add.graphics();
        loginButtonBg.fillStyle(0xff9900, 1);
        loginButtonBg.fillRoundedRect(-loginWidth/4 + 30, -loginHeight/2 + 290, loginWidth/2 - 110, 60, 10);
        // Add gradient
        loginButtonBg.fillGradientStyle(0xffaa33, 0xffaa33, 0xff8800, 0xff8800, 1);
        loginButtonBg.fillRoundedRect(-loginWidth/4 + 35, -loginHeight/2 + 295, loginWidth/2 - 120, 50, 8);
        
        const loginText = this.add.text(-loginWidth/4 + (loginWidth/2 - 110)/2 + 30, -loginHeight/2 + 320, 'LOGIN', {
            fontFamily: 'Arial, sans-serif',
            fontSize: this.scalingManager.scale(24) + 'px',
            fontWeight: 'bold',
            color: '#ffffff',
            align: 'center',
            stroke: '#cc6600',
            strokeThickness: 1
        });
        loginText.setOrigin(0.5);
        
        // Make login button interactive
        loginButtonBg.setInteractive(new Phaser.Geom.Rectangle(-loginWidth/4 + 30, -loginHeight/2 + 290, loginWidth/2 - 110, 60), Phaser.Geom.Rectangle.Contains);
        
        leftCol.add(loginButtonBg);
        leftCol.add(loginText);
        
        // Status message
        const statusText = this.add.text(300, loginHeight/2 -50, 'Enter a username or try SQL injection...', {
            fontFamily: 'Arial, sans-serif',
            fontSize: this.scalingManager.scale(20) + 'px',
            color: '#ffffff',
            align: 'center'
        });
        statusText.setOrigin(0.5);
        leftCol.add(statusText);
        
        // Right column - SQL query visualization and database preview
        const rightCol = this.add.container(loginWidth/4, 0);
        loginContainer.add(rightCol);
        
        // SQL Query section
        const querySection = this.add.graphics();
        querySection.fillStyle(0x332211, 0.7);
        querySection.fillRect(-loginWidth/4 + 50, -loginHeight/2 + 100, loginWidth/2 - 50, 200);
        querySection.lineStyle(2, 0x996600, 0.5);
        querySection.strokeRect(-loginWidth/4 + 50, -loginHeight/2 + 100, loginWidth/2 - 50, 200);
        rightCol.add(querySection);
        
        // SQL Query title
        const queryTitle = this.add.text(0, -loginHeight/2 + 130, 'Generated SQL Query:', {
            fontFamily: 'Arial, sans-serif',
            fontSize: this.scalingManager.scale(20) + 'px',
            color: '#ff9900',
            align: 'center',
            fontWeight: 'bold'
        });
        queryTitle.setOrigin(0.5);
        rightCol.add(queryTitle);
        
        // Query box with code styling
        const queryBox = this.add.graphics();
        queryBox.fillStyle(0x000000, 0.7);
        queryBox.fillRect(-loginWidth/4 + 70, -loginHeight/2 + 160, loginWidth/2 - 90, 100);
        queryBox.lineStyle(1, 0x00ff66, 0.5);
        queryBox.strokeRect(-loginWidth/4 + 70, -loginHeight/2 + 160, loginWidth/2 - 90, 100);
        rightCol.add(queryBox);
        
        const queryText = this.add.text(0, -loginHeight/2 + 210, this.currentQuery + "';", {
            fontFamily: 'Courier New, monospace',
            fontSize: this.scalingManager.scale(10) + 'px',
            color: '#00ff66', // Green for SQL
            align: 'center',
            wordWrap: { width: loginWidth/2 - 100 }
        });
        queryText.setOrigin(0.5);
        rightCol.add(queryText);
        
        // Database visualization section
        const dbSection = this.add.graphics();
        dbSection.fillStyle(0x332211, 0.7);
        dbSection.fillRect(-loginWidth/4 + 50, -loginHeight/2 + 320, loginWidth/2 - 50, loginHeight - 420);
        dbSection.lineStyle(2, 0x996600, 0.5);
        dbSection.strokeRect(-loginWidth/4 + 50, -loginHeight/2 + 320, loginWidth/2 - 50, loginHeight - 420);
        rightCol.add(dbSection);
        
        // Database icon
        const dbIcon = this.add.graphics();
        dbIcon.lineStyle(2, 0xff9900, 0.8);
        dbIcon.strokeRect(-loginWidth/4 + 80, -loginHeight/2 + 350, 30, 25);
        dbIcon.lineStyle(1, 0xff9900, 0.8);
        dbIcon.lineBetween(-loginWidth/4 + 80, -loginHeight/2 + 355, -loginWidth/4 + 110, -loginHeight/2 + 355);
        dbIcon.lineBetween(-loginWidth/4 + 80, -loginHeight/2 + 360, -loginWidth/4 + 110, -loginHeight/2 + 360);
        dbIcon.lineBetween(-loginWidth/4 + 80, -loginHeight/2 + 365, -loginWidth/4 + 110, -loginHeight/2 + 365);
        rightCol.add(dbIcon);
        
        // Database section title
        const dbTitle = this.add.text(-loginWidth/4 + 120, -loginHeight/2 + 360, 'Database (hidden from actual users):', {
            fontFamily: 'Arial, sans-serif',
            fontSize: this.scalingManager.scale(18) + 'px',
            fontStyle: 'italic',
            color: '#aaaaaa',
            align: 'left'
        });
        dbTitle.setOrigin(0, 0.5);
        rightCol.add(dbTitle);
        
        // Database table visualization
        const tableContainer = this.add.container(0, -loginHeight/2 + 430);
        rightCol.add(tableContainer);
        
        // Table header background
        const tableHeaderBg = this.add.graphics();
        tableHeaderBg.fillStyle(0x553300, 0.8);
        tableHeaderBg.fillRect(-loginWidth/4 + 70, -30, loginWidth/2 - 90, 30);
        tableContainer.add(tableHeaderBg);
        
        const tableHeader = this.add.text(-loginWidth/4 + 80, -15, 'ID | Username | Password | Role', {
            fontFamily: 'Courier New, monospace',
            fontSize: this.scalingManager.scale(16) + 'px',
            color: '#ffcc99',
            align: 'left',
            fontWeight: 'bold'
        });
        tableHeader.setOrigin(0, 0.5);
        tableContainer.add(tableHeader);
        
        // Table content background
        const tableContentBg = this.add.graphics();
        tableContentBg.fillStyle(0x221100, 0.8);
        tableContentBg.fillRect(-loginWidth/4 + 70, 0, loginWidth/2 - 90, 100);
        tableContainer.add(tableContentBg);
        
        // Show just a hint of the data
        const tableContent = this.add.text(-loginWidth/4 + 80, 50, '1 | admin | ******* | admin\n2 | john  | ******* | user\n...', {
            fontFamily: 'Courier New, monospace',
            fontSize: this.scalingManager.scale(16) + 'px',
            color: '#aaaaaa',
            align: 'left'
        });
        tableContent.setOrigin(0, 0.5);
        tableContainer.add(tableContent);
        
        // Setup keyboard input
        this.input.keyboard.on('keydown', (event) => {
            // Handle backspace
            if (event.keyCode === 8 && inputText.length > 0) {
                inputText = inputText.slice(0, -1);
                inputTextDisplay.setText(inputText);
                updateCursor();
                this.updateQueryDisplay(inputText, queryText);
                return;
            }
            
            // Handle Enter key (submit)
            if (event.keyCode === 13) {
                this.checkSQLInjection(inputText, statusText, gameContainer);
                return;
            }
            
            // Handle regular text input
            if (event.key.length === 1) {
                // Limit input length
                if (inputText.length < 30) {
                    inputText += event.key;
                    inputTextDisplay.setText(inputText);
                    updateCursor();
                    this.updateQueryDisplay(inputText, queryText);
                }
            }
        });
        
        // Initially update cursor position
        updateCursor();
        
        // Login button functionality
        loginButtonBg.on('pointerdown', () => {
            // Visual feedback
            loginButtonBg.clear();
            loginButtonBg.fillStyle(0xff8800, 1);
            loginButtonBg.fillRoundedRect(-loginWidth/4 + 30, -loginHeight/2 + 290, loginWidth/2 - 110, 60, 10);
            
            this.checkSQLInjection(inputText, statusText, gameContainer);
        });
        
        // Hover effects for login button
        loginButtonBg.on('pointermove', () => {
            document.body.style.cursor = 'pointer';
            loginText.setShadow(0, 0, '#ffdd99', 5);
        });
        
        loginButtonBg.on('pointerout', () => {
            document.body.style.cursor = 'default';
            loginText.setShadow(0, 0, '#ffdd99', 0);
        });
        
        // Hint button functionality
        hintButton.on('pointerdown', () => {
            // Visual feedback
            hintButton.clear();
            hintButton.fillStyle(0x884400, 1);
            hintButton.fillRoundedRect(loginWidth/2 - 110, -loginHeight/2 + 20, 90, 40, 5);
            
            // Show hint with typing effect
            statusText.setText('');
            let hintMessage = "Hint: Try using ' OR '1'='1 to create a condition that's always true";
            let currentChar = 0;
            
            const typeHint = this.time.addEvent({
                delay: 30,
                callback: () => {
                    if (currentChar <= hintMessage.length) {
                        statusText.setText(hintMessage.substring(0, currentChar));
                        statusText.setColor('#ffcc00');
                        currentChar++;
                    } else {
                        typeHint.remove();
                    }
                },
                repeat: hintMessage.length
            });
        });
        
        // Hover effects for hint button
        hintButton.on('pointermove', () => {
            document.body.style.cursor = 'pointer';
            hintText.setShadow(0, 0, '#ffdd99', 5);
        });
        
        hintButton.on('pointerout', () => {
            document.body.style.cursor = 'default';
            hintText.setShadow(0, 0, '#ffdd99', 0);
        });
        
        // Animation for login form appearance
        loginContainer.setAlpha(0);
        
        this.tweens.add({
            targets: loginContainer,
            alpha: 1,
            duration: 500,
            ease: 'Power2'
        });
    }
    
    updateQueryDisplay(input, queryText) {
        // Update the SQL query display with user input
        this.currentQuery = this.baseQuery + input;
        queryText.setText(this.currentQuery + "';");
    }
    
    checkSQLInjection(input, statusText, gameContainer) {
        // Check if the SQL injection is successful
        // Look for typical SQL injection patterns
        const successPatterns = [
            "' OR '1'='1",
            "' OR 1=1 --",
            "' OR 1=1/*",
            "admin' --",
            "' OR '1'='1' --",
            "' OR 1 = 1",
            "')) OR ((('1'='1"
        ];
        
        let success = false;
        for (const pattern of successPatterns) {
            if (input.toLowerCase().includes(pattern.toLowerCase())) {
                success = true;
                break;
            }
        }
        
        if (success) {
            // SQL Injection successful
            statusText.setText('SQL Injection successful! Authentication bypassed!');
            statusText.setColor('#00ff00');
            
            // Show the effect of the successful SQL injection
            this.showInjectionResults(gameContainer);
            
            // Track success for completion
            this.attackSuccessful = true;
        } else if (input === 'admin' || input === 'john' || input === 'alice' || input === 'bob') {
            // Regular username without password would fail
            statusText.setText('Login failed: Incorrect password!');
            statusText.setColor('#ff0000');
        } else if (input.includes("'")) {
            // Attempted injection but not successful
            statusText.setText("Nice try, but your injection didn't work. Keep trying!");
            statusText.setColor('#ffaa33');
        } else {
            // Regular failed login
            statusText.setText('Login failed: User not found!');
            statusText.setColor('#ff0000');
        }
    }
    
    showInjectionResults(gameContainer) {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Create a fullscreen overlay with a glitch effect
        const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.8);
        overlay.setOrigin(0, 0);
        
        // Add glitch effect to represent a successful hack
        this.createGlitchEffect();
        
        // Create results popup
        const resultsWidth = Math.min(width * 0.8, 800);
        const resultsHeight = Math.min(height * 0.8, 600);
        const resultsContainer = this.add.container(centerX, centerY);
        
        // Results background with "hacked system" styling
        const resultsBg = this.add.graphics();
        resultsBg.fillStyle(0x000000, 0.9);
        resultsBg.fillRect(-resultsWidth/2, -resultsHeight/2, resultsWidth, resultsHeight);
        resultsBg.lineStyle(3, 0x00ff00, 0.8);
        resultsBg.strokeRect(-resultsWidth/2, -resultsHeight/2, resultsWidth, resultsHeight);
        
        // Add decorative elements
        resultsBg.lineStyle(1, 0x00ff00, 0.5);
        resultsBg.strokeRect(-resultsWidth/2 + 10, -resultsHeight/2 + 10, resultsWidth - 20, resultsHeight - 20);
        
        // Decorative corner elements
        resultsBg.lineStyle(2, 0x00ff00, 0.8);
        resultsBg.moveTo(-resultsWidth/2, -resultsHeight/2 + 40);
        resultsBg.lineTo(-resultsWidth/2 + 40, -resultsHeight/2);
        resultsBg.moveTo(resultsWidth/2, -resultsHeight/2 + 40);
        resultsBg.lineTo(resultsWidth/2 - 40, -resultsHeight/2);
        resultsBg.moveTo(-resultsWidth/2, resultsHeight/2 - 40);
        resultsBg.lineTo(-resultsWidth/2 + 40, resultsHeight/2);
        resultsBg.moveTo(resultsWidth/2, resultsHeight/2 - 40);
        resultsBg.lineTo(resultsWidth/2 - 40, resultsHeight/2);
        
        resultsContainer.add(resultsBg);
        
        // Results header with hacked styling
        const resultsHeader = this.add.text(0, -resultsHeight/2 + 40, 'SQL INJECTION SUCCESSFUL!', {
            fontFamily: 'Arial Black, Impact, sans-serif',
            fontSize: this.scalingManager.scale(36) + 'px',
            fontStyle: 'bold',
            color: '#00ff00',
            align: 'center',
            stroke: '#005500',
            strokeThickness: 2
        });
        resultsHeader.setOrigin(0.5);
        resultsContainer.add(resultsHeader);
        
        // Add animated warning symbol
        const warningGraphics = this.add.graphics();
        warningGraphics.fillStyle(0xff0000, 0.3);
        warningGraphics.fillTriangle(
            -50, -resultsHeight/2 + 90,
            50, -resultsHeight/2 + 90,
            0, -resultsHeight/2 + 40
        );
        warningGraphics.lineStyle(2, 0xff0000, 0.8);
        warningGraphics.strokeTriangle(
            -50, -resultsHeight/2 + 90,
            50, -resultsHeight/2 + 90,
            0, -resultsHeight/2 + 40
        );
        
        // Exclamation mark
        warningGraphics.fillStyle(0xff0000, 1);
        warningGraphics.fillRect(-5, -resultsHeight/2 + 50, 10, 25);
        warningGraphics.fillRect(-5, -resultsHeight/2 + 80, 10, 5);
        
        resultsContainer.add(warningGraphics);
        
        // Pulse animation for warning
        this.tweens.add({
            targets: warningGraphics,
            alpha: 0.7,
            duration: 800,
            yoyo: true,
            repeat: -1
        });
        
        // Show what happened
        const explanation = this.add.text(0, -resultsHeight/2 + 130, "Your input modified the query's logic:", {
            fontFamily: 'Arial, sans-serif',
            fontSize: this.scalingManager.scale(24) + 'px',
            color: '#ffffff',
            align: 'center',
            fontWeight: 'bold'
        });
        explanation.setOrigin(0.5);
        resultsContainer.add(explanation);
        
        // Show the exploited query with syntax highlighting
        const queryContainer = this.add.container(0, -resultsHeight/2 + 180);
        
        // Query background
        const queryBg = this.add.graphics();
        queryBg.fillStyle(0x001100, 0.7);
        queryBg.fillRect(-resultsWidth/2 + 40, 0, resultsWidth - 80, 100);
        queryBg.lineStyle(1, 0x00ff00, 0.5);
        queryBg.strokeRect(-resultsWidth/2 + 40, 0, resultsWidth - 80, 100);
        queryContainer.add(queryBg);
        
        // Show original intent vs actual executed query
        const originalQuery = this.add.text(0, 20, "Original intent: SELECT * FROM users WHERE username='input' AND password='pass';", {
            fontFamily: 'Courier New, monospace',
            fontSize: this.scalingManager.scale(16) + 'px',
            color: '#aaaaaa',
            align: 'center'
        });
        originalQuery.setOrigin(0.5);
        queryContainer.add(originalQuery);
        
        // Create a colorful representation of the SQL injection attack
        const modifiedQueryText = this.currentQuery + "' AND password='anything';";
        
        // Base query text
        const modifiedQuery = this.add.text(0, 60, modifiedQueryText, {
            fontFamily: 'Courier New, monospace',
            fontSize: this.scalingManager.scale(18) + 'px',
            color: '#00ff66',
            align: 'center',
            wordWrap: { width: resultsWidth - 100 }
        });
        modifiedQuery.setOrigin(0.5);
        queryContainer.add(modifiedQuery);
        
        // Highlight the injection part in red
        const injectionStartIndex = this.baseQuery.length;
        const injectionEndIndex = modifiedQueryText.indexOf("' AND");
        if (injectionStartIndex < injectionEndIndex) {
            // Create a red highlight for the injected code
            const injectionHighlight = this.add.graphics();
            
            // Calculate position and width of the injection part
            const textMetrics = this.game.renderer.measureText(modifiedQueryText.substring(0, injectionStartIndex), {
                fontFamily: 'Courier New',
                fontSize: this.scalingManager.scale(18) + 'px'
            });
            
            const injectionWidth = this.game.renderer.measureText(
                modifiedQueryText.substring(injectionStartIndex, injectionEndIndex),
                { fontFamily: 'Courier New', fontSize: this.scalingManager.scale(18) + 'px' }
            ).width;
            
            const startX = modifiedQuery.x - modifiedQuery.width / 2 + textMetrics.width;
            
            injectionHighlight.fillStyle(0xff0000, 0.3);
            injectionHighlight.fillRect(startX, 50, injectionWidth, 20);
            
            queryContainer.add(injectionHighlight);
        }
        
        resultsContainer.add(queryContainer);
        
        // Explanation of what happened
        const effectText = this.add.text(0, -resultsHeight/2 + 320, "The OR '1'='1' condition is always TRUE,\ncausing the query to return ALL users regardless of password!", {
            fontFamily: 'Arial, sans-serif',
            fontSize: this.scalingManager.scale(20) + 'px',
            color: '#ffaa33',
            align: 'center',
            fontWeight: 'bold'
        });
        effectText.setOrigin(0.5);
        resultsContainer.add(effectText);
        
        // Data leaked visualization - styled as a database dump
        const dataContainer = this.add.container(0, 0);
        resultsContainer.add(dataContainer);
        
        const dataBackground = this.add.graphics();
        dataBackground.fillStyle(0x001100, 0.7);
        dataBackground.fillRect(-resultsWidth/2 + 40, -80, resultsWidth - 80, 160);
        dataBackground.lineStyle(1, 0xff0000, 0.7);
        dataBackground.strokeRect(-resultsWidth/2 + 40, -80, resultsWidth - 80, 160);
        dataContainer.add(dataBackground);
        
        const dataTitle = this.add.text(0, -60, "EXPOSED DATA:", {
            fontFamily: 'Arial, sans-serif',
            fontSize: this.scalingManager.scale(22) + 'px',
            fontStyle: 'bold',
            color: '#ff0000',
            align: 'center'
        });
        dataTitle.setOrigin(0.5);
        dataContainer.add(dataTitle);
        
        // Create a table-like structure for user data
        const tableHeader = this.add.graphics();
        tableHeader.fillStyle(0x330000, 0.8);
        tableHeader.fillRect(-resultsWidth/2 + 60, -40, resultsWidth - 120, 30);
        dataContainer.add(tableHeader);
        
        const tableHeaderText = this.add.text(-resultsWidth/2 + 80, -25, 'ID | Username | Password | Role', {
            fontFamily: 'Courier New, monospace',
            fontSize: this.scalingManager.scale(18) + 'px',
            color: '#ff9999',
            align: 'left',
            fontWeight: 'bold'
        });
        tableHeaderText.setOrigin(0, 0.5);
        dataContainer.add(tableHeaderText);
        
        // Format user data for display
        let userData = '';
        this.users.forEach(user => {
            userData += `${user.id} | ${user.username.padEnd(8)} | ${user.password.padEnd(22)} | ${user.role}\n`;
        });
        
        const dataText = this.add.text(-resultsWidth/2 + 80, 20, userData, {
            fontFamily: 'Courier New, monospace',
            fontSize: this.scalingManager.scale(16) + 'px',
            color: '#ffffff',
            align: 'left'
        });
        dataText.setOrigin(0, 0.5);
        dataContainer.add(dataText);
        
        // Continue button with improved styling
        const continueButton = this.add.graphics();
        continueButton.fillStyle(0x00aa00, 1);
        continueButton.fillRoundedRect(-125, resultsHeight/2 - 80, 250, 60, 10);
        // Add gradient
        continueButton.fillGradientStyle(0x00cc00, 0x00cc00, 0x008800, 0x008800, 1);
        continueButton.fillRoundedRect(-120, resultsHeight/2 - 75, 240, 50, 8);
        
        const continueText = this.add.text(0, resultsHeight/2 - 50, 'CONTINUE', {
            fontFamily: 'Arial, sans-serif',
            fontSize: this.scalingManager.scale(24) + 'px',
            fontWeight: 'bold',
            color: '#ffffff',
            align: 'center',
            stroke: '#005500',
            strokeThickness: 1
        });
        continueText.setOrigin(0.5);
        
        // Make button interactive
        continueButton.setInteractive(new Phaser.Geom.Rectangle(-125, resultsHeight/2 - 80, 250, 60), Phaser.Geom.Rectangle.Contains);
        
        resultsContainer.add(continueButton);
        resultsContainer.add(continueText);
        
        // Fade out game container
        this.tweens.add({
            targets: gameContainer,
            alpha: 0.3,
            duration: 500
        });
        
        // Animation for results appearance with a hacking effect
        resultsContainer.setAlpha(0);
        
        // Create flickering appearance effect
        const flickerIn = () => {
            resultsContainer.setAlpha(Math.random() * 0.5);
            this.time.delayedCall(50, () => {
                resultsContainer.setAlpha(Math.random() * 0.8);
                this.time.delayedCall(50, () => {
                    resultsContainer.setAlpha(0.5 + Math.random() * 0.5);
                    this.time.delayedCall(50, () => {
                        resultsContainer.setAlpha(1);
                    });
                });
            });
        };
        
        flickerIn();
        
        // Continue button action
        continueButton.on('pointerdown', () => {
            this.tweens.add({
                targets: [resultsContainer, overlay, gameContainer],
                alpha: 0,
                duration: 500,
                ease: 'Power2',
                onComplete: () => {
                    resultsContainer.destroy();
                    overlay.destroy();
                    gameContainer.destroy();
                    
                    // Stop any ongoing timers
                    if (this.cursorBlink) {
                        this.cursorBlink.remove();
                        this.cursorBlink = null;
                    }
                    
                    this.showPreventionScreen();
                }
            });
        });
        
        // Hover effects for button
        continueButton.on('pointermove', () => {
            document.body.style.cursor = 'pointer';
            continueText.setShadow(0, 0, '#00ff00', 5);
        });
        
        continueButton.on('pointerout', () => {
            document.body.style.cursor = 'default';
            continueText.setShadow(0, 0, '#00ff00', 0);
        });
    }
    
    createGlitchEffect() {
        // Add a visual "hacking" effect to the screen
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Create horizontal scan lines
        const scanLines = this.add.graphics();
        for (let y = 0; y < height; y += 4) {
            scanLines.fillStyle(0x00ff00, 0.05);
            scanLines.fillRect(0, y, width, 1);
        }
        
        // Add random glitch rectangles
        const addGlitchRects = () => {
            const glitchRects = this.add.graphics();
            
            // Add several random rectangles
            for (let i = 0; i < 10; i++) {
                const x = Math.random() * width;
                const y = Math.random() * height;
                const w = 20 + Math.random() * 200;
                const h = 5 + Math.random() * 15;
                
                // Random color - green or white
                const color = Math.random() > 0.7 ? 0xffffff : 0x00ff00;
                glitchRects.fillStyle(color, 0.2);
                glitchRects.fillRect(x, y, w, h);
            }
            
            // Destroy after a short time
            this.time.delayedCall(100, () => {
                glitchRects.destroy();
                
                // Add more glitches if we're still in this scene
                if (!this.scene.isActive('ChallengeA3Level1')) return;
                
                if (Math.random() > 0.7) {
                    this.time.delayedCall(Math.random() * 300, addGlitchRects);
                }
            });
        };
        
        // Start the glitch effect
        addGlitchRects();
        
        // Add binary/code-like text particles
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            
            // Random binary or SQL-like text
            const textOptions = [
                "01010", "SELECT", "FROM", "WHERE", 
                "11001", "DROP", "UNION", "10110", 
                "admin", "--", "OR 1=1", "11100"
            ];
            const randomText = textOptions[Math.floor(Math.random() * textOptions.length)];
            
            const textParticle = this.add.text(x, y, randomText, {
                fontFamily: 'Courier New, monospace',
                fontSize: (10 + Math.random() * 12) + 'px',
                color: Math.random() > 0.7 ? '#ffffff' : '#00ff00',
                align: 'center'
            });
            textParticle.setAlpha(0.2 + Math.random() * 0.5);
            
            // Animate the text particles
            this.tweens.add({
                targets: textParticle,
                y: y + 100 + Math.random() * 200,
                alpha: 0,
                duration: 1000 + Math.random() * 2000,
                onComplete: () => {
                    textParticle.destroy();
                }
            });
        }
    }
    
    showPreventionScreen() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Create main container
        const preventionContainer = this.add.container(0, 0);
        
        // Create a background with better styling for full screen
        const preventionBg = this.add.graphics();
        preventionBg.fillGradientStyle(0x221100, 0x221100, 0x110900, 0x110900, 1);
        preventionBg.fillRect(0, 0, width, height);
        preventionContainer.add(preventionBg);
        
        // Add a subtle grid pattern
        const gridGraphics = this.add.graphics();
        gridGraphics.lineStyle(1, 0xff9900, 0.1);
        
        // Draw vertical lines
        for (let x = 0; x < width; x += 50) {
            gridGraphics.moveTo(x, 0);
            gridGraphics.lineTo(x, height);
        }
        
        // Draw horizontal lines
        for (let y = 0; y < height; y += 50) {
            gridGraphics.moveTo(0, y);
            gridGraphics.lineTo(width, y);
        }
        
        gridGraphics.strokePath();
        preventionContainer.add(gridGraphics);
        
        // Create content area with border
        const contentWidth = Math.min(width * 0.9, 1000);
        const contentHeight = Math.min(height * 0.9, 700);
        
        const contentBg = this.add.graphics();
        contentBg.fillStyle(0x221100, 0.7);
        contentBg.fillRect(centerX - contentWidth/2, centerY - contentHeight/2, contentWidth, contentHeight);
        contentBg.lineStyle(3, 0xff9900, 0.8);
        contentBg.strokeRect(centerX - contentWidth/2, centerY - contentHeight/2, contentWidth, contentHeight);
        preventionContainer.add(contentBg);
        
        // Decorative corner elements
        const cornerDecor = this.add.graphics();
        cornerDecor.lineStyle(2, 0xff9900, 0.6);
        
        // Top-left corner
        cornerDecor.moveTo(centerX - contentWidth/2, centerY - contentHeight/2 + 30);
        cornerDecor.lineTo(centerX - contentWidth/2 + 30, centerY - contentHeight/2);
        
        // Top-right corner
        cornerDecor.moveTo(centerX + contentWidth/2, centerY - contentHeight/2 + 30);
        cornerDecor.lineTo(centerX + contentWidth/2 - 30, centerY - contentHeight/2);
        
        // Bottom-left corner
        cornerDecor.moveTo(centerX - contentWidth/2, centerY + contentHeight/2 - 30);
        cornerDecor.lineTo(centerX - contentWidth/2 + 30, centerY + contentHeight/2);
        
        // Bottom-right corner
        cornerDecor.moveTo(centerX + contentWidth/2, centerY + contentHeight/2 - 30);
        cornerDecor.lineTo(centerX + contentWidth/2 - 30, centerY + contentHeight/2);
        
        preventionContainer.add(cornerDecor);
        
        // Create header area
        const headerBg = this.add.graphics();
        headerBg.fillGradientStyle(0x553300, 0x332200, 0x332200, 0x553300, 1);
        headerBg.fillRect(centerX - contentWidth/2, centerY - contentHeight/2, contentWidth, 80);
        preventionContainer.add(headerBg);
        
        // Add icon in header
        const headerIcon = this.add.graphics();
        headerIcon.lineStyle(3, 0xff9900, 0.8);
        headerIcon.strokeCircle(centerX - contentWidth/2 + 50, centerY - contentHeight/2 + 40, 30);
        
        // Shield icon
        headerIcon.lineStyle(3, 0xff9900, 0.8);
        headerIcon.moveTo(centerX - contentWidth/2 + 30, centerY - contentHeight/2 + 40);
        headerIcon.lineTo(centerX - contentWidth/2 + 50, centerY - contentHeight/2 + 20);
        headerIcon.lineTo(centerX - contentWidth/2 + 70, centerY - contentHeight/2 + 40);
        headerIcon.lineTo(centerX - contentWidth/2 + 70, centerY - contentHeight/2 + 55);
        headerIcon.lineTo(centerX - contentWidth/2 + 50, centerY - contentHeight/2 + 65);
        headerIcon.lineTo(centerX - contentWidth/2 + 30, centerY - contentHeight/2 + 55);
        headerIcon.lineTo(centerX - contentWidth/2 + 30, centerY - contentHeight/2 + 40);
        
        preventionContainer.add(headerIcon);
        
        // Header text
        const preventionHeader = this.add.text(centerX, centerY - contentHeight/2 + 40, 'SQL INJECTION PREVENTION', {
            fontFamily: 'Arial Black, Impact, sans-serif',
            fontSize: this.scalingManager.scale(38) + 'px',
            fontStyle: 'bold',
            color: '#ff9900',
            align: 'center',
            stroke: '#662200',
            strokeThickness: 2
        });
        preventionHeader.setOrigin(0.5);
        preventionContainer.add(preventionHeader);
        
        // Create a two-column layout for content
        const leftColumnX = centerX - contentWidth/4;
        const rightColumnX = centerX + contentWidth/4;
        const columnY = centerY - contentHeight/2 + 140;
        
        // Left column - explanation text
        const explanationTitle = this.add.text(leftColumnX, columnY, 'How to prevent SQL Injection attacks:', {
            fontFamily: 'Arial, sans-serif',
            fontSize: this.scalingManager.scale(26) + 'px',
            fontWeight: 'bold',
            color: '#ffffff',
            align: 'center'
        });
        explanationTitle.setOrigin(0.5);
        preventionContainer.add(explanationTitle);
        
        // Decorative line under title
        const titleUnderline = this.add.graphics();
        titleUnderline.lineStyle(2, 0xff9900, 0.6);
        titleUnderline.lineBetween(
            leftColumnX - explanationTitle.width/2, 
            columnY + explanationTitle.height/2 + 5,
            leftColumnX + explanationTitle.width/2, 
            columnY + explanationTitle.height/2 + 5
        );
        preventionContainer.add(titleUnderline);
        
        // Prevention techniques with better formatting
        const techniques = [
            "1. Use Prepared Statements with Parameterized Queries:",
            "   - Separate SQL code from data",
            "   - Prevents malicious code execution",
            "",
            "2. Use Object Relational Mapping (ORM) tools:",
            "   - Automatically handles SQL escaping",
            "",
            "3. Input Validation:",
            "   - Whitelist allowed characters",
            "   - Reject or sanitize suspicious input",
            "",
            "4. Least Privilege:",
            "   - Limit database account permissions"
        ].join('\n');
        
        // Add a styled background for the techniques
        const techniquesBg = this.add.graphics();
        techniquesBg.fillStyle(0x332211, 0.5);
        techniquesBg.fillRect(
            leftColumnX - contentWidth/4 + 40, 
            columnY + 30, 
            contentWidth/2 - 80, 
            contentHeight - 200
        );
        techniquesBg.lineStyle(1, 0x996600, 0.5);
        techniquesBg.strokeRect(
            leftColumnX - contentWidth/4 + 40, 
            columnY + 30, 
            contentWidth/2 - 80, 
            contentHeight - 200
        );
        preventionContainer.add(techniquesBg);
        
        const preventionText = this.add.text(leftColumnX, columnY + 170, techniques, {
            fontFamily: 'Arial, sans-serif',
            fontSize: this.scalingManager.scale(22) + 'px',
            color: '#ffffff',
            align: 'left',
            lineSpacing: 10
        });
        preventionText.setOrigin(0.5, 0.5);
        preventionContainer.add(preventionText);
        
        // Add security shield icon
        const shieldIcon = this.add.graphics();
        shieldIcon.fillStyle(0xff9900, 0.2);
        shieldIcon.fillCircle(leftColumnX, columnY + 380, 50);
        
        shieldIcon.lineStyle(3, 0xff9900, 0.8);
        shieldIcon.strokeCircle(leftColumnX, columnY + 380, 50);
        
        // Shield icon
        shieldIcon.lineStyle(3, 0xff9900, 0.8);
        shieldIcon.moveTo(leftColumnX - 25, columnY + 380);
        shieldIcon.lineTo(leftColumnX, columnY + 350);
        shieldIcon.lineTo(leftColumnX + 25, columnY + 380);
        shieldIcon.lineTo(leftColumnX + 25, columnY + 400);
        shieldIcon.lineTo(leftColumnX, columnY + 420);
        shieldIcon.lineTo(leftColumnX - 25, columnY + 400);
        shieldIcon.lineTo(leftColumnX - 25, columnY + 380);
        
        // Add check mark inside shield
        shieldIcon.lineStyle(3, 0x00ff00, 0.8);
        shieldIcon.moveTo(leftColumnX - 10, columnY + 380);
        shieldIcon.lineTo(leftColumnX, columnY + 395);
        shieldIcon.lineTo(leftColumnX + 15, columnY + 370);
        
        preventionContainer.add(shieldIcon);
        
        // Right column - code example
        const codeTitle = this.add.text(rightColumnX, columnY, 'SECURE CODE EXAMPLE:', {
            fontFamily: 'Arial, sans-serif',
            fontSize: this.scalingManager.scale(26) + 'px',
            fontWeight: 'bold',
            color: '#00ff66',
            align: 'center'
        });
        codeTitle.setOrigin(0.5);
        preventionContainer.add(codeTitle);
        
        // Decorative line under title
        const codeTitleUnderline = this.add.graphics();
        codeTitleUnderline.lineStyle(2, 0x00ff66, 0.6);
        codeTitleUnderline.lineBetween(
            rightColumnX - codeTitle.width/2, 
            columnY + codeTitle.height/2 + 5,
            rightColumnX + codeTitle.width/2, 
            columnY + codeTitle.height/2 + 5
        );
        preventionContainer.add(codeTitleUnderline);
        
        // Code example with better styling
        const codeBg = this.add.graphics();
        codeBg.fillStyle(0x001100, 0.7);
        codeBg.fillRect(
            rightColumnX - contentWidth/4 + 40, 
            columnY + 30, 
            contentWidth/2 - 80, 
            contentHeight - 200
        );
        codeBg.lineStyle(1, 0x00ff66, 0.5);
        codeBg.strokeRect(
            rightColumnX - contentWidth/4 + 40, 
            columnY + 30, 
            contentWidth/2 - 80, 
            contentHeight - 200
        );
        preventionContainer.add(codeBg);
        
        // Add line numbers to code example
        const lineNumbers = this.add.text(
            rightColumnX - contentWidth/4 + 50, 
            columnY + 50,
            "1\n2\n3\n4\n5\n6\n7\n8", 
            {
                fontFamily: 'Courier New, monospace',
                fontSize: this.scalingManager.scale(18) + 'px',
                color: '#666666',
                align: 'right',
                lineSpacing: 10
            }
        );
        preventionContainer.add(lineNumbers);
        
        // Bad code with highlighted vulnerability
        const badCodeBg = this.add.graphics();
        badCodeBg.fillStyle(0x330000, 0.5);
        badCodeBg.fillRect(
            rightColumnX - contentWidth/4 + 70, 
            columnY + 50, 
            contentWidth/2 - 110, 
            50
        );
        preventionContainer.add(badCodeBg);
        
        const badCode = this.add.text(
            rightColumnX - contentWidth/4 + 80, 
            columnY + 75,
            "// Instead of:\nquery = \"SELECT * FROM users WHERE username='\" + username + \"'\";", 
            {
                fontFamily: 'Courier New, monospace',
                fontSize: this.scalingManager.scale(18) + 'px',
                color: '#ff6666',
                align: 'left',
                lineSpacing: 10
            }
        );
        badCode.setOrigin(0, 0.5);
        preventionContainer.add(badCode);
        
        // Highlight the vulnerable part
        const vulnerableHighlight = this.add.graphics();
        vulnerableHighlight.fillStyle(0xff0000, 0.3);
        vulnerableHighlight.fillRect(
            rightColumnX - contentWidth/4 + 80 + 300, 
            columnY + 75 - 10, 
            135, 
            20
        );
        preventionContainer.add(vulnerableHighlight);
        
        // Good code with secure approach
        const goodCodeBg = this.add.graphics();
        goodCodeBg.fillStyle(0x003300, 0.5);
        goodCodeBg.fillRect(
            rightColumnX - contentWidth/4 + 70, 
            columnY + 120, 
            contentWidth/2 - 110, 
            150
        );
        preventionContainer.add(goodCodeBg);
        
        const goodCode = this.add.text(
            rightColumnX - contentWidth/4 + 80, 
            columnY + 195,
            "\n// Use parameterized query:\npreparedStatement = connection.prepareStatement(\n    \"SELECT * FROM users WHERE username = ?\");\npreparedStatement.setString(1, username);", 
            {
                fontFamily: 'Courier New, monospace',
                fontSize: this.scalingManager.scale(18) + 'px',
                color: '#00ff66',
                align: 'left',
                lineSpacing: 10
            }
        );
        goodCode.setOrigin(0, 0.5);
        preventionContainer.add(goodCode);
        
        // Highlight the secure part
        const secureHighlight = this.add.graphics();
        secureHighlight.fillStyle(0x00ff00, 0.2);
        secureHighlight.fillRect(
            rightColumnX - contentWidth/4 + 80 + 345, 
            columnY + 195 - 30, 
            25, 
            20
        );
        preventionContainer.add(secureHighlight);
        
        // Add completion footer
        const footerBg = this.add.graphics();
        footerBg.fillStyle(0x332211, 0.7);
        footerBg.fillRect(
            centerX - contentWidth/2, 
            centerY + contentHeight/2 - 80, 
            contentWidth, 
            80
        );
        preventionContainer.add(footerBg);
        
        // Next level button - larger and more prominent
        const nextButton = this.add.graphics();
        nextButton.fillStyle(0xff9900, 1);
        nextButton.fillRoundedRect(centerX - 125, centerY + contentHeight/2 - 50, 250, 60, 10);
        // Add gradient
        nextButton.fillGradientStyle(0xffaa33, 0xffaa33, 0xff8800, 0xff8800, 1);
        nextButton.fillRoundedRect(centerX - 120, centerY + contentHeight/2 - 45, 240, 50, 8);
        
        const nextText = this.add.text(centerX, centerY + contentHeight/2 - 20, 'COMPLETE LEVEL', {
            fontFamily: 'Arial, sans-serif',
            fontSize: this.scalingManager.scale(24) + 'px',
            fontWeight: 'bold',
            color: '#ffffff',
            align: 'center',
            stroke: '#cc6600',
            strokeThickness: 1
        });
        nextText.setOrigin(0.5);
        
        // Make button interactive
        nextButton.setInteractive(new Phaser.Geom.Rectangle(centerX - 125, centerY + contentHeight/2 - 50, 250, 60), Phaser.Geom.Rectangle.Contains);
        
        preventionContainer.add(nextButton);
        preventionContainer.add(nextText);
        
        // Animation for prevention screen appearance
        preventionContainer.setAlpha(0);
        
        this.tweens.add({
            targets: preventionContainer,
            alpha: 1,
            duration: 800,
            ease: 'Power2'
        });
        
        // Next level button action
        nextButton.on('pointerdown', () => {
            this.cameras.main.fade(800, 0, 0, 0);
            this.time.delayedCall(800, () => {
                this.scene.start('ChallengeA3Level2'); // Transition to next level (XSS)
            });
        });
        
        // Hover effects
        nextButton.on('pointermove', () => {
            document.body.style.cursor = 'pointer';
            nextText.setShadow(0, 0, '#ffdd99', 5);
        });
        
        nextButton.on('pointerout', () => {
            document.body.style.cursor = 'default';
            nextText.setShadow(0, 0, '#ffdd99', 0);
        });
        
        // Victory particles with orange tint
        const particles = this.add.particles('terminal_bg');
        
        particles.createEmitter({
            x: { min: 0, max: width },
            y: -50,
            speed: { min: 150, max: 250 },
            angle: { min: 80, max: 100 },
            scale: { start: 0.4, end: 0 },
            lifespan: 4000,
            quantity: 3,
            frequency: 40,
            tint: 0xff9900,
            blendMode: 'ADD'
        });
    }

    update() {
        // Game logic that runs on every frame
    }
}