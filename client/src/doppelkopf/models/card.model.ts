export class Card {
  constructor(suit: Suits, rank: Ranks) {
    this.suit = suit;
    this.rank = rank;
  }

  public suit: Suits;
  public rank: Ranks;
}

export enum Suits {
  // "♦"
  diamonds = 'diamonds',
  // "♥"
  hearts = 'hearts',
  // "♠"
  spades = 'spades',
  //"♣"
  clubs = 'clubs',
}

export enum Ranks {
  // "10"
  ten = 'ten',
  // "K"
  king = 'king',
  // "Q"
  queen = 'queen',
  // "J"
  jack = 'jack',
  // "A"
  ace = 'ace',
  nine = 'nine',
}
