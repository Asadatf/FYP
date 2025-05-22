/**
 * Extension of the existing ChallengeA3Level1 class
 * Adds the back and reset buttons to the scene
 */
class ChallengeA3Level1Extension extends ChallengeA3Level1 {
    constructor() {
        super();
    }

    create() {
        // Call the original create method
        super.create();
        
        // Add back and reset buttons
        GameUIUtils.addLevelControlButtons(this, 'A3LevelSelect', 'ChallengeA3Level1');
    }
    
    // Override the showPreventionScreen method to add back button alongside next level
    showPreventionScreen() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        
        // Create prevention container
        const preventionContainer = this.add.container(centerX, centerY);
        
        // Prevention background
        const preventionBg = this.add.rectangle(0, 0, 650, 450, 0x221100, 0.95);
        preventionBg.setStrokeStyle(3, 0xff9900);
        
        // Prevention header
        const preventionHeader = this.add.text(0, -180, 'SQL INJECTION PREVENTION', {
            fontFamily: 'Arial Black, Impact, sans-serif',
            fontSize: '32px',
            fontStyle: 'bold',
            color: '#ff9900',
            align: 'center'
        });
        preventionHeader.setOrigin(0.5);
        
        // Explanation
        const explanationTitle = this.add.text(0, -130, 'How to prevent SQL Injection attacks:', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '22px',
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'center'
        });
        explanationTitle.setOrigin(0.5);
        
        // Prevention techniques
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
            color: '#00ff66',
            align: 'left'
        });
        
        const codeExample = this.add.text(0, 210, "// Instead of:\nquery = \"SELECT * FROM users WHERE username='\" + username + \"'\";\n\n// Use parameterized query:\npreparedStatement = connection.prepareStatement(\n    \"SELECT * FROM users WHERE username = ?\");\npreparedStatement.setString(1, username);", {
            fontFamily: 'Courier New, monospace',
            fontSize: '14px',
            color: '#00ff66',
            align: 'left'
        });
        codeExample.setOrigin(0.5);
        
        // Next level button
        const nextButton = this.add.rectangle(100, 180, 200, 50, 0xff9900);
        nextButton.setInteractive({ useHandCursor: true });
        
        const nextText = this.add.text(100, 180, 'NEXT LEVEL', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '20px',
            color: '#ffffff',
            align: 'center'
        });
        nextText.setOrigin(0.5);
        
        // Back to level select button
        const backButton = this.add.rectangle(-100, 180, 200, 50, 0x995500);
        backButton.setInteractive({ useHandCursor: true });
        
        const backText = this.add.text(-100, 180, 'LEVEL SELECT', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '20px',
            color: '#ffffff',
            align: 'center'
        });
        backText.setOrigin(0.5);
        
        // Add components to container
        preventionContainer.add(preventionBg);
        preventionContainer.add(preventionHeader);
        preventionContainer.add(explanationTitle);
        preventionContainer.add(preventionText);
        preventionContainer.add(codeLabel);
        preventionContainer.add(codeExample);
        preventionContainer.add(nextButton);
        preventionContainer.add(nextText);
        preventionContainer.add(backButton);
        preventionContainer.add(backText);
        
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
        
        // Back button action
        backButton.on('pointerdown', () => {
            this.cameras.main.fade(800, 0, 0, 0);
            this.time.delayedCall(800, () => {
                this.scene.start('A3LevelSelect');
            });
        });
        
        // Hover effects
        nextButton.on('pointerover', () => {
            nextButton.fillColor = 0xffaa33;
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
            backButton.fillColor = 0xcc7700;
            backButton.scaleX = 1.05;
            backButton.scaleY = 1.05;
            backText.scaleX = 1.05;
            backText.scaleY = 1.05;
        });
        
        backButton.on('pointerout', () => {
            backButton.fillColor = 0x995500;
            backButton.scaleX = 1;
            backButton.scaleY = 1;
            backText.scaleX = 1;
            backText.scaleY = 1;
        });
        
        // Victory particles with orange tint
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
            tint: 0xff9900,
            blendMode: 'ADD'
        });
    }
}