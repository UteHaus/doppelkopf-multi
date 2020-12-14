using System.Threading.Tasks;
using System;
using System.Collections.Generic;
using DoppelkopfApi.Entities;
using DoppelkopfApi.Hubs;
using DoppelkopfApi.Helpers;
using System.Linq;
using System.Text.Json;

namespace DoppelkopfApi.Services
{
    public class PlayTableService : IPlayTableService
    {
        private DataContext _context;
        private IUserService _userService;
        private CardHandler _cardHandler;
        ITableEventService _tableEventService;

        public PlayTableService(DataContext context, IUserService userService, ITableEventService tableEventService)
        {
            _context = context;
            _tableEventService = tableEventService;
            _userService = userService;
            _cardHandler = new CardHandler();
        }


        public PlayTable CreateTable(PlayTable table)
        {
            table.GameVariant = GamesVariants.None;
            table.Status = PlayStatus.None;
            _context.PlayTables.Add(table);
            _context.SaveChanges();
            OnTableListChanged();
            return table;
        }

        public bool StartNewRound(int tableId)
        {

            PlayTable table = _context.PlayTables.Find(tableId);
            if (table != null &&
            (table.Status == PlayStatus.End || table.Status == PlayStatus.None || table.Status == PlayStatus.Stop || table.Status == PlayStatus.WinnersTime))
            {
                table.SetTableToNextGameTurn();
                var tablePlayers = GetPlayersOfTable(tableId);
                if (tablePlayers.Length < 4)
                {
                    throw new System.Exception("This Table hase not 4 players");
                }
                table.Status = PlayStatus.SelectGameVarian;
                foreach (var player in tablePlayers)
                {
                    player.ClearForNextRound();
                }
                SetHandCards(tablePlayers, table.WithNiner);
                _context.TablePlayer.UpdateRange(tablePlayers);
                _context.PlayTables.Update(table);
                int changeCount = _context.SaveChanges();

                OnTableChanged(table.Id);
                foreach (var player in tablePlayers)
                {
                    OnTableChanged(player.PlayerId);
                }
                return changeCount > 0;

            }
            return false;
        }

        public bool SetGameVariant(int playerId, GamesVariants variant)
        {
            if (variant == GamesVariants.None)
                return false;

            var tablePlayer = GettablePlayerOfId(playerId);
            if (tablePlayer != null)
            {
                // change the variant of the player
                tablePlayer.GameVariant = variant;
                tablePlayer.NextTurn = true;
                _context.TablePlayer.Update(tablePlayer);
                _context.SaveChanges();

                // check if all players has set game variant and set the table variant with status 
                var tablePlayers = GetPlayersOfTable(tablePlayer.TableId);
                var playerSetVariantCount = tablePlayers.Count((player) => player.GameVariant != GamesVariants.None);

                if (playerSetVariantCount == 4)
                {
                    PlayTable table = GetTableById(tablePlayer.TableId);

                    table.GameVariant = _cardHandler.WhichVariantIsPlayed(tablePlayers);
                    if (table.GameVariant == GamesVariants.Normal)
                        table.SilentForPlayer = _cardHandler.SilentPlayer(tablePlayers);

                    table.Status = PlayStatus.Run;
                    _context.Update(table);
                    _context.SaveChanges();
                }
                OnTableChanged(tablePlayer.TableId);
                return true;
            }
            else
                throw new Exception("Player for " + playerId + " not found.");

        }


        public void NextTurn(int playerId)
        {

            var tablePlayer = GettablePlayerOfId(playerId);
            if (tablePlayer != null)
            {
                bool newGame = false;
                tablePlayer.NextTurn = true;
                _context.TablePlayer.Update(tablePlayer);
                _context.SaveChanges();
                var tablePlayers = GetPlayersOfTable(tablePlayer.TableId);
                var table = _context.PlayTables.FirstOrDefault(pt => pt.Id == tablePlayer.TableId);
                var nextTurnCount = tablePlayers.Count(tp => tp.NextTurn);

                if (nextTurnCount == 4)
                {
                    if (table.Status != PlayStatus.WinnersTime)
                    {
                        var playedRoundCards = tablePlayers.Select((tp) => new PlayCard(tp)).ToArray();
                        table.SetLastCardSet(playedRoundCards.Select((prc) => prc.Card).ToArray());
                        int stitchWinnerId = _cardHandler.WhoeWinCardRound(playedRoundCards, table, tablePlayers);
                        // var stitchWinner = tablePlayers.FirstOrDefault((tp) => tp.PlayerId == stitchWinnerId);
                        SetAdditionalWeddingPlayer(tablePlayers, table, stitchWinnerId);

                        foreach (var player in tablePlayers)
                        {
                            if (player.PlayerId == stitchWinnerId)
                            {
                                player.RoundsPoints += _cardHandler.CardPoints(playedRoundCards);
                                table.CurrentPlayerPosition = player.PlayerPosition;
                            }
                        }

                        table.StitchCounter++;
                        // when the round is over
                        if (table.StitchCounter == 12 || (!table.WithNiner && table.StitchCounter == 10))
                        {
                            SetWinners(tablePlayers, table);
                            table.Status = PlayStatus.WinnersTime;
                        }
                        else
                        {
                            table.Status = PlayStatus.Run;
                        }
                        _context.PlayTables.Update(table);

                    }
                    else
                    {
                        newGame = true;
                    }

                    // reset the next turn state for all player of the table
                    foreach (var player in tablePlayers)
                    {
                        player.ClearForNextTurn();
                    }
                    _context.TablePlayer.UpdateRange(tablePlayers);
                    _context.SaveChanges();

                }
                if (newGame)
                {
                    StartNewRound(table.Id);
                }
                else
                    OnTableChanged(table.Id);

            }
        }

        public PlayStatus GetStatus(int tableId)
        {
            var table = _context.PlayTables.Find(tableId);
            return table != null ? table.Status : PlayStatus.None;
        }

        public bool Delete(int tableId, bool hard = true)
        {
            var table = _context.PlayTables.Find(tableId);
            var tablePlayersCount = TableUserCount(table.Id);

            if (table != null && (hard || tablePlayersCount <= 0))
            {
                OnTableChanged(table.Id);
                _context.Entry(table).State = Microsoft.EntityFrameworkCore.EntityState.Deleted;
                //  _context.PlayTables.Remove(table);
                _context.SaveChanges();

                return true;
            }
            return false;

        }

        public void SetPlayedCard(int playerId, Card card)
        {
            var player = GettablePlayerOfId(playerId);
            if (player == null)
                throw new Exception("Cant find player on table");
            if (string.IsNullOrEmpty(player.PlayedCard))
            {
                player.SetPlayedCard(card);
                player.NextTurn = false;
                _context.TablePlayer.Update(player);
                _context.SaveChanges();

                bool allPlayerSetCards = this.GetPlayersOfTable(player.TableId).Count((p) => !String.IsNullOrWhiteSpace(p.PlayedCard)) == 4;
                var table = GetTableById(player.TableId);
                if (allPlayerSetCards)
                {
                    table.Status = PlayStatus.WaitForNextRund;
                    _context.PlayTables.Update(table);
                }
                else
                {
                    table.SetToNextPlayerTurn();
                }
                _context.SaveChanges();
                OnPlayerCardsChanged(playerId, table.Id);
                OnTableChanged(player.TableId);
            }
        }

        public bool SetOnTable(int playerId, int tableId)
        {
            CancelWatchTable(playerId);
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

            var tablePlayers = _context.TablePlayer.Where((tp) => tp.TableId == tableId).ToArray();
            // table has with this player mor then 5 player on the table
            if (tablePlayers.Length + 1 > 4)
            {
                return false;
            }
            var table = _context.PlayTables.FirstOrDefault(tp => tp.Id == tableId);
            var user = _userService.GetById(playerId);


            if (table != null && user != null)
            {
                int tablePlayerCount = _context.TablePlayer.Count((tp) => tp.TableId == tableId);
                TablePlayer newTablePlayer = new TablePlayer();
                newTablePlayer.TableId = table.Id;
                newTablePlayer.PlayerPosition = GetFreePostionOnTable(tablePlayers);
                newTablePlayer.PlayerId = user.Id;
                newTablePlayer.Username = user.Username;
                _context.TablePlayer.Add(newTablePlayer);

                int changeCount = 0;
                // 4 player on table (3 and the current) 
                if (tablePlayers.Length == 3)
                {
                    table.RoundCount = 0;
                    table.Status = PlayStatus.None;
                    changeCount = _context.SaveChanges();
                    _context.PlayTables.Update(table);
                    _context.SaveChanges();
                    StartNewRound(tableId);
                }
                else
                {
                    changeCount = _context.SaveChanges();
                    OnTableChanged(table.Id);
                }
                OnTableListChanged();
                return changeCount > 0;
            }
            else
            {
                return false;
            }
        }


        public bool ReplaceTablePlayer(int currentPlayerId, int newPlayerId)
        {
            var currentPlayer = _context.TablePlayer.FirstOrDefault((player) => player.PlayerId == currentPlayerId);
            if (currentPlayer != null)
            {
                currentPlayer.PlayerId = newPlayerId;
                OnTableChanged(currentPlayer.TableId);
                return true;
            }
            return false;
        }

        public bool SetOutTable(int playerId)
        {
            var tablePlayer = GettablePlayerOfId(playerId);
            if (tablePlayer != null)
            {
                var tablePlayers = GetPlayersOfTable(tablePlayer.TableId).Where((p) => p.PlayerId != playerId).ToArray();
                foreach (var player in tablePlayers)
                {
                    player.ClearForNextTurn();
                }
                var table = GetTableById(tablePlayer.TableId);
                table.Status = PlayStatus.Stop;
                _context.TablePlayer.Remove(tablePlayer);
                _context.Update(table);
                _context.TablePlayer.UpdateRange(tablePlayers);
                int changeCount = _context.SaveChanges();
                OnTableChanged(tablePlayer.TableId);
                OnTableListChanged();
                return changeCount > 0;
            }
            return false;
        }

        public void ShuffleCards(int playerId)
        {
            var player = GettablePlayerOfId(playerId);
            if (player == null)
                return;

            player.ShuffleRound = true;
            _context.TablePlayer.Update(player);
            _context.SaveChanges();
            int shuffelCount = _context.TablePlayer.Count(p => p.TableId == player.TableId && p.ShuffleRound);
            if (shuffelCount == 4)
            {

                var table = _context.PlayTables.Find(player.TableId);
                table.Status = PlayStatus.Stop;
                _context.PlayTables.Update(table);
                _context.SaveChanges();
                StartNewRound(table.Id);
            }
            else
            { OnTableChanged(player.TableId); }

        }

        public bool ShowCardsOf(int userId, int playerId)
        {
            var viewer = _context.TableViewers.FirstOrDefault((viewer) => viewer.userId == userId);
            if (viewer != null)
            {
                viewer.SeePlayerCard = playerId;
                _context.TableViewers.Update(viewer);
                OnSpectatorStateChanged(userId);
                return _context.SaveChanges() > 0;
            }
            return false;
        }


        public int TableUserCount(int tableId)
        {
            return _context.TablePlayer.Count((player) => player.TableId == tableId);
        }

        public IEnumerable<PlayTable> GetAllTables()
        {
            return _context.PlayTables;
        }

        public PlayTable GetTableById(int tableId)
        {
            return _context.PlayTables.Find(tableId);
        }

        public ValueTask<PlayTable> GetTableByIdAsync(int id)
        {
            return _context.PlayTables.FindAsync(id);
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


        public bool CancelWatchTable(int userId, bool saveContext = true)
        {
            var users = _context.TableViewers.Where((user) => user.userId == userId);
            if (users.Count() > 0)
            {
                _context.TableViewers.RemoveRange(users);
                return saveContext ? _context.SaveChanges() > 0 : true;

            }
            return true;
        }
        public bool WatchTable(int userId, int tableId)
        {
            CancelWatchTable(userId, false);
            SetOutTable(userId);
            TableViewer newTableViewer = new TableViewer(userId, tableId);
            _context.TableViewers.Add(newTableViewer);
            return _context.SaveChanges() > 0;
        }

        public void CloseAllSessions(int userId)
        {
            CancelWatchTable(userId);
            //SetOutTable(userId);

        }

        public TableViewer GetTableViewerByUserId(int userId)
        {
            return _context.TableViewers.FirstOrDefault((viewer) => viewer.userId == userId);
        }

        public TableViewer[] GetTableViewer(int tableId)
        {
            return _context.TableViewers.Where((viewer) => viewer.tableId == tableId).ToArray();
        }

        public bool SetAsAdditionPlayer(int userId, bool seeOn)
        {

            var viewUser = _context.TableViewers.FirstOrDefault((user) => user.userId == userId);
            if (viewUser != null)
            {
                // is a user a additional player
                if (seeOn)
                {
                    var additionPlayerCount = _context.TableViewers.Count((viewer) => viewer.AsAdditionPlayer && viewer.tableId == viewer.tableId);
                    if (additionPlayerCount > 0)
                        return false;
                }
                viewUser.AsAdditionPlayer = seeOn;
                _context.TableViewers.Update(viewUser);
                return _context.SaveChanges() > 0;

            }
            return false;
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
                    if (leftOfGiverPlayer != null && _cardHandler.IsColorPlayed(table, leftOfGiverPlayer.GetPlayedCard()))
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

        /// <summary>
        /// find the nex free position of the table
        /// </summary>
        /// <param name="tablePlayers">Players of one table</param>
        /// <returns></returns>
        private int GetFreePostionOnTable(TablePlayer[] tablePlayers)
        {
            if (tablePlayers.Length == 0)
                return 1;

            else if (tablePlayers.Length == 4)
                return -1;

            bool[] seatOccupy = { false, false, false, false };
            foreach (var player in tablePlayers)
            {
                seatOccupy[player.PlayerPosition - 1] = true;
            }
            for (var i = 0; i < seatOccupy.Length; i++)
            {
                if (!seatOccupy[i])
                    return i + 1;
            }
            return -1;
        }

        protected void OnTableListChanged()
        {
            _tableEventService.TableListChanged(this);
        }

        protected virtual void OnTableChanged(int tableId)
        {
            _tableEventService.TableChanged(tableId, this);
        }

        protected virtual void OnPlayerCardsChanged(int userId, int tableId)
        {
            _tableEventService.OnPlayerCardsChanged(userId, tableId, this);
        }

        protected virtual void OnSpectatorStateChanged(int userId)
        {
            _tableEventService.OnSpectatorStateChanged(userId, this);
        }

    }
}