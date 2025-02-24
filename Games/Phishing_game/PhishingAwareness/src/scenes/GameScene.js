class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.score = 0;
        this.timeLeft = 10;
        this.messages = [];
        this.gameActive = true;
    }

    create() {
        // Setup background
        this.add.image(400, 300, 'background');

        // Setup UI
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '24px',
            fill: '#fff'
        });

        this.timeText = this.add.text(16, 50, 'Time: ' + this.timeLeft, {
            fontSize: '24px',
            fill: '#fff'
        });

        // Create continuous message spawning
        this.time.addEvent({
            delay: 2000,
            callback: this.spawnMessage,
            callbackScope: this,
            loop: true
        });

        // Create continuous timer
        this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
    }

    spawnMessage() {
        if (!this.gameActive) return;

        const messageData = {
            text: 'This is a test message\n' + Math.random().toFixed(5),
            isPhishing: Math.random() > 0.5,
            type: 'email'
        };

        const x = Phaser.Math.Between(100, 700);
        const message = new Message(this, x, -50, messageData);
        this.messages.push(message);
    }

    processGuess(message) {
        if (!message || message.isClicked || !this.gameActive) return;

        message.isClicked = true;
        const correct = message.data.isPhishing;
        
        // Update score
        this.score += correct ? 10 : -5;
        this.scoreText.setText('Score: ' + this.score);

        // Show feedback
        message.showFeedback(correct);

        // Schedule removal
        this.time.delayedCall(500, () => {
            const index = this.messages.indexOf(message);
            if (index > -1) {
                this.messages.splice(index, 1);
                if (message && message.active) {
                    message.removeFromGame();
                }
            }
        });
    }

    updateTimer() {
        if (!this.gameActive) return;
        
        this.timeLeft--;
        this.timeText.setText('Time: ' + this.timeLeft);

        if (this.timeLeft <= 0) {
            this.gameActive = false;
            this.endGame();
        }
    }

    update() {
        if (!this.gameActive) return;

        // Clean up off-screen messages
        this.messages = this.messages.filter(message => {
            if (message && message.y > 650) {
                message.removeFromGame();
                return false;
            }
            return true;
        });
    }

    endGame() {
        this.scene.start('GameOverScene');
    }
}