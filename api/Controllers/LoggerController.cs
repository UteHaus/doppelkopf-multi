using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DoppelkopfApi.Services;
using DoppelkopfApi.Models;
using AutoMapper;
using DoppelkopfApi.Entities;
using System.Text.Json;

namespace DoppelkopfApiControllers
{
    // [Authorize]
    [ApiController]
    [Route("api/[controller]")]

    public class LoggerController : ControllerBase
    {
        private ILoggerService _loggerService;
        private IMapper _mapper;

        public LoggerController(ILoggerService loggerService, IMapper mapper)
        {
            _loggerService = loggerService;
            _mapper = mapper;
        }

        [HttpPost()]
        public IActionResult Log(LogInterfaceModel model)
        {
            try
            {
                LogInterface log = _mapper.Map<LogInterface>(model);
                log.additions = JsonSerializer.Serialize(model.additional);
                _loggerService.save(log);

            }
            catch (System.Exception ex)
            {
                Console.WriteLine(ex);
            }
            return Ok();
        }


    }
}