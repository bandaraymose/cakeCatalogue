using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace CakeCatalogue.Api.Services
{
    public interface IJwtTokenService
    {
        string GenerateToken(string adminUserId, string username);
    }

    public class JwtTokenService : IJwtTokenService
    {
        private readonly IConfiguration _config;
        public JwtTokenService(IConfiguration config) { _config = config; }

        public string GenerateToken(string adminUserId, string username)
        {
            var key = _config["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured");
            var issuer = _config["Jwt:Issuer"] ?? "cakecatalogue";
            var audience = _config["Jwt:Audience"] ?? "cakecatalogue";

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, adminUserId),
                new Claim(JwtRegisteredClaimNames.UniqueName, username),
                new Claim(ClaimTypes.Role, "Admin")
            };

            var creds = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)), SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(8),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
