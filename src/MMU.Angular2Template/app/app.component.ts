import { Component } from "@angular/core";
import "./shared/rxjs-extensions";

@Component({
    moduleId: module.id,
    selector: "app",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent {
    title = "Template-App";
}