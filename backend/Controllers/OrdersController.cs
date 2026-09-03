using CakeCatalogue.Api.Data;
using CakeCatalogue.Api.DTOs;
using CakeCatalogue.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CakeCatalogue.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _db;
        public OrdersController(AppDbContext db) { _db = db; }

        // Create order (public)
        [HttpPost]
        public async Task<ActionResult> Create([FromBody] CreateOrderDto dto)
        {
            if (dto.Items == null || dto.Items.Count == 0)
                return BadRequest("Order must have items");

            var order = new Order
            {
                CustomerName = dto.CustomerName,
                Phone = dto.Phone,
                CreatedAt = DateTime.UtcNow,
                Items = dto.Items.Select(i => new OrderItem
                {
                    CakeId = i.CakeId,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice
                }).ToList()
            };

            _db.Orders.Add(order);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = order.Id }, new { order.Id });
        }

        // Admin endpoints
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult> GetAll()
        {
            var orders = await _db.Orders
                .AsNoTracking()
                .Include(o => o.Items)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
            return Ok(orders.Select(o => new {
                o.Id,
                o.CustomerName,
                o.Phone,
                o.CreatedAt,
                Items = o.Items.Select(i => new { i.CakeId, i.Quantity, i.UnitPrice }),
                TotalAmount = o.Items.Sum(i => i.UnitPrice * i.Quantity)
            }));
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("{id:int}")]
        public async Task<ActionResult> GetById(int id)
        {
            var o = await _db.Orders.Include(x => x.Items).FirstOrDefaultAsync(x => x.Id == id);
            if (o == null) return NotFound();
            return Ok(new {
                o.Id,
                o.CustomerName,
                o.Phone,
                o.CreatedAt,
                Items = o.Items.Select(i => new { i.CakeId, i.Quantity, i.UnitPrice }),
                TotalAmount = o.Items.Sum(i => i.UnitPrice * i.Quantity)
            });
        }
    }
}
