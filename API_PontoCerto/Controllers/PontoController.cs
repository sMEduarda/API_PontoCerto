using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API_PontoCerto.Data;
using API_PontoCerto.Models;
using API_PontoCerto.DTOs;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace API_PontoCerto.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PontoController : ControllerBase
    {
        private readonly PontoDbContext _context;

        public PontoController(PontoDbContext context)
        {
            _context = context;
        }

        // ================= GET =================

        [HttpGet]
        public async Task<ActionResult> GetRegistros(
            [FromQuery] string? dataInicio,
            [FromQuery] string? dataFim
        )
        {
            // ID DO USUÁRIO LOGADO
            var usuarioId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)?.Value
            );

            // TIPO DO USUÁRIO
            var tipoUsuario = User.FindFirst(ClaimTypes.Role)?.Value;

            var query = _context.PontoRegistros
                .Include(p => p.Usuario)
                .AsQueryable();

            // SE NÃO FOR ADM -> MOSTRA APENAS OS PRÓPRIOS REGISTROS
            if (tipoUsuario != "ADM")
            {
                query = query.Where(p => p.UsuarioId == usuarioId);
            }

            // FILTRO DATA INÍCIO
            if (!string.IsNullOrEmpty(dataInicio))
            {
                var inicio = DateTime.Parse(dataInicio);
                query = query.Where(p => p.Horario >= inicio);
            }

            // FILTRO DATA FIM
            if (!string.IsNullOrEmpty(dataFim))
            {
                var fim = DateTime.Parse(dataFim).AddDays(1);
                query = query.Where(p => p.Horario < fim);
            }

            var registros = await query
                .OrderByDescending(p => p.Horario)
                .Select(p => new
                {
                    p.Id,
                    p.UsuarioId,
                    Usuario = p.Usuario.Nome,
                    p.TipoRegistro,
                    p.Horario,
                    p.Latitude,
                    p.Longitude,
                    p.Observacao
                })
                .ToListAsync();

            return Ok(registros);
        }

        // ================= POST =================

        [HttpPost]
        public async Task<ActionResult> RegistrarPonto(
            RegistroPontoDTO dto
        )
        {
            try
            {
                // PEGA USUÁRIO DO TOKEN
                var usuarioId = int.Parse(
                    User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                );

                var ponto = new PontoRegistro
                {
                    UsuarioId = usuarioId,
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