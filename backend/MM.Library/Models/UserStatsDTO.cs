namespace MM.Library.Models
{
    public class UserStatsDTO
    {
        #region Properties
        public Guid UserId { get; set; }

        public int TransformedSongs { get; set; }

        public int TransformedSongsWithContext { get; set; }
        #endregion Properties
    }
}