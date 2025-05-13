// Game class definition - assumes scene classes are already in global scope
class Game extends Phaser.Game {
  constructor() {
    // Game configuration
    const config = {
      type: Phaser.AUTO,
      parent: "game-container",
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: "#1a1a1a",
      scene: [
        BootScene,
        PreloadScene,
        MenuScene,
        GameScene,
        LevelCompleteScene,
        GameOverScene,
        PortScanMiniGame, // Port Scan mini-game
        PasswordCrackMiniGame, // Password Crack mini-game
        MalwareWhackMiniGame,
        DDOSMiniGame,
        RansomwareMiniGame,
        RootkitMiniGame,
      ],
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 },
          debug: false,
        },
      },
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth,
        height: window.innerHeight,
      },
    };

    super(config);

    // Handle window resize
    window.addEventListener("resize", () => {
      this.scale.resize(window.innerWidth, window.innerHeight);
    });
  }
}
