import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";

import * as c from "./index";
import { feature1Routing } from "./feature1.routing";

import * as services from "./shared/services/index";

import * as signalr from "../shared/signalr/index";

let channelConfig = new signalr.ChannelConfig();
channelConfig.url = "http://localhost:13173/signalr";
channelConfig.hubName = "ChannelHub"; // This name has to match the Type-Name on the Server-Class

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        feature1Routing
    ],
    declarations: [
        c.Part1Component,
        c.Part1ListComponent,
        c.Feature1Component,
        c.SignalrTestComponent
    ],
    providers: [
        services.HelloWorldService,
        { provide: signalr.SignalrWindow, useValue: window },
        { provide: "channel.config", useValue: channelConfig },
        services.SignalrTestService
    ]
})

export class Feature1Module {
}