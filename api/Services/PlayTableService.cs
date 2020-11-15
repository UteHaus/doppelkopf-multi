using System.Security;
using System;
using System.Collections.Generic;
using DoppelkopfApi.Entities;
using DoppelkopfApi.Helpers;
using System.Linq;
using System.Text.Json;

namespace DoppelkopfApi.Services
{

    public interface IPlayTableService
    {
        PlayTable CreatTable(PlayTable table);
        bool Delete(int id, bool hard = false);

        bool SetOnTable(int userId, int tableId);
        bool SetOutTable(int userId);

        PlayStatus GetStatus(int tableId);

        int TableUserCount(int tableId);

        IEnumerable<PlayTable> GetAllTables();

        PlayTable GetTableById(int id);

        PlayTable GetUserTable(int userId);
        TablePlayer GettablePlayerOfId(int playerId);

        void NextTurn(int playerId);
        bool StartGame(int tableId);
        void SetUpdateTime(PlayTable table);

        void SetUpdateTime(int tableId);
        DateTime GetLastTableUpdate(int tableId);

        void SetPlayedCard(int playerId, Card card);

        TablePlayer[] GetPlayersOfTable(int tableId);
        void ShuffleCards(int playerId);
        void SetGameVariant(int playerId, GamesVariants variant);

    }


    public class PlayTableService : IPlayTableService
    {
        private DataContext _context;
        private IUserService _userService;
        private CardHandler _cardHandler;
        public PlayTableService(DataContext context, IUserService userService)
        {
            _context = context;
            _userService = userService;
            _cardHandler = new CardHandler();
        }

        public PlayTable CreatTable(PlayTable table)
        {
            table.GameVariant = GamesVariants.None;
            table.Status = PlayStatus.None;
            _context.PlayTables.Add(table);
            _context.SaveChanges();
            SetUpdateTime(table);
            return table;
        }

        public bool StartGame(int tableId)
        {

            PlayTable table = _context.PlayTables.Find(tableId);
            if (table != null &&
            (table.Status == PlayStatus.End || table.Status == PlayStatus.None || table.Status == PlayStatus.Stop))
            {
                var tablePlayers = GetPlayersOfTable(tableId);
                if (tablePlayers.Length < 4)
                {
                    throw new System.Exception("This Table hase not 4 players");
                }
                table.Status = PlayStatus.SelectGameVarian;
                SetHandCards(tablePlayers, table.WithNiner);
                table.RoundCount = 0;
                _context.TablePlayer.UpdateRange(tablePlayers);
                _context.PlayTables.Update(table);
                int changeCount = _context.SaveChanges();
                SetUpdateTime(table);
                return changeCount > 0;

            }
            return false;
        }

        public void SetGameVariant(int playerId, GamesVariants variant)
        {
            var tablePlayer = GettablePlayerOfId(playerId);
            if (tablePlayer != null)
            {
                var tablePlayers = GetPlayersOfTable(tablePlayer.TableId);
                tablePlayer.GameVariant = variant;
                _context.TablePlayer.Update(tablePlayer);
                _context.SaveChanges();
                SetUpdateTime(tablePlayer.TableId);
                var playerSetVariantCount = _context.TablePlayer.Count((player) => player.GameVariant != GamesVariants.None);

                if (playerSetVariantCount == 4)
                {
                    PlayTable table = GetTableById(tablePlayer.TableId);

                    table.Status = PlayStatus.Run;
                    table.GameVariant = _cardHandler.WhichVariantIsPlayed(tablePlayers);
                    if (table.GameVariant == GamesVariants.Normal)
                        table.SilentForPlayer = _cardHandler.SilentPlayer(tablePlayers);

                    _context.Update(table);
                    _context.SaveChanges();
                    StartGame(playerId);
                }

            }
            else
                throw new Exception("Player for " + playerId + " not found.");
        }


        public void NextTurn(int playerId)
        {

            var tablePlayer = GettablePlayerOfId(playerId);
            if (tablePlayer != null)
            {
                var tablePlayers = GetPlayersOfTable(tablePlayer.TableId);
                var table = _context.PlayTables.FirstOrDefault(pt => pt.Id == tablePlayer.TableId);
                var nextTurnCount = tablePlayers.Count(tp => tp.NextTurn);

                if (nextTurnCount == 3)
                {
                    var playedRoundCards = tablePlayers.Select((tp) => new PlayCard(tp)).ToArray();
                    table.SetLastCardSet(playedRoundCards.Select((prc) => prc.Card).ToArray());
                    int stitchWinnerId = _cardHandler.WhoeWinCardRound(playedRoundCards, table);
                    var stitchWinner = tablePlayers.FirstOrDefault((tp) => tp.PlayerId == stitchWinnerId);
                    SetAdditionalWeddingPlayer(tablePlayers, table, stitchWinnerId);

                    foreach (var player in tablePlayers)
                    {
                        if (player.PlayerId == stitchWinnerId)
                        {
                            player.RoundsPoints += _cardHandler.CardPoints(playedRoundCards);
                            table.CurrentPlayerPosition = player.PlayerPosition;
                        }
                        player.ClearForNextTurn();
                    }


                    // when the round is over
                    if (table.StitchCounter == 12 || (!table.WithNiner && table.StitchCounter == 10))
                    {
                        table.Status = PlayStatus.WinnersTime;
                        SetWinners(tablePlayers, table);
                    }
                    else
                        table.Status = PlayStatus.Run;

                    _context.PlayTables.Update(table);
                    _context.TablePlayer.UpdateRange(tablePlayers);
                }
                else
                {
                    tablePlayer.NextTurn = true;
                }
                _context.SaveChanges();
                SetUpdateTime(table);
            }
        }

        public PlayStatus GetStatus(int tableId)
        {
            var table = _context.PlayTables.Find(tableId);
            return table != null ? table.Status : PlayStatus.None;
        }

        public bool Delete(int tableId, bool hard = false)
        {
            var table = _context.PlayTables.Find(tableId);
            var tablePlayersCount = TableUserCount(table.Id);

            if (table != null && (hard || tablePlayersCount > 0))
            {
                _context.PlayTables.Remove(table);
                _context.SaveChanges();
                SetUpdateTime(table);
                return true;
            }
            return false;

        }

        public void SetPlayedCard(int playerId, Card card)
        {
            var player = GettablePlayerOfId(playerId);
            if (player == null)
                throw new Exception("Cant find player on table");
            var cards = player.GetHandCards().ToList();
            for (var i = 0; i < cards.Count; i++)
            {
                if (cards[i] == card)
                {
                    cards.RemoveAt(i);
                    break;
                }
            }
            player.PlayedCard = card.ToString();
            player.SetHandCards(cards.ToArray());

            bool alPlayerSetCards = this.GetPlayersOfTable(player.TableId).Count((p) => !String.IsNullOrWhiteSpace(p.PlayedCard)) == 4;
            var table = GetTableById(player.TableId);
            if (alPlayerSetCards)
            {
                table.Status = PlayStatus.WaitForNextRund;
                table.SetTableToNextGameTurn();
                _context.PlayTables.Update(table);


            }
            else
            {
                table.SetToNextPlayerTurn();
            }
            _context.TablePlayer.Update(player);
            _context.SaveChanges();

            SetUpdateTime(player.TableId);
        }

        public bool SetOnTable(int playerId, int tableId)
        {

            var tablePlayer = GettablePlayerOfId(playerId);
            if (tablePlayer != null)
            {
                if (tablePlayer.TableId == tableId)
                {
                    return true;
                }
                else
                {
                    SetOutTable(playerId);
                }
            }

            var table = _context.PlayTables.FirstOrDefault(tp => tp.Id == tableId);
            var user = _userService.GetById(playerId);

            if (table != null && user != null)
            {
                int tablePlayerCount = _context.TablePlayer.Count((tp) => tp.TableId == tableId);
                TablePlayer newTablePlayer = new TablePlayer();
                newTablePlayer.TableId = table.Id;
                newTablePlayer.PlayerPosition = tablePlayerCount + 1;
                newTablePlayer.PlayerId = user.Id;
                newTablePlayer.Username = user.Username;
                _context.TablePlayer.Add(newTablePlayer);

                int changeCount = 0;
                // 4 player on table (3 and the current) 
                if (tablePlayerCount == 3)
                {
                    table.SetTableToNextGameTurn();
                    changeCount = _context.SaveChanges();
                    SetUpdateTime(table);
                    StartGame(tableId);
                }
                else
                {
                    changeCount = _context.SaveChanges();
                }

                return changeCount > 0;
            }
            else
            {
                return false;
            }
        }

        public bool SetOutTable(int playerId)
        {
            var tablePlayer = GettablePlayerOfId(playerId);
            if (tablePlayer != null)
            {
                var tablePlayers = GetPlayersOfTable(tablePlayer.TableId).Where((p) => p.PlayerId != playerId).ToArray();
                for (int i = 0; i < tablePlayers.Count(); i++)
                {
                    tablePlayers[i].PlayerPosition = i + 1;
                    tablePlayers[i].ClearForNextRound();
                }
                var table = GetTableById(tablePlayer.TableId);
                table.Status = PlayStatus.Stop;
                _context.TablePlayer.Remove(tablePlayer);
                _context.Update(table);
                _context.TablePlayer.UpdateRange(tablePlayers);
                int changeCount = _context.SaveChanges();
                SetUpdateTime(tablePlayer.TableId);
                return changeCount > 0;
            }
            return false;
        }

        public void ShuffleCards(int playerId)
        {
            var player = GettablePlayerOfId(playerId);
            player.ShuffleRound = true;
            _context.TablePlayer.Update(player);
            _context.SaveChanges();
            int shuffelCount = _context.TablePlayer.Count(p => p.TableId == player.TableId && p.ShuffleRound);
            if (shuffelCount == 3)
            {
                var tablePlayers = GetPlayersOfTable(player.TableId);

                foreach (var tablePlayer in tablePlayers)
                {
                    tablePlayer.ClearForNextRound();
                }

                var table = _context.PlayTables.Find(player.TableId);
                table.Status = PlayStatus.Stop;
                _context.TablePlayer.UpdateRange(tablePlayers);
                _context.PlayTables.Update(table);
                _context.SaveChanges();
                StartGame(table.Id);
            }
            SetUpdateTime(player.TableId);

        }


        public int TableUserCount(int tableId)
        {
            return _context.TablePlayer.Count((player) => player.TableId == tableId);
        }

        public IEnumerable<PlayTable> GetAllTables()
        {
            return _context.PlayTables;
        }

        public PlayTable GetTableById(int id)
        {
            return _context.PlayTables.Find(id);
        }

        public void SetUpdateTime(PlayTable table)
        {
            if (table != null)
            {
                table.LastUpdate = DateTime.Now;
                _context.PlayTables.Update(table);
                _context.SaveChanges();
            }
        }

        public void SetUpdateTime(int tableId)
        {
            SetUpdateTime(_context.PlayTables.Find(tableId));
        }
        public DateTime GetLastTableUpdate(int tableId)
        {
            var table = _context.PlayTables.FirstOrDefault((table) => table.Id == tableId);
            if (table == null)
            {
                throw new Exception("Cant find table of " + tableId);
            }
            return table.LastUpdate;

        }

        public TablePlayer GettablePlayerOfId(int playerId)
        {
            return _context.TablePlayer.FirstOrDefault((tp) => tp.PlayerId == playerId);
        }

        public PlayTable GetUserTable(int userId)
        {
            var tablePlayer = _context.TablePlayer.FirstOrDefault(pt => pt.PlayerId == userId);
            return tablePlayer != null ? _context.PlayTables.FirstOrDefault(tp => tp.Id == tablePlayer.TableId) : null;
        }

        public TablePlayer[] GetPlayersOfTable(int tableId)
        {
            return _context.TablePlayer.Where(tp => tp.TableId == tableId).ToArray();
        }

        private void SetHandCards(TablePlayer[] tablePlayers, bool withNiner)
        {
            var playerCards = _cardHandler.DistributeCards(withNiner);
            for (int i = 0; i < tablePlayers.Length; i++)
            {
                tablePlayers[i].HandCards = JsonSerializer.Serialize(playerCards[i]);
                tablePlayers[i].RoundsPoints = 0;
                tablePlayers[i].HasDiamondClubsOnHand = playerCards[i].Count((card) => card.IsDiamondClub()) > 0;
            }
        }

        private void SetWinnerPoints(TablePlayer[] party1, TablePlayer[] party2)
        {
            //ToDo if has Players the same points
            var party1Points = party1.Sum((player) => player.PlayerPosition);
            var party2Points = party2.Sum((player) => player.PlayerPosition);
            foreach (var player in (party1Points > party2Points ? party1 : party2))
            {
                player.SetAsWinner();
            }
        }
        private void SetWinners(TablePlayer[] players, PlayTable table)
        {
            if (table.GameVariant == GamesVariants.Normal || table.GameVariant == GamesVariants.Wedding)
            {
                if (table.GameVariant == GamesVariants.Normal)
                {
                    SetWinnerPoints(players.Where((player) => player.HasDiamondClubsOnHand).ToArray(),
                     players.Where((player) => !player.HasDiamondClubsOnHand).ToArray());
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
                var soloPlayer = players.FirstOrDefault((player) => player.GameVariant == GamesVariants.Normal && player.GameVariant == GamesVariants.Wedding);
                var opponentsPlayers = players.Where((player) => player.PlayerId != soloPlayer.PlayerId);
                SetWinnerPoints(new TablePlayer[] { soloPlayer }, opponentsPlayers.ToArray());
            }

        }

        private TablePlayer GetWeddingPlayer(TablePlayer[] players)
        {
            return players.FirstOrDefault((player) => player.GameVariant == GamesVariants.Wedding);
        }
        private bool SetAdditionalWeddingPlayer(TablePlayer[] players, PlayTable table, int stitchWinnerId)
        {
            var weddingPlayer = GetWeddingPlayer(players);

            if (table.GameVariant == GamesVariants.Wedding &&
            weddingPlayer.PlayerId != stitchWinnerId &&
            table.AdditionalWeddingPlayerId < 0 &&
            table.GameVariant == GamesVariants.Wedding)
            {
                int additionalWeddingPlayerId = -1;
                if (table.WeddingWithFirstColorCast && table.StitchCounter < 2)
                {
                    var leftOfGiverPlayer = players.FirstOrDefault((player) => table.GetLeftOfGiversPosition() == player.PlayerPosition);
                    if (leftOfGiverPlayer != null && _cardHandler.IsColorPlayed(leftOfGiverPlayer.GetPlayedCard()))
                    {
                        additionalWeddingPlayerId = stitchWinnerId;
                        return true;
                    }

                }
                else if (!table.WeddingWithFirstColorCast || table.StitchCounter > 2)
                {
                    additionalWeddingPlayerId = stitchWinnerId;
                    return true;
                }

            }
            return false;
        }

    }
}