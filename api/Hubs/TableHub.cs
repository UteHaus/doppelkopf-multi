using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using DoppelkopfApi.Services;
using Microsoft.AspNetCore.Authorization;
using AutoMapper;
using DoppelkopfApi.Models.PlayTable;
using DoppelkopfApi.Entities;
namespace DoppelkopfApi.Hubs
{

    public interface ITableClient
    {
        Task Tables(IList<PlayTableCountModel> tables);


        Task PlayerTableState(PlayTableStaeModel state);

        Task SpectatorTable(PlayTableStaeModel state);
        Task PlayerCards(Card[] cards);

        Task SpectatorState(ViewWerModel viewer);

        Task PlayerCardsForSpectator(Card[] cards);

        Task UserUseCase(UserUseCaseModel useCase);

    }

    [Authorize]
    public class TableHub : Hub<ITableClient>
    {
        private IPlayTableService _tablesService;
        private IMapper _mapper;

        public TableHub(IPlayTableService tableService, IMapper mapper)
        {
            _tablesService = tableService;
            _mapper = mapper;
        }


        public override Task OnDisconnectedAsync(Exception exception)
        {
            int userId;
            if (int.TryParse(Context.UserIdentifier, out userId))
                _tablesService.CloseAllSessions(userId);
            return base.OnDisconnectedAsync(exception);
        }

        [HubMethodName("PlayerTableState")]
        public async Task PlayerTableState()
        {
            await UpdatePlayerTableState(-1);
        }


        [HubMethodName("Tables")]
        public async Task Tables()
        {
            await Clients.All.Tables(TableHubUtils.GetTablesWithUserCount(_tablesService, _mapper));
        }

        [HubMethodName("SpectatorTable")]
        public async Task SpectatorTable()
        {
            int userId;
            PlayTableStaeModel state = null;
            if (TryParsUserId(out userId))
            {
                var viewer = _tablesService.GetTableViewerByUserId(userId);
                if (viewer != null)
                {
                    state = TableHubUtils.GetTableState(viewer.tableId, _tablesService, _mapper);
                }
            }
            await Clients.User(Context.UserIdentifier).SpectatorTable(state);
        }

        [HubMethodName("PlayerCards")]
        public async Task PlayerCards()
        {
            int userId;
            TryParsUserId(out userId);
            var cards = TableHubUtils.GetPlayerCards(userId, _tablesService);
            await Clients.User(userId.ToString()).PlayerCards(cards);
        }

        [HubMethodName("PlayerCardsForSpectator")]
        public async Task PlayerCardsForSpectator()
        {
            int userId;
            TryParsUserId(out userId);

            //for viewers
            var viewer = _tablesService.GetTableViewerByUserId(userId);
            var cards = TableHubUtils.GetPlayerCards(viewer.SeePlayerCard, _tablesService);
            await Clients.User(userId.ToString()).PlayerCardsForSpectator(cards);
        }


        [HubMethodName("SpectatorState")]
        public async Task SpectatorState()
        {
            int userId;
            if (TryParsUserId(out userId))
            {
                await Clients.User(userId.ToString()).SpectatorState(TableHubUtils.GetViewWerModel(userId, _tablesService, _mapper));
            }
        }

        public Task UpdatePlayerTableState(int playerId = -1)
        {
            if (playerId < 0)
            {
                string userId = Context.UserIdentifier;
            }
            PlayTableStaeModel modelValue = null;
            if (TryParsUserId(out playerId))
            {
                if (playerId > 0)
                {
                    modelValue = TableHubUtils.GetTablePLayerState(playerId, _tablesService, _mapper);
                    return Clients.User(playerId.ToString()).PlayerTableState(modelValue);
                }

            }
            return Task.FromResult<PlayTableStaeModel>(null);
        }

        private bool TryParsUserId(out int userId)
        {
            return int.TryParse(Context.UserIdentifier, out userId);
        }

    }
}