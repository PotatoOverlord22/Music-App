namespace MM.DAL.Context
{
    public class DALContext : IDisposable
    {
        #region Members
        private Lazy<DatabaseContext> databaseContext;

        private Lazy<UserDAL> userDAL;
        #endregion Members

        #region Constructor
        public DALContext()
        {
            databaseContext = new Lazy<DatabaseContext>(() => new DatabaseContext());
            userDAL = new Lazy<UserDAL>(() => new UserDAL(databaseContext.Value));
        }
        #endregion Constructor

        #region Properties
        public DatabaseContext DatabaseContext => databaseContext.Value;

        public UserDAL UserDAL => userDAL.Value;
        #endregion Properties

        #region Methods
        private void Dispose(bool shouldDispose)
        {
            if (!shouldDispose)
            {
                return;
            }

            if (databaseContext.IsValueCreated)
            {
                databaseContext = null;
            }

            if (userDAL.IsValueCreated)
            {
                userDAL = null;
            }
        }
        #endregion Methods

        #region IDisposable Implementation
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
        #endregion IDisposable Implementation

        #region Destructor
        ~DALContext() => Dispose(false);
        #endregion Destructor
    }
}
