using Microsoft.AspNetCore.SignalR;

namespace DoppelkopfApi.Helpers
{
    public class NameUserIdProvider : IUserIdProvider
    {
        public string GetUserId(HubConnectionContext connection)
        {
            return connection.User?.Identity?.Name;
        }
    }
}