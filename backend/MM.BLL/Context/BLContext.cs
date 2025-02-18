using NLog;

namespace MM.BLL.Context
{
    public class BLContext : IDisposable
    {
        #region Members
        private Lazy<Logger> _logger;
        private Lazy<MusicBL> _musicBL;
        #endregion Members

        #region Constructor
        public BLContext()
        {
            _logger = new Lazy<Logger>(() => LogManager.GetCurrentClassLogger());
            _musicBL = new Lazy<MusicBL>(() => new MusicBL(this));
        }
        #endregion Constructor

        #region Properties
        public Logger Logger => _logger.Value;
        public MusicBL MusicBL => _musicBL.Value;
        #endregion Properties

        #region Methods
        private void Dispose(bool shouldDispose)
        {
            if (!shouldDispose)
            {
                return;
            }

            if (_logger.IsValueCreated)
            {
                _logger = null;
            }

            if (_musicBL.IsValueCreated)
            {
                _musicBL = null;
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