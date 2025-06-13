namespace MM.DAL.Context
{
    public class DALContext : IDisposable
    {
        #region Members
        private Lazy<DatabaseContext> databaseContext;

        private Lazy<UserDAL> userDAL;

        private Lazy<UserStatsDAL> userStatsDAL;

        private Lazy<GenrePresetDAL> genrePresetDAL;

        private Lazy<GenrePresetValueDAL> genrePresetValueDAL;
        #endregion Members

        #region Constructor
        public DALContext()
        {
            databaseContext = new Lazy<DatabaseContext>(() => new DatabaseContext());
            userDAL = new Lazy<UserDAL>(() => new UserDAL(this));
            userStatsDAL = new Lazy<UserStatsDAL>(() => new UserStatsDAL(this));
            genrePresetDAL = new Lazy<GenrePresetDAL>(() => new GenrePresetDAL(this));
            genrePresetValueDAL = new Lazy<GenrePresetValueDAL>(() => new GenrePresetValueDAL(this));
        }
        #endregion Constructor

        #region Properties
        public DatabaseContext DatabaseContext => databaseContext.Value;

        public UserDAL UserDAL => userDAL.Value;

        public UserStatsDAL UserStatsDAL => userStatsDAL.Value;

        public GenrePresetDAL GenrePresetDAL => genrePresetDAL.Value;

        public GenrePresetValueDAL GenrePresetValueDAL => genrePresetValueDAL.Value;
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

            if (userStatsDAL.IsValueCreated)
            {
                userStatsDAL = null;
            }

            if (genrePresetDAL.IsValueCreated)
            {
                genrePresetDAL = null;
            }

            if (genrePresetValueDAL.IsValueCreated)
            {
                genrePresetValueDAL = null;
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
