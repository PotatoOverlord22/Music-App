using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MM.DAL.Models
{
    public class GenrePreset
    {
        [Key]
        public Guid Guid { get; set; }

        [Required]
        [MaxLength(100)]
        public string GenreName { get; set; }

        public Guid UserGuid { get; set; }

        [ForeignKey(nameof(UserGuid))]
        public User User { get; set; }

        public List<GenrePresetValue> Values { get; set; } = new List<GenrePresetValue>();
    }
}