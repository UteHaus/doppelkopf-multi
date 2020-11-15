# aspnet-core-3-registration-login-api

ASP.NET Core 3.1 - Simple API for User Management, Authentication and Registration

For documentation and instructions check out https://jasonwatmore.com/post/2019/10/14/aspnet-core-3-simple-api-for-authentication-registration-and-user-management


## Development

### Databse Entity Framework

- SQLite EF Core Migrations:
`dotnet ef migrations add InitialCreate --context SqliteDataContext --output-dir Migrations/SqliteMigrations`

- Create Databse with Context: `dotnet ef migrations add InitialCreate --context SqliteDataContext `

- update Databes with context:  `dotnet ef database update --context SqliteDataContext `
- remove last megration with context:  `dotnet ef migrations remove --context SqliteDataContext `
