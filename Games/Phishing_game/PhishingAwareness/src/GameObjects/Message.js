class Message {
    constructor(scene, x, y, data) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.data = data;
        this.isClicked = false;

        // Create message background
        this.background = scene.add.rectangle(x, y, 300, 100, 0x333333);
        
        // Create message text
        this.text = scene.add.text(x, y, data.text, {
            fontSize: '16px',
            fill: '#fff',
            wordWrap: { width: 280 }
        }).setOrigin(0.5);

        // Setup physics
        this.container = scene.add.container(x, y, [this.background, this.text]);
        scene.physics.world.enable(this.container);
        this.container.body.setVelocityY(50);

        // Make interactive
        this.background.setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.handleClick())
            .on('pointerover', () => {
                if (!this.isClicked) {
                    this.background.setFillStyle(0x444444);
                }
            })
            .on('pointerout', () => {
                if (!this.isClicked) {
                    this.background.setFillStyle(0x333333);
                }
            });
    }

    handleClick() {
        if (!this.isClicked && gameActive) {
            this.isClicked = true;
            const correct = this.data.isPhishing;
            
            // Update score
            score += correct ? 10 : -5;
            scoreText.setText('Score: ' + score);

            // Show feedback
            this.showFeedback(correct);

            // Schedule removal
            this.scene.time.delayedCall(500, () => {
                const index = messages.indexOf(this);
                if (index > -1) {
                    messages.splice(index, 1);
                    this.destroy();
                }
            });
        }
    }

    showFeedback(correct) {
        const color = correct ? 0x00ff00 : 0xff0000;
        this.background.setFillStyle(color);
        
        const feedbackText = this.scene.add.text(this.x, this.y - 30, 
            correct ? 'Correct!' : 'Wrong!', {
            fontSize: '20px',
            fill: correct ? '#00ff00' : '#ff0000',
            stroke: '#000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: feedbackText,
            y: feedbackText.y - 50,
            alpha: 0,
            duration: 500,
            onComplete: () => feedbackText.destroy()
        });
    }

    destroy() {
        this.container.destroy();
        this.background.destroy();
        this.text.destroy();
    }
}