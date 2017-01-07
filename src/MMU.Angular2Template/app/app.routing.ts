import { Routes, RouterModule } from "@angular/router";

import * as feature1 from "./feature1/index";


const appRoutes: Routes = [
    //{
    //    path: "feature1",
    //    component: feature1.Feature1Component
    //},
    {
        path: "",
        redirectTo: "/feature1",
        pathMatch: "full"
    }
];

export const appRoutingProviders: any[] = [];
export const routing = RouterModule.forRoot(appRoutes);