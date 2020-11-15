using System.Collections.Generic;
using System;
using DoppelkopfApi.Entities;
using System.Linq;

namespace DoppelkopfApi.Helpers
{

    public class CardHandler
    {


        public List<Card> ShuffleCardsOld()
        {
            List<Card> cards = new List<Card>();
            Random random = new Random(5);

            var suits = Enum.GetNames(typeof(Suits));
            var ranks = Enum.GetNames(typeof(Ranks));
            var cardsCount = suits.Length * ranks.Length * 2;
            while (cards.Count < cardsCount)
            {
                int suite = random.Next(suits.Length);
                int rank = random.Next(ranks.Length);
                Card newCard = new Card(Enum.Parse<Suits>(suits[suite]), Enum.Parse<Ranks>(ranks[rank]));
                int cardCount = cards.FindAll((card) => card == newCard).Count;
                if (cardCount < 2)
                {
                    cards.Add(newCard);
                }
            }
            return cards;
        }

        public List<Card> ShuffleCards()
        {
            var cards = GetNewCards();
            Random random = new Random(40);
            return new List<Card>(ShuffelCards.Shuffle<Card>(cards.ToArray(), random));
        }


        public List<Card> GetNewCards()
        {
            List<Card> cards = new List<Card>();
            Random random = new Random(5);

            var suits = Enum.GetNames(typeof(Suits));
            var ranks = Enum.GetNames(typeof(Ranks));
            for (int i = 1; i <= 2; i++)
            {
                foreach (var suite in suits)
                {
                    foreach (var rank in ranks)
                    {
                        cards.Add(new Card(Enum.Parse<Suits>(suite), Enum.Parse<Ranks>(rank)));
                    }
                }
            }

            return cards;
        }

        public List<Card>[] DistributeCards(bool withNiner)
        {
            var cards = ShuffleCards();
            List<Card>[] playerCards = new List<Card>[4];
            for (int i = 0; i < playerCards.Length; i++)
            {
                playerCards[i] = new List<Card>();
            }

            if (cards.Count > 0)
            {
                int[] shuffelCounts = new int[3] { 4, 4, 4 };

                if (!withNiner)
                {
                    cards = cards.FindAll((card) => card.Rank != Ranks.nine);
                    shuffelCounts = new int[3] { 3, 4, 3 };
                }


                for (int j = 0; j < shuffelCounts.Length; j++)
                {
                    for (int i = 0; i < 4; i++)
                    {
                        var cardsForPlayer = cards.GetRange(0, shuffelCounts[j]);
                        playerCards[i].AddRange(cardsForPlayer);
                        cards.RemoveRange(0, shuffelCounts[j]);
                    }
                }
            }

            return playerCards;
        }

        /// <summary>
        /// Return the Id of one player thate run a silent, outherwise return -1
        ///  </summary>
        /// <param name="tablePlayers"></param>
        /// <returns></returns>
        public int SilentPlayer(TablePlayer[] tablePlayers)
        {
            bool onePlayerWithNoneVariant = tablePlayers.Count((p) => p.GameVariant == GamesVariants.None) > 0;
            if (onePlayerWithNoneVariant)
            {
                var player = tablePlayers.FirstOrDefault((p) => p.GetHandCards().Count((c) => c.Rank == Ranks.queen && c.Suit == Suits.clubs) == 2);
                return player == null ? -1 : player.PlayerId;
            }
            return -1;
        }

        public GamesVariants WhichVariantIsPlayed(TablePlayer[] tablePlayers)
        {
            GamesVariants playedVariant = GamesVariants.Normal;
            int weighting = 50;
            foreach (var player in tablePlayers)
            {
                int weightingbuffer = 50;
                GamesVariants variantBuff;
                switch (player.GameVariant)
                {
                    case GamesVariants.ColoRSoloClubs:
                        weightingbuffer = 0;
                        variantBuff = GamesVariants.ColoRSoloClubs;
                        break;
                    case GamesVariants.ColoRSoloSpades:
                        weightingbuffer = 1;
                        variantBuff = GamesVariants.ColoRSoloSpades;
                        break;
                    case GamesVariants.ColoRSoloHearts:
                        weightingbuffer = 2;
                        variantBuff = GamesVariants.ColoRSoloHearts;
                        break;
                    case GamesVariants.ColoRSoloDiamonds:
                        weightingbuffer = 3;
                        variantBuff = GamesVariants.ColoRSoloDiamonds;
                        break;
                    case GamesVariants.Solo:
                        weightingbuffer = 4;
                        variantBuff = GamesVariants.Solo;
                        break;
                    case GamesVariants.AceSolo:
                        weightingbuffer = 5;
                        variantBuff = GamesVariants.AceSolo;
                        break;
                    case GamesVariants.KingSolo:
                        weightingbuffer = 6;
                        variantBuff = GamesVariants.KingSolo;
                        break;
                    case GamesVariants.QueenSolo:
                        weightingbuffer = 7;
                        variantBuff = GamesVariants.QueenSolo;
                        break;
                    case GamesVariants.JackSolo:
                        weightingbuffer = 8;
                        variantBuff = GamesVariants.JackSolo;
                        break;
                    case GamesVariants.Wedding:
                        weightingbuffer = 9;
                        variantBuff = GamesVariants.Wedding;
                        break;
                    default:
                        weightingbuffer = 10;
                        variantBuff = GamesVariants.Normal;
                        break;
                }
                if (weightingbuffer < weighting)
                {
                    weighting = weightingbuffer;
                    playedVariant = variantBuff;
                }
            }

            return playedVariant;
        }

        public void SetPlayerGameVariant(GamesVariants playVariant, TablePlayer[] players)
        {
            foreach (var player in players)
            {
                if (playVariant != GamesVariants.Normal && player.GameVariant != playVariant)
                {
                    player.GameVariant = GamesVariants.Normal;
                }
            }

        }

        /// <summary>
        /// Return the round winners player id.
        /// </summary>
        /// <param name="playedCards"></param>
        /// <param name="table"></param>
        /// <returns></returns>
        public int WhoeWinCardRound(PlayCard[] playedCards, PlayTable table)
        {
            switch (table.GameVariant)
            {
                case GamesVariants.AceSolo:
                    return WhoeWinCardRound(playedCards, (card) => SoloRating(card.Card, Ranks.ace));
                case GamesVariants.JackSolo:
                    return WhoeWinCardRound(playedCards, (card) => SoloRating(card.Card, Ranks.jack));
                case GamesVariants.QueenSolo:
                    return WhoeWinCardRound(playedCards, (card) => SoloRating(card.Card, Ranks.queen));
                case GamesVariants.KingSolo:
                    return WhoeWinCardRound(playedCards, (card) => SoloRating(card.Card, Ranks.king));

                default:
                    return WhoeWinCardRound(playedCards, (card) => NormalRating(card.Card));
            }
        }

        public bool IsColorPlayed(Card card)
        {
            return NormalRating(card) >= 50;
        }

        public int CardPoints(PlayCard[] playCard)
        {
            int sum = 0;
            for (int i = 0; i < playCard.Length; i++)
            {
                sum += CardPoints(playCard[i]);
            }
            return sum;
        }



        private int SuitRating(Card card)
        {
            switch (card.Suit)
            {
                case Suits.clubs:
                    return 1;
                case Suits.spades:
                    return 2;
                case Suits.hearts:
                    return 3;
                case Suits.diamonds:
                    return 4;

                default:
                    return -1;
            }
        }




        private int SoloRating(Card card, Ranks soloRank)
        {
            var suitRating = SuitRating(card);

            if (card == soloRank)
            {
                return (10 + suitRating);
            }

            switch (card.Rank)
            {
                case Ranks.ace:
                    return 20 + suitRating;
                case Ranks.ten:
                    return 30 + suitRating;
                case Ranks.king:
                    return 40 + suitRating;
                case Ranks.queen:
                    return 50 + suitRating;
                case Ranks.jack:
                    return 60 + suitRating;
                case Ranks.nine:
                    return 70 + suitRating;
                default:
                    return -1;
            }
        }

        private int NormalRating(Card card)
        {

            if (card == Ranks.ten && card == Suits.hearts)
            {
                return 10;
            }
            if (card == Ranks.queen)
            {
                return 20 + SuitRating(card);
            }
            if (card == Ranks.jack)
            {
                return 30 + SuitRating(card);
            }
            if (card == Suits.diamonds)
            {
                switch (card.Rank)
                {
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
            int suitRating = SuitRating(card);
            switch (card.Rank)
            {
                case Ranks.ace:
                    return 50 + suitRating;
                case Ranks.ten:
                    return 60 + suitRating;
                case Ranks.king:
                    return 70 + suitRating;

                default:
                    return 80 + suitRating;
            }
        }

        private int CardPoints(PlayCard playCard)
        {
            switch (playCard.Card.Rank)
            {
                case Ranks.ace:
                    return 11;
                case Ranks.ten:
                    return 10;
                case Ranks.king:
                    return 3;
                case Ranks.queen:
                    return 2;
                case Ranks.jack:
                    return 1;

                default:
                    return 0;
            }
        }




        /// <summary>
        /// return the round winners player id
        /// </summary>
        /// <param name="cards"></param>
        /// <param name="ratingFunc"></param>
        /// <returns></returns>
        private int WhoeWinCardRound(PlayCard[] cards, Func<PlayCard, int> ratingFunc)
        {
            int ratingMin = 1000;
            int playerId = -1;
            for (int i = 0; i < cards.Length; i++)
            {
                int rating = ratingFunc(cards[i]);
                if (rating == -1)
                {
                    throw new Exception("Card suit or rank could not be determined.");
                }

                if (ratingMin > rating)
                {
                    playerId = cards[i].PlayerId;
                    ratingMin = rating;
                }
            }
            return playerId;

        }


    }

    public static class ShuffelCards
    {
        public static IEnumerable<T> Shuffle<T>(this T[] source, Random rng)
        {
            T[] elements = source;
            for (int i = elements.Length - 1; i >= 0; i--)
            {
                // Swap element "i" with a random earlier element it (or itself)
                // ... except we don't really need to swap it fully, as we can
                // return it immediately, and afterwards it's irrelevant.
                int swapIndex = rng.Next(i + 1);
                yield return elements[swapIndex];
                elements[swapIndex] = elements[i];
            }
        }
    }
}