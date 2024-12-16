import React, { useState, useEffect } from 'react';
import '../styles/tries.css';
const TriesLeft = ({ triesLeft = 6, totalTries = 6 }) => {
  const [prevTries, setPrevTries] = useState(triesLeft);
  const [isAnimating, setIsAnimating] = useState(false);
  const [breakingHeartIndex, setBreakingHeartIndex] = useState(-1);

  const loseLife = () => {
    if (triesLeft > 0 && !isAnimating) {
      setIsAnimating(true);
      setPrevTries(triesLeft);
      setBreakingHeartIndex(triesLeft);

      setTimeout(() => {
        setIsAnimating(false);
        setBreakingHeartIndex(-1);
      }, 2000);
    }
  };

  useEffect(() => {
    if (prevTries !== triesLeft) {
      loseLife();
    }
  }, [triesLeft]);

  // Render function for each life indicator
  const renderTurnDiv = (left, animating, index) =>
    left ? (
      <div
        className={`life-orb h-6 w-6 rounded-full bg-yellow-400 sm:h-8 sm:w-8 ${animating && index === breakingHeartIndex ? 'breaking' : ''} ${animating ? 'animate' : ''}`}
      >
        <div className="glow-effect"></div>
        {animating && index === breakingHeartIndex && (
          <>
            <div className="crack left"></div>
            <div className="crack right"></div>
            <div className="final-glow"></div>
          </>
        )}
      </div>
    ) : (
      <div className="lost-life h-6 w-6 rounded-full bg-yellow-400/50 sm:h-8 sm:w-8"></div>
    );

  return (
    <div className="flex w-full items-center justify-center gap-5 rounded-md py-4">
      {Array.from({ length: totalTries }).map((_, i) =>
        renderTurnDiv(i < triesLeft, isAnimating, i)
      )}
    </div>
  );
};

export default TriesLeft;
