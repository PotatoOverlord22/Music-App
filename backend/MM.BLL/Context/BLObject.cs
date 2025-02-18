using AutoMapper;

namespace MM.BLL.Context
{
    public abstract class BLObject
    {
        #region Members
        protected IMapper _mapper;
        protected BLContext _bLContext;
        #endregion Members

        #region Constructor
        public BLObject(BLContext bLContext)
        {
            ConfigureMapper();
            this._bLContext = bLContext;
        }
        #endregion Constructor

        #region Methods
        protected abstract void ConfigureMapper();

        protected void LogAndThrowValidationException(string message, string? exceptionMessage = null)
        {
            _bLContext.Logger.Warn(message);
            throw new Exception(exceptionMessage ?? message);
        }

        protected void LogAndThrowError(Exception ex, string message, string? exceptionMessage = null)
        {
            _bLContext.Logger.Error(ex, message);
            throw new Exception(exceptionMessage ?? message);
        }
        #endregion Methods
    }
}