import React from 'react';

import { ChevronsRight } from './icons/ChevronsRight';

const SubmitButton = ({ enable, submitFn }) => {
  const handleClick = () => {
    if (enable) {
      submitFn();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`border-tertiary bg-secondary/50 relative overflow-hidden rounded-lg border-2 pr-4 font-bold ${enable ? 'text-foreground' : 'text-foreground/70'}`}
    >
      <div
        className={`bg-accent absolute left-0 top-0 flex h-full w-12 transform items-center justify-center rounded-sm text-black ${enable ? 'chevdiv' : ''}`}
        style={{
          transition: 'width 0.3s ease-in-out',
          width: enable ? '12px' : '0px',
        }}
      >
        <ChevronsRight size={32} strokeWidth={3} />
      </div>
      <div
        className={`z-10 pl-14 ${enable ? 'text' : ''}`}
        style={{
          transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out',
          transform: enable ? 'translateX(0)' : 'translateX(100%)',
          opacity: enable ? 1 : 0,
        }}
      >
        SUBMIT
      </div>
    </button>
  );
};

export default SubmitButton;
