using DoppelkopfApi.Entities;

namespace DoppelkopfApi.Models.PlayTable
{
    public class PlayTableStaeModel : PlayTableModel
    {
        public int UserCount { get; set; }

        public int ShuffleCount { get; set; }
        public AdditionPlayerInfoModel[] Players { get; set; }

        public int NextTurnCount { get; set; }

        public int TableId { get; set; }

    }
}