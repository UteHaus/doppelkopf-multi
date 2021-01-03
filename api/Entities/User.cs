using System.ComponentModel.DataAnnotations;
namespace DoppelkopfApi.Entities
{
    public class User
    {

        public User() { }
        [Key]
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }

        public string Icon { get; set; }
        public bool Admin { get; set; }

        public bool EditUser { get; set; }

        public bool EditTables { get; set; }

        public string LanguageKey { get; set; }
    }
}