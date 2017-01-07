import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { routing, appRoutingProviders } from "./app.routing";

import { Feature1Module } from "./feature1/feature1.module"; 

import * as sharedServices from "./shared/services/index";

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
        sharedServices.HttpService
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}