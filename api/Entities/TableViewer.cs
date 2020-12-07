using System.ComponentModel.DataAnnotations;

namespace DoppelkopfApi.Entities
{
    public class TableViewer
    {

        public TableViewer() { }
        public TableViewer(int userId, int tableId)
        {
            this.tableId = tableId;
            this.userId = userId;
        }

        [Key]
        public int Id { get; set; }

        public int tableId { get; set; }
        public int userId { get; set; }

    }
}