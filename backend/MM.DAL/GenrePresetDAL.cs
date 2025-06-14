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

        public async Task<List<GenrePreset>> GetGenrePresetsByUserAuth0Id(string auth0Id)
        {
            return await dalContext.DatabaseContext.GenrePresets
                        .Include(gp => gp.Values)
                        .Include(gp => gp.User)
                        .Where(gp => gp.User.Auth0Id == auth0Id)
                        .ToListAsync();
        }
        #endregion Methods
    }
}