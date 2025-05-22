class ChallengeA3Level2 extends Phaser.Scene {
    constructor() {
        super('ChallengeA3Level2');
        this.currentStep = 0;
        
        // XSS vulnerability - tracking user's input and success state
        this.userInput = '';
        this.attackSuccessful = false;
        
        // Comments for the victim website
        this.comments = [
            { user: 'Sarah', content: 'Great website, very useful resource!' },
            { user: 'Mike', content: 'I wish there were more articles on this topic.' },
            { user: 'Taylor', content: 'Can you add a search feature?' }
        ];
    }

    preload() {
        // Load any specific assets for this challenge
        this.load.image('terminal_bg', 'assets/button.png');
    }

    create() {
        // Set up the challenge gameplay screen
        this.createBackground();
        this.createStartMessage();
    }
    
    createBackground() {
        // Create a dark background with purplish tint for XSS theme
        const bg = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x221133);
        bg.setOrigin(0, 0);
        
        // Create a subtle grid pattern
        const gridSize = 40;
        const graphics = this.add.graphics();
        graphics.lineStyle(1, 0x332255, 0.2);
        
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
        const message = this.add.text(centerX, centerY, 'CHALLENGE A3: LEVEL 2', {
            fontFamily: 'Courier New, monospace',
            fontSize: '32px',
            fontStyle: 'bold',
            color: '#cc66ff', // Purple for XSS theme
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
                    color: '#cc66ff'
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
        const subtitle = this.add.text(centerX, centerY + 50, 'Cross-Site Scripting (XSS): Reflected Attack', {
            fontFamily: 'Courier New, monospace',
            fontSize: '20px',
            color: '#dd99ff', // Lighter purple
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
        popupBg.setStrokeStyle(2, 0xcc66ff);
        
        // Popup header
        const popupHeader = this.add.text(0, -140, 'CROSS-SITE SCRIPTING (XSS)', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '28px',
            fontStyle: 'bold',
            color: '#cc66ff',
            align: 'center'
        });
        popupHeader.setOrigin(0.5);
        
        // Popup content
        const content = [
            "XSS occurs when untrusted user input is incorrectly incorporated",
            "into web pages, allowing attackers to insert and execute malicious",
            "JavaScript code in other users' browsers.",
            "",
            "Your goal: Inject a script tag into a comment field that will",
            "display an alert box when the page renders the comment."
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
        const buttonBg = this.add.rectangle(0, 130, 200, 50, 0xcc66ff);
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
                    this.showXSSGame();
                }
            });
        });
        
        // Hover effects for button
        buttonBg.on('pointerover', () => {
            buttonBg.fillColor = 0xdd99ff;
        });
        
        buttonBg.on('pointerout', () => {
            buttonBg.fillColor = 0xcc66ff;
        });
    }
    
    showXSSGame() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        
        // Create website container
        const websiteContainer = this.add.container(centerX, centerY);
        
        // Website background (light background to mimic a real site)
        const websiteBg = this.add.rectangle(0, 0, 800, 600, 0xf0f0f0, 0.95);
        websiteBg.setStrokeStyle(2, 0xcc66ff);
        
        // Website header
        const headerBar = this.add.rectangle(0, -200, 650, 50, 0x663399);
        
        const siteTitle = this.add.text(0, -200, 'Tech Blog Community', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '24px',
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'center'
        });
        siteTitle.setOrigin(0.5);
        
        // Comments section title
        const commentsTitle = this.add.text(0, -130, 'Comments', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '22px',
            fontStyle: 'bold',
            color: '#333333',
            align: 'center'
        });
        commentsTitle.setOrigin(0.5);
        
        // Display existing comments
        const commentsBg = this.add.rectangle(0, -30, 600, 150, 0xffffff);
        commentsBg.setStrokeStyle(1, 0xcccccc);
        
        // Add existing comments
        let yPos = -100;
        this.comments.forEach(comment => {
            const commentText = this.add.text(-280, yPos, `${comment.user}: ${comment.content}`, {
                fontFamily: 'Arial, sans-serif',
                fontSize: '16px',
                color: '#333333',
                align: 'left',
                wordWrap: { width: 550 }
            });
            commentText.setOrigin(0, 0.5);
            websiteContainer.add(commentText);
            yPos += 40;
        });
        
        // Add comment form
        const formTitle = this.add.text(0, 60, 'Add Your Comment:', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '18px',
            fontStyle: 'bold',
            color: '#333333',
            align: 'center'
        });
        formTitle.setOrigin(0.5);
        
        // Username field
        const usernameLabel = this.add.text(-290, 90, 'Name:', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: '#333333',
            align: 'left'
        });
        
        const usernameBox = this.add.rectangle(-115, 100, 160, 30, 0xffffff);
        usernameBox.setStrokeStyle(1, 0xcccccc);
        
        const usernameInput = this.add.text(-150, 100, 'Hacker', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: '#333333',
            align: 'left'
        });
        usernameInput.setOrigin(0, 0.5);
        
        // Comment field
        const commentLabel = this.add.text(-290, 130, 'Comment:', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: '#333333',
            align: 'left'
        });
        
        const commentBox = this.add.rectangle(45, 140, 480, 30, 0xffffff);
        commentBox.setStrokeStyle(1, 0xcccccc);
        commentBox.setInteractive({ useHandCursor: true });
        
        // Input text field 
        let inputText = '';
        const inputTextDisplay = this.add.text(-230, 130, inputText, {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: '#333333',
            align: 'left'
        });
        inputTextDisplay.setOrigin(0, 0.5);
        
        // Make comment field interactive
        commentBox.on('pointerdown', () => {
            // Visual feedback
            commentBox.fillColor = 0xf5f5f5;
            commentBox.setStrokeStyle(2, 0xcc66ff);
            
            // Instruction for input
            statusText.setText('Type your XSS payload and click Submit');
            statusText.setColor('#333333');
        });
        
        // Submit button
        const submitButton = this.add.rectangle(0, 250, 150, 40, 0x663399);
        submitButton.setInteractive({ useHandCursor: true });
        
        const submitText = this.add.text(0, 250, 'Submit', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '18px',
            color: '#ffffff',
            align: 'center'
        });
        submitText.setOrigin(0.5);
        
        // Status message
        const statusText = this.add.text(0, 210, 'Enter your comment...', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: '#333333',
            align: 'center'
        });
        statusText.setOrigin(0.5);
        
        // Add components to website container
        websiteContainer.add(websiteBg);
        websiteContainer.add(headerBar);
        websiteContainer.add(siteTitle);
        websiteContainer.add(commentsTitle);
        websiteContainer.add(commentsBg);
        websiteContainer.add(formTitle);
        websiteContainer.add(usernameLabel);
        websiteContainer.add(usernameBox);
        websiteContainer.add(usernameInput);
        websiteContainer.add(commentLabel);
        websiteContainer.add(commentBox);
        websiteContainer.add(inputTextDisplay);
        websiteContainer.add(submitButton);
        websiteContainer.add(submitText);
        websiteContainer.add(statusText);
        
        // Hint button
        const hintButton = this.add.rectangle(270, -200, 80, 30, 0x441177);
        hintButton.setInteractive({ useHandCursor: true });
        
        const hintText = this.add.text(270, -200, 'HINT', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            color: '#ffffff',
            align: 'center'
        });
        hintText.setOrigin(0.5);
        
        websiteContainer.add(hintButton);
        websiteContainer.add(hintText);
        
        // Hint functionality
        hintButton.on('pointerdown', () => {
            statusText.setText("Hint: Try using <script>alert('XSS')</script> to execute JavaScript");
            statusText.setColor('#cc66ff');
        });
        
        // Animation for website appearance
        websiteContainer.setAlpha(0);
        
        this.tweens.add({
            targets: websiteContainer,
            alpha: 1,
            duration: 500,
            ease: 'Power2'
        });
        
        // Setup keyboard input
        this.input.keyboard.on('keydown', (event) => {
            // Handle backspace
            if (event.keyCode === 8 && inputText.length > 0) {
                inputText = inputText.slice(0, -1);
                inputTextDisplay.setText(inputText);
                return;
            }
            
            // Handle Enter key (submit)
            if (event.keyCode === 13) {
                this.checkXSSAttack(inputText, statusText, websiteContainer);
                return;
            }
            
            // Handle regular text input
            if (event.key.length === 1 || event.key === '<' || event.key === '>' || event.key === '/') {
                // Limit input length
                if (inputText.length < 50) {
                    inputText += event.key;
                    inputTextDisplay.setText(inputText);
                }
            }
        });
        
        // Submit button functionality
        submitButton.on('pointerdown', () => {
            this.checkXSSAttack(inputText, statusText, websiteContainer);
        });
        
        // Hover effects for submit button
        submitButton.on('pointerover', () => {
            submitButton.fillColor = 0x8844cc;
        });
        
        submitButton.on('pointerout', () => {
            submitButton.fillColor = 0x663399;
        });
        
        // Hover effects for hint button
        hintButton.on('pointerover', () => {
            hintButton.fillColor = 0x662299;
        });
        
        hintButton.on('pointerout', () => {
            hintButton.fillColor = 0x441177;
        });
    }
    
    checkXSSAttack(input, statusText, websiteContainer) {
        // Check if the XSS attack is successful
        // Look for script tags or other XSS vectors
        const successPatterns = [
            "<script>",
            "javascript:",
            "onerror=",
            "onload="
        ];
        
        let success = false;
        for (const pattern of successPatterns) {
            if (input.toLowerCase().includes(pattern.toLowerCase())) {
                success = true;
                break;
            }
        }
        
        if (success) {
            // XSS successful - show the effect in a popup
            statusText.setText('Comment submitted! Processing...');
            
            // Simulate page processing the comment
            this.time.delayedCall(1000, () => {
                this.showXSSSuccess(input, websiteContainer);
            });
            
            // Track success for completion
            this.attackSuccessful = true;
        } else if (input.includes('<') || input.includes('>')) {
            // Attempted XSS but not successful
            statusText.setText("You're on the right track! Try including a script tag.");
            statusText.setColor('#cc66ff');
        } else {
            // Regular comment
            statusText.setText('Comment submitted, but no security vulnerability exploited.');
            statusText.setColor('#333333');
        }
    }
    
    showXSSSuccess(input, websiteContainer) {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        
        // Create XSS simulation container
        const xssContainer = this.add.container(centerX, centerY);
        
        // Make a simulated browser alert box to show XSS impact
        const alertBg = this.add.rectangle(0, 0, 400, 200, 0xffffff, 0.95);
        alertBg.setStrokeStyle(2, 0x999999);
        
        // Alert header
        const alertHeader = this.add.rectangle(0, -80, 400, 40, 0xeeeeee);
        alertHeader.setStrokeStyle(1, 0x999999);
        
        const alertIcon = this.add.text(-180, -80, '⚠️', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '20px',
            align: 'center'
        });
        alertIcon.setOrigin(0, 0.5);
        
        const alertTitle = this.add.text(-150, -80, 'JavaScript Execution - XSS Attack', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            fontStyle: 'bold',
            color: '#333333',
            align: 'left'
        });
        alertTitle.setOrigin(0, 0.5);
        
        // Alert message
        const alertMessage = this.add.text(0, 0, 'XSS attack successful!\n\nYour script has been injected and executed\nas if it were part of the original website.\n\nIn a real attack, this could steal cookies,\nredirect users, or manipulate the page.', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: '#333333',
            align: 'center'
        });
        alertMessage.setOrigin(0.5);
        
        // Alert OK button
        const okButton = this.add.rectangle(0, 80, 100, 30, 0x0066cc);
        okButton.setInteractive({ useHandCursor: true });
        
        const okText = this.add.text(0, 80, 'OK', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: '#ffffff',
            align: 'center'
        });
        okText.setOrigin(0.5);
        
        // Add components to XSS container
        xssContainer.add(alertBg);
        xssContainer.add(alertHeader);
        xssContainer.add(alertIcon);
        xssContainer.add(alertTitle);
        xssContainer.add(alertMessage);
        xssContainer.add(okButton);
        xssContainer.add(okText);
        
        // Fade out website
        this.tweens.add({
            targets: websiteContainer,
            alpha: 0.3,
            duration: 300
        });
        
        // Animation for XSS alert appearance
        xssContainer.setAlpha(0);
        xssContainer.setScale(0.8);
        
        this.tweens.add({
            targets: xssContainer,
            alpha: 1,
            scale: 1,
            duration: 300,
            ease: 'Power2'
        });
        
        // OK button action - show prevention screen
        okButton.on('pointerdown', () => {
            this.tweens.add({
                targets: [xssContainer, websiteContainer],
                alpha: 0,
                scale: 0.8,
                duration: 300,
                ease: 'Power2',
                onComplete: () => {
                    xssContainer.destroy();
                    websiteContainer.destroy();
                    this.showXSSPreventionScreen();
                }
            });
        });
        
        // Hover effects for OK button
        okButton.on('pointerover', () => {
            okButton.fillColor = 0x0088ee;
        });
        
        okButton.on('pointerout', () => {
            okButton.fillColor = 0x0066cc;
        });
    }
    
    showXSSPreventionScreen() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        
        // Create prevention container
        const preventionContainer = this.add.container(centerX, centerY);
        
        // Prevention background
        const preventionBg = this.add.rectangle(0, 0, 650, 450, 0x221133, 0.95);
        preventionBg.setStrokeStyle(3, 0xcc66ff);
        
        // Prevention header
        const preventionHeader = this.add.text(0, -180, 'XSS PREVENTION', {
            fontFamily: 'Arial Black, Impact, sans-serif',
            fontSize: '32px',
            fontStyle: 'bold',
            color: '#cc66ff',
            align: 'center'
        });
        preventionHeader.setOrigin(0.5);
        
        // Explanation
        const explanationTitle = this.add.text(0, -130, 'How to prevent Cross-Site Scripting attacks:', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '22px',
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'center'
        });
        explanationTitle.setOrigin(0.5);
        
        // Prevention techniques
        const techniques = [
            "1. Output Encoding/Escaping:",
            "   - Convert special characters to their HTML entities",
            "   - < becomes &lt;, > becomes &gt;, etc.",
            "",
            "2. Input Validation and Sanitization:",
            "   - Whitelist allowed characters and formats",
            "   - Remove or encode dangerous tags/attributes",
            "",
            "3. Content Security Policy (CSP):",
            "   - Restrict which scripts can execute on your page",
            "",
            "4. Use modern frameworks:",
            "   - React, Angular, Vue automatically escape content"
        ].join('\n');
        
        const preventionText = this.add.text(0, 20, techniques, {
            fontFamily: 'Arial, sans-serif',
            fontSize: '18px',
            color: '#ffffff',
            align: 'left',
            lineSpacing: 8
        });
        preventionText.setOrigin(0.5);
        
        // Code example
        const codeLabel = this.add.text(-290, 180, 'SECURE CODE EXAMPLE:', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: '#cc66ff',
            align: 'left'
        });
        
        const codeExample = this.add.text(0, 210, "// Instead of:\ndocument.innerHTML = userInput;\n\n// Use encoding/escaping:\nfunction escapeHTML(str) {\n  return str.replace(/[&<>\"']/g, (char) => {\n    return '&' + {'&':'amp','<':'lt','>':'gt','\"':'quot',\"'\":'#39'}[char] + ';';\n  });\n}\ndocument.innerHTML = escapeHTML(userInput);", {
            fontFamily: 'Courier New, monospace',
            fontSize: '14px',
            color: '#cc66ff',
            align: 'left'
        });
        codeExample.setOrigin(0.5);
        
        // Next level button
        const nextButton = this.add.rectangle(0, 180, 200, 50, 0xcc66ff);
        nextButton.setInteractive({ useHandCursor: true });
        
        const nextText = this.add.text(0, 180, 'NEXT LEVEL', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '20px',
            color: '#ffffff',
            align: 'center'
        });
        nextText.setOrigin(0.5);
        
        // Add components to container
        preventionContainer.add(preventionBg);
        preventionContainer.add(preventionHeader);
        preventionContainer.add(explanationTitle);
        preventionContainer.add(preventionText);
        preventionContainer.add(codeLabel);
        preventionContainer.add(codeExample);
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
                this.scene.start('ChallengeA3Level3'); // Transition to next level (Path Traversal)
            });
        });
        
        // Hover effects
        nextButton.on('pointerover', () => {
            nextButton.fillColor = 0xdd99ff;
            nextButton.scaleX = 1.05;
            nextButton.scaleY = 1.05;
            nextText.scaleX = 1.05;
            nextText.scaleY = 1.05;
        });
        
        nextButton.on('pointerout', () => {
            nextButton.fillColor = 0xcc66ff;
            nextButton.scaleX = 1;
            nextButton.scaleY = 1;
            nextText.scaleX = 1;
            nextText.scaleY = 1;
        });
        
        // Victory particles with purple tint
        const particles = this.add.particles('terminal_bg');
        
        particles.createEmitter({
            x: { min: 0, max: this.cameras.main.width },
            y: -50,
            speed: { min: 100, max: 200 },
            angle: { min: 80, max: 100 },
            scale: { start: 0.2, end: 0 },
            lifespan: 4000,
            quantity: 2,
            frequency: 40,
            tint: 0xcc66ff,
            blendMode: 'ADD'
        });
    }

    update() {
        // Game logic that runs on every frame
    }
}