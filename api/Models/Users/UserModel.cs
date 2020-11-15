namespace DoppelkopfApi.Models.Users
{
    public class UserModel
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }

        public bool Admin { get; set; }
        public string Icon { get; set; }
    }
}