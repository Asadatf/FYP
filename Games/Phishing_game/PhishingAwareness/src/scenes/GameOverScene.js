class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this.finalScore = data.score;
    }

    create() {
        const gameOver = this.add.text(400, 200, 'Game Over!', {
            fontSize: '48px',
            fill: '#fff'
        }).setOrigin(0.5);

        const scoreText = this.add.text(400, 300, `Final Score: ${this.finalScore}`, {
            fontSize: '32px',
            fill: '#fff'
        }).setOrigin(0.5);

        const restartButton = this.add.text(400, 400, 'Play Again', {
            fontSize: '24px',
            fill: '#fff',
            backgroundColor: '#333',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive();

        restartButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}