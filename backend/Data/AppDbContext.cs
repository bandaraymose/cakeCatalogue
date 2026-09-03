using CakeCatalogue.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CakeCatalogue.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

        public DbSet<Cake> Cakes => Set<Cake>();
        public DbSet<Order> Orders => Set<Order>();
        public DbSet<OrderItem> OrderItems => Set<OrderItem>();
        public DbSet<AdminUser> AdminUsers => Set<AdminUser>();
        public DbSet<CakePrice> CakePrices => Set<CakePrice>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Cake>(e =>
            {
                e.Property(p => p.Name).IsRequired().HasMaxLength(200);
                e.Property(p => p.Description).HasMaxLength(1000);
                e.Property(p => p.ImageUrl).HasMaxLength(1000);
                e.Property(p => p.SizesCsv).HasMaxLength(400);
                e.Property(p => p.FlavorsCsv).HasMaxLength(400);
                e.HasMany<CakePrice>()
                    .WithOne(cp => cp.Cake!)
                    .HasForeignKey(cp => cp.CakeId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Order>(e =>
            {
                e.Property(p => p.CustomerName).HasMaxLength(200);
                e.Property(p => p.Phone).HasMaxLength(50);
                e.HasMany(o => o.Items)
                    .WithOne(i => i.Order!)
                    .HasForeignKey(i => i.OrderId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<OrderItem>(e =>
            {
                e.Property(p => p.UnitPrice).HasColumnType("decimal(10,2)");
            });

            modelBuilder.Entity<AdminUser>(e =>
            {
                e.HasIndex(u => u.Username).IsUnique();
                e.Property(p => p.Username).HasMaxLength(100);
            });

            modelBuilder.Entity<CakePrice>(e =>
            {
                e.Property(p => p.Size).HasMaxLength(50);
                e.Property(p => p.Price).HasColumnType("decimal(10,2)");
                e.HasIndex(p => new { p.CakeId, p.Size }).IsUnique();
            });
        }
    }
}
