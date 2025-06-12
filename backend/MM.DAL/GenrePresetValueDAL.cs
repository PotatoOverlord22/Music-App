using MM.DAL.Context;
using MM.DAL.Models;

namespace MM.DAL
{
    public class GenrePresetValueDAL : DALObject
    {
        #region Constructors
        public GenrePresetValueDAL(DatabaseContext dbContext) : base(dbContext) { }
        #endregion Constructors

        #region Methods
        public async Task<List<GenrePresetValue>> AddBulk(List<GenrePresetValue> genrePresetValues)
        {
            if (genrePresetValues == null || !genrePresetValues.Any())
            {
                throw new ArgumentException("The list of genre preset values cannot be null or empty.", nameof(genrePresetValues));
            }

            databaseContext.GenrePresetValues.AddRange(genrePresetValues);
            await databaseContext.SaveChangesAsync();
            return genrePresetValues;
        }
        #endregion Methods
    }
}