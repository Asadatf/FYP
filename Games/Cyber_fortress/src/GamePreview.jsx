import React, { useState, useEffect, useRef } from "react";
import "./CyberFortress.css";
import { HighScore } from "./useHighScore";

const GamePreview = () => {
  const GRID_SIZE = 3;
  const [grid, setGrid] = useState(
    Array(GRID_SIZE)
      .fill()
      .map(() => Array(GRID_SIZE).fill(null))
  );
  const [threatGrid, setThreatGrid] = useState(
    Array(GRID_SIZE)
      .fill()
      .map(() => Array(GRID_SIZE).fill(null))
  );
  const [visibleThreats, setVisibleThreats] = useState(
    Array(GRID_SIZE)
      .fill()
      .map(() => Array(GRID_SIZE).fill(false))
  );
  const [selectedDefense, setSelectedDefense] = useState(null);
  const [warnings, setWarnings] = useState([]);
  const [score, setScore] = useState(0);
  const [correctSolutions, setCorrectSolutions] = useState(0);
  const [level, setLevel] = useState(1);
  const [activeThreatCount, setActiveThreatCount] = useState(0);
  const [totalThreatsResolved, setTotalThreatsResolved] = useState(0);
  const [gameState, setGameState] = useState("notStarted"); // notStarted, initializing, playing, levelComplete, gameOver
  const [isGameOver, setIsGameOver] = useState(false);

  // Refs for managing intervals and timeouts
  const revealIntervalRef = useRef(null);
  const hideTimeoutRef = useRef(null);
  const levelTimeoutRef = useRef(null);
  const debugRef = useRef({ lastReveal: 0 });

  // Nine threats and matching defenses
  const THREATS = {
    portScan: {
      name: "Port Scan",
      icon: "🔍",
      color: "bg-yellow-500",
      solution: "firewall",
    },
    passwordCrack: {
      name: "Password Crack",
      icon: "🔨",
      color: "bg-red-500",
      solution: "password",
    },
    dataSniffer: {
      name: "Data Sniffer",
      icon: "🕵️",
      color: "bg-purple-500",
      solution: "encryption",
    },
    malware: {
      name: "Malware",
      icon: "🦠",
      color: "bg-green-800",
      solution: "antivirus",
    },
    phishing: {
      name: "Phishing",
      icon: "🎣",
      color: "bg-blue-700",
      solution: "training",
    },
    ddos: {
      name: "DDoS Attack",
      icon: "🌊",
      color: "bg-red-700",
      solution: "loadBalancer",
    },
    ransomware: {
      name: "Ransomware",
      icon: "🔒",
      color: "bg-orange-700",
      solution: "backup",
    },
    rootkit: {
      name: "Rootkit",
      icon: "🌱",
      color: "bg-teal-700",
      solution: "scanner",
    },
    trojan: {
      name: "Trojan",
      icon: "🐴",
      color: "bg-amber-800",
      solution: "sandbox",
    },
  };

  const DEFENSES = {
    firewall: { name: "Firewall", icon: "🛡️", color: "bg-blue-500" },
    password: { name: "Strong Password", icon: "🔐", color: "bg-green-500" },
    encryption: { name: "Encryption", icon: "🔑", color: "bg-purple-500" },
    antivirus: { name: "Antivirus", icon: "🦸", color: "bg-green-700" },
    training: { name: "Security Training", icon: "📚", color: "bg-yellow-600" },
    loadBalancer: { name: "Load Balancer", icon: "⚖️", color: "bg-blue-800" },
    backup: { name: "Data Backup", icon: "💾", color: "bg-orange-500" },
    scanner: { name: "Rootkit Scanner", icon: "🔬", color: "bg-teal-500" },
    sandbox: { name: "Sandbox Environment", icon: "📦", color: "bg-amber-600" },
  };

  // Initialize the game when component mounts
  useEffect(() => {
    // In the initial version, we would call initializeThreats() here
    // But now we'll wait for the user to press the start button
    prepareGame();

    // Clean up function to clear all intervals and timeouts
    return () => {
      clearAllTimers();
    };
  }, []);

  // Prepare the game without starting it
  const prepareGame = () => {
    // Clear any existing timers
    clearAllTimers();

    const threatTypes = Object.keys(THREATS);

    // Create a grid with randomized threats
    let threatIndex = 0;
    const shuffledThreats = [...threatTypes]
      .sort(() => Math.random() - 0.5)
      .slice(0, GRID_SIZE * GRID_SIZE);
    const newThreatGrid = Array(GRID_SIZE)
      .fill()
      .map(() =>
        Array(GRID_SIZE)
          .fill()
          .map(() => {
            return shuffledThreats[threatIndex++];
          })
      );

    setThreatGrid(newThreatGrid);

    // Count active threats
    const count = newThreatGrid
      .flat()
      .filter((threat) => threat !== null).length;
    setActiveThreatCount(count);

    // Reset grid and visible threats
    setGrid(
      Array(GRID_SIZE)
        .fill()
        .map(() => Array(GRID_SIZE).fill(null))
    );
    setVisibleThreats(
      Array(GRID_SIZE)
        .fill()
        .map(() => Array(GRID_SIZE).fill(false))
    );

    // Ready for the user to start
    setGameState("notStarted");
  };

  // Start the game when the button is clicked
  const startGame = () => {
    setGameState("initializing");

    // Show a "Get Ready" message, then start the game
    setTimeout(() => {
      setGameState("playing");

      // Start showing threats one by one after a brief delay
      setTimeout(() => {
        // Show first threat immediately
        revealRandomThreat();

        // Set up interval for subsequent threats
        revealIntervalRef.current = setInterval(() => {
          console.log("Interval triggered - showing next threat");
          revealRandomThreat();
        }, 3000); // Show a new threat every 3 seconds
      }, 1000);
    }, 2000);
  };

  // Game win condition
  useEffect(() => {
    if (level > 5 && activeThreatCount === 0) {
      setIsGameOver(true);
      setGameState("gameOver");
      clearAllTimers();
    }
  }, [level, activeThreatCount]);

  // Helper function to clear all timers
  const clearAllTimers = () => {
    if (revealIntervalRef.current) {
      clearInterval(revealIntervalRef.current);
      revealIntervalRef.current = null;
    }
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    if (levelTimeoutRef.current) {
      clearTimeout(levelTimeoutRef.current);
      levelTimeoutRef.current = null;
    }
  };

  // Function to get unresolved threat positions
  const getUnresolvedPositions = () => {
    const positions = [];
    threatGrid.forEach((row, rowIndex) => {
      row.forEach((threat, colIndex) => {
        if (threat !== null) {
          positions.push([rowIndex, colIndex]);
        }
      });
    });
    return positions;
  };

  // Function to reveal a random threat
  const revealRandomThreat = () => {
    debugRef.current.lastReveal = Date.now();

    const unresolvedPositions = getUnresolvedPositions();

    if (unresolvedPositions.length === 0) {
      // All threats resolved, don't try to reveal more
      clearAllTimers();
      return;
    }

    // Hide any currently visible threats first
    setVisibleThreats(
      Array(GRID_SIZE)
        .fill()
        .map(() => Array(GRID_SIZE).fill(false))
    );

    // Select a random unresolved position
    const randomIndex = Math.floor(Math.random() * unresolvedPositions.length);
    const [row, col] = unresolvedPositions[randomIndex];

    // Show threat at this position - create a new array to ensure state update
    const newVisibleThreats = [];
    for (let i = 0; i < GRID_SIZE; i++) {
      newVisibleThreats[i] = [];
      for (let j = 0; j < GRID_SIZE; j++) {
        newVisibleThreats[i][j] = i === row && j === col;
      }
    }

    // Force a delay to ensure the previous setState has completed
    setTimeout(() => {
      // Set the new visible threats
      setVisibleThreats(newVisibleThreats);
      console.log(`Revealed threat at position [${row},${col}]`);

      // Hide threat after delay
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }

      hideTimeoutRef.current = setTimeout(() => {
        setVisibleThreats(
          Array(GRID_SIZE)
            .fill()
            .map(() => Array(GRID_SIZE).fill(false))
        );
        hideTimeoutRef.current = null;
        console.log("Hidden all threats");
      }, 2000); // Show for 2 seconds
    }, 50);
  };

  // Move to next level when level changes
  useEffect(() => {
    if (level > 1) {
      // Reset the grid and prepare for next level
      prepareNextLevel();
    }
  }, [level]);

  // Prepare for next level
  const prepareNextLevel = () => {
    // Clear any existing timers
    clearAllTimers();

    setGameState("initializing");
    const threatTypes = Object.keys(THREATS);

    // For 3x3 grid, we need exactly 9 threats (one for each cell)
    // Shuffle the threats array to get random order
    const shuffledThreats = [...threatTypes]
      .sort(() => Math.random() - 0.5)
      .slice(0, GRID_SIZE * GRID_SIZE);

    // Create a flat array of all threats
    let threatIndex = 0;
    const newThreatGrid = Array(GRID_SIZE)
      .fill()
      .map(() =>
        Array(GRID_SIZE)
          .fill()
          .map(() => {
            // Use the next threat in our shuffled array
            return shuffledThreats[threatIndex++];
          })
      );

    setThreatGrid(newThreatGrid);
    // Count active threats
    const count = newThreatGrid
      .flat()
      .filter((threat) => threat !== null).length;
    setActiveThreatCount(count);

    // Reset grid and visible threats
    setGrid(
      Array(GRID_SIZE)
        .fill()
        .map(() => Array(GRID_SIZE).fill(null))
    );
    setVisibleThreats(
      Array(GRID_SIZE)
        .fill()
        .map(() => Array(GRID_SIZE).fill(false))
    );

    // Show an initial "Get Ready" message for 2 seconds
    // Then start the game
    setTimeout(() => {
      setGameState("playing");

      // Start showing threats one by one after a brief delay
      setTimeout(() => {
        // Show first threat immediately
        revealRandomThreat();

        // Set up interval for subsequent threats
        revealIntervalRef.current = setInterval(() => {
          console.log("Interval triggered - showing next threat");
          revealRandomThreat();
        }, 3000); // Show a new threat every 3 seconds
      }, 1000);
    }, 2000);
  };

  // Handle defense placement
  const placeDefense = (row, col) => {
    if (gameState !== "playing") return;
    if (!selectedDefense || !DEFENSES[selectedDefense]) return;
    if (grid[row][col]) return; // Cell already has a defense

    const threatType = threatGrid[row][col];
    if (!threatType) return; // No threat in this cell

    const correctSolution = THREATS[threatType]?.solution;

    const newGrid = grid.map((r, i) =>
      i === row ? r.map((cell, j) => (j === col ? selectedDefense : cell)) : r
    );
    setGrid(newGrid);

    // Check if correct solution was applied
    if (selectedDefense === correctSolution) {
      setScore((prev) => prev + 25);
      setCorrectSolutions((prev) => prev + 1);
      setTotalThreatsResolved((prev) => prev + 1);

      // Show success animation
      const newWarning = {
        type: threatType,
        row: row,
        col: col,
        id: Date.now(),
        success: true,
      };

      setWarnings((prev) => [...prev, newWarning]);

      setTimeout(() => {
        setWarnings((prev) => prev.filter((w) => w.id !== newWarning.id));
      }, 1000);

      // Update the threat grid to mark this threat as resolved
      const newThreatGrid = [...threatGrid];
      newThreatGrid[row][col] = null;
      setThreatGrid(newThreatGrid);
      setActiveThreatCount((prev) => prev - 1);

      // Check if all threats are resolved
      if (
        newThreatGrid.flat().filter((threat) => threat !== null).length === 0
      ) {
        // All threats resolved, move to next level
        clearAllTimers();
        setGameState("levelComplete");

        levelTimeoutRef.current = setTimeout(() => {
          setLevel((prev) => prev + 1);
          levelTimeoutRef.current = null;
        }, 1500);
      }
    } else {
      // Wrong solution
      setScore((prev) => Math.max(0, prev - 10));

      // Show failure animation
      const newWarning = {
        type: threatType,
        row: row,
        col: col,
        id: Date.now(),
        failure: true,
      };

      setWarnings((prev) => [...prev, newWarning]);

      setTimeout(() => {
        setWarnings((prev) => prev.filter((w) => w.id !== newWarning.id));
      }, 1000);
    }

    // Update high score if current score is higher
    updateHighScore(score);
  };

  // High score management
  const { highScore, updateHighScore } = HighScore();

  // Reset game
  const resetGame = () => {
    setScore(0);
    setLevel(1);
    setCorrectSolutions(0);
    setTotalThreatsResolved(0);
    setGrid(
      Array(GRID_SIZE)
        .fill()
        .map(() => Array(GRID_SIZE).fill(null))
    );
    setSelectedDefense(null);
    setWarnings([]);
    setIsGameOver(false);

    clearAllTimers();

    // Prepare the game but don't start automatically
    prepareGame();
  };

  // Game UI
  return (
    <>
      {/* Cool background */}
      <div className="cyber-background">
        <div className="cyber-grid"></div>
      </div>

      <div className="game-container">
        <div className="game-header">
          <h1>Cyber Fortress</h1>
          <div className="status-bar">
            <div className="score">Score: {score}</div>
            <div className="threats-resolved">
              Threats Resolved: {totalThreatsResolved}
            </div>
            <div className="level">Level: {level}</div>
            <div className="high-score">High Score: {highScore}</div>
          </div>

          {gameState === "notStarted" && (
            <div className="game-message start-message">
              <p>Press START to begin the cyber security challenge!</p>
              <button className="start-button" onClick={startGame}>
                START
              </button>
            </div>
          )}

          {gameState === "initializing" && (
            <div className="game-message prepare-message">
              <p>Get ready! Threats incoming...</p>
            </div>
          )}

          {gameState === "playing" && (
            <div className="game-message">
              <p>Watch for threats and quickly select the correct defense!</p>
            </div>
          )}

          {gameState === "levelComplete" && (
            <div className="game-message success">
              <p>Level Complete! Advancing to next level...</p>
            </div>
          )}
        </div>

        <div className="grid">
          {grid.map((row, i) =>
            row.map((cell, j) => {
              const threatType = threatGrid[i][j];
              const isVisible = visibleThreats[i][j];

              return (
                <div
                  key={`${i}-${j}`}
                  onClick={() => placeDefense(i, j)}
                  className={`grid-cell ${cell || ""} ${
                    isVisible ? "showing-threat" : ""
                  }`}
                >
                  {/* Show defense if placed */}
                  {cell && (
                    <div className="defense-indicator">
                      {DEFENSES[cell].icon}
                    </div>
                  )}

                  {/* Show threat if visible */}
                  {isVisible && threatType && (
                    <div className="threat-indicator reveal-animation">
                      <div className="threat-icon">
                        {THREATS[threatType].icon}
                      </div>
                      <div className="threat-name">
                        {THREATS[threatType].name}
                      </div>
                    </div>
                  )}

                  {/* Show question mark if there's a hidden threat */}
                  {!isVisible && !cell && threatType && (
                    <div className="hidden-threat-indicator">?</div>
                  )}

                  {/* Show success/failure indicators */}
                  {warnings.some((w) => w.row === i && w.col === j) && (
                    <div
                      className={`warning-indicator ${
                        warnings.find((w) => w.row === i && w.col === j).success
                          ? "success"
                          : warnings.find((w) => w.row === i && w.col === j)
                              .failure
                          ? "failure"
                          : ""
                      }`}
                    >
                      {warnings.find((w) => w.row === i && w.col === j).success
                        ? "✓"
                        : warnings.find((w) => w.row === i && w.col === j)
                            .failure
                        ? "✗"
                        : ""}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="defense-buttons">
          {Object.entries(DEFENSES).map(([key, defense]) => (
            <button
              key={key}
              onClick={() => setSelectedDefense(key)}
              className={`defense-button ${
                selectedDefense === key ? "selected" : ""
              }`}
              disabled={gameState !== "playing"}
            >
              <div className="defense-icon">{defense.icon}</div>
              <div className="defense-name">{defense.name}</div>
            </button>
          ))}
        </div>

        <div className="legend">
          <h2>Threat Types & Counters:</h2>
          <div className="legend-grid">
            {Object.entries(THREATS).map(([key, threat]) => (
              <div key={key} className="legend-item">
                <span className="threat-icon">{threat.icon}</span>
                <div>
                  <div>{threat.name}</div>
                  <div className="counter-info">
                    Counter: {DEFENSES[threat.solution].name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Game Over Modal */}
      {isGameOver && (
        <div className="game-over-modal">
          <div className="game-over-content">
            <div className="game-over-title">
              {level > 5 ? "MISSION SUCCESSFUL!" : "SYSTEM BREACH!"}
            </div>
            <div className="game-over-stats">
              <p>Final Score: {score}</p>
              <p>Level Reached: {level}</p>
              <p>Threats Resolved: {totalThreatsResolved}</p>
              <p>Network Status: {level > 5 ? "Secured" : "Compromised"}</p>
            </div>
            <button className="restart-button" onClick={resetGame}>
              Reinitialize System
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default GamePreview;
