using api.Database;
using DoppelkopfApi.Helpers;
using DoppelkopfApi.Hubs;
using DoppelkopfApi.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;



var builder = WebApplication.CreateSlimBuilder(args);

builder.Services.ConfigureHttpJsonOptions(options =>
{
   // options.SerializerOptions.TypeInfoResolverChain.Insert(0,  AppJsonSerializerContext.Default);
    options.SerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

ConfigureServices(builder.Services,builder.Configuration);

var app = builder.Build();
app.MapControllers();
app.MapHub<TableHub>("/api/hub/playtable");
app.UseRouting();
// global cors policy
app.UseCors("signalr");
app.UseAuthentication();
app.UseAuthorization();

var scope = app.Services.CreateScope();

var dataContext= scope.ServiceProvider.GetService<DataContext>();
dataContext.Database.Migrate();
CreateDefaultUser(dataContext);

app.Run();

void ConfigureServices(IServiceCollection services, IConfiguration configuration)
{
    var connectionString = NpgsqlUtil.buildConnectionString(configuration);
    var envVar = Environment.GetEnvironmentVariable("POSTGRES_DB");
    services.AddDbContext<DataContext>(options => options.UseNpgsql(connectionString));

    services
        .AddCors(options =>
        {
            options.AddPolicy("CorsPolicy",
                builder => builder
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader()
                );

            options.AddPolicy("signalr",
                builder => builder
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials()
                .SetIsOriginAllowed(hostName => true));
        });

    services.AddSignalR().AddJsonProtocol(options =>
          {
              options.PayloadSerializerOptions.Converters
                 .Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
          });

    services.AddSingleton<IUserIdProvider, NameUserIdProvider>();
    services.AddControllers();
    builder.Services.AddAutoMapper(typeof(Program).Assembly);
    services.AddControllers().AddJsonOptions(o =>
 {
     o.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
     o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());

 });


    // configure strongly typed settings objects
    var appSettingsSection = configuration.GetSection("AppSettings");
    services.Configure<AppSettings>(appSettingsSection);

    // configure jwt authentication
    var appSettings = appSettingsSection.Get<AppSettings>();
    var key = Encoding.ASCII.GetBytes(appSettings.Secret);

    services.AddAuthentication(x =>
    {
        x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        x.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(option =>
    {
        option.Events = new JwtBearerEvents
        {
            OnTokenValidated = OnTokenValidated,
            OnMessageReceived = OnMessageReceived,

        };
        option.RequireHttpsMetadata = false;
        option.SaveToken = true;
        option.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });


    services.AddScoped<ITableEventService, TableEventService>();
    services.AddScoped<IUserService, UserService>();
    services.AddScoped<IPlayTableService, PlayTableService>();
    services.AddScoped<ILoggerService, LoggerService>();
}


Task OnTokenValidated(TokenValidatedContext context)
{
    var userService = context.HttpContext.RequestServices.GetRequiredService<IUserService>();
    var userId = int.Parse(context.Principal.Identity.Name);
    var user = userService.GetById(userId);
    if (user == null)
    {
        // return unauthorized if user no longer exists
        context.Fail("Unauthorized");
    }
    return Task.CompletedTask;
}

Task OnMessageReceived(MessageReceivedContext context)
{
    var accessToken = context.Request.Query["access_token"];

    // If the request is for our hub...
    var path = context.HttpContext.Request.Path;
    if (!string.IsNullOrEmpty(accessToken) &&
        (path.StartsWithSegments("/api/hub/playtable")))
    {
        // Read the token out of the query string
        context.Token = accessToken;
    }
    return Task.CompletedTask;
}

void CreateDefaultUser(DataContext dataContext)
{
    new UserService(dataContext).CreateDefaultUser();
}