using DoppelkopfApi.Entities;
using DoppelkopfApi.Helpers;

namespace DoppelkopfApi.Services
{

    public interface ILoggerService
    {
        void save(LogInterface log);
    }

    public class LoggerService : ILoggerService
    {

        private DataContext _context;
        public LoggerService(DataContext context)
        {
            _context = context;
        }
        public void save(LogInterface log)
        {
            _context.Add(log);
            _context.SaveChanges();
        }
    }
}