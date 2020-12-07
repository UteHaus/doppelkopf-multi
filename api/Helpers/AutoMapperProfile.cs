using AutoMapper;
using DoppelkopfApi.Entities;
using DoppelkopfApi.Models.Users;
using DoppelkopfApi.Models.PlayTable;

namespace DoppelkopfApi.Helpers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<User, UserModel>();
            CreateMap<RegisterModel, User>();
            CreateMap<UpdateModel, User>();
            CreateMap<PlayTableModel, PlayTable>();
            CreateMap<PlayTable, PlayTableModel>();
            CreateMap<PlayTable, PlayTableCountModel>();
            CreateMap<PlayTable, PlayerStateModel>();
            CreateMap<TablePlayer, PlayerStateModel>();
            CreateMap<TablePlayer, PlayTableStaeModel>();
            CreateMap<PlayTableStaeModel, PlayerStateModel>();
            CreateMap<PlayTable, PlayTableStaeModel>();
        }
    }
}