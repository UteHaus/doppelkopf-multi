using System.Collections.Generic;

namespace DoppelkopfApi.Hubs
{

    public class HubConnections
    {
        /// <summary>
        /// Key as userId and value as connection id.
        /// </summary>
        private Dictionary<string, string> _connections;

        public HubConnections()
        {
            _connections = new Dictionary<string, string>();
        }

        public void SetConnection(string userId, string connectionId)
        {
            if (_connections.ContainsKey(userId))
                _connections[userId] = connectionId;
            else
                _connections.Add(userId, connectionId);

        }

        public string GetConnection(string userId)
        {
            return _connections.ContainsKey(userId) ? _connections[userId] : "";
        }

    }
}