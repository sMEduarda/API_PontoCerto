using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API_PontoCerto.Data;
using API_PontoCerto.Models;
using API_PontoCerto.DTOs;

namespace API_PontoCerto.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PontoController : ControllerBase
    {
        private readonly PontoDbContext _context;

        public PontoController(PontoDbContext context)
        {
            _context = context;
        }

        // GET: api/ponto
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PontoRegistro>>> GetRegistros()
        {
            return await _context.PontoRegistros.ToListAsync();
        }

        // POST: api/ponto
        [HttpPost]
        public async Task<ActionResult> RegistrarPonto(RegistroPontoDTO dto)
        {
            try
            {
                var ponto = new PontoRegistro
                {
                    UsuarioId = dto.UsuarioId,
                    TipoRegistro = dto.TipoRegistro,
                    Latitude = dto.Latitude,
                    Longitude = dto.Longitude,
                    Observacao = dto.Observacao,
                    Horario = DateTime.Now
                };

                _context.PontoRegistros.Add(ponto);

                await _context.SaveChangesAsync();

                return Ok(ponto);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}

