using MM.DAL.Context;
using MM.Library.Models;
using NLog;

namespace MM.BLL.Context
{
    public class BLContext : IDisposable
    {
        #region Members
        private Lazy<Logger> logger;

        private Lazy<DALContext> dalContext;

        private Lazy<MusicBL> musicBL;

        private Lazy<GeneralDataBL> generalDataBL;

        private Lazy<UserBL> userBL;
        #endregion Members

        #region Constructor
        public BLContext()
        {
            logger = new Lazy<Logger>(() => LogManager.GetCurrentClassLogger());
            dalContext = new Lazy<DALContext>(() => new DALContext());
            musicBL = new Lazy<MusicBL>(() => new MusicBL(this));
            generalDataBL = new Lazy<GeneralDataBL>(() => new GeneralDataBL(this));
            userBL = new Lazy<UserBL>(() => new UserBL(this));
        }
        #endregion Constructor

        #region Properties
        public Logger Logger => logger.Value;

        public DALContext DalContext => dalContext.Value;

        public MusicBL MusicBL => musicBL.Value;

        public GeneralDataBL GeneralDataBL => generalDataBL.Value;

        public UserBL UserBL => userBL.Value;
        #endregion Properties

        #region Methods
        private void Dispose(bool shouldDispose)
        {
            if (!shouldDispose)
            {
                return;
            }

            if (logger.IsValueCreated)
            {
                logger = null;
            }

            if (dalContext.IsValueCreated)
            {
                dalContext = null;
            }

            if (musicBL.IsValueCreated)
            {
                musicBL = null;
            }

            if (generalDataBL.IsValueCreated)
            {
                generalDataBL = null;
            }
           
            if (userBL.IsValueCreated)
            {
                userBL = null;
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
        ~BLContext() => Dispose(false);
        #endregion Destructor
    }
}