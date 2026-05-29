using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using API_PontoCerto.Data;
using API_PontoCerto.Models;

namespace API_PontoCerto.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsuarioController : ControllerBase
    {
        private readonly PontoDbContext _context;

        public UsuarioController(PontoDbContext context)
        {
            _context = context;
        }

        // ================= LISTAR USUÁRIOS =================

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Usuario>>> GetUsuarios()
        {
            return await _context.Usuarios.ToListAsync();
        }

        // ================= CRIAR USUÁRIO =================

        [HttpPost]
        public async Task<ActionResult<Usuario>> CriarUsuario(Usuario usuario)
        {
            try
            {
                _context.Usuarios.Add(usuario);

                await _context.SaveChangesAsync();

                return Ok(usuario);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}