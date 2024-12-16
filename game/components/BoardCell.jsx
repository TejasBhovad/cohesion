import React, { useEffect, useRef } from 'react';
import { animate } from 'motion';
import '../styles/cell.css';

const BoardCell = ({ text, isSelected, isUsed, isWrong, selectCellFn }) => {
  const buttonRef = useRef(null);

  const animateButtonPress = (node) => {
    animate(
      node,
      {
        scale: [1, 1.05, 0.98, 1],
        rotate: [0, 2, -2, 0],
      },
      {
        duration: 0.3,
        easing: 'ease-out',
      }
    );
  };

  const handleClick = (event) => {
    selectCellFn();
    animateButtonPress(event.currentTarget);
  };

  useEffect(() => {
    if (buttonRef.current) {
      animate(
        buttonRef.current,
        {
          opacity: [0, 1],
          y: [10, 0],
        },
        {
          duration: 0.3,
          easing: 'ease-out',
        }
      );
    }
  }, []);

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      className={`text-text relative flex w-full items-center justify-center rounded-lg border-2 px-4 py-4 text-xl font-bold shadow-sm transition-all duration-200 ease-out hover:shadow-md ${
        isWrong
          ? 'wrong-cell border border-red-500 bg-red-100/20 text-red-500'
          : isSelected
            ? 'active-cell border-yellow-500/50 bg-gradient-to-b from-yellow-300/20 to-yellow-500/20 text-white ring-1 ring-yellow-500/30'
            : 'border-secondary/50 hover:border-yellow-500/80'
      } ${
        isUsed
          ? 'text-background cursor-not-allowed border-0 border-yellow-500/50 bg-gradient-to-b from-yellow-300 to-yellow-500 text-black opacity-50'
          : 'active:scale-98 bg-secondary/80 hover:bg-secondary/90'
      }`}
    >
      {isSelected && !isWrong && (
        <>
          <span className="animate-soft-pulse absolute inset-0 rounded-lg bg-yellow-500/10"></span>
          <div className="sparkle-effect">
            {Array.from({ length: 15 }).map((_, index) => (
              <div
                key={index}
                className="sparkle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  '--delay': `${(Math.random() * 2).toFixed(5)}s`,
                  transform: `scale(${Math.random() * 0.5 + 0.5})`, // Random scale for variation
                }}
              ></div>
            ))}
          </div>
        </>
      )}
      <span className="relative z-10 truncate capitalize">{text}</span>
    </button>
  );
};

export default BoardCell;
