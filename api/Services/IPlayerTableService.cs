using System;
using System.Collections.Generic;
using DoppelkopfApi.Entities;
using System.Threading.Tasks;

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
        ValueTask<PlayTable> GetTableByIdAsync(int id);

        PlayTable GetUserTable(int userId);
        TablePlayer GettablePlayerOfId(int playerId);

        void NextTurn(int playerId);
        bool StartNewRound(int tableId);
        DateTime GetLastTableUpdate(int tableId);

        void SetPlayedCard(int playerId, Card card);

        TablePlayer[] GetPlayersOfTable(int tableId);
        void ShuffleCards(int playerId);
        void SetGameVariant(int playerId, GamesVariants variant);

        bool WatchTable(int userId, int tableId);

        bool CancelWatchTable(int userId, bool saveContext = true);

        void CloseAllSessions(int userId);

        TableViewer[] GetTableViewer(int tableId);

        TableViewer GetTableViewerByUserId(int userId);

    }

}
