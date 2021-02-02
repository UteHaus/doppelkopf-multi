using System.Runtime.InteropServices;
using System;
using Xunit;
using DoppelkopfApi.Entities;
using DoppelkopfApi.Services.Utils;

namespace api.Tests.Utils
{
    public class CardUtilTest
    {

        [Fact]
        public void GivePlayerCardTest()
        {


            var players = new TablePlayer[]  {
                new TablePlayer { PlayerId = 1,  GameVariant= GamesVariants.Normal },
                new TablePlayer { PlayerId = 2,  GameVariant= GamesVariants.Normal},
                new TablePlayer { PlayerId = 3,  GameVariant= GamesVariants.Normal},
                new TablePlayer { PlayerId = 4,  GameVariant= GamesVariants.Normal}
                };

            CardUtil.SetHandCards(players, false);
            bool[] playersHasDiamondClubCard = new bool[4];
            for (var i = 0; i < players.Length; i++)
            {
                var hasPlayerDiamondClubCard = HasDiamondClubCard(players[i].GetHandCards());
                Assert.True(players[i].HasClubsQueenOnHand == hasPlayerDiamondClubCard);
            }


        }


        private bool HasDiamondClubCard(Card[] cards)
        {
            foreach (var card in cards)
            {
                if (card.Rank == Ranks.queen && card.Suit == Suits.clubs)
                    return true;
            }
            return false;
        }

    }
}