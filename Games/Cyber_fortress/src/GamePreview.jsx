import React, { useState, useEffect } from 'react';
import './CyberFortress.css'

const GamePreview = () => {
  const GRID_SIZE = 6;
  const [grid, setGrid] = useState(Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(null)));
  const [selectedDefense, setSelectedDefense] = useState(null);
  const [attacks, setAttacks] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [score, setScore] = useState(0);
  const [credits, setCredits] = useState(1000);
  const [level, setLevel] = useState(1);
  const [showTip, setShowTip] = useState(null);

  const DEFENSES = {
    firewall: { name: 'Firewall', icon: '🛡️', color: 'bg-blue-500', cost: 200 },
    password: { name: 'Password', icon: '🔒', color: 'bg-green-500', cost: 150 },
    encryption: { name: 'Encryption', icon: '🔑', color: 'bg-purple-500', cost: 250 }
  };

  const ATTACKS = {
    portScan: { name: 'Port Scan', icon: '🔍', color: 'bg-yellow-500' },
    passwordCrack: { name: 'Password Crack', icon: '🔨', color: 'bg-red-500' },
    dataSniffer: { name: 'Data Sniffer', icon: '🕵️', color: 'bg-purple-500' }
  };

  // Handle defense placement
  const placeDefense = (row, col) => {
    if (!selectedDefense || !DEFENSES[selectedDefense]) return;
    if (credits < DEFENSES[selectedDefense].cost) return;
    if (grid[row][col]) return; // Cell already has a defense

    const newGrid = grid.map((r, i) => 
      i === row ? r.map((cell, j) => j === col ? selectedDefense : cell) : r
    );
    setGrid(newGrid);
    setCredits(prev => prev - DEFENSES[selectedDefense].cost);
  };

  // Simulate attack warnings
  useEffect(() => {
    const warningInterval = setInterval(() => {
      const attackTypes = Object.keys(ATTACKS);
      const newWarning = {
        type: attackTypes[Math.floor(Math.random() * attackTypes.length)],
        row: Math.floor(Math.random() * GRID_SIZE),
        col: Math.floor(Math.random() * GRID_SIZE),
        id: Date.now()
      };
      
      setWarnings(prev => [...prev, newWarning]);
      
      // Convert warning to attack after 2 seconds
      setTimeout(() => {
        setWarnings(prev => prev.filter(w => w.id !== newWarning.id));
        setAttacks(prev => [...prev, newWarning]);
        
        // Process attack after 1 second
        setTimeout(() => {
          processAttack(newWarning);
          setAttacks(prev => prev.filter(a => a.id !== newWarning.id));
        }, 1000);
      }, 2000);
    }, 5000);

    return () => clearInterval(warningInterval);
  }, []);

  // Process attack and update score
  const processAttack = (attack) => {
    const defense = grid[attack.row][attack.col];
    
    if (defense) {
      const isSuccessful = (
        (defense === 'firewall' && attack.type === 'portScan') ||
        (defense === 'password' && attack.type === 'passwordCrack') ||
        (defense === 'encryption' && attack.type === 'dataSniffer')
      );
      
      if (isSuccessful) {
        setScore(prev => prev + 10);
        setCredits(prev => prev + 20);
      } else {
        setScore(prev => Math.max(0, prev - 5));
        setCredits(prev => Math.max(0, prev - 10)); // Lose credits for failed defense
      }
    } else {
      setScore(prev => Math.max(0, prev - 10));
      setCredits(prev => Math.max(0, prev - 15)); // Lose more credits for no defense
    }
    
    // Check if credits are too low for any defense
    if (credits < Math.min(...Object.values(DEFENSES).map(d => d.cost))) {
      const hasDefenses = grid.some(row => row.some(cell => cell !== null));
      if (!hasDefenses) {
        setIsGameOver(true);
      }
    }
  };

  const [isGameOver, setIsGameOver] = useState(false);

  // Check for game over condition
  useEffect(() => {
    if (credits < Math.min(...Object.values(DEFENSES).map(d => d.cost))) {
      // If credits are less than the cheapest defense
      const hasDefenses = grid.some(row => row.some(cell => cell !== null));
      if (!hasDefenses) {
        setIsGameOver(true);
      }
    }
  }, [credits, grid]);

  const resetGame = () => {
    setCredits(1000);
    setScore(0);
    setLevel(1);
    setGrid(Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(null)));
    setSelectedDefense(null);
    setAttacks([]);
    setWarnings([]);
    setIsGameOver(false);
  };

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
          <div className="credits">Credits: {credits}</div>
          <div className="score">Score: {score}</div>
          <div className="level">Level: {level}</div>
        </div>
      </div>

      <div className="grid">
        {grid.map((row, i) => row.map((cell, j) => (
          <div
            key={`${i}-${j}`}
            onClick={() => placeDefense(i, j)}
            className={`grid-cell ${cell ? cell : ''}`}
          >
            {cell && DEFENSES[cell].icon}
            
            {warnings.some(w => w.row === i && w.col === j) && (
              <div className="warning-indicator">
                <div className="warning-text">
                  {ATTACKS[warnings.find(w => w.row === i && w.col === j).type].name}
                </div>
              </div>
            )}
            
            {attacks.some(a => a.row === i && a.col === j) && (
              <div className="attack-animation">
                {ATTACKS[attacks.find(a => a.row === i && a.col === j).type].icon}
              </div>
            )}
          </div>
        )))}
      </div>

      <div className="defense-buttons">
        {Object.entries(DEFENSES).map(([key, defense]) => (
          <button
            key={key}
            onClick={() => setSelectedDefense(key)}
            className={`defense-button ${selectedDefense === key ? 'selected' : ''}`}
            disabled={credits < defense.cost}
          >
            <div className="defense-icon">{defense.icon}</div>
            <div className="defense-name">{defense.name}</div>
            <div className="defense-cost">{defense.cost} credits</div>
          </button>
        ))}
      </div>

      <div className="legend">
        <h2>Attack Types & Counters:</h2>
        <div className="legend-grid">
          {Object.entries(ATTACKS).map(([key, attack]) => (
            <div key={key} className="legend-item">
              <span className="attack-icon">{attack.icon}</span>
              <div>
                <div>{attack.name}</div>
                <div className="counter-info">
                  Counter: {DEFENSES[Object.keys(DEFENSES).find(d => 
                    (d === 'firewall' && key === 'portScan') ||
                    (d === 'password' && key === 'passwordCrack') ||
                    (d === 'encryption' && key === 'dataSniffer')
                  )].name}
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
            <div className="game-over-title">SYSTEM BREACH!</div>
            <div className="game-over-stats">
              <p>Final Score: {score}</p>
              <p>Level Reached: {level}</p>
              <p>Network Status: Compromised</p>
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