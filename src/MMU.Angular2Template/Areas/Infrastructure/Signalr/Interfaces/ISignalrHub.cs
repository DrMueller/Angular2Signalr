namespace MMU.Angular2Template.Infrastructure.Signalr.Interfaces
{
    public interface ISignalrHub
    {
        void PublishEventToChannel(string channelName, string eventName, object message);
    }
}