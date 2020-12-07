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

        public static PlayerStateModel GetTablePLayerState(int playerId, IPlayTableService playTableService, IMapper mapper)
        {
            var tablePlayer = playTableService.GettablePlayerOfId(playerId);
            if (tablePlayer != null)
            {
                var tableState = GetTableState(tablePlayer.TableId, playTableService, mapper);
                return AddPlayerInfosToTableState(tablePlayer, tableState, mapper);
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

        public static PlayerStateModel AddPlayerInfosToTableState(TablePlayer player, PlayTableStaeModel tableState, IMapper mapper)
        {
            var playerState = mapper.Map<PlayerStateModel>(tableState);

            if (player != null)
            {
                playerState.PlayerPosition = player.PlayerPosition;
                playerState.Cards = player.GetHandCards();
            }

            return playerState;
        }
    }
}