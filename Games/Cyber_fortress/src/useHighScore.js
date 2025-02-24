import { useState, useEffect } from 'react';

export const HighScore = () => {
  const [highScore, setHighScore] = useState(() => 
    parseInt(localStorage.getItem('cyberFortressHighScore')) || 0
  );

  const updateHighScore = (score) => {
    if (score > highScore) {
      localStorage.setItem('cyberFortressHighScore', score);
      setHighScore(score);
    }
  };

  return { highScore, updateHighScore };
};