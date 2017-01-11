using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Infrastructure;
using MMU.Angular2Template.Infrastructure.Signalr.Interfaces;
using MMU.Angular2Template.Infrastructure.Signalr.Models;

namespace MMU.Angular2Template.Infrastructure.Signalr.Hubs
{
    /// <summary>
    /// This class is used as proxy for the Server- and Client-Side
    /// The Implementation of ISignalrHub defines the Server-side
    /// </summary>
    public abstract class SignalrHubBase : Hub, ISignalrHub
    {
        private const string ADMIN_CHANNEL = "AdminChannel";

        public override Task OnConnected()
        {
            var ev = new ChannelEvent
            {
                ChannelName = ADMIN_CHANNEL,
                Name = "user.connected",
                Data = new
                {
                    Context.ConnectionId,
                }
            };

            Publish(ev);

            return base.OnConnected();
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            var ev = new ChannelEvent
            {
                ChannelName = ADMIN_CHANNEL,
                Name = "user.disconnected",
                Data = new
                {
                    Context.ConnectionId,
                }
            };

            Publish(ev);

            return base.OnDisconnected(stopCalled);
        }

        public Task Publish(ChannelEvent channelEvent)
        {
            Clients.Group(channelEvent.ChannelName).OnEvent(channelEvent.ChannelName, channelEvent);

            if (channelEvent.ChannelName != ADMIN_CHANNEL)
            {
                // Push this out on the admin channel
                Clients.Group(ADMIN_CHANNEL).OnEvent(ADMIN_CHANNEL, channelEvent);
            }

            return Task.FromResult(0);
        }

        public async Task Subscribe(string channel)
        {
            await Groups.Add(Context.ConnectionId, channel);

            var ev = new ChannelEvent
            {
                ChannelName = ADMIN_CHANNEL,
                Name = "user.subscribed",
                Data = new
                {
                    Context.ConnectionId,
                    ChannelName = channel
                }
            };

            await Publish(ev);
        }

        public async Task Unsubscribe(string channel)
        {
            await Groups.Remove(Context.ConnectionId, channel);

            var ev = new ChannelEvent
            {
                ChannelName = ADMIN_CHANNEL,
                Name = "user.unsubscribed",
                Data = new
                {
                    Context.ConnectionId,
                    ChannelName = channel
                }
            };

            await Publish(ev);
        }

        public void PublishEventToChannel(string channelName, string eventName, object message)
        {
            
            //Context.Clients.Group(SIGNALR_CHANNEL_NAME).OnEvent(SIGNALR_CHANNEL_NAME, fl);
        }
    }
}