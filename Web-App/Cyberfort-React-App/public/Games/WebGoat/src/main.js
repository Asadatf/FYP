// Updated Game configuration for main.js
// Add ChallengeA2Level3Extension to the scene list

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.RESIZE,
        parent: 'game',
        width: '100%',
        height: '100%',
        min: {
            width: 800,
            height: 600
        }
    },
    backgroundColor: '#000000',
    
    scene: [
        TitleScreen, 
        ChallengesScreen,
        // A1 Challenge scenes
        A1LevelSelect,
        ChallengeA1GameplayExtension, 
        ChallengeA1Level2Extension, 
        ChallengeA1Level3Extension, 
        ChallengeA1Level4Extension,
        // A2 Challenge scenes
        ChallengeA2Screen,
        A2LevelSelect,
        ChallengeA2Level1Extension,
        ChallengeA2Level2Extension,
        ChallengeA2Level3Extension,
        ChallengeA2Level4Extension,
        //A3 Challenge scenes
        ChallengeA3Screen,
        A3LevelSelect,
        ChallengeA3Level1Extension,
        ChallengeA3Level2Extension,
        ChallengeA3Level3Extension,
        GameScene
    ],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};

// Create the game instance
const game = new Phaser.Game(config);