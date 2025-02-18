using AutoMapper;
using Microsoft.AspNetCore.Http;
using MM.DAL.Models;
using MM.Library.Models;

namespace MM.BLL.Mappers
{
    public class SongMapperProfile : Profile
    {
        public SongMapperProfile()
        {
            CreateMap<SongDTO, Song>();
            CreateMap<Song, SongDTO>();

            CreateMap<IFormFile, SongDTO>()
                .ForMember(dest => dest.Content, opt => opt.MapFrom(src => ConvertToByteArray(src)))
                .ForMember(dest => dest.ContentType, opt => opt.MapFrom(src => src.ContentType))
                .ForMember(dest => dest.FileName, opt => opt.MapFrom(src => src.FileName));
        }

        private byte[] ConvertToByteArray(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return null;
            }

            using (var memoryStream = new MemoryStream())
            {
                file.CopyTo(memoryStream);
                return memoryStream.ToArray();
            }
        }
    }
}