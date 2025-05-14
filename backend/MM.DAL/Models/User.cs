namespace MM.DAL.Models
{
    public class User
    {
        #region Properties
        public int Id { get; set; }

        public string Auth0Id { get; set; }

        public string Email { get; set; }

        public string Name { get; set; }

        public string? Password { get; set; }

        public string? Picture { get; set; }
        #endregion Properties
    }
}