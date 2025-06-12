using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MM.DAL.Models
{
    public class GenrePresetValue
    {
        [Key]
        public Guid Guid { get; set; }

        [Required]
        public int BandIndex { get; set; }

        [Required]
        public float Gain { get; set; }

        public Guid GenrePresetGuid { get; set; }

        [ForeignKey(nameof(GenrePresetGuid))]
        public GenrePreset GenrePreset { get; set; }
    }
}