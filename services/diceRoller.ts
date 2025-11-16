import { Die, AdvantageState, CriticalState, RollResult, DiceRollResult } from '../types';

const rollDie = (sides: number): number => {
  return Math.floor(Math.random() * sides) + 1;
};

export const calculateRoll = (dice: Die[], modifier: number, advantageState: AdvantageState): RollResult => {
  let total = modifier;
  let criticalState: CriticalState = CriticalState.None;
  const diceResults: DiceRollResult[] = [];
  let d20AdvDisResults: { kept: number; discarded: number } | undefined;

  const rollString = dice.map(d => `${d.count}d${d.sides}`).join(' + ') + (modifier !== 0 ? ` ${modifier > 0 ? '+' : '-'} ${Math.abs(modifier)}` : '');

  dice.forEach(({ sides, count }) => {
    const rolls: number[] = [];
    for (let i = 0; i < count; i++) {
      if (sides === 20 && advantageState !== AdvantageState.None) {
        const roll1 = rollDie(20);
        const roll2 = rollDie(20);
        let kept: number, discarded: number;

        if (advantageState === AdvantageState.Advantage) {
          kept = Math.max(roll1, roll2);
          discarded = Math.min(roll1, roll2);
        } else { // Disadvantage
          kept = Math.min(roll1, roll2);
          discarded = Math.max(roll1, roll2);
        }
        
        rolls.push(kept);
        total += kept;
        d20AdvDisResults = { kept, discarded };

        if (kept === 20) criticalState = CriticalState.Success;
        if (kept === 1) criticalState = CriticalState.Failure;

      } else {
        const result = rollDie(sides);
        rolls.push(result);
        total += result;
        if (sides === 20) {
          if (result === 20) criticalState = CriticalState.Success;
          if (result === 1) criticalState = CriticalState.Failure;
        }
      }
    }
    diceResults.push({ sides, rolls });
  });

  return {
    id: Date.now().toString() + Math.random().toString(),
    total,
    rollString,
    dice,
    diceResults,
    modifier,
    advantageState,
    criticalState,
    d20AdvDisResults,
    isFlavorTextLoading: false,
  };
};