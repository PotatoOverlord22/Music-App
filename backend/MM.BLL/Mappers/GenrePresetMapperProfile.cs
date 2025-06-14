using AutoMapper;
using MM.DAL.Models;
using MM.Library.Models;

namespace MM.BLL.Mappers
{
    public class GenrePresetMapperProfile : Profile
    {
        public GenrePresetMapperProfile()
        {
            CreateMap<GenrePreset, GenrePresetDTO>()
                .ForMember(dest => dest.Id,
                           opt => opt.MapFrom(src => src.Guid))
                .ForMember(dest => dest.Genre,
                           opt => opt.MapFrom(src => src.GenreName.ToLower()))
                .ForMember(dest => dest.Name,
                           opt => opt.MapFrom(src =>
                               src.GenreName.Length > 0
                               ? Char.ToUpperInvariant(src.GenreName[0]) + src.GenreName.Substring(1)
                               : string.Empty))
                .ForMember(dest => dest.Bands,
                           opt => opt.MapFrom(src =>
                               src.Values.OrderBy(v => v.BandIndex)
                                         .Select(v => v.Gain)
                                         .ToArray()));

            CreateMap<GenrePresetDTO, GenrePreset>()
                .ForMember(dest => dest.Guid,
                           opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Guid,
                           opt => opt.MapFrom(_ => Guid.NewGuid()))
                .ForMember(dest => dest.GenreName,
                           opt => opt.MapFrom(src => src.Genre))
                .ForMember(dest => dest.Values,
                           opt => opt.MapFrom((src, dest) =>
                           {
                               var values = new List<GenrePresetValue>();
                               for (int i = 0; i < src.Bands.Length; i++)
                               {
                                   values.Add(new GenrePresetValue
                                   {
                                       Guid = Guid.NewGuid(),
                                       BandIndex = i,
                                       Gain = src.Bands[i],
                                   });
                               }
                               return values;
                           }))
                .ForMember(dest => dest.UserGuid, opt => opt.Ignore())
                .ForMember(dest => dest.User, opt => opt.Ignore());
        }
    }
}
