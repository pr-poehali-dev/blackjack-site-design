import React, { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Card, GameState } from '@/types/blackjack';
import { initializeDeck, calculateHandValue } from '@/utils/blackjackUtils';
import GameStatus from './blackjack/GameStatus';
import BettingControls from './blackjack/BettingControls';
import PlayerHand from './blackjack/PlayerHand';
import DealerHand from './blackjack/DealerHand';
import GameControls from './blackjack/GameControls';

const BlackjackGame: React.FC = () => {
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameState, setGameState] = useState<GameState>('betting');
  const [playerBalance, setPlayerBalance] = useState(1000);
  const [currentBet, setCurrentBet] = useState(0);
  const [message, setMessage] = useState('Добро пожаловать в Блэк Джек! Сделайте ставку');
  const [dealerCardHidden, setDealerCardHidden] = useState(true);

  // Взять карту из колоды
  const drawCard = () => {
    if (deck.length === 0) {
      const newDeck = initializeDeck();
      setDeck(newDeck.slice(1));
      return newDeck[0];
    }
    const card = deck[0];
    setDeck(deck.slice(1));
    return card;
  };

  // Начало новой игры
  const startGame = () => {
    if (currentBet <= 0) {
      toast({
        title: "Ошибка",
        description: "Сделайте ставку перед началом игры",
        variant: "destructive"
      });
      return;
    }

    if (currentBet > playerBalance) {
      toast({
        title: "Ошибка",
        description: "У вас недостаточно средств для такой ставки",
        variant: "destructive"
      });
      return;
    }

    setPlayerBalance(playerBalance - currentBet);
    
    const newDeck = deck.length < 10 ? initializeDeck() : [...deck];
    setDeck(newDeck);
    
    const newPlayerHand = [drawCard(), drawCard()];
    const newDealerHand = [drawCard(), drawCard()];
    
    setPlayerHand(newPlayerHand);
    setDealerHand(newDealerHand);
    setDealerCardHidden(true);
    setGameState('playing');
    
    const playerValue = calculateHandValue(newPlayerHand);
    
    if (playerValue === 21) {
      handleDealerTurn(newPlayerHand, newDealerHand);
    } else {
      setMessage('Ваш ход');
    }
  };

  // Игрок берет карту
  const handleHit = () => {
    if (gameState !== 'playing') return;
    
    const newCard = drawCard();
    const newHand = [...playerHand, newCard];
    setPlayerHand(newHand);
    
    const handValue = calculateHandValue(newHand);
    
    if (handValue > 21) {
      setMessage('Перебор! Вы проиграли');
      setGameState('gameOver');
      setDealerCardHidden(false);
    } else if (handValue === 21) {
      handleDealerTurn(newHand, dealerHand);
    }
  };

  // Игрок остается с текущими картами
  const handleStand = () => {
    if (gameState !== 'playing') return;
    handleDealerTurn(playerHand, dealerHand);
  };

  // Ход дилера
  const handleDealerTurn = (playerCards: Card[], dealerCards: Card[]) => {
    setDealerCardHidden(false);
    setGameState('dealerTurn');
    
    let currentDealerHand = [...dealerCards];
    let dealerValue = calculateHandValue(currentDealerHand);
    const playerValue = calculateHandValue(playerCards);
    
    // Дилер берет карты, пока его сумма < 17
    const dealerPlay = async () => {
      while (dealerValue < 17) {
        // Пауза для анимации
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const newCard = drawCard();
        currentDealerHand = [...currentDealerHand, newCard];
        setDealerHand(currentDealerHand);
        dealerValue = calculateHandValue(currentDealerHand);
      }
      
      determineWinner(playerValue, dealerValue);
    };
    
    dealerPlay();
  };

  // Определение победителя
  const determineWinner = (playerValue: number, dealerValue: number) => {
    setGameState('gameOver');
    
    if (playerValue > 21) {
      setMessage('Перебор! Вы проиграли');
    } else if (dealerValue > 21) {
      setMessage('Дилер перебрал! Вы выиграли');
      setPlayerBalance(playerBalance + currentBet * 2);
    } else if (playerValue === dealerValue) {
      setMessage('Ничья!');
      setPlayerBalance(playerBalance + currentBet);
    } else if (playerValue === 21 && playerHand.length === 2) {
      setMessage('Блэкджек! Вы выиграли');
      setPlayerBalance(playerBalance + currentBet * 2.5);
    } else if (playerValue > dealerValue) {
      setMessage('Вы выиграли!');
      setPlayerBalance(playerBalance + currentBet * 2);
    } else {
      setMessage('Дилер выиграл');
    }
  };

  // Изменение ставки
  const handleBetChange = (amount: number) => {
    if (gameState !== 'betting') return;
    
    if (currentBet + amount < 0) {
      setCurrentBet(0);
    } else if (currentBet + amount > playerBalance) {
      setCurrentBet(playerBalance);
    } else {
      setCurrentBet(currentBet + amount);
    }
  };

  // Начать новую игру
  const handleNewGame = () => {
    setGameState('betting');
    setPlayerHand([]);
    setDealerHand([]);
    setMessage('Сделайте ставку');
    setCurrentBet(0);
  };

  // Инициализация колоды при первой загрузке
  useEffect(() => {
    setDeck(initializeDeck());
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6 w-full min-h-screen">
      <GameStatus 
        message={message}
        playerBalance={playerBalance}
        currentBet={currentBet}
        showBet={gameState === 'betting'}
      />
      
      {gameState === 'betting' ? (
        <BettingControls 
          onBetChange={handleBetChange}
          onStartGame={startGame}
          currentBet={currentBet}
          playerBalance={playerBalance}
        />
      ) : (
        <>
          <div className="mb-6 w-full max-w-2xl">
            <DealerHand cards={dealerHand} hidden={dealerCardHidden} />
            <PlayerHand cards={playerHand} />
          </div>
          
          <GameControls 
            gameState={gameState}
            onHit={handleHit}
            onStand={handleStand}
            onNewGame={handleNewGame}
          />
        </>
      )}
      
      <div className="mt-6 text-sm text-gray-400">
        <p>Правила: Выигрывает тот, кто ближе всего к 21, не превышая это число. Блэкджек (21 в первых двух картах) выплачивается 3:2.</p>
      </div>
    </div>
  );
};

export default BlackjackGame;
