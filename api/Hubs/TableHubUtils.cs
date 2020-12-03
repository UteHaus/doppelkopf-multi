using System.Collections.Generic;
using DoppelkopfApi.Models.PlayTable;
using DoppelkopfApi.Services;
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

        public static PlayTableGameModel GetTablePLayerState(int playerId, IPlayTableService playTableService, IMapper mapper)
        {
            var tablePlayer = playTableService.GettablePlayerOfId(playerId);
            if (tablePlayer != null)
            {
                var table = playTableService.GetTableById(tablePlayer.TableId);
                var tablePlayers = playTableService.GetPlayersOfTable(tablePlayer.TableId);
                var model = mapper.Map<PlayTableGameModel>(table);
                model.UserCount = tablePlayers.Length;
                model.Cards = tablePlayer.GetHandCards();
                model.Players = tablePlayers.Select((p) => new AdditionPlayerInfoModel(p)).ToArray();
                model.ShuffleCount = tablePlayers.Count(p => p.ShuffleRound);
                model.NextTurnCount = tablePlayers.Count(p => p.NextTurn);
                model.PlayerPosition = tablePlayer.PlayerPosition;
                return model;
            }
            return null;
        }

    }
}