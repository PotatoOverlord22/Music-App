using AutoMapper;
using MM.BLL.Context;
using MM.BLL.Mappers;
using MM.DAL.Models;
using MM.Library.Constants;
using MM.Library.Models;

namespace MM.BLL
{
    public class UserBL : BLObject
    {
        #region Constructors
        public UserBL(BLContext blContext) : base(blContext) { }
        #endregion Constructors

        #region Methods
        public async Task SyncUserAsync(UserDTO userDTO)
        {
            User? user = await blContext.DalContext.UserDAL.GetByAuth0Id(userDTO.Auth0Id);
            User mappedUser = mapper.Map<User>(userDTO);

            if (user == null)
            {
                blContext.DalContext.UserDAL.Add(mappedUser);
                await blContext.GenrePresetBL.PopulateDefaultGenrePresets(mappedUser.Guid);
                blContext.Logger.Info($"User {userDTO.Name} added to the database.");
                return;
            }

            mappedUser.Guid = user.Guid;
            if (mappedUser != user)
            {
                blContext.DalContext.UserDAL.Update(mappedUser);
                blContext.Logger.Info($"User {userDTO.Name} updated in the database.");
            }
        }

        protected override void ConfigureMapper()
        {
            MapperConfiguration mapperConfig = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<UserMapperProfile>();
            });

            mapper = mapperConfig.CreateMapper();
        }
    }
    #endregion Methods
}
