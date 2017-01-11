using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Microsoft.Extensions.DependencyInjection;
using MMU.Angular2Template.Infrastructure.Signalr.Interfaces;

namespace MMU.Angular2Template.Infrastructure.Signalr
{
    public static class SignalrRegistration
    {
        public static void RegisterServices(IServiceCollection serviceCollection)
        {
            var signalrHubType = typeof(ISignalrHub);
            var registerableSignalrHubType = GetRegisterableSignalrHubTypes();

            foreach (var regType in registerableSignalrHubType)
            {
                serviceCollection.AddSingleton(signalrHubType, regType);
            }
        }

        private static IEnumerable<Type> GetRegisterableSignalrHubTypes()
        {
            var currentAssembly = typeof(SignalrRegistration).GetTypeInfo().Assembly;
            var targetTypeInfo = typeof(ISignalrHub).GetTypeInfo();
            var allCreatableTypes = currentAssembly.GetTypes().Where(f => targetTypeInfo.IsAssignableFrom(f.GetTypeInfo()) && !f.GetTypeInfo().IsAbstract && !f.GetTypeInfo().IsInterface);
            return allCreatableTypes;
        }
    }
}