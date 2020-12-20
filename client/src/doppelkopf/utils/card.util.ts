import { GamesVariants } from '../models/play-table.model';
import { Card, Ranks, Suits } from './../models/card.model';

export class CardUtil {
  public static orderCards(
    cards: Card[],
    gameVariant: GamesVariants,
    diamondsAceAsMaster: boolean
  ): Card[] {
    const ratingFunktion = this.getRankingFunktion(
      gameVariant,
      diamondsAceAsMaster
    );
    return cards.sort(
      (cardA, cardB) => ratingFunktion(cardA) - ratingFunktion(cardB)
    );
  }

  private static getRankingFunktion(
    gameVariant: GamesVariants,
    diamondsAceAsMaster: boolean
  ): (card: Card) => number {
    switch (gameVariant) {
      case GamesVariants.AceSolo:
        return (card: Card) => this.rankSoloRating(card, Ranks.ace);
      case GamesVariants.JackSolo:
        return (card) => this.rankSoloRating(card, Ranks.jack);
      case GamesVariants.QueenSolo:
        return (card) => this.rankSoloRating(card, Ranks.queen);
      case GamesVariants.KingSolo:
        return (card) => this.rankSoloRating(card, Ranks.king);
      case GamesVariants.ColoRSoloClubs:
        return (card) => this.colorSoloRating(card, Suits.clubs);
      case GamesVariants.ColoRSoloDiamonds:
        return (card) => this.colorSoloRating(card, Suits.diamonds);
      case GamesVariants.ColoRSoloHearts:
        return (card) => this.colorSoloRating(card, Suits.hearts);
      case GamesVariants.ColoRSoloSpades:
        return (card) => this.colorSoloRating(card, Suits.spades);
      default:
        return (card) => this.normalRating(card, diamondsAceAsMaster);
    }
  }

  private static rankSoloRating(card: Card, soloRank: Ranks): number {
    var suitRating = this.suitRating(card);

    if (card.rank == soloRank) {
      return 10 + suitRating;
    }

    return 20 * this.suitRating(card) + this.rankRating(card.rank);
  }

  private static colorSoloRating(card: Card, soloSuit: Suits): number {
    var rankRating = this.rankRating(card.rank);

    if (card.suit == soloSuit) {
      return 10 + rankRating;
    }

    return 20 * this.suitRating(card) + rankRating;
  }

  private static normalRating(card: Card, diamondsAceAsMaster: boolean) {
    if (
      diamondsAceAsMaster &&
      card.rank == Ranks.ace &&
      card.suit == Suits.diamonds
    ) {
      return 5;
    } else if (card.rank == Ranks.ten && card.suit == Suits.hearts) {
      return 10;
    } else if (card.rank == Ranks.queen) {
      return 20 + this.suitRating(card);
    } else if (card.rank == Ranks.jack) {
      return 30 + this.suitRating(card);
    } else if (card.suit == Suits.diamonds) {
      switch (card.rank) {
        case Ranks.ace:
          return 41;
        case Ranks.ten:
          return 42;
        case Ranks.king:
          return 43;
        default:
          return 44;
      }
    }
    const rankRating = this.rankRating(card.rank);
    switch (card.suit) {
      case Suits.clubs:
        return 50 + rankRating;
      case Suits.spades:
        return 60 + rankRating;
      case Suits.hearts:
        return 70 + rankRating;

      default:
        return 80 + rankRating;
    }
  }

  private static suitRating(card: Card): number {
    switch (card.suit) {
      case Suits.clubs:
        return 1;
      case Suits.spades:
        return 2;
      case Suits.hearts:
        return 3;
      case Suits.diamonds:
        return 4;

      default:
        return 5;
    }
  }

  private static rankRating(rank: Ranks): number {
    switch (rank) {
      case Ranks.ace:
        return 1;
      case Ranks.ten:
        return 2;
      case Ranks.king:
        return 3;
      case Ranks.queen:
        return 4;
      case Ranks.jack:
        return 5;
      case Ranks.nine:
        return 6;
      default:
        return 7;
    }
  }
}
