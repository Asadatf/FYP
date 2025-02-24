class PhishingGame extends Phaser.Game {
    constructor() {
        // Make sure we're using the updated config with all scenes
        const gameConfig = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: false
                }
            },
            scene: [BootScene, MenuScene, GameScene, GameOverScene],
            parent: 'game-container',
            backgroundColor: '#0a0a2a'
        };
        
        super(gameConfig);
        
        // Game properties
        this.score = 0;
        this.gameTime = 60;
        
        // Debug flag - set to true for debugging
        this.debug = false;
        
        // Register global event listeners
        this.events.on('score-update', this.updateScore, this);
        
        console.log('Phishing Defense Game Initialized');
    }
    
    updateScore(points) {
        this.score += points;
        this.events.emit('score-display', this.score);
    }
}