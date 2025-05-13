// SoundManager.js - A utility for safely handling sound in the game
class SoundManager {
  constructor(scene) {
    this.scene = scene;
    this.soundEnabled = false; // Default to no sound
    this.sounds = {};
  }

  // Initialize sound system (call this in create())
  init() {
    // Check if WebAudio is actually available
    this.soundEnabled = this.scene.sound.context.state !== "suspended";

    // Register common sounds used in the game
    this.registerSound("success");
    this.registerSound("failure");
    this.registerSound("level-up");
    this.registerSound("button-click");

    console.log(
      `Sound system initialized. Sound enabled: ${this.soundEnabled}`
    );
    return this;
  }

  // Register a sound that might be used later
  registerSound(key) {
    // Only create actual sound objects if sound is enabled
    if (this.soundEnabled && !this.sounds[key]) {
      try {
        // Create a silent sound as a placeholder
        const sound = this.scene.sound.add(key);
        this.sounds[key] = sound;
      } catch (e) {
        console.warn(`Could not create sound: ${key}`);
        this.sounds[key] = null;
      }
    }
  }

  // Play a sound safely - won't error if sound isn't available
  play(key, config = {}) {
    if (this.soundEnabled && this.sounds[key]) {
      try {
        this.sounds[key].play(config);
      } catch (e) {
        console.warn(`Could not play sound: ${key}`);
      }
    }
  }
}

// Export for global use
window.SoundManager = SoundManager;
