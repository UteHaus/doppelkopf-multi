using System.ComponentModel.DataAnnotations;
using System;
using System.Text.Json;

namespace DoppelkopfApi.Entities
{
    public class PlayTable
    {

        public PlayTable() { }

        [Key]
        public int Id { get; set; }
        public string Name { get; set; }

        public PlayStatus Status { get; set; }

        public int CurrentPlayerPosition { get; set; }

        public int RoundCardsGiversPosition { get; set; }

        public int RoundCount { get; set; }
        public int StitchCounter { get; set; }

        public DateTime RunStarted { get; set; }

        public int SilentForPlayer { get; set; }

        public GamesVariants GameVariant { get; set; }

        public bool WithNiner { get; set; }

        public string LastCardSet { get; set; }

        public DateTime LastUpdate { get; set; }

        public bool DiamondsAceAsMaster { get; set; }
        public bool WeddingWithFirstColorCast { get; set; }

        public string TableIcon { get; set; }

        public int AdditionalWeddingPlayerId { get; set; }



        public int GetLeftOfGiversPosition()
        {
            return RoundCardsGiversPosition + 1 > 4 ? 1 : RoundCardsGiversPosition + 1;
        }

        public void SetLastCardSet(Card[] cards)
        {
            LastCardSet = JsonSerializer.Serialize(cards);
        }

        public Card[] GetLastCardSet() => string.IsNullOrWhiteSpace(LastCardSet) ? new Card[0] : JsonSerializer.Deserialize<Card[]>(LastCardSet);

        public void SetTableToNextGameTurn()
        {
            RoundCardsGiversPosition = GetLeftOfGiversPosition();
            CurrentPlayerPosition = RoundCardsGiversPosition + 1 > 4 ? 1 : RoundCardsGiversPosition + 1;
            StitchCounter = 0;
            LastCardSet = "";
            RoundCount++;
            GameVariant = GamesVariants.None;
            AdditionalWeddingPlayerId = -1;
        }

        public void SetToNextPlayerTurn()
        {
            CurrentPlayerPosition++;
            if (CurrentPlayerPosition > 4)
                CurrentPlayerPosition = 1;
        }

    }

    public enum PlayStatus
    {
        None = 0,
        Run = 1,
        Stop = 2,
        Pause = 3,
        End = 4,
        SelectGameVarian = 5,
        WaitForNextRund = 6,
        WinnersTime = 7,
        RadyToStart = 8


    }

    public enum GamesVariants
    {
        None = 0,
        Normal = 1,
        Wedding = 2,
        Solo = 10,
        QueenSolo = 11,
        JackSolo = 12,
        AceSolo = 13,
        SuitSolo = 14,
        KingSolo = 15,

        ColoRSoloClubs = 20,
        ColorSoloDiamonds = 21,
        ColoRSoloHearts = 22,
        ColoRSoloSpades = 23,

    }
}