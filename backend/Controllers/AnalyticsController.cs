using CakeCatalogue.Api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CakeCatalogue.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AnalyticsController : ControllerBase
    {
        private readonly AppDbContext _db;
        public AnalyticsController(AppDbContext db) { _db = db; }

        [HttpGet("top-selling")]
        public async Task<ActionResult> GetTopSelling([FromQuery] int days = 30, [FromQuery] int top = 5)
        {
            var since = DateTime.UtcNow.AddDays(-days);
            var data = await _db.OrderItems
                .AsNoTracking()
                .Where(oi => oi.Order!.CreatedAt >= since)
                .GroupBy(oi => oi.CakeId)
                .Select(g => new {
                    CakeId = g.Key,
                    Quantity = g.Sum(x => x.Quantity),
                    Revenue = g.Sum(x => x.UnitPrice * x.Quantity)
                })
                .OrderByDescending(x => x.Quantity)
                .Take(top)
                .ToListAsync();

            // Join cake details
            var cakeIds = data.Select(d => d.CakeId).ToList();
            var cakes = await _db.Cakes.Where(c => cakeIds.Contains(c.Id)).ToDictionaryAsync(c => c.Id, c => c);

            return Ok(data.Select(d => new {
                d.CakeId,
                Name = cakes.TryGetValue(d.CakeId, out var cake) ? cake.Name : "Unknown",
                d.Quantity,
                d.Revenue
            }));
        }

        [HttpGet("sales-summary")]
        public async Task<ActionResult> GetSalesSummary([FromQuery] int days = 30)
        {
            var since = DateTime.UtcNow.AddDays(-days);
            var orders = await _db.Orders
                .AsNoTracking()
                .Include(o => o.Items)
                .Where(o => o.CreatedAt >= since)
                .ToListAsync();

            var totalOrders = orders.Count;
            var totalRevenue = orders.Sum(o => o.Items.Sum(i => i.UnitPrice * i.Quantity));
            var totalItems = orders.Sum(o => o.Items.Sum(i => i.Quantity));

            return Ok(new {
                TotalOrders = totalOrders,
                TotalRevenue = totalRevenue,
                TotalItems = totalItems,
                Since = since
            });
        }
    }
}
