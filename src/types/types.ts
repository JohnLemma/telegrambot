export interface WheelSegment {
  id: number;
  text: string;
  color: string;
  multiplier: number;
}

export interface BetHistoryItem {
  amount: number;
  result: string;
  multiplier: number;
  winAmount: number;
  timestamp: Date;
} 