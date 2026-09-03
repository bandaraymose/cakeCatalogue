using CakeCatalogue.Api.Data;
using CakeCatalogue.Api.DTOs;
using CakeCatalogue.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace CakeCatalogue.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CakesController : ControllerBase
    {
        private readonly AppDbContext _db;
        public CakesController(AppDbContext db) { _db = db; }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CakeReadDto>>> GetAll()
        {
            var cakes = await _db.Cakes
                .AsNoTracking()
                .Include(c => c.Prices)
                .ToListAsync();
            var result = cakes.Select(c => new CakeReadDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                ImageUrl = c.ImageUrl,
                Sizes = c.Sizes,
                Flavors = c.Flavors,
                SizePrices = c.Prices?.Select(p => new SizePriceDto { Size = p.Size, Price = p.Price }).ToList() ?? new List<SizePriceDto>(),
                Rating = c.Rating,
                Reviews = c.Reviews
            }).ToList();
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<CakeReadDto>> GetById(int id)
        {
            var c = await _db.Cakes
                .Include(x => x.Prices)
                .FirstOrDefaultAsync(x => x.Id == id);
            if (c == null) return NotFound();
            return Ok(new CakeReadDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                ImageUrl = c.ImageUrl,
                Sizes = c.Sizes,
                Flavors = c.Flavors,
                SizePrices = c.Prices?.Select(p => new SizePriceDto { Size = p.Size, Price = p.Price }).ToList() ?? new List<SizePriceDto>(),
                Rating = c.Rating,
                Reviews = c.Reviews
            });
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<CakeReadDto>> Create([FromBody] CakeCreateDto dto)
        {
            var c = new Cake
            {
                Name = dto.Name,
                Description = dto.Description,
                ImageUrl = dto.ImageUrl,
                Sizes = dto.Sizes,
                Flavors = dto.Flavors,
                Rating = dto.Rating,
                Reviews = dto.Reviews
            };
            _db.Cakes.Add(c);
            await _db.SaveChangesAsync();

            // Save size prices if provided
            if (dto.SizePrices != null && dto.SizePrices.Count > 0)
            {
                var prices = dto.SizePrices
                    .Where(sp => !string.IsNullOrWhiteSpace(sp.Size))
                    .Select(sp => new CakePrice { CakeId = c.Id, Size = sp.Size.Trim(), Price = sp.Price })
                    .ToList();
                if (prices.Count > 0)
                {
                    _db.CakePrices.AddRange(prices);
                    await _db.SaveChangesAsync();
                }
            }

            return CreatedAtAction(nameof(GetById), new { id = c.Id }, new CakeReadDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                ImageUrl = c.ImageUrl,
                Sizes = c.Sizes,
                Flavors = c.Flavors,
                SizePrices = await _db.CakePrices.Where(p => p.CakeId == c.Id)
                    .Select(p => new SizePriceDto { Size = p.Size, Price = p.Price }).ToListAsync(),
                Rating = c.Rating,
                Reviews = c.Reviews
            });
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] CakeCreateDto dto)
        {
            var c = await _db.Cakes.Include(x => x.Prices).FirstOrDefaultAsync(x => x.Id == id);
            if (c == null) return NotFound();
            c.Name = dto.Name;
            c.Description = dto.Description;
            c.ImageUrl = dto.ImageUrl;
            c.Sizes = dto.Sizes;
            c.Flavors = dto.Flavors;
            c.Rating = dto.Rating;
            c.Reviews = dto.Reviews;

            // Replace size prices
            var existing = await _db.CakePrices.Where(p => p.CakeId == id).ToListAsync();
            if (existing.Count > 0)
            {
                _db.CakePrices.RemoveRange(existing);
            }
            if (dto.SizePrices != null && dto.SizePrices.Count > 0)
            {
                var prices = dto.SizePrices
                    .Where(sp => !string.IsNullOrWhiteSpace(sp.Size))
                    .Select(sp => new CakePrice { CakeId = id, Size = sp.Size.Trim(), Price = sp.Price })
                    .ToList();
                if (prices.Count > 0)
                {
                    _db.CakePrices.AddRange(prices);
                }
            }
            await _db.SaveChangesAsync();
            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var c = await _db.Cakes.FindAsync(id);
            if (c == null) return NotFound();
            _db.Cakes.Remove(c);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
