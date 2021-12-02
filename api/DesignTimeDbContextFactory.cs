using System;
using System.IO;
using DoppelkopfApi.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore.Design;
using api.Database;

public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<DataContext>
{
    public DataContext CreateDbContext(string[] args)
    {

        IConfigurationRoot configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json")
            .AddEnvironmentVariables()
            .Build();
        var builder = new DbContextOptionsBuilder<DataContext>();
        var connectionString = NpgsqlUtil.buildConnectionString(configuration);
        Console.WriteLine(connectionString);
        builder.UseNpgsql(connectionString);

        return new DataContext(builder.Options);
    }
}