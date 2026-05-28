using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace API_PontoCerto.Models;

public partial class PontoRegistro
{
    public int Id { get; set; }

    public int UsuarioId { get; set; }

    public string? TipoRegistro { get; set; }

    public DateTime? Horario { get; set; }

    public double? Latitude { get; set; }

    public double? Longitude { get; set; }

    public string? Observacao { get; set; }

    [JsonIgnore]
    public virtual Usuario Usuario { get; set; } = null!;
}
