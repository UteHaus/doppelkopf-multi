using System;
namespace DoppelkopfApi.Entities
{
    public class LogInterface
    {
        public LogLevel Level { get; set; }
        public DateTime timestamp { get; set; }
        public String fileName { get; set; }
        public String lineNumber { get; set; }
        public String message { get; set; }

        public String additions { get; set; }
    }


    public enum LogLevel
    {
        TRACE = 0,
        DEBUG = 1,
        INFO = 2,
        LOG = 3,
        WARN = 4,
        ERROR = 5,
        FATAL = 6,
        OFF = 7
    }
}