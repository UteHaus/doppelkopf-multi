using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace DoppelkopfApi.Helpers
{
    public class SqliteDataContext : DataContext
    {
        public SqliteDataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }

    }
}