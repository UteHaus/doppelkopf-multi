using Microsoft.EntityFrameworkCore;
using DoppelkopfApi.Entities;
namespace DoppelkopfApi.Helpers
{
    public class DataContext : DbContext
    {


        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

        public DbSet<PlayTable> PlayTables { get; set; }

        public DbSet<TablePlayer> TablePlayer { get; set; }
    }
}