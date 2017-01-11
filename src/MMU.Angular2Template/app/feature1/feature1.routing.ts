import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import * as current from "./index";

const feature1Routes: Routes = [
    {
        path: "feature1",
        component: current.Feature1Component,
        children: [
            { path: "", redirectTo: "part1list", pathMatch: "full" },
            { path: "part1", component: current.Part1Component },
            { path: "part1list", component: current.Part1ListComponent },
            { path: "signalr-test", component: current.SignalrTestComponent }
        ]
    }
];

export const feature1Routing = RouterModule.forChild(feature1Routes);