using DoppelkopfApi.Entities;

namespace DoppelkopfApi.Models.PlayTable
{
    public class PlayTableGameModel : PlayTableModel
    {
        public int UserCount { get; set; }

        public int ShuffleCount { get; set; }
        public Card[] Cards { get; set; }

        public AdditionPlayerInfoModel[] Players { get; set; }

        public int NextTurnCount { get; set; }
    }
}