using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Authorization;
using DoppelkopfApi.Helpers;
using DoppelkopfApi.Services;
using DoppelkopfApi.Entities;
using DoppelkopfApi.Models.Users;
using AutoMapper;
using System.Reflection;
namespace DoppelkopfApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class SpectatorController : ControllerBase
    {

        private IPlayTableService _tableService;
        private IMapper _mapper;

        public SpectatorController(
            IPlayTableService tableService,
            IMapper mapper)
        {
            _tableService = tableService;
            _mapper = mapper;
        }

        [AllowAnonymous]
        [HttpPut("asAdditionPlayer")]
        public IActionResult SetAsAdditionPlayer(int userId, bool seeOn = true)
        {
            try
            {
                return Ok(_tableService.SetAsAdditionPlayer(userId, seeOn));
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPost()]
        public IActionResult WatchTable(int tableId, int userId)
        {
            try
            {
                bool result = _tableService.WatchTable(userId, tableId);

                return Ok(result);
            }

            catch (AppException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut()]
        public IActionResult CancelWatchTable(int userId)
        {
            try
            {
                bool result = _tableService.CancelWatchTable(userId);

                return Ok(result);
            }

            catch (AppException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{userId}/cards-of/{playerId}")]
        public IActionResult CancelWatchTable(int userId, int playerId)
        {
            try
            {
                bool result = _tableService.ShowCardsOf(userId, playerId);

                return Ok(result);
            }

            catch (AppException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

    }
}
