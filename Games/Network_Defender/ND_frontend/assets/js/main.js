var config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  scene: [BootScene, TitleScene, GameScene, TutorialScene, UiScene],
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
    parent: "NetworkDefender",
    width: "100%",
    height: "100%",
  },
  dom: {
    createContainer: true,
  },
  input: {
    activePointers: 3, // Support for multi-touch
  },
};

// Add event listener for orientation changes on mobile devices
window.addEventListener("orientationchange", function () {
  // Wait a bit for the orientation to fully change
  setTimeout(function () {
    if (game) {
      // Adjust game size to match new dimensions
      game.scale.resize(window.innerWidth, window.innerHeight);

      // Force a redraw of any active scene
      if (game.scene.getScenes(true)[0]) {
        const activeScene = game.scene.getScenes(true)[0];
        if (activeScene.handleResize) {
          activeScene.handleResize({
            width: window.innerWidth,
            height: window.innerHeight,
          });
        }
      }
    }
  }, 200);
});

// Add listener for window resize
window.addEventListener("resize", function () {
  if (game) {
    // Debounce resize handling to avoid constant updates
    if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(function () {
      try {
        // Check if the game is in a ready state
        if (!game.isBooted || !game.canvas) {
          console.log("Game not ready for resize");
          return;
        }

        // Adjust game size to match new dimensions
        game.scale.resize(window.innerWidth, window.innerHeight);

        // Force a redraw of any active scene
        const activeScenes = game.scene.getScenes(true);
        if (activeScenes && activeScenes.length > 0) {
          const activeScene = activeScenes[0];
          // Check if the scene has a resize handler
          if (
            activeScene &&
            activeScene.handleResize &&
            typeof activeScene.handleResize === "function"
          ) {
            // Wait a brief moment to let the canvas resize complete
            setTimeout(() => {
              activeScene.handleResize({
                width: window.innerWidth,
                height: window.innerHeight,
              });
            }, 100);
          }
        }
      } catch (err) {
        console.error("Error during resize:", err);
      }
    }, 250); // Slightly longer debounce for better stability
  }
});

// Add meta tags to enforce proper scaling on mobile
function setupMobileViewport() {
  // Update viewport meta tag for mobile
  const viewport = document.querySelector("meta[name=viewport]");
  if (viewport) {
    viewport.content =
      "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
  } else {
    const meta = document.createElement("meta");
    meta.name = "viewport";
    meta.content =
      "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
    document.head.appendChild(meta);
  }

  // Add viewport height CSS variable for consistent sizing
  function updateViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }

  updateViewportHeight();
  window.addEventListener("resize", updateViewportHeight);
}

// Run setup before creating the game
setupMobileViewport();

// Create game instance
var game = new Phaser.Game(config);
