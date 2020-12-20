using System;
using DoppelkopfApi.Entities;

namespace DoppelkopfApi.Models.PlayTable
{
    public class ViewWerModel
    {

        public int tableId { get; set; }
        public int userId { get; set; }

        public bool AsAdditionPlayer { get; set; }

        /// <summary>
        /// Define if the user can see of one player the cards
        /// </summary>
        /// <value></value>
        public int SeePlayerCard { get; set; }
    }
}