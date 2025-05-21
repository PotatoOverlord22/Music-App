using AutoMapper;
using MM.DAL.Models;
using MM.Library.Models;

namespace MM.BLL.Mappers
{
    public class UserStatsMapperProfile : Profile
    {
        public UserStatsMapperProfile()
        {
            CreateMap<UserStats, UserStatsDTO>()
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserGuid))
                .ForMember(dest => dest.TransformedWithoutContext, opt => opt.MapFrom(src => src.TransformedSongs))
                .ForMember(dest => dest.TransformedWithContext, opt => opt.MapFrom(src => src.TransformedSongsWithContext));
            CreateMap<UserStatsDTO, UserStats>()
                .ForMember(dest => dest.UserGuid, opt => opt.MapFrom(src => src.UserId))
                .ForMember(dest => dest.TransformedSongs, opt => opt.MapFrom(src => src.TransformedWithoutContext))
                .ForMember(dest => dest.TransformedSongsWithContext, opt => opt.MapFrom(src => src.TransformedWithContext));
        }
    }
}
