namespace MM.Library.Models
{
    public class UserStatsDTO
    {
        #region Properties
        public Guid UserId { get; set; }

        public int TransformedWithContext { get; set; }

        public int TransformedWithoutContext { get; set; }
        #endregion Properties
    }
}