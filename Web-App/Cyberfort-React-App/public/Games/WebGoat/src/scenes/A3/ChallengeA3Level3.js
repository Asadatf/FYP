class ChallengeA3Level3 extends Phaser.Scene {
    constructor() {
        super('ChallengeA3Level3');
        this.scalingManager = null;
        this.currentStep = 0;
        
        // File system structure with deeper nesting for more complex traversal
        this.fileSystem = {
            'webroot': {
                'index.php': 'Welcome to our secure corporate portal!',
                'about.php': 'Our company is committed to security.',
                'assets': {
                    'css': {
                        'main.css': 'body { background-color: #f0f0f0; }',
                        'admin.css': 'body { background-color: #333; color: white; }'
                    },
                    'js': {
                        'main.js': 'console.log("Site loaded");',
                        'security.js': 'function validateInput(input) { return input.replace("../", ""); }'
                    },
                    'images': {
                        'logo.png': 'Company Logo Data',
                        'banner.jpg': 'Banner Image Data',
                        'profile': {
                            'default.jpg': 'Default Profile Picture'
                        }
                    }
                },
                'uploads': {
                    'README.txt': 'This directory is for user uploads only.'
                },
                'includes': {
                    'header.php': '<?php echo "Header included"; ?>',
                    'footer.php': '<?php echo "Footer included"; ?>',
                    'utils.php': '<?php function getFile($filename) { include($filename); } ?>'
                }
            },
            'config': {
                'database.yml': 'production:\n  username: admin\n  password: db_password_2024!',
                'app.properties': 'app.secret=super_secret_key_no_one_should_see',
                'encryption.key': 'AES256-CBC-HMAC:bXlzdXBlcnNlY3JldGVuY3J5cHRpb25rZXk='
            },
            'logs': {
                'access.log': '127.0.0.1 - - [10/May/2024:13:55:36 -0700] "GET /index.php HTTP/1.1" 200 2326',
                'error.log': '[Wed May 10 13:58:59 2024] [error] [client 127.0.0.1] Failed login attempt: username=admin',
                'debug': {
                    'verbose.log': 'DEBUG [2024-05-10 14:02:45] AdminController accessed by user admin from 127.0.0.1'
                }
            },
            'backup': {
                'db_backup_20240510.sql': 'DROP TABLE IF EXISTS users;\nCREATE TABLE users (\n  id INT,\n  username VARCHAR(255),\n  password VARCHAR(255),\n  admin BOOLEAN\n);\nINSERT INTO users VALUES (1, "admin", "hashed_password_here", 1);'
            }
        };
        // Track if the vulnerability was exploited
        this.vulnerabilityExploited = false;
        
        // Current directory path (starts in webroot)
        this.currentPath = 'webroot';
        
        // Current file being viewed
        this.currentFile = null;
        
        // Target critical files to find
        this.targetFiles = [
            'config/database.yml',
            'config/encryption.key',
            'backup/db_backup_20240510.sql'
        ];
        
        // Track found critical files
        this.foundTargetFiles = [];
        
        // File inclusion vulnerability patterns
        this.vulnerableParameter = 'file';
        this.exploitPatterns = ['../', '..\\', '%2e%2e%2f', '....//'];
    }

    preload() {
        // Load any specific assets for this challenge
        this.load.image('folder_icon', 'assets/button.png'); // Using button as placeholder
        this.load.image('file_icon', 'assets/button.png');
        this.load.image('terminal_bg', 'assets/button.png');
    }

    create() {
        this.scalingManager = new ScalingManager(this);
        // Set up the challenge gameplay screen
        this.createBackground();
        this.createStartMessage();
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
        this.createStartMessage();
    }
    createBackground() {
        // Create a dark background with orange/amber tint
        const bg = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x331800);
        bg.setOrigin(0, 0);
        
        // Create a subtle grid pattern
        const gridSize = 40;
        const graphics = this.add.graphics();
        graphics.lineStyle(1, 0x663300, 0.2);
        
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
        const message = this.add.text(centerX, centerY, 'CHALLENGE A3: LEVEL 3', {
            fontFamily: 'Courier New, monospace',
            fontSize: '32px',
            fontStyle: 'bold',
            color: '#ff9900', // Orange for A3
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
        const subtitle = this.add.text(centerX, centerY + 50, 'Advanced Path Traversal: File Inclusion', {
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
        const popupBg = this.add.rectangle(0, 0, 600, 450, 0x000000, 0.9);
        popupBg.setStrokeStyle(2, 0xff9900);
        
        // Popup header
        const popupHeader = this.add.text(0, -175, 'LOCAL FILE INCLUSION VULNERABILITY', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '24px',
            fontStyle: 'bold',
            color: '#ff9900',
            align: 'center'
        });
        popupHeader.setOrigin(0.5);
        
        // Popup content
        const content = [
            "In this advanced challenge, you'll exploit a Local File",
            "Inclusion (LFI) vulnerability to access sensitive files",
            "outside the webroot directory.",
            "",
            "LFI occurs when an application includes files from the",
            "server based on user input without proper validation.",
            "",
            "Your goal: Find 3 critical files by exploiting path traversal",
            "in a vulnerable file inclusion mechanism."
        ].join('\n');
        
        const popupContent = this.add.text(0, 0, content, {
            fontFamily: 'Arial, sans-serif',
            fontSize: '18px',
            color: '#ffffff',
            align: 'center',
            lineSpacing: 8
        });
        popupContent.setOrigin(0.5);
        
        // Start button
        const buttonBg = this.add.rectangle(0, 200, 180, 50, 0xff9900);
        buttonBg.setInteractive({ useHandCursor: true });
        
        const buttonText = this.add.text(0, 200, 'START', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '20px',
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
                    this.showVulnerableWebApp();
                }
            });
        });
        
        // Hover effects for button
        buttonBg.on('pointerover', () => {
            buttonBg.fillColor = 0xffbb33;
        });
        
        buttonBg.on('pointerout', () => {
            buttonBg.fillColor = 0xff9900;
        });
    }
    
    showVulnerableWebApp() {
        let activeKeyboardHandler = null;
        let activeCursorTimer = null;
        let activeCursor = null;
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        
        // Create main container
        const webAppContainer = this.add.container(centerX, centerY);
        
        // App background - make it fill more of the screen
        const appWidth = this.cameras.main.width * 0.9;
        const appHeight = this.cameras.main.height * 0.85;
        const appBg = this.add.rectangle(0, 0, appWidth, appHeight, 0x222222, 0.95);
        appBg.setStrokeStyle(2, 0xff9900);
        
        // App title
        const appTitle = this.add.text(0, -appHeight/2 + 40, 'CORPORATE INTRANET PORTAL', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '28px',
            fontStyle: 'bold',
            color: '#ff9900',
            align: 'center'
        });
        appTitle.setOrigin(0.5);
        
        // Browser-like URL bar
        const urlBarWidth = appWidth * 0.8;
        const urlBarBg = this.add.rectangle(0, -appHeight/2 + 80, urlBarWidth, 30, 0x333333);
        urlBarBg.setStrokeStyle(1, 0x666666);
        
        const urlLabel = this.add.text(-urlBarWidth/2 + 10, -appHeight/2 + 80, 'URL:', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            color: '#ffffff',
            align: 'left'
        });
        urlLabel.setOrigin(0, 0.5);
        
        const urlValue = this.add.text(-urlBarWidth/2 + 50, -appHeight/2 + 80, 'https://intranet.example.com/index.php', {
            fontFamily: 'Courier New, monospace',
            fontSize: '14px',
            color: '#ffffff',
            align: 'left'
        });
        urlValue.setOrigin(0, 0.5);
        
        // Navigation breadcrumb
        const navBg = this.add.rectangle(0, -appHeight/2 + 120, urlBarWidth, 25, 0x444444);
        
        const navText = this.add.text(-urlBarWidth/2 + 10, -appHeight/2 + 120, 'Home > Portal', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            color: '#cccccc',
            align: 'left'
        });
        navText.setOrigin(0, 0.5);
        
        // Calculate panel dimensions
        const panelHeight = appHeight * 0.65;
        const panelY = 0;
        
        // Create the left panel for directory navigation
        const leftPanelWidth = appWidth * 0.4;
        const leftPanelX = -appWidth/4;
        const leftPanelBg = this.add.rectangle(leftPanelX, panelY, leftPanelWidth, panelHeight, 0x333333);
        leftPanelBg.setStrokeStyle(1, 0x666666);
        
        const leftPanelTitle = this.add.text(leftPanelX, -appHeight/2 + 170, 'FILE BROWSER', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            fontStyle: 'bold',
            color: '#ff9900',
            align: 'center'
        });
        leftPanelTitle.setOrigin(0.5);
        
        // Create the right panel for file inclusion
        const rightPanelWidth = appWidth * 0.4;
        const rightPanelX = appWidth/4;
        const rightPanelBg = this.add.rectangle(rightPanelX, panelY, rightPanelWidth, panelHeight, 0x333333);
        rightPanelBg.setStrokeStyle(1, 0x666666);
        
        const rightPanelTitle = this.add.text(rightPanelX, -appHeight/2 + 170, 'FILE INCLUDER', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            fontStyle: 'bold',
            color: '#ff9900',
            align: 'center'
        });
        rightPanelTitle.setOrigin(0.5);
        
        // File includer controls
        const instructionText = this.add.text(rightPanelX, -appHeight/2 + 210, 'Enter file path to include:', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            color: '#ffffff',
            align: 'center'
        });
        instructionText.setOrigin(0.5);
        
        // File input box
        const fileInputWidth = rightPanelWidth * 0.9;
        const fileInputBg = this.add.rectangle(rightPanelX, -appHeight/2 + 240, fileInputWidth, 30, 0x111111);
        fileInputBg.setStrokeStyle(1, 0xff9900);
        fileInputBg.setInteractive({ useHandCursor: true });
        
        // Path value
        let inputPath = 'includes/header.php';
        const fileInputText = this.add.text(rightPanelX, -appHeight/2 + 240, inputPath, {
            fontFamily: 'Courier New, monospace',
            fontSize: '14px',
            color: '#ffffff',
            align: 'center'
        });
        fileInputText.setOrigin(0.5);
        
        // Include button
        const includeButton = this.add.rectangle(rightPanelX, -appHeight/2 + 280, 120, 35, 0xff9900);
        includeButton.setInteractive({ useHandCursor: true });
        
        const includeButtonText = this.add.text(rightPanelX, -appHeight/2 + 280, 'INCLUDE', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: '#ffffff',
            align: 'center'
        });
        includeButtonText.setOrigin(0.5);
        
        // URL preview - shows the actual request URL
        const urlPreviewBg = this.add.rectangle(rightPanelX, -appHeight/2 + 320, fileInputWidth, 25, 0x111111);
        
        const urlPreviewText = this.add.text(rightPanelX, -appHeight/2 + 320, 'GET: ?file=' + inputPath, {
            fontFamily: 'Courier New, monospace',
            fontSize: '12px',
            color: '#66ff66',
            align: 'center'
        });
        urlPreviewText.setOrigin(0.5);
        
        // File content display area
        const contentHeight = panelHeight * 0.45;
        const fileContentBg = this.add.rectangle(rightPanelX, -appHeight/2 + 450, fileInputWidth, contentHeight, 0x111111);
        fileContentBg.setStrokeStyle(1, 0x666666);
        
        // Initial content
        const fileContentText = this.add.text(rightPanelX, -appHeight/2 + 400, 'File content will appear here...', {
            fontFamily: 'Courier New, monospace',
            fontSize: '14px',
            color: '#aaaaaa',
            align: 'center',
            wordWrap: { width: fileInputWidth - 20 }
        });
        fileContentText.setOrigin(0.5);
        
        // Status display for challenge progress
        const statusBg = this.add.rectangle(0, appHeight/2 - 40, appWidth * 0.8, 30, 0x222222);
        
        const statusText = this.add.text(0, appHeight/2 - 40, 'Challenge: Find 3 critical files outside the webroot - 0/3 found', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: '#ffffff',
            align: 'center'
        });
        statusText.setOrigin(0.5);
        
        // Hint button
        const hintButton = this.add.rectangle(appWidth * 0.35, appHeight/2 - 40, 60, 25, 0x775500);
        hintButton.setInteractive({ useHandCursor: true });
        
        const hintButtonText = this.add.text(appWidth * 0.35, appHeight/2 - 40, 'HINT', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '12px',
            color: '#ffffff',
            align: 'center'
        });
        hintButtonText.setOrigin(0.5);
        
        // Add components to container
        webAppContainer.add(appBg);
        webAppContainer.add(appTitle);
        webAppContainer.add(urlBarBg);
        webAppContainer.add(urlLabel);
        webAppContainer.add(urlValue);
        webAppContainer.add(navBg);
        webAppContainer.add(navText);
        webAppContainer.add(leftPanelBg);
        webAppContainer.add(leftPanelTitle);
        webAppContainer.add(rightPanelBg);
        webAppContainer.add(rightPanelTitle);
        webAppContainer.add(instructionText);
        webAppContainer.add(fileInputBg);
        webAppContainer.add(fileInputText);
        webAppContainer.add(includeButton);
        webAppContainer.add(includeButtonText);
        webAppContainer.add(urlPreviewBg);
        webAppContainer.add(urlPreviewText);
        webAppContainer.add(fileContentBg);
        webAppContainer.add(fileContentText);
        webAppContainer.add(statusBg);
        webAppContainer.add(statusText);
        webAppContainer.add(hintButton);
        webAppContainer.add(hintButtonText);
        
        // Populate the file browser - now with adjusted position
        this.populateFileBrowser(webAppContainer, leftPanelX - leftPanelWidth/2 + 10, -appHeight/2 + 200);
        
        // Animation for app appearance
        webAppContainer.setAlpha(0);
        
        this.tweens.add({
            targets: webAppContainer,
            alpha: 1,
            duration: 500,
            ease: 'Power2'
        });
        
        // Setup input handling for the file path
        const cleanupInputHandlers = () => {
            if (activeKeyboardHandler) {
                this.input.keyboard.off('keydown', activeKeyboardHandler);
                activeKeyboardHandler = null;
            }
            
            if (activeCursorTimer) {
                activeCursorTimer.remove();
                activeCursorTimer = null;
            }
            
            if (activeCursor) {
                activeCursor.destroy();
                activeCursor = null;
            }
        };
        
        // Make input field interactive
        fileInputBg.on('pointerdown', () => {
            // Clean up any existing handlers first
            cleanupInputHandlers();
            
            // Visual feedback
            fileInputBg.fillColor = 0x111111;
            fileInputBg.setStrokeStyle(2, 0xff9900);
            
            // Create cursor
            activeCursor = this.add.text(fileInputText.x + fileInputText.width / 2 + 5, fileInputText.y, '|', {
                fontFamily: 'Courier New, monospace',
                fontSize: '14px',
                color: '#ffffff'
            });
            activeCursor.setOrigin(0, 0.5);
            
            webAppContainer.add(activeCursor);
            
            // Blinking cursor timer
            let cursorVisible = true;
            activeCursorTimer = this.time.addEvent({
                delay: 500,
                callback: () => {
                    cursorVisible = !cursorVisible;
                    activeCursor.visible = cursorVisible;
                },
                loop: true
            });
            
            // Setup keyboard input
            activeKeyboardHandler = (event) => {
                // Handle backspace
                if (event.keyCode === 8 && inputPath.length > 0) {
                    inputPath = inputPath.slice(0, -1);
                }
                // Handle other text input
                else if (
                    (event.keyCode >= 48 && event.keyCode <= 90) || // Numbers and letters
                    (event.keyCode >= 186 && event.keyCode <= 222) || // Special chars
                    event.keyCode === 32 || // Space
                    event.keyCode === 191 || // Forward slash
                    event.keyCode === 190 || // Period
                    event.keyCode === 46 // Delete
                ) {
                    inputPath += event.key;
                }
                
                // Update the input text
                fileInputText.setText(inputPath);
                
                // Update cursor position
                activeCursor.x = fileInputText.x + fileInputText.width / 2 + 5;
                
                // Update URL preview
                urlPreviewText.setText('GET: ?file=' + inputPath);
            };
            
            this.input.keyboard.on('keydown', activeKeyboardHandler);
            
            // Stop input when clicking elsewhere
            const clickOutsideHandler = (pointer) => {
                if (!Phaser.Geom.Rectangle.Contains(fileInputBg.getBounds(), pointer.x, pointer.y)) {
                    cleanupInputHandlers();
                    fileInputBg.setStrokeStyle(1, 0xff9900);
                    this.input.off('pointerdown', clickOutsideHandler);
                }
            };
            
            this.input.on('pointerdown', clickOutsideHandler);
        });
        
        // Include button action
        includeButton.on('pointerdown', () => {
            this.processFileInclusion(inputPath, fileContentText, statusText, webAppContainer);
            
            // Don't clean up input handlers here, just let them work
            // This allows the user to immediately edit again after clicking Include
        });
        
        // Include button action
        includeButton.on('pointerdown', () => {
            this.processFileInclusion(inputPath, fileContentText, statusText, webAppContainer);
            
            // Remove any existing cursor
            const existingCursor = webAppContainer.list.find(item => 
                item.type === 'Text' && item.name === 'cursor');
            if (existingCursor) {
                existingCursor.visible = false;
            }
            
            // Reset focus so user can click input field again
            this.input.keyboard.enabled = true;
        });
        
        // Hint button action
        hintButton.on('pointerdown', () => {
            this.showHint(webAppContainer);
        });
        
        // Hover effects
        includeButton.on('pointerover', () => {
            includeButton.fillColor = 0xffbb33;
        });
        
        includeButton.on('pointerout', () => {
            includeButton.fillColor = 0xff9900;
        });
        
        hintButton.on('pointerover', () => {
            hintButton.fillColor = 0xaa7700;
        });
        
        hintButton.on('pointerout', () => {
            hintButton.fillColor = 0x775500;
        });
    }
    
    populateFileBrowser(container, startX, startY) {
// Clear any existing browser items
container.list.forEach(item => {
    if (item.browserItem) {
        container.remove(item);
    }
});

// Get the current directory
let currentDir = this.getCurrentDirectory();

// Create path navigation breadcrumb
let pathParts = this.currentPath.split('/');
let breadcrumb = '';

if (pathParts.length > 0) {
    breadcrumb = 'Location: /';
    if (this.currentPath !== 'webroot') {
        breadcrumb += pathParts.join('/') + '/';
    }
}

const pathText = this.add.text(startX, startY, breadcrumb, {
    fontFamily: 'Courier New, monospace',
    fontSize: '12px',
    color: '#aaaaaa',
    align: 'left',
    wordWrap: { width: 220 }
});
pathText.setOrigin(0, 0);
pathText.browserItem = true;

container.add(pathText);

// Calculate width based on available space
const listWidth = Math.max(220, this.cameras.main.width * 0.35);

// Create "up directory" button if not at root
let yOffset = startY + 25;

if (this.currentPath !== 'webroot') {
    const upButton = this.add.container(startX, yOffset);
    
    const upButtonBg = this.add.rectangle(0, 0, listWidth, 20, 0x444444);
    upButtonBg.setStrokeStyle(1, 0x666666);
    upButtonBg.setOrigin(0, 0.5);
    
    const upButtonText = this.add.text(5, 0, '../ (Up directory)', {
        fontFamily: 'Courier New, monospace',
        fontSize: '12px',
        color: '#ffcc66',
        align: 'left'
    });
    upButtonText.setOrigin(0, 0.5);
    
    upButton.add(upButtonBg);
    upButton.add(upButtonText);
    upButton.browserItem = true;
    
    container.add(upButton);
    
    // Make interactive
    upButton.setSize(listWidth, 20);
    upButton.setInteractive({ useHandCursor: true });
    
    upButton.on('pointerdown', () => {
        // Go up one directory
        this.navigateUp();
        this.populateFileBrowser(container, startX, startY);
    });
    
    upButton.on('pointerover', () => {
        upButtonBg.fillColor = 0x555555;
    });
    
    upButton.on('pointerout', () => {
        upButtonBg.fillColor = 0x444444;
    });
    
    yOffset += 25;
}
        
        // List directories first
        let entries = Object.entries(currentDir);
        
        // Sort entries to show directories first, then files
        entries.sort((a, b) => {
            const aIsDir = typeof a[1] === 'object';
            const bIsDir = typeof b[1] === 'object';
            
            if (aIsDir && !bIsDir) return -1;
            if (!aIsDir && bIsDir) return 1;
            return a[0].localeCompare(b[0]);
        });
        
        // Display entries
        entries.forEach(([name, content]) => {
            const isDirectory = typeof content === 'object';
            
            const itemButton = this.add.container(startX + 10, yOffset);
            
            const itemBg = this.add.rectangle(0, 0, 210, 20, 0x222222);
            itemBg.setOrigin(0, 0.5);
            
            // Use different color and icon for directories vs files
            const itemText = this.add.text(5, 0, (isDirectory ? '📁 ' : '📄 ') + name, {
                fontFamily: 'Courier New, monospace',
                fontSize: '12px',
                color: isDirectory ? '#66ccff' : '#ffffff',
                align: 'left'
            });
            itemText.setOrigin(0, 0.5);
            
            itemButton.add(itemBg);
            itemButton.add(itemText);
            itemButton.browserItem = true;
            
            container.add(itemButton);
            
            // Make interactive
            itemButton.setSize(210, 20);
            itemButton.setInteractive({ useHandCursor: true });
            
            // Add action when clicked
            itemButton.on('pointerdown', () => {
                if (isDirectory) {
                    // Navigate into directory
                    this.navigateTo(name);
                    this.populateFileBrowser(container, startX, startY);
                } else {
                    // Display file content hint
                    this.showFileContentHint(name, container);
                }
            });
            
            // Hover effects
            itemButton.on('pointerover', () => {
                itemBg.fillColor = 0x333333;
            });
            
            itemButton.on('pointerout', () => {
                itemBg.fillColor = 0x222222;
            });
            
            yOffset += 22;
        });
    }
    
    navigateTo(directoryName) {
        this.currentPath = this.currentPath + '/' + directoryName;
    }
    
    navigateUp() {
        const pathParts = this.currentPath.split('/');
        pathParts.pop();
        this.currentPath = pathParts.join('/');
    }
    
    getCurrentDirectory() {
        // Parse the path and traverse the file system object
        const pathParts = this.currentPath.split('/');
        let current = this.fileSystem;
        
        for (const part of pathParts) {
            if (part && current[part]) {
                current = current[part];
            }
        }
        
        return current;
    }
    
    showFileContentHint(fileName, container) {
        // Show a quick toast message when a file is clicked
        const toast = this.add.container(this.cameras.main.width / 2, this.cameras.main.height - 100);
        
        const toastBg = this.add.rectangle(0, 0, 400, 50, 0x333333, 0.9);
        toastBg.setStrokeStyle(1, 0xff9900);
        
        const toastText = this.add.text(0, 0, 'Use the File Includer to view: ' + this.currentPath + '/' + fileName, {
            fontFamily: 'Courier New, monospace',
            fontSize: '14px',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: 380 }
        });
        toastText.setOrigin(0.5);
        
        toast.add(toastBg);
        toast.add(toastText);
        
        // Add to scene directly not to container
        this.add.existing(toast);
        
        // Animation and auto-removal
        toast.setAlpha(0);
        
        this.tweens.add({
            targets: toast,
            alpha: 1,
            y: this.cameras.main.height - 120,
            duration: 300,
            ease: 'Power2',
            onComplete: () => {
                this.time.delayedCall(3000, () => {
                    this.tweens.add({
                        targets: toast,
                        alpha: 0,
                        y: this.cameras.main.height - 100,
                        duration: 300,
                        ease: 'Power2',
                        onComplete: () => {
                            toast.destroy();
                        }
                    });
                });
            }
        });
    }
    
    processFileInclusion(path, contentDisplay, statusDisplay, container) {
        // Add flash effect to show processing
        this.cameras.main.flash(100, 255, 153, 0, true);
        
        // Check if the path contains path traversal sequences
        let containsTraversal = false;
        this.exploitPatterns.forEach(pattern => {
            if (path.includes(pattern)) {
                containsTraversal = true;
            }
        });
        
        // Update the app URL to show the full request
        container.list.forEach(item => {
            if (item.type === 'Text' && item.text && item.text.startsWith('https://')) {
                item.setText('https://intranet.example.com/index.php?file=' + path);
            }
        });
        
        // Check if user is trying to access one of the target files
        let targetFound = null;
        let foundFileContent = null;
        
        if (containsTraversal) {
            // Parse the path by cleaning it for nested traversal
            let normalizedPath = this.normalizePath(path);
            
            // Check against target files
            this.targetFiles.forEach(targetPath => {
                if (normalizedPath === targetPath || path.endsWith(targetPath)) {
                    targetFound = targetPath;
                    
                    // Get file content by traversing the filesystem object
                    try {
                        const pathParts = targetPath.split('/');
                        let current = this.fileSystem;
                        
                        for (const part of pathParts) {
                            if (part && current[part]) {
                                current = current[part];
                            }
                        }
                        
                        if (typeof current === 'string') {
                            foundFileContent = current;
                        }
                    } catch (e) {
                        console.error("Error accessing file:", e);
                    }
                }
            });
            
            if (targetFound && !this.foundTargetFiles.includes(targetFound)) {
                // Add to found list
                this.foundTargetFiles.push(targetFound);
                
                // Show success indicator
                this.showSuccessIndicator(targetFound, container);
                
                // Check if all targets are found
                if (this.foundTargetFiles.length >= this.targetFiles.length) {
                    this.vulnerabilityExploited = true;
                    
                    // Show success after a delay
                    this.time.delayedCall(1500, () => {
                        this.showSuccessScreen(container);
                    });
                }
            }
        }
        
        // Display either the found file content or an error
        if (foundFileContent) {
            contentDisplay.setText(foundFileContent);
            contentDisplay.setColor('#ffcc33');
        } else {
            // Try to show some sensible response
            if (path.startsWith('../') || path.includes('../')) {
                contentDisplay.setText('Warning: Path traversal detected! Access attempt logged.\n\nBut wait... the file was still loaded?');
                contentDisplay.setColor('#ff6666');
            } else if (path === 'includes/header.php') {
                contentDisplay.setText('<?php echo "Header included"; ?>');
                contentDisplay.setColor('#ffffff');
            } else if (path === 'includes/footer.php') {
                contentDisplay.setText('<?php echo "Footer included"; ?>');
                contentDisplay.setColor('#ffffff');
            } else {
                contentDisplay.setText('Warning: File not found or permission denied.');
                contentDisplay.setColor('#ff6666');
            }
        }
        
        // Update status display
        statusDisplay.setText(
            'Challenge: Find 3 critical files outside the webroot - ' + 
            this.foundTargetFiles.length + '/3 found'
        );
    }
    
    normalizePath(path) {
        // Basic path normalization (not comprehensive)
        let normalized = path;
        
        // Replace encoded sequences
        normalized = normalized.replace(/%2e/gi, '.');
        
        // Remove multiple slashes
        normalized = normalized.replace(/\/+/g, '/');
        
        // Handle ../ sequences
        const parts = normalized.split('/');
        const resultParts = [];
        
        for (const part of parts) {
            if (part === '..') {
                resultParts.pop();
            } else if (part !== '.' && part !== '') {
                resultParts.push(part);
            }
        }
        
        // Reconstruct path
        if (resultParts.length > 0) {
            // If the path starts with webroot, remove it
            if (resultParts[0] === 'webroot') {
                resultParts.shift();
            }
            
            return resultParts.join('/');
        } else {
            return '';
        }
    }
    
    showSuccessIndicator(targetFile, container) {
        // Create a toast notification for critical file found
        const toast = this.add.container(this.cameras.main.width / 2, this.cameras.main.height / 2 - 50);
        
        const toastBg = this.add.rectangle(0, 0, 600, 80, 0x000000, 0.95);
        toastBg.setStrokeStyle(2, 0xff9900);
        
        const toastTitle = this.add.text(0, -25, 'CRITICAL FILE FOUND!', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '18px',
            fontStyle: 'bold',
            color: '#ff9900',
            align: 'center'
        });
        toastTitle.setOrigin(0.5);
        
        const toastText = this.add.text(0, 10, 'You successfully accessed the file: ' + targetFile, {
            fontFamily: 'Courier New, monospace',
            fontSize: '14px',
            color: '#ffffff',
            align: 'center'
        });
        toastText.setOrigin(0.5);
        
        toast.add(toastBg);
        toast.add(toastTitle);
        toast.add(toastText);
        
        // Add to scene directly
        this.add.existing(toast);
        
        // Animation
        toast.setAlpha(0);
        toast.setScale(0.8);
        
        this.tweens.add({
            targets: toast,
            alpha: 1,
            scale: 1,
            duration: 300,
            ease: 'Power2',
            onComplete: () => {
                // Particle celebration effect
                this.createSuccessParticles(this.cameras.main.width / 2, this.cameras.main.height / 2 - 50);
                
                this.time.delayedCall(2000, () => {
                    this.tweens.add({
                        targets: toast,
                        alpha: 0,
                        scale: 0.8,
                        duration: 300,
                        ease: 'Power2',
                        onComplete: () => {
                            toast.destroy();
                        }
                    });
                });
            }
        });
    }
    
    createSuccessParticles(x, y) {
        // Create particle effect for success
        const particles = this.add.particles('file_icon');
        
        particles.createEmitter({
            x: x,
            y: y,
            speed: { min: 100, max: 200 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.1, end: 0 },
            lifespan: 1000,
            quantity: 20,
            tint: [0xff9900, 0xffcc33, 0xff6600],
            blendMode: 'ADD'
        });
        
        // Auto-cleanup after 1 second
        this.time.delayedCall(1000, () => {
            particles.destroy();
        });
    }
    
    showHint(container) {
        // Create a hint popup
        const hintContainer = this.add.container(this.cameras.main.width / 2, this.cameras.main.height / 2);
        
        const hintBg = this.add.rectangle(0, 0, 500, 250, 0x000000, 0.9);
        hintBg.setStrokeStyle(2, 0xffcc00);
        
        const hintTitle = this.add.text(0, -100, 'PATH TRAVERSAL HINT', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '20px',
            fontStyle: 'bold',
            color: '#ffcc00',
            align: 'center'
        });
        hintTitle.setOrigin(0.5);
        
        const hints = [
            "1. The file parameter is vulnerable to path traversal.",
            "",
            "2. To access files outside the webroot, use '../' in your path.",
            "",
            "3. Try patterns like: ?file=../config/database.yml",
            "",
            "4. The server is running on Linux, so paths are case-sensitive.",
            "",
            "5. Look for configuration files and database backups."
        ].join('\n');
        
        const hintText = this.add.text(0, 0, hints, {
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            color: '#ffffff',
            align: 'center',
            lineSpacing: 5
        });
        hintText.setOrigin(0.5);
        
        const closeButton = this.add.rectangle(0, 100, 120, 30, 0xff9900);
        closeButton.setInteractive({ useHandCursor: true });
        
        const closeText = this.add.text(0, 100, 'CLOSE', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: '#ffffff',
            align: 'center'
        });
        closeText.setOrigin(0.5);
        
        // Add to hint container
        hintContainer.add(hintBg);
        hintContainer.add(hintTitle);
        hintContainer.add(hintText);
        hintContainer.add(closeButton);
        hintContainer.add(closeText);
        
        // Add to scene
        this.add.existing(hintContainer);
        
        // Animation for appearance
        hintContainer.setAlpha(0);
        hintContainer.setScale(0.8);
        
        this.tweens.add({
            targets: hintContainer,
            alpha: 1,
            scale: 1,
            duration: 300,
            ease: 'Power2'
        });
        
        // Close button action
        closeButton.on('pointerdown', () => {
            this.tweens.add({
                targets: hintContainer,
                alpha: 0,
                scale: 0.8,
                duration: 300,
                ease: 'Power2',
                onComplete: () => {
                    hintContainer.destroy();
                }
            });
        });
        
        // Hover effects
        closeButton.on('pointerover', () => {
            closeButton.fillColor = 0xffbb33;
        });
        
        closeButton.on('pointerout', () => {
            closeButton.fillColor = 0xff9900;
        });
    }
    
    showSuccessScreen(container) {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        
        // Create success container
        const successContainer = this.add.container(centerX, centerY);
        
        // Success background - INCREASED SIZE
        const successBg = this.add.rectangle(0, 0, 800, 500, 0x000000, 0.95);
        successBg.setStrokeStyle(3, 0xff9900);
        
        // Success header - MOVED UP
        const successHeader = this.add.text(0, -200, 'PATH TRAVERSAL EXPLOITED!', {
            fontFamily: 'Arial Black, Impact, sans-serif',
            fontSize: '36px',
            fontStyle: 'bold',
            color: '#ff9900',
            align: 'center'
        });
        successHeader.setOrigin(0.5);
        
        // Success message - ADJUSTED POSITION
        const successTitle = this.add.text(0, -140, 'You found all the critical files using LFI!', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '26px',
            color: '#ffffff',
            align: 'center'
        });
        successTitle.setOrigin(0.5);
        
        // Explanation - ADJUSTED POSITION
        // const explanationTitle = this.add.text(0, -80, 'What you learned:', {
        //     fontFamily: 'Arial, sans-serif',
        //     fontSize: '22px',
        //     fontStyle: 'bold',
        //     color: '#ff9900',
        //     align: 'center'
        // });
        // explanationTitle.setOrigin(0.5);
        
        // INCREASED LINE SPACING in explanation
        const explanation = [
            "• Local File Inclusion (LFI) vulnerabilities allow attackers to",
            "  access files outside the intended directories.",
            "",
            "• User-supplied input should never be directly used in file paths",
            "  without proper validation and sanitization.",
            "",
            "• Use allowlists instead of denylists to validate file paths.",
            "",
            "• Always store sensitive configuration files outside the web root."
        ].join('\n');
        
        // MOVED DOWN explanation text
        const explanationText = this.add.text(0, 30, explanation, {
            fontFamily: 'Arial, sans-serif',
            fontSize: '18px',
            color: '#ffffff',
            align: 'center',
            lineSpacing: 10  // INCREASED LINE SPACING
        });
        explanationText.setOrigin(0.5);
        
        // MOVED DOWN and SPREAD OUT buttons
        // Next level button - moved to the right
        const nextButton = this.add.rectangle(200, 180, 220, 50, 0xff9900);
        nextButton.setInteractive({ useHandCursor: true });
        
        const nextText = this.add.text(200, 180, 'NEXT CHALLENGE', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '20px',
            color: '#ffffff',
            align: 'center'
        });
        nextText.setOrigin(0.5);
        
        // Back to level select button - moved to the left
        const backButton = this.add.rectangle(-200, 180, 220, 50, 0xaa6633);
        backButton.setInteractive({ useHandCursor: true });
        
        const backText = this.add.text(-200, 180, 'LEVEL SELECT', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '20px',
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
        successContainer.add(nextButton);
        successContainer.add(nextText);
        successContainer.add(backButton);
        successContainer.add(backText);
        
        // Fade out the web app
        if (container) {
            this.tweens.add({
                targets: container,
                alpha: 0,
                duration: 500
            });
        }
        
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
                this.scene.start('A3LevelSelect'); // Return to A3 level select
            });
        });
        
        // Back button action
        backButton.on('pointerdown', () => {
            this.cameras.main.fade(800, 0, 0, 0);
            this.time.delayedCall(800, () => {
                this.scene.start('A3LevelSelect');
            });
        });
        
        // Hover effects
        nextButton.on('pointerover', () => {
            nextButton.fillColor = 0xffbb33;
            nextButton.scaleX = 1.05;
            nextButton.scaleY = 1.05;
            nextText.scaleX = 1.05;
            nextText.scaleY = 1.05;
        });
        
        nextButton.on('pointerout', () => {
            nextButton.fillColor = 0xff9900;
            nextButton.scaleX = 1;
            nextButton.scaleY = 1;
            nextText.scaleX = 1;
            nextText.scaleY = 1;
        });
        
        backButton.on('pointerover', () => {
            backButton.fillColor = 0xcc8855;
            backButton.scaleX = 1.05;
            backButton.scaleY = 1.05;
            backText.scaleX = 1.05;
            backText.scaleY = 1.05;
        });
        
        backButton.on('pointerout', () => {
            backButton.fillColor = 0xaa6633;
            backButton.scaleX = 1;
            backButton.scaleY = 1;
            backText.scaleX = 1;
            backText.scaleY = 1;
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