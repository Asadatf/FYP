const API_URL = 'http://localhost:3000/api';
const config = {
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
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    parent: 'game-container'
};

// Game variables
let score = 0;
let timeLeft = 60;
let messages = [];
let gameActive = true;
let scoreText;
let timeText;

// Game functions
function preload() {
    // this.load.image('background', 'assets/background.png');
}

function create() {
    // Setup UI
    scoreText = this.add.text(16, 16, 'Score: 0', {
        fontSize: '24px',
        fill: '#fff'
    });

    timeText = this.add.text(16, 50, 'Time: ' + timeLeft, {
        fontSize: '24px',
        fill: '#fff'
    });

    // Start spawning messages
    this.time.addEvent({
        delay: 2000,
        callback: () => spawnMessage(this),
        callbackScope: this,
        loop: true
    });

    // Start timer
    this.time.addEvent({
        delay: 1000,
        callback: () => updateTimer(this),
        callbackScope: this,
        loop: true
    });
}

function update() {
    if (!gameActive) return;

    // Clean up off-screen messages
    messages = messages.filter(message => {
        if (message && message.y > 650) {
            message.destroy();
            return false;
        }
        return true;
    });
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
        console.error('Error fetching message:', error);
        // Fallback to local message generation
        const messageData = {
            text: 'This is a test message\n' + Math.random().toFixed(5),
            isPhishing: Math.random() > 0.5,
            type: 'email'
        };
        const x = Phaser.Math.Between(100, 700);
        const message = new Message(scene, x, -50, messageData);
        messages.push(message);
    }
}

function updateTimer(scene) {
    if (!gameActive) return;
    
    timeLeft--;
    timeText.setText('Time: ' + timeLeft);

    if (timeLeft <= 0) {
        gameActive = false;
        endGame(scene);
    }
}

async function endGame(scene) {
    // Show game over text
    scene.add.text(400, 300, 'Game Over!\nFinal Score: ' + score, {
        fontSize: '48px',
        fill: '#fff',
        align: 'center'
    }).setOrigin(0.5);

    // Save score to database
    try {
        const playerName = prompt('Enter your name:') || 'Anonymous';
        await fetch(`${API_URL}/scores`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                score,
                playerName
            })
        });
    } catch (error) {
        console.error('Error saving score:', error);
    }

    // Add restart button
    const restartButton = scene.add.text(400, 400, 'Play Again', {
        fontSize: '32px',
        fill: '#fff',
        backgroundColor: '#333',
        padding: { x: 20, y: 10 }
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true })
    .on('pointerdown', () => {
        score = 0;
        timeLeft = 60;
        gameActive = true;
        messages.forEach(m => m.destroy());
        messages = [];
        scene.scene.restart();
    });

}