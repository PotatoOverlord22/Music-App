using AutoMapper;
using MM.BLL.Context;
using MM.BLL.Mappers;
using MM.DAL.Models;
using MM.Library.Models;
using System.Security.Claims;

namespace MM.BLL
{
    public class UserStatsBL : BLObject
    {
        #region Constructors
        public UserStatsBL(BLContext bLContext) : base(bLContext) { }
        #endregion Constructors

        #region Methods
        public async Task<UserStatsDTO> GetUserStats()
        {
            var (_, stats) = await GetCurrentUserAndStatsAsync();

            UserStatsDTO userStatsDTO;
            try
            {
                userStatsDTO = mapper.Map<UserStatsDTO>(stats);
            }
            catch (Exception ex)
            {
                LogAndThrowError(ex, ex.Message, "Error mapping User to UserDTO");
                return null;
            }

            return userStatsDTO;
        }

        public async Task IncrementCurrentUserTransformSongStats(bool withContext = false)
        {
            var (user, stats) = await GetCurrentUserAndStatsAsync();
            if (withContext)
            {
                stats.TransformedSongsWithContext++;
            }
            else
            {
                stats.TransformedSongs++;
            }

            if (stats.Guid == default)
            {
                blContext.DalContext.UserStatsDAL.Add(stats);
            }
            else
            {
                blContext.DalContext.UserStatsDAL.UpdateTracked(stats);
            }
        }

        protected override void ConfigureMapper()
        {
            MapperConfiguration mapperConfig = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<UserStatsMapperProfile>();
            });

            mapper = mapperConfig.CreateMapper();
        }

        private async Task<(User user, UserStats stats)> GetCurrentUserAndStatsAsync()
        {
            string auth0Id = blContext.HttpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new Exception("User is not authenticated");
            User user = await blContext.DalContext.UserDAL.GetByAuth0Id(auth0Id) ?? throw new Exception($"User with Auth0 ID {auth0Id} not found in the database.");
            UserStats stats = await blContext.DalContext.UserStatsDAL.GetByUserGuid(user.Guid)
                ?? new UserStats
                {
                    UserGuid = user.Guid,
                    User = user,
                    TransformedSongsWithContext = 0,
                    TransformedSongs = 0
                };

                return (user, stats);
        }
        #endregion Methods
    }
}