using System;
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

namespace DoppelkopfApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class PlayTableController : ControllerBase
    {

        private IPlayTableService _playTableService;
        private IMapper _mapper;
        private IHubContext<TableHub, ITableClient> _hub;


        public PlayTableController(IPlayTableService playTableService, IMapper mapper, IHubContext<TableHub, ITableClient> hub)
        {
            _playTableService = playTableService;
            _mapper = mapper;
            _hub = hub;
        }


        [HttpPost()]
        public IActionResult CreatePlayTable([FromBody] PlayTableModel table)
        {
            try
            {
                var newTable = _playTableService.CreateTable(_mapper.Map<PlayTable>(table));
                var model = _mapper.Map<PlayTableModel>(newTable);
                return Ok(model);
            }
            catch (AppException ex)
            {
                // return error message if there was an exception
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _playTableService.Delete(id);
            return Ok();
        }

        [HttpPut("{tableId}/on-table")]
        public IActionResult SetOnTable(int tableId, int userId)
        {
            try
            {
                bool userOnTable = _playTableService.SetOnTable(userId, tableId);
                if (userOnTable)
                {
                    return Ok();
                }
                else
                {
                    return NoContent();
                }

            }
            catch (AppException ex)
            {
                return BadRequest(new { message = ex.Message });
            }

        }
        [HttpPut("out-table")]
        public IActionResult SetOutTable(int userId)
        {
            try
            {
                bool userOutTable = _playTableService.SetOutTable(userId);
                if (userOutTable)
                {
                    return Ok();
                }
                else
                {
                    return NoContent();
                }

            }
            catch (AppException ex)
            {
                return BadRequest(new { message = ex.Message });
            }

        }

        [HttpGet("status")]
        public IActionResult GetStatus(int tableId)
        {
            try
            {
                var status = _playTableService.GetStatus(tableId);

                return Ok(status);
            }
            catch (AppException ex)
            {
                return BadRequest(new { message = ex.Message });
            }

        }


        [HttpGet("user-count")]
        public IActionResult TableUserCount(int tableId)
        {
            try
            {
                int count = _playTableService.TableUserCount(tableId);
                return Ok(count);
            }
            catch (AppException ex)
            {
                return BadRequest(new { message = ex.Message });
            }

        }

        [HttpGet()]
        public IActionResult GetAllTables()
        {
            try
            {
                return Ok(GetTablesWithUserCount());
            }
            catch (AppException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        [HttpGet("{tableId}")]
        public IActionResult getById(int tableId)
        {
            var table = _playTableService.GetTableById(tableId);
            var model = _mapper.Map<PlayTableModel>(table);
            return Ok(model);
        }

        [HttpGet("{tableId}/last-stich")]
        public IActionResult GetLastStich(int tableId)
        {
            return Ok(_playTableService.GetLastStich(tableId));
        }

        [HttpGet("player/{userId}")]
        public IActionResult GetUserTable(int userId)
        {
            try
            {
                var userTable = _playTableService.GetUserTable(userId);
                var model = _mapper.Map<PlayTableModel>(userTable);
                return Ok(model);
            }
            catch (AppException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("player/{playerId}/state")]
        public IActionResult getPlayTableGameState(int playerId)
        {
            try
            {
                return Ok(TableHubUtils.GetTablePLayerState(playerId, _playTableService, _mapper));
            }
            catch (AppException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("player/{playerId}/played-cards")]
        public IActionResult SetPlayedcard(int playerId, Card card)
        {
            try
            {
                _playTableService.SetPlayedCard(playerId, card);
                return Ok();
            }
            catch (AppException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("player/{playerId}/announcement")]
        public IActionResult SetDutyAnnouncement(int playerId, string announcement)
        {
            try
            {
                _playTableService.SetDutyAnnouncement(playerId, announcement);
                return Ok();
            }
            catch (AppException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("player/{playerId}/message")]
        public IActionResult SetPlayerMessage(int playerId, string message)
        {
            try
            {
                _playTableService.SetPlayerMessage(playerId, message);
                return Ok();
            }
            catch (AppException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("player/{playerId}/variant")]
        public IActionResult SetGameVariant(int playerId, string variant)
        {
            try
            {
                GamesVariants outVariant;
                Enum.TryParse<GamesVariants>(variant, out outVariant);
                _playTableService.SetGameVariant(playerId, outVariant);
                return Ok();
            }
            catch (AppException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{tableId}/last-update")]
        public IActionResult GetLastTableUpdate(int tableId)
        {
            try
            {
                var table = _playTableService.GetTableById(tableId);
                if (table != null)
                {
                    return Ok(table.LastUpdate.ToUniversalTime());
                }
                return BadRequest(new { message = "Table not found " + tableId });
            }
            catch (AppException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        [HttpPut("{id}/start")]
        public IActionResult StartGame(int id)
        {
            try
            {
                bool canRun = _playTableService.StartNewRound(id);
                if (canRun)
                {
                    return Ok(canRun);
                }
            }

            catch (AppException ex)
            {
                return BadRequest(new { message = ex.Message });
            }

            return Forbid();
        }



        [HttpPut("player/replace")]
        public IActionResult ReplaceTablePlayer(int currentPlayerId, int newPlayerId)
        {
            try
            {
                return Ok(_playTableService.ReplaceTablePlayer(currentPlayerId, newPlayerId));
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPut("player/{playerId}/next")]
        public IActionResult NextTurn(int playerId)
        {
            try
            {
                _playTableService.NextTurn(playerId);

                return Ok();
            }

            catch (AppException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPut("player/{playerId}/shuffle-cards")]
        public IActionResult ShuffleCards(int playerId)
        {
            try
            {
                _playTableService.ShuffleCards(playerId);

                return Ok();
            }

            catch (AppException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        private IList<PlayTableCountModel> GetTablesWithUserCount()
        {
            var tables = _playTableService.GetAllTables();
            var model = _mapper.Map<IList<PlayTableCountModel>>(tables);
            foreach (var table in model)
            {
                table.UserCount = _playTableService.TableUserCount(table.Id);
            }
            return model;
        }


    }

}
