using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace MM.DAL.Models
{
    [Index(nameof(Auth0Id), IsUnique = true)]
    public class User
    {
        #region Properties
        [Key]
        public Guid Guid { get; set; }

        public string Auth0Id { get; set; }

        public string? Email { get; set; }

        public string? Name { get; set; }

        public string? Picture { get; set; }

        public ICollection<GenrePreset> GenrePresets { get; set; } = new List<GenrePreset>();
        #endregion Properties

        #region Methods
        public override bool Equals(object? obj)
        {
            if (obj is not User other)
            {
                return false;
            }

            return Guid == other.Guid &&
                   Auth0Id == other.Auth0Id &&
                   Email == other.Email &&
                   Name == other.Name &&
                   Picture == other.Picture;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Guid, Auth0Id, Email, Name, Picture);
        }

        public static bool operator ==(User? left, User? right) => Equals(left, right);

        public static bool operator !=(User? left, User? right) => !Equals(left, right);
        #endregion Methods
    }
}