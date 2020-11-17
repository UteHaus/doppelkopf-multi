
namespace DoppelkopfApi.Entities
{
    public class PlayCard
    {

        public PlayCard()
        {

        }
        public PlayCard(Card card, int playerId)
        {
            Card = card;
            PlayerId = playerId;
        }

        public PlayCard(TablePlayer tablePlayer)
        {
            Card = tablePlayer.GetPlayedCard();
            PlayerId = tablePlayer.PlayerId;
            Position = tablePlayer.PlayerPosition;
        }

        public Card Card { get; }
        public int PlayerId { get; }
        public int Position { get; }

    }


}