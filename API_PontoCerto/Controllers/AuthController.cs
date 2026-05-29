using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using API_PontoCerto.Data;
using API_PontoCerto.DTOs;

namespace API_PontoCerto.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly PontoDbContext _context;

        public AuthController(PontoDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDTO loginDTO)
        {
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u =>
                    u.Email == loginDTO.Email &&
                    u.Senha == loginDTO.Senha);

            if (usuario == null)
            {
                return Unauthorized(new
                {
                    mensagem = "Usuário ou senha inválidos"
                });
            }

            // CHAVE JWT
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes("PontoCertoAPI_ChaveJWT_MuitoSegura_2026_123456789"));

            // CREDENCIAIS
            var credentials = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256);

            // CLAIMS
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                new Claim(ClaimTypes.Name, usuario.Nome),
                new Claim(ClaimTypes.Email, usuario.Email)
            };

            // TOKEN
            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddHours(2),
                signingCredentials: credentials
            );

            // GERAR TOKEN STRING
            var tokenString = new JwtSecurityTokenHandler()
                .WriteToken(token);

            // RETORNO
            return Ok(new
            {
                token = tokenString,
                usuario = usuario.Nome
            });
        }
    }
}
