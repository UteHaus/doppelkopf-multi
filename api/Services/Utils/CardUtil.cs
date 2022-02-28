using System.Collections.Generic;
using System;
using DoppelkopfApi.Entities;
using System.Linq;
using System.Text.Json;

namespace DoppelkopfApi.Services.Utils
{

    public static class CardUtil
    {

        public static void SetHandCards(TablePlayer[] tablePlayers, bool withNiner)
        {
            var playerCards = DistributeCards(withNiner);
            for (int i = 0; i < tablePlayers.Length; i++)
            {
                tablePlayers[i].HandCards = JsonSerializer.Serialize(playerCards[i]); // .GetRange(0, 3)//for test
                tablePlayers[i].HasClubsQueenOnHand = playerCards[i].Count((card) => card.IsClubQueen()) > 0;
            }
        }

        public static List<Card> ShuffleCardsOld()
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



        public static List<Card> ShuffleCards(List<Card> cards = null)
        {
            cards = cards == null ? GetNewCards() : cards;
            return cards.OrderBy(x => Guid.NewGuid()).ToList();
        }


        public static List<Card> GetNewCards()
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

        public static List<Card>[] DistributeCards(bool withNiner, List<Card> cards = null)
        {
            cards = ShuffleCards(cards);
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