using BCrypt.Net;
using CakeCatalogue.Api.Data;
using CakeCatalogue.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CakeCatalogue.Api.Infrastructure
{
    public static class DataSeeder
    {
        public static async Task SeedAsync(AppDbContext db)
        {
            await db.Database.EnsureCreatedAsync();

            if (!await db.AdminUsers.AnyAsync())
            {
                var admin = new AdminUser
                {
                    Username = "admin",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123")
                };
                db.AdminUsers.Add(admin);
            }

            if (!await db.Cakes.AnyAsync())
            {
                var choco = new Cake
                {
                    Name = "Chocolate Delight",
                    Description = "Rich chocolate cake with ganache frosting and chocolate shavings",
                    ImageUrl = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
                    Sizes = new() { "Small", "Medium", "Large" },
                    Flavors = new() { "Chocolate" },
                    Rating = 4.8,
                    Reviews = 24
                };
                var vanilla = new Cake
                {
                    Name = "Vanilla Dream",
                    Description = "Soft vanilla sponge with buttercream and fresh berries",
                    ImageUrl = "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=300&fit=crop",
                    Sizes = new() { "Small", "Medium", "Large" },
                    Flavors = new() { "Vanilla" },
                    Rating = 4.6,
                    Reviews = 18
                };
                db.Cakes.AddRange(choco, vanilla);
                await db.SaveChangesAsync();

                db.CakePrices.AddRange(
                    new CakePrice { CakeId = choco.Id, Size = "Small", Price = 220m },
                    new CakePrice { CakeId = choco.Id, Size = "Medium", Price = 250m },
                    new CakePrice { CakeId = choco.Id, Size = "Large", Price = 300m },
                    new CakePrice { CakeId = vanilla.Id, Size = "Small", Price = 180m },
                    new CakePrice { CakeId = vanilla.Id, Size = "Medium", Price = 200m },
                    new CakePrice { CakeId = vanilla.Id, Size = "Large", Price = 240m }
                );
            }

            await db.SaveChangesAsync();
        }
    }
}
