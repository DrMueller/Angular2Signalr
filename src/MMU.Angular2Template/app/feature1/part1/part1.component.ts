import { Component, OnInit, Input } from "@angular/core";
import * as models from "../shared/models/index";

@Component({
    moduleId: module.id,
    templateUrl: "./part1.component.html",
    selector: "part1"
})

export class Part1Component {
    private name: string;

    @Input()
    public helloWorld: models.HelloWorld;

    constructor() {
        this.name = "Part 1";
    }
}