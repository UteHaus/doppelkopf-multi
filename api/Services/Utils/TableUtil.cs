using System.Linq;
using DoppelkopfApi.Entities;

namespace DoppelkopfApi.Services.Utils
{
    public static class TableUtil
    {

        public static void SetWinners(TablePlayer[] players, PlayTable table)
        {
            var soloPlayer = players.FirstOrDefault((player) => player.GameVariant == table.GameVariant);

            if (table.GameVariant == GamesVariants.Normal || table.GameVariant == GamesVariants.Wedding || soloPlayer == null)
            {
                if (table.GameVariant == GamesVariants.Normal)
                {
                    SetWinnerPoints(players.Where((player) => player.HasClubsQueenOnHand).ToArray(),
                     players.Where((player) => !player.HasClubsQueenOnHand).ToArray());
                }
                else
                {
                    var weddingPlayer = GetWeddingPlayer(players);
                    var additionWedingPlayer = players.FirstOrDefault((player) => player.PlayerId == table.AdditionalWeddingPlayerId);
                    if (additionWedingPlayer != null)
                    {
                        SetWinnerPoints(
                            new TablePlayer[] { weddingPlayer, additionWedingPlayer },
                            players.Where((player) => player.PlayerId != weddingPlayer.PlayerId && player.PlayerId != additionWedingPlayer.PlayerId).ToArray()
                            );
                    }
                }
            }
            else
            {
                // for solo games
                var opponentsPlayers = players.Where((player) => player.PlayerId != soloPlayer.PlayerId);
                SetWinnerPoints(new TablePlayer[] { soloPlayer }, opponentsPlayers.ToArray());
            }

        }


        public static TablePlayer GetWeddingPlayer(TablePlayer[] players)
        {
            return players.FirstOrDefault((player) => player.GameVariant == GamesVariants.Wedding);
        }

        public static int GetNextPosition(int position)
        {
            return position + 1 > 4 ? 1 : position + 1;
        }


        private static void SetWinnerPoints(TablePlayer[] party1, TablePlayer[] party2)
        {
            //ToDo if has Players the same points
            var party1Points = party1.Sum((player) => player.RoundsPoints);
            var party2Points = party2.Sum((player) => player.RoundsPoints);
            foreach (var player in (party1Points > party2Points ? party1 : party2))
            {
                player.SetAsWinner();
            }
        }


    }
}