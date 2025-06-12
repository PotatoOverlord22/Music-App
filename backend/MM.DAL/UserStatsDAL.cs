using Microsoft.EntityFrameworkCore;
using MM.DAL.Context;
using MM.DAL.Models;

namespace MM.DAL
{
    public class UserStatsDAL : DALObject
    {
        #region Constructor
        public UserStatsDAL(DatabaseContext dbContext) : base(dbContext)
        {
        }
        #endregion Constructor

        #region Methods
        public async Task<UserStats?> GetByGuid(Guid userGuid)
        {
            return await databaseContext.UserStats.FirstOrDefaultAsync(us => us.UserGuid == userGuid);
        }

        public async Task<UserStats?> GetByUserGuid(Guid userGuid)
        {
            return await databaseContext.UserStats.FirstOrDefaultAsync(us => us.UserGuid == userGuid);
        }

        public void AddOrUpdate(UserStats userStats)
        {
            UserStats? existingUserStats = databaseContext.UserStats.FirstOrDefault(us => us.Guid == userStats.Guid);
            if (existingUserStats == null)
            {
                databaseContext.UserStats.Add(userStats);
                databaseContext.SaveChanges();
                return;
            }

            existingUserStats.TransformedSongs = userStats.TransformedSongs;
            existingUserStats.TransformedSongsWithContext = userStats.TransformedSongsWithContext;

            databaseContext.SaveChanges();
        }

        public void UpdateTracked(UserStats userStats)
        {
            databaseContext.UserStats.Update(userStats);
            databaseContext.SaveChanges();
        }

        public void Add(UserStats userStats)
        {
            databaseContext.UserStats.Add(userStats);
            databaseContext.SaveChanges();
        }
        #endregion Methods
    }
}