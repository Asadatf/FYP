# Cyber Fortress - Phaser Game

A cybersecurity-themed game built with Phaser 3 where players defend against various cyber threats by applying the correct countermeasures.

## Game Overview

In Cyber Fortress, you defend your digital infrastructure against cyber attacks. Watch for incoming threats and quickly apply the corresponding defense to secure your systems.

## Features

- Engaging memory-based gameplay
- 9 different cyber threats with matching defenses
- Progressive difficulty levels
- Score tracking and high score system
- Cyber-themed visuals and effects

## How to Play

1. Start the game by pressing the START button
2. Watch as threats appear briefly on the grid
3. Remember the threat type and location
4. Select the appropriate defense from the buttons at the bottom
5. Click on the cell to place your defense
6. Successfully counter all threats to advance to the next level
7. Complete all 5 levels to win!

## Threat Types and Counters

| Threat         | Counter             |
| -------------- | ------------------- |
| Port Scan      | Firewall            |
| Password Crack | Strong Password     |
| Data Sniffer   | Encryption          |
| Malware        | Antivirus           |
| Phishing       | Security Training   |
| DDoS Attack    | Load Balancer       |
| Ransomware     | Data Backup         |
| Rootkit        | Rootkit Scanner     |
| Trojan         | Sandbox Environment |

## Development

This game is built with Phaser 3, a powerful HTML5 game framework.

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Project Structure

# Cyber Fortress - Phaser Game

A cybersecurity-themed game built with Phaser 3 where players defend against various cyber threats by applying the correct countermeasures.

## Game Overview

In Cyber Fortress, you defend your digital infrastructure against cyber attacks. Watch for incoming threats and quickly apply the corresponding defense to secure your systems.

## Features

- Engaging memory-based gameplay
- 9 different cyber threats with matching defenses
- Progressive difficulty levels
- Score tracking and high score system
- Cyber-themed visuals and effects

## How to Play

1. Start the game by pressing the START button
2. Watch as threats appear briefly on the grid
3. Remember the threat type and location
4. Select the appropriate defense from the buttons at the bottom
5. Click on the cell to place your defense
6. Successfully counter all threats to advance to the next level
7. Complete all 5 levels to win!

## Threat Types and Counters

| Threat         | Counter             |
| -------------- | ------------------- |
| Port Scan      | Firewall            |
| Password Crack | Strong Password     |
| Data Sniffer   | Encryption          |
| Malware        | Antivirus           |
| Phishing       | Security Training   |
| DDoS Attack    | Load Balancer       |
| Ransomware     | Data Backup         |
| Rootkit        | Rootkit Scanner     |
| Trojan         | Sandbox Environment |

## Setup Without Node.js

This version of the game doesn't require Node.js or any build tools. It uses Phaser directly via CDN.

### Running Locally

1. Clone or download this repository
2. Open index.html in a web browser
   - For security reasons, some browsers may block local file access
   - You may need to use a simple local server like Python's http.server:
     ```
     python -m http.server
     ```
   - Then access the game at http://localhost:8000

### Project Structure

```
cyber-fortress/
├── index.html            # Main HTML file with Phaser CDN
├── src/
│   ├── main.js           # Entry point
│   ├── game.js           # Main game configuration
│   ├── highscore.js      # High score management
│   ├── utils/
│   │   └── graphics-utils.js # Utility for creating graphics
│   └── scenes/           # Game scenes
│       ├── BootScene.js
│       ├── PreloadScene.js
│       ├── MenuScene.js
│       ├── GameScene.js
│       ├── LevelCompleteScene.js
│       └── GameOverScene.js
```

## Key Differences from the React Version

This Phaser version differs from the original React implementation in several ways:

1. **Architecture**: Uses Phaser's scene-based architecture instead of React components
2. **Rendering**: Uses Phaser's WebGL/Canvas rendering instead of React's DOM manipulation
3. **State Management**: Uses Phaser's built-in state management instead of React hooks
4. **Game Loop**: Uses Phaser's game loop (update method) instead of React's render cycle
5. **Direct Integration**: No build tools or dependencies required - uses Phaser.js directly

## Credits

Developed as a cybersecurity educational game.
