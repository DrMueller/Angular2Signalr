using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using MMU.Angular2Template.Areas.Feature1.Models;

namespace MMU.Angular2Template.Areas.Feature1.Controllers
{
    [Route("api/[controller]")]
    public class HelloWorldController : Controller
    {
        [HttpGet("exception")]
        public IEnumerable<HelloWorld> Exception()
        {
            throw new Exception("Hello Exception.");
        }

        [HttpGet("helloWorlds")]
        public IEnumerable<HelloWorld> HelloWorlds()
        {
            return new[]
            {
                new HelloWorld
                {
                    GreetedPersons = 1,
                    GreetingsDate = DateTime.Now,
                    GreetingsMessage = "Greetings, traveller"
                },
                new HelloWorld
                {
                    GreetedPersons = 1000,
                    GreetingsDate = new DateTime(1986, 12, 29),
                    GreetingsMessage = "Happy birthday"
                },
                new HelloWorld
                {
                    GreetedPersons = 33333,
                    GreetingsDate = new DateTime(2017, 01, 01),
                    GreetingsMessage = "Happy new year"
                }
            };
        }
    }
}