const API_URL = "http://localhost:3000/api";
// Fallback configuration that will work without external assets
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: { preload: preload, create: create, update: update },
  parent: "game-container",
  backgroundColor: "#0a0a2a",
  render: {
    pixelArt: false,
    antialias: true,
  },
};

// Ensure global game variables are initialized
let score = 0;
let timeLeft = 60;
let messages = [];
let gameActive = true;
let scoreText;
let timeText;

function preload() {}

function create() {
  // Setup UI
  scoreText = this.add.text(16, 16, "Score: 0", {
    fontSize: "24px",
    fill: "#fff",
  });

  timeText = this.add.text(16, 50, "Time: " + timeLeft, {
    fontSize: "24px",
    fill: "#fff",
  });

  // Start spawning messages
  this.time.addEvent({
    delay: 2000,
    callback: () => spawnMessage(this),
    callbackScope: this,
    loop: true,
  });

  // Start timer
  this.time.addEvent({
    delay: 1000,
    callback: () => updateTimer(this),
    callbackScope: this,
    loop: true,
  });
}

function update() {
  if (!gameActive) return;

  // Clean up off-screen messages
  messages = messages.filter((message) => {
    if (message && message.y > 650) {
      message.destroy();
      return false;
    }
    return true;
  });
}

// Create textures for messages
function createMessageTextures(scene) {
  // Create safe message texture
  const safeTexture = scene.textures.createCanvas("safe-message", 300, 100);
  const safeContext = safeTexture.getContext();
  safeContext.fillStyle = "#333333";
  safeContext.fillRect(0, 0, 300, 100);
  safeContext.strokeStyle = "#00ffff";
  safeContext.lineWidth = 2;
  safeContext.strokeRect(0, 0, 300, 100);
  safeTexture.refresh();

  // Create phishing message texture
  const phishingTexture = scene.textures.createCanvas(
    "phishing-message",
    300,
    100
  );
  const phishingContext = phishingTexture.getContext();
  phishingContext.fillStyle = "#333333";
  phishingContext.fillRect(0, 0, 300, 100);
  phishingContext.strokeStyle = "#ff3333";
  phishingContext.lineWidth = 2;
  phishingContext.strokeRect(0, 0, 300, 100);
  phishingTexture.refresh();
}

// Helper functions
async function spawnMessage(scene) {
  if (!gameActive) return;

  try {
    const response = await fetch(`${API_URL}/messages`);
    const messageData = await response.json();

    const x = Phaser.Math.Between(100, 700);
    const message = new Message(scene, x, -50, messageData);
    messages.push(message);
  } catch (error) {
    console.error("Error fetching message:", error);
    // Fallback to local message generation
    const messageData = {
      text: "This is a test message\n" + Math.random().toFixed(5),
      isPhishing: Math.random() > 0.5,
      type: "email",
    };
    const x = Phaser.Math.Between(100, 700);
    const message = new Message(scene, x, -50, messageData);
    messages.push(message);
  }
}

function updateTimer(scene) {
  if (!gameActive) return;

  timeLeft--;
  timeText.setText("Time: " + timeLeft);

  if (timeLeft <= 0) {
    gameActive = false;
    endGame(scene);
  }
}

async function endGame(scene) {
  // Show game over text
  scene.add
    .text(400, 300, "Game Over!\nFinal Score: " + score, {
      fontSize: "48px",
      fill: "#fff",
      align: "center",
    })
    .setOrigin(0.5);

  // Save score to database
  try {
    const playerName = prompt("Enter your name:") || "Anonymous";
    await fetch(`${API_URL}/scores`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        score,
        playerName,
      }),
    });
  } catch (error) {
    console.error("Error saving score:", error);
  }

  // Add restart button
  const restartButton = scene.add
    .text(400, 400, "Play Again", {
      fontSize: "32px",
      fill: "#fff",
      backgroundColor: "#333",
      padding: { x: 20, y: 10 },
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true })
    .on("pointerdown", () => {
      score = 0;
      timeLeft = 60;
      gameActive = true;
      messages.forEach((m) => m.destroy());
      messages = [];
      scene.scene.restart();
    });
}

// This function checks if scenes are loaded/accessible
// function ensureScenesLoaded() {
//   // Check if scenes exist in the global scope
//   const requiredScenes = [
//     "BootScene",
//     "MenuScene",
//     "GameScene",
//     "GameOverScene",
//   ];

//   for (const sceneName of requiredScenes) {
//     if (typeof window[sceneName] !== "function") {
//       console.error(`Missing scene: ${sceneName}`);

//       // Create empty scene as fallback
//       window[sceneName] = class extends Phaser.Scene {
//         constructor() {
//           super({ key: sceneName });
//         }

//         create() {
//           this.add
//             .text(400, 300, `${sceneName} Not Found`, {
//               fontSize: "32px",
//               fill: "#ff0000",
//             })
//             .setOrigin(0.5);

//           this.add
//             .text(400, 350, "Please check browser console for errors", {
//               fontSize: "16px",
//               fill: "#ffffff",
//             })
//             .setOrigin(0.5);

//           // Auto-progress to next scene after delay
//           if (sceneName === "BootScene") {
//             this.time.delayedCall(2000, () => {
//               this.scene.start("MenuScene");
//             });
//           }
//         }
//       };
//     }
//   }
// }

// Call this function when the script loads
// ensureScenesLoaded();
