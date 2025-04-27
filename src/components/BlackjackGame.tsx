import React, { useState, useEffect } from 'react';
import BlackjackCard, { Suit, Rank } from './BlackjackCard';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

type Card = {
  suit: Suit;
  rank: Rank;
  value: number;
};

const suits: Suit[] = ['♥', '♦', '♣', '♠'];
const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const values: Record<Rank, number[]> = {
  'A': [1, 11], '2': [2], '3': [3], '4': [4], '5': [5], '6': [6], '7': [7], '8': [8], '9': [9], '10': [10], 'J': [10], 'Q': [10], 'K': [10]
};

const BlackjackGame: React.FC = () => {
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'dealerTurn' | 'gameOver'>('betting');
  const [playerBalance, setPlayerBalance] = useState(1000);
  const [currentBet, setCurrentBet] = useState(0);
  const [message, setMessage] = useState('Добро пожаловать в Блэк Джек! Сделайте ставку');
  const [dealerCardHidden, setDealerCardHidden] = useState(true);

  // Инициализация и перемешивание колоды
  const initializeDeck = () => {
    const newDeck: Card[] = [];
    
    for (const suit of suits) {
      for (const rank of ranks) {
        newDeck.push({
          suit,
          rank,
          value: values[rank][0]
        });
      }
    }
    
    // Перемешивание колоды (алгоритм Фишера-Йейтса)
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }
    
    return newDeck;
  };

  // Взять карту из колоды
  const drawCard = () => {
    if (deck.length === 0) {
      setDeck(initializeDeck());
      return deck[0];
    }
    const card = deck[0];
    setDeck(deck.slice(1));
    return card;
  };

  // Подсчет очков руки (с учетом тузов)
  const calculateHandValue = (hand: Card[]) => {
    let value = 0;
    let aces = 0;

    for (const card of hand) {
      if (card.rank === 'A') {
        aces += 1;
        value += 11;
      } else {
        value += card.value;
      }
    }

    // Если сумма больше 21 и есть тузы, считаем тузы за 1
    while (value > 21 && aces > 0) {
      value -= 10;
      aces -= 1;
    }

    return value;
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
      <div className="text-center mb-4">
        <h1 className="text-4xl font-casino font-bold text-casino-gold mb-2">Блэкджек</h1>
        <p className="text-lg text-white mb-4">{message}</p>
        
        <div className="flex justify-center items-center gap-4 mb-4">
          <div className="text-white bg-casino-dark p-3 rounded-md">
            <p className="text-sm">Баланс</p>
            <p className="text-2xl font-bold text-casino-gold">${playerBalance}</p>
          </div>
          
          {gameState === 'betting' && (
            <div className="text-white bg-casino-dark p-3 rounded-md">
              <p className="text-sm">Ставка</p>
              <p className="text-2xl font-bold text-casino-gold">${currentBet}</p>
            </div>
          )}
        </div>
      </div>
      
      {gameState === 'betting' ? (
        <div className="mb-8">
          <div className="flex gap-2 mb-4">
            <Button 
              variant="outline" 
              onClick={() => handleBetChange(10)}
              className="bg-casino-dark text-white hover:bg-casino-green"
            >
              +10
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleBetChange(25)}
              className="bg-casino-dark text-white hover:bg-casino-green"
            >
              +25
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleBetChange(100)}
              className="bg-casino-dark text-white hover:bg-casino-green"
            >
              +100
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleBetChange(-10)}
              className="bg-casino-dark text-white hover:bg-casino-red"
            >
              -10
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setCurrentBet(0)}
              className="bg-casino-dark text-white hover:bg-casino-red"
            >
              Сброс
            </Button>
          </div>
          
          <Button 
            onClick={startGame} 
            className="w-full bg-casino-green hover:bg-casino-green/80"
            disabled={currentBet <= 0 || currentBet > playerBalance}
          >
            Начать игру
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-6 w-full max-w-2xl">
            <div className="bg-casino-dark bg-opacity-60 rounded-lg p-4 mb-4">
              <h2 className="text-lg font-semibold mb-2 text-white">Дилер {!dealerCardHidden && `(${calculateHandValue(dealerHand)})`}</h2>
              <div className="flex gap-2 overflow-x-auto p-2">
                {dealerHand.map((card, index) => (
                  <div key={`dealer-${index}`} className="flex-shrink-0 transform transition-all" style={{
                    transform: `translateX(${-index * 20}px)`,
                    zIndex: dealerHand.length - index
                  }}>
                    <BlackjackCard 
                      suit={card.suit} 
                      rank={card.rank} 
                      hidden={index === 1 && dealerCardHidden} 
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-casino-dark bg-opacity-60 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2 text-white">Игрок ({calculateHandValue(playerHand)})</h2>
              <div className="flex gap-2 overflow-x-auto p-2">
                {playerHand.map((card, index) => (
                  <div key={`player-${index}`} className="flex-shrink-0 transform transition-all" style={{
                    transform: `translateX(${-index * 20}px)`,
                    zIndex: playerHand.length - index
                  }}>
                    <BlackjackCard suit={card.suit} rank={card.rank} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex gap-4">
            {gameState === 'playing' && (
              <>
                <Button onClick={handleHit} className="bg-casino-green hover:bg-casino-green/80">
                  Еще карту
                </Button>
                <Button onClick={handleStand} className="bg-casino-red hover:bg-casino-red/80">
                  Хватит
                </Button>
              </>
            )}
            
            {gameState === 'gameOver' && (
              <Button onClick={handleNewGame} className="bg-casino-gold text-black hover:bg-casino-gold/80">
                Новая игра
              </Button>
            )}
          </div>
        </>
      )}
      
      <div className="mt-6 text-sm text-gray-400">
        <p>Правила: Выигрывает тот, кто ближе всего к 21, не превышая это число. Блэкджек (21 в первых двух картах) выплачивается 3:2.</p>
      </div>
    </div>
  );
};

export default BlackjackGame;
