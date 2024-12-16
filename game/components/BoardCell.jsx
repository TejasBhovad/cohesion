import React, { useEffect, useRef } from 'react';
import { animate } from 'motion';

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
          ? 'wrong-cell border-red-500 bg-red-100/20 text-red-500'
          : isSelected
            ? 'active-cell border-yellow-500/50 bg-gradient-to-b from-yellow-300 to-yellow-500 text-black ring-1 ring-yellow-500/30'
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
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="sparkle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  '--delay': `${Math.random() * 1}s`,
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

<style jsx>{`
  .active-cell {
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.2);
    animation: subtle-pulse 2s ease-in-out;
  }

  .wrong-cell {
    box-shadow: 0 0 15px rgba(255, 0, 0, 0.2);
    animation: wrong-pulse 2.5s infinite;
    transition: background-color 0.3s ease-out;
  }

  @keyframes wrong-pulse {
    0% {
      background-color: rgba(255, 0, 0, 0.3);
      transform: scale(1);
    }
    50% {
      background-color: rgba(255, 0, 0, 0.1);
      transform: scale(1.01);
    }
    100% {
      background-color: rgba(255, 0, 0, 0);
      transform: scale(1);
    }
  }

  @keyframes subtle-pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.01);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes animate-soft-pulse {
    0% {
      opacity: 0.1;
    }
    50% {
      opacity: 0.2;
    }
    100% {
      opacity: 0.1;
    }
  }

  .sparkle-effect {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: hidden;
  }

  .sparkle {
    position: absolute;
    width: 3px;
    height: 3px;
    background-color: rgba(255, 215, 0, 0.3);
    border-radius: 50%;
    animation: sparkle-fade 1.5s ease-in infinite;
    animation-delay: var(--delay);
  }

  @keyframes sparkle-fade {
    0% {
      transform: scale(0) rotate(0deg);
      opacity: 0;
    }
    50% {
      transform: scale(1) rotate(180deg);
      opacity: 0.3;
    }
    100% {
      transform: scale(0) rotate(360deg);
      opacity: 0;
    }
  }

  button {
    backface-visibility: hidden;
    transform: translateZ(0);
    -webkit-font-smoothing: subpixel-antialiased;
  }

  .active\\:scale-98\\:active {
    transform: scale(0.99);
  }
`}</style>;
