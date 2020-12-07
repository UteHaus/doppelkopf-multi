using DoppelkopfApi.Entities;

namespace DoppelkopfApi.Models.PlayTable
{
    public class PlayerStateModel : PlayTableStaeModel
    {
        public Card[] Cards { get; set; }
        public int PlayerPosition { get; set; }

    }
}