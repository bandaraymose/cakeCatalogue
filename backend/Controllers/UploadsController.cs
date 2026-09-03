using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;

namespace CakeCatalogue.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class UploadsController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;
        public UploadsController(IWebHostEnvironment env) { _env = env; }

        [HttpPost]
        [RequestSizeLimit(20_000_000)] // ~20 MB
        public async Task<IActionResult> Upload([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file provided");

            var allowed = new[] { "image/jpeg", "image/png", "image/webp", "image/gif" };
            if (!allowed.Contains(file.ContentType))
                return BadRequest("Unsupported file type. Use JPG/PNG/WEBP/GIF");

            var uploadsRoot = Path.Combine(_env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot"), "uploads");
            Directory.CreateDirectory(uploadsRoot);

            var ext = Path.GetExtension(file.FileName);
            var fileName = $"{Guid.NewGuid():N}{ext}";
            var fullPath = Path.Combine(uploadsRoot, fileName);
            await using (var stream = System.IO.File.Create(fullPath))
            {
                await file.CopyToAsync(stream);
            }

            var relativeUrl = $"/uploads/{fileName}";
            var absoluteUrl = $"{Request.Scheme}://{Request.Host}{relativeUrl}";
            return Ok(new { url = relativeUrl, absoluteUrl });
        }
    }
}
