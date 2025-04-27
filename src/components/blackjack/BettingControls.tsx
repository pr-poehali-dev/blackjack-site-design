import React from 'react';
import { Button } from '@/components/ui/button';

interface BettingControlsProps {
  onBetChange: (amount: number) => void;
  onStartGame: () => void;
  currentBet: number;
  playerBalance: number;
}

const BettingControls: React.FC<BettingControlsProps> = ({ 
  onBetChange, 
  onStartGame, 
  currentBet, 
  playerBalance 
}) => {
  return (
    <div className="mb-8">
      <div className="flex gap-2 mb-4">
        <Button 
          variant="outline" 
          onClick={() => onBetChange(10)}
          className="bg-casino-dark text-white hover:bg-casino-green"
        >
          +10
        </Button>
        <Button 
          variant="outline" 
          onClick={() => onBetChange(25)}
          className="bg-casino-dark text-white hover:bg-casino-green"
        >
          +25
        </Button>
        <Button 
          variant="outline" 
          onClick={() => onBetChange(100)}
          className="bg-casino-dark text-white hover:bg-casino-green"
        >
          +100
        </Button>
        <Button 
          variant="outline" 
          onClick={() => onBetChange(-10)}
          className="bg-casino-dark text-white hover:bg-casino-red"
        >
          -10
        </Button>
        <Button 
          variant="outline" 
          onClick={() => onBetChange(-currentBet)}
          className="bg-casino-dark text-white hover:bg-casino-red"
        >
          Сброс
        </Button>
      </div>
      
      <Button 
        onClick={onStartGame} 
        className="w-full bg-casino-green hover:bg-casino-green/80"
        disabled={currentBet <= 0 || currentBet > playerBalance}
      >
        Начать игру
      </Button>
    </div>
  );
};

export default BettingControls;
