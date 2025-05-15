namespace MM.DAL.Context
{
    public class DALObject
    {
        #region Members
        protected DatabaseContext databaseContext;
        #endregion Members

        #region Constructor
        public DALObject(DatabaseContext dbContext)
        {
            databaseContext = dbContext;
        }
        #endregion Constructor
    }
}