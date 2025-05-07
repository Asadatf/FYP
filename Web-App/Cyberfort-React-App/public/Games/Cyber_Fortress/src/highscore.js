// Define HighScore in the global scope
// This needs to be loaded BEFORE any scenes that use it
class HighScore {
  constructor() {
    this.highScore =
      parseInt(localStorage.getItem("cyberFortressHighScore")) || 0;
  }

  getHighScore() {
    return this.highScore;
  }

  updateHighScore(score) {
    if (score > this.highScore) {
      this.highScore = score;
      localStorage.setItem("cyberFortressHighScore", score);
      return true;
    }
    return false;
  }
}
