
import React from 'react';

interface DiceButtonProps {
  sides: number;
  onClick: (sides: number) => void;
  count: number;
}

export const DiceButton: React.FC<DiceButtonProps> = ({ sides, onClick, count }) => (
  <button
    onClick={() => onClick(sides)}
    className={`relative w-16 h-16 bg-slate-700 hover:bg-slate-600 border rounded-lg shadow-md transition-all duration-150 transform hover:scale-105 active:scale-95 flex items-center justify-center ${count > 0 ? 'border-amber-400' : 'border-slate-500'}`}
    aria-label={`Add d${sides} to roll. Current count: ${count}`}
  >
    {count > 0 && (
       <span className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 text-slate-900 text-sm font-bold rounded-full flex items-center justify-center border-2 border-slate-800/80">
        {count}
      </span>
    )}
    <span className="font-medieval text-xl text-amber-300">d{sides}</span>
  </button>
);
