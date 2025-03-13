class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.score = 0;
        this.timeLeft = 60;
        this.messages = [];
        this.gameActive = true;
        this.combo = 0;
        this.difficulty = 1;
    }

    create() {
        // Setup background
        if (this.textures.exists('background')) {
            this.add.image(400, 300, 'background');
        } else {
            // Fallback if image isn't loaded
            const bg = this.add.rectangle(400, 300, 800, 600, 0x0a0a2a);
            
            // Add grid lines
            const gridGraphics = this.add.graphics();
            gridGraphics.lineStyle(1, 0x00ffff, 0.2);
            
            // Draw vertical lines
            for (let x = 0; x <= 800; x += 40) {
                gridGraphics.moveTo(x, 0);
                gridGraphics.lineTo(x, 600);
            }
            
            // Draw horizontal lines
            for (let y = 0; y <= 600; y += 40) {
                gridGraphics.moveTo(0, y);
                gridGraphics.lineTo(800, y);
            }
            
            gridGraphics.strokePath();
        }
        
        // Add player representation at bottom of screen
        if (this.textures.exists('player')) {
            this.player = this.add.image(400, 520, 'player').setScale(0.7);
        } else {
            // Fallback player representation
            this.player = this.add.rectangle(400, 520, 60, 30, 0x00ffff);
        }
        
        // Add crosshair cursor
        if (this.textures.exists('crosshair')) {
            this.crosshair = this.add.image(400, 300, 'crosshair').setScale(0.5);
            this.input.on('pointermove', (pointer) => {
                this.crosshair.x = pointer.x;
                this.crosshair.y = pointer.y;
            });
            this.input.setDefaultCursor('none');
        }
        
        // Create enhanced UI
        this.createUI();
        
        // Add digital scanner effect
        const scanLine = this.add.rectangle(400, 0, 800, 2, 0x00ffff, 0.3);
        this.tweens.add({
            targets: scanLine,
            y: 600,
            duration: 3000,
            repeat: -1
        });
        
        // Add shield effect at bottom of screen
        const shieldGraphics = this.add.graphics();
        shieldGraphics.lineStyle(2, 0x00ffff, 0.5);
        shieldGraphics.strokeSemiCircle(400, 600, 200, 0, 180);
        
        // Create pulse animation for shield
        this.tweens.add({
            targets: shieldGraphics,
            alpha: 0.2,
            duration: 1500,
            yoyo: true,
            repeat: -1
        });
        
        // Start background music
        if (this.sound.get('bgmusic')) {
            const music = this.sound.add('bgmusic', {
                volume: 0.6,
                loop: true
            });
            music.play();
        }
        
        // Setup shooting mechanics
        this.input.on('pointerdown', (pointer) => {
            // Create firing effect from player to cursor
            const line = new Phaser.Geom.Line(this.player.x, this.player.y - 20, pointer.x, pointer.y);
            const fireGraphics = this.add.graphics();
            fireGraphics.lineStyle(2, 0x00ffff, 0.8);
            fireGraphics.strokeLineShape(line);
            
            // Flash effect
            this.tweens.add({
                targets: fireGraphics,
                alpha: 0,
                duration: 200,
                onComplete: () => {
                    fireGraphics.destroy();
                }
            });
            
            // Play shooting sound
            if (this.sound.get('click')) {
                this.sound.play('click');
            }
            
            // Check if hit any messages
            this.messages.forEach(message => {
                if (message && message.container && 
                    !message.isClicked && 
                    Phaser.Geom.Rectangle.Contains(
                        message.container.getBounds(), 
                        pointer.x, 
                        pointer.y
                    )
                ) {
                    message.handleClick();
                }
            });
        });
        
        // Create continuous message spawning with variable rate based on difficulty
        this.messageSpawnEvent = this.time.addEvent({
            delay: 2000,
            callback: this.spawnMessage,
            callbackScope: this,
            loop: true
        });

        // Create continuous timer
        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
        
        // Add difficulty increasing over time
        this.difficultyEvent = this.time.addEvent({
            delay: 10000, // Increase difficulty every 10 seconds
            callback: this.increaseDifficulty,
            callbackScope: this,
            loop: true
        });
    }
    
    createUI() {
        // Create UI panel with cyber style
        this.uiPanel = this.add.rectangle(400, 30, 780, 50, 0x000000, 0.7)
            .setStrokeStyle(2, 0x00ffff, 0.8);
        
        // Add score text with cyber font
        this.scoreText = this.add.text(16, 30, 'Score: 0', {
            fontSize: '24px',
            fontFamily: 'Arial',
            fill: '#00ffff'
        }).setOrigin(0, 0.5);
        
        // Add time text
        this.timeText = this.add.text(784, 30, 'Time: ' + this.timeLeft, {
            fontSize: '24px',
            fontFamily: 'Arial',
            fill: '#00ffff'
        }).setOrigin(1, 0.5);
        
        // Add combo counter
        this.comboText = this.add.text(400, 30, 'Combo: x1', {
            fontSize: '20px',
            fontFamily: 'Arial',
            fill: '#ffff00'
        }).setOrigin(0.5, 0.5);
        this.comboText.setVisible(false); // Hidden initially
        
        // Add threat level indicator
        this.threatLevel = this.add.text(400, 580, 'THREAT LEVEL: 1', {
            fontSize: '16px',
            fontFamily: 'Arial',
            fill: '#ff3333'
        }).setOrigin(0.5, 0.5);
    }
    
    increaseDifficulty() {
        if (!this.gameActive) return;
        
        // Increase difficulty
        this.difficulty += 0.5;
        
        // Update spawn rate based on difficulty
        const newDelay = Math.max(500, 2000 - (this.difficulty * 200));
        this.messageSpawnEvent.delay = newDelay;
        this.messageSpawnEvent.timeScale = 1;
        
        // Make messages faster as difficulty increases
        this.messages.forEach(message => {
            if (message.container && message.container.body) {
                message.container.body.velocity.y += 10;
            }
        });
        
        // Update threat level display
        this.threatLevel.setText(`THREAT LEVEL: ${Math.floor(this.difficulty)}`);
        
        // Flash effect on threat level increase
        this.threatLevel.setScale(1.5);
        this.tweens.add({
            targets: this.threatLevel,
            scale: 1,
            duration: 300
        });
    }

    spawnMessage() {
        if (!this.gameActive) return;
        
        // Create message data with more varied content
        const subjects = [
            'Your account needs verification', 
            'Security alert', 
            'Invoice attached',
            'Password reset request',
            'Your package is ready',
            'Urgent: Action required',
            'Suspicious activity detected'
        ];
        
        const senders = [
            'support@banksite.com',
            'amazon-services@amaz0n.com',
            'security@paypa1.com',
            'noreply@microsoft-verify.net',
            'accounts@g00gle.org',
            'help@apple-id.co',
            'billing@netflix-accounts.com'
        ];
        
        const texts = [
            'Please verify your account immediately',
            'Click here to restore access to your account',
            'Your payment is overdue. Update now.',
            'Weve detected unusual activity',
            'Your package will be delivered today',
            'Please confirm your information',
            'Download your invoice attachment'
        ];
        
        // Higher difficulty = more phishing messages
        const isPhishing = Math.random() < (0.4 + (this.difficulty * 0.05));
        
        // Select random content
        const randomIndex = Math.floor(Math.random() * subjects.length);
        const messageData = {
            text: texts[randomIndex],
            subject: subjects[Math.floor(Math.random() * subjects.length)],
            sender: senders[Math.floor(Math.random() * senders.length)],
            isPhishing: isPhishing,
            type: 'email'
        };

        // Spawn at random x position
        const x = Phaser.Math.Between(100, 700);
        const message = new Message(this, x, -50, messageData);
        this.messages.push(message);
    }

    updateTimer() {
        if (!this.gameActive) return;
        
        this.timeLeft--;
        this.timeText.setText('Time: ' + this.timeLeft);

        // Add urgency as time runs low
        if (this.timeLeft <= 10) {
            this.timeText.setStyle({ 
                fontSize: '24px',
                fontFamily: 'Arial',
                fill: '#ff0000' 
            });
            
            // Pulse effect for final countdown
            if (this.timeLeft <= 5) {
                this.timeText.setScale(1.2);
                this.tweens.add({
                    targets: this.timeText,
                    scale: 1,
                    duration: 500
                });
            }
        }

        if (this.timeLeft <= 0) {
            this.gameActive = false;
            this.endGame();
        }
    }

    update() {
        if (!this.gameActive) return;

        // Clean up off-screen messages and handle missed threats
        this.messages = this.messages.filter(message => {
            if (message && message.container && message.container.y > 650) {
                // If player missed a phishing email, penalize
                if (message.data.isPhishing) {
                    this.score = Math.max(0, this.score - 5);
                    this.scoreText.setText('Score: ' + this.score);
                    
                    // Visual feedback
                    this.cameras.main.flash(200, 255, 0, 0, 0.3);
                    
                    // Play error sound
                    if (this.sound.get('wrong')) {
                        this.sound.play('wrong');
                    }
                    
                    // Reset combo
                    this.combo = 0;
                    this.comboText.setText('Combo: x' + this.combo);
                    this.comboText.setVisible(false);
                    
                    // Show security breach effect
                    const breach = this.add.text(message.container.x, 550, 'BREACH!', {
                        fontSize: '24px',
                        fontFamily: 'Arial',
                        fill: '#ff0000',
                        stroke: '#000',
                        strokeThickness: 4
                    }).setOrigin(0.5);
                    
                    this.tweens.add({
                        targets: breach,
                        y: breach.y - 50,
                        alpha: 0,
                        duration: 800,
                        onComplete: () => breach.destroy()
                    });
                } else {
                    // Reward for correctly letting legitimate messages through
                    this.score += 2;
                    this.scoreText.setText('Score: ' + this.score);
                    
                    // Increase combo
                    this.combo++;
                    this.comboText.setText('Combo: x' + this.combo);
                    
                    // Show combo when it gets interesting
                    if (this.combo >= 2) {
                        this.comboText.setVisible(true);
                        this.comboText.setScale(1.2);
                        this.tweens.add({
                            targets: this.comboText,
                            scale: 1,
                            duration: 200
                        });
                    }
                }
                
                message.destroy();
                return false;
            }
            return true;
        });
        
        // Make player follow mouse horizontally if exists
        if (this.player) {
            const targetX = Phaser.Math.Clamp(this.input.x, 100, 700);
            this.player.x = Phaser.Math.Linear(this.player.x, targetX, 0.05);
        }
    }

    endGame() {
        // Stop all events
        this.messageSpawnEvent.remove();
        this.timerEvent.remove();
        this.difficultyEvent.remove();
        
        // Fade out background music if playing
        if (this.sound.get('bgmusic')) {
            const music = this.sound.get('bgmusic');
            this.tweens.add({
                targets: music,
                volume: 0,
                duration: 1000,
                onComplete: () => {
                    music.stop();
                }
            });
        }
        
        // Show mission complete/failed text
        const statusText = this.score >= 50 ? 'MISSION COMPLETE' : 'MISSION FAILED';
        const statusColor = this.score >= 50 ? '#00ff00' : '#ff0000';
        
        const finalText = this.add.text(400, 300, statusText, {
            fontSize: '48px',
            fontFamily: 'Arial Black',
            fill: statusColor,
            stroke: '#000',
            strokeThickness: 6
        }).setOrigin(0.5).setAlpha(0);
        
        // Dramatic reveal
        this.tweens.add({
            targets: finalText,
            alpha: 1,
            scale: 1.2,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                // Save final score
                const finalScore = this.score;
                
                // Transition to game over scene
                this.cameras.main.fade(1000, 0, 0, 0);
                this.time.delayedCall(1000, () => {
                    this.scene.start('GameOverScene', { score: finalScore });
                });
            }
        });
    }
}