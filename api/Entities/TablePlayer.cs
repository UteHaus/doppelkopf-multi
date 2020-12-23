using System.Linq;
using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;

namespace DoppelkopfApi.Entities
{
    public class TablePlayer
    {
        public TablePlayer() { }

        [Key]
        public int Id { get; set; }
        public int TableId { get; set; }
        public int PlayerId { get; set; }

        public string Username { get; set; }

        /// <summary>
        /// Seat position of the player on the table, started with 1 to 4,
        /// </summary>
        /// <value></value>
        public int PlayerPosition { get; set; }

        public string HandCards { get; set; }

        public int RoundsPoints { get; set; }

        public GamesVariants GameVariant { get; set; }

        public string PlayedCard { get; set; }

        public string PlayedRoundCards { get; set; }

        public bool ShuffleRound { get; set; }

        public bool NextTurn { get; set; }
        public bool HasDiamondClubsOnHand { get; set; }

        public int WinnedRounds { get; set; }

        public bool RoundWinner { get; set; }
        public bool AnnouncementVersusParty { get; set; }
        public bool AnnouncementReParty { get; set; }
        public int CancellationOfparty { get; set; }

        public string Message { get; set; }

        /// <summary>
        /// User id of the user with will show the cards of the player.
        /// </summary>
        /// <value></value>
        public int UserIdRequestCanShowCarts { get; set; }

        /// <summary>
        /// Re Kontra announcement 
        /// </summary>
        /// <value></value>
        public string DutyAnnouncement { get; set; }

        public bool SecondDullStitches { get; set; }
        public Card[] GetHandCards() => String.IsNullOrWhiteSpace(HandCards) ? new Card[0] : JsonSerializer.Deserialize<Card[]>(HandCards);

        public void SetHandCards(Card[] cards)
        {
            HandCards = JsonSerializer.Serialize(cards);
        }

        public bool AnyCards()
        {
            return string.IsNullOrWhiteSpace(HandCards) || GetHandCards().Length == 0;
        }

        public bool PlayerCardSet()
        {
            return !string.IsNullOrWhiteSpace(PlayedCard);
        }

        public void SetAsWinner()
        {
            RoundWinner = true;
            WinnedRounds++;
        }

        /// <summary>
        /// Rest all need properties for next tourn.
        /// </summary>
        public void ClearForNextTurn()
        {
            PlayedCard = "";
            NextTurn = false;
        }

        /// <summary>
        /// Rest  all need properties for next round.
        /// /// </summary>
        public void ClearForNextRound()
        {
            ClearForNextTurn();
            HandCards = "";
            RoundsPoints = 0;
            GameVariant = GamesVariants.None;
            ShuffleRound = false;
            AnnouncementReParty = false;
            AnnouncementVersusParty = false;
            CancellationOfparty = 0;
            NextTurn = false;
        }


        public Card GetPlayedCard() => Card.CardOfJson(PlayedCard);

        public Card[] GetPlayedRoundCards() => string.IsNullOrEmpty(PlayedRoundCards) ? new Card[0] : JsonSerializer.Deserialize<Card[]>(PlayedRoundCards);

        /// <summary>
        /// Remove this card from the HandCards and set it as PlayedCard. 
        /// In addition set this Card to the played Cards.
        /// </summary>
        /// <param name="card"></param>
        public void SetPlayedCard(Card card)
        {
            PlayedCard = card.ToString();
            var cards = GetHandCards().ToList();
            for (var i = 0; i < cards.Count; i++)
            {
                if (cards[i] == card)
                {
                    cards.RemoveAt(i);
                    break;
                }
            }
            PlayedCard = card.ToString();
            SetHandCards(cards.ToArray());
            var playedRoundCards = (String.IsNullOrWhiteSpace(PlayedRoundCards) ? new Card[0] : JsonSerializer.Deserialize<Card[]>(PlayedRoundCards)).ToList();
            playedRoundCards.Add(card);
            PlayedRoundCards = JsonSerializer.Serialize(playedRoundCards);
        }
    }
}