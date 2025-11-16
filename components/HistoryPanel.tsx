
import React from 'react';
import { RollResult, CriticalState } from '../types';

interface HistoryPanelProps {
  history: RollResult[];
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history }) => {
  if (history.length === 0) {
    return (
        <div className="p-4 text-center text-slate-500">
            <h2 className="font-medieval text-xl text-slate-400 mb-2">Roll History</h2>
            Your recent rolls will appear here.
        </div>
    )
  }
  
  return (
    <div className="p-4">
      <h2 className="font-medieval text-xl text-slate-400 mb-4 text-center">Roll History</h2>
      <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
        {history.map((roll) => {
           const resultTextColor = roll.criticalState === CriticalState.Success ? 'text-green-400' : roll.criticalState === CriticalState.Failure ? 'text-red-400' : 'text-amber-300';
          return (
            <div key={roll.id} className="bg-slate-800/60 p-2 rounded-md border border-slate-700/50 text-sm animate-fade-in-down">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">{roll.rollString}</span>
                <span className={`font-bold text-lg ${resultTextColor}`}>{roll.total}</span>
              </div>
              {roll.flavorText && <p className="text-xs italic text-amber-200/70 mt-1">"{roll.flavorText}"</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
};
