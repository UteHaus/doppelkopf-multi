
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
        }

        public Card Card { get; set; }
        public int PlayerId { get; set; }

    }


}