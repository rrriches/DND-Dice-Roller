import React, { useState, useCallback, useEffect } from 'react';
import { Die, AdvantageState, RollResult, CriticalState, SavedRoll } from './types';
import { calculateRoll } from './services/diceRoller';
import { getFlavorText } from './services/geminiService';
import { DiceButton } from './components/DiceButton';
import { ResultDisplay } from './components/ResultDisplay';
import { HistoryPanel } from './components/HistoryPanel';
import { SavedRollsPanel } from './components/SavedRollsPanel';

const STANDARD_DICE = [4, 6, 8, 10, 12, 20];
const LOCAL_STORAGE_KEY = 'dnd-dice-roller-presets';

const App: React.FC = () => {
  const [dice, setDice] = useState<Die[]>([]);
  const [modifier, setModifier] = useState<number>(0);
  const [advantageState, setAdvantageState] = useState<AdvantageState>(AdvantageState.None);
  const [customSides, setCustomSides] = useState<string>('');
  
  const [lastResult, setLastResult] = useState<RollResult | null>(null);
  const [history, setHistory] = useState<RollResult[]>([]);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [savedRolls, setSavedRolls] = useState<SavedRoll[]>([]);

  useEffect(() => {
    try {
        const storedRolls = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedRolls) {
            setSavedRolls(JSON.parse(storedRolls));
        }
    } catch (error) {
        console.error("Failed to load saved rolls from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedRolls));
    } catch (error) {
        console.error("Failed to save rolls to localStorage", error);
    }
  }, [savedRolls]);


  const formatRollString = useCallback(() => {
    if (dice.length === 0 && modifier === 0) return 'Build your roll...';
    
    const parts = dice.map(d => `${d.count}d${d.sides}`);
    if (modifier !== 0) {
      parts.push(modifier > 0 ? `+ ${modifier}` : `- ${Math.abs(modifier)}`);
    }
    return parts.join(' + ');
  }, [dice, modifier]);

  const addDie = (sides: number) => {
    if (sides <= 0) return;
    setDice(prevDice => {
      const existingDie = prevDice.find(d => d.sides === sides);
      if (existingDie) {
        return prevDice.map(d => d.sides === sides ? { ...d, count: d.count + 1 } : d);
      }
      return [...prevDice, { sides, count: 1 }];
    });
  };
  
  const handleCustomDieAdd = (e: React.FormEvent) => {
      e.preventDefault();
      const sides = parseInt(customSides, 10);
      if (!isNaN(sides) && sides > 0) {
          addDie(sides);
          setCustomSides('');
      }
  }

  const clearRoll = () => {
    setDice([]);
    setModifier(0);
    setAdvantageState(AdvantageState.None);
  };
  
  const handleRoll = async () => {
    if (dice.length === 0) return;
    setIsRolling(true);

    const result = calculateRoll(dice, modifier, advantageState);
    setLastResult(result);
    setHistory(prev => [result, ...prev.slice(0, 9)]);

    clearRoll();
    setIsRolling(false);
  };

  const handleGenerateFlavorText = async (resultId: string, context: string) => {
    const findAndSetLoading = (r: RollResult) => r.id === resultId ? { ...r, isFlavorTextLoading: true } : r;
    
    setLastResult(prev => (prev && prev.id === resultId) ? { ...prev, isFlavorTextLoading: true } : prev);
    setHistory(prev => prev.map(findAndSetLoading));

    const targetResult = history.find(r => r.id === resultId) ?? (lastResult?.id === resultId ? lastResult : null);
    if (!targetResult) return;

    const flavorText = await getFlavorText(targetResult.criticalState, context);

    const findAndSetFlavor = (r: RollResult) => r.id === resultId ? { ...r, flavorText, isFlavorTextLoading: false } : r;

    setLastResult(prev => (prev && prev.id === resultId) ? { ...prev, flavorText, isFlavorTextLoading: false } : prev);
    setHistory(prev => prev.map(findAndSetFlavor));
  };
  
  const handleSaveRoll = (resultId: string, name: string) => {
    const resultToSave = history.find(r => r.id === resultId) ?? (lastResult?.id === resultId ? lastResult : null);
    if (!resultToSave || !name.trim()) return;
    
    const newSavedRoll: SavedRoll = {
        id: Date.now().toString() + Math.random().toString(),
        name: name.trim(),
        dice: resultToSave.dice,
        modifier: resultToSave.modifier,
    };

    setSavedRolls(prev => [...prev, newSavedRoll]);
  };

  const handleRollPreset = async (rollToLoad: SavedRoll) => {
    setIsRolling(true);
    // Use the preset's dice/modifier, but the current advantage state
    const result = calculateRoll(rollToLoad.dice, rollToLoad.modifier, advantageState);
    setLastResult(result);
    setHistory(prev => [result, ...prev.slice(0, 9)]);
    
    // Clear the manual roll builder after a preset is used for consistency
    clearRoll();
    setIsRolling(false);
  };

  const handleDeleteRoll = (rollId: string) => {
      setSavedRolls(prev => prev.filter(r => r.id !== rollId));
  };


  return (
    <div className="min-h-screen bg-slate-900 bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 flex flex-col">
      <header className="text-center p-6 border-b border-amber-500/20 shadow-lg">
        <h1 className="font-medieval text-4xl text-amber-300 tracking-wider">Dice Roller</h1>
        <p className="text-slate-400">For Dungeons & Dragons 5e</p>
      </header>

      <main className="flex-grow container mx-auto p-4 max-w-4xl w-full">
        <div className="bg-slate-800/30 border border-slate-700 rounded-xl shadow-2xl p-6 mb-6">
          <div className="mb-4">
            <label className="font-medieval text-lg text-amber-200">1. Choose Your Dice</label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-2">
              {STANDARD_DICE.map(sides => {
                const dieCount = dice.find(d => d.sides === sides)?.count ?? 0;
                return <DiceButton key={sides} sides={sides} onClick={addDie} count={dieCount} />
              })}
            </div>
            <form onSubmit={handleCustomDieAdd} className="flex gap-2 mt-4">
                <input type="number" value={customSides} onChange={(e) => setCustomSides(e.target.value)} placeholder="d?" className="w-20 bg-slate-700 border border-slate-600 rounded-md text-center font-medieval text-xl text-amber-300 focus:ring-amber-500 focus:border-amber-500" />
                <button type="submit" className="px-4 py-2 bg-slate-600 hover:bg-slate-500 border border-slate-500 rounded-lg shadow-md transition-colors text-amber-300 text-sm">Add Custom</button>
            </form>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="font-medieval text-lg text-amber-200">2. Set Modifier</label>
              <div className="flex items-center gap-4 mt-2">
                <button onClick={() => setModifier(m => m - 1)} className="w-12 h-12 text-2xl bg-slate-700 hover:bg-slate-600 rounded-full flex-shrink-0">-</button>
                <input 
                  type="number"
                  value={modifier}
                  onChange={(e) => setModifier(parseInt(e.target.value, 10) || 0)}
                  className="w-20 h-12 bg-slate-700 border border-slate-600 rounded-md text-center font-mono text-3xl text-slate-100 focus:ring-amber-500 focus:border-amber-500"
                  aria-label="Modifier"
                />
                <button onClick={() => setModifier(m => m + 1)} className="w-12 h-12 text-2xl bg-slate-700 hover:bg-slate-600 rounded-full flex-shrink-0">+</button>
              </div>
            </div>
            <div>
              <label className="font-medieval text-lg text-amber-200">3. Advantage?</label>
              <div className="flex gap-2 mt-2">
                <button onClick={() => setAdvantageState(AdvantageState.None)} className={`px-4 py-2 rounded-lg transition-colors ${advantageState === AdvantageState.None ? 'bg-amber-500 text-slate-900 font-bold' : 'bg-slate-700 hover:bg-slate-600'}`}>None</button>
                <button onClick={() => setAdvantageState(AdvantageState.Advantage)} className={`px-4 py-2 rounded-lg transition-colors ${advantageState === AdvantageState.Advantage ? 'bg-green-600 text-white font-bold' : 'bg-slate-700 hover:bg-slate-600'}`}>Advantage</button>
                <button onClick={() => setAdvantageState(AdvantageState.Disadvantage)} className={`px-4 py-2 rounded-lg transition-colors ${advantageState === AdvantageState.Disadvantage ? 'bg-red-600 text-white font-bold' : 'bg-slate-700 hover:bg-slate-600'}`}>Disadvantage</button>
              </div>
            </div>
          </div>
        </div>

        <SavedRollsPanel
          savedRolls={savedRolls}
          onRollPreset={handleRollPreset}
          onDeleteRoll={handleDeleteRoll}
        />

        {lastResult && (
          <div className="mb-6">
            <ResultDisplay result={lastResult} onGenerateFlavor={handleGenerateFlavorText} onSaveRoll={handleSaveRoll} />
          </div>
        )}
        
        <HistoryPanel history={history} />
      </main>

      <footer className="sticky bottom-0 bg-slate-900/80 backdrop-blur-sm border-t border-amber-500/20 p-4 shadow-top-lg">
        <div className="container mx-auto max-w-4xl w-full flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="h-12 flex-grow bg-slate-800 border border-slate-700 rounded-lg px-4 flex items-center justify-center sm:justify-start">
                <span className="text-amber-200 font-medieval text-xl truncate">{formatRollString()}</span>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
                <button onClick={clearRoll} disabled={isRolling || dice.length === 0} className="w-1/2 sm:w-auto px-6 py-3 bg-slate-600 hover:bg-slate-500 text-slate-300 rounded-lg transition-all disabled:opacity-50">Clear</button>
                <button onClick={handleRoll} disabled={isRolling || dice.length === 0} className="w-1/2 sm:w-auto flex-grow px-10 py-3 bg-amber-600 hover:bg-amber-500 text-slate-900 font-bold font-medieval text-2xl rounded-lg shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:scale-100">
                    {isRolling ? 'Rolling...' : 'Roll'}
                </button>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;