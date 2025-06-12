using MM.DAL.Context;
using MM.DAL.Models;

namespace MM.DAL
{
    public class GenrePresetDAL : DALObject
    {
        #region Constructors
        public GenrePresetDAL(DatabaseContext dbContext) : base(dbContext) { }
        #endregion Constructors

        #region Methods
        public async Task<GenrePreset> Add(GenrePreset genrePreset)
        {
            databaseContext.GenrePresets.Add(genrePreset);
            await databaseContext.SaveChangesAsync();
            return genrePreset;
        }
        #endregion Methods
    }
}