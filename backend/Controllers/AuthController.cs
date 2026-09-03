using BCrypt.Net;
using CakeCatalogue.Api.Data;
using CakeCatalogue.Api.DTOs;
using CakeCatalogue.Api.Models;
using CakeCatalogue.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CakeCatalogue.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IJwtTokenService _jwt;
        public AuthController(AppDbContext db, IJwtTokenService jwt)
        {
            _db = db; _jwt = jwt;
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
        {
            var user = await _db.AdminUsers.FirstOrDefaultAsync(u => u.Username == request.Username);
            if (user == null) return Unauthorized("Invalid credentials");

            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                return Unauthorized("Invalid credentials");

            var token = _jwt.GenerateToken(user.Id.ToString(), user.Username);
            return Ok(new LoginResponse { Token = token, Username = user.Username });
        }
    }
}
