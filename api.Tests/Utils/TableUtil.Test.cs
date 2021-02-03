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
                new TablePlayer { PlayerId = 1, HasClubsQueenOnHand = true, RoundsPoints=40, GameVariant= GamesVariants.Normal },
                new TablePlayer { PlayerId = 2, HasClubsQueenOnHand = false, RoundsPoints=80 , GameVariant= GamesVariants.Normal},
                new TablePlayer { PlayerId = 3, HasClubsQueenOnHand = true, RoundsPoints=40 , GameVariant= GamesVariants.Normal},
                new TablePlayer { PlayerId = 4, HasClubsQueenOnHand = false, RoundsPoints=60 , GameVariant= GamesVariants.Normal}
                };
            var table = new PlayTable { GameVariant = GamesVariants.Normal };

            TableUtil.SetWinners(player, table);
            Assert.False(player[0].RoundWinner);
            Assert.True(player[1].RoundWinner);
            Assert.False(player[2].RoundWinner);
            Assert.True(player[3].RoundWinner);
        }

        [Fact]
        public void PlayerWinnerAtVariantWedding()
        {
            var player = new TablePlayer[]  {
                new TablePlayer { PlayerId = 1, HasClubsQueenOnHand = true, RoundsPoints=40,  GameVariant= GamesVariants.Wedding },
                new TablePlayer { PlayerId = 2, HasClubsQueenOnHand = false, RoundsPoints=80 , GameVariant= GamesVariants.Normal},
                new TablePlayer { PlayerId = 3, HasClubsQueenOnHand = true, RoundsPoints=40 , GameVariant= GamesVariants.Normal},
                new TablePlayer { PlayerId = 4, HasClubsQueenOnHand = false, RoundsPoints=60 , GameVariant= GamesVariants.Normal}
                };
            var table = new PlayTable { GameVariant = GamesVariants.Wedding, AdditionalWeddingPlayerId = 2 };

            TableUtil.SetWinners(player, table);
            Assert.True(player[0].RoundWinner);
            Assert.True(player[1].RoundWinner);
            Assert.False(player[2].RoundWinner);
            Assert.False(player[3].RoundWinner);
        }

        [Fact]
        public void PlayerWinnerAtVariantSolo()
        {
            var player = new TablePlayer[]  {
                new TablePlayer { PlayerId = 1, HasClubsQueenOnHand = true, RoundsPoints=110, GameVariant= GamesVariants.ColoRSoloClubs },
                new TablePlayer { PlayerId = 2, HasClubsQueenOnHand = false, RoundsPoints=30 , GameVariant= GamesVariants.Normal},
                new TablePlayer { PlayerId = 3, HasClubsQueenOnHand = true, RoundsPoints=40 , GameVariant= GamesVariants.Normal},
                new TablePlayer { PlayerId = 4, HasClubsQueenOnHand = false, RoundsPoints=60 , GameVariant= GamesVariants.Normal}
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
