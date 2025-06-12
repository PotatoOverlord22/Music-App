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

        #region Methods
        public async Task<T> ExecuteInTransactionAsync<T>(Func<Task<T>> operation)
        {
            using var transaction = await databaseContext.Database.BeginTransactionAsync();
            try
            {
                T result = await operation();
                await transaction.CommitAsync();
                return result;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task ExecuteInTransactionAsync(Func<Task> operation)
        {
            using var transaction = await databaseContext.Database.BeginTransactionAsync();
            try
            {
                await operation();
                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
        #endregion Methods
    }
}