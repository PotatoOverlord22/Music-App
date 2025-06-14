using Microsoft.EntityFrameworkCore;
using MM.DAL.Context;
using MM.DAL.Models;

namespace MM.DAL
{
    public class GenrePresetDAL : DALObject
    {
        #region Constructors
        public GenrePresetDAL(DALContext dalContext) : base(dalContext) { }
        #endregion Constructors

        #region Methods
        public async Task<GenrePreset> Add(GenrePreset genrePreset)
        {
            dalContext.DatabaseContext.GenrePresets.Add(genrePreset);
            await dalContext.DatabaseContext.SaveChangesAsync();
            return genrePreset;
        }

        public async Task BulkAdd(List<GenrePreset> newPresets)
        {
            if (newPresets == null || !newPresets.Any())
            {
                return;
            }

            dalContext.DatabaseContext.GenrePresets.AddRange(newPresets);
            await dalContext.DatabaseContext.SaveChangesAsync();
        }

        public async Task<List<GenrePreset>> GetGenrePresetsForUser(User user)
        {
            return await dalContext.DatabaseContext.GenrePresets
                                .Include(gp => gp.Values)
                                .Where(gp => gp.UserGuid == user.Guid)
                                .ToListAsync();
        }

        public async Task UpdatePresetsForUser(User user, List<GenrePreset> incomingGenrePresets)
        {
            List<GenrePreset> existingPresets = await GetGenrePresetsForUser(user);

            foreach (GenrePreset presetToUpdate in existingPresets)
            {
                GenrePreset incomingPreset = incomingGenrePresets.First(p => p.GenreName == presetToUpdate.GenreName);

                presetToUpdate.UserGuid = incomingPreset.UserGuid;
                presetToUpdate.GenreName = incomingPreset.GenreName;
                for (int i = 0; i < presetToUpdate.Values.Count; i++)
                {
                    presetToUpdate.Values[i].Gain = incomingPreset.Values[i].Gain;
                }

                dalContext.DatabaseContext.GenrePresets.Update(presetToUpdate);
            }

            await dalContext.DatabaseContext.SaveChangesAsync();
        }
        #endregion Methods
    }
}