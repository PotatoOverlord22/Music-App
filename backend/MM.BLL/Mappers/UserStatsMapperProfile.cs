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
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserGuid));
            CreateMap<UserStatsDTO, UserStats>()
                .ForMember(dest => dest.UserGuid, opt => opt.MapFrom(src => src.UserId));
        }
    }
}
