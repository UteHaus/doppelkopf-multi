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
using System.Threading;

namespace DoppelkopfApi.Hubs
{

    public interface ITableEventService
    {
        void TableListChanged(IPlayTableService playTableService);
        void TableChanged(int tableId, IPlayTableService playTableService);
    }

    public class TableEventService : ITableEventService
    {
        private IMapper _mapper;
        private IHubContext<TableHub, ITableClient> _hub;
        public TableEventService(IMapper mapper, IHubContext<TableHub, ITableClient> hub)
        {
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
            var tableViewers = playTableService.GetTableViewer(tableId);
            var tableState = TableHubUtils.GetTableState(tableId, playTableService, _mapper);
            Parallel.ForEach(tablePlayers, (tablePlayer) =>
            {
                var playerState = TableHubUtils.AddPlayerInfosToTableState(tablePlayer, tableState, _mapper);
                _hub.Clients.User(tablePlayer.PlayerId.ToString()).PlayerTableState(playerState);
            });

            // for all viewers of the table
            Parallel.ForEach(tableViewers, (tableViewer) =>
            {
                _hub.Clients.User(tableViewer.userId.ToString()).SpectatorTable(tableState);
            });

        }

    }
}