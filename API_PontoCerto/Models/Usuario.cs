using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace API_PontoCerto.Models;

public partial class Usuario
{
    public int Id { get; set; }

    public string Nome { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Senha { get; set; } = null!;

    public string TipoUsuario { get; set; } = null!;

    [JsonIgnore]
    public virtual ICollection<PontoRegistro> PontoRegistros { get; set; } = new List<PontoRegistro>();
}
