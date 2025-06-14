using AutoMapper;
using MM.BLL.Context;
using MM.BLL.Mappers;
using MM.DAL.Models;
using MM.Library.Constants;
using MM.Library.Models;

namespace MM.BLL
{
    public class GenrePresetBL : BLObject
    {
        #region Constructor
        public GenrePresetBL(BLContext blContext) : base(blContext) { }
        #endregion Constructor

        public async Task<List<GenrePresetDTO>> GetPresetsForCurrentUser()
        {
            string? auth0Id = GetCurrentUserAuth0Id();
            if (string.IsNullOrEmpty(auth0Id))
            {
                LogAndThrowError(new UnauthorizedAccessException(), "User is not authenticated.");
            }

            try
            {
                User? user = await blContext.DalContext.UserDAL.GetByAuth0Id(auth0Id!);
                List<GenrePreset> presets = await blContext.DalContext.GenrePresetDAL.GetGenrePresetsForUser(user);
                return mapper.Map<List<GenrePresetDTO>>(presets);
            }
            catch (Exception ex)
            {
                LogAndThrowError(ex, "Failed to retrieve genre presets for the current user.");
                return null;
            }
        }

        public async Task UpdatePresetsForCurrentUser(List<GenrePresetDTO> genrePresets)
        {
            if (genrePresets == null || !genrePresets.Any())
            {
                LogAndThrowValidationException("Genre presets cannot be null or empty.");
            }

            string? auth0Id = GetCurrentUserAuth0Id();
            if (string.IsNullOrEmpty(auth0Id))
            {
                LogAndThrowError(new UnauthorizedAccessException(), "User is not authenticated.");
            }

            User? user = await blContext.DalContext.UserDAL.GetByAuth0Id(auth0Id!);

            List<GenrePreset> newPresets = new List<GenrePreset>();
            try
            {
                newPresets = mapper.Map<List<GenrePreset>>(genrePresets);
                foreach (GenrePreset preset in newPresets)
                {
                    preset.User = user;
                    preset.UserGuid = user.Guid;
                }
            }
            catch (Exception ex)
            {
                LogAndThrowError(ex, "Failed to map genre presets.");
            }


            List<GenrePreset> existingPresets = new List<GenrePreset>();
            try
            {
                existingPresets = await blContext.DalContext.GenrePresetDAL.GetGenrePresetsForUser(user);
            }
            catch (Exception ex)
            {
                LogAndThrowError(ex, "Failed to retrieve existing genre presets for the user.");
            }

            if (existingPresets == null || !existingPresets.Any())
            {
                await blContext.DalContext.GenrePresetDAL.BulkAdd(newPresets);
                return;
            }

            await blContext.DalContext.GenrePresetDAL.UpdatePresetsForUser(user, newPresets);
        }

        public async Task PopulateDefaultGenrePresets(Guid userGuid)
        {
            foreach (var genre in DefaultGenrePresets.Presets)
            {
                GenrePreset newGenrePreset = new GenrePreset
                {
                    UserGuid = userGuid,
                    GenreName = genre.Key
                };

                await blContext.DalContext.GenrePresetDAL.Add(newGenrePreset);

                List<GenrePresetValue> values = new List<GenrePresetValue>();
                for (int i = 0; i < genre.Value.Length; i++)
                {
                    GenrePresetValue presetValue = new GenrePresetValue
                    {
                        GenrePresetGuid = newGenrePreset.Guid,
                        BandIndex = i,
                        Gain = genre.Value[i]
                    };

                    values.Add(presetValue);
                }

                await blContext.DalContext.GenrePresetValueDAL.AddBulk(values);
            }
        }

        protected override void ConfigureMapper()
        {
            MapperConfiguration mapperConfig = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<GenrePresetMapperProfile>();
            });

            mapper = mapperConfig.CreateMapper();
        }
    }
}