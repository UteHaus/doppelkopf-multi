using System.Runtime.Serialization;
using System.Text.Json;

namespace DoppelkopfApi.Entities
{

    public class Card
    {

        public Card() { }

        public Card(Suits suits, Ranks rank)
        {
            Suit = suits;
            Rank = rank;
        }


        public Suits Suit { get; set; }

        public Ranks Rank { get; set; }

        public bool IsClubQueen()
        {
            return Suit == Suits.clubs && Rank == Ranks.queen;
        }

        public override bool Equals(object obj)
        {
            return this == obj as Card;
        }

        public override int GetHashCode()
        {
            return base.GetHashCode();
        }

        public override string ToString()
        {
            return JsonSerializer.Serialize(this);
        }

        public static bool operator ==(Card card1, Card card2)
        {
            return card1?.Suit == card2?.Suit && card1?.Rank == card2?.Rank;
        }
        public static bool operator !=(Card card1, Card card2)
        {
            return !(card1 == card2);
        }

        public static bool operator ==(Card card, Suits suit)
        {
            return card != null && card.Suit == suit;
        }

        public static bool operator !=(Card card, Suits suit)
        {
            return !(card == suit);
        }

        public static bool operator ==(Card card, Ranks rank)
        {
            return card != null && card.Rank == rank;
        }

        public static bool operator !=(Card card, Ranks rank)
        {
            return !(card == rank);
        }

        public static Card CardOfJson(string cardJson)
        {
            if (string.IsNullOrWhiteSpace(cardJson))
                return null;
            var card = JsonSerializer.Deserialize<Card>(cardJson);
            return new Card(card.Suit, card.Rank);

        }
    }

    public enum Suits
    {
        //"♣" (DE eichel)
        clubs,
        // "♦" (DE schellen) 
        diamonds,
        // "♥" (De herz)
        hearts,
        // "♠" (DE grün)
        spades,

    };

    public enum Ranks
    {
        // "10"
        ten,
        // "K"
        king,
        // "Q"
        queen,
        // "J"
        jack,
        // "A"
        ace,
        nine
    };



}