using System.Linq;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using DoppelkopfApi.Services;
using DoppelkopfApi.Entities;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;

namespace DoppelkopfApi.Hubs
{

    public interface ITableClient
    {
        Task Tables(PlayTable[] tables);
    }

    public class TableHub : Hub<ITableClient>
    {
        private IPlayTableService _tablesService;

        public TableHub(IPlayTableService tableService)
        {
            _tablesService = tableService;
            _tablesService.TableListChanged += OnTableChanged;
        }

        protected override void Dispose(bool disposing)
        {
            _tablesService.TableListChanged += OnTableChanged;
            base.Dispose(disposing);
        }


        public Task Tables()
        {
            return Clients.All.Tables(_tablesService.GetAllTables().ToArray());
        }

        public void OnTableChanged()
        {
            Clients.All.Tables(_tablesService.GetAllTables().ToArray());
        }
    }
}