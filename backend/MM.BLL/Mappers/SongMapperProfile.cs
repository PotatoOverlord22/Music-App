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
            CreateMap<FileMetadata, Song>();
            CreateMap<Song, FileMetadata>();

            CreateMap<IFormFile, FileMetadata>()
                .ForMember(dest => dest.ContentType, opt => opt.MapFrom(src => src.ContentType))
                .ForMember(dest => dest.FileName, opt => opt.MapFrom(src => src.FileName));
        }
    }
}