import React from 'react';
import { Button } from '@/components/ui/button';
import { GameState } from '@/types/blackjack';

interface GameControlsProps {
  gameState: GameState;
  onHit: () => void;
  onStand: () => void;
  onNewGame: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({ 
  gameState, 
  onHit, 
  onStand, 
  onNewGame 
}) => {
  return (
    <div className="flex gap-4">
      {gameState === 'playing' && (
        <>
          <Button onClick={onHit} className="bg-casino-green hover:bg-casino-green/80">
            Еще карту
          </Button>
          <Button onClick={onStand} className="bg-casino-red hover:bg-casino-red/80">
            Хватит
          </Button>
        </>
      )}
      
      {gameState === 'gameOver' && (
        <Button onClick={onNewGame} className="bg-casino-gold text-black hover:bg-casino-gold/80">
          Новая игра
        </Button>
      )}
    </div>
  );
};

export default GameControls;
