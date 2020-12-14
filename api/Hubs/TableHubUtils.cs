using System.Collections.Generic;
using DoppelkopfApi.Models.PlayTable;
using DoppelkopfApi.Services;
using DoppelkopfApi.Entities;
using AutoMapper;
using System.Linq;

namespace DoppelkopfApi.Hubs
{
    public class TableHubUtils
    {


        public static IList<PlayTableCountModel> GetTablesWithUserCount(IPlayTableService playTableService, IMapper mapper)
        {
            var tables = playTableService.GetAllTables();
            var model = mapper.Map<IList<PlayTableCountModel>>(tables);
            foreach (var table in model)
            {
                table.UserCount = playTableService.TableUserCount(table.Id);
            }
            return model;
        }

        public static PlayTableStaeModel GetTablePLayerState(int playerId, IPlayTableService playTableService, IMapper mapper)
        {
            var tablePlayer = playTableService.GettablePlayerOfId(playerId);
            if (tablePlayer != null)
            {
                var tableState = GetTableState(tablePlayer.TableId, playTableService, mapper);
                return tableState;
            }
            return null;
        }

        public static PlayTableStaeModel GetTableState(int tableId, IPlayTableService playTableService, IMapper mapper)
        {
            var table = playTableService.GetTableById(tableId);
            if (table != null)
            {
                var tablePlayers = playTableService.GetPlayersOfTable(tableId);
                var tableState = mapper.Map<PlayTableStaeModel>(table);
                tableState.UserCount = tablePlayers.Length;
                tableState.Players = tablePlayers.Select((p) => new AdditionPlayerInfoModel(p)).ToArray();
                tableState.ShuffleCount = tablePlayers.Count(p => p.ShuffleRound);
                tableState.NextTurnCount = tablePlayers.Count(p => p.NextTurn);
                return tableState;
            }
            return null;
        }


        public static ViewWerModel GetViewWerModel(int userId, IPlayTableService playTableService, IMapper mapper)
        {
            var viewer = playTableService.GetTableViewerByUserId(userId);
            return viewer == null ? null : mapper.Map<ViewWerModel>(viewer);
        }

        public static Card[] GetPlayerCards(int userId, IPlayTableService tableService)
        {
            var player = tableService.GettablePlayerOfId(userId);
            var cards = player?.GetHandCards();

            return cards;
        }

    }
}