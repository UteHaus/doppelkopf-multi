using System.ComponentModel.DataAnnotations;

namespace DoppelkopfApi.Entities
{
    public class TableViewer
    {
        [Key]
        public int Id { get; set; }

        public int tableId { get; set; }
        public int userId { get; set; }

    }
}