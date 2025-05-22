/**
 * Extension of the existing ChallengeA3Level2 class
 * Adds the back and reset buttons to the scene
 */
class ChallengeA3Level2Extension extends ChallengeA3Level2 {
    constructor() {
        super();
    }

    create() {
        // Call the original create method
        super.create();
        
        // Add back and reset buttons
        GameUIUtils.addLevelControlButtons(this, 'A3LevelSelect', 'ChallengeA3Level2');
    }
    
    // Override the showXSSPreventionScreen method to add back button alongside next level
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
        const nextButton = this.add.rectangle(100, 180, 200, 50, 0xcc66ff);
        nextButton.setInteractive({ useHandCursor: true });
        
        const nextText = this.add.text(100, 180, 'NEXT LEVEL', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '20px',
            color: '#ffffff',
            align: 'center'
        });
        nextText.setOrigin(0.5);
        
        // Back to level select button
        const backButton = this.add.rectangle(-100, 180, 200, 50, 0x662288);
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
                this.scene.start('ChallengeA3Level3'); // Transition to next level (Path Traversal)
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
        
        backButton.on('pointerover', () => {
            backButton.fillColor = 0x884499;
            backButton.scaleX = 1.05;
            backButton.scaleY = 1.05;
            backText.scaleX = 1.05;
            backText.scaleY = 1.05;
        });
        
        backButton.on('pointerout', () => {
            backButton.fillColor = 0x662288;
            backButton.scaleX = 1;
            backButton.scaleY = 1;
            backText.scaleX = 1;
            backText.scaleY = 1;
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
}