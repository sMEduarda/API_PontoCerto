using System;
using System.Collections.Generic;
using API_PontoCerto.Models;
using Microsoft.EntityFrameworkCore;

namespace API_PontoCerto.Data;

public partial class PontoDbContext : DbContext
{
    public PontoDbContext()
    {
    }

    public PontoDbContext(DbContextOptions<PontoDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<PontoRegistro> PontoRegistros { get; set; }

    public virtual DbSet<Usuario> Usuarios { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<PontoRegistro>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__PontoReg__3214EC0712C2CFA4");

            entity.Property(e => e.Horario).HasColumnType("datetime");

            entity.Property(e => e.Observacao)
                .HasMaxLength(255);

            entity.Property(e => e.TipoRegistro)
                .HasMaxLength(20);

            entity.HasOne(d => d.Usuario)
                .WithMany(p => p.PontoRegistros)
                .HasForeignKey(d => d.UsuarioId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__PontoRegi__Usuar__5FB337D6");
        });

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.HasKey(e => e.Id)
                .HasName("PK__Usuarios__3214EC0763788DEC");

            entity.HasIndex(e => e.Email)
                .IsUnique();

            entity.Property(e => e.Email)
                .HasMaxLength(100);

            entity.Property(e => e.Nome)
                .HasMaxLength(100);

            entity.Property(e => e.Senha)
                .HasMaxLength(100);

            entity.Property(e => e.TipoUsuario)
                .HasMaxLength(20);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}