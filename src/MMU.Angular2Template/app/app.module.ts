import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { routing, appRoutingProviders } from "./app.routing";

import { Feature1Module } from "./feature1/feature1.module"; 

import * as http from "./shared/http/index";
import * as signalr from "./shared/signalr/index";

import * as coreServices from "./core/services/index";

@NgModule({
    imports: [
        BrowserModule,
        routing,
        Feature1Module
    ],
    declarations: [
        AppComponent
    ],
    providers: [
        appRoutingProviders,
        http.HttpService,
        signalr.ChannelService,
        { provide: coreServices.WindowWrapperService, useValue: window },
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}