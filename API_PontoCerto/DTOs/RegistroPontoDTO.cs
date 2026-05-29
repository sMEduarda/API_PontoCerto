namespace API_PontoCerto.DTOs
{
    public class RegistroPontoDTO
    {
        public int UsuarioId { get; set; }

        public string? TipoRegistro { get; set; }

        public double? Latitude { get; set; }

        public double? Longitude { get; set; }

        public string? Observacao { get; set; }
    }
}