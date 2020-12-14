using System.ComponentModel.DataAnnotations;

namespace DoppelkopfApi.Models.Users
{
    public class RegisterModel
    {
        public string FirstName { get; set; }

        public string LastName { get; set; }

        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }

        public bool EditUser { get; set; }

        public bool EditTables { get; set; }
    }
}