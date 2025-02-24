class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Load assets
        this.load.image('background', 'assets/background.png');
        this.load.image('message', 'assets/message.png');
        this.load.image('button', 'assets/button.png');
        // Add more asset loading here
    }

    create() {
        this.scene.start('MenuScene');
    }
}