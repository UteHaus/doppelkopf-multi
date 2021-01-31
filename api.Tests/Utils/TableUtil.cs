using System;
using Xunit;
using DoppelkopfApi.Entities;
using DoppelkopfApi.Services.Utils;

namespace api.Utils
{
    public class TableUtilTest
    {
        [Fact]
        public void PlayerWinnerAtVariantNormal()
        {
            var player = new TablePlayer[]  {
                new TablePlayer { PlayerId = 1, HasDiamondClubsOnHand = true, RoundsPoints=40, GameVariant= GamesVariants.Normal },
                new TablePlayer { PlayerId = 2, HasDiamondClubsOnHand = false, RoundsPoints=80 , GameVariant= GamesVariants.Normal},
                new TablePlayer { PlayerId = 3, HasDiamondClubsOnHand = true, RoundsPoints=40 , GameVariant= GamesVariants.Normal},
                new TablePlayer { PlayerId = 4, HasDiamondClubsOnHand = false, RoundsPoints=60 , GameVariant= GamesVariants.Normal}
                };
            var table = new PlayTable { GameVariant = GamesVariants.Normal };

            TableUtil.SetWinners(player, table);
            Assert.False(player[0].RoundWinner);
            Assert.True(player[1].RoundWinner);
            Assert.False(player[2].RoundWinner);
            Assert.True(player[3].RoundWinner);
        }


        [Fact]
        public void PlayerWinnerAtVariantSolo()
        {
            var player = new TablePlayer[]  {
                new TablePlayer { PlayerId = 1, HasDiamondClubsOnHand = true, RoundsPoints=110, GameVariant= GamesVariants.ColoRSoloClubs },
                new TablePlayer { PlayerId = 2, HasDiamondClubsOnHand = false, RoundsPoints=30 , GameVariant= GamesVariants.Normal},
                new TablePlayer { PlayerId = 3, HasDiamondClubsOnHand = true, RoundsPoints=40 , GameVariant= GamesVariants.Normal},
                new TablePlayer { PlayerId = 4, HasDiamondClubsOnHand = false, RoundsPoints=60 , GameVariant= GamesVariants.Normal}
                };
            var table = new PlayTable { GameVariant = GamesVariants.ColoRSoloClubs };

            TableUtil.SetWinners(player, table);
            Assert.False(player[0].RoundWinner);
            Assert.True(player[1].RoundWinner);
            Assert.True(player[2].RoundWinner);
            Assert.True(player[3].RoundWinner);
        }


    }
}
