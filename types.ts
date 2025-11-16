
export enum AdvantageState {
  None = 'none',
  Advantage = 'advantage',
  Disadvantage = 'disadvantage',
}

export enum CriticalState {
  None = 'none',
  Success = 'success',
  Failure = 'failure',
}

export interface Die {
  sides: number;
  count: number;
}

export interface DiceRollResult {
  sides: number;
  rolls: number[];
}

export interface SavedRoll {
  id: string;
  name: string;
  dice: Die[];
  modifier: number;
}

export interface RollResult {
  id: string;
  total: number;
  rollString: string;
  dice: Die[];
  diceResults: DiceRollResult[];
  modifier: number;
  advantageState: AdvantageState;
  criticalState: CriticalState;
  d20AdvDisResults?: {
    kept: number;
    discarded: number;
  };
  flavorText?: string;
  isFlavorTextLoading?: boolean;
}