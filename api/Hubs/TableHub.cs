using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using DoppelkopfApi.Services;
using DoppelkopfApi.Entities;
using System.Text.Json;
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
        private TableHubUtils _hubUtil;
        private IMapper _mapper;



        public TableHub(IPlayTableService tableService, IMapper mapper)
        {

            _tablesService = tableService;
            _mapper = mapper;
            _tablesService.TableListChanged += OnTableListChanged;
            _tablesService.TableChanged += OnTableChanged;
            _hubUtil = new TableHubUtils(tableService, mapper);
        }



        protected override void Dispose(bool disposing)
        {
            _tablesService.TableListChanged -= OnTableListChanged;
            _tablesService.TableChanged -= OnTableChanged;
            base.Dispose(disposing);
        }

        public Task PlayerTableState()
        {
            return UpdatePlayerTableState(-1);
        }
        public Task UpdatePlayerTableState(int playerId = -1)
        {
            if (playerId < 0)
            {
                string userId = Context.UserIdentifier;
            }
            PlayTableGameModel modelValue = null;
            if (int.TryParse(Context.UserIdentifier, out playerId))
            {
                modelValue = _hubUtil.GetTablePLayerState(playerId);

            }
            if (playerId > 0)
            {

                return Clients.User(playerId.ToString()).PlayerTableState(modelValue);
            }
            return null;
        }


        public Task Tables()
        {
            Console.WriteLine(Context.UserIdentifier);
            return Clients.All.Tables(_hubUtil.GetTablesWithUserCount());
        }

        public void OnTableListChanged()
        {
            Tables();
        }

        public void OnTableChanged(int tableId)
        {
            foreach (var player in _tablesService.GetPlayersOfTable(tableId))
            {
                UpdatePlayerTableState(player.Id);
            }
        }
    }
}