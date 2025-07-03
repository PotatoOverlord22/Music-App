using Microsoft.EntityFrameworkCore;
using MM.DAL.Models;

namespace MM.DAL.Context
{
    public class DatabaseContext : DbContext
    {
        #region Members
        private static readonly string connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING") ?? "data source=DESKTOP-CBK53R0\\SQLEXPRESS;initial catalog=MusicMania;trusted_connection=true;TrustServerCertificate=True";
        #endregion Members

        #region Properties
        public DbSet<User> Users { get; set; }

        public DbSet<UserStats> UserStats { get; set; }

        public DbSet<GenrePreset> GenrePresets { get; set; }

        public DbSet<GenrePresetValue> GenrePresetValues { get; set; }
        #endregion Properties

        #region Constructors
        public DatabaseContext() : base() { }
        #endregion Constructors

        #region Methods
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(connectionString, sqlOptions =>
            {
                sqlOptions.EnableRetryOnFailure(
                    maxRetryCount: 5,
                    maxRetryDelay: TimeSpan.FromSeconds(15),
                    errorNumbersToAdd: null
                    );
            });
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserStats>()
                .Property(us => us.TransformedSongs)
                .HasDefaultValue(0);

            modelBuilder.Entity<UserStats>()
                .Property(us => us.TransformedSongsWithContext)
                .HasDefaultValue(0);

            modelBuilder.Entity<User>()
                .HasMany(us => us.GenrePresets)
                .WithOne(gp => gp.User)
                .HasForeignKey(gp => gp.UserGuid)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<GenrePreset>()
                .HasMany(gp => gp.Values)
                .WithOne(gpv => gpv.GenrePreset)
                .HasForeignKey(gpv => gpv.GenrePresetGuid)
                .OnDelete(DeleteBehavior.Cascade);
        }
        #endregion Methods
    }
}