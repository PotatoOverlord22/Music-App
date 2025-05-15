namespace MM.Library.Models
{
    public class UserDTO
    {
        #region Properties
        public string Auth0Id { get; set; }

        public string? Email { get; set; }

        public string? Name { get; set; }

        public string? Picture { get; set; }
        #endregion Properties
    }
}