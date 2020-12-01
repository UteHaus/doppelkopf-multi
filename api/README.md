# aspnet-core-3-registration-login-api

ASP.NET Core 3.1 - Simple API for User Management, Authentication and Registration

For documentation and instructions check out https://jasonwatmore.com/post/2019/10/14/aspnet-core-3-simple-api-for-authentication-registration-and-user-management


## Development

### Databse Entity Framework

- SQLite EF Core Migrations:
`dotnet ef migrations add InitialCreate --context DataContext --output-dir Migrations/NpsqlMigrations`

- Create Databse with Context: `dotnet ef migrations add InitialCreate --context DataContext`

- update Databes with context:  `dotnet ef database update --context DataContext`
- remove last megration with context:  `dotnet ef migrations remove --context DataContext`


### Authen singalr 
https://docs.microsoft.com/de-de/aspnet/core/signalr/authn-and-authz?view=aspnetcore-5.0#use-claims-to-customize-identity-handling