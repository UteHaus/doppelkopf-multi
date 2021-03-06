using AutoMapper;
using DoppelkopfApi.Services;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using DoppelkopfApi.Models.PlayTable;
using DoppelkopfApi.Enums;

namespace DoppelkopfApi.Hubs
{

    public interface ITableEventService
    {
        void TableListChanged(IPlayTableService playTableService);
        void TableChanged(int tableId, IPlayTableService playTableService);
        void OnPlayerCardsChanged(int userId, int tableId, IPlayTableService playTableService);

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
                _hub.Clients.User(tablePlayer.PlayerId.ToString()).PlayerTableState(tableState);
            });

            // for all viewers of the table
            Parallel.ForEach(tableViewers, (tableViewer) =>
            {
                _hub.Clients.User(tableViewer.userId.ToString()).SpectatorTable(tableState);
            });

        }

        public void OnPlayerCardsChanged(int userId, int tableId, IPlayTableService playTableService)
        {
            var cards = TableHubUtils.GetPlayerCards(userId, playTableService);
            _hub.Clients.User(userId.ToString()).PlayerCards(cards);

            //for viewers
            var viewers = playTableService.GetTableViewerOfCardPlayers(userId);
            if (viewers.Length > 0)
            {
                foreach (var viewer in viewers)
                {
                    _hub.Clients.User(viewer.userId.ToString()).PlayerCardsForSpectator(cards);
                }
            }
        }


        public void OnSpectatorStateChanged(int userId, IPlayTableService playTableService)
        {
            _hub.Clients.User(userId.ToString()).SpectatorState(TableHubUtils.GetViewWerModel(userId, playTableService, _mapper));
        }

        public void UserUseCaseChanged(int userId, int tableId, UseCase useCase)
        {
            _hub.Clients.User(userId.ToString()).UserUseCase(new UserUseCaseModel(tableId, useCase));
        }
    }
}