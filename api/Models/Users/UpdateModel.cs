using System.Buffers.Text;
namespace DoppelkopfApi.Models.Users
{
    public class UpdateModel
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Icon { get; set; }

        public int AutoCounter { get; set; }

        public bool Admin { get; set; }

        public bool EditUser { get; set; }

        public bool EditTables { get; set; }

        public string LanguageKey { get; set; }


    }
}