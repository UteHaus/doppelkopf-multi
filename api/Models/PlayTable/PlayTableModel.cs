using System;
using DoppelkopfApi.Entities;

namespace DoppelkopfApi.Models.PlayTable
{
    public class PlayTableModel
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public PlayStatus Status { get; set; }
        public int CurrentPlayerPosition { get; set; }

        public int RoundCardsGiversPosition { get; set; }

        public int RundCount { get; set; }

        public DateTime RunStarted { get; set; }

        public GamesVariants GameVariant { get; set; }

        public bool ShuffleRound { get; set; }

        public int PlayerPosition { get; set; }

        public int PlayerId { get; set; }

        public bool DiamondsAceAsMaster { get; set; }
        public bool WeddingWithFirstColorCast { get; set; }

        public string TableIcon { get; set; }

        public int AdditionalWeddingPlayerId { get; set; }
    }
}