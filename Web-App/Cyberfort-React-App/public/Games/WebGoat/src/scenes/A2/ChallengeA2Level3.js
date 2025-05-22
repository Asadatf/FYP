class ChallengeA2Level3 extends Phaser.Scene {
    constructor() {
        super('ChallengeA2Level3');
        this.currentStep = 0;

        // Secret key that player needs to find
        this.secretKey = "MySuperSecretKey123";

        // Encrypted message that will be decrypted
        this.encryptedMessage = "Ghs27Jsh1a9Mkl02";

        // Decrypted message to show after success
        this.decryptedMessage = "Bank Account: 1234-5678-9000";

        // Source code containing the secret key - simplified version for better readability
        this.sourceCode = `package com.webapp.security;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

/**
* Encryption utility for our webapp
* @author developer
*/
public class Encryption {
    public static void main(String[] args) {
        // Initialize encryption system
        String secretKey = "MySuperSecretKey123"; // KEY HERE!
        String encryptedMessage = "Ghs27Jsh1a9Mkl02";

        try {
            String decrypted = decrypt(encryptedMessage, secretKey);
            System.out.println("Decrypted: " + decrypted);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
    * Encrypts data using AES
    */
    public static String encrypt(String data, String key){
        SecretKeySpec secretKey = new SecretKeySpec();
        Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
        cipher.init(Cipher.ENCRYPT_MODE, secretKey);
        return Base64.getEncoder().encodeToString();}}`;

        // Track if the decryption was successful
        this.decryptionSuccess = false;

        // Add to the constructor:
        this.listenersActive = false;
    }

    preload() {
        // Load any specific assets for this challenge
        this.load.image('terminal_bg', 'assets/terminal_bg.png');
        // Make sure to load the particle image
        this.load.image('button', 'assets/button.png');
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
        const message = this.add.text(centerX, centerY, 'CHALLENGE A2: LEVEL 3', {
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
        const subtitle = this.add.text(centerX, centerY + 50, 'Key Chaos: The Lost Encryption Key', {
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
        const popupHeader = this.add.text(0, -140, 'IMPROPER KEY MANAGEMENT', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '28px',
            fontStyle: 'bold',
            color: '#33cc99',
            align: 'center'
        });
        popupHeader.setOrigin(0.5);

        // Popup content
        const content = [
            "Encryption protects sensitive data, but if keys are exposed,",
            "attackers can decrypt everything!",
            "",
            "Your goal: Find the encryption key hidden in the source code",
            "and use it to decrypt the message!"
        ].join('\n');

        const popupContent = this.add.text(0, 0, content, {
            fontFamily: 'Arial, sans-serif',
            fontSize: '18px',
            color: '#ffffff',
            align: 'center',
            lineSpacing: 10
        });
        popupContent.setOrigin(0.5);

        // Continue button
        const buttonBg = this.add.rectangle(0, 130, 200, 50, 0x33cc99);
        buttonBg.setInteractive({ useHandCursor: true });

        const buttonText = this.add.text(0, 130, 'START', {
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
                    this.showKeyManagementGame();
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

    showKeyManagementGame() {
        // Clear everything first
        this.children.removeAll(true);
        
        // Recreate background
        this.createBackground();
        
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Create a global container
        const gameContainer = this.add.container(width/2, height/2);
        
        // Main background with proper fit to screen
        const gameBg = this.add.rectangle(0, 0, width - 20, height - 20, 0x001100, 1);
        gameBg.setStrokeStyle(3, 0x33ff99);
        gameContainer.add(gameBg);
        
        // Title at the top
        const gameTitle = this.add.text(0, -height/2 + 40, 'FIND THE SECRET ENCRYPTION KEY', {
            fontFamily: 'Arial Black, sans-serif',
            fontSize: '28px',
            fontStyle: 'bold',
            color: '#33ff99',
            align: 'center'
        });
        gameTitle.setOrigin(0.5);
        gameContainer.add(gameTitle);
        
        // Instructions below title
        const instructions = this.add.text(0, -height/2 + 80, 'Scan the source code to find the hardcoded encryption key', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '18px',
            color: '#ffffff',
            align: 'center'
        });
        instructions.setOrigin(0.5);
        gameContainer.add(instructions);
        
        // === LEFT PANEL - SOURCE CODE ===
        const panelSpacing = 20; // Space between panels
        const panelWidth = (width - 60 - panelSpacing * 2) / 3; // Equal panels with margins
        const panelHeight = height - 160; // Height with room for title & instructions
        
        // Source code panel (left)
        const sourcePanel = this.add.rectangle(
            -panelWidth - panelSpacing, 
            0,
            panelWidth, 
            panelHeight,
            0x000000,
            1
        );
        sourcePanel.setStrokeStyle(2, 0x33ff99);
        gameContainer.add(sourcePanel);
        
        // Source code panel title
        const sourceTitle = this.add.text(
            -panelWidth - panelSpacing,
            -panelHeight/2 + 20,
            'SOURCE CODE',
            {
                fontFamily: 'Arial Black, sans-serif',
                fontSize: '20px',
                fontStyle: 'bold',
                color: '#33ff99',
                align: 'center'
            }
        );
        sourceTitle.setOrigin(0.5);
        gameContainer.add(sourceTitle);
        
        // Scroll hint
        const scrollHint = this.add.text(
            -panelWidth - panelSpacing,
            -panelHeight/2 + 50,
            '(SCROLL OR USE MOUSE WHEEL)',
            {
                fontFamily: 'Arial, sans-serif',
                fontSize: '12px',
                color: '#ffcc00',
                align: 'center'
            }
        );
        scrollHint.setOrigin(0.5);
        gameContainer.add(scrollHint);
        
        const codeBox = this.add.rectangle(
            -panelWidth - panelSpacing,
            0,
            panelWidth - 20,
            panelHeight - 100,
            0x002211,
            1
        );
        codeBox.setOrigin(0.6);
        // gameContainer.add(codeBox);

        // Format source code to highlight the key
        const lines = this.sourceCode.split('\n');
        // const keyIndex = lines.findIndex(line => line.includes("String secretKey ="));
        
        // Create text objects for each line with proper styling
        const lineHeight = 22;
        const contentStartY = -panelHeight/2 + 80;
        const maxVisibleLines = Math.floor((panelHeight - 100) / lineHeight);
        const textContainer = this.add.container(-panelWidth - panelSpacing, 0);
        gameContainer.add(textContainer);
        
        for (let i = 0; i < lines.length; i++) {
            const y = contentStartY + (i * lineHeight);
            
            // Format the text - highlight the key line
            const color = '#aaffcc';
            const prefix = '';
            const suffix  = '';
            
            const lineText = this.add.text(
                -panelWidth/2 + 25, // Left-aligned with margin
                y,
                prefix + lines[i] + suffix,
                {
                    fontFamily: 'Courier New, monospace',
                    fontSize: '14px',
                    color: color,
                    align: 'left'
                }
            );
            lineText.setOrigin(0, 0);
            textContainer.add(lineText);
            textContainer.y = 0; // Make sure it's not offscreen initially

        }
        
        const codeMask = this.make.graphics({ x: 0, y: 0, add: false });
        codeMask.fillStyle(0xffffff);

        codeMask.fillRect(
            -panelWidth - panelSpacing - (panelWidth - 30) / 2,
            -panelHeight / 2 + 80,
            panelWidth - 40,
            panelHeight - 100
        );

        const mask = codeMask.createGeometryMask();

        
        // === MIDDLE PANEL - ENCRYPTED MESSAGE ===
        const middlePanel = this.add.rectangle(
            0,
            50, 
            panelWidth,
            panelHeight,
            0x000000,
            1
        );
        middlePanel.setStrokeStyle(2, 0x33ff99);
        gameContainer.add(middlePanel);
        
        // Encrypted message title
        const messageTitle = this.add.text(
            0,
            -panelHeight/2 + 75,
            'ENCRYPTED MESSAGE',
            {
                fontFamily: 'Arial Black, sans-serif',
                fontSize: '20px',
                fontStyle: 'bold',
                color: '#33ff99',
                align: 'center'
            }
        );
        messageTitle.setOrigin(0.5);
        gameContainer.add(messageTitle);
        
        // Encrypted message value - positioned below title with good spacing
        const encryptedText = this.add.text(
            0,
            -panelHeight/2 + 120,
            this.encryptedMessage,
            {
                fontFamily: 'Courier New, monospace',
                fontSize: '24px',
                color: '#ffaa33',
                align: 'center',
                fontStyle: 'bold'
            }
        );
        encryptedText.setOrigin(0.5);
        gameContainer.add(encryptedText);
        
        // === RIGHT PANEL - DECRYPTION INPUT ===
        const rightPanel = this.add.rectangle(
            panelWidth + panelSpacing,
            0,
            panelWidth,
            panelHeight,
            0x000000,
            1
        );
        rightPanel.setStrokeStyle(2, 0x33ff99);
        gameContainer.add(rightPanel);
        
        // Decryption panel title
        const decryptTitle = this.add.text(
            panelWidth + panelSpacing,
            -panelHeight/2 + 20,
            'ENTER DECRYPTION KEY',
            {
                fontFamily: 'Arial Black, sans-serif',
                fontSize: '20px',
                fontStyle: 'bold',
                color: '#33ff99',
                align: 'center'
            }
        );
        decryptTitle.setOrigin(0.5);
        gameContainer.add(decryptTitle);
        
        // Input box with good positioning
        const inputBox = this.add.rectangle(
            panelWidth + panelSpacing,
            -panelHeight/2 + 80,
            panelWidth - 40,
            50,
            0x003322,
            1
        );
        inputBox.setStrokeStyle(2, 0x33cc99);
        inputBox.setInteractive({ useHandCursor: true });
        gameContainer.add(inputBox);
        
        // Input text display
        let inputText = '';
        const inputTextDisplay = this.add.text(
            panelWidth + panelSpacing,
            -panelHeight/2 + 80,
            inputText + '|',
            {
                fontFamily: 'Courier New, monospace',
                fontSize: '20px',
                color: '#ffffff',
                align: 'center'
            }
        );
        inputTextDisplay.setOrigin(0.5);
        gameContainer.add(inputTextDisplay);
        
        // Input hint
        const inputHint = this.add.text(
            panelWidth + panelSpacing,
            -panelHeight/2 + 115,
            "Click to activate keyboard input",
            {
                fontFamily: 'Arial, sans-serif',
                fontSize: '12px',
                color: '#aaaaaa',
                align: 'center'
            }
        );
        inputHint.setOrigin(0.5);
        gameContainer.add(inputHint);
        
        // Create blinking cursor effect
        const cursorTimer = this.time.addEvent({
            delay: 500,
            callback: () => {
                if (inputTextDisplay.text.endsWith('|')) {
                    if (inputTextDisplay && inputTextDisplay.scene) {
                        inputTextDisplay.setText(inputText + '|');
                    }
                } else {
                    if (inputTextDisplay && inputTextDisplay.scene) {
                        inputTextDisplay.setText(inputText + '|');
                    }
                }
            },
            loop: true
        });
        
        // Decrypt button
        const decryptButton = this.add.rectangle(
            panelWidth + panelSpacing,
            -panelHeight/2 + 170,
            panelWidth - 40,
            50,
            0x33cc99,
            1
        );
        decryptButton.setInteractive({ useHandCursor: true });
        gameContainer.add(decryptButton);
        
        const decryptText = this.add.text(
            panelWidth + panelSpacing,
            -panelHeight/2 + 170,
            'DECRYPT',
            {
                fontFamily: 'Arial Black, sans-serif',
                fontSize: '20px',
                color: '#ffffff',
                align: 'center'
            }
        );
        decryptText.setOrigin(0.5);
        gameContainer.add(decryptText);
        
        // Result display area
        const resultBox = this.add.rectangle(
            panelWidth + panelSpacing,
            -panelHeight/2 + 250,
            panelWidth - 40,
            80,
            0x003322,
            1
        );
        resultBox.setStrokeStyle(2, 0x33cc99);
        gameContainer.add(resultBox);
        
        const resultText = this.add.text(
            panelWidth + panelSpacing,
            -panelHeight/2 + 250,
            'Decryption result will appear here',
            {
                fontFamily: 'Courier New, monospace',
                fontSize: '14px',
                color: '#999999',
                align: 'center',
                wordWrap: { width: panelWidth - 60 }
            }
        );
        resultText.setOrigin(0.5);
        gameContainer.add(resultText);
        
        // Hint text
        const hintText = this.add.text(
            panelWidth + panelSpacing,
            -panelHeight/2 + 320,
            'Hint: Keys should never be in the source code.\nLook for something that seems like a secret!',
            {
                fontFamily: 'Arial, sans-serif',
                fontSize: '14px',
                color: '#ffcc00',
                align: 'center',
                wordWrap: { width: panelWidth - 60 }
            }
        );
        hintText.setOrigin(0.5);
        gameContainer.add(hintText);
        
        // Reveal button (hint)
        const revealButton = this.add.rectangle(
            panelWidth + panelSpacing,
            -panelHeight/2 + 380,
            panelWidth - 40,
            40,
            0x663300,
            1
        );
        revealButton.setInteractive({ useHandCursor: true });
        gameContainer.add(revealButton);
        
        const revealText = this.add.text(
            panelWidth + panelSpacing,
            -panelHeight/2 + 380,
            'REVEAL KEY (HINT)',
            {
                fontFamily: 'Arial, sans-serif',
                fontSize: '16px',
                color: '#ffffff',
                align: 'center'
            }
        );
        revealText.setOrigin(0.5);
        gameContainer.add(revealText);
        
        // Status message at the bottom of the screen
        const statusText = this.add.text(
            0,
            panelHeight/2 - 30,
            'Find the secret key in the source code and enter it above',
            {
                fontFamily: 'Arial, sans-serif',
                fontSize: '18px',
                color: '#ffffff',
                align: 'center'
            }
        );
        statusText.setOrigin(0.5);
        gameContainer.add(statusText);
        
//         // === SCROLLING FUNCTIONALITY FOR TEXT CONTAINER ===
//         let isScrolling = false;
//         let startY = 0;
//         let scrollY = 0;
//         const maxScroll = -Math.max(0, contentHeight - (panelHeight - 100));
        
//         // Setup scrolling for source code
//         sourcePanel.setInteractive({ useHandCursor: true })
//         .on('pointerdown', (pointer) => {
//             isScrolling = true;
//             startY = pointer.y;
//         })
//         .on('pointermove', (pointer) => {
//             if (isScrolling) {
//                 const diff = pointer.y - startY;
//                 scrollY += diff;
                
//                 // Limit scrolling
//                 scrollY = Phaser.Math.Clamp(scrollY, maxScroll, 0);
                
//                 textContainer.y = scrollY;
                
//                 // Update scrollbar position
//                 const scrollRatio = maxScroll !== 0 ? scrollY / maxScroll : 0;
//                 const scrollHandleY = -scrollbarHeight/2 + handleHeight/2 + (scrollRatio * (scrollbarHeight - handleHeight));
//                 scrollbarHandle.y = scrollHandleY;
                
//                 startY = pointer.y;
//             }
//         })
//         .on('pointerup', () => {
//             isScrolling = false;
//         });
        
//  // Mouse wheel scrolling
//  this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
//     // Check if pointer is over source panel
//     const bounds = sourcePanel.getBounds();
//     if (pointer.x >= bounds.left && pointer.x <= bounds.right &&
//         pointer.y >= bounds.top && pointer.y <= bounds.bottom) {
        
//         // Adjust scroll position
//         scrollY -= deltaY * 0.5;
//         scrollY = Phaser.Math.Clamp(scrollY, maxScroll, 0);
        
//         // Update text container position
//         textContainer.y = scrollY;
        
//         // Update scrollbar position
//         const scrollRatio = maxScroll !== 0 ? scrollY / maxScroll : 0;
//         const scrollHandleY = -scrollbarHeight/2 + handleHeight/2 + (scrollRatio * (scrollbarHeight - handleHeight));
//         scrollbarHandle.y = scrollHandleY;
//     }
// });
        
        // === INPUT HANDLING ===
        // Setup keyboard input
        let keyboardActive = false;
        
        inputBox.on('pointerdown', () => {
            keyboardActive = true;
            inputHint.setText("Keyboard input active");
            inputHint.setColor('#00ff66');
            inputBox.setStrokeStyle(3, 0x66ffcc);
        });
        
        // Allow clicking elsewhere to deactivate keyboard
        gameBg.setInteractive({ useHandCursor: false })
        .on('pointerdown', (pointer) => {
            // Only deactivate if clicking outside input box
            const inputBoxBounds = inputBox.getBounds();
            if (!Phaser.Geom.Rectangle.Contains(
                inputBoxBounds, pointer.x, pointer.y)) {
                keyboardActive = false;
                inputHint.setText("Click to activate keyboard input");
                inputHint.setColor('#aaaaaa');
                inputBox.setStrokeStyle(2, 0x33cc99);
            }
        });
        
        // Keyboard input handling
        this.input.keyboard.on('keydown', (event) => {
            if (!keyboardActive) return;
            
            // Handle backspace
            if (event.keyCode === 8 && inputText.length > 0) {
                inputText = inputText.slice(0, -1);
                inputTextDisplay.setText(inputText + '|');
                return;
            }
            
            // Handle regular text input
            if ((event.keyCode >= 48 && event.keyCode <= 90) ||  // Numbers and uppercase letters
                (event.keyCode >= 96 && event.keyCode <= 111) || // Numpad
                (event.keyCode >= 186 && event.keyCode <= 222) || // Special characters
                event.keyCode === 32) { // Space
                
                // Limit input length
                if (inputText.length < 25) {
                    inputText += event.key;
                    inputTextDisplay.setText(inputText + '|');
                }
            }
            
            // Handle Enter key
            if (event.keyCode === 13) {
                checkDecryptionKey();
            }
        });
        
        // Decrypt button action
        decryptButton.on('pointerdown', () => {
            checkDecryptionKey();
        });
        
        // Button hover effects
        decryptButton.on('pointerover', () => {
            decryptButton.fillColor = 0x66eebb;
        });
        
        decryptButton.on('pointerout', () => {
            decryptButton.fillColor = 0x33cc99;
        });
        
        revealButton.on('pointerover', () => {
            revealButton.fillColor = 0x995500;
        });
        
        revealButton.on('pointerout', () => {
            revealButton.fillColor = 0x663300;
        });
        
        // Reveal button action
        revealButton.on('pointerdown', () => {
            statusText.setText('The key is: ' + this.secretKey);
            statusText.setColor('#ffcc00');
        });
        
        // Function to check decryption key
        const checkDecryptionKey = () => {
            if (inputText === this.secretKey) {
                // Success - show decrypted message
                resultText.setText(this.decryptedMessage);
                resultText.setColor('#00ff66');
                
                statusText.setText('You found the encryption key! But in the real world, attackers could use this to decrypt sensitive data!');
                statusText.setColor('#00ff66');
                
                this.decryptionSuccess = true;
                
                // Show success message after a delay
                this.time.delayedCall(2000, () => {
                    this.showSuccessPopup(gameContainer);
                });
            } else if (inputText.length > 0) {
                // Wrong key
                resultText.setText('Decryption failed! Wrong key.');
                resultText.setColor('#ff6666');
                
                statusText.setText('That key didn\'t work! Look for something suspicious in the source code!');
                statusText.setColor('#ff6666');
            }
        };
        const backButton = GameUIUtils.createBackButton(this, 'A2LevelSelect', 80, 40);
        const resetButton = GameUIUtils.createResetButton(this, 'ChallengeA2Level3', this.cameras.main.width - 40, 40);

        // Make sure buttons are on top of other elements
        backButton.setDepth(100);
        resetButton.setDepth(100);
    }

    showSuccessPopup(gameContainer) {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        // Create success message container
        const successContainer = this.add.container(centerX, centerY);

        // Success message background
        const successBg = this.add.rectangle(0, 0, 600, 350, 0x000000, 0.95);
        successBg.setStrokeStyle(2, 0x33cc99);

        // Success message title
        const successTitle = this.add.text(0, -140, 'KEY FOUND!', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '32px',
            fontStyle: 'bold',
            color: '#33cc99',
            align: 'center'
        });
        successTitle.setOrigin(0.5);

        // Success message content
        const content = [
            "Well done! This is why hardcoded keys are dangerous—anyone",
            "with access to the code can decrypt sensitive data!",
            "",
            "Always store encryption keys securely, using key vaults",
            "or environment variables!"
        ].join('\n');

        const successContent = this.add.text(0, 0, content, {
            fontFamily: 'Arial, sans-serif',
            fontSize: '18px',
            color: '#ffffff',
            align: 'center',
            lineSpacing: 10
        });
        successContent.setOrigin(0.5);

        // Continue button
        const continueButton = this.add.rectangle(0, 130, 250, 50, 0x33cc99);
        continueButton.setInteractive({ useHandCursor: true });

        const continueText = this.add.text(0, 130, 'CONTINUE', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '20px',
            color: '#ffffff',
            align: 'center'
        });
        continueText.setOrigin(0.5);

        // Add components to the message container
        successContainer.add(successBg);
        successContainer.add(successTitle);
        successContainer.add(successContent);
        successContainer.add(continueButton);
        successContainer.add(continueText);

        // Fade out the game container
        this.tweens.add({
            targets: gameContainer,
            alpha: 0.3,
            duration: 300
        });

        // Animation for message appearance
        successContainer.setAlpha(0);
        successContainer.setScale(0.8);

        this.tweens.add({
            targets: successContainer,
            alpha: 1,
            scale: 1,
            duration: 300,
            ease: 'Power2'
        });

        // Continue button action
        continueButton.on('pointerdown', () => {
            this.tweens.add({
                targets: [successContainer, gameContainer],
                alpha: 0,
                scale: 0.8,
                duration: 300,
                ease: 'Power2',
                onComplete: () => {
                    successContainer.destroy();
                    gameContainer.destroy();
                    this.showSuccessScreen();
                }
            });
        });

        // Hover effects for button
        continueButton.on('pointerover', () => {
            continueButton.fillColor = 0x66eebb;
        });

        continueButton.on('pointerout', () => {
            continueButton.fillColor = 0x33cc99;
        });

    }
}