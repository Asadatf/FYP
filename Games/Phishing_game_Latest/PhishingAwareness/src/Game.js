class PhishingGame extends Phaser.Game {
  constructor() {
    // Make sure we're using the updated config with all scenes

    super(config);

    // Game properties
    this.score = 0;
    this.gameTime = 60;

    // Debug flag - set to true for debugging
    this.debug = false;

    // Register global event listeners
    this.events.on("score-update", this.updateScore, this);

    console.log("Phishing Defense Game Initialized");
  }

  updateScore(points) {
    this.score += points;
    this.events.emit("score-display", this.score);
  }
}
