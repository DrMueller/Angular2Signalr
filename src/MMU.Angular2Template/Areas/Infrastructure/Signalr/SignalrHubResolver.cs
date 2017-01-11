using Microsoft.AspNetCore.SignalR.Infrastructure;
using MMU.Angular2Template.Infrastructure.Signalr.Hubs;
using MMU.Angular2Template.Infrastructure.Signalr.Interfaces;

namespace MMU.Angular2Template.Infrastructure.Signalr
{
    public class SignalrHubResolver
    {
        private readonly IConnectionManager _connectionManager;

        public SignalrHubResolver(IConnectionManager connectionManager)
        {
            _connectionManager = connectionManager;
        }

        internal ISignalrHub ResolveDefault()
        {
            var defaultSignalrHubName = nameof(DefaultSignalrHub);
            return ResolveByName(defaultSignalrHubName);
        }

        private ISignalrHub ResolveByName(string signalrHubName)
        {
            var hub = _connectionManager.GetHubContext(signalrHubName);
            var signalrHub = hub as ISignalrHub;
            return signalrHub;
        }
    }
}