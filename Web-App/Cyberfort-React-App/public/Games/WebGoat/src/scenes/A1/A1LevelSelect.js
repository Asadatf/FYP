class A1LevelSelect extends Phaser.Scene {
    constructor() {
        super('A1LevelSelect');
        this.scalingManager = null;
    }

    preload() {
        // Load assets
        this.load.image('button', 'assets/button.png');
    }

    create() {
        // Initialize the scaling manager
        this.scalingManager = new ScalingManager(this);
        
        // Create a dark background
        this.createBackground();
        
        // Header for the level select screen
        this.createHeader();
        
        // Create level selection buttons
        this.createLevelButtons();
        
        // Create network packet animation effect
        this.createNetworkEffect();
        
        // Listen for resize events
        this.scale.on('resize', this.refreshUI, this);
    }
    
    refreshUI() {
        // Update scaling manager
        if (this.scalingManager) {
            this.scalingManager.updateScaleFactor();
        }
        
        // Clear the existing display
        this.children.removeAll(true);
        
        // Recreate the UI elements
        this.createBackground();
        this.createHeader();
        this.createLevelButtons();
        this.createNetworkEffect();
    }
    
    createBackground() {
        // Create a dark background with blue tint for A1 challenge
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        const bg = this.add.rectangle(0, 0, width, height, 0x000033);
        bg.setOrigin(0, 0);
        
        // Create a grid pattern overlay
        const gridSize = Math.min(width, height) / 20; // Responsive grid size
        const graphics = this.add.graphics();
        graphics.lineStyle(1, 0x001155, 0.3);
        
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
        
        // Add network pattern overlay
        this.createNetworkPattern();
        
        // Add vignette effect
        const vignette = this.add.graphics();
        const vignetteColor = 0x000022;
        
        vignette.fillGradientStyle(
            vignetteColor, vignetteColor, 
            vignetteColor, vignetteColor, 
            0.8, 0.8, 0, 0
        );
        
        vignette.fillRect(0, 0, width, height);
    }
    
    createNetworkPattern() {
        // Create network/connection lines in the background
        const graphics = this.add.graphics();
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Set line style for network paths
        graphics.lineStyle(2, 0x3366ff, 0.1);
        
        // Create random network paths
        const nodeCount = 12;
        const nodes = [];
        
        // Create nodes
        for (let i = 0; i < nodeCount; i++) {
            const x = Phaser.Math.Between(50, width - 50);
            const y = Phaser.Math.Between(50, height - 50);
            
            nodes.push({x, y});
            
            // Draw node
            graphics.fillStyle(0x3366ff, 0.2);
            graphics.fillCircle(x, y, 5);
        }
        
        // Connect nodes with lines
        for (let i = 0; i < nodeCount; i++) {
            const connections = Phaser.Math.Between(1, 3);
            
            for (let j = 0; j < connections; j++) {
                const targetIndex = (i + j + 1) % nodeCount;
                
                graphics.beginPath();
                graphics.moveTo(nodes[i].x, nodes[i].y);
                graphics.lineTo(nodes[targetIndex].x, nodes[targetIndex].y);
                graphics.strokePath();
            }
        }
    }
    
    createNetworkEffect() {
        // Create moving packets animation
        const packetCount = 15;
        const path = new Phaser.Curves.Path();
        
        // Create a random path for packets to follow
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Start at a random position on the left
        let x = 0;
        let y = Phaser.Math.Between(100, height - 100);
        
        path.moveTo(x, y);
        
        // Create multiple segments
        const segmentCount = 10;
        
        for (let i = 0; i < segmentCount; i++) {
            // Random horizontal movement to the right
            x += Phaser.Math.Between(width / (segmentCount * 0.5), width / (segmentCount * 1.5));
            
            // Some vertical variation
            if (i % 2 === 0) {
                y += Phaser.Math.Between(-height/5, height/5);
            } else {
                y = Phaser.Math.Clamp(y, 50, height - 50); // Ensure stays on screen
            }
            
            path.lineTo(x, y);
        }
        
        // Ensure the path extends off screen
        path.lineTo(width + 100, y);
        
        // Create packets that follow the path
        for (let i = 0; i < packetCount; i++) {
            const follower = { t: 0, vec: new Phaser.Math.Vector2() };
            const scale = this.scalingManager ? this.scalingManager.scale(1) : 1;
            
            // Follow the path
            this.tweens.add({
                targets: follower,
                t: 1,
                ease: 'Linear',
                duration: Phaser.Math.Between(10000, 15000),
                repeat: -1,
                delay: i * 800
            });
            
            // Create packet
            const packetGraphics = this.add.graphics();
            
            // Update packet position along path
            this.time.addEvent({
                delay: 30,
                callback: () => {
                    packetGraphics.clear();
                    
                    // Get position along path
                    path.getPoint(follower.t, follower.vec);
                    
                    // Draw packet - for session hijacking theme, use "data packet" visuals
                    // Use blue color scheme for A1
                    if (follower.vec.x > 0 && follower.vec.x < width) {
                        packetGraphics.fillStyle(0x3399ff, 0.7);
                        
                        // Occasionally show "intercepted" packet in red
                        if (Math.random() > 0.95) {
                            packetGraphics.fillStyle(0xff3366, 0.8);
                        }
                        
                        // Draw packet with random variations
                        const packetType = i % 3;
                        
                        if (packetType === 0) {
                            // Square packet
                            packetGraphics.fillRect(follower.vec.x - 5*scale, follower.vec.y - 5*scale, 10*scale, 10*scale);
                        } else if (packetType === 1) {
                            // Diamond packet
                            packetGraphics.beginPath();
                            packetGraphics.moveTo(follower.vec.x, follower.vec.y - 7*scale);
                            packetGraphics.lineTo(follower.vec.x + 7*scale, follower.vec.y);
                            packetGraphics.lineTo(follower.vec.x, follower.vec.y + 7*scale);
                            packetGraphics.lineTo(follower.vec.x - 7*scale, follower.vec.y);
                            packetGraphics.closePath();
                            packetGraphics.fillPath();
                        } else {
                            // Circle packet
                            packetGraphics.fillCircle(follower.vec.x, follower.vec.y, 5*scale);
                        }
                        
                        // Sometimes show a "session ID" trail
                        if (Math.random() > 0.98) {
                            const sessionText = this.add.text(
                                follower.vec.x + 10*scale, 
                                follower.vec.y - 5*scale, 
                                "SID:" + Math.floor(Math.random() * 1000000).toString(16).toUpperCase(), 
                                {
                                    fontFamily: 'Courier New, monospace',
                                    fontSize: `${10 * scale}px`,
                                    color: '#66aaff',
                                    align: 'left'
                                }
                            );
                            sessionText.setAlpha(0.8);
                            
                            // Fade and remove after a while
                            this.tweens.add({
                                targets: sessionText,
                                alpha: 0,
                                y: sessionText.y - 20*scale,
                                duration: 2000,
                                onComplete: () => {
                                    sessionText.destroy();
                                }
                            });
                        }
                    }
                },
                loop: true
            });
        }
    }
    
    createHeader() {
        const centerX = this.cameras.main.width / 2;
        
        // Main header text
        const headerText = this.add.text(centerX, this.scalingManager.scale(10), 'CHALLENGE A1 LEVELS', {
            fontFamily: 'Arial Black, Impact, sans-serif',
            fontSize: `${this.scalingManager.scale(40)}px`,
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'center',
            stroke: '#3366ff',
            strokeThickness: this.scalingManager.scale(2),
            shadow: {
                offsetX: this.scalingManager.scale(2),
                offsetY: this.scalingManager.scale(2),
                color: '#3366ff',
                blur: this.scalingManager.scale(5),
                stroke: true,
                fill: true
            }
        });
        
        headerText.setOrigin(0.5);
        
        // Subtitle with a "typing" effect
        this.createTypingSubtitle(centerX, this.scalingManager.scale(85));
        
        // Add subtle animation for header
        this.tweens.add({
            targets: headerText,
            y: this.scalingManager.scale(85),
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Back button to challenge screen
        this.createBackButton();
    }
    
    createTypingSubtitle(x, y) {
        const fullText = "Session Hijacker";
        const typingDelay = 100;
        
        // Create text object
        const subtitleText = this.add.text(x, y, "", {
            fontFamily: 'Courier New, monospace',
            fontSize: `${this.scalingManager.scale(24)}px`,
            color: '#66aaff',
            align: 'center',
            fontStyle: 'bold'
        });
        
        subtitleText.setOrigin(0.5);
        
        // Add a blinking cursor
        const cursor = this.add.text(
            x + subtitleText.width/2 + this.scalingManager.scale(5), 
            y, 
            "_", 
            {
                fontFamily: 'Courier New, monospace',
                fontSize: `${this.scalingManager.scale(24)}px`,
                color: '#66aaff',
                align: 'center',
                fontStyle: 'bold'
            }
        );
        cursor.setOrigin(0.5);
        
        // Create cursor blink animation
        this.tweens.add({
            targets: cursor,
            alpha: 0,
            duration: 500,
            yoyo: true,
            repeat: -1
        });
        
        // Create typing animation
        let currentChar = 0;
        const typingEvent = this.time.addEvent({
            delay: typingDelay,
            callback: () => {
                // Add next character to subtitle
                subtitleText.setText(fullText.substring(0, currentChar + 1));
                subtitleText.updateText();
                
                // Update cursor position
                cursor.x = x - subtitleText.width/2 + subtitleText.width + this.scalingManager.scale(5);
                
                // Random glitch effect occasionally
                if (Math.random() > 0.8) {
                    this.createGlitchEffect(subtitleText);
                }
                
                currentChar++;
                
                // Stop when done typing
                if (currentChar >= fullText.length) {
                    typingEvent.remove();
                    
                    // Keep cursor blinking at the end
                    this.tweens.add({
                        targets: cursor,
                        alpha: 0,
                        duration: 500,
                        yoyo: true,
                        repeat: 5,
                        onComplete: () => {
                            cursor.destroy();
                            
                            // Set up occasional glitch effects after typing is complete
                            this.time.addEvent({
                                delay: Phaser.Math.Between(3000, 6000),
                                callback: () => {
                                    this.createGlitchEffect(subtitleText);
                                },
                                loop: true
                            });
                        }
                    });
                }
            },
            repeat: fullText.length - 1
        });
    }
    
    createGlitchEffect(textObject) {
        // Save original position, text, and color
        const originalX = textObject.x;
        const originalY = textObject.y;
        const originalText = textObject.text;
        const originalColor = textObject.style.color;
        
        // Random offset
        textObject.setX(originalX + Phaser.Math.Between(-5, 5));
        textObject.setY(originalY + Phaser.Math.Between(-3, 3));
        
        // Random color (blue hues for A1)
        textObject.setTint(Math.random() > 0.5 ? 0x00aaff : 0x3366ff);
        
        // Sometimes corrupt some characters for a hacking effect
        if (Math.random() > 0.7) {
            let corruptedText = '';
            for (let i = 0; i < originalText.length; i++) {
                if (Math.random() > 0.8) {
                    corruptedText += this.getRandomChar();
                } else {
                    corruptedText += originalText[i];
                }
            }
            textObject.setText(corruptedText);
        }
        
        // Reset after short delay
        this.time.delayedCall(50, () => {
            textObject.setPosition(originalX, originalY);
            textObject.setTint(0xffffff);
            textObject.setText(originalText);
        });
    }
    
    getRandomChar() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
        return chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    createBackButton() {
        const backButton = this.add.container(this.scalingManager.scale(100), this.scalingManager.scale(50));
        
        // Button background
        const buttonBg = this.add.graphics();
        const buttonWidth = this.scalingManager.scale(120);
        const buttonHeight = this.scalingManager.scale(50);
        
        buttonBg.fillStyle(0x222266, 1);
        buttonBg.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, buttonHeight/5);
        buttonBg.lineStyle(this.scalingManager.scale(2), 0x3366ff, 1);
        buttonBg.strokeRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, buttonHeight/5);
        
        // Button text
        const buttonText = this.add.text(0, 0, 'BACK', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${this.scalingManager.scale(18)}px`,
            color: '#ffffff',
            align: 'center'
        });
        
        buttonText.setOrigin(0.5);
        
        // Add components to container
        backButton.add(buttonBg);
        backButton.add(buttonText);
        
        // Make interactive
        backButton.setSize(buttonWidth, buttonHeight);
        backButton.setInteractive({ useHandCursor: true });
        
        // Hover effects
        backButton.on('pointerover', () => {
            buttonBg.clear();
            buttonBg.fillStyle(0x3366ff, 1);
            buttonBg.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, buttonHeight/5);
            buttonBg.lineStyle(this.scalingManager.scale(2), 0x66aaff, 1);
            buttonBg.strokeRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, buttonHeight/5);
        });
        
        backButton.on('pointerout', () => {
            buttonBg.clear();
            buttonBg.fillStyle(0x222266, 1);
            buttonBg.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, buttonHeight/5);
            buttonBg.lineStyle(this.scalingManager.scale(2), 0x3366ff, 1);
            buttonBg.strokeRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, buttonHeight/5);
        });
        
        // Click action
        backButton.on('pointerdown', () => {
            this.cameras.main.fade(500, 0, 0, 0);
            this.time.delayedCall(500, () => {
                this.scene.start('ChallengesScreen');
            });
        });
    }
    
    createLevelButtons() {
        const centerX = this.cameras.main.width / 2;
        const startY = this.cameras.main.height * 0.25;
        const spacing = this.scalingManager.scale(130); // Increased spacing
        
        // Level data with session/authentication themed icons
        const levels = [
            {
                level: 1,
                title: 'Session Hijacker',
                description: 'Steal a session and log in as another user',
                color: 0x0066aa,
                hoverColor: 0x3388cc,
                scene: 'ChallengeA1Gameplay',
                icon: this.createLevelIcon.bind(this, 'session')
            },
            {
                level: 2,
                title: 'IDOR Exploitation',
                description: 'Exploit insecure direct object references',
                color: 0x0066aa,
                hoverColor: 0x3388cc,
                scene: 'ChallengeA1Level2',
                icon: this.createLevelIcon.bind(this, 'idor')
            },
            {
                level: 3,
                title: 'Locked But Not Secure',
                description: 'Find and access a restricted admin function',
                color: 0x0066aa,
                hoverColor: 0x3388cc,
                scene: 'ChallengeA1Level3',
                icon: this.createLevelIcon.bind(this, 'lock')
            },
            {
                level: 4,
                title: 'Cookie Impersonator',
                description: 'Modify a cookie to gain higher privileges',
                color: 0x0066aa,
                hoverColor: 0x3388cc,
                scene: 'ChallengeA1Level4',
                icon: this.createLevelIcon.bind(this, 'cookie')
            }
        ];
        
        // Create each level button with responsive layout
        levels.forEach((level, index) => {
            const y = startY + index * spacing;
            this.createLevelButton(centerX, y, level);
        });
    }
    
    createLevelIcon(type, x, y, size) {
        const icon = this.add.graphics();
        const scale = this.scalingManager ? this.scalingManager.scale(1) : 1;
        size = size * scale;
        
        switch(type) {
            case 'session':
                // Draw a session token/id icon
                icon.fillStyle(0x3399ff, 1);
                icon.fillRect(x - size/3, y - size/3, size*2/3, size*2/3);  // Base shape
                icon.lineStyle(size/12, 0x3399ff, 1);
                icon.strokeRect(x - size/3, y - size/3, size*2/3, size*2/3); // Outline
                icon.fillStyle(0x000033, 1);
                // "SID" text-like marking
                icon.fillRect(x - size/5, y - size/5, size/10, size/3); // S
                icon.fillRect(x - size/5, y - size/5, size/3, size/10);
                icon.fillRect(x - size/5, y, size/3, size/10);
                icon.fillRect(x + size/10, y, size/10, size/5);
                break;
                
            case 'idor':
                // Draw a data/reference icon
                icon.fillStyle(0x3399ff, 1);
                // Database cylinder
                icon.fillEllipse(x, y - size/3, size/2, size/6);  // Top
                icon.fillEllipse(x, y + size/3, size/2, size/6);  // Bottom
                icon.fillRect(x - size/2, y - size/3, size, size*2/3); // Center
                
                // Reference arrow
                icon.fillStyle(0xff3366, 1);
                icon.fillTriangle(
                    x + size/2, y,
                    x + size*3/4, y - size/6,
                    x + size*3/4, y + size/6
                );
                icon.fillRect(x + size/2, y - size/12, size/4, size/6);
                break;
                
            case 'lock':
                // Draw a lock icon
                icon.fillStyle(0x3399ff, 1);
                icon.fillRect(x - size/3, y - size/6, size*2/3, size*2/3); // Lock body
                
                // Lock shackle
                icon.lineStyle(size/8, 0x3399ff, 1);
                icon.beginPath();
                icon.arc(x, y - size/6, size/3, Math.PI, 2*Math.PI);
                icon.strokePath();
                
                // Keyhole
                icon.fillStyle(0x000033, 1);
                icon.fillCircle(x, y + size/6, size/8);
                break;
                
            case 'cookie':
                // Draw a cookie icon
                icon.fillStyle(0x3399ff, 1);
                icon.fillCircle(x, y, size/2);  // Cookie base
                
                // Cookie bits/chips
                icon.fillStyle(0x000033, 1);
                icon.fillCircle(x - size/4, y - size/4, size/8);
                icon.fillCircle(x + size/5, y - size/6, size/10);
                icon.fillCircle(x + size/4, y + size/4, size/8);
                icon.fillCircle(x - size/6, y + size/5, size/10);
                break;
        }
        
        return icon;
    }
    
    createLevelButton(x, y, levelData) {
        const buttonContainer = this.add.container(x, y);
        
        // Button background - using scaling for responsiveness
        const buttonWidth = this.scalingManager.scale(550);
        const buttonHeight = this.scalingManager.scale(100);
        const cornerRadius = this.scalingManager.scale(12);
        
        const buttonBg = this.add.graphics();
        buttonBg.fillStyle(levelData.color, 0.8);
        buttonBg.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, cornerRadius);
        buttonBg.lineStyle(this.scalingManager.scale(3), 0x3366ff, 1);
        buttonBg.strokeRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, cornerRadius);
        
        // Level number badge
        const badgeSize = this.scalingManager.scale(45);
        const badgeX = -buttonWidth/2 + this.scalingManager.scale(40);
        const badgeY = 0;
        
        const badge = this.add.graphics();
        badge.fillStyle(0x003366, 1);
        badge.fillCircle(badgeX, badgeY, badgeSize/2);
        badge.lineStyle(this.scalingManager.scale(2), 0x3399ff, 1);
        badge.strokeCircle(badgeX, badgeY, badgeSize/2);
        
        const levelNumber = this.add.text(badgeX, badgeY, levelData.level.toString(), {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${this.scalingManager.scale(24)}px`,
            fontStyle: 'bold',
            color: '#ffffff'
        });
        
        levelNumber.setOrigin(0.5);
        
        // Level icon
        const iconSize = this.scalingManager.scale(30);
        const iconX = badgeX + this.scalingManager.scale(80);
        const icon = levelData.icon(iconX, badgeY, iconSize);
        
        // Level title
        const titleText = this.add.text(iconX + this.scalingManager.scale(50), -buttonHeight/4, levelData.title, {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${this.scalingManager.scale(26)}px`,
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'left'
        });
        
        titleText.setOrigin(0, 0.5);
        
        // Level description
        const descText = this.add.text(iconX + this.scalingManager.scale(50), buttonHeight/4, levelData.description, {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${this.scalingManager.scale(18)}px`,
            color: '#dddddd',
            align: 'left'
        });
        
        descText.setOrigin(0, 0.5);
        
        // Add components to container
        buttonContainer.add(buttonBg);
        buttonContainer.add(badge);
        buttonContainer.add(levelNumber);
        buttonContainer.add(icon);
        buttonContainer.add(titleText);
        buttonContainer.add(descText);
        
        // Make interactive
        buttonContainer.setSize(buttonWidth, buttonHeight);
        buttonContainer.setInteractive({ useHandCursor: true });
        
        // Hover effects with improved animation
        buttonContainer.on('pointerover', () => {
            buttonBg.clear();
            buttonBg.fillStyle(levelData.hoverColor, 0.9);
            buttonBg.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, cornerRadius);
            buttonBg.lineStyle(this.scalingManager.scale(3), 0x66aaff, 1);
            buttonBg.strokeRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, cornerRadius);
            
            // Scale up slightly with a clean animation
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 1.02,
                scaleY: 1.02,
                duration: 100,
                ease: 'Power1'
            });
            
            // Briefly pulse the icon
            this.tweens.add({
                targets: icon,
                alpha: 0.8,
                duration: 100,
                yoyo: true,
                repeat: 1
            });
        });
        
        buttonContainer.on('pointerout', () => {
            buttonBg.clear();
            buttonBg.fillStyle(levelData.color, 0.8);
            buttonBg.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, cornerRadius);
            buttonBg.lineStyle(this.scalingManager.scale(3), 0x3366ff, 1);
            buttonBg.strokeRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, cornerRadius);
            
            // Scale back to normal
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 1,
                scaleY: 1,
                duration: 100,
                ease: 'Power1'
            });
        });
        
        // Click action
        buttonContainer.on('pointerdown', () => {
            // Visual feedback
            buttonBg.clear();
            buttonBg.fillStyle(0x66aaff, 1);
            buttonBg.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, cornerRadius);
            buttonBg.lineStyle(this.scalingManager.scale(3), 0x99ccff, 1);
            buttonBg.strokeRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, cornerRadius);
            
            // Animation on press
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 0.98,
                scaleY: 0.98,
                duration: 50,
                ease: 'Power1',
                onComplete: () => {
                    this.tweens.add({
                        targets: buttonContainer,
                        scaleX: 1,
                        scaleY: 1,
                        duration: 50,
                        ease: 'Power1'
                    });
                }
            });
            
            this.cameras.main.flash(500, 0, 102, 255);
            
            console.log("Starting scene:", levelData.scene); // Log what we're trying to load
            this.time.delayedCall(300, () => {
                this.scene.start(levelData.scene);
            });
        });
        
        return buttonContainer;
    }

    shutdown() {
        // Clean up resources when scene is shutdown
        if (this.scalingManager) {
            this.scalingManager.destroy();
            this.scalingManager = null;
        }
        
        // Remove event listeners
        this.scale.off('resize', this.refreshUI, this);
        
        // Clean up timers
        this.time.removeAllEvents();
    }

    update() {
        // Frame updates if needed
    }
}