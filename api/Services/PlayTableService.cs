using System;
using System.Collections.Generic;
using DoppelkopfApi.Entities;
using DoppelkopfApi.Hubs;
using DoppelkopfApi.Helpers;
using System.Linq;
using System.Text.Json;
using DoppelkopfApi.Enums;
using DoppelkopfApi.Services.Utils;

namespace DoppelkopfApi.Services
{
    public class PlayTableService : IPlayTableService
    {
        private DataContext _context;
        private IUserService _userService;
        ITableEventService _tableEventService;

        public PlayTableService(DataContext context, IUserService userService, ITableEventService tableEventService)
        {
            _context = context;
            _tableEventService = tableEventService;
            _userService = userService;
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
                var clinetUpdateAction = SwitchPlayer(table);
                var tablePlayers = GetPlayersOfTable(tableId);
                _context.PlayTables.Update(table);

                if (tablePlayers.Length < 4)
                {
                    throw new System.Exception("This Table hase not 4 players");
                }
                table.Status = PlayStatus.SelectGameVarian;
                foreach (var player in tablePlayers)
                {
                    player.ClearForNextRound();
                }
                CardUtil.SetHandCards(tablePlayers, table.WithNiner);
                _context.TablePlayer.UpdateRange(tablePlayers);
                int changeCount = _context.SaveChanges();

                OnTableChanged(table.Id);
                foreach (var player in tablePlayers)
                    OnPlayerCardsChanged(player.Id, player.GetHandCards());


                return changeCount > 0;

            }
            return false;
        }

        public bool SetGameVariant(int playerId, GamesVariants variant)
        {
            if (variant == GamesVariants.None)
                return false;

            var tablePlayer = GettablePlayerOfId(playerId);
            if (tablePlayer != null && tablePlayer.GameVariant == GamesVariants.None)
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

                    table.GameVariant = CardPointsUtil.WhichVariantIsPlayed(tablePlayers);
                    if (table.GameVariant == GamesVariants.Normal)
                        table.SilentForPlayer = CardPointsUtil.SilentPlayer(tablePlayers);

                    table.Status = PlayStatus.Run;
                    _context.Update(table);
                    _context.SaveChanges();
                }
                OnTableChanged(tablePlayer.TableId);
                return true;
            }
            return false;

        }

        public void NextTurn(int playerId)
        {
            var nextTurnCountA = _context.TablePlayer.Count(tp => tp.NextTurn);
            var tablePlayer = GettablePlayerOfId(playerId);

            // if a player set his next step, do nothing.
            if (tablePlayer != null && tablePlayer.NextTurn == false)
            {
                var nextStepValueSet = tablePlayer.NextTurn;
                tablePlayer.NextTurn = true;
                _context.TablePlayer.Update(tablePlayer);
                _context.SaveChanges();

                var tableId = tablePlayer.TableId;
                var nextTurnCountB = _context.TablePlayer.Count(tp => tp.NextTurn);
                if (nextTurnCountA == nextTurnCountB || nextTurnCountB <= 1)
                    nextTurnCountB = _context.TablePlayer.Count(tp => tp.NextTurn);
                // only if all players have set the next step and this player's next step was not set, then the next step can be executed.
                if (nextTurnCountB >= 4 && nextStepValueSet == false)
                {
                    var newRound = _context.PlayTables.Count((pt) => pt.Id == tablePlayer.TableId && pt.Status == PlayStatus.WinnersTime) == 1;

                    if (newRound)
                    {
                        // after seen all the winner state setup a new round
                        StartNewRound(tableId);
                    }
                    else
                    {

                        var tablePlayers = GetPlayersOfTable(tablePlayer.TableId);
                        var playedRoundCards = tablePlayers.Select((tp) => new PlayCard(tp)).ToArray();
                        var table = _context.PlayTables.FirstOrDefault(pt => pt.Id == tablePlayer.TableId);

                        table.SetLastCardSet(playedRoundCards.Select((prc) => prc.Card).ToArray());
                        int stitchWinnerId = CardPointsUtil.WhoWinCardRound(playedRoundCards, table, tablePlayers);
                        // var stitchWinner = tablePlayers.FirstOrDefault((tp) => tp.PlayerId == stitchWinnerId);
                        table.SetAdditionalWeddingPlayer(tablePlayers, stitchWinnerId);

                        foreach (var player in tablePlayers)
                        {
                            player.ClearForNextTurn();
                            if (player.PlayerId == stitchWinnerId)
                            {
                                player.RoundsPoints += CardPointsUtil.CardPoints(playedRoundCards);
                                table.CurrentPlayerPosition = player.PlayerPosition;
                            }
                        }
                        _context.TablePlayer.UpdateRange(tablePlayers);

                        table.StitchCounter++;
                        // if the round is over
                        if (table.StitchCounter >= 12 || (!table.WithNiner && table.StitchCounter >= 10) || tablePlayers.All((player) => player.AnyCards()))
                        {
                            TableUtil.SetWinners(tablePlayers, table);
                            table.Status = PlayStatus.WinnersTime;
                            _context.TablePlayer.UpdateRange(tablePlayers);

                        }
                        else
                        {
                            table.Status = PlayStatus.Run;
                        }

                        _context.PlayTables.Update(table);
                        _context.SaveChanges();
                        OnTableChanged(table.Id);
                    }

                }
                else
                {
                    OnTableChanged(tableId);
                }

            }
        }

        public void SetDutyAnnouncement(int playerId, string announcement)
        {
            var player = GettablePlayerOfId(playerId);
            if (player != null)
            {
                player.DutyAnnouncement = announcement;
                _context.TablePlayer.Update(player);
                _context.SaveChanges();
                OnTableChanged(player.TableId);
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

            if (table != null && (hard || tablePlayersCount < 4))
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

            if (!player.PlayerCardSet())
            {
                player.SetPlayedCard(card);
                player.NextTurn = false;
                _context.TablePlayer.Update(player);
                _context.SaveChanges();
                OnPlayerCardsChanged(playerId, player.GetHandCards());


                bool allPlayerSetCards = this.GetPlayersOfTable(player.TableId).Count((p) => !String.IsNullOrWhiteSpace(p.PlayedCard)) == 4;
                var table = GetTableById(player.TableId);
                // When all players have placed their cards, the state of the table changes from "Run" to "Waiting for the next round" or the next player can draw his card.
                if (allPlayerSetCards)
                {
                    table.Status = PlayStatus.WaitForNextRund;
                }
                else
                {
                    table.SetToNextPlayerTurn();
                }

                _context.PlayTables.Update(table);
                _context.SaveChanges();
                OnTableChanged(player.TableId);
            }
        }

        public void SetPlayerMessage(int playerId, string message)
        {
            var player = _context.TablePlayer.FirstOrDefault((player) => player.PlayerId == playerId);
            if (player != null)
            {
                player.Message = message;
                _context.TablePlayer.Update(player);
                if (_context.SaveChanges() > 0)
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
                newTablePlayer.PlayerPosition = GetNextFreePostionOnTable(tablePlayers);
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
                var tablePlayers = GetPlayersOfTable(tablePlayer.TableId)?.Where((p) => p.PlayerId != playerId)?.ToArray();
                if (tablePlayers != null)
                {
                    foreach (var player in tablePlayers)
                    {
                        player.ClearForNextTurn();
                    }
                    _context.TablePlayer.UpdateRange(tablePlayers);
                }

                var table = GetTableById(tablePlayer.TableId);
                if (table != null)
                {
                    table.Status = PlayStatus.Stop;
                    _context.PlayTables.Update(table);
                }

                _context.TablePlayer.Remove(tablePlayer);
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
            if (player != null && player.ShuffleRound == false)
            {
                player.ShuffleRound = true;
                _context.TablePlayer.Update(player);
                _context.SaveChanges();
                int shuffleCount = _context.TablePlayer.Count(p => p.TableId == player.TableId && p.ShuffleRound);
                if (shuffleCount == 4)
                {

                    var table = _context.PlayTables.Find(player.TableId);
                    table.Status = PlayStatus.Stop;
                    _context.SaveChanges();
                    StartNewRound(table.Id);
                }
                else
                { OnTableChanged(player.TableId); }
            }

        }

        public bool ShowCardsOf(int userId, int playerId)
        {
            var viewer = _context.TableViewers.FirstOrDefault((viewer) => viewer.userId == userId);
            if (viewer != null)
            {
                viewer.SeePlayerCard = playerId;
                _context.TableViewers.Update(viewer);
                var savedContent = _context.SaveChanges() > 0;

                if (savedContent)
                    OnSpectatorStateChanged(userId);

                return savedContent;
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
            if (viewUser != null && viewUser.AsAdditionPlayer != seeOn)
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


        public Card[] GetLastStich(int tableId)
        {
            var table = _context.PlayTables.FirstOrDefault((table) => table.Id == tableId);
            return table != null ? table.GetLastCardSet() : new Card[0];
        }


        public TableViewer[] GetTableViewerOfCardPlayers(int playerId)
        {
            return _context.TableViewers.Where((viewer) => viewer.SeePlayerCard == playerId).ToArray();
        }


        /// <summary>
        /// find the nex free position of the table
        /// </summary>
        /// <param name="tablePlayers">Players of one table</param>
        /// <returns></returns>
        private int GetNextFreePostionOnTable(TablePlayer[] tablePlayers)
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

        /// <summary>
        /// Is a 5th Player (of the viewers checked)m switch player and checked viewer. 
        /// /// </summary>
        private Action SwitchPlayer(PlayTable table)
        {
            var viewerAs5thPlayer = _context.TableViewers.FirstOrDefault((viewer) => viewer.tableId == table.Id && viewer.AsAdditionPlayer);
            if (viewerAs5thPlayer != null)
            {
                var giverPlayer = _context.TablePlayer.FirstOrDefault((player) => player.TableId == table.Id && player.PlayerPosition == table.RoundCardsGiversPosition);
                var user = _context.Users.FirstOrDefault((user) => user.Id == viewerAs5thPlayer.userId);
                if (giverPlayer != null && user != null)
                {
                    //replace the giver player with the viewer (5th player)
                    int giverPlayerId = giverPlayer.PlayerId;
                    giverPlayer.PlayerId = viewerAs5thPlayer.userId;
                    giverPlayer.Username = user.Username;
                    _context.TablePlayer.Update(giverPlayer);

                    //set the player as the 5th player (viewer)
                    viewerAs5thPlayer.userId = giverPlayerId;
                    viewerAs5thPlayer.SeePlayerCard = -1;
                    _context.TableViewers.Update(viewerAs5thPlayer);
                    _context.SaveChanges();

                    return () =>
                    {
                        UserUseCaseChanged(viewerAs5thPlayer.userId, table.Id, UseCase.Viewer);
                        UserUseCaseChanged(giverPlayer.PlayerId, table.Id, UseCase.Player);
                    };
                }
            }
            return null;
        }


        protected void OnTableListChanged()
        {
            _tableEventService.TableListChanged(this);
        }

        protected void OnTableChanged(int tableId)
        {
            _tableEventService.TableChanged(tableId, this);
        }

        protected void OnPlayerCardsChanged(int userId, Card[] userCards)
        {
            _tableEventService.OnPlayerCardsChanged(userId, userCards, this);
        }

        protected void OnSpectatorStateChanged(int userId)
        {
            _tableEventService.OnSpectatorStateChanged(userId, this);
        }


        protected void UserUseCaseChanged(int userId, int tableId, UseCase useCase)
        {
            _tableEventService.UserUseCaseChanged(userId, tableId, useCase);
        }

    }
}