using System;
using Microsoft.Extensions.Configuration;

namespace api.Database
{
    public static class NpgsqlUtil
    {
        public static string buildConnectionString(IConfiguration configuration)
        {
            var user = Environment.GetEnvironmentVariable("POSTGRES_USER") ?? configuration.GetValue<string>("POSTGRES_USER");
            var password = Environment.GetEnvironmentVariable("POSTGRES_PASSWORD") ?? configuration.GetValue<string>("POSTGRES_PASSWORD");
            var database = Environment.GetEnvironmentVariable("POSTGRES_DB") ?? configuration.GetValue<string>("POSTGRES_DB");
            var host = Environment.GetEnvironmentVariable("POSTGRES_HOST") ?? configuration.GetValue<string>("POSTGRES_HOST");
            return $"server= {host ?? "localhost" };user id={user ?? "doppelkopf"};password={password ?? "doppelkopf"};database={database ?? "play-multi"}";
        }
    }
}