using DoppelkopfApi.Entities;

namespace DoppelkopfApi.Models.PlayTable
{
    public class AdditionPlayerInfoModel
    {

        public AdditionPlayerInfoModel() { }

        public AdditionPlayerInfoModel(TablePlayer player)
        {
            PlayerId = player.PlayerId;
            PlayerPosition = player.PlayerPosition;
            UserName = player.Username;
            ShuffleRound = player.ShuffleRound;
            NextTurn = player.NextTurn;
            PlayedCard = player.GetPlayedCard();
            GameVariant = player.GameVariant;
            RoundWinner = player.RoundWinner;
            RoundsPoints = player.RoundsPoints;
            PlayedRoundCards = player.GetPlayedRoundCards();
        }

        public int PlayerId { get; set; }

        public int PlayerPosition { get; set; }

        public string UserName { get; set; }
        public bool ShuffleRound { get; set; }

        public Card PlayedCard { get; set; }
        public Card[] PlayedRoundCards { get; set; }

        public bool NextTurn { get; set; }

        public bool RoundWinner { get; set; }

        public int RoundsPoints { get; set; }

        public GamesVariants GameVariant { get; set; }
    }
}