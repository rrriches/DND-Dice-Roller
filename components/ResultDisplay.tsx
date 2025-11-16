import React, { useState } from 'react';
import { RollResult, AdvantageState, CriticalState } from '../types';
import { D20Icon } from './icons/D20Icon';
import { SkullIcon } from './icons/SkullIcon';

interface ResultDisplayProps {
  result: RollResult;
  onGenerateFlavor: (resultId: string, context: string) => void;
  onSaveRoll: (resultId: string, name: string) => void;
}

const AdvantagePill: React.FC<{ state: AdvantageState }> = ({ state }) => {
  if (state === AdvantageState.None) return null;
  const isAdv = state === AdvantageState.Advantage;
  return (
    <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${isAdv ? 'bg-green-600 text-green-100' : 'bg-red-600 text-red-100'}`}>
      {isAdv ? 'ADV' : 'DIS'}
    </span>
  );
};

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onGenerateFlavor, onSaveRoll }) => {
  const [isAddingContext, setIsAddingContext] = useState(false);
  const [context, setContext] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveName, setSaveName] = useState('');

  const resultTextColor = result.criticalState === CriticalState.Success ? 'text-green-400' : result.criticalState === CriticalState.Failure ? 'text-red-400' : 'text-amber-300';

  const formatRolls = (rolls: number[], sides: number) => {
    return rolls.map((r, i) => {
      const isCrit = sides === 20 && (r === 1 || r === 20);
      const isKeptAdvDis = result.d20AdvDisResults?.kept === r;
      const isDiscardedAdvDis = result.d20AdvDisResults?.discarded === r;
      
      let textColor = 'text-slate-300';
      if(isKeptAdvDis) textColor = isCrit ? (r === 20 ? 'text-green-400' : 'text-red-400') : 'text-slate-100';
      if(isDiscardedAdvDis) textColor = 'text-slate-500 line-through';
      if(!result.d20AdvDisResults && isCrit) textColor = r === 20 ? 'text-green-400' : 'text-red-400';

      return (
        <span key={i} className={`font-mono ${textColor}`}>{r}</span>
      );
    }).reduce((prev, curr) => <>{prev}, {curr}</>);
  };
  
  const handleGenerateClick = () => {
    if (!context.trim()) return;
    onGenerateFlavor(result.id, context);
    setIsAddingContext(false);
  };

  const handleSaveClick = () => {
    if (!saveName.trim()) return;
    onSaveRoll(result.id, saveName);
    setIsSaving(false);
    setSaveName('');
  };

  const handleCancelSave = () => {
    setIsSaving(false);
    setSaveName('');
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 shadow-inner animate-fade-in relative">
       <div className="absolute top-3 right-3">
         <button 
            onClick={() => setIsSaving(s => !s)}
            className={`p-1.5 text-slate-400 hover:text-amber-300 rounded-full transition-colors ${isSaving ? 'bg-amber-600/20 text-amber-300' : 'bg-slate-800/50 hover:bg-slate-700'}`}
            aria-label="Save this roll"
         >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v12l-5-3-5 3V4z" /></svg>
        </button>
      </div>

      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medieval text-xl text-amber-200">{result.rollString}</h3>
          <div className="text-xs text-slate-400 flex items-center gap-2">
            Roll Breakdown <AdvantagePill state={result.advantageState} />
          </div>
        </div>
        <div className={`font-medieval text-5xl font-bold ${resultTextColor}`}>
          {result.total}
        </div>
      </div>

      <div className="text-sm text-slate-400 mb-4 bg-slate-900 p-3 rounded-md">
        <p className="flex flex-wrap items-center gap-x-2">
          <span className="font-bold text-slate-300">Rolls:</span>
          {result.diceResults.map(({ sides, rolls }, index) => (
            <React.Fragment key={sides}>
              <span>[{formatRolls(sides === 20 && result.d20AdvDisResults ? [result.d20AdvDisResults.kept, result.d20AdvDisResults.discarded] : rolls, sides)}]</span>
              {index < result.diceResults.length - 1 && <span className="text-slate-500">+</span>}
            </React.Fragment>
          ))}
          {result.modifier !== 0 && (
            <>
              <span className="text-slate-500">{result.modifier > 0 ? '+' : '-'}</span>
              <span className="font-mono">{Math.abs(result.modifier)}</span>
            </>
          )}
        </p>
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-700">
        {result.isFlavorTextLoading ? (
          <div className="flex items-center gap-2 text-amber-400 animate-pulse">
              <div className="w-5 h-5 animate-spin">
              <D20Icon/>
              </div>
            <span>Calling on the arcane arts for inspiration...</span>
          </div>
        ) : result.flavorText ? (
            <div className="flex items-start gap-3 text-amber-200 italic">
            {result.criticalState === CriticalState.Success && <D20Icon className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />}
            {result.criticalState === CriticalState.Failure && <SkullIcon className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />}
            <p>"{result.flavorText}"</p>
            </div>
        ) : result.criticalState !== CriticalState.None ? (
            isAddingContext ? (
                <div className="space-y-2 animate-fade-in-down">
                    <label htmlFor={`context-${result.id}`} className="text-sm font-bold text-amber-200">
                    What are you trying to do?
                    </label>
                    <textarea
                    id={`context-${result.id}`}
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-600 rounded-md p-2 text-slate-200 focus:ring-amber-500 focus:border-amber-500"
                    rows={2}
                    placeholder="e.g., Attack the goblin with my greatsword"
                    />
                    <div className="flex justify-end gap-2">
                        <button onClick={() => setIsAddingContext(false)} className="px-3 py-1 text-xs bg-slate-600 hover:bg-slate-500 rounded transition-colors">Cancel</button>
                        <button 
                            onClick={handleGenerateClick} 
                            disabled={!context.trim()}
                            className="px-3 py-1 text-xs bg-amber-600 hover:bg-amber-500 text-slate-900 font-bold rounded disabled:opacity-50 transition-colors"
                        >
                            Generate
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center">
                    <button 
                    onClick={() => setIsAddingContext(true)}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-500 text-amber-300 rounded-lg shadow-md transition-all transform hover:scale-105"
                    >
                    {result.criticalState === CriticalState.Success ? 'Describe Your Triumph ✨' : 'Describe Your Fumble 💀'}
                    </button>
                </div>
            )
        ) : null}
      </div>

      {isSaving && (
        <div className="mt-4 pt-4 border-t border-slate-700 space-y-2 animate-fade-in-down">
            <label htmlFor={`save-name-${result.id}`} className="text-sm font-bold text-amber-200">
            Save Roll As...
            </label>
            <input
                id={`save-name-${result.id}`}
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-md p-2 text-slate-200 focus:ring-amber-500 focus:border-amber-500"
                placeholder="e.g., Greataxe Attack"
                autoFocus
            />
            <div className="flex justify-end gap-2">
                <button onClick={handleCancelSave} className="px-3 py-1 text-xs bg-slate-600 hover:bg-slate-500 rounded transition-colors">Cancel</button>
                <button 
                    onClick={handleSaveClick} 
                    disabled={!saveName.trim()}
                    className="px-3 py-1 text-xs bg-amber-600 hover:bg-amber-500 text-slate-900 font-bold rounded disabled:opacity-50 transition-colors"
                >
                    Save
                </button>
            </div>
        </div>
      )}
    </div>
  );
};