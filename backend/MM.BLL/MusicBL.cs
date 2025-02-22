using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MM.BLL.Context;
using MM.BLL.Mappers;
using MM.Library.Models;

namespace MM.BLL
{
    public class MusicBL : BLObject
    {
        #region Constructor
        public MusicBL(BLContext bLContext) : base(bLContext)
        {
        }
        #endregion Constructor

        #region Methods
        public byte[] TransformSong(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                LogAndThrowValidationException("No file received");
            }

            try
            {
                MemoryStream memoryStream = new MemoryStream();
                file.CopyTo(memoryStream);
                return memoryStream.ToArray();
            }
            catch (Exception ex)
            {
                LogAndThrowError(ex, "Error transforming song");
                return null;
            }
        }

        protected override void ConfigureMapper()
        {
            MapperConfiguration mapperConfig = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<SongMapperProfile>();
            });

            _mapper = mapperConfig.CreateMapper();
        }
        #endregion Methods
    }
}