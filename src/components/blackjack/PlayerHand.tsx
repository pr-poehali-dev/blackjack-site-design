import React from 'react';
import BlackjackCard from '@/components/BlackjackCard';
import { Card } from '@/types/blackjack';
import { calculateHandValue } from '@/utils/blackjackUtils';

interface PlayerHandProps {
  cards: Card[];
}

const PlayerHand: React.FC<PlayerHandProps> = ({ cards }) => {
  return (
    <div className="bg-casino-dark bg-opacity-60 rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-2 text-white">
        Игрок ({calculateHandValue(cards)})
      </h2>
      <div className="flex gap-2 overflow-x-auto p-2">
        {cards.map((card, index) => (
          <div 
            key={`player-${index}`} 
            className="flex-shrink-0 transform transition-all" 
            style={{
              transform: `translateX(${-index * 20}px)`,
              zIndex: cards.length - index
            }}
          >
            <BlackjackCard suit={card.suit} rank={card.rank} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerHand;
