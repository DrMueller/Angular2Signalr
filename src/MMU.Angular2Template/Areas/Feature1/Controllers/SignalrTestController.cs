using System.Threading;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Infrastructure;
using MMU.Angular2Template.Infrastructure.Signalr.Models;

namespace MMU.Angular2Template.Areas.Feature1.Controllers
{
    [Route("api/[controller]")]
    public class SignalrTestController : Controller
    {
        private const string SIGNALR_CHANNEL_NAME = "Test2";
        private readonly IHubContext _hubContext;

        public SignalrTestController(IConnectionManager connectionManager)
        {
            _hubContext = connectionManager.GetHubContext<Infrastructure.Signalr.Hubs.ChannelHub>();
        }

        [HttpPost("publishSomeSignalr")]
        public void PublishSomeSignalr()
        {
            for (int i = 0; i <= 100; i++)
            {
                PublishEvent("Test", "Hello World: " + i);
                Thread.Sleep(200);
            }
        }

        private void PublishEvent(string eventName, string msg)
        {
            // From .NET code like this we can't invoke the methods that
            // exist on our actual Hub class...because we only have a proxy
            // to it. So to publish the event we need to call the method that
            // the clients will be listening on.

            _hubContext.Clients.Group(SIGNALR_CHANNEL_NAME).OnEvent(SIGNALR_CHANNEL_NAME, new ChannelEvent
            {
                ChannelName = SIGNALR_CHANNEL_NAME,
                Name = eventName,
                Data = msg
            });
        }
    }
}