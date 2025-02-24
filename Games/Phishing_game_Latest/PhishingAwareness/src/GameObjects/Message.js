class Message {
    constructor(scene, x, y, data) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.data = data;
        this.isClicked = false;
        this.speed = Phaser.Math.Between(70, 120);

        // Create message container
        this.container = scene.add.container(x, y);
        scene.physics.world.enable(this.container);
        this.container.body.setVelocityY(this.speed);
        
        // Create message background with cyber theme
        const backgroundColor = data.isPhishing ? 0xff3333 : 0x333333;
        const borderColor = data.isPhishing ? 0xff0000 : 0x00ffff;
        
        this.background = scene.add.rectangle(0, 0, 300, 100, backgroundColor, 0.8)
            .setStrokeStyle(2, borderColor);
        
        // Add subtle digital pattern
        const pattern = scene.add.grid(0, 0, 300, 100, 10, 10, 0, 0, 0x000000, 0.1);
        
        // Create message text with improved formatting
        let messageText = '';
        
        if (data.type === 'email') {
            // Format as email
            messageText = `From: ${data.sender || 'unknown@domain.com'}\n`;
            messageText += `Subject: ${data.subject || 'Important Message'}\n\n`;
            messageText += data.text || 'Click here to verify your account';
        } else {
            messageText = data.text;
        }
        
        this.text = scene.add.text(0, 0, messageText, {
            fontSize: '14px',
            fill: '#fff',
            wordWrap: { width: 280 },
            align: 'left'
        }).setOrigin(0.5);

        // Add components to container
        this.container = scene.add.container(x, y, [this.background, pattern, this.text]);
        scene.physics.world.enable(this.container);
        this.container.body.setVelocityY(this.speed);

        // Make interactive with improved effects
        this.background.setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.handleClick())
            .on('pointerover', () => {
                if (!this.isClicked) {
                    this.background.setFillStyle(0x444444, 0.9);
                    this.container.setScale(1.05);
                }
            })
            .on('pointerout', () => {
                if (!this.isClicked) {
                    this.background.setFillStyle(backgroundColor, 0.8);
                    this.container.setScale(1);
                }
            });
    }

    handleClick() {
        if (!this.isClicked && this.scene.gameActive) {
            this.isClicked = true;
            const correct = this.data.isPhishing;
            
            // Update score with effects
            const scoreChange = correct ? 10 : -5;
            
            if (typeof this.scene.score !== 'undefined') {
                this.scene.score += scoreChange;
                if (this.scene.scoreText) {
                    this.scene.scoreText.setText('Score: ' + this.scene.score);
                    
                    // Add score change animation
                    const scoreEffect = this.scene.add.text(this.x, this.y - 30, 
                        (scoreChange > 0 ? '+' : '') + scoreChange, {
                        fontSize: '24px',
                        fontFamily: 'Arial',
                        fill: correct ? '#00ff00' : '#ff0000',
                        stroke: '#000',
                        strokeThickness: 3
                    }).setOrigin(0.5);
                    
                    this.scene.tweens.add({
                        targets: scoreEffect,
                        y: scoreEffect.y - 50,
                        alpha: 0,
                        duration: 800,
                        onComplete: () => scoreEffect.destroy()
                    });
                }
            } else {
                // Fallback to global score variable if scene.score isn't available
                if (typeof score !== 'undefined') {
                    score += scoreChange;
                    if (typeof scoreText !== 'undefined') {
                        scoreText.setText('Score: ' + score);
                    }
                }
            }
            
            // Show feedback with effects
            this.showFeedback(correct);

            // Schedule removal with animation
            this.scene.time.delayedCall(500, () => {
                // Remove from messages array
                if (this.scene.messages && this.scene.messages.indexOf(this) > -1) {
                    this.scene.messages.splice(this.scene.messages.indexOf(this), 1);
                } else if (typeof messages !== 'undefined' && messages.indexOf(this) > -1) {
                    // Fallback to global messages array
                    messages.splice(messages.indexOf(this), 1);
                }
                
                this.destroy();
            });
        }
    }

    showFeedback(correct) {
        const color = correct ? 0x00ff00 : 0xff0000;
        
        // Flash effect
        this.scene.cameras.main.flash(100, 
            correct ? 0 : 255, 
            correct ? 255 : 0, 
            0, 0.3);
        
        // Set background color for feedback
        this.background.setFillStyle(color, 0.8);
        
        // Add explosion effect for correct identification
        if (correct) {
            // Create particle explosion
            const particles = this.scene.add.particles(this.x, this.y, 'particle', {
                speed: { min: 50, max: 150 },
                scale: { start: 1, end: 0 },
                lifespan: 500,
                blendMode: 'ADD',
                quantity: 20
            });
            
            // Auto-destroy particles
            this.scene.time.delayedCall(500, () => {
                particles.destroy();
            });
        }
        
        // Add text feedback
        const feedbackText = this.scene.add.text(this.x, this.y, 
            correct ? 'THREAT ELIMINATED!' : 'SECURITY BREACH!', {
            fontSize: '20px',
            fontFamily: 'Arial',
            fill: correct ? '#00ff00' : '#ff0000',
            stroke: '#000',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        // Animate feedback text
        this.scene.tweens.add({
            targets: feedbackText,
            y: feedbackText.y - 50,
            alpha: 0,
            duration: 800,
            onComplete: () => feedbackText.destroy()
        });
        
        // Shake camera for wrong answers
        if (!correct) {
            this.scene.cameras.main.shake(200, 0.01);
        }
    }

    destroy() {
        // Fade out animation
        this.scene.tweens.add({
            targets: this.container,
            alpha: 0,
            scaleX: 0.8,
            scaleY: 0.8,
            duration: 200,
            onComplete: () => {
                if (this.container) {
                    this.container.destroy();
                }
            }
        });
    }
}