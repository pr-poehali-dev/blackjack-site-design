import React from 'react';
import BlackjackCard from '@/components/BlackjackCard';
import { Card } from '@/types/blackjack';
import { calculateHandValue } from '@/utils/blackjackUtils';

interface DealerHandProps {
  cards: Card[];
  hidden: boolean;
}

const DealerHand: React.FC<DealerHandProps> = ({ cards, hidden }) => {
  return (
    <div className="bg-casino-dark bg-opacity-60 rounded-lg p-4 mb-4">
      <h2 className="text-lg font-semibold mb-2 text-white">
        Дилер {!hidden && `(${calculateHandValue(cards)})`}
      </h2>
      <div className="flex gap-2 overflow-x-auto p-2">
        {cards.map((card, index) => (
          <div 
            key={`dealer-${index}`} 
            className="flex-shrink-0 transform transition-all" 
            style={{
              transform: `translateX(${-index * 20}px)`,
              zIndex: cards.length - index
            }}
          >
            <BlackjackCard 
              suit={card.suit} 
              rank={card.rank} 
              hidden={index === 1 && hidden} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DealerHand;
