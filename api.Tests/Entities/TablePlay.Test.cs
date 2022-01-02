using Xunit;
using DoppelkopfApi.Entities;

namespace api.Tests.Entities
{
    public class TablePlayTest
    {
        [Fact]
        public void SetAdditionWeddingPlayerWithFirstColorCast()
        {
            var weddingPlayer = new TablePlayer { GameVariant = GamesVariants.Wedding, PlayerId = 1, PlayedCard = new Card(Suits.clubs, Ranks.ace).ToString(), PlayerPosition = 1 };
            var additionPlayer = new TablePlayer { GameVariant = GamesVariants.Normal, PlayerId = 2, PlayedCard = new Card(Suits.clubs, Ranks.ace).ToString(), PlayerPosition = 2 };
            var table = new PlayTable { GameVariant = GamesVariants.Wedding, WeddingWithFirstColorCast = true, StitchCounter = 1, AdditionalWeddingPlayerId = -1, RoundCardsGiversPosition = 1 };

            table.SetAdditionalWeddingPlayer(new[] { weddingPlayer, additionPlayer }, weddingPlayer.PlayerId);
            table.SetAdditionalWeddingPlayer(new[] { weddingPlayer, additionPlayer }, additionPlayer.PlayerId);

            Assert.Equal(additionPlayer.PlayerId, table.AdditionalWeddingPlayerId);
            Assert.Equal(GamesVariants.Wedding, table.GameVariant);
        }

        [Fact]
        public void SetAdditionWeddingPlayerWithFirstColorCastAfter2Stiches()
        {
            var weddingPlayer = new TablePlayer { GameVariant = GamesVariants.Wedding, PlayerId = 1, PlayedCard = new Card(Suits.clubs, Ranks.ace).ToString(), PlayerPosition = 1 };
            var additionPlayer = new TablePlayer { GameVariant = GamesVariants.Normal, PlayerId = 2, PlayedCard = new Card(Suits.clubs, Ranks.ace).ToString(), PlayerPosition = 2 };
            var table = new PlayTable { GameVariant = GamesVariants.Wedding, WeddingWithFirstColorCast = true, StitchCounter = 2, AdditionalWeddingPlayerId = -1, RoundCardsGiversPosition = 1 };

            table.SetAdditionalWeddingPlayer(new[] { weddingPlayer, additionPlayer }, weddingPlayer.PlayerId);
            table.SetAdditionalWeddingPlayer(new[] { weddingPlayer, additionPlayer }, additionPlayer.PlayerId);

            Assert.Equal(-1, table.AdditionalWeddingPlayerId);
            Assert.Equal(GamesVariants.Solo, table.GameVariant);
        }


        [Fact]
        public void SetAdditionWeddingPlayerWithOutFirstColorCast()
        {
            var weddingPlayer = new TablePlayer { GameVariant = GamesVariants.Wedding, PlayerId = 1, PlayedCard = new Card(Suits.clubs, Ranks.jack).ToString(), PlayerPosition = 1 };
            var additionPlayer = new TablePlayer { GameVariant = GamesVariants.Normal, PlayerId = 2, PlayedCard = new Card(Suits.clubs, Ranks.jack).ToString(), PlayerPosition = 2 };
            var table = new PlayTable { GameVariant = GamesVariants.Wedding, WeddingWithFirstColorCast = false, StitchCounter = 2, AdditionalWeddingPlayerId = -1, RoundCardsGiversPosition = 1 };

            table.SetAdditionalWeddingPlayer(new[] { weddingPlayer, additionPlayer }, additionPlayer.PlayerId);

            Assert.Equal(additionPlayer.PlayerId, table.AdditionalWeddingPlayerId);
            Assert.Equal(GamesVariants.Wedding, table.GameVariant);
        }
    }
}