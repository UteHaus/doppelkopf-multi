using System;
using System.Linq;
using System.Collections.Generic;
using DoppelkopfApi.Models.PlayTable;
using DoppelkopfApi.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using DoppelkopfApi.Helpers;
using DoppelkopfApi.Services;
using DoppelkopfApi.Hubs;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace DoppelkopfApi.Hubs
{

    public interface ITableEventService
    {
        void TableListChanged(IPlayTableService playTableService);
        void TableChanged(int tableId, IPlayTableService playTableService);
    }

    public class TableEventService : ITableEventService
    {
        private HubConnections _hubConnections;
        private IMapper _mapper;
        private IHubContext<TableHub, ITableClient> _hub;
        public TableEventService(IMapper mapper, IHubContext<TableHub, ITableClient> hub, HubConnections hubConnections)
        {
            _hubConnections = hubConnections;
            _mapper = mapper;
            _hub = hub;
        }

        public async void TableListChanged(IPlayTableService playTableService)
        {
            await _hub.Clients.All.Tables(TableHubUtils.GetTablesWithUserCount(playTableService, _mapper));
        }



        public async void TableChanged(int tableId, IPlayTableService playTableService)
        {
            var tablePlayers = playTableService.GetPlayersOfTable(tableId);
            foreach (var tablePlayer in tablePlayers)
            {
                var connectionId = _hubConnections.GetConnection(tablePlayer.PlayerId.ToString());
                await _hub.Clients.User(tablePlayer.PlayerId.ToString()).PlayerTableState(TableHubUtils.GetTablePLayerState(tablePlayer.PlayerId, playTableService, _mapper));
            }
        }

    }
}