using Microsoft.EntityFrameworkCore;
using MM.DAL.Context;
using MM.DAL.Models;

namespace MM.DAL
{
    public class UserDAL : DALObject
    {
        #region Constructors
        public UserDAL(DatabaseContext dbContext) : base(dbContext) { }
        #endregion Constructors

        #region Methods
        public async Task<User?> GetByAuth0Id(string auth0Id)
        {
            return await databaseContext.Users.FirstOrDefaultAsync(u => u.Auth0Id == auth0Id);
        }

        public async Task<bool> ExistsByAuth0Id(string auth0Id)
        {
            return await databaseContext.Users.AnyAsync(u => u.Auth0Id == auth0Id);
        }

        public void Add(User user)
        {
            databaseContext.Users.Add(user);
            databaseContext.SaveChanges();
        }

        public void Update(User user)
        {
            User? existingUser = databaseContext.Users.FirstOrDefault(u => u.Guid == user.Guid);
            if (existingUser == null)
            {
                throw new Exception($"The user with uid: {user.Guid} was not found");
            }

            existingUser.Auth0Id = user.Auth0Id;
            existingUser.Email = user.Email;
            existingUser.Name = user.Name;
            existingUser.Picture = user.Picture;

            databaseContext.SaveChanges();
        }
        #endregion Methods
    }
}