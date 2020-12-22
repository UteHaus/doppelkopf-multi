using DoppelkopfApi.Enums;

namespace DoppelkopfApi.Models.PlayTable
{
    public class UserUseCaseModel
    {

        public UserUseCaseModel(int tableId, UseCase useCase)
        {
            TableId = tableId;
            UseCase = useCase;
        }

        public UseCase UseCase { get; set; }
        public int TableId { get; set; }
    }


}