using CakeCatalogue.Api.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;

namespace CakeCatalogue.Api.Data
{
    // Ensures EF Tools can create the DbContext without running the web host
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
    {
        public AppDbContext CreateDbContext(string[] args)
        {
            var basePath = Directory.GetCurrentDirectory();
            var builder = new ConfigurationBuilder()
                .SetBasePath(basePath)
                .AddJsonFile("appsettings.json", optional: false)
                .AddJsonFile("appsettings.Development.json", optional: true)
                .AddEnvironmentVariables();

            var configuration = builder.Build();
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
            optionsBuilder.UseMySql(
                connectionString!,
                new MariaDbServerVersion(new Version(10, 4, 0)),
                mySqlOptions => mySqlOptions.MigrationsHistoryTable("__efmigrationshistory_app")
            );

            return new AppDbContext(optionsBuilder.Options);
        }
    }
}
