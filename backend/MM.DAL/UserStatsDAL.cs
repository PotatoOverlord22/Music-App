using Microsoft.EntityFrameworkCore;
using MM.DAL.Context;
using MM.DAL.Models;

namespace MM.DAL
{
    public class UserStatsDAL : DALObject
    {
        #region Constructor
        public UserStatsDAL(DALContext dalContext) : base(dalContext){ }
        #endregion Constructor

        #region Methods
        public async Task<UserStats?> GetByGuid(Guid userGuid)
        {
            return await dalContext.DatabaseContext.UserStats.FirstOrDefaultAsync(us => us.UserGuid == userGuid);
        }

        public async Task<UserStats?> GetByUserGuid(Guid userGuid)
        {
            return await dalContext.DatabaseContext.UserStats.FirstOrDefaultAsync(us => us.UserGuid == userGuid);
        }

        public void AddOrUpdate(UserStats userStats)
        {
            UserStats? existingUserStats = dalContext.DatabaseContext.UserStats.FirstOrDefault(us => us.Guid == userStats.Guid);
            if (existingUserStats == null)
            {
                dalContext.DatabaseContext.UserStats.Add(userStats);
                dalContext.DatabaseContext.SaveChanges();
                return;
            }

            existingUserStats.TransformedSongs = userStats.TransformedSongs;
            existingUserStats.TransformedSongsWithContext = userStats.TransformedSongsWithContext;

            dalContext.DatabaseContext.SaveChanges();
        }

        public void UpdateTracked(UserStats userStats)
        {
            dalContext.DatabaseContext.UserStats.Update(userStats);
            dalContext.DatabaseContext.SaveChanges();
        }

        public void Add(UserStats userStats)
        {
            dalContext.DatabaseContext.UserStats.Add(userStats);
            dalContext.DatabaseContext.SaveChanges();
        }
        #endregion Methods
    }
}