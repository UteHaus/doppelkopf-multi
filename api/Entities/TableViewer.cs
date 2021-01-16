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
            AsAdditionPlayer = false;
            SeePlayerCard = -1;
        }

        [Key]
        public int Id { get; set; }

        public int tableId { get; set; }
        public int userId { get; set; }

        public bool AsAdditionPlayer { get; set; }

        /// <summary>
        /// Define if the user can see of one player the cards.
        /// Default value is -1
        /// </summary>
        /// <value></value>
        public int SeePlayerCard { get; set; }

    }
}