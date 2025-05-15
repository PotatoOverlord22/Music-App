using Microsoft.EntityFrameworkCore;
using MM.DAL.Models;

namespace MM.DAL.Context
{
    public class DatabaseContext : DbContext
    {
        #region Members
        private static readonly string connectionString = "data source=DESKTOP-CBK53R0\\SQLEXPRESS;initial catalog=MusicMania;trusted_connection=true;TrustServerCertificate=True";
        #endregion Members

        #region Properties
        public DbSet<User> Users { get; set; }
        #endregion Properties

        #region Constructors
        public DatabaseContext() : base() { }
        #endregion Constructors

        #region Methods
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(connectionString);
        }
        #endregion Methods
    }
}