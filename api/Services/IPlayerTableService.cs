using System;
using System.Collections.Generic;
using DoppelkopfApi.Entities;
using System.Threading.Tasks;

namespace DoppelkopfApi.Services
{

    public delegate void TableListEventHandler();
    public delegate void TableEventHandler(int tableId);

    public interface IPlayTableService
    {
        event TableListEventHandler TableListChanged;
        event TableEventHandler TableChanged;

        PlayTable CreateTable(PlayTable table);
        bool Delete(int id, bool hard = false);

        bool SetOnTable(int userId, int tableId);
        bool SetOutTable(int userId);

        PlayStatus GetStatus(int tableId);

        int TableUserCount(int tableId);

        IEnumerable<PlayTable> GetAllTables();

        PlayTable GetTableById(int id);
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

    }

}
