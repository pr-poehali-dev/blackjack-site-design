import { RANKS, SUITS, VALUES, Card } from "@/types/blackjack";

// Инициализация и перемешивание колоды
export const initializeDeck = (): Card[] => {
  const newDeck: Card[] = [];
  
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      newDeck.push({
        suit,
        rank,
        value: VALUES[rank][0]
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

// Подсчет очков руки (с учетом тузов)
export const calculateHandValue = (hand: Card[]): number => {
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
