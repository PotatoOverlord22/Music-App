using MM.DAL.Context;
using MM.DAL.Models;

namespace MM.DAL
{
    public class GenrePresetValueDAL : DALObject
    {
        #region Constructors
        public GenrePresetValueDAL(DALContext dalContext) : base(dalContext) { }
        #endregion Constructors

        #region Methods
        public async Task<List<GenrePresetValue>> AddBulk(List<GenrePresetValue> genrePresetValues)
        {
            if (genrePresetValues == null || !genrePresetValues.Any())
            {
                throw new ArgumentException("The list of genre preset values cannot be null or empty.", nameof(genrePresetValues));
            }

            dalContext.DatabaseContext.GenrePresetValues.AddRange(genrePresetValues);
            await dalContext.DatabaseContext.SaveChangesAsync();
            return genrePresetValues;
        }
        #endregion Methods
    }
}