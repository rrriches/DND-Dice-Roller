import React from 'react';
import { SavedRoll } from '../types';

interface SavedRollsPanelProps {
  savedRolls: SavedRoll[];
  onRollPreset: (roll: SavedRoll) => void;
  onDeleteRoll: (id: string) => void;
}

const formatSavedRollString = (roll: SavedRoll): string => {
    const parts = roll.dice.map(d => `${d.count}d${d.sides}`);
    if (roll.modifier !== 0) {
      parts.push(roll.modifier > 0 ? `+ ${roll.modifier}` : `- ${Math.abs(roll.modifier)}`);
    }
    return parts.join(' + ');
}

export const SavedRollsPanel: React.FC<SavedRollsPanelProps> = ({ savedRolls, onRollPreset, onDeleteRoll }) => {
  if (savedRolls.length === 0) {
    return null; // Don't render anything if there are no saved rolls
  }

  const showDropdown = savedRolls.length > 8;

  const handleDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const rollId = event.target.value;
    if (!rollId) return;
    const selectedRoll = savedRolls.find(r => r.id === rollId);
    if (selectedRoll) {
      onRollPreset(selectedRoll);
    }
    event.target.value = ""; // Reset dropdown after selection
  };

  return (
    <div className="bg-slate-800/30 border border-slate-700 rounded-xl shadow-2xl p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-medieval text-lg text-amber-200">Saved Rolls</h2>
        {showDropdown && (
            <select
                onChange={handleDropdownChange}
                className="bg-slate-700 border border-slate-600 rounded-md py-1 px-2 text-sm text-amber-200 focus:ring-amber-500 focus:border-amber-500"
                aria-label="Select a saved roll"
                defaultValue=""
            >
                <option value="" disabled>Select a preset...</option>
                {savedRolls.map(roll => (
                    <option key={roll.id} value={roll.id}>
                        {roll.name}
                    </option>
                ))}
            </select>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {savedRolls.map(roll => (
          <div key={roll.id} className="group relative">
            <button
              onClick={() => onRollPreset(roll)}
              className="w-full h-full text-left p-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg shadow-md transition-all duration-150 transform hover:scale-105 active:scale-95"
              aria-label={`Roll: ${roll.name}`}
            >
              <p className="font-bold text-sm text-amber-300 truncate">{roll.name}</p>
              <p className="text-xs text-slate-400 font-mono">{formatSavedRollString(roll)}</p>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteRoll(roll.id);
              }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-slate-800 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label={`Delete roll: ${roll.name}`}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
