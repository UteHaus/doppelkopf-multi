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


        Task PlayerTableState(PlayTableGameModel state);
    }

    [Authorize]
    public class TableHub : Hub<ITableClient>
    {
        private IPlayTableService _tablesService;
        private IMapper _mapper;

        private HubConnections _hubConnections;

        public TableHub(IPlayTableService tableService, IMapper mapper, HubConnections hubConnections)
        {
            _tablesService = tableService;
            _hubConnections = hubConnections;
            _mapper = mapper;
        }

        public override Task OnConnectedAsync()
        {
            _hubConnections.SetConnection(Context.UserIdentifier, Context.ConnectionId);
            return base.OnConnectedAsync();
        }


        public async Task PlayerTableState()
        {
            await UpdatePlayerTableState(-1);
        }


        public async Task Tables()
        {
            Console.WriteLine(Context.UserIdentifier);
            await Clients.All.Tables(TableHubUtils.GetTablesWithUserCount(_tablesService, _mapper));
        }



        public async Task UpdatePlayerTableState(int playerId = -1)
        {
            if (playerId < 0)
            {
                string userId = Context.UserIdentifier;
            }
            PlayTableGameModel modelValue = null;
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