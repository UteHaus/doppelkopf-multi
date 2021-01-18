using DoppelkopfApi.Entities;


namespace DoppelkopfApi.Services
{

    public interface ILoggerService
    {
        void save(LogInterface log);
    }

    public class LoggerService : ILoggerService
    {
        public void save(LogInterface log)
        {

        }
    }
}