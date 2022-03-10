using AutoMapper;
using DoppelkopfApi.Services;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using DoppelkopfApi.Models.PlayTable;
using DoppelkopfApi.Enums;
using DoppelkopfApi.Entities;

namespace DoppelkopfApi.Hubs
{

    public interface ITableEventService
    {
        void TableListChanged(IPlayTableService playTableService);
        void TableChanged(int tableId, IPlayTableService playTableService);
        void OnPlayerCardsChanged(int userId, Card[] userCards, IPlayTableService playTableService);

        void OnSpectatorStateChanged(int userId, IPlayTableService playTableService);

        void UserUseCaseChanged(int userId, int tableId, UseCase useCase);

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



        public void TableChanged(int tableId, IPlayTableService playTableService)
        {
            var tablePlayers = playTableService.GetPlayersOfTable(tableId);
            var tableViewers = playTableService.GetTableViewer(tableId);
            var tableState = TableHubUtils.GetTableState(tableId, playTableService, _mapper);
            Parallel.ForEach(tablePlayers, (tablePlayer) =>
            {
                var clientUser = getClientUser(tablePlayer.PlayerId);
                if (clientUser != null)
                    clientUser.PlayerTableState(tableState);
            });

            // for all viewers of the table
            Parallel.ForEach(tableViewers, (tableViewer) =>
            {
                var clientUser = getClientUser(tableViewer.userId);
                if (clientUser != null)
                    clientUser.SpectatorTable(tableState);
            });

        }

        public void OnPlayerCardsChanged(int userId, Card[] userCards, IPlayTableService playTableService)
        {
            _hub.Clients.User(userId.ToString()).PlayerCards(userCards);

            //for viewers
            var viewers = playTableService.GetTableViewerOfCardPlayers(userId);
            if (viewers.Length > 0)
            {
                foreach (var viewer in viewers)
                {
                    var clientUser = getClientUser(viewer.userId);
                    if (clientUser != null)
                        clientUser.PlayerCardsForSpectator(userCards);
                }
            }
        }


        public void OnSpectatorStateChanged(int userId, IPlayTableService playTableService)
        {
            var clientUser = getClientUser(userId);
            if (clientUser != null)
                clientUser.SpectatorState(TableHubUtils.GetViewWerModel(userId, playTableService, _mapper));
        }

        public void UserUseCaseChanged(int userId, int tableId, UseCase useCase)
        {
            var clientUser = getClientUser(userId);
            if (clientUser != null)
                clientUser.UserUseCase(new UserUseCaseModel(tableId, useCase));
        }

        private ITableClient getClientUser(int userId)
        {
            return _hub.Clients.Users(userId.ToString());
        }
    }
}