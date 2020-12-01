using System.Collections.Generic;
using DoppelkopfApi.Models.PlayTable;
using DoppelkopfApi.Services;
using AutoMapper;
using System.Linq;

namespace DoppelkopfApi.Hubs
{
    public class TableHubUtils
    {

        private IMapper _mapper;
        private IPlayTableService _playTableService;
        public TableHubUtils(IPlayTableService playTableService, IMapper mapper)
        {
            _playTableService = playTableService;
            _mapper = mapper;
        }

        public IList<PlayTableCountModel> GetTablesWithUserCount()
        {
            var tables = _playTableService.GetAllTables();
            var model = _mapper.Map<IList<PlayTableCountModel>>(tables);
            foreach (var table in model)
            {
                table.UserCount = _playTableService.TableUserCount(table.Id);
            }
            return model;
        }

        public PlayTableGameModel GetTablePLayerState(int playerId)
        {
            var tablePlayer = _playTableService.GettablePlayerOfId(playerId);
            if (tablePlayer != null)
            {
                var table = _playTableService.GetTableById(tablePlayer.TableId);
                var tablePlayers = _playTableService.GetPlayersOfTable(tablePlayer.TableId);
                var model = _mapper.Map<PlayTableGameModel>(table);
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