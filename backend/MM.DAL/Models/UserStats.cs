using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MM.DAL.Models
{
    public class UserStats
    {
        #region Properties
        [Key]
        public Guid Guid { get; set; }

        public Guid UserGuid { get; set; }

        [ForeignKey("UserGuid")]
        public User User { get; set; }

        public int TransformedSongs { get; set; }

        public int TransformedSongsWithContext { get; set; }
        #endregion Properties
    }
}