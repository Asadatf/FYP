class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        const title = this.add.text(400, 200, 'Phishing Awareness Game', {
            fontSize: '32px',
            fill: '#fff'
        }).setOrigin(0.5);

        const startButton = this.add.text(400, 300, 'Start Game', {
            fontSize: '24px',
            fill: '#fff',
            backgroundColor: '#333',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive();

        startButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}