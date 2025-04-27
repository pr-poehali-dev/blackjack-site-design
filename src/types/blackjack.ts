import { Rank, Suit } from "@/components/BlackjackCard";

export type Card = {
  suit: Suit;
  rank: Rank;
  value: number;
};

export type GameState = 'betting' | 'playing' | 'dealerTurn' | 'gameOver';

export const SUITS: Suit[] = ['♥', '♦', '♣', '♠'];
export const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
export const VALUES: Record<Rank, number[]> = {
  'A': [1, 11], '2': [2], '3': [3], '4': [4], '5': [5], '6': [6], 
  '7': [7], '8': [8], '9': [9], '10': [10], 'J': [10], 'Q': [10], 'K': [10]
};
