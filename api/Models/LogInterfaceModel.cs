using System;
using DoppelkopfApi.Entities;

namespace DoppelkopfApi.Models
{
    public class LogInterfaceModel
    {
        public LogLevel Level { get; set; }
        public DateTime timestamp { get; set; }
        public String fileName { get; set; }
        public String lineNumber { get; set; }
        public String message { get; set; }

        public object[] additional { get; set; }
    }
}