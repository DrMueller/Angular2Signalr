import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";

import * as c from "./index";
import { feature1Routing } from "./feature1.routing";

import * as services from "./shared/services/index";


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
        c.Feature1Component
    ],
    providers: [
        services.HelloWorldService
    ]
})

export class Feature1Module {
}