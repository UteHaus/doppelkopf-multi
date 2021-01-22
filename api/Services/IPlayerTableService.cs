using System;
using System.Collections.Generic;
using DoppelkopfApi.Entities;

namespace DoppelkopfApi.Services
{
    public interface IPlayTableService
    {

        PlayTable CreateTable(PlayTable table);
        bool Delete(int id, bool hard = false);

        bool SetOnTable(int userId, int tableId);
        bool SetOutTable(int userId);

        PlayStatus GetStatus(int tableId);

        int TableUserCount(int tableId);

        IEnumerable<PlayTable> GetAllTables();

        PlayTable GetTableById(int tableId);

        PlayTable GetUserTable(int userId);
        TablePlayer GettablePlayerOfId(int playerId);

        void NextTurn(int playerId);

        /// <summary>
        /// Setup the table and the player for a new round on the table.
        /// </summary>
        /// <param name="tableId">Id of the table.</param>
        /// <returns>True when the a new round started otherwise false (setup fails).</returns>
        bool StartNewRound(int tableId);
        DateTime GetLastTableUpdate(int tableId);

        void SetPlayedCard(int playerId, Card card);

        TablePlayer[] GetPlayersOfTable(int tableId);
        void ShuffleCards(int playerId);
        bool SetGameVariant(int playerId, GamesVariants variant);

        bool WatchTable(int userId, int tableId);

        bool CancelWatchTable(int userId, bool saveContext = true);

        void CloseAllSessions(int userId);
        /// <summary>
        /// Replace a player on a table with a user.
        /// </summary>
        /// <param name="currentPlayerId">Player ID wish play on a table.</param>
        /// <param name="newPlayerId">The user ID of the new table player.</param>
        /// <returns></returns>
        bool ReplaceTablePlayer(int currentPlayerId, int newPlayerId);

        bool SetAsAdditionPlayer(int userId, bool seeOn);

        TableViewer[] GetTableViewer(int tableId);

        TableViewer GetTableViewerByUserId(int userId);

        /// <summary>
        /// Get this viewer back that show cards of the given player.
        /// </summary>
        /// <param name="playerId">The table player Id</param>
        /// <returns></returns>
        TableViewer[] GetTableViewerOfCardPlayers(int playerId);

        bool ShowCardsOf(int userId, int playerId);

        void SetPlayerMessage(int playerId, string message);

        void SetDutyAnnouncement(int playerId, string announcement);

        Card[] GetLastStich(int tableId);

    }

}
