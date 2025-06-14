using AutoMapper;
using System.Security.Claims;

namespace MM.BLL.Context
{
    public abstract class BLObject
    {
        #region Members
        protected IMapper mapper;
        protected BLContext blContext;
        #endregion Members

        #region Constructor
        public BLObject(BLContext bLContext)
        {
            ConfigureMapper();
            this.blContext = bLContext;
        }
        #endregion Constructor

        #region Methods
        protected virtual void ConfigureMapper()
        {
            return;
        }

        protected void LogAndThrowValidationException(string message, string? exceptionMessage = null)
        {
            blContext.Logger.Warn(message);
            throw new Exception(exceptionMessage ?? message);
        }

        protected void LogAndThrowError(Exception ex, string message, string? exceptionMessage = null)
        {
            blContext.Logger.Error(ex, message);
            throw new Exception(exceptionMessage ?? message);
        }

        protected string? GetCurrentUserAuth0Id()
        {
            return blContext.HttpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        }
        #endregion Methods
    }
}