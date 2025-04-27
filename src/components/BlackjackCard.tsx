import React from 'react';

export type Suit = '♥' | '♦' | '♣' | '♠';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface CardProps {
  suit: Suit;
  rank: Rank;
  hidden?: boolean;
}

const BlackjackCard: React.FC<CardProps> = ({ suit, rank, hidden = false }) => {
  const isRed = suit === '♥' || suit === '♦';
  
  if (hidden) {
    return (
      <div className="relative w-24 h-36 rounded-md shadow-md overflow-hidden transform transition-all hover:scale-105 card-back">
        <div className="absolute inset-0 border-2 border-white rounded-md"></div>
      </div>
    );
  }

  return (
    <div className="relative w-24 h-36 rounded-md shadow-md overflow-hidden transform transition-all hover:scale-105 bg-white">
      <div className={`p-2 flex flex-col h-full ${isRed ? 'text-casino-red' : 'text-black'}`}>
        <div className="text-lg font-bold">{rank}</div>
        <div className="text-xl">{suit}</div>
        <div className="flex-grow flex items-center justify-center text-3xl font-bold">
          {suit}
        </div>
        <div className="flex justify-end">
          <div className="text-lg font-bold rotate-180">{rank}</div>
          <div className="text-xl rotate-180">{suit}</div>
        </div>
      </div>
    </div>
  );
};

export default BlackjackCard;
