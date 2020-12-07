using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using DoppelkopfApi.Services;
using Microsoft.AspNetCore.Authorization;
using AutoMapper;
using DoppelkopfApi.Models.PlayTable;
namespace DoppelkopfApi.Hubs
{

    public interface ITableClient
    {
        Task Tables(IList<PlayTableCountModel> tables);


        Task PlayerTableState(PlayerStateModel state);

        Task SpectatorTable(PlayTableStaeModel state);
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


        public async Task PlayerTableState()
        {
            await UpdatePlayerTableState(-1);
        }


        public async Task Tables()
        {
            await Clients.All.Tables(TableHubUtils.GetTablesWithUserCount(_tablesService, _mapper));
        }

        [HubMethodName("SpectatorTable")]
        public Task SpectatorTable()
        {
            int userId;
            PlayTableStaeModel state = null;
            if (int.TryParse(Context.UserIdentifier, out userId))
            {
                var viewer = _tablesService.GetTableViewerByUserId(userId);
                if (viewer != null)
                {
                    state = TableHubUtils.GetTableState(viewer.tableId, _tablesService, _mapper);
                }
            }
            return Clients.User(Context.UserIdentifier).SpectatorTable(state);
        }


        public async Task UpdatePlayerTableState(int playerId = -1)
        {
            if (playerId < 0)
            {
                string userId = Context.UserIdentifier;
            }
            PlayerStateModel modelValue = null;
            if (int.TryParse(Context.UserIdentifier, out playerId))
            {
                if (playerId > 0)
                {
                    modelValue = TableHubUtils.GetTablePLayerState(playerId, _tablesService, _mapper);
                    await Clients.User(playerId.ToString()).PlayerTableState(modelValue);
                }

            }

        }

    }
}