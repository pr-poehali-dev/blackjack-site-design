import React from 'react';

interface GameStatusProps {
  message: string;
  playerBalance: number;
  currentBet: number;
  showBet: boolean;
}

const GameStatus: React.FC<GameStatusProps> = ({ 
  message, 
  playerBalance, 
  currentBet, 
  showBet 
}) => {
  return (
    <div className="text-center mb-4">
      <h1 className="text-4xl font-casino font-bold text-casino-gold mb-2">Блэкджек</h1>
      <p className="text-lg text-white mb-4">{message}</p>
      
      <div className="flex justify-center items-center gap-4 mb-4">
        <div className="text-white bg-casino-dark p-3 rounded-md">
          <p className="text-sm">Баланс</p>
          <p className="text-2xl font-bold text-casino-gold">${playerBalance}</p>
        </div>
        
        {showBet && (
          <div className="text-white bg-casino-dark p-3 rounded-md">
            <p className="text-sm">Ставка</p>
            <p className="text-2xl font-bold text-casino-gold">${currentBet}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameStatus;
