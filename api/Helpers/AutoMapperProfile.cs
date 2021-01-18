using AutoMapper;
using DoppelkopfApi.Entities;
using DoppelkopfApi.Models.Users;
using DoppelkopfApi.Models.PlayTable;
using DoppelkopfApi.Models;

namespace DoppelkopfApi.Helpers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<User, UserModel>();
            CreateMap<User, UserTokenModel>();
            CreateMap<RegisterModel, User>();
            CreateMap<UpdateModel, User>();
            CreateMap<PlayTableModel, PlayTable>();
            CreateMap<PlayTable, PlayTableModel>();
            CreateMap<PlayTable, PlayTableCountModel>();
            CreateMap<TablePlayer, PlayTableStaeModel>();
            CreateMap<PlayTable, PlayTableStaeModel>();
            CreateMap<TableViewer, ViewWerModel>();
            CreateMap<LogInterfaceModel, LogInterface>();
        }
    }
}